'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { GLOSSARY } from '@/data/glossary';

function shuffled<T>(arr: T[]): T[] {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const T = {
  wrap: { maxWidth: 720, margin: '0 auto', padding: '48px 20px 96px' } as React.CSSProperties,
  kicker: { fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)' } as React.CSSProperties,
  h1: { fontSize: 'clamp(1.7rem, 4vw, 2.3rem)', fontWeight: 800, margin: '10px 0 8px' } as React.CSSProperties,
  lede: { color: 'var(--muted)', lineHeight: 1.6, marginBottom: 22 } as React.CSSProperties,
  bar: { height: 8, background: 'var(--border)', borderRadius: 99, overflow: 'hidden', marginBottom: 18 } as React.CSSProperties,
  barFill: (pct: number): React.CSSProperties => ({ height: '100%', width: `${pct}%`, background: 'var(--accent)', transition: 'width .25s' }),
  card: {
    minHeight: 300, border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'var(--card)',
    padding: '34px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'center', cursor: 'pointer',
    boxShadow: 'var(--shadow)', position: 'relative',
  } as React.CSSProperties,
  side: { position: 'absolute', top: 14, left: 18, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)' } as React.CSSProperties,
  term: { fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em' } as React.CSSProperties,
  def: { fontSize: '1.05rem', lineHeight: 1.7, margin: '0 0 16px' } as React.CSSProperties,
  ex: { fontFamily: 'var(--font-mono)', fontSize: 12.5, background: 'var(--code-bg)', color: 'var(--codet)', padding: '12px 14px', borderRadius: 'var(--radius-md)', whiteSpace: 'pre-wrap', overflowX: 'auto' } as React.CSSProperties,
  rel: { marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 6 } as React.CSSProperties,
  relPill: { fontSize: 11.5, padding: '3px 9px', borderRadius: 99, border: '1px solid var(--border)', color: 'var(--muted)' } as React.CSSProperties,
  hint: { textAlign: 'center', color: 'var(--muted)', fontSize: 12.5, marginTop: 12 } as React.CSSProperties,
  controls: { display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: 20 } as React.CSSProperties,
  btn: { padding: '10px 18px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)', fontWeight: 600, fontSize: 14, cursor: 'pointer' } as React.CSSProperties,
  btnPrimary: { padding: '10px 18px', borderRadius: 'var(--radius-md)', border: 'none', background: 'var(--accent)', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' } as React.CSSProperties,
  stat: { textAlign: 'center', color: 'var(--muted)', fontSize: 13, marginTop: 14 } as React.CSSProperties,
};

export const FlashcardsDeck: React.FC = () => {
  const [order, setOrder] = useState<number[]>(() => GLOSSARY.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());

  const total = order.length;
  const card = GLOSSARY[order[pos]];

  const shuffleDeck = useCallback(() => {
    setOrder(shuffled(GLOSSARY.map((_, i) => i)));
    setPos(0);
    setFlipped(false);
  }, []);

  const next = useCallback(() => {
    setFlipped(false);
    setPos((p) => (p + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setFlipped(false);
    setPos((p) => (p - 1 + total) % total);
  }, [total]);

  const markKnown = useCallback(() => {
    setKnown((prev) => {
      const nextSet = new Set(prev);
      if (card) nextSet.add(card.term);
      return nextSet;
    });
    next();
  }, [card, next]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (document.activeElement as HTMLElement)?.tagName;
      if (['INPUT', 'TEXTAREA'].includes(tag)) return;
      if (e.key === ' ') { e.preventDefault(); setFlipped((f) => !f); }
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const pct = useMemo(() => Math.round((known.size / GLOSSARY.length) * 100), [known.size]);

  if (!card) {
    return <div style={T.wrap}>No glossary terms found.</div>;
  }

  return (
    <div style={T.wrap}>
      <p style={T.kicker}>Study tool</p>
      <h1 style={T.h1}>Glossary flashcards</h1>
      <p style={T.lede}>
        {GLOSSARY.length} terms from the Payload curriculum. Click the card (or press space) to
        flip it. Swipe through with ← / →. Mark terms you know to track progress.
      </p>

      <div style={T.bar}>
        <div style={T.barFill(pct)} />
      </div>
      <div style={{ ...T.stat, marginTop: 0, marginBottom: 14 }}>
        {known.size} of {GLOSSARY.length} marked known ({pct}%)
      </div>

      <div style={T.card} onClick={() => setFlipped((f) => !f)} role="button" aria-label="Flip card">
        <span style={T.side}>{flipped ? 'Definition' : 'Term'}</span>
        {flipped ? (
          <div>
            <p style={T.def}>{card.definition}</p>
            {card.example && <pre style={T.ex}>{card.example}</pre>}
            {card.relatedTerms && card.relatedTerms.length > 0 && (
              <div style={T.rel}>
                {card.relatedTerms.map((r) => <span key={r} style={T.relPill}>{r}</span>)}
              </div>
            )}
          </div>
        ) : (
          <div style={T.term}>{card.term}</div>
        )}
      </div>
      <div style={T.hint}>Card {pos + 1} of {total} · click card or press space to flip</div>

      <div style={T.controls}>
        <button style={T.btn} onClick={prev}>← Prev</button>
        <button style={T.btnPrimary} onClick={markKnown}>✓ I know this</button>
        <button style={T.btn} onClick={next}>Next →</button>
        <button style={T.btn} onClick={shuffleDeck}>🔀 Shuffle</button>
        <button style={T.btn} onClick={() => setKnown(new Set())}>Reset progress</button>
      </div>

      <p style={{ marginTop: 28 }}>
        <Link href="/glossary" style={{ color: 'var(--accent)', fontWeight: 600 }}>Read the full glossary →</Link>
        {'  ·  '}
        <Link href="/" style={{ color: 'var(--accent)', fontWeight: 600 }}>Back to course</Link>
      </p>
    </div>
  );
};
