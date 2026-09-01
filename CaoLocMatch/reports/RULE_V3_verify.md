# VERIFY REPORT · TIP-CNCL-3E · Rule v3

Ngày: 16/08/2026. Chủ thầu. Thợ tự khai FAILED. Nhiệm vụ của VERIFY: xác nhận kết luận âm có đúng, và kiểm ba đề xuất mà Thợ **tự khai là chưa chạy thử**.

## REQUIREMENT COVERAGE

6 tiêu chí khoá trước. **3 đạt, 1 trượt, 2 không đo được (do tiêu chí chặn đã trượt).**

Xác nhận STATUS FAILED của Thợ là đúng. V2 đòi bảy cặp đã ký phải còn đủ; thực tế còn 4.

## Chủ thầu chạy thử ba đề xuất của Thợ, và cả ba đều hỏng

Thợ đề xuất ba hướng nhưng khai rõ chưa thử. Tôi thử ngay trên dữ liệu thật:

```
cặp                                v3 gốc   đề xuất 1   đề xuất 2
P07 <-> ROSTEK            (đã ký)   0,143      0,200      0,200
P01 <-> VinBigData        (đã ký)   0,375      0,462      0,462
P06 <-> VNPT Technology   (đã ký)   0,143      0,200      0,200
P22 <-> Viettel           (đã ký)   0,571      0,667      0,667
P08 <-> VNPT           (TỪ CHỐI)   0,400      0,500      0,500
```

Hai kết luận, cái thứ hai mới là cái đáng sợ:

1. **Không đề xuất nào cứu được ba cặp bị mất.** Cao nhất là 0,462, vẫn dưới ngưỡng 0,5.
2. **Cả hai đề xuất đều kéo ca Lâm ĐÃ TỪ CHỐI lên đúng 0,500, tức vượt ngưỡng và quay trở lại.** Nếu áp dụng mà không thử, chúng ta sẽ tự tay hồi sinh đúng cái match mà người gác cổng vừa bác, và làm hỏng V1 vốn đang đạt.

Đề xuất 3 (dùng bigram để lọc, token để chấm) cũng hỏng, vì cặp bị từ chối **có** cụm chung nên không bị lọc.

**Bác cả ba.** Đây là lần thứ hai trong ngày một đề xuất nghe hợp lý bị dữ liệu bác. Luật đã thành hình: đề xuất chưa chạy thử thì không được vào TIP, dù nghe thuyết phục đến đâu.

## Chủ thầu tự sửa chẩn đoán của chính mình

Ở vòng trước tôi kết luận MATCH-0002 là rác vì "hình" và "phục" là **mảnh vụn của từ ghép**. Tôi truy lại tới tận chữ:

```
need P08 : "Nền tảng, giải pháp và mô hình phục vụ sản xuất thông minh"
cap VNPT : "làm chủ hơn 40 mô hình AI xử lý ảnh phục vụ các bài toán đặc thù..."
cụm chung: "mô hình", "phục vụ"
```

**Chẩn đoán cũ của tôi sai một nửa.** Ở tầng âm tiết đơn thì đúng là mảnh vụn. Nhưng ở tầng cụm hai âm tiết thì "mô hình" và "phục vụ" là **từ thật, dùng đúng nghĩa, xuất hiện thật ở cả hai bên**. Không phải lỗi tách từ.

Cái làm nó thành rác là **ngữ nghĩa**: VNPT làm mô hình AI phục vụ giao thông và y tế; nhu cầu P08 là mô hình phục vụ sản xuất thông minh. Cùng chữ, khác lĩnh vực.

Hệ quả quan trọng cho toàn dự án: **không có phương pháp từ vựng nào tách được ca này.** Không bigram, không stopword, không ngưỡng. Muốn máy tự phân biệt thì phải hiểu nghĩa. Và đó chính là lý do người gác cổng tồn tại, chứ không phải vì máy chưa đủ tinh.

Lâm bác MATCH-0002 hôm nay không phải là vá tạm cho một rule kém. Đó là **đúng chỗ ranh giới giữa việc của máy và việc của người**.

## Một điều Thợ báo cáo thiếu

Ba cặp chip trong output v3 **không hề dùng bigram**. Trường `so_theo` ghi rõ: `token_don (lui vi need it hon 1 cum)`. Nhu cầu "Chip chuyên dụng" sau khi bỏ stopword chỉ còn một âm tiết "chip", không sinh nổi một cụm nào, nên rơi vào nhánh lùi về token đơn.

Nghĩa là **ba trong bốn match của v3 thực chất vẫn đang chạy bằng logic v2**. Rule v3 chỉ thật sự tự đứng được ở đúng một cặp (P22 với Viettel). Thợ có ghi nhánh lùi vào rationale, đúng thiết kế, nhưng không nêu con số này trong báo cáo. Nêu ra thì bức tranh khác hẳn: v3 không phải "4 match sạch", mà là "1 match theo v3 và 3 match theo v2".

## TECHNICAL HEALTH

```
v3 digest      : 59f24accfa5630b2 · tái lập
v2 doi chieu   : chay duoc bang --rule-v2
v1 doi chieu   : chay duoc bang --rule-v1
file that      : KHONG bi dung. Repo van o ket qua v2, 7 chu ky va 1 tu choi con nguyen.
```

## OVERALL STATUS

**NOT READY. Rule v3 không thay được v2.**

Quyết định: **giữ v2 làm rule vận hành**, giữ v3 trong mã như một nhánh có thể gọi, ghi rõ trong báo cáo là đã thử và trượt. Không xoá, vì lần sau ai đó sẽ lại nghĩ tới bigram và cần thấy kết quả này.

Việc còn lại, theo thứ tự:

1. **Dừng đuổi theo rule.** Ba vòng liên tiếp cho thấy vấn đề còn lại là ngữ nghĩa, không phải từ vựng. Cải tiến từ vựng tiếp theo sẽ cho lợi ích nhỏ dần và rủi ro hồi sinh ca đã bác.
2. **Dày dữ liệu mới là đòn bẩy thật.** 24 đơn vị trên 5 nhóm là quá mỏng để nói bất cứ điều gì về chất lượng match. Quay lại cào nhóm 5 và nhóm 4 như kế hoạch, với v2 làm rule vận hành.
3. Nếu sau này muốn chạm lại chất lượng match thì hướng đúng là nhúng ngữ nghĩa hoặc để người gác cổng làm việc của mình, không phải bigram.
