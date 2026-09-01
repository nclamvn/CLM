# Khoá bằng chứng trong sổ chữ ký

Ngày: 16/08/2026. Vòng này khép hai việc: trả nốt 7 câu snapshot còn lệch về đúng chữ nguồn,
và bịt một lỗ hổng phát hiện được ngay khi làm việc đó.

## STATUS

**PASS.** Năm cổng xanh ở miền nguồn, ba cổng xanh ở miền dẫn xuất, răng mới cắn được.

```
refinery = 0     bites = 0     luat3 = 0     dash = 0
snapshot: 31 · doi chung duoc: 31 · cau khop: 115 · cau lech: 0
```

## Phần một: 7 câu cuối

Vòng trước đưa số câu lệch từ 26 xuống 23, rồi kịch bản tự động kéo tiếp xuống 7. Bảy câu
này máy từ chối đụng vào vì không đủ chắc, đúng như thiết kế. Soi tay từng câu:

| Loại | Số câu | Xử lý |
|---|---|---|
| Câu bị viết lại (đảo cấu trúc, viết hoa lại đầu mệnh đề) | 4 | Trả về nguyên văn nguồn |
| Snapshot gộp hai câu nguồn thành một | 1 | Tách lại theo nguồn |
| Bị gỡ markup liên kết nằm giữa câu | 1 | Trả về nguyên văn kèm markup |
| Nguồn ngắt dòng giữa câu, snapshot nối liền | 1 | Trả về đúng cách ngắt của nguồn |

Bốn câu bị viết lại đều thuộc `vjst.vn` và `cafef.vn`. Ví dụ nặng nhất:

```
snapshot cu : Mô hình LLM hỗ trợ tiếng Việt với độ dài ngữ cảnh (context length) 4096 token
nguon that  : Có mô hình xác suất có khả năng hiểu và sinh ngôn ngữ tự nhiên (LLM) để hỗ trợ
              tiếng Việt được huấn luyện hỗ trợ độ dài ngữ cảnh (context length) 4096 token
```

Nội dung không sai. Nhưng câu cũ là câu **do người ghi đặt ra**, không phải câu của nguồn.
Cùng loại lỗi với ca Realtime Robotics ở vòng trước.

Ba claim đổi nhãn `verbatim` sang `normalized` vì giá trị không còn nằm trọn trong span mới:
Phenikaa-X, Tập đoàn Viettel, NCS. Ca NCS đáng nói: nguồn có một liên kết markdown chen ngay
giữa tên pháp nhân, nên tên đầy đủ **không tồn tại như một chuỗi liền** trong bản chụp.
Nhãn `normalized` là câu trả lời trung thực cho chuyện đó, không phải chỗ để lách.

## Phần hai: lỗ hổng lộ ra khi định để anh ký lại

Báo cáo vòng trước dự đoán: sửa span xong thì `restore-signoff` sẽ báo ba match cần ký lại.

**Dự đoán đó sai. Máy gắn lại đủ 12 trên 12 chữ ký, không dòng nào báo động.**

Nguyên nhân nằm ở một dòng code:

```python
def fact_id(entity, field, value):
    h = hashlib.sha1(f"{entity}|{field}|{value}".encode("utf-8")).hexdigest()[:10]
```

Khoá nội dung của một match gồm hai mã thực thể và các `fact_id`. Mà `fact_id` băm từ
`entity|field|value`, **không phủ `evidence_span`**. Hệ quả: viết lại câu làm bằng thì mọi
khoá vẫn y nguyên. Người gác cổng ký trên một câu, câu đó bị đổi, chữ ký vẫn nằm đó.

Đây đúng thứ dự án này tồn tại để chặn. Chữ ký treo lơ lửng còn nguy hơn không có chữ ký,
vì nó tạo cảm giác đã có người xem.

## Cách bịt

Thêm khoá thứ hai `bang_chung` = sha256 của tập `fact_id => snapshot::evidence_span`.

Ba lựa chọn thiết kế, ghi lại vì đều có thể làm khác:

