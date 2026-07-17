import { CountUp } from './CountUp';
import { darkMetrics, type DarkMetric } from '@/lib/dark-data';

/**
 * Dai metrics 4 o: delta chip, so dem len, area chart SVG (render server,
 * deterministic) voi diem cuoi phat xung (span tuyet doi, CSS animation).
 */
function Spark({ m, idx }: { m: DarkMetric; idx: number }) {
  const W = 120;
  const H = 38;
  const pad = 3;
  const vals = m.series;
  const mx = Math.max(...vals);
  const mn = Math.min(...vals);
  const X = (i: number) => pad + ((W - 2 * pad) * i) / (vals.length - 1);
  const Y = (v: number) => H - 6 - ((H - 14) * (v - mn)) / (mx - mn || 1);
  let d = `M${X(0).toFixed(1)},${Y(vals[0]).toFixed(1)}`;
  for (let i = 1; i < vals.length; i++) d += ` L${X(i).toFixed(1)},${Y(vals[i]).toFixed(1)}`;
  const area = `${d} L${X(vals.length - 1).toFixed(1)},${H - 3} L${X(0).toFixed(1)},${H - 3} Z`;
  const gid = `dksg${idx}`;
  const lastY = Y(vals[vals.length - 1]);
  return (
    <div className="dk-spark-wrap">
      <svg className="dk-spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={m.color} stopOpacity=".26" />
            <stop offset="1" stopColor={m.color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[1, 2, 3, 4].map((g) => (
          <line
            key={g}
            x1={pad + ((W - 2 * pad) * g) / 5}
            y1={4}
            x2={pad + ((W - 2 * pad) * g) / 5}
            y2={H - 3}
            stroke="rgba(255,255,255,.05)"
            strokeWidth=".7"
          />
        ))}
        <line x1={pad} y1={H - 3} x2={W - pad} y2={H - 3} stroke="rgba(255,255,255,.08)" strokeWidth=".7" strokeDasharray="2 3" />
        <path d={area} fill={`url(#${gid})`} stroke="none" />
        <path d={d} fill="none" stroke={m.color} strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" style={{ filter: `drop-shadow(0 0 4px ${m.color}66)` }} />
      </svg>
      <span
        className="dk-spark-ep"
        aria-hidden="true"
        style={{ color: m.color, background: m.color, top: `${(lastY / H) * 100}%`, boxShadow: `0 0 6px ${m.color}` }}
      />
    </div>
  );
}

export function MetricsBand() {
  return (
    <section className="dk-metrics">
      <div className="wrap dk-metrics-in">
        {darkMetrics.map((m, i) => (
          <div className="dk-metric" key={m.label} style={{ ['--mc' as never]: m.accent }}>
            <div className="mk">
              <span className="k">{m.label}</span>
              <span className={`dk-delta ${m.deltaKind === 'flat' ? '' : m.deltaKind}`.trim()}>{m.delta}</span>
            </div>
            <div className="v">
              <CountUp to={m.to} unit={m.unit} />
            </div>
            <Spark m={m} idx={i} />
            <div className="ms">
              {m.micro.map((s) => (
                <span key={s.k}>
                  {s.k} <b>{s.v}</b>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
