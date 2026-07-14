import { Container } from '../shared/Container';
import { SectionTag } from '../shared/SectionTag';
import { landing } from '@/lib/content';

/** Cach hoat dong: day chuyen 2 tang, 5 buoc. */
export function HowItWorks() {
  const h = landing.how;
  return (
    <section className="sec" id="how">
      <Container>
        <div className="sec-head">
          <SectionTag>{h.tag}</SectionTag>
          <h2>
            {h.h2pre}
            <em>{h.h2em}</em>
            {h.h2tail}
          </h2>
          <p>{h.lead}</p>
        </div>
        <div className="flow">
          {h.steps.map((s) => (
            <div className="step" key={s.n}>
              <span className="lyr mono">{s.layer}</span>
              <div className="n mono">{s.n}</div>
              <div className="ic" aria-hidden="true">
                {s.ic}
              </div>
              <h4>{s.h}</h4>
              <p>{s.p}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
