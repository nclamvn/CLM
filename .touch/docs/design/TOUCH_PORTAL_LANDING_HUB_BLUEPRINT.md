# `.touch` Portal — Landing + Hub + Dashboard Implementation Blueprint

> **Document ID:** `TIP-PORTAL-V1`  
> **Version:** `1.0.0`  
> **Date:** `2026-07-19`  
> **Status:** Implementation Source of Truth  
> **Typeface:** Inter Variable  
> **Primary theme:** Dark executive  
> **Canonical desktop viewport:** `1536 × 1024 CSS px`, `deviceScaleFactor: 1`  
> **Approved visual reference:** `a_wide_high_resolution_ui_mockup_dashboard_conc.png` (`1536 × 1024`)  
> **Existing dashboard reference:** `TOUCH_DASHBOARD_APPROVED_MOCK_1536x1024.png`  
> **Product name:** `.touch` — the leading dot is immutable strong red.

---

## 0. Mục tiêu và thứ tự nguồn chuẩn

Tài liệu này khóa kiến trúc và ngôn ngữ đồ họa cho một cổng truy cập thống nhất gồm:

- `/` — Landing: marketing, thought leadership, giải thích engine.
- `/hub` — Hub: prototype sản phẩm provenance-backed B2B matching.
- `/dashboard` — Dashboard: control room tiến độ, gate, rủi ro và dữ liệu dự án.

Ba route là ba cấp độ của cùng một sản phẩm, không phải ba website tách rời.

### 0.1 Thứ tự ưu tiên khi có mâu thuẫn

1. Token machine-readable trong `touch-portal-tokens.json` và token Pha 0 hiện có.
2. Surface recipes trong `touch-portal-recipes.css`.
3. Geometry, component states và responsive rules trong blueprint này.
4. Mock Landing + Hub đã duyệt.
5. Mock Dashboard đã duyệt và handbook Pha 0.

Mock là chuẩn về **phân cấp, cảm giác vật liệu, mật độ, màu semantic và signature graphics**. Blueprint là chuẩn về kích thước, grid, responsive, accessibility và hành vi.

### 0.2 Điều kiện “giống mock”

Không được nghiệm thu bằng nhận xét cảm tính. Mỗi route phải có:

- Screenshot đúng viewport, DPR 1.
- Side-by-side với mock/reference tương ứng.
- Overlay 50%.
- Geometry mask.
- Visual-regression baseline.
- Không có automation overlay, Next dev indicator hoặc browser chrome.

**Gate:** sai lệch geometry vùng lớn `< 5%`; component presence `100%`; không overlap/clipping/horizontal overflow; token guard `0 hard violation`.

---

# 1. Kiến trúc sản phẩm thống nhất

## 1.1 Sơ đồ truy cập

```text
/  Landing
│
├─ CTA “Xem engine thật” ───────────────→ /hub
├─ CTA “Xem dashboard dự án” ──────────→ /dashboard
└─ Nav “Nguồn dữ liệu / Chứng minh” ───→ section hoặc /hub?view=registry

/hub  Product workspace
│
├─ Portal switcher: Landing / Hub / Dashboard
├─ Evidence link ──────────────────────→ /hub?view=provenance&claim=...
└─ Project state ──────────────────────→ /dashboard

/dashboard  Project control room
│
├─ Portal switcher: Landing / Hub / Dashboard
├─ Hub state CTA ──────────────────────→ /hub
└─ Registry / provenance links ────────→ /hub?view=registry|provenance
```

## 1.2 Shared components bắt buộc

```text
TouchBrand
PortalSwitcher
ProvenanceStatus
DataTruthBadge
StatusBadge
ExecutiveCard
SurfaceFrame
MetricCard
EvidenceLink
EmptyStateHonestNull
AppTopBar
MobileDrawer
```

Không được dựng lại brand, badge hoặc surface bằng CSS riêng cho từng route.

## 1.3 PortalSwitcher

Desktop:

- Kích thước trigger: `40px` cao, tối thiểu `152px` rộng.
- Icon grid: `18 × 18px`.
- Label: `13px/18px`, weight `500`.
- Menu: `264px` rộng; 3 destination rows, mỗi row `52px`.
- Active route có dot `6px`, accent blue; hover dùng surface-hover.

Mobile:

- Nằm trong drawer, không chiếm topbar.
- Mỗi destination row `48px`, full width.

---

# 2. Hợp đồng trung thực dữ liệu

## 2.1 Truth states

Mọi vùng dữ liệu phải có một trong bốn trạng thái machine-readable:

```ts
type DataTruthState = "REAL" | "DEMO" | "SYNTHETIC" | "SCAFFOLD";
```

| State | Label UI | Màu | Quy tắc |
|---|---|---|---|
| `REAL` | `DỮ LIỆU THẬT` | green | Có nguồn/snapshot/evidence link |
| `DEMO` | `MINH HỌA` | purple | Dữ liệu biên soạn để minh họa sản phẩm |
| `SYNTHETIC` | `SYNTHETIC` | amber | Sinh có seed, dùng kiểm thử engine |
| `SCAFFOLD` | `CHƯA NỐI` | muted/amber | UI có nhưng chưa có logic hoặc data thật |

### 2.2 DataTruthBadge

- Height: `22px`.
- Horizontal padding: `8px`.
- Radius: `999px`.
- Text: `10px/14px`, weight `600`, letter-spacing `0.06em`, uppercase.
- Dot: `5px`.
- Không dùng red cho demo; red chỉ dành cho blocked/fail/risk.

