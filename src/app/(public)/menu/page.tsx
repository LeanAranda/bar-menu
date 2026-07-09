import { getRestaurantInfo, getMenu, extractSocialLinks } from '@/lib/restaurant';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import MenuClient from '@/components/MenuClient';

export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  const [info, { categories, products }] = await Promise.all([
    getRestaurantInfo(),
    getMenu(),
  ]);

  const { socialLinks, email } = info ? extractSocialLinks(info) : { socialLinks: [], email: '' };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header name={info?.name ?? 'Menú'} />

      <main className="flex-1">
        {categories.length === 0 ? (
          <p className="mx-auto max-w-5xl px-6 py-8 text-center text-neutral-400">El menú se está actualizando. Volvé pronto.</p>
        ) : (
          <MenuClient categories={categories} products={products} />
        )}
      </main>

      <Footer socialLinks={socialLinks} email={email} />
    </div>
  );
}
