# Vòng làm mới thứ hai: năm đơn vị trong match đã ký

Ngày: 18/08/2026.

## STATUS

**Dữ liệu xong. Chuỗi cổng ĐANG ĐỎ ở đúng một chỗ, và nó chờ anh.**

```
do_tuoi_nguon   : XANH  36 chua co ly do · 10 co ly do nguoi viet   (44 -> 36)
restore_signoff : DO    gan lai 12/13 chu ky
validate_ky     : DO    [SIGNOFF_PENDING] MATCH-0007 chua co nguoi ky
```

Đỏ ở đây là trạng thái đúng. Nguồn mới sinh ra một match mới, và máy không được tự ký.

## Kết quả từng đơn vị

| Đơn vị | Tuổi cũ | Kết quả |
|---|---|---|
| FPT Semiconductor | 295 ngày | **Có nguồn mới** vjst.vn 15/06/2026, 64 ngày |
| ROSTEK | 1688 ngày | Không có nguồn đủ cấp, ghi lý do giữ nguồn cũ |
| Đông Anh (EEMC) | 610 ngày | Không có nguồn mới hơn, ghi lý do giữ nguồn cũ |
| CT Semiconductor | 295 ngày | Không có nguồn mới hơn, ghi lý do kèm **một cảnh báo** |
| Tập đoàn Viettel | 202 ngày | Không cần, claim vốn ghi rõ là thoả thuận |

Bốn trên năm không phải vì lười tìm. Chúng thuộc một loại mà vòng này mới nhìn ra.

## Điều học được: sự kiện đã xảy ra thì không hết hạn

Cổng độ tuổi chia trường bền và trường mau hỏng. Nhưng ranh giới thật không nằm ở tên
trường, nó nằm ở **câu đó khẳng định một sự kiện hay một trạng thái**.

"Xuất xưởng máy biến áp 500kV-3x300MVA ngày 16/12/2024, đạt toàn bộ hạng mục thử nghiệm IEC"
là một sự kiện. Nó đã xảy ra. Bài báo cũ đi 610 ngày không làm nó sai. Tương tự với ROSTEK,
với mốc "doanh nghiệp Việt đầu tiên thiết kế chip thương mại" của FPT Semiconductor, và với
lễ ký thoả thuận FPT với Viettel.

Cái thật sự hết hạn là câu dạng "đang dẫn đầu", "công suất hiện tại là", "sắp ra mắt". Bốn
đơn vị trên đều rơi vào loại thứ nhất, nên miễn trừ là câu trả lời đúng chứ không phải lối
thoát. Mỗi miễn trừ đều ghi rõ đã tìm ngày nào, tìm thấy gì, và vì sao vẫn giữ.

Tôi không sửa cổng để tự động phân biệt hai loại này. Phân biệt sự kiện với trạng thái là
việc đọc hiểu, không phải việc so chuỗi, và một cổng đoán sai chỗ đó sẽ tha nhầm thứ đáng
phải bắt. Cơ chế `GIU NGUON CU:` bắt người viết ra lý do là đúng mức.

## Một cảnh báo phải nói ra, không được để lẫn vào

Claim của CT Semiconductor chứa cụm **"dự kiến cho ra đời con chip Made by Vietnam đầu tiên
trong năm 2025"**. Đó là một dự báo, và nay đã tới hạn. Tôi tìm nhưng chưa thấy nguồn tier A
hoặc B nào xác nhận hay bác bỏ việc đó.

Registry đang giữ một lời hứa quá hạn mà không biết nó thành hay không. Đây là chỗ dễ sai
nhất khi trình ra ngoài, vì câu đọc lên nghe như một thành tựu. Đã ghi thẳng vào ghi chú của
claim, kèm chữ "LUU Y PHAI KIEM".

## Match mới, và một câu hỏi thiết kế cho anh

Fact năng lực mới của FPT Semiconductor sinh ra **MATCH-0007**: FPT Semiconductor với sản
phẩm 23 chip chuyên dụng, điểm 0,88, neo nhóm 6 với 6.

Vấn đề: **MATCH-0005 đã là đúng cặp đó**, anh ký ngày 16/08, điểm cũng 0,88. Hai dòng khác
nhau vì dựa trên hai câu bằng chứng khác nhau, nên khoá nội dung khác nhau.

Đứng ở góc kỷ luật thì đúng: mỗi match là một chuỗi bằng chứng, hai chuỗi thì hai dòng. Đứng
ở góc người đọc thì rối: cùng một kết luận hiện hai lần, và số match sẽ phình theo số nguồn
chứ không theo số cặp thật.

Tôi không tự quyết. Ba đường:

**Một, anh ký MATCH-0007.** Registry có hai dòng cho cùng một cặp, mỗi dòng một bằng chứng
độc lập. Mạnh về chứng cứ, rối về trình bày.

**Hai, anh từ chối MATCH-0007** kèm lý do trùng cặp. Sổ ghi lại, và cặp này bị chặn ở tầng
engine. Nhưng khi nào nguồn cũ hỏng thì bằng chứng mới cũng mất theo.

**Ba, đổi engine gộp các match cùng cặp thành một dòng nhiều bằng chứng.** Đúng nhất về lâu
dài, nhưng đụng vào khoá chữ ký nên phải làm cẩn thận và không nên làm trong lúc đang vội.

Tôi nghiêng về đường ba, và trong lúc chưa làm thì chọn đường một để không mất bằng chứng.

## Lệnh

Ký thì:

```
cd /Users/os/CaoLocMatch
python3 match_engine.py sign out/matches.jsonl "Lam Nguyen" 2026-08-18 --only MATCH-0007 --domain domains/cncl_match
```

Từ chối thì:

```
python3 match_engine.py reject out/matches.jsonl "Lam Nguyen" 2026-08-18 --ids MATCH-0007 \
  --reason "Trung cap voi MATCH-0005, giu mot dong cho moi cap" --domain domains/cncl_match
```

Sau đó chạy `./chay_het_cong.sh` để xác nhận về xanh.
