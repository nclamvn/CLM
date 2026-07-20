# .touch Visual Fidelity Gap Report

**Mã tài liệu:** TOUCH-VFGR-2026-07-19  
**Phiên bản:** 1.0  
**Ngày đánh giá:** 19/07/2026  
**Phạm vi:** Landing `/`, Hub `/hub`, Dashboard `/dashboard`, lớp thiết kế dùng chung  
**Ảnh tham chiếu chính:** Mock Landing + Hub đã duyệt 1536 × 1024  
**Ảnh implementation quan sát trực tiếp:** Landing hiện tại 2048 × 1283  
**Mục tiêu:** Xác định chính xác khoảng cách giữa implementation và mock, ưu tiên công việc theo tác động thị giác, khóa tiêu chí nghiệm thu để portal đạt chất lượng executive cao cấp.

---

# 1. Kết luận điều hành

## 1.1 Phán quyết

Implementation hiện tại **đúng hướng về kiến trúc, dữ liệu và kỷ luật kỹ thuật**, nhưng **chưa đạt về visual fidelity**. Khoảng cách lớn nhất nằm ở art direction, signature graphics, vật liệu bề mặt, ánh sáng, mật độ thông tin và nhịp kể chuyện.

Đánh giá trực tiếp Landing hiện tại so với mock:

| Lớp đánh giá | Mức đạt ước lượng |
|---|---:|
| Kiến trúc nội dung | 82% |
| Truth-state và tính trung thực | 94% |
| Routing và tương tác cốt lõi | 85% |
| Geometry cấp lớn | 62% |
| Typography hierarchy | 68% |
| Surface, border, shadow, lighting | 48% |
| Signature graphics | 34% |
| Data visualization art direction | 46% |
| Motion và ambient behavior | 55% |
| Visual storytelling | 45% |
| Cảm giác cao cấp tổng thể | 42% |
| **Visual fidelity tổng hợp** | **49 đến 54%** |

**Kết luận:** Gate logic có thể PASS, nhưng Gate visual hiện tại phải giữ trạng thái **FAIL**.

## 1.2 Bản chất vấn đề

Đây không phải một danh sách lỗi CSS nhỏ. Vấn đề có tính hệ thống:

1. Mock được art-direct như một sản phẩm intelligence cao cấp.
2. Implementation vẫn mang cảm giác một app dark theme tốt được mở rộng thành landing.
3. Component đã đúng chức năng nhưng chưa có đủ lớp tạo hình.
4. Token nền đã tốt nhưng recipe ghép token vào từng component chưa đủ cụ thể.
5. Graphics hiện tại thiên về sơ đồ kỹ thuật, trong khi mock dùng data-art có chiều sâu, ánh sáng và nhịp thị giác.

## 1.3 Điểm mạnh cần giữ nguyên

Không nên phá các phần đã đúng trong quá trình nâng fidelity:

- Design tokens Pha 0.
- Inter và glyph tiếng Việt.
- TouchBrand component.
- Token guard và clean-CI.
- Truth-state `REAL`, `DEMO`, `SYNTHETIC`, `SCAFFOLD`.
- Dữ liệu thật `14 đơn vị`, `64 claim`, `7 nguồn`.
- Honest-null cho match thật chưa chạy.
- Responsive architecture và focus management.
- PortalSwitcher và route contracts.
- Deterministic SSR, không random client cho dữ liệu minh họa.

---

# 2. Cơ sở đánh giá và giới hạn

## 2.1 Artifact quan sát

- Mock chuẩn: 1536 × 1024.
- Screenshot Landing hiện tại: 2048 × 1283.
- Blueprint Portal hiện hành.
- Báo cáo gate kỹ thuật từ các increment L-Reset.
- Các screenshot Dashboard và Hub trong chuỗi review trước.

## 2.2 Cảnh báo quan trọng về pixel comparison

Screenshot hiện tại và mock **khác kích thước và khác tỷ lệ**:

| Artifact | Kích thước | Tỷ lệ |
|---|---:|---:|
| Mock | 1536 × 1024 | 1.500 |
| Landing hiện tại | 2048 × 1283 | 1.596 |

Do đó:

- Không được tuyên bố pixel overlay dưới 5% từ hai artifact này.
- Không resize một ảnh để cưỡng ép trùng ảnh kia rồi dùng làm bằng chứng.
- Cần capture lại ở đúng `1536 × 1024`, DPR 1, browser chrome ẩn, production build.
- Báo cáo này đánh giá fidelity theo hình học tương đối, ngôn ngữ thị giác, thành phần và art direction.

## 2.3 Thứ tự nguồn chuẩn

Khi có mâu thuẫn:

1. Quyết định trực tiếp đã được chủ dự án duyệt.
2. Mock visual đã duyệt.
3. Blueprint Portal.
4. Design tokens và component contracts Pha 0.
5. Implementation hiện tại.

---

# 3. Scorecard toàn portal

## 3.1 Landing

| Hạng mục | Mức đạt | Độ tin cậy | Ghi chú |
|---|---:|---:|---|
| Nav | 72% | Cao | Khung sạch, thiếu finesse và depth |
| Hero copy | 70% | Cao | Đúng ba dòng, vẫn cần cân tỷ lệ với stage |
| Hero stage | 38% | Cao | Thiếu data globe cao cấp và orbital system |
| Match Stream | 52% | Cao | Đúng logic, còn giống utility card |
| Tape | 55% | Cao | Truth đúng, rhythm và clipping chưa tốt |
| Metrics | 54% | Cao | Data đúng, visual còn dashboard-like |
| Pipeline | 58% | Trung bình | Logic mạnh, visual chưa đủ signal density |
| Matrix | 57% | Trung bình | Grid đúng, thiếu depth và legend refinement |
| Provenance | 52% | Trung bình | Đúng graph contract, chưa đạt data-art |
| Interpolation | 58% | Trung bình | Phân biệt trạng thái đúng, treatment chưa premium |
| Verticals | 35% | Thấp | Chưa rebuild hoàn chỉnh theo mock |
| Pillars | 35% | Thấp | Chưa rebuild hoàn chỉnh theo mock |
| CTA | 40% | Thấp | Implementation cũ từng lệch concept |
| Footer | 42% | Thấp | Chưa khóa theo mock cuối |
| **Tổng Landing** | **51%** | **Cao** | Visual Gate FAIL |

