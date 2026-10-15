import { NextRequest, NextResponse } from 'next/server';
import { verifyEmailToken, getUserProgressByUserId } from '@/lib/db';

const APP_URL = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(`${APP_URL}/verify-email?status=missing`);
  }

  const user = verifyEmailToken(token);

  if (!user) {
    return NextResponse.redirect(`${APP_URL}/verify-email?status=invalid`);
  }

  // Email verified — now create a session and auto-log in
  const crypto = await import('crypto');
  const { default: fs } = await import('fs');
  const { default: path } = await import('path');

  const DB_FILE = path.join(process.cwd(), 'data', 'db.json');
  const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));

  const now = new Date().toISOString();
  const sessionToken = `sess_${crypto.randomBytes(32).toString('hex')}`;
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  db.sessions.push({ token: sessionToken, userId: user.id, createdAt: now, expiresAt });
  const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
  fs.writeFileSync(tmpFile, JSON.stringify(db, null, 2), 'utf-8');
  fs.renameSync(tmpFile, DB_FILE);

  const progress = db.progress.find((p: { userId: string }) => p.userId === user.id) || null;

  const response = NextResponse.redirect(`${APP_URL}/verify-email?status=success`);
  response.cookies.set({
    name: 'pa_session',
    value: sessionToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });

  return response;
}
