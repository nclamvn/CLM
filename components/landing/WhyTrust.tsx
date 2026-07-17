import { Container } from '../shared/Container';
import { SectionTag } from '../shared/SectionTag';
import { landing } from '@/lib/content';

/** Vi sao tin duoc: 3 cot co che. */
export function WhyTrust() {
  const w = landing.why;
  return (
    <section className="sec" id="why">
      <Container>
        <div className="sec-head">
          <SectionTag>{w.tag}</SectionTag>
          <h2>
            {w.h2pre}
            <em>{w.h2em}</em>
            {w.h2tail}
          </h2>
        </div>
        <div className="diffs">
          {w.diffs.map((d) => (
            <div className="diff" key={d.h}>
              <div className="ic" aria-hidden="true">
                {d.ic}
              </div>
              <h3>{d.h}</h3>
              <p>{d.p}</p>
              <div className="tg mono">{d.tg}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
