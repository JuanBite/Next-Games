"use server";

import { PrismaClient } from '@/src/generated/prisma'
import { PrismaNeon } from "@prisma/adapter-neon";
import { revalidatePath } from "next/cache";
import { writeFile, unlink } from "fs/promises";
import path from "path";
import { z } from "zod";

// ================================================================
//  PRISMA CLIENT
// ================================================================

const prisma = new PrismaClient({
    adapter: new PrismaNeon({
        connectionString: process.env.DATABASE_URL!,
    }),
});

// ================================================================
//  ZOD SCHEMA
// ================================================================

const ConsoleSchema = z.object({
    name: z
        .string()
        .min(1, "Name is required")
        .max(100, "Name must be under 100 characters"),
    manufacturer: z
        .string()
        .min(1, "Manufacturer is required")
        .max(100, "Manufacturer must be under 100 characters"),
    releasedate: z
        .string()
        .min(1, "Release date is required")
        .refine((val) => !isNaN(Date.parse(val)), "Invalid date format"),
    description: z
        .string()
        .max(500, "Description must be under 500 characters")
        .optional(),
});

// ================================================================
//  TIPOS EXPORTADOS
// ================================================================

export type ConsoleActionState = {
    success: boolean;
    message?: string;
    errors?: Partial<Record<keyof z.infer<typeof ConsoleSchema> | "image", string>>;
    oldValues?: {
        name: string;
        manufacturer: string;
        releasedate: string;
        description: string;
    };
};

// ================================================================
//  HELPER — guardar imagen en /public/imgs/
// ================================================================

async function saveImage(
    file: File
): Promise<{ filename: string } | { error: string }> {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
        return { error: "Only JPG, PNG or WEBP images are allowed" };
    }
    if (file.size > 5 * 1024 * 1024) {
        return { error: "Image must be under 5MB" };
    }

    const filename = file.name;
    const destPath = path.join(process.cwd(), "public", "img", filename);

    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(destPath, buffer);
        return { filename };
    } catch {
        return { error: "Could not save image. Make sure /public/img/ exists." };
    }
}

// ================================================================
//  HELPER — reemplazar imagen (guarda la nueva y borra la anterior)
// ================================================================

async function replaceImage(
    file: File,
    oldFilename: string
): Promise<{ filename: string } | { error: string }> {
    const saveResult = await saveImage(file);
    if ("error" in saveResult) return saveResult;

    // ✅ "no-image.png" es el default de Consoles
    if (oldFilename && oldFilename !== "no-image.png" && oldFilename !== saveResult.filename) {
        const oldPath = path.join(process.cwd(), "public", "imgs", oldFilename);
        try {
            await unlink(oldPath);
        } catch {
            console.warn(`Could not delete old image: ${oldFilename}`);
        }
    }

    return saveResult;
}

// ================================================================
//  CREATE CONSOLE
// ================================================================

export async function createConsole(
    _prevState: ConsoleActionState,
    formData: FormData
): Promise<ConsoleActionState> {

    const rawValues = {
        name:        formData.get("name")        as string,
        manufacturer: formData.get("manufacturer") as string,
        releasedate: formData.get("releasedate")  as string,
        description: formData.get("description") as string,
    };

    const imageFile = formData.get("image") as File | null;
    const oldValues = { ...rawValues };

    // Validar imagen
    if (!imageFile || imageFile.size === 0) {
        return {
            success: false,
            errors: { image: "Console image is required" },
            oldValues,
        };
    }

    // Validar campos con Zod
    const parsed = ConsoleSchema.safeParse(rawValues);
    if (!parsed.success) {
        const errors: ConsoleActionState["errors"] = {};
        for (const issue of parsed.error.issues) {
            const field = issue.path[0] as keyof typeof errors;
            if (!errors[field]) errors[field] = issue.message;
        }
        return { success: false, errors, oldValues };
    }

    // Guardar imagen
    const imageResult = await saveImage(imageFile);
    if ("error" in imageResult) {
        return {
            success: false,
            errors: { image: imageResult.error },
            oldValues,
        };
    }

    // Crear registro en DB
    try {
        await prisma.console.create({
            data: {
                name:        parsed.data.name,
                manufacturer: parsed.data.manufacturer,
                releasedate: new Date(parsed.data.releasedate),
                description: parsed.data.description ?? "",
                image:       imageResult.filename,
            },
        });
    } catch (e: unknown) {
        if ((e as { code?: string })?.code === "P2002") {
            return {
                success: false,
                errors: { name: "A console with this name already exists" },
                oldValues,
            };
        }
        return {
            success: false,
            message: "Database error. Please try again.",
            oldValues,
        };
    }

    revalidatePath("/consoles");
    return { success: true, message: "Console added successfully!" };
}

