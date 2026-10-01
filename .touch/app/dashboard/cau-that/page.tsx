import type { Metadata } from 'next';
import { DashTopBar } from '@/components/dash/DashTopBar';
import { CauThat } from '@/components/cauthat/CauThat';
import ct from '@/lib/hub-cau-that.json';

export const metadata: Metadata = {
  title: 'Cầu thật · .touch',
  description: 'Nhu cầu đặt hàng công nghệ công khai, có bên đặt hàng rõ ràng, mỗi dòng có câu nguồn nguyên văn; kèm gợi ý đơn vị trong sổ nguồn.',
};

export default function CauThatPage() {
  return (
    <>
      <DashTopBar title="Cầu thật" subtitle={`${ct.meta.soNhuCau} nhu cầu đặt hàng công nghệ có nguồn · ${ct.meta.soBenDatHang} bên đặt hàng`} />
      <div className="dash-content"><CauThat /></div>
    </>
  );
}
