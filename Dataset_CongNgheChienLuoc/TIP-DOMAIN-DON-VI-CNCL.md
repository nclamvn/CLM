# TIP · Domain refinery `don_vi_cncl`: đơn vị Việt Nam theo 10 nhóm công nghệ chiến lược

Chủ thầu ra 18/07/2026. Đây là core logic tạo dataset cho nhánh làm giàu chủ động: biến khung xương danh mục (Dataset_CongNgheChienLuoc, 124 claim tier A, 4 tầng: danh mục, chương trình, hạ tầng, bộ máy điều hành) thành dataset SỐNG về các đơn vị VN có năng lực theo từng nhóm công nghệ. Chính là chiều CUNG của CàoLọcMatch trên một domain quốc gia.

## Goal
Registry chứng-minh-được về doanh nghiệp, viện, trường VN chủ lực theo từng nhóm trong 10 nhóm công nghệ chiến lược (QĐ 21/2026/QĐ-TTg), mỗi fact có evidence_span, tier, snapshot, truy được về nguồn.

## Định tuyến và quyền (luật 9.7, khai tường minh)
- Workspace MỚI: `/Users/os/CNCLData` (git riêng). KHÔNG chạy trong CaoLocMatch (workspace PoC solo entrepreneur, cấm trộn domain) và KHÔNG trong rtr-news (TSW UAV site).
- Copy VERBATIM methodbox từ `/Users/os/CaoLocMatch/methodbox/` (new_domain.py, refinery.py, bites.py) + `check_dash.py`. Không sửa byte.
- Đầu vào tham chiếu: `KnowledgeBase/Dataset_CongNgheChienLuoc/` (registry khung + claims + snapshots). Chỉ ĐỌC, không sửa.

## Constraints
- Kỷ luật refinery đầy đủ: snapshot trước khi trích, evidence_span verbatim, tier theo bản chất nguồn (A gov/kiểm định, B báo ngành/hiệp hội/analyst, C tự khai), honest-null, disputed giữ trọn, phân bố kèm mẫu số.
- `domain.yaml`: schema.fields (ten_don_vi, loai_hinh [DN/viện/trường], nhom_cncl [1..10 theo QĐ 21/2026], san_pham_lien_quan [1..30], nang_luc_mo_ta, bang_chung_nang_luc [dự án/sản phẩm/chứng nhận], location, source); rollup theo nhom_cncl; universe.estimate PER NHÓM, honest-null nếu chưa ước được, cấm công bố % thiếu mẫu số; alias_map cho biến thể tên doanh nghiệp (VD Viettel/Tập đoàn Công nghiệp Viễn thông Quân đội); ambiguous_clusters cho các tên dễ nhầm.
- Zero-fab: KHÔNG suy diễn "hãng X chắc làm AI". Một đơn vị chỉ vào registry khi có bằng chứng năng lực trích được nguyên văn.
- RtR: được phép có mặt ở nhóm 9 / sản phẩm 22 NHƯNG fact về RtR phải cùng chuẩn evidence như mọi đơn vị khác, cổng FAIRNESS: record thiên về RtR phải khai favors=rtr.
- Luật đứng: lệnh gate không pipe, exit code đọc trần. 0 em-dash và en-dash trong file Thợ sinh.

## Kế thừa khuôn chất lượng (3 luật + gate 2 răng)
Domain `don_vi_cncl` kế thừa nguyên 3 luật sinh ra từ 3 vòng cào Dataset_CongNgheChienLuoc:
1. Span verbatim: mọi evidence_span là chuỗi con nguyên văn của snapshot nó trỏ tới. Gate tự cắn.
2. ID duy nhất: không trùng id trong claims.jsonl. Gate tự cắn (răng DUPLICATE_ID).
3. Value trong span: value của một claim không khai nhiều hơn điều span của nó chứng minh; một fact = một claim = một span liền mạch (atomic). Luật này KHÔNG substring-check được, nên là kỷ luật người cộng review ở cổng X-Ray, KHÔNG phải răng tự động. Đừng nhầm "gate xanh" là đã thoả luật 3.
- Gate chuẩn của domain (ĐÃ SỬA 18/07 khi chạy thật): domain refinery dùng schema LỒNG `capture.snapshot` và KHÔNG có field `id`, nên `check_spans.py` (viết cho schema PHẲNG `snapshot`+`id` của dataset khung) KHÔNG chạy trên domain này. Thay vào đó: luật 1 (span verbatim) do chính `refinery.py` gánh qua gate SPAN_NOT_FOUND (chuẩn hoá NFC + unescape, nghiêm hơn check_spans); luật 2 (ID duy nhất) N/A vì domain không khoá bằng id (build gộp theo entity+field, auditor bắt entity mồ côi/lệch); luật 3 (value trong span) vẫn là review người ở cổng X-Ray. Lệnh gate của domain: `python3 methodbox/refinery.py domains/don_vi_cncl; echo $?` (exit trần, PASS=0) và `python3 methodbox/bites.py domains/don_vi_cncl` (mọi răng phải CẮN). check_spans.py giữ nguyên vai gate cho dataset khung phẳng, không port sang đây.

