# Cổng hỏi câu mà 25 ô kia không hỏi

Ngày: 24/08/2026.

## STATUS

**27 ô, 27 xanh.** Thêm `truong_hien` và răng của nó.

## Câu hỏi mới

Cả 25 cổng cũ đều soi **tính toàn vẹn dữ liệu**: span có đúng bản chụp không, value có vượt
span không, nguồn còn tươi không, chữ ký còn phủ không. Không cổng nào hỏi câu khác hẳn:

> Cái gì trong registry mà trang web không nói ra?

Đó là lý do `nang_luc_mo_ta_2` nằm trong registry tám ngày, dữ liệu đúng từng chữ, bảng trạng
thái xanh hết, và thẻ FECON trên web vẫn kể thiếu một nửa năng lực, đúng cái nửa làm nên
quyết định giữ đơn vị đó.

## Cái bẫy tôi phải tránh khi dựng cổng này

Bản dễ viết nhất là *"mọi trường phải xuất hiện đâu đó trong `lib/*.ts`"*. Bản đó sẽ **xanh
ngay cả hôm qua**, vì mảng `evidence[]` vốn cho hết mọi claim ra web. Trường không bị mất, nó
chỉ không được **tóm tắt**. Một cổng như thế là cái đèn xanh vô dụng, và nó còn tệ hơn không
có cổng vì nó tạo cảm giác đã kiểm.

Nên cổng đo ở **hai mức khác nhau**:

```
tom_tat   phai len DONG TOM TAT cua the. Doi HAI dieu:
          khoa co du lieu trong lib/*.ts  VA  co component that su doc khoa do.
bang      chi can co mat trong bang bang chung khi mo the ra.
chua_hien CO du lieu ma CHUA quyet hien o dau. Phai ghi ly do. Khoa mot chieu.
```

Mức thứ hai của `tom_tat` là mức quan trọng. Dữ liệu có mà không component nào render thì vẫn
là bị bỏ, và **đó đúng là cách `nang_luc_mo_ta_2` lọt lưới**: nó nằm trong `evidence[]` từ
đầu, chỉ không ai đọc nó ở lớp tóm tắt.

## Fail-closed, và nó tìm ra hai ca cũ ngay

Trường không khai báo thì cổng **đỏ ngay**, không đoán giùm. Thêm một trường phụ mới là phải
trả lời câu "nó hiện ở đâu".

Quét lần đầu tìm ra **hai trường nữa cùng dạng, có từ trước**:

```
loai_hinh   9 don vi co gia tri. Khoa loaiHinh CO trong lib/*.ts nhung
            KHONG component nao doc no.
location    1 don vi co gia tri, chua bao gio len the.
```

Cả hai vẫn đọc được trong bảng bằng chứng khi mở thẻ ra, nên là **món nợ nhẹ**: không phải
giấu, chỉ là không tóm tắt. Ghi vào `ngan_sach_truong_chua_hien.txt` với mức 2, khoá một
chiều, kèm lý do từng cái.

Một cổng không tìm ra gì trong ngày đầu là một cổng đáng nghi.

## Phép thử mạnh nhất: chạy cổng hôm nay trên mã hôm qua

Không tiêm lỗi giả. Lấy `.touch` ở commit trước bản vá, thả ba file cổng vào, chạy:

```
KHAI LA tom_tat NHUNG KHONG LEN THE (1):
  nang_luc_mo_ta_2         · khoa capability2 · khoa rong trong du lieu sinh ra
exit 2
```

Cổng bắt đúng **lỗi thật đã xảy ra**, không phải một lỗi tôi dựng ra cho nó bắt.

## Bốn răng

```
RANG 1 · truong moi khong khai bao thi DO        exit 2, goi dich danh truong moi
RANG 2 · co du lieu ma khong ai render thi DO    exit 2, du lib van con nguyen du lieu
RANG 3 · tra lai nguyen trang thi XANH           exit 0
RANG 4 · vuot ngan sach chua_hien thi DO         exit 2
```

RĂNG 2 là răng dựng lại đúng ca thật. RĂNG 4 khoá chiều tăng của món nợ. Cả bốn chạy trên
**bản sao ở thư mục tạm**, không bao giờ chạm kho thật.

## Lệnh

```
cd /Users/os/.touch
node scripts/check-truong-hien.mjs
node scripts/bite-truong-hien.mjs

cd /Users/os/CaoLocMatch && ./chay_het_cong.sh    # 27 o
```
