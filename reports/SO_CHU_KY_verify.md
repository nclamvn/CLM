# Completion + VERIFY · TIP-CNCL-3D · Sổ chữ ký bền vững

Ngày: 16/08/2026. Task nhỏ về khối lượng, lớn về rủi ro, nên gộp Completion và Verify nhưng giữ đủ đối chứng.

## STATUS

**DONE. 5/5 tiêu chí đạt.** Quyết định của Lâm khớp hoàn toàn với bản sao an toàn sau khi đi qua đủ vòng xoá và khôi phục.

## Hai lỗ hổng đã bịt

**1. `run` xoá chữ ký không báo.** Nay có cổng `SIGNOFF_SE_BI_GHI_DE` chạy **trước** khi ghi bất cứ thứ gì. Có `--force` để cố tình bỏ qua, và cờ đó in cảnh báo rõ.

**2. Chữ ký không nằm trong git.** Nay có `signoff_ledger.jsonl` trong thư mục domain, cộng với `out/matches.jsonl` được đưa lại vào git.

## Điểm thiết kế quan trọng nhất: khoá theo nội dung, không theo số thứ tự

Sổ khoá mỗi quyết định bằng digest của cặp thực thể và cặp fact căn cứ, không phải bằng `MATCH-0002`.

`MATCH-0002` chỉ là số thứ tự do engine sinh ra. Chạy lại với dữ liệu khác thì `MATCH-0002` có thể là một cặp hoàn toàn khác. Nếu gắn chữ ký vào số thứ tự thì chữ ký của Lâm sẽ tự động nhảy sang một cặp mà anh chưa từng nhìn thấy. **Đó còn tệ hơn mất chữ ký**, vì mất thì biết mà nhảy nhầm thì không ai biết.

## Bảy phép thử, đều có đối chứng dương

| Thử | Kỳ vọng | Kết quả |
|---|---|---|
| L2a `run` khi sổ trống | dừng, không ghi | exit 2 · `SIGNOFF_SE_BI_GHI_DE` · md5 file **không đổi** |
| L2b sau khi vá tương thích ngược | bắt đủ 8, không phải 1 | exit 2 · liệt kê cả 8 ID |
| L2c `run` khi sổ đã đủ | chạy được | exit 0 |
| L1 `restore-signoff` | gắn lại đủ 7 ký, 1 từ chối, giữ lý do | 8/8 · lý do nguyên văn |
| L3 đổi nội dung một match rồi restore | **không** gắn lại chữ ký cho nó | exit 2 · `CHUA KY: MATCH-0007` |
| L4 sổ nằm trong git | staged được | `A out/matches.jsonl` |
| L5 mọi thứ thử trên bản sao trước | file thật chỉ đụng sau cùng | đúng |

**Diễn tập thật trên file của Lâm**: chạy `run` (chữ ký biến thành `pending`), rồi `restore-signoff` (8/8 quay lại), rồi `validate --require-signoff` (KY 7, TU CHOI 1). So với bản sao an toàn: **khớp hoàn toàn**.

## Ba lỗi của chính tôi bị phép thử bắt được

1. **Cổng ban đầu chỉ bắt 1 trên 8 chữ ký.** Tôi lọc theo trường `decision`, nhưng bảy chữ ký cũ của Lâm không có trường đó. Nếu không thử trên bản sao thì bảy chữ ký kia bị ghi đè âm thầm, đúng cái lỗi mà TIP này sinh ra để chữa. Đã vá bằng luật tương thích ngược.
2. **`.gitignore` viết `out/` thì phủ định `!out/matches.jsonl` vô tác dụng**, vì git không đi vào thư mục đã bị loại. Phải viết `out/*`. Tôi tưởng đã sửa xong, kiểm lại mới thấy vẫn bị loại.
3. **Suy đoán domain từ đường dẫn thất bại trên repo thật** vì có hai domain. Cổng đã fail-loud thay vì đoán bừa, và tôi thêm cờ `--domain`. Đây là ca cổng làm đúng việc.

## Quy trình mới, bắt buộc từ nay

```
python3 match_engine.py run domains/cncl_match                       # se DUNG neu chua ghi so
python3 match_engine.py restore-signoff domains/cncl_match out/matches.jsonl
python3 match_engine.py validate domains/cncl_match out/matches.jsonl --require-signoff
```

Ký hoặc từ chối trên repo có nhiều domain thì thêm `--domain domains/<ten>`.

## Còn nợ

`out/matches.jsonl` nay được git theo dõi, nhưng nó vẫn là **bản dẫn xuất**. Nguồn sự thật của chữ ký là `signoff_ledger.jsonl`. Nếu hai bên lệch nhau thì tin sổ. Chưa có cổng kiểm tính nhất quán giữa hai file; đó là việc vòng sau.
