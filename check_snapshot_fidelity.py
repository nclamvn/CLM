#!/usr/bin/env python3
"""check_snapshot_fidelity.py · Cong doi chung SNAPSHOT voi NGUON GOC.

VI SAO CO CONG NAY (TIP-CNCL-2D, tu lo hong Tho tu khai o Pha 2c):
cong SPAN_NOT_FOUND cua refinery chi chung minh evidence_span la chuoi con cua
snapshot. No KHONG chung minh snapshot trung thanh voi trang goc. Neu snapshot bi
ghi sai, bi bia, hoac trang goc doi noi dung, refinery van xanh. Cong nay bit khe do.

THIET KE CO CHU DICH: script nay KHONG tu goi mang.
Ly do: gate phai tat dinh va kiem duoc; mot gate tu fetch se xanh do khac nhau tuy
luc mang tot xau, va nguoi doc bao cao khong biet no da fetch cai gi. Thay vao do,
NGUOI VAN HANH (hoac agent co cong cu fetch) phai dat ban tuoi cua tung trang vao
thu muc --fresh, dat ten trung ten snapshot. Gate chi lam viec so sanh.

CACH DUNG
  python3 check_snapshot_fidelity.py domains/don_vi_cncl
  python3 check_snapshot_fidelity.py domains/don_vi_cncl --fresh .fidelity_fresh
  python3 check_snapshot_fidelity.py domains/don_vi_cncl --sample 3

EXIT CODE (doc tran, khong pipe)
  0 · moi cau trich kiem duoc deu con khop ban tuoi
  2 · SOURCE_CHANGED · co cau trich khong con tim thay trong ban tuoi
  3 · KHONG CHAY DUOC · khong co ban tuoi nao de doi chung (fail-loud, KHONG in OK)

Luat: khong bao gio in OK khi chua doi chung duoc thu gi.
"""
import sys, html, random, unicodedata
from pathlib import Path


def norm(s):
    """Chuan hoa giong refinery: giai HTML entity roi NFC."""
    return unicodedata.normalize("NFC", html.unescape(s or ""))


def quoted_lines(snapshot_text):
    """Cau trich = dong khong rong, khong phai dong header (#) va khong phai tieu de muc."""
    out = []
    for line in snapshot_text.splitlines():
        s = line.strip()
        if not s or s.startswith("#"):
            continue
        out.append(s)
    return out


def main(argv):
    if len(argv) < 2:
        print("Dung: check_snapshot_fidelity.py <domain_dir> [--fresh DIR] [--sample N]")
        return 3
    domain = Path(argv[1])
    fresh_dir = Path(".fidelity_fresh")
    sample = None
    if "--fresh" in argv:
        fresh_dir = Path(argv[argv.index("--fresh") + 1])
    if "--sample" in argv:
        sample = int(argv[argv.index("--sample") + 1])

    snaps = sorted((domain / "snapshots").glob("*"))
    snaps = [p for p in snaps if p.is_file()]
    if sample:
        random.seed(0)
        snaps = sorted(random.sample(snaps, min(sample, len(snaps))))

    checked = unreachable = changed = 0
    lines_ok = 0
    for p in snaps:
        fresh = fresh_dir / p.name
        if not fresh.exists():
            unreachable += 1
            print(f"SOURCE_UNREACHABLE: {p.name} · chua co ban tuoi tai {fresh}")
            continue
        checked += 1
        ftext = norm(fresh.read_text(encoding="utf-8", errors="replace"))
        for line in quoted_lines(p.read_text(encoding="utf-8", errors="replace")):
            if norm(line) in ftext:
                lines_ok += 1
            else:
                changed += 1
                print(f"SOURCE_CHANGED: {p.name} · cau khong con thay trong ban tuoi:")
                print(f"    {line[:120]}")

    print("-" * 60)
    print(f"snapshot: {len(snaps)} · doi chung duoc: {checked} · chua co ban tuoi: {unreachable}")
    print(f"cau khop: {lines_ok} · cau lech: {changed}")

    if changed:
        print("FAIL: snapshot lech so voi ban tuoi cua nguon.")
        return 2
    if checked == 0:
        print("KHONG CHAY DUOC: khong co ban tuoi nao. Day KHONG phai PASS.")
        return 3
    if unreachable:
        print(f"OK mot phan: {checked} snapshot khop, con {unreachable} snapshot chua doi chung.")
        return 0
    print("OK: moi snapshot deu trung thanh voi ban tuoi cua nguon.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
