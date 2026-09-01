#!/usr/bin/env python3
"""match_bites.py · 4 rang cua match gate theo 04.C (tin cong sau khi thay no can).

Moi bite: copy artefact (out/facts.jsonl + out/matches.jsonl) ra thu muc tam,
tiem dung MOT loi loai do, chay `match_engine.py validate` nhu subprocess that,
ky vong exit 2 + ten rang trong stdout, roi vut ban tam.

Chay:  python match_bites.py
"""
import json, shutil, subprocess, sys, tempfile
from pathlib import Path

ROOT = Path(__file__).parent
DOMAIN = ROOT / "domains" / "dich_vu_solo_entrepreneur"
OUT = ROOT / "out"


def _load(p):
    return [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]


def _dump(rows, p):
    p.write_text("\n".join(json.dumps(r, ensure_ascii=False, sort_keys=True) for r in rows) + "\n",
                 encoding="utf-8")


def _copy_workspace():
    """Ban sao du de validate chay: domains/ + out/ + engine + methodbox."""
    tmp = Path(tempfile.mkdtemp(prefix="matchbite_"))
    shutil.copytree(ROOT / "domains", tmp / "domains")
    shutil.copytree(OUT, tmp / "out")
    shutil.copytree(ROOT / "methodbox", tmp / "methodbox")
    shutil.copy(ROOT / "match_engine.py", tmp / "match_engine.py")
    return tmp


def _expect_bite(tmp, want_gate):
    r = subprocess.run(
        [sys.executable, str(tmp / "match_engine.py"), "validate",
         str(tmp / "domains" / "dich_vu_solo_entrepreneur"), str(tmp / "out" / "matches.jsonl")],
        capture_output=True, text=True)
    bit = (r.returncode == 2) and (want_gate in r.stdout)
    last = r.stdout.strip().splitlines()[-1] if r.stdout.strip() else r.stderr.strip()
    return bit, last


def bite_chain_broken(tmp):
    """04.C.1 · match tro toi fact khong ton tai."""
    mp = tmp / "out" / "matches.jsonl"
    rows = _load(mp)
    rows[0]["demand"]["need_fact_ids"] = ["FACT-khongtontai"]
    _dump(rows, mp)
    return _expect_bite(tmp, "MATCH_CHAIN_BROKEN")


def bite_fact_no_evidence(tmp):
    """04.C.2 · fact duoc tham chieu nhung mat evidence_span trong registry artefact."""
    mp = tmp / "out" / "matches.jsonl"
    fp = tmp / "out" / "facts.jsonl"
    rows = _load(mp)
    victim = rows[0]["supply"]["capability_fact_ids"][0]
    facts = _load(fp)
    for f in facts:
        if f["id"] == victim:
            f["evidence"] = []
    _dump(facts, fp)
    return _expect_bite(tmp, "MATCH_FACT_NO_EVIDENCE")


def bite_rationale_missing(tmp):
    """04.C.3 · match thieu rule / matched_fields."""
    mp = tmp / "out" / "matches.jsonl"
    rows = _load(mp)
    del rows[0]["rationale"]["rule"]
    rows[0]["rationale"]["matched_fields"] = []
    _dump(rows, mp)
    return _expect_bite(tmp, "MATCH_RATIONALE_MISSING")


def bite_claim_as_fact(tmp):
    """04.C.4 · match dung fact tier claim lam can cu chinh ma khong khai unverified."""
    mp = tmp / "out" / "matches.jsonl"
    rows = _load(mp)
    victim = next((r for r in rows if any("CAN CU CHINH" in (u.get("note") or "") for u in r.get("unverified", []))), None)
    if victim is None:
        return None, "N/A · khong co match can cu claim de tiem"
    victim["unverified"] = []
    _dump(rows, mp)
    return _expect_bite(tmp, "MATCH_CLAIM_AS_FACT")


BITES = [
    ("MATCH_CHAIN_BROKEN", bite_chain_broken),
    ("MATCH_FACT_NO_EVIDENCE", bite_fact_no_evidence),
    ("MATCH_RATIONALE_MISSING", bite_rationale_missing),
    ("MATCH_CLAIM_AS_FACT", bite_claim_as_fact),
]


def main():
    # positive control: artefact sach phai validate PASS
    clean = subprocess.run(
        [sys.executable, str(ROOT / "match_engine.py"), "validate", str(DOMAIN), str(OUT / "matches.jsonl")],
        capture_output=True, text=True)
    ok0 = clean.returncode == 0
    print(f"{'CLEAN (positive control)':28s} : ", "PASS exit0" if ok0 else f"!! exit{clean.returncode}")
    print("-" * 60)
    all_ok = ok0
    for name, fn in BITES:
        tmp = _copy_workspace()
        try:
            bit, last = fn(tmp)
        finally:
            shutil.rmtree(tmp, ignore_errors=True)
        if bit is None:
            print(f"{name:28s} :  N/A ({last})")
            continue
        all_ok = all_ok and bit
        print(f"{name:28s} : ", "CAN OK (exit 2)" if bit else f"KHONG CAN !!  [{last}]")
    print("-" * 60)
    print("MATCH BITES:", "TAT CA RANG CAN" if all_ok else "CO RANG KHONG CAN")
    return 0 if all_ok else 1


if __name__ == "__main__":
    sys.exit(main())
