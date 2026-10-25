# Trả nợ `loai_hinh`, và cái mốc ảnh nói dối một cách thành thật

Ngày: 24/08/2026.

## STATUS

**27 ô, 27 xanh.** Ngân sách trường chưa hiện: **2 xuống 1**. Còn lại `location`, 1 đơn vị.

## Việc

9 đơn vị có `loai_hinh`, giá trị là mã `DN` hoặc `vien`, extraction là `normalized` chứ không
phải chữ của nguồn: nguồn viết *"Tổng công ty Công nghiệp Công nghệ cao Viettel"*, người nhập
suy ra `DN`.

Nên trên thẻ hiện **nhãn phân loại** đọc được, kèm `title` nói rõ đây là giá trị chuẩn hoá chứ
không trích nguyên văn. Tag để nhạt hơn tag nhóm và tag sản phẩm, vì hai cái kia là mã tra về
QĐ 21/2026 còn cái này là suy luận của người nhập.

**Mã lạ thì trả lại chính mã, không trả chuỗi rỗng.** Một mã mới phải nhìn thấy ngay trên thẻ
chứ không biến mất im lặng. Đó là khác biệt giữa honest-null và bỏ sót.

Component đọc **cả** `u.loaiHinh` (mã gốc) lẫn `u.loaiHinhLabel` (nhãn). Cố ý: cổng
`truong_hien` kiểm khoá **gốc** có ai đọc không, không phải khoá dẫn xuất. Nếu chỉ đọc nhãn
thì cổng vẫn đỏ, và đỏ đúng.

## Khoá một chiều nổ ở chiều giảm, lần đầu bằng ca thật

```
ngan sach chua_hien: 2 · thuc te: 1 (location)
FAIL(TOT): GIAM duoc. Sua ngan_sach_truong_chua_hien.txt thanh 1 de chot muc moi.
```

Trước đó chiều giảm mới chỉ được chứng minh bằng RĂNG 4, tức bằng một ca tiêm. Nay nó nổ bằng
một ca thật, do một việc thật.

## Lần thứ ba trong một ngày, cùng một cái bẫy

RĂNG 4 gãy ngay sau khi trả nợ. Lý do: tôi viết

```js
goc_ngan.replace(/^2/, '1')   // gõ cứng con số 2 của hôm viết răng
```

Ngân sách về 1, phép thế không khớp gì cả, răng báo `KHONG CAN` dù engine đúng.

**Đây là lần thứ ba hôm nay** một cái răng bám vào trạng thái dữ liệu thật:

```
1. RANG 3 bite_chay_het_cong  doi "tat ca xanh"      vo hom du_dieu_kien do DUNG
2. RANG 2 va 4b bite_gop_cap  doi "co nhan chua_duyet" vo ngay sau khi Lam ky MATCH-0005
3. RANG 4 bite-truong-hien    go cung so 2           vo ngay sau khi tra no loai_hinh
```

Và ca thứ ba xảy ra **vài giờ sau khi tôi viết ca thứ hai vào báo cáo cùng lời rút kinh
nghiệm**. Viết ra bài học không làm mình thôi mắc nó. Nay răng đọc con số đang có rồi hạ đi
một, không giả định con số đó là bao nhiêu.

## Cái mốc ảnh nói "trùng tuyệt đối" trong khi có thay đổi thật

Chụp lại hai màn mốc, kết quả: **TRÙNG MỐC tuyệt đối**, 0% điểm khác. Nhưng tôi vừa thêm một
tag lên 9 thẻ.

Không phải lỗi của `so_anh.mjs`. Ảnh mốc chỉ chụp **khung nhìn đầu tiên**, danh sách xếp theo
bảng chữ cái, và cả 9 đơn vị có `loai_hinh` đều nằm dưới đáy: 4 doanh nghiệp tên bắt đầu bằng
`CT`, `Realtime`, `Viettel`, `VNPT`, và 5 viện. Không cái nào lọt vào khung hình.

**Nghĩa là phép so mốc đang phủ một phần rất nhỏ của trang, và nó im lặng đúng lúc cần kêu.**
Nó không sai, nó chỉ không nhìn tới đó. Một cái mốc như thế dễ bị đọc thành "không có gì đổi".

Xử: chốt thêm ảnh mốc thứ ba, `man-loaihinh.png`, chụp màn đã lọc để phủ đúng nhóm đơn vị mà
ảnh toàn trang không bao giờ chạm tới. Ba mốc nay là registry, matching, và loại hình.

## Môi trường chụp là ephemeral, ghi ra cho khỏi tưởng bở

Giữa buổi làm việc, `~/.cache/ms-playwright` bị dọn sạch, lệnh chụp gãy với *"Executable
doesn't exist"*. Phải dựng lại cảnh: cài chromium bằng **bản playwright của repo** chứ không
phải `playwright@latest` (bản latest tải v1234, repo cần v1228), rồi giải nén lại
`libxdamage1`.

Đã ghi vào `chup_man.sh`. Câu "chụp được trong môi trường Linux" là đúng, nhưng nó kèm một
bước dựng lại mỗi phiên, và bỏ chi tiết đó ra khỏi báo cáo thì thành khoe.

## Đã làm

```
+ TEN_LOAI trong gen-cncl-data.mjs, khoa loaiHinhLabel, them nhan vao chuoi tra cuu
+ tag loai hinh trong RegistryBrowser.tsx, doc ca khoa goc lan khoa nhan
+ css reg-tag--loai, nhat hon tag nhom va tag san pham
= truong_hien_thi.json: loai_hinh chuyen chua_hien -> tom_tat
= ngan sach 2 -> 1, ghi lich su
* sua RANG 4 bite-truong-hien: doc so dang co roi ha di mot, khong go cung
+ anh moc thu ba man-loaihinh.png
+ ghi vao chup_man.sh: moi truong Linux ephemeral, phai dung lai canh moi phien
```
