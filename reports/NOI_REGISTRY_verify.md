# Nối registry thật vào .touch

Ngày: 18/08/2026.

## STATUS

**PASS về dữ liệu và cổng. CHƯA soi được bằng mắt trong môi trường này.**

```
tsc          : OK
check-emdash : OK (0 em-dash U+2014)
check-tokens : 0 hard violation
next build   : /dashboard/registry 2,66 kB · /dashboard/matching 6,03 kB
chay_het_cong.sh : 16 o xanh
```

Kiểm DOM trên bản đã build và chạy thật:

```
registry : 42 the details · 200 lien ket bang chung · 37 ban chup · ca hai chieu CUNG va CAU
matching : 12 hang match · chu ky Lam Nguyen · 0 chu "DEMO" · 0 nut Approve/Reject
evidence : /evidence/*.txt tra ve 200
```

## Đã làm gì

**Bộ sinh `scripts/gen-cncl-data.mjs`.** Đọc thẳng bốn nguồn thật rồi ghi ra `lib/cncl-registry.ts`,
`lib/cncl-match.ts` và `public/evidence/`. Số liệu cũ trên web là bản chụp ngày 18/07 với 14 đơn
vị và 64 claim; nay là 42 đơn vị, 200 claim, 30 nhu cầu, 12 match đã ký.

Ba luật của bộ sinh:

Bản chụp gốc thiếu thì **FAIL**, không lấy bản cũ trong `public/evidence` để chạy tiếp. Cùng kỷ
luật với `dong_bo_snapshot()` bên `build_cncl_match.py`.

Chỉ match **có chữ ký thật trong sổ** mới được lên web. Web là chỗ trình ra ngoài, nên ngưỡng ở
đây phải cao hơn ngưỡng trong máy.

Mọi số đều tính từ file. Bản PDF trạng thái đã từng ghi "1 vi phạm" trong khi số thật là 26, đúng
vì gõ tay.

**Bên CẦU dùng luật ưu tiên của engine chứ không tự chế.** Mỗi sản phẩm có hai bản wording, bản
`-A` là chữ chính thức baochinhphu, bản kia là báo thuật lại. Nếu web tự chọn kiểu khác thì tên
sản phẩm trên trang sẽ lệch với tên engine dùng để match, và không ai phát hiện ra vì cả hai đều
"đúng". Bộ sinh chép đúng luật trong `build_cncl_match.py`.

**Ô tra cứu lọc tức thời.** Gõ tới đâu lọc tới đó trên 42 đơn vị, kèm lọc theo nhóm công nghệ và
cấp nguồn, chuyển qua lại giữa bên CUNG và bên CẦU. Không khớp thì nói rõ đã lọc những gì, và nói
thêm rằng không có kết quả là một câu trả lời thật chứ không phải lỗi.

## Quyết định đáng tranh luận: bỏ hai nút Approve và Reject

Bản DEMO cũ có hai nút ghi UI-state kèm ghi chú bắt buộc, có nhãn nói rõ là demo. Khi match còn
là minh hoạ thì vô hại.

Nay match là thật và đã có chữ ký thật trong sổ, hai nút đó trở thành **đường ký thứ hai**: yếu
hơn đường thật vì không qua cổng, không vào sổ, không có khoá bằng chứng, nhưng nhìn giống hệt.
Người dùng bấm xong sẽ tưởng mình vừa duyệt một match.

Đây đúng loại lỗi mà `bang_chung_digest` vừa được dựng ra để chặn: một chữ ký tồn tại mà không
neo vào câu làm bằng nào. Nên tôi bỏ hẳn hai nút thay vì nối chúng vào engine.

Màn này giờ **chỉ đọc**. Nó hiện chữ ký, ngày ký, và khoá bằng chứng, kèm câu nói thẳng rằng chữ
ký chỉ sinh ra từ lệnh `sign` của engine. Đó là ranh giới, không phải thiếu tính năng.

## Nới cổng em-dash ở .touch

`check-emdash.mjs` đang cấm cả en-dash U+2013 theo quyết định 14/07. Anh đã nới luật từ 16/08,
`CNCLData/check_dash.py` sửa rồi nhưng .touch thì chưa.

Lý do thứ hai nặng hơn lý do đồng bộ: từ hôm nay `lib/cncl-registry.ts` chứa **câu trích nguyên
văn** từ nguồn thật. Một trong số đó có en-dash, ví dụ câu về VSAP LAB. Bắt cổng này cấm en-dash
trong đó nghĩa là ép sửa chữ của nguồn để qua cổng, tức phạm đúng cái lỗi mà ba vòng vừa rồi bỏ
công sửa. **Cổng văn phong không được phép đè lên cổng nguyên văn.**

## Điều chưa làm được

**Chưa soi bằng mắt.** Playwright cần `libXdamage1` và môi trường này không có quyền cài gói hệ
thống. Tôi không dựng bản giả để lách, vì bài học 27/07 nói rõ máy chạy chính là máy thật.

Kiểm DOM chứng minh **nội dung** đúng: đủ 42 thẻ, đủ 200 liên kết, đúng chữ ký, sạch chữ DEMO.
Nó **không** chứng minh bố cục không vỡ. Lệnh để anh tự soi:

```
cd /Users/os/.touch
npm run build && npx next start -p 4187 &
node scripts/shot.mjs http://localhost:4187/dashboard/registry reports/registry-1536.png
node scripts/shot.mjs http://localhost:4187/dashboard/matching reports/matching-1536.png
```

**Chưa deploy.** Website vẫn chỉ chạy local, đúng như trạng thái từ 17/07.

## Lệnh

```
cd /Users/os/.touch
node scripts/gen-cncl-data.mjs   # sinh lai sau moi lan registry doi
npm run build

cd /Users/os/CaoLocMatch
./chay_het_cong.sh               # 16 o, gom ca buoc sinh du lieu web
```
