import { TouchBrand } from '@/components/brand/TouchBrand';

/* FooterDark (VF-L-020): portal footer. TouchBrand compact, 3 cot Product/Trust/Company,
   Provenance is our DNA, build/date mono. Khong giant wordmark, khong fake ENGINE LIVE. */
const COLS = [
  { h: 'Product', links: [{ label: 'Hub', href: '/hub' }, { label: 'Dashboard', href: '/dashboard' }, { label: 'Engine', href: '#pipeline' }] },
  { h: 'Trust', links: [{ label: 'Provenance', href: '#data' }, { label: 'Bảo chứng', href: '#why' }, { label: 'Fail-loud', href: '#why' }] },
  { h: 'Company', links: [{ label: 'Nguồn dữ liệu', href: '#matching' }, { label: 'Ngành dọc', href: '#vertical' }] },
];

export function FooterDark() {
  return (
    <footer className="lp-footer">
      <div className="portal-container lp-footer__inner">
        <div className="lp-footer__brand">
          <TouchBrand mode="compact" theme="dark" size="sm" href="/" />
          <p className="lp-footer__dna">Provenance is our DNA</p>
        </div>
        {COLS.map((c) => (
          <nav className="lp-footer__col" key={c.h} aria-label={c.h}>
            <span className="lp-footer__ch">{c.h}</span>
            {c.links.map((l) => (
              <a key={l.label} href={l.href}>
                {l.label}
              </a>
            ))}
          </nav>
        ))}
      </div>
      <div className="portal-container lp-footer__meta">
        <span>.touch · B2B Matching Platform</span>
        <span className="lp-footer__build">build 6c13f57 · 2026-07-19</span>
      </div>
    </footer>
  );
}
