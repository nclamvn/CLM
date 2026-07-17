'use client';

import { useEffect, useState } from 'react';
import { streamNames } from '@/lib/dark-data';
import { dk } from '@/lib/content';

type Row = { id: number; code: string; a: string; b: string; sc: string };

function makeRow(id: number): Row {
  const a = streamNames.demand[(Math.random() * streamNames.demand.length) | 0];
  const b = streamNames.supply[(Math.random() * streamNames.supply.length) | 0];
  return { id, code: 'MATCH-00' + (42 + id), a, b, sc: (0.78 + Math.random() * 0.2).toFixed(2) };
}

/**
 * MATCH STREAM: cuon ra match moi moi ~2s. SSR render rong (du lieu ngau
 * nhien sinh client de tranh lech hydrate). reduced-motion: do 6 dong tinh,
 * khong chay interval. Cleanup: clearInterval khi unmount.
 */
export function MatchStream() {
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    let id = 0;
    const seed: Row[] = [];
    for (let i = 0; i < 6; i++) seed.unshift(makeRow(id++));
    setRows(seed);
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    const iv = setInterval(() => {
      setRows((prev) => [makeRow(id++), ...prev].slice(0, 7));
    }, 1900);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="dk-ticker">
      <div className="dk-ticker-h">
        <span>
          <span className="d" aria-hidden="true" />
          {dk.hero.streamTitle}
        </span>
        <span>{dk.hero.streamLive}</span>
      </div>
      <div className="dk-ticker-body">
        {rows.map((r) => (
          <div className="dk-tk-row" key={r.id}>
            <span className="code">{r.code}</span> {r.a} ⇄ {r.b} <span className="sc">{r.sc}</span>{' '}
            <span className="okc" aria-hidden="true">
              ✓
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
