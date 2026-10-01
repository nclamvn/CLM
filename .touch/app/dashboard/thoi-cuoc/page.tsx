import type { Metadata } from 'next';
import { DashTopBar } from '@/components/dash/DashTopBar';
import { DongThoiCuoc } from '@/components/thoicuoc/DongThoiCuoc';
import tc from '@/lib/hub-thoi-cuoc.json';
import { ngayVN } from '@/lib/dinh-dang';

export const metadata: Metadata = {
  title: 'Dòng thời cuộc - .touch',
  robots: { index: false, follow: false },
};

export default function ThoiCuocPage() {
  const m = (tc as unknown as { meta: { mocNgay: string } }).meta;
  return (
    <>
      <DashTopBar title="Dòng thời cuộc" subtitle={`Chính sách, tin về đơn vị, quyết định gác cổng, đề xuất chờ duyệt · dữ liệu ${ngayVN(m.mocNgay)}`} />
      <div className="dash-content"><DongThoiCuoc /></div>
    </>
  );
}
