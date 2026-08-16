# Completion + VERIFY · TIP-CNCL-3C · Tách nhu cầu ghép

Ngày: 16/08/2026. Task nhỏ nên gộp Completion và Verify vào một artefact, đúng quyền co giãn của Chủ thầu; sàn audit trail vẫn đủ vì TIP và báo cáo đều còn.

## STATUS

**DONE. 5/5 tiêu chí đạt. R7 của vòng trước nay đạt mà ngưỡng không suy suyển một chữ số.**

## Kết quả

```
truoc (rule v2, nhu cau con gop) : 7 match · digest e2af754f7323b9cd
sau  (rule v2, nhu cau da tach)  : 8 match · digest af0f924e941a2604
rule khong doi mot dong. Chi du lieu doi.
```

Match mới, chính là ứng viên đã tuyên bố trước từ vòng lát cắt dọc:

```
MATCH-0007  CNCL-P22 · nhu cầu quốc gia  <->  Tập đoàn Viettel  score=0.70
  mảnh nhu cầu : "Thiết bị, phương tiện bay không người lái (UAV)"   (mảnh 1/2)
  năng lực     : "dòng chip SoC AI on Edge ... cho hệ sinh thái thiết bị camera, drone,
                  thiết bị bay không người lái (UAV)"
  neo          : nhóm cầu 9, nhóm cung [1, 6], QUA CẠNH CHUỖI GIÁ TRỊ 6 sang 9
  token giao   : bay, không, lái, người, uav   (5/7 = 0,714)
  unverified   : 2 (ánh xạ P22 về nhóm 9 chưa duyệt; cạnh 6 sang 9 chưa duyệt)
  chain_complete: true
```

## Đối chiếu 5 tiêu chí khoá trước

| Mã | Nội dung | Kết quả |
|---|---|---|
| **S1** | R7 đạt mà không đụng `OVERLAP_MIN_V2` | **ĐẠT.** Ngưỡng vẫn là 0,5, kiểm bằng grep trên mã. Overlap từ 0,455 lên 0,714 hoàn toàn do mẫu số nhỏ lại: 11 token xuống 7 token. |
| **S2** | R1, R2, R3 giữ nguyên | **ĐẠT.** Phenikaa-X vẫn vắng mặt; ROSTEK với P07 và VinBigData với P01 vẫn còn, cùng điểm cũ. |
| **S3** | Match ghi rõ khớp mảnh nào | **ĐẠT.** Fact ghi `need` mảnh 1/2 và `need_2` mảnh 2/2, note nêu rõ "tách ở dấu chấm phẩy của bản gốc". |
| **S4** | Rác không quá 30% | **ĐẠT.** Vẫn đúng 1 ca rác (MATCH-0002), 1/8 = 12,5%, giảm so với 14,3%. |
| **S5** | Mọi mảnh là chuỗi con nguyên văn, cổng chặn nếu sai | **ĐẠT, có đối chứng dương.** |

## Cổng tự chứng minh nó cắn

Tôi cố ý thêm một mảnh bịa vào P22 rồi chạy lại:

```
NEED_PART_NOT_VERBATIM: CNCL-P22 · nhu cầu quốc gia / need_3 khong la chuoi con cua span goc
FAIL: 1 loi truoc khi ghi. Khong ghi gi ca.
exit 2
```

Cổng cắn đúng, và quan trọng hơn: **không ghi gì cả**, không để lại file nửa vời. Sau khi bỏ mảnh bịa, build lại exit 0.

## Vì sao chỉ tách ở dấu chấm phẩy

Dấu chấm phẩy là ký hiệu liệt kê tường minh của chính văn bản gốc. Dấu phẩy và chữ "và" thì thường nối các thành phần của cùng một khái niệm ("Thiết bị, phương tiện bay không người lái" là một thứ, không phải hai). Tách bừa ở dấu phẩy sẽ sinh ra mảnh vô nghĩa và làm overlap tăng giả. Đây là ranh giới có chủ đích, ghi trong mã.

Toàn danh mục 30 sản phẩm chỉ có hai dòng chứa dấu chấm phẩy: P20 và P22. Nên tác động hẹp và kiểm được bằng mắt.

## Điều phải nói rõ, không tô hồng

1. **FPT không match với UAV, chỉ Viettel match.** Cả hai đều mang cùng bằng chứng SoC AI on Edge, nhưng neo nhóm cần đơn vị thuộc nhóm 6, mà trên đĩa mới chỉ Viettel có `nhom_cncl_phu_6`. FPT chưa có claim nhóm 6 nào. Đây là honest-null của dữ liệu, không phải lỗi rule. Nếu nạp claim nhóm 6 cho FPT thì match sẽ xuất hiện, nhưng phải có bằng chứng riêng, không suy từ việc FPT đứng cạnh Viettel trong cùng câu.
2. **MATCH-0007 mang 2 cờ `unverified`** vì cả ánh xạ P22 về nhóm 9 lẫn cạnh chuỗi giá trị 6 sang 9 đều còn chờ người duyệt. Match đúng về nội dung nhưng **chưa được trình ra ngoài**, đúng thiết kế.
3. **Ca rác MATCH-0002 vẫn còn nguyên.** Tách nhu cầu không đụng tới nó, vì nguyên nhân của nó là từ ghép bị vỡ chứ không phải mẫu số. Đó là việc của rule v3.

## OVERALL STATUS

**READY về mặt kỹ thuật, CHỜ NGƯỜI về mặt gác cổng.**

Toàn bộ 7 tiêu chí của TIP-3B nay đã đạt (R4 đạt nhờ ca rác tụt xuống dưới, R7 đạt nhờ tách nhu cầu), nhưng tôi **không tuyên bố TIP-3B pass hồi tố**: R4 và R7 đã được chấm trượt tại thời điểm chấm, và kết quả đó giữ nguyên trong sử liệu. Vòng này là một vòng khác, có tiêu chí riêng.

Nút thắt duy nhất còn lại nằm ở người: **`mapping_sp_nhom.yaml` chờ Lâm duyệt.** Chừng nào chưa duyệt, cả 8 match đều treo `unverified`.

## Lệnh tái lập

```
cd /Users/os/CaoLocMatch
python3 build_cncl_match.py                              ; echo $?
python3 match_engine.py run domains/cncl_match           ; echo $?
python3 match_engine.py run domains/cncl_match --rule-v1 ; echo $?
```
