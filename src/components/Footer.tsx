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

const orangeFilter = 'brightness(0) saturate(100%) invert(47%) sepia(98%) saturate(1516%) hue-rotate(347deg) brightness(98%) contrast(94%)';

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
                className="flex h-11 w-11 items-center justify-center rounded-full border border-orange-500"
              >
                <img
                  src={iconFiles[key]}
                  alt={key}
                  className="h-5 w-5"
                  style={{ filter: orangeFilter }}
                />
              </a>
            ))}
          </div>
        </section>
      )}

      {email && (
        <section className="flex flex-col items-center gap-2 px-6 pb-5 pt-6">
          <h2 className="text-lg font-bold text-white">Contacto</h2>
          <a href={`mailto:${email}`} className="flex items-center gap-2 text-sm text-neutral-400 hover:text-orange-500">
            <img
              src={'/icons/icons8-envelope-50.png'}
              alt={"email"}
              className="h-5 w-5"
              style={{ filter: orangeFilter }}
            />
            {email}
          </a>
        </section>
      )}

      <div className="px-6 py-6 text-center text-sm text-neutral-400">
        &copy; Copyright {"Bar Menú"} {2026}
        <br />
        Desarrollado por{' '}
        <a href="https://www.linkedin.com/in/leandroaranda/" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline">
          Lean Aranda
        </a>
      </div>
    </footer>
  );
}
