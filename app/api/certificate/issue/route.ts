import { NextRequest, NextResponse } from 'next/server';
import { createCertificate, getSessionUser } from '@/lib/db';
import { LESSONS } from '@/data/lessons';
import { rateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';

const RATE_LIMIT_MAX = 10;
const RATE_LIMIT_WINDOW_MS = 60_000;

export async function POST(req: NextRequest) {
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

  const token = req.cookies.get('pa_session')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Sign in to claim your verified certificate.' }, { status: 401 });
  }

  const session = await getSessionUser(token);
  if (!session) {
    return NextResponse.json({ error: 'Session expired. Please sign in again.' }, { status: 401 });
  }

  const limit = rateLimit(`cert:${session.user.id}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } },
    );
  }

  const { user, progress } = session;
  const completedLessons = Object.keys(progress.completedLessons || {}).length;
  const examScore = progress.examScore ?? null;

  const allLessonsComplete = completedLessons >= LESSONS.length;
  const passedExam = examScore !== null && examScore >= 80;
  const eligible = user.role === 'admin' || (user.isPro && allLessonsComplete && passedExam);

  if (!eligible) {
    return NextResponse.json(
      {
        error:
          'Not eligible for certification yet. Complete all lessons, pass every quiz, and score 80%+ on the Final Exam.',
        completedLessons,
        totalLessons: LESSONS.length,
        examScore,
      },
      { status: 403 },
    );
  }

  let body: { name?: unknown } = {};
  try {
    body = (await req.json()) as { name?: unknown };
  } catch {
    body = {};
  }
  const requestedName =
    typeof body.name === 'string' && body.name.trim() ? body.name.trim().slice(0, 80) : user.name;
  const score = examScore ?? (user.role === 'admin' ? 100 : 0);

  try {
    const cert = await createCertificate({
      userId: user.id,
      recipientName: requestedName,
      recipientEmail: user.email,
      score,
    });
    return NextResponse.json({
      id: cert.id,
      recipientName: cert.recipientName,
      score: cert.score,
      issuedOn: cert.issuedAt,
      verifyUrl: `/verify/${cert.id}`,
      badgeUrl: `/api/badges/${cert.id}`,
    });
  } catch (err) {
    console.error('[certificate/issue] failed', err);
    return NextResponse.json({ error: 'Could not issue certificate.' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Use POST to claim a certificate.' }, { status: 405 });
}
