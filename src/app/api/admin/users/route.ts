import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function POST(request: NextRequest) {
  const body = await request.json() as {
    mode: 'create' | 'update' | 'delete';
    username: string;
    newPassword?: string;
    token: string;
  };

  const { mode, username, newPassword, token } = body;

  if (!mode || !username || !token) {
    return NextResponse.json({ error: 'Faltan campos requeridos (mode, username, token)' }, { status: 400 });
  }

  if (!['create', 'update', 'delete'].includes(mode)) {
    return NextResponse.json({ error: 'mode debe ser "create", "update" o "delete"' }, { status: 400 });
  }

  if ((mode === 'create' || mode === 'update') && (!newPassword || newPassword.length < 6)) {
    return NextResponse.json({ error: 'La contraseña debe tener al menos 6 caracteres' }, { status: 400 });
  }

  const expectedToken = process.env.AUTH_CHANGE_PASSWORD_TOKEN;
  if (!expectedToken || !timingSafeEqual(token, expectedToken)) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }

  try {
    const db = getDB();

    if (mode === 'create') {
      const passwordHash = await hashPassword(newPassword!);
      const existing = await db
        .prepare('SELECT id FROM admin_users WHERE username = ?')
        .bind(username)
        .first();

      if (existing) {
        return NextResponse.json({ error: 'El usuario ya existe' }, { status: 409 });
      }

      await db
        .prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)')
        .bind(username, passwordHash)
        .run();

      return NextResponse.json({ success: true, action: 'created' });
    }

    if (mode === 'delete') {
      const existing = await db
        .prepare('SELECT id FROM admin_users WHERE username = ?')
        .bind(username)
        .first();

      if (!existing) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
      }

      const count = await db
        .prepare('SELECT COUNT(*) as count FROM admin_users')
        .first();
      const total = (count as { count: number }).count;

      if (total <= 1) {
        return NextResponse.json({ error: 'No se puede eliminar el único usuario administrador' }, { status: 409 });
      }

      await db
        .prepare('DELETE FROM admin_users WHERE username = ?')
        .bind(username)
        .run();

      return NextResponse.json({ success: true, action: 'deleted' });
    }

    // mode === 'update'
    const passwordHash = await hashPassword(newPassword!);
    const result = await db
      .prepare('UPDATE admin_users SET password_hash = ? WHERE username = ?')
      .bind(passwordHash, username)
      .run();

    if (result.meta.changes === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ success: true, action: 'updated' });
  } catch (error) {
    console.error('Error managing user:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
