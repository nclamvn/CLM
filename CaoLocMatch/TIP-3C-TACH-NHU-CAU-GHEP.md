# TIP-CNCL-3C · Tách nhu cầu ghép ở tầng dữ liệu

## Header

- **ID:** TIP-CNCL-3C
- **Dependencies:** rule v2 đóng (commit 8d950a4), VERIFY chỉ ra R7 trượt vì mẫu số chứ không vì ngưỡng
- **Cỡ:** nhỏ. Rút gọn còn TIP, BUILD, VERIFY.

## Vấn đề

Văn bản QĐ 21/2026 gộp nhiều nhu cầu khác nhau vào một dòng sản phẩm, ngăn cách bằng dấu chấm phẩy. Hai ca trên đĩa:

- **P22**: "Thiết bị, phương tiện bay không người lái (UAV)**;** hệ thống quản lý, phát hiện, giám sát và chế áp UAV"
- **P20**: "Thiết bị điện cao áp, siêu cao áp**;** máy điện, động cơ điện và hệ thống truyền tải..."

Overlap chia cho tổng token của need, nên nhu cầu gộp tự phạt mọi đơn vị chỉ chuyên một khâu. Nhà sản xuất chip cho UAV không bao giờ phủ nổi phần "quản lý, phát hiện, giám sát, chế áp".

## Task

Tách need theo **dấu chấm phẩy**, là ký hiệu liệt kê tường minh của chính văn bản gốc. Mỗi mảnh sinh ra một trường riêng: `need`, `need_2`, ... Engine v2 đã nhận mọi trường bắt đầu bằng `need`.

**Ràng buộc cứng: mỗi mảnh phải là chuỗi con NGUYÊN VĂN của span gốc.** Không sửa chữ, không thêm chữ, không viết hoa lại. Nếu một mảnh không còn là chuỗi con thì dừng, không ghi gì.

Chỉ tách ở dấu chấm phẩy. **Không tách ở dấu phẩy và không tách ở chữ "và"**, vì hai thứ đó thường nối các thành phần của cùng một khái niệm chứ không phải hai nhu cầu khác nhau.

## Tiêu chí · KHOÁ TRƯỚC KHI SỬA

| Mã | Nội dung | Ngưỡng |
|---|---|---|
| **S1** | R7 (chip SoC AI on Edge với nhu cầu UAV) đạt **mà không đụng OVERLAP_MIN_V2**, ngưỡng giữ nguyên 0,5 | bắt buộc |
| **S2** | R1, R2, R3 vẫn giữ nguyên kết quả của vòng v2 | bắt buộc |
| **S3** | Match mới sinh ra phải ghi rõ nó khớp mảnh nào của nhu cầu gộp | bắt buộc |
| **S4** | Tỷ lệ rác không tăng quá 30% | bắt buộc |
| **S5** | Mọi mảnh need là chuỗi con nguyên văn của span gốc, cổng tự kiểm chặn nếu sai | bắt buộc |

**Nếu S1 trượt thì kết luận: tách nhu cầu không đủ để cứu R7, phải chờ rule v3.** Cấm hạ ngưỡng trong mọi trường hợp.

## Constraints

- Không sửa `match_engine.py` trong vòng này (rule đứng yên, chỉ dữ liệu đổi).
- Không sửa claim gốc ở hai registry nguồn.
- Đọc exit code trần. Em-dash vẫn cấm.
