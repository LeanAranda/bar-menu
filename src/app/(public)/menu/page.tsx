import type { Category, Product } from '@/lib/restaurant';
import { getRestaurantInfo, getMenu, extractSocialLinks } from '@/lib/restaurant';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const dynamic = 'force-dynamic';

export default async function MenuPage() {
  const [info, { categories, products }] = await Promise.all([
    getRestaurantInfo(),
    getMenu(),
  ]);

  const { socialLinks, email } = info ? extractSocialLinks(info) : { socialLinks: [], email: '' };

  return (
    <div className="min-h-screen bg-white">
      <Header name={info?.name ?? 'Menú'} />

      <main className="mx-auto max-w-2xl px-6 py-8">
        {categories.length === 0 ? (
          <p className="text-center text-neutral-400">El menú se está actualizando. Volvé pronto.</p>
        ) : (
          (categories as Category[]).map((category) => {
            const catProducts = (products as Product[]).filter((p) => p.category_id === category.id);

            if (catProducts.length === 0) return null;

            return (
              <section key={category.id} className="mb-10">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-px flex-1 bg-neutral-200" />
                  <h2 className="shrink-0 text-xl font-bold text-neutral-900">{category.name}</h2>
                  <div className="h-px flex-1 bg-neutral-200" />
                </div>

                <div className="divide-y divide-neutral-100">
                  {catProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-start gap-3 py-3"
                    >
                      {product.image_url && (
                        <img
                          src={product.image_url}
                          alt=""
                          className="mt-0.5 h-12 w-12 flex-shrink-0 rounded-lg border border-neutral-200 object-cover"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-semibold text-neutral-900">{product.name}</h3>
                          {product.is_offer && (
                            <span className="rounded-md bg-orange-50 px-1.5 py-0.5 text-xs font-medium text-orange-600">
                              Oferta
                            </span>
                          )}
                        </div>
                        {product.description && (
                          <p className="mt-0.5 text-sm text-neutral-500">{product.description}</p>
                        )}
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-base font-semibold text-neutral-900">
                          ${Number(product.price).toLocaleString('es-AR')}
                        </p>
                        {product.old_price && (
                          <p className="text-xs text-neutral-400 line-through">
                            ${Number(product.old_price).toLocaleString('es-AR')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })
        )}
      </main>

      <Footer socialLinks={socialLinks} email={email} />
    </div>
  );
}
