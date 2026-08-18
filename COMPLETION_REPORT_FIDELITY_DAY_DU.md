# Cổng đối chứng nguồn · chạy đủ 31 trên 31 trang chụp

Ngày: 16/08/2026. Vòng trước mới đối chứng 12 trang. Nay đủ cả 31.

## STATUS

**FAIL, và đây là phát hiện nặng nhất từ đầu dự án.**

```
snapshot         : 31
doi chung duoc   : 31  (truoc: 12)
cau khop         : 82
cau lech         : 26
```

## Phân loại 26 câu lệch

Tôi không dừng ở con số. Với mỗi câu lệch, tôi chạy thêm hai phép kiểm để biết đó là gì.

**Phép kiểm 1: bỏ qua khác biệt khoảng trắng và ngắt dòng.**

```
26 cau lech
   2 do NOI DONG (snapshot noi hai dong cua ban goc thanh mot)
  24 THUC SU VANG khoi ban tuoi
```

**Phép kiểm 2: cắt mỗi câu vắng thành từng mảnh 25 ký tự, đếm mảnh nào có trong bản tươi.**

```
21 cau: MOT PHAN manh co mat (vi du 5/5, 7/7, 3/5, 1/4)
 3 cau: KHONG manh nao co mat
```

Câu có **đủ mảnh nhưng không đủ câu** nghĩa là nội dung có thật trong nguồn, nhưng giữa các mảnh có thứ gì đó bị gỡ đi khi ghi snapshot: markup liên kết, dấu ngoặc, hoặc ký tự định dạng. Đây đúng cùng loại lỗi đã bắt được ở vòng trước với FPT Semiconductor, chỉ khác là rộng hơn nhiều.

Ba câu **không mảnh nào có mặt** là loại nặng nhất và phải soi riêng:

```
cafef       · "Sáng lập bởi Tiến sĩ Lương Việt Quốc"
cafef       · "Horus P02 với khả năng hoạt động yên lặt và trang..."
vneconomy   · "Nền tảng AI toàn diện đầu tiên ở Việt Nam - FPT.AI năm 2017"
```

**Đã truy xong cả ba, ngay trong vòng này:**

| Câu | Nguồn thật viết | Kết luận |
|---|---|---|
| "Sáng lập bởi Tiến sĩ Lương Việt Quốc" | "Khi **Tiến sĩ Lương Việt Quốc** sáng lập RtR, ông mang theo kinh nghiệm..." | **CÂU BỊ VIẾT LẠI.** Đảo cấu trúc, không phải trích dẫn. |
| "hoạt động yên lặt" | "hoạt động yên lặng" | Lỗi đánh máy của người ghi snapshot. |
| "ở Việt Nam - FPT.AI" | "ở Việt Nam- FPT.AI" | Chỉnh khoảng trắng quanh dấu gạch nối. |

Ca thứ nhất là ca nặng nhất của cả dự án, vì hai lẽ. Thứ nhất, đó không phải lỗi định dạng
mà là **câu được viết lại bằng cấu trúc khác**, thứ mà không cổng nào trước đây bắt được.
Thứ hai, nó là bằng chứng của **Realtime Robotics**, đúng đơn vị mang cờ `favors=rtr` và
là nơi người vận hành hệ này đang giữ chức COO. Chỗ nhạy cảm nhất lại là chỗ có sai lệch
nặng nhất.

Nội dung không sai: nguồn thật sự nói Tiến sĩ Lương Việt Quốc sáng lập RtR. Nhưng câu trong
snapshot là câu do người ghi đặt ra, không phải câu của nhà báo.

**Cả ba đã được sửa trong vòng này.** Snapshot trả về đúng chữ nguồn kể cả dấu định dạng
markdown, sáu claim liên quan cập nhật span, và nhãn `verbatim` đổi sang `normalized` ở
những chỗ giá trị không còn nằm trọn trong span mới. Số câu lệch giảm từ 26 xuống 23.

## Vì sao chuyện này xảy ra

**Chín trên mười file có câu lệch đều là snapshot của Pha 1, ghi ngày 18/07/2026**, tức trước khi cổng đối chứng nguồn tồn tại. Cổng ra đời ngày 16/08, và nó vừa soi ngược lại chính công việc của tháng trước.

Các snapshot mới ghi trong ngày hôm nay hầu như sạch. Cổng đã làm đúng việc: nó không bảo vệ được quá khứ, nhưng nó phơi bày được quá khứ.

## Phạm vi ảnh hưởng, đo bằng số

```
claim bi anh huong : 21 / 200   (10%)
don vi bi anh huong:  9 / 42
match DA KY bi anh huong: 3 / 12
```

Ba match đã ký bị ảnh hưởng: chip với Tập đoàn Viettel, LLM tiếng Việt với VinBigData, UAV với Tập đoàn Viettel.

**Chín mươi phần trăm registry không bị đụng.** Nhưng ba match đã ký thì bị, và đó là phần cần xử lý cẩn thận nhất vì nó mang chữ ký của người gác cổng.

## Điều phải nói cho đúng

Đây **không phải bằng chứng bịa đặt**. 21 trên 24 câu có nội dung thật trong nguồn, chỉ sai ở chỗ chữ không khớp từng ký tự. Nhưng dự án này dựng trên một lời hứa cụ thể: mọi khẳng định truy được về **một câu nguyên văn**. Câu gần đúng không phải câu nguyên văn.

Nói cách khác: registry vẫn đúng về **nội dung**, nhưng chưa đúng về **kỷ luật** ở 10% số claim.

## Việc phải làm, không nên gộp vào vòng này

1. ~~Ba câu không tìm thấy mảnh nào~~ **ĐÃ XONG trong vòng này**, xem bảng ở trên.
2. **23 câu còn lại**: trả span về đúng chữ nguồn, cập nhật claim tương ứng, đổi nhãn sang `normalized` nếu giá trị không còn nằm trọn trong span.
3. **Ba match đã ký**: sau khi sửa span, khoá nội dung đổi nên `restore-signoff` sẽ báo cần ký lại. Phải để Lâm ký lại chứ máy không tự gắn.
4. Sau khi xong, chạy lại `build_trangthai_pdf.py` để bản in phản ánh trạng thái mới.

## Ghi nhận về phương pháp

Cổng này ra đời ở TIP-3D, chạy thử bằng fixture, rồi nằm im hai vòng vì chưa ai nạp bản tươi. Lần chạy đầu với 12 trang bắt được 1 lỗi. Lần chạy đủ 31 trang bắt được 26.

**Bài học: một cổng chỉ có giá trị khi được chạy trên toàn bộ dữ liệu, không phải trên mẫu.** Mẫu 12 trang cho cảm giác an toàn sai lệch, vì nó gồm phần lớn snapshot mới, còn phần cũ mới là phần có vấn đề.

## Lệnh

```
cd /Users/os/CNCLData
python3 check_snapshot_fidelity.py domains/don_vi_cncl --fresh .fidelity_fresh ; echo $?
```
