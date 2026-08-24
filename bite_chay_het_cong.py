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
from ban_tam import ban_tam

BT = None  # dat trong main(), moi thao tac deu tren BAN SAO


def chay_lenh():
    """Chay bang trang thai TREN BAN SAO. Kho that khong bi cham, ke ca khi rang tiem loi."""
    r = subprocess.run(["bash", str(BT.match / "chay_het_cong.sh"), "--nhanh"],
                       capture_output=True, text=True, env=BT.moi_truong)
    return r.returncode, r.stdout + r.stderr


def _duong_that():
    """Cac file THAT ma phep thu tuyet doi khong duoc cham. Bo qua file chua ton tai."""
    from ban_tam import _goc
    ds = []
    for duoi in [("CNCLData", "domains", "don_vi_cncl", "claims.jsonl"),
                 ("RtR", "KnowledgeBase", "CaoLocMatch_PoC", "CaoLocMatch_TraCuu.html"),
                 ("KnowledgeBase", "CaoLocMatch_PoC", "CaoLocMatch_TraCuu.html"),
                 (".touch", "lib", "cncl-registry.ts"),
                 (".touch", "lib", "cncl-match.ts")]:
        p = _goc(*duoi)
        if p and p.is_file():
            ds.append(p)
    return ds


def _van_tay(ds):
    import hashlib
    return {str(p): hashlib.sha256(p.read_bytes()).hexdigest() for p in ds}


def o_bang(out, cong):
    """Rut trang thai cua mot o trong bang. Tra None neu khong thay dong do."""
    for d in out.splitlines():
        phan = d.split()
        if len(phan) >= 3 and phan[1] == cong:
            return "KHONG CHAY" if "KHONG CHAY" in d else phan[2]
    return None


def main():
    global BT
    duong_that = _duong_that()
    van_tay_truoc = _van_tay(duong_that)
    with ban_tam() as bt:
        BT = bt
        claims = bt.cncl / "domains" / "don_vi_cncl" / "claims.jsonl"
        fresh = bt.cncl / ".fidelity_fresh"
        if not (bt.match / "chay_het_cong.sh").exists():
            print("KHONG CHAY DUOC: ban tam thieu chay_het_cong.sh")
            return 3
        if not claims.exists() or not fresh.exists():
            print("KHONG CHAY DUOC: ban tam thieu claims.jsonl hoac .fidelity_fresh")
            return 3

        ok1 = ok2 = ok3 = False
        tam = fresh.parent / ".fidelity_fresh__bite_tam"

        # NEN: ket qua khi chua tiem gi. Rang 1 va 2 doi ket qua PHAI KHAC nen, rang 3 doi
        # ket qua PHAI TRO VE nen. Chup nen truoc thi ba rang do dung mot moc.
        nen_rc, _ = chay_lenh()
        print(f"{'NEN (chua tiem gi)':38s} : exit {nen_rc}")

        # ── RANG 1 · tiem loi that, doi bao DO ────────────────────────────────
        rows = [json.loads(l) for l in claims.read_text(encoding="utf-8").splitlines() if l.strip()]
        rows[0]["evidence_span"] = rows[0]["evidence_span"] + " CAU NAY KHONG CO TRONG BAN CHUP"
        giu = claims.read_bytes()
        claims.write_text("\n".join(json.dumps(r, ensure_ascii=False) for r in rows) + "\n",
                          encoding="utf-8")
        rc, out = chay_lenh()
        ok1 = rc != 0 and o_bang(out, "refinery") == "DO"
        print(f"{'RANG 1 · bao DO khi co loi that':38s} : " +
              ("CAN OK (exit 1, refinery DO)" if ok1 else f"KHONG CAN !! exit{rc} o={o_bang(out,'refinery')}"))
        claims.write_bytes(giu)

        # ── RANG 2 · mat dieu kien chay, doi KHONG CHAY DUOC ──────────────────
        fresh.rename(tam)
        rc, out = chay_lenh()
        o = o_bang(out, "doi_chung_nguon")
        ok2 = rc != 0 and o == "KHONG CHAY"
        print(f"{'RANG 2 · vang tin khong phai tin tot':38s} : " +
              ("CAN OK (KHONG CHAY DUOC, exit khac 0)" if ok2 else f"KHONG CAN !! exit{rc} o={o}"))
        tam.rename(fresh)

        # ── RANG 3 · khong bao do oan ─────────────────────────────────────────
        # Do TRO VE DUNG NEN, khong doi "tat ca xanh" (sua 24/08/2026). Truoc do rang nay
        # doi exit 0, tuc ngam gia dinh he luc nao cung sach. Gia dinh do vo ngay hom nay:
        # cong du_dieu_kien bat FECON va DUNG khi bao do, vi do la mot quyet dinh dang cho
        # nguoi. Rang doi mau xanh se bien mot cau hoi chinh dang thanh mot loi cua he thong,
        # va suc ep se doi ve phia go cau hoi di cho bang xanh lai. Cai rang nay muon do la
        # "tra ve nguyen trang thi ket qua tro lai nhu cu", nen phai so voi NEN da chup luc dau.
        rc, out = chay_lenh()
        ok3 = rc == nen_rc
        print(f"{'RANG 3 · khong bao DO oan':38s} : " +
              (f"CAN OK (tro ve dung nen, exit {rc})" if ok3
               else f"KHONG CAN !! exit{rc} khac nen exit{nen_rc}\n{out[-700:]}"))

        # ── RANG 4 · khong cham ban that ──────────────────────────────────────
        # Ba rang tren da tiem loi ba lan. Neu ban that con nguyen thi moi chung minh duoc
        # ban lam viec tam that su cach ly, chu khong phai chi doi ten thu muc cho vui.
        van_tay_sau = _van_tay(duong_that)
        doi = [p for p in van_tay_truoc if van_tay_truoc[p] != van_tay_sau.get(p)]
        ok4 = bool(duong_that) and not doi
        print(f"{'RANG 4 · khong cham ban that':38s} : " +
              (f"CAN OK ({len(duong_that)} file that con nguyen tung byte)" if ok4
               else f"KHONG CAN !! da doi: {', '.join(Path(p).name for p in doi) or 'khong tim thay file that de doi chieu'}"))

    tat_ca = ok1 and ok2 and ok3 and ok4
    print("-" * 62)
    print("BITE CHAY HET CONG:", "RANG CAN" if tat_ca else "CO RANG KHONG CAN")
    return 0 if tat_ca else 1


if __name__ == "__main__":
    sys.exit(main())
