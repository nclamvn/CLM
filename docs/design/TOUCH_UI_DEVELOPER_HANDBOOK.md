# .touch UI Developer Handbook

> **Version:** 1.0.0  
> **Status:** Implementation blueprint  
> **Primary viewport:** 1536 × 1024 px  
> **Canonical design width:** 1440 px and above  
> **Typeface:** Inter  
> **Icon set:** Lucide  
> **Product name:** `.touch`  
> **Brand invariant:** the leading dot is always strong red; `touch` is white on dark surfaces and near-black on light surfaces.

---

## 0. Mục đích và thứ tự nguồn chuẩn

Tài liệu này là nguồn chuẩn để chuyển mock dashboard `.touch` thành website thực thi được, đồng thời tạo nền tảng thiết kế nhất quán cho toàn bộ trang con.

### Thứ tự ưu tiên khi có mâu thuẫn

1. `touch-design-tokens.json`
2. `touch-theme.css`
3. Quy cách component và layout trong tài liệu này
4. Mock dashboard gốc
5. Các poster blueprint tham khảo

Ảnh mock được tạo để khóa **cảm giác thị giác, mật độ thông tin và phân cấp nội dung**. Không sao chép các méo hình học, lỗi chữ hoặc kích thước thiếu đồng đều do ảnh AI tạo. Dev phải dùng grid và token trong handbook.

### Các file tham chiếu

- `dashboard_tổng_quan_với_giao_diện_hiện_đại.png`
- `touch_design_system_blueprint.png`
- `dark_mode_design_tokens_reference_guide.png`
- `ui_design_system_specs_overview.png`
- `ui_design_system_reference_poster.png`

---

# 1. Tinh thần sản phẩm

`.touch` là giao diện điều hành cho hệ thống **provenance-backed matching**. Giao diện không được trông như CRM phổ thông, marketplace hoặc dashboard template.

## 1.1 Năm nguyên tắc không được phá

1. **Provenance first**  
   Mọi insight quan trọng phải có đường đi đến nguồn, claim, snapshot hoặc gate.

2. **Evidence over opinion**  
   Trạng thái xác minh phải nổi bật hơn lời mô tả marketing.

3. **Calm executive clarity**  
   Mật độ dữ liệu cao nhưng không ồn. Chỉ dùng glow ở điểm cần chú ý.

4. **High signal density**  
   Mỗi card phải trả lời một câu hỏi điều hành cụ thể.

5. **Human decision visible**  
   Việc nào cần con người phải có owner, deadline và trạng thái rõ ràng.

## 1.2 Những điều cấm

- Không dùng gradient nhiều màu cho nút.
- Không dùng neon glow trên mọi card.
- Không tạo màu mới trực tiếp trong component.
- Không dùng border radius tùy ý.
- Không dùng icon khác Lucide nếu chưa được duyệt.
- Không hiển thị màu đỏ chỉ để trang trí.
- Không viết `.Touch`, `Touch`, `TOUCH` như tên sản phẩm chính.
- Không đổi màu dấu chấm đỏ theo theme.
- Không để chart chỉ truyền đạt bằng màu mà thiếu legend hoặc label.
- Không dùng shadow kiểu material nổi dày.

---

# 2. Brand lockup `.touch`

## 2.1 Cấu trúc logo

Logo chữ là một lockup gồm:

- Dấu chấm tròn đỏ.
- Chữ `touch` viết thường.
- Không có khoảng trắng giữa dấu chấm và chữ trong tên văn bản: `.touch`.
- Khi render bằng HTML, dấu chấm và chữ là hai span để kiểm soát màu.

```html
<a class="brand-lockup" href="/" aria-label=".touch home">
  <span class="brand-lockup__dot" aria-hidden="true"></span>
  <span class="brand-lockup__word">touch</span>
</a>
```

## 2.2 Màu thương hiệu

| Thành phần | Dark theme | Light theme |
|---|---:|---:|
| Dấu chấm | `#FF3830` | `#FF3830` |
| Chữ touch | `#F8FAFC` | `#0B1220` |
| Descriptor | `#64748B` | `#64748B` |

Dấu chấm đỏ là **immutable token**. Không dùng `accent.red` thay thế cho dấu chấm.

## 2.3 Kích thước lockup

### Sidebar desktop

- Tổng chiều cao vùng brand: `88px`.
- Padding trái/phải: `24px`.
- Logo word size: `36px`.
- Line-height: `40px`.
- Font-weight: `700`.
- Letter-spacing: `-0.04em`.
- Dot: `10 × 10px`.
- Khoảng cách dot → chữ: `4px`.
- Dot dịch xuống `5px` so với trục giữa quang học của chữ.
- Descriptor: `11px/16px`, weight `400`, margin-top `2px`.

### Header/marketing large

- Word size: `48px/52px`.
- Dot: `12 × 12px`.
- Gap: `5px`.

### Compact/mobile

- Word size: `24px/28px`.
- Dot: `7 × 7px`.
- Gap: `3px`.

## 2.4 Clear space

Khoảng trống tối thiểu xung quanh logo bằng chiều cao chữ `t` thường. Trong app shell có thể giảm còn `16px` ở mép trên và dưới, nhưng không nhỏ hơn.

---

# 3. Design tokens

