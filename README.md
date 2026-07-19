# Dataset · Công nghệ chiến lược Việt Nam

Dựng 18/07/2026 theo yêu cầu "làm giàu sạch tin cậy dataset 11 công nghệ chiến lược" (nhánh làm giàu chủ động, thay phần tìm hiểu của Tuyết). Curated bởi Chủ thầu theo kỷ luật refinery: snapshot trước, claim có evidence nguyên văn, tier theo bản chất nguồn, honest-null chỗ chưa có, disputed giữ trọn.

## Kết luận một dòng
"11 công nghệ chiến lược" đã là danh mục cũ: từ 01/07/2026 danh mục hiện hành là 10 nhóm công nghệ + 30 sản phẩm phân 2 tầng theo QĐ 21/2026/QĐ-TTg. Dataset này chứa cả bản hiện hành (dùng để làm việc) lẫn bản cũ (đánh dấu superseded, để đối chiếu lịch sử).

## Cấu trúc
- `snapshots/` · 4 bản chụp nguồn (captured 2026-07-18, text extraction qua web_fetch): baochinhphu (gov, danh mục 1131 cũ), bdttg_gov (gov, tin QĐ 21/2026), luatvietnam (bảng danh mục mới), vietq (bài phân tích cấu trúc).
- `claims.jsonl` · 97 claim: 6 meta (pháp lý, hiệu lực, phân tầng, disputed) + 10 nhóm hiện hành + 30 sản phẩm + 11 nhóm cũ superseded + 40 claim wording chính thức tier A (hậu tố -A: 10 nhóm + 30 sản phẩm, nguồn baochinhphu.vn). Mỗi claim: evidence_span nguyên văn nằm trong snapshot, source_url, tier, extraction, captured_at, state.
- `REGISTRY.md` · bản build đọc được, badge tier, trỏ về claim id.

## Quy tắc tier áp dụng
A = trang chính phủ (baochinhphu.vn, bdttg.gov.vn). B = dịch vụ thông tin pháp lý và tạp chí ngành có giấy phép (luatvietnam.vn, vietq.vn). C = nguồn tự khai/không kiểm được (chỉ xuất hiện trong disputed, có ghi chú).

## Giới hạn khai trung thực (đọc trước khi dùng)
1. CẬP NHẬT 18/07: tên 10 nhóm và 30 sản phẩm đã có WORDING CHÍNH THỨC tier A từ baochinhphu.vn (Cổng TTĐT Chính phủ đăng nguyên văn danh mục, snapshot baochinhphu_qd21_toanvan, claims hậu tố -A); bảng LuatVietnam tier B giữ làm corroboration. Còn thiếu duy nhất preamble và thể thức của PDF gốc, không ảnh hưởng nội dung danh mục. Dataset đủ chuẩn dùng cho deck khách với trích dẫn "theo QĐ 21/2026/QĐ-TTg, nguồn Cổng TTĐT Chính phủ".
2. Dataset curated tay theo kỷ luật refinery, CHƯA chạy qua engine bites. Muốn engine-grade: giao Thợ nạp claims.jsonl vào một domain refinery và chạy bộ răng (khuôn có sẵn ở CaoLocMatch/methodbox).
3. Snapshot là text extraction, không phải HTML gốc đầy đủ.
4. Một disputed đang mở: 35 vs 32 nhóm sản phẩm của danh mục cũ (xem CNCL-META-06).

## Ranh giới quản trị
Dataset này KHÔNG thay thế dataset `dich_vu_solo_entrepreneur` của Tuyết cho tiêu chí SM1/SM2 của PoC (pre-registration 02 đã ký, đổi domain phải phụ lục có chữ ký). Nó là tài sản làm giàu chủ động, đồng thời là khung xương cho các đợt cào kế tiếp.

## Bước làm giàu kế tiếp (đề xuất, theo thứ tự giá trị)
1. Trích PDF gốc QĐ 21/2026 (tải tay hoặc qua browser) để nâng 40 claim tier B lên tier A và lấp honest-null "nguyên văn phụ lục".
2. Domain refinery `don_vi_cncl`: cào doanh nghiệp/viện/trường VN chủ lực theo từng nhóm trong 10 nhóm (chiều CUNG năng lực, chính là nguyên liệu matching của CàoLọcMatch).
3. Domain `chuong_trinh_tai_tro_cncl`: NAFOSTED CNCL, đề án, quỹ theo nhóm công nghệ (chiều CẦU/cơ hội).
4. Cập nhật theo dõi: BKHCN được giao rà soát định kỳ, đặt lịch kiểm danh mục mỗi quý.
