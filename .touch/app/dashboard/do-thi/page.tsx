import type { Metadata } from 'next';
import { DashTopBar } from '@/components/dash/DashTopBar';
import { DoThiCungCau } from '@/components/graph/DoThiCungCau';
import graph from '@/lib/hub-graph.json';
import { ngayVN } from '@/lib/dinh-dang';

export const metadata: Metadata = {
  title: 'Đồ thị cung cầu - .touch',
  robots: { index: false, follow: false },
};

export default function DoThiPage() {
  const m = (graph as unknown as { meta: { generatedAt: string } }).meta;
  return (
    <>
      <DashTopBar
        title="Đồ thị cung cầu"
        subtitle={`Cung, cầu và nhóm công nghệ chiến lược, nối bằng câu nguồn và chữ ký · dữ liệu ${ngayVN(m.generatedAt)}`}
      />
      <div className="dash-content">
        <DoThiCungCau />
      </div>
    </>
  );
}