Mọi giá trị giao diện phải đi qua token. Không hardcode hex, spacing hoặc radius trong component trừ giá trị tính toán nội bộ của chart.

## 3.1 Color tokens · dark theme

### Background và surface

| Token | Hex | Vai trò |
|---|---:|---|
| `color.bg.canvas` | `#020617` | Nền app shell |
| `color.bg.sidebar` | `#030914` | Nền sidebar |
| `color.bg.surface.1` | `#071225` | Card/panel chính |
| `color.bg.surface.2` | `#0B1730` | Card phụ/hover |
| `color.bg.surface.3` | `#0F1D3D` | Elevated surface |
| `color.bg.overlay` | `rgba(2, 6, 23, 0.84)` | Modal backdrop |
| `color.bg.scrim` | `rgba(2, 6, 23, 0.64)` | Drawer/scrim |

### Text

| Token | Hex | Vai trò |
|---|---:|---|
| `color.text.primary` | `#F8FAFC` | Heading và nội dung chính |
| `color.text.secondary` | `#94A3B8` | Metadata, mô tả |
| `color.text.muted` | `#64748B` | Disabled, caption |
| `color.text.inverse` | `#0B1220` | Text trên nền sáng |
| `color.text.link` | `#7DB4FF` | Link mặc định |

### Border và divider

| Token | Giá trị | Vai trò |
|---|---:|---|
| `color.border.subtle` | `#173152` | Border card mặc định |
| `color.border.muted` | `rgba(148, 163, 184, 0.14)` | Divider nhẹ |
| `color.border.strong` | `#2B4D78` | Focused/elevated border |
| `color.border.focus` | `#2F6BFF` | Focus ring chính |

### Semantic accent

| Token | Hex | Ý nghĩa |
|---|---:|---|
| `color.brand.dot` | `#FF3830` | Dấu chấm `.touch` duy nhất |
| `color.accent.blue` | `#2F6BFF` | Supply, link, focus, primary action |
| `color.accent.cyan` | `#18D4F5` | Telemetry, provenance glow |
| `color.accent.purple` | `#885CF6` | Demand, policy, framework |
| `color.accent.amber` | `#F59E0B` | Engine, warning, internal/private |
| `color.accent.green` | `#22C55E` | Pass, verified, live |
| `color.accent.red` | `#EF4444` | Risk, deadline, destructive action |
| `color.accent.teal.dark` | `#083B44` | Low-emphasis live fill |

### Tinted fills

```css
--fill-blue-subtle: rgba(47, 107, 255, 0.10);
--fill-cyan-subtle: rgba(24, 212, 245, 0.08);
--fill-purple-subtle: rgba(136, 92, 246, 0.10);
--fill-amber-subtle: rgba(245, 158, 11, 0.09);
--fill-green-subtle: rgba(34, 197, 94, 0.09);
--fill-red-subtle: rgba(239, 68, 68, 0.10);
```

## 3.2 Color tokens · light theme

| Token | Hex |
|---|---:|
| `color.bg.canvas` | `#F4F7FB` |
| `color.bg.sidebar` | `#FFFFFF` |
| `color.bg.surface.1` | `#FFFFFF` |
| `color.bg.surface.2` | `#F1F5F9` |
| `color.bg.surface.3` | `#EAF0F7` |
| `color.text.primary` | `#0B1220` |
| `color.text.secondary` | `#334155` |
| `color.text.muted` | `#64748B` |
| `color.border.subtle` | `#D7E0EA` |
| `color.border.strong` | `#AFC0D4` |
| `color.text.link` | `#174FC4` |

Semantic accent giữ nguyên hue; giảm glow và tăng độ đậm text trên tinted fills.

## 3.3 Typography tokens · Inter

Font stack:

```css
font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont,
  "Segoe UI", sans-serif;
```

Khuyến nghị production: self-host `Inter Variable`, preload file WOFF2, dùng `font-display: swap`.

| Token | Size / line-height | Weight | Tracking | Dùng cho |
|---|---:|---:|---:|---|
| `type.display.01` | `48/56px` | 700 | `-0.03em` | Hero/marketing |
| `type.heading.01` | `32/40px` | 700 | `-0.025em` | Page title lớn |
| `type.heading.02` | `24/32px` | 600 | `-0.02em` | Page title app |
| `type.title.01` | `18/28px` | 600 | `-0.01em` | Section/panel title |
| `type.title.02` | `16/24px` | 600 | `-0.005em` | Card title |
| `type.body.01` | `16/24px` | 400 | `0` | Body chính |
| `type.body.02` | `14/22px` | 400 | `0` | Body dashboard |
| `type.label.01` | `13/18px` | 500 | `0.01em` | Label/metadata |
| `type.label.upper` | `12/16px` | 600 | `0.08em` | Section eyebrow |
| `type.mono.01` | `12/18px` | 500 | `0` | Commit hash, IDs, code |
| `type.caption.01` | `11/16px` | 400 | `0.01em` | Caption/footer |
| `type.metric.xl` | `40/44px` | 650 | `-0.035em` | KPI chính |
| `type.metric.lg` | `32/36px` | 650 | `-0.03em` | Metric trong panel |

Commit hash và ID dùng:

```css
font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
font-variant-numeric: tabular-nums;
```

## 3.4 Spacing tokens

Base grid: `4px`. Layout grid: `8px`.

