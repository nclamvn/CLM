# TIP-07 Completion Report · Cổng QA cuối và bàn giao Phase 1

Ngày: 17/07/2026. Theo TASK_GRAPH bản chốt 17/07 + DESIGN_SPEC_DARK.md. Không thêm tính năng.

## Kết quả từng tiêu chí

| # | Tiêu chí | Kết quả |
|---|---|---|
| 1 | OG image tối + tiếng Việt | XONG, KHÔNG còn known limitation: convert Be Vietnam Pro 400/700 woff2 → TTF (fonttools) vào `assets/og/`, nạp vào `next/og`. OG 1200x630 graphite + glow đỏ `#C40F0F`, wordmark, tagline đủ dấu "Chạm đúng đối tác, bằng những match chứng-minh-được." (focal `#F53B2E`), nhãn ENGINE · LIVE. Ảnh: `reports/tip06-shots/og-dark.png` |
| 2 | README hướng C | Viết lại toàn bộ: cấu trúc `components/dark`, scope `.dk`, bảng cặp đỏ light/dark canonical, kỷ luật kỹ thuật, deploy runbook (NEXT_PUBLIC_SITE_URL, checklist sau deploy, đề xuất hosting) |
| 3 | Trang /dev | QUYẾT: giữ light. Lý do: /dev/globe + /dev/primitives kiểm primitive light theo DESIGN_SPEC gốc (vẫn là khế ước cho token light), đã chặn robots, không phải bề mặt công khai. Ghi rõ trong README mục Theme |
| 4 | Tái xác nhận cổng trên HEAD cuối | Bảng dưới |
| 5 | Ảnh hub-dk trong reports | Đã có trong git từ `b112d40` (`hub-dk-1440.png`, `hub-dk-360.png` + bộ `next-dk-*`); bổ sung `og-dark.png` |
| 6 | Script `check` gộp | `npm run check` = next lint && check-emdash && next build. Chạy xanh |

## Bảng cổng trên HEAD bàn giao (production build)

| Cổng | Kết quả |
|---|---|
| `npm run check` (lint + em-dash + build) | PASS: 0 ESLint warning, 0 em-dash/en-dash, build sạch |
| Console production (landing + hub, gồm 3 vòng điều hướng) | TRỐNG: 0 error, 0 warning, 0 exception (đo qua CDP) |
| Lighthouse desktop `/` | Perf 99 · A11y 100 · BP 100 · SEO 100 |
| Lighthouse desktop `/hub` | Perf 99 · A11y 100 · BP 100 · SEO 100 |
| `__dkActive` 3 vòng Landing ↔ Hub | 3 → 0 → 3 đúng cả 3 vòng, PASS |
| Reduced-motion | 3 canvas tĩnh tuyệt đối (2 khung cách 1,3s giống hệt), PASS |

Ngưỡng VISION (Perf >= 90, còn lại >= 95): vượt toàn bộ.

## Decisions tự quyết (ghi log)

1. /dev giữ light (trên). 2. TTF sinh ra đặt ở `assets/og/` ngoài `public/` để không phát hành font thừa ra web; woff2 self-host giữ nguyên là nguồn. 3. `check` không gộp Lighthouse/CDP (cần server + Chrome), các cổng đó chạy theo quy trình bàn giao như report này.

## Known limitations chốt Phase 1

- Toàn bộ số liệu là DEMO seed cố định, gắn nhãn; chưa nối engine thật.
- Chưa deploy: site tĩnh 100% prerender, sẵn sàng Vercel hoặc Node host bất kỳ (runbook trong README).
- /dev là sân light nội bộ, không theo spec dark.
- MATCH STREAM sinh dữ liệu ngẫu nhiên client-side (chủ ý, để stream sống); SSR render khung rỗng nên không lệch hydrate.

## Đề xuất hosting

Vercel (khớp App Router + OG image động, zero-config, preview URL cho review); phương án B: containers Node >= 20 chạy `next start` sau CDN. Đặt `NEXT_PUBLIC_SITE_URL` trước khi build.

Commit bàn giao: "TIP-07 handover". Phase 1 sẵn sàng để Kiến trúc sư X-Ray lần cuối và ký.
