'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Category, Product } from '@/lib/restaurant';
import MenuCategorySection from '@/components/MenuCategorySection';

const STORAGE_KEY = 'menu-view';

export default function MenuClient({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'list' | 'grid'>('list');
  const [mounted, setMounted] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'list' || saved === 'grid') {
      setView(saved);
    } else {
      setView(window.innerWidth >= 768 ? 'grid' : 'list');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) localStorage.setItem(STORAGE_KEY, view);
  }, [view, mounted]);

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
    );
  }, [search, products]);

  const nonEmptyCategories = useMemo(
    () => categories.filter((c) => products.some((p) => p.category_id === c.id)),
    [categories, products]
  );

  const visibleCategories = useMemo(
    () => nonEmptyCategories.filter((c) => filtered.some((p) => p.category_id === c.id)),
    [nonEmptyCategories, filtered]
  );

  function scrollToCategory(catId: number) {
    const el = document.getElementById(`cat-${catId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    if (!val) return;
    scrollToCategory(Number(val));
    e.target.value = '';
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
  }

  return (
    <>
      <div className="bg-neutral-900 px-6 pb-4 pt-3 mb-10 shadow-lg">
        <div className="mx-auto max-w-5xl">
          <div className="relative mb-3">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Buscar en el menú..."
              className="w-full rounded-xl border border-neutral-700 bg-neutral-800 py-2.5 pl-10 pr-10 text-sm text-white placeholder-neutral-400 outline-none transition-all focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40"
            />
            {search.trim() && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-neutral-400 transition-colors hover:bg-neutral-700 hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <select
              ref={selectRef}
              onChange={handleSelectChange}
              defaultValue=""
              className="flex-1 rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-sm text-white outline-none transition-all 
              focus:border-orange-500 focus:ring-2 focus:ring-orange-500/40 hover:cursor-pointer"
            >
              <option value="" disabled>Ir a categoría...</option>
              {nonEmptyCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setView(view === 'list' ? 'grid' : 'list')}
              className="rounded-xl border border-neutral-700 bg-neutral-800 px-3 py-2.5 text-sm text-white transition-colors 
              hover:cursor-pointer hover:border-orange-500 hover:text-orange-400"
              title={view === 'list' ? 'Vista cuadrícula' : 'Vista lista'}
            >
              {view === 'list' ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM3.75 12h.007v.008H3.75V12Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm-.375 5.25h.007v.008H3.75v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                </svg>
              )}
            </button>
          </div>

          {search.trim() && (
            <p className="mt-2 text-xs text-orange-400 font-medium">
              {visibleCategories.length > 0
                ? `${filtered.length} producto${filtered.length !== 1 ? 's' : ''} encontrado${filtered.length !== 1 ? 's' : ''}`
                : 'Sin resultados'}
            </p>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-8">
        {visibleCategories.length === 0 ? (
          <p className="mt-8 text-center text-sm text-neutral-400">
            No se encontraron resultados para &quot;{search}&quot;
          </p>
        ) : (
          visibleCategories.map((cat) => (
            <MenuCategorySection
              key={cat.id}
              category={cat}
              products={filtered}
              sectionId={`cat-${cat.id}`}
              view={view}
            />
          ))
        )}
      </div>
    </>
  );
}
