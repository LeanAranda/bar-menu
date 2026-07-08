import { NextRequest, NextResponse } from 'next/server';
import { getBucket } from '@/lib/r2';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key } = await params;
  const bucket = getBucket();
  const object = await bucket.get(key.join('/'));

  if (!object) {
    return new NextResponse(null, { status: 404 });
  }

  const headers = new Headers();
  if (object.httpMetadata?.contentType) {
    headers.set('Content-Type', object.httpMetadata.contentType);
  }
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');

  return new NextResponse(object.body as ReadableStream, { headers });
}