### 2.3 Landing truth rules

- Metrics, matrix, interpolation, verticals và stream demo phải có nhãn `SỐ LIỆU MINH HỌA` ở cấp section hoặc card group.
- Hai metric có thể nối dữ liệu thật: `14 đơn vị`, `64 claim`; khi nối thật phải hiện `DỮ LIỆU THẬT · snapshot 18/07/2026`.
- Không dùng count-up làm người dùng tưởng dữ liệu live nếu không có nguồn thật.
- `ENGINE-LIVE` chỉ được dùng nếu runtime health endpoint thật trả `healthy`; nếu không, dùng `ENGINE DEMO`.

### 2.4 Hub truth rules

- Match list và match detail hiện tại: `DEMO`.
- Registry mẫu: `DEMO`.
- CNCL Registry: `REAL`.
- Demand chưa có: `SCAFFOLD / HONEST NULL`.
- Run matching chỉ enabled khi supply thật + demand thật + engine contract đều sẵn sàng.

---

# 3. Canonical viewports và grid

## 3.1 Viewports bắt buộc

| Name | Width × height | DPR | Usage |
|---|---:|---:|---|
| desktop-xl | `1536 × 1024` | 1 | Visual fidelity chính |
| laptop | `1366 × 768` | 1 | Compact desktop |
| tablet-landscape | `1024 × 768` | 1 | Reflow 2 cột |
| tablet-portrait | `768 × 1024` | 1 | Drawer + stacked |
| mobile | `390 × 844` | 1 | 1 cột |

## 3.2 Global grid desktop

- Outer page gutter: `24px` ở `≥1440`.
- Max content width Landing: `1440px`.
- Hub/Dashboard app shell: full width.
- Base grid: `12 columns`.
- Column gap: `16px`.
- Section vertical gap: `24px`.
- Card internal grid: base `8px`.

```css
.portal-container {
  width: min(1440px, calc(100% - 48px));
  margin-inline: auto;
}

.portal-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: var(--space-4); /* 16px */
}
```

## 3.3 Breakpoints

```text
xl   ≥ 1440px
lg   1200–1439px
md   900–1199px
sm   640–899px
xs   < 640px
```

Không dùng breakpoint tùy ý ngoài config nếu chưa cập nhật token/blueprint.

---

# 4. Core design tokens

Các token dưới đây mở rộng design system Pha 0. Không thay token brand đã khóa.

## 4.1 Brand

| Token | Value |
|---|---:|
| `--brand-dot-red` | `#FF3830` |
| `--brand-word-dark` | `#F8FAFC` |
| `--brand-word-light` | `#0B1220` |
| `--brand-dot-size-sm` | `6px` |
| `--brand-dot-size-md` | `8px` |
| `--brand-dot-size-lg` | `10px` |
| `--brand-lockup-gap` | `4px` |

Dấu chấm không có glow, gradient, pulse hoặc đổi màu.

## 4.2 Canvas và surfaces

| Token | Value | Usage |
|---|---:|---|
| `--portal-canvas` | `#020611` | Nền sâu nhất |
| `--portal-canvas-deep` | `#01030A` | Sidebar/footer |
| `--portal-surface-0` | `#040B18` | Shell elevated |
| `--portal-surface-1` | `#071225` | Panel/card |
| `--portal-surface-2` | `#0A1730` | Hover/selected |
| `--portal-surface-3` | `#0E1D3B` | Elevated/focus |
| `--portal-surface-inset` | `#030A16` | Table/chart inset |
| `--portal-border-subtle` | `#173152` | Card border |
| `--portal-border-muted` | `rgba(148,163,184,.13)` | Divider |
| `--portal-border-strong` | `#2B4D78` | Focused panel |

## 4.3 Text

| Token | Value |
|---|---:|
| `--text-primary` | `#F8FAFC` |
| `--text-secondary` | `#94A3B8` |
| `--text-muted` | `#64748B` |
| `--text-disabled` | `#475569` |
| `--text-link` | `#7DB4FF` |
| `--text-on-accent` | `#FFFFFF` |

## 4.4 Semantic accents

| Token | Value | Meaning |
|---|---:|---|
| `--accent-blue` | `#2F6BFF` | Supply, link, primary action |
| `--accent-cyan` | `#18D4F5` | Provenance/data flow |
| `--accent-purple` | `#885CF6` | Demand/policy/demo |
| `--accent-amber` | `#F59E0B` | Engine/synthetic/warning |
| `--accent-green` | `#22C55E` | Verified/pass/real |
| `--accent-red` | `#EF4444` | Blocked/fail/deadline |
| `--accent-red-strong` | `#FF3830` | Brand dot or critical heading only |

## 4.5 Alpha fills

```css
--fill-blue-06: rgba(47,107,255,.06);
--fill-blue-10: rgba(47,107,255,.10);
--fill-blue-16: rgba(47,107,255,.16);
--fill-cyan-08: rgba(24,212,245,.08);
--fill-purple-10: rgba(136,92,246,.10);
--fill-amber-09: rgba(245,158,11,.09);
--fill-green-09: rgba(34,197,94,.09);
--fill-green-14: rgba(34,197,94,.14);
--fill-red-08: rgba(239,68,68,.08);
--fill-red-12: rgba(239,68,68,.12);
--fill-white-03: rgba(255,255,255,.03);
--fill-black-28: rgba(0,0,0,.28);
```

