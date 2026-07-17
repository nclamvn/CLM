import { interp } from '@/lib/dark-data';
import { dk } from '@/lib/content';

const MONO = 'IBM Plex Mono, ui-monospace, monospace';

/** Bieu do noi suy: duong da kiem do, du phong dut net, dai bat dinh mo. */
export function InterpChart() {
  const W = 560;
  const H = 240;
  const pad = 24;
  const { N, real, pts } = interp;
  const X = (i: number) => pad + ((W - 2 * pad) * i) / (N - 1);
  const Y = (v: number) => H - pad - (H - 2 * pad) * v;

  let band = 'M';
  for (let i = real - 1; i < N; i++) {
    band += ` ${X(i).toFixed(1)},${Y(pts[i] + (0.06 * (i - real + 1)) / (N - real) + 0.02).toFixed(1)}`;
  }
  for (let i = N - 1; i >= real - 1; i--) {
    band += ` ${X(i).toFixed(1)},${Y(pts[i] - (0.06 * (i - real + 1)) / (N - real) - 0.02).toFixed(1)}`;
  }
  band += ' Z';

  let dr = `M ${X(0).toFixed(1)},${Y(pts[0]).toFixed(1)}`;
  for (let i = 1; i < real; i++) dr += ` L ${X(i).toFixed(1)},${Y(pts[i]).toFixed(1)}`;
  let dp = `M ${X(real - 1).toFixed(1)},${Y(pts[real - 1]).toFixed(1)}`;
  for (let i = real; i < N; i++) dp += ` L ${X(i).toFixed(1)},${Y(pts[i]).toFixed(1)}`;

  const m = dk.matching;
  return (
    <div className="dk-panel dk-chart">
      <div className="dk-mx-h">
        <span className="ttl">{m.chartTitle}</span>
        <span className="dk-tag">{m.chartTag}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ height: 240 }} aria-hidden="true">
        {[0, 1, 2, 3, 4].map((g) => (
          <line key={g} x1={pad} y1={pad + ((H - 2 * pad) * g) / 4} x2={W - pad} y2={pad + ((H - 2 * pad) * g) / 4} stroke="rgba(255,255,255,.05)" strokeWidth="1" />
        ))}
        <path d={band} fill="rgba(196,15,15,.14)" stroke="none" />
        <path d={dr} fill="none" stroke="#C40F0F" strokeWidth="2" />
        <path d={dp} fill="none" stroke="#6E6E7A" strokeWidth="1.6" strokeDasharray="4 4" />
        {pts.slice(0, real).map((v, i) => (
          <circle key={i} cx={X(i)} cy={Y(v)} r="2" fill="#C40F0F" />
        ))}
        <line x1={X(real - 1)} y1={pad} x2={X(real - 1)} y2={H - pad} stroke="rgba(255,255,255,.14)" strokeWidth="1" strokeDasharray="2 3" />
        <text x={X(real - 1) + 4} y={pad + 10} fill="#9A9AA6" fontSize="9" fontFamily={MONO}>
          {m.chartNow}
        </text>
      </svg>
      <div className="dk-chart-cap">
        {m.legend.map((l) => (
          <span key={l.label}>
            <i style={{ background: l.color }} aria-hidden="true" />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}
