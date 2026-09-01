# Một lệnh cho toàn chuỗi cổng

Ngày: 18/08/2026.

## STATUS

**PASS.** 14 ô, 14 xanh, chạy hết trong 11,6 giây. Bốn bộ răng đều cắn, kể cả răng của
chính cái bảng.

```
tong 14 · xanh 14 · do 0 · khong chay duoc 0
TAT CA XANH.
```

## Vấn đề

Chuỗi cổng đã lên 14 bước nằm ở hai kho khác nhau. Muốn biết hệ còn xanh hay không phải gõ
mười mấy lệnh và tự nhớ thứ tự.

Cái giá của sự rườm không phải thời gian, mà là **những lần bỏ sót**. Hai vòng liên tiếp
quên bước chép bản chụp sang miền dẫn xuất. Một vòng khác in ra bản PDF ghi "1 vi phạm"
trong khi số thật là 26. Cả ba đều không phải lỗi kiến thức, mà là lỗi của việc phải nhớ.

Một cổng chỉ đáng tin khi nó rẻ tới mức không ai muốn bỏ qua.

## Ba luật của chính cái lệnh gộp

**Một, cổng KHÔNG CHẠY ĐƯỢC thì không được tính là xanh.** Cổng đối chứng nguồn trả exit 3
khi không có bản tươi nào để so. Một bảng làm ẩu sẽ gom thành "khác 0 là đỏ", hoặc tệ hơn
là "không phải 2 thì coi như xong". Cả hai cách đều xoá mất một phân biệt có thật:
**không biết** khác hẳn **biết là sai**. Bảng có ba trạng thái chứ không phải hai.

**Hai, exit khác 0 nếu có bất kỳ ô nào không xanh**, kể cả ô "không chạy được".

**Ba, in hết bảng rồi mới thoát.** Dừng ở cổng đỏ đầu tiên sẽ giấu tình trạng các cổng sau,
và người đọc sẽ sửa một lỗi rồi chạy lại để phát hiện lỗi tiếp theo, lặp nhiều vòng.

Kèm hai chế độ: `--nhanh` bỏ qua khối răng và **nói thẳng ra rằng kết quả này yếu hơn**;
`--im` chỉ in bảng cho lúc gắn vào tự động hoá.

## Răng của chính cái bảng

Một bảng chỉ biết in XANH thì không phân biệt được với một máy phát đèn xanh, và nó nguy
hơn không có bảng vì tạo cảm giác đã kiểm. `bite_chay_het_cong.py` dựng ba tình huống:

```
RANG 1 · bao DO khi co loi that        : CAN OK (exit 1, refinery DO)
RANG 2 · vang tin khong phai tin tot   : CAN OK (KHONG CHAY DUOC, exit khac 0)
RANG 3 · khong bao DO oan              : CAN OK (exit 0, tat ca xanh)
```

Răng một tiêm một lỗi thật vào registry rồi kiểm xem bảng có gọi đúng tên cổng hỏng không.

Răng hai giấu thư mục bản tươi đi, tức lấy mất **điều kiện chạy** của một cổng chứ không
phải làm nó sai. Đây là răng quan trọng nhất, vì nó là chỗ dễ nhân nhượng nhất: một cổng
không chạy được thì im lặng cho qua là cám dỗ rất tự nhiên.

Răng ba kiểm chiều ngược: trả lại nguyên trạng thì phải xanh lại. Không có răng này thì một
bảng luôn báo đỏ cũng sẽ đỗ hai răng đầu.

Răng này nằm ngay trong danh sách của chính cái lệnh, không đệ quy vô hạn vì nó gọi lại
script với `--nhanh`, mà `--nhanh` bỏ qua toàn bộ khối răng, nên chỉ sâu đúng một tầng.

## Bảng khi có cổng đỏ

Thử tiêm một câu bịa vào claim đầu tiên:

```
--- CNCLData / refinery (exit 2) ---
GATE BITES · [SPAN_NOT_FOUND] claim#0 entity='Viettel High Tech' field='ten_don_vi'

--- CaoLocMatch / build_dan_xuat (exit 2) ---
SPAN_LOST: Viettel High Tech / entity_name khong con trong cafef_dn_uav_20250903.html
FAIL: 2 loi truoc khi ghi. Khong ghi gi ca.

CO CONG DO. Khong duoc trinh ket qua ra ngoai truoc khi xu ly.
```

Một lỗi làm đỏ ba ô, và bảng cho thấy nó lan theo đúng chiều phụ thuộc: registry hỏng thì
răng của registry không cắn được nữa, và miền dẫn xuất từ chối ghi. Đó là thông tin có ích
hơn một dòng "FAIL" duy nhất.

## Điều bảng này chưa làm được

Nó chạy **các cổng đã có**, không phát minh ra cổng mới. Hai chỗ vẫn nằm ngoài:

Cổng đối chứng nguồn cần người nạp bản tươi vào `.fidelity_fresh`. Nó cố ý không tự gọi
mạng, nên bảng xanh chỉ chứng minh snapshot khớp với bản tươi **hiện có**, không chứng minh
bản tươi đó mới.

Chất lượng so khớp không có cổng nào cả. Bốn hướng cải tiến, hai thành hai bại, và cái quyết
định đúng sai là nghĩa chứ không phải chữ. Bảng xanh nói hệ **trung thực**, không nói hệ
**khớp giỏi**. Hai chuyện khác nhau và không nên để lẫn.

## Lệnh

```
cd /Users/os/CaoLocMatch
./chay_het_cong.sh            # day du, 12 giay
./chay_het_cong.sh --nhanh    # bo qua rang, 1 giay, YEU hon
python3 bite_chay_het_cong.py # kiem chinh cai bang
```
