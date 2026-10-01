#!/usr/bin/env python3
"""kiem_lo_cau.py · Cong kiem mot LO CAU THAT (nhu cau dat hang cong nghe co nguon) truoc khi trinh
anh Lam duyet.

VI SAO CO (01/10/2026): chieu cau cua san pham chi la 30 san pham trong danh muc QD 21/2026, chua
phai nguoi dat hang that. Lo 03 gom nhu cau dat hang cong khai (nhiem vu KH&CN dat hang, bai toan
lon, chuong trinh, du an goi thau). Mot nhu cau sai bien dat hang hay sai doi tuong se di thang toi
nguoi dung nhu mot co hoi kinh doanh, nen cung ky luat voi chieu cung.

Doc  <dot>/de_xuat_*.jsonl, honest_null_*.jsonl, snapshots/*, gop.json (neu co), danh_muc_P.txt.
Ghi  <dot>/lo.json. KHONG ghi registry.

CONG KIEM (moi dong):
  THIEU_KHOA        thieu khoa bat buoc.
  TRUONG_LA         field ngoai danh sach.
  SPAN_DO_DAI       span ngoai 20..600 ky tu.
  CHUP_THIEU        ban chup khong co, hoac dau file khong ghi dung URL cua dong.
  SPAN_KHONG_CHUP   span khong la chuoi con TUNG KY TU cua ban chup (chi giai HTML entity va NFC,
                    dung luat cua refinery.py). Truoc 01/10/2026 cong nay gop khoang trang nen 30
                    span cat tu ban PDF (co ngat dong) lot qua, roi refinery bat SPAN_NOT_FOUND khi nap.
  SPAN_TREN_TIEU_DE span chi nam tren dong bat dau bang "#" (cong ghi_chu_ban_chup coi la ghi chu).
  VALUE_KHONG_SPAN  verbatim ma value khong nam trong span (cung luat tung ky tu).
  MOC_VUOT_SPAN     value co moc thoi gian (ngay, thang/nam, nam) ma span khong co (luat 3b cua
                    check_luat3.py, dung chung ham). Them 01/10/2026 vi ctd-21 lot toi registry.
  CHUAN_HOA_KHONG_KHAI normalized ma note khong bat dau "CHUAN HOA CO CHU DICH:".
  GIA_TRI_SAI       loai_dat_hang ngoai bon gia tri; san_pham_lien_quan ngoai 1..30.
  HANG_CAO_HON_LUAT tier cao hon luat ten mien (A chi cho *.gov.vn, baochinhphu.vn, *.chinhphu.vn).
  EM_DASH           em-dash trong span, ly_do hoac note.
  NGAY_SAI          ngay_bai khong dang yyyy-mm-dd, hoac khac hau to ten ban chup.
CONG KIEM (moi nhu cau):
  THIEU_TRUONG_CHINH  thieu ten_nhu_cau, ben_dat_hang hoac loai_dat_hang.
  O_TRUNG_TRONG_LO    mot truong hai gia tri khac nhau.
  TRUNG_NHU_CAU       hai nhu cau cung ben dat hang va ten giong nhau (Jaccard tu >= 0.6) ma khong
                      ghi trong gop.json (gop.json: {"<ma bo>": {"giu": "<ma giu>", "ly_do": "..."}}).

Chay: python3 kiem_lo_cau.py <dot>    Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
"""
import glob
import html
import json
import re
import sys
import unicodedata
from pathlib import Path
from urllib.parse import urlparse

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from check_luat3 import moc_vuot_span  # noqa: E402  dung chung luat 3b, khong chep tay

TRUONG = {"ten_nhu_cau", "ben_dat_hang", "loai_dat_hang", "san_pham_lien_quan", "doi_tuong", "thoi_han",
          "kinh_phi", "trang_thai"}
CHINH = {"ten_nhu_cau", "ben_dat_hang", "loai_dat_hang"}
LOAI = {"nhiem_vu_khcn", "bai_toan_lon", "chuong_trinh", "du_an_goi_thau"}
KHOA = ["entity", "field", "value", "evidence_span", "extraction", "tier_de_xuat", "snapshot", "url",
        "ngay_bai", "ly_do"]
