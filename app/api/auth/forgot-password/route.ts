import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/email';
import { randomBytes } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Generate a reset token
    const resetToken = randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

    // Try to create the user (will fail if already exists)
    let user;
    try {
      user = await createUser({
        email,
        password: 'TempPass123!', // Temporary password - user will reset on first login
        name: email.split('@')[0],
      });
    } catch (e) {
      // User already exists - we'll update their reset token below
      user = null;
    }

    // Update or set the reset token for the user
    const { Pool } = require('@neondatabase/serverless');
    const connection = new Pool(process.env.DATABASE_URL || '');
    await connection`
      UPDATE users 
      SET reset_token = ${resetToken}, 
          reset_token_expiry = ${resetTokenExpiry}, 
          updated_at = NOW()
      WHERE lower(email) = ${email.toLowerCase()}
    `;
    await connection.end();

    // Send reset email
    const userName = email.split('@')[0];
    await sendPasswordResetEmail({
      toEmail: email,
      name: userName,
      token: resetToken,
    });

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been sent.',
    });
  } catch (err) {
    console.error('[forgot-password] error:', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}