'use client';

import { useRef, useState } from 'react';

export function useConfirmDelete<T extends { id: number; name: string }>(
  apiBase: string,
  callbacks: {
    onSuccess?: () => void;
    onError?: (error: string) => void;
  }
) {
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  function handleDelete(item: T) {
    setDeleteTarget(item);
  }

  async function confirmDelete() {
    if (!deleteTarget || submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    try {
      const item = deleteTarget;
      setDeleteTarget(null);
      const res = await fetch(`${apiBase}/${item.id}`, { method: 'DELETE' });
      if (res.ok) {
        callbacks.onSuccess?.();
      } else {
        const err = await res.json().catch(() => null) as { error?: string } | null;
        callbacks.onError?.(err?.error || 'Error al eliminar.');
      }
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  function cancelDelete() {
    if (submittingRef.current) return;
    setDeleteTarget(null);
  }

  return { deleteTarget, handleDelete, confirmDelete, cancelDelete, submitting };
}
