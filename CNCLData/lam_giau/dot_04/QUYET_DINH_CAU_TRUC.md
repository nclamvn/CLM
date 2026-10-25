# Lô 04 · Những việc bảng duyệt không nói được (24/10/2026)

`BANG_DUYET.md` chỉ chứa những dòng nạp được vào registry theo khuôn sáu trường gắn danh mục P của QĐ 21. Nghiên cứu lô 04 tìm được nhiều hơn thế. Phần còn lại cần anh quyết về cấu trúc, không phải về từng dòng.

## 1. Chín cặp bên cung đúng việc nhưng không có mã P

Phần lớn đặt hàng của mũi nhọn Hà Nội (btl-04, 09, 10) không trùng sản phẩm nào trong danh mục P. Khuôn hiện tại bắt mỗi đơn vị phải gắn một mã P, nên các cặp dưới đây nằm ngoài registry dù câu nguồn đúng việc. Dữ liệu đầy đủ, nguyên văn, ở `ung_vien_ngoai_P_*.jsonl` (35 dòng).

| Đặt hàng | Đơn vị | Nguồn (ngày bài) | Độ tươi |
|---|---|---|---|
| btl-04 Ngập úng | Công ty CP Tư vấn và Phát triển kỹ thuật tài nguyên nước | nhandan.vn 03/05/2026; en.mae.gov.vn 19/03/2026 | còn hạn |
| btl-01 Giao thông | ELCOM | baodautu.vn 18/11/2025 | quá 180 ngày |
| btl-04 Ngập úng | Trung tâm Nghiên cứu triển khai, Khu CNC TP HCM | sggp.org.vn 18/03/2021 | quá hạn |
| btl-09 Nền tảng đô thị | Viettel Solutions (IOC Huế) | quanlynhanuoc.vn 04/08/2022 | quá hạn |
| btl-09 Nền tảng đô thị | VNPT (IOC) | mst.gov.vn 25/09/2020; doanhnghiephoinhap.vn 26/10/2020 | quá hạn |
| btl-09 Nền tảng đô thị | VNPT Technology | viettimes.vn 25/05/2018 | quá hạn |
| btl-10 Văn hoá số | Bizverse | nhandan.vn 20/09/2022; vneconomy.vn 06/02/2023 | quá hạn |
| btl-10 Văn hoá số | VR360 | nhandan.vn 13/10/2024 | quá hạn |
| btl-02 Trật tự đô thị | Tập đoàn Viettel | tuoitre.vn 25/07/2019 | quá hạn |

Đề xuất: dựng lớp **bên cung theo cầu thật** (gói G6), khoá theo mã đặt hàng `btl-xx` thay vì mã P, cùng luật span nguyên văn, hạng nguồn, độ tươi. Chỉ cặp đầu (tài nguyên nước, btl-04) còn hạn; tám cặp kia cần nguồn 2026 trước khi nạp dù khuôn nào.

## 2. Ô năng lực chỉ có một giá trị

VNPT và Tập đoàn Viettel đã kín `nang_luc_mo_ta` và `nang_luc_mo_ta_2`. Năng lực mới của họ (IOC, giám sát an toàn thông tin) không có chỗ để nạp; nạp đè sẽ thành tranh chấp (cổng `O_DA_CO_GIA_TRI` chặn đúng). Đề xuất: thêm ô năng lực theo đặt hàng (`nang_luc_btl_xx`), không thêm `nang_luc_mo_ta_3`, để mỗi năng lực gắn với một nhu cầu cụ thể.

## 3. Đơn vị nhà nước làm bên cung

Máy tìm gặp Đài Khí tượng thuỷ văn Nam Bộ cho btl-04. Luật hiện hành chỉ nhận doanh nghiệp, viện và trường. Anh quyết có mở cho đơn vị sự nghiệp nhà nước hay không; chưa nới gì.

## 4. Tên miền mới chờ duyệt

vietnamplus.vn (đã dùng trong bảng duyệt), dronelife.com (tìm trong vòng làm tươi, chưa dùng), quanlynhanuoc.vn, doanhnghiephoinhap.vn, viettimes.vn, sggp.org.vn, en.mae.gov.vn, bavutex.baria-vungtau.gov.vn.

## 5. Bài học ghi lại

Lô 01 nạp bài tháng 4 vào cuối tháng 9; ba tuần sau bảy claim quá hạn và chuỗi đỏ ngày 24/10. Lô 04 thay nguồn cho Viettel Solutions trước khi trình để không lặp lại. Đề xuất cho `kiem_lo.py`: cờ `SAP_HET_HAN` cho mọi dòng mẫu-hồng có bài cũ hơn 150 ngày, để người duyệt thấy ngay trong bảng.
