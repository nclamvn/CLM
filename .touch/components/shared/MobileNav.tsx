'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { landing, ui } from '@/lib/content';

type NavLink = { readonly href: string; readonly label: string };

/**
 * Menu mobile that cho Nav (hien duoi 920px qua CSS .mnav). Nut hamburger mo
 * panel role="dialog": focus don vao panel, Tab quay vong trong panel, Esc dong,
 * dong tra focus ve nut mo, body khoa cuon khi mo. Chon mot muc thi dong menu.
 * `links` cho phep be mat khac (landing toi) truyen anchor rieng; `dark` doi
 * skin panel (panel portal ra body nen khong an theo scope .dk).
 */
export function MobileNav({
  dark = false,
  links = landing.nav.links,
}: {
  dark?: boolean;
  links?: readonly NavLink[];
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const btn = btnRef.current;
    const focusables = () =>
      panel
        ? Array.from(panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
        : [];
    focusables()[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      // Vong focus: Tab o cuoi quay ve dau, Shift+Tab o dau xuong cuoi.
      if (e.shiftKey && (active === first || !panel?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || !panel?.contains(active))) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
      btn?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="mnav">
      <button
        ref={btnRef}
        type="button"
        className="mnav-btn"
        aria-label={open ? ui.menuClose : ui.menuOpen}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="mnav-ic" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </button>

      {/* Portal ra body: .nav co backdrop-filter nen la containing block cua
          position:fixed, panel de trong .nav se bi bo kin trong thanh nav. */}
      {open
        ? createPortal(
        <div
          ref={panelRef}
          id="mobile-menu"
          className={`mnav-panel ${dark ? 'mnav-dark' : ''}`.trim()}
          role="dialog"
          aria-modal="true"
          aria-label={ui.menuLabel}
        >
          <div className="mnav-head">
            <div className="brand">
              <span className="accentdot" />
              touch
            </div>
            <button type="button" className="mnav-close" aria-label={ui.menuClose} onClick={close}>
              <span aria-hidden="true">✕</span>
            </button>
          </div>
          <nav className="mnav-links" aria-label={ui.menuLabel}>
            {links.map((l) => (
              <a key={l.href + l.label} href={l.href} onClick={close}>
                {l.label}
              </a>
            ))}
            <Link href="/hub" onClick={close}>
              {landing.nav.hub} <span aria-hidden="true">→</span>
            </Link>
          </nav>
          <div className="mnav-cta">
            <a className="btn btn-primary" href="#cta" onClick={close}>
              {landing.nav.cta}
            </a>
          </div>
        </div>,
        document.body,
      )
        : null}
    </div>
  );
}