## 3.2 Hub

Đánh giá Hub dựa trên mock và trạng thái prototype đã mô tả, không có screenshot production mới nhất trong lượt này.

| Hạng mục | Mức đạt ước lượng | Độ tin cậy | Ghi chú |
|---|---:|---:|---|
| Information architecture | 76% | Trung bình | Khung app hợp lý |
| Topbar và rail | 62% | Trung bình | Chưa đủ premium depth |
| KPI | 55% | Trung bình | Thiếu signature visuals |
| Match list | 68% | Trung bình | Tương tác wired, visual còn utility |
| Match detail | 62% | Trung bình | Cần tăng provenance hierarchy |
| Registry REAL | 72% | Trung bình | Giá trị dữ liệu tốt, table art chưa cao |
| Demand honest-null | 70% | Trung bình | Contract đúng, visual cần tinh tế |
| Provenance chain | 54% | Trung bình | Chưa đạt mock về node, light, timeline |
| Trust layer | 42% | Trung bình | Vouch còn scaffold |
| **Tổng Hub** | **60%** | **Trung bình** | Chưa Gate visual |

## 3.3 Dashboard

Dashboard đã đi xa hơn Landing về polish và responsive, nhưng chưa hoàn tất pixel overlay chính thức.

| Hạng mục | Mức đạt ước lượng | Độ tin cậy |
|---|---:|---:|
| App shell | 82% | Cao |
| KPI signature | 78% | Cao |
| Evidence rail | 83% | Cao |
| Supply-demand panel | 75% | Cao |
| Risk and queue | 78% | Cao |
| Responsive | 88% | Cao |
| Visual regression | 60% | Trung bình |
| **Tổng Dashboard** | **78%** | **Cao** |

## 3.4 Unified portal

| Lớp | Mức đạt |
|---|---:|
| Brand consistency | 74% |
| Token consistency | 92% |
| Truth-state consistency | 93% |
| Navigation consistency | 82% |
| Visual language consistency | 58% |
| Signature graphics consistency | 46% |
| **Tổng portal** | **64% về hệ thống, 54% về hình ảnh** |

---

# 4. Landing: Gap report chi tiết

# 4.1 Capture và geometry baseline

## VF-L-001: Artifact chưa cùng viewport

**Severity:** BLOCKER  
**Tác động:** Không thể nghiệm thu pixel fidelity.

### Hiện trạng

- Screenshot là 2048 × 1283.
- Mock là 1536 × 1024.
- Tỷ lệ khung khác nhau.

### Rủi ro

- Hero có thể trông đúng ở viewport đang xem nhưng sai ở chuẩn nghiệm thu.
- Metrics và section sau có thể xuất hiện sai vị trí trong fold.
- Không đo chính xác chiều cao Nav, Hero, Tape và Metrics.

### Hành động

Capture bắt buộc:

```ts
const context = await browser.newContext({
  viewport: { width: 1536, height: 1024 },
  deviceScaleFactor: 1,
  reducedMotion: "reduce",
});
```

### Acceptance

- PNG đúng 1536 × 1024.
- Không browser chrome.
- Không dev badge.
- Không automation overlay.
- Font load hoàn tất trước capture.

---

# 4.2 Navigation

## VF-L-002: Nav đúng cấu trúc nhưng chưa đủ executive finesse

**Severity:** P1  
**Mức đạt:** 72%

### Điểm đã đúng

- TouchBrand đúng.
- Năm nav links đúng.
- ENGINE DEMO trung thực.
- PortalSwitcher có route thật.
- CTA đỏ đúng vai trò.

### Khoảng cách với mock

1. Header hiện tại có nhiều control cùng trọng lượng thị giác.
2. PortalSwitcher hơi lớn và giống control app hơn nav marketing.
3. CTA đỏ có cảm giác button ứng dụng, chưa phải CTA editorial cao cấp.
4. Khoảng cách links chưa tạo nhịp trung tâm tinh tế.
5. Nền header gần như một mặt phẳng duy nhất.

### Target

- Header 72px.
- Brand visual height 28px.
- Nav link 13/18, weight 500.
- PortalSwitcher thấp hơn CTA về visual emphasis.
- Header background canvas 88%, blur 18px.
- Border-bottom white alpha 6%.
- CTA shadow nhỏ, không halo rộng.

### Hành động cụ thể

- Giảm PortalSwitcher width hoặc padding ngang 8 đến 12px.
- Giảm contrast border PortalSwitcher một cấp.
- Tăng khoảng cách Engine badge và switcher 12px.
- Thêm divider dọc alpha thấp giữa status và portal control nếu mock có.
- Chỉ CTA có red glow, các control khác không glow.
- Active nav dùng underline 1px, không background pill.

### Acceptance

- Ở glance đầu, mắt đi theo thứ tự: Brand, Hero, CTA.
- Không control nào cạnh tranh với Hero title.
- Nav giữ height 72px ở 1536.

---

# 4.3 Hero copy

## VF-L-003: Copy đã đúng contract nhưng tỷ trọng vẫn nặng hơn mock

**Severity:** P1  
**Mức đạt:** 70%

### Điểm đã đúng

- Inter 700.
- Ba dòng đúng.
- Dòng đỏ đúng thương hiệu.
- Không serif.
- CTA và footnote có.

### Khoảng cách

- Title chiếm diện tích rất lớn so với stage.
- Trọng lượng chữ và độ sáng làm nửa trái nặng hơn nửa phải.
- Body copy hiện có độ dài và độ xám chưa đúng rhythm mock.
- Khoảng cách eyebrow đến title và title đến body chưa hoàn toàn tinh tế.

### Target

```text
Eyebrow       11/16, 600, tracking .12em
Title         56/60, 700, tracking -0.045em
Body          16/26, 400, max 520px
CTA margin    28px
Footnote      11/16
```

### Hành động

- Giữ 56/60, nhưng kiểm tra actual font metrics sau load.
- Hạ title brightness từ pure white sang text-primary token nếu đang quá trắng.
- Body không quá 3 dòng ở 1536.
- Giảm max width copy nếu stage bị yếu, không tăng title.
- Eyebrow dùng red hairline 24px trước text để tạo editorial anchor.

