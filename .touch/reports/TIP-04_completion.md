# Completion Report, TIP-04 Trang Landing

Thợ: Claude Code. Ngày: 2026-07-14. Trạng thái: HOÀN THÀNH, chờ X-Ray. Chưa commit.

## Phạm vi đã làm
Dựng đủ 9 section Landing khớp reference, copy lấy từ lib/content.ts, tích hợp Globe vào Hero, ViewSwitch nổi. Không mảng nào dở dang.

## Files
Mới (components/landing/, 354 dòng): Nav, Hero, TrustStrip, HowItWorks, ValueUnit, WhyTrust, VerticalBand, CTA, Footer.
Sửa:
- `app/page.tsx`: compose Landing (Nav, main chứa Hero tới CTA, Footer, ViewSwitch fixed active landing). Landmark ngữ nghĩa nav/header/main/footer.
- `lib/content.ts`: thêm object `landing` chứa toàn bộ copy (nav, hero, strip, how, value, why, vertical, cta, footer). Nguồn duy nhất.
- `app/globals.css`: thêm CSS Landing port đúng reference (nav + gạch chân đỏ, hero, globe-wrap, strip, sec, flow, preview, diffs, vband, cta, foot) và media 920/560. Không đụng token, không định nghĩa lại class TIP-02/03.
- `components/shared/Button.tsx`: href nội bộ (bắt đầu `/`) dùng Link, còn hash/mailto/http dùng `<a>`. Cần cho CTA mailto và anchor.

## Đối chiếu reference (kiểm bằng trình duyệt thật, viewport 1600)
- Nav: sticky blur, wordmark, 4 tab gạch chân đỏ hover trượt, "Mở Hub →", CTA "Yêu cầu demo".
- Hero: grid 2 cột, live pill "supply-demand" (hyphen, không en-dash), h1 weight 300 tracking âm với focal Fraunces italic đỏ "chứng-minh-được" (có "match"), sub, hai CTA, ba dòng cam kết tick xanh, Globe dot-map chạy match đỏ, legend Cầu/Cung/Khớp.
- TrustStrip: 4 chỉ số (Provenance 100%, Fail-loud 0, Trust layer 1:1, Audit by design).
- HowItWorks: 5 bước dây chuyền, nhãn tầng L1/L2/L3/Trust.
- ValueUnit: copy trái với pv-list mũi tên đỏ và chữ "claim" in nghiêng, MatchCard đầy đủ bên phải.
- WhyTrust: 3 cột cơ chế, mono tag.
- VerticalBand: nền tối, ngành dọc italic, 3 vpill.
- CTA: focal đỏ, hai CTA.
- Footer: wordmark + blurb, 3 cột link, hover đỏ.
- ViewSwitch nổi active landing.

## Kỷ luật đỏ
Không red hardcode trong component Landing. Mọi đỏ từ class shared, đều trên bản đồ đỏ: gạch chân nav hover, sec-tag, chấm live pill, focal hero + CTA, mũi tên → value, mlink ⇄, hover link footer, ◆ + match trong globe. Không đỏ lạc.

## Cổng
- em-dash/en-dash: 0.
- build: PASS, 0 cảnh báo. Route `/` 2.93 kB, prerender tĩnh.
- console: trống qua nhiều lần load, 0 lỗi, 0 cảnh báo, không hydration warning.

## Quyết định tự quyết (ghi lại)
1. Dùng Container (đã có) làm `.wrap` cho mọi section, className thêm layout (nav-in, hero-grid, strip-in, pv-grid, foot-in).
2. Chữ "claim" in nghiêng ở pv-list bằng helper `withClaimEmphasis` để giữ content.ts thuần chuỗi, không nhét JSX vào data.
3. Link Hub (nav, hero ghost, value cta, cta ghost, footer) trỏ route `/hub`. Route này chưa tồn tại tới TIP-05, tạm 404 khi bấm giữa chừng build. Đây là hành vi mong đợi của lộ trình, không phải lỗi. TIP-05 sẽ làm route sáng.
4. Globe canvas trong globe-wrap có pointer-events none như reference; parallax vẫn chạy vì nghe mousemove ở window.
5. Nav mobile: reference ẩn nav-links ở <=920px (chưa có menu). TIP-06 sẽ dựng MobileNav thật. TIP-04 chỉ bảo đảm desktop 1440/1600 không vỡ (đã kiểm 1600).

## Chưa làm (đúng non-goals)
Mobile sâu và MobileNav thật để TIP-06. Không backend. `/hub` là TIP-05.

## Đề xuất
Xin X-Ray ở 1440 và 1600, đối chiếu từng section với reference, kiểm hover nav và CTA. Sau khi đạt, tôi tạo commit mốc "TIP-04 landing" rồi mở TIP-05 (Hub prototype).
