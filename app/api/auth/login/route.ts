import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, saveUserProgress } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, guestProgress } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const { user, session } = authenticateUser(email, password);

    // If there is guest progress to merge, merge it into user's DB progress
    let mergedProgress = null;
    if (guestProgress && typeof guestProgress === 'object') {
      mergedProgress = saveUserProgress(user.id, guestProgress);
    }

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

    const response = NextResponse.json({
      success: true,
      user: sanitizedUser,
      progress: mergedProgress,
      token: session.token,
    });

    // Set HTTP-only cookie for session
    response.cookies.set({
      name: 'pa_session',
      value: session.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60, // 30 days
    });

    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid email or password';

    // Specific error for unverified accounts
    if (message === 'EMAIL_NOT_VERIFIED') {
      return NextResponse.json(
        {
          error: 'Please verify your email before signing in.',
          code: 'EMAIL_NOT_VERIFIED',
        },
        { status: 403 }
      );
    }

    return NextResponse.json({ error: message }, { status: 401 });
  }
}
