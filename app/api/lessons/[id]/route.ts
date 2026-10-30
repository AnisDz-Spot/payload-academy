// GET /api/lessons/[id]
//
// The only way the interactive app loads lesson bodies. Content is never
// shipped to the browser in the client bundle, so the Pro paywall is enforced
// here instead of in the UI: free lessons are public, Pro lessons require a
// session whose database row says `is_pro = true` (or an admin role).

import { NextRequest, NextResponse } from 'next/server';
import { LESSONS } from '@/data/lessons';
import { getSessionUser, type DbUser } from '@/lib/db';
import { canAccessLesson } from '@/lib/entitlements';

export const runtime = 'nodejs';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const index = LESSONS.findIndex((l) => l.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
  }

  const lesson = LESSONS[index];
  const l = lesson; // alias for inline use

  let user: DbUser | null = null;
  const token = req.cookies.get('pa_session')?.value;
  if (token) {
    try {
      const session = await getSessionUser(token);
      user = session?.user ?? null;
    } catch (err) {
      // A database outage should not leak Pro content; fall through as guest.
      console.error('[lessons] session lookup failed', err);
    }
  }

  if (!canAccessLesson(user, index)) {
    return NextResponse.json(
      {
        error: 'This lesson is part of Academy Pro.',
        code: 'PRO_REQUIRED',
        id: lesson.id,
        title: lesson.t,
        module: lesson.m,
      },
      { status: 403, headers: { 'Cache-Control': 'private, no-store' } },
    );
  }

  return NextResponse.json(
    { id: lesson.id, c: lesson.c },
    { headers: { 'Cache-Control': 'private, no-store' } },
  );
}
