import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name, sort_order, active } = await request.json() as { name?: string; sort_order?: number; active?: boolean };

  const db = getDB();

  const updates: string[] = [];
  const values: (string | number)[] = [];

  if (name !== undefined) {
    if (!name.trim()) {
      return NextResponse.json({ error: 'El nombre no puede estar vacío' }, { status: 400 });
    }
    updates.push('name = ?');
    values.push(name.trim());
  }
  if (sort_order !== undefined) {
    updates.push('sort_order = ?');
    values.push(sort_order);
  }
  if (active !== undefined) {
    updates.push('active = ?');
    values.push(active ? 1 : 0);
  }

  if (updates.length === 0) {
    return NextResponse.json({ error: 'No hay campos para actualizar' }, { status: 400 });
  }

  values.push(Number(id));

  const result = await db
    .prepare(`UPDATE categories SET ${updates.join(', ')} WHERE id = ? RETURNING *`)
    .bind(...values)
    .first();

  if (!result) {
    return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
  }

  return NextResponse.json(result);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = getDB();

  const cat = await db
    .prepare('SELECT id, name FROM categories WHERE id = ?')
    .bind(Number(id))
    .first<{ id: number; name: string }>();

  if (!cat) {
    return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 });
  }

  if (cat.name === 'Sin categoría') {
    return NextResponse.json({ error: 'No se puede eliminar la categoría "Sin categoría"' }, { status: 400 });
  }

  // Find or create "Sin categoría"
  let uncategorized = await db
    .prepare("SELECT id FROM categories WHERE name = 'Sin categoría' LIMIT 1")
    .first<{ id: number }>();

  if (!uncategorized) {
    uncategorized = await db
      .prepare("INSERT INTO categories (name, sort_order) VALUES ('Sin categoría', 9999) RETURNING id")
      .first<{ id: number }>();
  }

  // Move products to "Sin categoría"
  await db
    .prepare('UPDATE products SET category_id = ? WHERE category_id = ?')
    .bind(uncategorized!.id, Number(id))
    .run();

  // Delete the category
  await db
    .prepare('DELETE FROM categories WHERE id = ?')
    .bind(Number(id))
    .run();

  return NextResponse.json({ success: true });
}
