#!/usr/bin/env python3
"""build_cncl_match.py · Dung domain dan xuat cncl_match tu hai registry da qua cong.

CUNG · /Users/os/CNCLData/domains/don_vi_cncl   (schema: entity/field/value/evidence_span/capture)
CAU  · KnowledgeBase/Dataset_CongNgheChienLuoc  (schema phang: id/field/value/evidence_span/snapshot)

Nguyen tac (theo 10_PRE_REG_SELF.md muc 4):
  · KHONG sua claim goc. Chi doc, anh xa, ghi ra domain dan xuat.
  · Span giu NGUYEN VAN, khong cat khong noi. Snapshot copy nguyen van.
  · Script tat dinh: cung dau vao cho cung dau ra, sap xep on dinh.
  · Chay lai duoc: ghi de claims.jsonl cua domain dan xuat.

Anh xa:
  CUNG: moi don vi co nang_luc_mo_ta -> fact `capability`. Kem entity_name, entity_type=cung,
        location neu co. Bo qua don vi khong co nang_luc_mo_ta (honest-null, khong bia).
  CAU : moi claim ten_san_pham cua danh muc hien hanh -> fact `need`. entity_type=cau.
        Uu tien ban -A (wording chinh thuc baochinhphu) khi co ca hai.

Exit 0 neu ghi xong. Exit 2 neu phat hien span khong con nam trong snapshot dich (fail-loud).
"""
import json, os, shutil, sys, unicodedata, html
from pathlib import Path

def goc(*duoi):
    """Tra ve duong dan that, chay duoc o CA HAI moi truong.

    VI SAO: cung mot dia nhung hai goc khac nhau. Claude Code tren may thay /Users/os/...,
    con moi truong bash trong Cowork thay /sessions/<phien>/mnt/... Duong dan cung theo mot
    goc thi moi truong kia chay la gay, va gay o cho kho doan vi loi hien ra la
    "thieu ban chup" chu khong phai "sai duong dan".

    Khong co goc nao ton tai thi BAO NGAY luc nap, khong de den luc doc file moi vo.
    """
    for g in (Path("/Users/os"), Path("/sessions/exciting-busy-clarke/mnt")):
        p = g.joinpath(*duoi)
        if p.exists():
            return p
    raise SystemExit(f"KHONG THAY {'/'.join(duoi)} o ca hai goc (/Users/os va /sessions/.../mnt). "
                     f"Kiem tra dang chay o moi truong nao.")


SUP = goc("CNCLData", "domains", "don_vi_cncl")
DEM = goc("RtR", "KnowledgeBase", "Dataset_CongNgheChienLuoc") if Path("/Users/os/RtR").exists() \
    else goc("KnowledgeBase", "Dataset_CongNgheChienLuoc")
DST = Path(__file__).parent / "domains" / "cncl_match"


def norm(s):
    return unicodedata.normalize("NFC", html.unescape(s or ""))


def read_jsonl(p):
    return [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]


def dong_bo_snapshot(rows):
    """Chep ban chup tu hai mien GOC sang mien dan xuat, va noi ro cai gi doi.

    VI SAO CO HAM NAY (16/08/2026): hai vong lien tiep vap cung mot bay. Sua ban chup ben
    CNCLData xong, chay build o day thi no doc ban chup CU trong domains/cncl_match/snapshots
    va bao hang loat SPAN_LOST. Khong hong du lieu vi cong chan dung, nhung thu phai nho hai
    lan thi thuoc loai phai tu dong hoa, khong phai loai ghi vao tai lieu roi mong minh nho.

    HAI LUAT, deu la de KHONG lam ro ri:
      1. Ban chup goc THIEU thi FAIL, khong duoc lang le xai ban cu con nam trong mien dan
         xuat. Thieu dieu kien ma he van chay tiep thi cho suy bien do chinh la duong ro.
      2. Moi lan chep de deu IN TEN FILE. Dong bo im lang lam mat dau vet mot su that quan
         trong: ban chup vua doi chu, tuc moi thu tua vao no can duoc nhin lai.
    """
    can = sorted({r["capture"]["snapshot"] for r in rows})
    dich = DST / "snapshots"
    dich.mkdir(parents=True, exist_ok=True)
    them, doi, thieu = [], [], []
    for ten in can:
        goc = next((p for p in (SUP / "snapshots" / ten, DEM / "snapshots" / ten) if p.exists()), None)
        if goc is None:
            thieu.append(ten)
            continue
        d = dich / ten
        if not d.exists():
            shutil.copy2(goc, d)
            them.append(ten)
        elif goc.read_bytes() != d.read_bytes():
            shutil.copy2(goc, d)
            doi.append(ten)
    print(f"SNAPSHOT: {len(can)} can · them {len(them)} · cap nhat {len(doi)} · thieu {len(thieu)}")
    for t in them:
        print(f"  [THEM]     {t}")
    for t in doi:
        print(f"  [CAP NHAT] {t}  (ban chup goc da doi chu, moi thu tua vao no can nhin lai)")
    for t in thieu:
        print(f"  [THIEU]    {t}  KHONG co o ca hai mien goc")
    if thieu:
        print(f"FAIL: {len(thieu)} ban chup khong co ban goc. Khong xai ban cu de chay tiep.")
        return 2
    return 0


