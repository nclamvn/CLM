# Completion Report, TIP-02 Primitive dùng chung

Thợ: Claude Code. Ngày: 2026-07-14. Trạng thái: HOÀN THÀNH, chờ X-Ray. Chưa commit (để nguyên diff cho Chủ thầu).

## Phạm vi đã làm
Bộ primitive tái dùng port đúng token và nhịp reference, cộng `lib/content.ts` làm nguồn copy duy nhất. Có trang demo nội bộ chỉ chạy ở dev.

## Files
Mới:
- `lib/content.ts`: nguồn copy + type (Tier, ChainRow, MatchSide, MatchCardData). Chứa tagline chuẩn có "match", live pill, nhãn ViewSwitch, `demoMatch` (đơn vị giá trị).
- `components/shared/Button.tsx`: primary/ghost, arrow, disabled; render Link khi có href, button khi không.
- `components/shared/SectionTag.tsx`: nhãn đỏ mono in hoa (`.sec-tag mono`).
- `components/shared/LivePill.tsx`: pill mono, chấm đỏ pulse, dot aria-hidden.
- `components/shared/TierBadge.tsx`: tier A/B/C.
- `components/shared/ViewSwitch.tsx`: pill Landing/Hub, hai Link route thật, `fixed` tuỳ chọn, aria-current.
- `components/shared/MatchCard.tsx`: đơn vị giá trị đầy đủ, props có type, `flush` cho Hub.
- `app/dev/primitives/page.tsx`: demo nội bộ, `notFound()` ở production.

Sửa:
- `app/globals.css`: thêm `@layer components` port đúng .btn, .sec-tag, .live-pill, .tier, .viewswitch, và họ .mcard; keyframes `lpulse`; reduced-motion tắt pulse và transition. Không đụng token cũ.
- `app/page.tsx`: trỏ tagline và wordmark về `lib/content.ts` (điều chỉnh 1 của Chủ thầu, tránh tái diễn lỗi rơi chữ).

~410 dòng source TIP-02.

## Primitive và trạng thái (kiểm bằng trình duyệt thật, ảnh đính kèm hội thoại)
- Button: primary, primary+arrow, ghost, disabled (mờ, không hover). Hover và focus-visible từ CSS.
- SectionTag: THE PIPELINE, THE ATOMIC UNIT (đỏ mono hoa).
- LivePill: chấm đỏ pulse + text mono, hai biến thể.
- TierBadge: TIER A đặc, TIER B viền, CLAIM (C) accent-soft.
- ViewSwitch: hai trạng thái active (landing, hub) đúng nền trắng cho tab bật.
- MatchCard: top (tag + score 0.91 + bar), hai bên Cầu/Cung với ⇄ đỏ, provenance chain (TIER A/B, dòng claim in nghiêng), bảo chứng ◆, ghi chú cổng với chấm ok xanh. Bản flush bỏ vien và bóng.

## Cổng
- em-dash: `npm run check:emdash` = 0 (gồm content.ts và toàn source).
- build: PASS, 0 cảnh báo. Route `/dev/primitives` 3.45 kB.
- console: trống, 0 lỗi, 0 cảnh báo, không hydration warning.
- Kỷ luật đỏ: audit `var(--dot)` toàn CSS chỉ 4 chỗ, đúng bản đồ đỏ (chấm thương hiệu, sec-tag, chấm live pill, mlink ⇄). Tier badge dùng ink/accent, không đỏ. Không thêm đỏ ngoài danh sách.

## Quyết định tự quyết (ghi lại)
1. Styling primitive bằng cách port CSS component của reference vào `@layer components` trong globals, React render class tương ứng. Cho pixel-parity trực tiếp và tái dùng token, đúng điều chỉnh 2 của Chủ thầu (không định nghĩa lại token, .brand, .accentdot, .mono). Không dùng CSS module để tránh phân mảnh khỏi SOT.
2. `ChainRow` mô hình hoá tier badge inline bằng field `tier` và `tail` thay vì nhét JSX vào content.ts (giữ content.ts thuần dữ liệu, dễ soát em-dash và thuật ngữ). MatchCard tự ghép TierBadge.
3. Trang demo đặt ở `app/dev/primitives`, tự 404 ở production (kiểm: bản build không emit HTML cho route này). Giữ site enterprise sạch mà vẫn có nơi soi primitive ở dev.
4. Thêm trạng thái disabled cho Button (reference không có) theo STANDARDS mục 2 "mọi trạng thái được thiết kế".
5. Giữ en-dash U+2013 trong "supply–demand graph" của live pill vì đó là bản SOT và là dấu gạch nối phạm vi hợp lệ, không phải em-dash U+2014.

## Chưa làm (đúng non-goals TIP-02)
Chưa lắp primitive vào trang thật (Landing TIP-04, Hub TIP-05). Globe là TIP-03. ViewSwitch trỏ `/hub` chưa tồn tại tới TIP-05.

## Đề xuất
Xin X-Ray. Sau khi đạt, tôi tạo commit mốc "TIP-02 primitives" rồi chờ mở TIP-03 (Globe) hoặc TIP-05 (Hub) theo TASK_GRAPH.