| Token | px |
|---|---:|
| `space.0` | 0 |
| `space.1` | 4 |
| `space.2` | 8 |
| `space.3` | 12 |
| `space.4` | 16 |
| `space.5` | 20 |
| `space.6` | 24 |
| `space.8` | 32 |
| `space.10` | 40 |
| `space.12` | 48 |
| `space.16` | 64 |
| `space.20` | 80 |

Quy tắc:

- Khoảng cách giữa card cùng cấp: `16px`.
- Khoảng cách giữa section lớn: `16px` trong dashboard mật độ cao; `24px` ở trang chi tiết.
- Padding card mặc định: `20px`.
- Padding card compact: `16px`.
- Padding page desktop: `24px 28px 28px 30px` tại viewport 1536.

## 3.5 Radius tokens

| Token | px | Dùng cho |
|---|---:|---|
| `radius.xs` | 6 | Badge nhỏ |
| `radius.sm` | 8 | Input, chip, button nhỏ |
| `radius.md` | 12 | Button, card compact |
| `radius.lg` | 16 | Panel/card chính |
| `radius.xl` | 20 | Modal/drawer |
| `radius.full` | 999 | Dot, avatar, pill |

## 3.6 Border tokens

- `stroke.hairline`: `1px`.
- `stroke.emphasis`: `1.5px`.
- Không dùng `2px` cho card thường.
- Focus ring: `2px`, offset `2px`.

## 3.7 Shadow và glow

```css
--shadow-panel: 0 12px 40px rgba(0, 0, 0, 0.28);
--shadow-float: 0 20px 64px rgba(0, 0, 0, 0.36);
--glow-blue: 0 0 24px rgba(47, 107, 255, 0.18);
--glow-cyan: 0 0 24px rgba(24, 212, 245, 0.16);
--glow-green: 0 0 20px rgba(34, 197, 94, 0.16);
--glow-red: 0 0 24px rgba(239, 68, 68, 0.16);
```

Glow chỉ dùng cho:

- Focus keyboard.
- Trạng thái `LIVE` hoặc `PASS` quan trọng.
- Risk deadline mức critical.
- Visualization chủ đạo trong KPI card.

## 3.8 Motion tokens

| Token | Thời gian | Easing | Dùng cho |
|---|---:|---|---|
| `motion.fast` | 120ms | standard | Hover/focus |
| `motion.base` | 180ms | standard | Card transition |
| `motion.slow` | 260ms | emphasis | Drawer/modal |
| `motion.count` | 480ms | emphasis | KPI count-up |

```css
--ease-standard: cubic-bezier(0.2, 0.8, 0.2, 1);
--ease-emphasis: cubic-bezier(0.16, 1, 0.3, 1);
```

Tôn trọng `prefers-reduced-motion: reduce` và tắt count-up, pulse, parallax.

---

# 4. Grid và app shell

## 4.1 Viewport chuẩn để pixel review

Ảnh nghiệm thu chính phải chụp ở:

- Viewport: `1536 × 1024px`.
- Device pixel ratio: `1` khi chạy visual regression.
- Browser zoom: `100%`.
- Font rendering: Chrome stable trên macOS hoặc Linux CI, khóa một môi trường cho baseline.

## 4.2 Desktop XL · 1536px

### App shell

- Sidebar: `204px` theo mock gốc.
- Divider sidebar: `1px`, tại x=`204px`.
- Main shell: từ x=`205px` đến hết viewport.
- Main padding-left: `30px`.
- Main padding-right: `27px`.
- Top padding: `22px`.
- Bottom padding: `28px`.

### Dashboard work area

```text
Viewport width                         1536
Sidebar                                204
Main left padding                       30
Evidence rail                           110
Gap center ↔ evidence rail              16
Main right padding                      27
Center workspace width               1149
```

Implementation:

```css
.app-shell {
  display: grid;
  grid-template-columns: 204px minmax(0, 1fr);
  min-height: 100dvh;
}

.main-shell {
  min-width: 0;
  padding: 22px 27px 28px 30px;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 110px;
  gap: 16px;
  align-items: start;
}
```

### Center workspace

- Dùng 12 columns.
- Column gap: `16px`.
- Không đặt fixed width cho center; cho phép co giãn.

```css
.center-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 16px;
}
```

## 4.3 Desktop canonical · 1440px

- Sidebar: `232px` nếu dùng bản product shell chuẩn mới.
- Main padding: `24px`.
- Evidence rail: `104px`.
- Gap: `16px`.
- Nếu mục tiêu là khớp chính xác screenshot hiện tại, giữ biến thể `shell.compactSidebar = 204px`.

**Khuyến nghị:** triển khai `204px` cho dashboard hiện tại; chuẩn bị token để có thể nâng lên `232px` ở phiên bản navigation mở rộng.

## 4.4 Max width

- Dashboard: không giới hạn max-width trong desktop app; tận dụng viewport.
- Trang đọc dài/prose: max-width `720px`.
- Form cấu hình: max-width `880px`.
- Modal: `560`, `720`, `960px` theo size token.

---

# 5. Anatomy màn hình Dashboard tổng quan

## 5.1 Phân vùng dọc

Tại viewport `1536 × 1024`:

