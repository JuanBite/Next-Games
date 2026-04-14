"use client";

import { useRouter, useSearchParams } from "next/navigation";

interface Console {
    id: number;
    name: string;
}

export default function ConsoleFilter({ consoles }: { consoles: Console[] }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeConsoleId = searchParams.get("console_id") ?? "";

    function handleClick(id: string) {
        const params = new URLSearchParams(searchParams.toString());

        if (activeConsoleId === id) {
            params.delete("console_id");
        } else {
            params.set("console_id", id);
        }

        params.set("page", "1");
        router.push(`?${params.toString()}`);
    }

    return (
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => handleClick("")}
                className={`btn btn-sm rounded-full ${activeConsoleId === "" ? "bg-purple-700" : "btn-outline"}`}
            >
                All
            </button>
            {consoles.map((c) => (
                <button
                    key={c.id}
                    onClick={() => handleClick(String(c.id))}
                    className={`btn btn-sm rounded-full ${activeConsoleId === String(c.id) ? "bg-purple-700" : "btn-outline"}`}
                >
                    {c.name}
                </button>
            ))}
        </div>
    );
}