import { Container } from '../shared/Container';
import { landing } from '@/lib/content';

/** Dai nganh doc, nen toi. */
export function VerticalBand() {
  const v = landing.vertical;
  return (
    <section className="sec" id="vertical">
      <Container>
        <div className="vband">
          <div>
            <h2>
              {v.h2pre}
              <em>{v.h2em}</em>
              {v.h2tail}
            </h2>
            <p>{v.p}</p>
          </div>
          <div className="vlist">
            {v.pills.map((p) => (
              <div className="vpill" key={p.num}>
                <span className="num">{p.num}</span> {p.label}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
