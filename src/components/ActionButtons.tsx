'use client';

export default function ActionButtons({
  onEdit,
  onDelete,
  disableDelete,
  deleteTitle,
}: {
  onEdit: () => void;
  onDelete: () => void;
  disableDelete?: boolean;
  deleteTitle?: string;
}) {
  return (
    <div className="flex justify-end gap-2">
      <button
        onClick={onEdit}
        className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 hover:cursor-pointer"
      >
        Editar
      </button>
      <button
        onClick={onDelete}
        disabled={disableDelete}
        title={deleteTitle}
        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
      >
        Eliminar
      </button>
    </div>
  );
}
