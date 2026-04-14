"use client";

import { useRef, useState } from "react";
import TrashIcon from "@/components/icons/TrashIcon";
import { deleteConsole } from "@/app/consoles/admin/Action";
import { useToast } from "@/components/ToastProvider";


interface Props {
    consoleId: number;
    consoleName: string;
}

export default function DeleteConsoleButton({ consoleId, consoleName }: Props) {
    const { showToast } = useToast();
    const modalRef = useRef<HTMLDialogElement>(null);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleDelete = async () => {
        setIsPending(true);
        setError(null);

        const result = await deleteConsole(consoleId);

        if (!result.success) {
            setError(result.message ?? "Something went wrong.");
            setIsPending(false);
        } else {
            modalRef.current?.close();
            showToast("Console deleted successfully! 🕹️");

        }
    };

    return (
        <>
            {/* Botón de la card */}
            <button
                className="btn btn-xs btn-error flex-1 w-full sm:w-auto gap-1"
                onClick={() => modalRef.current?.showModal()}
            >
                <TrashIcon />
            </button>

            {/* Modal de confirmación */}
            <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">

                    <h3 className="font-bold text-lg">Delete Console</h3>
                    <p className="py-4 text-base-content/70">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-base-content">{consoleName}</span>?
                        This will also affect all games linked to this console.
                        This action cannot be undone.
                    </p>

                    {error && (
                        <div className="alert alert-error text-sm mb-4">
                            {error}
                        </div>
                    )}

                    <div className="modal-action">
                        <button
                            className="btn hover:bg-purple-700"
                            onClick={() => modalRef.current?.close()}
                            disabled={isPending}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-error"
                            onClick={handleDelete}
                            disabled={isPending}
                        >
                            {isPending ? (
                                <span className="loading loading-spinner loading-sm" />
                            ) : (
                                "Yes, delete"
                            )}
                        </button>
                    </div>

                </div>

                {/* Click fuera cierra el modal */}
                <form method="dialog" className="modal-backdrop">
                    <button type="submit">close</button>
                </form>
            </dialog>
        </>
    );
}