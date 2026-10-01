#!/usr/bin/env python3
"""bite_cau_dat_hang.py · Rang cua check_cau_dat_hang.py.

CANH
====
TU DUNG LAY CANH: chep domains/cau_dat_hang va cac lo cau da nap (lam_giau/dot_* co LOAI_CAU va
da_nap.json; chi lay duyet.json, da_nap.json, LOAI_CAU) vao thu muc tam (tempfile.mkdtemp), tiem
loi vao BAN SAO roi chay cong voi --domain va --lam-giau tro vao ban sao. File that khong bi cham.
Moi phep tiem chon dong theo HANH VI (dong dau co truong X) nen du lieu doi thi rang van can.

RANG
====
RANG 1 · canh sach -> exit 0.
RANG 2 · them tay mot nhu cau khong qua lo nao -> KHONG_DUYET.
RANG 3 · duyet.json thanh MO PHONG (khong co nguoi duyet that) -> KHONG_DUYET.
RANG 4 · xoa tay mot claim sau khi nap -> NAP_KHONG_KHOP.
RANG 5 · bo ben_dat_hang cua mot nhu cau -> THIEU_TRUONG_CHINH.
RANG 6 · nhan doi mot claim voi gia tri khac -> O_TRUNG.
RANG 7 · claim nguon bao ghi hang A -> HANG_CAO_HON_LUAT.
RANG 8 · loai_dat_hang "hop_tac" -> GIA_TRI_SAI.
RANG 9 · xoa mot ban chup -> BAN_CHUP_THIEU.

Chay: python3 bite_cau_dat_hang.py     Exit 0 moi rang can · 2 co rang khong can · 3 KHONG CHAY DUOC.
"""
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
CONG = HERE / "check_cau_dat_hang.py"
DOM = HERE / "domains" / "cau_dat_hang"
LG = HERE / "lam_giau"
if not (DOM / "claims.jsonl").exists():
    print("KHONG CHAY DUOC: domain cau_dat_hang chua co claims.jsonl de dung canh")
    sys.exit(3)
kq, tam = [], []


def doc(p):
    return [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]


def ghi(p, ds):
    p.write_text("".join(json.dumps(d, ensure_ascii=False) + "\n" for d in ds), encoding="utf-8")


def canh():
    t = Path(tempfile.mkdtemp(prefix="bite_cau_dat_hang_"))
    tam.append(t)
    shutil.copytree(DOM, t / "dom")
    (t / "lg").mkdir()
    for d in sorted(LG.glob("dot_*")):
        if (d / "LOAI_CAU").exists() and (d / "da_nap.json").exists():
            (t / "lg" / d.name).mkdir()
            for f in ("LOAI_CAU", "duyet.json", "da_nap.json"):
                if (d / f).exists():
                    shutil.copy2(d / f, t / "lg" / d.name / f)
    return t


def rang(nhan, sua, ma, ky=None):
    t = canh()
    try:
        if sua:
            sua(t)
    except (RuntimeError, StopIteration) as e:
        print(f"{nhan:<56} : KHONG CAN !! KHONG TIEM DUOC {e}")
        kq.append(False)
        return
    r = subprocess.run([sys.executable, str(CONG), "--domain", str(t / "dom"), "--lam-giau", str(t / "lg")],
                       capture_output=True, text=True)
    ok = r.returncode == ma and (ky is None or ky in r.stdout)
    print(f"{nhan:<56} : {'CAN OK' if ok else 'KHONG CAN !!'} (exit {r.returncode})")
    kq.append(ok)


def doi_claims(f):
    def s(t):
        p = t / "dom" / "claims.jsonl"
        ghi(p, f(doc(p)))
    return s


def them_tay(ds):
    x = dict(ds[0]); x["entity"] = "tay-01"
    return ds + [x]


def mo_phong(t):
    for p in (t / "lg").glob("dot_*/duyet.json"):
        d = json.loads(p.read_text(encoding="utf-8")); d["nguoi_duyet"] = "(MO PHONG, CHUA DUYET)"
        p.write_text(json.dumps(d, ensure_ascii=False), encoding="utf-8")


def bo_ben(ds):
    e = next(c["entity"] for c in ds if c["field"] == "ben_dat_hang")
    return [c for c in ds if not (c["entity"] == e and c["field"] == "ben_dat_hang")]


def nhan_doi(ds):
    x = dict(next(c for c in ds if c["field"] == "ten_nhu_cau")); x["value"] = str(x["value"]) + " (ban khac)"
    return ds + [x]


def bao_hang_a(ds):
    c = next(c for c in ds if c["tier"] == "B")
    c["tier"] = "A"
    return ds


def loai_la(ds):
    next(c for c in ds if c["field"] == "loai_dat_hang")["value"] = "hop_tac"
    return ds


def xoa_chup(t):
    s = doc(t / "dom" / "claims.jsonl")[0]["capture"]["snapshot"]
    (t / "dom" / "snapshots" / s).unlink()


try:
    rang("RANG 1 · canh sach -> exit 0", None, 0)
    rang("RANG 2 · them tay nhu cau -> KHONG_DUYET", doi_claims(them_tay), 2, "KHONG_DUYET")
    rang("RANG 3 · duyet MO PHONG -> KHONG_DUYET", mo_phong, 2, "KHONG_DUYET")
    rang("RANG 4 · xoa tay mot claim -> NAP_KHONG_KHOP", doi_claims(lambda ds: ds[1:]), 2, "NAP_KHONG_KHOP")
    rang("RANG 5 · bo ben_dat_hang -> THIEU_TRUONG_CHINH", doi_claims(bo_ben), 2, "THIEU_TRUONG_CHINH")
    rang("RANG 6 · nhan doi truong -> O_TRUNG", doi_claims(nhan_doi), 2, "O_TRUNG")
    rang("RANG 7 · bao ghi hang A -> HANG_CAO_HON_LUAT", doi_claims(bao_hang_a), 2, "HANG_CAO_HON_LUAT")
    rang("RANG 8 · loai_dat_hang la -> GIA_TRI_SAI", doi_claims(loai_la), 2, "GIA_TRI_SAI")
    rang("RANG 9 · xoa ban chup -> BAN_CHUP_THIEU", xoa_chup, 2, "BAN_CHUP_THIEU")
finally:
    for t in tam:
        shutil.rmtree(t, ignore_errors=True)
can = sum(kq)
print(f"\nBITE CAU DAT HANG: {can}/{len(kq)} rang can")
sys.exit(0 if can == len(kq) else 2)
