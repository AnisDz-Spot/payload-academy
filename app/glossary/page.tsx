'use client'
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAcademy } from '@/context/AcademyContext';
import { GLOSSARY } from '@/data/glossary';

export default function GlossaryPage() {
  const { toggleTheme } = useAcademy();
  const [search, setSearch] = useState('');
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return GLOSSARY.filter(entry => {
      const q = search.toLowerCase();
      const matchSearch = !q || entry.term.toLowerCase().includes(q) || entry.definition.toLowerCase().includes(q);
      const matchLetter = !activeLetter || entry.term[0].toUpperCase() === activeLetter;
      return matchSearch && matchLetter;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [search, activeLetter]);

  const letters = useMemo(() => {
    return [...new Set(GLOSSARY.map(e => e.term[0].toUpperCase()))].sort();
  }, []);

  return (
    <div className="standalone-page">
      <header className="standalone-header">
        <div className="standalone-header-inner">
          <Link href="/" className="back-link">← Back to Course</Link>
          <div className="logo-small">
            <i>P</i>
            <span>Payload Glossary</span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/query-simulator" className="t">🧪 Query Simulator</Link>
            <Link href="/final-exam" className="t">🎓 Final Exam</Link>
            <button className="t" onClick={toggleTheme}>◐ Theme</button>
          </div>
        </div>
      </header>

      <main className="standalone-main">
        <div className="wrap" style={{ maxWidth: 860 }}>
          <div className="kick">Reference</div>
          <h1>Payload 3.x Glossary</h1>
          <p className="lead">
            Every key term, concept, and API in Payload CMS — with definitions, code examples, and cross-references.
          </p>

          {/* Search + Filter */}
          <div className="glossary-controls">
            <input
              type="search"
              className="glossary-search"
              placeholder="Search terms or definitions…"
              value={search}
              onChange={e => { setSearch(e.target.value); setActiveLetter(null); }}
            />
            <div className="glossary-alpha">
              <button
                className={`alpha-btn ${!activeLetter ? 'active' : ''}`}
                onClick={() => setActiveLetter(null)}
              >
                All
              </button>
              {letters.map(l => (
                <button
                  key={l}
                  className={`alpha-btn ${activeLetter === l ? 'active' : ''}`}
                  onClick={() => { setActiveLetter(l); setSearch(''); }}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <p style={{ fontSize: 13, color: 'var(--muted)', margin: '8px 0 20px' }}>
            {filtered.length} {filtered.length === 1 ? 'term' : 'terms'} found
          </p>

          {/* Terms grid */}
          <div className="glossary-grid">
            {filtered.map(entry => (
              <div key={entry.term} className="glossary-card" id={`term-${entry.term.toLowerCase().replace(/\s+/g, '-')}`}>
                <div className="glossary-card-header">
                  <h2 className="glossary-term">{entry.term}</h2>
                </div>
                <p className="glossary-def">{entry.definition}</p>
                {entry.example && (
                  <div className="glossary-example">
                    <div className="glossary-example-label">Example</div>
                    <pre><code>{entry.example}</code></pre>
                  </div>
                )}
                {entry.relatedTerms && entry.relatedTerms.length > 0 && (
                  <div className="glossary-related">
                    <span className="glossary-related-label">Related:</span>
                    {entry.relatedTerms.map(rt => {
                      const exists = GLOSSARY.some(e => e.term === rt);
                      return exists ? (
                        <a
                          key={rt}
                          href={`#term-${rt.toLowerCase().replace(/\s+/g, '-')}`}
                          className="glossary-tag"
                          onClick={() => { setSearch(''); setActiveLetter(null); }}
                        >
                          {rt}
                        </a>
                      ) : (
                        <span key={rt} className="glossary-tag muted">{rt}</span>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <p>No terms match &quot;<strong>{search}</strong>&quot;</p>
              <button className="sb-btn sec" onClick={() => { setSearch(''); setActiveLetter(null); }}>
                Clear filter
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
