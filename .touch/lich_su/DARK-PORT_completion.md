# Completion Report · Port thiết kế tối (hướng C) vào Next.js landing

Ngày: 17/07/2026. Nguồn thiết kế: `RtR/KnowledgeBase/touch_home_dark.html` (bản demo đã qua các vòng chỉnh của Con người: đỏ đậm #C40F0F/#E8221A, nút outline, metrics giàu, pipeline scanner, CTA mê cung, gcard spotlight, footer wordmark khổng lồ). Hub GIỮ light, chưa thuộc scope này.

## Kiến trúc

- Scope CSS `.dk` + prefix `dk-` trong `app/globals.css` (~430 dòng thêm): token tối cục bộ, không đụng token light của Hub. Hai bề mặt sống chung một app.
- Copy 100% trong `lib/content.ts` (khối `dk`). Số liệu demo deterministic trong `lib/dark-data.ts` (PRNG mulberry32 seed cố định, SSR = client, không lệch hydrate).
- 9 khối = component thật trong `components/dark/`:
  - `NavDark`, `HeroDark` (+`GlobeDark`+`MatchStream`), `TapeDark`, `MetricsBand` (+`CountUp`), `PipelineDark`, `MatrixHeatmap`, `ProvenanceGraph`, `InterpChart`, `PillarsDark`/`VerticalsDark` (+`GCard`), `CTADark` (+`MeetDark`), `FooterDark`.
  - MatchCard tối: tái dùng `shared/MatchCard` + override `.dk .mcard`.
  - 9 component light cũ (`components/landing/*`) đã xoá (git giữ lịch sử).
- `MobileNav` thêm prop `dark` + `links` (panel portal ra body nên có skin `mnav-dark` toàn cục).

## Kỷ luật canvas (như Globe light)

3 canvas động: globe (`globe-dark.ts`), pipeline 7 cổng (`pipeline-core.ts`), mê cung CTA (`meet-core.ts`). Mỗi core: alive flag, `cancelAnimationFrame`, `ResizeObserver.disconnect`, gỡ listener, và bộ đếm `window.__dkActive`.

- Điều hướng client-side Landing ↔ Hub 3 vòng qua ViewSwitch: `__dkActive` = 3 trên landing, = 0 trên hub, cả 6 lượt đúng. Không rò.
- `prefers-reduced-motion`: cả 3 canvas vẽ khung tĩnh, không chạy rAF (đo toDataURL 2 thời điểm cách 1,3s: giống hệt, PASS); MatchStream không chạy interval; tape/dist/pulse tắt theo khối reduce toàn cục; `__dkActive` vẫn đếm đúng 3.

## Số đo

| Kiểm | Kết quả |
|---|---|
| Lighthouse desktop `/` | Perf 99 · A11y 100 · BP 100 · SEO 100 |
| `npm run check:emdash` | 0 em-dash, 0 en-dash |
| Build | sạch, không warning |
| 360px | scrollWidth = clientWidth = 360, không tràn |
| Cleanup 3 vòng điều hướng | PASS (trên) |

Chỉnh tương phản khi audit cắn: `--dk-tx3` #6E6E7A → #82828E (nhãn mono nhỏ ~5:1); tag MatchCard + chữ vouch trên panel tối chuyển trắng (đỏ giữ ở score bar/mlink/badge/em).

Ảnh: `reports/tip06-shots/next-dk-{hero,pipeline,cta,360}.png`.

## Điểm chờ Kiến trúc sư quyết

1. Hub vẫn light: cần TIP riêng nếu muốn hub cùng hệ tối (đề xuất: giữ token `.dk`, dựng `hub-dark` theo cùng khuôn).
2. OG image (`app/opengraph-image.tsx`) vẫn nền sáng brand cũ; nên đổi sang bản tối + đỏ đậm khi chốt hướng C.
3. Bản đồ đỏ landing tối chưa được audit chính thức kiểu "5 chỗ" như bản light; cần X-Ray lập bản đồ mới khi ra DESIGN_SPEC tối.
4. Cặp đỏ hai bề mặt: light #E4341E vs dark #C40F0F/#E8221A, cần chốt trong spec.
