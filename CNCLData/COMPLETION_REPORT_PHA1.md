# Completion Report · Pha 1 · domain refinery `don_vi_cncl`

Ngày nộp: 18/07/2026. Workspace: `/Users/os/CNCLData` (git riêng, WIP chưa commit). Thực thi theo TIP-DOMAIN-DON-VI-CNCL.md, seed đã duyệt. Đây là chiều CUNG của CàoLọcMatch: đơn vị VN có năng lực theo nhóm công nghệ chiến lược (QĐ 21/2026/QĐ-TTg).

## 1. Bảng răng + exit code (bằng vận hành, chạy trước khi báo số)

Lệnh: `python3 methodbox/bites.py domains/don_vi_cncl`

| Răng | Kết quả |
|---|---|
| CLEAN (positive control) | PASS exit0 |
| CAPTURE_MISSING | CẮN (build dừng) |
| SPAN_NOT_FOUND | CẮN (build dừng) |
| SOURCED_ATTR | CẮN (build dừng) |
| AMBIGUOUS_MERGE_UNFLAGGED | CẮN (build dừng) |
| DISTRIBUTION_NO_DENOMINATOR | CẮN (build dừng) |
| IDEMPOTENT | CẮN (build dừng) |
| REQUIRED_FIELD / ORIGIN_EVIDENCE / NO_INFERRED / STRATUM_MISMATCH / SCOPE_PLACEMENT / CAUSE_SOURCED / SEVERITY_SOURCED / NO_BLAME_INFERRED | N/A (domain pilot không khai các domain_gates này) |

BITE SUITE: TẤT CẢ RĂNG CẮN. BITES_EXIT = 0.
REFINERY (`python3 methodbox/refinery.py domains/don_vi_cncl`): VALIDATION PASSED, 0 gate bites, REFINERY_EXIT = 0 (gồm SPAN_NOT_FOUND + auditor + idempotent).

## 2. Thống kê registry

- Tổng: 64 claim, 14 đơn vị, 7 snapshot, 7 nguồn.
- Đơn vị theo nhóm (n=14 / universe placeholder 80 / coverage 17.5%, chỉ báo):
  - Nhóm 9 hàng không vũ trụ (7): Viettel High Tech, Realtime Robotics (RtR), Phenikaa-X, HTI Technology, CT Group, MiSmart, XBStation.
  - Nhóm 1 công nghệ số (7): VNPT, FPT, Viettel AI, Tập đoàn Viettel, VinAI, VinBigData, Zalo.
- Trạng thái ô (112 ô = 14 đơn vị x 8 field): sourced 60, corroborated 2, null 50 (honest-null), disputed 0.
- Corroborated (2 nguồn A/B độc lập cùng giá trị): FPT/nhom_cncl [A mst + B vneconomy], VNPT/nhom_cncl [A mst + B vneconomy].
- Tier claim: A = 12 (18.75%), B = 52 (81.25%). Tier A đều từ mst.gov.vn (Cổng TTĐT Bộ KH&CN).
- FAIRNESS: 6 claim gắn favors=rtr, đều thuộc Realtime Robotics (RtR); cùng chuẩn evidence như mọi đơn vị.
- Nguồn: cafef.vn, mst.gov.vn, nhandan.vn, tapchikinhtetaichinh.vn, vjst.vn, vnanet.vn, vneconomy.vn.
- Ambiguity flagged (không tự gộp): [Viettel High Tech, Viettel AI, Tập đoàn Viettel], [VinAI, VinBigData].

## 3. Lệnh tái lập (exit code đọc trần, không pipe)

```
cd /Users/os/CNCLData
python3 methodbox/refinery.py domains/don_vi_cncl ; echo $?      # PASS = 0
python3 methodbox/bites.py domains/don_vi_cncl                    # mọi răng CẮN
```

Mỗi ô truy về snapshot trong `domains/don_vi_cncl/snapshots/`; mỗi evidence_span là chuỗi con nguyên văn của snapshot nó trỏ tới (refinery SPAN_NOT_FOUND enforce, chuẩn hoá NFC).

## 4. Decisions log

- D1 Schema: domain refinery dùng `capture.snapshot` lồng, không có field `id`. `check_spans.py` (viết cho schema phẳng của dataset khung) KHÔNG port sang đây. Luật 1 (span verbatim) do refinery SPAN_NOT_FOUND gánh; luật 2 (id duy nhất) N/A; luật 3 (value trong span) review người. TIP đã sửa cho khớp.
- D2 Classification: `nhom_cncl` và `san_pham_lien_quan` để extraction=normalized. Span chứng minh đơn vị làm UAV (hoặc công nghệ số); ánh xạ UAV -> SP22/nhóm 9 và công nghệ số -> nhóm 1 theo QĐ 21/2026 ghi ở field `note`. KHÔNG phải quote literal "9"/"22". X-Ray soi luật 3 tại đây.
- D3 Ambiguity: 3 tên Viettel + 2 tên Vin khai ambiguous_clusters, không tự gộp; răng AMBIGUOUS_MERGE xác nhận cắn khi thử gộp âm thầm.
- D4 FAIRNESS: RtR vào registry với 6 claim favors=rtr, cùng chuẩn evidence.
- D5 Mẫu số: universe.estimate=80 là placeholder pilot cơ sở mỏng; coverage 17.5% chỉ mang tính chỉ báo, KHÔNG công bố như tỷ lệ chính xác.
- D6 Snapshot: là web_fetch text extraction, không phải HTML raw. Fidelity snapshot-vs-gốc cần đối chứng nguồn thứ hai trước khi đưa ra ngoài.
- D7 Loại bỏ có kỷ luật: CMC bị bỏ (nguồn chỉ nêu hợp tác, thiếu bằng chứng năng lực) -> honest-null, không nạp. VinAI giữ (có bằng chứng Top 20). VinAI Top-20 là năm 2022 theo nguồn.
- D8 Corroboration: đạt cho FPT/VNPT nhom_cncl (mst tier A + vneconomy tier B cùng giá trị).

## 5. Honest-null và cái CHƯA đạt (không lấp)

- 7 đơn vị/nhóm, dưới trần kỳ vọng 15-30 của TIP (TIP ghi 15-30 là trần, honest-null nếu tài liệu công khai mỏng, không ép số). Đuôi đơn vị nhỏ thưa dần.
- Nhóm 9: 3 nguồn (mục tiêu 5+). Nhóm 1: 4 nguồn.
- Toàn bộ 14 đơn vị là loại hình DN; CHƯA có viện/trường (VD Viện Hàn lâm KHCN VN, ĐH Bách Khoa) -> hướng cào tiếp.
- 50 ô null: phần lớn là loai_hinh, bang_chung_nang_luc, location, source chưa có bằng chứng verbatim -> để trống thật, không đoán.
- VinAI/VinBigData: hai đơn vị cùng Vingroup, giữ tách theo sản phẩm, flag ambiguous cho người quyết gộp.

## 6. Cổng X-Ray cho Chủ thầu (từ TIP)

- Tự chạy lại bites + refinery (exit trần).
- Chọn ngẫu nhiên 5 đơn vị, truy từng fact về snapshot (mở file trong snapshots/, tìm evidence_span).
- Kiểm mọi record favors=rtr (6 claim, đơn vị Realtime Robotics) cùng chuẩn evidence.
- Kiểm phân bố có mẫu số (rollup nhom_cncl kèm universe.estimate; lưu ý D5).
