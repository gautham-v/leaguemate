import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#09090b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 7,
          border: '1px solid #27272a',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 20, height: 3, background: '#fafafa', borderRadius: 2 }} />
          <div style={{ width: 11, height: 3, background: '#fafafa', borderRadius: 2 }} />
          <div style={{ width: 20, height: 3, background: '#fafafa', borderRadius: 2 }} />
        </div>
      </div>
    ),
    { width: 32, height: 32 }
  );
}
