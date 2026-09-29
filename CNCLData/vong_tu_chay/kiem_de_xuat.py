#!/usr/bin/env python3
"""kiem_de_xuat.py · Buoc 4 cua vong tu chay: CONG quyet de xuat nao vao hang cho.

Agent doc bai va ghi <luot>/de_xuat.jsonl. Script nay, tat dinh va khong mang, kiem tung de
xuat roi ghi:

    hang_cho.jsonl   de xuat qua cong, trang_thai "cho_nguoi"
    loai.jsonl       de xuat truot cong, kem MA LY DO
    nhat_ky.jsonl    MOT dong cho moi luot: dem, van tay tung bai, ket qua
    da_xem.jsonl     moi URL da xet trong luot, de mai khong xet lai

KHONG BAO GIO GHI claims.jsonl. Script chi DOC registry de chong trung. Dua mot de xuat vao
registry la viec cua nguoi; rang bite_hang_cho.py kiem bat bien nay bang van tay file.

Moi de xuat phai co: entity, field, value, evidence_span, extraction, url, ly_do.
tier KHONG nhan tu agent: lay tu bang NGUON trong vtc_chung.py.

MA LY DO LOAI (mot de xuat co the dinh nhieu):
  THIEU_TRUONG            thieu mot trong bay truong bat buoc
  NGUON_NGOAI_DANH_SACH   url khong thuoc nguon nao trong NGUON
  KHONG_CO_BAI            khong tim thay ban tai cua url nay trong <luot>/bai/
  SPAN_KHONG_NGUYEN_VAN   evidence_span khong co nguyen van trong ban tai (chi gop khoang trang)
  SPAN_DO_DAI             span ngan hon 20 hoac dai hon 600 ky tu
  TRUONG_KHONG_DUOC_PHEP  field ngoai TRUONG_DUOC_PHEP (vd ma_so_thue)
  EXTRACTION_LA           extraction khac verbatim / normalized
  VALUE_VUOT_SPAN         verbatim ma value khong nam trong span; hoac normalized them tu
                          khong co trong span ma khong khai "CHUAN HOA CO CHU DICH:"
  TRUNG_REGISTRY          cung don vi + truong da co claim cung value, hoac cung span
  TRUNG_HANG_CHO          da co trong hang cho tu luot truoc

CO (khong loai, chi bao nguoi duyet): don_vi_moi, favors_rtr, toi_thuong, suy_phan_loai.

Chay: python3 kiem_de_xuat.py <thu_muc_luot> [--goc <dir>]
Exit 0 da nap luot · 2 luot hong (vd de_xuat.jsonl khong doc duoc) · 3 KHONG CHAY DUOC
(thieu registry, luot da nap roi, khong co ban tai nao).
"""
import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from vtc_chung import (DAU_HIEU_RTR, NGUON, NHAN_CHUAN_HOA, SPAN_TOI_DA, SPAN_TOI_THIEU,  # noqa: E402
                       TRUONG_DUOC_PHEP, TRUONG_PHAN_LOAI, TRUONG_VAN, TU_TOI_THUONG, cac_tu,
                       chuan, doc_jsonl, duong, ghi_them, goc_mac_dinh, ma_de_xuat, ngay_tu_url,
                       sha, url_cua_bai)

BAT_BUOC = ("entity", "field", "value", "evidence_span", "extraction", "url", "ly_do")