### Acceptance

- Line 3 không wrap.
- Title không vượt 60% chiều rộng copy column.
- Hero copy và globe có cân bằng 45/55 về visual mass.

---

# 4.4 Hero background và ambient composition

## VF-L-004: Canvas còn quá phẳng

**Severity:** P0  
**Mức đạt:** 40%

### Hiện trạng

- Nền đen sâu.
- Có red ambient glow bên stage.
- Grid đã giảm đúng.

### Khoảng cách

Mock có nhiều depth zone:

1. Navy-black canvas.
2. Blue atmospheric halo sau globe.
3. Red local glow quanh match nodes.
4. Orbital lines và starfield.
5. Gradient fade nối Hero xuống Tape.

Implementation hiện tại chủ yếu là black canvas và một red radial glow. Kết quả sạch nhưng chưa sang.

### Target recipe

```css
.hero-stage {
  background:
    radial-gradient(520px 360px at 72% 42%, var(--fx-blue-halo-12), transparent 66%),
    radial-gradient(300px 240px at 82% 58%, var(--fx-red-halo-10), transparent 72%),
    linear-gradient(180deg, var(--canvas-hero-top), var(--canvas-hero-bottom));
}
```

### Hành động

- Thêm blue halo rộng, alpha thấp.
- Red glow chỉ cục bộ, không phủ toàn quả cầu.
- Thêm starfield 60 đến 120 điểm, alpha 0.08 đến 0.18.
- Thêm vignette mềm ở bốn góc.
- Fade bottom vào Tape bằng gradient 40 đến 64px.

### Acceptance

- Nền không nhìn thấy grid rõ ở zoom 100%.
- Globe đọc được ngay cả khi tắt red nodes.
- Không có glow chạm mép viewport.

---

# 4.5 Hero signature globe

## VF-L-005: Globe hiện tại là wireframe kỹ thuật, mock là data globe cao cấp

**Severity:** P0 CRITICAL  
**Mức đạt:** 30 đến 38%

### Hiện trạng

- SVG deterministic.
- Meridian và parallel.
- Dot field.
- Red nodes và path.
- Annotations.

### Khoảng cách lớn

Mock có:

- Bề mặt địa cầu có geography hoặc dot-landmass.
- Orbital rings nhiều lớp.
- Cyan edge light.
- Blue core glow.
- Red network arcs bám theo bề mặt.
- Haze và particle field.
- Phần sáng và tối tạo cảm giác khối cầu 3D.

Globe hiện tại:

- Là hình cầu wireframe gần phẳng.
- Không có landmass rõ.
- Thiếu orbital system.
- Thiếu occlusion và depth.
- Red connection giống path 2D đặt lên SVG.
- Dot field chưa tạo cảm giác dữ liệu toàn cầu.

### Yêu cầu rebuild

Globe cần ít nhất 7 layer SVG:

1. `halo-back`
2. `sphere-body`
3. `landmass-dots`
4. `latitude-longitude`
5. `network-arcs-back`
6. `match-nodes-front`
7. `orbit-rings-and-labels`

### Kỹ thuật đề nghị

- Dùng `clipPath` cho landmass và grid.
- Dùng gradient radial cho sphere body.
- Dùng mask để fade trái và đáy.
- Network arc phía sau sphere opacity thấp hơn phía trước.
- Node có core 4px, ring 12px, glow 18px.
- Edge cyan 0.75 đến 1px.
- Orbit lines 0.5 đến 0.75px.
- 140 đến 220 dots deterministic.

### Không được dùng

- Raster screenshot của mock.
- Canvas random.
- Icon globe thư viện.
- Filter blur quá mạnh.
- Animation xoay liên tục nhanh.

### Acceptance

- Nhìn ở thumbnail vẫn nhận ra một data globe, không phải lưới tròn.
- Có ít nhất 3 lớp depth đọc được.
- Red nodes nằm trên bề mặt, không giống nổi trước mặt cầu.
- Globe không che annotations.

---

# 4.6 Globe annotations

## VF-L-006: Labels đang thiếu hierarchy và callout treatment

**Severity:** P1  
**Mức đạt:** 50%

### Hiện trạng

- Có Supply facts, Evidence registry, Provenance engine, Match proven.

### Gap

- Label nhỏ và gần wireframe, contrast thấp.
- Callout line chưa đồng nhất chiều dài và anchor.
- Một số label nằm trên đường sphere, giảm khả năng đọc.
- Thiếu visual distinction giữa data layer và outcome layer.

### Target

- Label 10/14 mono hoặc Inter label.
- Supply và Evidence dùng blue-gray.
- Match proven dùng red.
- Callout line 1px, có terminal dot 3px.
- Khoảng trống label ít nhất 8px khỏi geometry.

### Acceptance

- Không line nào cắt chữ.
- Mọi annotation đọc được ở zoom 100%.
- Tab order không bắt từng label nếu chỉ decorative.

---

# 4.7 Match Stream card

## VF-L-007: Card đúng logic nhưng còn giống utility widget

**Severity:** P1  
**Mức đạt:** 52%

### Điểm đúng

- DEMO rõ.
- Không tên doanh nghiệp thật.
- Static deterministic.
- Có match IDs và scores.

### Khoảng cách

- Card đứng độc lập hơn là gắn vào flow globe.
- Surface hơi giống Dashboard card.
- Typography mono chưa có hierarchy đủ tinh.
- Green score tạo cảm giác pass thật dù dữ liệu là demo.
- Thiếu connector rõ từ globe vào card.

### Hành động

- Đổi badge từ `MINH HỌA` sang component DataTruthBadge DEMO thống nhất.
- Score demo dùng cyan hoặc neutral, không green success nếu dễ hiểu là verified.
- Thêm red/cyan transfer line từ node vào cạnh card.
- Thêm inner top highlight 1px.
- Card width 286 đến 310px, height 142 đến 160px.
- Header 10/14, rows 11/18.
- Chỉ row active có red accent nhỏ.

### Acceptance

- Card là một phần của stage composition.
- Không người xem nào hiểu score là match thật.
- Không card che tâm globe.

---

# 4.8 Tape / Match Stream strip

## VF-L-008: Truth đúng nhưng strip đang clipping và quá utility

