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
        subtitle={`Ghép cầu với cung trên registry thật · ${matchMeta.daKy} match đã ký bởi ${matchMeta.nguoiKy} · quy tắc ${matchMeta.rule}`}
      />
      <div className="dash-content">
        <MatchingWorkbench />
      </div>
    </>
  );
}
