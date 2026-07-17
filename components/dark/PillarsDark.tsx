import { GCard } from './GCard';
import { dk } from '@/lib/content';

/** 3 the co che: gradient border, spotlight, chip icon, so ghost. */
export function PillarsDark() {
  return (
    <div className="dk-pillars">
      {dk.pillars.items.map((p, i) => (
        <GCard className="dk-pillar" key={p.h}>
          <span className="pnum mono" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="pic" aria-hidden="true">
            {p.ic}
          </div>
          <h3>{p.h}</h3>
          <p>{p.p}</p>
          <div className="ptg">{p.tg}</div>
        </GCard>
      ))}
    </div>
  );
}