NHAN = "CHUAN HOA CO CHU DICH:"
HANG = {"A": 3, "B": 2, "C": 1}
EM = chr(0x2014)


def thoat3(m):
    print(f"KHONG CHAY DUOC: {m}")
    sys.exit(3)


def dung(s):
    """Luat so khop cua registry (refinery.py, check_luat3.py): giai HTML entity roi NFC, KHONG gop khoang trang."""
    return unicodedata.normalize("NFC", html.unescape(s or ""))


def chuan(s):
    s = unicodedata.normalize("NFC", s or "").replace("﻿", "")
    return re.sub(r"\s+", " ", s).strip()


def bo_dau(s):
    s = unicodedata.normalize("NFD", (s or "").lower().replace("đ", "d"))
    return "".join(c for c in s if unicodedata.category(c) != "Mn")


def tu(s):
    return set(re.sub(r"[^a-z0-9 ]+", " ", bo_dau(s)).split())


def mien(url):
    h = urlparse(url or "").netloc.lower()
    return h[4:] if h.startswith("www.") else h


def hang_luat(url):
    h = mien(url)
    # chinhphu.vn la ten mien cua Cong TTDT Chinh phu; mien con (thanglong.chinhphu.vn cua Ha Noi)
    # la cong chinh quyen, cung hang voi *.gov.vn.
    return "A" if h.endswith(".gov.vn") or h in ("baochinhphu.vn", "chinhphu.vn") or h.endswith(".chinhphu.vn") else "B"


