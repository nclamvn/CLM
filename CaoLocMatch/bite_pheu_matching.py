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
RANG 4 · BOT MOT DONG out/matches.jsonl (ky + tu choi + cho ky != ung vien) -> exit 2.
RANG 5 · DANH DAU MOT MATCH DA KY LA CHUA KY -> da ky giam 1, cho ky tang 1, exit 0.

Chay: python3 bite_pheu_matching.py     Exit 0 moi rang can · 2 co rang khong can.
"""
import json
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
        d = canh(tam); ma, ra = chay(d); ra_sach = ra
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

        # RANG 5 (30/09/2026): mot ung vien CHUA KY nam trong matches.jsonl phai dem la cho ky,
        # khong phai da ky. Mo phong lo lam giau dot 01 lo ra phieu ghi 24 ky khi chi co 11 chu ky.
        d = canh(tam); p = d / "out" / "matches.jsonl"
        dong = [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]
        da_ky = [m for m in dong if ((m.get("gate") or {}).get("signoff") or {}).get("by") != "pending-human-review"]
        da_ky[0]["gate"]["signoff"]["by"] = "pending-human-review"
        p.write_text("".join(json.dumps(m, ensure_ascii=False) + "\n" for m in dong), encoding="utf-8")
        ma, ra = chay(d)
        # So voi canh sach (rang 1): da ky giam dung 1, cho ky tang dung 1. Khong go cung con so,
        # vi registry that co the dang co san ung vien cho ky (sau mot lo lam giau).
        import re
        def so(t):
            m = re.search(r"(\d+) ky / (\d+) tu choi / (\d+) cho ky", t)
            return tuple(map(int, m.groups())) if m else None
        s0, s1 = so(ra_sach), so(ra)
        ok = ma == 0 and s0 and s1 and s1[0] == s0[0] - 1 and s1[2] == s0[2] + 1 and s1[1] == s0[1]
        in_("RANG 5 · mot ung vien chua ky -> dem cho ky, khong dem ky", bool(ok), f"exit {ma}, {s0} -> {s1}")
    finally:
        shutil.rmtree(tam, ignore_errors=True)
    can = sum(kq)
    print(f"\nBITE PHEU: {can}/{len(kq)} rang can")
    return 0 if can == len(kq) else 2


if __name__ == "__main__":
    sys.exit(main())
