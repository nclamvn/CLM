# Cổng đối chứng snapshot với nguồn · lần chạy thật đầu tiên

Ngày: 16/08/2026. Cổng `check_snapshot_fidelity.py` ra đời ở TIP-3D nhưng chưa từng chạy với nguồn sống. Hôm nay chạy lần đầu.

## Kết quả

```
snapshot            : 31
doi chung duoc      : 12
chua co ban tuoi    : 19
cau khop            : 42
cau lech            : 1     <- bat duoc
```

**Cổng bắt được đúng một câu lệch ngay lần chạy đầu tiên.**

## Câu bị bắt, và nó là gì

```
snapshot : "FPT Semiconductor đã trở thành doanh nghiệp Việt đầu tiên thiết kế và phát triển chip thương mại"
nguon    : "Trước đó, [FPT](https://dulieu.nguoiquansat.vn/doanh-nghiep/FPT) Semiconductor đã trở thành
            doanh nghiệp Việt đầu tiên thiết kế và phát triển chip thương mại"
```

**Không phải bịa đặt.** Nội dung có thật, đúng nghĩa, đúng nguồn. Nhưng snapshot đã **gỡ bỏ markup liên kết**: trong bài gốc tên công ty bị tách qua một siêu liên kết, `[FPT](url) Semiconductor`, còn snapshot viết liền thành `FPT Semiconductor`.

Đây vẫn là **vi phạm thật** của kỷ luật nguyên văn. Một câu "gần đúng" thì không phải nguyên văn, và nếu chấp nhận sửa nhẹ cho đẹp thì ranh giới giữa sửa nhẹ và sửa nặng do ai định?

## Đã sửa thế nào

1. **Snapshot trả về đúng chữ của nguồn**, kể cả phần markup, kèm ghi chú nói rõ đã sửa ngày nào vì cổng nào bắt.
2. **Bốn claim trỏ vào span đó được cập nhật** sang span đúng.
3. **Claim `ten_don_vi` của FPT Semiconductor chuyển từ `verbatim` sang `normalized`** kèm note: nguồn viết tên công ty tách qua một liên kết, nên "FPT Semiconductor" là dạng chuẩn hoá chứ không phải trích nguyên văn.

Giá trị của mọi claim **không đổi một chữ**. Chỉ nhãn và span đổi.

## Sau khi sửa

```
refinery      exit 0
check_luat3   exit 0
check_dash    exit 0
fidelity      exit 0 · 43 cau khop · 0 lech · con 19 snapshot chua doi chung
```

## Ba điều phải nói thẳng về độ mạnh của phép kiểm này

**1. Bản tươi không phải bản sao byte.** Môi trường không cho chép nguyên khối từ máy chủ, nên bản tươi là bản **chép lại nguyên văn** do một tiến trình khác thực hiện, không phải `cp` nhị phân. Nghĩa là phép kiểm chứng minh được: một câu bịa trong snapshot sẽ phải được bịa lại y hệt ở một lượt làm việc khác, việc gần như không xảy ra. Nhưng nó **không** chứng minh được tính toàn vẹn ở mức byte.

**2. Mới đối chứng 12 trên 31 snapshot.** 19 snapshot còn lại vẫn ở trạng thái chưa kiểm, và cổng **nói thẳng điều đó** thay vì im lặng cho qua. 12 trang được chọn là những trang đỡ các match đã ký và các nguồn tier A.

**3. Nguồn có thể đổi theo thời gian.** Cổng này so snapshot với trang **hôm nay**. Nếu một trang bị sửa hoặc gỡ trong tương lai, cổng sẽ báo lệch, và lúc đó phải phân biệt "snapshot sai" với "nguồn đã đổi". Hôm nay chưa gặp ca đó.

## Ý nghĩa

Đây là cổng cuối cùng trong hệ chưa từng chạy thật. Nay nó đã chạy, đã bắt được lỗi thật ngay lần đầu, và lỗi đó không ai phát hiện được bằng mắt vì câu vẫn đọc trôi chảy và đúng nghĩa.

Toàn bộ chuỗi nay đã đóng: nguồn, snapshot, span, claim, registry, match, chữ ký người, và **mỗi mắt xích đều có một cổng tự chứng minh nó cắn được**.

## Lệnh

```
cd /Users/os/CNCLData
python3 check_snapshot_fidelity.py domains/don_vi_cncl --fresh .fidelity_fresh ; echo $?
```
