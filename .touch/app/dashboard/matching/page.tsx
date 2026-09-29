import type { Metadata } from 'next';
import { DashTopBar } from '@/components/dash/DashTopBar';
import { MatchingWorkbench } from '@/components/dash/MatchingWorkbench';
import { matchMeta } from '@/lib/cncl-match';

export const metadata: Metadata = {
  title: 'Matching Workbench - .touch',
  robots: { index: false, follow: false },
};

export default function MatchingPage() {
  return (
    <>
      <DashTopBar
        title="Matching Workbench"
        subtitle={`Máy đề xuất, người ký · ${matchMeta.daKy} match đã ký bởi ${matchMeta.nguoiKy} · chỉ đọc`}
      />
      <div className="dash-content">
        <MatchingWorkbench />
      </div>
    </>
  );
}
