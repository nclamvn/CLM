# Tiền đăng ký · vòng tự chạy chặng 1

Viết ngày 29/09/2026, **trước** lượt chạy theo lịch đầu tiên. Ngưỡng dưới đây không được sửa
sau khi thấy số. Muốn đổi ngưỡng thì viết một mục mới có ngày, giữ nguyên mục cũ.

## Cái được đo

Vòng tự chạy đầu tiên: một nguồn (mst.gov.vn, ba trang danh mục), một agent chạy mỗi sáng,
chế độ **chỉ đề xuất**. Máy không bao giờ ghi `claims.jsonl`. Mã và quy trình nằm ở
`CLM/CNCLData/vong_tu_chay/`, quy trình cho agent ở `HUONG_DAN.md` cùng thư mục.

Lượt 0 chạy tay ngày 29/09/2026 để thử quy trình, **không tính** vào cửa sổ đo:
34 bài rút từ danh mục, 2 bài qua ngưỡng điểm, 2 đề xuất, 2 vào hàng chờ, 0 bị loại, cả hai
cho Tổng công ty Thiết bị điện Đông Anh từ bài 28/09/2026.

## Cửa sổ đo

**30/09/2026 đến hết 13/10/2026, 14 ngày.** Đo ngày 14/10/2026 từ `nhat_ky.jsonl`,
`hang_cho.jsonl`, `loai.jsonl`, `duyet.jsonl`. Không đo từ trí nhớ hay từ báo cáo hằng ngày.

## Sáu chỉ số và ngưỡng

| # | Chỉ số | Cách tính | Ngưỡng ĐẠT |
|---|---|---|---|
| M1 | Độ đều | số ngày có dòng trong `nhat_ky.jsonl` / 14 | ≥ 11/14 |
| M2 | Sản lượng | tổng dòng mới trong `hang_cho.jsonl` | ≥ 5 |
| M3 | Tỉ lệ qua cổng | nhận / (nhận + loại) | ≥ 60% |
| M4 | Độ chính xác | số `nhan` / số dòng trong `duyet.jsonl`, trên mẫu người duyệt | ≥ 80% |
| M5 | An toàn | số claim trong registry đến từ vòng mà không có dòng duyệt | = 0 |
| M6 | Chi phí người | phút Lâm bỏ ra duyệt, tự ghi | chỉ đo, không ngưỡng |

**Mẫu cho M4:** duyệt **toàn bộ** hàng chờ nếu không quá 20 dòng; nếu nhiều hơn, lấy 20 dòng
bằng `random.seed(20261014)` trên danh sách mã HC đã sắp xếp. Chọn mẫu trước khi đọc nội dung.

Một dòng duyệt trong `CNCLData/vong_tu_chay/duyet.jsonl`:

```
{"id": "HC-...", "ket_luan": "nhan" | "bac", "nguoi": "Lam", "ngay": "YYYY-MM-DD", "ly_do": "..."}
```

`ly_do` là lời của người duyệt, máy không sửa. "Nhận" ở đây nghĩa là **đề xuất đúng và đáng
vào registry**, chưa phải đã vào.

## Quyết định viết sẵn

| Kết quả | Việc làm tiếp |
|---|---|
| M5 > 0 | **Tắt tác vụ theo lịch ngay**, tìm đường rò, trước mọi việc khác |
| M4 < 80% | Không thêm nguồn. Sửa `HUONG_DAN.md` theo các ca bị bác, đo lại 14 ngày |
| M2 < 5 | Nguồn quá mỏng. Thêm baochinhphu.vn làm nguồn thứ hai, giữ nguyên các ngưỡng |
| M1 < 11/14 | Lịch không đáng tin trên máy này. Cân nhắc chạy ở nơi khác trước khi mở rộng |
| M3 < 60% | Agent đề xuất ẩu. Đọc `loai.jsonl` theo mã lý do, sửa hướng dẫn |
| Đạt cả M1 đến M5 | Chặng 1 xong. Việc kế: công cụ đưa đề xuất đã duyệt vào registry (người bấm, máy chép, cổng kiểm), rồi nguồn thứ hai |

## Chỗ hở biết trước

- **Bản tải do agent chép lại.** Công cụ `web_fetch` trả văn bản cho agent, agent ghi ra file.
  Cổng chứng minh được span nằm nguyên văn trong file, **không** chứng minh được file khớp
  trang gốc. Chép sai thì cổng không bắt. M4 là nơi lỗi này lộ ra; ngoài ra khi duyệt nên mở
  link gốc đối chiếu một câu.
- **CI không thấy hàng chờ chưa commit.** Cron GitHub chạy chuỗi cổng trên bản đã đẩy lên.
  Tác vụ theo lịch chạy chuỗi cổng trên máy mỗi sáng, nên hai bên bù nhau, nhưng chỉ khi Lâm
  commit thì hai bên mới cùng thấy một dữ liệu.
- **Lượt chỉ chạy khi ứng dụng Claude đang mở.** Đó là lý do M1 có ngưỡng 11 chứ không phải 14.
- **Bài qua ngưỡng điểm vẫn có thể lạc đề.** Lượt 0 chọn 2 bài, một bài (hợp tác bán dẫn Việt
  Nhật) không sinh đề xuất nào. Tốn công đọc, nhưng không làm bẩn hàng chờ.
