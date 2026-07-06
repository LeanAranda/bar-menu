'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import ConfirmDialog from '@/components/ConfirmDialog';
import ToggleSwitch from '@/components/ToggleSwitch';
import MessageBanner, { type BannerMessage } from '@/components/MessageBanner';
import ReorderControls from '@/components/ReorderControls';
import InlineEditField from '@/components/InlineEditField';

interface Category {
  id: number;
  name: string;
  sort_order: number;
  active: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');
  const [message, setMessage] = useState<BannerMessage | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const posMapRef = useRef<Map<number, number>>(new Map());
  const reorderPendingRef = useRef(false);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);

  async function load() {
    const res = await fetch('/api/admin/categories');
    const data = await res.json() as Category[];
    setCategories(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const snapshotPositions = useCallback(() => {
    const map = new Map<number, number>();
    if (listRef.current) {
      listRef.current.querySelectorAll<HTMLElement>('[data-cat-id]').forEach((el) => {
        const id = Number(el.dataset.catId);
        const rect = el.getBoundingClientRect();
        if (rect.width > 0) map.set(id, rect.top);
      });
    }
    posMapRef.current = map;
    reorderPendingRef.current = true;
  }, []);

  // FLIP animation after reorder
  useEffect(() => {
    if (!reorderPendingRef.current) return;
    const container = listRef.current;
    if (!container) return;

    const map = posMapRef.current;
    if (map.size === 0) return;

    const els = container.querySelectorAll<HTMLElement>('[data-cat-id]');
    const moves: { el: HTMLElement; dy: number }[] = [];

    els.forEach((el) => {
      const id = Number(el.dataset.catId);
      const oldTop = map.get(id);
      if (oldTop !== undefined) {
        const newTop = el.getBoundingClientRect().top;
        const dy = oldTop - newTop;
        if (Math.abs(dy) > 0.5) {
          moves.push({ el, dy });
        }
      }
    });

    if (moves.length === 0) return;

    requestAnimationFrame(() => {
      moves.forEach(({ el, dy }) => {
        el.style.transition = 'none';
        el.style.transform = `translateY(${dy}px)`;
      });
      requestAnimationFrame(() => {
        moves.forEach(({ el }) => {
          el.style.transition = 'transform 300ms ease';
          el.style.transform = '';
        });
        setTimeout(() => {
          moves.forEach(({ el }) => {
            el.style.transition = '';
            el.style.transform = '';
          });
        }, 300);
      });
    });

    posMapRef.current = new Map();
    reorderPendingRef.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories]);

  function startEdit(cat: Category) {
    setEditingId(cat.id);
    setEditName(cat.name);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditName('');
  }

  async function saveEdit(cat: Category) {
    if (!editName.trim()) return;
    const res = await fetch(`/api/admin/categories/${cat.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName.trim() }),
    });
    if (res.ok) {
      setMessage({ type: 'success', text: 'Categoría actualizada.' });
      setEditingId(null);
      load();
    } else {
      setMessage({ type: 'error', text: 'Error al actualizar.' });
    }
  }

  async function toggleActive(cat: Category) {
    const res = await fetch(`/api/admin/categories/${cat.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !cat.active }),
    });
    if (res.ok) {
      load();
    } else {
      setMessage({ type: 'error', text: 'Error al cambiar estado.' });
    }
  }

  async function moveUp(index: number) {
    if (index === 0) return;
    const current = categories[index];
    const above = categories[index - 1];
    snapshotPositions();
    await Promise.all([
      fetch(`/api/admin/categories/${current.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: above.sort_order }),
      }),
      fetch(`/api/admin/categories/${above.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: current.sort_order }),
      }),
    ]);
    load();
  }

  async function moveDown(index: number) {
    if (index === categories.length - 1) return;
    const current = categories[index];
    const below = categories[index + 1];
    snapshotPositions();
    await Promise.all([
      fetch(`/api/admin/categories/${current.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: below.sort_order }),
      }),
      fetch(`/api/admin/categories/${below.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: current.sort_order }),
      }),
    ]);
    load();
  }

  async function handleDelete(cat: Category) {
    setDeleteTarget(cat);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const cat = deleteTarget;
    setDeleteTarget(null);
    const res = await fetch(`/api/admin/categories/${cat.id}`, { method: 'DELETE' });
    if (res.ok) {
      setMessage({ type: 'success', text: 'Categoría eliminada. Productos movidos a "Sin categoría".' });
      load();
    } else {
      const err = await res.json() as { error?: string };
      setMessage({ type: 'error', text: err.error || 'Error al eliminar.' });
    }
  }

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const name = new FormData(form).get('name') as string;
    if (!name.trim()) return;
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim(), sort_order: categories.length }),
    });
    if (res.ok) {
      setMessage({ type: 'success', text: 'Categoría creada.' });
      load();
      form.reset();
    } else {
      const err = await res.json() as { error?: string };
      setMessage({ type: 'error', text: err.error || 'Error al crear.' });
    }
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-neutral-800 text-center">Categorías</h1>

      <MessageBanner message={message} onDismiss={() => setMessage(null)} />

      <form onSubmit={handleCreate} className="mb-6 flex items-center gap-3">
        <input
          name="name"
          placeholder="Nombre de la nueva categoría"
          required
          className="flex-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
        />
        <button
          type="submit"
          className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 hover:cursor-pointer"
        >
          + Agregar
        </button>
      </form>

      {loading ? (
        <p className="text-neutral-500">Cargando...</p>
      ) : categories.length === 0 ? (
        <p className="text-neutral-500">No hay categorías disponibles.</p>
      ) : (
        <div ref={listRef}>
          {/* Desktop table */}
          <div className="hidden overflow-hidden rounded-xl border border-neutral-200 bg-white md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50 text-left text-neutral-600">
                  <th className="w-20 px-4 py-3 font-medium">Orden</th>
                  <th className="px-4 py-3 font-medium">Nombre</th>
                  <th className="w-28 px-4 py-3 font-medium">Activa</th>
                  <th className="w-44 px-4 py-3 text-right font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {categories.map((cat, i) => (
                  <tr key={cat.id} data-cat-id={cat.id} className="text-neutral-800">
                    <td className="px-4 py-3">
                      <ReorderControls
                        index={i}
                        total={categories.length}
                        onMoveUp={() => moveUp(i)}
                        onMoveDown={() => moveDown(i)}
                        compact
                      />
                    </td>
                    <td className="px-4 py-3">
                      {editingId === cat.id ? (
                        <InlineEditField
                          value={editName}
                          onChange={setEditName}
                          onSave={() => saveEdit(cat)}
                          onCancel={cancelEdit}
                        />
                      ) : (
                        <span className={cat.active ? '' : 'text-neutral-400'}>{cat.name}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <ToggleSwitch checked={cat.active} onChange={() => toggleActive(cat)} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      {editingId === cat.id ? (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => saveEdit(cat)}
                            disabled={!editName.trim()}
                            className="rounded-lg bg-orange-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-500 hover:cursor-pointer disabled:opacity-50"
                          >
                            Guardar
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 hover:cursor-pointer"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => startEdit(cat)}
                            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50 hover:cursor-pointer"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(cat)}
                            disabled={cat.name === 'Sin categoría'}
                            title={cat.name === 'Sin categoría' ? 'No se puede eliminar' : undefined}
                            className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500 hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {categories.map((cat, i) => (
              <div key={cat.id} data-cat-id={cat.id} className="rounded-xl border border-neutral-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <ReorderControls
                    index={i}
                    total={categories.length}
                    onMoveUp={() => moveUp(i)}
                    onMoveDown={() => moveDown(i)}
                    showHash
                  />
                  <ToggleSwitch checked={cat.active} onChange={() => toggleActive(cat)} />
                </div>

                {editingId === cat.id ? (
                  <div className="space-y-3">
                    <InlineEditField
                      value={editName}
                      onChange={setEditName}
                      onSave={() => saveEdit(cat)}
                      onCancel={cancelEdit}
                      mobile
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(cat)}
                        disabled={!editName.trim()}
                        className="flex-1 rounded-lg bg-orange-600 py-2 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-50"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="flex-1 rounded-lg border border-neutral-300 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-medium ${cat.active ? 'text-neutral-800' : 'text-neutral-400'}`}>
                      {cat.name}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(cat)}
                        className="rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        disabled={cat.name === 'Sin categoría'}
                        title={cat.name === 'Sin categoría' ? 'No se puede eliminar' : undefined}
                        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Eliminar categoría"
        message={`¿Eliminar "${deleteTarget?.name}"? Los productos pasarán a "Sin categoría".`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
