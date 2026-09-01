'use client';

import type { HubMatch } from '@/lib/demo-data';

/** Danh sach match, bam mot dong doi MatchDetail ben phai. aria-pressed bao chon. */
export function MatchList({
  matches,
  selected,
  onSelect,
}: {
  matches: HubMatch[];
  selected: number;
  onSelect: (i: number) => void;
}) {
  return (
    <ul className="qlist" role="list">
      {matches.map((m, i) => (
        <li key={m.code}>
          <button
            type="button"
            className={`qrow ${i === selected ? 'on' : ''}`.trim()}
            aria-pressed={i === selected}
            onClick={() => onSelect(i)}
          >
            <span className="sc">{m.score.toFixed(2)}</span>
            <span className="mid">
              <span className="a">{m.short}</span>
              <span className="b">{m.cap}</span>
            </span>
            <span className="st">
              <span className={`badge ${m.badge === 'VOUCHED' ? 'vch' : 'rdy'}`}>{m.badge}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
