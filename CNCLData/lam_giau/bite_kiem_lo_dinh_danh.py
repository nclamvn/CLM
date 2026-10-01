#!/usr/bin/env python3
"""bite_kiem_lo_dinh_danh.py · Rang cua kiem_lo_dinh_danh.py.

CANH
====
TU DUNG LAY CANH: chep lo dinh danh dang cho duyet (dot_* co tep LOAI_DINH_DANH) vao thu muc tam
(tempfile.mkdtemp), tiem loi vao BAN SAO roi chay cong. Khong sua file that. Khong co lo nao thi
KHONG CHAY DUOC (rang khong co canh de can khong phai rang can).

RANG
====
RANG 1  · canh sach -> exit 0.
RANG 2  · mot dong ghi thang truong ma_so_thue -> CAM_MA_SO_THUE.
RANG 3  · url doi sang masothue.com -> NGUON_TONG_HOP.
RANG 4  · url doi sang mien khac website_chinh_chu -> NGOAI_CHINH_CHU.
RANG 5  · ma tu khai cat con 9 so -> MA_SAI_DANG.
RANG 6  · doi mot chu so trong span -> SPAN_KHONG_CHUP.
RANG 7  · cung mot ma gan them cho don vi khac (lay ma me gan cho con) -> MA_HAI_DON_VI.
RANG 8  · xoa ket qua (de xuat va honest-null) cua mot don vi -> DON_VI_BO_SOT.
RANG 9  · tier B cho ma tu khai -> HANG_SAI.
RANG 10 · bo dong ten_phap_nhan cua don vi co ma -> MA_THIEU_TEN.
RANG 11 · em-dash trong ly_do -> EM_DASH.

Chay: python3 bite_kiem_lo_dinh_danh.py     Exit 0 moi rang can · 2 co rang khong can · 3 KHONG CHAY DUOC.
"""
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
CONG = HERE / "kiem_lo_dinh_danh.py"
lo = sorted(p for p in HERE.glob("dot_*") if (p / "LOAI_DINH_DANH").exists())
if not lo:
    print("KHONG CHAY DUOC: khong co lo dinh danh nao (dot_* co tep LOAI_DINH_DANH).")
    sys.exit(3)
GOC = lo[-1]
kq, tam = [], []


def doc(p):
    return [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]


def ghi(p, ds):
    p.write_text("".join(json.dumps(d, ensure_ascii=False) + "\n" for d in ds), encoding="utf-8")


def rang(nhan, sua, ma, ky=None):
    t = Path(tempfile.mkdtemp(prefix="bite_dinh_danh_"))
    tam.append(t)
    d = t / GOC.name
    shutil.copytree(GOC, d, ignore=shutil.ignore_patterns("lo.json", "__pycache__"))
    if sua:
        sua(d)
    r = subprocess.run([sys.executable, str(CONG), str(d)], capture_output=True, text=True)
    out = r.stdout + r.stderr
    ok = r.returncode == ma and (ky is None or ky in out)
    print(f"{nhan:<60} : {'CAN OK' if ok else 'KHONG CAN !!'} (exit {r.returncode})")
    kq.append(ok)


def dong_ma(d):
    """Tep va chi so dong ma_so_tu_khai dau tien."""
    for f in sorted(d.glob("de_xuat_*.jsonl")):
        ds = doc(f)
        for i, x in enumerate(ds):
            if x.get("field") == "ma_so_tu_khai":
                return f, ds, i
    raise SystemExit("KHONG CHAY DUOC: lo khong co dong ma_so_tu_khai nao")


def sua_ma(fn):
    def s(d):
        f, ds, i = dong_ma(d)
        fn(ds, i, d)
        ghi(f, ds)
    return s


def r6(ds, i, d):
    x = ds[i]
    v = x["value"]
    moi = v[:-1] + ("0" if v[-1] != "0" else "1")
    x["evidence_span"] = x["evidence_span"].replace(v, moi)
    x["value"] = moi


def r7(ds, i, d):
    reg = json.loads((HERE.parents[1] / ".touch" / "lib" / "cncl-registry.json").read_text(encoding="utf-8"))
    khac = next(u["name"] for u in reg["units"] if u["name"] != ds[i]["entity"])
    ds.append({**ds[i], "entity": khac})
    ds.append({**next(x for x in ds if x["entity"] == ds[i]["entity"] and x["field"] == "ten_phap_nhan"), "entity": khac})


def r8(d):
    f, ds, i = dong_ma(d)
    e = ds[i]["entity"]
    ghi(f, [x for x in ds if x["entity"] != e])
    for h in d.glob("honest_null_*.jsonl"):
        ghi(h, [x for x in doc(h) if x.get("entity") != e])


def r10(ds, i, d):
    e = ds[i]["entity"]
    ds[:] = [x for x in ds if not (x["entity"] == e and x["field"] == "ten_phap_nhan")]


try:
    rang("RANG 1  · canh sach -> exit 0", None, 0)
    rang("RANG 2  · ghi thang ma_so_thue -> CAM_MA_SO_THUE", sua_ma(lambda ds, i, d: ds[i].update(field="ma_so_thue")), 2, "CAM_MA_SO_THUE")
    rang("RANG 3  · url masothue.com -> NGUON_TONG_HOP", sua_ma(lambda ds, i, d: ds[i].update(url="https://masothue.com/x", website_chinh_chu="masothue.com")), 2, "NGUON_TONG_HOP")
    rang("RANG 4  · url mien khac -> NGOAI_CHINH_CHU", sua_ma(lambda ds, i, d: ds[i].update(url="https://vnexpress.net/x")), 2, "NGOAI_CHINH_CHU")
    rang("RANG 5  · ma 9 so -> MA_SAI_DANG", sua_ma(lambda ds, i, d: ds[i].update(value=ds[i]["value"][:9])), 2, "MA_SAI_DANG")
    rang("RANG 6  · doi chu so trong span -> SPAN_KHONG_CHUP", sua_ma(r6), 2, "SPAN_KHONG_CHUP")
    rang("RANG 7  · ma me gan cho don vi khac -> MA_HAI_DON_VI", sua_ma(r7), 2, "MA_HAI_DON_VI")
    rang("RANG 8  · xoa ket qua mot don vi -> DON_VI_BO_SOT", r8, 2, "DON_VI_BO_SOT")
    rang("RANG 9  · tier B -> HANG_SAI", sua_ma(lambda ds, i, d: ds[i].update(tier_de_xuat="B")), 2, "HANG_SAI")
    rang("RANG 10 · bo ten phap nhan -> MA_THIEU_TEN", sua_ma(r10), 2, "MA_THIEU_TEN")
    rang("RANG 11 · em-dash trong ly_do -> EM_DASH", sua_ma(lambda ds, i, d: ds[i].update(ly_do=ds[i]["ly_do"] + " " + chr(0x2014) + " x")), 2, "EM_DASH")
finally:
    for t in tam:
        shutil.rmtree(t, ignore_errors=True)

can = sum(kq)
print(f"\nBITE KIEM LO DINH DANH: {can}/{len(kq)} rang can")
sys.exit(0 if can == len(kq) else 2)
