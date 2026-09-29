#!/usr/bin/env python3
"""bite_moc_thoi_gian.py · Rang cua luat 3 trong check_luat3.py (moc thoi gian vuot span).

CANH
====
TU DUNG LAY CANH: moi rang viet mot claims.jsonl rieng vao thu muc tam (tempfile.mkdtemp),
chay check_luat3.py tren file do. Registry that chi DOC (rang 8 chep registry cau that vao
thu muc tam roi moi tiem). Khong sua file that.

DIEU KIEN TRUOC
===============
Ba ban check_luat3.py (CNCLData, CaoLocMatch, Dataset_CongNgheChienLuoc) phai GIONG HET tung
byte. Chuoi cong chay ban CNCLData cho chieu cung va ban Dataset cho chieu cau; neu hai ban lech
thi hai chieu dang bi ap hai luat khac nhau ma bang van xanh.

RANG
====
RANG 1 · CANH SACH (ngay trong value co trong span)                    -> exit 0
RANG 2 · schema phang: value co ngay, span khong                       -> MOC_VUOT_SPAN
RANG 3 · schema long (capture.snapshot): nhu tren                      -> MOC_VUOT_SPAN
RANG 4 · chi mot nam (2030) trong value, span khong co                 -> MOC_VUOT_SPAN
RANG 5 · khac cach viet cung gia tri (01/07/2026 vs 1/7/2026)          -> exit 0 (khong bao oan)
RANG 6 · thang rieng 07/2026 khop ngay 1/7/2026; 08/2026 thi khong    -> 0 roi MOC_VUOT_SPAN
RANG 7 · so hieu van ban 21/2026/QD-TTg khong bi doc thanh thang 21    -> exit 0
RANG 8 · registry cau THAT, ghi lai "(tính đến 26/02/2026)" vao PRG-05  -> MOC_VUOT_SPAN, dich danh
RANG 9 · luat 1 cu van song: verbatim ma value khong nam trong span   -> VALUE_VUOT_SPAN

Chay: python3 bite_moc_thoi_gian.py      Exit 0 moi rang can · 2 co rang khong can.
"""
import json, shutil, subprocess, sys, tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
GOC = HERE.parent
CONG = HERE / "check_luat3.py"
BAN = [GOC / "CNCLData" / "check_luat3.py", GOC / "CaoLocMatch" / "check_luat3.py",
       GOC / "Dataset_CongNgheChienLuoc" / "check_luat3.py"]
CAU = GOC / "Dataset_CongNgheChienLuoc" / "claims.jsonl"

kq = []


def in_(nhan, ok, chi):
    print(f"{nhan:62s} : " + (f"CAN OK ({chi})" if ok else f"KHONG CAN !! {chi}"))
    kq.append(ok)


def phang(value, span, ex="normalized", id_="T-01"):
    return {"id": id_, "entity": "E", "field": "f", "value": value, "evidence_span": span,
            "snapshot": "s.md", "tier": "A", "extraction": ex, "note": "tom tat"}


def dai(value, span):
    return {"entity": "Don vi A", "field": "f", "value": value, "evidence_span": span,
            "capture": {"snapshot": "s.md"}, "extraction": "normalized", "note": "tom tat"}


def chay(claims, tam):
    p = Path(tempfile.mkdtemp(dir=tam)) / "claims.jsonl"
    p.write_text("".join(json.dumps(c, ensure_ascii=False) + "\n" for c in claims), encoding="utf-8")
    r = subprocess.run([sys.executable, str(CONG), str(p)], capture_output=True, text=True)
    return r.returncode, r.stdout + r.stderr


