# TIP-CNCL-3G · Tách năng lực ghép ở phía CUNG

## Header

- **ID:** TIP-CNCL-3G
- **Dependencies:** cổng luật 3 đóng (8c661a2), Lâm đã ký 12 và từ chối 1 trên 13 match
- **Cỡ:** nhỏ. TIP, BUILD, VERIFY.

## Vấn đề, đối xứng với TIP-3C

Ở TIP-3C tôi tách **nhu cầu** ghép vì mẫu số phình ra phạt oan đơn vị chuyên sâu. Nay lỗi lộ ở đầu kia: **năng lực** viết gộp làm tử số phình ra và **thưởng oan** đơn vị mô tả rộng.

Ca cụ thể, phát hiện ngay sau khi Lâm ký:

```
capability Viện Hàn lâm (263 ký tự, ba lĩnh vực trong một câu):
"phát triển công nghệ lõi điện phân nước sản xuất hydro...; chế tạo vật liệu nano...;
 phát triển vật liệu điện cực pin Li-ion thế hệ mới (MoS-Se@Gr)..."
```

Một câu này khớp được cả P17 vật liệu, P18 pin, lẫn P20 thiết bị điện cao áp. Bốn trên năm match mới đều là Viện Hàn lâm, không phải vì đơn vị này mạnh hơn mà vì **câu mô tả của nó trải rộng hơn**.

Đối chiếu: MATCH-0010 Đông Anh với thiết bị điện cao áp, câu bằng chứng nói đúng một việc là máy biến áp 500kV. Đó là match có nghĩa thật.

## Task

Tách `capability` theo **dấu chấm phẩy**, đúng khuôn đã dùng và đã kiểm chứng ở TIP-3C:

- Mỗi mảnh thành một trường: `capability`, `capability_3`, `capability_4`, ... (tránh đụng `capability_2` vốn đang dành cho `nang_luc_mo_ta_2`).
- **Mỗi mảnh phải là chuỗi con NGUYÊN VĂN của span gốc.** Cổng tự kiểm trong builder phải chặn nếu sai, và **không ghi gì cả** khi có lỗi.
- Chỉ tách ở dấu chấm phẩy. Không tách ở dấu phẩy, không tách ở chữ "và".
- Engine v2 đã nhận mọi trường bắt đầu bằng `capability`, không cần sửa rule.

## Tiêu chí · KHOÁ TRƯỚC KHI SỬA

Đáp án đến từ chữ ký của người gác cổng và từ phân tích nội dung, không phải tôi tự đặt sau.

| Mã | Nội dung | Ngưỡng |
|---|---|---|
| **G1** | MATCH Đông Anh với P20 (thiết bị điện cao áp) **vẫn còn** | bắt buộc |
| **G2** | Bảy cặp đã ký ở vòng trước và không liên quan Viện Hàn lâm **vẫn còn đủ** | bắt buộc |
| **G3** | Cặp Viện Hàn lâm với P20 (thiết bị điện cao áp) **biến mất**, vì mảnh hydro, mảnh nano, mảnh pin đều không nói về thiết bị điện | bắt buộc |
| **G4** | Cặp Viện Hàn lâm với P18 (pin) **vẫn còn**, vì có mảnh riêng về vật liệu điện cực pin Li-ion | bắt buộc |
| **G5** | Mọi mảnh capability là chuỗi con nguyên văn của span gốc; cổng tự chứng minh nó cắn bằng một mảnh bịa | bắt buộc |
| **G6** | `restore-signoff` gắn lại được chữ ký của các cặp **không đổi nội dung**; cặp nào đổi thì phải báo cần ký lại, không tự gắn | bắt buộc |

**G3 và G4 là cặp tiêu chí quan trọng nhất**: chúng kiểm rằng việc tách không chỉ cắt bừa cho ít match đi, mà cắt đúng chỗ. Nếu cả hai cùng rụng thì tách sai. Nếu cả hai cùng còn thì tách không có tác dụng.

Nếu G1, G2 hoặc G4 trượt thì tách hỏng, công bố nguyên trạng, không nắn.

## Constraints

- Không sửa `match_engine.py` trong vòng này. Rule đứng yên, chỉ dữ liệu đổi.
- Không sửa claim gốc ở registry CUNG.
- **Không tự sửa chữ ký của Lâm.** Sao lưu `out/` và sổ trước khi chạy.
- Đọc exit code trần. Em-dash vẫn cấm.
