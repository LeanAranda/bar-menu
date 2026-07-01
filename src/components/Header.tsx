import Link from 'next/link';

export function Header({ name }: { name: string }) {
  return (
    <header className="bg-neutral-900 px-6 py-5">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-15 w-15 items-center justify-center">
            <img src="/logos/logo.png" alt="" className="h-full w-full object-contain" />
          </div>
          <span className="text-base font-bold text-white">{name}</span>
        </Link>

        <nav className="flex items-center gap-8 text-sm">
          <Link href="/" className="text-neutral-400 transition-colors hover:text-orange-500">
            Inicio
          </Link>
          <Link href="/menu" className="text-neutral-400 transition-colors hover:text-orange-500">
            Menú
          </Link>
        </nav>
      </div>
    </header>
  );
}
