# TIP-06 Completion Report · Polish, a11y, SEO, responsive, mobile

Ngày: 17/07/2026. Build production Next 15, kiểm trên server `next start` localhost.

## Files

Mới:
- `components/shared/MobileNav.tsx` (119 dòng): hamburger + panel dialog, focus trap, Esc, trả focus, khoá cuộn body. Panel portal ra `document.body` vì `.nav` có `backdrop-filter` nên là containing block của `position: fixed` (bug bắt được bằng ảnh chụp, đã sửa và kiểm lại).
- `app/opengraph-image.tsx` (58 dòng): OG 1200x630 sinh lúc build, chữ EN (font mặc định next/og không đủ dấu tiếng Việt), token màu đúng brand.
- `app/robots.ts` (16 dòng): allow /, disallow `/dev/`, trỏ sitemap.
- `app/sitemap.ts` (12 dòng): `/` và `/hub`.
- `app/not-found.tsx` (32 dòng): 404 đúng thương hiệu, giọng fail-loud ("thà nói không có còn hơn trả về một trang rác"), hai lối ra. Copy trong `lib/content.ts` (`notFound`).

Sửa:
- `app/layout.tsx`: metadata đầy đủ (OG, twitter card, siteName, locale vi_VN) + skip link `#main`.
- `app/page.tsx`, `app/hub/page.tsx`: canonical từng trang, `id="main"`; hub khai lại `openGraph.images` vì khối openGraph riêng thay thế khối gốc, ảnh file-convention không tự lan xuống.
- `app/globals.css`: ~150 dòng thêm/sửa (chi tiết dưới).
- `components/landing/Nav.tsx`: gắn MobileNav, CTA nav có class để ẩn dưới 600px.
- `components/hub/HubTopBar.tsx`: dom-switch, search thành `<button>` thật (focus được).
- `components/shared/MatchCard.tsx`: bỏ inline `textAlign` sang class `.mside-r` để media query override được.
- `components/landing/{HowItWorks,WhyTrust,Footer}.tsx`, `components/hub/HubApp.tsx`: sửa bậc heading (h4/h5 → h3, panel h3 → h2) cho audit `heading-order`.
- `lib/content.ts`: thêm `ui.skipToContent/menuOpen/menuClose/menuLabel`, khối `notFound`.
- `lib/demo-data.ts`: nhất quán PCB Hưng Gia (dưới).
- `lib/tokens.ts`, `tailwind.config.ts`: đồng bộ token mới.

## Responsive (ảnh trong `reports/tip06-shots/`)

| Breakpoint | Landing | Hub | Ghi chú |
|---|---|---|---|
| 360 | `landing-360.png`, `mnav-closed/open-360.png` | `hub-360.png` | scrollWidth = clientWidth = 360, không tràn ngang (đo bằng CDP) |
| 768 | `landing-768.png` | `hub-768.png` | flow 2 cột, hub 1 cột, rail ngang |
| 1024 | `landing-1024-fold.png` (+full) | `hub-1024.png` | |
| 1440 | `landing-1440-fold.png` (+full) | `hub-1440.png` | |
| 1600 | `landing-1600-fold.png` (+full) | `hub-1600.png` | maxw 1600 giữ đúng |
| 404 | `404-1440.png`, `404-360.png` | | |

Lưu ý: các file `landing-*.png` full-page ở desktop có hero bị kéo cao, đó là artifact của chụp full-page với `min-height: 92vh` (viewport bị đặt bằng cả chiều cao trang), không phải bug layout; bản `-fold` là hình trung thực.

- MobileNav: mở bằng nút (aria-expanded, aria-controls), focus dồn vào panel, Tab quay vòng, Esc đóng, focus trả về nút mở, body khoá cuộn. 9/9 PASS bằng CDP thật (`mnav-open-360.png`).
- Hub mobile: rail KHÔNG còn `display: none`, thu thành thanh ngang cuộn được (pill, mục active nền ink), vẫn focus được từng mục; MatchDetail xếp dưới MatchList; KPI 2 cột dưới 760; search ẩn dưới 860, dom-switch ẩn dưới 560 (cả hai là control inert của prototype); topbar gọn ở 360.
- MatchCard dưới 560: hai bên cầu/cung xếp dọc, mũi tên ⇄ xoay dọc ở giữa, cột phải bỏ căn phải.

