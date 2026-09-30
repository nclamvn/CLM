#!/usr/bin/env python3
"""pheu_matching.py · Phieu ghep: engine da loc bao nhieu cap, loai vi sao, cap nao suyt dat.

VI SAO CO (30/09/2026): man Matching chi cho thay 11 match da ky va 1 cap tu choi. Nguoi xem
khong thay duoc cong viec that cua engine: tu ~1.300 cap nhu cau x don vi, no loai bao nhieu cap
vi khac linh vuc, bao nhieu cap vi giao tu khong du, va vi sao chi con 12 ung vien trinh nguoi.
Phan "may da tu choi gi" moi la bang chung engine khong ghep bua.

LUAT:
  1. KHONG sua engine. Script nay doc out/facts.jsonl (do `match_engine.py run` ghi) va dung
     chinh cac ham cua engine (_tokens_v2, _sup_groups, load_mapping, OVERLAP_MIN_V2).
  2. DOI CHIEU VOI ENGINE, fail-loud: tap cap ung vien script dem duoc phai TRUNG KHOP tap cap
     ma `make_matches_v2` sinh ra. Lech la exit 2: phieu khong duoc noi khac engine.
  3. Tang cuoi (da ky / tu choi / cho ky) doc tu out/matches.jsonl va out/blocked_by_signoff.jsonl;
     dong matches.jsonl co chu ky 'pending-human-review' la CHO KY, khong phai da ky.
  4. Tat dinh: sap xep theo ty le giao giam dan roi theo ten (codepoint), khong ngau nhien.

Ra: out/pheu.json. Chay sau `match_engine.py run`.
Exit 0 · 2 lech engine · 3 KHONG CHAY DUOC (thieu out/facts.jsonl hoac mapping).
"""
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import match_engine as me  # noqa: E402

DOMAIN = HERE / "domains" / "cncl_match"
OUT = HERE / "out"


def thoat3(m):
    print(f"KHONG CHAY DUOC: {m}")
    sys.exit(3)


def doc_jsonl(p):
    return [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()] if p.exists() else []


