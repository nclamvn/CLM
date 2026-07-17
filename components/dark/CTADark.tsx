import { MeetDark } from './MeetDark';
import { dk } from '@/lib/content';

/** CTA: copy trai, me cung tim nhau ben phai. */
export function CTADark() {
  const c = dk.cta;
  return (
    <section className="dk-cta" id="cta">
      <div className="wrap dk-cta-grid">
        <div>
          <div className="dk-cta-eyebrow">
            <span className="d" aria-hidden="true" />
            {c.eyebrow}
            <span className="cur" aria-hidden="true" />
          </div>
          <h2>
            {c.h2pre}
            <em>{c.h2em}</em>
            {c.h2tail}
          </h2>
          <p>{c.p}</p>
          <div className="dk-cta-row">
            <a className="dk-btn dk-btn-red" href={c.email}>
              {c.ctaPrimary} <span className="ar" aria-hidden="true">→</span>
            </a>
            <a className="dk-btn dk-btn-ghost" href="#pipeline">
              {c.ctaGhost}
            </a>
          </div>
        </div>
        <div>
          <MeetDark />
          <div className="dk-meet-cap">
            {c.legend.map((l) => (
              <span key={l.label}>
                <i
                  style={l.color === 'meet' ? { background: 'transparent', border: '1px solid #C40F0F' } : { background: l.color }}
                  aria-hidden="true"
                />
                {l.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
