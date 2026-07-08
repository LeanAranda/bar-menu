'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const links = [
  {
    href: '/admin/dashboard/products',
    label: 'Productos',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
      </svg>
    ),
  },
  {
    href: '/admin/dashboard/categories',
    label: 'Categorías',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    ),
  },
  {
    href: '/admin/dashboard/info',
    label: 'Información',
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
      </svg>
    ),
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarExpanded = expanded || mobileOpen;

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-3 z-40 flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-600 shadow-sm md:hidden"
        aria-label="Abrir menú"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Desktop overlay backdrop */}
      {expanded && (
        <div
          className="fixed inset-0 z-30 hidden bg-black/50 md:block"
          onClick={() => setExpanded(false)}
        />
      )}

      {/* Mobile overlay backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed bottom-0 left-0 top-0 z-40 flex flex-col border-r border-neutral-200 bg-white py-4 transition-all duration-200 ${
          sidebarExpanded ? 'w-56' : 'w-16'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Toggle (desktop) */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mx-auto mb-4 hidden h-7 w-7 items-center justify-center rounded-md text-neutral-800 hover:bg-neutral-100 hover:text-neutral-600 hover:cursor-pointer md:flex"
          aria-label={sidebarExpanded ? 'Contraer menú' : 'Expandir menú'}
        >
          <svg
            className="h-4 w-4 transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            style={{ transform: sidebarExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Mobile close */}
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="ml-auto mr-3 mb-4 flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 md:hidden"
            aria-label="Cerrar menú"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {links.map(({ href, label, icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => { setMobileOpen(false); setExpanded(false); }}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-orange-50 text-orange-700'
                    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-800'
                }`}
                title={sidebarExpanded ? undefined : label}
              >
                <span className="shrink-0">{icon}</span>
                <span className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${sidebarExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-neutral-100 px-3 pt-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-800 transition-colors hover:bg-neutral-100 hover:text-orange-600"
            title={sidebarExpanded ? undefined : 'Ver sitio público'}
          >
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            <span className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${sidebarExpanded ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
              Ver sitio público
            </span>
          </a>
        </div>
      </aside>
    </>
  );
}
