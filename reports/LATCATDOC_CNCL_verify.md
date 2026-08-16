# VERIFY REPORT · Lát cắt dọc CNCL

Ngày: 16/08/2026. Chủ thầu kiểm ngược. Kết quả của vòng này là **âm**, nên nhiệm vụ của VERIFY không chỉ là xác nhận Thợ làm đúng, mà còn phải kiểm xem **kết luận âm có bị vội hay không**.

## REQUIREMENT COVERAGE

3 tiêu chí pre-registered. **3 đo được, 0 bỏ sót.** 1 đạt, 2 không đạt.

| Tiêu chí | Kết quả | Chủ thầu kiểm lại bằng gì |
|---|---|---|
| SM-S1 chuỗi provenance | **ĐẠT** | Chạy `validate --require-signoff`, exit 2 đúng `SIGNOFF_PENDING`. Chạy lại engine, digest lặp `5b9bb0fe12565ba3`. |
| SM-S2 ứng viên tuyên bố trước | **KHÔNG XUẤT HIỆN** | Truy nguyên nhân tới tận claim, xem dưới. |
| SM-S3 tỷ lệ match vô nghĩa | **KHÔNG ĐẠT, 100%** | Tính lại overlap bằng tay, xem dưới. |

## Ba phép kiểm ngược của Chủ thầu

**1. Tự tính lại overlap của MATCH-0001, không tin số engine in ra.**

```
need "Chip chuyên dụng"  ->  token {chip, chuyên, dụng}
capability "VTOL-01 chuyên dụng cho..."  ->  giao {chuyên, dụng}
overlap = 2/3 = 0.667  >= 0.5  ngưỡng
```

Xác nhận: engine tính đúng theo rule của nó. Sai không nằm ở phép tính, sai nằm ở **rule**. Từ khoá mang thông tin duy nhất là "chip" thì lại **không** khớp. Hai từ khớp đều là từ bổ nghĩa dùng chung.

**2. Kiểm xem đề xuất rule v2 của Thợ có thật sự giết được match rác này không, hay chỉ là lời hứa.**

```
Phenikaa-X          -> nhom_cncl = 9  (hàng không, vũ trụ)
CNCL-P23 Chip chuyên dụng -> nhóm 6  (chip bán dẫn)
```

Xác nhận: neo theo nhóm **giết đúng** MATCH-0001. Đề xuất của Thợ có cơ sở, không phải nói suông.

**3. Kiểm xem có ứng viên tốt nào bị ngưỡng chặn oan không, tức kết luận âm có vội không.**

Tôi tính overlap cho toàn bộ 690 cặp và xem 6 cặp cao nhất:

```
0.67 · CNCL-P23 Chip chuyên dụng      <-> Phenikaa-X            (rác, đã phân tích)
0.46 · CNCL-P01 LLM tiếng Việt        <-> VinBigData            (hợp lý, bị ngưỡng chặn)
0.40 · CNCL-P12 in 3D y tế            <-> Viettel AI            (rác)
0.40 · CNCL-P12 in 3D y tế            <-> Masan High-Tech       (rác)
0.40 · CNCL-P07 robot tự hành         <-> Viettel AI            (rác)
0.40 · CNCL-P07 robot tự hành         <-> ROSTEK                (hợp lý, bị ngưỡng chặn)
```

Phát hiện quan trọng, và nó **làm kết luận nặng hơn chứ không nhẹ đi**: trong nhóm sát ngưỡng có **hai cặp thật sự hợp lý** (LLM tiếng Việt với VinBigData, robot tự hành với ROSTEK) nhưng bị chặn, trong khi cặp rác lại vượt qua. Rule không chỉ ồn, nó **xếp hạng ngược**: cặp đúng bị chấm thấp hơn cặp sai.

Đây là bằng chứng mạnh hơn nhiều so với việc chỉ có 1 match rác. Nếu chỉ nhìn output engine thì không thấy được điều này. Kết luận âm **không vội**, mà còn được củng cố.

## Đánh giá 4 SUGGESTIONS của Thợ

1. **Neo theo nhóm trước, so chữ sau: DUYỆT.** Đã kiểm bằng dữ liệu thật, giết đúng ca rác. Đây sẽ là điều kiện cần của rule v2.
2. **Stopword ngành: DUYỆT.** Danh sách khởi điểm lấy từ chính các ca vừa quan sát: chuyên dụng, hệ thống, thiết bị, công nghệ, tiên tiến, thông minh, giải pháp, nền tảng.
3. **Nạp SoC AI on Edge thành claim thật: DUYỆT, ưu tiên cao.** Đây là cạnh CUNG-CẦU tốt nhất đang có bằng chứng tier A mà lại nằm ngoài registry. Bài học quy trình: **ghi "để dành cho bước sau" trong báo cáo không phải là nạp.** Việc để dành đã tự trừng phạt đúng ở vòng này.
4. **Tăng ENGINE_VERSION khi đổi rule: DUYỆT**, đúng điều kiện tiên quyết số 2 đã ký ở 04. Báo cáo vòng sau bắt buộc ghi "đã thấy kết quả vòng trước khi sửa".

Chủ thầu bổ sung một điều Thợ chưa nêu: **rule v2 phải đo lại chính 690 cặp này và chứng minh hai cặp hợp lý ở trên leo lên trên cặp rác.** Đó là bài kiểm hồi quy tự nhiên, có sẵn đáp án, không cần bịa dữ liệu thử.

## TECHNICAL HEALTH

```
build_cncl_match.py       : exit 0 · 160 claim · 53 entity · cổng tự kiểm span trước khi ghi
match_engine run          : exit 0 · digest 5b9bb0fe12565ba3 · chạy lại cùng digest
validate --require-signoff: exit 2 · SIGNOFF_PENDING cắn đúng
ô disputed                : 0
chain_complete            : true trên match duy nhất
cặp đã xét                : 690 (23 capability x 30 need)
```

## OVERALL STATUS

**NOT READY để nhân rộng. READY để kết luận.**

Theo bảng quyết định đã khoá ở pre-registration mục 3, kết quả rơi đúng vào ô: **SM-S1 đạt, SM-S3 không đạt** nghĩa là *"Chuỗi provenance ổn nhưng rule so khớp sai. Sửa rule trước khi cào thêm."*

Kết luận này ràng buộc kế hoạch: **hoãn việc cào 5 nhóm còn lại.** Cào thêm dữ liệu vào một rule xếp hạng ngược chỉ làm nhiều match rác hơn.

Ba việc, theo thứ tự:

1. Nạp claim SoC AI on Edge vào registry CUNG (bằng chứng tier A đã nằm sẵn trong snapshot).
2. Viết rule v2 (neo nhóm + stopword ngành), tăng ENGINE_VERSION, chạy lại đúng 690 cặp, chứng minh thứ hạng đảo đúng chiều.
3. Chỉ khi rule v2 qua bài hồi quy đó mới quay lại cào nhóm 5 và nhóm 4.

**Giá trị lớn nhất của vòng này không phải là match nào, mà là biết rule sai TRƯỚC khi đổ thêm công cào dữ liệu.** Đúng mục đích của lát cắt dọc.
