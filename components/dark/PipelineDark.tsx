'use client';

import { useEffect, useRef } from 'react';
import { createPipeline } from './pipeline-core';
import { pipelineCounters } from '@/lib/dark-data';
import { dk } from '@/lib/content';

const fmt = (n: number) => n.toLocaleString('vi-VN');

/** Panel pipeline: header thong ke IN/DAT/CAN + canvas 7 cong + chu thich. */
export function PipelineDark() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inRef = useRef<HTMLElement | null>(null);
  const okRef = useRef<HTMLElement | null>(null);
  const blkRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pipe = createPipeline(
      canvas,
      { inEl: inRef.current, okEl: okRef.current, blkEl: blkRef.current },
      { reducedMotion: reduced },
    );
    return () => pipe.destroy();
  }, []);

  const p = dk.pipeline;
  return (
    <div className="dk-panel dk-pipe-wrap">
      <div className="dk-pipe-h">
        <span className="ttl">{p.panelTitle}</span>
        <span className="dk-pipe-stats">
          <span>
            {p.statIn}
            <b ref={inRef}>{fmt(pipelineCounters.in)}</b>
          </span>
          <span>
            {p.statOk}
            <b ref={okRef}>{fmt(pipelineCounters.ok)}</b>
          </span>
          <span className="rd">
            {p.statBlocked}
            <b ref={blkRef}>{fmt(pipelineCounters.blocked)}</b>
          </span>
        </span>
      </div>
      <canvas ref={canvasRef} className="dk-pipe-canvas" aria-hidden="true" />
      <div className="dk-legend">
        {p.legend.map((l) => (
          <span key={l.label}>
            <i style={{ background: l.color }} aria-hidden="true" />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}
