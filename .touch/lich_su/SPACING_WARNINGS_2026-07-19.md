# Phan loai 39 spacing warnings (token guard, warning-only)

Nguon: `node scripts/check-tokens.mjs --warnings`. Guard hai tang: mau/font/shadow/radius = hard-fail (0), spacing off-scale = warning (39). Base scale: 0,1,2,4,8,12,16,20,24,32,40,48,64,80 (buoc 4px). Cac gia tri duoi la off-scale vi mock dashboard mat do cao, dung sub-grid min hon.

## Tong hop theo gia tri

| Gia tri | So lan | Nhom |
|--------|-------|------|
| 14px | ~13 | A. Tokenizable |
| 6px | ~8 | A. Tokenizable |
| 10px | ~6 | A. Tokenizable |
| 18px | 2 | A. Tokenizable |
| 22/27/28/30px | 4 (1 dong) | B. Component geometry |
| 9px | 2 | B/E |
| 5px | 2 | E. Micro-optical |
| 3px | 1 | E. Micro-optical |

## A. Tokenizable — sub-scale lap lai (nen thanh token)

6px, 10px, 14px, 18px lap lai xuyen suot (gap, margin-top, padding compact). Day la half-step cua luoi 4px (12<14<16, 8<10<12). Dung nghia la token.
- De xuat: them `--space-1_5:6px`, `--space-2_5:10px`, `--space-3_5:14px`, `--space-4_5:18px` vao touch-theme.css va thay the. Gia tri GIU NGUYEN -> pixel-identical, 0 regression. Ha ~29/39 warning.
- Vi tri: 68,90,94,111,139,150,160,163,191,199,202,211,216,217,234,244,245,253,368 ...

## B. Component geometry — frame inset rieng (shorthand, optical)

Padding noi tai tung component, chinh de khop cot noi dung voi mock; khong phai spacing toan cuc.
- `dash-main` L105 `22px 27px 28px 30px` (le bat doi xung, canh cot noi dung).
- `kpi-card` L139 `18px 20px`; `comp-card` L164 `12px 14px`; `chip` L175 `0 9px`; `tag` L195 `6px 4px`.
- Xu ly: giu nguyen hoac tokenize theo tung component o vong sau. KHONG ep vao spacing scale toan cuc.

## C. Responsive breakpoint — trong media query

Gia tri cuc bo theo breakpoint, guard dung la chi warning.
- L244 `padding 20px 14px`, L245 `gap 18px`, L348 `row-gap 10px`, L359 `gap 5px`, L368 `padding 14px` (mobile main).

## D. SVG / element geometry

- L250 `.vring margin 12px auto 6px` — canh giua SVG 78px, 6px khoang cach optical toi nhan.

## E. Micro-optical exception (<6px, nhan chat)

Sub-grid co chu dich cho micro-UI; tokenize se qua hinh thuc.
- 3px (L201 amb-tag), 5px (L168 check gap, L359 mobile item), 9px (L168 margin, L175 chip inset).

## Ket luan

- 0 hard violation. 39 warning deu la spacing, khong co mau/font/shadow/radius raw.
- Guard giu spacing o muc warning dung theo thiet ke hai tang: khong chan cung geometry/breakpoint/optical.

## KET QUA (da thuc hien) — 39 -> 9

Tokenize nhom A da chay: `node scripts/tokenize-spacing.mjs styles/dashboard.css` thay 30 gia tri spacing (6/10/14/18px) sang `--space-1_5 / 2_5 / 3_5 / 4_5` (them vao touch-theme.css). Gia tri GIU NGUYEN -> dashboard render identical (kiem bang mat, layout khong doi; build `npm run check` exit 0).

9 warning con lai deu la ngoai le co chu dich, KHONG tokenize:
- L105 `22px 27px 28px 30px` — frame inset `dash-main` (nhom B).
- L168 `5px 9px`, L175 `9px`, L201 `3px`, L359 `5px` — micro-optical <10px cho nhan/chip chat (nhom E), va breakpoint (L359, nhom C).

Guard hien: **0 errors, 9 warnings**.
