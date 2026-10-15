'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Status = 'pending' | 'success' | 'invalid' | 'missing' | 'resent';

function VerifyEmailContent() {
  const params = useSearchParams();
  const router = useRouter();
  const rawStatus = (params.get('status') || 'pending') as Status;
  const [status, setStatus] = useState<Status>(rawStatus);
  const [email, setEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendError, setResendError] = useState('');
  const [devPreviewUrl, setDevPreviewUrl] = useState('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-redirect to home after success
  useEffect(() => {
    if (status === 'success') {
      timerRef.current = setTimeout(() => router.push('/'), 4000);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [status, router]);

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) { setResendError('Please enter your email address.'); return; }
    setResending(true);
    setResendError('');
    try {
      const res = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) { setResendError(data.error || 'Something went wrong.'); return; }
      if (data.previewUrl) setDevPreviewUrl(data.previewUrl);
      setStatus('resent');
    } finally {
      setResending(false);
    }
  }

  const config: Record<Status, { icon: string; color: string; glow: string; title: string; body: string }> = {
    pending: {
      icon: '📬',
      color: '#818cf8',
      glow: 'rgba(99,102,241,0.25)',
      title: 'Check your inbox',
      body: "We've sent a verification link to your email. Click the link to activate your account — it expires in 24 hours.",
    },
    success: {
      icon: '✅',
      color: '#10b981',
      glow: 'rgba(16,185,129,0.3)',
      title: 'Email verified!',
      body: "Your account is now active. You're being redirected to the Academy…",
    },
    invalid: {
      icon: '⚠️',
      color: '#f59e0b',
      glow: 'rgba(245,158,11,0.25)',
      title: 'Link expired or invalid',
      body: 'This verification link has expired or already been used. Enter your email below to get a fresh link.',
    },
    missing: {
      icon: '🔍',
      color: '#f87171',
      glow: 'rgba(248,113,113,0.25)',
      title: 'Missing token',
      body: 'No verification token was found. Please use the link from your email, or request a new one below.',
    },
    resent: {
      icon: '📤',
      color: '#34d399',
      glow: 'rgba(52,211,153,0.3)',
      title: 'Verification email sent!',
      body: 'A fresh link has been sent to your inbox. Check your spam folder too — it sometimes ends up there.',
    },
  };

  const c = config[status];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 60%), #090a0f',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>
      {/* Ambient blobs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '15%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(99,102,241,0.06)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '20%', right: '8%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(139,92,246,0.06)', filter: 'blur(60px)' }} />
      </div>

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: 480,
        background: 'linear-gradient(135deg, rgba(22,24,36,0.95) 0%, rgba(14,16,22,0.98) 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
        padding: '48px 40px',
        boxShadow: `0 0 60px ${c.glow}, 0 25px 60px rgba(0,0,0,0.4)`,
        transition: 'box-shadow 0.5s ease',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: 36 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg,#6366f1,#4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 900, color: '#fff',
          }}>P</div>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '-0.2px' }}>Payload Academy</span>
        </Link>

        {/* Status icon */}
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: `radial-gradient(circle, ${c.glow} 0%, transparent 70%)`,
          border: `2px solid ${c.color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 36, marginBottom: 24,
          animation: status === 'success' ? 'pulse 1.5s ease-in-out infinite' : 'none',
        }}>
          {c.icon}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 26, fontWeight: 800, color: '#ffffff',
          letterSpacing: '-0.5px', margin: '0 0 12px',
        }}>{c.title}</h1>

        {/* Body text */}
        <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.75, margin: '0 0 28px' }}>
          {c.body}
        </p>

        {/* Success redirect counter */}
        {status === 'success' && (
          <Link href="/" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '12px 24px', borderRadius: 12,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#fff', fontWeight: 700, fontSize: 14,
            textDecoration: 'none',
            boxShadow: '0 4px 20px rgba(16,185,129,0.35)',
          }}>
            → Go to Academy now
          </Link>
        )}

        {/* Dev preview URL for Ethereal email */}
        {devPreviewUrl && (
          <div style={{
            padding: '12px 16px', borderRadius: 10,
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
            marginBottom: 20,
          }}>
            <div style={{ fontSize: 11, color: '#f59e0b', fontWeight: 700, marginBottom: 4 }}>🔧 DEV MODE — Ethereal Preview</div>
            <a href={devPreviewUrl} target="_blank" rel="noopener noreferrer"
               style={{ fontSize: 11, color: '#818cf8', wordBreak: 'break-all', fontFamily: 'monospace' }}>
              {devPreviewUrl}
            </a>
          </div>
        )}

        {/* Resend form — shown on pending, invalid, missing */}
        {(status === 'pending' || status === 'invalid' || status === 'missing') && (
          <form onSubmit={handleResend} style={{ marginTop: status === 'pending' ? 12 : 0 }}>
            {status !== 'pending' && (
              <div style={{ fontSize: 13, fontWeight: 600, color: '#cbd5e1', marginBottom: 10 }}>
                Request a new verification link:
              </div>
            )}
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                style={{
                  flex: 1, padding: '10px 14px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 10, color: '#f1f5f9',
                  fontSize: 13, outline: 'none',
                  fontFamily: 'inherit',
                }}
              />
              <button
                type="submit"
                disabled={resending}
                style={{
                  padding: '10px 18px', borderRadius: 10,
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  color: '#fff', fontWeight: 700, fontSize: 13,
                  border: 'none', cursor: resending ? 'not-allowed' : 'pointer',
                  opacity: resending ? 0.7 : 1,
                  transition: 'opacity 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {resending ? '…' : 'Resend'}
              </button>
            </div>
            {resendError && (
              <div style={{ fontSize: 12, color: '#f87171', marginTop: 8 }}>{resendError}</div>
            )}
          </form>
        )}

        {/* Resent success */}
        {status === 'resent' && (
          <button
            onClick={() => { setStatus('pending'); setEmail(''); }}
            style={{
              marginTop: 4, padding: '10px 20px', borderRadius: 10,
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              color: '#94a3b8', fontSize: 13, cursor: 'pointer',
            }}
          >
            ← Request another link
          </button>
        )}

        {/* Footer */}
        <div style={{ marginTop: 32, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: 12, color: '#475569' }}>
          <Link href="/" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>← Back to Academy</Link>
          <span style={{ margin: '0 8px', opacity: 0.5 }}>·</span>
          Need help? <a href="mailto:support@payload-academy.dev" style={{ color: '#6366f1', textDecoration: 'none' }}>Contact support</a>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        input::placeholder { color: rgba(148,163,184,0.5); }
        input:focus { border-color: rgba(99,102,241,0.5) !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12); }
      `}</style>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div style={{
        minHeight: '100vh',
        background: '#090a0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#94a3b8',
        fontFamily: "'Inter', system-ui, sans-serif"
      }}>
        Loading verification...
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
