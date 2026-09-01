#!/usr/bin/env python3
"""Cổng span-gate cho dataset CNCL: mọi evidence_span trong claims.jsonl
phải là chuỗi con NGUYÊN VĂN của snapshot nó trỏ tới.
Exit 0 = sạch; exit 2 = có claim hỏng (fail-loud, in rõ claim nào).
Chạy: python3 check_spans.py   (từ thư mục Dataset_CongNgheChienLuoc)
Luật đứng: không pipe lệnh này trong chuỗi ăn quyết định; đọc exit code trần.
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent
SNAP = ROOT / "snapshots"
CLAIMS = ROOT / "claims.jsonl"

def main() -> int:
    n = ok = fail = 0
    cache = {}
    seen_ids = set()
    for line in CLAIMS.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line:
            continue
        n += 1
        c = json.loads(line)
        if c["id"] in seen_ids:
            fail += 1
            print(f"DUPLICATE_ID: {c['id']}")
        seen_ids.add(c["id"])
        snap = c.get("snapshot", "")
        if snap not in cache:
            p = SNAP / snap
            cache[snap] = p.read_text(encoding="utf-8") if p.exists() else None
        txt = cache[snap]
        if txt is None:
            fail += 1
            print(f"SNAPSHOT_MISSING: {c['id']} -> {snap}")
        elif c.get("evidence_span", "") and c["evidence_span"] in txt:
            ok += 1
        else:
            fail += 1
            print(f"SPAN_NOT_FOUND: {c['id']} -> {snap}")
    print(f"claims={n} ok={ok} fail={fail}")
    if fail:
        print("GATE: FAIL")
        return 2
    print("GATE: PASS")
    return 0

if __name__ == "__main__":
    sys.exit(main())
