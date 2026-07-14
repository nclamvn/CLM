import { Fragment } from 'react';
import { Container } from '../shared/Container';
import { SectionTag } from '../shared/SectionTag';
import { Button } from '../shared/Button';
import { MatchCard } from '../shared/MatchCard';
import { landing, demoMatch } from '@/lib/content';

/** In nghieng tu "claim" trong cau (theo reference). */
function withClaimEmphasis(text: string) {
  const parts = text.split('claim');
  return parts.map((p, i) => (
    <Fragment key={i}>
      {i > 0 ? <em>claim</em> : null}
      {p}
    </Fragment>
  ));
}

/** Don vi gia tri: copy trai, MatchCard phai. */
export function ValueUnit() {
  const v = landing.value;
  return (
    <section className="sec preview" id="value">
      <Container className="pv-grid">
        <div className="pv-copy">
          <SectionTag>{v.tag}</SectionTag>
          <h2>{v.h2}</h2>
          <p>{v.p}</p>
          <ul className="pv-list">
            {v.list.map((li) => (
              <li key={li}>
                <span className="b" aria-hidden="true">
                  →
                </span>{' '}
                {withClaimEmphasis(li)}
              </li>
            ))}
          </ul>
          <Button variant="primary" href="/hub" arrow>
            {v.cta}
          </Button>
        </div>
        <MatchCard data={demoMatch} />
      </Container>
    </section>
  );
}
