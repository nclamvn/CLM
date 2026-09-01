'use client';

import type { ReactNode } from 'react';

/**
 * The vien gradient + spotlight do bam con tro. Spotlight la span.spot,
 * vi tri qua bien CSS --mx/--my cap nhat trong onPointerMove (React tu go
 * listener khi unmount, khong can cleanup tay).
 */
export function GCard({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={`dk-gcard ${className}`.trim()}
      onPointerMove={(e) => {
        const el = e.currentTarget;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', e.clientX - r.left + 'px');
        el.style.setProperty('--my', e.clientY - r.top + 'px');
      }}
    >
      <span className="spot" aria-hidden="true" />
      {children}
    </div>
  );
}
