#!/usr/bin/env python3
"""bite_ma_so_thue.py · Sau rang cua cong check_ma_so_thue.py.

CANH
====
TU DUNG LAY CANH: rang tu viet mot domain toi thieu trong thu muc tam, gom claims.jsonl va
ngan_sach_ma_so_thue.txt. Khong chep registry that, khong doc registry that. Registry doi bao
nhieu don vi, bao nhieu claim, thi rang van chay.

Danh sach nguon chinh thuc lay TU CHINH CONG (doc bien NGUON_CHINH_THUC), khong go lai o day.
Cong noi long hay siet lai danh sach do thi rang di theo, khong gay va cung khong am tham
kiem mot luat da cu.

RANG
====
RANG 1 · TRONG HOAN TOAN THI VAN XANH: khong don vi nao co ma so, ngan sach 0 -> exit 0.
         Day la rang quan trong nhat va no do dung cai de nhat de lam sai: mot cong doi dinh
         danh rat de bien thanh cong CAM de trong, va luc do ca registry dung lai.
RANG 2 · NGUON KHONG CHINH THUC THI DO: ma so tu mot trang tra cuu tong hop -> exit 2, goi
         dich danh don vi va ten nguon.
RANG 3 · SAI DINH DANG THI DO: ma so khong phai 10 chu so -> exit 2.
RANG 4 · TANG DO PHU MA KHONG GHI LAI THI DO: them mot ma so hop le nhung giu ngan sach cu
         -> exit 2. Khoa mot chieu phai siet ca chieu tang, neu khong thi moc dung yen.
RANG 5 · GIAM DO PHU THI DO: ngan sach 1 ma thuc te 0 -> exit 2. Mot dinh danh bien mat la
         mat kha nang phan biet hai phap nhan trung ten.
RANG 6 · THIEU FILE NGAN SACH LA KHONG CHAY DUOC: xoa ngan sach -> exit 3, khong phai 0.
         Khoa mot chieu khong co moc de so thi no khong con la khoa.

Chay: python3 bite_ma_so_thue.py
"""
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
CONG = HERE / "check_ma_so_thue.py"


def in_(nhan, ok, chi):
    print(f"{nhan:64} : " + (f"CAN OK ({chi})" if ok else f"KHONG CAN !! {chi}"))


def nguon_chinh_thuc():
    """Doc danh sach nguon tu chinh cong, khong go lai trong rang nay."""
    m = re.search(r"NGUON_CHINH_THUC\s*=\s*\{(.*?)\}", CONG.read_text(encoding="utf-8"), re.S)
    return re.findall(r'"([^"]+)"', m.group(1)) if m else []


def main():
    ngc = nguon_chinh_thuc()
    if not ngc:
        print("KHONG CHAY DUOC: khong doc duoc NGUON_CHINH_THUC trong check_ma_so_thue.py.")
        return 3
    tot = ngc[0]

    tam = Path(tempfile.mkdtemp(prefix="bite-mst-"))
    d = tam / "domain"
    d.mkdir()

    def ghi(claims, moc):
        (d / "claims.jsonl").write_text(
            "\n".join(json.dumps(c, ensure_ascii=False) for c in claims) + "\n", encoding="utf-8")
        (d / "ngan_sach_ma_so_thue.txt").write_text(f"# canh cua rang\n{moc}\n", encoding="utf-8")

    def chay():
        r = subprocess.run([sys.executable, str(CONG), str(d)], capture_output=True, text=True)
        return r.returncode, r.stdout + r.stderr

    def claim(entity, field, value, nguon="cafef.vn"):
        return {"entity": entity, "field": field, "value": value,
                "evidence_span": str(value), "extraction": "verbatim", "tier": "B",
                "capture": {"snapshot": "gia.html", "source": nguon}}

    nen = [claim("Cong ty A", "ten_don_vi", "Cong ty A"),
           claim("Cong ty B", "ten_don_vi", "Cong ty B")]

    ghi(nen, 0)
    ma, ra = chay()
    ok1 = ma == 0 and "chua co dinh danh" in ra.lower().replace("chưa", "chua")
    in_("RANG 1 · trong hoan toan thi VAN XANH, va van in ra khoang trong", ok1,
        "exit 0, co in khoang trong" if ok1 else f"exit {ma}")

    ghi(nen + [claim("Cong ty A", "ma_so_thue", "0123456789", "masothue.com")], 1)
    ma, ra = chay()
    ok2 = ma == 2 and "masothue.com" in ra
    in_("RANG 2 · ma so tu nguon tong hop thi DO", ok2, "exit 2, goi ten nguon" if ok2 else f"exit {ma}")

    ghi(nen + [claim("Cong ty A", "ma_so_thue", "khong-phai-so", tot)], 1)
    ma, ra = chay()
    ok3 = ma == 2 and "DINH DANG" in ra
    in_("RANG 3 · sai dinh dang thi DO", ok3, "exit 2" if ok3 else f"exit {ma}")

    ghi(nen + [claim("Cong ty A", "ma_so_thue", "0123456789", tot)], 0)
    ma, ra = chay()
    ok4 = ma == 2 and "TANG DUOC" in ra
    in_("RANG 4 · tang do phu ma khong ghi lai thi DO", ok4, "exit 2" if ok4 else f"exit {ma}")

    ghi(nen, 1)
    ma, ra = chay()
    ok5 = ma == 2 and "GIAM" in ra
    in_("RANG 5 · giam do phu thi DO", ok5, "exit 2" if ok5 else f"exit {ma}")

    ghi(nen, 0)
    (d / "ngan_sach_ma_so_thue.txt").unlink()
    ma, ra = chay()
    ok6 = ma == 3
    in_("RANG 6 · thieu file ngan sach la KHONG CHAY DUOC", ok6, "exit 3" if ok6 else f"exit {ma}")

    shutil.rmtree(tam, ignore_errors=True)
    tat_ca = ok1 and ok2 and ok3 and ok4 and ok5 and ok6
    print("-" * 82)
    print("BITE MA SO THUE:", "RANG CAN" if tat_ca else "CO RANG KHONG CAN")
    return 0 if tat_ca else 1


if __name__ == "__main__":
    sys.exit(main())