## 4.6 Typography — Inter Variable

```css
font-family: var(--font-sans); /* Inter Variable only */
font-synthesis: none;
text-rendering: geometricPrecision;
-webkit-font-smoothing: antialiased;
```

| Token | Size / line | Weight | Tracking | Usage |
|---|---:|---:|---:|---|
| `display.hero` | `56/60` | 700 | `-0.045em` | Landing hero |
| `display.page` | `40/48` | 700 | `-0.035em` | Page title large |
| `heading.1` | `32/40` | 650 | `-0.03em` | Main section |
| `heading.2` | `24/32` | 650 | `-0.025em` | Panel group |
| `heading.3` | `18/26` | 600 | `-0.015em` | Card title |
| `title.card` | `15/22` | 600 | `-0.01em` | Dense app card |
| `body.lg` | `16/26` | 400 | `0` | Landing body |
| `body.md` | `14/22` | 400 | `0` | App body |
| `body.sm` | `13/20` | 400 | `0` | Metadata |
| `label` | `11/16` | 600 | `0.08em` | Uppercase label |
| `caption` | `10/15` | 400 | `0.02em` | Footnote |
| `mono` | `12/18` | 500 | `0` | IDs/hash/tier |
| `metric.xl` | `48/52` | 700 | `-0.055em` | Landing metric |
| `metric.lg` | `40/44` | 700 | `-0.05em` | Hub KPI |

Không dùng `font-weight: 700` cho toàn bộ UI. Heading app ưu tiên 600–650.

## 4.7 Spacing

```text
0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 40, 48, 56, 64, 72, 80, 96
```

Token names tiếp tục scale Pha 0; half-step `6/10/14/18px` đã được cho phép.

## 4.8 Radius

| Token | Value |
|---|---:|
| `--radius-xs` | `6px` |
| `--radius-sm` | `8px` |
| `--radius-md` | `12px` |
| `--radius-lg` | `16px` |
| `--radius-xl` | `20px` |
| `--radius-pill` | `999px` |

App cards dùng `12px`; marketing cards có thể dùng `16px`. Không dùng bo tròn quá mềm.

## 4.9 Strokes

| Token | Value |
|---|---:|
| `--stroke-hairline` | `1px` |
| `--stroke-focus` | `1.5px` |
| `--icon-stroke` | `1.5px` |
| `--chart-stroke` | `1.5px` |
| `--chart-stroke-emphasis` | `2px` |

## 4.10 Shadows và glow

```css
--shadow-panel:
  inset 0 1px 0 rgba(255,255,255,.032),
  inset 0 -1px 0 rgba(0,0,0,.26),
  0 14px 38px rgba(0,0,0,.24);

--shadow-panel-compact:
  inset 0 1px 0 rgba(255,255,255,.026),
  0 8px 24px rgba(0,0,0,.20);

--glow-blue: 0 0 24px rgba(47,107,255,.18);
--glow-cyan: 0 0 24px rgba(24,212,245,.16);
--glow-purple: 0 0 24px rgba(136,92,246,.16);
--glow-green: 0 0 24px rgba(34,197,94,.18);
--glow-red: 0 0 24px rgba(239,68,68,.16);
```

Glow không được chạm mép viewport và không được phủ đều toàn card.

## 4.11 Motion

| Token | Value | Usage |
|---|---:|---|
| `--motion-fast` | `120ms` | hover/focus |
| `--motion-base` | `180ms` | card/nav |
| `--motion-slow` | `260ms` | drawer/modal |
| `--motion-stream` | `1900ms` | match stream cycle |
| `--ease-standard` | `cubic-bezier(.2,.8,.2,1)` | default |
| `--ease-emphasis` | `cubic-bezier(.16,1,.3,1)` | reveal |

Continuous animation chỉ cho canvas/stream/data flow, tắt khi reduced-motion.

---

# 5. Surface recipes — yếu tố tạo chất cao cấp

Mỗi panel phải dùng recipe; không chỉ `background + border`.

## 5.1 Executive card

```css
.surface-executive {
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(520px 220px at 82% -12%, var(--surface-glow, transparent), transparent 64%),
    linear-gradient(145deg, rgba(255,255,255,.018), transparent 34%),
    linear-gradient(180deg, var(--portal-surface-1), var(--portal-surface-0));
  border: 1px solid var(--portal-border-subtle);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-panel);
}

.surface-executive::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(110deg, rgba(255,255,255,.026), transparent 28%);
}
```

## 5.2 Critical surface

- Base fill red `8%`.
- Border red `56%`.
- Glow red `14–16%`.
- Heading red strong.
- Không dùng đỏ cho toàn text.

## 5.3 Verified surface

- Base green `7–9%`.
- Border green `28–38%`.
- Ring/indicator green có glow nhẹ.
- Body text vẫn secondary, không biến toàn card thành xanh.

## 5.4 Chart inset

- Background `--portal-surface-inset`.
- Border muted.
- Grid line blue/white `7–10%`.
- Plot glow tối đa `16%`.
- Tooltip elevated surface 3, radius 8.

## 5.5 Grain và starfield

Landing được phép có texture rất nhẹ:

```css
opacity: .025–.045;
mix-blend-mode: screen;
background-size: 160px 160px;
```

Không dùng noise nhìn thấy rõ ở zoom 100%.

---

