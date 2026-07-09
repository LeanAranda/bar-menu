import type { Product } from '@/lib/restaurant';

export default function MenuProductCardGrid({ product }: { product: Product }) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-sm transition-shadow hover:shadow-md">
      {!!product.is_offer && (
        <span className="absolute right-2 top-2 z-10 rounded-md bg-orange-600 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
          Oferta
        </span>
      )}
      {!!product.image_url ? (
        <div className="aspect-[4/3] w-full overflow-hidden bg-neutral-100">
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] w-full bg-neutral-100" />
      )}
      <div className="flex flex-1 flex-col justify-between gap-1 p-3">
        <h3 className="text-sm font-semibold text-neutral-900">{product.name}</h3>
        {!!product.description && (
          <p className="text-xs leading-relaxed text-neutral-500 line-clamp-2">{product.description}</p>
        )}
        {product.old_price !== null && product.old_price !== undefined ? (
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-neutral-400 line-through">
              ${Number(product.old_price).toLocaleString('es-AR')}
            </span>
            <span className="text-sm font-bold text-orange-600">
              ${Number(product.price).toLocaleString('es-AR')}
            </span>
          </div>
        ) : (
          <span className="text-sm font-bold text-neutral-900">
            ${Number(product.price).toLocaleString('es-AR')}
          </span>
        )}
      </div>
    </div>
  );
}
