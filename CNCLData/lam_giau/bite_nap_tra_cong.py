#!/usr/bin/env python3
"""bite_nap_tra_cong.py · Rang cua nap_tra_cong.kiem_dong.

CANH
====
CANH TRONG BO NHO: dong phieu tra va chu PDF gia viet ngay trong file nay, goi thang ham thuan
kiem_dong. Khong doc phieu that, khong ghi file nao, khong can openpyxl hay pdftotext, nen chay
duoc ca trong CI. Du lieu that (phieu, registry) doi thi rang van can, vi canh khong lay tu do.

RANG
====
RANG 1  · dong dung (ma, ten, dau cong, nguoi, ngay, PDF) -> 0 vi pham, 1 claim.
RANG 2  · ma 9 so -> MA_SAI_DANG.
RANG 3  · thieu nguoi tra -> THIEU_NGUOI.
RANG 4  · ngay tra sai dang (2026-10-02) -> THIEU_NGUOI.
RANG 5  · khong co file PDF -> THIEU_PDF.
RANG 6  · PDF la trang tong hop (khong mang dau cong) -> PDF_KHONG_CONG.
RANG 7  · ma cong khong co trong PDF -> PDF_KHONG_MA.
RANG 8  · ten tren cong khong co trong PDF -> PDF_KHONG_TEN.
RANG 9  · ma cong khac ma tu khai, khong ghi chu -> LECH_KHONG_GHI.
RANG 10 · cung ma cho hai don vi -> MA_HAI_DON_VI.
RANG 11 · don vi khong co trong registry -> DON_VI_LA.
RANG 12 · dong khong co ma cong (chua tra) -> bo qua, 0 claim, 0 vi pham.

Chay: python3 bite_nap_tra_cong.py     Exit 0 moi rang can · 2 co rang khong can.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from nap_tra_cong import kiem_dong  # noqa: E402

REG = {"Cong ty A", "Cong ty B"}
PDF = {"a.pdf": "Cổng thông tin quốc gia về đăng ký doanh nghiệp https://dangkykinhdoanh.gov.vn\n"
                "Tên doanh nghiệp: CÔNG TY CỔ PHẦN A\nMã số doanh nghiệp: 0101234567\nTình trạng: Đang hoạt động",
       "tonghop.pdf": "masothue.com Mã số thuế 0101234567 CÔNG TY CỔ PHẦN A"}
TOT = {"stt": 1, "don_vi": "Cong ty A", "ma_tu_khai": "0101234567", "ma_cong": "0101234567",
       "ten_cong": "CÔNG TY CỔ PHẦN A", "tinh_trang": "Đang hoạt động", "nguoi": "Nguyen Van A",
       "ngay": "02/10/2026", "pdf": "a.pdf", "ghi_chu": ""}
kq = []


def rang(nhan, dong, ma_vi=None, so_claim=None):
    ra, vi = kiem_dong(dong, PDF.get, REG)
    ok = (any(ma_vi in v for v in vi) if ma_vi else not vi) and (so_claim is None or len(ra) == so_claim)
    print(f"{nhan:<56} : {'CAN OK' if ok else 'KHONG CAN !!'} ({len(vi)} vi pham, {len(ra)} claim)")
    kq.append(ok)


rang("RANG 1  · dong dung -> 0 vi pham, 1 claim", [TOT], None, 1)
rang("RANG 2  · ma 9 so -> MA_SAI_DANG", [{**TOT, "ma_cong": "010123456"}], "MA_SAI_DANG")
rang("RANG 3  · thieu nguoi tra -> THIEU_NGUOI", [{**TOT, "nguoi": ""}], "THIEU_NGUOI")
rang("RANG 4  · ngay sai dang -> THIEU_NGUOI", [{**TOT, "ngay": "2026-10-02"}], "THIEU_NGUOI")
rang("RANG 5  · khong co PDF -> THIEU_PDF", [{**TOT, "pdf": "khong_co.pdf"}], "THIEU_PDF")
rang("RANG 6  · PDF trang tong hop -> PDF_KHONG_CONG", [{**TOT, "pdf": "tonghop.pdf"}], "PDF_KHONG_CONG")
rang("RANG 7  · ma khong co trong PDF -> PDF_KHONG_MA", [{**TOT, "ma_cong": "0109999999", "ghi_chu": "x"}], "PDF_KHONG_MA")
rang("RANG 8  · ten khong co trong PDF -> PDF_KHONG_TEN", [{**TOT, "ten_cong": "CÔNG TY TNHH B"}], "PDF_KHONG_TEN")
rang("RANG 9  · lech ma tu khai khong ghi chu -> LECH_KHONG_GHI", [{**TOT, "ma_tu_khai": "0100000000"}], "LECH_KHONG_GHI")
rang("RANG 10 · mot ma hai don vi -> MA_HAI_DON_VI", [TOT, {**TOT, "stt": 2, "don_vi": "Cong ty B", "ma_tu_khai": ""}], "MA_HAI_DON_VI")
rang("RANG 11 · don vi la -> DON_VI_LA", [{**TOT, "don_vi": "Cong ty Z"}], "DON_VI_LA")
rang("RANG 12 · chua tra (khong co ma cong) -> bo qua", [{**TOT, "ma_cong": ""}], None, 0)

can = sum(kq)
print(f"\nBITE NAP TRA CONG: {can}/{len(kq)} rang can")
sys.exit(0 if can == len(kq) else 2)
