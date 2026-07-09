import type { Product } from '@/lib/restaurant';

export default function MenuProductCard({ product }: { product: Product }) {
  return (
    <div className="relative flex items-start gap-4 rounded-xl border border-neutral-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
      {!!product.is_offer && (
        <span className="absolute -right-1.5 -top-1.5 rounded-md bg-orange-600 px-2 py-0.5 text-xs font-semibold text-white shadow-sm">
          Oferta
        </span>
      )}
      {!!product.image_url && (
        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-neutral-200">
          <img
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <h3 className="text-base font-semibold text-neutral-900">{product.name}</h3>
        {!!product.description && (
          <p className="text-sm leading-relaxed text-neutral-500">{product.description}</p>
        )}
      </div>

      <div className="shrink-0 text-right">
        {product.old_price !== null && product.old_price !== undefined ? (
          <div className="flex flex-col items-end">
            <span className="text-sm text-neutral-400 line-through">
              ${Number(product.old_price).toLocaleString('es-AR')}
            </span>
            <span className="text-xl font-bold text-orange-600">
              ${Number(product.price).toLocaleString('es-AR')}
            </span>
          </div>
        ) : (
          <span className="text-xl font-bold text-neutral-900">
            ${Number(product.price).toLocaleString('es-AR')}
          </span>
        )}
      </div>
    </div>
  );
}
