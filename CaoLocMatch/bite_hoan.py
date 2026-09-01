#!/usr/bin/env python3
"""bite_hoan.py · Nam rang cua co --hoan trong chay_het_cong.sh.

CANH
====
TU DUNG LAY CANH, va canh la mot BAN SAO CUA SCRIPT voi danh sach o thay bang o gia.

Vi sao khong chay chuoi that: mot luot day du mat vai phut, ma rang nay can chay nam luot voi
nam ket cuc khac nhau. Quan trong hon, thu can do KHONG PHAI cac cong that ma la CACH SCRIPT
PHAN LOAI KET QUA: o nao duoc hoan, o nao khong, va luot chay ket thuc ra sao. O gia tra ve
dung ma thoat toi can, nen do duoc chinh xac cai can do va do duoc trong mot phan giay.

Phep thay danh sach o duoc neo bang hai moc co san trong script. Neu script doi cau truc,
phep thay khong khop va rang tra KHONG CHAY DUOC chu khong am tham chay tren mot cai khac.

Ten o gia lay tu chinh danh sach go cung trong script, khong go lai trong file nay: rang doc
`HOAN_DUOC_PHEP` de biet ten nao duoc phep hoan va ten nao khong. Danh sach do doi thi rang
di theo, khong gay.

RANG
====
RANG 1 · KHONG CO CO THI Y NHU CU: mot o tra 3 -> ca luot that bai, bang ghi KHONG CHAY.
RANG 2 · HOAN O TRONG DANH SACH THI QUA: cung canh + --hoan -> exit 0, NHUNG phai in muc
         "O DUOC HOAN" va phai noi ro day khong phai tat ca xanh.
RANG 3 · O DO KHONG BAO GIO HOAN DUOC: o do tra 2 thay vi 3 -> van DO, van that bai. Day la
         rang quan trong nhat: neu hoan nuot duoc ca o do thi co nay la mot duong ro.
RANG 4 · TEN NGOAI DANH SACH BI CHAN TRUOC KHI CHAY: --hoan=<ten khong duoc phep> -> exit 3
         VA khong in bang, tuc chan truoc khi chay bat ky cong nao.
RANG 5 · HOAN THUA THI PHAI NOI: hoan mot o dang xanh -> van exit 0 nhung bao HOAN THUA.

Chay: python3 bite_hoan.py
"""
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
GOC_SCRIPT = HERE / "chay_het_cong.sh"
MOC_DAU = "# ── Kho nguon: registry da qua cong"
MOC_CUOI = "# ── Bang ─"


def in_(nhan, ok, chi):
    print(f"{nhan:60} : " + (f"CAN OK ({chi})" if ok else f"KHONG CAN !! {chi}"))


def ten_duoc_phep(van):
    m = re.search(r'^HOAN_DUOC_PHEP="([^"]*)"', van, re.M)
    return m.group(1).split() if m else []


def main():
    van = GOC_SCRIPT.read_text(encoding="utf-8")
    phep = ten_duoc_phep(van)
    if not phep:
        print("KHONG CHAY DUOC: khong doc duoc HOAN_DUOC_PHEP trong chay_het_cong.sh.")
        return 3
    o_hoan_duoc = phep[0]

    i, j = van.find(MOC_DAU), van.find(MOC_CUOI)
    if i < 0 or j < 0 or j <= i:
        print("KHONG CHAY DUOC: khong neo duoc khoi danh sach o trong chay_het_cong.sh.")
        print(f"Tim moc dau {MOC_DAU!r} va moc cuoi {MOC_CUOI!r}.")
        return 3

    tam = Path(tempfile.mkdtemp(prefix="bite-hoan-"))
    for d in ("CNCLData", "CaoLocMatch", "Dataset_CongNgheChienLuoc", ".touch"):
        (tam / d).mkdir(parents=True)
    kich = tam / "CaoLocMatch" / "chay_het_cong.sh"

    def dung(ma_o_hoan, ma_o_thuong=0):
        """Dung ban sao script voi ba o gia. `ma_o_hoan` la ma thoat cua o duoc phep hoan."""
        gia = (f'chay CNCLData mot_o_xanh "$CNCL" \'\' /bin/true\n'
               f'chay CNCLData {o_hoan_duoc} "$CNCL" \'\' /bin/sh -c "exit {ma_o_hoan}"\n'
               f'chay CNCLData mot_o_nua "$CNCL" \'\' /bin/sh -c "exit {ma_o_thuong}"\n\n')
        kich.write_text(van[:i] + gia + van[j:], encoding="utf-8")
        kich.chmod(0o755)

    def chay(*co):
        r = subprocess.run(["/bin/bash", str(kich), "--im", *co],
                           capture_output=True, text=True, cwd=str(tam / "CaoLocMatch"))
        return r.returncode, r.stdout + r.stderr

    dung(3)
    ma, ra = chay()
    ok1 = ma != 0 and "KHONG CHAY" in ra
    in_("RANG 1 · khong co co thi mot o tra 3 lam ca luot that bai", ok1,
        f"exit {ma}, bang ghi KHONG CHAY" if ok1 else f"exit {ma}")

    ma, ra = chay(f"--hoan={o_hoan_duoc}")
    ok2 = ma == 0 and "O DUOC HOAN" in ra and "KHONG phai" in ra
    in_("RANG 2 · hoan o trong danh sach thi qua, nhung phai noi ra", ok2,
        "exit 0, co muc O DUOC HOAN" if ok2 else f"exit {ma}")

    dung(2)
    ma, ra = chay(f"--hoan={o_hoan_duoc}")
    ok3 = ma != 0 and re.search(rf"{re.escape(o_hoan_duoc)}\s+DO", ra) is not None
    in_("RANG 3 · o DO khong bao gio hoan duoc", ok3,
        f"exit {ma}, van la DO" if ok3 else f"exit {ma}, KHONG con la DO")

    dung(3)
    ma, ra = chay("--hoan=mot_o_xanh")
    ok4 = ma == 3 and "KET QUA" not in ra
    in_("RANG 4 · ten ngoai danh sach bi chan TRUOC khi chay cong nao", ok4,
        "exit 3, khong in bang" if ok4 else f"exit {ma}, {'co in bang' if 'KET QUA' in ra else ''}")

    dung(0)
    ma, ra = chay(f"--hoan={o_hoan_duoc}")
    ok5 = ma == 0 and "HOAN THUA" in ra
    in_("RANG 5 · hoan mot o dang xanh thi phai bao HOAN THUA", ok5,
        "exit 0, co HOAN THUA" if ok5 else f"exit {ma}")

    shutil.rmtree(tam, ignore_errors=True)
    tat_ca = ok1 and ok2 and ok3 and ok4 and ok5
    print("-" * 76)
    print("BITE HOAN:", "RANG CAN" if tat_ca else "CO RANG KHONG CAN")
    return 0 if tat_ca else 1


if __name__ == "__main__":
    sys.exit(main())
