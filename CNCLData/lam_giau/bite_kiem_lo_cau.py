#!/usr/bin/env python3
"""bite_kiem_lo_cau.py · Rang cua kiem_lo_cau.py.

CANH
====
TU DUNG LAY CANH: chep lo cau dang co (dot_* co tep LOAI_CAU) vao thu muc tam (tempfile.mkdtemp),
tiem loi vao BAN SAO roi chay cong. Khong sua file that. Moi phep tiem chon dong theo HANH VI
(dong verbatim, dong nguon bao, nhu cau co ma giu trong gop.json) chu khong theo mot nhu cau cu
the, nen du lieu lo doi thi rang van can. Khong co lo cau nao thi KHONG CHAY DUOC.

RANG
====
RANG 1  · canh sach -> exit 0.
RANG 2  · doi mot chu trong span -> SPAN_KHONG_CHUP.
RANG 3  · value verbatim khong nam trong span -> VALUE_KHONG_SPAN.
RANG 4  · bao (khong phai cong nha nuoc) ghi hang A -> HANG_CAO_HON_LUAT.
RANG 5  · loai_dat_hang ngoai bon gia tri -> GIA_TRI_SAI.
RANG 6  · san_pham_lien_quan "31" -> GIA_TRI_SAI.
RANG 7  · bo ben_dat_hang cua mot nhu cau -> THIEU_TRUONG_CHINH.
RANG 8  · xoa gop.json (hai nhu cau trung lai hien ra) -> TRUNG_NHU_CAU.
RANG 9  · em-dash trong ly_do -> EM_DASH.
RANG 10 · normalized khong khai ly do -> CHUAN_HOA_KHONG_KHAI.
RANG 11 · ngay_bai lech hau to ban chup -> NGAY_SAI.
RANG 12 · span chi khop khi gop khoang trang (doi mot dau cach thanh hai) -> SPAN_KHONG_CHUP kem goi y
          (01/10/2026: cong cu gop khoang trang nen 30 span PDF lot toi refinery).
RANG 13 · value normalized co nam 2031 ma span khong co -> MOC_VUOT_SPAN (ctd-21 lot toi registry).

Chay: python3 bite_kiem_lo_cau.py     Exit 0 moi rang can · 2 co rang khong can · 3 KHONG CHAY DUOC.
"""
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
CONG = HERE / "kiem_lo_cau.py"
lo = sorted(p for p in HERE.glob("dot_*") if (p / "LOAI_CAU").exists())
if not lo:
    print("KHONG CHAY DUOC: khong co lo cau nao (dot_* co tep LOAI_CAU).")
    sys.exit(3)
GOC = lo[-1]
kq, tam = [], []


def doc(p):
    return [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]


def ghi(p, ds):
    p.write_text("".join(json.dumps(d, ensure_ascii=False) + "\n" for d in ds), encoding="utf-8")


def sua_dong(chon, doi):
    def s(d):
        for f in sorted(d.glob("de_xuat_*.jsonl")):
            ds = doc(f)
            for i, x in enumerate(ds):
                if chon(x):
                    doi(x, ds, i)
                    ghi(f, ds)
                    return
        raise RuntimeError("KHONG TIEM DUOC: khong co dong phu hop")
    return s


def rang(nhan, sua, ma, ky=None):
    t = Path(tempfile.mkdtemp(prefix="bite_lo_cau_"))
    tam.append(t)
    d = t / GOC.name
    shutil.copytree(GOC, d, ignore=shutil.ignore_patterns("lo.json", "__pycache__"))
    try:
        if sua:
            sua(d)
    except RuntimeError as e:
        print(f"{nhan:<58} : KHONG CAN !! {e}")
        kq.append(False)
        return
    r = subprocess.run([sys.executable, str(CONG), str(d)], capture_output=True, text=True)
    ok = r.returncode == ma and (ky is None or ky in r.stdout + r.stderr)
    print(f"{nhan:<58} : {'CAN OK' if ok else 'KHONG CAN !!'} (exit {r.returncode})")
    kq.append(ok)


