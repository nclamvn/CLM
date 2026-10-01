#!/usr/bin/env python3
"""kiem_lo_dinh_danh.py · Cong kiem mot LO DINH DANH PHAP NHAN truoc khi trinh anh Lam duyet.

VI SAO CO (01/10/2026): thanh "Don vi da dinh danh phap nhan" o 0/60. Cong check_ma_so_thue.py
chi nhan ma so tu nam cong chinh thuc, va ca nam cong deu khong doc may duoc (captcha, tai
khoan tra phi, trang chay JavaScript). Anh Lam chot duong "ca hai":
  1. may gom ma so TU KHAI tu website chinh chu, ghi vao truong rieng `ma_so_tu_khai`, hien
     nhan khac va KHONG tinh la da dinh danh;
  2. nguoi cua RtR tra xac nhan tren cong dang ky doanh nghiep quoc gia; chi ma da doi chieu
     cong moi vao `ma_so_thue`.
Cong nay giu cho buoc 1 khong tro thanh cua sau cua buoc 2.

Doc  <thu_muc_dot>/de_xuat_*.jsonl, honest_null_*.jsonl, snapshots/*, va danh sach don vi tu
     .touch/lib/cncl-registry.json (chi doc).
Ghi  <thu_muc_dot>/lo.json (dau vao cho bang duyet). KHONG ghi registry.

CONG KIEM:
  THIEU_KHOA        thieu khoa bat buoc.
  TRUONG_LA         field ngoai {ten_phap_nhan, ma_so_tu_khai}. Rieng ma_so_thue: CAM_MA_SO_THUE
                    (truong do chi nhan tu cong chinh thuc, qua buoc nguoi tra).
  DON_VI_LA         entity khong co trong registry (sai ten la mat dong khi nap).
  SPAN_DO_DAI       evidence_span ngoai 20..600 ky tu.
  CHUP_THIEU        ban chup khong ton tai, hoac dau file khong ghi dung URL cua dong.
  SPAN_KHONG_CHUP   span khong la chuoi con cua ban chup (gop khoang trang, NFC; khong bo dau).
  VALUE_KHONG_SPAN  value khong la chuoi con cua span.
  MA_SAI_DANG       ma_so_tu_khai khong dung dang 10 so hoac 10 so-3 so.
  NGUON_TONG_HOP    url hoac website_chinh_chu la trang tra cuu, tong hop doanh nghiep, bach khoa
                    mo, mang xa hoi. Dung ca khi no dung: khong truy duoc trach nhiem.
  NGOAI_CHINH_CHU   ten mien cua url khong phai website_chinh_chu (hay mien con cua no).
  HANG_SAI          tier_de_xuat khac "C" hoac extraction khac "verbatim": ma so tu khai la
                    chu cua chinh don vi, khong hon.
  EM_DASH           em-dash trong ly_do hoac can_cu_chinh_chu (chu cua agent).
  O_TRUNG_TRONG_LO  hai dong cung (don vi, truong) ma gia tri khac nhau.
  MA_HAI_DON_VI     mot ma so gan cho hai don vi khac nhau: dau hieu lay ma cong ty me gan cho
                    con (bai hoc HTI 02/09/2026).
  MA_THIEU_TEN      co ma_so_tu_khai ma khong co ten_phap_nhan: nguoi tra cong can ca hai.
  DON_VI_BO_SOT     don vi trong registry khong co ket qua (de xuat hoac honest-null) cho mot
                    truong. Im lang khong phai ket qua.

GAN CO (khong lam do, hien tren bang duyet): TEN_TIENG_ANH (ten phap nhan khong co chu tieng
Viet co dau), DON_VI_PHU_THUOC (ma dang -xxx).

Chay: python3 kiem_lo_dinh_danh.py <thu_muc_dot>    Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
"""
import glob
import json
import re
import sys
import unicodedata
from pathlib import Path
from urllib.parse import urlparse

HERE = Path(__file__).resolve().parent
REG_WEB = HERE.parents[1] / ".touch" / "lib" / "cncl-registry.json"

