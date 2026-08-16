# TIP-CNCL-3D · Sổ chữ ký bền vững

## Header

- **ID:** TIP-CNCL-3D
- **Priority:** P0 chặn mọi việc khác. Đang có dữ liệu không tái tạo được nằm ở chỗ không an toàn.
- **Dependencies:** ký chọn lọc đóng (commit 54d52d0), Lâm đã ký 7 và từ chối 1.

## Hai lỗ hổng đã xác minh trên đĩa

**1. Chữ ký không nằm trong git.** `.gitignore` dòng 1 loại cả `out/`, mà `out/matches.jsonl` là nơi chứa quyết định gác cổng. Kiểm bằng `git check-ignore -v out/matches.jsonl`.

**2. Lệnh `run` xoá sạch chữ ký.** Dòng 394 của `match_engine.py` ghi đè thẳng `out/matches.jsonl` bằng kết quả mới. Chạy lại engine một lần là toàn bộ chữ ký và quyết định từ chối biến mất, **không cảnh báo, không backup**.

Mọi thứ khác trong hệ đều tái tạo được từ claim và snapshot. Chữ ký thì không: nó là phán đoán của một con người tại một thời điểm. Thứ duy nhất không tái tạo được lại đang là thứ duy nhất không được bảo vệ.

## Task

**A. Sổ chữ ký `signoff_ledger.jsonl`**, đặt trong thư mục domain (được git theo dõi), mỗi dòng một quyết định:

```
{"match_id", "decision", "by", "role", "date", "ly_do",
 "khoa": {"demand_entity", "supply_entity", "need_fact_digest", "capability_fact_digest"},
 "engine_version", "ghi_luc"}
```

**Khoá phải gắn với NỘI DUNG đã ký, không gắn với số thứ tự dòng.** `MATCH-0002` chỉ là số thứ tự do engine sinh; chạy lại với dữ liệu khác thì `MATCH-0002` có thể là cặp hoàn toàn khác. Ký nhầm kiểu đó còn tệ hơn mất chữ ký. Dùng digest của cặp fact làm khoá thật.

**B. Lệnh `sign` và `reject` ghi vào sổ**, đồng thời vẫn cập nhật `out/matches.jsonl` cho tiện đọc.

**C. Lệnh `run` phải fail-loud khi sắp ghi đè chữ ký.** Nếu `out/matches.jsonl` có match mang `decision`, và sổ không phản ánh đủ, thì **dừng, không ghi**, in rõ phải làm gì. Có cờ `--force` để cố tình bỏ qua, và cờ đó phải in cảnh báo.

**D. Lệnh `restore-signoff`**: đọc sổ, gắn lại chữ ký vào `out/matches.jsonl` mới sinh, khớp theo khoá nội dung. Match nào đổi nội dung so với lúc ký thì **không gắn lại**, phải báo là cần ký lại.

**E. Bỏ `out/matches.jsonl` khỏi `.gitignore`.**

## Tiêu chí · KHOÁ TRƯỚC KHI SỬA

| Mã | Nội dung | Ngưỡng |
|---|---|---|
| **L1** | Sau khi chạy `run` rồi `restore-signoff`, 7 ký và 1 từ chối của Lâm quay lại đủ, đúng lý do | bắt buộc |
| **L2** | `run` khi chưa sao lưu chữ ký thì **dừng và không ghi gì**, exit khác 0 | bắt buộc |
| **L3** | Nếu nội dung một match đổi so với lúc ký, `restore-signoff` **không** gắn lại chữ ký cho nó, và báo rõ | bắt buộc |
| **L4** | Sổ nằm trong git, `git check-ignore` không loại nó | bắt buộc |
| **L5** | Mọi phép thử chạy trên bản sao trước; file chữ ký thật chỉ đụng khi đã chứng minh đủ 4 tiêu chí trên | bắt buộc |

## Constraints

- Không sửa `methodbox/`.
- **Không tự sửa chữ ký của Lâm.** Chỉ di chuyển và bảo vệ, không thay đổi nội dung quyết định.
- Sao lưu bản đã ký ra ngoài repo trước khi đụng bất cứ thứ gì.
- Đọc exit code trần. Em-dash vẫn cấm.
