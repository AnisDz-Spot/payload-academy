'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

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
            fontSize: 72,
            fontWeight: 900,
            lineHeight: 1,
            color: 'var(--red, #dc2626)',
          }}
        >
          !
        </div>
        <h1 style={{ margin: '16px 0 8px', fontSize: 28, fontWeight: 800, color: 'var(--text)' }}>
          Something went wrong
        </h1>
        <p style={{ margin: '0 0 32px', fontSize: 16, lineHeight: 1.6, color: 'var(--muted)' }}>
          An unexpected error interrupted this page. You can retry, or head back to the curriculum.
        </p>
        {error.digest ? (
          <p style={{ margin: '0 0 24px', fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>
            Error ID: {error.digest}
          </p>
        ) : null}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={reset}
            style={{
              padding: '12px 24px',
              borderRadius: 12,
              fontWeight: 700,
              fontSize: 15,
              cursor: 'pointer',
              color: '#fff',
              border: 'none',
              background: 'var(--accent)',
            }}
          >
            Try again
          </button>
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
