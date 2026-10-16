import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailToken, createSessionForUser } from '@/lib/db';

function resolveAppUrl(req: NextRequest): string {
  const explicit = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) return explicit.replace(/\/+$/, '');
  // Fall back to the host the request actually arrived on (correct on Vercel),
  // so this never points at localhost in production.
  return req.nextUrl.origin;
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  const appUrl = resolveAppUrl(req);

  if (!token) {
    return NextResponse.redirect(`${appUrl}/verify-email?status=missing`);
  }

  const user = await verifyEmailToken(token);

  if (!user) {
    return NextResponse.redirect(`${appUrl}/verify-email?status=invalid`);
  }

  // Email verified — now create a session and auto-log in
  const session = await createSessionForUser(user.id);

  const response = NextResponse.redirect(`${appUrl}/verify-email?status=success`);
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
