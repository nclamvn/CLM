import Link from 'next/link';
import { Container } from '../shared/Container';
import { landing } from '@/lib/content';

/** Footer: wordmark + blurb, ba cot link. Hover link do (theo ban do do). */
export function Footer() {
  const f = landing.footer;
  return (
    <footer className="foot">
      <Container className="foot-in">
        <div>
          <div className="brand">
            <span className="accentdot" />
            touch
          </div>
          <p>{f.blurb}</p>
        </div>
        <div className="foot-cols">
          {f.cols.map((col) => (
            <div className="foot-col" key={col.h}>
              <h5 className="mono">{col.h}</h5>
              {col.links.map((l) =>
                l.href.startsWith('/') ? (
                  <Link key={l.label} href={l.href}>
                    {l.label}
                  </Link>
                ) : (
                  <a key={l.label} href={l.href}>
                    {l.label}
                  </a>
                ),
              )}
            </div>
          ))}
        </div>
      </Container>
    </footer>
  );
}
