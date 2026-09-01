#!/usr/bin/env python3
"""check_rang_khai_canh.py · Moi bo rang phai KHAI CANH cua no. TIP-03.

VI SAO CO (25/08/2026): trong hai ngay, BON lan mot bo rang gay khong phai vi engine sai ma vi
CANH cua no bien mat.

  24/08  RANG 3 bite_chay_het_cong doi "tat ca xanh"      -> vo hom du_dieu_kien do DUNG
  24/08  RANG 2 va 4b bite_gop_cap doi "co nhan chua_duyet" -> vo ngay sau khi Lam ky MATCH-0005
  25/08  RANG 4 bite-truong-hien go cung so ngan sach     -> vo ngay sau khi tra no loai_hinh
  25/08  Ba rang .touch chep san file .ts                 -> vo khi doi nguon doc sang .json

Bon lan cung mot hinh dang thi khong con la so suat, no la mot thoi quen viet rang.

LUAT: rang phai mo ta HANH VI can do, khong mo ta FILE cu the. Moi file bite_* / bite-* phai
co mot khoi

    CANH
    ====
    <canh den tu dau, va neu du lieu that doi thi rang con can khong>

CONG NAY KHONG DOC DUOC Y NGHIA cua khoi do. No bat buoc khoi phai ton tai, giong het cach
cong khang_dinh_toi_thuong khong doi claim phai dung ma doi pham vi phai duoc viet ra.

MOT RANG CO RANG: neu khoi CANH noi "TU DUNG" ma trong ma khong he co cho dung thu muc tam
(mkdtemp, tmpdir, ban_tam) thi loi khai khong khop voi ma -> DO. Khong the khai bua cho qua.

Chay: python3 check_rang_khai_canh.py
Exit 0 sach · 2 co bo rang chua khai hoac khai khong khop · 3 KHONG CHAY DUOC.
"""
import re
import sys
from pathlib import Path

GOC = [Path("/Users/os"), *sorted(Path("/sessions").glob("*/mnt"))]
KHO = ["CNCLData", "CaoLocMatch", ".touch"]
KHOI = "CANH"
TU_DUNG = "TU DUNG"
DAU_HIEU_TAM = ("mkdtemp", "tmpdir", "ban_tam", "mkdtempSync", "tempfile")


def tim_kho():
    ra = []
    for k in KHO:
        for g in GOC:
            if (g / k).is_dir():
                ra.append(g / k)
                break
    return ra


def la_rang(p):
    return (p.suffix in (".py", ".mjs")
            and (p.name.startswith("bite_") or p.name.startswith("bite-"))
            and "node_modules" not in str(p))


def main():
    khos = tim_kho()
    # PHAI CO DU CA BA KHO, khong duoc quet mot phan roi bao sach.
    #
    # VI SAO (phat hien 25/08/2026 khi dung CI cho TIP-04): ba kho la ba repo RIENG TU. Trong
    # mot moi truong chi checkout duoc mot repo, ham nay se tim thay 1 kho, quet mot phan so
    # file, va bao XANH. Do dung la ho loi ma ca TIP-02 di sua: mot phep kiem nhin vao mot lat
    # cat roi duoc doc nhu the no nhin toan canh.
    #
    # Thieu kho la KHONG CHAY DUOC, khong phai sach.
    if len(khos) < len(KHO):
        co = {p.name for p in khos}
        thieu_kho = [k for k in KHO if k not in co]
        print(f"KHONG CHAY DUOC: chi thay {len(khos)}/{len(KHO)} kho. Thieu: {', '.join(thieu_kho)}.")
        print("Quet mot phan roi bao sach chinh la kieu noi doi ma cong nay duoc dung de chan.")
        return 3
    rang = [p for kho in khos for p in sorted(kho.rglob("*")) if p.is_file() and la_rang(p)]
    if not rang:
        print("KHONG CHAY DUOC: khong tim thay bo rang nao. Day khong phai PASS.")
        return 3

    thieu, lech, hong, dat = [], [], [], []
    for p in rang:
        van = p.read_text(encoding="utf-8", errors="replace")
        # CU PHAP TRUOC DA, ROI MOI DEN NOI DUNG (them 25/08/2026, ngay lan chay thu hai).
        #
        # Ban dau cong nay chi tim chu "CANH" trong van ban. Toi chen khoi CANH vao 5 file
        # bite bang mot script, script chen NHAM ra ngoai docstring, ca 5 file HONG CU PHAP,
        # va cong nay van bao XANH ca 9. Mot cong doc file ma khong kiem file con chay duoc
        # thi no XANH HON CA PARSER, dung cai ho loi ma TIP-02 vua di sua.
        #
        # Lan thu sau trong hai ngay. Lan nay do chinh toi gay ra va chinh cong cua toi chung
        # nhan cho no.
        if p.suffix == ".py":
            try:
                import ast
                ast.parse(van)
            except SyntaxError as e:
                hong.append((p, f"dong {e.lineno}: {e.msg}"))
                continue
        # Khoi CANH phai la mot tieu de rieng, khong phai chu CANH nam lac trong cau van.
        m = re.search(r"^\s*\**\s*" + KHOI + r"\s*$\n\s*\**\s*=+\s*$", van, re.M)
        if not m:
            thieu.append(p)
            continue
        # Lay tu khoi CANH toi tieu de ke tiep hoac 40 dong, tuy cai nao den truoc.
        sau = van[m.end():]
        het = re.search(r"^\s*\**\s*[A-Z][A-Z ]{2,}\s*$\n\s*\**\s*=+\s*$", sau, re.M)
        noi_dung = sau[:het.start()] if het else "\n".join(sau.split("\n")[:40])
        if TU_DUNG in noi_dung.upper() and not any(d in van for d in DAU_HIEU_TAM):
            lech.append(p)
            continue
        dat.append(p)

    print(f"bo rang: {len(rang)} · da khai CANH: {len(dat)} · chua khai: {len(thieu)} "
          f"· khai khong khop ma: {len(lech)} · hong cu phap: {len(hong)}")
    ma = 0
    if hong:
        print(f"\nHONG CU PHAP ({len(hong)}), khong doc noi thi khong xet noi dung:")
        for p, chi in hong:
            print(f"  {p.name}  {chi}")
        ma = 2
    if thieu:
        print(f"\nCHUA KHAI CANH ({len(thieu)}):")
        for p in thieu:
            print(f"  {p.name}")
        ma = 2
    if lech:
        print(f"\nKHAI 'TU DUNG' MA MA KHONG CO THU MUC TAM ({len(lech)}):")
        for p in lech:
            print(f"  {p.name}  (khong thay {', '.join(DAU_HIEU_TAM)})")
        ma = 2
    if ma:
        print(f"\nFAIL: moi file bite_* phai co khoi\n")
        print(f"    {KHOI}\n    ====\n    <canh den tu dau, va neu du lieu that doi thi rang con can khong>\n")
        print("Bon lan trong hai ngay mot bo rang gay vi canh cua no bien mat chu khong vi")
        print("engine sai. Rang phai mo ta HANH VI can do, khong mo ta FILE cu the.")
        return 2
    print("\nOK: moi bo rang deu da khai canh, va loi khai khop voi ma.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
