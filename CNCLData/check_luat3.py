#!/usr/bin/env python3
"""check_luat3.py · Cong may cho LUAT 3: value khong duoc khai qua span.

VI SAO CO CONG NAY
------------------
Cong SPAN_NOT_FOUND cua refinery chung minh evidence_span la chuoi con cua snapshot.
No KHONG chung minh `value` la chuoi con cua `evidence_span`. Nghia la mot claim co
the tro dung snapshot, dung cau, nhung `value` lai noi nhieu hon cau do noi.

Ngay 16/08/2026 (Pha 2e) dieu nay xay ra that: claim `ten_don_vi` cua
"Vien Han lam Khoa hoc va Cong nghe Viet Nam" khai extraction=verbatim, nhung span
chi chua chu "Vien". Refinery van exit 0. Loi chi lo ra vi Chu thau go tay mot doan
script kiem. Mot quy tac phu thuoc tri nho nguoi van hanh thi khong phai cong.

LUAT
----
1. extraction = verbatim  -> value PHAI la chuoi con nguyen van cua evidence_span
   (sau chuan hoa NFC va giai HTML entity, dung cach refinery lam).
2. extraction = normalized hoac inferred -> KHONG ap luat 1, nhung BAT BUOC co `note`.
   Chuan hoa ma khong giai thich thi khong kiem duoc, va do chinh la khe ho da dung
   de sua loi o Pha 2e. Khong cho phep im lang.

CACH DUNG
---------
  python3 check_luat3.py domains/don_vi_cncl
  python3 check_luat3.py claims.jsonl
  python3 check_luat3.py /duong/dan/toi/thu/muc/co/claims.jsonl

Chay duoc tren ca hai schema dang ton tai trong du an:
  · schema long : claim co capture.snapshot   (CNCLData, CaoLocMatch)
  · schema phang: claim co snapshot o goc      (Dataset_CongNgheChienLuoc)
Luat 3 khong dung toi snapshot nen ca hai deu chay duoc, ham _snap chi de in cho de tra.

EXIT CODE (doc tran, khong pipe)
  0 · sach
  2 · co vi pham (in dich danh)
"""
import json, sys, html, unicodedata
from pathlib import Path

VALID_EXTRACTION = {"verbatim", "normalized", "inferred"}


def norm(s):
    """Chuan hoa giong refinery: giai HTML entity roi NFC."""
    return unicodedata.normalize("NFC", html.unescape(str(s) if s is not None else ""))


def _snap(c):
    cap = c.get("capture") or {}
    return cap.get("snapshot") or c.get("snapshot") or "(khong khai snapshot)"


def _ten(c):
    """Nhan dien claim cho de tra: schema long dung entity, schema phang dung id."""
    return c.get("entity") or c.get("id") or "(khong ten)"


def resolve(arg):
    p = Path(arg)
    if p.is_dir():
        p = p / "claims.jsonl"
    if not p.exists():
        print(f"KHONG THAY FILE: {p}")
        sys.exit(2)
    return p


def main(argv):
    if len(argv) < 2:
        print("Dung: check_luat3.py <domain_dir hoac claims.jsonl>")
        return 2
    p = resolve(argv[1])

    n = viol = 0
    dem = {"verbatim": 0, "normalized": 0, "inferred": 0, "khac": 0}

    for i, line in enumerate(p.read_text(encoding="utf-8").splitlines(), 1):
        if not line.strip():
            continue
        n += 1
        c = json.loads(line)
        ex = c.get("extraction")
        dem[ex if ex in VALID_EXTRACTION else "khac"] += 1

        if ex not in VALID_EXTRACTION:
            viol += 1
            print(f"EXTRACTION_LA {ex!r}: dong {i} · {_ten(c)} / {c.get('field')}")
            continue

        if ex == "verbatim":
            v, s = norm(c.get("value")), norm(c.get("evidence_span"))
            if v not in s:
                viol += 1
                print(f"VALUE_VUOT_SPAN: dong {i} · {_ten(c)} / {c.get('field')}")
                print(f"    value : {v[:90]}")
                print(f"    span  : {s[:90]}")
                print(f"    snapshot: {_snap(c)}")
        else:
            if not str(c.get("note") or "").strip():
                viol += 1
                print(f"THIEU_NOTE: dong {i} · {_ten(c)} / {c.get('field')} "
                      f"(extraction={ex} ma khong giai thich)")

    print("-" * 62)
    print(f"claim: {n} · verbatim {dem['verbatim']} · normalized {dem['normalized']} "
          f"· inferred {dem['inferred']}" + (f" · khac {dem['khac']}" if dem["khac"] else ""))
    if viol:
        print(f"FAIL: {viol} vi pham luat 3.")
        return 2
    print("OK: khong claim nao khai qua span, moi chuan hoa deu co giai thich.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
