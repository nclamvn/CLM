#!/usr/bin/env python3
"""bite_dong_bo_snapshot.py · Hai rang cua buoc dong bo ban chup trong build_cncl_match.

VI SAO CO (16/08/2026): hai vong lien tiep vap cung mot bay. Sua ban chup ben CNCLData xong,
chay build o day thi no doc ban chup CU con nam trong domains/cncl_match/snapshots va bao
hang loat SPAN_LOST. Da tu dong hoa buoc chep. Nhung tu dong hoa ma khong co rang thi lan
sau ai do doi mot dong la no im lang hong, khong ai biet.

RANG 1 · CUU DUOC CA DA VAP: lam ban chup ben mien dan xuat cu di, build phai tu cap nhat
         va chay xong, khong duoc bao SPAN_LOST.
RANG 2 · KHONG SUY BIEN: giau ban chup GOC di, build phai FAIL. Cam lang le xai ban cu con
         nam trong mien dan xuat. Thieu dieu kien ma he van chay tiep chinh la duong ro.

Rang 2 quan trong hon rang 1. Rang 1 chi tiet kiem thoi gian; rang 2 giu tinh trung thuc.

Chay:  python3 bite_dong_bo_snapshot.py
Exit 0 neu ca hai rang can. Exit 1 neu co rang khong can.
CANH
====
MUON DU LIEU THAT qua ban_tam. Rang tiem loi vao ban sao, kho that khong bi cham. Ban chup va
chuoi moc duoc CHON TU claims.jsonl moi lan chay (claim dau tien co span du dai), khong go cung
ten file: tu 29/09/2026, sau khi ten go cung lam ca hai rang gay luc ban chup do duoc chup lai.
Kho khong con claim nao dung duoc thi bao KHONG CHAY DUOC.
"""
import shutil, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT))
from ban_tam import ban_tam

# Ban chup va chuoi moc CHON TU DU LIEU, khong go cung. Truoc 29/09/2026 hai hang nay go cung
# ten "vjst_viettel_llm_20260718.html". Ngay ban chup do duoc chup lai de sua ngay dang, rang
# van tim thay file cu (con nam trong kho, khong claim nao dung) nen xoa no build van xanh, va
# ca hai rang bao KHONG CAN. Rang gay vi CANH, dung loai loi check_rang_khai_canh.py canh bao.
FILE = None
CU = None
BT = None


def chon_canh(bt):
    """Claim dau tien (theo thu tu file) co span >= 30 ky tu, ban chup co o ca hai mien."""
    import json
    goc_dir = bt.cncl / "domains" / "don_vi_cncl" / "snapshots"
    dx_dir = bt.match / "domains" / "cncl_match" / "snapshots"
    for l in (bt.cncl / "domains" / "don_vi_cncl" / "claims.jsonl").read_text(encoding="utf-8").splitlines():
        if not l.strip():
            continue
        c = json.loads(l)
        f, sp = c["capture"]["snapshot"], c.get("evidence_span", "")
        if len(sp) >= 30 and (goc_dir / f).exists() and (dx_dir / f).exists() \
                and sp in (dx_dir / f).read_text(encoding="utf-8"):
            return f, sp
    return None, None  # dat trong main(); moi thao tac deu tren BAN SAO, kho that khong bi cham


def build():
    r = subprocess.run([sys.executable, str(BT.match / "build_cncl_match.py")],
                       cwd=str(BT.match), capture_output=True, text=True, env=BT.moi_truong)
    return r.returncode, r.stdout + r.stderr


def main():
    global BT
    with ban_tam(can_touch=False) as bt:
        BT = bt
        global FILE, CU
        FILE, CU = chon_canh(bt)
        if FILE is None:
            print("KHONG CHAY DUOC: khong tim duoc claim nao co ban chup o ca hai mien de lam canh")
            return 3
        print(f"canh: {FILE}")
        return _chay(bt.cncl / "domains" / "don_vi_cncl" / "snapshots" / FILE,
                     bt.match / "domains" / "cncl_match" / "snapshots" / FILE)


def _chay(goc, dan_xuat):
    if not goc.exists() or not dan_xuat.exists():
        print(f"KHONG CHAY DUOC: ban tam thieu {FILE} o mien goc hoac mien dan xuat")
        return 3

    giu_goc = goc.read_bytes()
    giu_dx = dan_xuat.read_bytes()
    ok1 = ok2 = False
    try:
        # RANG 1: ban chup dan xuat cu di thi build phai tu cap nhat.
        if CU not in dan_xuat.read_text(encoding="utf-8"):
            print("RANG 1: N/A (khong tim thay chuoi moc de lam cu)")
        else:
            dan_xuat.write_text(
                dan_xuat.read_text(encoding="utf-8").replace(CU, "Mo hinh LLM (ban CU)"),
                encoding="utf-8")
            rc, out = build()
            ok1 = rc == 0 and "[CAP NHAT]" in out and "SPAN_LOST" not in out
            print(f"{'RANG 1 · cuu duoc ban cu':34s} : " +
                  ("CAN OK (tu cap nhat, khong SPAN_LOST)" if ok1 else f"KHONG CAN !! exit{rc}\n{out[:600]}"))

        # RANG 2: giau ban chup GOC thi build phai FAIL, khong duoc xai ban cu.
        goc.unlink()
        rc, out = build()
        ok2 = rc == 2 and "[THIEU]" in out
        print(f"{'RANG 2 · khong suy bien':34s} : " +
              ("CAN OK (exit 2, tu choi chay tiep)" if ok2 else f"KHONG CAN !! exit{rc}\n{out[:600]}"))
    finally:
        goc.write_bytes(giu_goc)
        dan_xuat.write_bytes(giu_dx)
        rc, out = build()
        if rc != 0:
            print(f"!! PHUC HOI HONG: build sau khi tra lai van exit{rc}\n{out[:600]}")
            return 1

    print("-" * 62)
    print("BITE DONG BO SNAPSHOT:", "RANG CAN" if (ok1 and ok2) else "CO RANG KHONG CAN")
    return 0 if (ok1 and ok2) else 1


if __name__ == "__main__":
    sys.exit(main())
