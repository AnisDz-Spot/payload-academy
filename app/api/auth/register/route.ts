import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, avatar, guestProgress } = body;

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Please provide a valid email address' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    // createUser now returns { user, verificationToken } — NO session yet
    const { user, verificationToken } = await createUser({
      email,
      password,
      name: name || '',
      avatar: avatar || '👨‍💻',
      initialProgress: guestProgress || {},
    });

    // Send the verification email (non-blocking — we still return 200 even if email
    // delivery fails, so the account is created and the user can request a resend).
    let previewUrl: string | undefined;
    try {
      const result = await sendVerificationEmail({
        toEmail: user.email,
        name: user.name,
        token: verificationToken,
      });
      previewUrl = result.previewUrl;
    } catch (emailErr) {
      console.error('Verification email send failed:', emailErr);
    }

    return NextResponse.json({
      success: true,
      emailSent: true,
      email: user.email,
      name: user.name,
      // Only included in development so the UI can show the Ethereal preview link
      ...(process.env.NODE_ENV !== 'production' && previewUrl ? { previewUrl } : {}),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Registration failed';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
