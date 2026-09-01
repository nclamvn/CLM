# Completion + VERIFY · TIP-CNCL-3G · Tách năng lực ghép

Ngày: 16/08/2026.

## STATUS

**FAILED. G3 và G4 đều trượt, và trượt theo cách xấu nhất có thể.**

Công bố nguyên trạng theo cam kết trong TIP. Không nắn tiêu chí.

## Bảng tiêu chí

| Mã | Nội dung | Kết quả |
|---|---|---|
| **G1** | Đông Anh với P20 vẫn còn | **ĐẠT** |
| **G2** | Bảy cặp không liên quan Viện Hàn lâm còn đủ | **ĐẠT** |
| **G3** | Viện Hàn lâm với P20 (thiết bị điện) biến mất | **TRƯỢT.** Vẫn còn, thậm chí hai lần. |
| **G4** | Viện Hàn lâm với P18 (pin) vẫn còn | **TRƯỢT.** Biến mất. |
| **G5** | Cổng tự chứng minh nó cắn | **ĐẠT.** Cắm mảnh bịa, exit 2, `PART_NOT_VERBATIM`, không ghi gì. |
| **G6** | `restore-signoff` xử lý đúng | **ĐẠT.** Gắn lại 9/11, hai cặp đổi nội dung báo cần ký lại. |

TIP đã viết trước: *"Nếu cả hai cùng rụng thì tách sai. Nếu cả hai cùng còn thì tách không có tác dụng."* Thực tế rơi vào khả năng thứ ba mà tôi không lường: **cặp đáng rụng thì còn, cặp đáng còn thì rụng.** Đảo ngược hoàn toàn.

## Kết quả

```
truoc tach : 13 match
sau tach   : 11 match
mat di     : Vien Han lam x P17 (vat lieu tien tien)
             Vien Han lam x P18 (pin luu tru)
them moi   : khong co
```

Hai cặp mất chính là hai cặp **hợp lý nhất** trong nhóm Viện Hàn lâm, vì viện này thật sự có mảnh riêng về vật liệu nano và về vật liệu điện cực pin Li-ion. Còn cặp với thiết bị điện cao áp, thứ viện không hề làm, thì sống sót.

## Vì sao, truy tới tận chữ

Ba mảnh sau khi tách:

```
1. phát triển công nghệ lõi điện phân nước sản xuất hydro từ năng lượng mặt trời, gió
2. chế tạo vật liệu nano ứng dụng trong nhiệt trị, chẩn đoán hình ảnh MRI và dẫn truyền thuốc
3. phát triển vật liệu điện cực pin Li-ion thế hệ mới (MoS-Se@Gr) có hiệu suất lưu trữ cao
```

**Vì sao P20 vẫn khớp:** nhu cầu P20 mảnh 2 là "máy điện, động cơ điện và hệ thống truyền tải, truyền động điện hiện đại, hiệu suất cao". Mảnh năng lực số 3 chứa "điện cực", "hiệu suất", "cao". Chúng khớp nhau ở **điện, hiệu, suất, cao** là những từ chung chung, y hệt cơ chế đã tạo ra ca rác "chuyên dụng" ở vòng rule v1.

**Vì sao P18 rụng:** nhu cầu P18 là "Pin, ắc quy và hệ thống lưu trữ năng lượng (BESS)". Trước khi tách, câu năng lực dài chứa cả "năng lượng" (từ mảnh hydro) lẫn "pin" và "lưu trữ" (từ mảnh Li-ion), gộp lại đủ vượt ngưỡng. Sau khi tách, mảnh Li-ion chỉ còn "pin" và "lưu trữ", không đủ.

Nói cách khác: **trước khi tách, cặp P18 đúng nhưng đúng vì lý do sai** (nó vượt ngưỡng nhờ từ ở mảnh không liên quan). Tách ra làm lộ ra rằng bằng chứng thật sự mỏng hơn vẻ ngoài.

## Điều này nói gì về toàn bộ hướng đi

Đây là lần thứ tư liên tiếp một cải tiến từ vựng cho kết quả trái chiều: rule v2 tốt lên, rule v3 trượt, tách nhu cầu tốt lên, tách năng lực trượt. Mẫu hình đã đủ rõ:

**Mọi thao tác trên chuỗi ký tự đều dịch chuyển ngưỡng theo hướng không kiểm soát được, vì cái quyết định đúng sai là NGHĨA chứ không phải chữ.** Cắt ngắn thì mất bằng chứng thật, để dài thì thưởng oan bên mô tả rộng. Không có độ dài nào đúng.

Đây cũng chính là kết luận tôi đã viết ở VERIFY của rule v3 và vẫn đúng: phần còn lại là ngữ nghĩa.

## Đề nghị: HOÀN NGUYÊN

Tách năng lực **không đạt mục tiêu và làm mất hai cặp đúng**, đồng thời làm hai chữ ký của Lâm phải ký lại. Không có lợi ích nào bù lại.

Đề nghị hoàn nguyên `build_cncl_match.py` về trạng thái trước TIP-3G, khôi phục `out/matches.jsonl` và sổ chữ ký từ bản sao đã lưu, đưa registry về đúng 13 match với 12 ký và 1 từ chối.

Giữ lại trong mã: **cổng `PART_NOT_VERBATIM` mở rộng cho cả capability**, vì cổng đó tốt và không liên quan tới việc tách. Giữ lại TIP và báo cáo này để lần sau không ai thử lại hướng đã biết là hỏng.
