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
import json, os, sys, unicodedata, html
from pathlib import Path

SUP = Path("/sessions/exciting-busy-clarke/mnt/CNCLData/domains/don_vi_cncl")
DEM = Path("/sessions/exciting-busy-clarke/mnt/KnowledgeBase/Dataset_CongNgheChienLuoc")
DST = Path(__file__).parent / "domains" / "cncl_match"


def norm(s):
    return unicodedata.normalize("NFC", html.unescape(s or ""))


def read_jsonl(p):
    return [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]


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
                     "tier": name_claim["tier"], "capture": name_claim["capture"]})
        rows.append({"entity": ent, "field": "entity_type", "value": "cung",
                     "evidence_span": name_claim["evidence_span"], "extraction": "normalized",
                     "tier": name_claim["tier"], "capture": name_claim["capture"],
                     "note": "Phan loai ben CUNG do domain dan xuat gan, khong phai trich tu nguon."})
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
                         "tier": c["tier"], "capture": c["capture"]})
        for fname, cs in sorted(fields.items()):
            if not fname.startswith("nhom_cncl_phu_"):
                continue
            n = fname.rsplit("_", 1)[-1]
            for c in cs:
                rows.append({"entity": ent, "field": f"nhom_phu_{n}", "value": c["value"],
                             "evidence_span": c["evidence_span"], "extraction": c["extraction"],
                             "tier": c["tier"], "capture": c["capture"]})
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
                     "tier": c.get("tier", "A"), "capture": cap})
        rows.append({"entity": ent, "field": "entity_type", "value": "cau",
                     "evidence_span": c["evidence_span"], "extraction": "normalized",
                     "tier": c.get("tier", "A"), "capture": cap,
                     "note": "Phan loai ben CAU do domain dan xuat gan, khong phai trich tu nguon."})
        rows.append({"entity": ent, "field": "need", "value": c["value"],
                     "evidence_span": c["evidence_span"], "extraction": c.get("extraction", "verbatim"),
                     "tier": c.get("tier", "A"), "capture": cap,
                     "note": f"Nhu cau quoc gia theo QD 21/2026, claim goc {c['id']}."})

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
