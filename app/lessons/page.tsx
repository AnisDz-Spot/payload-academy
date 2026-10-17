import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LESSONS } from '@/data/lessons';
import { PAYLOAD_VERIFIED_VERSION, NEXTJS_TARGET, CURRICULUM_MODULE_COUNT, LESSON_COUNT } from '@/data/curriculum';
import { SITE_URL, SITE_NAME, isFreeLesson, lessonDescription } from '@/lib/seo';

export const metadata: Metadata = {
  title: `All ${LESSON_COUNT} Payload CMS 3.x Lessons — Full Curriculum`,
  description: `Browse the complete ${SITE_NAME} curriculum: ${LESSONS.length} hands-on lessons across ${CURRICULUM_MODULE_COUNT} modules covering collections, fields, access control, hooks, auth, rich text, jobs, plugins, AI, and production deployment with Payload 3.${PAYLOAD_VERIFIED_VERSION.split('.')[1]} and Next.js ${NEXTJS_TARGET}.`,
  alternates: { canonical: `${SITE_URL}/lessons` },
};

const T = {
  page: { maxWidth: 1040, margin: '0 auto', padding: '48px 20px 96px' } as React.CSSProperties,
  kicker: { fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)' } as React.CSSProperties,
  h1: { fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, margin: '10px 0 12px', letterSpacing: '-0.02em' } as React.CSSProperties,
  lede: { fontSize: '1.05rem', color: 'var(--muted)', maxWidth: 720, lineHeight: 1.6 } as React.CSSProperties,
  moduleWrap: { marginTop: 36 } as React.CSSProperties,
  moduleTitle: { fontSize: '1.05rem', fontWeight: 700, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 10 } as React.CSSProperties,
  grid: { display: 'grid', gap: 10 } as React.CSSProperties,
  card: { display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--card)', textDecoration: 'none', color: 'var(--text)' } as React.CSSProperties,
  num: { fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--muted)', minWidth: 26 } as React.CSSProperties,
  title: { fontWeight: 600, fontSize: '0.98rem', flex: 1 } as React.CSSProperties,
  badge: (pro: boolean): React.CSSProperties => ({
    fontSize: 10, fontWeight: 800, letterSpacing: '0.04em', padding: '3px 8px', borderRadius: 99,
    background: pro ? 'rgba(249,115,22,0.14)' : 'rgba(16,185,129,0.14)',
    color: pro ? '#fb923c' : '#34d399',
    border: `1px solid ${pro ? 'rgba(249,115,22,0.3)' : 'rgba(16,185,129,0.3)'}`,
  }),
  meta: { fontSize: 12, color: 'var(--muted)', minWidth: 66, textAlign: 'right' } as React.CSSProperties,
};

export default function LessonsIndexPage() {
  const modules: string[] = [];
  for (const l of LESSONS) if (!modules.includes(l.m)) modules.push(l.m);

  return (
    <div style={T.page}>
      <p style={T.kicker}>Curriculum</p>
      <h1 style={T.h1}>All {LESSONS.length} Payload 3.x lessons</h1>
      <p style={T.lede}>
        A structured path from “what is Payload?” to production deployment and multi-tenant
        architecture. Every lesson pairs a written deep-dive with an AST-graded coding
        challenge, a quiz, and a citable link back to the official Payload documentation.
        Content is verified against Payload v{PAYLOAD_VERIFIED_VERSION} and Next.js {NEXTJS_TARGET}.
      </p>

      {modules.map((mod) => (
        <section key={mod} style={T.moduleWrap}>
          <h2 style={T.moduleTitle}>{mod}</h2>
          <div style={T.grid}>
            {LESSONS.map((lesson, index) => {
              if (lesson.m !== mod) return null;
              const free = isFreeLesson(index);
              return (
                <Link key={lesson.id} href={`/lessons/${lesson.id}`} style={T.card}>
                  <span style={T.num}>{String(index + 1).padStart(2, '0')}</span>
                  <span style={T.title}>{lesson.t}</span>
                  <span style={T.badge(!free)}>{free ? 'FREE' : 'PRO'}</span>
                  <span style={T.meta}>
                    {lesson.readingMins ?? '—'} min
                    {lesson.difficulty ? ` · ${lesson.difficulty}` : ''}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      <p style={{ marginTop: 40, color: 'var(--muted)', fontSize: 13 }}>
        First lesson:{' '}
        <Link href={`/lessons/${LESSONS[0].id}`} style={{ color: 'var(--accent)' }}>
          {LESSONS[0].t}
        </Link>{' '}
        · {lessonDescription(LESSONS[0].c, 90)}
      </p>
      <p style={{ marginTop: 8 }}>
        <Link href="/" style={{ color: 'var(--accent)', fontWeight: 600 }}>← Enter the Academy</Link>
      </p>
    </div>
  );
}
