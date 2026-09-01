# Completion + VERIFY · TIP-CNCL-3H · Rule v4 neo sản phẩm

Ngày: 16/08/2026.

## STATUS

**FAILED. H1, H3, H5 trượt.** Công bố nguyên trạng, hoàn nguyên.

| Mã | Nội dung | Kết quả |
|---|---|---|
| **H1** | Cặp rác Viện Hàn lâm với P20 biến mất | **TRƯỢT.** Vẫn còn, hai lần. |
| **H2** | Đông Anh với P20 vẫn còn | **ĐẠT**, neo `san_pham`. |
| **H3** | Ba cặp chip đã ký vẫn còn | **TRƯỢT.** Mất cặp Tập đoàn Viettel. |
| **H4** | UAV với Viettel qua cạnh chuỗi giá trị | **ĐẠT** |
| **H5** | Cặp Lâm đã từ chối không quay lại | **TRƯỢT.** VNPT với P08 quay lại qua cạnh 1 sang 3. |
| **H6** | Rác tối đa 20 phần trăm | không đo, vì tiêu chí chặn đã trượt |
| **H7** | Digest tái lập | **ĐẠT**, `4a6a6f9d75fd18c4` |

## Ba lỗi, và cả ba đều là lỗi thiết kế của tôi

**1. Tôi coi `san_pham_lien_quan` như danh sách đầy đủ, trong khi nó là trường đơn trị.**

Đây là lỗi gốc. Tập đoàn Viettel khai `san_pham_lien_quan = 01` từ Pha 1. Nhu cầu P23 chip có mã 23. Rule v4 thấy khác mã nên loại thẳng, dù Viettel có `nhom_cncl_phu_6` chứng minh năng lực chip bằng bằng chứng tier A.

Một đơn vị khai **một** sản phẩm không có nghĩa nó **chỉ** làm sản phẩm đó. Tôi đã tự dựng schema đơn trị ở Pha 2f, rồi lại đọc nó như danh sách đóng ở Pha 3H. Hai vòng, hai giả định trái nhau về cùng một trường.

**2. Tôi để cạnh chuỗi giá trị làm đường vòng cho ca đã bị người gác cổng bác.**

VNPT với P08 bị Lâm từ chối ngày 16/08. Rule v4 thấy VNPT khai sản phẩm 01, nhu cầu là 08, không trùng, nên xét cạnh chuỗi giá trị, thấy cạnh 1 sang 3 đã duyệt, và cho qua. **Ca đã bị người bác quay lại bằng cửa sau.**

Điều mỉa mai là chính tôi đã cảnh báo đúng chuyện này khi bác ba đề xuất của Thợ ở vòng rule v3: *"cả hai đề xuất đều kéo ca Lâm đã từ chối lên đúng 0,500, tức sẽ hồi sinh match người gác cổng vừa bác."* Tôi phát hiện được khi kiểm việc của mình ở vai Thợ, nhưng lại tự mắc đúng lỗi đó khi thiết kế ở vai Chủ thầu.

**3. Có lỗi lập trình thật: bốn match ghi `neo: None`.**

Nhánh khi đơn vị chưa khai sản phẩm không gán nhãn neo. Không ảnh hưởng kết quả lọc nhưng làm rationale mất thông tin, tức là chính thứ mà cả hệ thống này tồn tại để bảo vệ.

## Vì sao H1 vẫn trượt

Viện Hàn lâm **chưa khai sản phẩm** (honest-null có chủ đích từ Pha 2f, vì span phủ ba lĩnh vực). Nên rule v4 lùi về neo nhóm như v2, và cặp rác với thiết bị điện cao áp sống sót y như cũ.

Đây là điều tôi phải nhận: **giả thuyết của vòng này không được kiểm.** Neo sản phẩm chỉ có tác dụng với đơn vị đã khai sản phẩm, mà đúng cái đơn vị gây ra ca rác lại là đơn vị duy nhất không khai. Vòng này không chứng minh được neo sản phẩm chặt hơn hay không chặt hơn neo nhóm.

## Đã hoàn nguyên

Rule vận hành trở lại v2. Rule v4 giữ trong mã, gọi bằng cờ, kèm ghi chú ba lỗi trên. Dữ liệu match và chữ ký khôi phục từ bản sao: 13 match, 12 ký, 1 từ chối, khớp hoàn toàn.

Builder **giữ lại** phần mang `san_pham` sang domain dẫn xuất, vì dữ liệu đó đúng và có ích cho vòng sau, không liên quan tới rule hỏng.

## Nếu làm lại, phải sửa ba chỗ

1. Sản phẩm là bằng chứng **cộng thêm**, không phải điều kiện loại trừ. Trùng mã thì cộng điểm hoặc cho qua; khác mã thì **lùi về neo nhóm**, không loại.
2. Cạnh chuỗi giá trị **không được cứu** cặp đã bị người gác cổng từ chối. Engine phải đọc sổ chữ ký và loại vĩnh viễn mọi cặp mang `decision: tu_choi`.
3. Mọi nhánh phải gán nhãn `neo`, không để `None`.

Điểm 2 quan trọng hơn cả rule: **quyết định của người phải là ràng buộc cứng của máy, không phải một gợi ý mà rule sau có thể vô hiệu.** Hôm nay hệ thống chưa có cơ chế đó, và đó là lỗ hổng nghiêm trọng hơn mọi chuyện so khớp.
