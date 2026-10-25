'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TouchBrand } from '@/components/brand/TouchBrand';
import { Icon } from './Icon';
import { nav, NHOM_MENU } from '@/lib/project-status';

/**
 * Thanh ben. Client vi muc dang mo tinh theo route that (usePathname).
 * 01/10/2026 (nghiem thu enterprise): go muc "sap co", nhan "POC", khoi "Domain" va khau hieu
 * tieng Anh. Moi thu hien o day phai bam duoc va noi bang tieng Viet.
 * 25/10/2026 (G7): nhom theo viec (Van hanh, Thi truong, Bang chung, Bao cao); bieu tuong lay tu
 * chinh muc menu, khong theo vi tri; Kho ma xuong cuoi thanh ben.
 */
export function DashSidebar() {
  const pathname = usePathname();
  return (
    <aside className="dash-sidebar">
      <div className="dash-sidebar__brand">
        <TouchBrand mode="full" theme="dark" size="md" href="/dashboard" subtitle="Cung cầu có nguồn" />
      </div>
      <nav className="dash-nav" aria-label="Điều hướng chính">
        {NHOM_MENU.filter((g) => g.k !== 'phu').map((g) => (
          <div key={g.k} className="dash-nav__nhom" role="group" aria-label={g.ten || 'Tổng quan'}>
            {g.ten && <div className="dash-nav__ten-nhom" aria-hidden="true">{g.ten}</div>}
            {nav.filter((n) => n.nhom === g.k).map((n) => <MucMenu key={n.href} n={n} pathname={pathname} />)}
          </div>))}
      </nav>
      <div className="dash-sidebar__spacer" />
      <nav className="dash-nav dash-nav--phu" aria-label="Trang kỹ thuật">
        {nav.filter((n) => n.nhom === 'phu').map((n) => <MucMenu key={n.href} n={n} pathname={pathname} />)}
      </nav>
      <div className="dash-project">
        <div className="dash-project__k">Phạm vi dữ liệu</div>
        <div className="dash-project__v">Công nghệ chiến lược Việt Nam</div>
        <div className="dash-project__phu">Danh mục theo QĐ 21/2026/QĐ-TTg</div>
      </div>
    </aside>
  );
}

function MucMenu({ n, pathname }: { n: (typeof nav)[number]; pathname: string | null }) {
  // Trang con (vd /dashboard/don-vi/<slug>) van sang muc cha; rieng /dashboard thi phai khop dung.
  const active = pathname === n.href || (n.href !== '/dashboard' && !!pathname?.startsWith(`${n.href}/`));
  return (
    <Link href={n.href} className={`dash-nav__item${active ? ' is-active' : ''}`} aria-current={active ? 'page' : undefined} aria-label={n.label}>
      <Icon name={n.icon} className="dash-nav__icon" />
      <span>{n.label}</span>
    </Link>
  );
}
