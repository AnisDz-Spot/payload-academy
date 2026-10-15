'use client'
import React from 'react';
import Link from 'next/link';

export default function CheckoutCancelPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        maxWidth: 480,
        width: '100%',
        textAlign: 'center',
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 20,
        padding: '48px 40px',
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🙈</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 8px' }}>Payment canceled</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 28px', lineHeight: 1.6 }}>
          No charge was made. You can return to the pricing page anytime and pick up where you left off.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Link
            href="/pricing"
            style={{
              display: 'block',
              padding: '13px 20px',
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 15,
              textDecoration: 'none',
            }}
          >
            ← Back to Pricing
          </Link>
          <Link
            href="/"
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
            Continue with Free Plan
          </Link>
        </div>
      </div>
    </div>
  );
}
