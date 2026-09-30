#!/usr/bin/env python3
"""bite_pheu_matching.py · Rang cua pheu_matching.py.

CANH
====
TU DUNG LAY CANH: chep CaoLocMatch (tru reports/ va .git) vao thu muc tam (tempfile.mkdtemp),
tiem loi vao BAN SAO. Kho that khong bi cham.

RANG
====
RANG 1 · CANH SACH -> exit 0, in "PHEU:".
RANG 2 · PHIEU BO QUA CANH CHUOI GIA TRI (dem khac engine) -> exit 2, "lech engine".
RANG 3 · MAT out/facts.jsonl -> exit 3 KHONG CHAY DUOC, khong duoc bia phieu rong.
RANG 4 · BOT MOT DONG out/matches.jsonl (ky + tu choi != ung vien) -> exit 2.

Chay: python3 bite_pheu_matching.py     Exit 0 moi rang can · 2 co rang khong can.
"""
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
kq = []


def in_(nhan, ok, chi):
    print(f"{nhan:58} : " + (f"CAN OK ({chi})" if ok else f"KHONG CAN !! {chi}"))
    kq.append(ok)


def canh(tam):
    d = Path(tempfile.mkdtemp(dir=tam)) / "CaoLocMatch"
    shutil.copytree(HERE, d, ignore=shutil.ignore_patterns("reports", ".git", "__pycache__", "*.pyc"))
    return d


def chay(d):
    r = subprocess.run([sys.executable, str(d / "pheu_matching.py")], capture_output=True, text=True, cwd=str(d))
    return r.returncode, r.stdout + r.stderr


def main():
    if not (HERE / "out" / "facts.jsonl").exists():
        print("KHONG CHAY DUOC: thieu out/facts.jsonl de dung canh. Chay match_engine.py run truoc.")
        return 3
    tam = tempfile.mkdtemp(prefix="bite_pheu_")
    try:
        d = canh(tam); ma, ra = chay(d)
        in_("RANG 1 · canh sach -> exit 0", ma == 0 and "PHEU:" in ra, f"exit {ma}")

        d = canh(tam); p = d / "pheu_matching.py"; s = p.read_text(encoding="utf-8")
        moc = "for e in edges:"
        if moc not in s:
            in_("RANG 2 · phieu bo qua canh chuoi gia tri -> lech engine", False, "KHONG TIEM DUOC")
        else:
            p.write_text(s.replace(moc, "for e in []:", 1), encoding="utf-8")
            ma, ra = chay(d)
            in_("RANG 2 · phieu bo qua canh chuoi gia tri -> lech engine", ma == 2 and "lech engine" in ra, f"exit {ma}")

        d = canh(tam); (d / "out" / "facts.jsonl").unlink()
        ma, ra = chay(d)
        in_("RANG 3 · mat out/facts.jsonl -> KHONG CHAY DUOC", ma == 3 and "KHONG CHAY DUOC" in ra, f"exit {ma}")

        d = canh(tam); p = d / "out" / "matches.jsonl"
        dong = [l for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]
        p.write_text("\n".join(dong[1:]) + "\n", encoding="utf-8")
        ma, ra = chay(d)
        in_("RANG 4 · bot mot dong matches.jsonl -> exit 2", ma == 2, f"exit {ma}")
    finally:
        shutil.rmtree(tam, ignore_errors=True)
    can = sum(kq)
    print(f"\nBITE PHEU: {can}/{len(kq)} rang can")
    return 0 if can == len(kq) else 2


if __name__ == "__main__":
    sys.exit(main())
