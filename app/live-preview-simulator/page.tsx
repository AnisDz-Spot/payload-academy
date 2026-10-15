'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/context/AcademyContext';

interface PostMessageEvent {
  id: string;
  time: string;
  type: string;
  payload: Record<string, unknown>;
}

export default function LivePreviewSimulatorPage() {
  const { toggleTheme } = useAcademy();

  // Document state in simulated Payload Admin editor
  const [doc, setDoc] = useState({
    title: 'Announcing Next.js 15 + Payload 3.x Live Preview',
    tagline: 'Instant bi-directional preview synchronization with zero page reload latency.',
    category: 'Engineering',
    status: 'draft',
    theme: 'dark',
    buttonText: 'Read Architecture Guide',
    accentColor: '#6366f1',
  });

  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [messages, setMessages] = useState<PostMessageEvent[]>([
    {
      id: 'init-1',
      time: new Date().toLocaleTimeString(),
      type: 'payload:live-preview:init',
      payload: { ready: true, targetOrigin: 'http://localhost:3000' },
    },
  ]);

  const handleFieldChange = (field: string, val: string) => {
    const updated = { ...doc, [field]: val };
    setDoc(updated);

    // Record simulated postMessage event
    setMessages((prev) => [
      {
        id: String(Date.now()),
        time: new Date().toLocaleTimeString(),
        type: 'payload:live-preview:update',
        payload: { field, value: val, timestamp: Date.now() },
      },
      ...prev.slice(0, 15), // keep last 15 messages
    ]);
  };

  const getDeviceWidth = () => {
    if (device === 'mobile') return '390px';
    if (device === 'tablet') return '768px';
    return '100%';
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
            <span>Live Preview &amp; PostMessage Studio</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link href="/schema-builder" className="t">
              ⚙️ Schema Studio
            </Link>
            <Link href="/rbac-matrix" className="t">
              🛡️ RBAC Matrix
            </Link>
            <button className="t" onClick={toggleTheme}>
              ◐ Theme
            </button>
          </div>
        </div>
      </header>

      <main className="standalone-main">
        <div className="wrap" style={{ maxWidth: 1400 }}>
          <div className="kick">Real-Time Synchronization Engine</div>
          <h1>Payload 3.x Live Preview &amp; Iframe Sync Simulator</h1>
          <p className="lead">
            Experience real-time bi-directional content staging between the Payload Admin panel and a Next.js 15 App Router frontend powered by <code>window.postMessage</code> and <code>useLivePreview()</code>.
          </p>

          {/* Viewport & Device Toggles */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)' }}>Viewport:</span>
              <button
                className={`t ${device === 'desktop' ? 'active' : ''}`}
                onClick={() => setDevice('desktop')}
              >
                🖥️ Desktop (1440px)
              </button>
              <button
                className={`t ${device === 'tablet' ? 'active' : ''}`}
                onClick={() => setDevice('tablet')}
              >
                📲 Tablet (768px)
              </button>
              <button
                className={`t ${device === 'mobile' ? 'active' : ''}`}
                onClick={() => setDevice('mobile')}
              >
                📱 Mobile (390px)
              </button>
            </div>

            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <span className="status-badge in-progress" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                ● Live WebSocket / postMessage Active
              </span>
            </div>
          </div>

          <div className="standalone-grid" style={{ gridTemplateColumns: '400px 1fr', gap: 20, alignItems: 'start' }}>
            {/* Left Panel: Simulated Payload Admin Editor */}
            <div className="panel-card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, borderBottom: '1px solid var(--border)', paddingBottom: 10 }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)' }}>
                    Payload CMS Admin
                  </span>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Edit Post (Draft)</div>
                </div>
                <span className="status-badge in-progress" style={{ fontSize: 10 }}>
                  Autosaving…
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                    Article Title
                  </label>
                  <input
                    type="text"
                    className="sb-input"
                    value={doc.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                    Hero Tagline &amp; Excerpt
                  </label>
                  <textarea
                    className="sb-input"
                    rows={3}
                    value={doc.tagline}
                    onChange={(e) => handleFieldChange('tagline', e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                      Category
                    </label>
                    <select
                      className="sb-select"
                      value={doc.category}
                      onChange={(e) => handleFieldChange('category', e.target.value)}
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Tutorials">Tutorials</option>
                      <option value="Product Update">Product Update</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                      Theme Preset
                    </label>
                    <select
                      className="sb-select"
                      value={doc.theme}
                      onChange={(e) => handleFieldChange('theme', e.target.value)}
                    >
                      <option value="dark">Dark Theme</option>
                      <option value="light">Light Theme</option>
                      <option value="indigo">Indigo Accent</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                    Call To Action Button Text
                  </label>
                  <input
                    type="text"
                    className="sb-input"
                    value={doc.buttonText}
                    onChange={(e) => handleFieldChange('buttonText', e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, marginBottom: 4 }}>
                    Accent Brand Color
                  </label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      type="color"
                      value={doc.accentColor}
                      onChange={(e) => handleFieldChange('accentColor', e.target.value)}
                      style={{ width: 36, height: 32, cursor: 'pointer', border: 'none', background: 'none' }}
                    />
                    <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", color: 'var(--muted)' }}>
                      {doc.accentColor}
                    </span>
                  </div>
                </div>
              </div>

              {/* Event Stream Log */}
              <div style={{ marginTop: 20, borderTop: '1px solid var(--border)', paddingTop: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 8 }}>
                  📡 postMessage Event Stream
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 150, overflowY: 'auto' }}>
                  {messages.map((m) => (
                    <div
                      key={m.id}
                      style={{
                        background: 'var(--bg)',
                        border: '1px solid var(--border)',
                        borderRadius: 4,
                        padding: '4px 8px',
                        fontSize: 11,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      <span style={{ color: '#10b981' }}>[{m.time}]</span> <span style={{ color: '#818cf8' }}>{m.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Panel: Simulated Live Frontend Viewport */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  width: getDeviceWidth(),
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  background: doc.theme === 'light' ? '#ffffff' : doc.theme === 'indigo' ? '#0f172a' : '#090d16',
                  color: doc.theme === 'light' ? '#0f172a' : '#f8fafc',
                  border: '1px solid var(--border)',
                  borderRadius: 14,
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
                  minHeight: 520,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Browser Frame Header */}
                <div
                  style={{
                    background: doc.theme === 'light' ? '#f1f5f9' : '#1e293b',
                    borderBottom: `1px solid ${doc.theme === 'light' ? '#e2e8f0' : '#334155'}`,
                    padding: '8px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
                  </div>
                  <div
                    style={{
                      background: doc.theme === 'light' ? '#ffffff' : '#0f172a',
                      padding: '2px 14px',
                      borderRadius: 99,
                      fontSize: 11,
                      fontFamily: "'JetBrains Mono', monospace",
                      color: doc.theme === 'light' ? '#64748b' : '#94a3b8',
                      border: `1px solid ${doc.theme === 'light' ? '#cbd5e1' : '#334155'}`,
                    }}
                  >
                    https://mycorp.com/blog/announcing-v3?preview=true
                  </div>
                  <div style={{ fontSize: 10, color: '#10b981', fontWeight: 700 }}>
                    ⚡ LIVE
                  </div>
                </div>

                {/* Live Rendering Frontend Content */}
                <div style={{ padding: '36px 32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '3px 9px',
                        borderRadius: 99,
                        background: `${doc.accentColor}22`,
                        color: doc.accentColor,
                        border: `1px solid ${doc.accentColor}44`,
                      }}
                    >
                      {doc.category}
                    </span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>• 5 min read • Live Draft</span>
                  </div>

                  <h1 style={{ fontSize: device === 'mobile' ? '1.5rem' : '2.2rem', fontWeight: 900, lineHeight: 1.25, margin: '0 0 16px 0', letterSpacing: '-0.02em' }}>
                    {doc.title || 'Untitled Post'}
                  </h1>

                  <p style={{ fontSize: 16, lineHeight: 1.7, color: doc.theme === 'light' ? '#475569' : '#94a3b8', margin: '0 0 28px 0' }}>
                    {doc.tagline || 'Enter tagline in editor to preview changes live...'}
                  </p>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: 12 }}>
                    <button
                      style={{
                        background: doc.accentColor,
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        padding: '10px 20px',
                        fontSize: 14,
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: `0 4px 14px ${doc.accentColor}44`,
                      }}
                    >
                      {doc.buttonText || 'Click Here'} →
                    </button>
                  </div>
                </div>
              </div>

              {/* Code Snippet Info */}
              <div className="panel-card" style={{ width: '100%', marginTop: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 6 }}>
                  Next.js 15 Client Component Integration:
                </div>
                <div className="cb" style={{ margin: 0 }}>
                  <div className="fn">src/app/(frontend)/blog/[slug]/page.tsx</div>
                  <pre><code>{`'use client'
import { useLivePreview } from '@payloadcms/live-preview-react'
import type { Post } from '@/payload-types'

export default function BlogPost({ initialPost }: { initialPost: Post }) {
  const { data: post } = useLivePreview<Post>({
    initialData: initialPost,
    serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
    depth: 2,
  })

  return <article><h1>{post.title}</h1><p>{post.tagline}</p></article>
}`}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
