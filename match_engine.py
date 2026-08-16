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
VERSION_V1 = "cao-loc-match/0.1.0 rule=" + RULE_V1
VERSION_V2 = "cao-loc-match/0.2.0 rule=" + RULE_V2
USE_V1 = "--rule-v1" in sys.argv
ENGINE_VERSION = VERSION_V1 if USE_V1 else VERSION_V2
RULE = RULE_V1 if USE_V1 else RULE_V2

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


def load_mapping(domain_dir):
    """Doc mapping_sp_nhom.yaml. Khong co file -> tra ve rong, rule v2 se khong neo duoc
    va PHAI bao loi thay vi im lang cho qua."""
    import yaml
    p = Path(domain_dir) / "mapping_sp_nhom.yaml"
    if not p.exists():
        raise GateError("MAPPING_MISSING",
                        f"rule v2 can {p} de neo nhom; khong co thi khong duoc doan bua")
    return yaml.safe_load(p.read_text(encoding="utf-8"))


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
    else:
        matches = make_matches_v2(cfg, facts, cfg["domain"], domain_dir)
    passed, blocked = validate_all(matches, facts, stop_on_first=False)
    # engine tu sinh ma bi chan -> bug logic, fail loud luon (khong co o Phase A sach)
    for b in blocked:
        if b["gate"] in ("MATCH_CHAIN_BROKEN", "MATCH_RATIONALE_MISSING"):
            raise GateError(b["gate"], "engine tu sinh match hong: " + b["reason"])

    out = Path(domain_dir) / ".." / ".." / "out"
    out = out.resolve()
    out.mkdir(exist_ok=True)
    (out / "facts.jsonl").write_text(
        "\n".join(json.dumps(facts[k], ensure_ascii=False, sort_keys=True) for k in sorted(facts)) + "\n",
        encoding="utf-8")
    (out / "matches.jsonl").write_text(
        "\n".join(json.dumps(m, ensure_ascii=False, sort_keys=True) for m in passed) + "\n",
        encoding="utf-8")
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
    for m in matches:
        gate_match(m, facts)
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


def sign_matches(matches_path, by, date, only=None, exc=None):
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
    ids = ", ".join(m["id"] for m in chon)
    print(f"SIGNOFF: {len(chon)}/{len(rows)} match ky boi {by} ngay {date}")
    print(f"  da ky: {ids}")


def reject_matches(matches_path, by, date, ids, reason):
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
    print(f"TU CHOI: {len(chon)}/{len(rows)} match bi {by} tu choi ngay {date}")
    print(f"  ly do: {reason}")


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
            sign_matches(args[1], args[2], args[3], only=only, exc=exc)
        elif len(args) >= 4 and args[0] == "reject":
            ids = _csv_flag(sys.argv, "--ids")
            reason = _val_flag(sys.argv, "--reason")
            if not ids:
                sys.exit("reject can --ids MATCH-0002[,MATCH-0005]")
            if not reason:
                sys.exit("reject can --reason \"ly do tu choi\" (tu choi khong ghi ly do la vo nghia)")
            reject_matches(args[1], args[2], args[3], ids, reason)
        else:
            sys.exit("usage: match_engine.py run <domain_dir> | "
                     "validate <domain_dir> <matches.jsonl> [--require-signoff] | "
                     "sign <matches.jsonl> <nguoi_gac_cong> <ngay> [--only ID,ID | --except ID,ID] | "
                     "reject <matches.jsonl> <nguoi_gac_cong> <ngay> --ids ID,ID --reason \"...\"")
    except (GateError, refinery.GateError) as e:
        print(f"GATE BITES · {e}")
        sys.exit(2)
