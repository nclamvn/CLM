#!/usr/bin/env python3
"""bite_chuan_hoa.py · Sau rang cua cong check_chuan_hoa.py.

CANH
====
TU DUNG LAY CANH: rang tu viet ra mot claims.jsonl toi thieu trong thu muc tam. Khong chep
registry that, khong doc registry that, nen so claim hay noi dung registry doi bao nhieu lan
thi rang van chay.

Vi sao khong chep registry that: rang nay can mot canh mà trong do TUNG TU cua value duoc
kiem soat, vi thu can do la phep so tung tu. Chep du lieu that vao roi tiem loi thi canh phu
thuoc vao chu nghia cua du lieu that, dung cai bay TIP-03 di chan.

Danh sach ten truong lay TU CHINH CONG (doc bien TRUONG_VAN va TRUONG_MA_SO), khong go lai o
day. Cong doi phan loai truong thi rang di theo, khong gay.

RANG
====
RANG 1 · CANH SACH THI XANH: value la chuoi con cua span -> exit 0.
RANG 2 · THEM CHU LA THI DO: chen mot tu khong co trong span vao value normalized cua truong
         van xuoi -> exit 2, va goi dich danh tu do.
RANG 3 · KHAI ROI THI QUA: them dong CHUAN HOA CO CHU DICH vao note -> exit 0.
RANG 4 · KHONG BAO GIA TREN TRUONG MA SO: value la ma "22" trong khi span khong he co so 22
         -> van exit 0. Day la rang quan trong nhat. Truong ma so chiem 100 tren 114 claim
         normalized; bat chung la bao gia hang loat va cong se bi tat ngay.
RANG 5 · KHONG XET CLAIM VERBATIM: value them chu nhung extraction la verbatim -> cong nay
         khong bat, vi do la viec cua check_luat3. Moi cong lam dung phan cua no.
RANG 6 · TRUONG LA THI KHONG CHAY DUOC: mot ten truong chua duoc xep nhom -> exit 3, khong
         phai 0 va cung khong phai 2. Doan ho la cach nhanh nhat de vua bao gia vua bo lot.

Chay: python3 bite_chuan_hoa.py
"""
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
CONG = HERE / "check_chuan_hoa.py"


def in_(nhan, ok, chi):
    print(f"{nhan:60} : " + (f"CAN OK ({chi})" if ok else f"KHONG CAN !! {chi}"))


def doc_nhom_truong():
    """Lay ten truong tu chinh cong, khong go lai trong rang nay."""
    van = CONG.read_text(encoding="utf-8")
    ra = {}
    for ten in ("TRUONG_VAN", "TRUONG_MA_SO"):
        m = re.search(ten + r"\s*=\s*\{(.*?)\}", van, re.S)
        if not m:
            return None
        ra[ten] = re.findall(r'"([^"]+)"', m.group(1))
    return ra


def main():
    nhom = doc_nhom_truong()
    if not nhom or not nhom["TRUONG_VAN"] or not nhom["TRUONG_MA_SO"]:
        print("KHONG CHAY DUOC: khong doc duoc TRUONG_VAN / TRUONG_MA_SO trong check_chuan_hoa.py.")
        return 3
    f_van = nhom["TRUONG_VAN"][0]
    f_ma = nhom["TRUONG_MA_SO"][0]

    tam = Path(tempfile.mkdtemp(prefix="bite-chuan-hoa-"))
    d = tam / "domain"
    d.mkdir()

    SPAN = "Cong ty X da che tao thanh cong mot he thong dan duong quan tinh cho robot tu hanh."

    def ghi(claims):
        (d / "claims.jsonl").write_text(
            "\n".join(json.dumps(c, ensure_ascii=False) for c in claims) + "\n", encoding="utf-8")

    def chay():
        r = subprocess.run([sys.executable, str(CONG), str(d)], capture_output=True, text=True)
        return r.returncode, r.stdout + r.stderr

    def claim(field, value, extraction="normalized", note=""):
        return {"entity": "Cong ty X", "field": field, "value": value,
                "evidence_span": SPAN, "extraction": extraction, "tier": "B",
                "capture": {"snapshot": "gia.html"}, "note": note}

    nen = [claim(f_van, "da che tao thanh cong mot he thong dan duong quan tinh")]
    ghi(nen)
    ma, ra = chay()
    ok1 = ma == 0
    in_("RANG 1 · canh sach thi XANH", ok1, "exit 0" if ok1 else f"exit {ma}\n{ra[-300:]}")

    ghi([claim(f_van, "da che tao thanh cong mot he thong dan duong quan tinh CHOMOI")])
    ma, ra = chay()
    ok2 = ma == 2 and "chomoi" in ra.lower()
    in_("RANG 2 · them chu la thi DO, goi dich danh tu", ok2,
        "exit 2, goi ten tu them" if ok2 else f"exit {ma}")

    ghi([claim(f_van, "da che tao thanh cong mot he thong dan duong quan tinh CHOMOI",
               note="CHUAN HOA CO CHU DICH: chu CHOMOI la de thu rang.")])
    ma, ra = chay()
    ok3 = ma == 0
    in_("RANG 3 · khai roi thi QUA", ok3, "exit 0" if ok3 else f"exit {ma}")

    # Truong ma so: value la ma phan loai, khong he co trong span.
    ghi([claim(f_ma, "22")])
    ma, ra = chay()
    ok4 = ma == 0
    in_("RANG 4 · khong bao gia tren truong ma so", ok4,
        "exit 0" if ok4 else f"exit {ma}, bao gia hang loat")

    ghi([claim(f_van, "mot cum chu hoan toan khong co trong nguon", extraction="verbatim")])
    ma, ra = chay()
    ok5 = ma == 0
    in_("RANG 5 · khong xet claim verbatim, do la viec cua luat 3", ok5,
        "exit 0" if ok5 else f"exit {ma}")

    ghi([claim("mot_truong_chua_ai_xep_nhom", "gi do")])
    ma, ra = chay()
    ok6 = ma == 3 and "chua duoc xep nhom" in ra
    in_("RANG 6 · truong la thi KHONG CHAY DUOC", ok6, "exit 3" if ok6 else f"exit {ma}")

    shutil.rmtree(tam, ignore_errors=True)
    tat_ca = ok1 and ok2 and ok3 and ok4 and ok5 and ok6
    print("-" * 78)
    print("BITE CHUAN HOA:", "RANG CAN" if tat_ca else "CO RANG KHONG CAN")
    return 0 if tat_ca else 1


if __name__ == "__main__":
    sys.exit(main())
