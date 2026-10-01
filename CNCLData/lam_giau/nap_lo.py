#!/usr/bin/env python3
"""nap_lo.py · Dua cac dong DA DUYET cua mot lo lam giau vao registry.

Chi chay SAU KHI anh Lam duyet bang lo. Mac dinh la CHAY THU (in ra, khong ghi). Them --ghi moi
ghi, va chi ghi khi:
  - kiem_lo.py tren lo tra exit 0;
  - co file <thu_muc_dot>/duyet.json ghi quyet dinh cua anh Lam:
      {"nguoi_duyet": "...", "ngay": "yyyy-mm-dd",
       "loai": [<chi so dong trong lo.json bi gach>], "loai_don_vi": [<ten don vi bi gach ca>],
       "ly_do_loai": {"<chi so hoac ten>": "loi cua nguoi duyet"},
       "ghi_chu": {"<chi so>": "GIU NGUON CU: ... | DU DIEU KIEN DA XET: ... | ..."}}
    Khong co file duyet -> tu choi ghi.
  ghi_chu la cac dong ghi chu ma cong cua registry doi NGUOI viet (giu nguon cu, du dieu kien da
  xet, khang dinh toi thuong, tham chieu da neo). May de xuat san trong bang lo; anh Lam duyet
  thi chung moi vao duyet.json. Script KHONG tu sinh cac dong do.

Mot dong duoc nap thanh claim dung khuon registry:
  entity, field, value, evidence_span, extraction, tier (= tier_de_xuat), capture{url, fetched_at,
  snapshot, source}, note (note goc | ghi_chu duyet | "LAM GIAU <dot> · <nhu_cau> · duyet <ngay>
  boi <nguoi>. Ly do de xuat: <ly_do>").
Ban chup duoc chep vao domains/don_vi_cncl/snapshots/ (tu choi neu trung ten ma khac noi dung).
Don vi moi con thieu mot trong sau truong sau khi gach -> bo CA don vi, in ra, khong nap nua voi.
Nap xong ghi <thu_muc_dot>/da_nap.json; lo co file nay thi tu choi nap lai, va kiem_lo --tat-ca bo qua.

Chay: python3 nap_lo.py <thu_muc_dot> [--registry <claims.jsonl>] [--duyet <file>] [--ghi]
Exit 0 xong · 2 tu choi · 3 KHONG CHAY DUOC.
"""
import json
import subprocess
import sys
from pathlib import Path
from urllib.parse import urlparse

HERE = Path(__file__).resolve().parent
REGISTRY = HERE.parent / "domains" / "don_vi_cncl" / "claims.jsonl"
SAU_TRUONG = {"ten_don_vi", "loai_hinh", "nhom_cncl", "san_pham_lien_quan", "nang_luc_mo_ta",
              "bang_chung_nang_luc"}
MO_PHONG = {"nguoi_duyet": "(MO PHONG, CHUA DUYET)", "ngay": "0000-00-00", "loai": [], "loai_don_vi": []}


def thoat(ma, m):
    print(("KHONG CHAY DUOC: " if ma == 3 else "TU CHOI: ") + m)
    sys.exit(ma)


def ngay_chup(dot, snap):
    """Ngay CHUP doc tu dong dau ban chup ("captured YYYY-MM-DD"), khong phai ngay duyet."""
    import re
    m = re.search(r"captured (\d{4}-\d{2}-\d{2})", (dot / "snapshots" / snap).read_text(encoding="utf-8").split("\n", 1)[0])
    if not m:
        thoat(3, f"ban chup {snap} khong co dong 'captured YYYY-MM-DD'")
    return m.group(1) + "T00:00:00Z"


def claim_cua_dong(lo, i, d, duyet, dot):
    # Lo dinh danh (01/10/2026) khong gan voi nhu cau nao: nhan la DINH DANH TU KHAI.
    nhan = d.get("nhu_cau") or "DINH DANH TU KHAI (khong tinh la da dinh danh)"
    tag = f"LAM GIAU {lo.get('dot', dot.name)} · {nhan} · duyet {duyet['ngay']} boi {duyet['nguoi_duyet']}"
    phan = [x for x in (d.get("note"), (duyet.get("ghi_chu") or {}).get(str(i))) if x]
    phan.append(tag + ". Ly do de xuat: " + d["ly_do"])
    return {
        "entity": d["entity"], "field": d["field"], "value": d["value"],
        "evidence_span": d["evidence_span"], "extraction": d["extraction"], "tier": d["tier_de_xuat"],
        "capture": {"url": d["url"], "fetched_at": ngay_chup(dot, d["snapshot"]), "snapshot": d["snapshot"],
                    "source": urlparse(d["url"]).netloc.removeprefix("www.")},
        "note": " | ".join(phan),
    }


