'use client';

import { useEffect, useState } from 'react';
import ConfirmDialog from '@/components/ConfirmDialog';
import ToggleSwitch from '@/components/ToggleSwitch';
import MessageBanner, { type BannerMessage } from '@/components/MessageBanner';
import ReorderControls from '@/components/ReorderControls';
import ProductDialog from '@/components/ProductDialog';
import ActionButtons from '@/components/ActionButtons';
import ProductPrice from '@/components/ProductPrice';
import { useFlipAnimation } from '@/hooks/useFlipAnimation';
import { useConfirmDelete } from '@/hooks/useConfirmDelete';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: number;
  old_price: number | null;
  is_offer: boolean;
  image_url: string | null;
  available: boolean;
  featured: boolean;
  sort_order: number;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<BannerMessage | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const { listRef, snapshotPositions } = useFlipAnimation('data-prod-id', products);
  const { deleteTarget, handleDelete, confirmDelete, cancelDelete } = useConfirmDelete<Product>(
    '/api/admin/products',
    {
      onSuccess: () => {
        setMessage({ type: 'success', text: 'Producto eliminado.' });
        load();
      },
      onError: (text) => setMessage({ type: 'error', text }),
    }
  );

  async function load() {
    const [prodRes, catRes] = await Promise.all([
      fetch('/api/admin/products'),
      fetch('/api/admin/categories'),
    ]);
    setProducts(await prodRes.json() as Product[]);
    setCategories(await catRes.json() as Category[]);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const groupedCategories = categories
    .map((cat) => ({
      ...cat,
      products: products.filter((p) => p.category_id === cat.id),
    }))
    .filter((g) => g.products.length > 0);

  async function toggleAvailable(prod: Product) {
    const res = await fetch(`/api/admin/products/${prod.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ available: !prod.available }),
    });
    if (res.ok) {
      load();
    } else {
      setMessage({ type: 'error', text: 'Error al cambiar disponibilidad.' });
    }
  }

  function groupProducts(catId: number) {
    return products.filter((p) => p.category_id === catId).sort((a, b) => a.sort_order - b.sort_order);
  }

  function catProductsIndex(prod: Product): number {
    return groupProducts(prod.category_id).findIndex((p) => p.id === prod.id);
  }

  function catProductsCount(catId: number): number {
    return groupProducts(catId).length;
  }

  async function moveUp(prod: Product) {
    const group = groupProducts(prod.category_id);
    const idx = group.findIndex((p) => p.id === prod.id);
    if (idx <= 0) return;
    const above = group[idx - 1];
    snapshotPositions();
    await Promise.all([
      fetch(`/api/admin/products/${prod.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: above.sort_order }),
      }),
      fetch(`/api/admin/products/${above.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: prod.sort_order }),
      }),
    ]);
    load();
  }

  async function moveDown(prod: Product) {
    const group = groupProducts(prod.category_id);
    const idx = group.findIndex((p) => p.id === prod.id);
    if (idx === -1 || idx >= group.length - 1) return;
    const below = group[idx + 1];
    snapshotPositions();
    await Promise.all([
      fetch(`/api/admin/products/${prod.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: below.sort_order }),
      }),
      fetch(`/api/admin/products/${below.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sort_order: prod.sort_order }),
      }),
    ]);
    load();
  }

  function openCreate() {
    setEditTarget(null);
    setDialogOpen(true);
  }

  function openEdit(prod: Product) {
    setEditTarget(prod);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setEditTarget(null);
  }

  return (
    <div className="overflow-x-hidden">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800">Productos</h1>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 hover:cursor-pointer"
        >
          + Nuevo producto
        </button>
      </div>

      <MessageBanner message={message} onDismiss={() => setMessage(null)} />

      {loading ? (
        <p className="text-neutral-500">Cargando...</p>
      ) : groupedCategories.length === 0 ? (
        <p className="text-neutral-500">No hay productos todavía.</p>
      ) : (
        <div ref={listRef} className="space-y-6">
          {groupedCategories.map((group) => (
            <div key={group.id}>
              <h2 className="mb-2 text-lg font-semibold text-neutral-700 text-center">{group.name}</h2>

              {/* Desktop table */}
              <div className="hidden overflow-x-auto rounded-xl border border-neutral-200 bg-white md:block">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50 text-left text-neutral-600">
                      <th className="w-20 px-4 py-3 font-medium">Orden</th>
                      <th className="w-14 px-4 py-3 font-medium">Img</th>
                      <th className="px-4 py-3 font-medium">Nombre</th>
                      <th className="w-48 px-4 py-3 font-medium">Precio</th>
                      <th className="w-28 px-4 py-3 font-medium">Disponible</th>
                      <th className="w-44 px-4 py-3 text-right font-medium">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {groupProducts(group.id).map((prod) => {
                      const idxInGroup = catProductsIndex(prod);
                      const totalInGroup = catProductsCount(group.id);
                      return (
                        <tr key={prod.id} data-prod-id={prod.id} className="text-neutral-800">
                          <td className="px-4 py-3">
                            <ReorderControls
                              index={idxInGroup}
                              total={totalInGroup}
                              onMoveUp={() => moveUp(prod)}
                              onMoveDown={() => moveDown(prod)}
                              compact
                            />
                          </td>
                          <td className="px-4 py-3">
                            {prod.image_url ? (
                              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-200">
                                <img src={prod.image_url} alt="" className="h-full w-full object-cover" />
                              </div>
                            ) : (
                              <span className="block h-12 w-12 flex-shrink-0 rounded-lg border border-neutral-100 bg-neutral-50" />
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <span className={prod.available ? '' : 'text-neutral-400'}>{prod.name}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2 whitespace-nowrap">
                              <ProductPrice price={prod.price} oldPrice={prod.old_price} isOffer={!!prod.is_offer} />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <ToggleSwitch checked={prod.available} onChange={() => toggleAvailable(prod)} />
                          </td>
                          <td className="px-4 py-3 text-right">
                            <ActionButtons
                              onEdit={() => openEdit(prod)}
                              onDelete={() => handleDelete(prod)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 md:hidden">
                {groupProducts(group.id).map((prod) => {
                  const idxInGroup = catProductsIndex(prod);
                  const totalInGroup = catProductsCount(group.id);
                  return (
                    <div key={prod.id} data-prod-id={prod.id} className="rounded-xl border border-neutral-200 bg-white">
                      {/* Top bar: reorder + availability */}
                      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2.5">
                        <ReorderControls
                          index={idxInGroup}
                          total={totalInGroup}
                          onMoveUp={() => moveUp(prod)}
                          onMoveDown={() => moveDown(prod)}
                          showHash
                        />
                        <ToggleSwitch checked={prod.available} onChange={() => toggleAvailable(prod)} />
                      </div>

                      {/* Body: image + name + price */}
                      <div className="flex items-center gap-3 px-4 py-3">
                        {prod.image_url && (
                          <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-neutral-200">
                            <img src={prod.image_url} alt="" className="h-full w-full object-cover" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-semibold ${prod.available ? 'text-neutral-800' : 'text-neutral-400'}`}>
                            {prod.name}
                          </p>
                          <div className="mt-1">
                            <ProductPrice price={prod.price} oldPrice={prod.old_price} isOffer={!!prod.is_offer} />
                          </div>
                        </div>
                      </div>

                      {/* Bottom: actions */}
                      <div className="border-t border-neutral-100 px-4 py-2.5">
                        <ActionButtons
                          onEdit={() => openEdit(prod)}
                          onDelete={() => handleDelete(prod)}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Eliminar producto"
        message={`¿Eliminar "${deleteTarget?.name}"?`}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

      <ProductDialog
        open={dialogOpen}
        product={editTarget}
        categories={categories}
        onSaved={() => {
          closeDialog();
          setMessage({ type: 'success', text: editTarget ? 'Producto actualizado.' : 'Producto creado.' });
          load();
        }}
        onCancel={closeDialog}
      />
    </div>
  );
}