**Một, để riêng chứ không gộp vào `digest` cũ.** Gộp thì cả 12 chữ ký đổi khoá cùng lúc,
không phân biệt được dòng nào thật sự bị đụng tới bằng chứng. Để riêng thì sổ chỉ đúng dòng.

**Hai, `migrate-ledger` bắt buộc có `--truoc`.** Đóng khoá cho 12 dòng ký trước khi khoá này
tồn tại thì phải lấy bằng chứng **đúng lúc ký**, dựng lại từ git commit `ac41090`. Nếu đóng
dấu bằng bản hiện tại thì mọi dòng đều khớp, tức là lặng lẽ hợp thức hoá đúng cái thay đổi
mà khoá này sinh ra để bắt. Đó là ký ngược, không phải di cư. Lệnh từ chối chạy nếu thiếu cờ.

**Ba, dòng sổ cũ chưa có khoá bằng chứng thì KHÔNG được gắn lại.** Không suy diễn "chắc là
không đổi". Thiếu điều kiện thì hệ suy biến thành trạng thái chặt hơn, không phải lỏng hơn.

## Kết quả đo, sau khi có khoá

```
migrate-ledger --truoc <claims luc ky>  ->  dong khoa cho 12 dong
restore-signoff                          ->  gan lai 12/12
```

Nghĩa là: **không match đã ký nào dựa trên bằng chứng bị đổi chữ.** Con số này khác con số
"3 match bị ảnh hưởng" trong báo cáo trước, và báo cáo trước sai.

Sai ở đâu: nó đếm ở mức **đơn vị**. Đơn vị nào có một ô đổi chữ thì mọi match của đơn vị đó
bị tính là ảnh hưởng. Nhưng MATCH-0004 (Viettel × P23) không dựa vào ô `nang_luc_mo_ta` bị
sửa, nó dựa vào `nang_luc_mo_ta_2` là thoả thuận chip FPT với Viettel, ô này không đổi một
ký tự. Tương tự MATCH-0007 và MATCH-0008.

Bản đính chính đã ghi vào `COMPLETION_REPORT_FIDELITY_DAY_DU.md`, không xoá con số cũ.

**Anh không phải ký lại gì cả trong vòng này.** Không phải vì máy tự tha, mà vì máy đã đo
được và số đo là 0.

## Răng phải tự chứng minh nó cắn

Một cổng không bao giờ nổ thì không phân biệt được với cổng hỏng. `bite_bang_chung.py` sửa
đúng một chuỗi trong span của một fact thật (`28-32 nm` thành `28 nm`) trên bản nháp:

```
SACH (doi chung duong)  : PASS exit0
RANG BANG CHUNG         : CAN OK (exit 2, chu ky bi go)
BITE KHOA BANG CHUNG    : RANG CAN
```

Hai chữ ký bị gỡ chứ không phải một: MATCH-0004 và MATCH-0008 cùng dựa vào fact đó. Đúng
hành vi mong muốn, một câu bằng chứng hỏng thì mọi match tựa vào nó đều mất hiệu lực.

## Một luật vận hành lại tự nhắc

Sau khi sửa snapshot ở `CNCLData`, `build_cncl_match.py` báo 21 lỗi `SPAN_LOST`. Không phải
lỗi dữ liệu: miền dẫn xuất giữ bản chụp riêng và bản đó chưa được chép sang. Đúng cái bẫy đã
vấp ở vòng viết tài liệu trạng thái.

**Sửa snapshot ở miền nguồn thì phải chép sang miền dẫn xuất trước khi build.** Cổng đã bắt
đúng và không ghi gì cả, nên không có hư hại. Nhưng đây là lần thứ hai, nên nó thuộc loại
phải tự động hoá chứ không phải phải nhớ.

## Lệnh

```
cd /Users/os/CNCLData
python3 check_snapshot_fidelity.py domains/don_vi_cncl --fresh .fidelity_fresh ; echo $?

cd /Users/os/CaoLocMatch
python3 build_cncl_match.py && python3 match_engine.py run domains/cncl_match
python3 match_engine.py restore-signoff domains/cncl_match out/matches.jsonl
python3 bite_bang_chung.py ; echo $?
```
