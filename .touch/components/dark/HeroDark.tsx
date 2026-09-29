import { GlobeDark } from './GlobeDark';
import { MatchStream } from './MatchStream';
import { ROUTE } from '@/lib/portal-routes';
import { dk } from '@/lib/content';

/* Hero landing (TIP-PORTAL-V1 muc 7.3): grid 5/7, title 3 dong (line-2 do),
   Inter 56/60, footnote MINH HOA, stage globe + match stream. */
export function HeroDark() {
  const h = dk.hero;
  return (
    <header className="lp-hero">
      <div className="lp-hero__grid portal-container">
        <div className="lp-hero__copy">
          <span className="lp-hero__eyebrow">{h.eyebrow}</span>
          <h1 className="lp-hero__title">
            <span>{h.line1}</span>
            <span className="is-accent">{h.line2}</span>
            <span>{h.line3}</span>
          </h1>
          <p className="lp-hero__sub">{h.sub}</p>
          <div className="lp-hero__cta">
            <a className="lp-btn lp-btn--primary" href={ROUTE.dashboard}>
              {h.ctaPrimary} <span className="lp-btn__ar" aria-hidden="true">→</span>
            </a>
            <a className="lp-btn lp-btn--ghost" href={ROUTE.hub}>
              {h.ctaGhost}
            </a>
          </div>
          <p className="lp-hero__foot">{h.footnote}</p>
        </div>
        <div className="lp-hero__stage">
          <GlobeDark />
          <span className="lp-anno lp-anno--tl" aria-hidden="true">
            <span className="lp-anno__t">Supply facts</span>
            <span className="lp-anno__lead" />
          </span>
          <span className="lp-anno lp-anno--r lp-anno--flip" aria-hidden="true">
            <span className="lp-anno__t">Evidence registry</span>
            <span className="lp-anno__lead" />
          </span>
          <span className="lp-anno lp-anno--bl" aria-hidden="true">
            <span className="lp-anno__t">Provenance engine</span>
            <span className="lp-anno__lead" />
          </span>
          <span className="lp-anno lp-anno--match lp-anno--flip" aria-hidden="true">
            <span className="lp-anno__t">Match proven</span>
            <span className="lp-anno__lead" />
          </span>
          <MatchStream />
        </div>
      </div>
    </header>
  );
}
