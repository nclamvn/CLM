#!/usr/bin/env python3
"""mo_phong_lo.py · Nap THU mot lo vao BAN SAO cua kho, chay cong that, do tac dong len may ghep.

VI SAO CO (30/09/2026): lan mo phong dau tien nap 115 claim cua dot 01 vao ban sao va chay ca
chuoi: 21 o do. Trong do co nhung loi kiem_lo.py khong the thay vi chung la luat CUA REGISTRY
(tuoi nguon, tham chieu treo, dau hieu van hanh, khang dinh toi thuong), va mot loi nang nhat:
hai match anh Lam da ky roi khoi bang vi o don tri bi nap them gia tri. Nguoi duyet can biet
TRUOC khi duyet dong nao se lam do cong nao, va lo lam doi bang match the nao.

Lam gi (khong cham kho that):
  1. Chep CNCLData, CaoLocMatch (tru reports/), Dataset_CongNgheChienLuoc vao thu muc tam.
  2. TUNG DONG: registry goc + mot dong (kem ghi_chu neu co trong file duyet), chay cac cong
     cua registry. Cong nao do la cua dong do, khong phai doan tu output.
  3. CA LO: registry goc + moi dong duoc giu, chay lai cac cong, roi build_dan_xuat ->
     match run -> restore-signoff, so voi truoc khi nap.
Ghi <thu_muc_dot>/mo_phong.json. Exit 0 da do xong (ke ca khi co cong do: do la so lieu cho
nguoi duyet) · 3 KHONG CHAY DUOC.

Chay: python3 mo_phong_lo.py <thu_muc_dot> [--duyet <file>]
"""
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
GOC = HERE.parents[1]
sys.path.insert(0, str(HERE))
from nap_lo import MO_PHONG, chon_dong, claim_cua_dong  # noqa: E402

CONG = ["check_do_tuoi.py", "check_tham_chieu_treo.py", "check_du_dieu_kien.py",
        "check_khang_dinh_toi_thuong.py", "check_ngay_dang.py", "check_tai_tro.py",
        "check_chuan_hoa.py", "check_luat3.py", "check_dash.py"]


def thoat3(m):
    print(f"KHONG CHAY DUOC: {m}")
    sys.exit(3)


def chay(cmd, cwd, env=None):
    r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, env=env)
    return r.returncode, r.stdout + r.stderr


def cong_do(cn, dom):
    do = {}
    for c in CONG:
        rc, out = chay([sys.executable, c, "domains/don_vi_cncl"], cn)
        if rc != 0:
            do[c.removesuffix(".py")] = {"exit": rc, "cuoi": out.strip().splitlines()[-3:]}
    rc, out = chay([sys.executable, "methodbox/refinery.py", "domains/don_vi_cncl"], cn)
    if rc != 0 or "VALIDATION PASSED" not in out:
        do["refinery"] = {"exit": rc, "cuoi": out.strip().splitlines()[-3:]}
    return do


def ghep(tam):
    clm = tam / "CaoLocMatch"
    py = [sys.executable]
    for cmd in (py + ["build_cncl_match.py"], py + ["match_engine.py", "run", "domains/cncl_match"],
                py + ["match_engine.py", "restore-signoff", "domains/cncl_match", "out/matches.jsonl"]):
        rc, out = chay(cmd, clm)
        if rc not in (0, 2):
            return {"loi": " ".join(cmd[1:]) + f" exit {rc}: " + " / ".join(out.strip().splitlines()[-3:])}
    rs = out.strip().splitlines()
    M = [json.loads(l) for l in (clm / "out" / "matches.jsonl").read_text(encoding="utf-8").splitlines() if l.strip()]
    ung = [{"id": m["id"], "cung": m["supply"]["entity_id"], "cau": m["demand"]["entity_id"].split(" ")[0],
            "diem": m["rationale"]["chuoi_bang_chung"][0]["score"],
            "tu_giao": m["rationale"]["chuoi_bang_chung"][0]["token_giao"],
            "ky": m["gate"]["signoff"]["by"]} for m in M]
    return {"restore": next((x for x in rs if x.startswith("RESTORE")), None), "ung_vien": ung}


