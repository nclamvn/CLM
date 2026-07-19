import { DashTopBar } from '@/components/dash/DashTopBar';
import { Icon } from '@/components/dash/Icon';
import { KpiVisual } from '@/components/dash/KpiVisual';
import { WaveBridge } from '@/components/dash/WaveBridge';
import { EvidenceSummary } from '@/components/dash/EvidenceSummary';
import {
  kpis, projectComponents, supply, demand, deadline, workQueue, repos, evidence,
} from '@/lib/project-status';

/* Donut SVG (khong canvas, khong 3D/shadow theo handbook 5.5). */
function Donut({ total, center, label, segments }: {
  total: number; center: string; label: string; segments: { value: number; color: string }[];
}) {
  const r = 42;
  const circ = 2 * Math.PI * r;
  let acc = 0;
  return (
    <svg width={100} height={100} viewBox="0 0 100 100" role="img" aria-label={`${center} ${label}`}>
      <circle cx={50} cy={50} r={r} fill="none" stroke="var(--color-bg-surface-3)" strokeWidth={16} />
      {segments.map((s, i) => {
        const len = total > 0 ? (s.value / total) * circ : 0;
        const el = (
          <circle
            key={i} cx={50} cy={50} r={r} fill="none" stroke={s.color} strokeWidth={16}
            strokeDasharray={`${len} ${circ - len}`} strokeDashoffset={-acc}
            transform="rotate(-90 50 50)"
          />
        );
        acc += len;
        return el;
      })}
      <text x={50} y={49} textAnchor="middle" fontSize={22} fontWeight={650} fill="var(--color-text-primary)">{center}</text>
      <text x={50} y={64} textAnchor="middle" fontSize={9} fill="var(--color-text-muted)">{label}</text>
    </svg>
  );
}

/* Verification ring - progress that, glow nho (khong neon). */
function VRing({ pct }: { pct: number }) {
  const r = 33;
  const circ = 2 * Math.PI * r;
  const prog = (pct / 100) * circ;
  return (
    <svg className="vring" viewBox="0 0 78 78" role="img" aria-label={`${pct}% verifiable`}>
      <circle cx={39} cy={39} r={r} fill="none" stroke="var(--color-bg-surface-3)" strokeWidth={6} />
      <circle
        cx={39} cy={39} r={r} fill="none" stroke="var(--color-accent-green)" strokeWidth={6}
        strokeDasharray={`${prog} ${circ - prog}`} transform="rotate(-90 39 39)" strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 0 4px var(--a-green-50))' }}
      />
      <text className="vring__pct" x={39} y={44} textAnchor="middle">{pct}%</text>
    </svg>
  );
}

const KPI = [
  { k: 'cung', cls: 'cung', eyebrow: 'CUNG · Đơn vị CNCL', d: kpis.cung, vis: 'city' as const },
  { k: 'cau', cls: 'cau', eyebrow: 'CẦU · Khung chính sách', d: kpis.cau, vis: 'dome' as const },
  { k: 'engine', cls: 'engine', eyebrow: 'Engine PoC (Phase A)', d: kpis.engine, vis: 'radar' as const },
  { k: 'site', cls: 'site', eyebrow: 'Site .touch Hub', d: kpis.site, vis: 'globe' as const },
] as const;

