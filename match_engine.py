#!/usr/bin/env python3
"""match_engine.py · Match engine theo 04_SCHEMA_MATCH_PROVENANCE.md (ky 17/07/2026).

Hai dieu kien tien quyet da ky trong 04:
  1. Registry tra duoc fact_id -> {evidence_span, tier, snapshot_ref}: lop fact
     duoi day build truc tiep tu registry cua refinery, moi fact giu tron danh
     sach evidence (span + snapshot + url + fetched_at).
  2. Score tai lap: cung registry + cung ENGINE_VERSION cho ra cung score; doi
     rule la tang version, khong sua ngam. Toan bo build tat dinh (khong dung
     thoi gian he thong trong record: created_at = max fetched_at cua facts).

Lenh:
  python match_engine.py run <domain_dir>                 · build facts + matches, gate, ghi out/
  python match_engine.py validate <domain_dir> <matches>  · chay gate tren file match (bites, X-Ray)

Fail-loud: bat ky GateError nao -> in "GATE BITES · [GATE] ly do" va exit 2.
"""
import sys, json, hashlib, re
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent / "methodbox"))
import refinery  # noqa: E402  (engine 7 giai doan, da co bo rang rieng)

# RULE v2 (TIP-CNCL-3B, 16/08/2026). Rule v1 GIU NGUYEN ben duoi de doi chieu,
# chay bang co --rule-v1. Doi rule la tang version, dung dieu kien tien quyet so 2 ky o 04.
RULE_V1 = "overlay_capability_need_v1"
RULE_V2 = "anchor_group_overlap_v2"
RULE_V3 = "anchor_bigram_v3"
RULE_V4 = "anchor_product_v4"
VERSION_V1 = "cao-loc-match/0.1.0 rule=" + RULE_V1
VERSION_V2 = "cao-loc-match/0.2.0 rule=" + RULE_V2
VERSION_V3 = "cao-loc-match/0.3.0 rule=" + RULE_V3
VERSION_V4 = "cao-loc-match/0.4.0 rule=" + RULE_V4
# RULE VAN HANH = v2 (quyet dinh 16/08/2026 sau khi v3 truot tieu chi V2).
# v3 KHONG bi xoa: goi bang --rule-v3. Giu lai vi lan sau se co nguoi nghi den bigram
# va can thay ket qua nay thay vi thu lai tu dau. Xem reports/RULE_V3_verify.md.
# RULE VAN HANH = v4 tu 16/08/2026 (TIP-3H). v1, v2, v3 giu lai, goi bang co.
USE_V1 = "--rule-v1" in sys.argv
USE_V2 = "--rule-v2" in sys.argv
USE_V3 = "--rule-v3" in sys.argv
# RULE VAN HANH tro lai v2 sau khi v4 TRUOT 3/7 tieu chi (reports/NEO_SAN_PHAM_verify.md).
# v4 giu lai, goi bang --rule-v4. BA LOI DA BIET cua v4, doc bao cao truoc khi dung lai:
#  1. Coi san_pham_lien_quan (truong DON TRI) nhu danh sach day du -> giet cap chip Viettel.
#  2. Canh chuoi gia tri lam duong vong cho cap Lam DA TU CHOI (VNPT x P08 quay lai).
#  3. Nhanh don vi chua khai san pham khong gan nhan neo, de lai None trong rationale.
USE_V1 = "--rule-v1" in sys.argv
USE_V3 = "--rule-v3" in sys.argv
USE_V4 = "--rule-v4" in sys.argv
ENGINE_VERSION = (VERSION_V1 if USE_V1 else VERSION_V3 if USE_V3 else
                  VERSION_V4 if USE_V4 else VERSION_V2)
RULE = (RULE_V1 if USE_V1 else RULE_V3 if USE_V3 else
        RULE_V4 if USE_V4 else RULE_V2)

# Tu dung chung cua van ban chinh sach: xuat hien khap noi, khong mang thong tin
# phan biet. Chinh chung da tao ra duong tinh gia MATCH-0001 o vong v1
# (Phenikaa-X UAV khop "Chip chuyen dung" chi vi hai chu "chuyen dung").
STOPWORD_NGANH = {
    "chuyen", "dung", "he", "thong", "thiet", "bi", "cong", "nghe", "tien",
    "giai", "phap", "nen", "tang", "san", "pham", "ung", "phat", "trien",
    "thong minh", "hien", "dai", "cac", "va", "cho", "trong",
}
# Ban co dau (token thuc te la co dau, khong bo dau)
STOPWORD_VN = {
    "chuyên", "dụng", "hệ", "thống", "thiết", "công", "nghệ", "tiên", "tiến",
    "giải", "pháp", "nền", "tảng", "sản", "phẩm", "ứng", "dụng", "phát", "triển",
    "thông", "minh", "hiện", "đại", "các", "cho", "trong", "những", "một",
}
OVERLAP_MIN = 0.5
OVERLAP_MIN_V2 = 0.5  # giu nguyen nguong de so sanh duoc voi v1
TIER_W = {"A": 1.0, "B": 0.75, "C": 0.3}
USABLE_STATES = {"sourced", "corroborated"}


class GateError(Exception):
    def __init__(self, gate, msg):
        super().__init__(f"[{gate}] {msg}")
        self.gate = gate


# ───────────────────── lop fact (dieu kien tien quyet 1) ─────────────────────

def fact_id(entity, field, value):
    h = hashlib.sha1(f"{entity}|{field}|{value}".encode("utf-8")).hexdigest()[:10]
    return f"FACT-{h}"


def build_facts(cfg, registry):
    """Moi cell (entity x field) o trang thai dung duoc -> mot fact co id,
    evidence day du, tier tot nhat, checked_at. Cell disputed KHONG thanh fact
    (A3: khong tu resolve); cell null bo qua (honest-null)."""
    facts = {}
    disputed = []
    for ent in sorted(registry):
        for f, cell in registry[ent]["fields"].items():
            if cell["state"] == "disputed":
                disputed.append({"entity": ent, "field": f, "claims": cell["claims"]})
                continue
            if cell["state"] not in USABLE_STATES:
                continue
            fid = fact_id(ent, f, cell["value"])
            tiers = sorted({c["tier"] for c in cell["claims"]})
            facts[fid] = {
                "id": fid,
                "entity": ent,
                "entity_type": registry[ent]["entity_type"],
                "field": f,
                "value": cell["value"],
                "state": cell["state"],
                "tier_best": tiers[0],
                "evidence": cell["claims"],
                "checked_at": None,  # dien sau tu claims goc (fetched_at)
            }
    return facts, disputed


def attach_checked_at(facts, claims):
    by_key = {}
    for c in claims:
        by_key.setdefault((c["entity"], c["field"]), []).append(c["capture"]["fetched_at"])
    for f in facts.values():
        # entity trong fact la ten canonical; claims giu ten goc -> thu ca alias
        times = by_key.get((f["entity"], f["field"]), [])
        if times:
            f["checked_at"] = max(times)


# ───────────────────── matching rule v1 (tat dinh) ─────────────────────

def _tokens(s):
    return set(re.findall(r"[0-9a-zà-ỹ]{3,}", (s or "").lower()))


def _tokens_v2(s):
    """Nhu _tokens nhung loai tu dung chung cua van ban chinh sach."""
    return {w for w in _tokens(s) if w not in STOPWORD_VN and w not in STOPWORD_NGANH}


