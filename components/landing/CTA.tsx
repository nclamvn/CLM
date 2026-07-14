import { Container } from '../shared/Container';
import { Button } from '../shared/Button';
import { landing } from '@/lib/content';

/** CTA cuoi trang, cum focal do. */
export function CTA() {
  const c = landing.cta;
  return (
    <section className="cta" id="cta">
      <Container>
        <h2>
          {c.h2pre}
          <em>{c.h2em}</em>
          {c.h2tail}
        </h2>
        <p>{c.p}</p>
        <div className="hero-cta">
          <Button variant="primary" href={c.email} arrow>
            {c.ctaPrimary}
          </Button>
          <Button variant="ghost" href="/hub">
            {c.ctaGhost}
          </Button>
        </div>
      </Container>
    </section>
  );
}
