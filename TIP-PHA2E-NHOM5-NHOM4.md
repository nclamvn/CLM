# TIP-CNCL-2E · Refinery nhóm 5 (năng lượng, vật liệu tiên tiến) và nhóm 4 (sinh học, y sinh tiên tiến)

## Header

- **ID:** TIP-CNCL-2E
- **Dependencies:** Pha 2d đóng (commit 43d9fca, 101 claim, 24 đơn vị, 5 nhóm, tier A 28,7%)
- **Bối cảnh:** ba vòng thử rule liên tiếp kết luận phần còn lại là ngữ nghĩa chứ không phải từ vựng. Đòn bẩy thật nay là bề dày dữ liệu.

## Context

- **Working dir:** `/Users/os/CNCLData`
- **Domain:** `domains/don_vi_cncl`
- **Khuôn:** COMPLETION_REPORT_PHA2C.md (tier A trước, tách pháp nhân, honest-null, loại có kỷ luật)
- **Định nghĩa domain:** `scope_note` trong `domain.yaml` phân biệt làm chủ công nghệ và vận hành dịch vụ. Áp cho mọi ca mới.

## Task

Nạp đơn vị Việt Nam có năng lực thuộc nhóm 5 và nhóm 4, đúng trình tự đã dùng ở 2b và 2c: tier A trước, tier B bổ sung, mỗi nguồn một snapshot, mỗi claim một span nguyên văn.

## Ba điều SIẾT so với vòng 2c

Ba vòng vừa rồi để lại ba bài học, nay thành ràng buộc:

**1. Thợ không được đề xuất phương án chưa chạy thử.** Ở 2c và ở 3E, đề xuất nghe hợp lý của Thợ đều bị dữ liệu bác khi Chủ thầu chạy thử. Từ nay mục SUGGESTIONS phải ghi rõ đã thử hay chưa; chưa thử thì gọi là "hướng cần thử", không gọi là đề xuất.

**2. Báo cáo phải nêu con số làm bức tranh xấu đi, không chỉ con số đẹp.** Ở 3E, Thợ không nêu rằng ba trên bốn match thực chất chạy nhánh lùi. Số đó có trong rationale nhưng không lên báo cáo, và nó đổi hẳn cách hiểu kết quả.

**3. Dùng lại tiến trình phụ để cào là được, nhưng span phải kiểm bằng mắt trước khi dựng claim.** Cổng chỉ chứng minh span khớp snapshot, không chứng minh snapshot khớp nguồn.

## Acceptance Criteria

```gherkin
Scenario: Cổng máy xanh và tái lập
  When chay refinery, bites, check_dash
  Then ca ba exit 0, doc tran khong pipe
  And chay lai refinery ra dung digest cu

Scenario: Span nguyen van
  Then moi claim moi co evidence_span la chuoi con cua dung snapshot khai trong capture
  And refinery khong can SPAN_NOT_FOUND

Scenario: Khong tao tranh chap gia
  Then khong entity nao co hai gia tri nhom_cncl
  And 0 o disputed sau khi nap

Scenario: Tier A dan duong
  Then moi nhom moi co it nhat 1 claim tier A
  And ty le tier A toan registry khong giam duoi 25 phan tram

Scenario: Ap dung scope_note
  Then don vi chi VAN HANH dich vu bi loai, ghi ro trong bao cao kem dan chieu scope_note

Scenario: Trung thuc ve cai chua dat
  Then bao cao liet ke du don vi bi loai, o honest-null, mau thuan nguon
  And neu ro con so nao lam buc tranh xau di
```

## Constraints

- KHÔNG sửa `methodbox/`, KHÔNG sửa claim cũ. Chỉ thêm dòng mới.
- Đơn vị đã đứng ở nhóm khác thì dùng trường phụ `nhom_cncl_phu_<N>`, không thêm `nhom_cncl` thứ hai.
- Bằng chứng chỉ nêu ý định, hợp tác, hoặc thương vụ thì loại có kỷ luật.
- Con số kế hoạch phải ghi rõ trong `note`, cấm đọc thành đã hoàn thành.
- Mâu thuẫn nguồn thì giữ cả hai, không tự phân xử.
- Backup `claims.jsonl` trước khi ghi. Đọc exit code trần. Em-dash vẫn cấm, en-dash được phép.
- Target chỉ báo: mỗi nhóm 3 đến 6 đơn vị. **Không ép số.**