def main():
    a = sys.argv[1:]
    if not a:
        thoat3("thieu <thu_muc_dot>")
    dot = Path(a[0]).resolve()
    pd = Path(a[a.index("--duyet") + 1]).resolve() if "--duyet" in a else dot / "duyet.json"
    rc, out = chay([sys.executable, str(HERE / "kiem_lo.py"), str(dot)], HERE)
    if rc != 0:
        print(out)
        thoat3("kiem_lo.py khong xanh; mo phong chi chay tren lo da qua cong kiem lo")
    lo = json.loads((dot / "lo.json").read_text(encoding="utf-8"))
    duyet = json.loads(pd.read_text(encoding="utf-8")) if pd.exists() else MO_PHONG

    tam = Path(tempfile.mkdtemp(prefix="mo_phong_lo_"))
    try:
        for k in ("CNCLData", "Dataset_CongNgheChienLuoc"):
            shutil.copytree(GOC / k, tam / k, ignore=shutil.ignore_patterns("lam_giau", "__pycache__"))
        shutil.copytree(GOC / "CaoLocMatch", tam / "CaoLocMatch", ignore=shutil.ignore_patterns("reports", "__pycache__"))
        cn = tam / "CNCLData"
        dom = cn / "domains" / "don_vi_cncl"
        goc_reg = (dom / "claims.jsonl").read_text(encoding="utf-8")
        for s in {d["snapshot"] for d in lo["dong"]}:
            shutil.copy(dot / "snapshots" / s, dom / "snapshots" / s)

        truoc = ghep(tam)
        do_goc = cong_do(cn, dom)
        if do_goc:
            thoat3(f"registry goc da do cong truoc khi nap: {sorted(do_goc)}")

        giu, bo_them = chon_dong(lo, dom / "claims.jsonl", duyet)
        tung = {}
        for i, d in giu:
            (dom / "claims.jsonl").write_text(goc_reg + json.dumps(claim_cua_dong(lo, i, d, duyet, dot), ensure_ascii=False) + "\n", encoding="utf-8")
            do = cong_do(cn, dom)
            if do:
                tung[str(i)] = sorted(do)
        (dom / "claims.jsonl").write_text(goc_reg + "".join(
            json.dumps(claim_cua_dong(lo, i, d, duyet, dot), ensure_ascii=False) + "\n" for i, d in giu), encoding="utf-8")
        ca_lo = cong_do(cn, dom)
        sau = ghep(tam)
    finally:
        shutil.rmtree(tam, ignore_errors=True)

    def phu(g):
        return sorted({u["cau"] for u in g.get("ung_vien", [])})
    nc_truoc, nc_sau = phu(truoc), phu(sau)
    ky_truoc = {(u["cung"], u["cau"]) for u in truoc.get("ung_vien", []) if u["ky"] != "pending-human-review"}
    ky_sau = {(u["cung"], u["cau"]) for u in sau.get("ung_vien", []) if u["ky"] != "pending-human-review"}
    kq = {"dot": lo.get("dot", dot.name), "duyet": duyet.get("nguoi_duyet"), "so_dong_nap": len(giu),
          "bo_them_don_vi": sorted(bo_them), "cong_do_tung_dong": tung,
          "cong_do_ca_lo": {k: v for k, v in ca_lo.items()},
          "ghep_truoc": truoc, "ghep_sau": sau,
          "nhu_cau_co_ung_vien_truoc": nc_truoc, "nhu_cau_co_ung_vien_sau": nc_sau,
          "nhu_cau_moi_co_ung_vien": sorted(set(nc_sau) - set(nc_truoc)),
          "chu_ky_mat": sorted(f"{a} x {b}" for a, b in ky_truoc - ky_sau)}
    (dot / "mo_phong.json").write_text(json.dumps(kq, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"MO PHONG {lo.get('dot', dot.name)}: nap {len(giu)} dong · dong lam do cong: {len(tung)} · cong do ca lo: {sorted(ca_lo)}")
    print(f"  ung vien {len(truoc.get('ung_vien', []))} -> {len(sau.get('ung_vien', []))} · "
          f"nhu cau co ung vien {len(nc_truoc)} -> {len(nc_sau)} (moi: {', '.join(kq['nhu_cau_moi_co_ung_vien']) or 'khong'})")
    print(f"  {truoc.get('restore')} -> {sau.get('restore')}")
    print(f"  chu ky mat: {kq['chu_ky_mat'] or 'khong'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
