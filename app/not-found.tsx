import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '80px 24px',
      }}
    >
      <div style={{ maxWidth: 560, textAlign: 'center' }}>
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: -4,
            color: 'var(--accent)',
          }}
        >
          404
        </div>
        <h1 style={{ margin: '16px 0 8px', fontSize: 28, fontWeight: 800, color: 'var(--text)' }}>
          This page went headless
        </h1>
        <p style={{ margin: '0 0 32px', fontSize: 16, lineHeight: 1.6, color: 'var(--muted)' }}>
          The page you are looking for does not exist or has moved. Pick up where you left off with the
          curriculum or head back home.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/lessons"
            style={{
              padding: '12px 24px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 15,
              textDecoration: 'none',
              color: '#fff',
              background: 'var(--accent)',
            }}
          >
            Browse lessons
          </Link>
          <Link
            href="/"
            style={{
              padding: '12px 24px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 15,
              textDecoration: 'none',
              color: 'var(--text)',
              border: '1px solid var(--border)',
            }}
          >
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
