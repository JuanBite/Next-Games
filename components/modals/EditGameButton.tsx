"use client";

import { useState } from "react";
import PencilIcon from "@/components/icons/PencilIcon";
import EditGameModal from "@/components/modals/EditGameModal";

interface Console {
    id: number;
    name: string;
}

interface Game {
    id: number;
    title: string;
    developer: string;
    genre: string;
    price: number;
    releasedate: Date;
    description: string;
    cover: string;
    console_id: number;
}

interface Props {
    game: Game;
    consoles: Console[];
}

export default function EditGameButton({ game, consoles }: Props) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                className="btn btn-xs btn-success flex-1 w-full sm:w-auto gap-1"
                onClick={() => setIsOpen(true)}
            >
                <PencilIcon />
            </button>

            {isOpen && (
                <EditGameModal
                    game={game}
                    consoles={consoles}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}