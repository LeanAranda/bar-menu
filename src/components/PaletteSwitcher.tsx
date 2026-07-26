'use client';

import { useState, useEffect } from 'react';

const ENABLE_PALETTE_SWITCH = true;

const palettes = ['rojo', 'naranja', 'borgona', 'esmeralda', 'indigo', 'marron'] as const;
type PaletteKey = (typeof palettes)[number];
const STORAGE_KEY = 'bar-menu-palette';

function getStoredIndex(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const idx = palettes.indexOf(stored as PaletteKey);
    return idx >= 0 ? idx : 0;
  } catch {}
  return 0;
}

function applyPalette(idx: number) {
  document.documentElement.dataset.palette = palettes[idx];
}

interface PaletteSwitcherProps {
  variant?: 'header' | 'sidebar';
}

export function PaletteSwitcher({ variant = 'header' }: PaletteSwitcherProps) {
  const [idx, setIdx] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!ENABLE_PALETTE_SWITCH) return;
    setIdx(getStoredIndex());
    setMounted(true);
  }, []);

  if (!ENABLE_PALETTE_SWITCH) return null;

  function cycle() {
    const next = (idx + 1) % palettes.length;
    setIdx(next);
    applyPalette(next);
    try { localStorage.setItem(STORAGE_KEY, palettes[next]); } catch {}
  }

  const isHeader = variant === 'header';

  return (
    <button
      onClick={cycle}
      className={`relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors ${
        isHeader ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-700'
      }`}
      aria-label="Cambiar color de tema"
      title={mounted ? palettes[idx] : undefined}
    >
      <img src="/icons/icons8-color-palette-64.png" alt="" className="h-5 w-5" />
      {mounted && (
        <span
          className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full ring-1 ring-white"
          style={{ backgroundColor: 'var(--accent-500)' }}
        />
      )}
    </button>
  );
}
