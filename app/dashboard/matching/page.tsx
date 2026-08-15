import type { Metadata } from 'next';
import { DashTopBar } from '@/components/dash/DashTopBar';
import { MatchingWorkbench } from '@/components/dash/MatchingWorkbench';

export const metadata: Metadata = {
  title: 'Matching Workbench - .touch',
  robots: { index: false, follow: false },
};

export default function MatchingPage() {
  return (
    <>
      <DashTopBar
        title="Matching Workbench"
        subtitle="Capability-to-demand linkage · confidence ladder · human review. MATCH: DEMO (engine chưa chạy match thật)"
      />
      <div className="dash-content">
        <MatchingWorkbench />
      </div>
    </>
  );
}