def main():
    pf = OUT / "facts.jsonl"
    if not pf.exists():
        thoat3(f"thieu {pf}. Chay match_engine.py run domains/cncl_match truoc.")
    facts = {f["id"]: f for f in doc_jsonl(pf)}
    try:
        mapping = me.load_mapping(DOMAIN)
    except me.GateError as e:
        thoat3(str(e))
    sp_map = mapping.get("san_pham") or {}
    edges = mapping.get("canh_chuoi_gia_tri") or []

    needs = sorted([f for f in facts.values() if f["field"].startswith("need")], key=lambda f: f["id"])
    caps = sorted([f for f in facts.values() if f["field"].startswith("capability")], key=lambda f: f["id"])
    by_entity = {}
    for f in facts.values():
        by_entity.setdefault(f["entity"], []).append(f)

    e_cau = sorted({f["entity"] for f in needs})
    e_cung = sorted({f["entity"] for f in caps})

    # Theo tung CAP THUC THE (cau, cung): ghi tang xa nhat ma cap dat duoc.
    cap = {}
    khong_anh_xa = set()
    for nf in needs:
        sp_id = str(nf["entity"]).split(" ")[0]
        row = sp_map.get(sp_id)
        for cf in caps:
            if nf["entity"] == cf["entity"]:
                continue
            k = (nf["entity"], cf["entity"])
            r = cap.setdefault(k, {"neo": False, "qua_canh": False, "ty_le": 0.0, "giao": [], "can": [], "nhom_cau": None,
                                   "nhom_cung": [], "ty_le_ngoai_nhom": 0.0, "giao_ngoai_nhom": []})
            nt, ct = me._tokens_v2(nf["value"]), me._tokens_v2(cf["value"])
            ov = (len(nt & ct) / len(nt)) if nt else 0.0
            groups = me._sup_groups(by_entity, cf["entity"])
            r["nhom_cung"] = sorted(groups)
            if not row:
                khong_anh_xa.add(nf["entity"])
                continue
            nhom_cau = int(row["nhom"])
            r["nhom_cau"] = nhom_cau
            qua_canh = None
            if groups and nhom_cau not in groups:
                for e in edges:
                    if int(e["tu"]) in groups and int(e["den"]) == nhom_cau:
                        qua_canh = e
                        break
            neo = bool(groups) and (nhom_cau in groups or qua_canh is not None)
            if not neo:
                if ov > r["ty_le_ngoai_nhom"]:
                    r["ty_le_ngoai_nhom"], r["giao_ngoai_nhom"] = ov, sorted(nt & ct)
                continue
            r["neo"] = True
            r["qua_canh"] = r["qua_canh"] or qua_canh is not None
            if nt and ov > r["ty_le"]:
                r["ty_le"], r["giao"], r["can"] = ov, sorted(nt & ct), sorted(nt)

    nguong = me.OVERLAP_MIN_V2
    qua_neo = {k for k, r in cap.items() if r["neo"]}
    ung_vien = {k for k in qua_neo if cap[k]["ty_le"] >= nguong}

    # Doi chieu voi chinh engine (luat 2).
    engine = me.make_matches_v2({}, facts, "cncl_match", DOMAIN)
    tap_engine = {(m["demand"]["entity_id"], m["supply"]["entity_id"]) for m in engine}
    if tap_engine != ung_vien:
        print("FAIL: phieu lech engine")
        for k in sorted(tap_engine - ung_vien):
            print(f"  engine co, phieu khong: {k}")
        for k in sorted(ung_vien - tap_engine):
            print(f"  phieu co, engine khong: {k}")
        return 2

    # Them 30/09/2026: mo phong lo lam giau dot 01 lo ra phieu dem MOI dong matches.jsonl la "da ky".
    # Khi co ung vien moi chua ai quyet, dong do van nam trong matches.jsonl voi chu ky
    # "pending-human-review", va phieu ghi 24 ky trong khi chi co 11 chu ky that. Tach rieng.
    dong_match = doc_jsonl(OUT / "matches.jsonl")
    cho = [m for m in dong_match if ((m.get("gate") or {}).get("signoff") or {}).get("by") == "pending-human-review"]
    ky = [m for m in dong_match if m not in cho]
    tu_choi = doc_jsonl(OUT / "blocked_by_signoff.jsonl")
    if len(ky) + len(tu_choi) + len(cho) != len(ung_vien):
        print(f"FAIL: {len(ung_vien)} ung vien nhung {len(ky)} ky + {len(tu_choi)} tu choi + {len(cho)} cho ky")
        return 2

    ngan = lambda s: str(s).split(" ")[0].replace("CNCL-", "")  # noqa: E731
    ten_cau = {}
    for nf in needs:
        ten_cau.setdefault(nf["entity"], nf["value"])
    loai_lop1 = sorted(
        [{"cau": ngan(k[0]), "ten_cau": ten_cau.get(k[0], ""), "cung": k[1], "ty_le": round(r["ty_le_ngoai_nhom"], 2), "giao": r["giao_ngoai_nhom"],
          "nhom_cau": r["nhom_cau"], "nhom_cung": r["nhom_cung"]}
         for k, r in cap.items() if not r["neo"] and r["ty_le_ngoai_nhom"] >= nguong],
        key=lambda x: (-x["ty_le"], x["cau"], x["cung"]))
    suyt_dat = sorted(
        [{"cau": ngan(k[0]), "ten_cau": ten_cau.get(k[0], ""), "cung": k[1], "ty_le": round(r["ty_le"], 2), "giao": r["giao"],
          "thieu": [t for t in r["can"] if t not in r["giao"]], "nhom_cau": r["nhom_cau"]}
         for k, r in cap.items() if k in qua_neo and 0 < r["ty_le"] < nguong],
        key=lambda x: (-x["ty_le"], x["cau"], x["cung"]))

    ra = {
        "quy_tac": me.RULE_V2,
        "nguong_giao": nguong,
        "so_nhu_cau": len(e_cau),
        "so_don_vi_co_nang_luc": len(e_cung),
        "nhu_cau_chua_anh_xa": len(khong_anh_xa),
        "tang": [
            {"k": "kha_di", "n": len(cap)},
            {"k": "qua_neo_nhom", "n": len(qua_neo)},
            {"k": "qua_giao_tu", "n": len(ung_vien)},
            {"k": "da_ky", "n": len(ky)},
            {"k": "tu_choi", "n": len(tu_choi)},
            {"k": "cho_ky", "n": len(cho)},
        ],
        "neo_qua_chuoi_gia_tri": sum(1 for k in qua_neo if cap[k]["qua_canh"]),
        "loai_lop1": {"so": len(loai_lop1), "vi_du": loai_lop1[:6]},
        "suyt_dat": {"so": len(suyt_dat), "vi_du": suyt_dat[:8]},
    }
    (OUT / "pheu.json").write_text(json.dumps(ra, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    t = ra["tang"]
    print(f"PHEU: {t[0]['n']} kha di -> {t[1]['n']} qua neo nhom -> {t[2]['n']} qua giao tu -> "
          f"{t[3]['n']} ky / {t[4]['n']} tu choi / {t[5]['n']} cho ky · trung chu khac linh vuc bi loai {len(loai_lop1)} · suyt dat {len(suyt_dat)}")
    print("OK: phieu trung khop tap ung vien cua engine.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