# 6. Shared UI component specs

## 6.1 Primary button

- Height: `42px` landing, `40px` app.
- Padding: `0 16px`.
- Radius: `8px`.
- Font: `13px/18px`, weight `600`.
- Background: red gradient chỉ trong CTA hero được duyệt:
  `linear-gradient(180deg, #B52A31, #7F1820)`.
- Border: red strong `45%`.
- Shadow: `0 8px 24px rgba(239,68,68,.18)`.
- Hover: translateY `-1px`, brightness `1.06`.
- Focus: `2px` outline blue/cyan, offset `2px`.

Các nút product thông thường dùng blue hoặc neutral, không lạm dụng red.

## 6.2 Secondary button

- Transparent dark.
- Border `--portal-border-strong`.
- Hover surface 2.
- Không glow mặc định.

## 6.3 Badge

- Height `22px`.
- Radius pill.
- Padding `8px`.
- Text `10/14`, weight 600.

## 6.4 Icon

- Lucide default `18px`, stroke `1.5px`.
- Dense table icon `16px`.
- Hero/system illustration phải là SVG custom, không dùng Lucide phóng to.

## 6.5 Card title anatomy

```text
Eyebrow / truth badge
Title
Description or metric
Content
Divider
Footer metadata / evidence action
```

Card phải có một câu hỏi điều hành rõ ràng; không tạo card chỉ để trang trí.

---

# 7. Landing `/` — production blueprint

## 7.1 Landing page anatomy

Landing là trang cuộn dọc. Mock là composition board thể hiện toàn bộ hệ thống, không phải yêu cầu nhét 11 section trong một viewport.

Canonical full-page target ở desktop: khoảng `3020–3360px` chiều cao tùy copy thật. Top fold phải hoàn chỉnh ở `1536 × 1024`.

```text
NavDark                 72px
HeroDark                500px
MatchStream / Tape      40px
MetricsBand             176px
Pipeline + Matrix       356px
Provenance + Interp     388px
Verticals + Pillars     320px
CTA                     176px
Footer                  96px
Section gaps            24–40px
```

## 7.2 NavDark

### Geometry desktop

- Height: `72px`.
- Position: sticky top 0, z-index 50.
- Backdrop: canvas `88%`, blur `18px`.
- Bottom border: white `6%`.
- Container max: `1440px`.
- Horizontal padding: `24px`.

### Columns

```text
Brand: 180px
Nav links: flexible center
Status + CTA: auto
```

### Brand

- TouchBrand mode `full`, theme `dark`, size `md`.
- Wordmark visual height `28px`.
- Descriptor không hiển thị trong landing nav.

### Links

- `Giải pháp`, `Công nghệ`, `Nguồn dữ liệu`, `Chứng minh`, `Tài nguyên`.
- Gap `28px`.
- Text `13/18`, weight `500`.
- Active/hover text primary; inactive secondary.
- Underline active `1px`, blue.

### Engine status

- Height `28px`.
- Label runtime-based: `ENGINE LIVE`, `ENGINE DEMO`, `OFFLINE`.
- Green chỉ khi endpoint health thật.

### CTA

- `Xem engine thật` → `/hub`.
- Width `152px`, height `40px`.

## 7.3 HeroDark

### Geometry

- Min-height: `500px`.
- Grid: left `5 columns`, right `7 columns`.
- Gap: `40px`.
- Padding top `64px`, bottom `48px`.
- Background: radial blue glow bên phải, red low-alpha glow near match nodes.

### Left copy

- Eyebrow: `.touch X-RAY MATCHING`, label style.
- Hero title max width `560px`.
- Title 3 dòng:

```text
X-Ray Matching
Chứng minh được.
Khớp đúng. Tăng niềm tin.
```

- Line 2 accent red.
- Font `56/60`, 700.
- Body max `520px`, `16/26`, secondary.
- CTA group margin-top `28px`, gap `12px`.
- Footnote `* Số liệu minh họa`, caption, margin-top `12px`.

### Right stage

- Stage bounding box: `760 × 420px` max.
- Globe center: `62% 48%` of stage.
- Globe visual diameter: `320px`.
- Orbit extent: `580 × 360px`.
- Annotations: supply facts, evidence registry, provenance engine, match proven.
- Node dots: red 5px core + 16px halo.
- Data lines: blue/cyan 1px, opacity `0.32–0.66`.
- No bitmap globe. Use Canvas or SVG/WebGL component with deterministic seed.

### Globe animation

- Rotation `42–56s` per cycle.
- Orbit pulse `6–9s`.
- Red nodes pulse max opacity delta `.20`.
- Reduced motion: static frame; no rotation.

## 7.4 MatchStream / Tape

- Height `40px`.
- Full bleed within viewport.
- Border top/bottom muted.
- Label zone left `116px`: `MATCH STREAM`, red label.
- Items separated by `24px` gap + dot.
- Demo state must display `MINH HỌA` on right or in tooltip.
- Scroll speed equivalent `38–48px/s`; pause on hover/focus.

## 7.5 MetricsBand

### Geometry

- Grid 4 equal columns.
- Gap `16px`.
- Card height `144px`.
- Card padding `20px`.

### Cards

1. Đơn vị cung ứng — blue — real optional.
2. Claim đã xác thực — purple/cyan — real optional.
3. Match chứng minh được — amber/green — demo until engine true.
4. Match bị cổng chặn — red — demo/real based on gate.

