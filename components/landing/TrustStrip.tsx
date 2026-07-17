import { landing } from '@/lib/content';

/**
 * Dai chi so tin cay: marquee full-bleed chay phai sang trai, lap vo han.
 * Track gom 4 ban sao (translateX -50% = 2 ban sao, du rong hon moi man hinh
 * de noi vong lien mach); ban sao 2..4 aria-hidden de screen reader chi doc
 * mot lan. Hover tam dung; prefers-reduced-motion tat han (dung tinh).
 */
export function TrustStrip() {
  const copies = [0, 1, 2, 3];
  return (
    <div className="strip">
      <div className="strip-track">
        {copies.map((c) => (
          <div className="strip-run" key={c} aria-hidden={c > 0 ? 'true' : undefined}>
            {landing.strip.map((s) => (
              <div className="strip-item" key={`${c}-${s.k}`}>
                <span className="k mono">{s.k}</span>
                <b>{s.v}</b>
                <span>{s.d}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
