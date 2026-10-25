# Completion Report, TIP-01 Scaffold nền

Thợ: Claude Code. Ngày: 2026-07-14. Trạng thái: HOÀN THÀNH, chờ X-Ray.

## Phạm vi đã làm
Khung Next.js App Router + TypeScript + Tailwind chạy được, token và font khớp DESIGN_SPEC, trang nền hiển thị wordmark `.touch`. Chưa dựng section, Globe, hay Hub (đúng non-goals).

## Files (25 file, ~408 dòng source)
- `package.json`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `.eslintrc.json`, `.gitignore`
- `tailwind.config.ts`: map token từ `lib/tokens.ts` sang theme (màu, font, radius, maxWidth 1600px).
- `lib/tokens.ts`: token nguồn dùng lại trong TS.
- `app/globals.css`: biến CSS `:root` khớp 1:1 reference, base + focus-visible.
- `app/fonts.ts`: `next/font/local` cho 3 họ font, 9 woff2.
- `app/layout.tsx`: html lang="vi", gắn biến font, metadata title/description/robots.
- `app/page.tsx`: trang nền, wordmark + tagline tiếng Việt + focal serif italic đỏ + nhãn mono.
- `app/icon.svg`: favicon thương hiệu (chấm đỏ), giữ console sạch.
- `components/shared/Container.tsx`: khung nội dung chuẩn.
- `scripts/check-emdash.mjs`: cổng cứng em-dash (định nghĩa ký tự bằng code point).
- `public/fonts/*.woff2`: 9 file self-host.
- `README.md`, `reports/TIP-01_completion.md`.

## Kết quả cổng
- `next build`: PASS, 0 cảnh báo, 0 lỗi. Prerender tĩnh 5 trang. First Load JS 102 kB.
- `next dev`: chạy sạch. Render kiểm bằng trình duyệt thật.
- Cổng em-dash: `npm run check:emdash` = OK, 0 em-dash toàn source (gồm README, script).
- Console: TRỐNG, 0 lỗi, 0 cảnh báo, không 404 (favicon phục vụ qua /icon.svg).
- Font tiếng Việt có dấu: chứng minh bằng fontTools, cả 9 woff2 phủ đủ glyph Việt (ạ ứ đ ề ợ ẫ) và middot. Render thị giác xác nhận: "Chạm đúng đối tác, bằng những chứng-minh-được".
- Wordmark: chấm đỏ CSS (không phải ký tự) căn baseline + "touch", đúng font token và màu `--dot`.

## Quyết định tự quyết (ngoài 6 lằn escalation, ghi lại)
1. Nâng `next` 15.1.6 sang 15.5.20: bản 15.1.6 dính CVE-2025-66478 (npm cảnh báo lúc cài). Vá cùng dòng 15, không nhảy major 16, không đổi kiến trúc BLUEPRINT. Chạm nhẹ lằn 6 (bảo mật) nhưng là bump patch tầm thường nên tự quyết, báo tại đây.
2. postcss trực tiếp nâng lên 8.5.19 (vá GHSA-qx2v-qp2m-jg93). Còn một bản postcss 8.4.31 Next bundle lồng bên trong: advisory moderate, chỉ chạy build-time trên CSS tin cậy, không phơi runtime. Không `audit fix --force` vì lệnh đó tụt Next về 9.x. Để nguyên, theo dõi ở TIP-07.
3. Font self-host: dùng file woff2 gộp subset latin + latin-ext + vietnamese (một file mỗi weight) thay vì file latin-only, để một `@font-face` phủ đủ dấu tiếng Việt mà `next/font/local` không cần unicode-range thủ công. Nguồn woff2 từ Google qua google-webfonts-helper.
4. Thêm `app/icon.svg` và `scripts/check-emdash.mjs` sớm ở TIP-01: favicon giữ console sạch ngay, script là cổng tự kiểm mỗi TIP. Cả hai nằm trong tinh thần scaffold, không lấn scope TIP sau.

## Chưa làm (đúng non-goals TIP-01)
Section Landing, Globe, Hub, mobile sâu, OG image, 404 thương hiệu, sitemap/robots.txt file. Thuộc TIP-04 tới TIP-07.

## Đề xuất mở TIP-02
Scaffold sẵn sàng cắm primitive. Xin X-Ray rồi mở TIP-02 (Container đã có, tiếp Button, SectionTag, LivePill, TierBadge, MatchCard, ViewSwitch + `lib/content.ts`).
