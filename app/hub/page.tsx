import type { Metadata } from 'next';
import { HubTopBar } from '@/components/hub/HubTopBar';
import { HubRail } from '@/components/hub/HubRail';
import { KpiGrid } from '@/components/hub/KpiGrid';
import { HubApp } from '@/components/hub/HubApp';
import { ViewSwitch } from '@/components/shared/ViewSwitch';
import { hub } from '@/lib/content';

const hubTitle = '.touch Hub · Provenance-backed B2B matching';
const hubDescription =
  'Hub prototype của .touch trên demo data: match chứng-minh-được với chuỗi provenance, registry cung cầu, và tầng bảo chứng.';

export const metadata: Metadata = {
  title: hubTitle,
  description: hubDescription,
  robots: { index: true, follow: true },
  alternates: { canonical: '/hub' },
  openGraph: {
    type: 'website',
    url: '/hub',
    siteName: '.touch',
    locale: 'vi_VN',
    title: hubTitle,
    description: hubDescription,
    // Khai bao lai anh OG: khoi openGraph rieng cua trang nay thay the khoi
    // goc nen anh tu app/opengraph-image.tsx khong tu lan xuong.
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: hubTitle }],
  },
  twitter: {
    card: 'summary_large_image',
    title: hubTitle,
    description: hubDescription,
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: hubTitle }],
  },
};

export default function HubPage() {
  return (
    <div className="dk hub-view">
      <HubTopBar />
      <div className="hub-body">
        <HubRail />
        <main id="main" className="hub-main">
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