// ================================================================
//  UPDATE CONSOLE
// ================================================================

export async function updateConsole(
    _prevState: ConsoleActionState,
    formData: FormData
): Promise<ConsoleActionState> {

    const id = parseInt(formData.get("id") as string);
    if (isNaN(id)) return { success: false, message: "Invalid console ID." };

    const rawValues = {
        name:         formData.get("name")         as string,
        manufacturer: formData.get("manufacturer") as string,
        releasedate:  formData.get("releasedate")  as string,
        description:  formData.get("description")  as string,
    };

    const imageFile = formData.get("image") as File | null;
    const oldValues = { ...rawValues };

    const parsed = ConsoleSchema.safeParse(rawValues);
    if (!parsed.success) {
        const errors: ConsoleActionState["errors"] = {};
        for (const issue of parsed.error.issues) {
            const field = issue.path[0] as keyof typeof errors;
            if (!errors[field]) errors[field] = issue.message;
        }
        return { success: false, errors, oldValues };
    }

    // Si subió nueva imagen la reemplazamos, si no mantenemos la actual
    let newImage: string | undefined;
    if (imageFile && imageFile.size > 0) {
        const currentConsole = await prisma.console.findUnique({
            where: { id },
            select: { image: true },
        });
        const imageResult = await replaceImage(
            imageFile,
            currentConsole?.image ?? "no-image.png"
        );
        if ("error" in imageResult) {
            return {
                success: false,
                errors: { image: imageResult.error },
                oldValues,
            };
        }
        newImage = imageResult.filename;
    }

    try {
        await prisma.console.update({
            where: { id },
            data: {
                name:         parsed.data.name,
                manufacturer: parsed.data.manufacturer,
                releasedate:  new Date(parsed.data.releasedate),
                description:  parsed.data.description ?? "",
                ...(newImage ? { image: newImage } : {}),
            },
        });
    } catch (e: unknown) {
        if ((e as { code?: string })?.code === "P2002") {
            return {
                success: false,
                errors: { name: "A console with this name already exists" },
                oldValues,
            };
        }
        return {
            success: false,
            message: "Database error. Please try again.",
            oldValues,
        };
    }

    revalidatePath("/consoles");
    return { success: true, message: "Console updated successfully!" };
}

// ================================================================ 
//  DELETE CONSOLE
// ================================================================

export async function deleteConsole(
    id: number
): Promise<{ success: boolean; message?: string }> {

    if (!id || isNaN(id)) {
        return { success: false, message: "Invalid console ID." };
    }

    try {
        const consoleRecord = await prisma.console.findUnique({ where: { id } });

        if (!consoleRecord) {
            return { success: false, message: "Console not found." };
        }

        await prisma.console.delete({ where: { id } });

        // ✅ "no-image.png" es el default de Consoles
        if (consoleRecord.image && consoleRecord.image !== "no-image.png") {
            const imagePath = path.join(process.cwd(), "public", "imgs", consoleRecord.image);
            try {
                await unlink(imagePath);
            } catch (err: unknown) {
                console.warn(`Could not delete image: ${consoleRecord.image}`, err);
            }
        }
    } catch (e: unknown) {
        if ((e as { code?: string })?.code === "P2025") {
            return { success: false, message: "Console not found." };
        }
        return { success: false, message: "Database error. Please try again." };
    }

    revalidatePath("/consoles");
    return { success: true };
}