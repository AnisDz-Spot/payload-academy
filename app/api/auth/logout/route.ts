import { NextRequest, NextResponse } from 'next/server';
import { deleteSession } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get('pa_session')?.value;
    if (sessionToken) {
      await deleteSession(sessionToken);
    }

    const response = NextResponse.json({ success: true });
    response.cookies.delete('pa_session');
    return response;
  } catch {
    const response = NextResponse.json({ success: true });
    response.cookies.delete('pa_session');
    return response;
  }
}
