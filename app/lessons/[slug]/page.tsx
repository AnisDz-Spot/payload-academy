import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { LESSONS } from '@/data/lessons';
import { CHALLENGES } from '@/data/challenges';
import {
  PAYLOAD_VERIFIED_VERSION,
  NEXTJS_TARGET,
  LESSON_COUNT,
  CURRICULUM_MODULE_COUNT,
} from '@/data/curriculum';
import {
  SITE_URL,
  SITE_NAME,
  isFreeLesson,
  lessonDescription,
  lessonPreview,
  lessonOutline,
  docsUrl,
} from '@/lib/seo';
import { OpenLessonButton } from '@/components/OpenLessonButton';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return LESSONS.map((l) => ({ slug: l.id }));
}

export function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return params.then(({ slug }) => {
    const lesson = LESSONS.find((l) => l.id === slug);
    if (!lesson) {
      return { title: 'Lesson not found' };
    }
    const description = lessonDescription(lesson.c);
    const url = `${SITE_URL}/lessons/${lesson.id}`;
    return {
      title: `${lesson.t} — Payload 3.x Tutorial`,
      description,
      keywords: [...(lesson.tags ?? []), lesson.m, 'Payload CMS', 'Next.js', 'headless CMS'],
      alternates: { canonical: url },
      openGraph: {
        type: 'article',
        title: `${lesson.t} — ${SITE_NAME}`,
        description,
        url,
        siteName: SITE_NAME,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${lesson.t} — ${SITE_NAME}`,
        description,
      },
    };
  });
}

const T = {
  page: { maxWidth: 820, margin: '0 auto', padding: '40px 20px 96px' } as React.CSSProperties,
  crumb: { fontSize: 13, color: 'var(--muted)', marginBottom: 18 } as React.CSSProperties,
  kicker: { fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)' } as React.CSSProperties,
  h1: { fontSize: 'clamp(1.7rem, 3.6vw, 2.4rem)', fontWeight: 800, margin: '8px 0 14px', letterSpacing: '-0.02em' } as React.CSSProperties,
  chips: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 26 } as React.CSSProperties,
  chip: (color: string): React.CSSProperties => ({
    fontSize: 12, padding: '4px 10px', borderRadius: 99, color,
    border: `1px solid ${color}55`, background: `${color}18`, fontWeight: 600,
  }),
  body: { fontSize: '1.02rem', lineHeight: 1.7 } as React.CSSProperties,
  panel: { border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'var(--card)', padding: '20px 22px', marginTop: 28 } as React.CSSProperties,
  panelTitle: { fontSize: '0.95rem', fontWeight: 700, margin: '0 0 12px' } as React.CSSProperties,
  outline: { margin: 0, paddingLeft: 20, lineHeight: 1.9, color: 'var(--text)' } as React.CSSProperties,
  cta: { display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 18, padding: '12px 22px', borderRadius: 'var(--radius-md)', background: 'var(--accent)', color: '#fff', border: 'none', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'none' } as React.CSSProperties,
  relatedGrid: { display: 'grid', gap: 8 } as React.CSSProperties,
  relatedItem: { display: 'block', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text)', background: 'var(--panel)' } as React.CSSProperties,
};

export default async function LessonPage({ params }: PageProps) {
  const { slug } = await params;
  const index = LESSONS.findIndex((l) => l.id === slug);
  if (index === -1) notFound();
  const lesson = LESSONS[index];
  const free = isFreeLesson(index);
  const challenge = CHALLENGES[lesson.id];
  const docs = docsUrl(challenge?.docsPath);
  const outline = lessonOutline(lesson.c);
  const related = LESSONS.map((l, i) => ({ l, i })).filter(({ l }) => l.m === lesson.m && l.id !== lesson.id).slice(0, 3);
  const url = `${SITE_URL}/lessons/${lesson.id}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: lesson.t,
    description: lessonDescription(lesson.c, 300),
    url,
    inLanguage: 'en',
    educationalLevel: lesson.difficulty ?? 'intermediate',
    learningResourceType: 'Tutorial',
    teaches: lesson.tags ?? [],
    isPartOf: {
      '@type': 'Course',
      name: `${SITE_NAME} — Payload CMS 3.x`,
      url: SITE_URL,
    },
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    version: PAYLOAD_VERIFIED_VERSION,
  };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Lessons', item: `${SITE_URL}/lessons` },
      { '@type': 'ListItem', position: 2, name: lesson.t, item: url },
    ],
  };

  return (
    <div style={T.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <p style={T.crumb}>
        <Link href="/lessons" style={{ color: 'var(--accent)' }}>Curriculum</Link>
        {' / '}
        <span>{lesson.m}</span>
        {' / '}
        <span>Lesson {index + 1} of {LESSON_COUNT}</span>
      </p>

      <p style={T.kicker}>{lesson.m}</p>
      <h1 style={T.h1}>
        {lesson.t}
        {lesson.badge ? <span style={{ marginLeft: 10, fontSize: 12, color: 'var(--accent)' }}>{lesson.badge}</span> : null}
      </h1>

      <div style={T.chips}>
        <span style={T.chip('#10b981')}>🔒 verified v{lesson.verified ?? PAYLOAD_VERIFIED_VERSION}</span>
        {lesson.difficulty ? <span style={T.chip('#818cf8')}>{lesson.difficulty}</span> : null}
        <span style={T.chip('#94a3b8')}>⏱ {lesson.readingMins ?? '—'} min read</span>
        <span style={T.chip(free ? '#34d399' : '#fb923c')}>{free ? 'FREE' : 'PRO'}</span>
        <span style={T.chip('#94a3b8')}>Next.js {NEXTJS_TARGET}</span>
      </div>

      {free ? (
        <>
          <div className="lesson-content-body" style={T.body} dangerouslySetInnerHTML={{ __html: lesson.c }} />
        </>
      ) : (
        <>
          <div style={{ ...T.body, background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 22px' }}>
            <p style={{ marginTop: 0 }}>{lessonPreview(lesson.c)}</p>
          </div>
          {outline.length > 0 && (
            <div style={T.panel}>
              <h2 style={T.panelTitle}>In this Pro lesson</h2>
              <ul style={T.outline}>
                {outline.slice(0, 12).map((h, i) => <li key={i}>{h}</li>)}
              </ul>
            </div>
          )}
          <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 18 }}>
            The full lesson body, interactive challenge, and quiz unlock with Academy Pro.
          </p>
        </>
      )}

      <OpenLessonButton lessonId={lesson.id} style={T.cta}>
        {free ? '▶ Open the full lesson in the Academy' : '⚡ Unlock this lesson in the Academy'}
      </OpenLessonButton>

      {docs && (
        <div style={T.panel}>
          <h2 style={T.panelTitle}>Sources &amp; further reading</h2>
          <p style={{ margin: '0 0 12px', color: 'var(--muted)', fontSize: 14 }}>
            This lesson is mapped to the official Payload documentation. Cross-check the
            implementation there, then bring it back into the graded challenge.
          </p>
          <a href={docs} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontWeight: 600 }}>
            📖 {docs}
          </a>
          <div style={{ marginTop: 10 }}>
            <a href="https://payloadcms.com/docs" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)', fontSize: 14 }}>
              All Payload documentation →
            </a>
          </div>
        </div>
      )}

      {related.length > 0 && (
        <div style={T.panel}>
          <h2 style={T.panelTitle}>Related lessons in {lesson.m}</h2>
          <div style={T.relatedGrid}>
            {related.map(({ l, i }) => (
              <Link key={l.id} href={`/lessons/${l.id}`} style={T.relatedItem}>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{l.m} · Lesson {i + 1}</span>
                <div style={{ fontWeight: 600 }}>{l.t}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <p style={{ marginTop: 32 }}>
        <Link href="/lessons" style={{ color: 'var(--accent)', fontWeight: 600 }}>← Back to all {LESSON_COUNT} lessons</Link>
        {'  ·  '}
        <span style={{ color: 'var(--muted)', fontSize: 13 }}>{CURRICULUM_MODULE_COUNT} modules · {LESSON_COUNT} lessons · Payload v{PAYLOAD_VERIFIED_VERSION}</span>
      </p>
    </div>
  );
}