**Severity:** P1  
**Mức đạt:** 55%

### Dấu hiệu trực tiếp

Trong screenshot, phần đầu Tape bị cắt, chỉ còn một phần chữ như `TCH STREAM`. Đây là lỗi geometry hoặc animation offset.

### Gap

- Ticker lặp dày.
- Text và separators chưa đủ thoáng.
- Label REAL và SYNTHETIC cạnh số bị dính.
- Strip không có fade mask đầu và cuối.

### Hành động

- Container padding-inline 48px.
- Mask gradient 24px ở hai mép.
- Mỗi item gap 28 đến 36px.
- Separator dot 3px.
- Label state 10/14, metric 11/16.
- Pause khi hover hoặc focus.
- Reduced motion: render một hàng tĩnh không lặp.
- Không bắt đầu animation với item nằm ngoài left boundary.

### Acceptance

- `MATCH STREAM` hiển thị đầy đủ ở frame đầu.
- Không item nào bị cắt ở capture reduced-motion.
- Tape đúng 40px.

---

# 4.9 Metrics Band: composition

## VF-L-009: Metrics đang dùng ngôn ngữ Dashboard, chưa phải Landing

**Severity:** P0  
**Mức đạt:** 52 đến 58%

### Điểm đúng

- 14, 64, 7 là dữ liệu thật.
- Card 4 honest-null.
- Truth badges rõ.
- Sparkline có nhãn minh họa.

### Khoảng cách với mock

Mock có:

- Bốn card semantic riêng.
- KPI lớn và có trend visual.
- Card compact hơn.
- Glow và surface khác nhau theo ý nghĩa.
- Metric band gắn liền với Tape.

Implementation:

- Card lớn, nhiều khoảng trống.
- Surface khá giống nhau.
- Truth badge quá nổi so với metric.
- Card 4 trông disabled và chết.
- Sparkline chưa đủ art-directed.

### Target geometry

```text
Metrics section height     176px
Grid                       repeat(4, minmax(0,1fr))
Gap                        16px
Card padding               18px
Card radius                12px
KPI value                  42/46
Label                      13/18
Meta                       11/16
```

### Hành động

- Tạo `LandingMetricCard`, không reuse trực tiếp Dashboard KPI component.
- Accent family:
  - Units: blue.
  - Claims: purple hoặc cyan theo mock.
  - Sources: green hoặc amber tùy approved mock.
  - Match blocked/honest-null: red/neutral critical.
- Truth badge nhỏ hơn, đặt ở eyebrow line.
- Add semantic mini-illustration hoặc chart motif ở phía phải.
- Add chart grid tối đa 3 horizontal lines.

### Acceptance

- Bốn card có nhận diện khác nhau nhưng cùng anatomy.
- Không card nào trông disabled trừ khi control thật sự disabled.
- Card 4 truyền đạt blocker, không chỉ vắng dữ liệu.

---

# 4.10 Honest-null match card

## VF-L-010: `Chưa chạy` đúng nhưng chưa tạo giá trị thị giác

**Severity:** P1  
**Mức đạt:** 45%

### Hiện trạng

- Chưa chạy.
- Engine chưa chạy trên cung và cầu thật.

### Gap

- Giá trị muted, làm card giống placeholder chưa hoàn thiện.
- Không có blocker visual.
- Thiếu CTA hoặc deep link trạng thái dự án.

### Target

```text
MATCH CHỨNG MINH ĐƯỢC
CHƯA CHẠY
Thiếu dữ liệu CẦU thật
Xem trạng thái trong Dashboard →
```

### Hành động

- Dùng lock hoặc blocked-gate SVG nhỏ.
- Border red alpha thấp, không full danger.
- `CHƯA CHẠY` dùng text primary, không muted quá mức.
- Link tới `/dashboard` hoặc task dataset CẦU.

### Acceptance

- Honest-null vẫn là một card hoàn chỉnh.
- Người dùng hiểu lý do và bước tiếp theo trong 3 giây.

---

# 4.11 Sparkline system

## VF-L-011: Sparkline đúng chức năng, thiếu texture và hierarchy

**Severity:** P2  
**Mức đạt:** 60%

### Hành động

- Viewbox 120 × 48.
- Stroke 1.5px.
- Grid 2 đến 3 lines alpha 0.05.
- Area fill alpha 0.06.
- End point 3px.
- Label `MINH HỌA` không đặt đè lên line.
- Không dùng green success cho synthetic trend.

---

# 4.12 Pipeline + Matrix section framing

## VF-L-012: Hai component vẫn chưa thành một composition board

**Severity:** P0  
**Mức đạt:** 55 đến 60%

### Hiện trạng

- Pipeline đúng 7 gate.
- Gate 7 fail-loud.
- Matrix deterministic.
- Truth badge rõ.

### Gap

- Section vẫn đọc như hai card độc lập.
- Thiếu một shared ambient board hoặc visual bridge.
- Pipeline line chưa có energy progression như mock.
- Heatmap thiếu frame, legend và selected cell treatment tinh tế.

### Target structure

```text
Section eyebrow + title + narrative
┌──────────────────────────┬───────────────┐
│ Pipeline 7 gates         │ Matrix 6 × 8  │
│ shared surface board     │ shared board  │
└──────────────────────────┴───────────────┘
Shared footer note
```

### Hành động

- Dùng outer board surface chung.
- Hai module con dùng inset surfaces, không hai executive card tách biệt.
- Pipeline chiếm khoảng 64 đến 68% width.
- Matrix khoảng 32 đến 36%.
- Divider dọc alpha thấp.
- Shared background grid chỉ trong board.

### Acceptance

- Section đọc như một dây chuyền duy nhất.
- Matrix là context của pipeline, không phải widget bên cạnh.

---

# 4.13 Pipeline graphics

## VF-L-013: Logic mạnh, visual signal còn yếu

**Severity:** P1  
**Mức đạt:** 58%

### Gap

- Passed nodes giống các circle UI tiêu chuẩn.
- Connector line thiếu gradient energy.
- Blocked gate chưa tạo focal endpoint đủ mạnh.
- Labels nhỏ và dàn đều, thiếu rhythm.

### Target