| Vùng | Y bắt đầu | Chiều cao | Ghi chú |
|---|---:|---:|---|
| Top bar | 22 | 60 | Không dùng card nền kín toàn chiều ngang |
| KPI row | 98 | 122 | 4 card |
| Project components | 234 | 218 | 1 panel chứa 4 card |
| Operational zone | 468 | 368 | 2 cột |
| Repository/risk row | 852 | 144 | Nằm cuối viewport |

Sai số cho phép khi dev implement: `±4px` theo font rendering, nhưng tổng nhịp dọc phải giữ.

## 5.2 Top bar

### Kích thước

- Height hiệu dụng: `60px`.
- Title block xếp trái.
- Control block xếp phải.
- Không đặt border bottom toàn màn hình; chỉ dùng khoảng trắng.

### Title

- Page title: `24/32px`, weight `600`.
- Subtitle: `13/18px`, `text.secondary`.
- Gap title → subtitle: `2px`.

### Controls bên phải

Thứ tự:

1. Provenance status control.
2. Divider dọc `1px × 28px`.
3. Search icon button.
4. Notification icon button.
5. User avatar + name + role + chevron.

Thông số:

- Icon button: `40 × 40px`.
- Icon: `20 × 20px`, stroke `1.5px`.
- Gap giữa controls: `8px`; gap trước user: `12px`.
- Avatar: `36 × 36px`.
- Provenance control: min-width `160px`, height `40px`, radius `10px`.
- Green live dot: `6 × 6px`, box-shadow green glow.

## 5.3 KPI row

- 4 card bằng nhau.
- Grid: `repeat(4, minmax(0, 1fr))`.
- Gap: `16px`.
- Height: `122px`.
- Radius: `12px`.
- Padding: `18px 20px`.
- Border: `1px solid color.border.subtle`.

### Nội dung card

- Eyebrow: `13/18px`, weight `500`.
- Metric: `40/44px`, weight `650`.
- Unit nằm trên baseline metric, `13/18px`.
- Supporting metadata: `12/18px`, bottom-left.
- Illustration: neo bottom-right, chiếm tối đa `42%` chiều rộng card.
- Illustration opacity: `0.72`.

### Mapping semantic

| Card | Accent | Nội dung |
|---|---|---|
| CUNG | blue/cyan | Supply/capability |
| CẦU | purple | Policy/demand |
| Engine | amber | Computation/caution |
| Site `.touch` Hub | green/cyan | Live/registry |

Chỉ dùng **một accent family trên mỗi card**.

## 5.4 Panel “4 CẤU PHẦN DỰ ÁN”

- Height: `218px`.
- Padding ngoài: `12px` trên, `12px` hai bên, `14px` dưới.
- Section eyebrow: `12/16px`, uppercase, tracking `0.08em`.
- Gap eyebrow → card row: `10px`.
- Card row: 4 cột, gap `14px`.

### Project component card

- Height: `182px`.
- Radius: `12px`.
- Padding: `14px`.
- Header height: `28px`.
- Number tile: `22 × 22px`, radius `6px`.
- Status chip: height `24px`.
- Checklist row: min-height `24px`.
- Checkbox icon: `16px`.
- Footer divider: margin-top `10px`.
- Footer: `Version` trái, hash giữa, date phải.
- Hash dùng `type.mono.01`.

## 5.5 Operational zone

```css
.operational-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.16fr) minmax(380px, 0.84fr);
  gap: 16px;
}
```

### Left · Hai chiều dữ liệu

- Panel tổng: height `368px`.
- Hai chart card phía trên: `1fr 1fr`, gap `16px`.
- Chart card height: `214px`.
- Vùng ambiguity + match: height `118px`, margin-top `12px`.

#### Donut chart

- Outer diameter: `100px`.
- Stroke: `16px`.
- Center metric: `24/28px`, weight `650`.
- Center label: `11/14px`.
- Legend marker: `8 × 8px`, radius `2px`.
- Legend row gap: `8px`.
- Không dùng 3D, bevel hoặc shadow chart.

#### Match locked panel

- Border: `1px dashed color.accent.blue`.
- Radius: `14px`.
- Fill: `rgba(47,107,255,0.035)`.
- Icon area: `84px` wide.
- Lock icon: `30px`.
- Title: `14/20px`, uppercase hoặc small-title.
- CTA link ở footer chỉ xuất hiện khi có route chi tiết.

### Right · Risk + work queue

#### Critical deadline card

- Height: `128px`.
- Border: `1px solid rgba(239,68,68,0.72)`.
- Background: `linear-gradient` chỉ được dùng như **single-hue red tint**, không dùng đa sắc:

```css
background:
  radial-gradient(circle at 90% 10%, rgba(239,68,68,.12), transparent 42%),
  rgba(57, 10, 20, .34);
```

- Title: red, `14/20px`, weight `600`.
- Risk badge: top-right.
- Countdown block: width `96px`, min-height `72px`.
- Main countdown: `32/36px`, tabular nums.
- Supporting text tối đa 3 dòng.

#### Work queue

- Height còn lại: `224px`.
- Header: `32px`.
- Row height: `36px` hoặc `40px` nếu 2 dòng.
- Priority marker: `20 × 20px`.
- Owner column: `48px`.
- Text description: clamp 2 lines.
- Hover: tăng surface + border blue nhẹ.

## 5.6 Repository row

