#!/usr/bin/env python3
"""nap_lo_cau.py · Dua mot LO CAU THAT da duyet vao domain domains/cau_dat_hang.

VI SAO TACH KHOI nap_lo.py (01/10/2026): nap_lo.py nap DON VI CUNG vao don_vi_cncl va doi sau
truong bat buoc cua mot don vi. Nhu cau dat hang la thuc the khac han (ben dat hang, doi tuong,
han), song o domain rieng, nen dung chung mot script se phai re nhanh o moi buoc.

Mac dinh CHAY THU. Them --ghi moi ghi, va chi ghi khi:
  - lo co file LOAI_CAU (dung loai lo);
  - kiem_lo_cau.py tren lo tra exit 0 (lo.json duoc dung lai tu de xuat, sach);
  - co <dot>/duyet.json ghi loi duyet cua anh Lam ("loai": chi so dong bi gach,
    "loai_nhu_cau": ma nhu cau bi gach ca);
  - lo chua co da_nap.json (nap lai se nhan doi claim);
  - khong ma nhu cau nao da co trong domain (hai lo khong duoc dung chung ma).
Nhu cau con thieu ten_nhu_cau, ben_dat_hang hoac loai_dat_hang sau khi gach -> bo ca nhu cau.

Mot dong thanh mot claim dung khuon registry (entity, field, value, evidence_span, extraction,
tier, capture{url, fetched_at = ngay CHUP doc tu dau ban chup, snapshot, source}, note gom note
goc + "LAM GIAU <dot> · CAU THAT · duyet <ngay> boi <nguoi>. Ly do de xuat: ...").
Ban chup chep vao domains/cau_dat_hang/snapshots/ (tu choi neu trung ten ma khac noi dung).

Chay: python3 nap_lo_cau.py <dot> [--domain <thu muc domain>] [--ghi]
Exit 0 xong · 2 tu choi · 3 KHONG CHAY DUOC.
"""
import json
import re
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlparse

HERE = Path(__file__).resolve().parent
DOMAIN = HERE.parent / "domains" / "cau_dat_hang"
CHINH = {"ten_nhu_cau", "ben_dat_hang", "loai_dat_hang"}


def thoat(ma, m):
    print(("KHONG CHAY DUOC: " if ma == 3 else "TU CHOI: ") + m)
    sys.exit(ma)


def ngay_chup(dot, snap):
    dau = (dot / "snapshots" / snap).read_text(encoding="utf-8").split("\n", 1)[0]
    m = re.search(r"captured (\d{4}-\d{2}-\d{2})", dau)
    if not m:
        thoat(3, f"ban chup {snap} khong co dong 'captured YYYY-MM-DD'")
    return m.group(1) + "T00:00:00Z"


def main():
    a = sys.argv[1:]
    if not a:
        thoat(3, "thieu <thu_muc_dot>")
    dot = Path(a[0]).resolve()
    dom = Path(a[a.index("--domain") + 1]).resolve() if "--domain" in a else DOMAIN
    ghi = "--ghi" in a
    if not (dot / "LOAI_CAU").exists():
        thoat(2, f"{dot.name} khong phai lo cau (thieu file LOAI_CAU)")
    if (dot / "da_nap.json").exists():
        thoat(2, f"lo {dot.name} DA NAP (xem da_nap.json); nap lai se nhan doi claim")
    r = subprocess.run([sys.executable, str(HERE / "kiem_lo_cau.py"), str(dot)], capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stdout)
        thoat(2 if r.returncode == 2 else 3, "kiem_lo_cau.py khong xanh, khong nap")
    lo = json.loads((dot / "lo.json").read_text(encoding="utf-8"))
    pd = dot / "duyet.json"
    if not pd.exists():
        if ghi:
            thoat(2, "chua co duyet.json: chua ai duyet lo nay")
        duyet = {"nguoi_duyet": "(MO PHONG, CHUA DUYET)", "ngay": "0000-00-00", "loai": [], "loai_nhu_cau": []}
    else:
        duyet = json.loads(pd.read_text(encoding="utf-8"))
    loai = set(duyet.get("loai", []))
    loai_nc = set(duyet.get("loai_nhu_cau", []))
    giu = [(i, d) for i, d in enumerate(lo["dong"]) if i not in loai and d["entity"] not in loai_nc]
    bo_them = {e for e in {d["entity"] for _, d in giu} if not CHINH <= {d["field"] for _, d in giu if d["entity"] == e}}
    for e in sorted(bo_them):
        print(f"BO CA NHU CAU {e}: sau khi gach con thieu truong chinh")
    giu = [(i, d) for i, d in giu if d["entity"] not in bo_them]

    claims = dom / "claims.jsonl"
    cu = set()
    if claims.exists():
        cu = {json.loads(l)["entity"] for l in claims.read_text(encoding="utf-8").splitlines() if l.strip()}
    dung = sorted({d["entity"] for _, d in giu} & cu)
    if dung:
        thoat(2, f"ma nhu cau da co trong domain: {', '.join(dung[:5])}")

    tag = f"LAM GIAU {dot.name} · CAU THAT · duyet {duyet['ngay']} boi {duyet['nguoi_duyet']}"
    moi = []
    for _, d in giu:
        phan = [x for x in (d.get("note"),) if x]
        phan.append(tag + ". Ly do de xuat: " + d["ly_do"])
        moi.append({
            "entity": d["entity"], "field": d["field"], "value": d["value"],
            "evidence_span": d["evidence_span"], "extraction": d["extraction"], "tier": d["tier_de_xuat"],
            "capture": {"url": d["url"], "fetched_at": ngay_chup(dot, d["snapshot"]), "snapshot": d["snapshot"],
                        "source": urlparse(d["url"]).netloc.removeprefix("www.")},
            "ngay_bai": d["ngay_bai"],
            "note": " | ".join(phan),
        })
    print(f"NAP {'THAT' if ghi else 'THU'}: {len(moi)} claim · {len({m['entity'] for m in moi})} nhu cau · "
          f"gach {len(loai)} dong, {len(loai_nc)} nhu cau, bo them {len(bo_them)}")
    if not ghi:
        return 0
    (dom / "snapshots").mkdir(parents=True, exist_ok=True)
    snaps = sorted({m["capture"]["snapshot"] for m in moi})
    for s in snaps:
        tu, den = dot / "snapshots" / s, dom / "snapshots" / s
        if den.exists() and den.read_bytes() != tu.read_bytes():
            thoat(2, f"ban chup {s} da co trong domain voi noi dung khac")
    for s in snaps:
        (dom / "snapshots" / s).write_bytes((dot / "snapshots" / s).read_bytes())
    with claims.open("a", encoding="utf-8") as g:
        for m in moi:
            g.write(json.dumps(m, ensure_ascii=False) + "\n")
    (dot / "da_nap.json").write_text(json.dumps({
        "ngay_nap": duyet["ngay"], "nguoi_duyet": duyet["nguoi_duyet"], "so_claim": len(moi),
        "nhu_cau": sorted({m["entity"] for m in moi}), "ban_chup": snaps,
        "domain": str(dom.relative_to(HERE.parent)) if dom.is_relative_to(HERE.parent) else str(dom)},
        ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"DA GHI {len(moi)} claim vao {claims}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
