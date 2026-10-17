import { ImageResponse } from 'next/og';
import { PAYLOAD_VERIFIED_VERSION, NEXTJS_TARGET, LESSON_COUNT, CURRICULUM_MODULE_COUNT } from '@/data/curriculum';

export const alt = 'Payload Academy — Master Payload CMS 3.x';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
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
            'radial-gradient(circle at 15% 0%, rgba(249,115,22,0.28) 0%, transparent 55%), radial-gradient(circle at 90% 120%, rgba(99,102,241,0.30) 0%, transparent 55%)',
          padding: '64px 72px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56, height: 56, borderRadius: 14, backgroundColor: '#f97316',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, fontWeight: 800, color: '#fff',
            }}
          >
            P
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 26, fontWeight: 800, color: '#f3f4f6' }}>Payload Academy</span>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#fb923c', letterSpacing: 2 }}>
              PAYLOAD {PAYLOAD_VERIFIED_VERSION} · NEXT.JS {NEXTJS_TARGET}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: 68, fontWeight: 900, color: '#ffffff', letterSpacing: -2, lineHeight: 1.05 }}>
            Master Payload CMS
          </span>
          <span style={{ fontSize: 68, fontWeight: 900, color: '#fb923c', letterSpacing: -2, lineHeight: 1.05 }}>
            the code-first way
          </span>
          <span style={{ fontSize: 26, color: '#94a3b8', marginTop: 18 }}>
            {`${LESSON_COUNT} lessons · ${CURRICULUM_MODULE_COUNT} modules · AST-graded coding challenges · verifiable certificate`}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#34d399' }}>🔒 verified content</span>
          <span style={{ fontSize: 18, color: '#475569' }}>·</span>
          <span style={{ fontSize: 18, color: '#94a3b8' }}>payload-academy</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
