import { darkVerticals } from '@/lib/dark-data';
import { DataTruthBadge } from '@/components/portal/DataTruthBadge';

/* VerticalsDark (VF-L-017): 3 vertical card portal. So la SYNTHETIC (demo seeded),
   KHONG dung LIVE. Moi card co tier-composition bar lam data motif rieng. */
const ACCENTS = ['blue', 'cyan', 'green'] as const;
const TIER = ['a', 'b', 'claim'] as const;
const TIER_LABEL = ['A', 'B', 'CLAIM'];

export function VerticalsDark() {
  return (
    <div className="lp-verticals">
      {darkVerticals.map((d, di) => (
        <div key={d.name} className={`lp-vert surface-executive surface-${ACCENTS[di]}`} data-accent={ACCENTS[di]}>
          <div className="lp-vert__head">
            <h3 className="lp-vert__name">{d.name}</h3>
            <DataTruthBadge state="SYNTHETIC" />
          </div>
          <div className="lp-vert__nums">
            <div className="lp-vert__num">
              <span className="lp-vert__nlabel">Facts</span>
              <span className="lp-vert__nval">{d.facts}</span>
            </div>
            <div className="lp-vert__num">
              <span className="lp-vert__nlabel">Match</span>
              <span className="lp-vert__nval">
                {d.match} <small className="lp-vert__delta">▲ {d.delta}</small>
              </span>
            </div>
          </div>
          <div className="lp-vert__bar" aria-hidden="true">
            {d.tiers.map((p, i) => (
              <span key={i} className={`is-${TIER[i]}`} style={{ width: `${p}%` }} />
            ))}
          </div>
          <div className="lp-vert__tiers">
            {d.tiers.map((p, i) => (
              <span key={i} className={`lp-vert__tier is-${TIER[i]}`}>
                Tier {TIER_LABEL[i]} <b>{p}%</b>
              </span>
            ))}
          </div>
          <div className="lp-vert__foot">
            <span>Làm mới {d.refresh}</span>
            <span className="lp-vert__fl">Fail-loud · 0 lọt</span>
          </div>
        </div>
      ))}
    </div>
  );
}