export default function DashboardPage() {
  return (
    <>
      <DashTopBar />
      <EvidenceSummary />
      <div className="dash-grid">
        <div className="dash-col">

          {/* KPI ROW */}
          <div className="kpi-row">
            {KPI.map((c) => (
              <div key={c.k} className={`kpi-card kpi-card--${c.cls}`}>
                <div className="kpi-card__eyebrow">{c.eyebrow}</div>
                <div className="kpi-card__metric">
                  {c.d.value}
                  {c.d.unit ? <span className="kpi-card__unit">{c.d.unit}</span> : null}
                </div>
                <div className="kpi-card__sub">{c.d.sub}</div>
                <KpiVisual name={c.vis} />
              </div>
            ))}
          </div>

          {/* 4 CAU PHAN */}
          <section className="panel">
            <div className="panel__eyebrow">4 cấu phần dự án</div>
            <div className="comp-row">
              {projectComponents.map((c) => (
                <div key={c.n} className="comp-card">
                  <div className="comp-card__head">
                    <span className="comp-card__tile">{c.n}</span>
                    <span className="comp-card__name">{c.name}</span>
                    <span className={`chip chip--${c.status === 'PASS' ? 'pass' : 'risk'}`}>{c.status}</span>
                  </div>
                  <div className="comp-card__checks">
                    {c.checks.map((ch, i) => (
                      <span key={i} className="comp-check">
                        <Icon name="check" size={14} className="comp-check__box" />
                        {ch.label}
                      </span>
                    ))}
                  </div>
                  <div className="comp-card__foot">
                    <span>Version</span>
                    <span className="comp-card__hash">{c.version}</span>
                    <span>{c.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* OPERATIONAL ZONE */}
          <div className="op-grid">
            {/* left: hai chieu du lieu */}
            <section className="panel">
              <div className="panel__eyebrow">Hai chiều dữ liệu</div>
              <div className="two-charts">
                <WaveBridge />
                <div className="chart-card">
                  <div className="t-title-02" style={{ color: 'var(--color-accent-blue)' }}>CUNG · 14 đơn vị (VN)</div>
                  <div className="donut-wrap">
                    <Donut
                      total={supply.claims} center={`${supply.claims}`} label="claim"
                      segments={[
                        { value: supply.tierA, color: 'var(--color-accent-blue)' },
                        { value: supply.tierB, color: 'var(--color-accent-cyan)' },
                      ]}
                    />
                    <div className="donut-legend">
                      <span className="donut-legend__row"><span className="donut-legend__mk" style={{ background: 'var(--color-accent-blue)' }} />Tier A {supply.tierA} ({supply.tierAPct}%)</span>
                      <span className="donut-legend__row"><span className="donut-legend__mk" style={{ background: 'var(--color-accent-cyan)' }} />Tier B {supply.tierB} ({supply.tierBPct}%)</span>
                      <span className="donut-legend__row"><span className="donut-legend__mk" style={{ background: 'var(--color-accent-purple)' }} />Corroborated {supply.corroborated}</span>
                    </div>
                  </div>
                  <div className="stat-row">
                    {supply.byNhom.map((s) => (
                      <div key={s.key}><div className="stat-row__v">{s.value}</div><div className="stat-row__l">{s.key}</div></div>
                    ))}
                  </div>
                </div>

                <div className="mobile-flow" aria-hidden="true">
                  <span>CUNG</span>
                  <span className="mobile-flow__arrow">↓</span>
                  <span className="mobile-flow__mid">Chưa nối có chứng minh</span>
                  <span className="mobile-flow__arrow">↓</span>
                  <span>CẦU</span>
                </div>
                <div className="chart-card chart-card--cau">
                  <div className="t-title-02" style={{ color: 'var(--color-accent-purple)' }}>CẦU · 124 claim khung chính sách</div>
                  <div className="donut-wrap">
                    <Donut total={demand.claims} center={`${demand.claims}`} label="claim"
                      segments={[{ value: demand.claims, color: 'var(--color-accent-purple)' }]} />
                    <div className="donut-legend">
                      {demand.rows.map((r) => (
                        <span key={r.label} className="donut-legend__row"><b style={{ color: 'var(--color-text-primary)' }}>{r.value}</b> {r.label}</span>
                      ))}
                    </div>
                  </div>
                  <div className="tag-row">
                    {demand.tags.map((t) => (
                      <div key={t.k} className="tag"><div className="tag__k">{t.k}</div><div className="tag__v">{t.v}</div></div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="amb-match">
                <div>
                  <div className="t-label-01" style={{ color: 'var(--color-text-secondary)' }}>Ambiguity flags</div>
                  <div className="amb-tags">
                    {supply.ambiguity.map((a) => <span key={a} className="amb-tag">{a}</span>)}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 8 }}>Flag ambiguous_clusters, không tự gộp.</div>
                </div>
                <div className="match-locked">
                  <Icon name="lock" size={40} className="match-locked__icon" />
                  <div>
                    <div className="match-locked__title">Match chứng-minh-được</div>
                    <div className="match-locked__body">Chưa chạy · Thiếu bước nối CUNG và CẦU. Là mảnh cuối tự nhiên của vòng lặp.</div>
                  </div>
                </div>
              </div>
            </section>

            {/* right: deadline + work queue */}
            <div className="dash-col">
              <div className="deadline-card">
                <div className="deadline-card__head">
                  <span className="deadline-card__title">{deadline.title}</span>
                  <span className="chip chip--risk">{deadline.risk}</span>
                </div>
                <div className="deadline-card__body">
                  <span className="deadline-card__dday">{deadline.dday}</span>
                  <span className="deadline-card__txt"><b>{deadline.headline}.</b> {deadline.detail}</span>
                </div>
              </div>
              <section className="panel">
                <div className="panel__eyebrow">Việc mở và ưu tiên</div>
                <div className="queue">
                  {workQueue.map((w) => (
                    <div key={w.p} className="queue__item">
                      <span className={`queue__pri queue__pri--${w.tone}`}>{w.p}</span>
                      <span>
                        <span className="queue__kind">[{w.kind}]</span>
                        {w.lever ? <span className="queue__lever">Đòn bẩy lớn nhất</span> : null}
                        <span className="queue__title">{w.title}</span>
                      </span>
                      <span className="queue__owner">{w.owner}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>

          {/* REPOSITORIES */}
          <section className="panel">
            <div className="panel__eyebrow">Repositories</div>
            <div className="repo-row">
              {repos.map((r) => (
                <div key={r.name} className="repo-card">
                  <div className="repo-card__top">
                    <div>
                      <div className="repo-card__name">{r.name}</div>
                      <div className="repo-card__owner">{r.owner}</div>
                    </div>
                    <span className={`chip chip--${r.vis === 'Private' ? 'private' : 'public'}`}>{r.vis}</span>
                  </div>
                  <div className="repo-card__foot">
                    <span>HEAD <span className="repo-card__hash">{r.head}</span></span>
                    <span>{r.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* EVIDENCE RAIL */}
        <aside className="evidence-rail">
          <div className="erail-block">
            <div className="rail__eyebrow">Evidence Registry</div>
            <VRing pct={evidence.verifiablePct} />
            <div className="erail-verif">Verifiable</div>
            <div className="erail-checks">
              {evidence.checklist.map((c) => (
                <div key={c} className="rail-check"><Icon name="check" size={14} className="rail-check__box" />{c}</div>
              ))}
            </div>
          </div>
          <div className="erail-div" />
          <div className="erail-block">
            <div className="rail__eyebrow">Gates (19/07)</div>
            <div className="rail-gate__big">{evidence.gates.pass}/{evidence.gates.total}</div>
            <div className="rail-gate__pass">PASS</div>
            <div className="rail-gate__meta">Last run<br />{evidence.gates.lastRun}</div>
          </div>
        </aside>
      </div>
    </>
  );
}
