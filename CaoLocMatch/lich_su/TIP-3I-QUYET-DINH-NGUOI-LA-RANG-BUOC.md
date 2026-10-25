# TIP-CNCL-3I · Quyết định của người là ràng buộc cứng của máy

## Header

- **ID:** TIP-CNCL-3I
- **Priority:** P0 chặn mọi rule tiếp theo
- **Dependencies:** rule v4 trượt (9e99d41), sổ chữ ký đã có (5404784)

## Sự việc

Rule v4 làm cặp **VNPT với P08 quay trở lại**, dù Lâm đã từ chối cặp đó sáng 16/08 kèm lý do ghi trong sổ. Nó quay lại qua cạnh chuỗi giá trị, tức bằng một đường mà rule mới mở ra.

Chuyện này chỉ lộ vì tôi khoá tiêu chí H5 từ trước. **Nếu không khoá, nó đã lặng lẽ quay lại và không ai biết.**

## Vấn đề gốc

`signoff_ledger.jsonl` hiện chỉ là **sổ ghi chép**. Engine không đọc nó khi sinh match. Quyết định của người gác cổng được lưu lại nhưng không ràng buộc gì cả.

Nói cách khác: hôm nay người gác cổng đang **ghi ý kiến**, không phải **giữ cổng**. Mọi rule tương lai đều có thể vô hiệu quyết định của anh mà không để lại dấu vết.

## Task

**A. Engine đọc sổ khi sinh match.** Cặp nào có `decision: tu_choi` trong sổ thì **không được sinh ra**, bất kể rule nào đang chạy. Khớp theo digest nội dung, cùng khoá với `restore-signoff`.

**B. Ghi lại minh bạch, không im lặng.** Mỗi lần loại phải in ra dòng nêu rõ cặp nào bị loại vì đã bị ai từ chối ngày nào, và ghi vào `out/blocked_by_signoff.jsonl`. Loại âm thầm cũng nguy hiểm ngang cho qua âm thầm.

**C. Cổng hậu kiểm `validate` phải cắn.** Nếu file match chứa một cặp có digest nằm trong danh sách từ chối, `validate` exit 2 với răng mới `SIGNOFF_REJECTED_RESURFACED`. Đây là lớp phòng thủ thứ hai, phòng khi ai đó sinh match bằng đường khác.

**D. Cờ thoát hiểm có kiểm soát.** `--ignore-rejections` để cố tình bỏ qua, và **phải in cảnh báo lớn kèm danh sách cặp bị ảnh hưởng**. Không có cờ thì không sửa được quyết định sai của quá khứ; có cờ mà im lặng thì vô nghĩa.

**E. Đổi ý phải qua cửa chính.** Người gác cổng muốn ký lại cặp đã từ chối thì dùng `sign` như bình thường; lệnh `sign` ghi đè dòng cũ trong sổ và match được sinh trở lại ở lần chạy sau. Đây là cách duy nhất hợp lệ để đảo quyết định.

## Tiêu chí · KHOÁ TRƯỚC KHI VIẾT CODE

| Mã | Nội dung | Ngưỡng |
|---|---|---|
| **I1** | Với rule v2 hiện tại, cặp VNPT với P08 **không còn được sinh ra**, và có dòng báo bị loại | bắt buộc |
| **I2** | 12 cặp Lâm đã ký **vẫn còn đủ** | bắt buộc |
| **I3** | Chạy rule v4 (rule từng làm cặp bị từ chối quay lại) thì cặp đó **vẫn bị chặn** | bắt buộc |
| **I4** | `validate` cắn `SIGNOFF_REJECTED_RESURFACED` khi cắm thủ công cặp bị từ chối vào file match | bắt buộc |
| **I5** | `--ignore-rejections` cho cặp đó xuất hiện lại **kèm cảnh báo in ra** | bắt buộc |
| **I6** | Ký lại bằng `sign` thì cặp được sinh trở lại ở lần chạy sau, không cần cờ | bắt buộc |
| **I7** | Digest tái lập; chữ ký hiện có không mất | bắt buộc |

I3 là tiêu chí lõi: nó kiểm rằng ràng buộc nằm ở **tầng engine**, không phải ở tầng rule. Nếu chỉ vá rule v2 thì rule v5 sau này lại thủng.

## Constraints

- Không sửa `methodbox/`. Không sửa claim, không sửa sổ bằng tay.
- Sao lưu `out/` và sổ trước khi chạy.
- Thử trên bản sao trước.
- Đọc exit code trần. Em-dash vẫn cấm.