- Height: `144px`.
- Left cluster: 3 repository cards bằng nhau.
- Right: risk version card.
- Gap: `16px`.
- Layout ratio: `3fr 1.25fr`.

### Repository card

- Height: `112px` bên trong panel.
- Git icon frame: `36 × 36px`.
- Repo name: `14/20px`, weight `600`.
- Remote path: `11/16px`, muted.
- Visibility chip ở top-right.
- Footer divider.
- Hash amber, monospace.

## 5.7 Evidence Registry rail

- Width: `110px`.
- Border: `1px solid color.border.subtle`.
- Radius: `16px`.
- Min-height: `768px` ở viewport chuẩn.
- Position: sticky, top `22px`.
- Padding: `16px 12px`.
- Title: center, `12/17px`, uppercase.
- Verification ring: `72 × 72px`.
- Checklist icon: `16px`.
- Checklist gap: `14px`.
- Divider vertical spacing: `22px`.
- Gate shield: `56px`.
- CTA button: width `100%`, height `36px`.

Ở trang không liên quan provenance, rail có thể collapse thành nút `48px`, nhưng dashboard luôn mở.

---

# 6. Sidebar component

## 6.1 Geometry

- Width: `204px` trong dashboard reference.
- Height: `100dvh`.
- Position: fixed hoặc sticky top `0`.
- Border-right: `1px solid color.border.subtle`.
- Background: `color.bg.sidebar`.
- Padding ngang: `14px` cho nav, brand dùng `24px`.

## 6.2 Navigation

- Nav item height: `48px`.
- Gap: `4px` hoặc `6px` tùy nhóm; không quá `8px`.
- Radius: `10px`.
- Padding: `0 12px`.
- Icon frame: `20px`.
- Icon → label gap: `12px`.
- Label: `13/18px`, weight `450-500`.

### Active state

```css
background: rgba(47,107,255,.12);
border: 1px solid #2F6BFF;
box-shadow: inset 0 0 20px rgba(47,107,255,.06), var(--glow-blue);
color: #DDEBFF;
```

### Hover state

- Background `rgba(148,163,184,.06)`.
- Icon chuyển từ muted sang secondary.
- Transition `120ms`.

### Focus state

- `outline: 2px solid color.border.focus`.
- `outline-offset: 2px`.

## 6.3 Project context card

- Margin-top: `24px`.
- Radius: `12px`.
- Padding: `14px`.
- Min-height: `142px`.
- Background: `color.bg.surface.1`.
- Border: subtle.
- Project name phải render `.touch` đúng brand.

## 6.4 Footer brand

- Neo ở đáy sidebar khi chiều cao đủ.
- Không che navigation khi viewport thấp; chuyển sang document flow và cho sidebar scroll.
- Visual wave/dot pattern chỉ dùng opacity `0.14`.

---

# 7. Component system

## 7.1 Surface/Card

### Variants

- `default`
- `accent-blue`
- `accent-purple`
- `accent-amber`
- `accent-green`
- `danger`
- `dashed`
- `interactive`

### Base spec

```css
.card {
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  background: var(--surface-1);
  color: var(--text-primary);
}
```

### Interactive state

- Hover translate tối đa `-1px`.
- Border tăng sáng.
- Không scale card.
- Active không animate bounce.

## 7.2 Status badge

- Height: `24px`.
- Padding ngang: `10px`.
- Radius: `999px` hoặc `8px` tùy density; trong dashboard dùng `999px` cho status, `8px` cho visibility.
- Text: `11/16px`, weight `600`.

| Status | Foreground | Fill | Border |
|---|---|---|---|
| PASS | green | green subtle | green 45% |
| LIVE | green/cyan | teal dark | green 45% |
| RISK | red | red subtle | red 55% |
| Private | amber | amber subtle | amber 45% |
| Public | blue | blue subtle | blue 45% |
| POC | cyan | teal dark | cyan 45% |
| On hold | muted | surface 2 | border subtle |

Status không được chỉ phân biệt bằng màu; luôn có text hoặc icon.

## 7.3 Button

### Size

| Size | Height | Padding X | Icon |
|---|---:|---:|---:|
| sm | 32 | 12 | 16 |
| md | 40 | 14 | 18 |
| lg | 48 | 18 | 20 |

### Primary

- Fill: `#174FC4` hoặc `color.accent.blue` tùy contrast.
- Text: white.
- Border: blue bright.
- Hover: sáng hơn 6-8%.
- Không gradient.

### Secondary

- Surface transparent/surface 1.
- Border strong.
- Hover surface 2.

### Ghost

- Không border mặc định.
- Hover fill subtle.

### Danger

- Fill red.
- Chỉ dùng cho destructive action thực sự.

## 7.4 Input/Search

- Height: `40px`.
- Radius: `10px`.
- Border: subtle.
- Horizontal padding: `12px`.
- Search icon frame: `20px`.
- Placeholder: text.muted.
- Focus: blue border + focus ring.
- Error: red border, không rung animation.

## 7.5 Table/List

- Header height: `36px`.
- Row mặc định: `52px`.
- Compact row: `40px`.
- Cell padding X: `12px`.
- Column gap: `16px`.
- Divider: hairline.
- Hover: surface 2.
- Selected: blue subtle + blue border.
- Sticky header khi list trên `12` rows.
- Numeric column dùng tabular nums, align right.
- ID/hash dùng monospace.

