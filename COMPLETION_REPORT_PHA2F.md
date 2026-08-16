# Completion + VERIFY · TIP-CNCL-2F · Ba nhóm cuối và nền sản phẩm

Ngày: 16/08/2026.

## STATUS

**DONE. Registry phủ đủ 10/10 nhóm công nghệ chiến lược.** Nền sản phẩm từ 36% lên 95%.

## Số thật

| Mốc | Claim | Đơn vị | Nhóm | Tier A | Có sản phẩm |
|---|---|---|---|---|---|
| Pha 2e | 139 | 33 | 7 | 33,8% | 36% |
| **Pha 2f** | **200** | **42** | **10/10** | **37,5%** | **95%** |

Phân bố: nhóm 1 = 7, nhóm 2 = 1, nhóm 3 = 4, nhóm 4 = 5, nhóm 5 = 4, nhóm 6 = 4, **nhóm 7 = 4**, **nhóm 8 = 3**, nhóm 9 = 7, **nhóm 10 = 2**, chưa rõ = 1. Coverage chỉ báo 44,2%.

Digest `0ff89212ddecb23f`. Refinery, bites, check_luat3, check_dash đều exit 0. 0 ô tranh chấp.

## Phần A · chín đơn vị mới

**Nhóm 7:** Công ty An ninh mạng Viettel (A), Viện Khoa học-Công nghệ mật mã (B), MK Smart (B), NCS (B).
**Nhóm 8:** Viện Công nghệ xạ hiếm (A), Công ty TNHH Luyện kim Trần Hồng Quân (A), PTSC (B).
**Nhóm 10:** FECON (B), Liên danh tư vấn TEDI - TRICC - TEDI SOUTH (A).

Ca đáng chú ý: **MK Smart** có chứng chỉ Common Criteria EAL 5+ kèm số quyết định BOE-A-2026-1037. Đây là bằng chứng định danh được bằng số hiệu quốc tế, loại bằng chứng chắc nhất từ trước tới nay ngoài máy biến áp 500kV của Đông Anh.

## Phần B · nền sản phẩm

28 claim `san_pham_lien_quan` mới, **suy từ chính span đã qua cổng, không cào thêm nguồn**. Mỗi claim là `normalized` kèm note nêu rõ chữ nào trong span dẫn tới mã sản phẩm nào.

Vì sao việc này đáng làm: nhóm là đơn vị phân loại thô. Nhóm 5 gộp cả vật liệu, pin, hydro, thiết bị điện, và chính sự thô đó cho phép cặp rác Viện Hàn lâm với thiết bị điện cao áp tồn tại. Neo cấp sản phẩm là chỗ duy nhất còn siết được mà **không đụng vào chuỗi ký tự**, tức không lặp lại bốn vòng thất bại vừa qua.

**Hai đơn vị để honest-null có chủ đích:**

- **Viện Hàn lâm Khoa học và Công nghệ Việt Nam**: span phủ ba lĩnh vực cùng lúc (hydro, vật liệu nano, pin Li-ion). Gán một mã sản phẩm là chọn bừa một trong ba. Chính đơn vị này đã gây ra chùm match rác ở vòng trước; gán bừa sản phẩm sẽ làm chuyện đó tệ hơn chứ không tốt hơn.
- **Masan High-Tech Materials**: span nói cung cấp vonfram và fluorspar cho chuỗi chip toàn cầu. Không rõ thuộc SP25 khoáng sản hay SP17 vật liệu. Đơn vị này vốn đã để trống `nhom_cncl` từ Pha 2a vì cùng lý do.

Thà 40 đơn vị có sản phẩm đúng còn hơn 42 đơn vị có sản phẩm đoán.

## Điều làm bức tranh xấu đi

**1. Nhóm 10 mỏng nhất và lệch phạm vi.** Chỉ 2 đơn vị, và **cả hai đều thuộc mảng "công trình" chứ không phải "hệ thống và thiết bị"**. FECON vận hành máy đào hầm do nước ngoài chế tạo. TEDI làm hồ sơ nghiên cứu tiền khả thi. Nửa sau phạm vi nhóm 10, tức thiết bị đường sắt do đơn vị Việt Nam chế tạo, là **ô trống thật** tính tới 08/2026.

**2. Nhóm 8 mất một đơn vị vì không có snapshot.** Công ty Nhôm Đắk Nông-TKV có bằng chứng tier B hợp lệ nhưng tôi không tạo snapshot cho nó trong vòng này, nên không nạp. Đây là thiếu sót thi công, không phải thiếu bằng chứng.

**3. Nguồn cũ.** Công ty An ninh mạng Viettel dùng bài 2019, FECON dùng bài 2024, TEDI dùng bài 2024. Đều vượt `refresh_days` 180, đã ghi note.

**4. Viện Công nghệ xạ hiếm: chính nguồn tự giới hạn.** Bài nói rõ làm chủ quy trình "ở quy mô phòng thí nghiệm và pilot", "sẵn sàng chuyển giao khi có đầu tư đúng mức". Không được đọc thành dây chuyền công nghiệp. Đã ghi vào note.

## Loại có kỷ luật

- **THACO** (đường sắt): hợp đồng chuyển giao công nghệ và 156 bộ linh kiện CKD để lắp ráp, chưa có toa xe nào ra khỏi dây chuyền Việt Nam. Kế hoạch.
- **Hòa Phát** (ray đường sắt): khởi công 12/2025, thanh ray đầu tiên dự kiến 2027, tới 08/2026 mới xong hơn 50% xây dựng. Kế hoạch.
- **Viện Công nghệ lượng tử ĐHQGHN**: chính nguồn nói làm chủ qubit siêu dẫn là "công nghệ lõi mà Viện đang hướng tới làm chủ trong tương lai". Không được viết thành đã làm chủ.
- **Bkav, CMC Cyber Security, VNCS, VSEC**: chỉ có nguồn tự công bố hoặc trang xếp hạng thương mại, không đạt tier.
- **PV Shipyard, Vietsovpetro** (giàn khoan Tam Đảo 05): phù hợp nhóm 8 nhưng nguồn nằm ngoài tier A và B.

## Còn nợ

1. Hai đơn vị honest-null về sản phẩm, chờ bằng chứng rõ hơn.
2. Nhôm Đắk Nông-TKV: thiếu snapshot, nạp được ngay khi có.
3. Cổng đối chứng snapshot với nguồn vẫn chưa chạy lần nào (nay 31 snapshot).
4. Rebuild domain dẫn xuất và xử lý match mới phát sinh từ 9 đơn vị này.
5. Quyết định nới tier cho Dabaco và Bkav.

## Lệnh tái lập

```
cd /Users/os/CNCLData
python3 methodbox/refinery.py domains/don_vi_cncl ; echo $?
python3 methodbox/bites.py domains/don_vi_cncl    ; echo $?
python3 check_luat3.py domains/don_vi_cncl        ; echo $?
python3 check_dash.py                              ; echo $?
```
