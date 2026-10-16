import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LESSONS } from '@/data/lessons';
import { CHALLENGE_SPECS } from '@/data/challengeSuite';
import { GLOSSARY } from '@/data/glossary';
import { ACHIEVEMENTS } from '@/data/achievements';
import { CHANGELOG_DATA } from '@/data/changelog';
import {
  PAYLOAD_VERIFIED_VERSION,
  NEXTJS_TARGET,
  CURRICULUM_MODULE_COUNT,
  LESSON_COUNT,
} from '@/data/curriculum';
import { SITE_URL, SITE_NAME, FREE_LESSON_COUNT } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Master Payload CMS 3.x — Free Interactive Course & Certificate',
  description: `Learn Payload CMS 3.x end-to-end: ${LESSON_COUNT} hands-on lessons, ${CURRICULUM_MODULE_COUNT} modules, ${Object.keys(CHALLENGE_SPECS).length} AST-graded coding challenges, and a verifiable certificate. Built for Next.js ${NEXTJS_TARGET}.`,
  alternates: { canonical: `${SITE_URL}/start` },
};

const moduleCounts: { name: string; count: number }[] = [];
for (const l of LESSONS) {
  const existing = moduleCounts.find((m) => m.name === l.m);
  if (existing) existing.count += 1;
  else moduleCounts.push({ name: l.m, count: 1 });
}

const STATS = [
  { value: `${LESSON_COUNT}`, label: 'hands-on lessons' },
  { value: `${CURRICULUM_MODULE_COUNT}`, label: 'structured modules' },
  { value: `${Object.keys(CHALLENGE_SPECS).length}`, label: 'AST-graded challenges' },
  { value: `${LESSON_COUNT}`, label: 'quizzes + final exam' },
  { value: `${GLOSSARY.length}`, label: 'glossary terms' },
  { value: `${ACHIEVEMENTS.length}`, label: 'achievements' },
];

const DIFFERENTIATORS = [
  {
    icon: '🧪',
    title: 'Challenges that actually run',
    body: 'Every coding exercise is parsed server-side into a real TypeScript AST and graded structurally — not by fragile string matching. Submit collections, hooks, access functions, and migrations.',
  },
  {
    icon: '🛡️',
    title: 'Tools that execute your code',
    body: 'A config linter that runs your payload.config through a real AST rule set, an RBAC matrix that evaluates your access functions, and a query simulator with a working query engine.',
  },
  {
    icon: '🤖',
    title: 'AI tutor grounded in the lessons',
    body: 'The assistant retrieves the most relevant lessons first and answers with citations, so help stays on-topic and anchored to what the course actually teaches.',
  },
  {
    icon: '🏆',
    title: 'A certificate that verifies',
    body: 'Pass the proctored exam and issue an Open Badges 2.0 assertion with an HMAC signature anyone can verify from a public link.',
  },
  {
    icon: '🔒',
    title: 'Kept current',
    body: `Content is written and reviewed against Payload v${PAYLOAD_VERIFIED_VERSION} and Next.js ${NEXTJS_TARGET}, with a version badge on every lesson and a public changelog.`,
  },
  {
    icon: '📖',
    title: 'Citable, sourced lessons',
    body: 'Each lesson maps to the official Payload documentation so you can cross-check the implementation and go deeper.',
  },
];

const TOOLS = [
  ['Config Linter', '/config-linter'],
  ['Schema Studio', '/schema-builder'],
  ['Drizzle SQL Visualizer', '/db-visualizer'],
  ['RBAC Matrix', '/rbac-matrix'],
  ['Query Simulator', '/query-simulator'],
  ['Lexical AST Inspector', '/lexical-inspector'],
  ['CLI Workbench', '/terminal'],
  ['Live Preview Studio', '/live-preview-simulator'],
  ['Flashcards', '/flashcards'],
];

const FAQ = [
  {
    q: `Is ${SITE_NAME} free?`,
    a: `The first ${FREE_LESSON_COUNT} lessons, the glossary, flashcards, the study guide, and most interactive tools are free. Pro unlocks the remaining lessons, the final exam, and the verifiable certificate.`,
  },
  {
    q: 'Which versions does it target?',
    a: `Payload v${PAYLOAD_VERIFIED_VERSION} and Next.js ${NEXTJS_TARGET} (App Router). Every lesson carries a freshness badge and we publish changes in the changelog.`,
  },
  {
    q: 'Do I need experience with a headless CMS?',
    a: 'No. The course starts with what Payload is and how it differs from GUI-first CMSs, then builds up to advanced multi-tenant architecture and deployment.',
  },
  {
    q: 'How are challenges graded?',
    a: 'Your code is compiled to a TypeScript AST on the server and checked with per-lesson structural rules — so refactors and formatting changes still pass as long as the logic is correct.',
  },
];