vb = lambda x: x.get("extraction") == "verbatim" and len(x["value"]) < len(x["evidence_span"])  # noqa: E731


def r7(d):
    gop = json.loads((d / "gop.json").read_text(encoding="utf-8")) if (d / "gop.json").exists() else {}
    for f in sorted(d.glob("de_xuat_*.jsonl")):
        ds = doc(f)
        e = next((x["entity"] for x in ds if x["field"] == "ben_dat_hang" and x["entity"] not in gop), None)
        if e:
            ghi(f, [x for x in ds if not (x["entity"] == e and x["field"] == "ben_dat_hang")])
            return
    raise RuntimeError("KHONG TIEM DUOC")


def r8(d):
    if not (d / "gop.json").exists():
        raise RuntimeError("KHONG TIEM DUOC: lo khong co gop.json")
    (d / "gop.json").unlink()


try:
    rang("RANG 1  · canh sach -> exit 0", None, 0)
    rang("RANG 2  · doi chu trong span -> SPAN_KHONG_CHUP", sua_dong(vb, lambda x, ds, i: x.update(evidence_span=x["evidence_span"][:-3] + "XQZ")), 2, "SPAN_KHONG_CHUP")
    rang("RANG 3  · value ngoai span -> VALUE_KHONG_SPAN", sua_dong(vb, lambda x, ds, i: x.update(value=x["value"] + " va che tao ten lua")), 2, "VALUE_KHONG_SPAN")
    rang("RANG 4  · bao ghi hang A -> HANG_CAO_HON_LUAT", sua_dong(lambda x: x["tier_de_xuat"] == "B", lambda x, ds, i: x.update(tier_de_xuat="A")), 2, "HANG_CAO_HON_LUAT")
    rang("RANG 5  · loai_dat_hang la -> GIA_TRI_SAI", sua_dong(lambda x: x["field"] == "loai_dat_hang", lambda x, ds, i: x.update(value="hop_tac")), 2, "GIA_TRI_SAI")
    rang("RANG 6  · san pham 31 -> GIA_TRI_SAI", sua_dong(lambda x: x["field"] == "san_pham_lien_quan", lambda x, ds, i: x.update(value="31")), 2, "GIA_TRI_SAI")
    rang("RANG 7  · bo ben_dat_hang -> THIEU_TRUONG_CHINH", r7, 2, "THIEU_TRUONG_CHINH")
    rang("RANG 8  · xoa gop.json -> TRUNG_NHU_CAU", r8, 2, "TRUNG_NHU_CAU")
    rang("RANG 9  · em-dash trong ly_do -> EM_DASH", sua_dong(lambda x: True, lambda x, ds, i: x.update(ly_do=x["ly_do"] + " " + chr(0x2014) + " x")), 2, "EM_DASH")
    rang("RANG 10 · normalized khong khai -> CHUAN_HOA_KHONG_KHAI", sua_dong(lambda x: x["extraction"] == "normalized", lambda x, ds, i: x.update(note="")), 2, "CHUAN_HOA_KHONG_KHAI")
    rang("RANG 12 · span chi khop khi gop khoang trang -> SPAN_KHONG_CHUP", sua_dong(lambda x: " " in x["evidence_span"].strip(), lambda x, ds, i: x.update(evidence_span=x["evidence_span"].replace(" ", "  ", 1))), 2, "gop khoang trang")
    rang("RANG 13 · nam trong value ngoai span -> MOC_VUOT_SPAN", sua_dong(lambda x: x["extraction"] == "normalized" and "2031" not in x["evidence_span"], lambda x, ds, i: x.update(value=str(x["value"]) + " năm 2031")), 2, "MOC_VUOT_SPAN")
    rang("RANG 11 · ngay_bai lech ban chup -> NGAY_SAI", sua_dong(lambda x: True, lambda x, ds, i: x.update(ngay_bai="1999-01-01")), 2, "NGAY_SAI")
finally:
    for t in tam:
        shutil.rmtree(t, ignore_errors=True)

can = sum(kq)
print(f"\nBITE KIEM LO CAU: {can}/{len(kq)} rang can")
sys.exit(0 if can == len(kq) else 2)
