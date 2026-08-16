# Completion Report · TIP-CNCL-3E · Rule v3 cụm hai âm tiết

Ngày: 16/08/2026. Vai: Thợ. Tiêu chí khoá trong TIP trước khi viết dòng code đầu tiên.

## STATUS

**FAILED. V2 trượt. Rule v3 hỏng ở dạng hiện tại.**

Công bố nguyên trạng theo đúng cam kết. Không chỉnh ngưỡng, không sửa stopword, không nắn tiêu chí.

## Bảng hồi quy

| Mã | Nội dung | Kết quả |
|---|---|---|
| **V1** | Cặp VNPT với P08 (Lâm đã từ chối) không xuất hiện | **ĐẠT.** Biến mất. |
| **V2** | Bảy cặp Lâm đã ký vẫn xuất hiện đủ | **TRƯỢT. Chỉ còn 4/7.** |
| **V3** | Phenikaa-X với P23 vẫn không xuất hiện | **ĐẠT.** |
| **V4** | `restore-signoff` gắn lại đủ chữ ký | không đo, vì V2 đã trượt thì không có ý nghĩa |
| **V5** | Tỷ lệ rác trong match mới | không có match mới nào |
| **V6** | Digest tái lập, v1 và v2 còn chạy | **ĐẠT.** v3 digest `59f24accfa5630b2`; v1 và v2 gọi được bằng cờ. |

## Kết quả ba rule cạnh nhau

```
v1 overlay_capability_need_v1 : 1 match · rác 100%
v2 anchor_group_overlap_v2    : 8 match · rác 12,5% · Lâm ký 7, từ chối 1
v3 anchor_bigram_v3           : 4 match · rác 0%    · nhưng MẤT 3 cặp Lâm đã ký
```

Bốn match còn lại của v3 đều là cặp đã ký: ba cặp chip (Viettel, FPT Semiconductor, CT Semiconductor) và cặp UAV với Viettel.

## Ba cặp bị mất và lý do đo được

```
P07 robot tự hành <-> ROSTEK
  need bigram (7): robot di, di động, động tự, tự hành, hành và, và robot, robot nghiệp
  giao: tự hành          overlap = 0,143

P01 LLM tiếng Việt <-> VinBigData
  need bigram (16)
  giao: mô hình, hình ngôn, ngôn ngữ, ngữ lớn, lớn tiếng, tiếng việt   overlap = 0,375

P06 mạng 5G <-> VNPT Technology
  need bigram (7): mạng di, di động, động 5g, 5g 5g, 5g advanced, bị và, và mạng
  giao: di động          overlap = 0,143
```

Cả ba đều dưới ngưỡng 0,5.

## Chẩn đoán: bigram chữa đúng bệnh nhưng mẫu số phình gấp đôi

Cụm hai âm tiết **đúng về mặt ngữ nghĩa**: nó giết sạch match rác, tỷ lệ rác về 0. Nhưng nó làm mẫu số phình lên và tạo ra **cụm rác ngang qua ranh giới từ**.

Nhìn P07: bảy cụm sinh ra thì chỉ ba cụm là từ thật (`robot di`, `tự hành`, `robot nghiệp` là mảnh của "robot công nghiệp"). Bốn cụm còn lại (`hành và`, `và robot`, `động tự`, `di động`) là **cụm bắc cầu qua ranh giới hai từ khác nhau**, không mang nghĩa gì. Chúng nằm ở mẫu số và kéo tỷ lệ xuống, dù không có lỗi nào ở phía capability.

Nói gọn: v2 quá lỏng vì âm tiết lẻ khớp bừa; v3 quá chặt vì cụm bắc cầu làm loãng mẫu số. Cả hai đều sai ở **mẫu số**, không phải ở ngưỡng.

## Vì sao tôi không hạ ngưỡng cho v3

Hạ xuống 0,14 thì ba cặp kia quay lại, nhưng lúc đó ngưỡng gần như vô hiệu và mọi cặp cùng nhóm đều lọt. Ngưỡng bị nắn sau khi thấy đáp án thì không còn là ngưỡng. Đây là lần thứ hai trong ngày tôi gặp cám dỗ này, và câu trả lời vẫn thế.

## SUGGESTIONS cho Chủ thầu

1. **Bỏ cụm bắc cầu qua ranh giới từ.** Chỉ sinh bigram trong phạm vi một cụm danh từ, cắt tại dấu phẩy và tại các từ nối như "và". Việc này giảm mẫu số về đúng phần mang nghĩa, và không đụng ngưỡng.
2. **Đổi mẫu số sang phía nhỏ hơn.** Thay `giao / |need|` bằng `giao / min(|need|, |capability|)`. Một đơn vị chuyên sâu một khâu không nên bị phạt vì nhu cầu quốc gia viết rộng. Đây là sửa công thức, phải khoá tiêu chí trước.
3. **Cân nhắc kết hợp v2 và v3 thay vì thay thế**: dùng bigram để **loại** ca rác (nếu không có cụm nào chung thì loại), rồi dùng token đơn để **chấm điểm**. Hai lớp có vai trò khác nhau.

Cả ba đề xuất này tôi **chưa chạy thử**. Bài học từ vòng trước là đề xuất chưa thử thì không được đưa vào TIP như phương án chốt.

## Lệnh tái lập

```
cd /Users/os/CaoLocMatch
python3 match_engine.py run domains/cncl_match             # v3 (mac dinh)
python3 match_engine.py run domains/cncl_match --rule-v2   # v2 doi chieu
python3 match_engine.py run domains/cncl_match --rule-v1   # v1 doi chieu
```

**Lưu ý vận hành: toàn bộ vòng này chạy trên bản sao trong thư mục lab, file chữ ký thật của Lâm chưa bị đụng.** Repo thật vẫn đang ở kết quả v2 với 7 chữ ký và 1 từ chối.
