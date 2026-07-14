import Link from 'next/link';
import { Container } from '../shared/Container';
import { Button } from '../shared/Button';
import { landing } from '@/lib/content';

/** Nav sticky, blur nen, wordmark, 4 tab gach chan do hover, CTA, link Hub. */
export function Nav() {
  return (
    <nav className="nav">
      <Container className="nav-in">
        <div className="brand">
          <span className="accentdot" />
          touch
        </div>
        <div className="nav-links">
          {landing.nav.links.map((l) => (
            <a key={l.href + l.label} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <div className="nav-right">
          <Link className="nav-login" href="/hub">
            {landing.nav.hub} →
          </Link>
          <Button variant="primary" href="#cta">
            {landing.nav.cta}
          </Button>
        </div>
      </Container>
    </nav>
  );
}
