# VERIFY REPORT · TIP-CNCL-3B · Rule v2

Ngày: 16/08/2026. Chủ thầu. Thợ tự khai PARTIAL và đẩy một ca ranh giới lên cho tôi phân xử. Tôi phân xử, và trong lúc kiểm thì bắt được một đề xuất sai của Thợ.

## REQUIREMENT COVERAGE

7 tiêu chí khoá trước. **5 đạt, 2 trượt (71%).**

| Mã | Thợ khai | Chủ thầu chấm |
|---|---|---|
| R1 cặp rác biến mất | ĐẠT | **ĐẠT** |
| R2 VinBigData với LLM | ĐẠT | **ĐẠT** |
| R3 ROSTEK với robot | ĐẠT | **ĐẠT** |
| R4 không cặp rác nào trên R2/R3 | "đạt có điều kiện" | **TRƯỢT** |
| R5 rác tối đa 30% | ĐẠT 14,3% | **ĐẠT** |
| R6 tái lập và v1 còn chạy | ĐẠT | **ĐẠT** |
| R7 chip SoC AI on Edge với UAV | TRƯỢT | **TRƯỢT** |

## Phân xử R4

Tiêu chí viết: *"Không cặp nào bị người đọc chấm là rác được xếp điểm cao hơn R2 hoặc R3."* MATCH-0002 bị chính Thợ chấm là rác, điểm 0,67, cao hơn R2 và R3 cùng ở 0,53.

**Chiếu đúng chữ đã khoá: R4 TRƯỢT.** Tôi không nới.

Lập luận của Thợ (ở v1 cặp rác xếp trên *mọi* cặp đúng, ở v2 chỉ một cặp rác lọt lên) là **mô tả đúng về mức cải thiện**, nhưng đó không phải nội dung R4. Nếu tôi cho R4 đạt vì "dù sao cũng tốt hơn nhiều" thì lần sau mọi tiêu chí đều có thể được cứu bằng câu đó. Mức cải thiện được ghi riêng ở mục dưới, không trộn vào kết quả chấm.

## Chủ thầu bác một đề xuất của Thợ

Thợ đề xuất **sàn số token: need còn dưới 3 token thì loại**, và tin rằng nó giết đúng MATCH-0002. Tôi kiểm bằng dữ liệu thật:

```
MATCH-0001 ROSTEK            4 token -> giữ
MATCH-0002 VNPT (rác)        3 token -> GIỮ   (đề xuất không giết được nó)
MATCH-0003 Viettel chip      1 token -> BỊ LOẠI
MATCH-0004 FPT Semiconductor 1 token -> BỊ LOẠI
MATCH-0005 CT Semiconductor  1 token -> BỊ LOẠI
MATCH-0006 VinBigData       12 token -> giữ
MATCH-0007 VNPT Technology   3 token -> giữ
```

**Đề xuất này làm ngược hoàn toàn mục đích**: giữ nguyên ca rác và giết đúng ba match tốt nhất, trong đó có cả ba cặp chip đang là kết quả sạch nhất của v2. **BÁC.**

Bài học ghi lại: đề xuất nghe hợp lý về mặt trực giác vẫn phải chạy thử trên dữ liệu thật trước khi vào TIP kế. Thợ đề xuất mà không thử; Chủ thầu thử trong 30 giây thì lộ ngay.

## Chẩn đoán gốc rễ mà cả hai vai đều chưa nêu đủ

Tôi truy MATCH-0002 tới tận chữ:

```
need P08 : "Nền tảng, giải pháp và mô hình phục vụ sản xuất thông minh"
cap VNPT : "làm chủ hơn 40 mô hình AI xử lý ảnh phục vụ các bài toán đặc thù..."
giao     : {hình, phục}
```

Hai token khớp nhau là **"hình"** và **"phục"**, tức mảnh vụn của "mô hình" và "phục vụ". Bộ tách token cắt tiếng Việt theo âm tiết từ 3 ký tự trở lên, nên từ ghép hai âm tiết bị vỡ, và âm tiết đứng một mình mất gần hết nghĩa.

Đây là nguyên nhân sâu hơn cả stopword. Stopword giải quyết được từ dùng chung, không giải quyết được **từ ghép bị vỡ**. Hướng đúng cho v3 là so theo cụm hai âm tiết liền nhau, không phải thêm bộ lọc lên token đơn.

## Mức cải thiện thật (ghi riêng, không tính vào chấm điểm)

```
v1: 1 match  · rác 100%  · cặp đúng bị chặn hoàn toàn
v2: 7 match  · rác 14,3% · 4/5 cặp điểm cao nhất đều đúng
```

Lớp neo nhóm làm đúng việc của nó: cặp Phenikaa-X với chip biến mất, và ba cặp chip đúng (Viettel, FPT Semiconductor, CT Semiconductor) nổi lên đứng đầu bảng. Điều đó xác nhận chẩn đoán ở vòng trước là chính xác.

## Về R7, tôi đồng tình với việc Thợ không cứu

Chỉ cần hạ ngưỡng từ 0,5 xuống 0,45 là R7 đạt. Thợ không làm, và đó là quyết định đúng. Ngưỡng bị nắn sau khi thấy đáp án thì không còn là ngưỡng, chỉ còn là lời biện hộ.

Duyệt hướng xử lý: **tách nhu cầu ghép ở tầng dữ liệu**. P22 gộp hai việc khác nhau (thiết bị bay, và hệ thống chế áp) vào một dòng, làm mẫu số phình ra và phạt oan mọi đơn vị chuyên một khâu. Sửa dữ liệu cho đúng bản chất thì không phải nắn tiêu chí.

## TECHNICAL HEALTH

```
build_cncl_match.py     : exit 0 · 188 claim · 53 entity
refinery (CUNG)         : exit 0 · digest b2da2f280b1f1bd2 · 103 claim
match v2                : exit 0 · digest e2af754f7323b9cd · tái lập
match v1 (--rule-v1)    : exit 0 · digest 5b9bb0fe12565ba3 · khớp đúng vòng trước
ô disputed              : 0
match mang unverified   : 7/7 (bảng ánh xạ còn chờ duyệt, đúng thiết kế)
```

## OVERALL STATUS

**NOT READY để trình match ra ngoài. READY để mở lại việc cào dữ liệu.**

Hai kết luận tách bạch:

1. **Không match nào được trình ra ngoài** khi R4 và R7 còn trượt, và khi cả 7 match còn mang `unverified` vì bảng ánh xạ chưa được duyệt.
2. **Lệnh hoãn cào dữ liệu ở vòng trước nay gỡ được.** Lý do hoãn là rule xếp hạng ngược; lớp neo nhóm đã chữa đúng bệnh đó. Cào thêm dữ liệu bây giờ không còn nhân bản match rác.

Ba việc, theo thứ tự:

1. Lâm duyệt `mapping_sp_nhom.yaml` (30 dòng ánh xạ, 5 cạnh chuỗi giá trị). Chưa duyệt thì mọi match còn treo `unverified`.
2. Tách nhu cầu ghép (P22 và các sản phẩm viết gộp khác) ở tầng dữ liệu, chạy lại v2 xem R7 có tự đạt không mà không phải đụng ngưỡng.
3. Rule v3 so theo cụm hai âm tiết, khoá tiêu chí trước như hai lần vừa rồi.
