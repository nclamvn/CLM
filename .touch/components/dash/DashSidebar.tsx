'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TouchBrand } from '@/components/brand/TouchBrand';
import { Icon } from './Icon';
import { nav } from '@/lib/project-status';

const ICONS = ['home', 'gauge', 'bell', 'layers', 'people', 'cpu', 'shield', 'doc', 'branch'] as const;

/**
 * Thanh ben. Client vi muc dang mo tinh theo route that (usePathname).
 * 01/10/2026 (nghiem thu enterprise): go muc "sap co", nhan "POC", khoi "Domain" va khau hieu
 * tieng Anh. Moi thu hien o day phai bam duoc va noi bang tieng Viet.
 */
export function DashSidebar() {
  const pathname = usePathname();
  return (
    <aside className="dash-sidebar">
      <div className="dash-sidebar__brand">
        <TouchBrand mode="full" theme="dark" size="md" href="/dashboard" subtitle="Cung cầu có nguồn" />
      </div>
      <nav className="dash-nav" aria-label="Điều hướng chính">
        {nav.map((n, i) => {
          // Trang con (vd /dashboard/don-vi/<slug>) van sang muc cha; rieng /dashboard thi phai khop dung.
          const active = pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(`${n.href}/`));
          return (
            <Link key={n.label} href={n.href} className={`dash-nav__item${active ? ' is-active' : ''}`} aria-current={active ? 'page' : undefined} aria-label={n.label}>
              <Icon name={ICONS[i] ?? 'doc'} className="dash-nav__icon" />
              <span>{n.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="dash-sidebar__spacer" />
      <div className="dash-project">
        <div className="dash-project__k">Phạm vi dữ liệu</div>
        <div className="dash-project__v">Công nghệ chiến lược Việt Nam</div>
        <div className="dash-project__phu">Danh mục theo QĐ 21/2026/QĐ-TTg</div>
      </div>
    </aside>
  );
}
