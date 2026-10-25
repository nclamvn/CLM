# Mẻ hạ tầng, và một luật của chính mình chưa từng ai đối chiếu

Ngày: 24/08/2026.

## STATUS

**24 ô, 23 xanh, 1 ĐỎ.** Ô đỏ là `du_dieu_kien`, và nó đang chờ một quyết định của anh chứ
không phải chờ tôi sửa.

```
do tuoi nguon : 29 -> 24
du dieu kien  : DO · 1 claim can tra loi (FECON)
```

## Việc chính không phải làm mới, mà là một mâu thuẫn

Định cào lại bốn đơn vị hạ tầng cũ nhất. Đọc claim trước khi tìm nguồn thì thấy FECON:

> đơn vị trực tiếp vận hành robot đào ngầm (TBM) số 1 metro Nhổn, ga Hà Nội

Ghi chú của chính claim đó viết: *"QUAN TRONG: FECON VAN HANH may TBM, KHONG che tao. May do
hang nuoc ngoai san xuat."*

Mà `domain.yaml` viết từ đầu:

```
du_dieu_kien       = LAM CHU CONG NGHE: thiet ke, che tao, san xuat, nghien cuu
khong_du_dieu_kien = VAN HANH VA KHAI THAC tren cong nghe do don vi khac lam ra
```

Và luật đó **đã được dùng để loại MobiFone** ngày 16/08, vì MobiFone thương mại hoá 5G bằng
thiết bị mua ngoài.

Nghĩa là người ghi đã **nhìn thấy sự thật, ghi lại trung thực, nhưng không rút ra kết luận mà
luật đòi hỏi**. Registry loại MobiFone nhưng giữ FECON, tức áp luật không đều. Đó là thứ
khách soi hồ sơ sẽ hỏi đầu tiên, và không có câu trả lời nào hay.

## Cổng mới, và nó không kết tội

`check_du_dieu_kien.py` tìm từ khoá vận hành và khai thác trong trường năng lực rồi đối chiếu
với chính luật trong `domain.yaml`. Quét toàn bộ 202 claim: **đúng một ca, FECON**.

Cổng không kết tội, nó **bắt phải trả lời**. Hai đường, cả hai đều là quyết định của người:

**Một, loại FECON khỏi registry**, ghi lý do, giống hệt cách đã làm với MobiFone.

**Hai, giữ lại và ghi căn cứ** theo điều khoản `ranh_gioi_xam` mà domain.yaml đã lường trước:
đơn vị vừa vận hành vừa tự phát triển một phần công nghệ lõi thì xét theo bằng chứng cụ thể
của phần tự phát triển. Nếu FECON có phần tự phát triển trong thi công hầm, ghi ra thì cổng
im.

Tôi không tự chọn. Chọn đường một là xoá một đơn vị khỏi registry, chọn đường hai là nới một
luật đã dùng để loại người khác. Cả hai đều nặng hơn thẩm quyền của máy.

## Ô đỏ này làm lộ một giả định sai trong răng tự kiểm

`bite_chay_het_cong` có răng "không báo đỏ oan", và nó đòi **exit 0, tất cả xanh**. Giả định
ngầm: hệ lúc nào cũng sạch.

Giả định đó vỡ ngay hôm nay. Cổng `du_dieu_kien` đỏ, và đỏ **đúng**, vì có một câu hỏi đang
chờ người. Răng đòi màu xanh sẽ biến một câu hỏi chính đáng thành một lỗi của hệ thống, và
sức ép sẽ dồn về phía **gỡ câu hỏi đi cho bảng xanh lại**. Đó là cách một hệ kỷ luật tự ăn
mòn chính nó.

Đã sửa: răng chụp **nền** trước khi tiêm, rồi đo "trả về đúng nền" thay vì "tất cả xanh". Nó
vẫn bắt được báo đỏ oan, nhưng không còn ép hệ phải sạch mới cho qua.

## Ba đơn vị còn lại trong mẻ

```
PTSC              432 ngay · su kien da hoan thanh, ban giao 33 chan de cho Orsted
Vien Cong nghe xa hiem  424 ngay · lam chu cong doan cot loi, nguon mst.gov.vn tier A
TEDI              692 ngay · san pham tu van da giao, gan voi phuong an 2019
```

Cả ba miễn trừ có căn cứ, 29 xuống 24. Hai ghi chú thêm:

Claim của PTSC chứa **"lần đầu tiên một doanh nghiệp Việt Nam thắng thầu và chế tạo chân đế
điện gió quy mô lớn để xuất khẩu"**. Đây là cụm "đầu tiên" **thứ tư** mà registry đang giữ,
sau CT Semiconductor, FPT và VinES. Bốn khẳng định lần đầu, mỗi cái từ một bài báo, và ít
nhất một cặp đã mâu thuẫn nhau. Đáng thành một việc riêng.

Claim của Viện Công nghệ xạ hiếm tự giới hạn phạm vi rất rõ, "ở quy mô phòng thí nghiệm và
pilot". Chính chỗ tự giới hạn đó làm nó bền: nó không thể bị vượt qua bởi một mốc sản xuất
lớn hơn.

## Lệnh

Loại FECON:

```
# xoa cac claim cua FECON khoi domains/don_vi_cncl/claims.jsonl, ghi ly do vao domain.yaml
# muc ap_dung_..., giong cach da ghi cho MobiFone
```

Hoặc giữ, ghi căn cứ vào note của claim `nang_luc_mo_ta`:

```
DU DIEU KIEN DA XET: <can cu phan tu phat trien theo dieu khoan ranh_gioi_xam>
```

Sau đó `./chay_het_cong.sh` phải về 24 ô xanh.
