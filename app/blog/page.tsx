import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { sortedPosts } from '@/data/posts';
import { SITE_URL, SITE_NAME } from '@/lib/seo';

const url = `${SITE_URL}/blog`;

export const metadata: Metadata = {
  title: 'Payload CMS 3.x Articles & Guides',
  description:
    'In-depth articles on Payload CMS 3.x and Next.js: the mental model, access-control pitfalls, and choosing between the Local API, REST, and GraphQL.',
  keywords: ['Payload CMS', 'Next.js', 'headless CMS', 'articles', 'tutorials'],
  alternates: { canonical: url },
  openGraph: {
    type: 'website',
    title: `Payload CMS 3.x Articles — ${SITE_NAME}`,
    description: 'In-depth articles on Payload CMS 3.x and Next.js.',
    url,
    siteName: SITE_NAME,
  },
  twitter: { card: 'summary_large_image' },
};

const T = {
  page: { maxWidth: 820, margin: '0 auto', padding: '40px 20px 96px' } as React.CSSProperties,
  kicker: { fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--accent)' } as React.CSSProperties,
  h1: { fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 800, margin: '8px 0 12px', letterSpacing: '-0.02em' } as React.CSSProperties,
  lead: { color: 'var(--muted)', fontSize: '1.02rem', lineHeight: 1.7, margin: '0 0 34px', maxWidth: 640 } as React.CSSProperties,
  card: { display: 'block', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', background: 'var(--card)', padding: '20px 22px', marginBottom: 14, textDecoration: 'none', color: 'var(--text)' } as React.CSSProperties,
  meta: { fontSize: 12, color: 'var(--muted)', display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' } as React.CSSProperties,
  cardTitle: { fontSize: '1.22rem', fontWeight: 700, margin: '8px 0 8px', letterSpacing: '-0.01em' } as React.CSSProperties,
  cardDesc: { color: 'var(--muted)', fontSize: '0.96rem', lineHeight: 1.65, margin: 0 } as React.CSSProperties,
  chips: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 12 } as React.CSSProperties,
  chip: { fontSize: 11, padding: '3px 9px', borderRadius: 99, color: 'var(--accent)', border: '1px solid var(--border)', background: 'var(--panel)', fontWeight: 600 } as React.CSSProperties,
  read: { color: 'var(--accent)', fontWeight: 700, marginTop: 12, display: 'inline-block', fontSize: 13 } as React.CSSProperties,
};

function fmt(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function BlogIndexPage() {
  const posts = sortedPosts();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${SITE_NAME} Articles`,
    description: 'In-depth articles on Payload CMS 3.x and Next.js.',
    url,
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      datePublished: p.date,
      url: `${SITE_URL}/blog/${p.slug}`,
    })),
  };

  return (
    <div style={T.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <p style={T.kicker}>Articles</p>
      <h1 style={T.h1}>Payload CMS 3.x, explained without the fluff</h1>
      <p style={T.lead}>
        Short, opinionated pieces on the parts of Payload that trip people up — the mental model,
        the security defaults, and the trade-offs between its three data APIs.
      </p>

      {posts.map((post) => (
        <Link key={post.slug} href={`/blog/${post.slug}`} style={T.card}>
          <div style={T.meta}>
            <time dateTime={post.date}>{fmt(post.date)}</time>
            <span>·</span>
            <span>{post.readingMins} min read</span>
          </div>
          <h2 style={T.cardTitle}>{post.title}</h2>
          <p style={T.cardDesc}>{post.description}</p>
          <div style={T.chips}>
            {post.tags.map((t) => (
              <span key={t} style={T.chip}>{t}</span>
            ))}
          </div>
          <span style={T.read}>Read article →</span>
        </Link>
      ))}

      <p style={{ marginTop: 32 }}>
        <Link href="/lessons" style={{ color: 'var(--accent)', fontWeight: 600 }}>Browse the full curriculum →</Link>
      </p>
    </div>
  );
}
