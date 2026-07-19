/**
 * Illustration SVG cho KPI card. Nhieu lop line-art (hinh chinh ro, chi tiet mo, glow/dot mo).
 * Mau theo currentColor (CSS set --kpi-accent -> color). Khong PNG, khong emoji, khong icon thay the.
 */
import type { ReactElement } from 'react';

export type KpiVisualName = 'city' | 'dome' | 'radar' | 'globe';

const dots = (pts: [number, number][], o: number) =>
  pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1} fill="currentColor" opacity={o} />);

const VIS: Record<KpiVisualName, ReactElement> = {
  city: (
    <g stroke="currentColor" fill="none">
      <g opacity="0.4" strokeWidth="1.1">
        <rect x="6" y="50" width="11" height="28" rx="1" />
        <rect x="68" y="44" width="12" height="34" rx="1" />
        <rect x="58" y="52" width="9" height="26" rx="1" />
      </g>
      <g opacity="0.7" strokeWidth="1.2">
        <rect x="18" y="40" width="12" height="38" rx="1" />
        <rect x="46" y="34" width="13" height="44" rx="1" />
      </g>
      <g strokeWidth="1.4">
        <rect x="32" y="22" width="13" height="56" rx="1" />
        <line x1="38" y1="22" x2="38" y2="14" />
      </g>
      <circle cx="38" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <g opacity="0.55" strokeWidth="0.9">
        <line x1="35" y1="30" x2="42" y2="30" /><line x1="35" y1="37" x2="42" y2="37" /><line x1="35" y1="44" x2="42" y2="44" /><line x1="35" y1="51" x2="42" y2="51" />
        <line x1="49" y1="42" x2="56" y2="42" /><line x1="49" y1="49" x2="56" y2="49" /><line x1="49" y1="56" x2="56" y2="56" />
        <line x1="21" y1="48" x2="27" y2="48" /><line x1="21" y1="55" x2="27" y2="55" />
      </g>
      {dots([[10, 58], [12, 64], [72, 54], [74, 62]], 0.3)}
    </g>
  ),
  dome: (
    <g stroke="currentColor" fill="none">
      <g opacity="0.45" strokeWidth="1.1">
        <line x1="14" y1="77" x2="72" y2="77" /><line x1="18" y1="72" x2="68" y2="72" />
      </g>
      <g opacity="0.7" strokeWidth="1.2">
        <line x1="23" y1="72" x2="23" y2="53" /><line x1="31" y1="72" x2="31" y2="53" />
        <line x1="39" y1="72" x2="39" y2="53" /><line x1="47" y1="72" x2="47" y2="53" />
        <line x1="55" y1="72" x2="55" y2="53" /><line x1="63" y1="72" x2="63" y2="53" />
        <line x1="20" y1="53" x2="66" y2="53" />
      </g>
      <line x1="29" y1="47" x2="57" y2="47" strokeWidth="1.1" opacity="0.6" />
      <path d="M29 47 Q29 24 43 22 Q57 24 57 47" strokeWidth="1.5" />
      <g opacity="0.5" strokeWidth="0.9">
        <path d="M43 22 Q35 34 34 47" /><path d="M43 22 Q51 34 52 47" />
      </g>
      <g strokeWidth="1.1">
        <line x1="39" y1="22" x2="39" y2="17" /><line x1="47" y1="22" x2="47" y2="17" />
        <path d="M38 17 Q43 13 48 17" />
        <line x1="43" y1="13" x2="43" y2="9" />
      </g>
      <circle cx="43" cy="8" r="1.4" fill="currentColor" stroke="none" />
    </g>
  ),
  radar: (
    <g stroke="currentColor" fill="none">
      <g opacity="0.32" strokeWidth="1">
        <circle cx="43" cy="43" r="31" /><circle cx="43" cy="43" r="21" /><circle cx="43" cy="43" r="11" />
        <line x1="12" y1="43" x2="74" y2="43" /><line x1="43" y1="12" x2="43" y2="74" />
      </g>
      <path d="M43 43 L74 43 A31 31 0 0 0 58 15 Z" fill="currentColor" stroke="none" opacity="0.12" />
      <line x1="43" y1="43" x2="72" y2="30" strokeWidth="1.4" />
      <circle cx="60" cy="28" r="2.2" fill="currentColor" stroke="none" />
      <circle cx="43" cy="43" r="2" fill="currentColor" stroke="none" />
      <g opacity="0.5" strokeWidth="1">
        <line x1="43" y1="9" x2="43" y2="13" /><line x1="77" y1="43" x2="73" y2="43" /><line x1="43" y1="77" x2="43" y2="73" /><line x1="9" y1="43" x2="13" y2="43" />
      </g>
    </g>
  ),
  globe: (
    <g stroke="currentColor" fill="none">
      <g opacity="0.55" strokeWidth="1">
        <circle cx="43" cy="43" r="29" />
        <ellipse cx="43" cy="43" rx="12" ry="29" /><ellipse cx="43" cy="43" rx="23" ry="29" />
        <line x1="14" y1="43" x2="72" y2="43" />
        <path d="M17 30 Q43 37 69 30" /><path d="M17 56 Q43 49 69 56" />
      </g>
      <path d="M57 18 A29 29 0 0 1 57 68" strokeWidth="1.7" />
      {dots([[36, 30], [50, 34], [43, 43], [33, 50], [54, 52], [43, 60], [60, 43]], 0.5)}
    </g>
  ),
};

export function KpiVisual({ name }: { name: KpiVisualName }) {
  return (
    <svg className="kpi-visual" viewBox="0 0 86 86" fill="none" aria-hidden="true">
      {VIS[name]}
    </svg>
  );
}
