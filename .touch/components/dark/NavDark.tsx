import { TouchBrand } from '@/components/brand/TouchBrand';
import { PortalSwitcher } from '@/components/portal/PortalSwitcher';
import { MobileNav } from '../shared/MobileNav';
import { ROUTE } from '@/lib/portal-routes';
import { dk } from '@/lib/content';

/* Nav landing (TIP-PORTAL-V1 muc 7.2): 72px sticky, TouchBrand, links, ENGINE DEMO, CTA -> /hub. */
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
          <span className="lp-engine" data-state="demo">
            <span className="lp-engine__dot" aria-hidden="true" />
            {dk.nav.status}
          </span>
          <PortalSwitcher active="landing" />
          <a className="lp-btn lp-btn--primary" href={ROUTE.hub}>
            {dk.nav.cta}
          </a>
          <MobileNav dark links={dk.nav.links} />
        </div>
      </div>
    </nav>
  );
}
