import { cnclMeta } from '@/lib/cncl-registry';
import { DataTruthBadge } from '@/components/portal/DataTruthBadge';
import { ROUTE } from '@/lib/portal-routes';

/* LandingMetricCard (TIP-PORTAL-V1 / VF-L-009,010,011). Ngon ngu landing, KHONG reuse
   Dashboard KPI. 3 card REAL tu cnclMeta + 1 card honest-null (lock + link -> dashboard).
   Truth badge nho o eyebrow; sparkline co grid + endpoint (minh hoa). */

const SRC = 'CNCL Registry · 18/07';
const DEMO_SERIES = [9, 11, 10, 14, 12, 16, 15, 19, 18, 22];

function Spark() {
  const W = 120;
  const H = 40;
  const pad = 3;
  const v = DEMO_SERIES;
  const mx = Math.max(...v);
  const mn = Math.min(...v);
  const X = (i: number) => pad + ((W - 2 * pad) * i) / (v.length - 1);
  const Y = (val: number) => H - 5 - ((H - 12) * (val - mn)) / (mx - mn || 1);
  let d = `M${X(0).toFixed(1)},${Y(v[0]).toFixed(1)}`;
  for (let i = 1; i < v.length; i++) d += ` L${X(i).toFixed(1)},${Y(v[i]).toFixed(1)}`;
  const area = `${d} L${X(v.length - 1).toFixed(1)},${H} L${X(0).toFixed(1)},${H} Z`;
  const ex = X(v.length - 1);
  const ey = Y(v[v.length - 1]);
  return (
    <svg className="lp-mc__spark" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
      <g className="lp-mc__sparkgrid">
        {[0, 1, 2].map((g) => (
          <line key={g} x1={pad} y1={5 + ((H - 10) * g) / 2} x2={W - pad} y2={5 + ((H - 10) * g) / 2} />
        ))}
      </g>
      <path className="lp-mc__sparkarea" d={area} />
      <path className="lp-mc__sparkline" d={d} />
      <circle className="lp-mc__sparkend" cx={ex} cy={ey} r="3" />
    </svg>
  );
}

type Accent = 'blue' | 'cyan' | 'green';
const cards: { key: string; label: string; value: string; unit: string; accent: Accent }[] = [
  { key: 'units', label: 'Đơn vị cung ứng', value: String(cnclMeta.units), unit: 'đơn vị', accent: 'blue' },
  { key: 'claims', label: 'Claim đã xác thực', value: String(cnclMeta.claims), unit: 'claim', accent: 'cyan' },
  { key: 'sources', label: 'Nguồn bằng chứng', value: String(cnclMeta.sources), unit: 'nguồn', accent: 'green' },
];

function LockIcon() {
  return (
    <svg className="lp-mc__lock" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="4.5" y="9" width="11" height="7.5" rx="1.5" />
      <path d="M7 9V6.8a3 3 0 0 1 6 0V9" />
    </svg>
  );
}

export function MetricsBand() {
  return (
    <section className="lp-metrics portal-container" aria-label="Chi so tong hop">
      {cards.map((c) => (
        <div key={c.key} className={`lp-mc surface-executive surface-${c.accent}`} data-accent={c.accent}>
          <div className="lp-mc__eyebrow">
            <span className="lp-mc__label">{c.label}</span>
            <DataTruthBadge state="REAL" />
          </div>
          <div className="lp-mc__value">
            {c.value}
            <span className="lp-mc__unit">{c.unit}</span>
          </div>
          <div className="lp-mc__foot">
            <span className="lp-mc__src">{SRC}</span>
            <span className="lp-mc__sparkwrap">
              <Spark />
              <span className="lp-mc__sparktag">Minh họa</span>
            </span>
          </div>
        </div>
      ))}
      <a className="lp-mc lp-mc--null surface-critical" href={ROUTE.dashboard} data-accent="red">
        <div className="lp-mc__eyebrow">
          <span className="lp-mc__label">Match chứng minh được</span>
          <DataTruthBadge state="SCAFFOLD" label="Chưa nối" />
        </div>
        <div className="lp-mc__nullrow">
          <LockIcon />
          <span className="lp-mc__nullv">Chưa chạy</span>
        </div>
        <div className="lp-mc__foot">
          <span className="lp-mc__src">Thiếu dữ liệu CẦU thật</span>
          <span className="lp-mc__link">Xem trạng thái trong Dashboard →</span>
        </div>
      </a>
    </section>
  );
}
