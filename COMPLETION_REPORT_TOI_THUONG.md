# Cổng soi khẳng định tối thượng

Ngày: 24/08/2026.

## STATUS

**25 ô, 24 xanh, 1 đỏ.** Ô đỏ vẫn là `du_dieu_kien` chờ anh quyết FECON. Cổng mới xanh sau
khi ghi phạm vi cho cả bảy claim.

## Tôi nói bốn, máy đếm ra tám

Vòng trước tôi viết "cụm đầu tiên thứ tư mà registry đang giữ". Quét bằng máy: **tám claim**
có từ tối thượng, trong đó bảy là thật.

**Đây là lần thứ ba trong dự án một con số tôi ước lượng bằng mắt lệch con số máy đếm.** Lần
một là "vài đơn vị dựa trên bài cũ" trong khi thật là 46 claim. Lần hai là "1 vi phạm" trong
bản PDF trong khi thật là 26. Ba lần đều cùng một dạng: tôi đếm những cái tôi vừa nhìn thấy,
không đếm những cái tôi chưa nhìn.

## Vì sao khẳng định tối thượng nguy hơn khẳng định thường

**Nó là lời mời đối chiếu.** Đối thủ chỉ cần chỉ ra một trường hợp sớm hơn là cả hồ sơ mất
tin, không riêng dòng đó.

**Nó thường đến từ một bài báo.** Nhà báo viết "đầu tiên" để làm tít, không để làm bằng chứng.

**Hai đơn vị có thể cùng nhận một ngôi vị.** Ngay hôm nay đã thấy CT Semiconductor và FPT
cùng nhận nhà máy đóng gói kiểm thử đầu tiên do người Việt làm chủ.

## Cổng không đòi claim phải đúng, nó đòi phạm vi phải viết ra

Đó là điểm thiết kế chính. Máy không phân xử được ai đầu tiên thật. Nhưng gần hết các vụ chọi
nhau là do **hai bên dùng cùng một chữ cho hai phạm vi khác nhau**, và chuyện đó thì viết ra
là thấy ngay.

Bảy claim, xếp theo rủi ro sau khi viết phạm vi:

```
CAO   VinES   "dau tien tai Dong Nam A lam chu cong nghe cell pin"
              so sanh cap khu vuc, pham vi rong nhat, nguon 06/03/2024
CAO   VinAI   "Top 20 cong ty toan cau dan dau ve nghien cuu AI"
              cau khong neu ten bang xep hang nao, nen khong tu kiem duoc
VUA   FPT Semiconductor  "doanh nghiep Viet dau tien thiet ke chip thuong mai"
VUA   VSAP LAB           "lab-fab dau tien tai Viet Nam ve dong goi ban dan"
VUA   PTSC               "lan dau tien mot DN Viet thang thau va che tao chan de dien gio
                          quy mo lon de xuat khau"  ba dieu kien chong nhau nen pham vi hep
THAP  Dong Anh  "cong suat lon nhat tren luoi dien truyen tai"  kiem duoc qua ho so luoi
THAP  VinMotion "nguyen mau robot dau tien CUA CHINH VINMOTION" tu gioi han pham vi
```

Cổng cũng đơn ra cặp cùng nhóm cùng từ: **nhóm 6 có FPT Semiconductor và VSAP LAB đều nhận
"đầu tiên"**. Soi ra thì **không chọi nhau**: một cái ở khâu thiết kế chip, một cái ở khâu
đóng gói. Cổng đơn ra, người phân xử, đúng như thiết kế.

## Báo giả duy nhất, và cách xử

Lần chạy thử đầu bắt "TBM **số 1** metro Nhổn" của FECON. Trong tiếng Việt "số 1" làm **số
thứ tự** nhiều hơn làm ngôi vị, và ở đây nó là mã máy. Đã bỏ "số 1" khỏi danh sách từ khoá và
ghi rõ lý do trong cổng.

Đây là lần thứ hai một cổng mới báo giả ngay lần chạy đầu, sau vụ cắt sai từ ghép tiếng Việt
ở cổng tham chiếu treo. Cả hai đều lộ ra vì tôi chạy thử trên dữ liệu thật trước khi tin, và
cả hai nếu để nguyên thì cổng sẽ bị tắt sau vài lần.

## Việc còn lại của anh

Ô `du_dieu_kien` vẫn đỏ, chờ quyết định FECON. Hai đường đã ghi trong báo cáo trước.

## Lệnh

```
cd /Users/os/CNCLData
python3 check_khang_dinh_toi_thuong.py domains/don_vi_cncl ; echo $?

cd /Users/os/CaoLocMatch
./chay_het_cong.sh    # 25 o, 1 do dang cho nguoi
```
