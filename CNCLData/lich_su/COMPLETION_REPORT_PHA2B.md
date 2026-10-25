# Completion Report · Pha 2b · nhóm 6 tier A + nới cổng dash · domain `don_vi_cncl`

Ngày: 16/08/2026. Workspace: `/Users/os/CNCLData`. Vai: Chủ thầu kiêm Thợ. Căn cứ: ba quyết định của Lâm ngày 16/08 (mục 1).

## 1. Ba quyết định của Lâm và cách thi hành

| Quyết định | Thi hành |
|---|---|
| Giữ trường đơn trị, tách pháp nhân | Không đụng schema. Đơn vị mới tách theo pháp nhân hoặc cơ sở có tên riêng trong nguồn, khai vào `ambiguous_clusters` để cấm tự gộp. |
| Chỉ cấm em-dash, en-dash được phép | `check_dash.py` bỏ U+2013 khỏi danh sách cấm, giữ U+2014. Kiểm hai chiều: file chứa em-dash vẫn bị bắt (exit 1), file chứa en-dash không bị bắt (exit 0). |
| Nhóm 6 cần nguồn tier A | Cào mst.gov.vn 2 bài (phiên họp Ban Chỉ đạo 10/03/2026, lễ công bố nhà máy FPT 28/01/2026), thêm 17 claim tier A vào registry. |

## 2. Cổng + exit code (đọc trần, không pipe)

| Cổng | Exit |
|---|---|
| `python3 methodbox/refinery.py domains/don_vi_cncl` | 0 · VALIDATION PASSED · 0 gate bites |
| `python3 methodbox/bites.py domains/don_vi_cncl` | 0 · TẤT CẢ RĂNG CẮN |
| `python3 check_dash.py` | 0 · 0 em-dash |
| Kiểm chứng cổng dash vẫn cắn (probe em-dash) | 1 · bắt đúng 1 dấu, sau đó xoá file probe |
| Kiểm chứng en-dash không bị cắn (probe en-dash) | 0 |

Build digest: `13ad097eabafa8f6` · idempotent OK · auditor OK.

## 3. Số thật

| Mốc | Claim | Đơn vị | Snapshot | Nhóm | Tier A |
|---|---|---|---|---|---|
| Pha 1 (19/07) | 64 | 14 | 7 | 2 | 12 (18.8%) |
| Pha 2a (16/08 sáng) | 73 | 17 | 9 | 3 | 12 (16.4%) |
| **Pha 2b (16/08 chiều)** | **81** | **19** | **11** | **3** | **17 (21.0%)** |

Phân bố nhóm: 1 = 7, 6 = 4, 9 = 7, chưa rõ = 1. Coverage chỉ báo 20.0% trên universe 95.

Đơn vị mới Pha 2b: Nhà máy Kiểm thử và Đóng gói tiên tiến chip bán dẫn FPT (5 claim, toàn bộ tier A), VSAP LAB (3 claim tier B).

## 4. Mẫu số được nâng cấp bằng nguồn tier A

Pha 1 để lại nợ D5: universe = 80 là placeholder. Nay nhóm 6 có cơ sở thật, trích nguyên văn mst.gov.vn 28/01/2026:

"Thống kê vào tháng 8/2025, Việt Nam có gần 60 doanh nghiệp trong lĩnh vực bán dẫn, trong đó 50 doanh nghiệp thiết kế chip, 7 doanh nghiệp đóng gói và kiểm thử, tuy nhiên phần lớn đều là các doanh nghiệp nước ngoài"

Domain này chỉ tính đơn vị Việt Nam, nên phần Việt của nhóm 6 nhỏ hơn 60 nhiều. Ước ~15 đơn vị Việt, universe tổng nâng 80 lên 95. **Vẫn là ước lượng**: nguồn không tách số doanh nghiệp Việt. Coverage tiếp tục ghi nhãn chỉ báo.

## 5. Ghi nhận trung thực, không lấp

- **Mâu thuẫn nguồn về VSAP LAB, giữ nguyên không phân xử.** mst.gov.vn xếp VSAP LAB vào nhóm "đối tác quốc tế" của FPT; nhandan.vn mô tả là lab-fab đầu tiên tại Việt Nam. Đã ghi vào `note` của claim để người đọc thấy cả hai.
- **Nhà máy FPT: con số 1.600 m2 và 6 dây chuyền là công bố kế hoạch giai đoạn 1 tại lễ thành lập 28/01/2026**, không phải năng lực đã vận hành. Ghi trong `note`, cấm đọc thành đã chạy.
- **Tier A cho CT Group khởi công nhà máy đóng gói kiểm thử (04/2025) chưa nạp được.** Span của mst gọi tên "CT Group" (đã ở nhóm 9), trong khi entity nhóm 6 của registry là "CT Semiconductor". Gán chéo là suy diễn. Chờ nguồn gọi đích danh CT Semiconductor.
- **Viettel khởi công nhà máy chế tạo chip (tier A) chưa nạp được**, cùng lý do: Tập đoàn Viettel đã ở nhóm 1, chưa có tên pháp nhân riêng cho mảng bán dẫn trong nguồn. Đây là hệ quả trực tiếp của quyết định giữ đơn trị, ghi nhận công khai chứ không giấu.
- **0 ô corroborated mới.** Corroboration yêu cầu hai nguồn độc lập cùng một giá trị cho cùng một ô; các claim tier A mới thuộc đơn vị mới nên chưa có cặp. Sẽ đạt tự nhiên khi nhóm 6 dày lên.

## 6. Móc nối CUNG và CẦU đáng chú ý (chưa nạp, để dành cho bước match)

mst.gov.vn 28/01/2026, nguyên văn: FPT và Viettel hợp tác phát triển "dòng chip SoC AI on Edge trên tiến trình 28-32 nm cho hệ sinh thái thiết bị camera, drone, thiết bị bay không người lái (UAV)". Đây là cầu nối trực tiếp giữa nhóm 6 (chip) và nhóm 9 (UAV, sản phẩm 22 của QĐ 21/2026), tức là một cạnh match tiềm năng có bằng chứng tier A. Giữ trong snapshot, chưa dựng thành match vì engine chưa chạy trên domain này.

## 7. Lệnh tái lập

```
cd /Users/os/CNCLData
python3 methodbox/refinery.py domains/don_vi_cncl ; echo $?
python3 methodbox/bites.py domains/don_vi_cncl    ; echo $?
python3 check_dash.py                              ; echo $?
```

## 8. Việc kế tiếp

Nhóm 3 (robot và tự động hoá) rồi nhóm 2 (mạng di động thế hệ sau), theo đúng khuôn Pha 2b: tier A trước, tier B bổ sung, tách pháp nhân khi đơn vị đã có mặt ở nhóm khác.
