# Completion Report, TIP-05 Hub prototype

Thợ: Claude Code. Ngày: 2026-07-14. Trạng thái: HOÀN THÀNH, chờ X-Ray. Chưa commit.

## Phạm vi đã làm
Route `/hub` đầy đủ, bấm được: HubTopBar, HubRail, KpiGrid, MatchList (bấm đổi MatchDetail), RegistryTable, MatchDetail. Demo data có type, tên hư cấu, cờ DEMO, nhãn DEMO DATA. Chuyển Landing và Hub bằng ViewSwitch và bằng route.

## Files
Mới (components/hub/ + app/hub/ + lib, 374 dòng): HubTopBar, HubRail, KpiGrid, MatchList (client), RegistryTable, MatchDetail, HubApp (client, giữ state chọn), app/hub/page.tsx, lib/demo-data.ts.
Sửa:
- `lib/content.ts`: thêm object `hub` chrome (nhãn giao diện). Data ở demo-data.ts.
- `components/shared/MatchCard.tsx`: nhận optional `id` (dòng mono dưới tag) cho MatchDetail.
- `app/globals.css`: thêm CSS Hub port đúng reference (hub-top, rail, kpis, panel, qrow, badge, reg-table, note) + media 960/760. Rail và qrow là button focusable (a11y). Thêm `.mcard-top .id`.
- `app/layout.tsx`: thêm `data-scroll-behavior="smooth"` cho html theo khuyến nghị Next.js.

## Đối chiếu reference (kiểm bằng trình duyệt thật, 1600 và full window)
- HubTopBar: wordmark, chuyển ngành, search, DEMO DATA, ve trang chu, avatar.
- Rail: 3 nhóm, Bảng điều khiển active.
- KpiGrid: 4 KPI, chỉ số cảnh báo "Match bị cổng chặn 8" màu **đỏ** (warn).
- MatchList: 4 match, score, tên rút gọn, năng lực, badge VOUCHED / READY.
- RegistryTable: 3 dòng cung với tier A / B / CLAIM.
- MatchDetail: MatchCard flush đầy đủ, có id domain, provenance chain, bảo chứng, cổng.
- Note DEMO minh hoạ.

## Tương tác (kiểm bằng bấm thật)
- Bấm match 0.83 (Điện tử Tân Bình ⇄ PCB Hưng Gia): hàng đó active, MatchDetail đổi sang MATCH-0035, provenance riêng (RoHS + SMT, không phải ISO/CNC), score bar ngắn lại, vouch đổi. Selection state đúng.
- ViewSwitch: bấm Landing sang `/` (hiện .hero), bấm Hub sang `/hub`. Route thật, chia sẻ link được.

## Cổng
- em-dash/en-dash: 0.
- build: PASS, 0 cảnh báo. Route `/hub` 2.78 kB, prerender tĩnh.
- console: kiểm trên BẢN PRODUCTION (`next start`), gồm chuyển route client Hub và Landing: **trống, 0 lỗi, 0 cảnh báo**.
- Kỷ luật đỏ: đỏ duy nhất ở Hub là KPI warn (`.kpi .t.warn`, đúng bản đồ). Badge VOUCHED dùng accent-soft, không đỏ. mlink ⇄ trong MatchDetail là shared, trên bản đồ. Không đỏ lạc.

## Quyết định tự quyết (ghi lại)
1. **Provenance mỗi match tự mạch lạc** thay vì dùng chung một bộ nguồn cố định như mock rút gọn của reference. Ví dụ match PCB có nguồn RoHS + SMT, match nhôm có chứng nhận thành phần hợp kim. Lý do: khách enterprise soi tính nhất quán, nguồn ISO/CNC gắn cho match PCB sẽ lộ là mock cẩu thả. Đây là nâng cấp so với reference, phục vụ VISION "mock tối đa". Chạm nhẹ pixel-parity nhưng đúng tinh thần enterprise.
2. MatchList dùng `<ul role=list><li><button aria-pressed>`; rail dùng button. Interactive element là button thật (keyboard + focus-visible), đúng STANDARDS a11y. Các mục rail ngoài Dashboard và nút "Chạy matching mới" là **inert** trong Phase 1 (không backend), giữ focus được.
3. Cảnh báo dev "auto-scroll do nav sticky" chỉ có ở dev build; đã xác minh bản production sạch. Cảnh báo scroll-behavior đã vá bằng `data-scroll-behavior`.
4. MatchDetail tái dùng MatchCard (flush) đã có, thêm field `id` optional thay vì viết card riêng cho Hub.

## Chưa làm (đúng non-goals)
Không backend, auth, dữ liệu thật, matching engine. Search và rail nav là khung prototype. Mobile sâu Hub (rail thu gọn, bảng cuộn ngang) để TIP-06.

## Đề xuất
Xin X-Ray: mở `/hub`, bấm qua lại các match xem MatchDetail đổi, kiểm nhãn DEMO, KPI warn đỏ, và chuyển Landing/Hub. Sau khi đạt, commit mốc "TIP-05 hub" rồi mở TIP-06 (Polish, a11y, SEO, responsive, mobile) vì nó cần cả TIP-04 và TIP-05.
