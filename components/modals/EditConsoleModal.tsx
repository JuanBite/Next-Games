"use client";

import { useActionState, useEffect, useRef } from "react";
import { updateConsole, ConsoleActionState } from "@/app/consoles/admin/Action";

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
    isOpen: boolean;
    onClose: () => void;
}

const initialState: ConsoleActionState = { success: false };

export default function EditConsoleModal({ consoleRecord, isOpen, onClose }: Props) {
    const modalRef = useRef<HTMLDialogElement>(null);
    const formRef  = useRef<HTMLFormElement>(null);

    const [state, formAction, isPending] = useActionState(updateConsole, initialState);

    useEffect(() => {
        if (isOpen) {
            modalRef.current?.showModal();
        } else {
            modalRef.current?.close();
        }
    }, [isOpen]);

    useEffect(() => {
        if (state.success) {
            onClose();
        }
    }, [state.success]);

    const formattedDate = consoleRecord.releasedate
        ? new Date(consoleRecord.releasedate).toISOString().split("T")[0]
        : "";

    return (
        <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle" onClose={onClose}>
            <div className="modal-box max-w-2xl">

                <h3 className="font-bold text-lg mb-6">Edit — {consoleRecord.name}</h3>

                {/* Error general */}
                {!state.success && state.message && (
                    <div className="alert alert-error mb-4 text-sm">
                        {state.message}
                    </div>
                )}

                <form ref={formRef} action={formAction} className="flex flex-col gap-4">

                    {/* ID oculto */}
                    <input type="hidden" name="id" value={consoleRecord.id} />

                    {/* Name */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Name</span>
                        </label>
                        <input
                            name="name"
                            type="text"
                            defaultValue={state.oldValues?.name ?? consoleRecord.name}
                            className={`input input-bordered border-purple-400 w-full ${state.errors?.name ? "input-error" : ""}`}
                        />
                        {state.errors?.name && (
                            <label className="label">
                                <span className="label-text-alt text-error">{state.errors.name}</span>
                            </label>
                        )}
                    </div>

                    {/* Manufacturer */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Manufacturer</span>
                        </label>
                        <input
                            name="manufacturer"
                            type="text"
                            defaultValue={state.oldValues?.manufacturer ?? consoleRecord.manufacturer}
                            className={`input input-bordered border-purple-400 w-full ${state.errors?.manufacturer ? "input-error" : ""}`}
                        />
                        {state.errors?.manufacturer && (
                            <label className="label">
                                <span className="label-text-alt text-error">{state.errors.manufacturer}</span>
                            </label>
                        )}
                    </div>

                    {/* Release Date */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Release Date</span>
                        </label>
                        <input
                            name="releasedate"
                            type="date"
                            defaultValue={state.oldValues?.releasedate ?? formattedDate}
                            className={`input input-bordered border-purple-400 w-full ${state.errors?.releasedate ? "input-error" : ""}`}
                        />
                        {state.errors?.releasedate && (
                            <label className="label">
                                <span className="label-text-alt text-error">{state.errors.releasedate}</span>
                            </label>
                        )}
                    </div>

                    {/* Image */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Console Image</span>
                            <span className="label-text-alt text-base-content/50">
                                Deja vacío para mantener la actual
                            </span>
                        </label>
                        {/* Preview imagen actual */}
                        <div className="flex items-center gap-4 mb-2">
                            <img
                                src={"/imgs/" + consoleRecord.image}
                                alt={consoleRecord.name}
                                className="w-16 h-16 object-cover rounded-lg border border-base-300"
                            />
                            <span className="text-sm text-base-content/60">{consoleRecord.image}</span>
                        </div>
                        <input
                            name="image"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className={`file-input file-input-bordered w-full bg-purple-600 hover:bg-purple-700 ${state.errors?.image ? "file-input-error" : ""}`}
                        />
                        {state.errors?.image && (
                            <label className="label">
                                <span className="label-text-alt text-error">{state.errors.image}</span>
                            </label>
                        )}
                    </div>

                    {/* Description */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Description</span>
                            <span className="label-text-alt text-base-content/50">max 500 chars</span>
                        </label>
                        <textarea
                            name="description"
                            rows={3}
                            maxLength={500}
                            defaultValue={state.oldValues?.description ?? consoleRecord.description}
                            className={`textarea textarea-bordered border-purple-400 w-full resize-none ${state.errors?.description ? "textarea-error" : ""}`}
                        />
                        {state.errors?.description && (
                            <label className="label">
                                <span className="label-text-alt text-error">{state.errors.description}</span>
                            </label>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="modal-action mt-2">
                        <button
                            type="button"
                            className="btn hover:bg-red-400"
                            onClick={onClose}
                            disabled={isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn bg-purple-600 hover:bg-purple-700"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <span className="loading loading-spinner loading-sm" />
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>

                </form>
            </div>

            {/* Click fuera cierra el modal */}
            <form method="dialog" className="modal-backdrop">
                <button type="submit">close</button>
            </form>
        </dialog>
    );
}