TRUONG = {"ten_phap_nhan", "ma_so_tu_khai"}
KHOA = ["entity", "field", "value", "evidence_span", "extraction", "tier_de_xuat", "snapshot",
        "url", "website_chinh_chu", "can_cu_chinh_chu", "ly_do"]
MAU_MA = re.compile(r"^\d{10}(-\d{3})?$")
# Trang tra cuu, tong hop doanh nghiep va nguon mo: CAM cho dinh danh (feedback_danh_tinh_phap_nhan).
TONG_HOP = ("masothue", "thongtindoanhnghiep", "hosocongty", "infodoanhnghiep", "trangvang",
            "yellowpages", "thuvienphapluat", "tratencongty", "doanhnghiep.biz", "vietnamcompany",
            "dnb.com", "opencorporates", "wikipedia", "linkedin", "facebook", "vinabiz",
            "dauthau", "masocongty", "timcongty", "congtydoanhnghiep", "tracuumst", "mst.vn",
            "topcv", "vietnamworks", "itviec", "zoominfo", "crunchbase")
CO_DAU = re.compile(r"[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]", re.I)


def thoat3(m):
    print(f"KHONG CHAY DUOC: {m}")
    sys.exit(3)


def chuan(s):
    s = unicodedata.normalize("NFC", s or "").replace("﻿", "")
    return re.sub(r"\s+", " ", s).strip()


def mien(s):
    h = (urlparse(s).netloc if "://" in (s or "") else (s or "")).lower().split(":")[0]
    return h[4:] if h.startswith("www.") else h


def doc_jsonl(p):
    ds = []
    for i, l in enumerate(Path(p).read_text(encoding="utf-8").splitlines(), 1):
        if l.strip():
            try:
                ds.append(json.loads(l))
            except json.JSONDecodeError as e:
                thoat3(f"{Path(p).name}:{i} khong phai JSON ({e})")
    return ds


