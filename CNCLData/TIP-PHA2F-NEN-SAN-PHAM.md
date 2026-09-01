# TIP-CNCL-2F · Ba nhóm cuối và làm giàu nền sản phẩm

## Header

- **ID:** TIP-CNCL-2F
- **Dependencies:** Pha 2e đóng (139 claim, 33 đơn vị, 7 nhóm), cổng luật 3 đã hoạt động
- **Hai phần chạy song song:** A là bề rộng, B là bề sâu

## Phát hiện dẫn tới phần B

```
tong don vi           : 33
co nhom_cncl          : 32  (97%)
co san_pham_lien_quan : 12  (36%)
```

Registry đang **neo tốt ở cấp nhóm nhưng mỏng ở cấp sản phẩm**. Nhóm là đơn vị phân loại thô: nhóm 5 gộp cả vật liệu, pin, hydro, thiết bị điện. Bốn vòng vừa rồi cho thấy neo nhóm là điều kiện cần nhưng không đủ, và cặp rác Viện Hàn lâm với thiết bị điện cao áp tồn tại được chính vì cả hai cùng nhóm 5.

**Neo cấp sản phẩm là chỗ duy nhất còn lại có thể siết mà không đụng vào chuỗi ký tự.** Đây không phải tinh chỉnh so khớp, đây là làm giàu dữ liệu.

## Task A · cào nhóm 7, 8, 10

- Nhóm 7: an ninh mạng và lượng tử
- Nhóm 8: biển, đại dương và lòng đất
- Nhóm 10: đường sắt tốc độ cao và đường sắt đô thị

Đúng khuôn 2c và 2e: tier A trước, mỗi nguồn một snapshot, span nguyên văn, loại có kỷ luật, áp `scope_note`. Dự báo trước: ba nhóm này mỏng hơn các nhóm đã làm, **không ép số**.

## Task B · làm giàu `san_pham_lien_quan` cho 21 đơn vị còn thiếu

**Không cào thêm nguồn.** Suy từ chính span đã có trong registry, vì span đó đã qua cổng.

Kỷ luật bắt buộc:

1. `extraction: normalized`, **luôn có `note`** nêu rõ căn cứ nào trong span dẫn tới mã sản phẩm nào. Cổng luật 3 sẽ chặn nếu thiếu.
2. Span nào **không đủ** để chỉ ra một sản phẩm cụ thể trong 30 sản phẩm thì để **honest-null**. Thà 15 đơn vị có sản phẩm đúng còn hơn 33 đơn vị có sản phẩm đoán.
3. Một đơn vị chỉ gán **một** mã sản phẩm cho trường `san_pham_lien_quan` (trường đơn trị). Nếu đơn vị thật sự phủ nhiều sản phẩm thì dùng trường phụ theo khuôn `nhom_cncl_phu_N`, tức `san_pham_phu_<Pxx>`.
4. Sản phẩm gán phải **thuộc đúng nhóm** đã neo của đơn vị, hoặc phải giải thích trong note nếu lệch.

## Acceptance Criteria

```gherkin
Scenario: Cong may xanh
  Then refinery, bites, check_dash, check_luat3 deu exit 0
  And chay lai refinery ra dung digest

Scenario: Nen san pham day len that
  Then ty le don vi co san_pham_lien_quan tang tu 36 phan tram len it nhat 60 phan tram
  And moi claim san_pham_lien_quan moi deu co note neu ro can cu tu span

Scenario: Khong doan bua
  Then don vi nao span khong du chi ra san pham cu the thi de honest-null
  And bao cao liet ke dich danh nhung don vi de trong va ly do

Scenario: Nhat quan nhom va san pham
  Then moi san pham gan deu thuoc dung nhom da neo cua don vi
  Or note giai thich ro vi sao lech

Scenario: Tier A dan duong cho nhom moi
  Then moi nhom moi co it nhat 1 claim tier A, hoac bao cao khai ro nhom do khong dat va vi sao
```

## Constraints

- Không sửa `methodbox/`, không sửa claim cũ ngoài việc thêm dòng mới.
- Không cào nguồn mới cho phần B.
- Backup trước khi ghi. Đọc exit code trần. Em-dash vẫn cấm.
