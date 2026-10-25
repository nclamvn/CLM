# TIP-CNCL-2C · Refinery nhóm 3 (robot và tự động hoá) và nhóm 2 (mạng di động thế hệ sau)

## Header

- **ID:** TIP-CNCL-2C
- **Dependencies:** Pha 2b đã đóng (commit e7228d6, digest 13ad097eabafa8f6)
- **Priority:** P0 của Tuần 1 kế hoạch 08_KE_HOACH_PILOT
- **Vai:** Chủ thầu phát TIP, Thợ thi công, cùng một người luân phiên (Lâm uỷ quyền)
- **Cỡ task:** vừa. Rút gọn SCAN và RRI (đã có Pha 1, 2a, 2b làm nền), chạy TIP -> BUILD -> VERIFY. Lý do rút gọn ghi ở Decisions Log mục 7.

## Context

- **Working dir:** `/Users/os/CNCLData` (bash sandbox: `/sessions/exciting-busy-clarke/mnt/CNCLData`)
- **Domain:** `domains/don_vi_cncl` (81 claim, 19 đơn vị, 11 snapshot, 3 nhóm)
- **Engine:** `methodbox/refinery.py`, `methodbox/bites.py` (bản sao nguyên văn Refinery MethodBox, KHÔNG sửa)
- **Khuôn tham chiếu:** COMPLETION_REPORT_PHA2B.md (cách xử tier A trước, tách pháp nhân, honest-null)
- **Danh mục pháp lý:** QĐ 21/2026/QĐ-TTg. Nhóm 3 = Công nghệ robot và tự động hóa. Nhóm 2 = Công nghệ mạng di động thế hệ sau.

## Task

Nạp thêm đơn vị Việt Nam có năng lực thuộc nhóm 3 và nhóm 2 vào registry, theo đúng kỷ luật Refinery.

Trình tự bắt buộc từng nhóm:

1. Cào nguồn **tier A trước** (mst.gov.vn, baochinhphu.vn, chinhphu.vn), sau đó mới bổ sung tier B (báo lớn, báo chuyên ngành).
2. Mỗi nguồn tạo một snapshot riêng trong `domains/don_vi_cncl/snapshots/`, đặt tên `<nguồn>_<chủ đề>_<ngày>.html`, header ghi URL, ngày đăng, ngày chụp, tier.
3. Mỗi claim phải có `evidence_span` là **chuỗi con nguyên văn** của snapshot nó trỏ tới.
4. Đơn vị đã có mặt ở nhóm khác thì **KHÔNG thêm `nhom_cncl` thứ hai** (giữ trường đơn trị theo quyết định Lâm 16/08). Chỉ tách khi nguồn gọi đích danh một pháp nhân hoặc cơ sở riêng; khi tách phải khai vào `ambiguous_clusters`.
5. Bằng chứng chỉ nêu hợp tác, ý định, hoặc thương vụ mua bán mà không chứng minh năng lực thì **loại có kỷ luật**, ghi vào báo cáo (tiền lệ D7 với CMC và Geleximco).
6. Con số là kế hoạch hoặc dự kiến thì ghi rõ trong `note`, cấm đọc thành đã hoàn thành.
7. Mâu thuẫn giữa hai nguồn thì **giữ nguyên cả hai**, ghi vào `note`, không tự phân xử.

## Acceptance Criteria

```gherkin
Scenario: Cổng máy xanh và tái lập
  When chạy refinery, bites, check_dash trên domain
  Then cả ba lệnh exit 0, đọc trần không pipe
  And build digest in ra và chạy lại lần hai ra cùng digest

Scenario: Span nguyên văn
  Given mỗi claim mới
  Then evidence_span là chuỗi con của đúng snapshot khai trong capture
  And refinery không cắn SPAN_NOT_FOUND

Scenario: Không tạo tranh chấp giả
  Given một đơn vị đã có nhom_cncl trong registry
  Then không có claim mới nào gán nhom_cncl khác cho cùng entity
  And không ô nào chuyển sang trạng thái disputed sau khi nạp

Scenario: Tier A dẫn đường
  Then mỗi nhóm mới có ít nhất 1 claim tier A
  And tỷ lệ tier A toàn registry không giảm dưới 20%

Scenario: Trung thực về cái chưa đạt
  Then Completion Report liệt kê đủ đơn vị bị loại, ô honest-null, và mâu thuẫn nguồn
  And universe estimate được cập nhật kèm cơ sở, hoặc ghi rõ vì sao chưa cập nhật được
```

## Constraints

- KHÔNG sửa `methodbox/` (bản sao nguyên văn SOT phương pháp).
- KHÔNG sửa claim đã có của Pha 1, 2a, 2b. Chỉ thêm dòng mới.
- KHÔNG pipe lệnh gate trong chuỗi ăn quyết định; đọc exit code trần.
- Backup `claims.jsonl` trước khi ghi.
- Em-dash U+2014 vẫn cấm. En-dash U+2013 được phép (quyết định Lâm 16/08).
- Target chỉ báo: mỗi nhóm 3 đến 6 đơn vị. **Không ép số**: nguồn mỏng thì honest-null và báo số thật.

## Escalation

- L1 (Thợ tự quyết, ghi DEVIATIONS): chọn nguồn nào trong danh sách, đặt tên snapshot, chọn câu nào làm span.
- L2 (Thợ báo Chủ thầu): một đơn vị vừa hợp lệ nhóm mới vừa đã đứng ở nhóm cũ và nguồn không tách pháp nhân.
- L3 (Chủ thầu báo Lâm): phải đổi schema, đổi luật gate, hoặc phải nới định nghĩa domain.