def _syllables(s):
    """Chuoi AM TIET theo dung thu tu, giu nguyen trat tu de dung cho bigram."""
    return re.findall(r"[0-9a-zà-ỹ]+", (s or "").lower())


def _bigrams_v3(s):
    """Cum HAI AM TIET lien nhau, sau khi bo stopword nganh.

    VI SAO CAN: bo tach token cua v1 va v2 cat tieng Viet theo am tiet, nen tu ghep
    hai am tiet bi vo. "mo hinh" thanh {hinh} va khop bua voi bat cu cho nao co chu
    "hinh". Do chinh la nguyen nhan cua MATCH-0002 (VNPT x P08) ma Lam da tu choi.
    So theo cum thi "mo hinh" chi khop "mo hinh".
    """
    syl = [w for w in _syllables(s) if w not in STOPWORD_VN and w not in STOPWORD_NGANH]
    return {f"{syl[i]} {syl[i+1]}" for i in range(len(syl) - 1)}


def load_mapping(domain_dir):
    """Doc mapping_sp_nhom.yaml. Khong co file -> tra ve rong, rule v2 se khong neo duoc
    va PHAI bao loi thay vi im lang cho qua."""
    import yaml
    p = Path(domain_dir) / "mapping_sp_nhom.yaml"
    if not p.exists():
        raise GateError("MAPPING_MISSING",
                        f"rule v2 can {p} de neo nhom; khong co thi khong duoc doan bua")
    return yaml.safe_load(p.read_text(encoding="utf-8"))


def _sup_products(by_entity, ent):
    """Ma san pham chien luoc ma don vi CUNG phu, tu fact da co bang chung.
    Tra ve tap ma dang 2 chu so (vd {"23"}). Rong = don vi chua khai san pham."""
    out = set()
    for f in by_entity.get(ent, []):
        if f["field"] == "san_pham" or f["field"].startswith("san_pham_phu"):
            v = str(f["value"]).strip().upper().replace("CNCL-P", "").replace("P", "")
            if v.isdigit():
                out.add(v.zfill(2))
    return out


def _sup_groups(by_entity, ent):
    """Nhom cua don vi CUNG: nhom chinh + moi nhom phu, lay tu fact da co bang chung."""
    out = set()
    for f in by_entity.get(ent, []):
        if f["field"] == "nhom" or f["field"].startswith("nhom_phu"):
            try:
                out.add(int(str(f["value"]).strip()))
            except ValueError:
                pass
    return out


def overlap(need_v, cap_v):
    nt, ct = _tokens(need_v), _tokens(cap_v)
    if not nt:
        return 0.0
    return len(nt & ct) / len(nt)


def make_matches_v3(cfg, facts, domain, domain_dir):
    """Rule v3 · anchor_bigram_v3. Nhu v2 nhung LOP 3 so theo CUM HAI AM TIET.

    Lop 1 NEO NHOM  : giu nguyen v2.
    Lop 2 STOPWORD  : giu nguyen v2.
    Lop 3 BIGRAM    : so tren tap cum hai am tiet, khong so am tiet le.
    Lop 4 DIEM      : giu nguyen cong thuc de con so so sanh duoc voi v1 va v2.

    Need it hon 1 bigram thi lui ve so token don, VA GHI VAO rationale la da lui,
    de nguoi doc biet dong do yeu hon nhung dong khac.
    """
    mapping = load_mapping(domain_dir)
    sp_map = mapping.get("san_pham") or {}
    edges = mapping.get("canh_chuoi_gia_tri") or []

    needs = sorted([f for f in facts.values() if f["field"].startswith("need")], key=lambda f: f["id"])
    caps = sorted([f for f in facts.values() if f["field"].startswith("capability")], key=lambda f: f["id"])
    by_entity = {}
    for f in facts.values():
        by_entity.setdefault(f["entity"], []).append(f)

    created_at = max((f["checked_at"] or "" for f in facts.values()), default="")
    matches, seq = [], 0
    for nf in needs:
        sp_id = str(nf["entity"]).split(" ")[0]
        row = sp_map.get(sp_id)
        if not row:
            continue
        nhom_cau = int(row["nhom"])
        cho_duyet = [] if row.get("trang_thai") == "da_duyet" else [
            {"fact_id": nf["id"],
             "note": f"anh xa {sp_id} ve nhom {nhom_cau} CHUA DUOC NGUOI DUYET (mapping_sp_nhom.yaml)"}]
        nb = _bigrams_v3(nf["value"])
        lui_token = not nb
        for cf in caps:
            if nf["entity"] == cf["entity"]:
                continue
            groups = _sup_groups(by_entity, cf["entity"])
            if not groups:
                continue
            qua_canh = None
            if nhom_cau not in groups:
                for e in edges:
                    if int(e["tu"]) in groups and int(e["den"]) == nhom_cau:
                        qua_canh = e
                        break
                if qua_canh is None:
                    continue
            if lui_token:
                nt, ct = _tokens_v2(nf["value"]), _tokens_v2(cf["value"])
            else:
                nt, ct = nb, _bigrams_v3(cf["value"])
            if not nt:
                continue
            ov = len(nt & ct) / len(nt)
            if ov < OVERLAP_MIN_V2:
                continue
            seq += 1
            tier_score = (TIER_W[nf["tier_best"]] + TIER_W[cf["tier_best"]]) / 2
            loc_n = next((x["value"] for x in by_entity.get(nf["entity"], []) if x["field"] == "location"), None)
            loc_c = next((x["value"] for x in by_entity.get(cf["entity"], []) if x["field"] == "location"), None)
            loc = 1.0 if (loc_n and loc_c and loc_n == loc_c) else 0.0
            score = round(0.7 * ov + 0.2 * tier_score + 0.1 * loc, 2)
            unverified = list(cho_duyet)
            if qua_canh is not None and qua_canh.get("trang_thai") != "da_duyet":
                unverified.append({"fact_id": cf["id"],
                                   "note": f"noi qua canh chuoi gia tri nhom {qua_canh['tu']} sang {qua_canh['den']}, CHUA DUOC NGUOI DUYET"})
            for side in (nf["entity"], cf["entity"]):
                for x in sorted(by_entity.get(side, []), key=lambda f: f["id"]):
                    if x["tier_best"] == "C":
                        note = "de o muc claim, khong phoi nhu su that cung"
                        if x["id"] in (nf["id"], cf["id"]):
                            note = "CAN CU CHINH o muc claim: " + note
                        unverified.append({"fact_id": x["id"], "note": note})
            matches.append({
                "id": f"MATCH-{seq:04d}",
                "domain": domain,
                "created_at": created_at,
                "demand": {"entity_id": nf["entity"], "need_fact_ids": [nf["id"]]},
                "supply": {"entity_id": cf["entity"], "capability_fact_ids": [cf["id"]]},
                "rationale": {
                    "rule": RULE_V3,
                    "matched_fields": [["capability", "need"]],
                    "score": score,
                    "computed_by": VERSION_V3,
                    "neo_nhom": {"nhom_cau": nhom_cau, "nhom_cung": sorted(groups),
                                 "qua_canh_chuoi_gia_tri": bool(qua_canh)},
                    "so_theo": "token_don (lui vi need it hon 1 cum)" if lui_token else "cum_hai_am_tiet",
                    "cum_giao": sorted(nt & ct),
                },
                "unverified": unverified,
                "gate": {
                    "chain_complete": None,
                    "checked_at": created_at,
                    "signoff": {"by": "pending-human-review", "role": "chuyen gia gac cong", "date": None},
                },
                "vouch": {"backer": None, "status": "none"},
            })
    return matches


