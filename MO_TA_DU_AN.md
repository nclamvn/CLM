# CàoLọcMatch và .touch: mô tả dự án

Bản mô tả ngày 02/10/2026. Mọi con số trong tài liệu này đọc từ dữ liệu của kho tại commit 60f77f2, lượt chạy chuỗi cổng đầy đủ lúc 11:32 cùng ngày (122/122 xanh).

Người phụ trách: Nguyễn Cảnh Lâm, AI Officer, Real-time Robotics (RtR). Kho mã: `nclamvn/CLM` (riêng tư).

---

## 1. Dự án giải bài toán gì

Quyết định 21/2026/QĐ-TTg đưa ra danh mục 10 nhóm công nghệ chiến lược và 30 sản phẩm công nghệ chiến lược của Việt Nam. Câu hỏi thực tế đi kèm là: với từng sản phẩm, trong nước ai đang làm được, bằng chứng ở đâu, và ai đang cần.

Thông tin để trả lời nằm rải rác trên cổng cơ quan nhà nước, báo chí và website doanh nghiệp, độ sạch thấp, dễ trùng lặp, dễ thổi phồng. Một bảng tổng hợp thông thường không cho người đọc biết con số nào kiểm chứng được và con số nào là suy diễn.

CàoLọcMatch là hệ thống **cung gặp cầu chứng minh được**:

- **Cào:** chụp nguyên văn trang nguồn, lưu lại làm bản chụp.
- **Lọc:** mỗi thông tin vào sổ nguồn phải là một câu trích nguyên văn trong bản chụp, có hạng nguồn, có ngày đăng, và đi qua chuỗi cổng kiểm tự động.
- **Match:** máy đề xuất cặp cung cầu theo công thức công khai; một cặp chỉ được coi là đã ghép khi người gác cổng ký.

.touch là mặt giao diện của hệ thống, dùng để trình bày cho nhà đầu tư, đối tác và cơ quan quản lý.

Nguyên tắc xuyên suốt: **không có nguồn thì không nói**. Ô nào chưa có nguồn đủ chuẩn thì để trống và ghi rõ là trống, không đoán.

---

## 2. Hiện trạng số liệu (02/10/2026)

### Chiều cung (sổ nguồn đơn vị)

| Chỉ số | Giá trị |
|---|---|
| Đơn vị có câu nguồn | 60 |
| Câu nguồn nguyên văn (claim) | 378 |
| Theo hạng nguồn | A 120 · B 190 · C 68 |
| Nguồn (tên miền) | 61 |
| Bản chụp phục vụ trên web | 139 |
| Câu nguồn còn hạn hoặc có lý do giữ | 349/378 (92%) |
| Đơn vị đã định danh pháp nhân qua cổng chính thức | 0/60 |

Định danh pháp nhân bằng 0 là con số thật: mã số thuế chỉ được nhận từ cổng chính thức, mà cổng có captcha nên máy không tra được. Tên pháp nhân và mã do chính đơn vị công bố đã được nạp (lô 02), nhưng hiển thị riêng với nhãn "Tự khai, chưa đối chiếu cổng" và không được tính là đã định danh.

### Chiều cầu

**Cầu quốc gia:** 30 sản phẩm trong danh mục QĐ 21/2026.

- 28/30 sản phẩm đã có ít nhất một đơn vị cung có câu nguồn.
- 16/30 sản phẩm (53%) đã có ít nhất một cặp cung cầu được người gác cổng ký.
- 12 sản phẩm có bên cung nhưng chưa có cặp nào được ký.
- 2 sản phẩm chưa có bên cung nào trong sổ nguồn: P21 (thu giữ, sử dụng và lưu trữ carbon) và P27 (lò phản ứng hạt nhân mô-đun nhỏ).
- 12 sản phẩm chỉ dựa vào đúng một đơn vị cung.

**Cầu thật (lô 03, duyệt 01/10/2026):** 54 nhu cầu đặt hàng công nghệ công khai từ 16 bên đặt hàng.

