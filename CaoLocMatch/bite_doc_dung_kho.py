#!/usr/bin/env python3
"""bite_doc_dung_kho.py · Bon rang cua cong check_doc_dung_kho.py.

CANH
====
TU DUNG LAY CANH. Rang chep cay kho sang thu muc tam roi lam viec tren ban sao; kho that
khong bao gio bi cham.

Canh cua RANG 2 cung TU DUNG chu khong lay ban ma cu tu git. Ban dau toi dinh viet
`git show 1f45a4f:CaoLocMatch/build_cncl_match.py` cho tien, nhung do la go cung mot SHA, tuc
lai bam vao artefact thay vi hanh vi, dung cai bay TIP-03 duoc viet ra de chan. Nay rang tu
gay ra HANH VI can do: bo dong "to tien cua chinh file nay" khoi ham tim duong dan, va DOI
phep bo do phai thuc su xay ra dung mot lan.

Neu mai kia ham tim duong dan doi hinh dang thi RANG 2 tra KHONG CHAY DUOC chu khong am tham
thanh khong-lam-gi.

RANG
====
RANG 1 · CANH SACH THI XANH: ban sao nguyen ven -> exit 0.
RANG 2 · BO LOI TIM THEO TO TIEN THI DO: cat dong to tien khoi build_cncl_match.py trong ban
         sao -> exit 2, va goi dich danh build_dan_xuat.
RANG 3 · THIEU FILE DU LIEU LA KHONG CHAY DUOC: xoa claims.jsonl chieu CAU khoi ban sao ->
         exit 3, khong duoc la 0 va cung khong duoc la 2.
RANG 4 · KHONG PHAI BO CUC GOP THI KHONG CHAY DUOC: dat mot minh cong vao thu muc trong ->
         exit 3, vi khong co gi de do.

Chay: python3 bite_doc_dung_kho.py
"""
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
CONG = HERE / "check_doc_dung_kho.py"
BO_QUA = shutil.ignore_patterns(".git", "node_modules", ".next", "reports", "__pycache__",
                                ".fidelity_fresh", ".vercel")
DONG_TO_TIEN = "for g in [*Path(__file__).resolve().parents,"


def in_(nhan, ok, chi):
    print(f"{nhan:56} : " + (f"CAN OK ({chi})" if ok else f"KHONG CAN !! {chi}"))


def goc_kho():
    for g in HERE.parents:
        if (g / "CNCLData").is_dir() and (g / "Dataset_CongNgheChienLuoc").is_dir():
            return g
    return None


def chay_cong(cay):
    r = subprocess.run([sys.executable, str(cay / "CaoLocMatch" / CONG.name)],
                       capture_output=True, text=True, cwd=str(cay / "CaoLocMatch"))
    return r.returncode, r.stdout + r.stderr


def main():
    goc = goc_kho()
    if goc is None:
        print("KHONG CHAY DUOC: khong thay bo cuc gop, khong dung duoc canh.")
        return 3

    tam = Path(tempfile.mkdtemp(prefix="bite-doc-dung-kho-"))
    cay = tam / "kho"
    shutil.copytree(goc, cay, ignore=BO_QUA, symlinks=True)
    build = cay / "CaoLocMatch" / "build_cncl_match.py"
    giu_build = build.read_text(encoding="utf-8")

    ma, ra = chay_cong(cay)
    ok1 = ma == 0
    in_("RANG 1 · canh sach thi XANH", ok1, "exit 0" if ok1 else f"exit {ma}\n{ra[-400:]}")

    # RANG 2 · tu gay ra hanh vi "chi nhin hai goc co dinh", khong lay ban cu tu git.
    van, so = re.subn(re.escape(DONG_TO_TIEN) + r"\n\s*Path\(",
                      "for g in [Path(", giu_build, count=1)
    if so != 1:
        print("KHONG CHAY DUOC: khong cat duoc dong tim theo to tien trong build_cncl_match.py.")
        print(f"Ham tim duong dan da doi hinh dang; RANG 2 phai duoc sua theo. Tim: {DONG_TO_TIEN!r}")
        shutil.rmtree(tam, ignore_errors=True)
        return 3
    build.write_text(van, encoding="utf-8")
    ma, ra = chay_cong(cay)
    ok2 = ma == 2 and "build_dan_xuat" in ra
    in_("RANG 2 · bo loi tim theo to tien thi DO", ok2,
        "exit 2, goi dich danh build_dan_xuat" if ok2 else f"exit {ma}")
    build.write_text(giu_build, encoding="utf-8")

    # RANG 3 · thieu file du lieu la KHONG CHAY DUOC, khong duoc la sach va cung khong phai DO.
    f = cay / "Dataset_CongNgheChienLuoc" / "claims.jsonl"
    giu_f = f.read_text(encoding="utf-8")
    f.unlink()
    ma, ra = chay_cong(cay)
    ok3 = ma == 3
    in_("RANG 3 · thieu file du lieu thi KHONG CHAY DUOC", ok3, "exit 3" if ok3 else f"exit {ma}")
    f.write_text(giu_f, encoding="utf-8")

    # RANG 4 · dat cong mot minh vao thu muc trong: khong co bo cuc gop thi khong do duoc gi.
    le = tam / "mot_minh"
    (le / "CaoLocMatch").mkdir(parents=True)
    shutil.copy2(CONG, le / "CaoLocMatch" / CONG.name)
    ma, ra = chay_cong(le)
    ok4 = ma == 3
    in_("RANG 4 · khong phai bo cuc gop thi KHONG CHAY DUOC", ok4, "exit 3" if ok4 else f"exit {ma}")

    shutil.rmtree(tam, ignore_errors=True)
    tat_ca = ok1 and ok2 and ok3 and ok4
    print("-" * 72)
    print("BITE DOC DUNG KHO:", "RANG CAN" if tat_ca else "CO RANG KHONG CAN")
    return 0 if tat_ca else 1


if __name__ == "__main__":
    sys.exit(main())
