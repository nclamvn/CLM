# TIP-CNCL-3B · Rule v2 và bài hồi quy trên đúng 690 cặp

## Header

- **ID:** TIP-CNCL-3B
- **Dependencies:** lát cắt dọc đóng (commit 8583730), VERIFY kết luận rule v1 xếp hạng ngược
- **Vai:** Chủ thầu phát TIP, Thợ thi công
- **Điều kiện tiên quyết đã ký ở 04:** đổi rule là **tăng ENGINE_VERSION**, không sửa ngầm

## Bối cảnh và ràng buộc trung thực

**Tôi viết TIP này SAU khi đã thấy kết quả vòng v1.** Ghi rõ điều đó theo yêu cầu của pre-registration mục 2. Vì vậy tiêu chí hồi quy dưới đây phải khoá **trước** khi viết một dòng code rule v2, và phải công bố ngay cả khi rule v2 trượt.

Rule v1 giữ nguyên trong mã, không xoá. Phải chạy lại được để đối chiếu.

## Ba phát hiện chặn đường, buộc phải xử lý trong TIP này

**1. Ánh xạ sản phẩm về nhóm KHÔNG có trong nguồn.** QĐ 21/2026 liệt kê 10 nhóm công nghệ ở một chỗ và 30 sản phẩm ở chỗ khác, không nối hai danh sách. Máy tự gán là suy diễn. Xử lý: dựng `mapping_sp_nhom.yaml` như một artefact **tường minh, người duyệt được**, mỗi dòng ghi lý do, mặc định `trang_thai: cho_duyet`. Match nào dựa trên dòng chưa duyệt thì engine phải tự khai vào `unverified`.

**2. Neo theo nhóm mà đòi trùng khít là SAI.** Nhà sản xuất chip (nhóm 6) phục vụ nhu cầu UAV (nhóm 9) là quan hệ chuỗi giá trị có thật, và chính là ứng viên tôi đã tuyên bố trước ở vòng v1. Nếu neo bằng phép bằng nhau thì giết luôn cặp tốt nhất. Xử lý: cho phép **kề chuỗi giá trị** qua một danh sách cạnh tường minh, cũng chờ người duyệt, và match qua cạnh kề phải ghi rõ trong rationale.

**3. Registry chỉ giữ được MỘT mô tả năng lực cho mỗi đơn vị.** Trường `nang_luc_mo_ta` là đơn trị; thêm mô tả thứ hai sẽ thành tranh chấp giả. Đây là cùng khuyết tật đã gặp với `nhom_cncl`. Xử lý theo khuôn đã duyệt: thêm `nang_luc_mo_ta_2`, và engine v2 nhận mọi trường bắt đầu bằng `capability` làm fact năng lực.

## Task

**A.** Nạp claim SoC AI on Edge vào registry CUNG (`nang_luc_mo_ta_2` cho FPT và cho Tập đoàn Viettel, bằng chứng tier A đã nằm trong `mst_fpt_nhamay_20260128.html`).

**B.** Dựng `mapping_sp_nhom.yaml`: 30 sản phẩm về nhóm, mỗi dòng có `ly_do` và `trang_thai`. Kèm danh sách `canh_chuoi_gia_tri` (ví dụ 6 sang 9: chip cho thiết bị bay). Tất cả mặc định `cho_duyet`.

**C.** Viết rule v2 trong `match_engine.py`, `ENGINE_VERSION = cao-loc-match/0.2.0 rule=anchor_group_overlap_v2`. Ba lớp theo thứ tự:

1. **Neo nhóm**: nhóm của đơn vị CUNG (chính hoặc phụ) phải trùng nhóm sản phẩm, hoặc nối được qua cạnh chuỗi giá trị. Không thoả thì loại thẳng, không tính điểm.
2. **Stopword ngành**: loại khỏi phép so các từ dùng chung: chuyên dụng, hệ thống, thiết bị, công nghệ, tiên tiến, thông minh, giải pháp, nền tảng, sản phẩm, ứng dụng, phát triển.
3. **Overlap** trên phần token còn lại, giữ nguyên công thức điểm cũ để so sánh được.

**D.** Chạy lại đúng bộ dữ liệu đó và nộp bảng đối chiếu v1 với v2.

## Tiêu chí hồi quy · KHOÁ TRƯỚC KHI VIẾT RULE V2

| Mã | Nội dung | Ngưỡng |
|---|---|---|
| **R1** | Cặp rác Phenikaa-X với "Chip chuyên dụng" (P23) **không được** xuất hiện | bắt buộc |
| **R2** | Cặp VinBigData với "Mô hình ngôn ngữ lớn tiếng Việt" (P01) **phải** xuất hiện | bắt buộc |
| **R3** | Cặp ROSTEK với "Robot tự hành và robot công nghiệp" (P07) **phải** xuất hiện | bắt buộc |
| **R4** | Không cặp nào bị người đọc chấm là rác được xếp điểm **cao hơn** R2 hoặc R3 | bắt buộc |
| **R5** | Tỷ lệ rác khi đọc tay toàn bộ match | tối đa 30% |
| **R6** | `digest_matches` tái lập; rule v1 vẫn chạy lại được để đối chiếu | bắt buộc |
| **R7** | Cặp chip SoC AI on Edge với nhu cầu UAV (P22) xuất hiện qua cạnh chuỗi giá trị, và **được đánh dấu** là qua cạnh kề | bắt buộc |

**Nếu R1, R2 hoặc R3 trượt thì rule v2 hỏng, công bố nguyên trạng, không được nắn tiêu chí.** Nếu R5 trượt thì rule v2 đúng hướng nhưng còn ồn, ghi số thật và đề xuất v3.

## Constraints

- Không sửa `methodbox/`.
- Không sửa claim gốc ở hai registry nguồn ngoài đúng phần Task A.
- Không xoá rule v1.
- Đọc exit code trần.
- Em-dash vẫn cấm.
- Mọi ánh xạ do người duyệt đều mặc định `cho_duyet`, engine phải tự khai `unverified` khi dùng dòng chưa duyệt.