Each card:

- Title `13/20`.
- Metric `40/44`.
- Unit baseline aligned.
- Sparkline `128 × 42px` bottom-right.
- Footer delta `11/16`.
- Truth badge top-right or group label above.

## 7.6 PipelineDark + MatrixHeatmap

### Section grid

- Pipeline: columns 1–8.
- Matrix: columns 9–12.
- Gap `16px`.
- Height `332px` desktop.

### Pipeline card

- Padding `24px`.
- Seven gate nodes evenly distributed.
- Stage labels:
  1. Thu thập
  2. Chuẩn hóa
  3. Trích xuất claim
  4. Đối chiếu đa nguồn
  5. Phân hạng tier
  6. Match
  7. Cổng chặn
- Passed path green/cyan.
- Blocked gate red, with 24px halo.
- Connecting rail `2px`.
- Legend bottom-left.
- Runtime/demo badge top-right.

### MatrixHeatmap

- Matrix `6 × 8`.
- Cell `28 × 28px` at XL.
- Gap `5px`.
- Radius `3px`.
- Values map to blue luminance, not rainbow.
- Axis labels `10/14`.
- Low/high legend bottom.
- Hover/focus reveals row, column, numeric value and truth state.

## 7.7 ProvenanceGraph + InterpChart

### Grid

- Provenance graph: columns 1–5.
- Interpolation chart: columns 6–12.
- Gap `16px`.
- Height `356px`.

### ProvenanceGraph

- Match node left.
- Supply and Demand nodes center.
- Source nodes right, tier colored.
- Main node diameters: `72px`, secondary `64px`, source `36px`.
- Links curved cubic Bézier, `1–1.5px`.
- Direct evidence green/cyan; weaker link dashed; support muted.
- Click node opens evidence drawer or Hub deep link.

### InterpChart

- 18 periods.
- 12 verified: green points/line.
- 6 interpolated: purple points/line.
- Uncertainty band: purple fill opacity `.10–.16`.
- Chart padding `24px 20px 30px 44px`.
- X-axis labels 01–18.
- Split label: Quá khứ / Dự báo.
- Tooltip shows `verified` or `interpolated`, source and confidence.

## 7.8 VerticalsDark + PillarsDark

### Layout

- Verticals: 7 columns.
- Pillars: 5 columns.
- Height `292px`.

### Verticals

- 3 cards, equal width.
- Domains:
  - Công nghiệp hỗ trợ.
  - Nông nghiệp công nghệ cao.
  - Năng lượng tái tạo.
- Card title `15/22`.
- Facts/matches row.
- Tier composition text.
- Truth badge must be explicit.

### Pillars

- 3 cards:
  - Chứng minh được — shield/check — blue.
  - Tăng niềm tin — handshake — purple.
  - Fail-loud — lock/gate — red.
- Icon custom line-art `44 × 44px`.
- Card height equal.

## 7.9 CTADark

- Height `176px`.
- Centered content max `720px`.
- Heading `28/36`, 650.
- Body `14/22`.
- Primary CTA Hub; secondary Dashboard.
- Background radial red + blue at low opacity.

## 7.10 FooterDark

- Min-height `96px`.
- Top border muted.
- Brand left.
- Portal links center/right.
- `Provenance is our DNA` caption.
- No oversized sitemap.

---

# 8. Hub `/hub` — product workspace blueprint

## 8.1 Hub shell desktop

```css
.hub-shell {
  min-height: 100dvh;
  display: grid;
  grid-template-rows: 64px minmax(0, 1fr);
}

.hub-body {
  min-width: 0;
  display: grid;
  grid-template-columns: 192px minmax(0, 1fr);
}
```

- Topbar: `64px`.
- Rail: `192px`.
- Main padding: `20px`.
- Background canvas.
- Main max not constrained; app uses full viewport.

## 8.2 HubTopBar

### Geometry

- Height `64px`.
- Padding `0 20px`.
- Brand width `180px`.
- Border bottom muted.
- Backdrop blur `16px`.

### Content order

```text
TouchBrand | Domain selector | Search | spacer | X-RAY/DEMO | alerts | PortalSwitcher/User
```

### Domain selector

- Width `210px`.
- Height `38px`.
- Label prefix `Domain:` muted.
- Current value primary.
- Until wired, display SCAFFOLD tooltip and disabled-change behavior, not fake switching.

### Search

- Width responsive `280–420px`.
- Height `38px`.
- Search only enabled when registry/matches index is wired.
- Shortcut `/` and `⌘K` optional.

## 8.3 HubRail

- Width `192px`.
- Padding `16px 12px`.
- Section label `10/14`, uppercase, red at `70%`.
- Nav row `40px`, radius 8.
- Icon `16px`.
- Gap between groups `24px`.

Groups:

```text
TỔNG QUAN
  Bảng điều khiển
  Matches

REGISTRY
  Cung / Nhà cung cấp
  Cầu / Nhu cầu
  Provenance

TĂNG NIỀM TIN
  Bảo chứng
  Track record
```

Scaffold items:

- Still clickable only if a defined empty/scaffold view exists.
- Do not leave dead buttons.
- Use `CHƯA NỐI` badge in destination view, not on every nav item.

Rail footer:

- Provenance ON card.
- Verified percentage.
- Gates status.
- Height `112px`.

## 8.4 Hub KPI grid

- Grid 4 columns.
- Gap `14px`.
- Height `124px`.
- Margin-bottom `16px`.