def main(argv):
    if len(argv) < 2:
        thoat3("dung: kiem_lo_cau.py <dot>")
    dot = Path(argv[1])
    tep = sorted(glob.glob(str(dot / "de_xuat_*.jsonl")))
    if not tep:
        thoat3(f"{dot} khong co de_xuat_*.jsonl. Rong khong phai sach.")
    dong = []
    for f in tep:
        for i, l in enumerate(Path(f).read_text(encoding="utf-8").splitlines(), 1):
            if l.strip():
                try:
                    dong.append((f"{Path(f).name}:{i}", json.loads(l)))
                except json.JSONDecodeError as e:
                    thoat3(f"{Path(f).name}:{i} khong phai JSON ({e})")
    gop = json.loads((dot / "gop.json").read_text(encoding="utf-8")) if (dot / "gop.json").exists() else {}
    vi = []
    o = {}
    for vt, d in dong:
        thieu = [k for k in KHOA if k not in d]
        if thieu:
            vi.append(f"THIEU_KHOA: {vt} thieu {', '.join(thieu)}")
            continue
        e, f, v, span = d["entity"], d["field"], str(d["value"]), d["evidence_span"]
        if f not in TRUONG:
            vi.append(f"TRUONG_LA: {vt} '{f}'")
            continue
        if not 20 <= len(span) <= 600:
            vi.append(f"SPAN_DO_DAI: {vt} {len(span)} ky tu")
        sp = dot / "snapshots" / d["snapshot"]
        if not sp.exists():
            vi.append(f"CHUP_THIEU: {vt} khong co {d['snapshot']}")
        else:
            noi = sp.read_text(encoding="utf-8")
            if f"# URL: {d['url']}" not in "\n".join(noi.splitlines()[:4]):
                vi.append(f"CHUP_THIEU: {vt} dau {d['snapshot']} khong ghi URL cua dong")
            if dung(span) not in dung(noi):
                goi = " (chi khop khi gop khoang trang: chep dung ngat dong cua ban chup)" if chuan(span) in chuan(noi) else ""
                vi.append(f"SPAN_KHONG_CHUP: {vt} {e}/{f}{goi}")
            else:
                than = "\n".join(x for x in noi.splitlines() if not x.lstrip().startswith("#"))
                if chuan(span) not in chuan(than):
                    vi.append(f"SPAN_TREN_TIEU_DE: {vt} {e}/{f} span chi nam tren dong '#'")
            m = re.search(r"_(\d{4})(\d{2})(\d{2})\.", d["snapshot"])
            if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", str(d["ngay_bai"])) or not m or d["ngay_bai"] != f"{m[1]}-{m[2]}-{m[3]}":
                vi.append(f"NGAY_SAI: {vt} ngay_bai {d['ngay_bai']} va ban chup {d['snapshot']}")
        if d["extraction"] == "verbatim" and dung(v) not in dung(span):
            vi.append(f"VALUE_KHONG_SPAN: {vt} {e}/{f}")
        thieu_moc = moc_vuot_span(dung(v), dung(span))
        if thieu_moc:
            vi.append(f"MOC_VUOT_SPAN: {vt} {e}/{f} value co {', '.join(thieu_moc)} ma span khong co")
        if d["extraction"] == "normalized" and not str(d.get("note", "")).startswith(NHAN):
            vi.append(f"CHUAN_HOA_KHONG_KHAI: {vt} {e}/{f}")
        if f == "loai_dat_hang" and v not in LOAI:
            vi.append(f"GIA_TRI_SAI: {vt} loai_dat_hang '{v}'")
        if f == "san_pham_lien_quan" and not (v.isdigit() and 1 <= int(v) <= 30):
            vi.append(f"GIA_TRI_SAI: {vt} san_pham_lien_quan '{v}'")
        if HANG.get(d["tier_de_xuat"], 9) > HANG[hang_luat(d["url"])]:
            vi.append(f"HANG_CAO_HON_LUAT: {vt} {mien(d['url'])} ghi {d['tier_de_xuat']}")
        for k in ("evidence_span", "ly_do", "note"):
            if EM in str(d.get(k, "")):
                vi.append(f"EM_DASH: {vt} {k}")
        if (e, f) in o and chuan(o[(e, f)]) != chuan(v):
            vi.append(f"O_TRUNG_TRONG_LO: {e}/{f}")
        o[(e, f)] = v

    nc = {}
    for (e, f), v in o.items():
        nc.setdefault(e, {})[f] = v
    for e, x in sorted(nc.items()):
        thieu = CHINH - set(x)
        if thieu:
            vi.append(f"THIEU_TRUONG_CHINH: {e} thieu {', '.join(sorted(thieu))}")
    ds = sorted(nc)
    trung = []
    for i, a in enumerate(ds):
        for b in ds[i + 1:]:
            ta, tb = tu(nc[a].get("ten_nhu_cau", "")), tu(nc[b].get("ten_nhu_cau", ""))
            if not ta or not tb:
                continue
            j = len(ta & tb) / len(ta | tb)
            cung_ben = tu(nc[a].get("ben_dat_hang", "")) == tu(nc[b].get("ben_dat_hang", ""))
            if j >= 0.6 and cung_ben:
                trung.append((a, b, j))
                if not ((a in gop and gop[a].get("giu") == b) or (b in gop and gop[b].get("giu") == a)):
                    vi.append(f"TRUNG_NHU_CAU: {a} va {b} (Jaccard {j:.2f}, cung ben dat hang) chua ghi trong gop.json")
    for bo, g in gop.items():
        if bo not in nc or g.get("giu") not in nc or not g.get("ly_do"):
            vi.append(f"TRUNG_NHU_CAU: gop.json '{bo}' tro toi ma khong co, hoac thieu ly_do")

    null = [json.loads(l) for f in sorted(glob.glob(str(dot / "honest_null_*.jsonl")))
            for l in Path(f).read_text(encoding="utf-8").splitlines() if l.strip()]
    lo = {"loai": "cau_that", "nhu_cau": {e: x for e, x in nc.items() if e not in gop},
          "dong": [d for _, d in dong if d.get("entity") not in gop], "gop": gop, "honest_null": null}
    (dot / "lo.json").write_text(json.dumps(lo, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"lo cau {dot.name}: {len(dong)} dong · {len(nc)} nhu cau · gop {len(gop)} · con {len(nc) - len(gop)} · "
          f"{len(null)} honest-null · cap trung phat hien {len(trung)}")
    if vi:
        print(f"\nFAIL: {len(vi)} vi pham")
        for v in vi[:60]:
            print("  " + v)
        return 2
    print("\nOK: lo cau sach; moi nhu cau co ben dat hang, doi tuong nguyen van, khong trung chua gop.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
