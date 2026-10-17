import { ImageResponse } from 'next/og';
import { LESSONS } from '@/data/lessons';
import { PAYLOAD_VERIFIED_VERSION } from '@/data/curriculum';
import { isFreeLesson } from '@/lib/seo';

export const alt = 'Payload Academy lesson';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = LESSONS.findIndex((l) => l.id === slug);
  const lesson = LESSONS[index] ?? LESSONS[0];
  const lessonNumber = (index === -1 ? 0 : index) + 1;
  const free = isFreeLesson(index);

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
            'radial-gradient(circle at 10% 0%, rgba(249,115,22,0.22) 0%, transparent 50%), radial-gradient(circle at 95% 120%, rgba(99,102,241,0.25) 0%, transparent 55%)',
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
                {lesson.m.toUpperCase()}
              </span>
            </div>
          </div>
          <div
            style={{
              display: 'flex', alignItems: 'center', padding: '8px 18px', borderRadius: 999,
              backgroundColor: free ? 'rgba(16,185,129,0.15)' : 'rgba(249,115,22,0.15)',
              border: `1px solid ${free ? 'rgba(16,185,129,0.4)' : 'rgba(249,115,22,0.4)'}`,
            }}
          >
            <span style={{ fontSize: 16, fontWeight: 800, color: free ? '#34d399' : '#fb923c' }}>
              {free ? 'FREE LESSON' : 'PRO LESSON'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1000 }}>
          <span style={{ fontSize: 26, color: '#64748b', fontWeight: 700, marginBottom: 10 }}>
            Lesson {lessonNumber} of 50
          </span>
          <span style={{ fontSize: 64, fontWeight: 900, color: '#ffffff', letterSpacing: -1.5, lineHeight: 1.1 }}>
            {lesson.t}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#34d399' }}>🔒 v{PAYLOAD_VERIFIED_VERSION}</span>
          <span style={{ fontSize: 18, color: '#475569' }}>·</span>
          <span style={{ fontSize: 18, color: '#94a3b8' }}>
            {lesson.difficulty ?? 'intermediate'} · {lesson.readingMins ?? 4} min read
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
