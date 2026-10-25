# Bản giao việc: nâng cấp phần mềm và làm giàu dữ liệu (đợt 24/10/2026)

Người giao: Nguyễn Cảnh Lâm. Người thi công: Claude (Cowork), làm lần lượt từng gói, mỗi gói chuỗi cổng xanh mới sang gói sau. Bản này là nguồn duy nhất của đợt; đổi phạm vi thì sửa bản này qua commit có ghi lý do.

---

## 1. Hiện trạng lúc giao (24/10/2026, commit 38978b1)

| Mặt | Hiện trạng | Vấn đề |
|---|---|---|
| Chuỗi cổng | 126/126 xanh (07/10 11:09), đóng dấu lên web | Không |
| Bên cung | 60 đơn vị, 378 câu nguồn (A 120 · B 190 · C 68) | 29 câu nguồn quá 180 ngày chưa có lý do giữ |
| Định danh pháp nhân | 0/60 qua cổng chính thức; 55 dòng tự khai | Cổng tra mã số thuế có captcha, máy không tra được |
| Cầu quốc gia | 30 sản phẩm QĐ 21/2026; 16 đã có cặp ký; P21, P27 chưa có bên cung | 12 sản phẩm chỉ một bên cung |
| Cầu thật | 54 nhu cầu, 16 bên đặt hàng; 41 có gợi ý đơn vị | Gợi ý theo từ khoá; 13 nhu cầu chưa có bên cung |
| Điều phối | Mũi nhọn công nghệ số đô thị Hà Nội, 12 nhu cầu, 17 việc | **Sổ sự kiện vẫn rỗng; 14 việc xét ứng viên quá hạn từ 14/10** |
| Vòng tự chạy | 2 tin chờ duyệt trong hàng chờ | Chưa được xét |
| Nguồn | Chụp một lần, đối chiếu lại theo đợt | Không tự biết trang gốc đổi chữ |

## 2. Mục tiêu đo được khi xong đợt

1. Sổ sự kiện điều phối có ít nhất 14 sự kiện xét ứng viên và ít nhất 1 sự kiện giới thiệu thật.
2. Mũi nhọn: 12/12 nhu cầu có ít nhất một ứng viên trong sổ nguồn (hiện 9/12).
3. Câu nguồn quá hạn không lý do: từ 29 xuống 0 (chụp lại, hoặc ghi lý do giữ có duyệt).
4. Cầu thật: thêm ít nhất 20 nhu cầu đặt hàng từ ít nhất 5 bên đặt hàng mới, đã qua cổng và được duyệt.
5. Định danh pháp nhân: phiếu tra cổng có người nhận, có hạn; mọi kết quả đã tra được nạp qua `nap_tra_cong.py`.
6. Hệ thống tự phát hiện trang nguồn đổi chữ và đẩy việc vào hàng việc, không cần người nhớ.
7. Cầu thật được ghép bằng máy có điểm (không chỉ gợi ý từ khoá) và chảy vào hàng chờ ký như cầu quốc gia.
8. Mọi gói có cổng mới kèm bộ răng; chuỗi đầy đủ xanh trên máy thật trước mỗi lần push.

## 3. Nguyên tắc không đổi

- Máy đề xuất, người quyết. Máy không tự ký, không tự ghi sự kiện người làm, không tự duyệt lô.
- Mọi thông tin vào sổ nguồn là câu nguyên văn trong bản chụp, có hạng nguồn, đi qua cổng kiểm lô và bảng duyệt.
- Chỉ lấy mạng bằng công cụ fetch của phiên; không curl, wget hay thư viện tải trang. Gặp captcha thì dừng trang đó.
- Không nới cổng. Mã số thuế chỉ nhận từ cổng chính thức; không dùng trang tổng hợp.
- Không em-dash. Không hậu tố -v2.
- Nguồn mới vào theo lô, anh Lâm duyệt theo lô.

---

## 4. Các gói việc

Ký hiệu: **[người]** việc của anh Lâm hoặc nhân sự RtR; **[máy]** việc của người thi công.

### G0 · Phiếu xét 14 ứng viên mũi nhọn (vận hành, quá hạn)

