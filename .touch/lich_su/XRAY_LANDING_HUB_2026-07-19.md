# X-Ray: Landing + Hub - hien trang & kien truc chuc nang mong muon

Ngay: 2026-07-19. Pham vi: `app/page.tsx` (landing) va `app/hub/page.tsx` (hub) + component/data lien quan.

> Ghi chu trung thuc: hai trang nay KHONG duoc tao trong phien lam viec nay. Chung co tu commit truoc (`ae308fb` port control-room vao landing, `b112d40` hub tone den-do). Bao cao duoi day x-ray tu CODE + RENDER thuc te tren dia, khong dung tri nho.

---

## PHAN 1 - LANDING (`/`)

### Muc dich
Trang marketing / thought-leadership tone "control-room" (huong C, class goc `.dk`). Ban nang luc engine: pipeline, fail-loud gate, provenance, matching dong.

### Cau truc (11 khoi, thu tu render)
1. `NavDark` - nav + wordmark + 4 link + badge ENGINE-LIVE + CTA
2. `HeroDark` - copy trai + stage phai (GlobeDark canvas + MatchStream ticker)
3. `MetricsBand` - 4 the metric + sparkline SVG + micrometric
4. `TapeDark` - ticker chay ngang (5 muc KPI)
5. `PipelineDark` - canvas 7 cong pipeline dong (do=chan, xanh=dat)
6. `MatrixHeatmap` - luoi nang luc x yeu cau 6x8
7. `ProvenanceGraph` - so do node-link match -> cung/cau -> nguon (tier)
8. `InterpChart` - noi suy cau: 18 ky, 12 verified + 6 interpolated + dai bat dinh
9. `VerticalsDark` - 3 the nganh doc (facts/matches, thanh phan tier)
10. `PillarsDark` - 3 tru (chung-minh-duoc / tang niem tin / fail-loud)
11. `CTADark` + `FooterDark`

### Data model
**100% demo / PRNG-seeded** (deterministic SSR). Nguon: `lib/dark-data.ts` (metrics, matrix, interp, pipeline gate, stream names) + copy `lib/content.dk`. Cac animation (globe, meet, pipeline, match-stream) la mo phong "engine dang chay", KHONG phai luong du lieu that.

### Tuong tac
Client component: `PipelineDark`, `MatchStream` (setInterval 1900ms), `GlobeDark`/`MeetDark` (canvas), `GCard` (spotlight), `CountUp` (IntersectionObserver). Tat ca ton trong `prefers-reduced-motion`. Con lai la trinh bay tinh.

### Ket luan Landing
La trang gioi thieu tinh + hieu ung "song". Dung dung vai tro marketing. **Rui ro trung thuc:** so lieu tren landing (metrics, verticals, matrix) la demo/PRNG nhung khong ghi ro "minh hoa" - nen doc gia co the hieu nham la so that.

---

## PHAN 2 - HUB (`/hub`)

### Muc dich
Prototype san pham that: "Provenance-backed B2B matching". Layout app: topbar + rail trai + main.

### Cau truc
- `HubTopBar` - brand, chon domain (Cong nghiep ho tro), search, tag X-RAY/DEMO, avatar, link ve `/`
- `HubRail` - 3 nhom nav: Tong quan (Bang dieu khien*, Matches), Registry (Cung/Cau, Provenance), Tang niem tin (Bao chung, Track record). *item active
- `KpiGrid` - 4 KPI (facts verified, match chung-minh-duoc, gioi thieu bao chung, match bi cong chan[warn])
- `HubApp` (client) - 2 panel: trai [MatchList + CnclRegistry], phai [MatchDetail cua match dang chon]
- `RegistryTable` - bang cung mau (4 dong demo)
- `CnclRegistry` - bang cung THAT tu CNCLData

### Data model (QUAN TRONG - that vs demo)
| Vung | Trang thai |
|---|---|
| MatchList + MatchDetail | **DEMO** - 4 match tong hop (`lib/demo-data.hubMatches`), minh hoa khai niem chung-minh-duoc |
| RegistryTable (bang cung tren) | **DEMO** - 4 dong minh hoa |
| **CnclRegistry (bang duoi)** | **THAT** - 14 don vi, 64 claim, 7 nguon, snapshot 2026-07-18, tu QD 21/2026; moi dong co tier A/B/C, co ✓✓ neu corroborated, link evidence mo snapshot that |
| Phia CAU (demand) | **CHUA CO** - toan bo la cung; chua co du lieu cau |

