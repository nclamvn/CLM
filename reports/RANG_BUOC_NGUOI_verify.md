# Completion + VERIFY · TIP-CNCL-3I · Quyết định của người là ràng buộc cứng

Ngày: 16/08/2026.

## STATUS

**DONE. 7/7 tiêu chí đạt.**

Từ hôm nay, quyết định từ chối của người gác cổng là **ràng buộc ở tầng engine**, nằm dưới mọi rule.

## Vì sao phải làm

Rule v4 làm cặp VNPT với P08 quay trở lại, dù Lâm đã từ chối kèm lý do. Nó quay lại qua cạnh chuỗi giá trị, tức một đường mà rule mới mở ra. **Chuyện đó chỉ lộ vì tiêu chí H5 được khoá trước.** Không khoá thì nó đã lặng lẽ quay lại.

Gốc rễ: `signoff_ledger.jsonl` chỉ là sổ ghi chép. Engine không đọc nó. Người gác cổng đang **ghi ý kiến**, không phải **giữ cổng**.

## Bảy phép thử, đều có đối chứng

| Mã | Nội dung | Kết quả |
|---|---|---|
| **I1** | Rule v2: cặp bị từ chối không còn được sinh, có dòng báo | **ĐẠT.** In rõ ai từ chối, ngày nào, lý do gì. |
| **I2** | 12 cặp đã ký vẫn còn đủ | **ĐẠT** |
| **I3** | Chạy rule v4 thì cặp đó **vẫn bị chặn** | **ĐẠT.** Ràng buộc nằm dưới rule, không phải trong rule. |
| **I4** | Cắm thủ công cặp bị từ chối vào file match, giả làm đã ký | **ĐẠT.** `validate` exit 2, răng `SIGNOFF_REJECTED_RESURFACED`. |
| **I5** | `--ignore-rejections` cho qua kèm cảnh báo | **ĐẠT.** In cảnh báo và liệt kê đích danh cặp bị bỏ qua. |
| **I6** | Ký lại bằng `sign` thì cặp được sinh trở lại, không cần cờ | **ĐẠT.** Đảo quyết định phải qua cửa chính. |
| **I7** | Digest tái lập, chữ ký không mất | **ĐẠT.** 12/12 khôi phục. |

**I3 là tiêu chí lõi**: nếu chỉ vá rule v2 thì rule v5 sau này lại thủng. Ràng buộc phải nằm ở tầng engine.

## Ba lớp phòng thủ

1. **Khi sinh match**: engine đọc sổ, loại cặp đã bị từ chối trước khi chạy gate.
2. **Ghi lại**: mỗi cặp bị loại được in ra và ghi vào `out/blocked_by_signoff.jsonl`. **Không loại âm thầm** — loại âm thầm nguy hiểm ngang cho qua âm thầm.
3. **Hậu kiểm**: `validate` cắn nếu phát hiện cặp bị từ chối xuất hiện như match hợp lệ, phòng khi ai đó sinh match bằng đường khác.

Cửa thoát hiểm `--ignore-rejections` tồn tại vì không có nó thì không sửa được quyết định sai của quá khứ. Nhưng nó **luôn in cảnh báo kèm danh sách**, không bao giờ im lặng.

## Trạng thái sau khi làm

```
match sinh ra        : 12 (truoc: 13)
tat ca deu da ky     : dung
bi chan boi so       : 1 · CNCL-P08 x VNPT
12 cap Lam ky        : con nguyen ven, khop hoan toan
```

Cặp bị từ chối nay **không xuất hiện trong `matches.jsonl` nữa**. Nó sống trong sổ chữ ký và trong `blocked_by_signoff.jsonl`, đúng chỗ của nó: một quyết định đã ghi, không phải một match chờ xử.

## Ý nghĩa

Trước hôm nay, hệ thống này có provenance chặt cho **dữ liệu** nhưng lỏng cho **quyết định của con người**. Mọi claim đều truy được về snapshot, trong khi một quyết định gác cổng có thể bị rule mới xoá mà không để lại dấu vết.

Nay hai thứ đó cùng một chuẩn. Máy đề xuất, người quyết, và **quyết định của người ràng buộc máy ở lần chạy sau**, kể cả khi rule thay đổi.
