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
  description: string | null;
  price: number;
  old_price: number | null;
  is_offer: boolean;
  image_url?: string | null;
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
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const isEdit = !!product;

  useEffect(() => {
    if (!open) return;
    setError('');
    setPendingImage(null);
    setRemoveImage(false);
    setPreviewUrl(null);
    setDragOver(false);
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

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingImage(file);
    setRemoveImage(false);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    setPendingImage(null);
    setPreviewUrl(null);
    if (product?.image_url) {
      setRemoveImage(true);
    }
    if (fileRef.current) {
      fileRef.current.value = '';
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setPendingImage(file);
      setRemoveImage(false);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

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

    const description = fd.get('description') as string;
    const body: Record<string, unknown> = { name: name.trim(), category_id, price, description: description.trim() || '', is_offer, old_price };

    const res = await fetch(`/api/admin/products${isEdit ? `/${product!.id}` : ''}`, {
      method: isEdit ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      setSaving(false);
      const data = await res.json().catch(() => null) as Record<string, string> | null;
      setError(data?.error ?? 'Error al guardar el producto.');
      return;
    }

    const saved = await res.json() as Product;

    // Handle image operations after product save
    try {
      if (pendingImage) {
        const imgFd = new FormData();
        imgFd.append('file', pendingImage);
        const imgRes = await fetch(`/api/admin/products/${saved.id}/image`, {
          method: 'POST',
          body: imgFd,
        });
        if (!imgRes.ok) {
          const data = await imgRes.json().catch(() => null) as Record<string, string> | null;
          setError(data?.error ?? 'Error al subir la imagen.');
          setSaving(false);
          return;
        }
      } else if (removeImage && isEdit) {
        const imgRes = await fetch(`/api/admin/products/${saved.id}/image`, {
          method: 'DELETE',
        });
        if (!imgRes.ok) {
          setError('Error al eliminar la imagen.');
          setSaving(false);
          return;
        }
      }
    } catch {
      setError('Error al procesar la imagen.');
      setSaving(false);
      return;
    }

    setSaving(false);
    setOffer(false);
    setOldPrice('');
    setPendingImage(null);
    setRemoveImage(false);
    setPreviewUrl(null);
    onSaved();
  }

  if (!open) return null;

  const existingImage = product?.image_url && !removeImage && !pendingImage ? product.image_url : null;
  const showPreview = previewUrl || existingImage;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} />
      <div ref={dialogRef} className="relative w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-xl bg-white p-6 shadow-2xl">
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

          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Descripción</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Descripción del producto (opcional)"
              defaultValue={product?.description ?? ''}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-800 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 resize-none"
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

          {/* Image upload */}
          <div>
            <label className="mb-1 block text-xs font-medium text-neutral-500">Imagen</label>

            {showPreview ? (
              <div className="relative mb-2 flex flex-col items-center gap-3 rounded-lg border border-neutral-200 bg-neutral-50 p-4 sm:flex-row sm:items-start">
                <img
                  src={previewUrl ?? existingImage!}
                  alt="Preview"
                  className="h-20 w-20 flex-shrink-0 rounded-lg border border-neutral-200 object-cover"
                />
                <div className="min-w-0 text-center sm:text-left">
                  <p className="text-sm font-medium text-neutral-700 truncate">
                    {pendingImage?.name ?? 'Imagen actual'}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {pendingImage ? `${(pendingImage.size / 1024).toFixed(0)} KB` : ''}
                  </p>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="mt-2 inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100 hover:cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                      <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c-.84 0-1.673.025-2.5.075V3.75c0-.69.56-1.25 1.25-1.25h2.5c.69 0 1.25.56 1.25 1.25v.325C11.673 4.025 10.84 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                    </svg>
                    Eliminar
                  </button>
                </div>
              </div>
            ) : null}

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-5 transition-colors ${
                dragOver
                  ? 'border-orange-400 bg-orange-50'
                  : 'border-neutral-300 bg-white hover:border-neutral-400 hover:bg-neutral-50'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="mb-2 h-8 w-8 text-neutral-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
              <p className="text-sm font-medium text-neutral-600">
                {dragOver ? 'Soltá la imagen aquí' : 'Hacé clic o arrastrá una imagen'}
              </p>
              <p className="mt-0.5 text-xs text-neutral-400">JPG, PNG, WebP o AVIF — máximo 5 MB</p>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

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
