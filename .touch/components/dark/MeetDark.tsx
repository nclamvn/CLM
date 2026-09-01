'use client';

import { useEffect, useRef } from 'react';
import { createMeet } from './meet-core';

/** Canvas me cung tim nhau (CTA). Cleanup khi unmount. */
export function MeetDark() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const meet = createMeet(canvas, { reducedMotion: reduced });
    return () => meet.destroy();
  }, []);

  return <canvas ref={ref} className="dk-meet-canvas" aria-hidden="true" />;
}
