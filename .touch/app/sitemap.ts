import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/** Sitemap: hai be mat cong khai. Trang /dev khong dua vao. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: 'weekly', priority: 1 },
    { url: `${siteUrl}/hub`, changeFrequency: 'weekly', priority: 0.8 },
  ];
}
