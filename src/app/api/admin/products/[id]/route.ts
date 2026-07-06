import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json() as {
    name?: string;
    description?: string | null;
    price?: number;
    old_price?: number | null;
    is_offer?: boolean;
    available?: boolean;
    featured?: boolean;
    sort_order?: number;
    category_id?: number;
  };

  const db = getDB();

  // When category changes, auto-assign sort_order at the end of the new category
  if (body.category_id !== undefined && body.sort_order === undefined) {
    const current = await db
      .prepare('SELECT category_id FROM products WHERE id = ?')
      .bind(Number(id))
      .first() as { category_id: number } | null;

    if (current && current.category_id !== body.category_id) {
      const row = await db
        .prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM products WHERE category_id = ?')
        .bind(body.category_id)
        .first() as { next_order: number };
      body.sort_order = row.next_order;
    }
  }

  const updates: string[] = [];
  const values: (string | number | null)[] = [];

  if (body.name !== undefined) {
    if (!body.name.trim()) {
      return NextResponse.json({ error: 'El nombre no puede estar vacío' }, { status: 400 });
    }
    updates.push('name = ?');
    values.push(body.name.trim());
  }
  if (body.description !== undefined) {
    updates.push('description = ?');
    values.push(body.description);
  }
  if (body.price !== undefined) {
    updates.push('price = ?');
    values.push(body.price);
  }
  if (body.old_price !== undefined) {
    updates.push('old_price = ?');
    values.push(body.old_price);
  }
  if (body.is_offer !== undefined) {
    updates.push('is_offer = ?');
    values.push(body.is_offer ? 1 : 0);
  }
  if (body.available !== undefined) {
    updates.push('available = ?');
    values.push(body.available ? 1 : 0);
  }
  if (body.featured !== undefined) {
    updates.push('featured = ?');
    values.push(body.featured ? 1 : 0);
  }
  if (body.sort_order !== undefined) {
    updates.push('sort_order = ?');
    values.push(body.sort_order);
  }
  if (body.category_id !== undefined) {
    updates.push('category_id = ?');
    values.push(body.category_id);
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: 'No hay campos para actualizar' }, { status: 400 });
  }

  values.push(Number(id));

  const result = await db
    .prepare(`UPDATE products SET ${updates.join(', ')} WHERE id = ? RETURNING *`)
    .bind(...values)
    .first();

  if (!result) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
  }

  return NextResponse.json(result);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDB();

  const result = await db
    .prepare('DELETE FROM products WHERE id = ? RETURNING id')
    .bind(Number(id))
    .first();

  if (!result) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
