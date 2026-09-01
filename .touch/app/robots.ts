import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/** robots.txt: mo cho index, chan cac trang /dev (san choi noi bo). */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/dev/',
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
