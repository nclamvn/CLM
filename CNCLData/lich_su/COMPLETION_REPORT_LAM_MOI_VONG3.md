# Vòng làm mới thứ ba: bốn đơn vị cũ nhất ngoài match

Ngày: 24/08/2026.

## STATUS

**PASS.** 22 ô xanh. Nợ độ tuổi 37 xuống 32.

```
mau hong qua han: 32 chua co ly do · 15 co ly do nguoi viet
ngan sach 32 · thuc te 32 · OK
```

## Kết quả, và con số đáng chú ý nhất

**Không cào được nguồn mới nào đủ tuổi. Không một cái nào.** Năm claim giảm là do ghi lý do
giữ nguồn cũ có căn cứ, một claim thì cố ý không ghi.

| Đơn vị | Tuổi | Kết quả |
|---|---|---|
| IVAC | 2783 ngày | Miễn trừ. Sự kiện đã xảy ra, tìm không ra nguồn mới |
| AVAC | 1127 ngày | Miễn trừ, có nguồn 08/09/2025 chứng thực nhưng vẫn quá hạn |
| NAVETCO | 1127 ngày | Miễn trừ. Tên sản phẩm đã cấp phép, là định danh |
| Công ty An ninh mạng Viettel | 2697 ngày | **KHÔNG miễn trừ** |

Tỉ lệ vòng này: năm miễn trừ trên sáu claim, không nguồn mới. Nếu tỉ lệ này giữ nguyên thì
32 claim còn lại phần lớn sẽ kết thúc bằng ghi lý do chứ không bằng cào lại, tức món nợ nhẹ
hơn tôi tưởng nhưng cũng **ít cải thiện dữ liệu hơn tôi hứa**. Nên nói rõ điều đó.

## Chỗ không miễn trừ mới là chỗ đáng nói

Claim của Công ty An ninh mạng Viettel là:

> 100% các sản phẩm này đều được nghiên cứu, phát triển hoàn toàn bởi đội ngũ nhân sự của
> công ty

Ba đơn vị kia nói về **một việc đã xảy ra**: đã sản xuất thành công vắc xin, đã hoàn thành
thử nghiệm lâm sàng, đã được cấp phép lưu hành. Việc đã xảy ra thì không hết hạn.

Câu này khác. Nó là một **khẳng định trạng thái phủ toàn bộ danh mục sản phẩm năm 2019**.
Danh mục đổi thì câu có thể sai mà không ai biết, vì không có sự kiện nào để neo vào. Bảy
năm là quá dài cho một chữ "100%".

Đây là chỗ dễ nhân nhượng nhất: bốn đơn vị đều cũ, đều tìm không ra nguồn, dễ ghi cùng một
lý do cho cả bốn cho xong. Nếu làm thế thì `GIU NGUON CU:` biến từ một phép kiểm thành một
con dấu. Đã ghi rõ vào claim vì sao chưa miễn trừ được và hai hướng xử tiếp.

## Đã tìm những gì, và không thấy gì

**AVAC và NAVETCO.** Nguồn mới nhất tìm được là vnexpress.net 08/09/2025, 350 ngày, nói lô
340.000 liều Avac ASF Live xuất sang Philippines là lô thứ hai trong 600.000 liều chính phủ
nước này đặt mua. Nội dung còn mạnh hơn claim cũ, nhưng **vẫn quá 180 ngày nên không tính là
làm mới**. Nạp nó vào chỉ làm tăng thêm một claim mau-hỏng quá hạn.

Nguồn tier A mới nhất đúng lĩnh vực là QĐ 779/QĐ-TTg ngày 02/05/2026, mới 114 ngày. Đã đọc:
văn bản chỉ nói chung về "loại vaccine được phép lưu hành", **không gọi đích danh doanh
nghiệp nào**, nên không dùng làm bằng chứng đơn vị được.

**Viettel Cyber Security.** Bài hứa hẹn nhất là nhandan.vn 12/05/2026 với tiêu đề về giải
pháp an ninh mạng "make in Vietnam". Đọc ra thì đó là bài về **SafeGate của công ty SCS**,
không phải Viettel. Suýt nhầm vì tiêu đề và chủ đề trùng khớp.

**IVAC.** Không có bài nào từ 2026 gọi đích danh IVAC kèm khẳng định năng lực tương đương.

## Một khoảng trống của registry lộ ra ngoài lề

Nguồn 2025 cho biết ngoài AVAC và NAVETCO còn có **Dabaco** sản xuất vắc xin dịch tả lợn
châu Phi, và kết quả tìm kiếm nhắc tới một loại thứ ba đã được cấp phép là **Dacovac-ASF2
của Dacovet**.

Registry hiện chỉ có AVAC và NAVETCO ở mảng này, và Dabaco thì đang nằm trong danh sách
"loại vì nguồn, không vì năng lực". Chưa nạp gì vì chưa có bản chụp nguyên văn. Ghi ra đây
để vòng sau không phải tìm lại.

## Lệnh

```
cd /Users/os/CNCLData
python3 check_do_tuoi.py domains/don_vi_cncl ; echo $?

cd /Users/os/CaoLocMatch
./chay_het_cong.sh    # 22 o
```
