#!/usr/bin/env python3
"""check_du_dieu_kien.py · Cong doi chieu claim voi LUAT DU DIEU KIEN cua chinh domain.

VI SAO CO (24/08/2026): domain.yaml viet ro tu dau
    du_dieu_kien      = LAM CHU CONG NGHE: thiet ke, che tao, san xuat, nghien cuu
    khong_du_dieu_kien = VAN HANH VA KHAI THAC tren cong nghe do don vi khac lam ra
va da ap luat do de LOAI MobiFone ngay 16/08/2026, vi MobiFone thuong mai hoa 5G bang thiet
bi mua ngoai.

The nhung FECON van nam trong registry voi nang_luc_mo_ta la
    "don vi truc tiep van hanh robot dao ngam (TBM) so 1 metro Nhon - ga Ha Noi"
va ghi chu cua chinh claim do viet "FECON VAN HANH may TBM, KHONG che tao. May do hang nuoc
ngoai san xuat."

Tuc la nguoi ghi da NHIN THAY su that, ghi lai trung thuc, nhung khong rut ra ket luan ma
luat doi hoi. Mot luat chi song trong file cau hinh, khong co may nao doi chieu, thi som muon
cung co ngoai le lot qua. Va ngoai le lot qua o day rat dat: registry loai MobiFone nhung giu
FECON, tuc ap luat khong deu, va do la thu khach soi ho so se hoi dau tien.

CACH DO: tim tu khoa VAN HANH va KHAI THAC trong value cua truong nang luc. Do la phep do
tho, khong hieu nghia. No khong ket toi, no BAT PHAI TRA LOI.

MIEN TRU: note co dong "DU DIEU KIEN DA XET:" kem can cu. Dung cho ranh gioi xam ma
domain.yaml da luong truoc: don vi vua van hanh vua tu phat trien mot phan cong nghe loi.

Chay: python3 check_du_dieu_kien.py domains/don_vi_cncl
Exit 0 sach. Exit 2 co claim chua tra loi. Exit 3 KHONG CHAY DUOC.
"""
import json, sys
from pathlib import Path

TRUONG = ("nang_luc_mo_ta", "bang_chung_nang_luc")
# Tu khoa cua VE KHONG DU DIEU KIEN. Co y hep: chi bat dong tu chi viec dung cong nghe cua
# nguoi khac, khong bat cac tu chung chung nhu "cung cap" hay "trien khai" vi chung cung
# dung cho don vi tu lam ra san pham.
DAU_HIEU = ["vận hành", "khai thác", "đại lý", "phân phối lại"]
MIEN_TRU = "DU DIEU KIEN DA XET:"


def main(domain_dir):
    d = Path(domain_dir)
    cp, dy = d / "claims.jsonl", d / "domain.yaml"
    if not cp.exists() or not dy.exists():
        print("KHONG CHAY DUOC: thieu claims.jsonl hoac domain.yaml.")
        return 3
    t = dy.read_text(encoding="utf-8")
    if "khong_du_dieu_kien:" not in t:
        print("KHONG CHAY DUOC: domain.yaml khong khai khong_du_dieu_kien, khong co luat de doi chieu.")
        return 3

    claims = [json.loads(l) for l in cp.read_text(encoding="utf-8").splitlines() if l.strip()]
    hoi, mien = [], 0
    for i, c in enumerate(claims, 1):
        if not c["field"].startswith(TRUONG):
            if c["field"] not in TRUONG and not c["field"].startswith("nang_luc_mo_ta"):
                continue
        v = str(c.get("value", "")).lower()
        hit = [x for x in DAU_HIEU if x in v]
        if not hit:
            continue
        if MIEN_TRU in (c.get("note") or ""):
            mien += 1
            continue
        hoi.append((i, c, hit))

    print(f"claim: {len(claims)} · can tra loi: {len(hoi)} · da xet co can cu: {mien}")
    if hoi:
        print(f"\nCLAIM CO DAU HIEU VAN HANH, CHUA TRA LOI ({len(hoi)}):")
        for i, c, hit in hoi:
            print(f"  claim#{i} {c['entity'][:34]:34} · {c['field'][:20]:20} · {hit}")
            print(f"      {str(c['value'])[:96]}")
        print("\nFAIL: domain.yaml xep VAN HANH va KHAI THAC vao ve KHONG DU DIEU KIEN, va da")
        print("dung luat do de loai MobiFone ngay 16/08/2026. Cac claim tren chua duoc doi chieu.")
        print("Hai duong xu, ca hai deu la quyet dinh cua NGUOI:")
        print("  1. Loai don vi khoi registry, ghi ly do, giong cach da lam voi MobiFone.")
        print(f'  2. Giu lai va ghi "{MIEN_TRU} <can cu>" vao note, neu don vi co phan tu phat')
        print("     trien theo dieu khoan ranh_gioi_xam cua domain.yaml.")
        return 2

    print("\nOK: khong claim nang luc nao dua tren viec van hanh cong nghe cua don vi khac.")
    return 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("usage: check_du_dieu_kien.py <domain_dir>")
    sys.exit(main(sys.argv[1]))
