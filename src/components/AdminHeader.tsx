export function AdminHeader() {
  return (
    <header className="border-b border-neutral-200 bg-white px-6 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between pl-10 md:pl-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center">
            <img src="/logos/logo.png" alt="Logo" className="h-full w-full object-contain" />
          </div>
          <a href="/admin/dashboard" className="text-lg font-bold text-neutral-800">Tablero principal</a>
        </div>
        <div className="flex items-center gap-4">
          <form action="/api/auth/logout" method="POST">
            <button className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm text-neutral-600 transition-colors hover:bg-neutral-100">
              Cerrar sesión
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
