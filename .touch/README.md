# .touch

Website `.touch`, provenance-backed B2B matching. Next.js 15 App Router, TypeScript, Tailwind, font self-host. Từ 17/07/2026 site theo **hướng C: control-room tối đen đỏ** (quyết định Con người), spec tại `KnowledgeBase/touch_hub/design/DESIGN_SPEC_DARK.md`. Repo này là SOT triển khai; file demo `touch_home_dark.html` chỉ là artefact thiết kế. Đây là website prototype, tách khỏi engine PoC cào-lọc-match (backend riêng). Mọi số liệu trên giao diện là DEMO minh hoạ, gắn nhãn DEMO DATA.

## Chạy

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # build production
npm run start          # chạy bản build
npm run check          # cổng gộp: lint + em-dash + build
npm run check:emdash   # cổng cứng: 0 em-dash và en-dash toàn source
```

## Cấu trúc

```
app/            layout (metadata, skip link), page (landing TỐI), hub/ (hub TỐI),
                not-found, opengraph-image (OG tối, font Việt), robots, sitemap
components/
  dark/         9 khối bề mặt tối: NavDark, HeroDark (+GlobeDark, MatchStream),
                TapeDark, MetricsBand (+CountUp), PipelineDark (+pipeline-core),
                MatrixHeatmap, ProvenanceGraph, InterpChart, PillarsDark,
                VerticalsDark (+GCard), CTADark (+MeetDark, meet-core), FooterDark
  hub/          HubTopBar, HubRail, KpiGrid, HubApp, MatchList, MatchDetail, RegistryTable
  shared/       Container, Button, MatchCard, TierBadge, ViewSwitch, MobileNav...
  globe/        globe light (chỉ còn /dev/globe dùng)
lib/            tokens (light), content.ts (TOÀN BỘ copy, khối `dk` cho bề mặt tối),
                demo-data.ts (hub), dark-data.ts (số liệu tối, PRNG seed cố định)
assets/og/      TTF Be Vietnam Pro (convert từ woff2) cho next/og
public/fonts/   woff2 self-host (Be Vietnam Pro, Fraunces italic, IBM Plex Mono)
scripts/        check-emdash.mjs
reports/        Completion Report từng TIP + ảnh kiểm
```

## Theme

- Bề mặt tối scope trong class `.dk` (token `--dk-*` trong `app/globals.css`), không đụng token light. Trang `/dev/*` là sân chơi nội bộ GIỮ LIGHT (kiểm primitive light theo DESIGN_SPEC gốc), đã chặn robots.
- Cặp đỏ canonical (không dùng chéo bề mặt):

| Vai trò | Light | Dark |
|---|---|---|
| Đỏ nền / fill | `#E4341E` | `#C40F0F` |
| Đỏ sáng / glow | (không dùng) | `#E8221A`, đỉnh `#FF5A40` |
| Đỏ chữ nhỏ AA | `#D42B16` | `#F53B2E` |

- Bản đồ đỏ dark là danh sách đóng (DESIGN_SPEC_DARK mục 3); chỗ đỏ mới phải qua Kiến trúc sư duyệt.

## Kỷ luật kỹ thuật

- Copy 100% trong `lib/content.ts`. Cấm em-dash U+2014 và en-dash U+2013 (cổng `check:emdash`).
- Canvas động (globe, pipeline, mê cung CTA): cleanup đầy đủ, đếm `window.__dkActive` phải về 0 khi rời trang; `prefers-reduced-motion` vẽ khung tĩnh.
- Số liệu demo deterministic (seed cố định) để SSR không lệch hydrate.
- Ngưỡng Lighthouse desktop: Perf >= 90, còn lại >= 95 (hiện trạng 99-100).

## Deploy runbook

1. Đặt `NEXT_PUBLIC_SITE_URL=https://<domain>` (metadata, sitemap, robots đọc biến này; mặc định localhost).
2. `npm run check` phải xanh trên HEAD định deploy.
3. Hosting đề xuất: Vercel (zero-config với App Router, OG image chạy sẵn) hoặc bất kỳ Node host nào (`npm run build && npm run start`, Node >= 20). Site tĩnh hoàn toàn (mọi route prerender), có thể đứng sau CDN.
4. Sau deploy kiểm: `/robots.txt`, `/sitemap.xml`, `/opengraph-image` (OG tối tiếng Việt), một URL sai ra 404 thương hiệu.
