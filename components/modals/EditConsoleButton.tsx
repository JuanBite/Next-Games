"use client";

import { useState } from "react";
import PencilIcon from "@/components/icons/PencilIcon";
import EditConsoleModal from "@/components/modals/EditConsoleModal";

interface ConsoleRecord {
    id: number;
    name: string;
    manufacturer: string;
    releasedate: Date;
    description: string;
    image: string;
}

interface Props {
    consoleRecord: ConsoleRecord;
}

export default function EditConsoleButton({ consoleRecord }: Props) {
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
                <EditConsoleModal
                    consoleRecord={consoleRecord}
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                />
            )}
        </>
    );
}