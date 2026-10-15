import { NextRequest, NextResponse } from 'next/server';
import { refreshVerificationToken, getUserByEmail } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email address required' }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      // Intentionally vague to prevent email enumeration
      return NextResponse.json({ success: true });
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: 'This email is already verified.' }, { status: 400 });
    }

    const result = await refreshVerificationToken(email);
    if (!result) {
      return NextResponse.json({ error: 'Could not refresh verification token.' }, { status: 400 });
    }

    let previewUrl: string | undefined;
    try {
      const emailResult = await sendVerificationEmail({
        toEmail: user.email,
        name: user.name,
        token: result.token,
      });
      previewUrl = emailResult.previewUrl;
    } catch (emailErr) {
      console.error('Resend verification email failed:', emailErr);
    }

    return NextResponse.json({
      success: true,
      ...(process.env.NODE_ENV !== 'production' && previewUrl ? { previewUrl } : {}),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to resend verification email';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