Cards:

1. Facts đã xác thực — blue — `64 claim` real.
2. Match chứng minh được — green — demo until engine true.
3. Giới thiệu bảo chứng — purple — demo/scaffold.
4. Match bị cổng chặn — red — fail-loud.

Anatomy:

- Padding `16px`.
- Label `12/18`.
- Metric `36/40`.
- Sparkline or custom illustration `100 × 54px` right.
- Delta `10/15` bottom-left.
- Truth badge via tooltip or card group label.

## 8.5 Hub workspace

Desktop workspace grid:

```css
.hub-workspace {
  display: grid;
  grid-template-columns: minmax(520px, .86fr) minmax(600px, 1.14fr);
  gap: 16px;
  align-items: start;
}
```

At 1536 desktop, expected approximate widths after rail/padding:

- Left stack: `548–590px`.
- Right detail: `650–706px`.

### Left stack

```text
MatchList                 244px minimum
RegistryTable DEMO        210px minimum
CnclRegistry REAL         320px minimum
```

Cards gap `12px`.

### Right detail

- Sticky within desktop workspace: `top: 80px`.
- Min-height `680px`.
- Max height `calc(100dvh - 104px)` only if internal scroll is carefully implemented.
- Prefer document scroll over nested scroll unless content exceeds 900px.

## 8.6 MatchList

- Header height `42px`.
- List row min-height `64px`.
- Row padding `12px`.
- Gap `8px`.
- Selected row: red/dark tint matching mock, but selected state is not error.
- Selected border can use accent red at `40%` only because mock identity uses red highlights; status semantics remain separate.

Row columns:

```text
Icon 24px | ID + parties minmax(0,1fr) | tier 64px | state 72px | action 28px
```

Statuses:

- `VOUCHED` green.
- `VERIFIED` green/cyan.
- `REVIEW` amber.
- `BLOCKED` red + lock.

## 8.7 MatchDetail

### Header

- Padding `20px`.
- Match ID `18/26`, mono or Inter medium.
- Parties `13/20`.
- Status badge top-right.

### Tabs

- Height `42px`.
- `Tổng quan`, `Provenance`, `Bảo chứng`, `Hoạt động`.
- Active underline red `2px` in approved mock; use brand red token alias only for active product tab, not as generic semantic error.
- Keyboard arrow navigation.

### Summary card

- Grid 2 columns label/value.
- Row height `28px`.
- Status dots `6px`.
- Gate value green.

### Provenance chain

- Vertical timeline.
- Rail x-position `18px` from content left.
- Node `28px`; line `1px` blue/cyan.
- Step gap `18px`.
- Node types:
  - Match blue.
  - Supply fact blue/cyan.
  - Demand fact purple.
  - Tier A source neutral/gold.
  - Tier B source green/olive.
  - Tier C source amber/red.
- Each step includes label, title, source/snapshot date.
- Click source opens evidence view or snapshot.

### Evidence CTA

- Full width.
- Height `42px`.
- Critical red outline only if opening snapshot linked to current evidence chain; otherwise neutral/blue.
- External link icon `16px`.

## 8.8 RegistryTable DEMO

- Header truth badge `MINH HỌA`.
- Table header `32px`.
- Row `36px`.
- Font `11/16`.
- Empty cells use em dash only where SOT permits; project em-dash gate may use `—` or explicit `Chưa có` consistently. If em-dash is prohibited by project convention, use `Chưa có`.

## 8.9 CnclRegistry REAL

- Header: `CNCL REGISTRY (THẬT) · 14 ĐƠN VỊ, 64 CLAIM, 7 NGUỒN`.
- Truth badge green.
- Snapshot date visible.
- Filter row:
  - search supplier;
  - technology group;
  - tier;
  - corroborated only.
- Filter control height `36px`.
- Table row min `40px`.
- Evidence link target minimum `40 × 40px`.
- Honest-null: blank/`Chưa có`, never synthesized.

## 8.10 Demand empty/scaffold view

Until demand data is real:

- Use `EmptyStateHonestNull`.
- Lock icon custom `40px`.
- Title `Chưa có tập dữ liệu CẦU đủ điều kiện`.
- Explain required input and gate.
- CTA disabled or link to dataset work status in Dashboard.
- No demo demand rows mixed into real registry unless clearly separated.

## 8.11 Run matching

Button states:

```ts
"disabled-missing-demand"
"disabled-baseline-lock"
"ready"
"running"
"blocked"
"complete"
```

- Missing demand: disabled; tooltip gives exact blocker.
- Baseline lock: disabled red/amber warning, never bypass.
- Running: deterministic progress stages; no fake random completion.
- Blocked: fail-loud panel visible with gate ID.

---

# 9. Dashboard integration

Dashboard visual SOT remains its approved mock and Pha 0 handbook. Portal integration changes only shared navigation/access:

- Add `PortalSwitcher` in topbar near provenance status.
- Landing destination `/`.
- Hub destination `/hub`.
- Dashboard destination `/dashboard` active.
- Deep links from deadline/task/registry may point to Hub views.
- Do not restyle Dashboard merely to match Landing typography; both consume shared tokens but retain app-specific density.

No Pha 1 Dashboard visual baseline may be overwritten by Landing/Hub implementation.

---

# 10. Signature graphics

## 10.1 Asset policy

