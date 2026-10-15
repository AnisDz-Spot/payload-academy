import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get('pa_session')?.value;
    if (!sessionToken) {
      return NextResponse.json({ user: null, isGuest: true });
    }

    const sessionData = getSessionUser(sessionToken);
    if (!sessionData) {
      const res = NextResponse.json({ user: null, isGuest: true });
      res.cookies.delete('pa_session');
      return res;
    }

    const { user, progress } = sessionData;
    const sanitizedUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role,
      isPro: user.isPro,
      planType: user.planType,
      createdAt: user.createdAt,
    };

    return NextResponse.json({
      user: sanitizedUser,
      progress,
      isGuest: false,
    });
  } catch (err) {
    console.error('Error fetching current user:', err);
    return NextResponse.json({ user: null, isGuest: true });
  }
}
