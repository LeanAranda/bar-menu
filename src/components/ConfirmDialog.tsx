'use client';

import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  disabled?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Eliminar',
  cancelLabel = 'Cancelar',
  variant = 'danger',
  disabled,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onCancel]);

  useEffect(() => {
    if (open) {
      const btn = dialogRef.current?.querySelector<HTMLButtonElement>('[data-autofocus]');
      btn?.focus();
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <div
        ref={dialogRef}
        className="relative w-full max-w-sm rounded-xl bg-white p-6 shadow-2xl"
      >
        <h3 className="text-lg font-semibold text-neutral-800">{title}</h3>
        <p className="mt-2 text-sm text-neutral-600">{message}</p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={onCancel}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 
            hover:bg-neutral-50 hover:cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            data-autofocus
            onClick={onConfirm}
            disabled={disabled}
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white hover:cursor-pointer disabled:opacity-50 ${
              variant === 'danger'
                ? 'bg-red-600 hover:bg-red-500'
                : 'bg-orange-600 hover:bg-orange-500'
            }`}
          >
            {disabled ? 'Eliminando...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
