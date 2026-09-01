# Bảng ký match · 8 match chờ chữ ký người gác cổng

Ngày lập: 16/08/2026. Trạng thái ánh xạ: **đã duyệt** (Lâm, 16/08). Trạng thái ký match: **chưa ký**.

Cổng `SIGNOFF_PENDING` đang chặn, exit 2. Không output nào ra ngoài cho tới khi có chữ ký thật.

## Vì sao tôi không ký thay

Lâm duyệt bảng ánh xạ, và tôi đã ghi vào file kèm tên và ngày. Nhưng ký từng match là **hành vi gác cổng riêng biệt** mà pre-registration mục 4 giao cho người. Nếu máy tự ký thì cái cổng duy nhất do người giữ trở thành hình thức. Vậy nên tôi dừng ở đây, trình bảng, và nêu khuyến nghị cho từng dòng.

## Bảng 8 match, kèm khuyến nghị của Chủ thầu

| ID | Nhu cầu quốc gia | Đơn vị | Điểm | Neo nhóm | Khuyến nghị |
|---|---|---|---|---|---|
| MATCH-0003 | P23 Chip chuyên dụng | Tập đoàn Viettel | 0,90 | 6 trùng 6 | **KÝ** |
| MATCH-0004 | P23 Chip chuyên dụng | FPT Semiconductor | 0,88 | 6 trùng 6 | **KÝ** |
| MATCH-0005 | P23 Chip chuyên dụng | CT Semiconductor | 0,88 | 6 trùng 6 | **KÝ** |
| MATCH-0007 | P22 Thiết bị bay không người lái | Tập đoàn Viettel | 0,70 | 6 sang 9, qua cạnh chuỗi giá trị | **KÝ** |
| MATCH-0008 | P06 Mạng 5G và 5G-Advanced | VNPT Technology | 0,67 | 2 trùng 2 | **KÝ, kèm lưu ý** |
| MATCH-0001 | P07 Robot tự hành và robot công nghiệp | ROSTEK | 0,53 | 3 trùng 3 | **KÝ, kèm lưu ý** |
| MATCH-0006 | P01 Mô hình ngôn ngữ lớn tiếng Việt | VinBigData | 0,53 | 1 trùng 1 | **KÝ** |
| MATCH-0002 | P08 Nền tảng, giải pháp sản xuất thông minh | VNPT | 0,67 | 3 trùng 3 | **KHÔNG KÝ** |

## Lý do từng khuyến nghị đặc biệt

**MATCH-0002 · không ký.** Hai token khớp nhau là "hình" và "phục", mảnh vụn của "mô hình" và "phục vụ". VNPT làm AI xử lý ảnh cho giao thông và y tế, không làm nền tảng sản xuất thông minh. Đây là ca rác đã biết, nguyên nhân là bộ tách từ cắt vỡ từ ghép tiếng Việt. Rule v3 sẽ xử.

**MATCH-0008 · ký kèm lưu ý.** Bằng chứng VNPT Technology là bài mst.gov.vn ngày 31/08/2022, đã quá `refresh_days` 180 rất xa, và chỉ nói "đang phát triển các sản phẩm cho mạng 5G", chưa nêu model cụ thể. Match đúng về lĩnh vực nhưng mức độ năng lực là **đang phát triển**, không phải đã thương mại.

**MATCH-0001 · ký kèm lưu ý.** Bằng chứng ROSTEK từ bài vjst.vn ngày 03/01/2022, cũng quá hạn refresh. Có khách hàng thật (Nidec Sankyo Việt Nam) nên năng lực là thật ở thời điểm đó, nhưng cần soát lại tình trạng hiện nay.

**MATCH-0007 · ký.** Đây là match có ý nghĩa nhất về mặt chính sách: chip SoC AI on Edge làm cho drone và UAV, nối nhóm 6 sang nhóm 9 qua cạnh chuỗi giá trị mà Lâm vừa duyệt. Bằng chứng tier A, ngày 28/01/2026, còn mới. Lưu ý mức độ: đây là **thoả thuận hợp tác và định hướng phát triển**, chưa phải chip đã ra lò.

## Lệnh ký

Ký toàn bộ (nếu đồng ý cả 8, không khuyến nghị vì có MATCH-0002):

```
cd /Users/os/CaoLocMatch
python3 match_engine.py sign out/matches.jsonl "Lam Nguyen" 2026-08-16
```

Kiểm lại sau khi ký:

```
python3 match_engine.py validate domains/cncl_match out/matches.jsonl --require-signoff ; echo $?
```

Muốn ký chọn lọc thì tách MATCH-0002 ra khỏi file trước khi ký, hoặc nói tôi bổ sung tuỳ chọn ký theo danh sách ID cho lệnh `sign`.

## Xung đột lợi ích

Không match nào trong 8 dòng liên quan Realtime Robotics. RtR có mặt trong registry CUNG với 6 claim `favors=rtr`, nhưng không tạo được match nào ở vòng này. Ghi lại để về sau nếu RtR xuất hiện thì phải nêu rõ, đúng pre-registration mục 5.
