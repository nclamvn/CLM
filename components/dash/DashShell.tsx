'use client';

import { useState, useRef, useEffect } from 'react';
import { DashSidebar } from './DashSidebar';
import { Icon } from './Icon';

/**
 * Shell responsive. Duoi 900px sidebar thanh off-canvas drawer, keyboard-accessible:
 * Escape dong, focus trap trong drawer, tra focus ve menu button khi dong.
 */
export function DashShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open) {
      const sidebar = shellRef.current?.querySelector('.dash-sidebar');
      const focusables = () =>
        sidebar ? Array.from(sidebar.querySelectorAll<HTMLElement>('a[href],button:not([disabled])')) : [];
      focusables()[0]?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') { setOpen(false); return; }
        if (e.key === 'Tab') {
          const els = focusables();
          if (!els.length) return;
          const first = els[0];
          const last = els[els.length - 1];
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
          else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      };
      document.addEventListener('keydown', onKey);
      return () => document.removeEventListener('keydown', onKey);
    }
    if (wasOpen.current) menuBtnRef.current?.focus(); // tra focus khi dong
    wasOpen.current = open;
  }, [open]);

  useEffect(() => { wasOpen.current = open; }, [open]);

  return (
    <div className="dash-shell" data-drawer={open ? 'open' : 'closed'} ref={shellRef}>
      <DashSidebar />
      <div className="dash-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />
      <main className="dash-main" id="main">
        <button
          type="button"
          ref={menuBtnRef}
          className="dash-menu-btn"
          aria-label="Mo menu dieu huong"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name="layers" />
        </button>
        {children}
      </main>
    </div>
  );
}
