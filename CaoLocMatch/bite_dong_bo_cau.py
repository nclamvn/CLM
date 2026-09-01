#!/usr/bin/env python3
"""bite_dong_bo_cau.py · Nam rang cua dong_bo_cau.py.

CANH
====
TU DUNG LAY CANH bang thu muc tam: mot cay kho toi thieu (chinh script + thu muc chieu CAU)
va mot ban doc rieng, tro toi bang bien CLM_BAN_DOC. Kho that va ban doc that o KnowledgeBase
khong bao gio bi cham, ke ca o rang thu tu von co gay ra viec ghi de.

Rang khong bam vao file cu the nao cua chieu CAU: no lay file DAU TIEN trong ban doc de sua,
nen dataset doi bao nhieu lan thi rang van chay. Sua nay theo dung luat TIP-03: mo ta HANH VI
can do, khong mo ta FILE.

RANG
====
RANG 1 · HAI BAN TRUNG THI XANH: chep y nguyen -> exit 0.
RANG 2 · SUA BAN DOC THI DO: doi mot byte trong ban doc -> exit 2 va goi dich danh file do.
RANG 3 · VANG BAN DOC LA KHONG CHAY DUOC: CLM_BAN_DOC tro toi thu muc khong ton tai -> exit 3.
         Day la o se treo trong CI, nen no phai treo chu khong duoc bao sach.
RANG 4 · TU CHOI DAY DE LEN SUA DOI: da ghi dau, roi sua ban doc, roi --day -> exit 2 VA noi
         dung cua ban doc phai con nguyen. Tu choi ma van ghi de thi loi tu choi la vo nghia.
RANG 5 · EP THI DAY DUOC: nhu tren nhung them --du-biet-ban-doc-da-sua -> exit 0 va ban doc
         tro ve dung nhu kho.

Chay: python3 bite_dong_bo_cau.py
"""
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
CONG = HERE / "dong_bo_cau.py"
TEN = "Dataset_CongNgheChienLuoc"
BO_QUA = shutil.ignore_patterns(".git", "__pycache__", ".dong_bo_ban_doc")


def in_(nhan, ok, chi):
    print(f"{nhan:58} : " + (f"CAN OK ({chi})" if ok else f"KHONG CAN !! {chi}"))


def nguon_that():
    for g in HERE.parents:
        if (g / TEN).is_dir():
            return g / TEN
    return None


def main():
    nt = nguon_that()
    if nt is None:
        print(f"KHONG CHAY DUOC: khong thay {TEN} de dung canh.")
        return 3

    tam = Path(tempfile.mkdtemp(prefix="bite-dong-bo-cau-"))
    kho = tam / "kho"
    (kho / "CaoLocMatch").mkdir(parents=True)
    shutil.copy2(CONG, kho / "CaoLocMatch" / CONG.name)
    shutil.copytree(nt, kho / TEN, ignore=BO_QUA)
    bd = tam / "ban_doc"
    shutil.copytree(nt, bd, ignore=BO_QUA)

    def chay(*them, ban_doc=None):
        e = dict(os.environ)
        e["CLM_BAN_DOC"] = str(bd if ban_doc is None else ban_doc)
        r = subprocess.run([sys.executable, str(kho / "CaoLocMatch" / CONG.name), *them],
                           capture_output=True, text=True, cwd=str(kho / "CaoLocMatch"), env=e)
        return r.returncode, r.stdout + r.stderr

    ma, ra = chay()
    ok1 = ma == 0
    in_("RANG 1 · hai ban trung thi XANH", ok1, "exit 0" if ok1 else f"exit {ma}\n{ra[-300:]}")

    # File dau tien trong ban doc, khong go cung ten file nao.
    nan = sorted(p for p in bd.rglob("*") if p.is_file())[0]
    giu = nan.read_bytes()
    nan.write_bytes(giu + b"\n# mot dong khong co ben kho\n")
    ma, ra = chay()
    ok2 = ma == 2 and nan.name in ra
    in_("RANG 2 · sua ban doc thi DO", ok2,
        f"exit 2, goi ten {nan.name}" if ok2 else f"exit {ma}")

    ma, ra = chay(ban_doc=tam / "khong-he-co")
    ok3 = ma == 3
    in_("RANG 3 · vang ban doc la KHONG CHAY DUOC", ok3, "exit 3" if ok3 else f"exit {ma}")

    # RANG 4: ghi dau truoc (day mot lan tren canh SACH), roi sua ban doc, roi day lai.
    nan.write_bytes(giu)
    ma, _ = chay("--day")
    if ma != 0:
        print(f"KHONG CHAY DUOC: khong ghi duoc dau tren canh sach (exit {ma}).")
        shutil.rmtree(tam, ignore_errors=True)
        return 3
    ban_sua = giu + b"\n# nguoi khac sua ban doc\n"
    nan.write_bytes(ban_sua)
    ma, ra = chay("--day")
    con_nguyen = nan.read_bytes() == ban_sua
    ok4 = ma == 2 and con_nguyen
    in_("RANG 4 · tu choi day de len, va KHONG ghi de", ok4,
        "exit 2, ban doc con nguyen" if ok4 else
        f"exit {ma}, ban doc {'con nguyen' if con_nguyen else 'DA BI GHI DE'}")

    ma, ra = chay("--day", "--du-biet-ban-doc-da-sua")
    ok5 = ma == 0 and nan.read_bytes() == (kho / TEN / nan.relative_to(bd)).read_bytes()
    in_("RANG 5 · ep thi day duoc va ban doc theo kho", ok5, "exit 0" if ok5 else f"exit {ma}")

    shutil.rmtree(tam, ignore_errors=True)
    tat_ca = ok1 and ok2 and ok3 and ok4 and ok5
    print("-" * 74)
    print("BITE DONG BO CAU:", "RANG CAN" if tat_ca else "CO RANG KHONG CAN")
    return 0 if tat_ca else 1


if __name__ == "__main__":
    sys.exit(main())