| Loại đặt hàng | Số nhu cầu |
|---|---|
| Nhiệm vụ KH&CN đặt hàng (Bộ KH&CN, Liên hiệp các Hội KH&KT) | 10 |
| Bài toán lớn (UBND Hà Nội, Bộ Công an, Bộ Công Thương, Đà Nẵng...) | 19 |
| Chương trình, đề án (QĐ 808, QĐ 2815...) | 20 |
| Dự án, gói thầu | 5 |

41/54 nhu cầu đã có đơn vị trong sổ nguồn có câu nguồn năng lực liên quan (gợi ý của máy, chưa ký); 13 nhu cầu chưa có bên cung nào.

### Ghép cặp

| Chỉ số | Giá trị |
|---|---|
| Cặp đã ký | 24 (người ký: Lam Nguyen) |
| Cặp bị từ chối có lý do | 1 |
| Phễu ghép | 1.770 cặp khả dĩ, 287 qua neo nhóm, 25 qua ngưỡng |
| Luật ghép | `anchor_group_overlap_v2` |
| Công thức điểm | 0,7 × độ giao từ khoá + 0,2 × hạng nguồn + 0,1 × địa điểm; ngưỡng giao 0,5 |

### Xu hướng

Từ 01/09/2026 đến 02/10/2026, sổ nguồn tăng từ 44 lên 60 đơn vị, và số cặp đã ký tăng từ 11 lên 24. Đường xu hướng được tính lại từ lịch sử git, không gõ tay.

---

## 3. Kiến trúc

Kho gộp `CLM` có bốn phần:

```
CLM/
├── CNCLData/                  Chiều CUNG và CẦU THẬT: sổ nguồn, bản chụp, cổng kiểm dữ liệu
│   ├── domains/don_vi_cncl/   60 đơn vị · claims.jsonl · snapshots/ · domain.yaml
│   ├── domains/cau_dat_hang/  54 nhu cầu đặt hàng · claims.jsonl · snapshots/
│   ├── lam_giau/              Lô làm giàu: dot_01, dot_02, dot_03 (đề xuất, duyệt, nạp)
│   ├── vong_tu_chay/          Vòng tự chạy: tìm ứng viên mới, hàng chờ duyệt
│   └── methodbox/refinery.py  Động cơ tinh lọc 7 giai đoạn
├── Dataset_CongNgheChienLuoc/ Chiều CẦU QUỐC GIA: 30 sản phẩm QĐ 21/2026, sự kiện chính sách
├── CaoLocMatch/               Máy ghép: match_engine.py, sổ chữ ký, phễu, chuỗi cổng
│   ├── domains/cncl_match/    signoff_ledger.jsonl · nguoi_ky.yaml
│   └── chay_het_cong.sh       Chuỗi cổng toàn hệ (122 ô)
└── .touch/                    Mặt giao diện (Next.js 15, React 19)
    ├── app/                   Các trang
    ├── components/            Thành phần giao diện
    ├── lib/                   Hàm thuần dựng dữ liệu + JSON sinh lúc build
    ├── scripts/               Bộ sinh dữ liệu, cổng kiểm, bộ răng
    └── public/evidence/       Bản chụp nguyên văn phục vụ cho người đọc
```

### Luồng dữ liệu

```
Trang nguồn ──web_fetch──▶ Bản chụp (nguyên văn, có dòng đầu ghi URL, ngày chụp, ngày đăng)
                               │
                               ▼
                     Đề xuất claim (câu trích nguyên văn + hạng + lý do)
                               │
                     Cổng kiểm lô (kiem_lo*.py) ── fail-loud
                               │
                     Bảng duyệt ──▶ NGƯỜI GÁC CỔNG duyệt ──▶ duyet.json
                               │
                     Nạp vào sổ nguồn (nap_lo*.py) ──▶ claims.jsonl
                               │
             refinery.py + check_luat3.py + các cổng chuyên đề
                               │
                     match_engine.py ──▶ cặp đề xuất ──▶ NGƯỜI KÝ ──▶ signoff_ledger
                               │
             gen-cncl-data.mjs + gen-hub-data.mjs ──▶ lib/*.json (sinh lúc build)
                               │
                     .touch (giao diện) + cổng giao diện + quét truy cập trên trình duyệt thật
```

