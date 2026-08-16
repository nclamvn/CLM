# Completion + VERIFY · TIP-CNCL-2E · nhóm 5 và nhóm 4

Ngày: 16/08/2026. Vai: Thợ thi công, Chủ thầu kiểm ngược.

## STATUS

**DONE.** Cả hai nhóm đạt target, tier A tăng, không ô tranh chấp nào.

## Số thật

| Mốc | Claim | Đơn vị | Snapshot | Nhóm | Tier A |
|---|---|---|---|---|---|
| Pha 2d | 103 | 24 | 15 | 5 | 29 (28,2%) |
| **Pha 2e** | **139** | **33** | **23** | **7** | **47 (33,8%)** |

Phân bố: nhóm 1 = 7, nhóm 2 = 1, nhóm 3 = 4, **nhóm 4 = 5**, **nhóm 5 = 4**, nhóm 6 = 4, nhóm 9 = 7, chưa rõ = 1. Coverage chỉ báo 34,7%.

Digest `3e7f17b241f1e71c`, refinery và bites và check_dash đều exit 0.

**Chín đơn vị mới.** Nhóm 5: Tổng công ty Thiết bị điện Đông Anh (A), GG Power (B), Viện Hàn lâm Khoa học và Công nghệ Việt Nam (B), Công ty Cổ phần Giải pháp Năng lượng VinES (B). Nhóm 4: Viện Vaccine và sinh phẩm y tế IVAC (A), NAVETCO (A), AVAC Việt Nam (A), Công ty Cổ phần Y Sinh Ngọc Bảo (B), Viện Di truyền Nông nghiệp Việt Nam (B).

## Ca mạnh nhất từ trước tới nay

Tổng công ty Thiết bị điện Đông Anh: nguồn tier A, sản phẩm vật lý đã xuất xưởng, đã đạt toàn bộ hạng mục thử nghiệm theo tiêu chuẩn IEC. Không có yếu tố kế hoạch nào. Đây là bằng chứng năng lực chắc nhất trong toàn registry hiện nay.

## Chủ thầu bắt được một vi phạm của Thợ

Cổng luật 3 (value phải nằm trong span) bắt được một claim sai:

```
entity : Viện Hàn lâm Khoa học và Công nghệ Việt Nam
field  : ten_don_vi
span   : "...Viện phát triển công nghệ lõi điện phân nước..."
```

Span dùng dạng rút gọn "Viện", không chứa tên đầy đủ. Thợ ghi `extraction: verbatim` là **sai nhãn**. Đã sửa thành `normalized` kèm ghi chú rõ tên đầy đủ lấy từ tiêu đề bài của vjst.vn.

Đáng chú ý: **refinery vẫn exit 0 với claim sai này**, vì cổng SPAN_NOT_FOUND chỉ kiểm span có trong snapshot, không kiểm value có trong span. Luật 3 hiện do Chủ thầu kiểm bằng script rời chứ chưa thành cổng máy. Đó là khe hở thật, ghi vào mục còn nợ.

## Điều làm bức tranh xấu đi, nêu thẳng

**1. Ba trong bốn đơn vị nhóm 5 có vấn đề về mức độ tự chủ hoặc về nguồn.**

- **GG Power**: nền công nghệ là **licensing từ đối tác nước ngoài**, không phải tự phát triển. Dây chuyền có thật và đã giới thiệu 04/2026, nhưng đây là sản xuất theo license. Ghi rõ trong note.
- **Viện Hàn lâm**: năng lực ở **cấp nghiên cứu lab hoặc pilot**, chưa phải dây chuyền công nghiệp. Nguồn gọi tên pháp nhân mẹ, không chỉ đích danh viện thành viên nào.
- **VinES**: câu "đầu tiên tại Đông Nam Á làm chủ công nghệ cell pin" là **khẳng định của toà soạn, không dẫn nguồn kiểm chứng**. Ghi vào note để đọc như claim chứ không phải sự thật cứng. Thêm nữa, cùng bài ghi VinES đã được tặng 99,8% cho VinFast tháng 10/2023, nên **tư cách pháp nhân độc lập hiện nay chưa kiểm chứng**.

