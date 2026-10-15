'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/context/AcademyContext';
import { CHANGELOG_DATA } from '@/data/changelog';

export default function ChangelogPage() {
  const { toggleTheme } = useAcademy();
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const filteredReleases = CHANGELOG_DATA.filter(rel => 
    selectedTag === 'All' || rel.tag === selectedTag
  );

  return (
    <div className="standalone-page">
      {/* Header */}
      <header className="standalone-header">
        <div className="standalone-header-inner">
          <Link href="/" className="back-link">← Back to Course</Link>
          <div className="logo-small">
            <i>P</i>
            <span>Payload 3.x Changelog</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link href="/glossary" className="t">📖 Glossary</Link>
            <Link href="/dashboard" className="t">📊 Dashboard</Link>
            <button className="t" onClick={toggleTheme}>◐ Theme</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="standalone-main">
        <div className="wrap" style={{ maxWidth: 860 }}>
          <div className="kick">Release Roadmap &amp; History</div>
          <h1>Payload 3.x Evolution</h1>
          <p className="lead">
            Track major breakthroughs, architectural shifts, and breaking change migration guides in the Payload 3.x Next.js ecosystem.
          </p>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: 8, margin: '24px 0 32px' }}>
            {['All', 'Major', 'Minor'].map(tag => (
              <button
                key={tag}
                className={`alpha-btn ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(tag)}
                style={{ padding: '6px 14px', fontSize: 13 }}
              >
                {tag} Releases
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div className="changelog-timeline">
            {filteredReleases.map(rel => (
              <article key={rel.version} className="changelog-card">
                <div className="changelog-meta">
                  <span className="changelog-ver">{rel.version}</span>
                  <span className={`changelog-badge ${rel.tag.toLowerCase()}`}>{rel.tag}</span>
                  <span className="changelog-date">{rel.date}</span>
                </div>

                <h2 className="changelog-title">{rel.headline}</h2>
                <p className="changelog-summary">{rel.summary}</p>

                <div className="changelog-section">
                  <div className="changelog-section-title">✨ Key Highlights</div>
                  <ul className="changelog-list">
                    {rel.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>

                {rel.breakingChanges && rel.breakingChanges.length > 0 && (
                  <div className="changelog-section breaking">
                    <div className="changelog-section-title">⚠️ Breaking Changes</div>
                    <ul className="changelog-list">
                      {rel.breakingChanges.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {rel.migrationTips && rel.migrationTips.length > 0 && (
                  <div className="changelog-section migration">
                    <div className="changelog-section-title">💡 Migration Steps</div>
                    <ul className="changelog-list">
                      {rel.migrationTips.map((m, i) => (
                        <li key={i}><code>{m}</code></li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>

          {/* Bottom Official Docs Callout */}
          <div className="cta-banner" style={{ marginTop: 40 }}>
            <div>
              <h3>Official Payload CMS Release Notes</h3>
              <p>For complete git commit logs and alpha tag pre-releases, visit the GitHub releases feed.</p>
            </div>
            <a
              href="https://github.com/payloadcms/payload/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="sb-btn"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
            >
              View GitHub Releases →
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
