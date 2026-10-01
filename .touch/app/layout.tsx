import type { Metadata } from 'next';
import './globals.css';
import '@/styles/touch-theme.css';
import '@/styles/touch-portal.css';
import '@/styles/touch-unify.css';
import '@/styles/mau-du-lieu.css';
import { ui } from '@/lib/content';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

const siteTitle = '.touch · Cung gặp cầu công nghệ chiến lược';
const siteDescription =
  'Bản đồ sống của thị trường công nghệ chiến lược Việt Nam. Mỗi kết nối đều có người ký và truy được về tận câu nguồn.';

/**
 * Metadata goc cho toan site. OG image lay tu app/opengraph-image.tsx
 * (Next tu chen og:image va twitter:image cho moi route).
 * Canonical dat theo tung trang.
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
  return (
    <html lang="vi" data-scroll-behavior="smooth">
      <body>
        <a className="skip-link" href="#main">
          {ui.skipToContent}
        </a>
        {children}
      </body>
    </html>
  );
}
