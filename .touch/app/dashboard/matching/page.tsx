import type { Metadata } from 'next';
import { DashTopBar } from '@/components/dash/DashTopBar';
import { MatchingWorkbench } from '@/components/dash/MatchingWorkbench';
import { PheuGhep, MayDaLoai } from '@/components/dash/PheuGhep';
import { matchMeta } from '@/lib/cncl-match';
import { tenNguoi } from '@/lib/dinh-dang';

export const metadata: Metadata = {
  title: 'Ghép cung cầu · .touch',
  robots: { index: false, follow: false },
};

export default function MatchingPage() {
  return (
    <>
      <DashTopBar
        title="Ghép cung cầu"
        subtitle={`Máy đề xuất, người ký · ${matchMeta.daKy} match đã ký bởi ${tenNguoi(matchMeta.nguoiKy)} · chỉ đọc`}
      />
      <div className="dash-content">
        {/* Them 30/09/2026: phieu ghep o dau, phan may da loai o cuoi. Workbench giu nguyen o giua. */}
        <PheuGhep />
        <MatchingWorkbench />
        <MayDaLoai />
      </div>
    </>
  );
}
