import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/admin/login', request.url), 302);
  response.cookies.set('auth_token', '', { maxAge: 0, path: '/' });
  return response;
}