# Bàn làm việc tạm: phép thử không còn chạm bản thật

Ngày: 18/08/2026.

## STATUS

**PASS.** 18 ô xanh. Ba bộ răng chuyển sang bản sao, và mỗi bộ có thêm một răng tự chứng
minh rằng bản thật không bị đụng.

```
RANG 4 · khong cham ban that : CAN OK (4 file that con nguyen tung byte)   [bite_chay_het_cong]
RANG 4 · khong cham ban that : CAN OK (dau vao that con nguyen tung byte)  [bite_tracuu]
```

Chạy cả chuỗi rồi băm lại bốn file quan trọng nhất: **không đổi một byte**.

## Vấn đề

Mọi bộ răng đều phải tiêm một lỗi thật vào dữ liệu rồi xem cổng có nổ không. Trước hôm nay
chúng tiêm thẳng vào kho thật và trả lại sau. Trả lại đúng, đã kiểm từng byte.

Nhưng từ khi chuỗi cổng sinh luôn file tra cứu mà người dùng mở, cửa sổ vài giây đó có một
file **thật** mang dữ liệu **hỏng** nằm trên đĩa. Ai mở đúng lúc thì thấy sai, và không có
dấu hiệu nào cho biết đó là lúc đang thử.

Chưa ai vấp. Nhưng "chưa vấp" không phải một bảo đảm, nó chỉ là một mẫu nhỏ. Cái giá để bỏ
hẳn khả năng đó là một lần chép ba megabyte, nửa giây.

## Cách làm

`ban_tam.py` dựng một bản sao của ba kho vào thư mục tạm rồi trả về `moi_truong`, tức bộ
biến `CLM_KHO_*` để truyền cho tiến trình con. Tự xoá khi thoát.

Bốn nơi phải biết đọc biến đó: `chay_het_cong.sh`, `build_cncl_match.py`,
`gen-cncl-data.mjs`, `gen-tracuu-html.mjs`. Không đặt biến thì mọi thứ chạy trên kho thật y
như cũ, nên đây là đường thêm vào chứ không phải đường thay thế.

Bỏ qua `.git`, `node_modules`, `.next`. Của `.touch` chỉ chép phần các cổng dùng tới: 1,2 MB
thay vì 71 MB. Toàn bộ mất nửa giây, chấp nhận được cho thứ chạy mỗi lần kiểm.

## Răng thứ tư

Chuyển sang bản sao rồi tuyên bố đã cách ly thì mới là lời hứa, chưa phải bằng chứng. Một
lỗi đường dẫn là bản sao lặng lẽ trỏ về bản thật, mà mọi răng khác vẫn xanh.

Nên mỗi bộ răng ghi vân tay các file thật **trước** khi thử, phá phách trên bản sao, rồi đối
chiếu lại **sau**. Bốn file được canh: registry gốc, file tra cứu người dùng cầm, và hai file
dữ liệu web.

Đây là răng canh chính cái cách ly, không canh nghiệp vụ. Nó là thứ duy nhất phân biệt được
"đã cách ly" với "tưởng là đã cách ly".

## Chỗ còn lại phải nói cho đúng

Bản sao là **ảnh chụp lúc bắt đầu**. Nếu ai sửa kho thật giữa lúc răng đang chạy thì răng
không thấy, và răng 4 sẽ báo đỏ vì vân tay đổi. Báo đỏ trong tình huống đó là hơi oan, nhưng
tôi giữ nguyên: một phép thử thà kêu nhầm còn hơn im lặng khi có người đang ghi vào cùng chỗ
với nó.

`match_bites.py` và `bite_bang_chung.py` vốn đã chép ra thư mục tạm từ đầu, không phải sửa.

## Trạng thái

```
tong 18 · xanh 18 · do 0 · khong chay duoc 0

sha256 truoc va sau khi chay ca chuoi:
  CaoLocMatch_TraCuu.html   khong doi
  claims.jsonl              khong doi
  cncl-registry.ts          khong doi
  cncl-match.ts             khong doi
```

Bốn file không đổi một byte cũng chứng minh thêm một chuyện: **chuỗi cổng tái lập được**.
Chạy lại cho ra đúng cùng đầu ra, nên không có dữ liệu nào phụ thuộc thời điểm chạy.

## Lệnh

```
cd /Users/os/CaoLocMatch
python3 ban_tam.py            # xem ban tam gom nhung gi
./chay_het_cong.sh            # 18 o
python3 bite_chay_het_cong.py # 4 rang, co rang canh cach ly
```