def chon_dong(lo, reg_path, duyet):
    """Tra ve [(chi_so, dong)] se nap va tap don vi bi bo them vi thieu truong sau khi gach."""
    loai = set(duyet.get("loai", []))
    loai_dv = set(duyet.get("loai_don_vi", []))
    cu = {json.loads(l)["entity"] for l in reg_path.read_text(encoding="utf-8").splitlines() if l.strip()}
    giu = [(i, d) for i, d in enumerate(lo["dong"]) if i not in loai and d["entity"] not in loai_dv]
    bo_them = set()
    for e in {d["entity"] for _, d in giu if d["entity"] not in cu}:
        con = {d["field"] for _, d in giu if d["entity"] == e}
        if not SAU_TRUONG <= con:
            bo_them.add(e)
    return [(i, d) for i, d in giu if d["entity"] not in bo_them], bo_them


def main():
    a = sys.argv[1:]
    if not a:
        thoat(3, "thieu <thu_muc_dot>")
    dot = Path(a[0]).resolve()
    reg = Path(a[a.index("--registry") + 1]).resolve() if "--registry" in a else REGISTRY
    pd = Path(a[a.index("--duyet") + 1]).resolve() if "--duyet" in a else dot / "duyet.json"
    ghi = "--ghi" in a
    if (dot / "da_nap.json").exists():
        thoat(2, f"lo {dot.name} DA NAP (xem da_nap.json); nap lai se nhan doi claim")
    r = subprocess.run([sys.executable, str(HERE / "kiem_lo.py"), str(dot), str(reg)], capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stdout)
        thoat(2 if r.returncode == 2 else 3, "kiem_lo.py khong xanh, khong nap")
    lo = json.loads((dot / "lo.json").read_text(encoding="utf-8"))
    if pd.exists():
        duyet = json.loads(pd.read_text(encoding="utf-8"))
    elif ghi:
        thoat(2, f"chua co {pd.name}: chua ai duyet lo nay")
    else:
        duyet = MO_PHONG
    giu, bo_them = chon_dong(lo, reg, duyet)
    for e in sorted(bo_them):
        print(f"BO CA DON VI {e}: sau khi gach con thieu truong bat buoc")
    moi = [claim_cua_dong(lo, i, d, duyet, dot) for i, d in giu]
    print(f"NAP {'THAT' if ghi else 'THU'}: {len(moi)} claim · {len({m['entity'] for m in moi})} don vi · "
          f"gach {len(duyet.get('loai', []))} dong, {len(duyet.get('loai_don_vi', []))} don vi, bo them {len(bo_them)} don vi")
    if not ghi:
        return 0
    snap_dich = reg.parent / "snapshots"
    for s in sorted({m["capture"]["snapshot"] for m in moi}):
        tu, den = dot / "snapshots" / s, snap_dich / s
        if den.exists() and den.read_bytes() != tu.read_bytes():
            thoat(2, f"ban chup {s} da co trong registry voi noi dung khac")
    for s in sorted({m["capture"]["snapshot"] for m in moi}):
        (snap_dich / s).write_bytes((dot / "snapshots" / s).read_bytes())
    with reg.open("a", encoding="utf-8") as g:
        for m in moi:
            g.write(json.dumps(m, ensure_ascii=False) + "\n")
    (dot / "da_nap.json").write_text(json.dumps({
        "ngay_nap": duyet["ngay"], "nguoi_duyet": duyet["nguoi_duyet"], "so_claim": len(moi),
        "don_vi": sorted({m["entity"] for m in moi}), "registry": str(reg.relative_to(HERE.parent))
        if reg.is_relative_to(HERE.parent) else str(reg)}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"DA GHI {len(moi)} claim vao {reg}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