def make_matches_v4(cfg, facts, domain, domain_dir):
    """Rule v4 · anchor_product_v4. Nhu v2 nhung THEM LOP NEO SAN PHAM dat TRUOC neo nhom.

    Ly do: bon vong thu nghiem tren CHUOI KY TU deu phan tac dung (rule v3 bigram truot,
    tach nang luc ghep truot). Vong nay siet bang DU LIEU CO CAU TRUC thay vi bang chu.
    Nhom la phan loai THO: nhom 5 gop ca vat lieu, pin, hydro, thiet bi dien. San pham thi khong gop.

    LOP 0 NEO SAN PHAM (moi):
      · Don vi CUNG co khai san_pham: trung ma san pham cua nhu cau -> cho qua thang.
        Khac ma -> LOAI, tru khi noi duoc qua canh chuoi gia tri da duyet.
      · Don vi CUNG chua khai san pham (honest-null) -> LUI ve neo nhom nhu v2, ghi ro da lui.

    Ba lop con lai giu nguyen v2:

      Lop 1 NEO NHOM  · nhom cua don vi CUNG (chinh hoac phu) phai trung nhom cua san
                        pham CAU, hoac noi duoc qua canh chuoi gia tri. Khong thoa thi
                        LOAI THANG, khong tinh diem. Lop nay giet duong tinh gia kieu
                        "khac linh vuc nhung trung chu".
      Lop 2 STOPWORD  · bo tu dung chung cua van ban chinh sach truoc khi so.
      Lop 3 OVERLAP   · giu nguyen cong thuc diem cua v1 de con so so sanh duoc.

    Anh xa san pham ve nhom la PHAN DOAN cua nguoi, doc tu mapping_sp_nhom.yaml.
    Dong nao con `cho_duyet` thi match dua tren no PHAI tu khai vao `unverified`.
    """
    mapping = load_mapping(domain_dir)
    sp_map = mapping.get("san_pham") or {}
    edges = mapping.get("canh_chuoi_gia_tri") or []

    needs = sorted([f for f in facts.values() if f["field"].startswith("need")], key=lambda f: f["id"])
    caps = sorted([f for f in facts.values() if f["field"].startswith("capability")], key=lambda f: f["id"])
    by_entity = {}
    for f in facts.values():
        by_entity.setdefault(f["entity"], []).append(f)

    created_at = max((f["checked_at"] or "" for f in facts.values()), default="")
    matches, seq = [], 0
    for nf in needs:
        sp_id = str(nf["entity"]).split(" ")[0]
        row = sp_map.get(sp_id)
        if not row:
            continue  # khong co anh xa thi khong doan bua
        nhom_cau = int(row["nhom"])
        cho_duyet = [] if row.get("trang_thai") == "da_duyet" else [
            {"fact_id": nf["id"],
             "note": f"anh xa {sp_id} ve nhom {nhom_cau} CHUA DUOC NGUOI DUYET (mapping_sp_nhom.yaml)"}]
        for cf in caps:
            if nf["entity"] == cf["entity"]:
                continue
            sps = _sup_products(by_entity, cf["entity"])
            sp_cau = sp_id.replace("CNCL-P", "")
            neo_kieu = None
            if sps:
                if sp_cau in sps:
                    neo_kieu = "san_pham"
                # khong trung ma -> van cho xet canh chuoi gia tri o duoi
            groups = _sup_groups(by_entity, cf["entity"])
            if not groups:
                continue
            qua_canh = None
            if neo_kieu != "san_pham" and sps:
                # don vi DA khai san pham nhung khac ma: chi cuu duoc bang canh chuoi gia tri
                for e in edges:
                    if int(e["tu"]) in groups and int(e["den"]) == nhom_cau:
                        qua_canh = e
                        neo_kieu = "canh_chuoi_gia_tri"
                        break
                if qua_canh is None:
                    continue
            elif not sps and nhom_cau not in groups:
                for e in edges:
                    if int(e["tu"]) in groups and int(e["den"]) == nhom_cau:
                        qua_canh = e
                        break
                if qua_canh is None:
                    continue  # LOP 1 loai
            nt, ct = _tokens_v2(nf["value"]), _tokens_v2(cf["value"])
            if not nt:
                continue
            ov = len(nt & ct) / len(nt)
            if ov < OVERLAP_MIN_V2:
                continue
            seq += 1
            tier_score = (TIER_W[nf["tier_best"]] + TIER_W[cf["tier_best"]]) / 2
            loc_n = next((x["value"] for x in by_entity.get(nf["entity"], []) if x["field"] == "location"), None)
            loc_c = next((x["value"] for x in by_entity.get(cf["entity"], []) if x["field"] == "location"), None)
            loc = 1.0 if (loc_n and loc_c and loc_n == loc_c) else 0.0
            score = round(0.7 * ov + 0.2 * tier_score + 0.1 * loc, 2)
            unverified = list(cho_duyet)
            if qua_canh is not None and qua_canh.get("trang_thai") != "da_duyet":
                unverified.append({"fact_id": cf["id"],
                                   "note": f"noi qua canh chuoi gia tri nhom {qua_canh['tu']} sang {qua_canh['den']}, CHUA DUOC NGUOI DUYET"})
            for side in (nf["entity"], cf["entity"]):
                for x in sorted(by_entity.get(side, []), key=lambda f: f["id"]):
                    if x["tier_best"] == "C":
                        note = "de o muc claim, khong phoi nhu su that cung"
                        if x["id"] in (nf["id"], cf["id"]):
                            note = "CAN CU CHINH o muc claim: " + note
                        unverified.append({"fact_id": x["id"], "note": note})
            matches.append({
                "id": f"MATCH-{seq:04d}",
                "domain": domain,
                "created_at": created_at,
                "demand": {"entity_id": nf["entity"], "need_fact_ids": [nf["id"]]},
                "supply": {"entity_id": cf["entity"], "capability_fact_ids": [cf["id"]]},
                "rationale": {
                    "rule": RULE_V4,
                    "matched_fields": [["capability", "need"]],
                    "score": score,
                    "computed_by": VERSION_V4,
                    "neo": neo_kieu,
                    "neo_nhom": {"nhom_cau": nhom_cau, "nhom_cung": sorted(groups),
                                 "san_pham_cau": sp_cau, "san_pham_cung": sorted(sps),
                                 "qua_canh_chuoi_gia_tri": bool(qua_canh)},
                    "token_con_lai": {"need": sorted(nt), "giao": sorted(nt & ct)},
                },
                "unverified": unverified,
                "gate": {
                    "chain_complete": None,
                    "checked_at": created_at,
                    "signoff": {"by": "pending-human-review", "role": "chuyen gia gac cong", "date": None},
                },
                "vouch": {"backer": None, "status": "none"},
            })
    return matches


