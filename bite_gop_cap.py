#!/usr/bin/env python3
"""bite_gop_cap.py · Ba rang cua buoc GOP MATCH CUNG CAP va luat chu ky theo tap con.

VI SAO CAN (18/08/2026): truoc hom nay, cao them mot nguon cho mot cap DA KY se sinh ra mot
dong match thu hai cho dung cap do. Cung mot ket luan hien hai lan, va so match phinh theo
SO NGUON chu khong theo SO CAP that. Nay engine gop lai mot dong nhieu chuoi bang chung.

Gop xong thi khoa noi dung cua dong doi, nen phai doi luon cach tra so chu ky. Luat moi:

    Chu ky con gia tri khi TAP BANG CHUNG DA KY van con nguyen trong dong, dung tung chu.
    Fact moi them vao KHONG duoc chu ky do bao ve, chung bi danh dau `chua_duyet`.

Luat nay de bi lam long mot cach vo tinh. Chi can lo tay cho "co mat mot fact da ky" thay vi
"con nguyen tung chu" la chu ky se song sot qua ca viec bang chung bi viet lai. Ba rang duoi
day canh dung ranh gioi do.

RANG 1 · GOP THAT: hai chuoi bang chung cho cung mot cap phai ra MOT dong, khong bo chuoi nao.
RANG 2 · THEM THI CON: them mot fact moi vao cap da ky thi chu ky VAN con, va fact moi phai
         bi danh dau chua_duyet. Neu khong danh dau, no se duoc trinh nhu da qua mat nguoi.
RANG 3 · SUA THI RUNG: sua mot chu trong fact DA KY thi chu ky phai rung ra.

Rang 2 va rang 3 phai cung dung mot luc. Chi rang 2 thi la khoa long; chi rang 3 thi moi lan
cao them nguon la phai ky lai het, va ky lai hang loat thi chu ky mat y nghia.

Chay: python3 bite_gop_cap.py
Exit 0 neu ca ba rang can. Exit 1 neu co rang khong can. Exit 3 neu khong dung duoc canh.
"""
import json, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT))
from ban_tam import ban_tam

BT = None
CAP_MOI = ("CNCL-P23 · nhu cầu quốc gia", "FPT Semiconductor")


def _chay(lenh):
    r = subprocess.run([sys.executable, str(BT.match / "match_engine.py")] + lenh,
                       cwd=str(BT.match), capture_output=True, text=True, env=BT.moi_truong)
    return r.returncode, r.stdout + r.stderr


def _rows():
    p = BT.match / "out" / "matches.jsonl"
    return [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]


def main():
    global BT
    with ban_tam(can_touch=False) as bt:
        BT = bt
        rc, out = _chay(["run", "domains/cncl_match"])
        if rc != 0:
            print(f"KHONG CHAY DUOC: run exit{rc}\n{out[-500:]}")
            return 3

        # ── RANG 1 · gop that ────────────────────────────────────────────────
        ok1 = "GOP CUNG CAP:" in out
        rows = _rows()
        cap = [m for m in rows if (m["demand"]["entity_id"], m["supply"]["entity_id"]) == CAP_MOI]
        nhieu_chuoi = [m for m in rows if len(m["rationale"].get("chuoi_bang_chung") or []) > 1]
        ok1 = ok1 and len(cap) == 1 and len(nhieu_chuoi) >= 1
        print(f"{'RANG 1 · gop that, khong bo chuoi':38s} : " +
              (f"CAN OK ({len(nhieu_chuoi)} dong nhieu chuoi, cap moi chi 1 dong)" if ok1
               else f"KHONG CAN !! cap={len(cap)} nhieu_chuoi={len(nhieu_chuoi)}"))

        # ── RANG 2 · them bang chung thi chu ky con, nhung phai danh dau ─────
        rc, out = _chay(["restore-signoff", "domains/cncl_match", "out/matches.jsonl"])
        rows = _rows()
        co_dau = [m for m in rows if (m["gate"]["signoff"] or {}).get("chua_duyet")]
        van_ky = [m for m in co_dau if (m["gate"]["signoff"] or {}).get("by") not in (None, "pending-human-review")]
        ok2 = rc == 0 and len(co_dau) >= 1 and len(van_ky) == len(co_dau) and "CHUA AI DUYET" in out
        print(f"{'RANG 2 · them thi chu ky con + danh dau':38s} : " +
              (f"CAN OK ({len(co_dau)} dong co chua_duyet ma van giu chu ky)" if ok2
               else f"KHONG CAN !! exit{rc} co_dau={len(co_dau)} van_ky={len(van_ky)}"))

        # ── RANG 3 · sua chu cua fact DA KY thi chu ky rung ──────────────────
        p = BT.match / "domains" / "cncl_match" / "claims.jsonl"
        cs = [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]
        n = 0
        for c in cs:
            if c["entity"] == "Tập đoàn Viettel" and c["field"] == "capability_2" and "28-32 nm" in c["evidence_span"]:
                c["evidence_span"] = c["evidence_span"].replace("28-32 nm", "28 nm")
                n += 1
        if n == 0:
            print(f"{'RANG 3 · sua thi rung':38s} :  N/A (khong thay moc de sua)")
            return 3
        p.write_text("\n".join(json.dumps(x, ensure_ascii=False) for x in cs) + "\n", encoding="utf-8")
        rc, out = _chay(["restore-signoff", "domains/cncl_match", "out/matches.jsonl"])
        ok3 = rc == 2 and "BANG CHUNG DOI CHU" in out
        print(f"{'RANG 3 · sua fact da ky thi chu ky rung':38s} : " +
              (f"CAN OK (exit 2, chu ky bi go)" if ok3 else f"KHONG CAN !! exit{rc}\n{out[-400:]}"))

    tat_ca = ok1 and ok2 and ok3
    print("-" * 62)
    print("BITE GOP CAP:", "RANG CAN" if tat_ca else "CO RANG KHONG CAN")
    return 0 if tat_ca else 1


if __name__ == "__main__":
    sys.exit(main())
