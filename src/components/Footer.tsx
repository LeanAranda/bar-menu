import type { SocialLink } from '@/lib/restaurant';

interface FooterProps {
  socialLinks?: SocialLink[];
  email?: string;
}

const iconFiles: Record<string, string> = {
  whatsapp: '/icons/icons8-whatsapp-50.png',
  instagram: '/icons/icons8-instagram-50.png',
  facebook: '/icons/icons8-facebook-50.png',
  x: '/icons/icons8-x-50.png',
  tiktok: '/icons/icons8-tik-tok-50.png',
  youtube: '/icons/icons8-youtube-50.png',
  linkedin: '/icons/icons8-linkedin-50.png',
};

function AccentIcon({ src, alt }: { src: string; alt: string }) {
  return (
    <span
      className="block h-5 w-5 flex-shrink-0"
      role="img"
      aria-label={alt}
      style={{
        backgroundColor: 'var(--accent-500)',
        maskImage: `url(${src})`,
        WebkitMaskImage: `url(${src})`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
      }}
    />
  );
}

export function Footer({ socialLinks, email }: FooterProps) {
  return (
    <footer className="bg-neutral-900">
      {(socialLinks && socialLinks.length > 0) && (
        <section className="flex flex-col items-center gap-5 px-6 pb-5 pt-9">
          <h2 className="text-lg font-bold text-white">Nuestras redes sociales</h2>
          <div className="flex max-w-[14rem] flex-wrap justify-center gap-3">
            {socialLinks.map(({ key, href }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-accent-500"
              >
                <AccentIcon src={iconFiles[key]} alt={key} />
              </a>
            ))}
          </div>
        </section>
      )}

      {email && (
        <section className="flex flex-col items-center gap-2 px-6 pb-5 pt-6">
          <h2 className="text-lg font-bold text-white">Contacto</h2>
          <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm text-neutral-400 hover:text-accent-500">
            <AccentIcon src="/icons/icons8-envelope-50.png" alt="email" />
            {email}
          </a>
        </section>
      )}

      <div className="px-6 py-6 text-center text-sm text-neutral-400">
        &copy; Copyright {"Bar Menú"} {2026}
        <br />
        Desarrollado por{' '}
        <a href="https://www.linkedin.com/in/leandroaranda/" target="_blank" rel="noopener noreferrer" className="text-accent-500 hover:underline">
          Lean Aranda
        </a>
      </div>
    </footer>
  );
}
