'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/context/AcademyContext';

interface LintIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  recommendation: string;
  docLink?: string;
}

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

  // Run Static Code Analysis
  const analyzeConfig = (source: string): { score: number; issues: LintIssue[] } => {
    const issues: LintIssue[] = [];
    let score = 100;

    // 1. Secret analysis
    if (source.includes("secret: '") || source.includes('secret: "')) {
      issues.push({
        id: 'sec-hardcoded-secret',
        type: 'error',
        title: 'Hardcoded Cryptographic Secret',
        message: 'PAYLOAD_SECRET is hardcoded as a string literal instead of using an environment variable.',
        recommendation: "Use `secret: process.env.PAYLOAD_SECRET || ''` and generate a 32+ byte hex key using `openssl rand -hex 32`.",
      });
      score -= 25;
    }

    // 2. CORS Wildcard
    if (source.includes("cors: ['*']") || source.includes('cors: ["*"]')) {
      issues.push({
        id: 'sec-wildcard-cors',
        type: 'error',
        title: 'Insecure Wildcard CORS Configuration',
        message: 'Wildcard CORS (*) allows any third-party domain to make credentialed requests to your API.',
        recommendation: 'Explicitly whitelist your production domains (e.g. `https://mywebsite.com`).',
      });
      score -= 20;
    }

    // 3. CSRF Wildcard
    if (source.includes("csrf: ['*']") || source.includes('csrf: ["*"]')) {
      issues.push({
        id: 'sec-wildcard-csrf',
        type: 'error',
        title: 'Insecure CSRF Origin Whitelist',
        message: 'Wildcard CSRF (*) disables cross-site request forgery protection.',
        recommendation: 'Specify exact allowed frontend origins.',
      });
      score -= 15;
    }

    // 4. Slugs without unique & index
    if (source.includes("name: 'slug'") && (!source.includes('unique: true') || !source.includes('index: true'))) {
      issues.push({
        id: 'perf-unindexed-slug',
        type: 'warning',
        title: 'Unindexed Slug Field',
        message: 'URL slug field is missing `unique: true` and `index: true`. This causes slow sequential table scans in database queries.',
        recommendation: "Add `{ name: 'slug', type: 'text', unique: true, index: true }`.",
      });
      score -= 15;
    }

    // 5. Upload collection without MIME types
    if (source.includes('upload:') && !source.includes('mimeTypes:')) {
      issues.push({
        id: 'sec-unrestricted-upload',
        type: 'warning',
        title: 'Unrestricted File Upload MIME Types',
        message: 'Upload collection has no MIME type restrictions, which may allow attackers to upload executable scripts (e.g. .html, .svg with XSS).',
        recommendation: "Define allowed file types: `mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']`.",
      });
      score -= 15;
    }

    // 6. Missing useAsTitle
    if (source.includes("slug: 'posts'") && !source.includes('useAsTitle:')) {
      issues.push({
        id: 'ux-missing-title',
        type: 'info',
        title: 'Missing admin.useAsTitle Property',
        message: 'Collection lists and relationship pickers will display raw document IDs instead of human-readable titles.',
        recommendation: "Add `admin: { useAsTitle: 'title' }` to your collection config.",
      });
      score -= 10;
    }

    return { score: Math.max(10, score), issues };
  };

  const { score, issues } = analyzeConfig(code);

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
                <div style={{ fontSize: '3.5rem', fontWeight: 900, color: getScoreColor(score), margin: '8px 0' }}>
                  {score} / 100
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                  {score >= 90
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
                  <span className="lesson-meta-chip">{issues.length} Issues Found</span>
                </h3>

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
                    {issues.map((issue) => (
                      <div
                        key={issue.id}
                        style={{
                          background: 'var(--bg)',
                          border: `1px solid ${issue.type === 'error' ? '#ef444466' : '#f59e0b66'}`,
                          borderLeft: `4px solid ${issue.type === 'error' ? '#ef4444' : '#f59e0b'}`,
                          borderRadius: 6,
                          padding: 14,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                          <strong style={{ fontSize: 14, color: issue.type === 'error' ? '#ef4444' : '#f59e0b' }}>
                            {issue.type === 'error' ? '🚨 Error: ' : '⚠️ Warning: '}
                            {issue.title}
                          </strong>
                          <span className="status-badge in-progress" style={{ fontSize: 10 }}>
                            {issue.type}
                          </span>
                        </div>
                        <p style={{ fontSize: 13, margin: '6px 0', color: 'var(--text)' }}>{issue.message}</p>
                        <div style={{ background: 'var(--card)', padding: '8px 10px', borderRadius: 4, fontSize: 12, marginTop: 8 }}>
                          <b>💡 Recommended Fix:</b> {issue.recommendation}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
