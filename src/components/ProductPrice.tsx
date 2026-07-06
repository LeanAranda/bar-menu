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
    <>
      <span>$ {Number(price).toLocaleString('es-AR')}</span>
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
    </>
  );
}
