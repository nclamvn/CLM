import { Container } from '../shared/Container';
import { landing } from '@/lib/content';

/** Dai chi so tin cay giua nav va cac section. */
export function TrustStrip() {
  return (
    <div className="strip">
      <Container className="strip-in">
        {landing.strip.map((s) => (
          <div className="strip-item" key={s.k}>
            <span className="k mono">{s.k}</span>
            <b>{s.v}</b>
            <span>{s.d}</span>
          </div>
        ))}
      </Container>
    </div>
  );
}
