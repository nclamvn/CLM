#!/usr/bin/env python3
"""check_xung_dot_ky.py · Chu ky cap cung cau: dung nguoi, du nguoi, va khong tu ky cho don vi minh.

VI SAO CO (01/10/2026): nghiem thu khach quan chi ra hai rui ro tham dinh: (1) chi mot nguoi gac
cong, (2) nguoi do lam o RtR ma RtR co mat trong so nguon. Chua cap nao vi pham, va cong nay giu
cho dieu do dung mai, ke ca khi so nguoi ky tang len.

CONG KIEM (doc domains/cncl_match/signoff_ledger.jsonl va nguoi_ky.yaml):
  NGUOI_KY_LA     mot nguoi trong so ky khong co ten trong nguoi_ky.yaml.
  KY_XUNG_DOT     nguoi ky "ky" mot cap ma ben cung nam trong danh sach lien_quan cua chinh ho.
  THIEU_CHU_KY    mot cap da ky co so nguoi ky khac nhau it hon so_nguoi_ky_toi_thieu.

Chay: python3 check_xung_dot_ky.py [--so <ledger>] [--cau-hinh <yaml>]
Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
"""
import json
import sys
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
DOM = HERE / "domains" / "cncl_match"


def arg(k, mac_dinh):
    return Path(sys.argv[sys.argv.index(k) + 1]) if k in sys.argv else mac_dinh


def main():
    so, ch = arg("--so", DOM / "signoff_ledger.jsonl"), arg("--cau-hinh", DOM / "nguoi_ky.yaml")
    if not so.exists() or not ch.exists():
        print(f"KHONG CHAY DUOC: thieu {so if not so.exists() else ch}")
        return 3
    cfg = yaml.safe_load(ch.read_text(encoding="utf-8")) or {}
    toi_thieu = int(cfg.get("so_nguoi_ky_toi_thieu", 0))
    nguoi = cfg.get("nguoi_ky") or {}
    if toi_thieu < 1 or not nguoi:
        print("KHONG CHAY DUOC: nguoi_ky.yaml thieu so_nguoi_ky_toi_thieu hoac danh sach nguoi_ky")
        return 3
    dong = [json.loads(l) for l in so.read_text(encoding="utf-8").splitlines() if l.strip()]
    vi = []
    ky_cua = {}
    for d in dong:
        ai, cap = d.get("by"), d.get("match_id")
        ben = (d.get("khoa") or {}).get("supply_entity")
        if ai not in nguoi:
            vi.append(f"NGUOI_KY_LA: {cap} ky boi '{ai}' khong co trong nguoi_ky.yaml")
            continue
        if d.get("decision") == "ky":
            if ben in (nguoi[ai].get("lien_quan") or []):
                vi.append(f"KY_XUNG_DOT: {ai} ky {cap} ma ben cung '{ben}' la don vi ho lien quan")
            ky_cua.setdefault(cap, set()).add(ai)
    for cap, ai in sorted(ky_cua.items()):
        if len(ai) < toi_thieu:
            vi.append(f"THIEU_CHU_KY: {cap} co {len(ai)} nguoi ky, can {toi_thieu}")
    print(f"chu ky: {len(dong)} dong so · {len(ky_cua)} cap da ky · {len(nguoi)} nguoi ky khai bao · toi thieu {toi_thieu} nguoi/cap")
    if vi:
        print(f"\nFAIL: {len(vi)} vi pham")
        for v in vi[:40]:
            print("  " + v)
        return 2
    print("\nOK: moi chu ky dung nguoi da khai bao, du so nguoi, khong ai ky cho don vi minh lien quan.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
