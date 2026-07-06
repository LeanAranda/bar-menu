'use client';

import { useEffect, useRef, useState } from 'react';

interface Category {
  id: number;
  name: string;
}

interface Product {
  id: number;
  category_id: number;
  name: string;
  price: number;
  old_price: number | null;
  is_offer: boolean;
}

export default function ProductDialog({
  open,
  product,
  categories,
  onSaved,
  onCancel,
}: {
  open: boolean;
  product?: Product | null;
  categories: Category[];
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [offer, setOffer] = useState(false);
  const [oldPrice, setOldPrice] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const isEdit = !!product;

  useEffect(() => {
    if (!open) return;
    setError('');
    if (product) {
      setOffer(product.is_offer);
      setOldPrice(product.old_price ? String(product.old_price) : '');
    } else {
      setOffer(false);
      setOldPrice('');
    }
  }, [open, product]);

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
      dialogRef.current?.querySelector<HTMLInputElement>('select, input')?.focus();
    }
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    const category_id = Number(fd.get('category_id'));
    const price = parseFloat(fd.get('price') as string);
    if (!name.trim() || !category_id || isNaN(price)) return;

    setSaving(true);
    setError('');
    const is_offer = offer;
    const raw_old = parseFloat(oldPrice);
    const old_price = !isNaN(raw_old) ? raw_old : null;

    const body: Record<string, unknown> = { name: name.trim(), category_id, price, is_offer, old_price };

    const res = await fetch(`/api/admin/products${isEdit ? `/${product!.id}` : ''}`, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (res.ok) {
      setOffer(false);
      setOldPrice('');
      onSaved();
    } else {
      const data = await res.json().catch(() => null) as Record<string, string> | null;
      setError(data?.error ?? 'Error al guardar el producto.');
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <div ref={dialogRef} className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
        <h3 className="mb-4 text-lg text-center font-semibold text-neutral-800">
          {isEdit ? 'Editar producto' : 'Nuevo producto'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Categoría</label>
            <select
              name="category_id"
              required
              defaultValue={product?.category_id ?? ''}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            >
              <option value="">Seleccionar...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Nombre</label>
            <input
              name="name"
              placeholder="Nombre del producto"
              required
              defaultValue={product?.name ?? ''}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Precio</label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="$0"
                required
                defaultValue={product?.price ?? ''}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-neutral-500">Precio anterior</label>
              <input

                name="old_price"
                type="number"
                step="0.01"
                min="0"
                placeholder="$0"
                value={oldPrice}
                onChange={(e) => setOldPrice(e.target.value)}
                disabled={!offer}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-neutral-700 hover:cursor-pointer">
            <input
              type="checkbox"
              checked={offer}
              onChange={(e) => setOffer(e.target.checked)}
              className="h-4 w-4 rounded border-neutral-300 text-orange-600 focus:ring-orange-400"
            />
            Marcar como oferta
          </label>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700 text-center">
              {error}
            </div>
          )}

          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 hover:cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 hover:cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Guardando...' : isEdit ? 'Guardar' : 'Agregar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
