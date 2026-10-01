import type { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/** Sitemap: trang dau va cac man doc duoc cua bang dieu khien. /dev khong dua vao; /hub da go. */
export default function sitemap(): MetadataRoute.Sitemap {
  const man = ['', '/dashboard', '/dashboard/thi-truong', '/dashboard/thoi-cuoc', '/dashboard/do-thi', '/dashboard/don-vi', '/dashboard/matching', '/dashboard/registry', '/dashboard/phuong-phap'];
  return man.map((m, i) => ({ url: `${siteUrl}${m}`, changeFrequency: 'weekly', priority: i === 0 ? 1 : 0.7 }));
}
