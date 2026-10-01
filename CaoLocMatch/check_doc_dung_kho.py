#!/usr/bin/env python3
"""check_doc_dung_kho.py · Script chay trong kho nao thi phai DOC DU LIEU CUA KHO DO.

VI SAO CO (01/09/2026): ngay sau khi gop kho thu tu, `build_cncl_match.py` van tra
`SUP = /sessions/.../mnt/CNCLData`, tuc KHO CU, du dang chay tu trong kho gop. Ham tim duong
dan cua no chi thu hai goc co dinh `/Users/os` va `/sessions/.../mnt`, khong bao gio nhin vao
to tien cua chinh no.

Chuyen nay KHONG lo ra qua bang cong: chuoi 36 o van bao 36 xanh, vi kho cu va kho gop luc do
giong het nhau tung byte. Tuc la xanh NHO MAY. Ngay nao mot ben doi thi ket qua dan xuat se
lay tu ben kia va khong ai biet, dung cai mim ma viec gop di xoa bo.

CACH DO: khong doc ma nguon, khong dem chu. Dung mot BAY CHI BAO.

  1. Chep ca cay kho sang thu muc tam (bo .git, node_modules, reports).
  2. Chay cac script sinh du lieu tren ban sao NGUYEN VEN, ghi lai con so.  <- nen
  3. LAM RONG mot file du lieu trong ban sao.
  4. Chay lai. Con so cu ma VAN HIEN RA thi script khong doc ban sao, no doc mot cay khac.

Buoc 2 la phan bat buoc: khong co no thi "con so bien mat" co the vi script gay vi ly do khac,
va cong se bao DO nham. Do CA HAI CHIEU trong cung mot luot.

Chay: python3 check_doc_dung_kho.py
Exit 0 sach · 2 co script doc kho ngoai · 3 KHONG CHAY DUOC.
"""
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

BO_QUA = shutil.ignore_patterns(".git", "node_modules", ".next", "reports", "__pycache__",
                                ".fidelity_fresh", ".vercel")

# Moi phep do: (nhan, script, thu muc chay, file du lieu lam rong, dau hieu phai BIEN MAT)
#
# "Dau hieu" la mot chuoi chi xuat hien khi script doc duoc du lieu THAT. Lam rong file du lieu
# di thi dau hieu phai bien mat. Con nguyen tuc la no doc o cho khac.
PHEP_DO = [
    ("build_dan_xuat · chieu CAU",
     ["python3", "build_cncl_match.py"], "CaoLocMatch",
     "Dataset_CongNgheChienLuoc/claims.jsonl", r"CAU (\d+)"),
    ("build_dan_xuat · chieu CUNG",
     ["python3", "build_cncl_match.py"], "CaoLocMatch",
     "CNCLData/domains/don_vi_cncl/claims.jsonl", r"CUNG (\d+)"),
    ("sinh_du_lieu_web · chieu CAU",
     ["node", "scripts/gen-cncl-data.mjs"], ".touch",
     "Dataset_CongNgheChienLuoc/claims.jsonl", r"(\d+) nhu cau"),
]


def goc_kho():
    """Thu muc chua CA CNCLData LAN Dataset_CongNgheChienLuoc, tim nguoc tu chinh file nay."""
    for g in Path(__file__).resolve().parents:
        if (g / "CNCLData").is_dir() and (g / "Dataset_CongNgheChienLuoc").is_dir():
            return g
    return None


def chay(cay, cmd, thu_muc):
    r = subprocess.run(cmd, capture_output=True, text=True, cwd=str(cay / thu_muc))
    return r.returncode, r.stdout + r.stderr


def main():
    goc = goc_kho()
    if goc is None:
        print("KHONG CHAY DUOC: khong thay thu muc chua ca CNCLData lan Dataset_CongNgheChienLuoc.")
        print("Cong nay chi co nghia trong bo cuc GOP. Bo cuc ba kho tach roi khong co gi de do.")
        return 3

    tam = Path(tempfile.mkdtemp(prefix="doc-dung-kho-"))
    cay = tam / "kho"
    try:
        shutil.copytree(goc, cay, ignore=BO_QUA, symlinks=True)
    except Exception as e:
        print(f"KHONG CHAY DUOC: khong chep duoc cay kho sang thu muc tam: {e}")
        shutil.rmtree(tam, ignore_errors=True)
        return 3

    loi, dat = [], []
    try:
        do_het(cay, loi, dat)
    finally:
        # 01/10/2026: tung de lai 84 thu muc tam khi chuoi bi ngat giua chung; don trong finally.
        shutil.rmtree(tam, ignore_errors=True)
    return ket_luan(loi, dat)


def do_het(cay, loi, dat):
    for nhan, cmd, thu_muc, file_du_lieu, dau_hieu in PHEP_DO:
        f = cay / file_du_lieu
        if not f.exists():
            loi.append((nhan, f"khong thay file du lieu {file_du_lieu} trong ban sao", True))
            continue
        giu = f.read_text(encoding="utf-8")

        # NEN: ban sao nguyen ven phai chay duoc va phai in ra dau hieu.
        ma, ra = chay(cay, cmd, thu_muc)
        m = re.search(dau_hieu, ra)
        if ma != 0 or not m or int(m.group(1)) == 0:
            loi.append((nhan, f"nen khong dung duoc: exit {ma}, khong thay '{dau_hieu}' co gia tri > 0", True))
            continue
        nen = int(m.group(1))

        # BAY: lam rong file du lieu trong ban sao.
        f.write_text("", encoding="utf-8")
        ma2, ra2 = chay(cay, cmd, thu_muc)
        m2 = re.search(dau_hieu, ra2)
        sau = int(m2.group(1)) if m2 else 0
        f.write_text(giu, encoding="utf-8")

        if sau == nen:
            loi.append((nhan,
                        f"lam rong {file_du_lieu} trong ban sao ma van in ra {sau}. "
                        f"Script nay doc mot cay KHAC, khong doc cay no dang nam trong.", False))
        else:
            dat.append((nhan, nen, sau))


def ket_luan(loi, dat):
    print(f"phep do: {len(PHEP_DO)} · dat: {len(dat)} · hong: {len(loi)}")
    for nhan, nen, sau in dat:
        print(f"  OK  {nhan}: nen {nen} -> sau khi lam rong {sau}")
    if not loi:
        print("\nOK: moi script sinh du lieu deu doc dung cay kho no dang nam trong.")
        return 0

    khong_chay = any(la_ha_tang for _, _, la_ha_tang in loi)
    print()
    for nhan, chi, la_ha_tang in loi:
        print(f"  {'KHONG CHAY DUOC' if la_ha_tang else 'DO'}  {nhan}: {chi}")
    if khong_chay:
        print("\nKHONG CHAY DUOC. Vang tin khong phai tin tot.")
        return 3
    print("\nFAIL: co script doc kho ngoai.")
    print("Ham tim duong dan cua no phai thu TO TIEN CUA CHINH FILE truoc hai goc co dinh.")
    print("Ngay 01/09/2026 build_cncl_match.py mac dung loi nay va bang cong van bao 36 xanh,")
    print("vi hai cay luc do giong het nhau. Xanh nho may thi khong phai xanh.")
    return 2


if __name__ == "__main__":
    sys.exit(main())
