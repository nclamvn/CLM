# Đi tìm bằng chứng cho ô đỏ, không tự gỡ ô đỏ

Ngày: 24/08/2026.

## STATUS

**25 ô, 24 xanh, 1 đỏ.** Ô đỏ vẫn là `du_dieu_kien`, vẫn chờ anh. Đó là kết quả đúng.

```
do tuoi nguon : 24 -> 23   (khoa mot chieu no khi GIAM, da chot muc moi)
du dieu kien  : DO         (khong doi, va khong duoc phep doi boi may)
```

## Việc tôi làm và việc tôi không làm

Cổng `du_dieu_kien` đòi một quyết định: loại FECON, hoặc giữ và ghi căn cứ theo điều khoản
`ranh_gioi_xam`. Điều khoản đó viết: *"Đơn vị vừa vận hành vừa tự phát triển một phần công
nghệ lõi thì XÉT THEO BẰNG CHỨNG CỤ THỂ của phần tự phát triển."*

**Không ai đi tìm cái bằng chứng cụ thể đó.** Ô đỏ nằm đấy ba lượt, hai bên cùng chờ nhau.
Đi tìm là việc của máy. Phân xử vẫn là việc của anh, và ô vẫn đỏ.

## Tìm được gì

Nguồn độc lập, tier B, **baodautu.vn 28/12/2015** (ấn phẩm thuộc Báo Tài chính - Đầu tư):

> Đặc biệt năm 2015, Ban R&D cùng các đơn vị trong hệ thống FECON đã trực tiếp nghiên cứu và
> thử nghiệm 3 đề tài quan trọng, được áp dụng vào công tác thi công là: Vỏ hầm và sản xuất
> vỏ hầm tại Việt Nam, Ứng dụng công nghệ cọc cừ bê tông dự ứng lực và Quan trắc công trình
> ứng dụng công nghệ cảm biến cáp quang - Fiber Optic.

Luật của domain nói đủ điều kiện là *"thiết kế, chế tạo, sản xuất, hoặc **nghiên cứu** công
nghệ lõi"*. Câu trên rơi đúng vào chữ cuối.

**Cái không tìm thấy, ghi ra để anh cân cả hai chiều:** không nguồn nào nói FECON thiết kế
hay chế tạo chính cái máy TBM. Ba đề tài là vỏ hầm, cọc cừ và quan trắc cáp quang, tức phụ
kiện và công nghệ phụ trợ, không phải thiết bị đào. Nghĩa là bằng chứng đủ để **xét**, không
đủ để nói FECON làm chủ máy TBM.

## Hai nguồn bị loại, và vì sao

`fecon.com.vn` là trang của chính đơn vị, tier C, không dùng.

Đáng nói hơn là **nhandan.vn/special/** về FECON. Tên miền tier A, nội dung có đúng thứ tôi
cần (Viện R&D FECON lập 2010). Nhưng trang đó dựng bằng Shorthand và **còn nguyên chữ mẫu
tiếng Anh chưa xoá của template**, ví dụ *"A meeting point for those passionate about pushing
the boundaries of film and media"*, nằm ngay dưới ảnh công nghệ đào hầm. Slug URL kết thúc
bằng `-copy`.

Một trang **không ai đọc soát lại** thì không dùng làm bằng chứng registry, dù tên miền là
gì. Cổng `check_tai_tro.py` không bắt được trang này vì nó không gắn nhãn tài trợ. Đây là ca
thứ hai trong tháng một trang tên miền uy tín hoá ra là nội dung thương hiệu, sau vụ
nhandan.vn 20/08 gắn nhãn "Nội dung có tài trợ".

## Nạp nguồn cũ là vay thêm nợ độ tuổi, và cổng bắt được

Vòng này **net giảm 1**, nhưng đường đi không thẳng:

```
-1   FECON/nang_luc_mo_ta (725 ngay, mon no CU NHAT) neo duoc:
     baoxaydung.vn 07/05/2026 xac nhan ham da ve dich thang 4/2026 -> su kien da ket thuc
+2   hai claim moi tu nguon 2015, ban than chung da qua han ngay khi nap
-1   ghi ly do cho ca hai trong cung mot luot
```

Lần đầu tôi thấy rõ chuyện này: **thêm dữ liệu từ nguồn cũ không phải là làm dày registry
miễn phí, nó là vay thêm nợ độ tuổi.** Cổng bắt được vì ngân sách đếm cả claim mới lẫn claim
cũ, không phân biệt.

Và khoá một chiều nổ ở **chiều giảm**: 24 xuống 23 thì cổng bắt phải chốt lại mức mới, kèm
lịch sử. Giảm mà không ghi thì khoá đứng yên và hết siết.

## Một lỗ hổng cổng, ghi ra chứ không vá ẩu

Câu tôi định lấy làm span đầu tiên là *"cả 3 đề tài nghiên cứu **trên** đều đã được FECON đưa
vào thử nghiệm..."*. Cụm *"3 đề tài nghiên cứu trên"* trỏ ra ngoài span, tức **tham chiếu
treo**. `check_tham_chieu_treo.py` **không bắt được**, vì danh sách chỉ định của nó có "nêu
trên", "kể trên", "nói trên" mà không có "trên" trần.

**Không mở rộng danh sách.** "Trên" là giới từ phổ biến bậc nhất tiếng Việt; thêm vào là cổng
báo giả hàng loạt rồi bị tắt sau vài lần, đúng vết xe của cụm "số 1" tuần trước. Tôi đổi span
sang câu tự đủ nghĩa và ghi lỗ hổng vào note. Chỗ này tạm thời vẫn phải mắt người nhìn.

## Một việc cũ vẫn treo, không phải do vòng này

`restore_signoff` báo **MATCH-0005 và MATCH-0011 có bằng chứng mới chưa ai duyệt**. Đã kiểm
bằng cách tạm gỡ thay đổi của vòng này rồi chạy lại: **cảnh báo có từ trước**, không phải do
hai claim FECON. Chữ ký cũ vẫn phủ đúng phần đã ký; phần mới bị đánh dấu, không lẫn vào.

## Việc của anh

Ô `du_dieu_kien` đỏ. Bằng chứng cho đường hai nay đã nằm trong registry, có nguồn, có tier,
trích nguyên văn. Quyết vẫn là của anh:

```
# duong 1: loai FECON, ghi ly do vao domain.yaml muc ap_dung_..., giong MobiFone
# duong 2: giu, ghi vao note cua claim nang_luc_mo_ta:
DU DIEU KIEN DA XET: <can cu>
```

Nếu chọn đường hai, câu căn cứ đề nghị, anh sửa chữ nào tuỳ anh:

> DU DIEU KIEN DA XET: theo dieu khoan ranh_gioi_xam. FECON vua van hanh TBM (khong du dieu
> kien) vua co phan tu nghien cuu (du dieu kien): baodautu.vn 28/12/2015 ghi Ban R&D FECON
> truc tiep nghien cuu va san xuat thu vo ham, coc cu be tong du ung luc va quan trac cap
> quang. Nap voi PHAM VI HEP: phan tu phat trien la phu kien va cong nghe phu tro, KHONG bao
> gom may TBM. Khac MobiFone o cho MobiFone khong tim thay bat ky phan tu phat trien nao.

## Lệnh

```
cd /Users/os/CaoLocMatch && ./chay_het_cong.sh    # 25 o, 1 do dang cho nguoi
```