def main():
    thieu = [str(b) for b in BAN if not b.exists()]
    if thieu:
        print("KHONG CHAY DUOC: thieu " + ", ".join(thieu))
        return 3
    bytes_ = {b.read_bytes() for b in BAN}
    in_("DIEU KIEN · ba ban check_luat3.py giong het", len(bytes_) == 1,
        "1 ban" if len(bytes_) == 1 else f"{len(bytes_)} ban khac nhau")
    if not CAU.exists():
        print(f"KHONG CHAY DUOC: thieu {CAU}")
        return 3

    tam = tempfile.mkdtemp(prefix="bite_moc_")
    try:
        rc, out = chay([phang("ký ngày 12/6/2025", "ngày 12/6/2025 ban hành")], tam)
        in_("RANG 1 · canh sach -> exit 0", rc == 0, f"exit {rc}")

        rc, out = chay([phang("30/04/2026, Phó Thủ tướng ký", "Phó Thủ tướng ký Quyết định")], tam)
        in_("RANG 2 · schema phang, ngay ngoai span -> MOC_VUOT_SPAN",
            rc == 2 and "MOC_VUOT_SPAN" in out and "30/4/2026" in out, f"exit {rc}")

        rc, out = chay([dai("thành lập 05/2019", "Công ty được thành lập")], tam)
        in_("RANG 3 · schema long, thang ngoai span -> MOC_VUOT_SPAN",
            rc == 2 and "MOC_VUOT_SPAN" in out and "Don vi A" in out, f"exit {rc}")

        rc, out = chay([phang("2030: làm chủ 80%", "Làm chủ tối thiểu 80% công nghệ lõi")], tam)
        in_("RANG 4 · nam 2030 ngoai span -> MOC_VUOT_SPAN",
            rc == 2 and "MOC_VUOT_SPAN" in out and "2030" in out, f"exit {rc}")

        rc, out = chay([phang("hiệu lực 01/07/2026", "có hiệu lực từ ngày 1/7/2026")], tam)
        in_("RANG 5 · 01/07/2026 khop 1/7/2026 -> exit 0", rc == 0, f"exit {rc}")

        rc1, _ = chay([phang("từ 07/2026", "có hiệu lực từ ngày 1/7/2026")], tam)
        rc2, out2 = chay([phang("từ 08/2026", "có hiệu lực từ ngày 1/7/2026")], tam)
        in_("RANG 6 · 07/2026 khop 1/7/2026, 08/2026 thi khong",
            rc1 == 0 and rc2 == 2 and "8/2026" in out2, f"exit {rc1} va {rc2}")

        rc, out = chay([phang("QĐ 21/2026/QĐ-TTg", "Quyết định số 21/2026/QĐ-TTg của Thủ tướng")], tam)
        in_("RANG 7 · so hieu 21/2026/QD-TTg khong la thang -> exit 0", rc == 0, f"exit {rc}")

        rows = [json.loads(l) for l in CAU.read_text(encoding="utf-8").splitlines() if l.strip()]
        rc0, _ = chay(rows, tam)
        tim = [r for r in rows if r["id"] == "CNCL-PRG-05"]
        if rc0 != 0 or not tim:
            in_("RANG 8 · registry cau that, tiem lai ngay -> MOC_VUOT_SPAN", False,
                f"KHONG TIEM DUOC: registry that exit {rc0}, PRG-05 {'co' if tim else 'khong co'}")
        else:
            tim[0]["value"] += " (tính đến 26/02/2026)"
            rc, out = chay(rows, tam)
            in_("RANG 8 · registry cau that, tiem lai ngay -> MOC_VUOT_SPAN",
                rc == 2 and "MOC_VUOT_SPAN" in out and "DeAn-UAV-QuocGia" in out
                and "26/2/2026" in out, f"exit {rc}")

        rc, out = chay([phang("Viện Hàn lâm", "Viện", ex="verbatim")], tam)
        in_("RANG 9 · luat 1 cu van song -> VALUE_VUOT_SPAN",
            rc == 2 and "VALUE_VUOT_SPAN" in out, f"exit {rc}")
    finally:
        shutil.rmtree(tam, ignore_errors=True)

    can = sum(kq)
    print(f"\nBITE MOC THOI GIAN: {can}/{len(kq)} rang can")
    return 0 if can == len(kq) else 2


if __name__ == "__main__":
    sys.exit(main())
