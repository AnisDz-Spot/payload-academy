import { ImageResponse } from 'next/og';
import { POSTS, getPost } from '@/data/posts';

export const alt = 'Payload Academy article';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug) ?? POSTS[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#090d16',
          backgroundImage:
            'radial-gradient(circle at 12% 0%, rgba(249,115,22,0.22) 0%, transparent 52%), radial-gradient(circle at 92% 118%, rgba(129,140,248,0.28) 0%, transparent 55%)',
          padding: '60px 68px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div
              style={{
                width: 46, height: 46, borderRadius: 12, backgroundColor: '#f97316',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26, fontWeight: 800, color: '#fff',
              }}
            >
              P
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: '#f3f4f6' }}>Payload Academy</span>
              <span style={{ fontSize: 14, color: '#fb923c', fontWeight: 600, letterSpacing: 1 }}>
                ARTICLES
              </span>
            </div>
          </div>
          <div
            style={{
              display: 'flex', alignItems: 'center', padding: '8px 18px', borderRadius: 999,
              backgroundColor: 'rgba(129,140,248,0.15)', border: '1px solid rgba(129,140,248,0.4)',
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 800, color: '#a5b4fc' }}>
              {post.readingMins} MIN READ
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1020 }}>
          <span style={{ fontSize: 58, fontWeight: 900, color: '#ffffff', letterSpacing: -1.5, lineHeight: 1.12 }}>
            {post.title}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#fbbf24' }}>
            {post.tags.slice(0, 3).join('  ·  ')}
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
