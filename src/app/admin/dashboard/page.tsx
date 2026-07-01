export default function AdminDashboard() {
  // <h1 className="mb-8 text-3xl font-bold text-neutral-800">Dashboard</h1>
  return (
    <div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <a
          href="/admin/categories"
          className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-6 transition-colors hover:border-neutral-400"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
            <svg className="h-5 w-5 text-neutral-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-800">Categorías</h2>
            <p className="mt-1 text-sm text-neutral-500">Gestioná las categorías del menú</p>
          </div>
        </a>

        <a
          href="/admin/products"
          className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-6 transition-colors hover:border-neutral-400"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
            <svg className="h-5 w-5 text-neutral-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-800">Productos</h2>
            <p className="mt-1 text-sm text-neutral-500">Administrá los platos y bebidas</p>
          </div>
        </a>

        <a
          href="/admin/info"
          className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-6 transition-colors hover:border-neutral-400"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
            <svg className="h-5 w-5 text-neutral-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-neutral-800">Información</h2>
            <p className="mt-1 text-sm text-neutral-500">Acerca de la aplicación</p>
          </div>
        </a>
      </div>

      <div className="mt-10 flex justify-center">
        <a
          href="/"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-6 py-3 text-sm font-medium text-neutral-600 transition-colors hover:border-orange-400 hover:text-orange-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
          Ver sitio público
        </a>
      </div>
    </div>
  );
}
