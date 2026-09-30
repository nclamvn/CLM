#!/usr/bin/env python3
"""kiem_lo.py · Cong kiem mot LO de xuat lam giau truoc khi trinh anh Lam duyet.

VI SAO CO (30/09/2026): anh Lam chot lam giau du lieu theo bon huong va duyet nguon THEO LO.
Duyet theo lo chi an toan khi moi dong trinh len da qua mot cong tat dinh: nguoi duyet doc de
quyet DUNG hay KHONG DUNG, khong phai de soat loi chep. Vong tu chay (vong_tu_chay/) chi nhan
mst.gov.vn; lo lam giau di rong hon nen can cong rieng, cung ky luat.

Doc  <thu_muc_dot>/de_xuat_*.jsonl, <thu_muc_dot>/snapshots/*, <thu_muc_dot>/honest_null_*.jsonl
     va domains/don_vi_cncl/claims.jsonl (registry that, chi doc).
Ghi  <thu_muc_dot>/lo.json (dau vao cho bang duyet). KHONG ghi vao registry.

CONG KIEM (moi dong de xuat):
  THIEU_KHOA       thieu khoa bat buoc.
  TRUONG_LA        field khong thuoc danh sach cho phep, hoac ma_so_thue.
  SPAN_DO_DAI      evidence_span ngoai 20..600 ky tu.
  CHUP_THIEU       file ban chup khong ton tai, hoac dau file khong ghi dung URL cua dong.
  SPAN_KHONG_CHUP  evidence_span khong la chuoi con cua ban chup (so sau khi gop khoang trang,
                   chuan NFC, bo U+FEFF; KHONG bo dau, KHONG ha chu).
  VALUE_KHONG_SPAN extraction verbatim ma value khong la chuoi con cua span.
  CHUAN_HOA_KHONG_KHAI  extraction normalized ma note khong bat dau "CHUAN HOA CO CHU DICH:".
  GIA_TRI_SAI      loai_hinh ngoai {DN, vien, truong}; nhom_cncl ngoai 1..10; san_pham_lien_quan
                   ngoai 1..30 hoac khac ma nhu_cau cua dong.
  NHOM_LECH        nhom_cncl khac nhom cua nhu cau theo QD 21 (bang NHOM_CUA_SP ben duoi).
  HANG_CAO_HON_LUAT tier_de_xuat cao hon hang theo luat ten mien (A: *.gov.vn, baochinhphu.vn;
                   C: trang cua chinh don vi; con lai B). Duoc de xuat THAP hon, khong duoc cao hon.
  EM_DASH          em-dash trong ly_do hoac note (chu cua agent). Trong span thi duoc: la chu nguon.
  DON_VI_THIEU     don vi MOI thieu mot trong sau truong bat buoc.
  DON_VI_CU_SAI_TRUONG  don vi DA CO trong registry ma de xuat truong khac nang_luc_mo_ta_2,
                   bang_chung_nang_luc (ghi de ten, nhom, san pham cua don vi cu la viec khac).
  TRUNG_REGISTRY   evidence_span da co nguyen van trong registry cho cung don vi va truong.
  O_DA_CO_GIA_TRI  o (don vi, truong) DA CO gia tri KHAC trong registry. Moi truong la o DON TRI:
                   nap them mot gia tri khac bien o thanh TRANH CHAP, refinery bo o do, va may
                   ghep mat nang luc cu. Mo phong 30/09/2026 bat dung ca nay: nang_luc_mo_ta_2 thu
                   hai cua Tap doan Viettel (dien toan dam may) lam roi HAI match anh Lam da ky
                   (P22, P23). Muon them mang nang luc cho don vi cu thi can truong moi trong
                   domain.yaml, va do la quyet dinh cua anh Lam.
  O_TRUNG_TRONG_LO hai dong trong lo cung (don vi, truong) ma gia tri khac nhau: cung ly do tren.

GAN CO (khong lam do, hien tren bang duyet): NGUON_MOI (ten mien chua tung co trong registry),
TOI_THUONG (span co tu toi thuong), TU_KHAI (hang C), NGUON_CU (bai truoc 2020), KHONG_RO_NGAY.

Chay: python3 kiem_lo.py <thu_muc_dot> [claims.jsonl]    hoac    python3 kiem_lo.py --tat-ca
Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
"""
import glob
import json
import re
import sys
import unicodedata
from pathlib import Path
from urllib.parse import urlparse