Nghĩa là nhóm 5 chỉ có **một** đơn vị (Đông Anh) đạt chuẩn năng lực tự chủ không kèm dấu hỏi.

**2. Nguồn cũ.** IVAC dùng bài 2019, VinES dùng bài 2024. Cả hai vượt `refresh_days` 180. Đã ghi note, chưa cào lại.

**3. Hai ô trống thật của nhóm 5, không phải do chưa tìm.** Thu giữ và lưu trữ carbon: toàn bộ nguồn là nghiên cứu tiềm năng và khung pháp lý dự thảo. Hydrogen xanh ở cấp chế tạo thiết bị điện phân: không tìm thấy đơn vị Việt Nam nào chế tạo được thiết bị.

**4. Một ô trống thật của nhóm 4.** Cảm biến sinh học thông minh: không đơn vị nào đạt ngưỡng bằng chứng với nguồn tier A hoặc B.

## Loại có kỷ luật

- **Lọc hóa dầu Bình Sơn (BSR)**: lô SAF đầu tiên là **pha trộn** neat SAF nhập khẩu với Jet A-1, không phải chế tạo phân tử. Loại khỏi diện công nghệ lõi.
- **TGS Trà Vinh Green Hydrogen**: dừng ở khởi công, dự án chậm tiến độ, là chủ đầu tư mua thiết bị chứ không chế tạo.
- **Petrovietnam, Vietsovpetro, Viện Dầu khí**: CCS còn ở mức nghiên cứu và dự thảo luật.
- **T&T Group**: tiêu đề nguồn tự nó là thì tương lai.
- **Taihan Cable, Nanofilm**: doanh nghiệp nước ngoài, ngoài định nghĩa domain.
- **Nhà máy Vắc xin VNVC**: kế hoạch vận hành 2027 đến 2029.
- **Bệnh viện Chợ Rẫy** (in 3D titan): nguồn ghi rõ thiết kế và in trong khuôn khổ hợp tác với CSIRO Australia, chi phí do chương trình hợp tác hỗ trợ. Là năng lực ứng dụng lâm sàng, không chứng minh làm chủ công nghệ lõi phía Việt Nam.
- **VABIOTECH, POLYVAC, NANOGEN**: bằng chứng công khai chỉ thuộc giai đoạn 2020 đến 2021 ở mức thử nghiệm, chưa có sản phẩm cấp phép trong nguồn đúng tier.
- **Dabaco** (vắc xin Dacovac-ASF2): **đủ điều kiện về nội dung** (cấp phép lưu hành 28/02/2025, nhà máy 200 triệu liều mỗi năm) nhưng không tìm được bài trên tier A hoặc B. **Loại vì thiếu nguồn đúng tier, không phải vì thiếu năng lực.** Đây là ứng viên tốt nhất nếu quyết định nới tier.

## Rủi ro kỹ thuật được cảnh báo trước

Tiến trình ghi snapshot tự khai: bài vneconomy về chỉnh sửa gen có **xuống dòng cứng giữa câu** trong HTML gốc, nên hai câu dài đã được nối lại bằng cách thay ngắt dòng bằng dấu cách. Tôi **không dùng hai câu đó làm evidence_span**, chỉ dùng câu lấy từ sapo vốn là một dòng liền. Nhờ vậy cổng đối chứng nguồn sau này sẽ không báo lệch giả.

## Còn nợ

1. **Luật 3 chưa thành cổng máy.** Hiện do Chủ thầu kiểm bằng script rời. Vòng này nó bắt được lỗi thật, nên đáng đưa vào `check_dash.py` hoặc một cổng riêng.
2. **Universe chưa cập nhật cho nhóm 4 và 5.** Giữ 95, coverage tiếp tục ghi nhãn chỉ báo.
3. Quyết định có nới tier cho Dabaco hay không.
4. Ba nhóm còn lại: 7 (an ninh mạng và lượng tử), 8 (biển đại dương lòng đất), 10 (đường sắt).

## Lệnh tái lập

```
cd /Users/os/CNCLData
python3 methodbox/refinery.py domains/don_vi_cncl ; echo $?
python3 methodbox/bites.py domains/don_vi_cncl    ; echo $?
python3 check_dash.py                              ; echo $?
```
