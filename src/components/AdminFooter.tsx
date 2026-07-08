export function AdminFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white px-6 py-6 md:pl-[88px]">
      <div className="mx-auto flex flex-col items-center gap-1 text-center text-sm 
        md:flex-row md:justify-between md:text-left">
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