import type { Category, Product } from '@/lib/restaurant';
import MenuProductCard from '@/components/MenuProductCard';
import MenuProductCardGrid from '@/components/MenuProductCardGrid';

export default function MenuCategorySection({
  category,
  products,
  sectionId,
  view = 'list',
}: {
  category: Category;
  products: Product[];
  sectionId?: string;
  view?: 'list' | 'grid';
}) {
  const catProducts = products.filter((p) => p.category_id === category.id);

  if (catProducts.length === 0) return null;

  return (
    <section id={sectionId} className="mb-14">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-0.5 flex-1 bg-neutral-300" />
        <h2 className="shrink-0 text-2xl font-bold tracking-wide text-neutral-900">{category.name}</h2>
        <div className="h-0.5 flex-1 bg-neutral-300" />
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {catProducts.map((product) => (
            <MenuProductCardGrid key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {catProducts.map((product) => (
            <MenuProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
