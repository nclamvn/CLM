import type { Metadata } from 'next';
import './globals.css';
import { beVietnamPro, fraunces, ibmPlexMono } from './fonts';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: '.touch · Provenance-backed B2B matching',
  description:
    'Nền tảng match B2B có chuỗi dẫn chứng. Chạm đúng đối tác bằng những match chứng-minh-được, kèm tầng bảo chứng.',
  applicationName: '.touch',
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontVars = `${beVietnamPro.variable} ${fraunces.variable} ${ibmPlexMono.variable}`;
  return (
    <html lang="vi" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
