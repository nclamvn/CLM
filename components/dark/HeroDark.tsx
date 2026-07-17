import { GlobeDark } from './GlobeDark';
import { MatchStream } from './MatchStream';
import { dk } from '@/lib/content';

/** Hero toi: copy trai, qua cau + MATCH STREAM phai. */
export function HeroDark() {
  const h = dk.hero;
  return (
    <header className="dk-hero">
      <div className="wrap dk-hero-grid">
        <div>
          <span className="dk-eyebrow">{h.eyebrow}</span>
          <h1>
            {h.line1}
            <br />
            {h.line2}
            <em>{h.focal}</em>
            {h.tail}
          </h1>
          <p className="sub">{h.sub}</p>
          <div className="dk-cta-row">
            <a className="dk-btn dk-btn-red" href="#cta">
              {h.ctaPrimary} <span className="ar" aria-hidden="true">→</span>
            </a>
            <a className="dk-btn dk-btn-ghost" href="#pipeline">
              {h.ctaGhost}
            </a>
          </div>
          <div className="dk-assure">
            {h.assure.map((a) => (
              <span key={a}>
                <span className="t" aria-hidden="true">✓</span> {a}
              </span>
            ))}
          </div>
        </div>
        <div className="dk-stage">
          <GlobeDark />
          <MatchStream />
        </div>
      </div>
    </header>
  );
}
