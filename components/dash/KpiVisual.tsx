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
      <g opacity="0.45" strokeWidth="1.1">
        <rect x="6" y="48" width="13" height="30" rx="1" />
        <rect x="66" y="42" width="13" height="36" rx="1" />
      </g>
      <g strokeWidth="1.4">
        <rect x="24" y="32" width="15" height="46" rx="1" />
        <rect x="43" y="20" width="14" height="58" rx="1" />
        <line x1="50" y1="20" x2="50" y2="12" />
      </g>
      <circle cx="50" cy="10" r="1.4" fill="currentColor" stroke="none" />
      <g opacity="0.55" strokeWidth="1">
        <line x1="27" y1="40" x2="36" y2="40" /><line x1="27" y1="46" x2="36" y2="46" /><line x1="27" y1="52" x2="36" y2="52" />
        <line x1="46" y1="30" x2="54" y2="30" /><line x1="46" y1="37" x2="54" y2="37" /><line x1="46" y1="44" x2="54" y2="44" /><line x1="46" y1="51" x2="54" y2="51" />
      </g>
      {dots([[10, 54], [12, 60], [70, 50], [72, 58], [74, 66]], 0.3)}
    </g>
  ),
  dome: (
    <g stroke="currentColor" fill="none">
      <g opacity="0.45" strokeWidth="1.1">
        <line x1="14" y1="72" x2="72" y2="72" /><line x1="18" y1="66" x2="68" y2="66" />
      </g>
      <g opacity="0.7" strokeWidth="1.2">
        <line x1="24" y1="66" x2="24" y2="45" /><line x1="34" y1="66" x2="34" y2="45" />
        <line x1="43" y1="66" x2="43" y2="45" /><line x1="52" y1="66" x2="52" y2="45" /><line x1="62" y1="66" x2="62" y2="45" />
        <line x1="21" y1="45" x2="65" y2="45" />
      </g>
      <g strokeWidth="1.4">
        <path d="M27 45 Q43 21 59 45" />
        <line x1="43" y1="22" x2="43" y2="15" />
      </g>
      <circle cx="43" cy="13" r="1.5" fill="currentColor" stroke="none" />
      {dots([[31, 38], [43, 34], [55, 38]], 0.4)}
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
