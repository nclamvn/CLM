#!/usr/bin/env python3
"""check_khang_dinh_toi_thuong.py · Cong soi cac khang dinh DAU TIEN, DUY NHAT, LON NHAT.

VI SAO CO (24/08/2026): trong bon vong lam moi lien tiep, moi vong lai gap mot cum "dau tien"
va lan nao toi cung phai ghi canh bao rieng bang tay. Toi tuong co bon cai. Quet bang may ra
TAM. Uoc luong bang mat lech con so may dem, lan thu ba trong du an nay.

Khang dinh toi thuong nguy hon khang dinh thuong o ba diem:
  1. No la LOI MOI DOI CHIEU. Doi thu chi can chi ra mot truong hop som hon la ca ho so mat
     tin, khong chi rieng dong do.
  2. No thuong den tu MOT BAI BAO chu khong tu mot cong bo doc lap, va nha bao viet "dau
     tien" de lam tit chu khong de lam bang chung.
  3. Hai don vi co the CUNG NHAN mot ngoi vi. Ngay 24/08 da thay CT Semiconductor va FPT
     cung nhan nha may dong goi kiem thu dau tien do nguoi Viet lam chu.

LUAT: moi claim co tu toi thuong phai mang mot dong
    "KHANG DINH TOI THUONG: <pham vi chinh xac> · <ngay nguon> · <da doi chieu doc lap chua>"
Cong khong doi claim phai dung. No doi PHAM VI phai duoc viet ra, vi gan het cac vu chọi nhau
la do hai ben noi ve hai pham vi khac nhau ma cung dung mot chu.

Cong cung liet ke cac cap CUNG NHOM CUNG TU de nguoi soi. Cung nhom cung tu KHONG co nghia la
choi nhau: FPT Semiconductor "dau tien thiet ke chip thuong mai" va VSAP LAB "lab-fab dau tien
ve dong goi" deu o nhom 6 nhung hai pham vi khac han. Cong chi don ra, nguoi phan xu.

KHONG BAT "so 1": tieng Viet dung "so 1" lam SO THU TU nhieu hon lam ngoi vi. Lan chay dau
bat nham "robot dao ngam (TBM) so 1 metro Nhon", trong do "so 1" la ma may. Mot cong bao gia
thi nguoi ta se tat no.

Chay: python3 check_khang_dinh_toi_thuong.py domains/don_vi_cncl
Exit 0 sach. Exit 2 co claim chua ghi pham vi. Exit 3 KHONG CHAY DUOC.
"""
import collections, json, sys
from pathlib import Path

TU = ["đầu tiên", "duy nhất", "lớn nhất", "hàng đầu", "tiên phong", "dẫn đầu",
      "cao nhất", "tốt nhất", "nhanh nhất", "sớm nhất", "mạnh nhất"]
NHAN = "KHANG DINH TOI THUONG:"


def main(domain_dir):
    d = Path(domain_dir)
    cp = d / "claims.jsonl"
    if not cp.exists():
        print("KHONG CHAY DUOC: thieu claims.jsonl.")
        return 3
    claims = [json.loads(l) for l in cp.read_text(encoding="utf-8").splitlines() if l.strip()]

    nhom = {c["entity"]: str(c["value"]) for c in claims if c["field"] == "nhom_cncl"}
    thay, thieu = [], []
    for i, c in enumerate(claims, 1):
        v = str(c.get("value", "")).lower()
        hit = [t for t in TU if t in v]
        if not hit:
            continue
        thay.append((i, c, hit, nhom.get(c["entity"], "?")))
        if NHAN not in (c.get("note") or ""):
            thieu.append((i, c, hit))

    print(f"claim: {len(claims)} · khang dinh toi thuong: {len(thay)} · chua ghi pham vi: {len(thieu)}")

    # Cap cung nhom cung tu: don ra cho nguoi soi, KHONG tu ket luan la choi nhau.
    g = collections.defaultdict(list)
    for i, c, hit, n in thay:
        for t in hit:
            g[(n, t)].append(c["entity"])
    cap = {k: v for k, v in g.items() if len(set(v)) > 1}
    if cap:
        print("\nCUNG NHOM CUNG TU, can nguoi soi xem co choi nhau khong:")
        for (n, t), ents in sorted(cap.items()):
            print(f"  nhom {n} · '{t}' · {', '.join(sorted(set(ents)))}")

    if thieu:
        print(f"\nCHUA GHI PHAM VI ({len(thieu)}):")
        for i, c, hit in thieu:
            print(f"  claim#{i} {c['entity'][:34]:34} · {c['field'][:20]:20} · {hit}")
            print(f"      {str(c['value'])[:96]}")
        print(f'\nFAIL: moi khang dinh toi thuong phai ghi "{NHAN} <pham vi> · <ngay nguon> · '
              f'<da doi chieu doc lap chua>" vao note.')
        print("Cong khong doi claim phai dung. No doi PHAM VI phai duoc viet ra.")
        return 2

    print("\nOK: moi khang dinh toi thuong deu da ghi pham vi.")
    return 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("usage: check_khang_dinh_toi_thuong.py <domain_dir>")
    sys.exit(main(sys.argv[1]))