### Tuong tac (thuc te wired vs scaffold)
- **Wired that:** chon match trong MatchList -> `HubApp` doi state `selected` -> MatchDetail re-render (provenance chain, vouch, gate). Link evidence trong CnclRegistry mo file that.
- **Scaffold (chua noi day):** nut chon domain, search, toan bo rail nav (Matches/Cung-Cau/Provenance/Bao chung/Track record), nut "Chay matching lai", avatar. Deu la vo cho Phase 2.

### Ket luan Hub
Prototype dung, co 1 luong tuong tac that (duyet match demo) + 1 bang du lieu that (CnclRegistry). Phan con lai la khung giao dien chua co logic. Note tren trang da ghi dung "DEMO - REGISTRY: THAT".

---

## PHAN 3 - GAP: that / demo / scaffold

- **That:** CnclRegistry (cung, 14 don vi) + evidence links. Wordmark/theme/token (Pha 0). Dashboard `/dashboard` (real project-status).
- **Demo co chu dich:** matches hub, registry mau, toan bo so lieu landing.
- **Scaffold chua logic:** rail hub, search, domain switch, run-match, demand side.

---

## PHAN 4 - KIEN TRUC CHUC NANG MONG MUON (DE XUAT)

> Day la DE XUAT dua tren khung scaffold hien co (lo y do) + boi canh PoC CaoLocMatch (matching cung-cau chung-minh-duoc). Can anh xac nhan/dieu chinh - khong phai quyet dinh cua toi.

### Landing (giu vai tro marketing, tang trung thuc)
1. Gan nhan "so lieu minh hoa" ro rang o metrics/verticals/matrix, HOAC noi mot vai con so tong (vd tong claim/don vi) toi so THAT tu CnclRegistry de landing khong noi qua.
2. CTA "xem engine that" -> deep-link vao `/hub` hoac `/dashboard`.
3. Giu nguyen hieu ung; khong can them logic.

### Hub (day la SAN PHAM - can wired dan theo thu tu gia tri)
Uu tien theo tru gia tri "chung-minh-duoc + fail-loud":

1. **Cung that (da co) -> mo rong:** CnclRegistry thanh nguon cung chinh; them loc theo nhom cong nghe / tier / corroborated; giu honest-null (o trong neu thieu, khong bia).
2. **Phia CAU (con thieu - chan tren):** can data model demand (khung chinh sach / nhu cau). Hien landing/hub noi "cau" nhung chua co du lieu cau that. Day la khoang trong lon nhat de Hub thanh matching that.
3. **Matching engine that:** thay 4 match demo bang ket qua tu engine (cung THAT x cau THAT), moi match keo theo provenance chain + tier + gate. Fail-loud: match thieu bang chung phai bi cong chan va HIEN ro (KPI "match bi cong chan" da co san cho).
4. **Wired rail nav:** Matches / Cung-Cau / Provenance / Bao chung / Track record - moi item thanh view that (dang la vo).
5. **Provenance drill-down:** click 1 fact -> xem chuoi nguon + snapshot (da co evidence link, can mo rong thanh view).
6. **Bao chung (trust layer):** co the them nguoi bao chung/vouch cho match; hien co badge VOUCHED nhung chua co luong.
7. **Search + domain switch:** wired de loc registry/match theo domain.

### Rang buoc quan tri (bat buoc giu)
- KHONG bia du lieu cau/match de "lam day" UI. Thieu thi de trong (honest-null) va ghi ro demo.
- Match phai co provenance + tier that; gate fail-loud phai chan va hien, khong an loi.
- UI khong duoc lam lu mo domain solo-entrepreneur da ky (SM1/SM2) va cac moc PoC (dataset Tuyet 2026-07-20). Wired Hub la viec sau, khong duoc eclipse cac moc do.

---

## Phu luc - file lien quan
- Landing: `app/page.tsx`, `components/dark/*` (17 file), `lib/content.ts` (dk.*), `lib/dark-data.ts`
- Hub: `app/hub/page.tsx`, `components/hub/*` (8 file), `lib/demo-data.ts`, `lib/cncl-registry.ts`
- Render: `reports/pha1/xray-landing.png`, `reports/pha1/xray-hub.png`
