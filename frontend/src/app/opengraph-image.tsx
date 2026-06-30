import { ImageResponse } from 'next/og';
import { SITE_DESCRIPTION, SITE_NAME } from '@/lib/site-config';

export const alt = SITE_NAME;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #134e4a 100%)',
          color: '#f8fafc',
          fontFamily: 'system-ui, sans-serif',
          padding: 48,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 12,
              background: '#134e4a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
            }}
          >
            ⚡
          </div>
          <span style={{ fontSize: 56, fontWeight: 700 }}>
            WebPulse <span style={{ color: '#2dd4bf' }}>AI</span>
          </span>
        </div>
        <p
          style={{
            fontSize: 28,
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: 900,
            lineHeight: 1.4,
          }}
        >
          {SITE_DESCRIPTION}
        </p>
      </div>
    ),
    { ...size },
  );
}
