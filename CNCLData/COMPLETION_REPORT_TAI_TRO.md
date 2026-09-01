# Suýt nạp một bài có tài trợ

Ngày: 24/08/2026.

## STATUS

**PASS.** 22 ô xanh. Thêm một cổng, và nó ra đời từ một lần suýt sai chứ không từ một buổi
ngồi nghĩ ra rủi ro.

## Chuyện xảy ra

Đi truy cụm chữ nguy nhất còn lại trong registry: claim của CT Semiconductor chứa
**"dự kiến cho ra đời con chip Made by Vietnam đầu tiên trong năm 2025"**. Một dự báo đã tới
hạn, đang nằm trên màn khách nhìn, và đọc lên nghe như một thành tựu.

Tìm được một bài trên `nhandan.vn` ngày 20/08/2026, đúng chủ đề chuỗi giá trị bán dẫn, mới
bốn ngày, đúng cấp nguồn. Gần như đủ điều kiện nạp.

Ngay dưới tên chuyên mục có một dòng chữ nhỏ: **"Nội dung có tài trợ"**.

## Vì sao đó là ranh giới cứng

Bài tài trợ do doanh nghiệp trả tiền đăng. Nó không nói sai sự thật, nhưng nó **không phải
báo chí độc lập**, mà toàn bộ giá trị của tier A và tier B nằm đúng ở chỗ nguồn độc lập với
đơn vị được nói tới. Nạp nó rồi ghi tier B là biến một thông cáo báo chí thành xác nhận của
tờ báo.

Cái bẫy rất kín: bài nằm trên đúng tên miền tier B, đúng tác giả, đúng định dạng, đúng
chuyên mục. Chỉ một dòng chữ nhỏ phân biệt. Người cào vội sẽ không nhìn thấy dòng đó.

Nội dung bài cũng cho thấy vì sao phải cẩn thận: nó dành phần lớn cho FPT, và dẫn
**"FPT xác định đây là nhà máy kiểm thử, đóng gói đầu tiên tại Việt Nam do người Việt làm
chủ"**. Trong khi claim của CT Semiconductor cũng nhận vị trí đầu tiên ở khâu ATP. Hai bên
cùng nhận "đầu tiên", và bài tài trợ chỉ kể một phía.

## Cổng

`check_tai_tro.py` quét mọi bản chụp tìm dấu hiệu tài trợ, tiếng Việt lẫn tiếng Anh. Claim
nào trích một bản chụp có dấu hiệu thì phải hoặc để tier C, hoặc ghi `NOI DUNG TAI TRO:` kèm
lý do vẫn dùng được. Không thì cổng nổ.

Đã thử bằng cách ném một bản chụp có dấu hiệu vào bản sao: cổng chỉ đúng claim vi phạm và
exit 2. Trên dữ liệu thật hiện tại: 33 bản chụp, 0 dấu hiệu.

**Giới hạn phải nói ra:** cổng chỉ thấy dấu hiệu **nằm trong bản chụp**. Bài tài trợ không
ghi nhãn, hoặc người ghi snapshot cắt mất dòng đó, thì cổng không biết. Nó thu hẹp cửa chứ
không khoá được cửa.

## Kết quả truy CT Semiconductor

**Vẫn chưa có nguồn tier A hoặc B độc lập** xác nhận hay bác bỏ việc con chip đó ra đời.
Bài gần nhất đúng chủ đề là bài tài trợ nói trên, đã loại, và nó cũng không nhắc CT
Semiconductor.

Đã ghi toàn bộ kết quả này vào ghi chú của chính claim đó, gồm cả chuyện hai bên cùng nhận
"đầu tiên". Kết luận giữ nguyên và ghi thẳng: **cụm dự kiến đó vẫn là một lời hứa quá hạn,
tuyệt đối không được đọc như một thành tựu khi trình ra ngoài.**

Không tìm ra nguồn mới thì ghi lại việc không tìm ra, không im lặng để nó trôi.

## Điều đáng giữ

Cổng này không đến từ một buổi liệt kê rủi ro. Nó đến từ một lần suýt sai, và nó được viết
ngay lúc còn nhớ rõ mình suýt sai ở đâu. Ba cổng gần đây đều vậy: cổng độ tuổi ra đời khi
con số ước lượng lệch con số máy đếm, cổng gốc đường dẫn ra đời khi script sập trên máy thật,
cổng này ra đời khi một dòng chữ nhỏ cứu một quyết định sai.

## Lệnh

```
cd /Users/os/CNCLData
python3 check_tai_tro.py domains/don_vi_cncl ; echo $?

cd /Users/os/CaoLocMatch
./chay_het_cong.sh    # 22 o
```
