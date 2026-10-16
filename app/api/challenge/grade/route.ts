import { NextRequest, NextResponse } from 'next/server';
import { gradeChallenge } from '@/lib/challengeGrading';
import { getSessionUser } from '@/lib/db';
import { rateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';

const MAX_CODE_LENGTH = 20000;
const RATE_LIMIT_MAX = 40;
const RATE_LIMIT_WINDOW_MS = 60_000;

export async function POST(req: NextRequest) {
  // 1. Same-origin enforcement (blocks casual cross-site abuse).
  const origin = req.headers.get('origin');
  const host = req.headers.get('host');
  if (origin && host) {
    let originHost: string;
    try {
      originHost = new URL(origin).host;
    } catch {
      return NextResponse.json({ error: 'Invalid Origin header' }, { status: 403 });
    }
    if (originHost !== host) {
      return NextResponse.json({ error: 'Cross-origin requests are not allowed' }, { status: 403 });
    }
  }

  // 2. Authentication is required to run graded challenges.
  const sessionToken = req.cookies.get('pa_session')?.value;
  if (!sessionToken) {
    return NextResponse.json(
      { error: 'Sign in to run graded challenges.' },
      { status: 401 },
    );
  }

  let session;
  try {
    session = await getSessionUser(sessionToken);
  } catch (err) {
    console.error('[challenge/grade] session lookup failed', err);
    return NextResponse.json({ error: 'Grading service temporarily unavailable.' }, { status: 503 });
  }

  if (!session) {
    return NextResponse.json(
      { error: 'Your session has expired. Please sign in again.' },
      { status: 401 },
    );
  }

  // 3. Rate limiting — one bucket per authenticated user.
  const limitKey = `user:${session.user.id}`;
  const limit = rateLimit(limitKey, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many grading requests. Please slow down.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } },
    );
  }

  // 4. Parse and validate the payload.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { lessonId, code } = (body || {}) as { lessonId?: unknown; code?: unknown };

  if (typeof lessonId !== 'string' || typeof code !== 'string') {
    return NextResponse.json(
      { error: 'Expected { lessonId: string, code: string }' },
      { status: 400 },
    );
  }

  if (lessonId.length > 120) {
    return NextResponse.json({ error: 'Invalid lessonId' }, { status: 400 });
  }

  if (code.length > MAX_CODE_LENGTH) {
    return NextResponse.json(
      { error: `Code exceeds the ${MAX_CODE_LENGTH} character limit.` },
      { status: 413 },
    );
  }

  try {
    const result = gradeChallenge(lessonId, code);
    return NextResponse.json(result);
  } catch (err) {
    console.error('[challenge/grade] failed', err);
    return NextResponse.json({ error: 'Grading failed unexpectedly.' }, { status: 500 });
  }
}
