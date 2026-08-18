# Đồng bộ bản chụp: biến thứ phải nhớ thành thứ máy làm

Ngày: 16/08/2026.

## STATUS

**PASS.** Cả hai răng cắn, toàn bộ chuỗi cổng ở hai kho xanh.

```
RANG 1 · cuu duoc ban cu   : CAN OK (tu cap nhat, khong SPAN_LOST)
RANG 2 · khong suy bien    : CAN OK (exit 2, tu choi chay tiep)
```

## Vấn đề

Hai vòng liên tiếp vấp cùng một bẫy. Sửa bản chụp ở `CNCLData`, chạy `build_cncl_match.py`
thì nó đọc bản chụp **cũ** còn nằm trong `domains/cncl_match/snapshots` và báo hàng loạt
`SPAN_LOST`. Lần đầu ở vòng viết tài liệu trạng thái, lần hai ở vòng sửa 7 câu cuối.

Không lần nào hỏng dữ liệu, vì cổng tự kiểm chặn đúng và không ghi gì. Nhưng đó là may mắn
có tổ chức, không phải thiết kế. Thứ phải nhớ hai lần thì thuộc loại phải tự động hoá.

## Cách làm

Thêm `dong_bo_snapshot()` chạy **trước** cổng tự kiểm. Hai luật, cả hai đều nhằm không tạo
đường rò:

**Luật một: bản chụp gốc thiếu thì FAIL.** Không được lặng lẽ dùng bản cũ còn nằm trong miền
dẫn xuất. Nếu thiếu điều kiện mà hệ vẫn chạy tiếp thì chỗ suy biến đó chính là đường rò: bản
chụp gốc biến mất là dấu hiệu nghiêm trọng, và cách xử lý đúng là dừng chứ không phải xoay
sang bản dự phòng.

**Luật hai: mỗi lần chép đè đều in tên file.** Đồng bộ im lặng làm mất dấu vết một sự thật
quan trọng, rằng bản chụp vừa đổi chữ, tức mọi thứ tựa vào nó cần được nhìn lại. Dòng in ra
nói thẳng điều đó thay vì chỉ báo "đã đồng bộ".

```
SNAPSHOT: 30 can · them 0 · cap nhat 1 · thieu 0
  [CAP NHAT] vjst_viettel_llm_20260718.html  (ban chup goc da doi chu, moi thu tua vao no can nhin lai)
```

## Răng phải tự chứng minh nó cắn

`bite_dong_bo_snapshot.py` dựng lại đúng hai tình huống trên dữ liệu thật:

Răng một làm bản chụp bên miền dẫn xuất cũ đi rồi chạy build. Trước khi có đồng bộ, đây đúng
là ca nổ 21 lỗi `SPAN_LOST`. Nay build tự cập nhật và chạy xong.

Răng hai giấu bản chụp **gốc** đi trong khi bản cũ vẫn nằm ở miền dẫn xuất, tức bày sẵn cái
bẫy để hệ đi đường tắt. Build phải exit 2.

Răng hai quan trọng hơn răng một. Răng một chỉ tiết kiệm thời gian; răng hai giữ tính trung
thực. Một đồng bộ chỉ biết chép mà không biết từ chối thì nó không phải cổng, nó là tiện ích.

## Sửa kèm: đường dẫn chạy được ở cả hai môi trường

`build_cncl_match.py` neo cứng gốc `/sessions/.../mnt`. Chạy từ máy anh qua Claude Code sẽ
gãy, và gãy ở chỗ khó đoán vì lỗi hiện ra là "thiếu bản chụp" chứ không phải "sai đường dẫn".

Hàm `goc()` thử lần lượt `/Users/os` rồi `/sessions/<phiên>/mnt`, không gốc nào có thì báo
ngay lúc nạp kèm câu nhắc kiểm tra đang chạy ở môi trường nào. `bite_dong_bo_snapshot.py`
nhập thẳng `SUP` và `DST` từ đó, không giữ bản sao đường dẫn thứ hai.

## Trạng thái toàn chuỗi sau vòng này

```
CNCLData    refinery=0  bites=0  luat3=0  dash=0  fidelity: 115 khop / 0 lech
CaoLocMatch build=0  refinery=0  run=0  restore=0
            VALIDATE PASSED · 12 match · 0 gate bites · signoff THAT du
            MATCH BITES: TAT CA RANG CAN
            BITE KHOA BANG CHUNG: RANG CAN
            BITE DONG BO SNAPSHOT: RANG CAN
```

## Lệnh

```
cd /Users/os/CaoLocMatch
python3 build_cncl_match.py
python3 bite_dong_bo_snapshot.py ; echo $?
```
