# Completion + VERIFY · Ký chọn lọc và verb từ chối

Ngày: 16/08/2026. Nguyên nhân: lệnh `sign` chỉ có một chế độ là ký tất cả, nên Lâm ký nhầm cả MATCH-0002 vốn đã được khuyến nghị không ký.

## Điểm thiết kế quan trọng hơn cả tính năng

Ban đầu tôi định chỉ thêm `--only` và `--except`. Nhưng như vậy vẫn còn một lỗ: **match không được ký sẽ ở trạng thái nhập nhằng**, không phân biệt được "chưa ai xem" với "đã xem và từ chối". Hai thứ đó khác hẳn nhau về trách nhiệm. Người đọc file sau này không có cách nào biết MATCH-0002 bị bỏ qua vì sơ suất hay vì bị bác.

Nên tôi thêm hẳn một verb riêng: **`reject`**, ghi lại quyết định từ chối kèm lý do bắt buộc. Vắng chữ ký từ nay chỉ có một nghĩa duy nhất: chưa xử lý.

## Đã thêm

```
sign   <matches.jsonl> <nguoi> <ngay> [--only ID,ID | --except ID,ID]
reject <matches.jsonl> <nguoi> <ngay> --ids ID,ID --reason "..."
```

- `signoff.decision` nhận `ky` hoặc `tu_choi`; từ chối kèm `ly_do`.
- `validate --require-signoff` nay in tách bạch số ký và số từ chối, nêu rõ **chỉ match đã ký mới được trình ra ngoài**.
- Match chưa xử lý vẫn bị răng `SIGNOFF_PENDING` cắn như cũ.
- `--reason` là **bắt buộc** khi từ chối. Từ chối mà không ghi lý do thì vô nghĩa với người đọc sau.

## Tám phép thử, có đối chứng dương

| Thử | Kỳ vọng | Kết quả |
|---|---|---|
| T1 `--only MATCH-9999` (ID không tồn tại) | cắn, không ghi bừa | exit 2 · `SIGN_ID_KHONG_TON_TAI` |
| T2 `reject` thiếu `--reason` | chặn | exit 1 · báo rõ lý do |
| T3 file sau hai lần thất bại | nguyên vẹn | 8 match, không đổi một byte |
| T4 `reject` đúng cách | ghi từ chối kèm lý do | exit 0 · `TU CHOI: 1/8` |
| T5 `sign --except MATCH-0002` | ký đúng 7 | exit 0 · liệt kê đủ 7 ID |
| T6 trạng thái cuối | 7 `ky`, 1 `tu_choi` có lý do | đúng |
| T7 `validate --require-signoff` | tách bạch ký và từ chối | exit 0 · `KY: 7` · `TU CHOI: 1 (MATCH-0002)` |
| T8 một match trả về chưa xử lý | vẫn phải cắn | exit 2 · `SIGNOFF_PENDING` |

**Toàn bộ phép thử chạy trên bản sao, không đụng file chữ ký thật của Lâm.** Đã kiểm lại sau khi dọn: file thật vẫn 8 match, MATCH-0002 vẫn mang chữ ký cũ chưa có trường `decision`. Việc sửa nó là quyết định của người gác cống, không phải của máy.

## Tương thích ngược

Chữ ký cũ không có trường `decision` được đọc mặc định là `ky`. Nên bảy match kia không cần ký lại.

## Việc còn lại của người

Chạy đúng một lệnh để sửa MATCH-0002, không phải ký lại từ đầu:

```
cd /Users/os/CaoLocMatch
python3 match_engine.py reject out/matches.jsonl "Lam Nguyen" 2026-08-16 \
  --ids MATCH-0002 \
  --reason "Ca rac da biet: hai token khop la manh vun cua tu ghep, VNPT khong lam nen tang san xuat thong minh"
python3 match_engine.py validate domains/cncl_match out/matches.jsonl --require-signoff ; echo $?
```

Kỳ vọng: exit 0, in `KY: 7` và `TU CHOI: 1 (MATCH-0002)`.
