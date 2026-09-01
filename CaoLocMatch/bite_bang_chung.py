#!/usr/bin/env python3
"""bite_bang_chung.py · Rang cua KHOA BANG CHUNG trong so chu ky.

VI SAO CO RANG NAY (16/08/2026): vong doi chung nguon viet lai 17 o bang chung, trong do
co ca cau bi viet lai chu khong chi lech dinh dang. The ma `restore-signoff` van gan lai
DU 12/12 chu ky, khong dong nao bao dong. Ly do: fact_id = sha1(entity|field|value), tuc
khoa KHONG phu evidence_span. Nguoi gac cong ky tren mot cau, cau doi, chu ky van con.

Rang nay chung minh lo do da bit: sua DUNG MOT ky tu trong span cua mot fact ma match dua
vao thi chu ky cua MOI match dung fact do phai bi go ra, khong duoc gan lai am tham.

Chay:  python3 bite_bang_chung.py
Exit 0 neu rang can. Exit 1 neu KHONG can (tuc la cong vo dung, phai sua truoc khi tin).
CANH
====
MUON DU LIEU THAT. Rang chep kho vao thu muc tam roi tiem vao ban sao. Canh phu thuoc vao viec
so chu ky con it nhat mot dong da ky; so rong thi rang bao KHONG CHAY DUOC chu khong bao xanh.
"""
import json, shutil, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).parent
DOMAIN = ROOT / "domains" / "cncl_match"
MATCHES = ROOT / "out" / "matches.jsonl"

# Fact bi tiem loi va chuoi bi sua. Chon o that trong registry de rang chay tren du lieu
# that chu khong phai fixture: du lieu that moi chung minh duoc duong di that.
ENTITY, FIELD = "Tập đoàn Viettel", "capability_2"
CU, MOI = "28-32 nm", "28 nm"


def _chay(domain, matches):
    r = subprocess.run([sys.executable, str(ROOT / "match_engine.py"),
                        "restore-signoff", str(domain), str(matches)],
                       capture_output=True, text=True)
    return r.returncode, r.stdout + r.stderr


def main():
    if not MATCHES.exists():
        print("KHONG CHAY DUOC: chua co out/matches.jsonl. Chay `match_engine.py run` truoc.")
        return 3

    # Doi chung duong: ban sach phai gan lai duoc HET chu ky.
    tmp0 = Path(tempfile.mkdtemp())
    try:
        d0 = tmp0 / "domain"; shutil.copytree(DOMAIN, d0)
        m0 = tmp0 / "matches.jsonl"; shutil.copy(MATCHES, m0)
        rc0, out0 = _chay(d0, m0)
        sach_ok = rc0 == 0
        print(f"{'SACH (doi chung duong)':34s} : " +
              ("PASS exit0" if sach_ok else f"!! exit{rc0}\n{out0}"))
    finally:
        shutil.rmtree(tmp0, ignore_errors=True)

    # Rang: sua chu trong span thi chu ky phai bi go.
    tmp = Path(tempfile.mkdtemp())
    try:
        d = tmp / "domain"; shutil.copytree(DOMAIN, d)
        m = tmp / "matches.jsonl"; shutil.copy(MATCHES, m)
        p = d / "claims.jsonl"
        rows = [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]
        n = 0
        for c in rows:
            if c["entity"] == ENTITY and c["field"] == FIELD and CU in c["evidence_span"]:
                c["evidence_span"] = c["evidence_span"].replace(CU, MOI)
                n += 1
        if n == 0:
            print(f"{'RANG BANG CHUNG':34s} :  N/A (khong thay {ENTITY}/{FIELD} chua {CU!r})")
            return 3
        p.write_text("\n".join(json.dumps(r, ensure_ascii=False) for r in rows) + "\n",
                     encoding="utf-8")
        rc, out = _chay(d, m)
        can = rc == 2 and "BANG CHUNG DOI CHU" in out
        print(f"{'RANG BANG CHUNG':34s} : " +
              ("CAN OK (exit 2, chu ky bi go)" if can else f"KHONG CAN !! exit{rc}\n{out}"))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)

    tat_ca = sach_ok and can
    print("-" * 62)
    print("BITE KHOA BANG CHUNG:", "RANG CAN" if tat_ca else "RANG KHONG CAN")
    return 0 if tat_ca else 1


if __name__ == "__main__":
    sys.exit(main())
