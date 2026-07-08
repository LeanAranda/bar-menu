'use client';

import { useEffect, useRef, useState } from 'react';
import ConfirmDialog from '@/components/ConfirmDialog';
import ToggleSwitch from '@/components/ToggleSwitch';
import MessageBanner, { type BannerMessage } from '@/components/MessageBanner';
import ReorderControls from '@/components/ReorderControls';
import InlineEditField from '@/components/InlineEditField';
import ActionButtons from '@/components/ActionButtons';
import { useFlipAnimation } from '@/hooks/useFlipAnimation';
import { useConfirmDelete } from '@/hooks/useConfirmDelete';

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
  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState('');
  const createRef = useRef<HTMLInputElement>(null);
  const { listRef, snapshotPositions } = useFlipAnimation('data-cat-id', categories);
  const { deleteTarget, handleDelete, confirmDelete, cancelDelete } = useConfirmDelete<Category>(
    '/api/admin/categories',
    {
      onSuccess: () => {
        setMessage({ type: 'success', text: 'Categoría eliminada. Productos movidos a "Sin categoría".' });
        load();
      },
      onError: (text) => setMessage({ type: 'error', text }),
    }
  );

  async function load() {
    const res = await fetch('/api/admin/categories');
    const data = await res.json() as Category[];
    setCategories(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

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

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!createName.trim()) return;
    setShowCreate(false);
    const res = await fetch('/api/admin/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: createName.trim() }),
    });
    if (res.ok) {
      setMessage({ type: 'success', text: 'Categoría creada.' });
      setCreateName('');
      load();
    } else {
      const err = await res.json() as { error?: string };
      setMessage({ type: 'error', text: err.error || 'Error al crear.' });
    }
  }

  function openCreate() {
    setCreateName('');
    setShowCreate(true);
    setTimeout(() => createRef.current?.focus(), 0);
  }

  function cancelCreate() {
    setShowCreate(false);
    setCreateName('');
  }

  const sinCategoria = (cat: Category) => cat.name === 'Sin categoría';

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800">Categorías</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 hover:cursor-pointer"
        >
          + Nueva categoría
        </button>
      </div>

      <MessageBanner message={message} onDismiss={() => setMessage(null)} />

      {showCreate && (
        <form onSubmit={handleCreate} className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
          <input
            ref={createRef}
            value={createName}
            onChange={(e) => setCreateName(e.target.value)}
            placeholder="Nombre de la nueva categoría"
            required
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 md:flex-1"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={!createName.trim()}
              className="flex-1 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 hover:cursor-pointer disabled:opacity-50 md:flex-none"
            >
              Agregar
            </button>
            <button
              type="button"
              onClick={cancelCreate}
              className="flex-1 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:cursor-pointer md:flex-none"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

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
                        <ActionButtons
                          onEdit={() => startEdit(cat)}
                          onDelete={() => handleDelete(cat)}
                          disableDelete={sinCategoria(cat)}
                          deleteTitle={sinCategoria(cat) ? 'No se puede eliminar' : undefined}
                        />
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
              <div key={cat.id} data-cat-id={cat.id} className="rounded-xl border border-neutral-200 bg-white">
                {/* Top bar: reorder + active */}
                <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2.5">
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
                  <>
                    <div className="px-4 py-3">
                      <InlineEditField
                        value={editName}
                        onChange={setEditName}
                        onSave={() => saveEdit(cat)}
                        onCancel={cancelEdit}
                        mobile
                      />
                    </div>
                    <div className="flex gap-2 border-t border-neutral-100 px-4 py-2.5">
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
                  </>
                ) : (
                  <>
                    <div className="px-4 py-3">
                      <p className={`text-sm font-semibold ${cat.active ? 'text-neutral-800' : 'text-neutral-400'}`}>
                        {cat.name}
                      </p>
                    </div>
                    <div className="border-t border-neutral-100 px-4 py-2.5">
                      <ActionButtons
                        onEdit={() => startEdit(cat)}
                        onDelete={() => handleDelete(cat)}
                        disableDelete={sinCategoria(cat)}
                        deleteTitle={sinCategoria(cat) ? 'No se puede eliminar' : undefined}
                      />
                    </div>
                  </>
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
        onCancel={cancelDelete}
      />
    </div>
  );
}
