import { TouchBrand } from '@/components/brand/TouchBrand';
import { PortalSwitcher } from '@/components/portal/PortalSwitcher';
import { MobileNav } from '../shared/MobileNav';
import { ROUTE } from '@/lib/portal-routes';
import { dk } from '@/lib/content';
import { matchMeta } from '@/lib/cncl-match';

/* Nav landing (TIP-PORTAL-V1 muc 7.2): 72px sticky, TouchBrand, links, trang thai engine, CTA.
   Sua 29/09/2026: chip truoc ghi cung "ENGINE DEMO" va nut "Xem engine thật" tro vao /hub la du lieu
   minh hoa nganh. Nay chip doc so match da ky tu lib/cncl-match (sinh tu so ky), nut tro vao dashboard. */
export function NavDark() {
  return (
    <nav className="lp-nav">
      <div className="lp-nav__inner portal-container">
        <TouchBrand mode="full" theme="dark" size="md" href="/" />
        <div className="lp-nav__links">
          {dk.nav.links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <div className="lp-nav__right">
          <span className="lp-engine" data-state="real">
            <span className="lp-engine__dot" aria-hidden="true" />
            Engine thật · {matchMeta.daKy} match đã ký
          </span>
          <PortalSwitcher active="landing" />
          <a className="lp-btn lp-btn--primary" href={ROUTE.dashboard}>
            {dk.nav.cta}
          </a>
          <MobileNav dark links={dk.nav.links} />
        </div>
      </div>
    </nav>
  );
}
