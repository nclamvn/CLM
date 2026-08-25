# M1 · Đo giá thành, và phần rẻ đã hái xong

Ngày: 25/08/2026.

## STATUS

Ngưỡng thất bại đã chốt trong `00_KHUNG_SAN_PHAM.md`. Công cụ đo đã có. Mốc M1 **chưa đóng**,
vì còn thiếu vòng đo thật, và công cụ **từ chối** lấy số lịch sử thay thế.

## Số lịch sử, dựng lại từ git

```
buoi bat dau         phut  claim +  phut/claim
16/08/2026 10:07      157      127        1,24
18/08/2026 16:27       88        2       43,85
24/08/2026 20:24       43        2       21,63
TONG                  288      131        2,20
```

## Phát hiện chính, và nó đắt hơn con số trung bình

**Giá thành trải từ 1,24 tới 43,85 phút một claim. Chênh 35 lần.** Và chiều của nó là chiều
xấu: vòng càng gần đây càng đắt.

Lý do không bí ẩn. Ngày 16/08 là ngày hái quả thấp: một bài của cơ quan nhà nước dày đặc thông
tin cho ra ba chục claim một lượt. Hai vòng gần đây là đi săn một sự thật cụ thể, phải tìm
nhiều nguồn, loại một bài có tài trợ, loại một trang thương hiệu còn nguyên chữ mẫu, rồi mới
lấy được hai claim.

**Con số trung bình 2,20 bị chi phối bởi đúng một ngày dễ, và nó nói dối về tương lai.** Phần
rẻ của mỏ đã hái xong. Cái còn lại đắt hơn một bậc.

Hệ quả trực tiếp lên kế hoạch: con số 5,5 claim mỗi ngày dùng để tính ra "12 năm" cũng đến từ
giai đoạn dễ. Con số thật của biên hiện nay xấu hơn.

## Đã siết tiêu chí thoát của M2 ngay hôm nay

Tiêu chí cũ là "giá thành giảm ít nhất một bậc so với mốc M1". Với dải 35 lần thì tiêu chí đó
**tự lừa được**: chỉ cần tự động hoá khúc dễ rồi so với trung bình cũ là "đạt", mà không giảm
được gì thật.

Sửa: **so sánh phải cùng độ khó claim. Đo trên cùng loại vòng, hoặc không đo.**

## Công cụ, và chỗ nó cố ý từ chối chạy

`do_gia_thanh.py` có hai phép đo và **cấm trộn chúng**:

- `lich_su` dựng từ git. Rẻ, có ngay, và là **cận dưới của chi phí**: nó chỉ thấy khúc gõ phím
  giữa hai commit, không thấy khúc đi tìm nguồn, đọc bài, loại bài tài trợ, viết ghi chú, chạy
  cổng. Mà đó mới là khúc tốn thời gian nhất.
- `bat_dau` / `ket_thuc` bấm giờ một vòng làm thật.

Lệnh `moc` **fail-closed**: chưa có vòng đo thật thì nó trả KHÔNG CHẠY ĐƯỢC chứ không lặng lẽ
lấy số `lich_su`.

Đây là chỗ dễ gian lận nhất của cả mốc M1, nên nó phải cứng. Hai đại lượng khác nhau, trộn lại
thì M2 sẽ "đạt mục tiêu giảm một bậc" mà thực tế không giảm gì.

Vòng nào chạy mà không ra claim nào cũng được ghi vào sổ với `phut_moi_claim: null`, không
tính vào mẫu số. Vòng hỏng là chi phí thật, nhưng đưa nó vào mẫu số là chia cho không.

## Còn lại để đóng M1

Một vòng làm thật có bấm giờ, rồi chốt ngân sách. Vòng đó nên là một vòng **khó**, không phải
vòng dễ, vì mốc dùng để so về sau phải là mốc của phần việc còn lại chứ không phải phần đã
hái xong.

## Lệnh

```
cd /Users/os/CNCLData
python3 do_gia_thanh.py lich_su
python3 do_gia_thanh.py bat_dau "<nhan vong>"
python3 do_gia_thanh.py ket_thuc
python3 do_gia_thanh.py moc
```
