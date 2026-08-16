# TIP-CNCL-3F · Biến luật 3 thành cổng máy

## Header

- **ID:** TIP-CNCL-3F
- **Dependencies:** Pha 2e đóng (commit 684bcd1, 139 claim, 33 đơn vị, 7 nhóm)
- **Nguyên nhân:** ở Pha 2e, luật 3 bắt được một claim sai (`ten_don_vi` của Viện Hàn lâm ghi `verbatim` nhưng span chỉ có chữ "Viện"), **trong khi refinery vẫn exit 0**. Cổng SPAN_NOT_FOUND chỉ kiểm span nằm trong snapshot, không kiểm value nằm trong span.

## Vấn đề đúng như nó là

Luật 3 hiện chỉ là một đoạn script Chủ thầu gõ tay mỗi vòng. Nó bắt được lỗi thật vì vòng đó tôi nhớ chạy. **Một quy tắc phụ thuộc trí nhớ người vận hành thì không phải cổng, chỉ là thói quen tốt.**

Đây là quy tắc cốt lõi nhất của dự án: giá trị của toàn bộ registry nằm ở chỗ mọi khẳng định truy được về bằng chứng. Nếu `value` được phép nói nhiều hơn `evidence_span`, thì provenance chỉ còn là hình thức.

## Task

Viết `check_luat3.py` tại gốc mỗi repo có registry, chạy độc lập với refinery.

**Nội dung luật 3:** với claim khai `extraction: verbatim`, giá trị `value` phải là chuỗi con nguyên văn của `evidence_span`, sau chuẩn hoá NFC và giải HTML entity (giống hệt cách refinery chuẩn hoá).

Yêu cầu:

1. Chạy được trên **cả hai schema** đang tồn tại: schema lồng `capture.snapshot` (CNCLData, CaoLocMatch) và schema phẳng `snapshot` (Dataset_CongNgheChienLuoc).
2. Nhận đường dẫn domain hoặc file claims làm tham số, không hardcode.
3. Exit 0 nếu sạch, **exit 2** nếu có vi phạm, in rõ entity, field, và phần value bị thừa ra ngoài span.
4. Với claim `extraction: normalized` hoặc `inferred`: **không áp luật 3**, nhưng **bắt buộc phải có trường `note`**. Chuẩn hoá mà không giải thích thì không kiểm được, và đó chính là khe hở đã dùng để sửa lỗi ở Pha 2e. Thiếu note thì exit 2.
5. In thống kê: tổng claim, số verbatim, số normalized, số inferred.

## Acceptance Criteria

```gherkin
Scenario: Cong bat duoc dung loi da tung xay ra
  Given claim ten_don_vi cua Vien Han lam o dang cu (verbatim, span chi co "Vien")
  When chay check_luat3.py
  Then exit 2 va in dich danh entity va field do

Scenario: Registry hien tai sach
  When chay tren ca ba registry o trang thai hien tai
  Then ca ba exit 0

Scenario: Normalized thieu note bi chan
  Given mot claim normalized khong co truong note
  Then exit 2 va in dich danh claim do

Scenario: Chay duoc tren ca hai schema
  Then chay duoc tren CNCLData (schema long) va Dataset_CongNgheChienLuoc (schema phang)
  And khong can sua claim nao de chay duoc

Scenario: Doi chung duong tinh
  Given mot claim verbatim bi sua value cho thua ra ngoai span
  Then exit 2, va sau khi hoan nguyen thi exit 0
```

## Constraints

- Không sửa `methodbox/`.
- Không sửa claim để làm cổng xanh. Nếu cổng bắt lỗi thật thì sửa claim, ghi rõ trong báo cáo.
- Thử trên bản sao trước khi chạy trên registry thật.
- Đọc exit code trần. Em-dash vẫn cấm.