def make_matches_v2(cfg, facts, domain, domain_dir):
    """Rule v2 · anchor_group_overlap_v2. Ba lop, thu tu co y nghia:

      Lop 1 NEO NHOM  · nhom cua don vi CUNG (chinh hoac phu) phai trung nhom cua san
                        pham CAU, hoac noi duoc qua canh chuoi gia tri. Khong thoa thi
                        LOAI THANG, khong tinh diem. Lop nay giet duong tinh gia kieu
                        "khac linh vuc nhung trung chu".
      Lop 2 STOPWORD  · bo tu dung chung cua van ban chinh sach truoc khi so.
      Lop 3 OVERLAP   · giu nguyen cong thuc diem cua v1 de con so so sanh duoc.

    Anh xa san pham ve nhom la PHAN DOAN cua nguoi, doc tu mapping_sp_nhom.yaml.
    Dong nao con `cho_duyet` thi match dua tren no PHAI tu khai vao `unverified`.
    """
    mapping = load_mapping(domain_dir)
    sp_map = mapping.get("san_pham") or {}
    edges = mapping.get("canh_chuoi_gia_tri") or []

    needs = sorted([f for f in facts.values() if f["field"].startswith("need")], key=lambda f: f["id"])
    caps = sorted([f for f in facts.values() if f["field"].startswith("capability")], key=lambda f: f["id"])
    by_entity = {}
    for f in facts.values():
        by_entity.setdefault(f["entity"], []).append(f)

    created_at = max((f["checked_at"] or "" for f in facts.values()), default="")
    matches, seq = [], 0
    for nf in needs:
        sp_id = str(nf["entity"]).split(" ")[0]
        row = sp_map.get(sp_id)
        if not row:
            continue  # khong co anh xa thi khong doan bua
        nhom_cau = int(row["nhom"])
        cho_duyet = [] if row.get("trang_thai") == "da_duyet" else [
            {"fact_id": nf["id"],
             "note": f"anh xa {sp_id} ve nhom {nhom_cau} CHUA DUOC NGUOI DUYET (mapping_sp_nhom.yaml)"}]
        for cf in caps:
            if nf["entity"] == cf["entity"]:
                continue
            groups = _sup_groups(by_entity, cf["entity"])
            if not groups:
                continue
            qua_canh = None
            if nhom_cau not in groups:
                for e in edges:
                    if int(e["tu"]) in groups and int(e["den"]) == nhom_cau:
                        qua_canh = e
                        break
                if qua_canh is None:
                    continue  # LOP 1 loai
            nt, ct = _tokens_v2(nf["value"]), _tokens_v2(cf["value"])
            if not nt:
                continue
            ov = len(nt & ct) / len(nt)
            if ov < OVERLAP_MIN_V2:
                continue
            seq += 1
            tier_score = (TIER_W[nf["tier_best"]] + TIER_W[cf["tier_best"]]) / 2
            loc_n = next((x["value"] for x in by_entity.get(nf["entity"], []) if x["field"] == "location"), None)
            loc_c = next((x["value"] for x in by_entity.get(cf["entity"], []) if x["field"] == "location"), None)
            loc = 1.0 if (loc_n and loc_c and loc_n == loc_c) else 0.0
            score = round(0.7 * ov + 0.2 * tier_score + 0.1 * loc, 2)
            unverified = list(cho_duyet)
            if qua_canh is not None and qua_canh.get("trang_thai") != "da_duyet":
                unverified.append({"fact_id": cf["id"],
                                   "note": f"noi qua canh chuoi gia tri nhom {qua_canh['tu']} sang {qua_canh['den']}, CHUA DUOC NGUOI DUYET"})
            for side in (nf["entity"], cf["entity"]):
                for x in sorted(by_entity.get(side, []), key=lambda f: f["id"]):
                    if x["tier_best"] == "C":
                        note = "de o muc claim, khong phoi nhu su that cung"
                        if x["id"] in (nf["id"], cf["id"]):
                            note = "CAN CU CHINH o muc claim: " + note
                        unverified.append({"fact_id": x["id"], "note": note})
            matches.append({
                "id": f"MATCH-{seq:04d}",
                "domain": domain,
                "created_at": created_at,
                "demand": {"entity_id": nf["entity"], "need_fact_ids": [nf["id"]]},
                "supply": {"entity_id": cf["entity"], "capability_fact_ids": [cf["id"]]},
                "rationale": {
                    "rule": RULE_V2,
                    "matched_fields": [["capability", "need"]],
                    "score": score,
                    "computed_by": VERSION_V2,
                    "neo_nhom": {"nhom_cau": nhom_cau, "nhom_cung": sorted(groups),
                                 "qua_canh_chuoi_gia_tri": bool(qua_canh)},
                    "token_con_lai": {"need": sorted(nt), "giao": sorted(nt & ct)},
                },
                "unverified": unverified,
                "gate": {
                    "chain_complete": None,
                    "checked_at": created_at,
                    "signoff": {"by": "pending-human-review", "role": "chuyen gia gac cong", "date": None},
                },
                "vouch": {"backer": None, "status": "none"},
            })
    return matches


def make_matches(cfg, facts, domain):
    """Overlay capability voi need. Can cu chinh la fact A/B; fact tier C lam
    can cu chinh van duoc sinh NHUNG bat buoc tu khai vao unverified (04.C.4);
    moi fact C lien quan cua hai ben cung vao unverified."""
    needs = sorted([f for f in facts.values() if f["field"] == "need"], key=lambda f: f["id"])
    caps = sorted([f for f in facts.values() if f["field"] == "capability"], key=lambda f: f["id"])
    by_entity = {}
    for f in facts.values():
        by_entity.setdefault(f["entity"], []).append(f)

    created_at = max((f["checked_at"] or "" for f in facts.values()), default="")
    matches = []
    seq = 0
    for nf in needs:
        for cf in caps:
            if nf["entity"] == cf["entity"]:
                continue
            ov = overlap(nf["value"], cf["value"])
            if ov < OVERLAP_MIN:
                continue
            seq += 1
            tier_score = (TIER_W[nf["tier_best"]] + TIER_W[cf["tier_best"]]) / 2
            loc_n = next((x["value"] for x in by_entity.get(nf["entity"], []) if x["field"] == "location"), None)
            loc_c = next((x["value"] for x in by_entity.get(cf["entity"], []) if x["field"] == "location"), None)
            loc = 1.0 if (loc_n and loc_c and loc_n == loc_c) else 0.0
            score = round(0.7 * ov + 0.2 * tier_score + 0.1 * loc, 2)
            unverified = []
            for side in (nf["entity"], cf["entity"]):
                for x in sorted(by_entity.get(side, []), key=lambda f: f["id"]):
                    if x["tier_best"] == "C":
                        note = "de o muc claim, khong phoi nhu su that cung"
                        if x["id"] in (nf["id"], cf["id"]):
                            note = "CAN CU CHINH o muc claim: " + note
                        unverified.append({"fact_id": x["id"], "note": note})
            matches.append({
                "id": f"MATCH-{seq:04d}",
                "domain": domain,
                "created_at": created_at,
                "demand": {"entity_id": nf["entity"], "need_fact_ids": [nf["id"]]},
                "supply": {"entity_id": cf["entity"], "capability_fact_ids": [cf["id"]]},
                "rationale": {
                    "rule": RULE,
                    "matched_fields": [["capability", "need"]],
                    "score": score,
                    "computed_by": ENGINE_VERSION,
                },
                "unverified": unverified,
                "gate": {
                    "chain_complete": None,  # gate dien
                    "checked_at": created_at,
                    "signoff": {"by": "pending-human-review", "role": "chuyen gia gac cong", "date": None},
                },
                "vouch": {"backer": None, "status": "none"},
            })
    return matches


