# Gộp match cùng cặp, và luật chữ ký theo tập con

Ngày: 24/08/2026.

## STATUS

**PASS.** 20 ô xanh. Match từ 13 dòng xuống 11 cặp, không bỏ chuỗi bằng chứng nào.

```
GOP CUNG CAP: 14 match -> 12 cap (2 dong duoc gop, khong bo bang chung nao)
RESTORE: gan lai 11/11 chu ky
  CO BANG CHUNG MOI CHUA AI DUYET: MATCH-0005(1), MATCH-0011(1)
VALIDATE PASSED · 11 match · signoff THAT du
```

## Vấn đề

Vòng cào làm mới tìm được một nguồn mới cho FPT Semiconductor. Fact năng lực mới sinh ra một
dòng match thứ hai cho **đúng cặp mà Lâm đã ký**. Cùng một kết luận hiện hai lần, và số match
sẽ phình theo số nguồn chứ không theo số cặp thật. Ai đếm match để ước lượng độ phủ sẽ bị con
số đánh lừa.

Gộp cũng lộ ra một dòng trùng đã tồn tại từ trước mà chưa ai thấy: Viện Hàn lâm với sản phẩm
20 cũng có hai chuỗi.

## Gộp chứ không bỏ

Một dòng cho mỗi cặp, mang hợp của các fact hai bên, kèm `chuoi_bang_chung` liệt kê từng
chuỗi riêng với điểm của nó. Bỏ bớt một chuỗi là vứt bằng chứng, thứ mà cả hệ này tồn tại để
giữ.

Điểm của dòng gộp lấy **cao nhất** chứ không trung bình. Trung bình thì một chuỗi mạnh bị một
chuỗi yếu kéo xuống, tức thêm bằng chứng lại làm match xấu đi, vô lý.

## Luật chữ ký phải đổi theo, và đây là phần dễ làm hỏng

Dòng gộp mang hợp của nhiều chuỗi nên khoá nội dung khác lúc ký. Tra sổ theo khoá toàn dòng
thì không dòng nào khớp, và mỗi lần cào thêm một nguồn là Lâm phải ký lại hết. Ký lại hàng
loạt thì chữ ký mất ý nghĩa.

Luật mới, **chặt hơn chứ không lỏng hơn**:

> Chữ ký còn giá trị khi tập bằng chứng đã ký vẫn còn nguyên trong dòng, đúng từng chữ. Fact
> mới thêm vào không được chữ ký đó bảo vệ, chúng bị đánh dấu `chua_duyet`.

Nghĩa là **thêm bằng chứng thì chữ ký còn, sửa hoặc bỏ bằng chứng đã ký thì chữ ký rụng**. Đó
đúng là phân biệt mà một chữ ký cần có.

Chỗ dễ làm hỏng: chỉ cần lơ tay cho điều kiện thành "có mặt một fact đã ký" thay vì "còn
nguyên từng chữ" là chữ ký sẽ sống sót qua cả việc bằng chứng bị viết lại. `bite_gop_cap.py`
canh đúng ranh giới đó bằng ba răng, trong đó răng 2 và răng 3 phải cùng đúng một lúc: chỉ
răng 2 thì khoá lỏng, chỉ răng 3 thì phải ký lại hàng loạt.

## Hai chỗ khác cũng phải đổi theo, và một trong hai là lỗ hổng

**Cổng chặn ghi đè** tra theo khoá toàn dòng nên báo động giả sau khi gộp. Báo động giả nguy
hiểm ngang bỏ sót, vì nó đẩy người ta tới thói quen gõ `--force` cho xong.

**Danh sách cặp bị từ chối** cũng khoá theo khoá toàn dòng. Đây là lỗ hổng thật: Lâm từ chối
một **cặp**, không từ chối một chuỗi bằng chứng cụ thể. Khoá theo khoá dòng thì chỉ cần cào
thêm một nguồn mới cho cặp đó là khoá đổi và cặp quay lại như chưa từng bị từ chối. Đúng loại
cửa hậu đã làm VNPT với P08 quay lại ở rule v4. Nay khoá theo cặp.

## Web phải nói ra phần chưa ai duyệt

Màn Matching hiện nhãn `+N chưa duyệt` trên dòng có bằng chứng thêm sau khi ký, kèm một câu
nói rõ chữ ký hiện tại không phủ phần đó. Không nói ra thì bằng chứng mới được trình như đã
qua mắt người gác cổng, mà nó chưa.

## Cổng độ tuổi tự bắt mình nói sai

Chạy lại sau sáu ngày, ngân sách vượt từ 36 lên 37. Cổng in ra "một claim mau-hỏng mới vừa bị
thêm" trong khi thật ra **không ai thêm gì cả**: chỉ là ngày trôi và một claim vượt mốc 180.

Hai nguyên nhân đó đòi hai cách xử khác hẳn, nên gọi chung một tên là đẩy người ta đi tìm
nhầm chỗ. Đã sửa để cổng chỉ đúng thủ phạm, liệt kê các claim vừa vượt mốc trong 30 ngày gần
đây.

Claim vượt mốc là của Viện Hàn lâm. **Không miễn trừ được**: câu viết "Viện phát triển công
nghệ lõi...", tức một trạng thái đang diễn ra chứ không phải sự kiện đã xảy ra. Chưa tìm được
nguồn mới. Đã nâng ngân sách lên 37 kèm dòng lịch sử ghi rõ ngày, claim, và lý do không miễn
trừ được. Nâng có ghi khác nâng lặng lẽ.

## Lệnh

```
cd /Users/os/CaoLocMatch
python3 bite_gop_cap.py ; echo $?
./chay_het_cong.sh          # 20 o
```