- Main line 2px.
- Passed core 8px, outer ring 22px.
- Blocked core 8px, glow 28px.
- Green line fade dần sang red ở gate cuối.
- Tick labels 10/14.
- Outcome panel gắn trực tiếp vào gate 7 bằng connector.

### Acceptance

- Mắt đi từ gate 1 tới gate 7 tự nhiên.
- Gate 7 là focal point nhưng không neon gaming.

---

# 4.14 Matrix Heatmap

## VF-L-014: Matrix đúng grid, chưa đạt data-art

**Severity:** P1  
**Mức đạt:** 57%

### Gap

- Cell fill hơi phẳng.
- Không có subtle edge highlight.
- Legend chưa đủ rõ ở glance.
- Các row/column labels nhỏ và xa grid.
- Thiếu hover/focus glow local.

### Hành động

- Cell 24 đến 28px, gap 4px.
- Radius 4px.
- Fill scale 4 hoặc 5 mức, không random gradient.
- Inset top highlight 1px.
- Hover glow local tối đa 12px.
- Selected cell có border cyan 1px.
- Row label width cố định.

### Acceptance

- Matrix đọc được như một bản đồ, không chỉ bảng ô xanh.
- Không blur toàn grid.

---

# 4.15 Provenance Graph

## VF-L-015: Graph contract đúng, art direction chưa đủ cao

**Severity:** P1  
**Mức đạt:** 50 đến 55%

### Gap

- Node-link dễ trông như sơ đồ Mermaid.
- Node surface, core, halo chưa đủ phân tầng.
- Curves thiếu flow hierarchy.
- Source tier leaves chưa có visual material riêng.

### Target layers

- Match node: blue outer halo, dark core, ID.
- Supply node: blue.
- Demand node: green hoặc purple theo semantic.
- Source A/B/C: amber/gray/orange tier semantics.
- Direct proof edge: solid.
- Derived edge: dashed.
- Support edge: dotted.

### Hành động

- Arrowhead 4px.
- Node glow max 18px.
- Curves tránh labels.
- Add local starfield hoặc graph plane rất nhẹ.
- Add legend visual nhỏ, không paragraph.

### Acceptance

- Người xem phân biệt được match, claims và sources bằng hình, không cần đọc toàn bộ chữ.

---

# 4.16 Interpolation Chart

## VF-L-016: Chart đúng semantics, thiếu premium chart treatment

**Severity:** P1  
**Mức đạt:** 58%

### Gap

- Chart frame và grid chưa tạo depth.
- Cyan và purple line chưa có glow hierarchy.
- Uncertainty band có thể trông như fill SVG cơ bản.
- Divider Quan sát/Nội suy chưa đủ rõ.

### Hành động

- Chart inset surface riêng.
- Grid line alpha 0.05.
- Observed line solid 1.5px cyan.
- Interpolated line dashed 1.5px purple.
- Area band gradient alpha 0.05 đến 0.14.
- Boundary line 1px, label capsule nhỏ.
- Point radius 2.5px, hover 4px.

### Acceptance

- Nhìn 2 giây phân biệt được observed, interpolated, uncertainty.
- Chart vẫn đọc được khi tắt glow.

---

# 4.17 Verticals

## VF-L-017: Section chưa rebuild, khoảng cách với mock lớn

**Severity:** P0  
**Mức đạt ước lượng:** 30 đến 40%

### Mock target

- Ba vertical cards.
- Mỗi card có icon/data motif riêng.
- Facts, matches, tier composition.
- Accent semantic khác nhau.
- Không `LIVE` giả.

### Yêu cầu

- Thay toàn bộ LivePill bằng truth-state chính xác.
- Nếu số là synthetic, badge SYNTHETIC.
- Nếu dùng 14/64/7 thật, ghi source.
- Không dùng industry claims không có nguồn như REAL.
- Tạo custom mini visual cho mỗi vertical.

### Acceptance

- 3 cards không phải clone đổi text.
- Mỗi card có visual identity.
- Không `LIVE`, không `verified` mơ hồ.

---

# 4.18 Pillars

## VF-L-018: Pillars cần trở thành thương hiệu, không phải feature cards

**Severity:** P0  
**Mức đạt ước lượng:** 35%

### Target

1. Chứng minh được.
2. Tăng niềm tin.
3. Fail-loud.

### Graphics

- Shield/provenance icon.
- Handshake/trust icon.
- Gate/lock icon.
- Custom SVG 36 đến 48px.
- Blue, purple, red accents.

### Hành động

- Dùng copy ngắn.
- Một câu promise, một câu proof.
- Surface khác nhẹ với verticals.
- Icon không dùng Lucide phóng lớn.

---

# 4.19 CTA section

## VF-L-019: CTA cũ từng lệch hoàn toàn concept

**Severity:** P0  
**Mức đạt ước lượng:** 35 đến 45%

### Vấn đề quan sát từ implementation trước reset

- Copy serif lớn.
- Empty space quá rộng.
- Graphic lines bên phải không truyền tải matching.
- Footer status dùng `ENGINE LIVE` giả.

### Target

- CTA compact khoảng 176px.
- Headline Inter.
- Hai CTA rõ.
- Stage graphic nhỏ liên quan supply-demand convergence.
- Không fake runtime.

### Copy đề nghị

```text
Sẵn sàng xem engine trên dữ liệu có nguồn?
Xem Hub thật hoặc theo dõi trạng thái dự án.
```

### Acceptance

- CTA không trở thành hero thứ hai.
- Không khoảng trống chết trên 35% section.

---

# 4.20 Footer

## VF-L-020: Footer chưa khóa theo portal visual language

**Severity:** P1

### Target

- Height khoảng 96px.
- TouchBrand compact.
- Product, Trust, Company columns.
- Provenance is our DNA.
- Build/date metadata dùng mono.
- Không giant background wordmark nếu làm giảm contrast.
- Không ENGINE LIVE nếu không có health endpoint thật.

---

# 4.21 Section transitions

## VF-L-021: Landing còn cảm giác các card được xếp nối nhau

**Severity:** P0

### Gap

Mock tạo continuity bằng:

- ambient glow chuyển vùng;
- shared data lines;
- section edge fades;
- rhythm cao thấp;
- motif đỏ xuyên suốt.

### Hành động

