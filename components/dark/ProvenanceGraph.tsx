import { provGraph } from '@/lib/dark-data';
import { dk } from '@/lib/content';

const MONO = 'IBM Plex Mono, ui-monospace, monospace';

/** Do thi provenance node-link tinh: match -> hai ben -> bon nguon co tier. */
export function ProvenanceGraph() {
  const g = provGraph;
  const links: { x1: number; y1: number; x2: number; y2: number }[] = [
    { x1: g.match.x, y1: g.match.y, x2: g.mids[0].x, y2: g.mids[0].y },
    { x1: g.match.x, y1: g.match.y, x2: g.mids[1].x, y2: g.mids[1].y },
    { x1: g.mids[0].x, y1: g.mids[0].y, x2: g.srcs[0].x, y2: g.srcs[0].y },
    { x1: g.mids[0].x, y1: g.mids[0].y, x2: g.srcs[1].x, y2: g.srcs[1].y },
    { x1: g.mids[1].x, y1: g.mids[1].y, x2: g.srcs[2].x, y2: g.srcs[2].y },
    { x1: g.mids[1].x, y1: g.mids[1].y, x2: g.srcs[3].x, y2: g.srcs[3].y },
  ];
  return (
    <div className="dk-panel dk-prov">
      <div className="dk-mx-h">
        <span className="ttl">{dk.data.provTitle}</span>
        <span className="dk-tag">{dk.data.provTag}</span>
      </div>
      <svg viewBox="0 0 440 320" style={{ height: 340 }} aria-hidden="true">
        <defs>
          <filter id="dkprovg">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {links.map((l, i) => (
          <line key={i} {...l} stroke="rgba(196,15,15,.35)" strokeWidth="1.2" />
        ))}
        <g>
          <circle cx={g.match.x} cy={g.match.y} r="9" fill="#C40F0F" filter="url(#dkprovg)" />
          <text x={g.match.x} y={g.match.y - 16} fill="#E8221A" fontSize="11" fontFamily={MONO} textAnchor="middle">
            {g.match.label}
          </text>
        </g>
        {g.mids.map((m) => (
          <g key={m.label}>
            <circle cx={m.x} cy={m.y} r="5" fill="#17171C" stroke="rgba(255,255,255,.3)" strokeWidth="1" />
            <text x={m.x} y={m.y + 18} fill="#9A9AA6" fontSize="9.5" fontFamily={MONO} textAnchor="middle">
              {m.label}
            </text>
          </g>
        ))}
        {g.srcs.map((s) => (
          <g key={s.label}>
            <circle cx={s.x} cy={s.y} r="5" fill="#17171C" stroke="rgba(255,255,255,.3)" strokeWidth="1" />
            <text x={s.x} y={s.y + 18} fill="#9A9AA6" fontSize="9.5" fontFamily={MONO} textAnchor="middle">
              {s.label}
            </text>
            <text x={s.x} y={s.y + 32} fill={s.tier === 'A' ? '#F2F2F5' : '#9A9AA6'} fontSize="8" fontFamily={MONO} textAnchor="middle">
              TIER {s.tier}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
