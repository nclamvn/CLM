# VERIFY REPORT · TIP-CNCL-2C

Ngày: 16/08/2026. Vai: Chủ thầu. Kiểm ngược Completion Report của Thợ bằng lệnh chạy lại, không đọc báo cáo rồi gật.

## REQUIREMENT COVERAGE

5 Acceptance Criteria trong TIP, **5 implemented, 0 missing (100%)**.

| AC | Chủ thầu kiểm lại bằng gì | Kết quả |
|---|---|---|
| Cổng máy xanh và tái lập | Chạy lại refinery, bites, check_dash; chạy refinery hai lần so digest | PASS. Cả ba exit 0. Digest `5df7f4d9312c2abf` lặp lại y hệt. |
| Span nguyên văn | Viết script kiểm **độc lập** với refinery (tự đọc snapshot, tự chuẩn hoá NFC + unescape, tự so) | PASS. 99/99 claim khớp, 0 fail. |
| Không tạo tranh chấp giả | Đếm trực tiếp số giá trị `nhom_cncl` phân biệt trên từng entity | PASS. Không entity nào có 2 giá trị nhóm. |
| Tier A dẫn đường | Đếm lại tier từ claims.jsonl | PASS. 27/99 tier A = 27.3%, tăng từ 21.0%. |
| Trung thực về cái chưa đạt | Đọc mục ISSUES, đối chiếu với số trên đĩa | PASS. Thợ tự khai STATUS PARTIAL và tự nêu 3 sai lệch, không tô hồng. |

Kiểm thêm ngoài AC (Chủ thầu tự thêm):

- **Luật 3 (value không khai quá span):** 57 claim `extraction=verbatim`, **0 vi phạm**.
- **Positive control cho chính cổng:** cắm một claim giả có span không tồn tại, refinery **exit 2** và in đúng `SPAN_NOT_FOUND claim#99 entity='PROBE FAKE'`. Cổng còn cắn thật, không phải xanh vì tê liệt. Đã khôi phục claims.jsonl và xác nhận digest trở lại nguyên trạng.

## SCENARIO RESULTS

Không AC nào fail. Hai deferred, cả hai đều do dữ liệu ngoài đời chứ không do thi công:

| Deferred | Severity | Quyết định |
|---|---|---|
| Nhóm 2 chỉ 1 đơn vị thay vì 3 đến 6 | Trung bình | Chấp nhận. TIP đã cho phép không ép số. Nguyên nhân là nguồn tier A viết phiếm chỉ, không gọi tên pháp nhân. |
| Universe estimate chưa cập nhật cho nhóm 2 và 3 | Thấp | Chấp nhận. Thà giữ 95 và ghi nhãn chỉ báo còn hơn nâng mẫu số theo cảm tính. |

## TECHNICAL HEALTH

```
refinery exit          : 0  (VALIDATION PASSED, 0 gate bites)
bites exit             : 0  (TẤT CẢ RĂNG CẮN)
check_dash exit        : 0  (0 em-dash)
refinery chạy lại      : 0  (cùng digest, idempotent OK, auditor OK)
positive control       : 2  (cổng cắn đúng như thiết kế)
span độc lập           : 99/99 ok, 0 fail
luật 3                 : 57 verbatim claim, 0 vi phạm
ô disputed             : 0
```

## Đánh giá 3 SUGGESTIONS của Thợ

1. **Trường phụ `nhom_cncl_phu` dạng danh sách, không tham gia rollup.** Chủ thầu **đồng ý về vấn đề, chưa duyệt giải pháp**. Sự việc lặp 3 lần liên tiếp (Viettel chip, Viettel 5G, VNPT robot) là bằng chứng đủ mạnh rằng đây là đặc tính dữ liệu chứ không phải trùng hợp. Nhưng thêm trường là **đổi schema**, thuộc L3, phải Lâm quyết. Chủ thầu đưa lên với khuyến nghị: đề xuất này hẹp hơn "đa trị" mà Lâm đã bác, vì trường chính vẫn đơn trị và rollup không đổi.
2. **Định nghĩa ranh giới "vận hành" so với "làm chủ công nghệ" trong domain.yaml.** Chủ thầu **duyệt**, đây là làm rõ định nghĩa domain chứ không đổi schema. Đưa vào TIP kế tiếp. MobiFone giữ hàng đợi tới lúc đó.
3. **Chấp nhận tier B nhiều hơn cho nhóm 3.** Chủ thầu **duyệt có điều kiện**: được dùng tier B nhưng phải giữ tỷ lệ tier A toàn registry trên 20%, và mỗi nhóm mới vẫn phải có ít nhất 1 claim tier A.

## Điểm yếu Thợ tự khai, Chủ thầu xác nhận là điểm yếu thật

Thợ khai rõ trong DEVIATIONS: cổng SPAN_NOT_FOUND chứng minh **span khớp snapshot**, nhưng **không chứng minh snapshot khớp trang gốc**. Đây là lỗ hổng thật của toàn bộ phương pháp, không riêng vòng này, và càng đáng lưu ý khi snapshot do tiến trình phụ ghi. Chủ thầu ghi nhận và giao vòng sau: thêm một cổng đối chứng snapshot với nguồn (tối thiểu là fetch lại và so một mẫu ngẫu nhiên). Việc Thợ tự khai điểm yếu này thay vì giấu là dấu hiệu tốt của audit trail.

## OVERALL STATUS

**READY, kèm 2 deferred đã liệt kê ở trên và 1 việc L3 chờ Lâm.**

Dataset đủ điều kiện đi tiếp. Ba việc mở, xếp theo thứ tự:

1. **L3 chờ Lâm:** có thêm trường phụ `nhom_cncl_phu` không.
2. **Vòng sau:** cổng đối chứng snapshot với nguồn.
3. **Vòng sau:** định nghĩa ranh giới vận hành so với làm chủ công nghệ, giải phóng MobiFone khỏi hàng đợi.
