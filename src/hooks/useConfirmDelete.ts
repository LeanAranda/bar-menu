'use client';

import { useState } from 'react';

export function useConfirmDelete<T extends { id: number; name: string }>(
  apiBase: string,
  callbacks: {
    onSuccess?: () => void;
    onError?: (error: string) => void;
  }
) {
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);

  function handleDelete(item: T) {
    setDeleteTarget(item);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const item = deleteTarget;
    setDeleteTarget(null);
    const res = await fetch(`${apiBase}/${item.id}`, { method: 'DELETE' });
    if (res.ok) {
      callbacks.onSuccess?.();
    } else {
      const err = await res.json().catch(() => null) as { error?: string } | null;
      callbacks.onError?.(err?.error || 'Error al eliminar.');
    }
  }

  function cancelDelete() {
    setDeleteTarget(null);
  }

  return { deleteTarget, handleDelete, confirmDelete, cancelDelete };
}
