"use client";

import { useActionState, useEffect, useRef } from "react";
import { updateGame, ActionState } from "@/app/games/admin/Action";

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
    isOpen: boolean;
    onClose: () => void;
}

const initialState: ActionState = { success: false };

export default function EditGameModal({ game, consoles, isOpen, onClose }: Props) {
    const modalRef = useRef<HTMLDialogElement>(null);
    const formRef  = useRef<HTMLFormElement>(null);

    const [state, formAction, isPending] = useActionState(updateGame, initialState);

    // Abre/cierra el dialog según el prop isOpen
    useEffect(() => {
        if (isOpen) {
            modalRef.current?.showModal();
        } else {
            modalRef.current?.close();
        }
    }, [isOpen]);

    // Cierra cuando el update es exitoso
    useEffect(() => {
        if (state.success) {
            onClose();
        }
    }, [state.success]);

    // Formatea la fecha a "YYYY-MM-DD" para el input type="date"
    const formattedDate = game.releasedate
        ? new Date(game.releasedate).toISOString().split("T")[0]
        : "";

    return (
        <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle" onClose={onClose}>
            <div className="modal-box max-w-2xl">

                <h3 className="font-bold text-lg mb-6">Edit — {game.title}</h3>

                {/* Error general */}
                {!state.success && state.message && (
                    <div className="alert alert-error mb-4 text-sm">
                        {state.message}
                    </div>
                )}

                <form ref={formRef} action={formAction} className="flex flex-col gap-4">

                    {/* ID oculto — necesario para el updateGame */}
                    <input type="hidden" name="id" value={game.id} />

                    {/* Title */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Title</span>
                        </label>
                        <input
                            name="title"
                            type="text"
                            defaultValue={state.oldValues?.title ?? game.title}
                            className={`input input-bordered w-full border-purple-400 ${state.errors?.title ? "input-error" : ""}`}
                        />
                        {state.errors?.title && (
                            <label className="label">
                                <span className="label-text-alt text-error">{state.errors.title}</span>
                            </label>
                        )}
                    </div>

                    {/* Developer */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Developer</span>
                        </label>
                        <input
                            name="developer"
                            type="text"
                            defaultValue={state.oldValues?.developer ?? game.developer}
                            className={`input input-bordered w-full border-purple-400 ${state.errors?.developer ? "input-error" : ""}`}
                        />
                        {state.errors?.developer && (
                            <label className="label">
                                <span className="label-text-alt text-error">{state.errors.developer}</span>
                            </label>
                        )}
                    </div>

                    {/* Genre + Price */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Genre</span>
                            </label>
                            <input
                                name="genre"
                                type="text"
                                defaultValue={state.oldValues?.genre ?? game.genre}
                                className={`input input-bordered w-full border-purple-400 ${state.errors?.genre ? "input-error" : ""}`}
                            />
                            {state.errors?.genre && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{state.errors.genre}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Price ($)</span>
                            </label>
                            <input
                                name="price"
                                type="number"
                                step="0.01"
                                min="0"
                                max="999.99"
                                defaultValue={state.oldValues?.price ?? game.price}
                                className={`input input-bordered border-purple-400 w-full ${state.errors?.price ? "input-error" : ""}`}
                            />
                            {state.errors?.price && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{state.errors.price}</span>
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Console + Release Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Console</span>
                            </label>
                            <select
                                name="console_id"
                                defaultValue={state.oldValues?.console_id ?? game.console_id}
                                className={`select select-bordered border-purple-400 w-full ${state.errors?.console_id ? "select-error" : ""}`}
                            >
                                {consoles.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                            {state.errors?.console_id && (
                                <label className="label">
                                    <span className="label-text-alt text-error">{state.errors.console_id}</span>
                                </label>
                            )}
                        </div>

                        <div className="form-control">
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
                    </div>

                    {/* Cover image */}
                    <div className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Cover Image</span>
                            <span className="label-text-alt text-base-content/50">
                                Deja vacío para mantener la actual
                            </span>
                        </label>
                        {/* Preview de la imagen actual */}
                        <div className="flex items-center gap-4 mb-2">
                            <img
                                src={"/imgs/" + game.cover}
                                alt={game.title}
                                className="w-16 h-16 object-cover rounded-lg border border-base-300"
                            />
                            <span className="text-sm text-base-content/60">{game.cover}</span>
                        </div>
                        <input
                            name="cover"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className={`file-input file-input-bordered w-full bg-purple-600 hover:bg-purple-700 ${state.errors?.cover ? "file-input-error" : ""}`}
                        />
                        {state.errors?.cover && (
                            <label className="label">
                                <span className="label-text-alt text-error">{state.errors.cover}</span>
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
                            defaultValue={state.oldValues?.description ?? game.description}
                            className={`textarea textarea-bordered w-full border-purple-400 resize-none ${state.errors?.description ? "textarea-error" : ""}`}
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