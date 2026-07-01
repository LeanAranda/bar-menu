export function FooterAdmin() {
  return (
    <footer className="border-t border-neutral-200 bg-white px-6 py-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between text-sm">
        <p className="text-neutral-400">
          &copy; Copyright {"Bar Menú"} {2026}
        </p>
        <p className="text-neutral-400">
          Desarrollado por{' '}
          <a href="https://www.linkedin.com/in/leandroaranda/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">
            Lean Aranda
          </a>
        </p>
      </div>
    </footer>
  );
}