import Link from 'next/link';
import { getRestaurantInfo, extractSocialLinks } from '@/lib/restaurant';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const info = await getRestaurantInfo();

  if (!info) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-neutral-500">Cargando...</p>
      </div>
    );
  }

  const { socialLinks, email } = extractSocialLinks(info);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header name={info.name} />

      <main className="flex-1">
        <section className="relative flex flex-col items-center px-6 pb-16 pt-20 text-center">
          <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/background/background.jpg')" }}
          />
          <div className="absolute inset-0 z-[1] bg-black/70" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center">
              <img src="/logos/logo.png" alt={info.name} className="h-full w-full object-contain" />
            </div>

            <h1 className="bar-menu-title mb-3 text-5xl font-bold tracking-tight text-white sm:text-5xl">
              {info.name}
            </h1>

            <p className="mb-10 max-w-md text-lg text-neutral-200 whitespace-pre-line">
              {info.description}
            </p>

            <Link
              href="/menu"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-8 py-3.5 text-base font-semibold text-white transition-colors hover:bg-orange-500"
            >
              Ver menú
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-lg space-y-4 px-6 pb-18 pt-15">

          <div className="flex items-start gap-4 border-b border-neutral-100 pb-4">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50">
              <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">Teléfono</p>
              <a href={`tel:${info.phone}`} className="text-sm text-neutral-500 hover:text-neutral-700">{info.phone}</a>
            </div>
          </div>

          <div className="flex items-start gap-4 border-b border-neutral-100 pb-4">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50">
              <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">Horarios</p>
              <p className="text-sm text-neutral-500 whitespace-pre-line">{info.hours}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-orange-50">
              <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">Dirección</p>
              <p className="text-sm text-neutral-500">{info.address}</p>
            </div>
          </div>

        </section>

        <div className="mx-auto mb-18 h-[400px] max-w-4xl overflow-hidden rounded-xl border border-neutral-100">
          <iframe src={"https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1459.440444945965!2d-58.33503934770991!3d-34.79756486711761!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95a32dce21ffcd57%3A0xf28e19a7a4b40ec9!2sPlaza%20de%20la%20Copa!5e0!3m2!1ses-419!2sar!4v1783105453430!5m2!1ses-419!2sar"}
           className="w-full h-full"  
           allowFullScreen={false} loading="lazy" referrerPolicy="strict-origin-when-cross-origin">
           </iframe>
        </div>

      </main>

      <Footer socialLinks={socialLinks} email={email} />
    </div>
  );
}