const T = {
  page: { maxWidth: 1080, margin: '0 auto', padding: '56px 20px 100px' } as React.CSSProperties,
  hero: { textAlign: 'center', maxWidth: 820, margin: '0 auto' } as React.CSSProperties,
  kicker: { fontSize: 12, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--accent)' } as React.CSSProperties,
  h1: { fontSize: 'clamp(2rem, 5.5vw, 3.4rem)', fontWeight: 800, lineHeight: 1.1, margin: '14px 0 18px', letterSpacing: '-0.03em' } as React.CSSProperties,
  lede: { fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--muted)', lineHeight: 1.65 } as React.CSSProperties,
  ctaRow: { display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 28 } as React.CSSProperties,
  ctaPrimary: { padding: '14px 28px', borderRadius: 'var(--radius-md)', background: 'var(--accent)', color: '#fff', fontWeight: 700, textDecoration: 'none', fontSize: 15 } as React.CSSProperties,
  ctaGhost: { padding: '14px 28px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', color: 'var(--text)', fontWeight: 600, textDecoration: 'none', fontSize: 15, background: 'var(--card)' } as React.CSSProperties,
  stats: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, margin: '56px 0 8px' } as React.CSSProperties,
  stat: { border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'var(--card)', padding: '20px 16px', textAlign: 'center' } as React.CSSProperties,
  statVal: { fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent)', lineHeight: 1 } as React.CSSProperties,
  statLbl: { fontSize: 12.5, color: 'var(--muted)', marginTop: 8 } as React.CSSProperties,
  section: { marginTop: 64 } as React.CSSProperties,
  h2: { fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 8px' } as React.CSSProperties,
  sub: { color: 'var(--muted)', maxWidth: 720, marginBottom: 26, lineHeight: 1.6 } as React.CSSProperties,
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 } as React.CSSProperties,
  card: { border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'var(--card)', padding: '22px' } as React.CSSProperties,
  cardIcon: { fontSize: 26 } as React.CSSProperties,
  cardTitle: { fontWeight: 700, fontSize: '1.05rem', margin: '12px 0 8px' } as React.CSSProperties,
  cardBody: { color: 'var(--muted)', fontSize: 14.5, lineHeight: 1.6, margin: 0 } as React.CSSProperties,
  modGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 } as React.CSSProperties,
  modCard: { border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--panel)', padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 } as React.CSSProperties,
  toolWrap: { display: 'flex', flexWrap: 'wrap', gap: 10 } as React.CSSProperties,
  toolPill: { padding: '8px 14px', borderRadius: 99, border: '1px solid var(--border)', background: 'var(--card)', color: 'var(--text)', textDecoration: 'none', fontSize: 13.5, fontWeight: 600 } as React.CSSProperties,
  faq: { display: 'grid', gap: 12 } as React.CSSProperties,
  faqItem: { border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--card)', padding: '16px 18px' } as React.CSSProperties,
  faqQ: { fontWeight: 700, margin: '0 0 6px' } as React.CSSProperties,
  faqA: { color: 'var(--muted)', margin: 0, lineHeight: 1.6, fontSize: 14.5 } as React.CSSProperties,
  finalCta: { marginTop: 72, textAlign: 'center', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'var(--card)', padding: '40px 24px' } as React.CSSProperties,
};

export default function StartPage() {
  return (
    <div style={T.page}>
      <header style={T.hero}>
        <p style={T.kicker}>Payload CMS {PAYLOAD_VERIFIED_VERSION} · Next.js {NEXTJS_TARGET}</p>
        <h1 style={T.h1}>Master Payload CMS the code-first way</h1>
        <p style={T.lede}>
          A complete, interactive course for the modern Payload 3.x app framework. Learn by
          writing real collections, hooks, access control and migrations — then watch them get
          graded by a real compiler, not a regex.
        </p>
        <div style={T.ctaRow}>
          <Link href="/" style={T.ctaPrimary}>Start learning free →</Link>
          <Link href="/lessons" style={T.ctaGhost}>Browse all {LESSON_COUNT} lessons</Link>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 16 }}>
          No signup required · First {FREE_LESSON_COUNT} lessons free · {CHANGELOG_DATA.length} tracked releases
        </p>
      </header>

      <div style={T.stats}>
        {STATS.map((s) => (
          <div key={s.label} style={T.stat}>
            <div style={T.statVal}>{s.value}</div>
            <div style={T.statLbl}>{s.label}</div>
          </div>
        ))}
      </div>

      <section style={T.section}>
        <h2 style={T.h2}>Why it&apos;s different</h2>
        <p style={T.sub}>
          Most CMS courses stop at videos and multiple-choice. {SITE_NAME} gives you things that
          run — a real grader, working simulators, and a certificate you can verify.
        </p>
        <div style={T.grid}>
          {DIFFERENTIATORS.map((d) => (
            <div key={d.title} style={T.card}>
              <div style={T.cardIcon}>{d.icon}</div>
              <h3 style={T.cardTitle}>{d.title}</h3>
              <p style={T.cardBody}>{d.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={T.section}>
        <h2 style={T.h2}>The full curriculum</h2>
        <p style={T.sub}>
          {CURRICULUM_MODULE_COUNT} modules, {LESSON_COUNT} lessons, ordered from foundations to
          production. Jump straight in wherever you are.
        </p>
        <div style={T.modGrid}>
          {moduleCounts.map((m) => (
            <div key={m.name} style={T.modCard}>
              <span style={{ fontWeight: 600 }}>{m.name}</span>
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>{m.count} lessons</span>
            </div>
          ))}
        </div>
      </section>

      <section style={T.section}>
        <h2 style={T.h2}>Interactive developer tools</h2>
        <p style={T.sub}>
          Nine sandboxes and inspectors, most available without an account. Paste a config, run a
          query, simulate a persona — and see exactly what Payload would do.
        </p>
        <div style={T.toolWrap}>
          {TOOLS.map(([label, href]) => (
            <Link key={href} href={href} style={T.toolPill}>{label}</Link>
          ))}
        </div>
      </section>

      <section style={T.section}>
        <h2 style={T.h2}>Frequently asked</h2>
        <div style={T.faq}>
          {FAQ.map((f) => (
            <div key={f.q} style={T.faqItem}>
              <p style={T.faqQ}>{f.q}</p>
              <p style={T.faqA}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <div style={T.finalCta}>
        <h2 style={{ ...T.h2, margin: '0 0 10px' }}>Ready to build with Payload?</h2>
        <p style={{ ...T.sub, margin: '0 auto 24px' }}>
          Open the first lesson and ship your first collection in minutes.
        </p>
        <Link href="/" style={T.ctaPrimary}>Enter the Academy →</Link>
      </div>
    </div>
  );
}
