import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { getBucket, publicUrl } from '@/lib/r2';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

function extFromMime(mime: string): string {
  if (mime === 'image/jpeg') return 'jpg';
  if (mime === 'image/png') return 'png';
  if (mime === 'image/webp') return 'webp';
  if (mime === 'image/avif') return 'avif';
  return 'jpg';
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No se envió ningún archivo.' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'Formato no permitido. Usá JPG, PNG, WebP o AVIF.' }, { status: 400 });
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'La imagen supera los 5 MB.' }, { status: 400 });
  }

  const ext = extFromMime(file.type);
  const key = `products/${id}.${ext}`;
  const bucket = getBucket();

  const buffer = await file.arrayBuffer();
  await bucket.put(key, buffer, {
    httpMetadata: { contentType: file.type },
  });

  const url = `${publicUrl(key)}?v=${Date.now()}`;
  const db = getDB();
  await db.prepare('UPDATE products SET image_url = ? WHERE id = ?').bind(url, Number(id)).run();

  return NextResponse.json({ image_url: url });
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDB();
  const product = await db
    .prepare('SELECT image_url FROM products WHERE id = ?')
    .bind(Number(id))
    .first() as { image_url: string | null } | null;

  if (!product) {
    return NextResponse.json({ error: 'Producto no encontrado.' }, { status: 404 });
  }

  if (product.image_url) {
    const key = product.image_url.replace('/api/images/', '');
    const bucket = getBucket();
    await bucket.delete(key);
  }

  await db.prepare('UPDATE products SET image_url = NULL WHERE id = ?').bind(Number(id)).run();

  return NextResponse.json({ success: true });
}
