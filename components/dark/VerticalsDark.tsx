import { GCard } from './GCard';
import { darkVerticals } from '@/lib/dark-data';
import { dk } from '@/lib/content';

const SEG_COLORS = ['#C40F0F', '#6E6E7A', '#2a2a30'];

/** Tile dashboard tung nganh: LIVE pill, 2 so lon, thanh phan bo tier. */
export function VerticalsDark() {
  const v = dk.vertical;
  return (
    <div className="dk-pillars">
      {darkVerticals.map((d, di) => (
        <GCard className="dk-vert" key={d.name}>
          <div className="dk-vert-h">
            <h3>{d.name}</h3>
            <span className="dk-live">
              <i aria-hidden="true" />
              {v.live}
            </span>
          </div>
          <div className="dk-vert-nums">
            <div className="dk-vn">
              <div className="l">{v.factsLabel}</div>
              <div className="n">{d.facts}</div>
            </div>
            <div className="dk-vn">
              <div className="l">{v.matchLabel}</div>
              <div className="n">
                {d.match}
                <small>▲ {d.delta}</small>
              </div>
            </div>
          </div>
          <div className="dk-dist" aria-hidden="true">
            {d.tiers.map((p, i) => (
              <i key={i} style={{ width: `${p}%`, background: SEG_COLORS[i], animationDelay: `${(0.12 * i + di * 0.1).toFixed(2)}s` }} />
            ))}
          </div>
          <div className="dk-dist-lab">
            {d.tiers.map((p, i) => (
              <span key={i}>
                {v.tierLabels[i]} <b>{p}%</b>
              </span>
            ))}
          </div>
          <div className="dk-vert-ft">
            <span>
              {v.refreshLabel} {d.refresh}
            </span>
            <span>{v.failLabel}</span>
          </div>
        </GCard>
      ))}
    </div>
  );
}