Máy không bao giờ tự ký. Chữ ký chỉ được tạo bằng `match_engine.py sign` khi người gác cổng quyết định.

---

## 4. Cơ chế tin cậy

### 4.1 Câu nguồn nguyên văn và hạng nguồn

Mỗi claim gồm: thực thể, trường, giá trị, câu trích nguyên văn (`evidence_span`), cách trích (`verbatim` hoặc `normalized` kèm lý do bắt đầu bằng "CHUẨN HOÁ CÓ CHỦ ĐÍCH"), hạng nguồn, và thông tin chụp (URL, ngày chụp, tên bản chụp, nguồn).

| Hạng | Loại nguồn |
|---|---|
| A | Văn bản chính thức: `*.gov.vn`, `baochinhphu.vn`, `*.chinhphu.vn` |
| B | Báo chí chính thống |
| C | Trang của chính đơn vị |

Trang tổng hợp, diễn đàn, mạng xã hội và Wikipedia không được dùng. Riêng mã số thuế không nhận từ trang tổng hợp.

### 4.2 Chuỗi cổng và bộ răng

`CaoLocMatch/chay_het_cong.sh` chạy **122 ô**: 70 ô cổng kiểm và sinh dữ liệu, 52 ô răng.

- **Cổng** trả exit 0 (xanh), 2 (đỏ, có vi phạm) hoặc 3 (không chạy được). "Không chạy được" không bao giờ được tính là xanh.
- **Răng** là bài thử của chính cổng. Mỗi bộ răng tự dựng cảnh trong thư mục tạm, tiêm lỗi thật vào bản sao, rồi kiểm rằng cổng bắt được. Một cổng không có răng thì không ai biết nó còn cắn hay không.
- Chỉ push khi chuỗi xanh trọn vẹn.

Nhóm cổng chính:

| Nhóm | Ví dụ cổng |
|---|---|
| Sổ nguồn cung | `refinery` (câu trích phải nằm nguyên văn trong bản chụp), `check_luat3` (không khai quá câu nguồn, mốc thời gian phải có trong câu), `doi_chung_nguon` (đối chiếu độc lập với trang gốc tải lại), `do_tuoi_nguon`, `ngay_dang`, `nguon_tai_tro`, `ma_so_thue`, `du_dieu_kien`, `khang_dinh_toi_thuong`, `ap_luat_deu`, `fail_closed` |
| Cầu thật | `dat_hang_refinery`, `dat_hang_luat3`, `dat_hang` (mỗi nhu cầu truy được về một lần duyệt của người, không thêm hay xoá tay sau khi nạp) |
| Làm giàu | `kiem_lo` (lô chờ duyệt phải sạch), `hang_cho` (hàng chờ của vòng tự chạy nguyên vẹn) |
| Ghép | `match_run` (tái lập được, digest cố định), `restore_signoff`, `validate_ky`, `pheu_ghep`, `xung_dot_ky` (người ký không ký cặp có đơn vị mình liên quan) |
| Giao diện | `so_sinh` (mọi số trên web đếm lại được từ dữ liệu), `lop_phu_nguon`, `ho_so`, `thi_truong`, `matching`, `thoi_cuoc`, `hoi_dap`, `bao_cao`, `kiem_toan`, `cau_that`, `dong_thoi_gian`, `hien_cau` |
| Chuẩn trình bày | `don_sac`, `mau_du_lieu`, `thuat_ngu`, `co_chu`, `cong_em_dash`, `truy_cap` (axe-core WCAG 2.2 AA và đo chữ bị cắt ở 1440px và 390px trên trình duyệt thật) |
| Hạ tầng | `bi_mat` (không lộ khoá), `phu_thuoc` (không gói nào có lỗ hổng mức cao), `doc_dung_kho`, `bien_dich_ts` |

### 4.3 Người gác cổng