## 7.6 Tooltip

- Max-width: `280px`.
- Padding: `8px 10px`.
- Radius: `8px`.
- Body: `12/18px`.
- Delay open: `350ms` desktop, không delay keyboard.

## 7.7 Modal

- Radius: `20px`.
- Header height: tối thiểu `64px`.
- Footer height: `64px`.
- Padding: `24px`.
- Backdrop blur: `8px`, có fallback không blur.
- Esc đóng trừ critical irreversible flow.

## 7.8 Drawer

- Desktop width: `480px` hoặc `640px`.
- Mobile: full width.
- Animation: `260ms emphasis`.
- Evidence detail ưu tiên drawer để không mất context.

---

# 8. Iconography

- Bộ icon: `lucide-react` hoặc Lucide tương ứng stack.
- Stroke mặc định: `1.5px`.
- Corner style: rounded.
- Kích thước mặc định: `20 × 20px`.
- Icon nhỏ: `16px`.
- Icon hero: `32`, `40`, `56px`.
- Touch target tối thiểu: `40 × 40px` desktop; `44 × 44px` mobile.
- Không trộn filled icon với outline icon trong cùng navigation.
- Logo GitHub có thể dùng brand icon riêng; các icon hệ thống còn lại dùng Lucide.

---

# 9. Data visualization

## 9.1 Semantic palette

- Supply: blue → cyan.
- Demand/policy: purple.
- Engine: amber.
- Verified/live: green.
- Risk/deadline: red.
- Unknown/deferred: slate.

## 9.2 Chart rules

- Không quá 5 màu trong một chart.
- Mỗi chart phải có title, unit và legend hoặc direct labels.
- Tooltip phải hiển thị giá trị tuyệt đối và tỷ lệ nếu có.
- Donut tối thiểu 2 segments, tối đa 5.
- Ring thickness 14-18% đường kính.
- Gridline opacity `0.12`.
- Không dùng gradient rainbow.
- Không animate liên tục.

## 9.3 Number formatting

- `124 claim`, không viết `124 Claims` trong giao diện Việt.
- Percentage: `17.5%`, tối đa 1 chữ số thập phân.
- Count lớn: dùng phân cách locale Việt khi trên 999.
- Countdown: tabular nums.

---

# 10. Page families

## 10.1 Executive Dashboard

Mục tiêu:

- Tổng quan KPI.
- Deadline/gate.
- Hai chiều dữ liệu.
- Repo và version.
- Evidence health.

Template:

- Sidebar mở.
- Topbar đầy đủ.
- Center workspace + evidence rail.
- Không quá 4 KPI card top-level.

## 10.2 Evidence Registry

Bố cục:

- Left filter rail: `240-280px`.
- Center table/detail: flexible.
- Right evidence inspector: `320-400px`.

Nội dung:

- Claim.
- Source.
- Snapshot.
- Span.
- Verification state.
- Corroboration.
- Contradiction.

## 10.3 Matching Workbench

Desktop layout:

```text
Demand/filter rail       280px
Candidate workspace      flexible
Evidence/human rail      320px
Sticky decision footer    64px
```

Mỗi candidate match phải hiển thị:

- Confidence score.
- Vì sao match.
- Key evidence.
- Missing evidence.
- Contradictions.
- Human decision.

Không hiển thị score mà thiếu explanation.

## 10.4 Repository / Dataset View

- Asset table.
- Version and commit.
- Snapshot count.
- Coverage.
- Lineage.
- Dependency.
- Gate history.

Metadata version luôn visible khi trust matters.

## 10.5 Admin & Settings

- Theme.
- Team/roles.
- Tokens/read-only design version.
- Integrations.
- Provenance policy.
- Audit settings.

Không dùng dashboard KPI decorations trong trang settings.

---

# 11. Responsive behavior

## 11.1 Breakpoints

```css
--bp-mobile: 390px;
--bp-tablet: 768px;
--bp-tablet-wide: 1024px;
--bp-desktop: 1280px;
--bp-desktop-xl: 1440px;
```

## 11.2 ≥ 1440px

- Sidebar mở.
- Evidence rail mở.
- KPI 4 cột.
- Project components 4 cột.
- Operational zone 2 cột.

## 11.3 1280-1439px

- Sidebar `204px`.
- Evidence rail có thể collapse thành icon rail `56px`.
- KPI vẫn 4 cột nếu card min-width `220px`; nếu không, 2×2.
- Main padding `20px`.

## 11.4 1024-1279px

- Sidebar collapse thành icon rail `64px`.
- Evidence rail thành drawer.
- KPI 2×2.
- Project components 2×2.
- Operational zone một cột.
- Right risk panel đặt ngay sau KPI.

## 11.5 768-1023px

- Sidebar hidden, mở bằng drawer.
- Topbar compact.
- Main padding `16px`.
- Grid 8 columns.
- Tất cả panel stack.
- Table chuyển sang horizontal scroll hoặc row cards theo nội dung.

## 11.6 < 768px

- Grid 4 columns.
- Main padding `12px`.
- Topbar height `56px`.
- Logo compact.
- KPI 1 cột hoặc horizontal snap carousel; ưu tiên 1 cột cho accessibility.
- Card padding `16px`.
- Evidence detail full-screen drawer.
- Sticky bottom action có safe-area padding.

