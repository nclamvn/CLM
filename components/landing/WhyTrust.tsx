import { Container } from '../shared/Container';
import { SectionTag } from '../shared/SectionTag';
import { landing } from '@/lib/content';

/**
 * Vi sao tin duoc: 3 the co che, cung ngon ngu voi pipeline (chip icon,
 * pill chi so, hover nhac the) + chu ky rieng: glyph watermark kho lon mo
 * o goc duoi phai, dam len nhe khi hover. Watermark aria-hidden (trang tri).
 */
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
          {w.diffs.map((d, i) => (
            <div className="diff" key={d.h}>
              <span className="wm" aria-hidden="true">
                {d.ic}
              </span>
              <div className="diff-in">
                <span className="idx mono">{String(i + 1).padStart(2, '0')}</span>
                <div className="ic" aria-hidden="true">
                  {d.ic}
                </div>
                <h3>{d.h}</h3>
                <p>{d.p}</p>
                <div className="tg mono">{d.tg}</div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
