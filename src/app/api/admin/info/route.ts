import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';

async function checkAuth(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('auth_token')?.value;
  if (!token) return false;
  try {
    const { jwtVerify } = await import('jose');
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET || '');
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function GET() {
  const db = getDB();
  const result = await db.prepare('SELECT * FROM restaurant_info LIMIT 1').first();
  return NextResponse.json(result || {});
}

export async function PUT(request: NextRequest) {
  if (!(await checkAuth(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const body = await request.json() as Record<string, string>;
  const db = getDB();

  const allowed = [
    'name', 'description', 'address', 'phone', 'hours',
    'instagram', 'facebook', 'x', 'tiktok', 'linkedin',
    'whatsapp', 'youtube', 'email',
  ];

  const updates = allowed.filter((k) => k in body);
  if (updates.length === 0) {
    return NextResponse.json({ error: 'No hay campos para actualizar' }, { status: 400 });
  }

  const setClause = updates.map((k) => `${k} = ?`).join(', ');
  const values = updates.map((k) => body[k]);
  values.push(new Date().toISOString());

  try {
    await db
      .prepare(`UPDATE restaurant_info SET ${setClause}, updated_at = ? WHERE id = 1`)
      .bind(...values)
      .run();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating restaurant info:', error);
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 });
  }
}
