#!/usr/bin/env python3
"""bite_kiem_lo.py · Rang cua kiem_lo.py.

CANH
====
TU DUNG LAY CANH: chep mot thu muc dot (mac dinh dot_01) va registry that (lo da nap thi bo
chinh cac claim cua lo do, ve dung trang thai truoc khi nap) vao thu muc tam
(tempfile.mkdtemp), tiem loi vao BAN SAO. Dot that va registry that khong bi cham.

RANG
====
RANG 1  · CANH SACH -> exit 0.
RANG 2  · doi mot chu trong evidence_span (khong con trong ban chup) -> SPAN_KHONG_CHUP.
RANG 3  · value verbatim khong nam trong span -> VALUE_KHONG_SPAN.
RANG 4  · bao (khong phai .gov.vn) ghi hang A -> HANG_CAO_HON_LUAT.
RANG 5  · bo bang_chung_nang_luc cua mot don vi moi -> DON_VI_THIEU.
RANG 6  · de xuat ten_don_vi cho don vi da co trong registry -> DON_VI_CU_SAI_TRUONG.
RANG 7  · nhom_cncl khac nhom cua nhu cau -> NHOM_LECH.
RANG 8  · em-dash trong ly_do -> EM_DASH.
RANG 9  · normalized khong khai "CHUAN HOA CO CHU DICH:" -> CHUAN_HOA_KHONG_KHAI.
RANG 10 · xoa file ban chup -> CHUP_THIEU.
RANG 11 · span da co nguyen van trong registry cho cung don vi/truong -> TRUNG_REGISTRY.
RANG 12 · thieu bang san pham -> nhom -> exit 3, khong duoc doan.
RANG 13 · de xuat o don tri ma registry da co gia tri khac -> O_DA_CO_GIA_TRI.
RANG 14 · hai gia tri khac nhau cho cung mot o trong lo -> O_TRUNG_TRONG_LO.

Chay: python3 bite_kiem_lo.py [thu_muc_dot]     Exit 0 moi rang can · 2 co rang khong can · 3 khong chay duoc.
"""
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
CONG = HERE / "kiem_lo.py"
REG = HERE.parent / "domains" / "don_vi_cncl" / "claims.jsonl"
DOT = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else HERE / "dot_01"
kq = []


def in_(nhan, ok, chi):
    print(f"{nhan:62} : " + (f"CAN OK ({chi})" if ok else f"KHONG CAN !! {chi}"))
    kq.append(ok)


def canh(tam):
    d = Path(tempfile.mkdtemp(dir=tam))
    shutil.copytree(DOT, d / "dot", ignore=shutil.ignore_patterns("lo.json"))
    (d / "claims.jsonl").write_text(reg_goc(), encoding="utf-8")
    return d


def reg_goc():
    """Registry TRUOC khi lo duoc nap. Lo da nap (co da_nap.json) thi bo cac claim mang dau
    'LAM GIAU <dot> ·' cua chinh no, neu khong canh sach se tu va voi chinh no."""
    ls = REG.read_text(encoding="utf-8").splitlines(keepends=True)
    if (DOT / "da_nap.json").exists():
        dau = f"LAM GIAU {DOT.name} \u00b7"
        ls = [l for l in ls if not l.strip() or dau not in (json.loads(l).get("note") or "")]
    return "".join(ls)


def chay(d, cong=CONG):
    r = subprocess.run([sys.executable, str(cong), str(d / "dot"), str(d / "claims.jsonl")],
                       capture_output=True, text=True)
    return r.returncode, r.stdout + r.stderr


def dong(d):
    fs = sorted((d / "dot").glob("de_xuat_*.jsonl"))
    out = []
    for f in fs:
        for i, l in enumerate(f.read_text(encoding="utf-8").splitlines()):
            if l.strip():
                out.append((f, i, json.loads(l)))
    return out