- Custom SVG/Canvas only for system illustrations.
- No raster screenshots embedded as UI.
- No emoji.
- No third-party stock icons as signature graphics.
- SVG accepts semantic CSS variables.

## 10.2 Globe

- 320px desktop hero diameter.
- Latitude/longitude strokes `0.75–1px`.
- Dot field 140–220 dots deterministic.
- Asia/Vietnam-facing initial rotation if map geometry supports it.
- Blue body, cyan edge, red match nodes.
- Mask fades left/lower perimeter.

## 10.3 Sparklines

- Viewbox `0 0 120 48`.
- Stroke `1.5px`.
- No fill or fill alpha `≤ .08`.
- End point 3px.
- Grid max 3 horizontal lines.

## 10.4 Heatmap

- Use exact cell alignment; no blur.
- Glow only on hovered/selected cell.
- Color scale from surface 2 → blue.

## 10.5 Provenance graph

- Curves must avoid crossing labels.
- Arrowheads `4px`.
- Node glow local max `18px`.

## 10.6 Pipeline gate

- Line `2px`.
- Passed node core `8px`; outer ring `22px`.
- Blocked node core red `8px`; outer glow `28px`.

---

# 11. Responsive rules

## 11.1 Landing

### `1200–1439px`

- Hero grid `5/7`, title `48/54`.
- Globe diameter `280px`.
- Nav link gap `20px`.
- Vertical sections keep 2-column.

### `900–1199px`

- Nav links hidden behind menu.
- Hero `1fr 1fr`, title `42/48`.
- Metrics `2 × 2`.
- Pipeline and matrix stack.
- Provenance and interpolation stack.
- Verticals `3 columns`; pillars next row.

### `640–899px`

- Hero stacks; copy first, globe second.
- Globe stage `100% × 360px`.
- Metrics 2 columns.
- Verticals 1 column or horizontal snap cards.
- CTA buttons can wrap.

### `<640px`

- Outer padding `12px`.
- Hero title `36/42`.
- Metrics 1 column.
- Globe `280px` max.
- MatchStream simplified; no endless ticker if it causes accessibility issues.
- Charts preserve min height `280px` and vertical scroll only.

## 11.2 Hub

### `1200–1439px`

- Rail `72px` icon-only.
- Workspace stays 2 columns if each side meets minimum.
- KPI 4 columns.

### `900–1199px`

- Rail icon-only `72px` or drawer at lower edge.
- Workspace 1 column.
- Detail follows list; selected match anchor scrolls to detail.
- KPI `2 × 2`.

### `<900px`

- Rail becomes off-canvas drawer.
- Topbar simplified.
- Search moves into page content.
- KPI 2 columns until 640.
- Match list and detail stack.

### `<640px`

- KPI 1 column or 2 compact cards if 390px testing proves readable; default 1 column.
- Tables become scrollable within card only, not whole page.
- Registry rows may transform to key-value cards.
- Tabs horizontally scroll with visible gradient affordance.
- Provenance chain remains vertical.

## 11.3 Responsive gates

At all five viewports:

- `documentElement.scrollWidth === clientWidth`.
- No text/SVG overlap.
- No dead nav action.
- Evidence/provenance state remains visible.
- Drawer traps focus, Escape closes, focus returns.

---

# 12. Interaction contracts

## 12.1 Landing

| Component | Interaction | Data honesty |
|---|---|---|
| Hero globe | Canvas hover/focus annotations | Visual demo |
| MatchStream | Advances every 1900ms | Must label demo |
| Pipeline | Hover gate details | Demo or runtime state explicit |
| Heatmap | Cell tooltip/filter link | Demo explicit |
| Provenance graph | Click node → Hub deep link | Example explicit |
| Interp chart | Tooltip by period | Verified vs interpolated explicit |
| CTA | Route to Hub/Dashboard | Real route |

## 12.2 Hub

| Component | Interaction | Current state |
|---|---|---|
| Match list | Select changes detail | Wired demo |
| Evidence links | Open snapshot/view | Wired real in CNCL |
| Registry filters | Filter client/server data | Must wire |
| Demand nav | Honest-null view | Scaffold |
| Run matching | Contract state machine | Not enabled until real |
| Search | Registry/match search | Scaffold until index wired |
| Domain switch | Select domain | Scaffold until data domains wired |
| Vouch | Review/attestation flow | Future |

No button may look enabled while having no action. Use disabled state plus explanation or implement scaffold view.

---

# 13. Accessibility

- WCAG 2.2 AA minimum.
- Body text contrast `≥4.5:1`.
- Large text `≥3:1`.
- Focus ring always visible.
- Color never sole state carrier.
- Charts have text summary and table fallback.
- Canvas hero has accessible summary and reduced-motion static fallback.
- Ticker pause control or auto-pause when focused/hovered.
- Minimum target `40 × 40px`; primary controls `44px` preferred on mobile.
- Tabs implement ARIA tab pattern.
- Table headers use `scope`.
- Live engine status uses restrained `aria-live="polite"`, not every animation tick.

---

# 14. Implementation architecture

Recommended structure:

