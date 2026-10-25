# Bảng lệnh + output mẫu cho Playbook chương 2-5 (phần của Thợ theo 06 mục 5)

Ngày: 17/07/2026. Output mẫu dưới đây là THẬT, chụp từ Phase A chạy trên dữ liệu
tổng hợp; sau Phase B sẽ thay bằng output trên dataset thật của Tuyết (giữ
nguyên lệnh, chỉ thay số). Mọi lệnh chạy từ thư mục gốc workspace
(`cd /duong/dan/CaoLocMatch`). Bước nào không có lệnh (đọc hiểu, ghi chép) thì
ghi "không có lệnh" kèm file cần mở.

Quy ước chung khi hỏng: engine dừng ỒN ÀO với dòng bắt đầu `GATE BITES` và mã
thoát 2. Đó không phải máy hỏng; đó là cổng đang làm đúng việc. Đọc tên cổng
trong ngoặc vuông rồi tra bảng lỗi của bước tương ứng.

## Nhóm A · Chuẩn bị và cào

### A1 · Cài môi trường, chạy lệnh đầu tiên
```bash
python3 --version
python3 -c "import yaml; print('pyyaml OK')"
```
Bạn sẽ thấy: `Python 3.x.x` và `pyyaml OK`.
Khi hỏng:
- `command not found: python3`: máy chưa có Python, cài từ python.org rồi mở lại terminal.
- `No module named 'yaml'`: chạy `pip3 install pyyaml`.

### A2 · Đọc hiểu domain.yaml (không có lệnh)
Mở file `domains/dich_vu_solo_entrepreneur/domain.yaml`. Ba chỗ phải nói lại
được: `universe.estimate` (mẫu số 1500), `alias_map` (gộp tường minh hai tên
của cùng một thực thể), `ambiguous_clusters` (cụm CẤM máy tự gộp).

### A3 · Thu thập nguồn mới, lưu snapshot (không có lệnh riêng)
Lưu bản chụp trang nguồn vào `domains/dich_vu_solo_entrepreneur/snapshots/`
(một file một nguồn). Vì sao không tin URL: URL chết hoặc đổi nội dung; bản
chụp mới là thứ kiểm lại được.

### A4 · Trích claim kèm evidence_span nguyên văn
Thêm dòng vào `claims.jsonl`, mỗi dòng một claim. Kiểm đoạn nguyên văn có
trong snapshot trước khi ghi:
```bash
grep -c "đoạn bạn định trích" domains/dich_vu_solo_entrepreneur/snapshots/ten_nguon.html
```
Bạn sẽ thấy: số >= 1. Nếu ra 0: đoạn trích không nguyên văn, cổng
SPAN_NOT_FOUND sẽ cắn ở B5; sửa lại cho đúng từng ký tự theo nguồn.

## Nhóm B · Tinh lọc và registry

### B5 · Chạy pipeline 7 giai đoạn
```bash
python3 methodbox/refinery.py domains/dich_vu_solo_entrepreneur
```
Bạn sẽ thấy (cuối output):
```
Phân bố theo entity_type (n=12 / universe≈1500 · coverage 0.8%):
    cau: 5
    cung: 7

build digest = c46b0718d4b7c577  · idempotent OK · auditor OK
VALIDATION PASSED · 0 gate bites
```
Khi hỏng:
- `GATE BITES · [SPAN_NOT_FOUND] ...`: một claim có evidence_span không nguyên văn trong snapshot. Mở claim đó, so lại với snapshot, sửa đoạn trích.
- `GATE BITES · [CAPTURE_MISSING] ...`: claim trỏ tới snapshot không tồn tại. Kiểm tên file trong `capture.snapshot`.

### B6 · Chạy bộ răng pipeline
```bash
python3 methodbox/bites.py domains/dich_vu_solo_entrepreneur
```
Bạn sẽ thấy: từng dòng `CẮN ✓ (build dừng)` cho 6 răng, vài dòng `N/A` (răng
của loại domain khác, không áp ở đây), và chốt `BITE SUITE: TẤT CẢ RĂNG CẮN ✓`.
"Răng cắn" nghĩa là: tiêm lỗi giả vào BẢN SAO, cổng phát hiện và dừng build.
Răng nào KHÔNG cắn thì cổng đó chưa tin được, phải báo ngay, không chạy tiếp.

### B7 · Khi một cổng cắn thật
Không có lệnh mới: đọc dòng `GATE BITES · [TÊN_CỔNG] lý do`, sửa đúng chỗ nêu
trong lý do, chạy lại lệnh B5 tới khi `VALIDATION PASSED`.

