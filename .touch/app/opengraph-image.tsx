import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * OG image 1200x630 ban TOI (huong C): graphite + do dam theo DESIGN_SPEC_DARK.
 * Font Be Vietnam Pro nap tu assets/og (TTF convert tu woff2 self-host, du dau
 * tieng Viet) nen tagline hien thi duoc tieng Viet day du.
 */
export const alt = '.touch · Chạm đúng đối tác, bằng những match chứng-minh-được';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const [reg, bold] = await Promise.all([
    readFile(join(process.cwd(), 'assets/og/BeVietnamPro-400.ttf')),
    readFile(join(process.cwd(), 'assets/og/BeVietnamPro-700.ttf')),
  ]);

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
          background: '#08080A',
          backgroundImage:
            'radial-gradient(600px 400px at 80% 10%, rgba(196,15,15,0.22), transparent 65%), radial-gradient(500px 400px at 12% 85%, rgba(60,70,120,0.16), transparent 65%)',
          color: '#F2F2F5',
          fontFamily: 'BeVietnam',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 34,
            left: 44,
            display: 'flex',
            alignItems: 'center',
            fontSize: 17,
            letterSpacing: 6,
            color: '#9A9AA6',
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 9999,
              background: '#C40F0F',
              boxShadow: '0 0 12px 2px rgba(196,15,15,0.8)',
              marginRight: 12,
            }}
          />
          ENGINE · LIVE
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 9999,
              background: '#C40F0F',
              boxShadow: '0 0 28px 4px rgba(196,15,15,0.65)',
              marginRight: 10,
              marginTop: 40,
            }}
          />
          <div style={{ fontSize: 150, fontWeight: 700, letterSpacing: '-0.03em' }}>touch</div>
        </div>
        <div style={{ display: 'flex', fontSize: 32, color: '#9A9AA6', marginTop: 14 }}>
          <span>Chạm đúng đối tác, bằng những match&nbsp;</span>
          <span style={{ color: '#F53B2E' }}>chứng-minh-được</span>
          <span>.</span>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 10,
            background: '#C40F0F',
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'BeVietnam', data: reg, weight: 400, style: 'normal' },
        { name: 'BeVietnam', data: bold, weight: 700, style: 'normal' },
      ],
    },
  );
}
