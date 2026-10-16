'use client'
import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAcademy } from '@/context/AcademyContext';

function SuccessContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'pro';
  const sessionId = searchParams.get('session_id') || '';
  const { setIsPro, setPlanType } = useAcademy();

  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; color: string; delay: number; dur: number; round: boolean }>>([]);

  /* eslint-disable react-hooks/set-state-in-effect -- activate Pro and generate confetti exactly once on mount */
  useEffect(() => {
    // Activate Pro status immediately
    setIsPro(true);
    const validPlan = plan === 'annual' ? 'annual' : plan === 'lifetime' ? 'lifetime' : 'monthly';
    setPlanType(validPlan);

    const colors = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];
    const pieces = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[i % colors.length],
      delay: Math.random() * 1.5,
      dur: 1.5 + Math.random() * 2,
      round: Math.random() > 0.5,
    }));
    setConfetti(pieces);
  }, [plan, setIsPro, setPlanType]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const planLabel =
    plan === 'monthly' ? 'Pro Monthly'
    : plan === 'annual' ? 'Pro Annual'
    : plan === 'lifetime' ? 'Lifetime Access'
    : 'Pro';

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>
      {/* Confetti */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none' }}>
        {confetti.map(c => (
          <div
            key={c.id}
            style={{
              position: 'absolute',
              top: -20,
              left: `${c.x}%`,
              width: 10,
              height: 10,
              background: c.color,
              borderRadius: c.round ? '50%' : 2,
              animation: `confettiFall ${c.dur}s ease-in ${c.delay}s forwards`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* Glow */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

      <div style={{
        maxWidth: 540,
        width: '100%',
        textAlign: 'center',
        background: 'var(--card)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: 20,
        padding: '48px 40px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        position: 'relative',
      }}>
        {/* Badge */}
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #10b981, #059669)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          margin: '0 auto 20px',
          boxShadow: '0 8px 30px rgba(16,185,129,0.4)',
        }}>
          🏆
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 8px', color: 'var(--text)' }}>
          Welcome to Payload Academy!
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 15, margin: '0 0 24px', lineHeight: 1.6 }}>
          Your <strong style={{ color: '#10b981' }}>{planLabel}</strong> subscription is now active.
          You now have full access to all courses, tools, and your Certificate of Mastery.
        </p>

        {sessionId && (
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '8px 14px', borderRadius: 8, fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--muted)', marginBottom: 24 }}>
            Session: {sessionId.slice(0, 28)}…
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link
            href="/"
            style={{
              display: 'block',
              padding: '13px 20px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 15,
              textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
            }}
          >
            🚀 Start Learning Now →
          </Link>
          <Link
            href="/dashboard"
            style={{
              display: 'block',
              padding: '11px 20px',
              borderRadius: 10,
              background: 'transparent',
              border: '1px solid var(--border)',
              color: 'var(--text)',
              fontWeight: 700,
              fontSize: 14,
              textDecoration: 'none',
            }}
          >
            📊 View Your Dashboard
          </Link>
        </div>

        {/* Trust badges */}
        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', gap: 20, fontSize: 11, color: 'var(--muted)' }}>
          <span>🔒 Payment Secured by Stripe</span>
          <span>📧 Receipt sent to your email</span>
        </div>
      </div>

      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