# ───────────────────── gate xuat match (04.B + 04.C) ─────────────────────

def gate_match(m, facts):
    """Kiem mot match. Sai o dau -> GateError dung ten rang 04.C."""
    rat = m.get("rationale") or {}
    if not rat.get("rule") or not rat.get("matched_fields") or rat.get("score") is None \
            or not rat.get("computed_by"):
        raise GateError("MATCH_RATIONALE_MISSING",
                        f"{m.get('id')}: rationale thieu rule/matched_fields/score/computed_by")
    primary = [("demand", i) for i in m["demand"]["need_fact_ids"]] + \
              [("supply", i) for i in m["supply"]["capability_fact_ids"]]
    if not primary:
        raise GateError("MATCH_RATIONALE_MISSING", f"{m.get('id')}: khong co fact can cu")
    declared = {u.get("fact_id") for u in (m.get("unverified") or [])}
    for side, fid in primary:
        f = facts.get(fid)
        if f is None:
            raise GateError("MATCH_CHAIN_BROKEN",
                            f"{m.get('id')}: {side} tro toi fact khong ton tai {fid!r}")
        ev = f.get("evidence") or []
        if not ev or any(not (e.get("span") or e.get("value")) for e in ev) or not f.get("tier_best"):
            raise GateError("MATCH_FACT_NO_EVIDENCE",
                            f"{m.get('id')}: fact {fid} khong co evidence_span/tier tra duoc")
        if f["tier_best"] == "C" and fid not in declared:
            raise GateError("MATCH_CLAIM_AS_FACT",
                            f"{m.get('id')}: can cu chinh {fid} o tier claim ma khong khai unverified")
    # truy nguon <= 5 buoc: match -> fact_id -> fact(evidence) -> snapshot = 3 buoc theo cau truc
    return True


def validate_all(matches, facts, stop_on_first=True):
    passed, blocked = [], []
    for m in matches:
        try:
            gate_match(m, facts)
            m["gate"]["chain_complete"] = True
            passed.append(m)
        except GateError as e:
            if stop_on_first:
                raise
            m["gate"]["chain_complete"] = False
            blocked.append({"id": m.get("id"), "gate": e.gate, "reason": str(e)})
    return passed, blocked


# ───────────────────── evidence view cho facts.jsonl ─────────────────────

def evidence_view(cell_claims, claims_raw, entity, field):
    """Gan span + snapshot vao evidence cua fact (registry cell chi giu value/tier/source)."""
    out = []
    for c in claims_raw:
        if refinery.canonicalize(CFG, c["entity"]) == entity and c["field"] == field:
            out.append({
                "span": c["evidence_span"],
                "tier": c["tier"],
                "snapshot": c["capture"]["snapshot"],
                "url": c["capture"]["url"],
                "fetched_at": c["capture"]["fetched_at"],
                "source": c["capture"]["source"],
            })
    return sorted(out, key=lambda e: (e["snapshot"], e["span"]))


CFG = None


