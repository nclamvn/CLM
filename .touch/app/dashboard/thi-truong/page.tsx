import type { Metadata } from 'next';
import { DashTopBar } from '@/components/dash/DashTopBar';
import { ToanCanhThiTruong } from '@/components/thitruong/ToanCanhThiTruong';
import tt from '@/lib/hub-thi-truong.json';
import { ngayVN } from '@/lib/dinh-dang';

export const metadata: Metadata = {
  title: 'Toàn cảnh thị trường - .touch',
  robots: { index: false, follow: false },
};

export default function ThiTruongPage() {
  const m = (tt as unknown as { tuoi: { mocNgay: string } }).tuoi;
  return (
    <>
      <DashTopBar title="Toàn cảnh thị trường" subtitle={`Cung, nhóm công nghệ và nhu cầu quốc gia theo QĐ 21/2026 · dữ liệu ${ngayVN(m.mocNgay)}`} />
      <div className="dash-content"><ToanCanhThiTruong /></div>
    </>
  );
}
