# VERIFY REPORT · TIP-CNCL-2D

Ngày: 16/08/2026. Chủ thầu kiểm ngược công việc của Thợ bằng lệnh chạy lại.

## REQUIREMENT COVERAGE

4 Acceptance Criteria, **4 implemented, 0 missing (100%)**. Trong đó 1 AC đạt ở mức chứng minh bằng fixture, chưa chạy được với nguồn sống (mục Deferred).

| AC | Kiểm bằng gì | Kết quả |
|---|---|---|
| Trường phụ không gây tranh chấp, không đụng rollup | Chạy refinery, đối chiếu phân bố với Pha 2c; đếm ô đa giá trị bằng script riêng | PASS. Phân bố **y hệt** Pha 2c (1:7, 2:1, 3:4, 6:4, 9:7, chưa rõ:1). 0 ô disputed. |
| Backfill có bằng chứng thật | Kiểm span của 2 claim trường phụ với snapshot đã có sẵn | PASS. Cả hai span khớp, cả hai tier A. Không cào thêm nguồn nào. |
| Cổng đối chứng tự chứng minh nó cắn | 3 phép thử có đối chứng dương và âm | PASS, xem bảng dưới. |
| Ranh giới năng lực áp được vào ca thật | Đọc `scope_note` trong domain.yaml | PASS. Có đủ 3 mức (đủ điều kiện, không đủ, ranh giới xám) và kết luận dứt khoát cho MobiFone. |

## SCENARIO RESULTS · cổng đối chứng nguồn

| Phép thử | Kỳ vọng | Thực tế |
|---|---|---|
| T1: chưa có bản tươi nào | Fail-loud, tuyệt đối không in OK | exit **3**, in "KHÔNG CHẠY ĐƯỢC: khong co ban tuoi nao. Day KHONG phai PASS." |
| T2: bản tươi bị xoá đúng 1 câu | Cắn, chỉ đích danh snapshot và câu | exit **2**, in `SOURCE_CHANGED: vjst_rostek_agv_20220103.html` kèm nguyên câu Nidec Sankyo |
| T3: bản tươi trùng khớp | Qua, và khai rõ còn bao nhiêu chưa đối chứng | exit **0**, "1 snapshot khớp, còn 14 snapshot chưa đối chứng" |

Chủ thầu đánh giá **thiết kế không tự gọi mạng là quyết định đúng**: gate tất định, kiểm được, và người đọc báo cáo biết chính xác nó đã so với cái gì. Đổi lại, gate phụ thuộc vào việc ai đó nạp bản tươi, nên trạng thái "chưa đối chứng" phải luôn hiện trong báo cáo chứ không được im lặng.

## TECHNICAL HEALTH

```
refinery exit                : 0  (VALIDATION PASSED, 0 gate bites)
bites exit                   : 0  (TẤT CẢ RĂNG CẮN)
check_dash exit              : 0
check_snapshot_fidelity T1/T2/T3 : 3 / 2 / 0  (đúng thiết kế)
digest                       : a71e1dff2e4edb61 (idempotent OK, auditor OK)
claims                       : 101 (99 + 2 backfill)
entities                     : 24 (không đổi, backfill vào đơn vị đã có)
tier A                       : 29/101 = 28.7% (tăng từ 27.3%)
ô disputed                   : 0
rollup                       : không đổi so với Pha 2c
```

## Deferred (liệt kê, không giấu)

1. **Chưa đối chứng snapshot với nguồn sống.** 15/15 snapshot đang ở trạng thái `SOURCE_UNREACHABLE`. Sandbox không có mạng cho gate, và luật của dự án cấm lấy nội dung web bằng đường vòng. Cách chạy thật: người vận hành hoặc phiên có công cụ fetch tải lại từng trang vào `.fidelity_fresh/` rồi chạy gate. **Không được coi đây là PASS.**
2. **Viettel nhóm 2 (5G) vẫn nợ.** Chưa có snapshot trên đĩa, TIP cấm nạp bằng trí nhớ. Việc của vòng sau.
3. **MobiFone: kết luận KHÔNG NẠP**, dẫn chiếu `scope_note` (vận hành và khai thác dịch vụ, không phải làm chủ công nghệ). Ghi trong domain.yaml để lần sau không phải cãi lại.

## OVERALL STATUS

**READY, kèm 3 deferred trên.**

Nút thắt lặp 3 vòng đã gỡ: bằng chứng nhóm phụ nay nạp được mà trường chính vẫn đơn trị, rollup không suy suyển, và ô vẫn corroborated được khi có hai nguồn độc lập. Lỗ hổng phương pháp Thợ tự khai ở 2c nay có cổng riêng, và cổng đã tự chứng minh nó cắn.

Vòng kế: nhóm 5 (năng lượng, vật liệu tiên tiến) và nhóm 4 (sinh học, y sinh tiên tiến), kèm nạp bản tươi cho gate đối chứng.