def kiem(dx, bai_theo_url, claims, hang_cho_ids):
    ly_do, co = [], []
    thieu = [k for k in BAT_BUOC if not str(dx.get(k) or "").strip()]
    if thieu:
        return ["THIEU_TRUONG:" + ",".join(thieu)], co, None
    url = dx["url"].strip()
    nguon, ngay = ngay_tu_url(url)
    if nguon is None:
        ly_do.append("NGUON_NGOAI_DANH_SACH")
    bai = bai_theo_url.get(url)
    if bai is None:
        ly_do.append("KHONG_CO_BAI")
    span, value = dx["evidence_span"], str(dx["value"])
    if bai is not None and chuan(span) not in chuan(bai["txt"]):
        ly_do.append("SPAN_KHONG_NGUYEN_VAN")
    if not (SPAN_TOI_THIEU <= len(chuan(span)) <= SPAN_TOI_DA):
        ly_do.append("SPAN_DO_DAI")
    if dx["field"] not in TRUONG_DUOC_PHEP:
        ly_do.append("TRUONG_KHONG_DUOC_PHEP")
    ex = dx["extraction"]
    if ex not in ("verbatim", "normalized"):
        ly_do.append("EXTRACTION_LA")
    elif dx["field"] in TRUONG_VAN:
        if ex == "verbatim" and chuan(value) not in chuan(span):
            ly_do.append("VALUE_VUOT_SPAN")
        if ex == "normalized":
            them = set(cac_tu(value)) - set(cac_tu(span))
            if them and NHAN_CHUAN_HOA not in (dx.get("note") or ""):
                ly_do.append("VALUE_VUOT_SPAN")
    if dx["field"] in TRUONG_PHAN_LOAI:
        co.append("suy_phan_loai")

    ent = dx["entity"].strip()
    cua_dv = [c for c in claims if c["entity"] == ent]
    if not cua_dv:
        co.append("don_vi_moi")
    for c in cua_dv:
        if c["field"] == dx["field"] and chuan(str(c["value"])).lower() == chuan(value).lower():
            ly_do.append("TRUNG_REGISTRY")
            break
        if chuan(c.get("evidence_span", "")) == chuan(span):
            ly_do.append("TRUNG_REGISTRY")
            break
    ma = ma_de_xuat(ent, dx["field"], value, span, url)
    if ma in hang_cho_ids:
        ly_do.append("TRUNG_HANG_CHO")
    if any(d in ent.lower() for d in DAU_HIEU_RTR):
        co.append("favors_rtr")
    if any(t in (span + " " + value).lower() for t in TU_TOI_THUONG):
        co.append("toi_thuong")

    ban_ghi = {
        "id": ma, "trang_thai": "cho_nguoi",
        "loai": "don_vi_moi" if "don_vi_moi" in co else "cap_nhat",
        "entity": ent, "field": dx["field"], "value": value, "evidence_span": span,
        "extraction": ex, "tier": NGUON[nguon]["tier"] if nguon else None,
        "capture": {"url": url, "source": nguon,
                    "snapshot": bai["duong_tuong_doi"] if bai else None,
                    "sha256": bai["sha256"] if bai else None},
        "ngay_bai": ngay.isoformat() if ngay else None,
        "co": sorted(set(co)), "ly_do_agent": dx["ly_do"],
    }
    if dx.get("note"):
        ban_ghi["note"] = dx["note"]
    return ly_do, sorted(set(co)), ban_ghi


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("luot")
    ap.add_argument("--goc", default=str(goc_mac_dinh()))
    a = ap.parse_args()
    D = duong(a.goc)
    luot = Path(a.luot).resolve()
    ten_luot = luot.name

    claims = doc_jsonl(D["claims"])
    if not claims:
        print(f"KHONG CHAY DUOC: khong doc duoc registry {D['claims']}.")
        return 3
    if any(n.get("luot") == ten_luot for n in doc_jsonl(D["nhat_ky"])):
        print(f"KHONG CHAY DUOC: luot {ten_luot} DA NAP. Nap lai se nhan doi hang cho.")
        print("Muon lam lai thi tao luot moi; khong sua nhat_ky.jsonl bang tay.")
        return 3

    # Ban tai: moi file <luot>/bai/*.md la NGUYEN VAN mot lan web_fetch.
    bai_theo_url, van_tay = {}, []
    for f in sorted((luot / "bai").glob("*.md")):
        txt = f.read_text(encoding="utf-8")
        url = url_cua_bai(txt)
        if not url:
            print(f"KHONG CHAY DUOC: {f.name} khong co dong URL o dau. Khong phai ban web_fetch nguyen van.")
            return 3
        rel = f.relative_to(D["goc"] / "CNCLData").as_posix() if D["goc"] in f.parents else str(f)
        bai_theo_url[url] = {"txt": txt, "sha256": sha(f), "duong_tuong_doi": rel}
        van_tay.append({"url": url, "file": f.name, "sha256": sha(f)})

    bcd_p = luot / "bai_can_doc.json"
    bcd = json.loads(bcd_p.read_text(encoding="utf-8")) if bcd_p.exists() else None
    if bcd is None:
        print(f"KHONG CHAY DUOC: thieu {bcd_p}. Phai chay tim_bai.py truoc.")
        return 3
    thieu_bai = [u for u in bcd["chon_doc"] if u not in bai_theo_url]

    dx_p = luot / "de_xuat.jsonl"
    try:
        de_xuat = doc_jsonl(dx_p)
    except json.JSONDecodeError as e:
        print(f"LUOT HONG: de_xuat.jsonl khong doc duoc ({e}). Khong nap gi.")
        return 2

    hang_cho_ids = {h["id"] for h in doc_jsonl(D["hang_cho"])}
    nhan, loai = [], []
    for i, dx in enumerate(de_xuat, 1):
        ly_do, co, bg = kiem(dx, bai_theo_url, claims, hang_cho_ids)
        if ly_do:
            loai.append({"luot": ten_luot, "stt": i, "ly_do": ly_do, "co": co, "de_xuat": dx})
        else:
            bg["luot"] = ten_luot
            nhan.append(bg)
            hang_cho_ids.add(bg["id"])

    xet = [b["url"] for b in bcd["tat_ca"] if b["trang_thai"] != "da_xem"]
    nk = {"luot": ten_luot, "luc": datetime.now(timezone.utc).isoformat(timespec="seconds"),
          "so_bai_rut": bcd["so_bai_rut"], "so_ung_vien": bcd["so_ung_vien"],
          "so_chon_doc": len(bcd["chon_doc"]), "so_bai_tai": len(bai_theo_url),
          "chon_ma_khong_tai": thieu_bai, "so_de_xuat": len(de_xuat),
          "so_nhan": len(nhan), "so_loai": len(loai), "van_tay_bai": van_tay}

    ghi_them(D["hang_cho"], nhan)
    ghi_them(D["loai"], loai)
    ghi_them(D["da_xem"], [{"url": u, "luot": ten_luot} for u in xet])
    ghi_them(D["nhat_ky"], [nk])  # ghi CUOI: co dong nhat ky nghia la cac file tren da ghi xong

    print(f"KIEM DE XUAT {ten_luot}: bai tai {len(bai_theo_url)} · de xuat {len(de_xuat)} · "
          f"nhan {len(nhan)} · loai {len(loai)}")
    for h in nhan:
        print(f"  NHAN {h['id']} · {h['entity']} · {h['field']}" + (f" · co {','.join(h['co'])}" if h["co"] else ""))
    for l in loai:
        print(f"  LOAI #{l['stt']} · {l['de_xuat'].get('entity')} · {','.join(l['ly_do'])}")
    if thieu_bai:
        print(f"  CANH BAO: {len(thieu_bai)} bai da chon doc nhung khong co ban tai (fetch that bai?).")
    print("Khong claim nao duoc ghi vao registry. Hang cho doi nguoi duyet.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