### B8 · Đọc registry (không có lệnh, đọc output B5)
Bốn trạng thái trong bảng: `[✓✓A/B]` corroborated (2 nguồn mạnh độc lập),
`[✓B]` sourced (1 nguồn), `DISPUTED{...}` mâu thuẫn (liệt đủ các giá trị, KHÔNG
chọn hộ), dau gach dai honest-null (chưa ai đo, không phải lỗi). Hệ quả: chỉ
corroborated/sourced thành fact làm căn cứ match; disputed và null thì không.

### B9 · Gặp disputed
Không sửa gì trong dữ liệu. Giá trị disputed nằm nguyên trong registry và
`out/report.json` (`disputed_cells`); việc phán xử là bước ⚑ G3 của người gác
cổng, không phải của bạn.

## Nhóm C · Matching và xuất

### C10 · Chạy match engine
```bash
python3 match_engine.py run domains/dich_vu_solo_entrepreneur
```
Bạn sẽ thấy:
```
MATCH ENGINE · cao-loc-match/0.1.0 rule=overlay_capability_need_v1
facts=38 (claim-tier=4, disputed cells=1, honest-null cells=81)
match: ung vien=5 · dat gate=5 · bi chan=0
  MATCH-0005  Chị Lan Bánh Ngọt  <->  Studio Sao Việt  score=0.95  unverified=0
digest_matches=f8066a1d1597abe5 (tai lap: chay lai phai ra dung digest nay)
```
Chạy lại lần nữa: digest phải Y HỆT (score tái lập). Khác digest là phải báo.

### C11 · Truy một match về nguồn (3 bước, dưới trần 5)
```bash
grep "MATCH-0005" out/matches.jsonl | python3 -m json.tool
grep "FACT-<id trong need_fact_ids>" out/facts.jsonl | python3 -m json.tool
```
Bạn sẽ thấy: match trỏ `need_fact_ids`/`capability_fact_ids`; fact trỏ
`evidence[].span` + `evidence[].snapshot`; mở file snapshot đó thấy đoạn span
nguyên văn. Match về snapshot: 3 bước.

### C12 · Chạy 4+1 răng match gate
```bash
python3 match_bites.py
```
Bạn sẽ thấy: `CLEAN (positive control): PASS exit0`, bốn dòng `CAN OK (exit 2)`,
chốt `MATCH BITES: TAT CA RANG CAN`.
Răng MATCH_CLAIM_AS_FACT nghĩa là: một match lấy dữ kiện hạng "tự khai chưa
kiểm" (tier C) làm căn cứ chính mà KHÔNG khai vào ô `unverified` thì bị chặn;
máy được dùng tin chưa kiểm, nhưng không được phép giấu điều đó.

### C13 · Bắt chữ ký người gác cổng thật
```bash
python3 match_engine.py validate domains/dich_vu_solo_entrepreneur out/matches.jsonl --require-signoff
```
Bạn sẽ thấy (khi CHƯA ai ký):
```
GATE BITES · [SIGNOFF_PENDING] MATCH-0001: chua co nguoi gac cong that ky (by/date)
```
Đỏ là ĐÚNG: chưa có người thật đứng sau thì không match nào được trình ra
ngoài. Sau khi người gác cổng duyệt và chạy `sign` (bước ⚑ G2), lệnh trên phải
xanh: `VALIDATE PASSED · ... · signoff THAT du`.

### C14 · Nhận diện máy sai một cách tự tin (không có lệnh)
Ba ca mồi do Chủ thầu nạp ở chương 6 (case thật từ Phase B). Việc của bạn:
nhìn score cao mà nghi đúng chỗ (chuỗi yếu, khớp chữ sai nghĩa, nguồn tier C
trông sang) và nói được vì sao nghi.

## Nhóm D · Hậu kiểm

### D15 · Ghi dự kiến TRƯỚC khi chạy (không có lệnh)
Mở file mới `notes/du_kien_<ngay>.md`, ghi 2 dòng: mong ra bao nhiêu match,
ở nhóm dịch vụ nào. Ghi XONG mới được chạy C10.

### D16 · Đối chiếu sau khi chạy (không có lệnh)
Mở lại file D15, ghi thêm: số thật (`match:` dòng đầu output C10), lệch chỗ
nào, 3 dòng bài học. Không sửa dòng dự kiến đã ghi.
