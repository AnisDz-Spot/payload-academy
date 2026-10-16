'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/context/AcademyContext';
import type { ConfigLintResult } from '@/lib/configLinter';

const SEVERITY = {
  error: { color: '#ef4444', label: 'Error', icon: '🚨' },
  warning: { color: '#f59e0b', label: 'Warning', icon: '⚠️' },
  info: { color: '#3b82f6', label: 'Info', icon: 'ℹ️' },
} as const;

const SAMPLE_CONFIGS: Record<string, string> = {
  vulnerable: `import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export default buildConfig({
  secret: 'my-simple-password-123', // Insecure secret
  cors: ['*'], // Insecure wildcard CORS
  csrf: ['*'],
  collections: [
    {
      slug: 'posts',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text' }, // Missing unique & index!
        { name: 'author', type: 'relationship', relationTo: 'users' },
      ],
    },
    {
      slug: 'media',
      upload: {
        staticDir: 'media', // Missing mimeTypes restriction!
      },
      fields: [{ name: 'alt', type: 'text' }],
    },
  ],
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI } }),
  editor: lexicalEditor(),
})`,

  hardened: `import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || '',
  cors: ['https://acme.com', 'https://admin.acme.com'],
  csrf: ['https://acme.com', 'https://admin.acme.com'],
  collections: [
    {
      slug: 'posts',
      admin: { useAsTitle: 'title' },
      versions: {
        maxPerDoc: 50,
        drafts: { autosave: true, schedulePublish: true },
      },
      access: {
        read: ({ req: { user } }) => (user ? true : { _status: { equals: 'published' } }),
        create: ({ req: { user } }) => Boolean(user),
        update: ({ req: { user } }) => Boolean(user),
        delete: ({ req: { user } }) => user?.role === 'admin',
      },
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', unique: true, index: true, admin: { position: 'sidebar' } },
        { name: 'author', type: 'relationship', relationTo: 'users', admin: { position: 'sidebar' } },
        { name: 'content', type: 'richText' },
      ],
    },
    {
      slug: 'media',
      access: {
        read: () => true,
        create: ({ req: { user } }) => Boolean(user),
        update: ({ req: { user } }) => Boolean(user),
        delete: ({ req: { user } }) => user?.role === 'admin',
      },
      upload: {
        staticDir: 'media',
        mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
        imageSizes: [
          { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
          { name: 'card', width: 768 },
        ],
      },
      fields: [{ name: 'alt', type: 'text', required: true }],
    },
  ],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      max: 20,
    },
  }),
  editor: lexicalEditor(),
})`,
};

