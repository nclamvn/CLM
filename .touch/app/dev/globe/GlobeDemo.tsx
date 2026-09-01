'use client';

import { useState } from 'react';
import { Globe } from '@/components/globe/Globe';

type GlobeWindow = Window & { __globeActive?: number };

/**
 * Demo Globe cho TIP-03. Nut mount/unmount de kiem cleanup: sau khi unmount,
 * so instance con song (__globeActive) phai ve 0, chung to rAF va listener
 * da duoc go.
 */
export function GlobeDemo() {
  const [mounted, setMounted] = useState(true);
  const [active, setActive] = useState<number | null>(null);

  const readActive = () => {
    const w = window as GlobeWindow;
    setActive(w.__globeActive ?? 0);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 22, flexWrap: 'wrap' }}>
        <button
          className="btn btn-ghost"
          onClick={() => setMounted((m) => !m)}
          style={{ fontSize: 13, padding: '9px 16px' }}
        >
          {mounted ? 'Unmount globe' : 'Mount globe'}
        </button>
        <button
          className="btn btn-ghost"
          onClick={readActive}
          style={{ fontSize: 13, padding: '9px 16px' }}
        >
          Đọc __globeActive
        </button>
        {active !== null ? (
          <span className="mono" style={{ fontSize: 12, color: active === 0 ? 'var(--ok)' : 'var(--ink-2)' }}>
            __globeActive = {active}
          </span>
        ) : null}
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: 560,
          margin: '0 auto',
        }}
      >
        {mounted ? <Globe /> : (
          <div
            className="mono"
            style={{
              aspectRatio: '1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--ink-3)',
              fontSize: 11,
              border: '1px dashed var(--line-2)',
              borderRadius: 'var(--radius)',
            }}
          >
            globe unmounted
          </div>
        )}
      </div>

      <div
        style={{
          marginTop: 14,
          display: 'flex',
          gap: 18,
          justifyContent: 'center',
          fontFamily: 'var(--mono)',
          fontSize: 10,
          letterSpacing: '0.06em',
          color: 'var(--ink-3)',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <i style={{ width: 7, height: 7, borderRadius: '50%', background: '#96969E', display: 'inline-block' }} />
          Cầu (xám)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <i style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--ink)', display: 'inline-block' }} />
          Cung (đậm)
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <i style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--dot)', display: 'inline-block' }} />
          Khớp (◆ đỏ)
        </span>
      </div>
    </div>
  );
}
