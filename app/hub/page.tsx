import type { Metadata } from 'next';
import { HubTopBar } from '@/components/hub/HubTopBar';
import { HubRail } from '@/components/hub/HubRail';
import { KpiGrid } from '@/components/hub/KpiGrid';
import { HubApp } from '@/components/hub/HubApp';
import { ViewSwitch } from '@/components/shared/ViewSwitch';
import { hub } from '@/lib/content';

export const metadata: Metadata = {
  title: '.touch Hub · Provenance-backed B2B matching',
  description:
    'Hub prototype của .touch trên demo data: match chứng-minh-được với chuỗi provenance, registry cung cầu, và tầng bảo chứng.',
  robots: { index: true, follow: true },
};

export default function HubPage() {
  return (
    <div className="hub-view">
      <HubTopBar />
      <div className="hub-body">
        <HubRail />
        <main className="hub-main">
          <div className="hub-h">
            <div>
              <h1>{hub.dashboardTitle}</h1>
              <p className="mono">{hub.dashboardSub}</p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: '10px 18px', fontSize: 13 }}
            >
              {hub.runMatch}
            </button>
          </div>
          <KpiGrid />
          <HubApp />
          <div className="hub-note mono">
            <span aria-hidden="true">◈</span> {hub.note}
          </div>
        </main>
      </div>
      <ViewSwitch active="hub" fixed />
    </div>
  );
}
