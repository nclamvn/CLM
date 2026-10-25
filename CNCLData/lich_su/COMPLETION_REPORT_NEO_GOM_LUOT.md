# Neo lại toàn bộ tham chiếu treo, gom một lượt

Ngày: 24/08/2026.

## STATUS

**PASS.** 23 ô xanh. Tham chiếu treo 12 xuống 0, **không fetch lần nào**.

```
claim: 202 · tham chieu treo: 0 · co ly do da neo: 8
ngan sach 0 · thuc te 0 · OK
```

## Gom lượt, và cái lợi lộ ra ngay ở bước đầu

Anh nói task đang vụn. Đúng, và gom lại lộ ra ngay một chuyện: **cả bốn bản chụp có span
treo đều đã có bản tươi nằm sẵn trên đĩa.** Nếu làm lẻ từng ca thì mỗi ca tôi sẽ lại đi lấy
nguồn về, bốn lần. Gom lại thì kiểm một lần và thấy không cần lấy nguồn lần nào.

Bốn vòng xử, mỗi vòng một cách, chọn theo tình huống chứ không áp một công thức:

**Tám claim neo tự động.** Lùi span về trước từng câu, nguyên văn từ bản tươi, cho tới khi
mọi cụm hồi chiếu đều có chỗ neo trong phạm vi.

**Bốn claim của VinES neo tay.** Bộ dò tự động bó tay, và lý do đáng ghi: tiền ngữ của "thời
gian này" là mốc **"Tháng 8/2021"** ở câu trước, tức một **ngày**, không phải một lần lặp lại
chữ "thời gian". Bộ dò đi theo danh từ nên không thấy, và nó đúng khi từ chối đoán. Neo tay
xong thì claim thành lập VinES với vốn pháp định 6.500 tỷ mới có mốc thật.

**Bốn claim ghi lý do.** ROSTEK và Ngọc Bảo: lùi thêm thì lại lôi vào một cụm hồi chiếu mới,
thành dây chuyền, và span sẽ phình ra cả bài. Dừng lại vì cụm hồi chiếu nằm ở **câu dẫn mô tả
bối cảnh**, còn phần registry khẳng định thì tự đứng được. Lý do ghi riêng cho từng ca, nêu
đích danh cụm nào và vì sao value không phụ thuộc vào nó.

## Hai lỗi tôi tự gây trong lượt này

**Một, viết trước khi tính xong.** Kịch bản đầu ghi bản chụp ngay trong vòng lặp rồi mới
assert. Một assert nổ giữa chừng để lại một bản chụp đã sửa mà claim thì chưa, tức đúng loại
trạng thái nửa vời mà cả hệ này tồn tại để chặn. Cổng `refinery` không bắt được vì lúc đó dữ
liệu vẫn hợp lệ. Đã hoàn nguyên bằng git và viết lại theo lối tính hết rồi mới ghi.

**Hai, miễn trừ quá tay.** Lệnh gán lý do miễn cho **mọi claim** thuộc hai bản chụp đó, 10
claim, trong khi chỉ 4 cái thật sự bị treo. Sáu claim không hề có vấn đề lại đeo một tờ miễn
trừ. Nguy ở chỗ tờ đó sẽ **âm thầm tha một tham chiếu treo trong tương lai** nếu span của
chúng đổi. Đã gỡ khỏi đúng 6 claim, và kiểm lại: số claim đeo lý do bằng đúng số ca bị báo.

Cái assert chặn được lỗi một. Không cổng nào chặn được lỗi hai, tôi tự phát hiện khi thấy con
số 10 không khớp con số 4.

## Đánh đổi phải nói ra

Span nay dài hơn hẳn, có cái thêm hơn 400 ký tự. Đó là cái giá để mọi cụm hồi chiếu có chỗ
neo. Câu làm bằng dài thì khó đọc hơn, nhưng một câu ngắn mà trỏ vào hư không thì không phải
bằng chứng.

Ngân sách tham chiếu treo nay là 0. Khoá một chiều nên thêm một ca mới là cổng nổ ngay.

## Lệnh

```
cd /Users/os/CNCLData
python3 check_tham_chieu_treo.py domains/don_vi_cncl ; echo $?

cd /Users/os/CaoLocMatch
./chay_het_cong.sh    # 23 o
```
