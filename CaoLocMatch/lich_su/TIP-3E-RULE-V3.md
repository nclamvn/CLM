# TIP-CNCL-3E · Rule v3 · so theo cụm hai âm tiết

## Header

- **ID:** TIP-CNCL-3E
- **Dependencies:** sổ chữ ký đóng (commit 5404784), 7 match đã ký và 1 đã bị từ chối có lý do
- **Điều kiện tiên quyết ký ở 04:** đổi rule là tăng `ENGINE_VERSION`

## Chẩn đoán cần chữa

Bộ tách token cắt tiếng Việt theo âm tiết từ 3 ký tự trở lên, nên từ ghép hai âm tiết bị vỡ và âm tiết đứng một mình mất gần hết nghĩa. Ca cụ thể đã bị Lâm bác:

```
need P08 : "Nền tảng, giải pháp và mô hình phục vụ sản xuất thông minh"
cap VNPT : "...40 mô hình AI xử lý ảnh phục vụ các bài toán đặc thù..."
giao     : {hình, phục}    <- manh vun cua "mô hình" va "phục vụ"
```

Stopword chữa được từ dùng chung, không chữa được từ ghép bị vỡ. Rule v3 phải so theo **cụm hai âm tiết liền nhau**, để "mô hình" chỉ khớp "mô hình", không khớp bừa qua mảnh "hình".

## Task

Viết rule v3 trong `match_engine.py`, `ENGINE_VERSION = cao-loc-match/0.3.0 rule=anchor_bigram_v3`. Giữ nguyên v1 và v2 để đối chiếu.

Bốn lớp:

1. **Neo nhóm** giữ nguyên như v2 (trùng nhóm hoặc qua cạnh chuỗi giá trị đã duyệt).
2. **Stopword ngành** giữ nguyên.
3. **Cụm hai âm tiết**: sinh bigram từ chuỗi âm tiết liền nhau của need và của capability, so trên tập bigram.
4. **Điểm**: giữ công thức `0,7 x overlap + 0,2 x tier + 0,1 x location` để con số so sánh được với v1 và v2. Overlap nay tính trên bigram.

Nếu need sau xử lý có dưới 1 bigram thì lùi về so token đơn, và **phải ghi vào rationale là đã lùi**, để người đọc biết dòng đó yếu hơn.

## Tiêu chí hồi quy · KHOÁ TRƯỚC KHI VIẾT CODE

Đáp án có sẵn từ quyết định của người gác cổng, không phải tôi tự nghĩ ra.

| Mã | Nội dung | Ngưỡng |
|---|---|---|
| **V1** | Cặp VNPT với P08 (Lâm đã **từ chối**) không xuất hiện | bắt buộc |
| **V2** | Bảy cặp Lâm đã **ký** vẫn xuất hiện đủ cả bảy | bắt buộc |
| **V3** | Cặp rác cũ Phenikaa-X với P23 vẫn không xuất hiện | bắt buộc |
| **V4** | `restore-signoff` sau khi chạy v3 gắn lại được **đúng 7 chữ ký**, không cần Lâm ký lại | bắt buộc |
| **V5** | Số match mới phát sinh mà Lâm chưa từng xem: đọc tay, tỷ lệ rác tối đa 30% | bắt buộc |
| **V6** | Digest tái lập; v1 và v2 vẫn chạy lại được | bắt buộc |

**Nếu V1 hoặc V2 trượt thì rule v3 hỏng, công bố nguyên trạng.** Cấm chỉnh ngưỡng, cấm sửa stopword để cứu một ca cụ thể sau khi đã thấy kết quả.

V4 là tiêu chí mới và quan trọng: nó kiểm rằng **đổi rule không làm mất công gác cổng của người**. Nếu khoá nội dung thay đổi vì lý do kỹ thuật thuần tuý thì chữ ký phải được ký lại, và như vậy là rule v3 gây thiệt hại ẩn.

## Constraints

- Không sửa `methodbox/`. Không xoá v1, v2.
- Không sửa claim gốc, không sửa sổ chữ ký bằng tay.
- Sao lưu `out/` và sổ trước khi chạy.
- Thử trên bản sao trước khi đụng file thật.
- Đọc exit code trần. Em-dash vẫn cấm.