- Tạo `SectionAtmosphere` variants: hero, pipeline, proof, trust, CTA.
- Dùng một red signal line xuất hiện có kiểm soát qua nhiều section.
- Không mọi section đều bắt đầu bằng card box.
- Xen kẽ full-bleed ambient layer và constrained content.

### Acceptance

- Scroll qua trang có cảm giác một câu chuyện, không phải catalogue component.

---

# 5. Hub: Gap report chi tiết

# 5.1 Hub shell

## VF-H-001: App shell đúng nhưng thiếu command-center depth

**Severity:** P1

### Gap

- Rail, workspace và detail có thể cùng một độ sâu.
- Mock dùng rail tối hơn, content card sáng hơn nhẹ, detail có focal lighting.

### Hành động

- Rail canvas gần black.
- Workspace canvas navy-black.
- Detail pane elevated một cấp.
- Border line phân tách, không dùng background contrast quá mạnh.

---

# 5.2 Hub topbar

## VF-H-002: Topbar cần hierarchy marketing-to-product rõ hơn

**Severity:** P1

### Target order

```text
Brand | domain | search | truth state | notifications | avatar | back to landing
```

### Gap

- Các control có thể quá giống nhau.
- Search chưa có focus depth.
- X-RAY/DEMO badge cần semantic rõ hơn.

### Hành động

- Domain selector là neutral control.
- Search chiếm flexible width.
- DEMO badge red/amber restrained.
- Back to Landing là ghost link, không button primary.

---

# 5.3 Hub rail

## VF-H-003: Rail cần active indicator và group rhythm cao cấp

**Severity:** P1

### Hành động

- Group heading 10/14, tracking .08em.
- Item 40px.
- Active: red left bar 2px + dark red fill alpha thấp.
- Icon 16px, stroke 1.5px.
- Provenance status card sticky bottom.

---

# 5.4 Hub KPI

## VF-H-004: KPI thiếu signature visuals

**Severity:** P0

### Target card set

- Facts verified: blue sparkline.
- Match proven: green connection graphic.
- Vouch: purple trust waveform.
- Blocked: red lock/gate graphic.

### Gap

Nếu chỉ số và sparkline đơn giản, Hub sẽ giống admin dashboard thông thường.

### Hành động

- Custom SVG mỗi card.
- Surface tint theo semantic.
- DataTruthBadge gần metric.
- DEMO/REAL phân biệt từng card.

---

# 5.5 Match list

## VF-H-005: Match rows cần nhiều signal nhưng ít noise

**Severity:** P1

### Target anatomy

```text
ID + state
Supply → Demand
Tier path
Confidence
Vouch/Gate status
```

### Hành động

- Selected row red border 1px, local glow.
- Passed icon green, blocked lock red.
- Confidence không dùng percent nếu là demo mà không gắn badge.
- Row height 64 đến 72px.

---

# 5.6 Match detail

## VF-H-006: Detail pane cần focal hierarchy mạnh hơn

**Severity:** P0

### Hành động

- Match ID 20/28.
- Truth badge và vouch state cạnh header.
- Tabs 40px.
- Summary card compact.
- Provenance chain là visual center.
- Evidence CTA full-width critical outline.

---

# 5.7 Provenance chain

## VF-H-007: Timeline cần data-art, không chỉ vertical steps

**Severity:** P0

### Target

- Main spine 1.5px gradient blue-to-amber.
- Node 28 đến 36px.
- Match node blue.
- Supply/Demand facts distinct.
- Tier source nodes A/B/C semantic.
- Date and snapshot metadata mono.
- Connector local glow.

### Acceptance

- Người xem hiểu chuỗi nguồn trong 5 giây.
- Mỗi source click được nếu link thật.

---

# 5.8 Registry tables

## VF-H-008: Table hiện có giá trị, cần premium data density

**Severity:** P1

### Hành động

- Header sticky.
- Row 36 đến 40px.
- Column alignment rõ.
- Tier chips 20px.
- Corroborated dùng double-check icon custom.
- Evidence link có external icon nhỏ.
- Horizontal scroll chỉ trong card ở mobile.

---

# 5.9 Demand honest-null

## VF-H-009: Honest-null phải trông như intentional product state

**Severity:** P1

### Target

- Custom lock 40px.
- Title rõ.
- Exact blocker.
- Required inputs list.
- Link đến Dashboard status.
- Run matching disabled với tooltip.

---

# 5.10 Vouch / Trust layer

## VF-H-010: Trust layer chưa có visual signature

**Severity:** P1

### Hành động

- Vouch badge không chỉ là green pill.
- Add reviewer avatar/role, date, scope, signature hash.
- Vouch timeline.
- State: pending, vouched, disputed, revoked.
- Không cho button Vouch nếu flow chưa wired.

---

# 6. Dashboard: Gap report còn lại

# 6.1 Visual baseline

## VF-D-001: Dashboard chưa có overlay chính thức

**Severity:** P1

- Capture 1536 × 1024.
- Major-region geometry dưới 5%.
- Không dùng pixel RGB thuần làm gate duy nhất.

# 6.2 Repositories and lower fold

## VF-D-002: Cần xác nhận toàn bộ repositories/risk row trong viewport

**Severity:** P2

# 6.3 Signature asset consistency

## VF-D-003: SVG Dashboard và Portal cần cùng stroke grammar

**Severity:** P1

- Stroke 1 đến 1.5px.
- Same glow scale.
- Same semantic accents.

---

# 7. System-level gaps

# 7.1 Token đúng nhưng recipe chưa đủ

## VF-S-001: Token compliance không đồng nghĩa visual fidelity

**Severity:** P0

Token hiện giải quyết:

- màu;
- spacing;
- radius;
- font;
- shadow cơ bản.

Nhưng mock cần **component recipes**:

- Hero globe recipe.
- Landing metric recipe.
- Pipeline board recipe.
- Graph node recipe.
- Hub match row recipe.
- Evidence timeline recipe.

### Yêu cầu

Mỗi recipe phải mô tả:

1. Base surface.
2. Tint.
3. Border.
4. Inner highlight.
5. Ambient glow.
6. Decorative layer.
7. Hover/focus treatment.
8. Reduced-motion behavior.

---

# 7.2 Token additions đề nghị

## Ambient tokens