def sua(d, chon, doi):
    """Sua dong DAU TIEN thoa chon(r); tra False neu khong tiem duoc."""
    for f, i, r in dong(d):
        if chon(r):
            ls = f.read_text(encoding="utf-8").splitlines()
            ls[i] = json.dumps(doi(dict(r)), ensure_ascii=False)
            f.write_text("\n".join(ls) + "\n", encoding="utf-8")
            return True
    return False


def rang(tam, nhan, chon, doi, ma, ky):
    d = canh(tam)
    if not sua(d, chon, doi):
        in_(nhan, False, "KHONG TIEM DUOC")
        return
    rc, out = chay(d)
    in_(nhan, rc == ma and ky in out, f"exit {rc}")


def main():
    if not (DOT / "snapshots").is_dir() or not list(DOT.glob("de_xuat_*.jsonl")):
        print(f"KHONG CHAY DUOC: {DOT} khong co de_xuat_*.jsonl va snapshots/ de dung canh")
        return 3
    tam = tempfile.mkdtemp(prefix="bite_kiem_lo_")
    try:
        reg = [json.loads(l) for l in reg_goc().splitlines() if l.strip()]
        cu = {c["entity"] for c in reg}
        d = canh(tam)
        rc, out = chay(d)
        in_("RANG 1  · canh sach -> exit 0", rc == 0 and "OK:" in out, f"exit {rc}")

        vb = lambda r: r["extraction"] == "verbatim" and len(r["value"]) < len(r["evidence_span"])
        rang(tam, "RANG 2  · doi mot chu trong span -> SPAN_KHONG_CHUP", vb,
             lambda r: r | {"evidence_span": r["evidence_span"][:-3] + "XQZ"}, 2, "SPAN_KHONG_CHUP")
        rang(tam, "RANG 3  · value khong nam trong span -> VALUE_KHONG_SPAN", vb,
             lambda r: r | {"value": r["value"] + " va che tao ca ten lua"}, 2, "VALUE_KHONG_SPAN")
        rang(tam, "RANG 4  · bao ghi hang A -> HANG_CAO_HON_LUAT",
             lambda r: r["tier_de_xuat"] == "B",
             lambda r: r | {"tier_de_xuat": "A"}, 2, "HANG_CAO_HON_LUAT")

        d = canh(tam)
        moi = next((r["entity"] for _, _, r in dong(d) if r["entity"] not in cu), None)
        if moi is None:
            in_("RANG 5  · bo bang_chung don vi moi -> DON_VI_THIEU", False, "KHONG TIEM DUOC: khong co don vi moi")
        else:
            for f in sorted((d / "dot").glob("de_xuat_*.jsonl")):
                ls = [l for l in f.read_text(encoding="utf-8").splitlines() if l.strip()]
                giu = [l for l in ls if not (json.loads(l)["entity"] == moi and json.loads(l)["field"] == "bang_chung_nang_luc")]
                f.write_text("\n".join(giu) + ("\n" if giu else ""), encoding="utf-8")
            rc, out = chay(d)
            in_("RANG 5  · bo bang_chung don vi moi -> DON_VI_THIEU", rc == 2 and "DON_VI_THIEU" in out, f"exit {rc}")

        rang(tam, "RANG 6  · ten_don_vi cho don vi da co -> DON_VI_CU_SAI_TRUONG",
             lambda r: r["entity"] not in cu and r["field"] == "nang_luc_mo_ta",
             lambda r: r | {"entity": sorted(cu)[0]}, 2, "DON_VI_CU_SAI_TRUONG")
        rang(tam, "RANG 7  · nhom_cncl khac nhom nhu cau -> NHOM_LECH",
             lambda r: r["field"] == "nhom_cncl",
             lambda r: r | {"value": "6" if r["value"] != "6" else "1"}, 2, "NHOM_LECH")
        rang(tam, "RANG 8  · em-dash trong ly_do -> EM_DASH", lambda r: True,
             lambda r: r | {"ly_do": r["ly_do"] + " " + chr(0x2014) + " them"}, 2, "EM_DASH")
        rang(tam, "RANG 9  · normalized khong khai -> CHUAN_HOA_KHONG_KHAI",
             lambda r: r["extraction"] == "normalized",
             lambda r: r | {"note": "anh xa nhom"}, 2, "CHUAN_HOA_KHONG_KHAI")

        d = canh(tam)
        _, _, r0 = dong(d)[0]
        (d / "dot" / "snapshots" / r0["snapshot"]).unlink()
        rc, out = chay(d)
        in_("RANG 10 · xoa ban chup -> CHUP_THIEU", rc == 2 and "CHUP_THIEU" in out, f"exit {rc}")

        d = canh(tam)
        _, _, r0 = next((x for x in dong(d) if x[2]["entity"] in cu), dong(d)[0])
        with open(d / "claims.jsonl", "a", encoding="utf-8") as g:
            g.write(json.dumps({"entity": r0["entity"], "field": r0["field"], "value": r0["value"],
                                "evidence_span": r0["evidence_span"], "extraction": "verbatim", "tier": "B",
                                "capture": {"url": r0["url"]}}, ensure_ascii=False) + "\n")
        rc, out = chay(d)
        in_("RANG 11 · span da co trong registry -> TRUNG_REGISTRY", rc == 2 and "TRUNG_REGISTRY" in out, f"exit {rc}")

        # Rang 13: o don tri cua don vi cu da co gia tri. Day la ca that 30/09/2026: nap them
        # nang_luc_mo_ta_2 cho Tap doan Viettel lam roi hai match anh Lam da ky.
        o_cu = {}
        for c in reg:
            o_cu.setdefault((c["entity"], c["field"]), c)
        dich = next((c for (e, f), c in sorted(o_cu.items()) if f == "nang_luc_mo_ta_2"), None)
        if dich is None:
            in_("RANG 13 · de o don tri da co gia tri -> O_DA_CO_GIA_TRI", False, "KHONG TIEM DUOC: registry khong co nang_luc_mo_ta_2")
        else:
            rang(tam, "RANG 13 · de o don tri da co gia tri -> O_DA_CO_GIA_TRI",
                 lambda r: r["extraction"] == "verbatim" and r["field"] == "nang_luc_mo_ta",
                 lambda r: r | {"entity": dich["entity"], "field": "nang_luc_mo_ta_2"}, 2, "O_DA_CO_GIA_TRI")

        # Rang 14: hai gia tri khac nhau cho cung mot o trong lo.
        d = canh(tam)
        _, _, r0 = next(x for x in dong(d) if x[2]["field"] == "nang_luc_mo_ta" and x[2]["extraction"] == "verbatim")
        f0 = sorted((d / "dot").glob("de_xuat_*.jsonl"))[0]
        chu = r0["value"].split(" ")
        khac = r0 | {"value": " ".join(chu[:-1]) if len(chu) > 1 else r0["value"][:-1]}
        with f0.open("a", encoding="utf-8") as g:
            g.write(json.dumps(khac, ensure_ascii=False) + "\n")
        rc, out = chay(d)
        in_("RANG 14 · hai gia tri cho mot o trong lo -> O_TRUNG_TRONG_LO", rc == 2 and "O_TRUNG_TRONG_LO" in out, f"exit {rc}")

        # Rang 12: chep cong sang mot cay khong co bang mapping.
        d = canh(tam)
        cay = d / "goc" / "CNCLData" / "lam_giau"
        cay.mkdir(parents=True)
        shutil.copy(CONG, cay / "kiem_lo.py")
        rc, out = chay(d, cay / "kiem_lo.py")
        in_("RANG 12 · thieu bang san pham -> nhom -> exit 3", rc == 3 and "KHONG CHAY DUOC" in out, f"exit {rc}")
    finally:
        shutil.rmtree(tam, ignore_errors=True)
    can = sum(kq)
    print(f"\nBITE KIEM LO: {can}/{len(kq)} rang can")
    return 0 if can == len(kq) else 2


if __name__ == "__main__":
    sys.exit(main())