---

# 12. Theme behavior

## 12.1 Dark-first

Dark theme là mặc định của product dashboard.

```html
<html data-theme="dark">
```

## 12.2 Light theme

Khi chuyển light:

- Dấu chấm vẫn `#FF3830`.
- `touch` chuyển `#0B1220`.
- Glow giảm 50%.
- Surface dùng trắng/xám lạnh.
- Border tăng contrast đủ để card không hòa nền.
- Red danger không được dùng text đỏ nhạt trên trắng; dùng `#B42318` cho text critical nếu cần.

## 12.3 Theme persistence

- Lưu lựa chọn ở local storage và tài khoản nếu có.
- Initial render phải tránh flash sai theme.
- Tôn trọng `prefers-color-scheme` khi user chưa chọn.

---

# 13. Accessibility

Mục tiêu tối thiểu: WCAG 2.2 AA.

## 13.1 Contrast

- Body text: ≥ `4.5:1`.
- Large text: ≥ `3:1`.
- UI boundary quan trọng: ≥ `3:1`.
- Muted text không dùng cho thông tin bắt buộc.

## 13.2 Keyboard

- Tất cả control focusable theo thứ tự DOM hợp lý.
- Sidebar nav dùng link thật.
- `Esc` đóng popover/drawer/modal.
- `Enter/Space` kích hoạt button.
- Không chỉ show action khi hover.

## 13.3 Screen reader

- KPI có accessible label đầy đủ.
- Chart có summary text và data table ẩn hoặc accessible alternative.
- Status chip không chỉ đọc `PASS`; đọc cả đối tượng và trạng thái.
- Icon trang trí `aria-hidden="true"`.

## 13.4 Motion

Với reduced motion:

- Tắt pulse live dot.
- Tắt count-up.
- Drawer chuyển fade nhanh.
- Không dùng animated background mesh.

---

# 14. Nội dung và microcopy

## 14.1 Ngôn ngữ

- UI có thể tiếng Việt trước.
- Tên domain, repo, commit giữ nguyên.
- Không tự dịch `claim`, `gate`, `snapshot` nếu đội dự án đã dùng như thuật ngữ chuẩn; nên có tooltip/glossary.

## 14.2 Casing

- Page title: sentence case.
- Card title: sentence case.
- Section eyebrow: uppercase.
- Status: uppercase ngắn.
- Repo path: lowercase nguyên bản.

## 14.3 Risk copy

Risk card phải trả lời đủ:

1. Cái gì đang nghẽn.
2. Vì sao quan trọng.
3. Ai chịu trách nhiệm.
4. Deadline nào.
5. Hành động tiếp theo.

Không viết cảnh báo chung chung như “Có vấn đề cần xử lý”.

---

# 15. Engineering architecture đề xuất

Không bắt buộc framework, nhưng cấu trúc sau phù hợp React/Next.js.

```text
src/
  app/
    (dashboard)/
      layout.tsx
      page.tsx
      evidence/
      matching/
      repositories/
      risks/
      settings/
  components/
    brand/
      TouchLogo.tsx
    shell/
      AppShell.tsx
      Sidebar.tsx
      TopBar.tsx
      EvidenceRail.tsx
    cards/
      KpiCard.tsx
      ProjectComponentCard.tsx
      RiskCard.tsx
      RepositoryCard.tsx
    data/
      DonutChart.tsx
      Metric.tsx
      StatusBadge.tsx
      DataList.tsx
    feedback/
      EmptyState.tsx
      Skeleton.tsx
      ErrorState.tsx
    primitives/
      Button.tsx
      Input.tsx
      Card.tsx
      Tooltip.tsx
  design-system/
    tokens.json
    tokens.css
    theme.ts
    component-variants.ts
  lib/
    format.ts
    a11y.ts
    provenance.ts
```

## 15.1 Component API mẫu

```ts
export type SemanticTone =
  | "neutral"
  | "blue"
  | "cyan"
  | "purple"
  | "amber"
  | "green"
  | "red";

export interface KpiCardProps {
  title: string;
  value: string | number;
  unit?: string;
  metadata?: string;
  tone: SemanticTone;
  illustration?: React.ReactNode;
  href?: string;
  status?: "idle" | "loading" | "error";
}
```

## 15.2 Không gắn màu trực tiếp vào data

Sai:

```ts
{ status: "pass", color: "#22C55E" }
```

Đúng:

```ts
{ status: "pass", tone: "green" }
```

Component map `tone` sang token.

## 15.3 Data states bắt buộc

Mỗi component dữ liệu phải có:

- `loading`
- `empty`
- `error`
- `stale`
- `success`
- `partial`

Không render `0` khi data chưa tải.

---

# 16. CSS implementation starter

## 16.1 Reset tối thiểu

```css
*, *::before, *::after { box-sizing: border-box; }
html { color-scheme: dark; }
body {
  margin: 0;
  min-width: 320px;
  min-height: 100dvh;
  background: var(--bg-canvas);
  color: var(--text-primary);
  font-family: Inter, ui-sans-serif, -apple-system, BlinkMacSystemFont,
    "Segoe UI", sans-serif;
  font-size: 14px;
  line-height: 1.5;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}
button, input, textarea, select { font: inherit; }
button { color: inherit; }
a { color: inherit; text-decoration: none; }
```