```text
app/
  page.tsx
  hub/page.tsx
  dashboard/page.tsx

components/
  brand/TouchBrand.tsx
  portal/PortalSwitcher.tsx
  portal/DataTruthBadge.tsx
  portal/ProvenanceStatus.tsx
  dark/
    NavDark.tsx
    HeroDark.tsx
    GlobeDark.tsx
    MatchStream.tsx
    MetricsBand.tsx
    PipelineDark.tsx
    MatrixHeatmap.tsx
    ProvenanceGraph.tsx
    InterpChart.tsx
    VerticalsDark.tsx
    PillarsDark.tsx
    CTADark.tsx
    FooterDark.tsx
  hub/
    HubTopBar.tsx
    HubRail.tsx
    HubKpiGrid.tsx
    HubApp.tsx
    MatchList.tsx
    MatchDetail.tsx
    RegistryTable.tsx
    CnclRegistry.tsx
    DemandEmptyState.tsx

lib/
  content.dk.ts
  dark-data.ts
  demo-data.ts
  cncl-registry.ts
  portal-routes.ts
  truth-state.ts

styles/
  touch-theme.css
  touch-portal.css
```

Rules:

- Server components by default.
- Client only for actual interaction/canvas/state.
- PRNG must be seeded and deterministic SSR/client.
- No hydration mismatch from random/time-based values.
- All route links defined centrally.

---

# 15. Pixel-level visual acceptance

## 15.1 Capture setup

```ts
const context = await browser.newContext({
  viewport: { width: 1536, height: 1024 },
  deviceScaleFactor: 1,
  colorScheme: "dark",
  reducedMotion: "reduce",
});
```

Before screenshot:

- Production build.
- Wait for fonts: `document.fonts.ready`.
- Verify Inter loaded.
- Disable animations/caret.
- Freeze deterministic demo seed.
- Hide dev indicators and automation overlays.

## 15.2 Required artifacts

```text
reports/portal/landing-1536x1024.png
reports/portal/hub-1536x1024.png
reports/portal/landing-fullpage.png
reports/portal/hub-fullpage.png
reports/portal/landing-overlay-50.png
reports/portal/hub-overlay-50.png
reports/portal/landing-diff-mask.png
reports/portal/hub-diff-mask.png
reports/portal/responsive/*.png
```

## 15.3 Region geometry gate

Landing regions:

- Nav.
- Hero copy.
- Globe stage.
- Metrics row.
- Pipeline/matrix.
- Provenance/interpolation.
- Verticals/pillars.
- CTA/footer.

Hub regions:

- Topbar.
- Rail.
- KPI row.
- Left workspace stack.
- Match detail.
- Provenance timeline.
- Footer/rail status.

For each region:

```text
abs(x_actual - x_target) / target_width < 0.05
abs(y_actual - y_target) / target_height < 0.05
abs(w_actual - w_target) / target_width < 0.05
abs(h_actual - h_target) / target_height < 0.05
```

Glow/RGB pixel diff is advisory, not sole blocker. Geometry, typography, component presence and hierarchy are blockers.

## 15.4 Typography gate

- Inter loaded: true.
- No fallback glyph for Vietnamese.
- Heading wraps match approved line breaks at canonical viewport.
- No clipped accents.
- Font weight delta no more than one variable-font step.
- Baseline alignment of KPI number/unit within `2px`.

## 15.5 Surface gate

Every primary card must show:

1. Deep gradient surface.
2. Subtle top inset highlight.
3. Semantic ambient glow if applicable.
4. Border visible but not bright.
5. Separation shadow.

A flat solid navy card is FAIL even if geometry is correct.

---

# 16. Automated gates

```text
npm run lint:tokens          0 hard violations
npm run test:brand           PASS
npm run test:responsive      5/5 PASS
npm run test:visual:portal   PASS/baseline approved
npm run test:a11y            0 serious/critical
npm run typecheck            PASS
npm run build                PASS
npm run check                PASS
```

Additional assertions:

- No console error.
- No failed network request for fonts/assets.
- No hydration warning.
- No route returning 404.
- No active control without handler.
- No unlabeled demo metric.
- CNCL real rows maintain source links.

---

# 17. Definition of Done

## 17.1 Landing DONE

- 11 sections implemented in correct sequence.
- Top fold matches approved visual language.
- Globe/pipeline/matrix/provenance/interpolation visuals complete.
- All demo metrics visibly labeled.
- Hub and Dashboard CTAs wired.
- Reduced-motion and accessibility pass.
- Responsive 5 viewports pass.
- Visual baseline approved.

## 17.2 Hub DONE

- Topbar/rail/KPI/workspace/detail structure complete.
- Match demo and registry demo explicitly separated from CNCL real.
- CNCL filters wired without inventing values.
- Demand honest-null view exists.
- All rail items have real destination or explicit scaffold view.
- Evidence chain opens sources/snapshots.
- Responsive and keyboard navigation pass.
- Visual baseline approved.

## 17.3 Unified portal DONE

- PortalSwitcher works on all three routes.
- Brand and token usage shared.
- No visual drift between Landing, Hub and Dashboard.
- Data truth state visible everywhere it matters.
- Production clean-CI PASS.

---

# 18. Handoff instruction for dev/Claude Code

> Treat `TIP-PORTAL-V1` as the implementation contract. Do not free-style colors, shadows, card surfaces, spacing or responsive behavior. Build shared portal primitives first, then Landing top fold, then Landing sections, then Hub shell/workspace, then integrate Dashboard navigation. Preserve the distinction REAL/DEMO/SYNTHETIC/SCAFFOLD. Every demo number must be labeled. Every real claim must keep provenance. Capture at 1536×1024 DPR 1 and run overlay after each major region. Do not proceed to the next page while the current page has structural visual differences or dead controls.

