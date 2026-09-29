'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TouchBrand } from '@/components/brand/TouchBrand';
import { Icon } from './Icon';
import { nav } from '@/lib/project-status';

const ICONS = ['home', 'layers', 'people', 'cpu', 'shield', 'gauge', 'alert', 'doc', 'branch', 'gear'] as const;

/**
 * Sidebar v2. Client vì active tính theo route thật (usePathname).
 * Mục chưa có màn (href rỗng) render span aria-disabled kèm chú "sắp có",
 * KHÔNG dead-link href="#" (điều cấm: trạng thái phải trung thực).
 */
export function DashSidebar() {
  const pathname = usePathname();
  return (
    <aside className="dash-sidebar">
      <div className="dash-sidebar__brand">
        <TouchBrand mode="full" theme="dark" size="md" href="/dashboard" subtitle="B2B Matching Platform" />
      </div>
      <nav className="dash-nav" aria-label="Dieu huong chinh">
        {nav.map((n, i) => {
          // Trang con (vd /dashboard/don-vi/<slug>) van sang muc cha; rieng /dashboard thi phai khop dung.
          const active = n.href !== '' && (pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(`${n.href}/`)));
          if (n.href === '') {
            return (
              <span key={n.label} className="dash-nav__item is-disabled" aria-disabled="true" title="Màn này sắp có">
                <Icon name={ICONS[i]} className="dash-nav__icon" />
                <span>{n.label}</span>
              </span>
            );
          }
          return (
            <Link
              key={n.label}
              href={n.href}
              className={`dash-nav__item${active ? ' is-active' : ''}`}
              aria-current={active ? 'page' : undefined}
            >
              <Icon name={ICONS[i]} className="dash-nav__icon" />
              <span>{n.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="dash-sidebar__spacer" />
      <div className="dash-project">
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Dự án</div>
        <div className="dash-project__row">
          <TouchBrand mode="compact" theme="dark" size="xs" />
          <span className="chip chip--poc">POC</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 12 }}>Domain</div>
        <div className="dash-project__row">
          <span style={{ color: 'var(--color-text-link)', fontSize: 13 }}>Solo Entrepreneur</span>
          <span className="chip chip--public">SE</span>
        </div>
      </div>
      <div className="dash-brandfoot">
        <div className="dash-brandfoot__tag">Provenance is our DNA</div>
        <div className="dash-brandfoot__dots" aria-hidden="true" />
      </div>
    </aside>
  );
}
