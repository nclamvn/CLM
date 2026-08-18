#!/usr/bin/env python3
"""bite_chay_het_cong.py · Ba rang cua chinh cai lenh gop `chay_het_cong.sh`.

VI SAO CAN (18/08/2026): mot bang trang thai chi biet in XANH thi khong phan biet duoc voi
mot may phat den xanh. No con nguy hon khong co bang, vi no tao cam giac da kiem. Truoc khi
tin cai lenh nay, phai thay no bao DO khi co loi that, va bao KHONG CHAY DUOC khi mot cong
mat dieu kien chay.

RANG 1 · BAO DO: tiem mot loi that vao registry (sua evidence_span cho lech ban chup),
         lenh phai exit 1 va o `refinery` cua CNCLData phai la DO.
RANG 2 · KHONG COI VANG TIN LA TIN TOT: giau thu muc ban tuoi di, cong doi chung khong con
         gi de doi chung. Lenh phai bao KHONG CHAY DUOC va van exit 1, tuyet doi khong XANH.
RANG 3 · KHONG BAO DO OAN: tra lai nguyen trang thi phai xanh lai va exit 0.

Rang 2 la rang quan trong nhat. Cong doi chung tra exit 3 chu khong phai 2, va mot bang
trang thai lam au se gom "khac 0 la do" hoac te hon la "khac 2 la xong". Ca hai cach deu
lam mat mot phan biet co that: KHONG BIET khac han BIET LA SAI.

Chay:  python3 bite_chay_het_cong.py
Exit 0 neu ca ba rang can. Exit 1 neu co rang khong can. Exit 3 neu khong dung duoc canh.
"""
import json, shutil, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT))
from build_cncl_match import SUP  # dung chung mot nguon su that ve duong dan

LENH = ROOT / "chay_het_cong.sh"
CLAIMS = SUP / "claims.jsonl"
FRESH = SUP.parent.parent / ".fidelity_fresh"


def chay_lenh():
    r = subprocess.run(["bash", str(LENH), "--nhanh"], capture_output=True, text=True)
    return r.returncode, r.stdout + r.stderr


def o_bang(out, cong):
    """Rut trang thai cua mot o trong bang. Tra None neu khong thay dong do."""
    for d in out.splitlines():
        phan = d.split()
        if len(phan) >= 3 and phan[1] == cong:
            return "KHONG CHAY" if "KHONG CHAY" in d else phan[2]
    return None


def main():
    if not LENH.exists():
        print(f"KHONG CHAY DUOC: thieu {LENH.name}")
        return 3
    if not CLAIMS.exists() or not FRESH.exists():
        print("KHONG CHAY DUOC: thieu claims.jsonl hoac .fidelity_fresh")
        return 3

    giu = CLAIMS.read_bytes()
    ok1 = ok2 = ok3 = False
    tam = FRESH.parent / ".fidelity_fresh__bite_tam"
    try:
        # ── RANG 1 · tiem loi that, doi bao DO ────────────────────────────────
        rows = [json.loads(l) for l in CLAIMS.read_text(encoding="utf-8").splitlines() if l.strip()]
        rows[0]["evidence_span"] = rows[0]["evidence_span"] + " CAU NAY KHONG CO TRONG BAN CHUP"
        CLAIMS.write_text("\n".join(json.dumps(r, ensure_ascii=False) for r in rows) + "\n",
                          encoding="utf-8")
        rc, out = chay_lenh()
        ok1 = rc == 1 and o_bang(out, "refinery") == "DO"
        print(f"{'RANG 1 · bao DO khi co loi that':38s} : " +
              ("CAN OK (exit 1, refinery DO)" if ok1 else f"KHONG CAN !! exit{rc} o={o_bang(out,'refinery')}"))
        CLAIMS.write_bytes(giu)

        # ── RANG 2 · mat dieu kien chay, doi KHONG CHAY DUOC ──────────────────
        FRESH.rename(tam)
        rc, out = chay_lenh()
        o = o_bang(out, "doi_chung_nguon")
        ok2 = rc != 0 and o == "KHONG CHAY"
        print(f"{'RANG 2 · vang tin khong phai tin tot':38s} : " +
              ("CAN OK (KHONG CHAY DUOC, exit khac 0)" if ok2 else f"KHONG CAN !! exit{rc} o={o}"))
        tam.rename(FRESH)

        # ── RANG 3 · khong bao do oan ─────────────────────────────────────────
        rc, out = chay_lenh()
        ok3 = rc == 0 and "TAT CA XANH" in out
        print(f"{'RANG 3 · khong bao DO oan':38s} : " +
              ("CAN OK (exit 0, tat ca xanh)" if ok3 else f"KHONG CAN !! exit{rc}\n{out[-700:]}"))
    finally:
        CLAIMS.write_bytes(giu)
        if tam.exists() and not FRESH.exists():
            tam.rename(FRESH)
        rc, out = chay_lenh()
        if rc != 0:
            print(f"!! PHUC HOI HONG: chay lai sau khi tra ve van exit{rc}\n{out[-700:]}")
            return 1

    tat_ca = ok1 and ok2 and ok3
    print("-" * 62)
    print("BITE CHAY HET CONG:", "RANG CAN" if tat_ca else "CO RANG KHONG CAN")
    return 0 if tat_ca else 1


if __name__ == "__main__":
    sys.exit(main())
