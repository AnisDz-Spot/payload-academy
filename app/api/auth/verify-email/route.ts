import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailToken, createSessionForUser } from '@/lib/db';

const APP_URL = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(`${APP_URL}/verify-email?status=missing`);
  }

  const user = await verifyEmailToken(token);

  if (!user) {
    return NextResponse.redirect(`${APP_URL}/verify-email?status=invalid`);
  }

  // Email verified — now create a session and auto-log in
  const session = await createSessionForUser(user.id);

  const response = NextResponse.redirect(`${APP_URL}/verify-email?status=success`);
  response.cookies.set({
    name: 'pa_session',
    value: session.token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });

  return response;
}
