import { MobileNav } from '../shared/MobileNav';
import { PortalSwitcher } from '@/components/portal/PortalSwitcher';
import { dk } from '@/lib/content';

/** Nav toi: wordmark glow, 4 tab, chi bao ENGINE LIVE, CTA outline. */
export function NavDark() {
  return (
    <nav className="dk-nav">
      <div className="wrap dk-nav-in">
        <div className="brand">
          <span className="accentdot" />
          touch
        </div>
        <div className="dk-nav-links">
          {dk.nav.links.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
        </div>
        <div className="dk-nav-right">
          <PortalSwitcher active="landing" />
          <div className="dk-status">
            <span className="d" aria-hidden="true" /> {dk.nav.status}
          </div>
          <a className="dk-btn dk-btn-red" href="#cta">
            {dk.nav.cta}
          </a>
          <MobileNav dark links={dk.nav.links} />
        </div>
      </div>
    </nav>
  );
}