## 16.2 Brand component

```css
.brand-lockup {
  display: inline-flex;
  align-items: baseline;
  color: var(--brand-word);
  font-size: 36px;
  line-height: 40px;
  font-weight: 700;
  letter-spacing: -0.04em;
}
.brand-lockup__dot {
  width: 10px;
  height: 10px;
  margin-right: 4px;
  transform: translateY(-1px);
  border-radius: 999px;
  background: var(--brand-dot);
  box-shadow: 0 0 16px rgba(255, 56, 48, .20);
  flex: 0 0 auto;
}
```

## 16.3 Dashboard grid

```css
.dashboard-content {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 110px;
  gap: 16px;
}
.dashboard-center { min-width: 0; }
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}
```

## 16.4 Panel

```css
.panel {
  border: 1px solid var(--border-subtle);
  border-radius: 16px;
  background:
    linear-gradient(180deg, rgba(255,255,255,.008), transparent 40%),
    var(--surface-1);
  box-shadow: 0 12px 40px rgba(0,0,0,.18);
}
```

---

# 17. Visual regression và QA

## 17.1 Screenshot matrix

Bắt buộc chụp:

- `1536 × 1024` dark.
- `1440 × 900` dark.
- `1280 × 800` dark.
- `1024 × 768` dark.
- `390 × 844` dark.
- `1536 × 1024` light.

## 17.2 Pixel diff threshold

- Global diff: `< 0.75%` sau khi baseline đã được duyệt.
- Brand lockup, top KPI và risk card: `< 0.25%`.
- Font anti-aliasing có thể mask nhẹ; không mask spacing, border hoặc geometry.

## 17.3 Checklist trước merge

### Visual

- [ ] Logo `.touch` đúng dấu chấm đỏ.
- [ ] `touch` trắng ở dark, đen ở light.
- [ ] Không có màu ad hoc.
- [ ] Card cùng cấp thẳng hàng.
- [ ] Border 1px, không dày bất thường.
- [ ] Glow chỉ ở semantic focus.
- [ ] KPI không vỡ dòng ở 1536 và 1440.

### Token fidelity

- [ ] Component chỉ dùng CSS variables/token map.
- [ ] Không có hex ngoài file token, trừ asset/chart runtime được phê duyệt.
- [ ] Spacing là bội số 4.
- [ ] Radius thuộc token set.
- [ ] Motion thuộc token set.

### Responsive

- [ ] Sidebar chuyển trạng thái đúng breakpoint.
- [ ] Evidence rail thành drawer dưới desktop.
- [ ] KPI 4 → 2 → 1 cột đúng quy tắc.
- [ ] Không horizontal overflow ngoài table/chart được phép.

### Accessibility

- [ ] Focus visible.
- [ ] Contrast AA.
- [ ] Icon button có accessible name.
- [ ] Chart có text alternative.
- [ ] Reduced motion hoạt động.
- [ ] Keyboard hoàn thành toàn bộ flow chính.

### Content/data

- [ ] Loading không hiển thị số giả.
- [ ] Error có retry hoặc hướng xử lý.
- [ ] Risk có owner và deadline.
- [ ] Version/hash dùng monospace.
- [ ] Provenance state luôn truy cập được.

---

# 18. Definition of Done cho dashboard đầu tiên

Dashboard chỉ được coi là hoàn tất khi:

1. Khớp layout và cảm giác thị giác của mock tại `1536 × 1024`.
2. Toàn bộ màu, spacing, radius, typography đi qua token.
3. Có dark và light theme đúng brand.
4. Có đầy đủ loading/empty/error/stale states.
5. Responsive tới mobile.
6. Keyboard và screen reader dùng được.
7. Visual regression chạy trong CI.
8. Không có hardcoded color trong component.
9. Evidence rail và risk workflow không bị rút gọn thành trang trí.
10. Các component dùng lại được cho Evidence Registry, Matching Workbench, Repository View và Settings.

---

# 19. Quy tắc governance

- Mọi token mới cần proposal: tên, mục đích, ảnh hưởng dark/light, ví dụ dùng.
- Không ship component variant mới nếu chưa định nghĩa đủ default, hover, active, focus, disabled, loading và error.
- Không sửa token global để chữa một component riêng.
- Mọi chart mới phải có semantic legend.
- Mọi page mới phải qua review theo handbook.
- Phiên bản design system dùng semantic versioning:
  - Patch: sửa token không đổi ý nghĩa.
  - Minor: thêm component/token tương thích.
  - Major: thay đổi API hoặc visual contract.

---

# 20. Bàn giao cho dev

Bộ bàn giao tối thiểu gồm:

- `TOUCH_UI_DEVELOPER_HANDBOOK.md`
- `touch-design-tokens.json`
- `touch-theme.css`
- Mock dashboard gốc.
- 4 poster blueprint.
- Storybook hoặc component playground.
- Visual regression baseline.
- Release note cho mỗi thay đổi design system.

**Thông điệp khóa:** `.touch` mở rộng bằng kỷ luật thiết kế, provenance, phân cấp rõ ràng và quyết định có thể lặp lại. Không hy sinh tính nhất quán để làm một màn hình riêng lẻ “đẹp hơn”.
