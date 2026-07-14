'use client';

import { useEffect, useRef } from 'react';
import { createGlobe } from './globe-core';

/**
 * Quả cầu dot-map. Client component: canvas + rAF trong globe-core, dọn sạch
 * rAF và listener khi unmount. Tôn trọng prefers-reduced-motion (vẽ một khung
 * tĩnh, không xoay, không parallax). aria-hidden vì là trang trí; ý nghĩa nằm
 * ở chú thích văn bản kèm bên ngoài.
 */
export function Globe({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const reduced =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const globe = createGlobe(canvas, { reducedMotion: reduced });
    return () => globe.destroy();
  }, []);

  return <canvas ref={ref} className={`globe-canvas ${className ?? ''}`.trim()} aria-hidden="true" />;
}