## Lighthouse (desktop preset, production build)

| Trang | Perf | A11y | BP | SEO |
|---|---|---|---|---|
| `/` | 100 | 100 | 100 | 100 |
| `/hub` | 100 | 100 | 100 | 100 |

(JSON: /tmp/lh-landing2.json, /tmp/lh-hub.json lúc chạy. Trước khi sửa heading-order, landing là 99/98/100/100.)

## A11y

- Tương phản AA: `--ink-3` #8A8A92 → #696971 (4.6:1 trên paper-4/accent-soft, 5.3:1 trên trắng); thêm `--dot-text` #D42B16 cho CHỮ đỏ nhỏ (sec-tag, KPI warn, mlink, bullet →, ◆ chú thích globe) đạt 4.9:1. Hình tô màu (chấm brand, node globe, dot live pill) giữ nguyên `--dot` #E4341E; 5 chỗ đỏ trên bản đồ vẫn đỏ, không thêm chỗ mới.
- Skip link "Bỏ qua tới nội dung chính" là Tab đầu tiên, trỏ `#main` cả hai trang (kiểm bằng CDP: PASS).
- Heading đúng bậc: h1 → h2 → h3, không nhảy cấp (audit heading-order pass).
- dom-switch, hub-search từ div thành button: đi hết Hub bằng bàn phím được (rail vốn là button từ TIP-05).

## Reduced-motion (kiểm bằng CDP emulate `prefers-reduced-motion: reduce`)

- Globe đứng tĩnh: 2 khung canvas cách 1.2s giống hệt nhau (so toDataURL). PASS.
- Toàn bộ animation/transition về 0.01ms bằng khối global trong globals.css (computed style xác nhận 1e-05s). Không còn chuyển động nào khác.
- `__globeActive` = 1 khi mount ở chế độ reduced. PASS.

## Cleanup Globe (điều hướng client-side Landing ↔ Hub)

3 vòng qua lại bằng click ViewSwitch thật: `__globeActive` = 1 trên landing, = 0 trên hub, cả 6 lượt PASS, không rò rỉ. Không chạm vào `Globe.tsx`/`globe-core.ts`.

## SEO

- OG + twitter card đầy đủ hai trang (curl xác nhận og:title/description/url/image, twitter:card summary_large_image), canonical từng trang, locale vi_VN.
- `opengraph-image` 1200x630 render đúng (ảnh `og.png` trong shots).
- `robots.txt` chặn `/dev/`, `sitemap.xml` 2 URL, đều 200.
- 404 trả đúng status 404 với trang thương hiệu.

## Nhất quán demo data (mục tuỳ chọn, đã làm)

PCB Hưng Gia: registry tier C nhưng MATCH-0035 dẫn nguồn cung TIER A (chứng nhận RoHS) → đổi registry thành tier A cho khớp chuỗi provenance; thêm dòng mới "Cao su Kỹ thuật Việt Hưng" tier C/CLAIM để registry vẫn có ví dụ claim-chưa-kiểm.

## Checklist STANDARDS

- [x] Copy 100% trong `lib/content.ts` (menu, skip link, 404 đều lấy từ đó).
- [x] `npm run check:emdash` = 0 (em-dash và en-dash), chạy sau commit cuối.
- [x] Kỷ luật đỏ: không thêm chỗ đỏ mới; chữ đỏ nhỏ dùng `--dot-text` cùng họ, tối hơn một bậc vì AA (khai báo rõ, đợi Kiến trúc sư duyệt).
- [x] Không phá cleanup Globe (không sửa 2 file globe).
- [x] Không section/tính năng mới, không backend.
- [x] Build production sạch, không warning ESLint.

## Điểm cần Kiến trúc sư để mắt

1. `--ink-3` và `--dot-text` lệch nhẹ so với reference hex để đạt AA; nhìn bằng mắt gần như không phân biệt nhưng là quyết định thiết kế, có thể revert nếu ưu tiên fidelity hơn AA.
2. OG image dùng chữ EN (định vị "Provenance-backed B2B matching") vì font mặc định next/og thiếu dấu; nếu muốn tiếng Việt cần nhúng font TTF riêng cho ImageResponse.
3. Hub OG phải khai lại `images` thủ công (hành vi merge metadata của Next); nếu sau này thêm trang mới có `openGraph` riêng, nhớ khai lại images.
