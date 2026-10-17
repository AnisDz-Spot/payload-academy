import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { POSTS, getPost } from '@/data/posts';
import { LESSONS } from '@/data/lessons';
import { SITE_URL, SITE_NAME } from '@/lib/seo';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: PageProps): Promise<Metadata> {
  return params.then(({ slug }) => {
    const post = getPost(slug);
    if (!post) return { title: 'Article not found' };
    const url = `${SITE_URL}/blog/${post.slug}`;
    return {
      title: post.title,
      description: post.description,
      keywords: [...post.tags, 'Payload CMS', 'Next.js'],
      alternates: { canonical: url },
      openGraph: {
        type: 'article',
        title: post.title,
        description: post.description,
        url,
        siteName: SITE_NAME,
        publishedTime: post.date,
        authors: [post.author],
        tags: post.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.description,
      },
    };
  });
}

const T = {
  page: { maxWidth: 760, margin: '0 auto', padding: '40px 20px 96px' } as React.CSSProperties,
  crumb: { fontSize: 13, color: 'var(--muted)', marginBottom: 18 } as React.CSSProperties,
  kicker: { fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)' } as React.CSSProperties,
  h1: { fontSize: 'clamp(1.7rem, 3.6vw, 2.4rem)', fontWeight: 800, margin: '8px 0 14px', letterSpacing: '-0.02em', lineHeight: 1.18 } as React.CSSProperties,
  meta: { fontSize: 13, color: 'var(--muted)', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 22 } as React.CSSProperties,
  chips: { display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 } as React.CSSProperties,
  chip: { fontSize: 12, padding: '4px 10px', borderRadius: 99, color: 'var(--accent)', border: '1px solid var(--border)', background: 'var(--panel)', fontWeight: 600 } as React.CSSProperties,
  body: { fontSize: '1.05rem', lineHeight: 1.75 } as React.CSSProperties,
  panel: { border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'var(--card)', padding: '20px 22px', marginTop: 28 } as React.CSSProperties,
  panelTitle: { fontSize: '0.95rem', fontWeight: 700, margin: '0 0 12px' } as React.CSSProperties,
  relatedGrid: { display: 'grid', gap: 8 } as React.CSSProperties,
  relatedItem: { display: 'block', padding: '10px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', textDecoration: 'none', color: 'var(--text)', background: 'var(--panel)' } as React.CSSProperties,
};

function fmt(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const related = (post.relatedLessons ?? [])
    .map((id) => LESSONS.findIndex((l) => l.id === id))
    .filter((i) => i !== -1)
    .slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url,
    datePublished: post.date,
    dateModified: post.date,
    author: { '@type': 'Organization', name: post.author, url: SITE_URL },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    keywords: post.tags.join(', '),
    inLanguage: 'en',
    mainEntityOfPage: url,
  };

  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Articles', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 2, name: post.title, item: url },
    ],
  };

  return (
    <div style={T.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }} />

      <p style={T.crumb}>
        <Link href="/blog" style={{ color: 'var(--accent)' }}>Articles</Link>
        {' / '}
        <span>{post.tags[0]}</span>
      </p>

      <p style={T.kicker}>Article</p>
      <h1 style={T.h1}>{post.title}</h1>

      <div style={T.meta}>
        <time dateTime={post.date}>{fmt(post.date)}</time>
        <span>·</span>
        <span>{post.readingMins} min read</span>
        <span>·</span>
        <span>{post.author}</span>
      </div>

      <div style={T.chips}>
        {post.tags.map((t) => (
          <span key={t} style={T.chip}>{t}</span>
        ))}
      </div>

      <div className="lesson-content-body" style={T.body} dangerouslySetInnerHTML={{ __html: post.content }} />

      {related.length > 0 && (
        <div style={T.panel}>
          <h2 style={T.panelTitle}>Go deeper in the course</h2>
          <div style={T.relatedGrid}>
            {related.map((i) => (
              <Link key={LESSONS[i].id} href={`/lessons/${LESSONS[i].id}`} style={T.relatedItem}>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{LESSONS[i].m} · Lesson {i + 1}</span>
                <div style={{ fontWeight: 600 }}>{LESSONS[i].t}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <p style={{ marginTop: 32 }}>
        <Link href="/blog" style={{ color: 'var(--accent)', fontWeight: 600 }}>← All articles</Link>
      </p>
    </div>
  );
}
