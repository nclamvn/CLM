# Máy báo "chưa ai duyệt" đúng cái anh đã ký

Ngày: 24/08/2026.

## STATUS

**25 ô, 25 xanh.** Nhãn cảnh báo từ 2 dòng xuống còn 1, và dòng còn lại là dòng **đúng**.

```
truoc: CO BANG CHUNG MOI CHUA AI DUYET: MATCH-0005(1), MATCH-0011(1)
sau  : CO BANG CHUNG MOI CHUA AI DUYET: MATCH-0005(1)
```

## Hai cái nhãn giống hệt nhau, một cái sai

Vòng trước tôi ghi "hai match có bằng chứng mới chưa ai duyệt, tồn tại từ trước". Đúng là có
từ trước. Nhưng tôi **không mở ra xem từng cái**, chỉ xác nhận nó không phải lỗi của mình rồi
đi tiếp. Mở ra xem thì hai cái khác hẳn nhau.

**MATCH-0005 · FPT Semiconductor.** Fact mới là *"thiết kế chip"* (vjst.vn 15/06/2026, tier
B), nằm cạnh fact đã ký *"doanh nghiệp Việt đầu tiên thiết kế và phát triển chip thương mại"*.
Cùng một điều, nguồn tươi hơn. Sổ chỉ có **một** dòng ký cho cặp này, và fact mới thật sự nằm
ngoài. **Nhãn đúng.**

**MATCH-0011 · Viện Hàn lâm.** Fact mới là *"Thiết bị điện cao áp, siêu cao áp"*. Tra sổ:
**có hai dòng ký**, MATCH-0011 và MATCH-0013, **cả hai đều do anh ký ngày 16/08/2026**, và
dòng MATCH-0013 ký đúng cái fact đang bị gọi là chưa duyệt. **Nhãn sai.**

## Vì sao chữ ký của anh bị giấu

`gop_cung_cap` gộp nhiều match cùng một cặp (cầu, cung) thành một dòng. Nhưng trong **sổ**,
chúng vẫn là nhiều dòng ký riêng, vì lúc ký chúng còn là nhiều match.

`restore_signoff` duyệt sổ và `break` ngay ở dòng đầu tiên khớp được, rồi gọi phần còn lại là
`chua_duyet`. Một chữ `break`.

Sai **theo hướng an toàn**: báo thừa chứ không báo thiếu. Nhưng vẫn phải sửa, và lý do không
phải vì nó khó chịu:

**Một cái nhãn báo động sai thường xuyên thì người ta sẽ bấm qua nó.** Đến lúc nó đúng thì
không ai còn nhìn. Cái nhãn `chua_duyet` chỉ có giá trị đúng bằng độ tin của nó, và mỗi lần
nó kêu oan là một lần nó tự bào mòn.

## Sửa, và khoá cả hai chiều

Bỏ `break`, gộp mọi dòng sổ hợp lệ của cùng một cặp rồi mới tính phần chưa ký. Mỗi dòng sổ
vẫn phải tự qua khoá bằng chứng của riêng nó, nên gộp không nới lỏng gì. Dòng nào gộp từ
nhiều chữ ký thì ghi ra `gop_tu: [MATCH-0011, MATCH-0013]`.

`bite_gop_cap.py` thêm **RĂNG 4**, khoá cả hai chiều trong cùng một răng:

```
4a PHAI LAM DUOC : cap 2 dong so -> gop het, khong con chua_duyet, co ghi gop_tu
4b CAM LAM DUOC  : cap 1 dong so ma con fact ngoai tap da ky -> VAN phai bao
```

Chiều 4b là chiều quan trọng. Không có nó thì bản vá vừa rồi chỉ là **một lệnh đại xá**: gộp
hết, không còn ai bị báo, bảng xanh và không ai biết.

**Đã chứng minh răng cắn thật.** Tạm gỡ bản vá rồi chạy lại răng: RĂNG 4 báo `KHONG CAN`,
exit 1. Gắn bản vá lại thì cắn. Một cái răng chưa từng thấy màu đỏ thì chưa phải là răng.

## Còn lại đúng một việc của người

MATCH-0005 vẫn mang nhãn, và lần này nhãn đúng. Fact *"thiết kế chip"* là **bằng chứng phía
cung**, xác nhận lại đúng điều đã ký bằng nguồn 15/06/2026 thay vì 27/10/2025. Nó không mở
rộng phạm vi match, chỉ làm chắc thêm.

Máy không được tạo chữ ký. Đường ký duy nhất:

```
python3 match_engine.py sign out/matches.jsonl "Lam Nguyen" 2026-08-24 --only MATCH-0005
```
