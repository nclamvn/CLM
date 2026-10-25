# Completion Report · TIP-CNCL-2C · nhóm 3 (robot và tự động hoá) và nhóm 2 (mạng di động thế hệ sau)

Ngày: 16/08/2026. Vai: Thợ. TIP: `TIP-PHA2C-NHOM3-NHOM2.md`.

## STATUS

**PARTIAL.** Nhóm 3 đạt target (4 đơn vị, có tier A). Nhóm 2 KHÔNG đạt target (1 đơn vị), lý do nguồn thật sự mỏng, không ép số. Chi tiết mục ISSUES.

## FILES CHANGED

Tạo mới:
- `domains/don_vi_cncl/snapshots/mst_robot_makeinvn_20251230.html` (tier A)
- `domains/don_vi_cncl/snapshots/mst_vnpttech_5g_20220831.html` (tier A)
- `domains/don_vi_cncl/snapshots/vjst_rostek_agv_20220103.html` (tier B)
- `domains/don_vi_cncl/snapshots/tuoitre_vinmotion_20250606.html` (tier B)

Sửa:
- `domains/don_vi_cncl/claims.jsonl`: 81 dòng lên 99 dòng (chỉ thêm, không sửa dòng cũ)
- `domains/don_vi_cncl/domain.yaml`: thêm cụm ambiguous ["VNPT", "VNPT Technology"]

Backup trước khi ghi: `/tmp/claims_backup_pha2b.jsonl`.

## TEST RESULTS (theo Acceptance Criteria của TIP)

| Scenario | Kết quả |
|---|---|
| Cổng máy xanh và tái lập | PASS. refinery exit 0, bites exit 0, check_dash exit 0. Chạy lại refinery lần hai ra cùng digest `5df7f4d9312c2abf`, idempotent OK, auditor OK. |
| Span nguyên văn | PASS. 0 lần cắn SPAN_NOT_FOUND trên 18 claim mới. |
| Không tạo tranh chấp giả | PASS. 0 ô disputed sau khi nạp. |
| Tier A dẫn đường | PASS. Nhóm 3 có 6 claim tier A, nhóm 2 có 4 claim tier A. Tỷ lệ tier A toàn registry tăng 21.0% lên **27.3%**, trên ngưỡng 20%. |
| Trung thực về cái chưa đạt | PASS. Mục ISSUES và DEVIATIONS dưới đây. |

## Số thật

| Mốc | Claim | Đơn vị | Snapshot | Nhóm | Tier A |
|---|---|---|---|---|---|
| Pha 2b | 81 | 19 | 11 | 3 | 17 (21.0%) |
| **Pha 2c** | **99** | **24** | **15** | **5** | **27 (27.3%)** |

Phân bố: nhóm 1 = 7, nhóm 2 = 1, nhóm 3 = 4, nhóm 6 = 4, nhóm 9 = 7, chưa rõ = 1. Coverage chỉ báo 25.3% trên universe 95 (chưa cập nhật universe, xem ISSUES).

Đơn vị mới: Tập đoàn MISA (A), Công ty cổ phần Health Care Center (A), ROSTEK (B), Công ty cổ phần VinMotion (B), VNPT Technology (A).

## ISSUES

**1. Nhóm 2 chỉ nạp được 1 đơn vị (severity: trung bình, không chặn).**

Nguồn tier A nói về 5G rất nhiều nhưng **cố tình viết phiếm chỉ**: các bài gần nhất dùng cụm "khoảng 2.500 trạm do doanh nghiệp Việt Nam sản xuất" mà không gọi tên đơn vị nào. Không thể quy con số cho một pháp nhân, nên không nạp được. Toàn bộ thành tích 5G ở nguồn nhà nước quy về thương hiệu mẹ "Viettel", trong khi "Tập đoàn Viettel" đã đứng ở nhóm 1 và chưa có nguồn nào gọi đích danh pháp nhân con làm 5G. Đây tiếp tục là cái giá của quyết định giữ trường đơn trị, giống hệt trường hợp nhà máy chip Viettel ở Pha 2b.

**2. Bằng chứng nhóm 2 duy nhất đã cũ 4 năm (severity: trung bình).**

Bài mst.gov.vn về VNPT Technology đăng 31/08/2022, vượt xa `refresh_days: 180`. Bài không nêu tên model 5G cụ thể nào, mức độ chỉ là "đang phát triển các sản phẩm cho mạng 5G". Đã ghi vào `note` của claim. Sản phẩm được gọi tên cụ thể trong bài đều thuộc 3G/4G và Wifi 4/5/6, tôi giữ tách bạch, không gộp vào bằng chứng 5G.

**3. Chưa có đơn vị Việt Nam nào có bằng chứng năng lực 6G (severity: thấp, là phát hiện chứ không phải lỗi).**

Mọi nguồn tìm được về 6G đều ở mức ý định, kế hoạch, hội thảo hoặc ban chỉ đạo. Ghi lại làm honest-null cho toàn nhóm 2 ở phần 6G.

**4. Universe estimate chưa cập nhật (severity: thấp).**

Chưa tìm được con số mẫu số có cơ sở cho nhóm 3 và nhóm 2 giới hạn ở đơn vị Việt Nam. Giữ nguyên 95, coverage tiếp tục ghi nhãn chỉ báo. Không tự nâng mẫu số theo cảm tính.

