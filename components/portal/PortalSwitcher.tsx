'use client';
/* TIP-PORTAL-V1 muc 1.3: chuyen doi giua Landing / Hub / Dashboard.
   Dung chung tren ca 3 route. Trigger 40x152, menu 264, 3 row 52, active dot blue. */
import { useEffect, useRef, useState } from 'react';
import { PORTAL_ROUTES } from '@/lib/portal-routes';
import type { PortalRouteKey } from '@/lib/portal-routes';

function GridIcon() {
  return (
    <svg className="portal-switcher__icon" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="2.5" y="2.5" width="5" height="5" rx="1" />
      <rect x="10.5" y="2.5" width="5" height="5" rx="1" />
      <rect x="2.5" y="10.5" width="5" height="5" rx="1" />
      <rect x="10.5" y="10.5" width="5" height="5" rx="1" />
    </svg>
  );
}
function ChevIcon() {
  return (
    <svg className="portal-switcher__chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M4 6.5 8 10.5l4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PortalSwitcher({ active }: { active: PortalRouteKey }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = PORTAL_ROUTES.find((r) => r.key === active) ?? PORTAL_ROUTES[0];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onDown);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onDown);
    };
  }, [open]);

  return (
    <div className="portal-switcher" ref={ref}>
      <button
        type="button"
        className="portal-switcher__trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Chuyển cổng .touch"
        onClick={() => setOpen((o) => !o)}
      >
        <GridIcon />
        <span>{current.label}</span>
        <ChevIcon />
      </button>
      {open ? (
        <div className="portal-switcher__menu" role="menu">
          {PORTAL_ROUTES.map((r) => (
            <a
              key={r.key}
              href={r.href}
              role="menuitem"
              className={`portal-switcher__row${r.key === active ? ' is-active' : ''}`}
              aria-current={r.key === active ? 'page' : undefined}
            >
              <span className="portal-switcher__dot" aria-hidden="true" />
              <span className="portal-switcher__rowtext">
                <span className="portal-switcher__rowlabel">{r.label}</span>
                <span className="portal-switcher__rowdesc">{r.desc}</span>
              </span>
            </a>
          ))}
        </div>
      ) : null}
    </div>
  );
}
