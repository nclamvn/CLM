import { Container } from '../shared/Container';
import { Button } from '../shared/Button';
import { LivePill } from '../shared/LivePill';
import { Globe } from '../globe/Globe';
import { landing } from '@/lib/content';

/** Hero: cot trai copy, cot phai qua cau. Cum focal do o tieu de. */
export function Hero() {
  const h = landing.hero;
  return (
    <header className="hero">
      <Container className="hero-grid">
        <div className="hero-copy">
          <LivePill />
          <h1>
            {h.line1}
            <br />
            {h.line2}
            <em>{h.focal}</em>
            {h.tail}
          </h1>
          <p className="sub">{h.sub}</p>
          <div className="hero-cta">
            <Button variant="primary" href="#cta" arrow>
              {h.ctaPrimary}
            </Button>
            <Button variant="ghost" href="/hub">
              {h.ctaGhost}
            </Button>
          </div>
          <div className="hero-assure">
            {h.assure.map((a) => (
              <span key={a}>
                <span className="tick">✓</span> {a}
              </span>
            ))}
          </div>
        </div>
        <div className="globe-wrap">
          <Globe />
          <div className="globe-legend">
            {h.legend.map((l) => (
              <span key={l.label}>
                {l.diamond ? (
                  <span style={{ color: l.color }} aria-hidden="true">
                    ◆
                  </span>
                ) : (
                  <i style={{ background: l.color }} aria-hidden="true" />
                )}{' '}
                {l.label}
              </span>
            ))}
          </div>
        </div>
      </Container>
    </header>
  );
}
