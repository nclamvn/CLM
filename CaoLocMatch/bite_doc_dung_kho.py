#!/usr/bin/env python3
"""bite_doc_dung_kho.py · Bon rang cua cong check_doc_dung_kho.py.

CANH
====
TU DUNG LAY CANH. Rang chep cay kho sang thu muc tam roi lam viec tren ban sao; kho that
khong bao gio bi cham.

Canh cua RANG 2 TU DUNG CA CAY NGOAI. Hai ban truoc deu sai va deu sai cung mot kieu:

  ban 1  lay ban ma cu bang `git show <SHA>:...`  -> go cung mot SHA, bam vao artefact
  ban 2  chi cat dong "to tien" roi trong vao viec may co /Users/os hoac /sessions/*/mnt
         de ban da cat doc trom -> bam vao MOI TRUONG

Ban 2 chay xanh tren may that va GAY khi chay trong khong gian cach ly (dung nhu CI): hai goc
co dinh khong ton tai nen ban da cat thoat ngay luc nap, cong tra 3 chu khong tra 2.

Nay rang tu chep mot cay ngoai vao thu muc tam roi tro ban da cat vao chinh cay do. Hanh vi
can do la "doc mot cay khac cay minh dang nam trong", va no do duoc o MOI moi truong.

Phep tro do phai xay ra dung mot lan; khong xay ra thi RANG 2 tra KHONG CHAY DUOC chu khong
am tham thanh khong-lam-gi.

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

    # RANG 2 · TU DUNG LUON CAY NGOAI, khong trong cho may co san mot cay ngoai.
    #
    # Ban dau rang nay chi cat dong "to tien" di, roi trong vao viec may co /Users/os hoac
    # /sessions/*/mnt de ban da cat doc trom. Chay trong mot khong gian cach ly (dung nhu CI)
    # thi hai goc do khong ton tai, ban da cat gay ngay luc nap, cong tra 3 chu khong tra 2,
    # va rang bao KHONG CAN. Rang lai bam vao MOI TRUONG chu khong vao HANH VI: dung ho loi ma
    # TIP-03 duoc viet ra de chan, va lan nay chinh toi vua mac lai trong cung mot me.
    #
    # Nay rang tu dung mot cay ngoai trong thu muc tam roi tro ban da cat vao do. Hanh vi can
    # do la "doc mot cay khac cay minh dang nam trong", va no do duoc o moi moi truong.
    ngoai = tam / "cay_ngoai"
    shutil.copytree(goc, ngoai, ignore=BO_QUA, symlinks=True)
    van, so = re.subn(re.escape(DONG_TO_TIEN) + r"[^\]]*\]",
                      f"for g in [Path({str(ngoai)!r})]", giu_build, count=1)
    if so != 1:
        print("KHONG CHAY DUOC: khong tro duoc ham tim duong dan sang cay ngoai tu dung.")
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
