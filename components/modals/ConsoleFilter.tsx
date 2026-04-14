"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Console {
    id: number;
    name: string;
}

export default function ConsoleFilter({ consoles }: { consoles: Console[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeConsoleId = searchParams.get("consoleId") ?? "";

    function handleClick(id: string) {
        const params = new URLSearchParams(searchParams.toString());

        if (activeConsoleId === id) {
            params.delete("consoleId"); // si clickeas el mismo, deselecciona
        } else {
            params.set("consoleId", id);
        }

        params.set("page", "1");
        router.push(`?${params.toString()}`);
    }

    return (
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => handleClick("")}
                className={`btn btn-sm rounded-full ${activeConsoleId === "" ? "btn-primary" : "btn-outline"}`}
            >
                All
            </button>
            {consoles.map((c) => (
                <button
                    key={c.id}
                    onClick={() => handleClick(String(c.id))}
                    className={`btn btn-sm rounded-full ${activeConsoleId === String(c.id) ? "btn-primary" : "btn-outline"}`}
                >
                    {c.name}
                </button>
            ))}
        </div>
    );
}