```css
--fx-ambient-blue-04
--fx-ambient-blue-08
--fx-ambient-blue-12
--fx-ambient-red-04
--fx-ambient-red-08
--fx-ambient-purple-08
--fx-vignette-canvas
--fx-starfield-dot
```

## Graphic stroke tokens

```css
--graphic-stroke-hairline: .75px;
--graphic-stroke-default: 1px;
--graphic-stroke-strong: 1.5px;
--graphic-node-core-sm: 4px;
--graphic-node-core-md: 8px;
--graphic-node-ring: 12px;
```

## Chart tokens

```css
--chart-grid
--chart-axis
--chart-observed
--chart-interpolated
--chart-band-low
--chart-band-high
--chart-cell-1
--chart-cell-2
--chart-cell-3
--chart-cell-4
```

## Composite shadow tokens

```css
--shadow-executive-card
--shadow-chart-inset
--shadow-glow-blue-local
--shadow-glow-red-local
--shadow-glow-green-local
--shadow-selected-row
```

---

# 7.3 Signature graphics policy

## VF-S-002: Chưa có library graphics thống nhất

**Severity:** P0

Cần thư mục:

```text
components/graphics/
  DataGlobe.tsx
  MatchStreamGraphic.tsx
  PipelineGraphic.tsx
  CapabilityMatrix.tsx
  ProvenanceGraphGraphic.tsx
  InterpolationGraphic.tsx
  TrustShield.tsx
  VouchHandshake.tsx
  FailLoudGate.tsx
  EvidenceTimeline.tsx
```

Mọi graphics:

- dùng semantic CSS variables;
- deterministic;
- có static reduced-motion state;
- không raw hex;
- không emoji;
- không stock illustration;
- có accessible summary khi truyền thông tin.

---

# 7.4 Typography rhythm

## VF-S-003: Inter đã thống nhất nhưng editorial scale chưa khóa theo page family

**Severity:** P1

Cần tách:

| Family | Density |
|---|---|
| Landing | Editorial, nhiều khoảng thở |
| Hub | Product, high-signal density |
| Dashboard | Control-room, compact |

Không dùng một component heading y hệt cho cả ba page family.

---

# 7.5 Motion language

## VF-S-004: Motion chưa có hệ thống kể chuyện

**Severity:** P2

### Allowed motion

- Node pulse 2.8 đến 4.0s.
- Globe slow drift 18 đến 30s nếu cần.
- Card hover 120 đến 180ms.
- Drawer 220ms.
- Data strip 24 đến 40s loop.

### Không được

- Glow breathing toàn card.
- Random sparkline.
- Fast globe rotation.
- Continuous bouncing.
- Parallax làm người dùng chóng mặt.

---

# 8. Issue register ưu tiên

## 8.1 P0 Critical: phải xử lý trước Gate L/H

| ID | Issue | Route | Tác động |
|---|---|---|---|
| VF-L-001 | Capture sai viewport | Landing | Không nghiệm thu được |
| VF-L-004 | Hero canvas phẳng | Landing | Mất premium feel |
| VF-L-005 | Globe thiếu data-art | Landing | Mất signature |
| VF-L-009 | Metrics dùng DNA Dashboard | Landing | Sai page language |
| VF-L-012 | Pipeline/Matrix chưa thành board | Landing | Story bị vỡ |
| VF-L-017 | Verticals chưa rebuild | Landing | Lower page lệch mock |
| VF-L-018 | Pillars chưa rebuild | Landing | Thiếu brand promise |
| VF-L-019 | CTA lệch concept | Landing | Kết trang yếu |
| VF-L-021 | Section continuity yếu | Landing | Trang giống catalogue |
| VF-H-004 | Hub KPI thiếu signature | Hub | Trông như admin app |
| VF-H-006 | Match detail thiếu focal hierarchy | Hub | Giá trị sản phẩm mờ |
| VF-H-007 | Provenance chain chưa premium | Hub | USP chưa nổi |
| VF-S-001 | Thiếu component recipes | System | Drift tiếp tục |
| VF-S-002 | Thiếu graphics library | System | Mỗi section vẽ một kiểu |

## 8.2 P1 High

| ID | Issue |
|---|---|
| VF-L-002 | Nav finesse |
| VF-L-003 | Hero copy balance |
| VF-L-006 | Annotation hierarchy |
| VF-L-007 | Match Stream integration |
| VF-L-008 | Tape clipping/rhythm |
| VF-L-010 | Honest-null visual |
| VF-L-013 | Pipeline signal |
| VF-L-014 | Matrix depth |
| VF-L-015 | Provenance art direction |
| VF-L-016 | Chart treatment |
| VF-L-020 | Footer |
| VF-H-001 | Hub shell depth |
| VF-H-002 | Topbar hierarchy |
| VF-H-003 | Rail active state |
| VF-H-005 | Match row signal |
| VF-H-008 | Registry table polish |
| VF-H-009 | Demand honest-null |
| VF-H-010 | Trust layer |
| VF-D-001 | Dashboard overlay |
| VF-S-003 | Page-family typography |

## 8.3 P2 Medium

- Sparkline micro-polish.
- Motion language.
- Lower fold metadata.
- Minor hover/focus glow.
- Optical spacing exceptions.

---

# 9. Kế hoạch phục hồi fidelity

# 9.1 Phase VF-0: Baseline khóa chuẩn

**Thời lượng ước lượng:** 0.5 ngày

Deliverables:

- Capture Landing 1536 × 1024.
- Capture Hub 1536 × 1024.
- Capture Dashboard 1536 × 1024.
- Side-by-side.
- 50% overlay.
- Region masks.
- Issue board từ báo cáo này.

Gate:

- Không resize sau capture.
- DPR 1.
- Production build.
- Animation disabled.

# 9.2 Phase VF-1: Landing signature top fold

**Thời lượng:** 1 đến 2 ngày

Scope:

- Hero atmosphere.
- Data globe 7 layers.
- Annotation system.
- Match Stream integration.
- Tape.
- Nav finesse.

Gate:

- Top fold glance giống mock.
- Globe là focal graphic.
- Không clipping.
- Truth-state giữ nguyên.

# 9.3 Phase VF-2: Landing data board

**Thời lượng:** 1 đến 2 ngày

Scope:

- LandingMetricCard.
- Honest-null card.
- Pipeline/Matrix shared board.
- Premium sparkline and heatmap.

Gate:

- Không reuse Dashboard visual anatomy trực tiếp.
- Pipeline và Matrix đọc như một system.

# 9.4 Phase VF-3: Proof and trust sections

**Thời lượng:** 1.5 đến 2.5 ngày

Scope:

- Provenance graph.
- Interpolation chart.
- Verticals.
- Pillars.
- CTA.
- Footer.
- Section transitions.

Gate:

- Full Landing coherent.
- Không LIVE giả.
- All truth badges correct.

# 9.5 Phase VF-4: Hub premium pass

**Thời lượng:** 2 đến 3 ngày

Scope:

- Shell, topbar, rail.
- KPI visuals.
- Match list/detail.
- Provenance timeline.
- Registry polish.
- Honest-null demand.
- Trust layer.

# 9.6 Phase VF-5: Unified portal and QA

**Thời lượng:** 1 đến 2 ngày

Scope:

- Cross-route consistency.
- Responsive 5 viewports.
- Visual regression.
- Lighthouse.
- WCAG.
- Clean-CI.

---

# 10. Visual acceptance framework

# 10.1 Bắt buộc capture

| Route | Viewport |
|---|---|
| `/` | 1536 × 1024 top fold + fullPage |
| `/hub` | 1536 × 1024 |
| `/dashboard` | 1536 × 1024 |
| Cả ba | 1366 × 768 |
| Cả ba | 1024 × 768 |
| Cả ba | 768 × 1024 |
| Cả ba | 390 × 844 |

# 10.2 Geometry gate

Không dùng global pixel diff duy nhất. Đo region:

- Nav.
- Hero copy.
- Hero stage.
- Tape.
- Metrics.
- Pipeline/Matrix.
- Provenance/Interp.
- Verticals/Pillars.
- CTA/Footer.

Target:

- Major region position error dưới 5%.
- Region width/height error dưới 7%.
- Component presence 100%.
- Không overlap/clipping.

# 10.3 Surface gate

Mỗi executive card phải có:

- Base surface.
- Tint semantic nếu cần.
- Border 1px.
- Inner top highlight.
- Panel shadow.
- Local glow chỉ khi có semantic.

Fail nếu:

- Card chỉ có `background + border`.
- Glow phủ toàn viewport.
- Mọi card cùng một tint.
- Text contrast thấp để đổi lấy mood.

# 10.4 Signature graphics gate

- Custom SVG/Canvas deterministic.
- Không stock icon phóng lớn.
- Không raster mock.
- Reduced motion.
- Same stroke grammar.
- Same glow grammar.
- A11Y summary.

# 10.5 Content honesty gate

- REAL có source.
- DEMO có badge.
- SYNTHETIC có badge.
- SCAFFOLD không giống control hoạt động.
- Match thật chưa chạy không được hiển thị như result.
- Không `LIVE` nếu không có health endpoint thật.

---

# 11. Definition of Done đề nghị

## 11.1 Landing DONE

- Top fold gần mock ở glance đầu tiên.
- Data globe premium và deterministic.
- Metrics có landing-specific anatomy.
- Pipeline/Matrix là một composition.
- Provenance/Interp có data-art.
- Verticals/Pillars complete.
- CTA/Footer đúng mock.
- Truth-state 100%.
- Responsive 5/5.
- Visual baseline locked.
- Guard/build/a11y PASS.

## 11.2 Hub DONE

- KPI signature graphics.
- Match list/detail visual hierarchy.
- Provenance chain là focal feature.
- CnclRegistry REAL rõ nguồn.
- Demand honest-null.
- No dead controls.
- Responsive 5/5.
- Visual baseline locked.

## 11.3 Unified portal DONE

- PortalSwitcher consistent.
- Brand consistent.
- Truth state consistent.
- Tokens 0 hard violations.
- Page families cùng DNA nhưng đúng density riêng.
- Không route nào nhìn như template khác ghép vào.

---

# 12. Chỉ đạo triển khai gửi thẳng cho dev

> Visual Fidelity Gate hiện FAIL. Giữ nguyên logic, dữ liệu, truth-state, routing, tokens và responsive. Không tiếp tục đánh dấu từng increment là visual PASS chỉ dựa trên build/guard hoặc component presence. Mở một Premium Graphics Pass riêng. Bắt đầu bằng capture chuẩn 1536×1024 DPR1, sau đó rebuild Hero DataGlobe thành graphic 7 lớp, tích hợp Match Stream vào stage, làm lại Metrics bằng component Landing riêng, gộp Pipeline và Matrix vào một composition board, rồi rebuild Provenance, Interpolation, Verticals, Pillars, CTA và Footer. Mọi signature graphic phải custom SVG/Canvas deterministic, không stock icon, không raster mock, không random client. Hub tiếp tục sau khi Landing visual Gate PASS. Nghiệm thu theo region geometry, surface recipes, component presence, truth-state và visual review, không dùng pixel RGB diff thuần làm gate duy nhất.

---

# 13. Quyết định đề nghị

## Đề nghị chấp thuận

1. Đổi trạng thái Gate L thành `visual_in_progress`, không PASS.
2. Không commit Gate L trước khi Premium Graphics Pass hoàn tất.
3. Tách backlog kỹ thuật và backlog visual.
4. Ưu tiên P0 theo bảng Issue Register.
5. Dùng báo cáo này làm Gap Ledger, blueprint hiện hành vẫn là SOT implementation.

## Mốc mục tiêu

| Mốc | Visual target |
|---|---:|
| Sau VF-1 Hero | Landing 65 đến 70% |
| Sau VF-2 Data board | Landing 75 đến 80% |
| Sau VF-3 Full page | Landing 85%+ |
| Sau VF-4 Hub | Portal 82%+ |
| Sau VF-5 QA | Release candidate |

---

**Kết luận cuối:** Portal hiện có nền kỹ thuật đáng tin cậy nhưng chưa có lớp tạo hình tương xứng với tham vọng của sản phẩm. Khoảng cách lớn nhất nằm ở DataGlobe, surface recipes, section composition, provenance art và visual continuity. Đây là công việc art direction có hệ thống, không phải một vòng chỉnh CSS nhỏ.
