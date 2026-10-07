import type { Metadata } from 'next';
import { DashTopBar } from '@/components/dash/DashTopBar';
import { DieuPhoi } from '@/components/dieuphoi/DieuPhoi';
import dp from '@/lib/hub-dieu-phoi.json';

export const metadata: Metadata = {
  title: 'Điều phối · .touch',
  description: 'Mũi nhọn điều phối: vòng đời từng cặp cung cầu từ ứng viên tới kết quả, hàng việc theo người, sổ sự kiện chỉ người ghi.',
};

export default function DieuPhoiPage() {
  return (
    <>
      <DashTopBar title="Điều phối" subtitle={`${dp.meta.ten} · ${dp.meta.soNhuCau} nhu cầu · ${dp.meta.soViec} việc đang mở`} />
      <div className="dash-content"><DieuPhoi /></div>
    </>
  );
}