## Phân pha
- **Pha 1 (pilot, TIP này):** 2 nhóm trước: Nhóm 9 hàng không vũ trụ (RtR am hiểu nhất, dễ thẩm) + Nhóm 1 công nghệ số (dày đơn vị nhất). Mỗi nhóm 15-30 đơn vị, 5+ nguồn/nhóm. Chạy trọn 7 giai đoạn + bites.
  - Kỳ vọng trung thực: dataset chỉ bắt được đơn vị ĐÃ được ghi công khai là có năng lực, KHÔNG phải 140 slot sẽ-được-giao trong tương lai. Sản lượng Pha 1 phụ thuộc độ dày tài liệu công khai hiện có; nếu một nhóm mỏng nguồn thì khai honest-null số lượng, KHÔNG ép cho đủ 15-30. Con số 15-30 là trần kỳ vọng, không phải hạn ngạch phải đạt.
- **Pha 2 (sau VERIFY Pha 1):** 8 nhóm còn lại, cùng khuôn.

## Seed nguồn Pha 1 · ĐÃ DUYỆT 18/07/2026 (chốt theo chỉ đạo Chủ nhà "soạn TIP"; muốn gạch/thêm seed thì báo trước khi Thợ cào)
Nhóm gov (tier A):
1. mst.gov.vn (Bộ KH&CN): tin đơn vị được giao nhiệm vụ CNCL, 9 phòng thí nghiệm trọng điểm, 6 sản phẩm ưu tiên tài trợ đặt hàng.
2. nafosted.gov.vn: chương trình Công nghệ chiến lược, danh sách nhiệm vụ/đơn vị được tài trợ (bổ sung theo khuyến nghị Chủ thầu, đã duyệt).
3. baochinhphu.vn chuyên mục công nghệ chiến lược (3 bài seed đã định vị trong snapshot toanvan: Tổ công tác CNCL, 6 SP ưu tiên, 9 PTN trọng điểm).
Nhóm hiệp hội và báo ngành (tier B):
4. Hiệp hội ngành: VINASA (công nghệ số); hiệp hội hàng không vũ trụ nếu có.
5. vjst.vn (Tạp chí KH&CN VN); báo công nghệ uy tín (tier B).
Nhóm tự khai (tier C):
6. Trang tự giới thiệu của đơn vị: chỉ làm claim tự khai, không làm bằng chứng chính.

## Success criteria
- Bites: toàn bộ răng refinery core cắn trên bản sao (exit 2 đọc trần) trước khi báo bất kỳ con số nào.
- Mỗi đơn vị trong registry: >= 1 fact năng lực có evidence_span verbatim + tier + snapshot; đơn vị chỉ có nguồn tự khai thì toàn bộ ở state claim.
- Phân bố đơn vị theo nhóm công bố kèm mẫu số hoặc honest-null mẫu số.
- Báo cáo disputed và honest-null trung thực, không lấp.
- Completion Report định lượng chuẩn Phase A: bảng răng + exit code, thống kê registry (đơn vị/nhóm, %tier, disputed, null), lệnh tái lập, decisions log.

## Non-goals
Không matching (chưa có chiều cầu); không xếp hạng đơn vị; không kết luận "ai mạnh nhất"; không nạp vào TSW hay kernel (muốn nạp là vòng đề xuất riêng có người gác).

## Cổng X-Ray của Chủ thầu
Tự chạy lại bites; chọn ngẫu nhiên 5 đơn vị truy fact về snapshot; kiểm mọi record favors=rtr; kiểm phân bố có mẫu số.

## Lệnh khởi động (thứ tự khoá, Thợ chạy đúng trình tự)
1. `mkdir /Users/os/CNCLData` + git init. Workspace riêng, không đụng CaoLocMatch (PoC) lẫn /Users/os/RtR/rtr-news (TSW).
2. Copy verbatim `methodbox/{new_domain,refinery,bites}.py` (từ CaoLocMatch/methodbox/) + `check_dash.py` (từ root CaoLocMatch) + `check_spans.py` (từ KnowledgeBase/Dataset_CongNgheChienLuoc, gate 2 răng). Không sửa byte.
3. Chạy bites trên bản tiêm lỗi TRƯỚC (exit 2 đọc trần, không pipe) làm bằng bộ răng cắn, rồi mới báo bất kỳ con số nào.
4. Pha 1: scaffold domain, cào theo seed đã duyệt, hai nhóm pilot (Nhóm 9 hàng không vũ trụ + Nhóm 1 công nghệ số, 15-30 đơn vị/nhóm), cổng FAIRNESS bắt mọi record thiên RtR khai favors=rtr.
5. Trước khi báo số: chạy CẢ refinery.py (clean PASS exit0, gồm SPAN_NOT_FOUND + auditor + idempotent) VÀ bites.py (mọi răng CẮN, exit trần). Nộp Completion Report định lượng chuẩn Phase A (bảng răng bites + exit code refinery, thống kê registry, lệnh tái lập, decisions log). Chủ thầu X-Ray theo cổng ở trên. Escalation theo 6 lằn nếu chạm.
