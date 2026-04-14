"use client";

import { useActionState, useEffect, useRef } from "react";
import { createConsole, ConsoleActionState } from "@/app/consoles/admin/Action";
import PlusIcon from "@/components/icons/PlusIcon";
import { useToast } from "@/components/ToastProvider";

const initialState: ConsoleActionState = { success: false };

export default function CreateConsoleModal() {
    const { showToast } = useToast();
    const modalRef = useRef<HTMLDialogElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const [state, formAction, isPending] = useActionState(createConsole, initialState);

    // Cierra y resetea el form cuando el create es exitoso
    useEffect(() => {
        if (state.success) {
            showToast("Console created successfully! 🕹️");
            modalRef.current?.close();
            formRef.current?.reset();
        }
    }, [state.success]);

    return (
        <>
            {/* Botón de apertura */}
            <button
                onClick={() => modalRef.current?.showModal()}
                className="fixed bottom-6 right-6 z-50 bg-purple-600 hover:bg-purple-700 text-white w-14 h-14 flex items-center justify-center rounded-full shadow-lg transition"
            >
                +
            </button>

            <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
                <div className="modal-box max-w-2xl">

                    <h3 className="font-bold text-lg mb-6">Add New Console</h3>

                    {/* Error general */}
                    {!state.success && state.message && (
                        <div className="alert alert-error mb-4 text-sm">
                            {state.message}
                        </div>
                    )}

                    <form ref={formRef} action={formAction} className="flex flex-col gap-4">

                        {/* Name */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input
                                name="name"
                                type="text"
                                placeholder="e.g. PlayStation 5"
                                defaultValue={state.oldValues?.name}
                                className={`input input-bordered w-full border-purple-400 ${state.errors?.name ? "input-error" : ""}`}
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
                                placeholder="e.g. Sony"
                                defaultValue={state.oldValues?.manufacturer}
                                className={`input input-bordered w-full border-purple-400 ${state.errors?.manufacturer ? "input-error" : ""}`}
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
                                defaultValue={state.oldValues?.releasedate}
                                className={`input input-bordered w-full border-purple-400 ${state.errors?.releasedate ? "input-error" : ""}`}
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
                            </label>
                            <input
                                name="image"
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className={`file-input file-input-bordered border-purple-400 w-full bg-purple-600 hover:bg-purple-700 ${state.errors?.image ? "file-input-error" : ""}`}
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
                                placeholder="Short description of the console..."
                                defaultValue={state.oldValues?.description}
                                className={`textarea textarea-bordered w-full resize-none border-purple-400 ${state.errors?.description ? "textarea-error" : ""}`}
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
                                onClick={() => {
                                    modalRef.current?.close();
                                    formRef.current?.reset();
                                }}
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
                                    "Create Console"
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
        </>
    );
}