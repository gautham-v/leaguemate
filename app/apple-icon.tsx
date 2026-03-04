import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: '#09090b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 40,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
          <div style={{ width: 112, height: 16, background: '#fafafa', borderRadius: 8 }} />
          <div style={{ width: 62, height: 16, background: '#fafafa', borderRadius: 8 }} />
          <div style={{ width: 112, height: 16, background: '#fafafa', borderRadius: 8 }} />
        </div>
      </div>
    ),
    { width: 180, height: 180 }
  );
}
