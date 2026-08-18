# Bản tra cứu vào chuỗi cổng

Ngày: 18/08/2026.

## STATUS

**PASS.** 18 ô xanh, trong đó 4 ô của `.touch` và 4 bộ răng.

```
tong 18 · xanh 18 · do 0 · khong chay duoc 0
```

## Đã nối gì

`gen-tracuu-html.mjs` chạy ngay sau `gen-cncl-data.mjs` trong `chay_het_cong.sh`, vì nó đọc
đầu ra của bước đó. Từ nay mỗi lần registry đổi thì bản tra cứu người dùng mở được dựng lại
trong cùng một lượt, nên nó không bao giờ lệch với dữ liệu thật.

Thứ tự này quan trọng. Đặt trước thì file tra cứu mang dữ liệu của lần chạy **trước**, và
không cổng nào phát hiện ra vì cả hai file đều tồn tại và đều hợp lệ.

## Cổng mới: thiếu bản chụp thì dừng

File tra cứu chạy offline, không có đường nào đi lấy thứ còn thiếu. Trước khi sinh, bộ sinh
duyệt mọi liên kết bằng chứng mà dữ liệu trỏ tới và đòi có bản chụp nhúng kèm. Thiếu một cái
là dừng, không ghi đè bản cũ.

Không có cổng này thì hỏng theo kiểu tệ nhất: file vẫn sinh ra, vẫn mở được, người dùng bấm
vào tên nguồn và nhận một câu xin lỗi. Một ô trống nhìn y hệt như đã có bằng chứng. Không báo
lỗi, chỉ làm sai.

## Răng bắt được lỗi thật ngay lần chạy đầu

`bite_tracuu.mjs` dựng ba tình huống. Răng 2 rớt ngay lần đầu:

```
RANG 2 · mat dau vao thi dung : KHONG CAN !! exit1
```

Giấu `lib/cncl-match.ts` đi thì `readFileSync` ném lỗi, Node thoát exit 1 kèm stack trace.
Bảng trạng thái đọc exit 1 như một lỗi không rõ nguồn cơn. Lỗi nào cũng đỏ cả, nhưng **đỏ vì
thiếu file X** khác hẳn **đỏ vì một ngoại lệ nào đó**: cái đầu sửa được trong ba mươi giây,
cái sau phải đọc stack trace.

Đã sửa để mọi đầu vào thiếu đều nổ đàng hoàng với exit 2 và một câu nói rõ phải chạy lệnh gì.

Sau khi sửa:

```
RANG 1 · thieu ban chup thi dung  : CAN OK (exit 2, khong ghi de file cu)
RANG 2 · mat dau vao thi dung     : CAN OK (exit 2, khong sinh ban thieu match)
RANG 3 · khong bao DO oan         : CAN OK (exit 0, sinh lai du kich co)
```

Răng 1 kiểm cả việc **không ghi đè bản cũ**, không chỉ mã thoát. Một cổng dừng đúng lúc nhưng
đã kịp làm hỏng file thì vẫn là cổng hỏng.

## Một tác dụng phụ phải nói ra

`bite_chay_het_cong.py` cố ý tiêm lỗi vào registry rồi chạy cả bảng. Nay bảng có bước sinh
file tra cứu, nên trong vài giây của phép thử đó, file người dùng mở được mang dữ liệu đã bị
tiêm lỗi. Răng tự trả nguyên trạng và chạy lại ở bước cuối, nên trạng thái đọng lại luôn đúng.

Đã kiểm sau khi chạy đủ: 42 đơn vị, 200 evidence khớp đúng 200 claim gốc, 30 nhu cầu, 12 match,
37 bản chụp, không còn dấu vết chuỗi tiêm thử nào.

Nhưng cửa sổ vài giây đó là có thật. Nếu sau này bản tra cứu được đặt ở nơi người ngoài đọc
trực tiếp, phép thử phải sinh ra thư mục tạm chứ không đụng vào bản thật.

## Trạng thái toàn chuỗi

```
CNCLData     refinery · bites · check_luat3 · check_dash · doi_chung_nguon
CaoLocMatch  build_dan_xuat · refinery · match_run · restore_signoff · validate_ky
.touch       sinh_du_lieu_web · sinh_tra_cuu · cong_em_dash · rang_tra_cuu
rang         rang_match · rang_bang_chung · rang_dong_bo · rang_chinh_bang
```

## Lệnh

```
cd /Users/os/CaoLocMatch
./chay_het_cong.sh            # 18 o, gom ca sinh lai ban tra cuu
./chay_het_cong.sh --nhanh    # bo qua bon bo rang

cd /Users/os/.touch
node scripts/bite_tracuu.mjs ; echo $?
```
