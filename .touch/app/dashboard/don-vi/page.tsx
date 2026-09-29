import type { Metadata } from 'next';
import { DashTopBar } from '@/components/dash/DashTopBar';
import { DanhSachDonVi } from '@/components/hoso/DanhSachDonVi';
import type { HoSo } from '@/components/hoso/HoSoDonVi';
import hoSo from '@/lib/hub-ho-so.json';

export const metadata: Metadata = {
  title: 'Hồ sơ đơn vị - .touch',
  robots: { index: false, follow: false },
};

type DuLieu = { meta: { mocNgay: string; nguongNgay: number; soDonVi: number }; units: HoSo[] };
const D = hoSo as unknown as DuLieu;

export default function DonViPage() {
  const nhoms = [...new Map(D.units.flatMap((u) => u.nhoms).map((n) => [n.so, n])).values()]
    .sort((a, b) => Number(a.so) - Number(b.so));
  const tong = D.units.reduce((s, u) => ({ quaHan: s.quaHan + u.doTuoi.quaHan, chuaDd: s.chuaDd + (u.dinhDanh.trangThai === 'chua_dinh_danh' ? 1 : 0) }), { quaHan: 0, chuaDd: 0 });
  return (
    <>
      <DashTopBar
        title="Hồ sơ đơn vị"
        subtitle={`${D.meta.soDonVi} đơn vị cung · ${tong.chuaDd} chưa định danh · ${tong.quaHan} câu nguồn quá hạn chưa có lý do · ${D.meta.mocNgay}`}
      />
      <div className="dash-content">
        <DanhSachDonVi ds={D.units} nhoms={nhoms} />
      </div>
    </>
  );
}