- [máy] Soạn `CaoLocMatch/domains/dieu_phoi/phieu_xet_<ngày>.md`: mỗi dòng gồm bài toán, đơn vị, câu nguồn năng lực, đánh giá độ khớp (mạnh, yếu, chỉ trùng từ khoá) kèm lý do, và lệnh ghi sẵn cho hai lựa chọn duyệt hay loại.
- [người] Đánh dấu duyệt hay loại từng dòng, một câu lý do.
- [máy] Ghi sự kiện đúng theo quyết định qua `dieu_phoi.py` (lệnh tự kiểm luật), chạy chuỗi.
- **Nghiệm thu:** sổ có 14 sự kiện xét; phễu trang Điều phối có số ở bước "được duyệt".

### G1 · Lô 04: bên cung cho mũi nhọn (dữ liệu)

- [máy] Nghiên cứu song song: btl-08 (kinh tế dữ liệu), btl-10 (Metaverse, AR/VR du lịch), btl-14 (an ninh thông minh) chưa có ứng viên; làm dày ứng viên cho 9 bài toán còn lại (mỗi bài ít nhất 2 đơn vị có câu nguồn năng lực đúng việc).
- Định dạng như lô 01: `CNCLData/lam_giau/dot_04/` gồm đề xuất, bản chụp, honest-null, đối chiếu độc lập; qua `kiem_lo.py`; bảng duyệt kèm mô phỏng tác động lên phễu mũi nhọn.
- [người] Duyệt lô. [máy] Nạp, chạy chuỗi.
- **Nghiệm thu:** 12/12 nhu cầu mũi nhọn có ứng viên; không đơn vị nào là bên liên quan của người gác cổng (cổng `KHONG_TRUNG_LAP`).

### G2 · Theo dõi thay đổi nguồn (phần mềm)

- [máy] `CNCLData/theo_doi_nguon/`: danh mục URL lấy từ mọi bản chụp đang được câu nguồn dùng; tác vụ theo lịch (Cowork) chụp lại bằng công cụ fetch vào `luot/<ngày>/`; bộ so sánh tất định `so_nguon.py` phân loại từng nguồn: **giữ** (mọi câu nguồn vẫn còn nguyên văn), **đổi** (câu nguồn không còn), **mất** (trang lỗi hoặc gỡ).
- Kết quả vào hàng việc Điều phối: "xem lại nguồn" cho cặp đã ký có nguồn đổi.
- Mặc định đề xuất (anh chốt lại được): **chụp lại mỗi tuần** vào sáng thứ Hai; nguồn của cặp đã ký đổi chữ thì **gắn cờ chờ xem lại**, không tự treo chữ ký.
- Cổng `theo_doi_nguon` + răng: kết quả phân loại tái lập được từ hai bản chụp; không nguồn nào bị bỏ sót khỏi danh mục; "đổi" và "mất" luôn sinh việc.
- **Nghiệm thu:** một lượt chạy thật có báo cáo; trang Điều phối hoặc Tổng quan hiện số nguồn đổi.

### G3 · Làm tươi 29 câu nguồn quá hạn (dữ liệu, dùng máy G2)

- [máy] Chụp lại 29 nguồn bằng máy G2. Câu nguồn còn nguyên văn ở bản mới: thay bản chụp, ghi chú "chụp lại, câu không đổi", không cần duyệt nội dung. Câu không còn: tìm nguồn thay thế theo luật lô, đưa vào lô duyệt; hoặc đề xuất lý do giữ.
- **Nghiệm thu:** cổng `do_tuoi_nguon` báo 0 câu quá hạn không lý do.

### G4 · Lô 05: cầu thật mới (dữ liệu)

- [máy] Nghiên cứu nhu cầu đặt hàng công khai ngoài 16 bên hiện có: bộ ngành (Y tế, Giao thông, Tài nguyên, Quốc phòng phần công khai), địa phương (TP Hồ Chí Minh, Hải Phòng, Cần Thơ, Bắc Ninh...), tập đoàn nhà nước (EVN, PVN, VNPT, Viettel phần mua sắm công khai), chương trình KH&CN cấp quốc gia mới.
- Định dạng như lô 03; qua `kiem_lo_cau.py` (luật từng ký tự, mốc thời gian).
- **Nghiệm thu:** ít nhất 20 nhu cầu, 5 bên đặt hàng mới, qua cổng `dat_hang`.

### G5 · Định danh pháp nhân (dữ liệu, cần người)

