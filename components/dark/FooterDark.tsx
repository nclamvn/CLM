import Link from 'next/link';
import { dk } from '@/lib/content';

/** Footer toi: wordmark outline khong lo, status, cot link, hang meta. */
export function FooterDark() {
  const f = dk.footer;
  return (
    <footer className="dk-foot">
      <div className="giant" aria-hidden="true">
        .touch
      </div>
      <div className="wrap">
        <div className="dk-foot-in">
          <div>
            <div className="brand">
              <span className="accentdot" />
              touch
            </div>
            <p>{f.blurb}</p>
            <div className="dk-status">
              <span className="d" aria-hidden="true" /> {f.status}
            </div>
          </div>
          <div className="dk-foot-cols">
            {f.cols.map((col) => (
              <div className="dk-foot-col" key={col.h}>
                <h3>{col.h}</h3>
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
        </div>
        <div className="dk-foot-meta">
          {f.meta.map((m) => (
            <span key={m}>{m}</span>
          ))}
        </div>
      </div>
    </footer>
  );
}