HERE = Path(__file__).resolve().parent
REGISTRY = HERE.parent / "domains" / "don_vi_cncl" / "claims.jsonl"

TRUONG_CHO_PHEP = {"ten_don_vi", "loai_hinh", "nhom_cncl", "san_pham_lien_quan", "nang_luc_mo_ta",
                   "nang_luc_mo_ta_2", "bang_chung_nang_luc", "location"}
SAU_TRUONG = {"ten_don_vi", "loai_hinh", "nhom_cncl", "san_pham_lien_quan", "nang_luc_mo_ta",
              "bang_chung_nang_luc"}
TRUONG_DON_VI_CU = {"nang_luc_mo_ta_2", "bang_chung_nang_luc"}
KHOA = ["nhu_cau", "entity", "field", "value", "evidence_span", "extraction", "tier_de_xuat",
        "snapshot", "url", "ly_do"]
# QD 21/2026: san pham chien luoc -> nhom cong nghe. Doc tu bang anh Lam da duyet ma may ghep
# dung, khong chep lai o day: mot ban sao bang la mot ban sao se lac.
MAPPING = HERE.parents[1] / "CaoLocMatch" / "domains" / "cncl_match" / "mapping_sp_nhom.yaml"
NHOM_CUA_SP = {}
TU_TOI_THUONG = ("duy nhất", "đầu tiên", "hàng đầu", "lớn nhất", "số 1", "tiên phong", "dẫn đầu",
                 "đi đầu", "bậc nhất")
HANG = {"A": 3, "B": 2, "C": 1}
NHAN_CHUAN_HOA = "CHUAN HOA CO CHU DICH:"


def thoat3(m):
    print(f"KHONG CHAY DUOC: {m}")
    sys.exit(3)


def chuan(s):
    s = unicodedata.normalize("NFC", s or "").replace("﻿", "")
    return re.sub(r"\s+", " ", s).strip()


def mien(url):
    h = urlparse(url or "").netloc.lower()
    return h[4:] if h.startswith("www.") else h


def hang_theo_luat(url, trang_don_vi):
    h = mien(url)
    if h.endswith(".gov.vn") or h == "baochinhphu.vn":
        return "A"
    if h in trang_don_vi:
        return "C"
    return "B"


def tat_ca():
    """Chuoi cong goi dang nay: kiem MOI dot_* dang nam cho duyet. Khong co dot nao la sach."""
    dots = sorted(p for p in HERE.glob("dot_*") if p.is_dir() and not (p / "da_nap.json").exists())
    if not dots:
        print("OK: khong co lo nao dang cho duyet.")
        return 0
    ma = 0
    for d in dots:
        import subprocess
        r = subprocess.run([sys.executable, __file__, str(d)], capture_output=True, text=True)
        print((r.stdout + r.stderr).strip())
        ma = max(ma, r.returncode)
    return ma


