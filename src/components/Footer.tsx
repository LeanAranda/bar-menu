export function Footer({ name }: { name: string }) {
  return (
    <footer className="bg-neutral-900 border-t border-neutral-200 px-6 py-6 text-center text-sm text-neutral-400">
      {name} &copy; {new Date().getFullYear()} / Desarrollado por <a href="https://www.linkedin.com/in/leandroaranda/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">
        Lean Aranda
      </a>
    </footer>
  );
}