- Nguồn mới vào theo **lô**. Mỗi lô có bảng duyệt; người gác cổng duyệt hết hoặc gạch từng dòng kèm lý do (lý do giữ nguyên lời người duyệt).
- Mỗi cặp ghép phải có chữ ký. Sổ người ký (`nguoi_ky.yaml`) khai báo người ký và các đơn vị họ liên quan. Hiện tại người ký không được ký cặp có Real-time Robotics, và nâng số người ký tối thiểu lên 2 là bật được luật hai người ký.

### 4.4 Hồ sơ kiểm toán được

Mỗi hồ sơ đơn vị có một mã kiểm toán (SHA-256, phiên bản `clm-kiem-toan/1`) tính trên câu nguồn nguyên văn và dấu băm của từng bản chụp. Người nhận tải tệp hồ sơ JSON và tự chạy `node scripts/kiem-ho-so.mjs` để đối chiếu. Chỉ cần sửa một chữ trong câu nguồn hay trong bản chụp là mã đổi.

---

## 5. Giao diện .touch

Chạy cục bộ ở cổng 3200 (cổng 3000 trên máy là của dự án khác):

```
cd ~/CLM/.touch && npx next build && npx next start -p 3200
```

| Trang | Đường dẫn | Nội dung |
|---|---|---|
| Trang đầu | `/` | "Cung gặp cầu." Hình động hub cung cầu dựng từ dữ liệu thật |
| Tổng quan | `/dashboard` | Số chính, đường xu hướng từ lịch sử git, chất lượng dữ liệu, việc cần làm tiếp |
| Hỏi đáp có nguồn | `/dashboard/hoi-dap` | Hỏi bằng tiếng Việt; trả lời bằng câu nguồn nguyên văn kèm bản chụp; ngoài phạm vi thì từ chối. Truy hồi tất định, không dùng mô hình ngôn ngữ |
| Cầu thật | `/dashboard/cau-that` | 54 nhu cầu đặt hàng, bên đặt hàng, đối tượng, thời hạn, câu nguồn; gợi ý đơn vị có dẫn chứng, ghi rõ "chưa ký, không phải cặp ghép" |
| Toàn cảnh thị trường | `/dashboard/thi-truong` | Sankey bảo toàn dòng, bản đồ phủ theo nhóm, độ tươi nguồn |
| Dòng thời cuộc | `/dashboard/thoi-cuoc` | 93 sự kiện từ 2012 đến 2026 theo 4 làn (chính sách, đơn vị, quyết định, đề xuất) |
| Đồ thị cung cầu | `/dashboard/do-thi` | Đồ thị bố cục tất định, 0 cạnh giao nhau, lớp phủ nguồn |
| Hồ sơ đơn vị | `/dashboard/don-vi/[slug]` | Năng lực, nhu cầu liên quan, dòng thời gian, đơn vị tương tự, tên dễ nhầm, ô chưa có nguồn, mã kiểm toán |
| Ghép cung cầu | `/dashboard/matching` | Bàn làm việc ghép: sơ đồ hai cột, vệt bằng chứng, phân rã điểm, phễu ghép |
| Sổ nguồn | `/dashboard/registry` | Tra cứu toàn bộ claim, xuất CSV |
| Báo cáo khoảng trống | `/dashboard/bao-cao` | Báo cáo theo quý, in hoặc lưu PDF; mọi số đếm lại độc lập |
| Phương pháp | `/dashboard/phuong-phap` | Giải thích cách làm, hạng nguồn, chữ ký |
| Kho mã | `/dashboard/repos` | Trạng thái kho đọc từ git |

Mọi câu nguồn trên giao diện mở được bản chụp gốc. Tìm kiếm toàn hệ bằng Cmd+K.

Chuẩn trình bày: nền đen trắng đơn sắc; màu chỉ dùng cho đồ hoạ dữ liệu, chọn tông trầm, đủ tương phản và phân biệt được với người mù màu. Hai phông chữ (Inter, Noto Serif), chữ không nhỏ hơn 12px. Toàn bộ nhãn bằng tiếng Việt theo bảng thuật ngữ. Không dùng em-dash. Kiểm ở hai cỡ màn 1440px và 390px.

