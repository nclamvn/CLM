# CàoLọcMatch · .touch

Hub cung cầu công nghệ chiến lược Việt Nam. Bên đặt hàng (bộ ngành, địa phương, viện, doanh nghiệp nhà nước) tìm được đơn vị làm được việc; đơn vị công nghệ tìm được bài toán có thật. Mỗi con số trên hệ bấm được, và bấm là ra câu nguồn nguyên văn kèm bản chụp trang gốc.

Mô tả đầy đủ: [MO_TA_DU_AN.md](MO_TA_DU_AN.md). Đợt việc đang chạy: [GIAO_VIEC_NANG_CAP_LAM_GIAU.md](GIAO_VIEC_NANG_CAP_LAM_GIAU.md). Kịch bản trình bày: [KICH_BAN_DEMO_NHA_DAU_TU.md](KICH_BAN_DEMO_NHA_DAU_TU.md).

## Hệ làm gì

| Tầng | Ai làm | Kết quả |
|---|---|---|
| Thu thập | máy | bản chụp trang công khai (cổng nhà nước, báo chính thống, trang của đơn vị), không dùng trang tổng hợp |
| Làm giàu theo lô | máy đề xuất, người duyệt cả lô | mỗi dòng có câu nguồn nguyên văn, hạng nguồn A/B/C, ngày đăng; chỗ không có nguồn thì để trống và ghi rõ |
| Sổ nguồn | dữ liệu | bên cung (năng lực đơn vị), nhu cầu quốc gia theo QĐ 21/2026, nhu cầu đặt hàng thật |
| Ghép | máy | cặp cung cầu có điểm tính lại được bằng tay; cặp khác lĩnh vực bị chặn trước khi tính điểm |
| Ký | người gác cổng | chỉ cặp được ký mới thành match; chữ ký khoá vào câu nguồn, câu đổi thì chữ ký rơi |
| Điều phối | người làm, máy theo dõi | hàng việc mũi nhọn sinh từ dữ liệu; sổ sự kiện nối băm, chỉ ghi việc người đã làm |
| Kiểm định | máy, mỗi lần đổi | một chuỗi cổng chạy lại từ đầu; mỗi cổng có bộ thử tự cài lỗi để chứng minh còn bắt được lỗi |

Số liệu hiện hành luôn đọc trên web (trang Tổng quan và Phương pháp), không ghi cứng ở đây.

## Cơ chế tin cậy, nói ngắn

1. **Không có nguồn thì không nói.** Câu trả lời của Hỏi đáp là câu nguồn nguyên văn; câu hỏi ngoài phạm vi bị từ chối.
2. **Số trên web đếm lại được.** Cổng kiểm định đếm lại mọi số từ dữ liệu; lệch một là chuỗi đỏ.
3. **Máy không tạo chữ ký.** Giao diện không có nút ký; người duyệt lô và người gác cổng là hai chỗ duy nhất dữ liệu được nhận là sự thật, lời duyệt giữ nguyên văn.
4. **Hồ sơ kiểm lại được.** Mỗi hồ sơ đơn vị có mã SHA-256 của câu nguồn và bản chụp; bấm "Kiểm lại ngay trên trình duyệt" thì trình duyệt tự tải lại bản chụp và tính lại mã.
5. **Tự khai điểm yếu.** Định danh pháp nhân, câu nguồn quá hạn, nhu cầu chưa có bên cung đều hiện thành việc cần làm, không giấu.

## Cấu trúc kho

```
CNCLData/       sổ nguồn bên cung (domains/don_vi_cncl), cầu thật (domains/cau_dat_hang),
                lô làm giàu (lam_giau/dot_*), cổng của sổ nguồn
Dataset_CongNgheChienLuoc/   danh mục nhu cầu quốc gia theo QĐ 21/2026
CaoLocMatch/    máy ghép, sổ chữ ký, điều phối (domains/dieu_phoi), chuỗi cổng chay_het_cong.sh
.touch/         web Next.js: trang đầu, 13 màn bảng điều khiển, cổng giao diện (scripts/check-*.mjs)
```

## Chạy

```
cd .touch && npm ci && npx next build && npx next start -p 3200     # web tại http://localhost:3200
cd CaoLocMatch && bash chay_het_cong.sh                           # toàn bộ chuỗi cổng và bộ thử
cd CaoLocMatch && bash chay_het_cong.sh --nhanh                   # bỏ bộ thử, chỉ để soát nhanh
```

Chỉ đẩy mã sau khi chuỗi đầy đủ xanh. Lần chạy xanh trọn vẹn sẽ đóng dấu kết quả vào dữ liệu web, nên trang luôn ghi đúng lần kiểm định của chính mã đang chạy.
