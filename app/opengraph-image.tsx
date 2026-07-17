import { ImageResponse } from 'next/og';

/**
 * OG image 1200x630 sinh luc build (ImageResponse). Chu de ASCII/EN vi font
 * mac dinh cua next/og khong du dau tieng Viet; dinh vi EN von la nhan chuan.
 * Mau theo token: paper #FBFBFC, ink #111113, do #E4341E chi o dau cham.
 */
export const alt = '.touch · Provenance-backed B2B matching';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
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
          background: '#FBFBFC',
          color: '#111113',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 9999,
              background: '#E4341E',
              marginRight: 10,
              marginTop: 34,
            }}
          />
          <div style={{ fontSize: 148, fontWeight: 700, letterSpacing: '-0.03em' }}>touch</div>
        </div>
        <div style={{ fontSize: 34, color: '#3E3E45', marginTop: 18 }}>
          Provenance-backed B2B matching
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 10,
            background: '#111113',
          }}
        />
      </div>
    ),
    { ...size },
  );
}
