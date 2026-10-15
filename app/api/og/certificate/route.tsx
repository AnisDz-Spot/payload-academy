import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name') || 'Master Engineer';
    const id = searchParams.get('id') || 'PA-3X-CERT-2026';
    const score = searchParams.get('score') || '98';
    const date = searchParams.get('date') || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#090a0f',
            backgroundImage: 'radial-gradient(circle at 50% -20%, rgba(99, 102, 241, 0.35) 0%, transparent 60%), radial-gradient(circle at 80% 120%, rgba(16, 185, 129, 0.2) 0%, transparent 50%)',
            border: '12px solid #1e2235',
            padding: '48px 56px',
            boxSizing: 'border-box',
            fontFamily: 'sans-serif',
            position: 'relative',
          }}
        >
          {/* Top Row: Brand & Verification Pill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#6366f1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: 'bold',
                  color: 'white',
                  boxShadow: '0 4px 20px rgba(99, 102, 241, 0.5)',
                }}
              >
                P
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '24px', fontWeight: '800', color: '#ffffff', letterSpacing: '-0.5px' }}>
                  Payload Academy
                </span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#818cf8', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Official Credential Registry
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '999px',
                padding: '6px 16px',
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '999px',
                  backgroundColor: '#10b981',
                }}
              />
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#34d399', letterSpacing: '0.5px' }}>
                VERIFIED AUTHENTIC
              </span>
            </div>
          </div>

          {/* Center: Awarded Recipient & Certification Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              margin: '10px 0',
            }}
          >
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#94a3b8', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '8px' }}>
              Certificate of Mastery Awarded To
            </span>
            <span
              style={{
                fontSize: '46px',
                fontWeight: '900',
                color: '#ffffff',
                letterSpacing: '-1px',
                marginBottom: '10px',
                textShadow: '0 2px 10px rgba(0,0,0,0.5)',
              }}
            >
              {name}
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                padding: '8px 24px',
              }}
            >
              <span style={{ fontSize: '18px', fontWeight: '800', color: '#60a5fa' }}>
                Payload CMS 3.x Certified Master Engineer
              </span>
              <span style={{ color: '#475569' }}>•</span>
              <span style={{ fontSize: '16px', fontWeight: '700', color: '#34d399' }}>
                Score: {score}%
              </span>
            </div>
          </div>

          {/* Bottom Bar: Metadata & Seal */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '16px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Credential ID
              </span>
              <span style={{ fontSize: '14px', fontFamily: 'monospace', fontWeight: 'bold', color: '#cbd5e1' }}>
                {id}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Issued Date
              </span>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#cbd5e1' }}>
                {date}
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(234, 179, 8, 0.15)',
                border: '1px solid rgba(234, 179, 8, 0.3)',
                borderRadius: '10px',
                padding: '6px 14px',
              }}
            >
              <span style={{ fontSize: '16px' }}>🏅</span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#fbbf24' }}>
                Payload CMS 3.0 Master
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : 'Internal Server Error';
    return new Response(`Failed to generate image: ${errorMsg}`, {
      status: 500,
    });
  }
}
