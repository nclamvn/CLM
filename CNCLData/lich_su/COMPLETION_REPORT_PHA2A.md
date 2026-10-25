# Completion Report · Pha 2a · nhóm 6 (chip bán dẫn) · domain `don_vi_cncl`

Ngày: 16/08/2026. Workspace: `/Users/os/CNCLData`. Vai: Chủ thầu kiêm Thợ (dual-role, Lâm uỷ quyền). Bối cảnh: dự án chuyển self-operated sau khi đóng PoC với Tuyết (09_KET_THUC_POC.md), Tuần 1 của 08_KE_HOACH_PILOT.

## 1. Cổng + exit code (chạy trước khi báo số, đọc trần, không pipe)

| Cổng | Lệnh | Exit |
|---|---|---|
| Refinery (gồm SPAN_NOT_FOUND, auditor, idempotent) | `python3 methodbox/refinery.py domains/don_vi_cncl` | 0 · VALIDATION PASSED · 0 gate bites |
| Bites (mọi răng phải CẮN) | `python3 methodbox/bites.py domains/don_vi_cncl` | 0 · BITE SUITE: TẤT CẢ RĂNG CẮN |
| Dash gate | `python3 check_dash.py` | 0 · 0 em-dash, 0 en-dash |

Build digest: `1c04feb3331ada7b` (tái lập, idempotent OK, auditor OK).

## 2. Số thật

- Trước: 64 claim · 14 đơn vị · 7 snapshot · 2 nhóm (1, 9).
- Sau: **73 claim · 17 đơn vị · 9 snapshot · 3 nhóm (1, 6, 9)**.
- Thêm: 9 claim, 3 đơn vị, 2 nguồn mới (nhandan.vn bài bán dẫn 02/2026, nguoiquansat.vn 27/10/2025).
- Phân bố: nhóm 1 = 7, nhóm 6 = 2, nhóm 9 = 7, chưa rõ = 1.
- Coverage chỉ báo: 21.2% trên universe placeholder 80. **Không công bố như tỷ lệ chính xác** (mẫu số vẫn placeholder từ Pha 1).
- Tier: toàn bộ 9 claim mới là tier B (chưa có nguồn gov cho nhóm 6 trong vòng này).

Đơn vị mới: FPT Semiconductor (3 claim), CT Semiconductor (4 claim), Masan High-Tech Materials (2 claim).

## 3. Loại bỏ và honest-null có chủ đích (không lấp)

- **Geleximco / Viettronics: KHÔNG nạp.** Bằng chứng trong nguồn là thương vụ mua 88% cổ phần và tuyên bố chiến lược, không phải năng lực chip đã có. Giữ đúng tiền lệ D7 Pha 1 (CMC bị bỏ vì chỉ nêu hợp tác).
- **Masan High-Tech Materials: `nhom_cncl` để trống có chủ đích.** Nguồn đặt đơn vị ở khâu vật liệu thượng nguồn (vonfram, fluorspar) của chuỗi chip. Có thể thuộc nhóm 6 (chip bán dẫn) hoặc nhóm 5 (năng lượng, vật liệu tiên tiến). Máy không tự gán, chờ người quyết.
- **CT Semiconductor: mốc "chip Made by Vietnam đầu tiên trong năm 2025" là dự kiến tại thời điểm bài đăng 27/10/2025**, chưa có nguồn xác nhận đã ra chip. Ghi trong `note`, cấm đọc thành đã hoàn thành.
- **VSAP LAB: chưa nạp được, lý do kỹ thuật thật (mục 4).**

## 4. Ba phát hiện cấu trúc cần Lâm quyết trước khi mở rộng 7 nhóm còn lại

### 4.1 Schema một-giá-trị-một-field chặn việc làm giàu đơn vị đã có

Refinery gộp claim theo (entity, field): nếu hai claim cùng field mà khác value thì ô thành `disputed`. Hệ quả: không thể bổ sung bằng chứng mới cho đơn vị đã trong registry mà không tạo tranh chấp giả. Cụ thể vòng này:

- FPT đã có `nhom_cncl = 1`. Bài Nhân Dân chứng minh FPT làm nhà máy kiểm thử đóng gói chip (nhóm 6). Không thể thêm, vì sẽ thành disputed sai.
- Tập đoàn Viettel đã có `nhom_cncl = 1`. Nguồn nêu Viettel khởi công nhà máy sản xuất chip. Cùng vấn đề.

Cách xử lý tạm vòng này: chỉ tạo **đơn vị mới** khi có pháp nhân riêng (FPT Semiconductor, CT Semiconductor), khai vào `ambiguous_clusters` để cấm tự gộp (đã thêm [FPT, FPT Semiconductor] và [CT Group, CT Semiconductor]).

**Quyết định cần:** cho `nhom_cncl` và `san_pham_lien_quan` thành trường đa trị (một đơn vị thuộc nhiều nhóm là chuyện bình thường trong thực tế), hay giữ đơn trị và tách theo pháp nhân. Đây là quyết định kiến trúc, ảnh hưởng toàn bộ 7 nhóm còn lại.

### 4.2 Cổng dash đang chặn cả bằng chứng nguyên văn

VSAP LAB (lab-fab đóng gói bán dẫn tiên tiến đầu tiên tại Việt Nam) có bằng chứng tốt, nhưng câu gốc trên báo chứa ký tự en-dash U+2013. `check_dash.py` cấm ký tự đó trong mọi file trong repo. Hai lối đi đều có giá:

- Sửa câu gốc: phá tính nguyên văn, phá luôn ý nghĩa của SPAN_NOT_FOUND. **Không làm.**
- Miễn trừ thư mục `snapshots/` khỏi cổng dash (giống cách `methodbox/` được miễn vì là bản sao nguyên văn).

Tôi **không tự nới cổng**, để nguyên và báo. Vòng này VSAP LAB nằm ngoài registry, ghi rõ lý do trong header snapshot.

**Quyết định cần:** có miễn trừ `snapshots/` khỏi cổng dash không.

### 4.3 Nguồn tier A cho nhóm 6 chưa có

Cả 9 claim mới đều tier B. Cần một vòng cào riêng vào mst.gov.vn, baochinhphu.vn, chinhphu.vn cho nhóm bán dẫn để nâng tier và tạo cơ hội corroborated.

## 5. Lệnh tái lập

```
cd /Users/os/CNCLData
python3 methodbox/refinery.py domains/don_vi_cncl ; echo $?
python3 methodbox/bites.py domains/don_vi_cncl    ; echo $?
python3 check_dash.py                              ; echo $?
```

Backup claims trước khi ghi: `/tmp/claims_backup_pha1.jsonl` (64 dòng, môi trường sandbox, không cam kết tồn tại lâu; bản git là nguồn khôi phục chính).

## 6. Việc kế tiếp

Chờ Lâm quyết 3 điểm ở mục 4. Sau đó: nhóm 3 (robot và tự động hoá) và nhóm 2 (mạng di động thế hệ sau) là hai nhóm có nguồn công khai dày nhất, làm tiếp theo. Nhóm 8 (biển, đại dương, lòng đất) và nhóm 10 (đường sắt) dự kiến mỏng, chuẩn bị tinh thần honest-null.
