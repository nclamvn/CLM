# Vòng đo đầu ra một con số quá đẹp, và tôi từ chối neo nó

Ngày: 25/08/2026.

## STATUS

**29 ô, 29 xanh.** Registry 204 lên **210 claim**, 42 lên **43 đơn vị**. Vòng đo M1 đầu tiên đã
chạy. Mốc **chưa chốt**, và đó là kết luận có chủ ý.

## Kết quả vòng

```
vong 'nhom 10 duong sat, vong KHO'   5,5 phut   +6 claim   0,92 phut/claim
```

So với lịch sử: 21,6 và 43,9 phút một claim ở hai vòng gần nhất. **Chênh hai bậc.**

## Vì sao tôi không chốt con số này

Một con số đẹp bất thường từ **một mẫu** là thứ dễ tin nhất và nguy nhất.

Neo 0,92 làm mốc nghĩa là M2 phải xuống dưới **0,09 phút một claim** mới được coi là "giảm một
bậc". Đó là đặt ra một cái đích vô nghĩa rồi thất bại với chính nó.

Đã sửa công cụ: `moc` **fail-closed dưới ba vòng**, và ba vòng đó phải khác độ khó nhau. Cùng
một luật đã dùng cho cổng: một cổng chưa từng bắt được lỗi thì chưa chứng minh được nó sống.
**Một mốc dựa trên một mẫu thì chưa phải mốc, nó là một giai thoại.**

## Nhưng nếu con số này đứng vững thì chương trình hôm qua sai chỗ nào

Đây là phần đáng suy nghĩ nhất, và tôi nêu ra dù nó phủ nhận văn bản chính tôi viết hôm qua.

Vòng này **không có người trong vòng lặp**. Không ai cân nhắc, không ai chờ. Máy tìm nguồn,
loại nguồn, viết bản chụp, viết claim, chạy 29 cổng, dựng lại ảnh mốc.

Nếu 0,92 lặp lại được, thì **nút thắt chưa bao giờ là phần cơ học**. M2 đặt mục tiêu tự động
hoá khúc lấy trang, chụp, trích, chạy cổng, nhưng khúc đó hôm nay đã gần như tự động rồi. Cái
làm hai vòng trước tốn 21 và 43 phút một claim là **vòng lặp thảo luận với người**, không phải
thao tác.

Nghĩa là nếu đúng, việc cần làm không phải viết thêm pipeline, mà là **quyết xem chỗ nào thật
sự cần người dừng lại**. Chưa kết luận, vì n bằng 1.

## Việc thật của vòng, và một điểm mù bị lộ

Nhóm 10 trong registry có 2 đơn vị, cả hai thuộc mảng **công trình**. Mảng **phương tiện**, tức
đầu máy và toa xe do Việt Nam chế tạo, là ô trống. Vòng này đi xem ô đó có trống thật không.

**Không trống.** Công ty cổ phần Xe lửa Dĩ An, nhà máy 120 năm tuổi, mỗi năm đóng mới hàng chục
toa xe. cafef.vn 25/09/2024: *"hàng chục toa tàu do chính tay kỹ sư Việt Nam đóng đã ra đời"*.

**Registry trước nay chỉ nhìn các dự án lớn mới công bố và bỏ qua cơ sở đã sản xuất hàng chục
năm.** Ô trống của nhóm 10 không phải ô trống thật, nó là **điểm mù của người đi tìm**. Đã ghi
bài học đó vào `domain.yaml` để vòng sau không lặp lại.

Hai tên lớn bị **từ chối có căn cứ**, ghi rõ chứ không im lặng:

- **THACO**: tổ hợp 320 ha mới khởi công 3/2026, dự kiến vận hành 9/2026, thoả thuận chuyển
  giao công nghệ với Hyundai Rotem. Toàn bộ là ý định và tiến độ, chưa có sản phẩm.
- **Hoà Phát**: nhà máy ray Dung Quất đã xong hơn 50% khối lượng xây dựng, sản phẩm ray đầu
  tiên dự kiến Q1/2027. **Một nhà máy đang xây không phải một dây chuyền đã có.**

## Ba cổng làm đúng việc trong vòng này

**Nợ độ tuổi tăng 23 lên 24, và tôi nhận nó.** Claim `nang_luc_mo_ta` của Xe lửa Dĩ An mô tả
một **chức năng đang tồn tại**, tức trạng thái chứ không phải sự kiện đã xong, nên không miễn
trừ được. Đã tìm bản mới hơn và không có. Nhận nợ còn hơn bỏ một đơn vị **có năng lực thật**
chỉ để giữ con số đẹp. Ghi vào lịch sử ngân sách kèm lý do.

**Cổng `phu_moc` báo KHÔNG CHẠY ĐƯỢC ngay khi registry đổi.** Đúng như thiết kế: thêm một đơn
vị thì con số vùng phủ thành con số cũ, và cổng từ chối báo xanh trên một con số cũ. Phải chụp
lại, chốt mốc, nâng ngân sách 42 lên 43. Đây là lần đầu cổng đó chặn một ca thật chứ không phải
ca tiêm.

**Cắt value có chủ ý.** Câu nguồn còn vế *"đường sắt Việt Nam từ đó đến nay không còn phải đi
nhập khẩu toa tàu ở nước ngoài"*. Đó là khẳng định tuyệt đối về cả ngành, không kiểm được, và
không phải điều registry cần khẳng định. Span giữ nguyên vì span là chữ của nguồn.

## Còn lại để đóng M1

Hai vòng nữa, khác độ khó. Đề nghị: một vòng **dễ** (nguồn dày, nhiều claim một trang) và một
vòng **hỏng** có chủ ý, tức đi tìm một thứ nhiều khả năng không có, để đo cả chi phí của vòng
không ra claim nào. Vòng hỏng cũng là chi phí thật.
