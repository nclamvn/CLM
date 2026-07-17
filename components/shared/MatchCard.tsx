import type { MatchCardData } from '@/lib/content';
import { TierBadge } from './TierBadge';

/**
 * Don vi gia tri (DESIGN_SPEC muc 8): mot match KEM chuoi dan chung.
 * Hai ben cau va cung, provenance chain, bao chung, ghi chu cong.
 * Do chi o .mlink (bang do); phan con lai trung tinh.
 * `flush` bo vien va bong de nhung trong MatchDetail cua Hub.
 */
export function MatchCard({
  data,
  flush = false,
}: {
  data: MatchCardData;
  flush?: boolean;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(data.score * 100)));
  const scoreText = data.score.toFixed(2);

  return (
    <article className={`mcard ${flush ? 'mcard-flush' : ''}`.trim()}>
      <div className="mcard-top">
        <div>
          <div className="tag">{data.tag}</div>
          {data.id ? <div className="id mono">{data.id}</div> : null}
        </div>
        <div className="mscore">
          <span className="mono">{scoreText}</span>
          <span className="bar">
            <i style={{ width: `${pct}%` }} />
          </span>
        </div>
      </div>

      <div className="mcard-sides">
        <div className="mside">
          <div className="r mono">{data.demand.role}</div>
          <div className="n">{data.demand.name}</div>
          <div className="d">{data.demand.desc}</div>
        </div>
        <div className="mlink" aria-hidden="true">
          ⇄
        </div>
        <div className="mside mside-r">
          <div className="r mono">{data.supply.role}</div>
          <div className="n">{data.supply.name}</div>
          <div className="d">{data.supply.desc}</div>
        </div>
      </div>

      <div className="chain">
        <div className="chain-h mono">{data.chainHeading}</div>
        {data.chain.map((row, i) => (
          <div className="crow" key={`${row.k}-${i}`}>
            <span className="k">{row.k}</span>
            <span className={row.claim ? 'v claim' : 'v'}>
              {row.v}
              {row.tier ? <TierBadge level={row.tier.level}>{row.tier.label}</TierBadge> : null}
              {row.tail}
            </span>
          </div>
        ))}
      </div>

      <div className="vouch">
        <span aria-hidden="true">◆</span> {data.vouch}
      </div>
      <div className="gate">
        <span className="dot" aria-hidden="true" /> {data.gate}
      </div>
    </article>
  );
}
