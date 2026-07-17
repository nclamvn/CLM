'use client';

import { useEffect, useRef } from 'react';
import { createGlobeDark } from './globe-dark';

/** Canvas qua cau toi. Tao mot lan, destroy khi unmount (nhu Globe light). */
export function GlobeDark() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const globe = createGlobeDark(canvas, { reducedMotion: reduced });
    return () => globe.destroy();
  }, []);

  return <canvas ref={ref} aria-hidden="true" />;
}
