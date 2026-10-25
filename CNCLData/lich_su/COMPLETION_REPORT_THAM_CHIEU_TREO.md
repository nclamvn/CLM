# Cổng bắt tham chiếu treo

Ngày: 24/08/2026.

## STATUS

**PASS.** 23 ô xanh. Đo được 12 ca tham chiếu treo trong 202 claim, đã khoá một chiều.

## Loại lỗi này qua được hết mọi cổng đang có

Claim của Công ty An ninh mạng Viettel có span:

> 100% các sản phẩm này đều được nghiên cứu, phát triển hoàn toàn bởi đội ngũ nhân sự của
> công ty.

Danh sách mà cụm "các sản phẩm này" trỏ tới nằm ở câu trước, và câu đó **không được chụp**.
Đọc span lên thì không biết 100% phủ lên những gì.

Cái đáng sợ là claim này **qua sạch mọi cổng**: span vẫn nằm nguyên văn trong bản chụp, value
vẫn là chuỗi con của span, tier vẫn đúng, ngày vẫn đọc được, luật 3 vẫn thoả. Chỉ có nghĩa
là rỗng. Sáu cổng không cổng nào hỏi "câu này trỏ vào đâu".

Tôi tìm ra nó bằng mắt, tình cờ, trong lúc làm một việc khác.

## Cách đo, không đoán nghĩa

Tìm cụm `<danh từ> + <từ chỉ định>` trong span, rồi đòi danh từ đó phải xuất hiện **trước
đó**, hoặc sớm hơn trong chính span, hoặc sớm hơn trong bản chụp. Không thấy ở đâu cả thì
treo.

Đây là phép đo xấp xỉ, không phải hiểu nghĩa. Nó bắt được đúng một thứ: **cái mà câu trỏ tới
không hề tồn tại trong phạm vi đã chụp**. Đúng loại lỗi vừa vấp.

## Lần chạy đầu báo giả nhiều hơn báo thật

Chạy lần đầu ra 16 ca, soi thì phần lớn là rác:

```
'cạnh đó'   <- "bên cạnh đó", liên từ
'hứng đó'   <- "nguồn cảm hứng đó", cắt sai từ ghép
'đề này'    <- "vấn đề này"
'gian này'  <- "thời gian này"
```

Hai lỗi trong bộ dò của tôi. Một là chỉ lấy **một âm tiết** trước từ chỉ định, trong khi
tiếng Việt ghép nhiều âm tiết, nên "vấn đề" bị cắt thành "đề" rồi báo treo oan. Hai là chưa
loại các liên từ cố định.

Đã sửa: lấy tới ba âm tiết và thử cả ba dạng, cộng danh sách liên từ. 16 xuống 12, và **cả
12 đều thật**.

Nếu để nguyên 16 thì cổng báo giả nhiều hơn báo thật, và một cổng như thế thì người ta sẽ
tắt nó. Đó là lý do phải chạy thử trên dữ liệu thật trước khi tin.

## Ba ca đáng lo nhất trong 12

```
VinES     "Cũng trong thời gian NÀY, VinES ... được thành lập với vốn pháp định 6.500 tỷ"
ROSTEK    "Để giải quyết vấn đề NÀY, startup ROSTEK đã cho ra đời xe tự hành"
VSAP LAB  "Và cũng từ nguồn cảm hứng ĐÓ, VSAP LAB ... đã được thành hình"
```

Ca VinES nặng nhất. Claim khẳng định một **sự kiện thành lập**, mà mốc thời gian lại trỏ vào
một đoạn không được chụp. Đọc lên không biết là năm nào. Hai ca kia thì phần năng lực vẫn
đứng vững, chỉ có câu dẫn bị treo.

## Khoá một chiều, cùng cơ chế với cổng độ tuổi

12 ca còn lại đều cần chụp lại đoạn chứa tiền ngữ, tức nhiều vòng lấy nguồn. Bảng đỏ suốt
nhiều ngày thì người ta học cách lờ. Nên cổng hỏi **"có tệ đi không"**, và giảm cũng bắt dừng
để con số trong file không đứng yên. Đã thử cả hai chiều.

## Giới hạn phải nói ra

Danh từ xuất hiện trước đó **không bảo đảm** nó là tiền ngữ đúng. "sản phẩm" có thể xuất hiện
ở một đoạn khác hẳn rồi cổng vẫn cho qua. Cổng này thu hẹp cửa chứ không khoá được cửa, giống
hệt cổng tài trợ.

## Lệnh

```
cd /Users/os/CNCLData
python3 check_tham_chieu_treo.py domains/don_vi_cncl ; echo $?

cd /Users/os/CaoLocMatch
./chay_het_cong.sh    # 23 o
```
