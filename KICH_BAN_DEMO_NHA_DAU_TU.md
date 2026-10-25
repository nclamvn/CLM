# Kịch bản demo nhà đầu tư · 10 phút

Bản 25/10/2026, thay bản 22 trong KnowledgeBase (ngày 29/09, đã cũ: cổng 3000, mục đã gỡ, Hub minh hoạ đã bỏ). Kịch bản không ghi số: trang luôn đúng hơn tài liệu, người trình bày đọc số trên màn.

## Trước buổi demo (10 phút)

1. Chạy chuỗi đầy đủ để trang ghi đúng lần kiểm định của mã đang chạy:
   `cd ~/CLM/CaoLocMatch && bash chay_het_cong.sh`
2. Dựng và mở web:
   `cd ~/CLM/.touch && npx next build && npx next start -p 3200`, rồi mở `http://localhost:3200` toàn màn hình.
3. Thử trước một lần nút "Kiểm lại ngay trên trình duyệt" ở một hồ sơ đơn vị (gợi ý: Công ty An ninh mạng Viettel), để chắc mạng và bản chụp đều sẵn.

## Thông điệp một câu

Mỗi con số trên hệ bấm được, và bấm là ra câu nguồn nguyên văn. Máy cào, lọc, đề xuất; người duyệt lô và người gác cổng ký; một chuỗi kiểm định chặn mọi con số không truy được về nguồn.

## Đường đi

| # | Màn | Thời lượng | Làm gì | Câu nói | Số đọc trên màn |
|---|---|---|---|---|---|
| 0 | Trang đầu `/` | 40 giây | Để hình tự vẽ hai, ba match | "Mỗi vạch là một thực thể có thật; nét trắng là một match đã có người ký, và đây là hai câu nguồn nó dựa vào." | bốn số dưới tiêu đề, nhất là nhu cầu đặt hàng thật và số bên đặt hàng |
| 1 | Tổng quan | 1 phút | Chỉ thẻ "nhu cầu đặt hàng thật", rồi khung "Việc cần làm tiếp" | "Hệ tự khai điểm yếu: việc nào về 0 thì tự biến mất." | số đơn vị, câu nguồn, match đã ký, việc quá hạn của mũi nhọn |
| 2 | Cầu thật | 1,5 phút | Mở một nhu cầu của Hà Nội (btl-01 ùn tắc giao thông) | "Đây là bài toán có bên đặt hàng thật, câu nguồn từ văn bản của chính họ. Gợi ý đơn vị ghi rõ chưa ký, không phải cặp ghép." | số nhu cầu, số bên đặt hàng |
| 3 | Hỏi đáp | 1,5 phút | Bấm "Hà Nội cần gì?", rồi "Ai làm được UAV?", rồi gõ "Ai cần tàu ngầm?" | "Hỏi về cầu thì ra nhu cầu, hỏi về cung thì ra đơn vị, đều bằng câu nguồn nguyên văn. Không có nguồn thì máy từ chối." | số nhu cầu trả về; câu từ chối |
| 4 | Điều phối | 1,5 phút | Chỉ phễu mũi nhọn và hàng việc theo người | "Từ cầu tới hợp đồng có sáu bước; hệ chỉ ghi việc người đã làm vào một sổ nối băm, không sửa lén được." | số nhu cầu trong mũi nhọn, số có ứng viên, số việc quá hạn |
| 5 | Hồ sơ đơn vị | 2 phút | Mở bản chụp một câu năng lực; bấm "Kiểm lại ngay trên trình duyệt" | "Trình duyệt của anh chị vừa tự tải lại bản chụp và tính lại mã. Hồ sơ gửi đi ai cũng kiểm lại được, không cần tin chúng tôi." | mã kiểm toán, số bản chụp trùng dấu vết |
| 6 | Ghép cung cầu | 1 phút | Đọc phễu từ trên xuống | "Máy chặn cặp khác lĩnh vực trước khi tính điểm; chỉ cặp đủ câu nguồn mới tới người ký." | cặp khả dĩ, qua neo, qua ngưỡng, đã ký |
| 7 | Phương pháp | 1 phút | Chỉ dòng dữ liệu sáu tầng, bảng kiểm định, lịch sử duyệt lô | "Đây là kiến trúc trên một trang. Lời duyệt của từng lô giữ nguyên văn." | số cổng, số phép thử cài lỗi, số lô đã duyệt |
| 8 | Báo cáo khoảng trống | 30 giây | Bấm in hoặc lưu PDF | "Báo cáo theo quý, mọi số đếm lại độc lập." | |

## Câu hỏi khó và câu trả lời thẳng

- **Đã có giao dịch nào chưa?** Chưa. Sổ sự kiện điều phối đang rỗng; hệ không tự ghi việc chưa xảy ra. Bước kế tiếp là gửi lời giới thiệu cho các cặp người gác cổng đã duyệt trong mũi nhọn Hà Nội.
- **Định danh pháp nhân?** Chưa đơn vị nào định danh qua cổng chính thức vì cổng có captcha và máy không vượt captcha. Phiếu tra cổng đã sẵn cho người tra; trang tổng hợp tư nhân không được dùng.
- **Dữ liệu có cũ không?** Có một phần, và trang nói ra: câu nguồn quá 180 ngày hiện thành việc cần làm, số đó chỉ được giảm, tăng thì phải ghi lý do.
- **Ghép có hiểu nghĩa không?** Chưa. Gợi ý cho cầu thật đang dựa trên khớp từ khoá, ghi rõ là gợi ý. Ghép có điểm cho cầu thật là gói việc kế tiếp.
- **Ai ký?** Hiện một người gác cổng, và hệ chặn người đó ký cặp có đơn vị mình liên quan. Số người ký tối thiểu là một tham số; có người thứ hai thì bật luật hai người ký.

## Không làm trong buổi demo

- Không mở trang Kho mã (trang kỹ thuật, tiêu đề commit không dấu).
- Không đọc số từ tài liệu này; số nào cũng đọc trên màn.