def main():
    if len(sys.argv) < 2:
        thoat3("thieu <thu_muc_dot>")
    if sys.argv[1] == "--tat-ca":
        sys.exit(tat_ca())
    DOT = Path(sys.argv[1]).resolve()
    reg_path = Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else REGISTRY
    if not DOT.is_dir():
        thoat3(f"khong thay {DOT}")
    if not reg_path.exists():
        thoat3(f"khong thay registry {reg_path}")
    files = sorted(glob.glob(str(DOT / "de_xuat_*.jsonl")))
    if not files:
        thoat3(f"khong co de_xuat_*.jsonl trong {DOT}")

    try:
        import yaml
        mp = yaml.safe_load(MAPPING.read_text(encoding="utf-8"))["san_pham"]
        NHOM_CUA_SP.update({int(k.split("-P")[1]): int(v["nhom"]) for k, v in mp.items()})
    except Exception as e:
        thoat3(f"khong doc duoc bang san pham -> nhom {MAPPING}: {e}")
    if len(NHOM_CUA_SP) != 30:
        thoat3(f"bang san pham -> nhom co {len(NHOM_CUA_SP)} dong, can 30")
    reg = [json.loads(l) for l in reg_path.read_text(encoding="utf-8").splitlines() if l.strip()]
    don_vi_cu = {c["entity"] for c in reg}
    mien_cu = {mien((c.get("capture") or {}).get("url")) for c in reg}
    span_cu = {(c["entity"], c["field"], chuan(c.get("evidence_span"))) for c in reg}
    o_cu = {}
    for c in reg:
        o_cu.setdefault((c["entity"], c["field"]), set()).add(chuan(c.get("value")))

    dong = []
    for f in files:
        for n, l in enumerate(Path(f).read_text(encoding="utf-8").splitlines(), 1):
            if not l.strip():
                continue
            try:
                r = json.loads(l)
            except json.JSONDecodeError as e:
                thoat3(f"{Path(f).name}:{n} khong phai JSON ({e})")
            r["_nguon"] = f"{Path(f).name}:{n}"
            dong.append(r)

    # Trang cua chinh don vi: ten mien chi xuat hien o de xuat hang C ma agent tu khai. Luat: mot
    # ten mien khong phai .gov.vn, khong phai bao da dung trong registry, va agent ghi hang C.
    trang_don_vi = {mien(r.get("url")) for r in dong if r.get("tier_de_xuat") == "C"
                    and not mien(r.get("url")).endswith(".gov.vn") and mien(r.get("url")) not in mien_cu}

    vi, chup_cache = [], {}
    for r in dong:
        tag = f"{r['_nguon']} {r.get('entity')}/{r.get('field')}"
        thieu = [k for k in KHOA if not r.get(k)]
        if thieu:
            vi.append(f"THIEU_KHOA: {tag} thieu {', '.join(thieu)}")
            continue
        fld, ext, span, val = r["field"], r["extraction"], r["evidence_span"], r["value"]
        if fld not in TRUONG_CHO_PHEP:
            vi.append(f"TRUONG_LA: {tag}")
        if not (20 <= len(span) <= 600):
            vi.append(f"SPAN_DO_DAI: {tag} {len(span)} ky tu")
        p = DOT / "snapshots" / r["snapshot"]
        if r["snapshot"] not in chup_cache:
            chup_cache[r["snapshot"]] = p.read_text(encoding="utf-8") if p.exists() else None
        chup = chup_cache[r["snapshot"]]
        if chup is None:
            vi.append(f"CHUP_THIEU: {tag} khong co {r['snapshot']}")
        else:
            dau = "\n".join(chup.splitlines()[:6])
            if r["url"] not in dau:
                vi.append(f"CHUP_THIEU: {tag} dau ban chup {r['snapshot']} khong ghi URL cua dong")
            if chuan(span) not in chuan(chup):
                vi.append(f"SPAN_KHONG_CHUP: {tag} span khong nam trong {r['snapshot']}")
        if ext == "verbatim":
            if chuan(val) not in chuan(span):
                vi.append(f"VALUE_KHONG_SPAN: {tag}")
        elif ext == "normalized":
            if not str(r.get("note", "")).startswith(NHAN_CHUAN_HOA):
                vi.append(f"CHUAN_HOA_KHONG_KHAI: {tag}")
        else:
            vi.append(f"GIA_TRI_SAI: {tag} extraction '{ext}'")
        m = re.fullmatch(r"P(\d{2})", r["nhu_cau"])
        sp = int(m.group(1)) if m else None
        if sp is None or sp not in NHOM_CUA_SP:
            vi.append(f"GIA_TRI_SAI: {tag} nhu_cau '{r['nhu_cau']}'")
        if fld == "loai_hinh" and val not in ("DN", "vien", "truong"):
            vi.append(f"GIA_TRI_SAI: {tag} loai_hinh '{val}'")
        if fld == "nhom_cncl":
            if not (val.isdigit() and 1 <= int(val) <= 10):
                vi.append(f"GIA_TRI_SAI: {tag} nhom_cncl '{val}'")
            elif sp in NHOM_CUA_SP and int(val) != NHOM_CUA_SP[sp]:
                vi.append(f"NHOM_LECH: {tag} nhom {val}, nhu cau {r['nhu_cau']} thuoc nhom {NHOM_CUA_SP[sp]}")
        if fld == "san_pham_lien_quan" and not (val.isdigit() and int(val) == sp):
            vi.append(f"GIA_TRI_SAI: {tag} san_pham_lien_quan '{val}' khac nhu cau {r['nhu_cau']}")
        luat = hang_theo_luat(r["url"], trang_don_vi)
        if HANG.get(r["tier_de_xuat"], 9) > HANG[luat]:
            vi.append(f"HANG_CAO_HON_LUAT: {tag} de xuat {r['tier_de_xuat']}, luat {luat} ({mien(r['url'])})")
        for k in ("ly_do", "note"):
            if chr(0x2014) in str(r.get(k, "")):
                vi.append(f"EM_DASH: {tag} trong {k}")
        if r["entity"] in don_vi_cu and fld not in TRUONG_DON_VI_CU:
            vi.append(f"DON_VI_CU_SAI_TRUONG: {tag} don vi da co, chi duoc de xuat {sorted(TRUONG_DON_VI_CU)}")
        if (r["entity"], fld, chuan(span)) in span_cu:
            vi.append(f"TRUNG_REGISTRY: {tag}")
        da_co = o_cu.get((r["entity"], fld), set())
        if da_co and chuan(val) not in da_co:
            vi.append(f"O_DA_CO_GIA_TRI: {tag} registry da co gia tri khac, nap them se thanh tranh chap")
        co = []
        if mien(r["url"]) not in mien_cu:
            co.append("NGUON_MOI")
        if any(t in span.lower() for t in TU_TOI_THUONG):
            co.append("TOI_THUONG")
        if r["tier_de_xuat"] == "C":
            co.append("TU_KHAI")
        nb = r.get("ngay_bai")
        if not nb:
            co.append("KHONG_RO_NGAY")
        elif nb[:4] < "2020":
            co.append("NGUON_CU")
        r["_co"], r["_hang_luat"] = co, luat

    don_vi, o_lo = {}, {}
    for r in dong:
        don_vi.setdefault(r["entity"], []).append(r)
        o_lo.setdefault((r.get("entity"), r.get("field")), set()).add(chuan(r.get("value")))
    for (e, fld), vs in sorted(o_lo.items(), key=lambda x: str(x[0])):
        if len(vs) > 1:
            vi.append(f"O_TRUNG_TRONG_LO: {e}/{fld} co {len(vs)} gia tri khac nhau trong lo")
    for e, rs in don_vi.items():
        if e not in don_vi_cu:
            thieu = SAU_TRUONG - {r["field"] for r in rs}
            if thieu:
                vi.append(f"DON_VI_THIEU: {e} thieu {', '.join(sorted(thieu))}")

    null = []
    for f in sorted(glob.glob(str(DOT / "honest_null_*.jsonl"))):
        null += [json.loads(l) for l in Path(f).read_text(encoding="utf-8").splitlines() if l.strip()]

    moi = sorted(e for e in don_vi if e not in don_vi_cu)
    cu = sorted(e for e in don_vi if e in don_vi_cu)
    nc = sorted({r["nhu_cau"] for r in dong})
    lo = {"dot": DOT.name, "so_dong": len(dong), "don_vi_moi": moi, "don_vi_cu": cu, "nhu_cau": nc,
          "honest_null": null,
          "dong": [{k: v for k, v in r.items() if k != "_nguon"} | {"nguon_file": r["_nguon"]} for r in dong]}
    (DOT / "lo.json").write_text(json.dumps(lo, ensure_ascii=False, indent=1), encoding="utf-8")
    dem_co = {}
    for r in dong:
        for c in r.get("_co", []):
            dem_co[c] = dem_co.get(c, 0) + 1
    print(f"LO {DOT.name}: {len(dong)} de xuat · {len(moi)} don vi moi · {len(cu)} don vi da co · "
          f"{len(nc)} nhu cau · {len(null)} honest-null · co {dem_co}")
    if vi:
        print(f"\nFAIL: {len(vi)} vi pham")
        for v in vi[:60]:
            print("  " + v)
        sys.exit(2)
    print("\nOK: moi de xuat nguyen van trong ban chup, dung truong, dung hang, don vi moi du sau truong.")


if __name__ == "__main__":
    main()
