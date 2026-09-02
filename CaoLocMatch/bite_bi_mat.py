#!/usr/bin/env python3
"""bite_bi_mat.py · Sau rang cua cong check_bi_mat.py.

CANH
====
TU DUNG LAY CANH: mot kho git that su nhung nam trong thu muc tam, `git init` roi `git add`.
Phai la kho git that vi cong doc danh sach file bang `git ls-files`, khong doc thu muc.

Bi mat gia trong canh nay deu duoc GHEP TU MANH luc chay, khong viet nguyen van trong file
nay. Ly do khong phai e de: file nay cung nam trong kho va cung bi cong quet. Viet nguyen van
mot chuoi dang token vao day la tu tay tao ra mot ca bao gia vinh vien.

RANG
====
RANG 1 · CANH SACH THI XANH: kho chi co file thuong -> exit 0.
RANG 2 · TOKEN TRONG NOI DUNG THI DO: cai mot chuoi dang PAT vao mot file -> exit 2, goi dich
         danh ten file va so dong.
RANG 3 · KHOA RIENG THI DO: cai khoi mo dau khoa rieng -> exit 2.
RANG 4 · TEN FILE CAM THI DO DU NOI DUNG RONG: them mot file .env rong -> exit 2.
RANG 5 · KHONG BAO GIA: chuoi bi chat lam doi qua hai dong, khong con la token -> exit 0.
         Day la rang quan trong nhat. Mot cong bao gia se bi nguoi ta tat, va cong bi tat thi
         bang khong co cong. Cong nay da duoc viet de tranh dung cai bay do.
RANG 6 · FILE KHONG DUOC GIT THEO DOI THI KHONG XET: cung chuoi do nhung file nam trong
         .gitignore -> exit 0, vi no khong bao gio bi day len.

Chay: python3 bite_bi_mat.py
"""
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
CONG = HERE / "check_bi_mat.py"

# Ghep tu manh: file nay khong duoc chua nguyen van mot chuoi khop mau nao.
TOKEN_GIA = "github" + "_" + "pat" + "_" + "11ABCDEFG0" + "abcdefghijklmnopqrstuvwxyz012345"
KHOA_GIA = "-" * 5 + "BEGIN" + " RSA PRIVATE KEY" + "-" * 5


def in_(nhan, ok, chi):
    print(f"{nhan:62} : " + (f"CAN OK ({chi})" if ok else f"KHONG CAN !! {chi}"))


def main():
    tam = Path(tempfile.mkdtemp(prefix="bite-bi-mat-"))
    kho = tam / "kho"
    (kho / "CaoLocMatch").mkdir(parents=True)
    shutil.copy2(CONG, kho / "CaoLocMatch" / CONG.name)
    (kho / "mot_file.txt").write_text("chi la mot dong chu binh thuong\n", encoding="utf-8")
    (kho / ".gitignore").write_text("bo_qua/\n", encoding="utf-8")

    def git(*a):
        return subprocess.run(["git", *a], capture_output=True, text=True, cwd=str(kho))

    git("init", "-q")
    git("config", "user.email", "rang@thu.nghiem")
    git("config", "user.name", "rang")

    def nap():
        git("add", "-A")

    def chay():
        r = subprocess.run([sys.executable, str(kho / "CaoLocMatch" / CONG.name)],
                           capture_output=True, text=True, cwd=str(kho / "CaoLocMatch"))
        return r.returncode, r.stdout + r.stderr

    nap()
    ma, ra = chay()
    ok1 = ma == 0
    in_("RANG 1 · canh sach thi XANH", ok1, "exit 0" if ok1 else f"exit {ma}\n{ra[-300:]}")

    f = kho / "cau_hinh.txt"
    f.write_text(f"mot dong vo hai\nTOKEN = {TOKEN_GIA}\nmot dong nua\n", encoding="utf-8")
    nap()
    ma, ra = chay()
    ok2 = ma == 2 and "cau_hinh.txt:2" in ra
    in_("RANG 2 · token trong noi dung thi DO, goi dung so dong", ok2,
        "exit 2, cau_hinh.txt:2" if ok2 else f"exit {ma}")
    f.unlink()

    f2 = kho / "cai_gi_do.txt"
    f2.write_text(KHOA_GIA + "\nMIIEabcdef\n", encoding="utf-8")
    nap()
    ma, ra = chay()
    ok3 = ma == 2 and "khoa rieng" in ra
    in_("RANG 3 · khoi mo dau khoa rieng thi DO", ok3, "exit 2" if ok3 else f"exit {ma}")
    f2.unlink()

    f3 = kho / ".env"
    f3.write_text("", encoding="utf-8")
    nap()
    ma, ra = chay()
    ok4 = ma == 2 and ".env" in ra
    in_("RANG 4 · ten file cam thi DO du noi dung rong", ok4, "exit 2" if ok4 else f"exit {ma}")
    f3.unlink()
    git("rm", "-q", "--cached", ".env")

    # RANG 5 · chuoi bi chat lam doi thi KHONG con la token, va khong duoc bao gia.
    n = len(TOKEN_GIA) // 2
    f4 = kho / "chu_thich.md"
    f4.write_text(f"Mot cau NHAC DEN token, vi du `{TOKEN_GIA[:n]}` noi\nvoi `{TOKEN_GIA[n:]}`.\n",
                  encoding="utf-8")
    nap()
    ma, ra = chay()
    ok5 = ma == 0
    in_("RANG 5 · chuoi chat lam doi thi KHONG bao gia", ok5,
        "exit 0" if ok5 else f"exit {ma}, bao gia")
    f4.unlink()

    # RANG 6 · file khong duoc theo doi thi khong bi day len, nen khong xet.
    (kho / "bo_qua").mkdir()
    (kho / "bo_qua" / "cuc_bo.txt").write_text(f"TOKEN = {TOKEN_GIA}\n", encoding="utf-8")
    nap()
    ma, ra = chay()
    theo_doi = git("ls-files").stdout
    ok6 = ma == 0 and "bo_qua/cuc_bo.txt" not in theo_doi
    in_("RANG 6 · file trong .gitignore thi khong xet", ok6,
        "exit 0, git khong theo doi" if ok6 else f"exit {ma}")

    shutil.rmtree(tam, ignore_errors=True)
    tat_ca = ok1 and ok2 and ok3 and ok4 and ok5 and ok6
    print("-" * 78)
    print("BITE BI MAT:", "RANG CAN" if tat_ca else "CO RANG KHONG CAN")
    return 0 if tat_ca else 1


if __name__ == "__main__":
    sys.exit(main())