## Loại có kỷ luật (không nạp, ghi lý do)

- **VNPT robot chatbot (tier A, cùng bài nhóm 3):** VNPT đã đứng ở nhóm 1 trong registry. Thêm `nhom_cncl = 3` sẽ tạo tranh chấp giả. Nguồn không tách pháp nhân riêng cho mảng robot. Không nạp.
- **VinRobotics:** nguồn chỉ là tin thành lập doanh nghiệp, mô tả ngành nghề đăng ký, chưa nêu sản phẩm nào. Đây là ý định chứ không phải năng lực. Tiền lệ D7 (CMC, Geleximco). Không nạp.
- **CT UAV robot nông nghiệp (tier A baochinhphu.vn):** nguyên văn là "Ở giai đoạn tiếp theo... sẽ tiếp tục đầu tư các robot nông nghiệp". Kế hoạch tương lai. Không nạp.
- **ELBOT:** nguồn mô tả một cá nhân sáng chế, không nêu pháp nhân doanh nghiệp, viện hay trường. Ngoài định nghĩa domain. Không nạp.
- **Cisco Việt Nam (phòng thí nghiệm 5G RON tại Hà Nội, tier A):** chủ thể là doanh nghiệp nước ngoài. Domain chỉ tính đơn vị Việt Nam. Không nạp.
- **PTIT và Trường Đại học Công nghệ Sài Gòn:** bằng chứng chỉ là phát biểu hội thảo hoặc vai trò phối hợp tổ chức, không có lab, đề tài hay công bố. Không nạp.
- **MobiFone:** có năng lực vận hành mạng 5G thương mại (5G SA và NSA) nhưng đó là khai thác dịch vụ, không phải năng lực công nghệ theo nghĩa của domain. Xếp hàng đợi, chờ quyết định ranh giới "vận hành" so với "làm chủ công nghệ".
- **Tổng Công ty Sản xuất thiết bị Viettel (VMC):** có tên pháp nhân riêng nhưng chưa tìm được câu trích tier A hoặc B đủ chặt về năng lực mạng di động. Không nạp.

## DEVIATIONS

1. **Thu thập bằng chứng qua tiến trình phụ.** Tôi dùng hai tiến trình phụ để quét nguồn và một tiến trình phụ để ghi snapshot từ nội dung fetch được, thay vì tự fetch từng trang. Lý do: dedup của web_fetch trong cùng phiên và giới hạn ngữ cảnh. Bù lại bằng ba lớp kiểm: (a) cổng SPAN_NOT_FOUND của refinery buộc mọi span phải là chuỗi con thật của snapshot; (b) tôi đọc lại toàn bộ câu trích trước khi dựng claim; (c) kích thước snapshot và header được kiểm bằng lệnh. **Điểm yếu còn lại phải nói thẳng: cổng chỉ chứng minh span khớp snapshot, KHÔNG chứng minh snapshot khớp trang gốc.** Vòng sau nếu Chủ thầu muốn siết thì cần một bước đối chứng snapshot với nguồn.
2. **Health Care Center dùng span là câu liền trước** (câu nêu "robot khám chữa bệnh và robot phát thuốc") cho trường `nhom_cncl`, vì câu chính bắt đầu bằng "Đây là sản phẩm" trỏ ngược. Ghi rõ trong `note`. Đây là quyết định L1, không đổi contract.
3. **Nhóm 2 dừng ở 1 đơn vị** thay vì target 3 đến 6. TIP cho phép ("không ép số"), nhưng tôi báo cáo như một sai lệch so với mục tiêu để Chủ thầu quyết có mở vòng cào riêng cho nhóm 2 hay không.

## SUGGESTIONS cho Chủ thầu

1. **Vấn đề pháp nhân mẹ và con đã xuất hiện 3 lần liên tiếp** (Viettel chip ở 2b, Viettel 5G và VNPT robot ở 2c). Không phải sự cố ngẫu nhiên mà là đặc tính của dữ liệu: báo chí Việt Nam gọi tên tập đoàn mẹ. Đề nghị Chủ thầu đưa lên Lâm một lựa chọn hẹp hơn lần trước: thêm trường phụ `nhom_cncl_phu` dạng danh sách, chỉ để ghi nhận, không tham gia rollup. Giữ được đơn trị cho trường chính mà không mất bằng chứng.
2. **Ranh giới "vận hành" so với "làm chủ công nghệ"** cần một câu định nghĩa trong `domain.yaml`. Hiện MobiFone bị treo vì thiếu câu này.
3. Nguồn tier A đích danh doanh nghiệp robot Việt Nam rất mỏng: chỉ tìm được 1 bài mst.gov.vn. Nếu muốn dày nhóm 3 thì phải chấp nhận tier B nhiều hơn, hoặc tìm nguồn dạng danh sách giải thưởng Make in Viet Nam.

## Lệnh tái lập

```
cd /Users/os/CNCLData
python3 methodbox/refinery.py domains/don_vi_cncl ; echo $?
python3 methodbox/bites.py domains/don_vi_cncl    ; echo $?
python3 check_dash.py                              ; echo $?
```
