# TIP-CNCL-3H · Neo cấp sản phẩm · rule v4

## Header

- **ID:** TIP-CNCL-3H
- **Dependencies:** Pha 2f đóng (200 claim, 42 đơn vị, 10/10 nhóm, nền sản phẩm 95%)
- **Điều kiện tiên quyết ký ở 04:** đổi rule là tăng `ENGINE_VERSION`

## Giả thuyết cần kiểm

Bốn vòng vừa qua chứng minh mọi thao tác trên **chuỗi ký tự** đều phản tác dụng. Vòng này thử hướng khác hẳn: siết bằng **dữ liệu có cấu trúc** thay vì bằng chữ.

Giả thuyết: nếu đơn vị CUNG khai `san_pham_lien_quan` và nhu cầu CẦU chính là sản phẩm đó, thì đây là bằng chứng liên quan **mạnh hơn nhiều** so với việc hai bên cùng nhóm. Nhóm 5 gộp cả vật liệu, pin, hydro, thiết bị điện; sản phẩm thì không gộp.

## Task

`ENGINE_VERSION = cao-loc-match/0.4.0 rule=anchor_product_v4`. Giữ nguyên v1, v2, v3.

Rule v4 giống v2 hoàn toàn, chỉ thêm **lớp neo sản phẩm** trước lớp neo nhóm:

1. **Nếu đơn vị CUNG có `san_pham` khai rõ:**
   - Trùng mã sản phẩm của nhu cầu thì **cho qua thẳng**, ghi `neo: san_pham` trong rationale.
   - Khác mã sản phẩm thì **loại**, trừ khi nối được qua cạnh chuỗi giá trị đã duyệt.
2. **Nếu đơn vị CUNG không khai sản phẩm** (honest-null) thì lùi về neo nhóm như v2, và ghi `neo: nhom (lui vi don vi chua khai san pham)`.
3. Stopword và công thức điểm giữ nguyên để so sánh được.

Builder phải mang `san_pham_lien_quan` và `san_pham_phu_*` từ registry CUNG sang domain dẫn xuất.

## Tiêu chí · KHOÁ TRƯỚC KHI VIẾT CODE

Đáp án lấy từ quyết định của người gác cổng và từ ca rác đã phân tích, không phải tôi đặt sau.

| Mã | Nội dung | Ngưỡng |
|---|---|---|
| **H1** | Cặp rác **Viện Hàn lâm với P20 thiết bị điện cao áp** biến mất | bắt buộc |
| **H2** | Cặp **Đông Anh với P20** vẫn còn, vì Đông Anh khai đúng SP20 | bắt buộc |
| **H3** | Ba cặp chip đã ký (Viettel, FPT Semiconductor, CT Semiconductor với P23) vẫn còn | bắt buộc |
| **H4** | Cặp **UAV với Viettel qua cạnh chuỗi giá trị 6 sang 9** vẫn còn | bắt buộc |
| **H5** | Cặp Lâm **đã từ chối** (VNPT với P08) không quay lại | bắt buộc |
| **H6** | Tỷ lệ rác khi đọc tay toàn bộ match: tối đa 20 phần trăm | bắt buộc |
| **H7** | Digest tái lập; v1, v2, v3 vẫn gọi được | bắt buộc |

**H1 và H2 là cặp tiêu chí lõi.** H1 một mình có thể đạt bằng cách siết bừa cho ít match đi; H2 chặn khả năng đó. Cả hai cùng đạt mới chứng minh neo sản phẩm cắt **đúng chỗ**.

Nếu H2, H3, H4 hoặc H5 trượt thì rule v4 hỏng, công bố nguyên trạng, hoàn nguyên như đã làm với TIP-3G.

## Constraints

- Không sửa `methodbox/`. Không xoá rule cũ.
- Không sửa claim gốc, không sửa sổ chữ ký bằng tay.
- **Sao lưu `out/` và sổ chữ ký trước khi chạy.**
- Đọc exit code trần. Em-dash vẫn cấm.