- [máy] Làm mới `dot_02/PHIEU_TRA_CONG.xlsx`: thêm cột người nhận, hạn, trạng thái; sắp theo ưu tiên (đơn vị có cặp ký và đơn vị trong mũi nhọn lên đầu); hướng dẫn tra từng bước kèm cách chụp PDF đúng chuẩn mà `nap_tra_cong.py` nhận.
- [người] Giao nhân sự RtR tra, mỗi đơn vị khoảng 2 phút.
- [máy] Nạp từng đợt kết quả, chạy chuỗi.
- **Nghiệm thu:** mọi dòng đã tra được nạp; chỉ số định danh trên Tổng quan tăng tương ứng.

### G6 · Ghép cầu thật bằng máy (phần mềm)

- [máy] Đưa 54+ nhu cầu cầu thật vào máy ghép với luật riêng: neo theo sản phẩm chiến lược (nếu có), độ giao khái niệm giữa đối tượng đặt hàng và câu nguồn năng lực, hạng nguồn; công thức công khai như cầu quốc gia. Kết quả là cặp đề xuất có điểm, vào phễu, chờ người ký.
- Trang Cầu thật và Điều phối dùng cặp có điểm thay cho gợi ý từ khoá; vẫn ghi rõ "chưa ký".
- Cổng: điểm tái lập được, ghép không vượt câu nguồn, xung đột lợi ích như `xung_dot_ky`.
- **Nghiệm thu:** mỗi nhu cầu cầu thật có danh sách ứng viên xếp hạng kèm phân rã điểm; chuỗi xanh.

### G7 · Giao diện vận hành (phần mềm)

- Menu nhóm theo việc: Vận hành (Điều phối, Cầu thật, Ghép cung cầu), Thị trường (Tổng quan, Toàn cảnh, Dòng thời cuộc, Đồ thị), Bằng chứng (Sổ nguồn, Hồ sơ, Hỏi đáp), Báo cáo (Báo cáo, Phương pháp); Kho mã ra khỏi menu chính.
- Trang Cầu thật: ô tìm kiếm và chế độ danh sách gọn.
- Hồ sơ đơn vị: dòng trạng thái "đang được xét trong mũi nhọn" kèm liên kết.
- Trang Điều phối: hiện số nguồn đổi (G2) và cặp có điểm (G6).
- Cổng truy cập, chữ bị cắt, đơn sắc, thuật ngữ giữ nguyên; thêm răng cho cấu trúc menu (không mục nào chết, mỗi trang thuộc đúng một nhóm).

### G8 · Kịch bản demo nhà đầu tư (tài liệu)

- Đường demo khoảng 10 phút nối: Tổng quan, Cầu thật, Hỏi đáp, Điều phối, mở bản chụp, mã kiểm toán, Báo cáo; mỗi màn một câu nói và một con số đọc từ dữ liệu.

---

## 5. Thứ tự và phụ thuộc

```
G0 (ngay, cần anh 30 phút) ──────────────────────────────┐
G1 nghiên cứu ── duyệt ── nạp ──┐                         ├─▶ G7 ─▶ G8
G2 máy theo dõi ─▶ G3 làm tươi  ├─▶ G6 ghép cầu thật ─────┘
G4 nghiên cứu ── duyệt ── nạp ──┘
G5 phiếu tra cổng (song song, phụ thuộc người tra)
```

Thứ tự thi công: G0 phiếu, G1 nghiên cứu (song song với G2 dựng máy), duyệt G1, G3, G4, G6, G7, G8. G5 chạy song song suốt đợt.

## 6. Quyết định cần anh Lâm (đã có mặc định, anh đổi được)

| Quyết định | Mặc định |
|---|---|
| Nhịp chụp lại nguồn | Mỗi tuần, sáng thứ Hai |
| Nguồn của cặp đã ký đổi chữ | Gắn cờ chờ xem lại, không tự treo chữ ký |
| Người tra cổng định danh | Chờ anh giao |
| Người gửi lời giới thiệu | Anh (như `mui_nhon.yaml`) |

## 7. Cách nghiệm thu mỗi gói

1. Cổng mới có răng, răng cắn trên cảnh tự dựng.
2. Chuỗi nhanh xanh trong sandbox, rồi chuỗi đầy đủ xanh trên máy thật (quét truy cập 1440px và 390px).
3. Commit ghi rõ gói, số liệu trước và sau.
4. Push chỉ sau chuỗi xanh; bước đóng dấu ghi đúng lượt kiểm lên web.
