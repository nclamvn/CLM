# CaoLocMatch · máy ghép, sổ chữ ký, điều phối, chuỗi cổng

Phần giữa của kho CLM: đọc sổ nguồn đã qua cổng (CNCLData, Dataset_CongNgheChienLuoc), ghép cung với cầu, giữ chữ ký của người gác cổng, điều phối mũi nhọn, và chạy toàn bộ chuỗi cổng của kho. Tổng quan dự án ở [README của kho](../README.md).

## Cài đặt

Chỉ cần Python 3 và PyYAML:

```
python3 -m pip install --user --break-system-packages -r requirements.txt
```

Thiếu PyYAML thì mọi lệnh dừng ngay ở dòng đầu với thông báo "Can PyYAML"; đó là lỗi môi trường, không ghi hỏng gì.

## Lệnh chính

```
bash chay_het_cong.sh            # toàn bộ chuỗi cổng và bộ thử của cả kho; xanh trọn vẹn thì đóng dấu kết quả vào web
bash chay_het_cong.sh --nhanh    # bỏ bộ thử, chỉ để soát nhanh; không đóng dấu
python3 dieu_phoi.py <loai> --nhu-cau <ma> --don-vi <ten> --nguoi <ten> ...   # ghi một sự kiện người đã làm; xem docstring đầu tệp
```

## Cấu trúc

```
match_engine.py         máy ghép: lớp dữ kiện, neo nhóm, độ giao câu nguồn, điểm tính lại được
build_cncl_match.py     dựng domain cncl_match từ sổ nguồn đã qua cổng
pheu_matching.py        phễu ghép (khả dĩ, qua neo, qua ngưỡng, đã ký, từ chối)
dieu_phoi.py            ghi sự kiện điều phối; check_dieu_phoi.py kiểm sổ
dong_bo_cau.py          đồng bộ bản đọc của Dataset với KnowledgeBase
ban_tam.py              bản làm việc tạm cho các bộ thử (CLM_KHO_*), không chạm kho thật
check_*.py / bite_*.py  cổng và bộ thử cài lỗi của phần này
methodbox/              bản sao NGUYÊN VĂN Refinery MethodBox; không sửa một byte
domains/cncl_match/     dữ kiện ghép, ánh xạ sản phẩm sang nhóm, người ký, sổ chữ ký
domains/dieu_phoi/      cấu hình mũi nhọn, sổ sự kiện, phiếu xét
domains/dich_vu_solo_entrepreneur/  domain tổng hợp, chỉ dùng cho bộ thử của máy ghép (match_bites.py, make_synthetic.py)
out/matches.jsonl       quyết định của người gác cổng (tracked); phần còn lại của out/ sinh lại được
reports/                báo cáo kiểm của các đợt luật ghép (mã nguồn trích dẫn một số tệp ở đây)
lich_su/                TIP, báo cáo hoàn thành và sổ lệnh của giai đoạn PoC (07 đến 08/2026)
day-len-github.sh       đẩy kho lên một repo riêng tư mới, có cổng chặn bí mật trước khi đẩy
```
