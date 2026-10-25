import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3200';

/**
 * Sitemap: chi trang dau. /dev khong dua vao; /hub da go.
 * 25/10/2026: truoc day liet ke ca 12 man bang dieu khien trong khi dashboard/layout.tsx dat
 * noindex cho chung, tuc noi hai dieu trai nhau voi may tim kiem. Bang dieu khien chua cong bo
 * nen giu noindex; khi mo cong khai thi bo noindex VA them lai cac man vao day cung mot luot.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const man = [''];
  return man.map((m, i) => ({ url: `${siteUrl}${m}`, changeFrequency: 'weekly', priority: i === 0 ? 1 : 0.7 }));
}
