import { dk } from '@/lib/content';

/**
 * Bang tin chay ngang full-bleed. 4 ban sao de noi vong lien mach;
 * ban sao 2..4 aria-hidden. Hover tam dung, reduced-motion dung tinh (CSS).
 */
export function TapeDark() {
  return (
    <div className="dk-tape">
      <div className="dk-tape-track">
        {[0, 1, 2, 3].map((c) => (
          <div className="dk-tape-run" key={c} aria-hidden={c > 0 ? 'true' : undefined}>
            {dk.tape.map((t) => (
              <span className="dk-tape-item" key={`${c}-${t.k}`}>
                <span className="tk">{t.k}</span>
                <b className={t.hot ? 'rd' : undefined}>{t.v}</b> {t.d}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
