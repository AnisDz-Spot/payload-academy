import nodemailer from 'nodemailer';
import crypto from 'crypto';

// ── Environment config ────────────────────────────────────────────
const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '587', 10);
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASS = process.env.EMAIL_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || `"Payload Academy" <noreply@payload-academy.dev>`;
const APP_URL   = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// ── Token generation ─────────────────────────────────────────────
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function tokenExpiry(minutes = 60 * 24): Date {
  return new Date(Date.now() + minutes * 60 * 1000); // default 24h
}

// ── Nodemailer transport ─────────────────────────────────────────
function createTransport() {
  // Preview mode: if no credentials are set, use Nodemailer's built-in
  // Ethereal test account (messages won't actually deliver, but the
  // preview URL is logged to the console — great for development).
  if (!EMAIL_USER || !EMAIL_PASS) {
    // Return null; caller will use preview mode
    return null;
  }

  return nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: EMAIL_PORT === 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
}

// ── Email templates ───────────────────────────────────────────────
function buildVerificationEmailHtml(name: string, verifyUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your Payload Academy email</title>
</head>
<body style="margin:0;padding:0;background:#090a0f;font-family:'Inter',system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#090a0f;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:linear-gradient(135deg,#12141d 0%,#0a0b10 100%);border-radius:20px;border:1px solid rgba(255,255,255,0.08);overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="padding:32px 40px 24px;border-bottom:1px solid rgba(255,255,255,0.06);">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="width:44px;height:44px;background:linear-gradient(135deg,#6366f1,#4f46e5);border-radius:12px;text-align:center;vertical-align:middle;font-size:22px;font-weight:900;color:#fff;">P</td>
                  <td style="padding-left:14px;">
                    <div style="font-size:18px;font-weight:800;color:#ffffff;letter-spacing:-0.3px;">Payload Academy</div>
                    <div style="font-size:11px;color:#6366f1;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-top:2px;">Email Verification</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px 32px;">
              <div style="font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;margin-bottom:12px;">
                Confirm your email 📬
              </div>
              <div style="font-size:15px;color:#94a3b8;line-height:1.7;margin-bottom:28px;">
                Hi <strong style="color:#e2e8f0;">${name}</strong>, welcome to Payload Academy! You&apos;re one step away from unlocking your learning journey.<br /><br />
                Click the button below to verify your email address. The link expires in <strong style="color:#f8fafc;">24 hours</strong>.
              </div>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:12px;background:linear-gradient(135deg,#6366f1 0%,#4f46e5 100%);box-shadow:0 4px 20px rgba(99,102,241,0.4);">
                    <a href="${verifyUrl}"
                       style="display:inline-block;padding:14px 32px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.2px;">
                      ✓ Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <div style="margin-top:24px;padding:16px;background:rgba(255,255,255,0.03);border-radius:12px;border:1px solid rgba(255,255,255,0.07);">
                <div style="font-size:12px;color:#64748b;margin-bottom:6px;">Or copy and paste this URL into your browser:</div>
                <div style="font-size:11px;color:#818cf8;word-break:break-all;font-family:monospace;">${verifyUrl}</div>
              </div>
            </td>
          </tr>

          <!-- Feature highlights -->
          <tr>
            <td style="padding:0 40px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(99,102,241,0.06);border-radius:14px;border:1px solid rgba(99,102,241,0.15);overflow:hidden;">
                <tr>
                  <td style="padding:20px 24px;">
                    <div style="font-size:12px;font-weight:700;color:#818cf8;text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;">What you unlock</div>
                    <table cellpadding="0" cellspacing="0" width="100%">
                      ${[
                        ['📦', '50 Deep-Dive Lessons', 'Payload CMS 3.x + Next.js 16 full-stack'],
                        ['🔥', 'Study Streaks & XP', 'Daily streaks with achievement badges'],
                        ['🏆', 'Pro Certification', 'Holographic cert + LinkedIn credential'],
                      ].map(([icon, title, sub]) => `
                      <tr>
                        <td style="padding:6px 0;vertical-align:top;width:32px;font-size:18px;">${icon}</td>
                        <td style="padding:6px 0 6px 10px;vertical-align:top;">
                          <div style="font-size:13px;font-weight:600;color:#e2e8f0;">${title}</div>
                          <div style="font-size:11px;color:#64748b;margin-top:2px;">${sub}</div>
                        </td>
                      </tr>`).join('')}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <div style="font-size:11px;color:#475569;line-height:1.6;">
                If you didn&apos;t create a Payload Academy account, you can safely ignore this email.<br />
                This link expires in 24 hours.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ── Send verification email ──────────────────────────────────────
export async function sendVerificationEmail(params: {
  toEmail: string;
  name: string;
  token: string;
}): Promise<{ previewUrl?: string; messageId?: string }> {
  const verifyUrl = `${APP_URL}/api/auth/verify-email?token=${params.token}`;
  const htmlBody = buildVerificationEmailHtml(params.name, verifyUrl);
  const textBody = `Hi ${params.name},\n\nVerify your Payload Academy email by visiting:\n${verifyUrl}\n\nThis link expires in 24 hours.`;

  const mailOptions = {
    from: EMAIL_FROM,
    to: params.toEmail,
    subject: '✓ Verify your Payload Academy email',
    text: textBody,
    html: htmlBody,
  };

  const transport = createTransport();

  if (!transport) {
    // No credentials — use Ethereal preview (development only)
    const testAccount = await nodemailer.createTestAccount();
    const previewTransport = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    const info = await previewTransport.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
    console.log('📧 [DEV EMAIL] Preview URL:', previewUrl);
    console.log('📧 [DEV EMAIL] Verification link:', verifyUrl);
    return { previewUrl, messageId: info.messageId };
  }

  const info = await transport.sendMail(mailOptions);
  return { messageId: info.messageId };
}

// ── Send password reset email (future-proof) ─────────────────────
export async function sendPasswordResetEmail(params: {
  toEmail: string;
  name: string;
  token: string;
}): Promise<{ previewUrl?: string }> {
  const resetUrl = `${APP_URL}/reset-password?token=${params.token}`;
  const mailOptions = {
    from: EMAIL_FROM,
    to: params.toEmail,
    subject: '🔑 Reset your Payload Academy password',
    text: `Hi ${params.name},\n\nReset your password by visiting:\n${resetUrl}\n\nThis link expires in 1 hour.`,
    html: `<p>Hi ${params.name},</p><p>Reset your password: <a href="${resetUrl}">${resetUrl}</a></p><p>Expires in 1 hour.</p>`,
  };

  const transport = createTransport();
  if (!transport) {
    const testAccount = await nodemailer.createTestAccount();
    const previewTransport = nodemailer.createTransport({
      host: 'smtp.ethereal.email', port: 587, secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    const info = await previewTransport.sendMail(mailOptions);
    const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
    console.log('📧 [DEV PASSWORD RESET] Preview URL:', previewUrl);
    return { previewUrl };
  }
  await transport.sendMail(mailOptions);
  return {};
}
