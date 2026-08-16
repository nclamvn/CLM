#!/usr/bin/env python3
"""check_dash.py · Cong cung: 0 em-dash (U+2014) va en-dash (U+2013) trong moi
file Tho sinh ra. Thu muc methodbox/ la ban sao nguyen van cua Refinery
MethodBox (SOT phuong phap, giu dung tung byte de doi chieu nguon) nen KHONG
quet; quyet dinh nay ghi trong Completion Report."""
import sys
from pathlib import Path

ROOT = Path(__file__).parent
SKIP_DIRS = {"methodbox", ".git", "__pycache__"}
EXT = {".py", ".md", ".yaml", ".yml", ".json", ".jsonl", ".html", ".txt"}
# Dinh nghia bang code point de chinh file nay khong chua literal (bai hoc tu check-emdash.mjs)
# QUYET DINH LAM 16/08/2026: chi em-dash bi cam (ly do van phong, dau vet AI).
# En-dash U+2013 KHONG phai tieu chuan cung, duoc phep trong van ban va trong
# snapshot trich nguyen van. Dong bo voi CNCLData/check_dash.py.
BANNED = {chr(0x2014): "em-dash U+2014"}

hits = 0
for p in sorted(ROOT.rglob("*")):
    if not p.is_file() or p.suffix not in EXT:
        continue
    if any(part in SKIP_DIRS for part in p.relative_to(ROOT).parts):
        continue
    for i, line in enumerate(p.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
        for ch, name in BANNED.items():
            if ch in line:
                hits += 1
                print(f"{p.relative_to(ROOT)}:{i}: [{name}] {line.strip()[:80]}")
if hits:
    print(f"FAIL: {hits} dau bi cam")
    sys.exit(1)
print("OK: 0 em-dash (en-dash duoc phep tu 16/08/2026; methodbox/ khong quet)")