export default function ConfigLinterPage() {
  const { toggleTheme } = useAcademy();
  const [code, setCode] = useState(SAMPLE_CONFIGS.vulnerable);
  const [result, setResult] = useState<(ConfigLintResult & { forCode: string }) | null>(null);

  // Debounced AST linting against the server-side analyzer.
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/config-lint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
          signal: controller.signal,
        });
        const data = await res.json();
        if (controller.signal.aborted) return;
        if (!res.ok) {
          setResult({
            score: 0,
            issues: [
              {
                id: 'lint-unavailable',
                type: 'error',
                title: 'Linter Unavailable',
                message: data?.error || 'The linting service could not be reached.',
                recommendation: 'Wait a moment and try again.',
              },
            ],
            syntaxErrors: [],
            forCode: code,
          });
          return;
        }
        setResult({ ...(data as ConfigLintResult), forCode: code });
      } catch (err) {
        if (controller.signal.aborted) return;
        setResult({
          score: 0,
          issues: [
            {
              id: 'lint-error',
              type: 'error',
              title: 'Linter Unavailable',
              message: err instanceof Error ? err.message : 'Network error.',
              recommendation: 'Check your connection and try again.',
            },
          ],
          syntaxErrors: [],
          forCode: code,
        });
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [code]);

  const analyzing = !result || result.forCode !== code;
  const score = result?.score ?? 0;
  const issues = result?.issues ?? [];
  const syntaxErrors = result?.syntaxErrors ?? [];

  const getScoreColor = (s: number) => {
    if (s >= 85) return '#10b981';
    if (s >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="standalone-page">
      <header className="standalone-header">
        <div className="standalone-header-inner">
          <Link href="/" className="back-link">
            ← Back to Academy
          </Link>
          <div className="logo-small">
            <i>P</i>
            <span>Production Config &amp; Security Linter</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link href="/schema-builder" className="t">
              ⚙️ Schema Studio
            </Link>
            <Link href="/query-simulator" className="t">
              🧪 Query Simulator
            </Link>
            <button className="t" onClick={toggleTheme}>
              ◐ Theme
            </button>
          </div>
        </div>
      </header>

      <main className="standalone-main">
        <div className="wrap" style={{ maxWidth: 1280 }}>
          <div className="kick">Automated Security &amp; Best-Practices Analyzer</div>
          <h1>Payload 3.x Production Config Linter</h1>
          <p className="lead">
            Audit your <code>payload.config.ts</code> and collection schemas for security vulnerabilities, index bottlenecks, and enterprise best practices.
            <span style={{ display: 'block', marginTop: 6, fontSize: 12, color: 'var(--muted)' }}>
              🔬 Real static AST analysis across a curated rule set — catches common issues, but is not a substitute for a professional security audit.
            </span>
          </p>

          <div style={{ display: 'flex', gap: 8, marginBottom: 20, alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)' }}>Sample Templates:</span>
            <button className="t" onClick={() => setCode(SAMPLE_CONFIGS.vulnerable)}>
              ⚠️ Vulnerable Config (See Issues)
            </button>
            <button className="t" onClick={() => setCode(SAMPLE_CONFIGS.hardened)}>
              🛡️ Hardened Production Config (100% Score)
            </button>
          </div>

          <div className="standalone-grid" style={{ gridTemplateColumns: '1.1fr 0.9fr', gap: 24 }}>
            {/* Editor Input Column */}
            <div className="panel-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <h2 style={{ margin: 0, fontSize: '1.1rem' }}>payload.config.ts Code Editor</h2>
                <button
                  className="quick-mark-btn"
                  onClick={() => setCode('')}
                  style={{ fontSize: 11 }}
                >
                  Clear Editor
                </button>
              </div>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{
                  width: '100%',
                  flex: 1,
                  minHeight: 520,
                  background: 'var(--code-bg)',
                  color: 'var(--codet)',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  lineHeight: 1.6,
                  padding: 16,
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  outline: 'none',
                  resize: 'vertical',
                }}
                placeholder="Paste your Payload configuration or collection TypeScript code here..."
              />
            </div>

            {/* Analysis & Results Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Score Card */}
              <div className="panel-card" style={{ textAlign: 'center', padding: '24px 20px' }}>
                <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.05em' }}>
                  Enterprise Production Readiness Score
                </div>
                <div style={{ fontSize: '3.5rem', fontWeight: 900, color: analyzing ? 'var(--muted)' : getScoreColor(score), margin: '8px 0' }}>
                  {analyzing ? '···' : `${score} / 100`}
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                  {analyzing
                    ? 'Analyzing configuration…'
                    : score >= 90
                    ? '🌟 Excellent! Your configuration adheres to high-security production standards.'
                    : score >= 60
                    ? '⚠️ Moderate risk. Resolve the flagged security issues before deploying.'
                    : '🚨 High risk! Critical security vulnerabilities detected.'}
                </div>
              </div>

              {/* Issues List */}
              <div className="panel-card" style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Diagnostic Findings</span>
                  <span className="lesson-meta-chip">
                    {analyzing ? 'Analyzing…' : `${issues.length} Issues Found`}
                  </span>
                </h3>

                {analyzing ? (
                  <div style={{ textAlign: 'center', padding: 36, color: 'var(--muted)' }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>🔎</div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>Analyzing configuration…</div>
                  </div>
                ) : (
                  <>
                    {syntaxErrors.length > 0 && (
                      <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid #ef444466', borderRadius: 6, padding: 12, marginBottom: 12 }}>
                        <strong style={{ fontSize: 13, color: '#ef4444' }}>⛔ TypeScript syntax errors detected:</strong>
                        <ul style={{ margin: '6px 0 0', paddingLeft: 18, fontSize: 12, color: 'var(--text)' }}>
                          {syntaxErrors.map((e, i) => (
                            <li key={i}>{e}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {issues.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: 36, color: '#10b981' }}>
                        <div style={{ fontSize: 32, marginBottom: 8 }}>✅</div>
                        <div style={{ fontWeight: 700, fontSize: 16 }}>Zero Security Issues Detected!</div>
                        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
                          Your configuration meets all analyzed performance, index, and security checks.
                        </p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {issues.map((issue) => {
                          const sev = SEVERITY[issue.type];
                          return (
                            <div
                              key={issue.id}
                              style={{
                                background: 'var(--bg)',
                                border: `1px solid ${sev.color}66`,
                                borderLeft: `4px solid ${sev.color}`,
                                borderRadius: 6,
                                padding: 14,
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                <strong style={{ fontSize: 14, color: sev.color }}>
                                  {sev.icon} {sev.label}: {issue.title}
                                </strong>
                                {issue.location && (
                                  <span className="lesson-meta-chip" style={{ fontSize: 10 }}>{issue.location}</span>
                                )}
                              </div>
                              <p style={{ fontSize: 13, margin: '6px 0', color: 'var(--text)' }}>{issue.message}</p>
                              <div style={{ background: 'var(--card)', padding: '8px 10px', borderRadius: 4, fontSize: 12, marginTop: 8 }}>
                                <b>💡 Recommended Fix:</b> {issue.recommendation}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
