import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function GET(request: NextRequest) {
  const db = getDB();
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('category_id');

  let query = 'SELECT * FROM products';
  const values: (string | number)[] = [];

  if (categoryId) {
    query += ' WHERE category_id = ?';
    values.push(Number(categoryId));
  }

  query += ' ORDER BY category_id, sort_order';

  const result = await db.prepare(query).bind(...values).all();
  return NextResponse.json(result.results);
}

export async function POST(request: NextRequest) {
  const { category_id, name, description, price, old_price, is_offer, available, featured } =
    await request.json() as {
      category_id: number;
      name: string;
      description?: string;
      price: number;
      old_price?: number | null;
      is_offer?: boolean;
      available?: boolean;
      featured?: boolean;
    };

  if (!name?.trim()) {
    return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
  }

  const db = getDB();

  const row = await db
    .prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM products WHERE category_id = ?')
    .bind(category_id)
    .first() as { next_order: number };

  const result = await db
    .prepare(
      `INSERT INTO products (category_id, name, description, price, old_price, is_offer, available, featured, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`
    )
    .bind(
      category_id,
      name.trim(),
      description ?? null,
      price,
      old_price ?? null,
      is_offer ? 1 : 0,
      available !== false ? 1 : 0,
      featured ? 1 : 0,
      row.next_order
    )
    .first();

  return NextResponse.json(result);
}
