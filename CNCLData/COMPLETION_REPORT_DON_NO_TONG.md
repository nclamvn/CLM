# Vòng dọn nợ tổng, ba việc một mẻ

Ngày: 24/08/2026.

## STATUS

**PASS.** 23 ô xanh. Ba việc xong trong một lượt, hai lần lấy nguồn thay vì năm.

```
doi chung nguon : 33/33 · 128 cau khop · 0 cau lech · KHONG con snapshot nao duoc mien
do tuoi         : 31 -> 29
tham chieu treo : 0
Dabaco, Dacovet : honest-null co can cu, KHONG nap
```

## Việc 1: hai bản chụp hết miễn đối chứng

Lấy lại nguồn cho `vjst_fpt_tokyo` và `mst_vnpttech_vkist`, nạp bản tươi, gỡ hai dòng miễn.
Kết quả: **33 trên 33 bản chụp đối chứng được, 128 câu khớp, 0 câu lệch.**

**Độ mạnh của phép này phải nói rõ.** Bản tươi lấy cùng ngày với bản chụp, nên nó chứng minh
được **chép đúng chữ**, không chứng minh được nguồn chưa đổi. Cái sau phải chờ vòng cào kế.

Nhưng chép đúng chữ đúng là thứ đáng kiểm: vòng 16/08 bắt 26 câu lệch, và phần lớn là lỗi
chép chứ không phải nguồn đổi. Hai bản chụp này tôi tự tay ghép từ kết quả fetch, nên khả
năng ghép sai là có thật. Nay đã loại trừ.

## Việc 2: VinES, đơn vị cũ nhất còn lại

901 ngày. Tìm không ra nguồn 2026 nào gọi đích danh VinES kèm khẳng định năng lực. Bài gần
nhất là baochinhphu 19/03/2026 nhưng viết về **VinFast**, không phải VinES. Hai tên rất dễ
lẫn, và lẫn là hỏng.

Cả hai claim đều là sự kiện có mốc nên miễn trừ có căn cứ: một cái mô tả ngành nghề **lúc
thành lập tháng 8/2021**, một cái là mốc lần đầu.

Nhưng claim thứ hai được ghi **cảnh báo riêng**:

> đã trở thành doanh nghiệp đầu tiên tại Đông Nam Á làm chủ được công nghệ về cell pin

Đây là một khẳng định **so sánh khu vực**, loại dễ bị đối chiếu và bác bỏ, và nó đến từ một
bài báo 06/03/2024 chứ không từ một công bố độc lập. Cùng loại rủi ro với cụm "đầu tiên" của
CT Semiconductor và FPT mà vòng trước đã ghi nhận hai bên cùng nhận.

## Việc 3: Dabaco và Dacovet, không nạp

**Dabaco.** Nguồn VnExpress 08/09/2025 viết "ngoài AVAC còn có Navetco và Dabaco đang sản
xuất và lưu hành". Câu này chứng minh Dabaco **có mặt** trong mảng, nhưng không nói Dabaco tự
phát triển hay chỉ sản xuất theo giấy phép. Mà ranh giới làm chủ với gia công nằm đúng ở đó,
và đó là ranh giới quyết định một đơn vị có được vào registry hay không.

**Dacovet với Dacovac-ASF2.** Chỉ thấy trong bản tóm tắt của máy tìm kiếm, chưa có trang nào
được chụp. Không đủ điều kiện nạp.

Cả hai ghi thành honest-null có căn cứ trong `domain.yaml`, kèm điều kiện cụ thể để nạp ở
vòng sau. Không nạp vì thiếu, chứ không phải quên.

Đáng nói: Dabaco vốn đã nằm trong danh sách "loại vì nguồn, không vì năng lực" từ trước. Vòng
này tìm thêm được một câu nữa mà **vẫn không đủ**. Đó là thông tin có ích: khoảng trống này
không phải do lười tìm.

## Gom mẻ tiết kiệm được gì, đo bằng số

Ba việc, nếu tách thì mỗi việc một vòng tìm nguồn riêng. Gom lại:

```
lay nguon that su:  2 lan (hai ban tuoi)
lay nguon tranh duoc: 3 lan
  - Dabaco: dung lai bai da fetch trong cung phien
  - VinES: tim thay khong co gi moi, dung o buoc tim
  - tham chieu treo vong truoc: ban tuoi da co san tren dia
```

Cái lợi lớn hơn số lần fetch: **thấy được liên hệ giữa các việc**. Bài VnExpress dùng cho
Dabaco chính là bài đã dùng để miễn trừ AVAC ở vòng trước. Làm lẻ thì tôi sẽ fetch lại nó.

## Trạng thái nợ sau vòng này

```
claim mau-hong qua han chua co ly do : 29   (dau ky 46)
claim co ly do nguoi viet            : 18
tham chieu treo                      :  0
snapshot chua doi chung              :  0
```

29 claim còn lại trải trên 13 bản chụp, cũ nhất là FECON 725 ngày và TEDI 692 ngày.

## Lệnh

```
cd /Users/os/CaoLocMatch
./chay_het_cong.sh    # 23 o
```
