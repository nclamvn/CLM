# Completion Report · Lát cắt dọc CNCL · lần đầu engine chạy trên dữ liệu thật

Ngày: 16/08/2026. Vai: Thợ. Pre-registration khoá trước: `KnowledgeBase/CaoLocMatch_PoC/10_PRE_REG_SELF.md`.

## STATUS

**DONE về thi công. Kết quả khoa học: rule so khớp KHÔNG ĐẠT.**

Đây là kết quả âm, và theo pre-registration mục 2 thì phải công bố nguyên trạng, cấm chỉnh rule trong cùng vòng để lấy số đẹp. Tôi không chỉnh.

## Đã dựng gì

- `domains/cncl_match/` domain dẫn xuất: 160 claim, 53 entity (23 bên CUNG có mô tả năng lực, 30 bên CẦU là 30 sản phẩm chiến lược theo QĐ 21/2026), 24 snapshot copy nguyên văn từ hai registry nguồn.
- `build_cncl_match.py`: script tất định dựng domain dẫn xuất. Không sửa claim gốc. Có cổng tự kiểm trước khi ghi: nếu span nào không còn nằm trong snapshot đích thì **không ghi gì cả**, exit 2.
- Engine chạy: `python3 match_engine.py run domains/cncl_match`, exit 0.

## Kết quả chạy

```
facts=160 · claim-tier=0 · disputed cells=0 · honest-null cells=370
cặp đã xét: 23 capability x 30 need = 690
ứng viên vượt ngưỡng overlap: 1
đạt gate: 1 · bị chặn: 0
digest_matches=5b9bb0fe12565ba3 (chạy lại ra đúng digest này)
```

Match duy nhất:

```
MATCH-0001  CNCL-P23 · nhu cầu quốc gia  <->  Phenikaa-X  score=0.64
  need       : "Chip chuyên dụng"
  capability : "VTOL-01 chuyên dụng cho các nhiệm vụ ở địa hình phức tạp như rừng núi"
  chain_complete: true · signoff: pending-human-review
```

## Đối chiếu ba tiêu chí đã khoá trước

**SM-S1 · Chuỗi provenance không đứt: ĐẠT.**
Match có `chain_complete = true`. Cả hai đầu truy về snapshot với span nguyên văn. 0 ô disputed. Cổng `SIGNOFF_PENDING` kiểm lại: chạy `validate --require-signoff` cho **exit 2**, đúng như thiết kế, không cho trình output khi chưa có người ký.

**SM-S2 · Ứng viên tuyên bố trước (chip SoC AI on Edge khớp UAV): KHÔNG XUẤT HIỆN.**

Lý do thật, không bào chữa:

1. Câu bằng chứng về "dòng chip SoC AI on Edge trên tiến trình 28-32 nm cho hệ sinh thái thiết bị camera, drone, thiết bị bay không người lái (UAV)" **nằm trong snapshot nhưng chưa bao giờ được nạp thành claim**. Ở Completion Report Pha 2b tôi đã ghi nó vào mục "chưa nạp, để dành cho bước match". Hệ quả: registry CUNG không có fact `capability` nào mang các từ khoá UAV hay drone từ phía chip. Không có fact thì engine không có gì để so.
2. Ngay cả nếu có, phía CẦU của UAV là P22 với giá trị dài: "Thiết bị, phương tiện bay không người lái (UAV); hệ thống quản lý, phát hiện, giám sát và chế áp UAV". Ngưỡng `OVERLAP_MIN = 0.5` tính theo **tỷ lệ token của need được capability phủ**, nên need càng dài càng khó đạt. Đây là khuyết tật thiết kế của rule, không phải của dữ liệu.

Tôi **không** hạ ngưỡng, **không** sửa giá trị need, **không** thêm claim mới để ép match xuất hiện.

**SM-S3 · Tỷ lệ match vô nghĩa: KHÔNG ĐẠT. 1/1 = 100% vô nghĩa.**

MATCH-0001 là dương tính giả kinh điển. Phenikaa-X làm UAV, không làm chip. Cái khớp nhau chỉ là hai chữ **"chuyên dụng"**, một cụm bổ nghĩa chung chung xuất hiện ở cả "Chip chuyên dụng" lẫn "VTOL-01 chuyên dụng cho các nhiệm vụ...". Token của need là {chip, chuyên, dụng}, capability phủ 2/3 = 0.667, vượt ngưỡng 0.5. Nội dung thì không liên quan gì nhau.

Theo pre-registration mục 2: trên 50% vô nghĩa thì **rule `overlay_capability_need_v1` không dùng được cho domain CNCL**. Kết luận này đã được khoá trước khi chạy, nay áp đúng như đã cam kết.

## Chẩn đoán gốc rễ

Rule đếm token tiếng Việt từ 3 ký tự trở lên rồi lấy tỷ lệ giao. Với domain dịch vụ (nơi need viết bằng lời người thật, giàu từ riêng) cách này chạy được. Với domain chính sách công nghệ, need là **tên sản phẩm trong văn bản pháp quy**, ngôn ngữ chuẩn hoá và đầy từ bổ nghĩa dùng chung: "chuyên dụng", "hệ thống", "thiết bị", "công nghệ", "tiên tiến", "thông minh". Những từ này xuất hiện ở khắp nơi và kéo overlap lên mà không mang thông tin phân biệt.

Nói gọn: **rule đang so từ, trong khi domain này cần so lĩnh vực.** Dữ liệu đã có sẵn thứ để so lĩnh vực mà rule không dùng: bên CUNG có `nhom_cncl` và trường phụ `nhom_cncl_phu_*`, bên CẦU có ánh xạ sản phẩm về nhóm theo QĐ 21/2026.

## SUGGESTIONS cho Chủ thầu

1. **Rule v2 phải neo theo nhóm trước, so chữ sau.** Điều kiện cần: nhóm của đơn vị CUNG (chính hoặc phụ) trùng nhóm của sản phẩm CẦU. Chỉ khi đã cùng nhóm mới tính overlap chữ. Việc này một mình đã giết chết MATCH-0001, vì Phenikaa-X ở nhóm 9 còn chip chuyên dụng ở nhóm 6.
2. **Cần danh sách từ dùng chung (stopword ngành)** để loại "chuyên dụng", "hệ thống", "thiết bị", "công nghệ", "tiên tiến", "thông minh", "giải pháp", "nền tảng" khỏi phép tính overlap.
3. **Phải nạp bằng chứng SoC AI on Edge thành claim thật** ở registry CUNG. Đây là cạnh CUNG-CẦU tốt nhất đang có bằng chứng tier A mà lại đang nằm ngoài registry.
4. Đổi rule là **tăng ENGINE_VERSION**, theo đúng điều kiện tiên quyết số 2 đã ký ở 04. Và báo cáo vòng sau phải ghi rõ: đã thấy kết quả vòng này trước khi sửa.

## Không ký

Match duy nhất là rác. **Đề nghị Lâm KHÔNG ký MATCH-0001.** Cổng `SIGNOFF_PENDING` đang giữ nó lại đúng chức năng, không có output nào được trình ra ngoài.

## Lệnh tái lập

```
cd /Users/os/CaoLocMatch
python3 build_cncl_match.py                                   ; echo $?
python3 match_engine.py run domains/cncl_match                ; echo $?
python3 match_engine.py validate domains/cncl_match out/matches.jsonl --require-signoff ; echo $?
```