def run(domain_dir):
    global CFG
    cfg, claims, registry, agg, _ = refinery.run_pipeline(domain_dir)
    CFG = cfg
    facts, disputed = build_facts(cfg, registry)
    for f in facts.values():
        f["evidence"] = evidence_view(f["evidence"], claims, f["entity"], f["field"])
        if not f["evidence"]:
            raise GateError("MATCH_FACT_NO_EVIDENCE", f"fact {f['id']} khong tra duoc evidence")
    attach_checked_at(facts, claims)
    if USE_V1:
        matches = make_matches(cfg, facts, cfg["domain"])
    elif USE_V3:
        matches = make_matches_v3(cfg, facts, cfg["domain"], domain_dir)
    elif USE_V4:
        matches = make_matches_v4(cfg, facts, cfg["domain"], domain_dir)
    else:
        matches = make_matches_v2(cfg, facts, cfg["domain"], domain_dir)
    matches, bi_tu_choi = _loc_bi_tu_choi(matches, Path(domain_dir),
                                          bo_qua="--ignore-rejections" in sys.argv)
    passed, blocked = validate_all(matches, facts, stop_on_first=False)
    # engine tu sinh ma bi chan -> bug logic, fail loud luon (khong co o Phase A sach)
    for b in blocked:
        if b["gate"] in ("MATCH_CHAIN_BROKEN", "MATCH_RATIONALE_MISSING"):
            raise GateError(b["gate"], "engine tu sinh match hong: " + b["reason"])

    out = Path(domain_dir) / ".." / ".." / "out"
    out = out.resolve()
    out.mkdir(exist_ok=True)
    _canh_bao_ghi_de(out, Path(domain_dir), "--force" in sys.argv)
    (out / "facts.jsonl").write_text(
        "\n".join(json.dumps(facts[k], ensure_ascii=False, sort_keys=True) for k in sorted(facts)) + "\n",
        encoding="utf-8")
    (out / "matches.jsonl").write_text(
        "\n".join(json.dumps(m, ensure_ascii=False, sort_keys=True) for m in passed) + "\n",
        encoding="utf-8")
    (out / "blocked_by_signoff.jsonl").write_text(
        ("\n".join(json.dumps(b, ensure_ascii=False, sort_keys=True) for b in bi_tu_choi) + "\n")
        if bi_tu_choi else "", encoding="utf-8")
    (out / "blocked.jsonl").write_text(
        ("\n".join(json.dumps(b, ensure_ascii=False, sort_keys=True) for b in blocked) + "\n") if blocked else "",
        encoding="utf-8")

    states = {}
    for f in facts.values():
        states[f["state"]] = states.get(f["state"], 0) + 1
    tierc = sum(1 for f in facts.values() if f["tier_best"] == "C")
    null_cells = sum(1 for ent in registry.values() for c in ent["fields"].values() if c["state"] == "null")
    report = {
        "engine_version": ENGINE_VERSION,
        "domain": cfg["domain"],
        "facts_total": len(facts),
        "facts_by_state": dict(sorted(states.items())),
        "facts_tier_claim": tierc,
        "cells_honest_null": null_cells,
        "disputed_cells": len(disputed),
        "match_candidates": len(matches),
        "match_passed_gate": len(passed),
        "match_blocked": len(blocked),
        "blocked_by_gate": {},
        "in_backer_network": None,  # honest-null: chua co danh sach vung quan he (Phase B)
        "digest_matches": hashlib.sha256(
            json.dumps(passed, ensure_ascii=False, sort_keys=True).encode()).hexdigest()[:16],
    }
    for b in blocked:
        report["blocked_by_gate"][b["gate"]] = report["blocked_by_gate"].get(b["gate"], 0) + 1
    (out / "report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2, sort_keys=True), encoding="utf-8")

    print(f"MATCH ENGINE · {ENGINE_VERSION}")
    print(f"facts={report['facts_total']} (claim-tier={tierc}, disputed cells={len(disputed)}, honest-null cells={null_cells})")
    print(f"match: ung vien={len(matches)} · dat gate={len(passed)} · bi chan={len(blocked)}")
    for m in passed:
        print(f"  {m['id']}  {m['demand']['entity_id']}  <->  {m['supply']['entity_id']}"
              f"  score={m['rationale']['score']}  unverified={len(m['unverified'])}")
    for b in blocked:
        print(f"  CHAN [{b['gate']}] {b['reason']}")
    print(f"digest_matches={report['digest_matches']} (tai lap: chay lai phai ra dung digest nay)")
    return report


def validate_file(domain_dir, matches_path, require_signoff=False):
    """Che do cho bites + X-Ray: doc facts tu out/facts.jsonl (artefact) va
    kiem tung match trong file. Bat ky rang nao can -> exit 2.
    --require-signoff (Phase B, nhac cua X-Ray 17/07): moi match phai co nguoi
    gac cong THAT ky (by + date), 'pending-human-review' bi rang SIGNOFF_PENDING can."""
    out = (Path(domain_dir) / ".." / ".." / "out").resolve()
    facts = {}
    for line in (out / "facts.jsonl").read_text(encoding="utf-8").splitlines():
        if line.strip():
            f = json.loads(line)
            facts[f["id"]] = f
    matches = [json.loads(l) for l in Path(matches_path).read_text(encoding="utf-8").splitlines() if l.strip()]
    rej = _rejected_digests(Path(domain_dir))
    for m in matches:
        gate_match(m, facts)
        r = rej.get(_match_khoa(m)["digest"])
        if r is not None and ((m.get("gate") or {}).get("signoff") or {}).get("decision") != "tu_choi":
            raise GateError("SIGNOFF_REJECTED_RESURFACED",
                            f"{m.get('id')}: cap {m['demand']['entity_id']} <-> {m['supply']['entity_id']} "
                            f"da bi {r.get('by')} TU CHOI ngay {r.get('date')} nhung lai xuat hien nhu match hop le")
        if require_signoff:
            so = (m.get("gate") or {}).get("signoff") or {}
            if not so.get("by") or so.get("by") == "pending-human-review" or not so.get("date"):
                raise GateError("SIGNOFF_PENDING",
                                f"{m.get('id')}: chua co nguoi gac cong that ky (by/date)")
    if require_signoff:
        ky = [m for m in matches if ((m.get("gate") or {}).get("signoff") or {}).get("decision", "ky") == "ky"]
        tu_choi = [m for m in matches if ((m.get("gate") or {}).get("signoff") or {}).get("decision") == "tu_choi"]
        print(f"VALIDATE PASSED · {len(matches)} match · 0 gate bites · signoff THAT du")
        print(f"  KY      : {len(ky)}  -> chi nhung match nay duoc trinh ra ngoai")
        print(f"  TU CHOI : {len(tu_choi)}" + (f"  ({', '.join(m['id'] for m in tu_choi)})" if tu_choi else ""))
        return
    print(f"VALIDATE PASSED · {len(matches)} match · 0 gate bites")


def _csv_flag(argv, name):
    """Doc co dang --name A,B hoac --name=A,B. Tra ve list hoac None."""
    for i, a in enumerate(argv):
        if a == name and i + 1 < len(argv):
            return [x.strip() for x in argv[i + 1].split(",") if x.strip()]
        if a.startswith(name + "="):
            return [x.strip() for x in a.split("=", 1)[1].split(",") if x.strip()]
    return None


def _val_flag(argv, name):
    for i, a in enumerate(argv):
        if a == name and i + 1 < len(argv):
            return argv[i + 1]
        if a.startswith(name + "="):
            return a.split("=", 1)[1]
    return None


def bang_chung_digest(domain_dir, m):
    """Khoa CHU CUA BANG CHUNG ma mot match dua vao (fact_id + snapshot + evidence_span).

    VI SAO CAN, phat hien 16/08/2026: fact_id = sha1(entity|field|value), tuc KHONG phu
    evidence_span. Vong doi chung nguon vua viet lai 25 span (co ca cau bi viet lai chu
    khong chi lech dinh dang), the ma restore-signoff gan lai DU 12/12 chu ky, khong dong
    nao bao dong. Nguoi gac cong ky tren mot cau, cau doi, chu ky van con: do la chu ky
    treo lo lung. Khoa nay lam viec do lo ra.

    KHONG gop vao digest cu: gop thi ca 12 chu ky doi khoa mot luc, khong phan biet duoc
    dong nao that su bi dung toi bang chung. De rieng thi so chi ra dung dong bi anh huong.
    """
    facts = {}
    p = Path(domain_dir)
    p = p if p.is_file() else p / "claims.jsonl"
    if p.exists():
        for line in p.read_text(encoding="utf-8").splitlines():
            if not line.strip():
                continue
            c = json.loads(line)
            fid = fact_id(c["entity"], c["field"], c["value"])
            cap = c.get("capture") or {}
            facts.setdefault(fid, set()).add(f"{cap.get('snapshot','')}::{c.get('evidence_span','')}")
    ids = sorted((m["demand"].get("need_fact_ids") or []) + (m["supply"].get("capability_fact_ids") or []))
    raw = "|".join(f"{i}=>" + "~".join(sorted(facts.get(i, {"KHONG-CO-BANG-CHUNG"}))) for i in ids)
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()[:16]


def _match_khoa(m):
    """Khoa NOI DUNG cua mot match, dung lam dinh danh THAT trong so chu ky.

    VI SAO KHONG DUNG match_id: "MATCH-0002" chi la so thu tu do engine sinh. Chay lai
    voi du lieu khac thi MATCH-0002 co the la mot cap hoan toan khac. Gan chu ky vao so
    thu tu se dan den ky nham nguoi khac, con te hon la mat chu ky.
    """
    d = m["demand"]; s = m["supply"]
    raw = "|".join([
        str(d.get("entity_id")), str(s.get("entity_id")),
        ",".join(sorted(d.get("need_fact_ids") or [])),
        ",".join(sorted(s.get("capability_fact_ids") or [])),
    ])
    return {
        "demand_entity": d.get("entity_id"),
        "supply_entity": s.get("entity_id"),
        "need_fact_ids": sorted(d.get("need_fact_ids") or []),
        "capability_fact_ids": sorted(s.get("capability_fact_ids") or []),
        "digest": hashlib.sha256(raw.encode("utf-8")).hexdigest()[:16],
    }


def _rejected_digests(domain_dir):
    """Tap digest cua cac cap NGUOI GAC CONG DA TU CHOI.

    VI SAO O TANG ENGINE CHU KHONG O TANG RULE (TIP-CNCL-3I):
    Ngay 16/08/2026 rule v4 lam cap VNPT x P08 quay lai, du Lam da tu choi cap do
    kem ly do ghi trong so. No quay lai qua canh chuoi gia tri, tuc mot duong ma rule
    moi mo ra. Chuyen do chi lo vi tieu chi H5 duoc khoa truoc; khong khoa thi da lang le.
    Neu chi va rule v2 thi rule v5 sau nay lai thung. Rang buoc phai nam duoi moi rule.
    """
    return {r["khoa"]["digest"]: r for r in _read_ledger(domain_dir)
            if r.get("decision") == "tu_choi"}


def _loc_bi_tu_choi(matches, domain_dir, bo_qua=False):
    """Loai cap da bi tu choi. Tra ve (con_lai, bi_loai).

    KHONG loai am tham: moi cap bi loai deu duoc in ra va ghi vao out/blocked_by_signoff.jsonl.
    Loai am tham nguy hiem ngang cho qua am tham.
    """
    rej = _rejected_digests(domain_dir)
    if not rej:
        return matches, []
    con, loai = [], []
    for m in matches:
        r = rej.get(_match_khoa(m)["digest"])
        if r is None:
            con.append(m)
        else:
            loai.append({"id": m["id"], "demand": m["demand"]["entity_id"],
                         "supply": m["supply"]["entity_id"],
                         "tu_choi_boi": r.get("by"), "ngay": r.get("date"),
                         "ly_do": r.get("ly_do"), "digest": _match_khoa(m)["digest"]})
    if bo_qua:
        print(f"CANH BAO --ignore-rejections: BO QUA {len(loai)} quyet dinh TU CHOI cua nguoi gac cong")
        for b in loai:
            print(f"  ! {b['demand']} <-> {b['supply']} · bi {b['tu_choi_boi']} tu choi {b['ngay']}")
        return matches, []
    for b in loai:
        print(f"LOAI THEO SO CHU KY: {b['demand']} <-> {b['supply']}")
        print(f"    bi {b['tu_choi_boi']} tu choi ngay {b['ngay']}: {str(b.get('ly_do'))[:80]}")
    return con, loai


def _ledger_path(domain_dir):
    return Path(domain_dir) / "signoff_ledger.jsonl"


def _read_ledger(domain_dir):
    p = _ledger_path(domain_dir)
    if not p.exists():
        return []
    return [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]


def _write_ledger(domain_dir, rows):
    p = _ledger_path(domain_dir)
    p.write_text("\n".join(json.dumps(r, ensure_ascii=False, sort_keys=True) for r in rows) + "\n",
                 encoding="utf-8")


def _ghi_so(domain_dir, chon, by, date, decision, ly_do=None):
    """Ghi quyet dinh vao so chu ky. Quyet dinh moi cho cung mot khoa se GHI DE dong cu,
    nhung dong cu KHONG bi xoa khoi lich su git: sổ nam trong git nen moi lan doi deu co dau vet."""
    rows = _read_ledger(domain_dir)
    by_digest = {r["khoa"]["digest"]: i for i, r in enumerate(rows)}
    for m in chon:
        khoa = _match_khoa(m)
        khoa["bang_chung"] = bang_chung_digest(domain_dir, m)
        rec = {"match_id": m["id"], "decision": decision, "by": by,
               "role": "chuyen gia gac cong", "date": date, "khoa": khoa,
               "engine_version": (m.get("rationale") or {}).get("computed_by"),
               "ghi_luc": date}
        if ly_do:
            rec["ly_do"] = ly_do
        i = by_digest.get(khoa["digest"])
        if i is None:
            rows.append(rec)
        else:
            rows[i] = rec
    _write_ledger(domain_dir, rows)
    return len(rows)


def _domain_tu_matches(matches_path):
    """Suy ra domain_dir tu duong dan out/matches.jsonl. Fail-loud neu khong doan duoc."""
    p = Path(matches_path).resolve()
    root = p.parent.parent
    cands = sorted((root / "domains").glob("*/domain.yaml")) if (root / "domains").exists() else []
    if len(cands) == 1:
        return cands[0].parent
    for c in cands:
        if (c.parent / "signoff_ledger.jsonl").exists():
            return c.parent
    raise GateError("KHONG_XAC_DINH_DUOC_DOMAIN",
                    "khong suy duoc domain tu duong dan matches; dung --domain <domain_dir>")


def _write_matches(p, rows):
    p.write_text("\n".join(json.dumps(m, ensure_ascii=False, sort_keys=True) for m in rows) + "\n",
                 encoding="utf-8")


def _select(rows, only, exc):
    """Chon match theo --only hoac --except. Khong khai gi -> toan bo."""
    ids = {m["id"] for m in rows}
    if only:
        thieu = set(only) - ids
        if thieu:
            raise GateError("SIGN_ID_KHONG_TON_TAI", f"--only tro toi ID khong co trong file: {sorted(thieu)}")
        return [m for m in rows if m["id"] in set(only)]
    if exc:
        thieu = set(exc) - ids
        if thieu:
            raise GateError("SIGN_ID_KHONG_TON_TAI", f"--except tro toi ID khong co trong file: {sorted(thieu)}")
        return [m for m in rows if m["id"] not in set(exc)]
    return rows


def sign_matches(matches_path, by, date, only=None, exc=None, domain_dir=None):
    """Ghi chu ky NGUOI GAC CONG that.

    LY DO CO --only VA --except (16/08/2026): ban dau lenh nay ky TAT CA, khong co
    cach ky chon loc. Lam da ky nham ca MATCH-0002 la ca da biet la rac, vi lenh
    khong cho tru ra. Mot cong gac ma chi co nut "duyet tat" thi khong phai cong gac.

    decision = "ky". Xem them reject_matches cho quyet dinh tu choi.
    """
    p = Path(matches_path)
    rows = [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]
    chon = _select(rows, only, exc)
    for m in chon:
        m["gate"]["signoff"] = {"by": by, "role": "chuyen gia gac cong", "date": date,
                                "decision": "ky"}
    _write_matches(p, rows)
    dd = Path(domain_dir) if domain_dir else _domain_tu_matches(matches_path)
    n = _ghi_so(dd, chon, by, date, "ky")
    ids = ", ".join(m["id"] for m in chon)
    print(f"SIGNOFF: {len(chon)}/{len(rows)} match ky boi {by} ngay {date}")
    print(f"  da ky: {ids}")
    print(f"  so chu ky: {_ledger_path(dd)} ({n} dong, DUOC GIT THEO DOI)")


def reject_matches(matches_path, by, date, ids, reason, domain_dir=None):
    """Ghi quyet dinh TU CHOI cua nguoi gac cong.

    VI SAO CAN VERB RIENG: vang chu ky la trang thai NHAP NHANG, khong phan biet duoc
    "chua ai xem" voi "da xem va tu choi". Hai thu do khac han nhau ve trach nhiem.
    Tu choi phai duoc GHI LAI kem ly do, khong phai de trong.
    """
    p = Path(matches_path)
    rows = [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]
    chon = _select(rows, ids, None)
    for m in chon:
        m["gate"]["signoff"] = {"by": by, "role": "chuyen gia gac cong", "date": date,
                                "decision": "tu_choi", "ly_do": reason}
    _write_matches(p, rows)
    dd = Path(domain_dir) if domain_dir else _domain_tu_matches(matches_path)
    n = _ghi_so(dd, chon, by, date, "tu_choi", reason)
    print(f"TU CHOI: {len(chon)}/{len(rows)} match bi {by} tu choi ngay {date}")
    print(f"  ly do: {reason}")
    print(f"  so chu ky: {_ledger_path(dd)} ({n} dong, DUOC GIT THEO DOI)")


def migrate_ledger(domain_dir, matches_path, truoc):
    """Dong khoa bang chung cho cac dong ky TRUOC khi khoa nay ton tai (16/08/2026).

    BAT BUOC co `--truoc`: duong dan toi ban claims DUNG LUC KY (lay tu git). Neu lay
    ban HIEN TAI ma dong dau thi moi dong deu khop, tuc la lang le hop thuc hoa dung cai
    thay doi ma khoa nay sinh ra de bat. Do la ky nguoc, khong phai di cu.
    """
    tp = Path(truoc)
    if not tp.exists():
        print(f"KHONG CHAY DUOC: khong thay ban claims luc ky {truoc!r}")
        return 3
    rows = [json.loads(l) for l in Path(matches_path).read_text(encoding="utf-8").splitlines() if l.strip()]
    theo_digest = {_match_khoa(m)["digest"]: m for m in rows}
    so = _read_ledger(domain_dir)
    n, thieu = 0, []
    for r in so:
        if (r.get("khoa") or {}).get("bang_chung"):
            continue
        m = theo_digest.get(r["khoa"]["digest"])
        if m is None:
            thieu.append(r.get("match_id"))
            continue
        r["khoa"]["bang_chung"] = bang_chung_digest(tp, m)
        r["khoa_bang_chung_dong_tu"] = str(truoc)
        n += 1
    _write_ledger(domain_dir, so)
    print(f"MIGRATE: dong khoa bang chung cho {n} dong so, lay tu {truoc}")
    if thieu:
        print(f"  KHONG DOI CHIEU DUOC: {', '.join(str(x) for x in thieu)} (cap khong con trong ket qua chay)")
    return 0


def restore_signoff(domain_dir, matches_path):
    """Gan lai chu ky tu so vao file match moi sinh, KHOP THEO KHOA NOI DUNG.

    Match nao doi noi dung so voi luc ky thi KHONG duoc gan lai: noi dung khac tuc la
    nguoi gac cong chua tung xem thu do. Bao ro de nguoi ky lai.
    """
    ledger = {r["khoa"]["digest"]: r for r in _read_ledger(domain_dir)}
    p = Path(matches_path)
    rows = [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]
    gan, chua, doi_bang_chung, chua_khoa = [], [], [], []
    for m in rows:
        k = _match_khoa(m)
        r = ledger.get(k["digest"])
        if r is None:
            chua.append(m["id"])
            continue
        # Chu ky chi con gia tri neu CHU CUA BANG CHUNG van dung chu luc ky.
        cu = (r.get("khoa") or {}).get("bang_chung")
        moi = bang_chung_digest(domain_dir, m)
        if cu is None:
            chua_khoa.append(m["id"])
            continue
        if cu != moi:
            doi_bang_chung.append(m["id"])
            continue
        m["gate"]["signoff"] = {"by": r["by"], "role": r["role"], "date": r["date"],
                                "decision": r["decision"]}
        if r.get("ly_do"):
            m["gate"]["signoff"]["ly_do"] = r["ly_do"]
        gan.append(m["id"])
    _write_matches(p, rows)
    print(f"RESTORE: gan lai {len(gan)}/{len(rows)} chu ky tu so")
    if gan:
        print(f"  da gan  : {', '.join(gan)}")
    if chua:
        print(f"  CHUA KY : {', '.join(chua)}  (khoa noi dung khong co trong so, phai de nguoi ky)")
    if doi_bang_chung:
        print(f"  BANG CHUNG DOI CHU: {', '.join(doi_bang_chung)}")
        print("     Cap van dung cap do, nhung CAU LAM BANG da khac luc ky. Chu ky khong duoc gan lai.")
    if chua_khoa:
        print(f"  SO CU CHUA CO KHOA BANG CHUNG: {', '.join(chua_khoa)}")
        print("     Chay `migrate-ledger` de dong khoa bang chung cho cac dong ky truoc 16/08/2026.")
    return len(chua) + len(doi_bang_chung) + len(chua_khoa)


def _canh_bao_ghi_de(out_dir, domain_dir, force):
    """Cong chan ghi de chu ky. Chay TRUOC khi run() ghi bat cu thu gi."""
    mp = out_dir / "matches.jsonl"
    if not mp.exists():
        return
    rows = [json.loads(l) for l in mp.read_text(encoding="utf-8").splitlines() if l.strip()]
    def _da_xu_ly(m):
        """Da co quyet dinh cua NGUOI hay chua.

        Tuong thich nguoc: chu ky cu KHONG co truong `decision` nhung co `by` that.
        Neu chi xet `decision` thi 7 chu ky cu cua Lam se lot luoi va bi ghi de am tham.
        Loi nay lo ra o phep thu L2 tren ban sao, truoc khi dung file that.
        """
        so = (m.get("gate") or {}).get("signoff") or {}
        if so.get("decision"):
            return True
        return bool(so.get("by")) and so.get("by") != "pending-human-review" and bool(so.get("date"))

    da_xu = [m for m in rows if _da_xu_ly(m)]
    if not da_xu:
        return
    ledger = {r["khoa"]["digest"] for r in _read_ledger(domain_dir)}
    thieu = [m["id"] for m in da_xu if _match_khoa(m)["digest"] not in ledger]
    if not thieu:
        return
    if force:
        print(f"CANH BAO --force: ghi de {len(thieu)} chu ky CHUA co trong so: {', '.join(thieu)}")
        return
    raise GateError("SIGNOFF_SE_BI_GHI_DE",
                    f"out/matches.jsonl dang co {len(thieu)} quyet dinh cua nguoi gac cong "
                    f"CHUA duoc ghi vao so ({', '.join(thieu)}). Chay lai se xoa mat. "
                    f"Cach xu ly: chay lai lenh sign/reject de ghi vao so, hoac dung --force neu that su muon bo.")


if __name__ == "__main__":
    try:
        args = [a for a in sys.argv[1:] if not a.startswith("--")]
        flags = {a for a in sys.argv[1:] if a.startswith("--")}
        if len(args) >= 2 and args[0] == "run":
            run(args[1])
        elif len(args) >= 3 and args[0] == "validate":
            validate_file(args[1], args[2], require_signoff="--require-signoff" in flags)
        elif len(args) >= 4 and args[0] == "sign":
            only = _csv_flag(sys.argv, "--only")
            exc = _csv_flag(sys.argv, "--except")
            if only and exc:
                sys.exit("Chon mot trong hai: --only hoac --except, khong dung ca hai.")
            sign_matches(args[1], args[2], args[3], only=only, exc=exc,
                         domain_dir=_val_flag(sys.argv, "--domain"))
        elif len(args) >= 3 and args[0] == "restore-signoff":
            sys.exit(2 if restore_signoff(args[1], args[2]) else 0)
        elif len(args) >= 3 and args[0] == "migrate-ledger":
            truoc = _val_flag(sys.argv, "--truoc")
            if not truoc:
                sys.exit("migrate-ledger can --truoc <claims.jsonl DUNG LUC KY, lay tu git>. "
                         "Dong dau bang ban hien tai la hop thuc hoa chinh thay doi can bat.")
            sys.exit(migrate_ledger(args[1], args[2], truoc))
        elif len(args) >= 4 and args[0] == "reject":
            ids = _csv_flag(sys.argv, "--ids")
            reason = _val_flag(sys.argv, "--reason")
            if not ids:
                sys.exit("reject can --ids MATCH-0002[,MATCH-0005]")
            if not reason:
                sys.exit("reject can --reason \"ly do tu choi\" (tu choi khong ghi ly do la vo nghia)")
            reject_matches(args[1], args[2], args[3], ids, reason,
                           domain_dir=_val_flag(sys.argv, "--domain"))
        else:
            sys.exit("usage: match_engine.py run <domain_dir> | "
                     "validate <domain_dir> <matches.jsonl> [--require-signoff] | "
                     "sign <matches.jsonl> <nguoi> <ngay> [--only ID,ID | --except ID,ID] [--domain DIR] | "
                     "reject <matches.jsonl> <nguoi_gac_cong> <ngay> --ids ID,ID --reason \"...\" | "
                     "restore-signoff <domain_dir> <matches.jsonl> | "
                     "migrate-ledger <domain_dir> <matches.jsonl> --truoc <claims.jsonl luc ky>")
    except (GateError, refinery.GateError) as e:
        print(f"GATE BITES · {e}")
        sys.exit(2)
