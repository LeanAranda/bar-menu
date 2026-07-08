'use client';

export default function ProductPrice({
  price,
  oldPrice,
  isOffer,
}: {
  price: number;
  oldPrice: number | null;
  isOffer: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-md font-bold text-neutral-800">
        $ {Number(price).toLocaleString('es-AR')}
      </span>
      {isOffer && oldPrice != null && (
        <span className="text-xs text-neutral-400 line-through">
          $ {Number(oldPrice).toLocaleString('es-AR')}
        </span>
      )}
      {isOffer && (
        <span className="rounded bg-orange-50 px-1.5 py-0.5 text-xs font-medium text-orange-600">
          Oferta
        </span>
      )}
    </div>
  );
}
