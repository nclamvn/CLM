import type { Metadata } from 'next';
import './globals.css';
import '@/styles/touch-theme.css';
import '@/styles/touch-portal.css';
import '@/styles/touch-unify.css';
import '@/styles/mau-du-lieu.css';
import { beVietnamPro, fraunces, ibmPlexMono } from './fonts';
import { ui } from '@/lib/content';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

const siteTitle = '.touch · Provenance-backed B2B matching';
const siteDescription =
  'Nền tảng match B2B có chuỗi dẫn chứng. Chạm đúng đối tác bằng những match chứng-minh-được, kèm tầng bảo chứng.';

/**
 * Metadata goc cho toan site. OG image lay tu app/opengraph-image.tsx
 * (Next tu chen og:image va twitter:image cho moi route).
 * Canonical dat theo tung trang (app/page.tsx, app/hub/page.tsx).
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  applicationName: '.touch',
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: '.touch',
    locale: 'vi_VN',
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontVars = `${beVietnamPro.variable} ${fraunces.variable} ${ibmPlexMono.variable}`;
  return (
    <html lang="vi" className={fontVars} data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">
          {ui.skipToContent}
        </a>
        {children}
      </body>
    </html>
  );
}
