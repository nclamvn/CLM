'use client';

import { useEffect, useRef } from 'react';

/**
 * Dem so len khi cuon toi. SSR render san gia tri cuoi (SEO, no-JS);
 * mount roi moi chay animation tu 0. reduced-motion: giu nguyen gia tri.
 * Cleanup: IntersectionObserver disconnect + cancel rAF.
 */
export function CountUp({ to, unit }: { to: number; unit?: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const fmt = (n: number) => n.toLocaleString('vi-VN');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    let raf = 0;
    const io = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          const t0 = performance.now();
          const dur = 1400;
          const step = (t: number) => {
            const p = Math.min(1, (t - t0) / dur);
            const k = 1 - Math.pow(1 - p, 3);
            el.textContent = fmt(Math.round(to * k));
            if (p < 1) raf = requestAnimationFrame(step);
          };
          el.textContent = '0';
          raf = requestAnimationFrame(step);
        });
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to]);

  return (
    <>
      <span ref={ref}>{fmt(to)}</span>
      {unit ? <span className="u">{unit}</span> : null}
    </>
  );
}
