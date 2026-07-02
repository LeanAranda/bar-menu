'use client';

import { useEffect, useState, FormEvent } from 'react';

interface InfoData {
  name: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
  instagram: string;
  facebook: string;
  x: string;
  tiktok: string;
  linkedin: string;
  whatsapp: string;
  youtube: string;
  email: string;
}

const mainFields: { key: keyof InfoData; label: string; type?: string }[] = [
  { key: 'name', label: 'Título' },
  { key: 'description', label: 'Descripción' },
  { key: 'address', label: 'Dirección' },
  { key: 'phone', label: 'Teléfono' },
  { key: 'hours', label: 'Horarios' },
  { key: 'email', label: 'Correo electrónico', type: 'email' },
];

const socialFields: { key: keyof InfoData; label: string }[] = [
  { key: 'whatsapp', label: 'WhatsApp' },
  { key: 'instagram', label: 'Instagram' },
  { key: 'facebook', label: 'Facebook' },
  { key: 'x', label: 'X (Twitter)' },
  { key: 'tiktok', label: 'TikTok' },
  { key: 'youtube', label: 'YouTube' },
  { key: 'linkedin', label: 'LinkedIn' },
];

export default function InfoPage() {
  const [data, setData] = useState<InfoData | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [socialOpen, setSocialOpen] = useState(false);

  useEffect(() => {
    fetch('/api/admin/info')
      .then((r) => r.json())
      .then((d) => setData(d as InfoData))
      .catch(() => { });
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch('/api/admin/info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Información guardada correctamente.' });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const err = await res.json() as { error?: string };
        setMessage({ type: 'error', text: err.error || 'Error al guardar.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error de conexión.' });
    } finally {
      setSaving(false);
    }
  }

  if (!data) {
    return <p className="text-neutral-500">Cargando...</p>;
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-neutral-800 text-center">Información del restaurante</h1>

      {message && (
        <div
          className={`mb-4 rounded-lg border px-4 py-3 text-sm ${message.type === 'success'
              ? 'border-green-200 bg-green-50 text-green-700'
              : 'border-red-200 bg-red-50 text-red-700'
            }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mainFields.map(({ key, label, type }) => (
          <div key={key}>
            <label className="mb-1 block text-sm font-medium text-neutral-700">{label}</label>
            {key === 'description' || key === 'hours' ? (
              <textarea
                value={data[key]}
                onChange={(e) => setData({ ...data, [key]: e.target.value })}
                rows={3}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-800 outline-none transition-colors focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              />
            ) : (
              <input
                type={type || 'text'}
                value={data[key]}
                onChange={(e) => setData({ ...data, [key]: e.target.value })}
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-800 outline-none transition-colors focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
              />
            )}
          </div>
        ))}

        <div className="border-t border-neutral-200 pt-4">
          <button
            type="button"
            onClick={() => setSocialOpen(!socialOpen)}
            className="flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-800 hover:cursor-pointer"
          >
            <svg
              className="h-4 w-4 transition-transform duration-200"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              style={{ transform: socialOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
            <p className="text-sm font-medium text-black">Redes sociales</p> <span className="text-neutral-500 font-normal">(opcional)</span>
          </button>

          {socialOpen && (
            <div className="mt-4 space-y-4">
              {socialFields.map(({ key, label }) => (
                <div key={key}>
                  <label className="mb-1 block text-sm font-medium text-neutral-700">{label}</label>
                  <input
                    type="text"
                    value={data[key]}
                    onChange={(e) => setData({ ...data, [key]: e.target.value })}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm text-neutral-800 outline-none transition-colors focus:border-orange-400 focus:ring-1 focus:ring-orange-400"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-center pt-4 ">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-500 hover:cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>
    </div>
  );
}
