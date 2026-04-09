"use client";

import { useActionState, useEffect, useRef } from "react";
import { createGame, ActionState } from "@/app/games/admin/Action";
import PlusIcon from "@/components/icons/PlusIcon";

interface Console {
  id: number;
  name: string;
}

interface Props {
  consoles: Console[];
}

const initialState: ActionState = { success: false };

export default function CreateGameModal({ consoles }: Props) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction, isPending] = useActionState(
    createGame,
    initialState,
  );

  // Cierra y resetea el form cuando el create es exitoso
  useEffect(() => {
    if (state.success) {
      modalRef.current?.close();
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <>
      {/* Botón de apertura */}
      <button
        onClick={() => modalRef.current?.showModal()}
        className="fixed bottom-6 right-6 z-50 bg-purple-600 hover:bg-purple-700 text-white w-14 h-14 flex items-center justify-center rounded-full shadow-lg transition"
      >
        <PlusIcon size={28} />
      </button>

      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box max-w-2xl">
          <h3 className="font-bold text-lg mb-6">Add New Game</h3>

          {/* Error general */}
          {!state.success && state.message && (
            <div className="alert alert-error mb-4 text-sm">
              {state.message}
            </div>
          )}

          <form
            ref={formRef}
            action={formAction}
            className="flex flex-col gap-4"
          >
            {/* Title */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Title</span>
              </label>
              <input
                name="title"
                type="text"
                placeholder="e.g. The Last of Us"
                defaultValue={state.oldValues?.title}
                className={`input input-bordered w-full border-purple-400 ${state.errors?.title ? "input-error" : ""}`}
              />
              {state.errors?.title && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {state.errors.title}
                  </span>
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
                placeholder="e.g. Naughty Dog"
                defaultValue={state.oldValues?.developer}
                className={`input input-bordered w-full border-purple-400 ${state.errors?.developer ? "input-error" : ""}`}
              />
              {state.errors?.developer && (
                <label className="label">
                  <span className="label-text-alt text-error">  
                    {state.errors.developer}
                  </span>
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
                  placeholder="e.g. Action"
                  defaultValue={state.oldValues?.genre}
                  className={`input input-bordered w-full border-purple-400 ${state.errors?.genre ? "input-error" : ""}`}
                />
                {state.errors?.genre && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {state.errors.genre}
                    </span>
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
                  placeholder="59.99"
                  defaultValue={state.oldValues?.price}
                  className={`input input-bordered w-full border-purple-400 ${state.errors?.price ? "input-error" : ""}`}
                />
                {state.errors?.price && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {state.errors.price}
                    </span>
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
                  defaultValue={state.oldValues?.console_id ?? ""}
                  className={`select select-bordered w-full border-purple-400 ${state.errors?.console_id ? "select-error" : ""}`}
                >
                  <option value="" disabled>
                    Select a console
                  </option>
                  {consoles.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {state.errors?.console_id && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {state.errors.console_id}
                    </span>
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
                  defaultValue={state.oldValues?.releasedate}
                  className={`input input-bordered w-full border-purple-400 ${state.errors?.releasedate ? "input-error" : ""}`}
                />
                {state.errors?.releasedate && (
                  <label className="label">
                    <span className="label-text-alt text-error">
                      {state.errors.releasedate}
                    </span>
                  </label>
                )}
              </div>
            </div>

            {/* Cover image */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text ">Cover Image</span>
              </label>
              <input 
                name="cover"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className={`file-input file-input-bordered bg-purple-600 hover:bg-purple-700 w-full  ${state.errors?.cover ? "file-input-error" : ""}`}
              />
              {state.errors?.cover && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {state.errors.cover}
                  </span>
                </label>
              )}
            </div>

            {/* Description */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Description</span>
                <span className="label-text-alt text-base-content/50">
                  max 500 chars
                </span>
              </label>
              <textarea
                name="description"
                rows={3}
                maxLength={500}
                placeholder="Short description of the game..."
                defaultValue={state.oldValues?.description}
                className={`textarea textarea-bordered w-full resize-none border-purple-400 ${state.errors?.description ? "textarea-error" : ""}`}
              />
              {state.errors?.description && (
                <label className="label">
                  <span className="label-text-alt text-error">
                    {state.errors.description}
                  </span>
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
                  "Create Game"
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
