import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET() {
  const db = getDB();
  const result = await db
    .prepare('SELECT * FROM categories ORDER BY sort_order')
    .all();
  return NextResponse.json(result.results);
}

export async function POST(request: NextRequest) {
  const { name, sort_order } = await request.json() as { name: string; sort_order?: number };

  if (!name || !name.trim()) {
    return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
  }

  const db = getDB();
  const result = await db
    .prepare('INSERT INTO categories (name, sort_order) VALUES (?, ?) RETURNING *')
    .bind(name.trim(), sort_order ?? 0)
    .first();

  return NextResponse.json(result, { status: 201 });
}
