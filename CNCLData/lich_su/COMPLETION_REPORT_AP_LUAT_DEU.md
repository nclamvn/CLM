# Cổng bắt áp luật không đều, và ba cái bẫy nó tự dẫm phải

Ngày: 25/08/2026.

## STATUS

**31 ô, 31 xanh.** Thêm `ap_luat_deu` và răng của nó.

## Lỗ hổng này đã tự chứng minh hai lần trong hai ngày

```
16/08  MobiFone bi loai vi VAN HANH tren thiet bi mua ngoai
24/08  FECON van o trong registry du cung la VAN HANH may hang nuoc ngoai lam

24/08  Dabaco bi loai vi "nguon khong noi tu phat trien"
25/08  Nhung AVAC va NAVETCO vao registry nho DUNG MOT CAU noi ho "nghien cuu, san xuat"
```

**Cả hai lần đều lộ ra vì người đi kiểm lại, không phải vì cổng bắt.** Trong 29 ô không ô nào
đối chiếu được một đơn vị **bị loại** với một đơn vị **đã nạp** trong cùng mảng.

Với một hub trung lập thì đây là thứ dễ mất nhất: bị hỏi vì sao đơn vị này vào được mà đơn vị
kia thì không.

## Cổng không phán xử quyết định

Máy không biết hai ca có "cùng dạng" hay không. Nó chỉ bắt buộc **phép so sánh phải được viết
ra**, đúng như `khang_dinh_toi_thuong` không đòi claim phải đúng mà đòi phạm vi phải viết ra.

Mỗi ca loại phải có một dòng:

```
SO VOI DA NAP: <ten don vi da nap> · <truong> · <bi loai thieu gi ma don vi kia co>
```

Và cổng kiểm ba điều, đều kiểm được bằng máy: có dòng đó không, **tên đơn vị có thật trong
registry không**, và **trường đó có thật trên đúng đơn vị đó không**. Hai điều sau là phần có
răng: không viết bừa một cái tên cho qua cổng được.

## Phép thử mạnh nhất, không tiêm lỗi giả

Chạy cổng hôm nay trên `domain.yaml` **trước khi bổ sung**:

```
CA LOAI MA CHUA DOI CHIEU VOI DON VI DA NAP (3):
  ap_dung_16_08_2026           1 lan KHONG NAP · 0 dong doi chieu
  ap_dung_25_08_2026_duongsat  2 lan KHONG NAP · 0 dong doi chieu
  ap_dung_24_08_2026_asf       1 lan KHONG NAP · 0 dong doi chieu
exit 2
```

Bắt đúng cả hai ca thật đã sai, cộng một ca thứ ba.

Bổ sung ngược bốn dòng đối chiếu, ghi rõ là **bổ sung ngược**. Dòng cho MobiFone viết thẳng:
nếu có nó từ đầu thì ca FECON đã lộ ngay 16/08 chứ không phải tám ngày sau, và cổng
`du_dieu_kien` đã không phải báo đỏ ba lượt.

## Ba cái bẫy cổng này tự dẫm, trong đúng một giờ

### 1. Đếm chữ, không đếm hành vi

Bản đầu đòi số dòng đối chiếu **bằng** số lần xuất hiện chữ `KHONG NAP`. Nó báo giả ngay lần
chạy thứ hai: ghi chú mới của chính tôi có câu *"Kết luận KHÔNG NẠP ở mục này đã bị sửa lại"*,
tức một câu **nhắc đến** một quyết định loại chứ không phải một quyết định loại.

**Lần thứ ba trong hai ngày một cổng mới báo giả ngay lần chạy đầu**, sau "số 1" ở cổng tối
thượng và sau việc cắt sai từ ghép ở cổng tham chiếu treo. Cùng một dạng: bắt theo mặt chữ
trên văn bản tự do thì luôn có ca **nhắc đến** bị tính là ca thật.

Nới thành "ít nhất một dòng", vì cái thật sự phải chặn là **ca loại mà không có đối chiếu
nào**, và đó đúng là hai ca đã xảy ra.

### 2. Chữ đ gạch ngang

Cổng báo *"Tập đoàn Dabaco Việt Nam không phải đơn vị đã nạp"*, trong khi đơn vị đó vừa được
nạp hai mươi phút trước.

NFD tách được dấu thanh và dấu mũ, nhưng **đ (U+0111) là một ký tự riêng**, không phải d cộng
dấu, nên nó không bị tách. Một cổng báo sai kiểu đó sẽ bị tắt ngay lần thứ hai.

### 3. Cổng đọc file cấu trúc bằng regex có thể XANH HƠN CẢ PARSER

Đây là cái nặng nhất. Ghi chú tôi thêm vào có một cặp nháy kép lồng trong một chuỗi đã nháy
kép, tức **YAML hỏng**. Cổng mới vẫn đọc được bằng regex và vẫn báo **XANH**. Cổng
`refinery.py` phía sau mới nổ, vì nó dùng parser thật.

Một cổng đọc bằng regex là **một nguồn sự thật thứ hai**, và nó nói dối theo hướng nguy nhất:
báo an toàn trên một file mà hệ thống thật không đọc nổi. Đã đổi sang `yaml.safe_load`, và
nếu parse không được thì trả **KHÔNG CHẠY ĐƯỢC** chứ không đoán.

## Bốn răng

```
RANG 1 · go het dong doi chieu        -> exit 2
RANG 2 · bia ten don vi               -> exit 2
RANG 3 · ten that nhung bia truong    -> exit 2
RANG 4 · tra lai nguyen trang         -> exit 0
```

RĂNG 2 và 3 là phần chặn đúng chỗ dễ gian nhất: viết một dòng cho có.

## Lệnh

```
cd /Users/os/CNCLData
python3 check_ap_luat_deu.py domains/don_vi_cncl
python3 bite_ap_luat_deu.py

cd /Users/os/CaoLocMatch && ./chay_het_cong.sh    # 31 o
```
