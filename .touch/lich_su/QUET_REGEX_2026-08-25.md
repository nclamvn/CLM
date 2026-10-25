# Quét ba kho: nơi nào còn đọc file cấu trúc bằng regex

Ngày: 25/08/2026.

## STATUS

**32 ô, 32 xanh.** Quét 53 script trong ba kho. Tìm thấy **5 chỗ**, xử hết, thêm một cổng mới
để chỗ vừa gỡ không đẻ ra rủi ro khác.

## Vì sao quét

Một giờ trước, cổng `check_ap_luat_deu.py` mới viết đã **báo XANH trên một file YAML hỏng**. Nó
đọc bằng regex nên vẫn rút được mảnh cần; cổng `refinery.py` phía sau mới nổ vì nó dùng parser
thật.

**Một cổng đọc file cấu trúc bằng regex có thể XANH HƠN CẢ PARSER.** Nó nói dối theo hướng
nguy nhất: báo an toàn trên một file mà hệ thống thật không đọc nổi. Đó không phải chuyện riêng
của một cổng, nó là một **lớp lỗi**, nên phải quét cả ba kho.

## Tìm thấy gì

### 1. `check_do_tuoi.py` đọc `domain.yaml` bằng hai biểu thức chính quy

Đây là ca nặng nhất: một cổng đang chạy trong chuỗi. Nó rút `refresh_days` bằng regex, nên
`domain.yaml` hỏng cú pháp thì nó vẫn lấy được 180 và vẫn báo xanh.

Trớ trêu: chính docstring của nó tự hào rằng nó **từ chối đoán** giá trị nó không đọc được.
Nó từ chối đoán giá trị, nhưng vẫn đoán rằng file còn đọc được.

Đã đổi sang `yaml.safe_load`. Thử ngược bằng cách chèn một cặp nháy kép lồng vào file: cổng trả
**exit 3, KHÔNG CHẠY ĐƯỢC**, đúng như phải thế.

### 2 tới 5. Bốn script bóc `cnclUnits` ra khỏi `lib/cncl-registry.ts` bằng regex

`check-truong-hien.mjs`, `check-phu-moc.mjs`, `chup_va_do.mjs`, `gen-tracuu-html.mjs`.

Rủi ro ở đây **thấp hơn ca 1** và tôi nói rõ vì sao thay vì thổi phồng: cả bốn đều
`JSON.parse` phần bóc được, nên nội dung vẫn qua một parser thật. Chỉ **ranh giới trích** là
đoán bằng mặt chữ. `gen-tracuu-html.mjs` là bản liều nhất, dùng `;\n` làm dấu kết thúc.

Nhưng "rủi ro thấp" không phải lý do để giữ. **Gỡ nguyên nhân:** `gen-cncl-data.mjs` nay sinh
thêm `lib/cncl-registry.json` và `lib/cncl-match.json` cạnh hai bản `.ts`. Ai cần dữ liệu thì
`JSON.parse`, không ai phải đoán ranh giới nữa. Bản `.ts` vẫn giữ vì Next cần kiểu TypeScript,
nhưng nó **thôi là nguồn đọc của các cổng**.

## Chỗ vừa gỡ đẻ ra một rủi ro mới, và tôi canh luôn

Hai file cùng mô tả một sự thật thì chúng có thể lệch nhau. Và có một kiểu lệch tệ đặc biệt:
**bản `.json` đúng, bản `.ts` cũ.** Khi đó mọi cổng đều xanh vì cổng đọc `.json`, còn trang web
người dùng nhìn thì đọc `.ts`. Bảng báo sạch trong khi web hiện dữ liệu cũ.

Đó đúng là cái bệnh cả ngày hôm nay đi sửa: một phép kiểm nhìn vào một lát cắt rồi được đọc như
thể nó nhìn toàn cảnh.

Cổng `check-lib-song-sinh.mjs` bắt nội dung JSON nhúng trong `.ts` phải **trùng từng ký tự** với
bản `.json`. Cả hai do cùng một lần chạy sinh ra nên trùng tuyệt đối là yêu cầu hợp lý. Thử
ngược bằng cách sửa một tên trong `.ts`: cổng đỏ, gọi đích danh khoá lệch.

## Bốn cái răng gãy, và lần thứ tư trong hai ngày

Đổi nguồn đọc làm **ba bộ răng gãy ngay**: `bite_tracuu` giấu `cncl-match.ts` để thử "mất đầu
vào thì dừng", nhưng bộ sinh nay đọc `.json`; `bite-phu-moc` và `bite-truong-hien` chép sẵn
`.ts` vào cảnh tạm.

Cả ba đều **bám vào một artefact cụ thể thay vì vào hành vi cần đo**. Đây là **lần thứ tư trong
hai ngày** đúng cái bẫy đó, sau răng đòi "tất cả xanh", răng đòi "phải có nhãn chưa duyệt", và
răng gõ cứng con số ngân sách.

Bốn lần cùng một hình dạng nghĩa là nó không phải sơ suất, nó là một thói quen viết răng cần
sửa: **răng phải mô tả hành vi, không mô tả file**.

## Đã làm

```
+ lib/cncl-registry.json, lib/cncl-match.json   ban song sinh do gen sinh ra
+ scripts/check-lib-song-sinh.mjs               cong moi, o thu 32
= check_do_tuoi.py          regex -> yaml.safe_load, hong thi KHONG CHAY DUOC
= check-truong-hien.mjs     doc .json
= check-phu-moc.mjs         doc .json
= chup_va_do.mjs            doc .json
= gen-tracuu-html.mjs       doc .json, bo ham docTS
= bite_tracuu / bite-phu-moc / bite-truong-hien  sua canh theo nguon doc moi
```

## Còn lại, nói thẳng

Bản `.ts` **vẫn chưa có cổng nào kiểm nó biên dịch được**. `npm run build` làm việc đó nhưng
build chỉ chạy khi chụp ảnh màn hình, không nằm trong 32 ô. Một file `.ts` hỏng cú pháp mà nội
dung JSON vẫn khớp thì `check-lib-song-sinh` vẫn xanh.

Đây là món nợ đã biết, ghi ra chứ không giấu. Nó nhỏ hơn cái vừa gỡ vì phần thân `.ts` nay đã
được chứng minh trùng JSON, chỉ còn phần vỏ do bộ sinh viết cứng.
