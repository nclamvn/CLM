#!/usr/bin/env python3
"""bite_fail_closed.py · Bon rang cua cong check_fail_closed.py. TIP-02.

CANH
====
TU DUNG LAY CANH, khong muon du lieu that. Rang chep cac file cong vao mot thu muc tam roi
tiem vao ban sao. Kho that khong bao gio bi cham.

Ly do khai khoi CANH nay: bon lan trong hai ngay mot bo rang gay khong phai vi engine sai ma
vi canh cua no bien mat. Rang phai mo ta HANH VI can do, khong mo ta file cu the.

RANG
====
RANG 1 · TIEM CHO NUOT MOI THI DO: them mot `except Exception: pass` vao mot file cong -> exit 2
         va goi dich danh file do.
RANG 2 · KHAI ROI THI XANH: them nhan NUOT CO Y canh cho vua tiem -> exit 0.
RANG 3 · KHONG BAO GIA TREN CHU THICH: chen mot dong chu thich co chua chu `catch { return; }`
         -> van exit 0. Day la rang quan trong nhat: cong nay tung bao gia dung tren mot cau
         nhac den mot chuong catch, va mot cong bao gia se bi tat.
RANG 4 · SACH THI XANH: khong tiem gi -> exit 0.

Chay: python3 bite_fail_closed.py
"""
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).parent
CONG = HERE / "check_fail_closed.py"


def in_(nhan, ok, chi):
    print(f"{nhan:52} : " + (f"CAN OK ({chi})" if ok else f"KHONG CAN !! {chi}"))


def main():
    tam = Path(tempfile.mkdtemp(prefix="bite-fail-closed-"))
    kho = tam / "CNCLData"
    kho.mkdir(parents=True)
    # Canh phai co DU BA KHO, ke ca khi hai kho kia rong. Cong da doi du ba tu 25/08/2026 de
    # khong quet mot phan roi bao sach; canh thieu kho thi chinh cong se tra 3 va rang bao
    # KHONG CHAY DUOC. Day la lan thu nam trong hai ngay canh cua mot rang phai chay theo hanh
    # vi cua cong, va lan nay lo ra ngay trong cung mot luot sua.
    (tam / "CaoLocMatch").mkdir()
    (tam / ".touch").mkdir()
    # Canh toi thieu: chinh cong, cong duoc soi, va mot file cong de tiem.
    shutil.copy2(CONG, kho / CONG.name)
    moi = kho / "check_thu_nghiem.py"
    goc_ma = (
        "#!/usr/bin/env python3\n"
        '"""File cong gia, chi ton tai trong canh cua bite_fail_closed.py."""\n'
        "import sys\n\n\n"
        "def main():\n"
        "    return 0\n\n\n"
        "if __name__ == '__main__':\n"
        "    sys.exit(main())\n"
    )
    moi.write_text(goc_ma, encoding="utf-8")

    def chay():
        r = subprocess.run([sys.executable, str(kho / CONG.name)],
                           capture_output=True, text=True, cwd=str(kho),
                           env={"PATH": "/usr/bin:/bin:/usr/local/bin"})
        return r.returncode, r.stdout + r.stderr

    # Cong tim kho theo duong dan tuyet doi, nen phai tro no vao canh. Cach re nhat la sua
    # hang GOC trong ban sao. Sua BAN SAO, khong sua ban that.
    ban = (kho / CONG.name).read_text(encoding="utf-8")
    ban = ban.replace('GOC = [Path("/Users/os"), *sorted(Path("/sessions").glob("*/mnt"))]',
                      f'GOC = [Path("{tam}")]')
    (kho / CONG.name).write_text(ban, encoding="utf-8")

    ma, ra = chay()
    if ma != 0:
        print(f"KHONG CHAY DUOC: canh chua tiem gi ma da exit {ma}\n{ra}")
        shutil.rmtree(tam, ignore_errors=True)
        return 3

    nuot = (
        "\n\ndef doc(p):\n"
        "    try:\n"
        "        return open(p).read()\n"
        "    except Exception:\n"
        "        pass\n"
    )
    moi.write_text(goc_ma + nuot, encoding="utf-8")
    ma, ra = chay()
    ok1 = ma == 2 and "check_thu_nghiem.py" in ra
    in_("RANG 1 · tiem cho nuot moi thi DO", ok1, "exit 2, goi dich danh file" if ok1 else f"exit {ma}")

    nuot_khai = nuot.replace("    except Exception:\n",
                             "    except Exception:\n        # NUOT CO Y: file gia, chi de thu rang.\n")
    moi.write_text(goc_ma + nuot_khai, encoding="utf-8")
    ma, ra = chay()
    ok2 = ma == 0
    in_("RANG 2 · khai NUOT CO Y roi thi XANH", ok2, "exit 0" if ok2 else f"exit {ma}")

    ct = goc_ma + "\n# Ban cu viet `catch { return; }` o day, cau nay chi NHAC DEN no.\n"
    moi.write_text(ct, encoding="utf-8")
    ma, ra = chay()
    ok3 = ma == 0
    in_("RANG 3 · khong bao gia tren chu thich", ok3, "exit 0" if ok3 else f"exit {ma}, bao gia")

    moi.write_text(goc_ma, encoding="utf-8")
    ma, ra = chay()
    ok4 = ma == 0
    in_("RANG 4 · tra lai nguyen trang thi XANH", ok4, "exit 0" if ok4 else f"exit {ma}")

    shutil.rmtree(tam, ignore_errors=True)
    tat_ca = ok1 and ok2 and ok3 and ok4
    print("-" * 68)
    print("BITE FAIL CLOSED:", "RANG CAN" if tat_ca else "CO RANG KHONG CAN")
    return 0 if tat_ca else 1


if __name__ == "__main__":
    sys.exit(main())
