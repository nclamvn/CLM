#!/usr/bin/env python3
"""bite_xung_dot_ky.py · Rang cua check_xung_dot_ky.py.

CANH
====
TU DUNG LAY CANH: chep signoff_ledger.jsonl va nguoi_ky.yaml vao thu muc tam (tempfile.mkdtemp),
tiem loi vao BAN SAO. So ky that khong bi cham. Phep tiem dung nguoi ky dau tien trong cau hinh
va don vi dau tien trong danh sach lien_quan cua ho, nen cau hinh doi thi rang van can.

RANG
====
RANG 1 · canh sach -> exit 0.
RANG 2 · them dong "ky" cua nguoi gac cong cho cap co ben cung la don vi ho lien quan -> KY_XUNG_DOT.
RANG 3 · them dong ky cua mot nguoi chua khai bao -> NGUOI_KY_LA.
RANG 4 · nang so_nguoi_ky_toi_thieu len 2 -> THIEU_CHU_KY.

Chay: python3 bite_xung_dot_ky.py     Exit 0 moi rang can · 2 co rang khong can.
"""
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
DOM = HERE / "domains" / "cncl_match"
CONG = HERE / "check_xung_dot_ky.py"
kq = []


def rang(nhan, sua, ma, ky=None):
    t = Path(tempfile.mkdtemp(prefix="bite_xung_dot_"))
    try:
        so, ch = t / "so.jsonl", t / "ch.yaml"
        shutil.copy(DOM / "signoff_ledger.jsonl", so)
        shutil.copy(DOM / "nguoi_ky.yaml", ch)
        if sua:
            sua(so, ch)
        r = subprocess.run([sys.executable, str(CONG), "--so", str(so), "--cau-hinh", str(ch)], capture_output=True, text=True)
        ok = r.returncode == ma and (ky is None or ky in r.stdout)
        print(f"{nhan:<62} : {'CAN OK' if ok else 'KHONG CAN !!'} (exit {r.returncode})")
        kq.append(ok)
    finally:
        shutil.rmtree(t, ignore_errors=True)


def them(so, d):
    so.write_text(so.read_text(encoding="utf-8") + json.dumps(d, ensure_ascii=False) + "\n", encoding="utf-8")


def r2(so, ch):
    cfg = yaml.safe_load(ch.read_text(encoding="utf-8"))
    ai, x = next((a, x) for a, x in cfg["nguoi_ky"].items() if x.get("lien_quan"))
    them(so, {"by": ai, "decision": "ky", "match_id": "MATCH-9999", "khoa": {"supply_entity": x["lien_quan"][0]}})


def r3(so, ch):
    them(so, {"by": "Nguoi Chua Khai", "decision": "ky", "match_id": "MATCH-9998", "khoa": {"supply_entity": "X"}})


def r4(so, ch):
    cfg = yaml.safe_load(ch.read_text(encoding="utf-8"))
    cfg["so_nguoi_ky_toi_thieu"] = 2
    ch.write_text(yaml.safe_dump(cfg, allow_unicode=True), encoding="utf-8")


rang("RANG 1 · canh sach -> exit 0", None, 0)
rang("RANG 2 · ky cho don vi minh lien quan -> KY_XUNG_DOT", r2, 2, "KY_XUNG_DOT")
rang("RANG 3 · nguoi ky chua khai bao -> NGUOI_KY_LA", r3, 2, "NGUOI_KY_LA")
rang("RANG 4 · luat hai nguoi ky -> THIEU_CHU_KY", r4, 2, "THIEU_CHU_KY")
can = sum(kq)
print(f"\nBITE XUNG DOT KY: {can}/{len(kq)} rang can")
sys.exit(0 if can == len(kq) else 2)
