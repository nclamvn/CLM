# M1 đóng · mốc 0,80 phút một việc, và cái mẫu số suýt nói dối

Ngày: 25/08/2026.

## STATUS

**Mốc M1 đã chốt: 0,80 phút một việc.** 29 ô, 29 xanh. Registry 219 claim, 44 đơn vị. Nợ độ
tuổi 24 xuống **21**.

## Ba vòng, khác độ khó, và một dải rất hẹp

```
vong                                    phut  claim moi  go no  p/claim  p/viec
nhom 10 duong sat (nap moi, KHO)         5,5          6      0     0,92    0,92
vac xin ASF (chon de HONG)               5,0          7      0     0,71    0,71
lam moi 3 claim qua han                  3,9          2      3     1,96    0,78
TONG                                      14         15     18     0,96    0,80
```

Ba con số túm trên **một dải hẹp**, khác hẳn dải 35 lần của lịch sử git. Lý do khác nhau đã
ghi vào file ngân sách: ba vòng này đo **thời gian thật của một vòng có agent làm**, còn số
lịch sử đo khoảng cách giữa các commit trong một buổi có người thảo luận. Hai đại lượng khác
nhau, cấm so với nhau.

## Mẫu số suýt làm một vòng tốt trông như vòng tệ

Vòng ba là vòng **làm mới**. Nó chỉ thêm 2 claim, nhưng **gỡ 3 claim khỏi danh sách nợ**. Công
cụ lúc đó chỉ đếm claim mới, nên nó báo **1,96 phút một claim**, tức đắt gấp đôi hai vòng kia,
trong khi thực tế nó làm nhiều hơn.

Đây không phải chi tiết kế toán. **Cả mốc M3 sống chết ở việc làm mới, và một thước đo không
nhìn thấy công việc làm mới thì không đo được M3.** Nếu neo mốc theo claim mới, mọi nỗ lực làm
mới về sau sẽ trông như thụt lùi, và sức ép sẽ dồn về phía bỏ làm mới để giữ con số đẹp.

Sửa: thêm phép đo **việc**, trong đó một việc là một claim mới **hoặc** một claim được gỡ khỏi
nợ. Vòng ba tính lại là **0,78**, ngang bằng hai vòng kia.

Hàm đọc nợ gọi thẳng `check_do_tuoi.py` chứ không chép lại logic. Chép lại là tạo hai nguồn sự
thật, và đến lúc chúng lệch nhau thì không ai biết cái nào đúng.

Ba vòng đầu được **bổ sung ngược** trường `go_no`, và trường `go_no_bo_sung_nguoc: true` ghi rõ
đó không phải số đo lúc chạy. Không giả vờ là đã đo từ đầu.

## Vòng chọn để hỏng lại không hỏng, và nó tìm ra một lỗi cũ

Vòng hai nhắm vào Dabaco, thứ đã honest-null hai lần. Kết quả: **kết luận cũ sai**, và sai vì
**áp luật không đều**. Kết luận cũ đòi Dabaco chứng minh "tự phát triển", trong khi AVAC và
NAVETCO vào registry nhờ đúng một câu nói họ "nghiên cứu, sản xuất". Không đơn vị nào trong ba
đơn vị tự tạo chủng giống.

**Lần thứ hai trong hai ngày cùng một dạng lỗi**, sau FECON so với MobiFone. Điểm chung đáng
ngại: cả hai lần đều lộ vì đi kiểm lại một kết luận cũ, **không phải vì cổng bắt được**. Không
cổng nào đối chiếu được một đơn vị **bị loại** với một đơn vị **đã nạp** trong cùng mảng.

## Làm mới không đồng nghĩa xoá nợ

Ba claim được xử trong vòng ba, **chỉ một** xoá được nợ bằng nguồn thật sự còn trong hạn:
VinMotion, cafef.vn 20/08/2026, mới 5 ngày.

NCS thì nguồn mới nhất tìm được là mst.gov.vn 03/11/2025: mới hơn 4 tháng và **lên tier A**,
nhưng vẫn quá 180 ngày. Đó là miễn trừ dựa trên **đối chứng**, không phải nguồn còn hạn. Khác
biệt này đã ghi vào lịch sử ngân sách vì nó sẽ lặp lại thường xuyên khi registry lớn lên.

## Ý nghĩa cho M2, nói thẳng

Mốc là **0,80 phút một việc**. M2 hứa giảm một bậc, tức phải xuống **0,08**. Với ba vòng cho
thấy chi phí đã gần như bằng chi phí của một lượt gọi mạng cộng một lượt viết file, tôi không
tin M2 như đang viết có thể đạt.

Điều đó **không có nghĩa M2 sai**, mà có nghĩa **M2 đang nhắm sai nút thắt**. Nút thắt không
còn là thao tác trên một vòng, nó là **số vòng chạy được mỗi ngày**, tức lập lịch và chạy song
song, không phải tối ưu bên trong một vòng.

Chưa sửa M2 trong báo cáo này. Đó là quyết định của người, và nó cần nhìn thêm vài vòng nữa.

## Lệnh

```
cd /Users/os/CNCLData
python3 do_gia_thanh.py moc        # 0,80 phut moi viec
python3 do_gia_thanh.py bat_dau "<nhan>"   # vong sau tu do go_no
```
