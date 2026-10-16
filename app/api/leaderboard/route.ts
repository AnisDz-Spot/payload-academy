import { NextResponse } from 'next/server';
import { getLeaderboard } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const entries = await getLeaderboard(100);
    return NextResponse.json({ entries });
  } catch (err) {
    console.error('[Leaderboard error]', err);
    return NextResponse.json(
      {
        entries: [],
        error:
          err instanceof Error ? err.message : 'Failed to load leaderboard',
      },
      { status: 500 }
    );
  }
}