---

## 6. Quy trình vận hành

### Làm giàu dữ liệu theo lô

| Lô | Nội dung | Trạng thái |
|---|---|---|
| dot_01 | Nghiên cứu các nhu cầu quốc gia còn trống bên cung | Đã nạp |
| dot_02 | Định danh pháp nhân: tên pháp nhân và mã tự khai (55 dòng); phiếu tra cổng cho người | Đã nạp phần tự khai; phiếu tra cổng chờ nhân sự RtR |
| dot_03 | Cầu thật: 54 nhu cầu đặt hàng sau khi gộp 6 cặp trùng | Đã nạp 01/10/2026 |

Mỗi lô đi theo thứ tự: nghiên cứu, chụp, đề xuất, cổng kiểm lô, đối chiếu độc lập, bảng duyệt, người gác cổng duyệt, nạp, chuỗi cổng.

### Vòng tự chạy

`CNCLData/vong_tu_chay/` tìm ứng viên mới và đưa vào hàng chờ; không ứng viên nào vào sổ nguồn khi chưa qua người duyệt.

### Kiểm và đẩy mã

- Trên máy thật: `bash scripts/chup_man.sh --chot-moc` (build, chụp ảnh mốc, quét truy cập, đo chữ bị cắt), rồi `bash chay_het_cong.sh`, rồi commit và push.
- CI trên GitHub chạy chuỗi cổng hằng ngày lúc 08:00 giờ Việt Nam.

---

## 7. Công nghệ

| Lớp | Công nghệ |
|---|---|
| Dữ liệu và cổng | Python 3 (chỉ cần PyYAML), JSONL, YAML |
| Giao diện | Next.js 15.5, React 19, TypeScript, Tailwind CSS, xuất trang tĩnh |
| Kiểm trình duyệt | Playwright, axe-core |
| Toàn vẹn | SHA-256 cho mã kiểm toán, digest cho kết quả ghép |
| Kho | Git, GitHub Actions |

Không dùng cơ sở dữ liệu hay dịch vụ ngoài lúc chạy. Toàn bộ dữ liệu web được sinh lúc build từ sổ nguồn, nên mỗi bản build đều tái lập được.

---

## 8. Giới hạn đã biết

- **Định danh pháp nhân 0/60.** Cổng tra mã số thuế có captcha; máy không vượt captcha. Phiếu tra cổng (`PHIEU_TRA_CONG.xlsx`) chờ người tra, kết quả nạp bằng `nap_tra_cong.py`.
- **29 câu nguồn đã quá 180 ngày** mà chưa có lý do giữ, cần chụp lại.
- **Gợi ý đơn vị cho cầu thật dựa trên khớp từ khoá** (máy hỏi đáp tất định), chưa hiểu ngữ nghĩa. Gợi ý không phải cặp ghép.
- **Sổ nguồn chưa tự phát hiện trang gốc thay đổi.** Hiện chỉ đối chiếu lại theo đợt.
- **Mẫu số của cầu thật chưa biết** (không ai biết tổng số nhu cầu đặt hàng công khai), nên số nhu cầu theo loại chỉ là đếm trong sổ nguồn, không phải phân bố của thị trường.

---

## 9. Hướng phát triển

1. Theo dõi thay đổi nguồn: chụp lại theo lịch, so với bản chụp cũ, báo trang nào đổi chữ. Cần quyết định nhịp chụp và cách xử lý chữ ký khi nguồn của một cặp đã ký thay đổi.
2. Ghép ngữ nghĩa cho cầu thật: từ gợi ý theo từ khoá sang đề xuất cặp có điểm, đưa qua người ký như chiều cầu quốc gia.
3. Hoàn tất định danh pháp nhân qua phiếu tra cổng.
4. Mở rộng cầu thật bằng các lô mới (bộ ngành, địa phương, doanh nghiệp nhà nước).
5. Bật luật hai người ký khi có người gác cổng thứ hai.
