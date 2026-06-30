import { NextRequest, NextResponse } from 'next/server';
import { getDB } from '@/lib/db';
import { verifyPassword, createToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const { username, password } = await request.json() as { username: string; password: string };

  if (!username || !password) {
    return NextResponse.json({ error: 'Se requieren nombre de usuario y contraseña' }, { status: 400 });
  }

  try {
    const db = getDB();
    const result = await db
      .prepare('SELECT id, username, password_hash FROM admin_users WHERE username = ?')
      .bind(username)
      .first();

    if (!result) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    const valid = await verifyPassword(password, result.password_hash as string);
    if (!valid) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 });
    }

    await db
      .prepare("UPDATE admin_users SET last_login = datetime('now') WHERE id = ?")
      .bind(result.id)
      .run();

    const token = await createToken({ sub: result.id as number, username: result.username as string });

    const response = NextResponse.json({ success: true });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
