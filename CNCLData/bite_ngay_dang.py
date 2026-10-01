#!/usr/bin/env python3
"""bite_ngay_dang.py · Tam rang cua check_ngay_dang.py.

CANH
====
TU DUNG LAY CANH: rang tu viet mot domain toi thieu trong thu muc tam (tempfile): mot
claims.jsonl mot claim, mot ban chup, mot file ngan sach. Khong doc registry that, khong doc ban
chup that. Registry doi bao nhieu ban chup, rang van chay y nguyen.

RANG
====
RANG 1 · HAU TO LA NGAY DANG, THAN BAI CO NGAY DO -> exit 0.
RANG 2 · HAU TO TRUNG NGAY CHUP, THAN BAI KHONG NOI NGAY DO -> exit 2. Day dung la loi cua 7 ban
         chup phat hien 29/09/2026.
RANG 3 · HAU TO TRUNG NGAY CHUP NHUNG THAN BAI THAT SU NOI NGAY DO -> exit 0. Bai dang dung hom
         minh chup la chuyen co that; cong khong duoc bao gia.
RANG 4 · HAU TO SAU NGAY CHUP -> exit 2 (NGAY_TUONG_LAI).
RANG 5 · CHI DONG GHI CHU CUA NGUOI CHUP NOI NGAY DO -> van exit 2. Chu cua minh khong lam can
         cu cho ngay cua nguon.
RANG 6 · NGAN SACH GHI MOT BAN CHUP KHONG CON VI PHAM -> exit 2 (DA_SUA_CHUA_XOA).
RANG 7 · THIEU FILE NGAN SACH -> exit 3.
RANG 8 · BAN CHUP KHONG CO DONG "captured" -> exit 3, khong doan ngay chup.
RANG 9 · TRANG TINH, hau to = ngay chup, claim ten_phap_nhan -> exit 0.
RANG 10 · TRANG TINH ma co claim nang_luc_mo_ta -> exit 2 (TRANG_TINH_SAI_TRUONG).
RANG 11 · TRANG TINH ma hau to khac ngay chup -> exit 2 (TRANG_TINH_NGAY_LECH).

Chay: python3 bite_ngay_dang.py
"""
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
CONG = HERE / "check_ngay_dang.py"


def canh(t, ten, dau, than, ns="", truong="ten_don_vi"):
    d = t / "dom"
    if d.exists():
        shutil.rmtree(d)
    (d / "snapshots").mkdir(parents=True)
    (d / "claims.jsonl").write_text(json.dumps({
        "entity": "X", "field": truong, "value": "X", "evidence_span": "X",
        "capture": {"snapshot": ten}}) + "\n", encoding="utf-8")
    (d / "snapshots" / ten).write_text(dau + "\n\n" + than + "\n", encoding="utf-8")
    if ns is not None:
        (d / "ngan_sach_ngay_dang.txt").write_text("# ngan sach\n" + ns, encoding="utf-8")
    return d


def chay(d):
    r = subprocess.run([sys.executable, str(CONG), str(d)], capture_output=True, text=True)
    return r.returncode, r.stdout


def main():
    t = Path(tempfile.mkdtemp(prefix="bite_ngay_dang_"))
    kq = []

    def ghi(nhan, ok, chi):
        print(f"{nhan:62} : " + (f"CAN OK ({chi})" if ok else f"KHONG CAN !! {chi}"))
        kq.append(ok)

    try:
        H = "# SNAPSHOT · x.vn · captured 2026-01-10 via web_fetch\n# URL: https://x.vn/a"
        rc, _ = chay(canh(t, "x_20250101.html", H, "Đăng ngày 01/01/2025. X làm được việc này."))
        ghi("RANG 1 · hau to la ngay dang co trong than bai -> exit 0", rc == 0, f"exit {rc}")

        rc, out = chay(canh(t, "x_20260110.html", H, "X làm được việc này."))
        ghi("RANG 2 · hau to trung ngay chup, than khong noi -> exit 2", rc == 2 and "NGAY_CHUP_LAM_NGAY_DANG" in out, f"exit {rc}")

        rc, _ = chay(canh(t, "x_20260110.html", H, "Thứ bảy, 10/01/2026 08:00. X làm được việc này."))
        ghi("RANG 3 · bai dang dung ngay chup, than noi dung -> exit 0", rc == 0, f"exit {rc}")

        rc, out = chay(canh(t, "x_20260201.html", H, "Ngày 01/02/2026. X."))
        ghi("RANG 4 · hau to sau ngay chup -> exit 2", rc == 2 and "NGAY_TUONG_LAI" in out, f"exit {rc}")

        rc, out = chay(canh(t, "x_20260110.html", H + "\n# Bai dang 10/01/2026", "X làm được việc này."))
        ghi("RANG 5 · chi ghi chu nguoi chup noi ngay -> van exit 2", rc == 2 and "NGAY_CHUP_LAM_NGAY_DANG" in out, f"exit {rc}")

        rc, out = chay(canh(t, "x_20250101.html", H, "Ngày 01/01/2025. X.", ns="x_20250101.html | ly do cu\n"))
        ghi("RANG 6 · ngan sach ghi ban khong con vi pham -> exit 2", rc == 2 and "DA_SUA_CHUA_XOA" in out, f"exit {rc}")

        rc, _ = chay(canh(t, "x_20250101.html", H, "Ngày 01/01/2025. X.", ns=None))
        ghi("RANG 7 · thieu file ngan sach -> exit 3", rc == 3, f"exit {rc}")

        rc, _ = chay(canh(t, "x_20250101.html", "# SNAPSHOT · x.vn\n# URL: https://x.vn/a", "Ngày 01/01/2025. X."))
        ghi("RANG 8 · khong co dong captured -> exit 3", rc == 3, f"exit {rc}")

        TT = H + "\n# TRANG TINH: trang chinh chu khong co ngay dang."
        rc, _ = chay(canh(t, "x_20260110.html", TT, "Công ty Cổ phần X. MST 0101234567.", truong="ten_phap_nhan"))
        ghi("RANG 9 · trang tinh, truong dinh danh -> exit 0", rc == 0, f"exit {rc}")
        rc, out = chay(canh(t, "x_20260110.html", TT, "X làm được việc này.", truong="nang_luc_mo_ta"))
        ghi("RANG 10 · trang tinh cho truong nang luc -> exit 2", rc == 2 and "TRANG_TINH_SAI_TRUONG" in out, f"exit {rc}")
        rc, out = chay(canh(t, "x_20250101.html", TT, "Công ty Cổ phần X.", truong="ten_phap_nhan"))
        ghi("RANG 11 · trang tinh hau to khac ngay chup -> exit 2", rc == 2 and "TRANG_TINH_NGAY_LECH" in out, f"exit {rc}")
    finally:
        shutil.rmtree(t, ignore_errors=True)

    can = sum(kq)
    print(f"\nBITE NGAY DANG: {can}/{len(kq)} rang can")
    return 0 if can == len(kq) else 2


if __name__ == "__main__":
    sys.exit(main())
