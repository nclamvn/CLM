# TIP-CNCL-2D · Trường phụ nhóm, backfill bằng chứng đang treo, cổng đối chứng nguồn

## Header

- **ID:** TIP-CNCL-2D
- **Dependencies:** Pha 2c đóng (commit 79c1583, digest 5df7f4d9312c2abf, VERIFY READY)
- **Priority:** P0. Gỡ nút thắt đã lặp 3 lần, và bịt lỗ hổng phương pháp Thợ tự khai ở 2c.
- **Nguồn quyết định:** Lâm duyệt trường phụ (16/08). Chủ thầu duyệt mục B và C từ SUGGESTIONS của Thợ.

## Context

- **Working dir:** `/Users/os/CNCLData` (sandbox: `/sessions/exciting-busy-clarke/mnt/CNCLData`)
- **Domain:** `domains/don_vi_cncl` (99 claim, 24 đơn vị, 15 snapshot, 5 nhóm, tier A 27.3%)
- **Ràng buộc engine đã kiểm bằng đọc code** (`methodbox/refinery.py` dòng 271 và 278): ô được dựng theo cặp (entity, field); nếu tập giá trị phân biệt của một ô lớn hơn 1 thì ô thành `disputed`. Đây là lý do trường phụ **không được** gom nhiều nhóm vào một ô.

## Task A · Thêm trường phụ theo nhóm

Thêm vào `schema.fields` của `domain.yaml` các trường dạng `nhom_cncl_phu_<N>` với N là số nhóm theo QĐ 21/2026. Chỉ thêm trường nào thật sự có bằng chứng, không mở sẵn cả 10.

Quy ước bắt buộc, ghi thành comment ngay trong `domain.yaml`:

- Mỗi nhóm phụ là **một trường riêng**, giá trị luôn là chính số nhóm đó (ví dụ trường `nhom_cncl_phu_6` chỉ nhận giá trị `"6"`). Nhờ vậy ô luôn đơn trị, không bao giờ tranh chấp giả, và hai nguồn độc lập cùng khẳng định sẽ cho `corroborated` đúng nghĩa.
- `rollup_field` **giữ nguyên** là `nhom_cncl`. Trường phụ **không tham gia** thống kê phân bố nhóm, đúng cam kết với Lâm.
- Trường phụ chỉ dùng khi nguồn **không** gọi đích danh một pháp nhân con. Nếu nguồn có gọi tên pháp nhân riêng thì vẫn ưu tiên tách pháp nhân như quyết định 16/08.

## Task B · Backfill bằng chứng đang treo

Nạp lại hai bằng chứng đã bị chặn ở các vòng trước, dùng **snapshot đã có sẵn**, không cào thêm:

1. **Tập đoàn Viettel, nhóm 6 (chip bán dẫn).** Bằng chứng tier A đã nằm trong `mst_fpt_nhamay_20260128.html`.
2. **VNPT, nhóm 3 (robot và tự động hoá).** Bằng chứng tier A đã nằm trong `mst_robot_makeinvn_20251230.html`.

Trường hợp thứ ba (Viettel 5G, nhóm 2) **chưa có snapshot trên đĩa**, không được nạp trong vòng này. Ghi vào báo cáo là việc còn nợ, không lấp bằng trí nhớ.

## Task C · Cổng đối chứng snapshot với nguồn

Viết `check_snapshot_fidelity.py` tại gốc repo. Cổng này bịt lỗ hổng Thợ tự khai ở 2c: cổng cũ chỉ chứng minh span khớp snapshot, không chứng minh snapshot khớp trang gốc.

Yêu cầu:

- Đọc mọi snapshot trong domain, lấy URL từ dòng header.
- Với mẫu chỉ định (mặc định toàn bộ, có tuỳ chọn `--sample N`), fetch lại trang gốc và kiểm từng câu trích trong snapshot có còn là chuỗi con của trang gốc không.
- Chuẩn hoá NFC và giải HTML entity trước khi so, đúng như refinery.
- Exit 0 nếu mọi câu còn khớp. Exit 2 nếu có câu không tìm thấy, in rõ snapshot nào câu nào.
- **Phân biệt hai loại thất bại**: `SOURCE_CHANGED` (trang còn sống nhưng câu biến mất) và `SOURCE_UNREACHABLE` (không fetch được). Loại thứ hai không được tính là gian lận, chỉ cảnh báo.
- Trong môi trường sandbox không có quyền mạng trực tiếp, cổng phải **fail-loud là không chạy được**, tuyệt đối không in OK.

## Task D · Định nghĩa ranh giới năng lực

Thêm vào `domain.yaml` một khối `scope_note` định nghĩa rõ đơn vị thế nào thì đủ điều kiện vào registry, tối thiểu phân biệt:

- **Làm chủ công nghệ** (thiết kế, chế tạo, sản xuất, nghiên cứu lõi): đủ điều kiện.
- **Vận hành và khai thác dịch vụ** trên công nghệ do người khác làm ra: **không** đủ điều kiện cho domain này, ghi honest-null kèm lý do.
- Áp định nghĩa vào MobiFone đang treo ở hàng đợi từ 2c, kết luận nạp hay không nạp.

## Acceptance Criteria

```gherkin
Scenario: Trường phụ không gây tranh chấp và không đụng rollup
  When nạp trường phụ cho một đơn vị đã có nhom_cncl
  Then refinery exit 0
  And 0 ô disputed trong toàn registry
  And phân bố rollup theo nhom_cncl không đổi so với Pha 2c

Scenario: Backfill có bằng chứng thật
  Given hai claim backfill của Task B
  Then mỗi claim có evidence_span là chuỗi con của snapshot đã có sẵn trên đĩa
  And refinery không cắn SPAN_NOT_FOUND

Scenario: Cổng đối chứng tự chứng minh nó cắn
  When chạy check_snapshot_fidelity.py với một snapshot bị sửa cố ý một câu
  Then exit 2 và in đúng tên snapshot cùng câu bị lệch
  And khi hoàn nguyên thì exit trở lại 0 hoặc báo SOURCE_UNREACHABLE rõ ràng

Scenario: Ranh giới năng lực áp được vào ca thật
  Then domain.yaml có scope_note phân biệt làm chủ công nghệ và vận hành dịch vụ
  And báo cáo kết luận rõ MobiFone nạp hay không nạp, kèm lý do dẫn chiếu scope_note
```

## Constraints

- KHÔNG sửa `methodbox/`.
- KHÔNG sửa claim cũ. Backfill là thêm dòng mới.
- Đọc exit code trần, không pipe.
- Backup `claims.jsonl` trước khi ghi.
- Em-dash vẫn cấm, en-dash được phép.
- Nếu cổng Task C không chạy được trong sandbox thì **nói thẳng là chưa chạy được**, không được ghi PASS.
