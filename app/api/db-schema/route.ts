import { NextRequest, NextResponse } from 'next/server';
import { parsePayloadSchema } from '@/lib/schemaParser';
import { getClientIp, rateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';

const MAX_CODE_LENGTH = 40000;
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_WINDOW_MS = 60_000;

export async function POST(req: NextRequest) {
  // Same-origin enforcement.
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

  // Public tool: rate limit by client IP only (no login required).
  const limit = rateLimit(`db:${getClientIp(req)}`, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { code } = (body || {}) as { code?: unknown };
  if (typeof code !== 'string') {
    return NextResponse.json({ error: 'Expected { code: string }' }, { status: 400 });
  }
  if (code.length > MAX_CODE_LENGTH) {
    return NextResponse.json(
      { error: `Code exceeds the ${MAX_CODE_LENGTH} character limit.` },
      { status: 413 },
    );
  }

  try {
    return NextResponse.json(parsePayloadSchema(code));
  } catch (err) {
    console.error('[db-schema] failed', err);
    return NextResponse.json({ error: 'Schema parsing failed unexpectedly.' }, { status: 500 });
  }
}
