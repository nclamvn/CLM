# Vòng làm mới nguồn: đo trước, cào sau

Ngày: 18/08/2026.

## STATUS

**PASS, nhưng phần cào chỉ đi được một đơn vị.** 19 ô xanh. Món nợ dữ liệu nay đã đo được
và bị khoá một chiều.

```
claim 201 · truong ben 136 · truong mau hong 65
mau hong qua han: 44 chua co ly do · 2 co ly do nguoi viet
ngan sach 44 · thuc te 44 · OK
```

## Con số cũ của tôi sai, và sai theo hướng nhẹ đi

Bản PDF trạng thái viết "vài đơn vị dựa trên bài từ 2019 tới 2022". Đo bằng máy: **46 claim
mau-hỏng trên 31 đơn vị**, cũ nhất 2771 ngày. Sáu đơn vị nằm trong match đã ký, tức đã mang
chữ ký và có thể trình ra ngoài.

Đây là lần thứ hai một con số tôi ước lượng bằng mắt lệch so với số máy đếm. Lần trước là
"1 vi phạm" trong khi thật là 26.

## Luật độ tuổi phải chia theo loại trường

Áp đều 180 ngày cho mọi trường thì 70% registry quá hạn. Con số vừa to vừa vô nghĩa, và con
số vô nghĩa thì người ta học cách lờ nó.

Già không đồng nghĩa với sai. "Đã sản xuất thành công vaccine cúm A/H5N1" trong bài 2019 vẫn
đúng năm 2026: một thành tựu đã xảy ra thì không hết hạn. Nên cổng chia hai:

**Trường bền** là tên, loại hình, nhóm công nghệ, mã sản phẩm. Đây là định danh và ánh xạ
phân loại, không hết hạn theo thời gian. 136 claim.

**Trường mau hỏng** là mô tả năng lực và bằng chứng năng lực. Chúng khẳng định năng lực hiện
có, tức thứ khách hàng sẽ hiểu là "bây giờ". Càng cũ càng dễ bị vượt qua. 65 claim.

## Miễn trừ phải do người viết ra

Một claim mau-hỏng quá hạn vẫn qua cổng nếu ghi chú có dòng `GIU NGUON CU:` kèm lý do. Không
phải để lách. Có trường hợp chính đáng: nguồn cũ ghi một sự kiện đã xảy ra và không nguồn mới
nào nói khác. Nhưng lý do đó phải nằm trong git dưới dạng chữ, chứ không được suy ra từ sự
im lặng.

## Khoá một chiều thay vì đỏ vĩnh viễn

44 claim còn lại là món nợ thật, phải nhiều vòng cào mới trả hết. Một bảng báo đỏ suốt cả
tháng thì người ta học cách lờ nó, và lúc đó cổng mất tác dụng kể cả với lỗi mới.

Nên cổng không hỏi "đã sạch chưa", nó hỏi **"có tệ đi không"**. `ngan_sach_do_tuoi.txt` giữ
con số hiện tại. Thêm một claim mau-hỏng mà không có nguồn tươi thì đỏ.

Giảm được cũng **bắt dừng**, kèm câu bảo sửa ngân sách xuống. Nghe khó chịu, nhưng giảm mà
vẫn xanh thì con số trong file đứng yên mãi ở 46 và khoá một chiều thành khoá lỏng lẻo. Đã
thử cả hai chiều: 45 báo tệ đi, 43 báo giảm được, 44 xanh.

Cổng cũng từ chối chạy khi thiếu file ngân sách, không tự lấy con số hiện tại làm mặc định.
Tự đóng dấu lên trạng thái đang có chính là cách hợp thức hoá món nợ.

## Phần cào: một đơn vị, và một kết quả đáng nói

Cào lại VNPT Technology, nguồn cũ 31/08/2022 đã 1448 ngày. Tìm được nguồn tier A mới:
mst.gov.vn ngày 02/07/2026, VKIST ký MoU với VNPT Technology.

**Nguồn mới KHÔNG làm mới được claim cũ**, và đây là chỗ dễ tự lừa nhất. Bài nói về một thoả
thuận và các việc **sẽ** làm: nền tảng Edge AI Computing, sản phẩm ODM/OEM. Theo đúng luật
`du_dieu_kien` của domain, năng lực phải đã hình thành chứ không phải ý định. Bài cũng không
nhắc lại thiết bị 5G, tức không xác nhận lại đúng thứ claim 2022 nói.

Xử lý:

Thêm một claim `nang_luc_mo_ta_2` ghi nội dung MoU, kèm ghi chú nói thẳng đây là định hướng
chưa phải năng lực, theo tiền lệ đã dùng cho thoả thuận chip FPT với Viettel.

Hai claim 2022 nhận `GIU NGUON CU:` kèm căn cứ: nguồn mới xác nhận đơn vị **vẫn** có năng
lực nghiên cứu, phát triển và sản xuất, nên không mâu thuẫn, nhưng vẫn cần cào lại khi có
nguồn nói trực tiếp về thiết bị 5G.

46 xuống 44. Hai claim, không phải vì tìm được nguồn mới về 5G, mà vì đã tìm và ghi lại việc
không tìm thấy.

## Việc còn lại

Ba mươi đơn vị, 44 claim. Nhóm nguy hiểm nhất là năm đơn vị còn lại nằm trong match đã ký:
ROSTEK 1688 ngày, Đông Anh 610, FPT Semiconductor 295, CT Semiconductor 295, Viettel 202.

Đã thử cào ROSTEK trong vòng này và **không tìm được nguồn tier A hoặc B nào mới hơn** nói
trực tiếp về ROSTEK. Kết quả tìm được hoặc là trang tự giới thiệu của công ty (tier C, không
đủ cấp), hoặc là bài về công nghệ AMR nói chung không gọi tên đơn vị. Chưa ghi miễn trừ cho
ROSTEK vì một vòng tìm chưa đủ để kết luận là không có.

Không đơn vị nào trong 12 match đã ký bị mất chữ ký trong vòng này: claim thêm vào là trường
mới, không đụng vào câu làm bằng mà chữ ký neo vào.

## Lệnh

```
cd /Users/os/CNCLData
python3 check_do_tuoi.py domains/don_vi_cncl ; echo $?

cd /Users/os/CaoLocMatch
./chay_het_cong.sh    # 19 o
```
