import type { Metadata } from 'next';
import { DashTopBar } from '@/components/dash/DashTopBar';
import { MoDau } from '@/components/modau/MoDau';
import md from '@/lib/hub-mo-dau.json';
import { ngayVN } from '@/lib/dinh-dang';

export const metadata: Metadata = {
  title: 'Tổng quan - .touch',
  robots: { index: false, follow: false },
};

/**
 * Trang mo dau M0 (29/09/2026). Thay trang Tong quan anh chup tay 19/07/2026: moi so doc tu
 * lib/hub-mo-dau.json (lib/mo-dau.mjs), cong check-mo-dau.mjs doi chieu voi tung man.
 */
export default function DashboardPage() {
  const m = (md as unknown as { mocNgay: string }).mocNgay;
  return (
    <>
      <DashTopBar title="Tổng quan" subtitle={`Cung cầu công nghệ chiến lược, mọi con số có nguồn · dữ liệu ${ngayVN(m)}`} />
      <div className="dash-content"><MoDau /></div>
    </>
  );
}