def main(argv):
    if len(argv) < 2:
        thoat3("dung: kiem_lo_dinh_danh.py <thu_muc_dot> [registry.json]")
    dot = Path(argv[1])
    reg_p = Path(argv[2]) if len(argv) > 2 else REG_WEB
    if not reg_p.exists():
        thoat3(f"thieu {reg_p}")
    don_vi = [u["name"] for u in json.loads(reg_p.read_text(encoding="utf-8"))["units"]]
    tep = sorted(glob.glob(str(dot / "de_xuat_*.jsonl")))
    if not tep:
        thoat3(f"{dot} khong co de_xuat_*.jsonl. Rong khong phai sach.")
    dong = [(Path(f).name, i, d) for f in tep for i, d in enumerate(doc_jsonl(f), 1)]
    null = [d for f in sorted(glob.glob(str(dot / "honest_null_*.jsonl"))) for d in doc_jsonl(f)]

    vi, co_cua = [], {}
    o = {}
    ma_cua = {}
    for f, i, d in dong:
        vt = f"{f}:{i}"
        thieu = [k for k in KHOA if k not in d]
        if thieu:
            vi.append(f"THIEU_KHOA: {vt} thieu {', '.join(thieu)}")
            continue
        e, fld, val, span = d["entity"], d["field"], str(d["value"]), d["evidence_span"]
        if fld == "ma_so_thue":
            vi.append(f"CAM_MA_SO_THUE: {vt} {e}: truong ma_so_thue chi nhan tu cong chinh thuc")
            continue
        if fld not in TRUONG:
            vi.append(f"TRUONG_LA: {vt} field '{fld}'")
            continue
        if e not in don_vi:
            vi.append(f"DON_VI_LA: {vt} '{e}' khong co trong registry")
        if not 20 <= len(span) <= 600:
            vi.append(f"SPAN_DO_DAI: {vt} {len(span)} ky tu")
        sp = dot / "snapshots" / d["snapshot"]
        if not sp.exists():
            vi.append(f"CHUP_THIEU: {vt} khong co {d['snapshot']}")
        else:
            noi = sp.read_text(encoding="utf-8")
            dau = "\n".join(noi.splitlines()[:4])
            if f"# URL: {d['url']}" not in dau:
                vi.append(f"CHUP_THIEU: {vt} dau {d['snapshot']} khong ghi URL cua dong")
            if chuan(span) not in chuan(noi):
                vi.append(f"SPAN_KHONG_CHUP: {vt} {e}/{fld}")
        if chuan(val) not in chuan(span):
            vi.append(f"VALUE_KHONG_SPAN: {vt} {e}/{fld} '{val[:40]}'")
        if fld == "ma_so_tu_khai" and not MAU_MA.match(val.strip()):
            vi.append(f"MA_SAI_DANG: {vt} {e} '{val}'")
        h, wc = mien(d["url"]), mien(d["website_chinh_chu"])
        if any(t in h or t in wc for t in TONG_HOP):
            vi.append(f"NGUON_TONG_HOP: {vt} {e} {h}")
        elif not wc or not (h == wc or h.endswith("." + wc)):
            vi.append(f"NGOAI_CHINH_CHU: {vt} {e} url {h} khong thuoc {wc or '(trong)'}")
        if d["tier_de_xuat"] != "C" or d["extraction"] != "verbatim":
            vi.append(f"HANG_SAI: {vt} {e} tier {d['tier_de_xuat']} extraction {d['extraction']}")
        for k in ("ly_do", "can_cu_chinh_chu"):
            if chr(0x2014) in str(d.get(k, "")):
                vi.append(f"EM_DASH: {vt} {k}")
        k = (e, fld)
        if k in o and chuan(o[k]) != chuan(val):
            vi.append(f"O_TRUNG_TRONG_LO: {e}/{fld} '{o[k][:30]}' va '{val[:30]}'")
        o[k] = val
        if fld == "ma_so_tu_khai":
            ma_cua.setdefault(val.strip(), set()).add(e)
        co_cua.setdefault(e, set()).add(fld)

    for ma, ds in ma_cua.items():
        if len(ds) > 1:
            vi.append(f"MA_HAI_DON_VI: {ma} gan cho {' | '.join(sorted(ds))}")
    for e, fs in co_cua.items():
        if "ma_so_tu_khai" in fs and "ten_phap_nhan" not in fs:
            vi.append(f"MA_THIEU_TEN: {e}")
    da_null = {(n.get("entity"), n.get("truong")) for n in null}
    for e in don_vi:
        for fld in sorted(TRUONG):
            if fld not in co_cua.get(e, set()) and (e, fld) not in da_null:
                vi.append(f"DON_VI_BO_SOT: {e} / {fld}")

    lo = []
    for f, i, d in dong:
        if not all(k in d for k in KHOA) or d.get("field") not in TRUONG:
            continue
        co = []
        if d["field"] == "ten_phap_nhan" and not CO_DAU.search(d["value"]):
            co.append("TEN_TIENG_ANH")
        if d["field"] == "ma_so_tu_khai" and "-" in d["value"]:
            co.append("DON_VI_PHU_THUOC")
        lo.append({**d, "co": co})
    (dot / "lo.json").write_text(json.dumps({"loai": "dinh_danh", "dong": lo, "honest_null": null},
                                            ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    n_ma = sum(1 for d in lo if d["field"] == "ma_so_tu_khai")
    n_ten = sum(1 for d in lo if d["field"] == "ten_phap_nhan")
    print(f"lo dinh danh {dot.name}: {len(dong)} dong · {n_ten} ten phap nhan · {n_ma} ma tu khai · "
          f"{len(null)} honest-null · {len(don_vi)} don vi")
    if vi:
        print(f"\nFAIL: {len(vi)} vi pham")
        for v in vi[:60]:
            print("  " + v)
        return 2
    print("\nOK: lo dinh danh sach; ma tu khai chi tu website chinh chu, khong cham ma_so_thue.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
