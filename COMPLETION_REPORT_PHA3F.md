# Completion + VERIFY · TIP-CNCL-3F · Cổng máy cho luật 3

Ngày: 16/08/2026. Cổng `check_luat3.py` đã cài vào cả ba repo có registry.

## STATUS

**DONE. 5/5 tiêu chí đạt.** Nhưng cổng bắt được **121 vi phạm thật** ngay lần chạy đầu, gấp nhiều lần dự kiến.

## Cổng làm gì

1. `extraction: verbatim` thì `value` phải là chuỗi con nguyên văn của `evidence_span`, sau chuẩn hoá NFC và giải HTML entity đúng như refinery.
2. `extraction: normalized` hoặc `inferred` thì **bắt buộc có `note`**. Chuẩn hoá mà không giải thích thì không kiểm được. Đây chính là khe hở đã dùng để sửa lỗi ở Pha 2e, nên bịt luôn.

Chạy được trên cả hai schema đang tồn tại: schema lồng `capture.snapshot` và schema phẳng `snapshot`.

## Phép thử, có đối chứng dương

| Thử | Kỳ vọng | Kết quả |
|---|---|---|
| Dựng lại đúng lỗi Pha 2e (verbatim, span chỉ có "Viện") | cắn, chỉ đích danh | exit 2 · in cả value, span, snapshot |
| Sửa một value cho thừa chữ ngoài span | cắn | exit 2 · `VALUE_VUOT_SPAN` dòng 1 |
| Claim normalized thiếu note | cắn | exit 2 · `THIEU_NOTE` |
| Schema phẳng (dataset CẦU) | chạy được, không cần sửa claim | chạy được |
| Bốn registry sau khi sửa | tất cả exit 0 | đạt |

## 121 vi phạm bắt được, phân loại

**A. Dataset CẦU: 35 claim dán nhãn sai từ tháng 7.**

Đây là phát hiện nặng nhất. Các claim như `ban_hanh` có `value` là "30/04/2026, Phó Thủ tướng Hồ Quốc Dũng ký" trong khi span chỉ nói "Phó Thủ tướng Hồ Quốc Dũng ký Quyết định số 21/2026/QĐ-TTg". Ngày tháng không có trong span đó.

Tôi kiểm tiếp bằng máy xem phần thừa có tra được trong **cùng snapshot** không:

```
16 claim: mọi số liệu và từ khoá đều tra được trong cùng snapshot, chỉ khác ở chỗ gộp nhiều câu
19 claim: chứa CHỮ VIẾT TẮT do chính người biên soạn đặt (PTN, BKHCN, SP, LLM, DISPUTED)
          hoặc ngày viết lại khác định dạng nguồn (30/04/2026 so với 30/4/2026)
```

Nhóm 19 claim này là bằng chứng rõ nhất rằng nhãn `verbatim` đã sai: chữ viết tắt là của tôi, không phải của nguồn.

**Sửa nhãn, không sửa nghĩa.** Toàn bộ 35 claim chuyển sang `normalized`, `evidence_span` giữ nguyên không đổi một ký tự, và mỗi claim có note nói rõ thuộc nhóm nào trong hai nhóm trên. Cổng span-gate của dataset CẦU vẫn exit 0 sau khi sửa.

**B. Registry CUNG: 7 claim `loai_hinh` phân loại mà không giải thích.**

Đã thêm note nêu đúng căn cứ từng ca. Trong đó **hai ca phải khai là căn cứ nằm ngoài span**:

- **Realtime Robotics (RtR)**: span chỉ nói về người sáng lập, không hề nêu loại hình tổ chức. Phân loại DN dựa trên tên và bối cảnh bài. Điểm yếu này được ghi nổi bật vì RtR mang cờ `favors=rtr` và người vận hành là COO/AI Officer của RtR.
- **IVAC**: span dùng tên viết tắt, không có chữ "Viện".

**C. Domain dẫn xuất: 79 claim thiếu note.**

Nguyên nhân là `build_cncl_match.py` tự sinh các dòng `entity_name`, `nhom`, `nhom_phu` mà không mang theo giải thích. **Sửa ở builder chứ không sửa ở dữ liệu**: builder nay tự gắn note nói rõ giá trị kế thừa từ registry nào.

**D. Domain PoC synthetic: 36 claim.**

Dữ liệu tổng hợp của Phase A, dùng để chạy pipeline và bite test. Đã thêm note khai rõ là synthetic, không phải claim thật về tổ chức có thật. **Không miễn trừ cổng cho domain này** — miễn trừ âm thầm là cách khe hở sinh ra.

## Bốn registry sau khi sửa

```
CUNG  CNCLData/domains/don_vi_cncl        exit 0 · 139 claim · verbatim 79 · normalized 60
CAU   Dataset_CongNgheChienLuoc            exit 0 · 124 claim · verbatim 89 · normalized 35
DAN XUAT cncl_match                        exit 0 · 226 claim · verbatim 67 · normalized 159
PoC synthetic dich_vu_solo_entrepreneur    exit 0 ·  41 claim · verbatim  5 · normalized 35
```

Refinery, bites, check_dash của CNCLData đều exit 0, digest `3e7f17b241f1e71c` không đổi (sửa note không đụng giá trị).

## Sổ chữ ký vừa được thử thật, và nó chứng minh đúng thiết kế

Rebuild domain dẫn xuất với dữ liệu Pha 2e làm match tăng từ 8 lên 13. Chạy `restore-signoff`:

```
gan lai 8/13 chu ky tu so
CHUA KY: MATCH-0003, MATCH-0010, MATCH-0011, MATCH-0012, MATCH-0013
```

**Điểm đáng chú ý nhất: số thứ tự đã xô lệch.** Cặp mà Lâm ký dưới tên MATCH-0003 (chip với Viettel) nay nằm ở MATCH-0004. Còn MATCH-0003 mới là một cặp hoàn toàn khác (pin BESS với Viện Hàn lâm) mà Lâm chưa từng nhìn thấy.

Nếu sổ chữ ký khoá theo `match_id` như thiết kế đầu tiên, chữ ký của Lâm sẽ tự động nhảy sang cặp anh chưa từng xem. Khoá theo digest nội dung đã chặn đúng chuyện đó. **Đây là lần đầu cơ chế này gặp tình huống thật, và nó làm đúng.**

Năm cặp mới chờ người gác cổng: một cặp pin BESS, ba cặp thiết bị điện cao áp, một cặp vật liệu tiên tiến. Bốn trong năm liên quan Viện Hàn lâm.

## Còn nợ

1. Năm match mới chờ Lâm ký hoặc từ chối.
2. Cổng đối chứng snapshot với nguồn vẫn chưa chạy được lần nào (32 snapshot ở trạng thái chưa đối chứng).
3. Ba nhóm còn lại: 7, 8, 10.
4. Quyết định có nới tier cho Dabaco.

## Lệnh

```
python3 check_luat3.py domains/don_vi_cncl ; echo $?
python3 check_luat3.py claims.jsonl        ; echo $?   # schema phang
```