def main():
    rows = []

    # ---------- CUNG ----------
    sup = read_jsonl(SUP / "claims.jsonl")
    by_ent = {}
    for c in sup:
        by_ent.setdefault(c["entity"], {}).setdefault(c["field"], []).append(c)

    for ent in sorted(by_ent):
        fields = by_ent[ent]
        caps = fields.get("nang_luc_mo_ta")
        if not caps:
            continue  # honest-null: don vi chua co mo ta nang luc thi khong dung ra fact
        name_claim = (fields.get("ten_don_vi") or caps)[0]
        rows.append({"entity": ent, "field": "entity_name", "value": ent,
                     "evidence_span": name_claim["evidence_span"], "extraction": "normalized",
                     "tier": name_claim["tier"], "capture": name_claim["capture"],
                     "note": "Ten thuc the lay tu khoa entity cua registry CUNG da qua cong, khong phai trich moi tu span."})
        rows.append({"entity": ent, "field": "entity_type", "value": "cung",
                     "evidence_span": name_claim["evidence_span"], "extraction": "normalized",
                     "tier": name_claim["tier"], "capture": name_claim["capture"],
                     "note": "Phan loai ben CUNG do domain dan xuat gan, khong phai trich tu nguon."})
        # HOAN NGUYEN 16/08/2026: TIP-CNCL-3G da THU tach nang luc ghep o dau cham phay va
        # THAT BAI (bao cao reports/TACH_NANG_LUC_verify.md). Ket qua: cap dang rung thi con
        # (Vien Han lam x thiet bi dien cao ap, khop qua tu chung chung "dien/hieu/suat/cao"),
        # cap dang con thi rung (Vien Han lam x pin). KHONG thu lai huong nay.
        for c in caps:
            rows.append({"entity": ent, "field": "capability", "value": c["value"],
                         "evidence_span": c["evidence_span"], "extraction": c["extraction"],
                         "tier": c["tier"], "capture": c["capture"],
                         **({"note": c["note"]} if "note" in c else {}),
                         **({"favors": c["favors"]} if "favors" in c else {})})
        for c in fields.get("nang_luc_mo_ta_2", []):
            rows.append({"entity": ent, "field": "capability_2", "value": c["value"],
                         "evidence_span": c["evidence_span"], "extraction": c["extraction"],
                         "tier": c["tier"], "capture": c["capture"],
                         **({"note": c["note"]} if "note" in c else {})})
        for c in fields.get("nhom_cncl", []):
            rows.append({"entity": ent, "field": "nhom", "value": c["value"],
                         "evidence_span": c["evidence_span"], "extraction": c["extraction"],
                         "tier": c["tier"], "capture": c["capture"],
                         "note": c.get("note") or "Anh xa nhom ke thua tu claim nhom_cncl cua registry CUNG da qua cong."})
        for fname, cs in sorted(fields.items()):
            if not fname.startswith("nhom_cncl_phu_"):
                continue
            n = fname.rsplit("_", 1)[-1]
            for c in cs:
                rows.append({"entity": ent, "field": f"nhom_phu_{n}", "value": c["value"],
                             "evidence_span": c["evidence_span"], "extraction": c["extraction"],
                             "tier": c["tier"], "capture": c["capture"],
                             "note": c.get("note") or "Nhom phu ke thua tu registry CUNG da qua cong."})
        # NEN SAN PHAM (TIP-2F Phan B) -> lop neo san pham cua rule v4 (TIP-3H).
        for c in fields.get("san_pham_lien_quan", []):
            rows.append({"entity": ent, "field": "san_pham", "value": c["value"],
                         "evidence_span": c["evidence_span"], "extraction": c["extraction"],
                         "tier": c["tier"], "capture": c["capture"],
                         "note": c.get("note") or "Ma san pham ke thua tu registry CUNG da qua cong."})
        for fname, cs in sorted(fields.items()):
            if not fname.startswith("san_pham_phu_"):
                continue
            for c in cs:
                rows.append({"entity": ent, "field": fname.replace("san_pham_phu_", "san_pham_phu_"),
                             "value": c["value"], "evidence_span": c["evidence_span"],
                             "extraction": c["extraction"], "tier": c["tier"], "capture": c["capture"],
                             "note": c.get("note") or "San pham phu ke thua tu registry CUNG."})
        for c in fields.get("location", []):
            rows.append({"entity": ent, "field": "location", "value": c["value"],
                         "evidence_span": c["evidence_span"], "extraction": c["extraction"],
                         "tier": c["tier"], "capture": c["capture"]})

    # ---------- CAU ----------
    dem = read_jsonl(DEM / "claims.jsonl")
    prods = {}
    for c in dem:
        if c.get("field") != "ten_san_pham":
            continue
        base = c["id"].replace("-A", "")
        official = c["id"].endswith("-A")
        if base not in prods or official:
            prods[base] = c

    for base in sorted(prods):
        c = prods[base]
        ent = f"{base} · nhu cầu quốc gia"
        cap = {"url": c.get("url", "https://baochinhphu.vn"), "fetched_at": c.get("fetched_at", "2026-07-18T00:00:00Z"),
               "snapshot": c["snapshot"], "source": c.get("source", "baochinhphu.vn")}
        rows.append({"entity": ent, "field": "entity_name", "value": ent,
                     "evidence_span": c["evidence_span"], "extraction": "normalized",
                     "tier": c.get("tier", "A"), "capture": cap,
                     "note": f"Ten thuc the ben CAU do domain dan xuat dat theo ma san pham {c['id']}, khong phai trich tu nguon."})
        rows.append({"entity": ent, "field": "entity_type", "value": "cau",
                     "evidence_span": c["evidence_span"], "extraction": "normalized",
                     "tier": c.get("tier", "A"), "capture": cap,
                     "note": "Phan loai ben CAU do domain dan xuat gan, khong phai trich tu nguon."})
        # TACH NHU CAU GHEP (TIP-CNCL-3C). Chi tach o dau CHAM PHAY, la ky hieu liet ke
        # tuong minh cua chinh van ban goc. KHONG tach o dau phay va KHONG tach o chu "va",
        # vi hai thu do thuong noi cac thanh phan cua cung mot khai niem.
        # Moi manh phai la chuoi con NGUYEN VAN cua span goc; cong tu kiem ben duoi chan neu sai.
        parts = [x.strip() for x in str(c["value"]).split(";") if x.strip()]
        for i, part in enumerate(parts):
            fname = "need" if i == 0 else f"need_{i + 1}"
            note = f"Nhu cau quoc gia theo QD 21/2026, claim goc {c['id']}."
            if len(parts) > 1:
                note += f" Manh {i + 1}/{len(parts)} cua nhu cau ghep, tach o dau cham phay cua ban goc."
            rows.append({"entity": ent, "field": fname, "value": part,
                         "evidence_span": c["evidence_span"], "extraction": c.get("extraction", "verbatim"),
                         "tier": c.get("tier", "A"), "capture": cap, "note": note})

    # ---------- dong bo ban chup truoc khi kiem ----------
    if dong_bo_snapshot(rows) != 0:
        return 2

    # ---------- cong tu kiem truoc khi ghi ----------
    cache, bad = {}, 0
    for r in rows:
        snap = r["capture"]["snapshot"]
        p = DST / "snapshots" / snap
        if not p.exists():
            print(f"MISSING_SNAPSHOT: {snap} (entity={r['entity']})")
            bad += 1
            continue
        txt = cache.setdefault(snap, norm(p.read_text(encoding="utf-8", errors="replace")))
        if r["field"].startswith(("need", "capability")) and r["extraction"] == "verbatim" \
                and norm(str(r["value"])) not in norm(r["evidence_span"]):
            print(f"PART_NOT_VERBATIM: {r['entity']} / {r['field']} khong la chuoi con cua span goc")
            bad += 1
        if norm(r["evidence_span"]) not in txt:
            print(f"SPAN_LOST: {r['entity']} / {r['field']} khong con trong {snap}")
            bad += 1
    if bad:
        print(f"FAIL: {bad} loi truoc khi ghi. Khong ghi gi ca.")
        return 2

    out = DST / "claims.jsonl"
    with out.open("w", encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r, ensure_ascii=False) + "\n")

    ents = {r["entity"] for r in rows}
    cung = {r["entity"] for r in rows if r["field"] == "capability"}
    cau = {r["entity"] for r in rows if r["field"] == "need"}
    print(f"OK: {len(rows)} claim · {len(ents)} entity · CUNG {len(cung)} · CAU {len(cau)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
