#!/usr/bin/env python3
"""check_chuan_hoa.py · Nhan 'normalized' khong duoc dung lam cua sau.

VI SAO CO (02/09/2026): cong check_luat3.py cam value VUOT span, nhung no kiem bang phep CHUOI
CON, va claim mang nhan `extraction: normalized` duoc mien phep do. Nhan do sinh ra cho nhung
chuan hoa that: bo dau markdown **, gop khoang trang doi, viet day du ten don vi bi goi tat.
Nhung mien tru khong co canh gac thi thanh cua sau.

Ngay 02/09/2026 do thu 14 claim van xuoi mang nhan nay thi sau ca lech, va MOT ca la loi nang,
nam duoi hai match da ky:

  Viettel · bang_chung_nang_luc
    value cu : "Bo TT&TT GIAO Tap doan Viettel phat trien Mo hinh ngon ngu lon..."
    nguon    : "Tap doan Viettel da duoc Bo TT&TT PHE DUYET LA DON VI NGHIEN CUU, THU NGHIEM
                phat trien Mo hinh ngon ngu lon..."

Duoc phe duyet de thu nghiem khong phai duoc giao nhiem vu. Chu "giao" khong co trong nguon,
va hai chu "nghien cuu, thu nghiem" bi bo mat. Khong cong nao bat duoc trong 17 ngay.

LUAT: voi TRUONG VAN XUOI mang nhan normalized, moi TU trong value phai xuat hien trong span
sau khi bo dau dinh dang. Lech thi phai co dong khai

    CHUAN HOA CO CHU DICH: <giai thich tung tu them vao den tu dau>

Cong khong doi chuan hoa phai dung. No doi chuan hoa phai duoc VIET RA, giong het cach
check_khang_dinh_toi_thuong doi pham vi phai duoc viet ra.

KHONG XET TRUONG MA SO. `nhom_cncl` co value "9", `san_pham_lien_quan` co value "22",
`loai_hinh` co value "DN": day la NHAN PHAN LOAI suy ra tu span theo luat cua domain, khong
phai trich chu. Bat chung la bao gia, va mot cong bao gia se bi nguoi ta tat.

TRUONG LA THI KHONG CHAY DUOC. Gap mot ten truong chua duoc xep vao nhom nao, cong tra 3 chu
khong doan. Doan sai ve mot ben thi bao gia, doan sai ve ben kia thi bo lot; ca hai deu te hon
la dung lai va hoi nguoi.

Chay: python3 check_chuan_hoa.py domains/don_vi_cncl
Exit 0 sach · 2 co value them tu ma chua khai · 3 KHONG CHAY DUOC.
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

# Truong VAN XUOI: value la chu trich tu span, nen so tung tu duoc.
TRUONG_VAN = {"nang_luc_mo_ta", "nang_luc_mo_ta_2", "bang_chung_nang_luc", "ten_don_vi",
              "location", "source"}

# Truong MA SO: value la nhan phan loai suy ra theo luat domain, khong phai chu trich.
TRUONG_MA_SO = {"nhom_cncl", "san_pham_lien_quan", "loai_hinh", "nhom_cncl_phu_3",
                "nhom_cncl_phu_5", "nhom_cncl_phu_6", "san_pham_phu_P23"}

NHAN = "CHUAN HOA CO CHU DICH:"

# Ky tu dinh dang bi bo truoc khi so. Day la nhung phep chuan hoa THAT ma nhan normalized
# sinh ra de phuc vu; chung khong doi nghia mot chu nao.
def chuan(s):
    s = unicodedata.normalize("NFC", s or "")
    for k in ("**", "__", "`", "*", "_"):
        s = s.replace(k, "")
    return re.sub(r"\s+", " ", s).lower()


def cac_tu(s):
    return [t for t in re.split(r"[^0-9A-Za-zÀ-ỹ]+", chuan(s)) if t]


def main(argv):
    if len(argv) < 2:
        print("Dung: check_chuan_hoa.py <domain_dir>")
        return 3
    cp = Path(argv[1]) / "claims.jsonl"
    if not cp.exists():
        print(f"KHONG CHAY DUOC: thieu {cp}.")
        return 3
    claims = [json.loads(l) for l in cp.read_text(encoding="utf-8").splitlines() if l.strip()]
    if not claims:
        print("KHONG CHAY DUOC: khong co claim nao. Day khong phai PASS.")
        return 3

    la = sorted({c["field"] for c in claims} - TRUONG_VAN - TRUONG_MA_SO)
    if la:
        print(f"KHONG CHAY DUOC: {len(la)} truong chua duoc xep nhom: {', '.join(la)}")
        print("Moi truong phai duoc xep vao TRUONG_VAN (value la chu trich tu span) hoac")
        print("TRUONG_MA_SO (value la nhan phan loai). Cong nay khong doan ho.")
        return 3

    xet, thieu, da_khai = 0, [], 0
    for i, c in enumerate(claims, 1):
        if c.get("extraction") != "normalized" or c["field"] not in TRUONG_VAN:
            continue
        xet += 1
        span = set(cac_tu(c.get("evidence_span")))
        them = [t for t in cac_tu(c.get("value")) if t not in span]
        if not them:
            continue
        if NHAN in (c.get("note") or ""):
            da_khai += 1
            continue
        thieu.append((i, c, them))

    print(f"claim: {len(claims)} · van xuoi + normalized: {xet} · co them tu: "
          f"{len(thieu) + da_khai} · trong do da khai: {da_khai}")

    if not thieu:
        print("\nOK: moi value chuan hoa deu hoac trung tu voi span, hoac da khai ly do.")
        return 0

    print(f"\nVALUE CO TU KHONG CO TRONG SPAN, CHUA KHAI ({len(thieu)}):")
    for i, c, them in thieu:
        print(f"  dong {i} · {c['entity']} · {c['field']}")
        print(f"      tu them : {', '.join(them)}")
        print(f"      value   : {str(c['value'])[:100]}")
        print(f"      span    : {str(c['evidence_span'])[:100]}")
    print(f"\nFAIL: nhan 'normalized' dang duoc dung de dua vao value nhung chu khong co trong")
    print("nguon. Hai duong xu, ca hai deu la quyet dinh cua NGUOI:")
    print("  1. Sua value cho khop nguon. Neu khop tron ven thi tra extraction ve 'verbatim'.")
    print(f'  2. Giu value va ghi vao note: "{NHAN} <giai thich tung tu them den tu dau>".')
    print("\nNgay 02/09/2026 mot claim Viettel viet 'Bo TT&TT GIAO' trong khi nguon chi noi")
    print("'duoc phe duyet la don vi NGHIEN CUU, THU NGHIEM'. No nam duoi hai match da ky va")
    print("khong cong nao bat duoc trong 17 ngay.")
    return 2


if __name__ == "__main__":
    sys.exit(main(sys.argv))
