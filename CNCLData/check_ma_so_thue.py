#!/usr/bin/env python3
"""check_ma_so_thue.py · Danh tinh phap nhan phai den tu cong chinh thuc, hoac de trong.

VI SAO CO (02/09/2026): registry nhan dien 44 don vi bang TEN GOI TREN BAO. Cung ngay hom do
cach nhan dien nay sai mot lan, va sai theo huong te nhat:

  Sang 02/09 toi bac cau "HTI UAS" (ten trong bai nhandan) voi "HTI Technology" (ten trong
  registry) vi hai bao cung gan san pham Horus P02 cho don vi ho goi ten. Chieu cung ngay,
  khao sat tra ra HAI PHAP NHAN KHAC NHAU: Cong ty co phan HTI UAS hoat dong tu 04/01/2026,
  con HTI Technology ung voi cong ty me. Claim da phai go ra.

Mot hub ghep cung voi cau ma ghep nham phap nhan thi sai lam do di thang toi nguoi dung. Ten
goi tren bao khong phai dinh danh; MA SO DOANH NGHIEP moi la.

HAI LUAT, va luat thu hai moi la cai kho

  1. Truong `ma_so_thue` chi duoc nhan gia tri tu CONG CHINH THUC. Trang tra cuu tong hop tu
     nhan KHONG duoc tinh, du no tien va du no thuong dung. Nap mot phap nhan dua tren nguon
     tong hop la dung cai ma registry nay ton tai de chan.
  2. DE TRONG LA HOP LE, va do la diem chinh. Phan lon don vi se khong co ma so, vi cong quoc
     gia chan truy van tu dong. Trong ma BIET LA TRONG van hon mot cai ten trung ma tuong la
     mot. Cong nay KHONG bat trong; no bat ma so den tu nguon sai, va no IN RA do phu moi lan
     chay de khoang trong khong bi quen.

KHOA MOT CHIEU: do phu chi duoc TANG. Giam la cong no, va giam ma khong sua ngan sach thi khoa
het siet, giong het ngan_sach_do_tuoi.

Chay: python3 check_ma_so_thue.py domains/don_vi_cncl
Exit 0 sach · 2 co ma so tu nguon khong chinh thuc, sai dinh dang, hoac do phu giam · 3 KHONG
CHAY DUOC.
"""
import json
import re
import sys
from pathlib import Path

TRUONG = "ma_so_thue"
NGAN_SACH = "ngan_sach_ma_so_thue.txt"

# Cong chinh thuc. Danh sach nay go cung trong cong, khong nhan tu dong lenh hay bien moi
# truong, cung ly do voi danh sach o duoc hoan trong chay_het_cong.sh: mot moi truong thieu
# thon khong duoc tu ha tieu chuan.
NGUON_CHINH_THUC = {
    "dangkykinhdoanh.gov.vn",      # Cong thong tin quoc gia ve dang ky doanh nghiep
    "dichvuthongtin.dkkd.gov.vn",  # Dich vu thong tin cua chinh cong tren
    "cbonline.ssc.gov.vn",         # Cong bo thong tin, Uy ban Chung khoan Nha nuoc
    "hnx.vn", "hose.vn",           # Hai so giao dich
}

MAU_MST = re.compile(r"^\d{10}(-\d{3})?$")


def main(argv):
    if len(argv) < 2:
        print("Dung: check_ma_so_thue.py <domain_dir>")
        return 3
    d = Path(argv[1])
    cp = d / "claims.jsonl"
    if not cp.exists():
        print(f"KHONG CHAY DUOC: thieu {cp}.")
        return 3
    claims = [json.loads(l) for l in cp.read_text(encoding="utf-8").splitlines() if l.strip()]
    if not claims:
        print("KHONG CHAY DUOC: khong co claim nao. Day khong phai PASS.")
        return 3

    thuc_the = {c["entity"] for c in claims}
    co_mst = {}
    xau_nguon, xau_dang = [], []
    for c in claims:
        if c["field"] != TRUONG:
            continue
        co_mst[c["entity"]] = c["value"]
        ng = (c.get("capture") or {}).get("source", "")
        if ng not in NGUON_CHINH_THUC:
            xau_nguon.append((c["entity"], ng))
        if not MAU_MST.match(str(c["value"]).strip()):
            xau_dang.append((c["entity"], c["value"]))

    phu = len(co_mst)
    print(f"don vi: {len(thuc_the)} · co ma so thue: {phu} · chua co: {len(thuc_the) - phu}")
    if phu:
        for e in sorted(co_mst):
            print(f"  {e[:44]:44} {co_mst[e]}")

    # KHOANG TRONG IN RA MOI LAN, ke ca khi khong co loi nao. Mot khoang trong duoc chap nhan
    # van la khoang trong; giau no di la bien chap nhan thanh quen lang.
    if phu < len(thuc_the):
        print(f"\nCON {len(thuc_the) - phu} DON VI CHUA CO DINH DANH PHAP NHAN.")
        print("Chung dang duoc nhan dien bang TEN GOI TREN BAO. Ngay 02/09/2026 cach nhan dien")
        print("do da sai mot lan voi HTI, va sai giua hai phap nhan cung mot tap doan.")
        print("De trong la hop le. Bo qua va quen la khong.")

    ns = d / NGAN_SACH
    if not ns.exists():
        print(f"\nKHONG CHAY DUOC: thieu {ns}. Khoa mot chieu can mot moc de so.")
        return 3
    try:
        moc = int(next(dg.strip() for dg in ns.read_text(encoding="utf-8").splitlines()
                       if dg.strip() and not dg.startswith("#")))
    except (StopIteration, ValueError):
        print(f"\nKHONG CHAY DUOC: khong doc duoc con so trong {ns}.")
        return 3

    ma = 0
    if xau_nguon:
        print(f"\nMA SO TU NGUON KHONG CHINH THUC ({len(xau_nguon)}):")
        for e, ng in xau_nguon:
            print(f"  {e[:44]:44} nguon '{ng}'")
        print("  Chi nhan: " + ", ".join(sorted(NGUON_CHINH_THUC)))
        ma = 2
    if xau_dang:
        print(f"\nMA SO SAI DINH DANG ({len(xau_dang)}), phai la 10 chu so hoac 10-3:")
        for e, v in xau_dang:
            print(f"  {e[:44]:44} '{v}'")
        ma = 2

    print(f"\nngan sach do phu: {moc} · thuc te: {phu}")
    if phu < moc:
        print(f"FAIL: DO PHU GIAM tu {moc} xuong {phu}. Mot dinh danh da bien mat.")
        print("Khoa mot chieu: do phu chi duoc tang. Mat mot dinh danh la mat kha nang phan biet")
        print("hai phap nhan trung ten, tuc quay lai dung cho da sai hom 02/09/2026.")
        return 2
    if phu > moc:
        print(f"FAIL(TOT): TANG DUOC {phu - moc} dinh danh. Sua {NGAN_SACH} thanh {phu} de chot")
        print("moc moi, roi chay lai. Tang ma khong ghi lai thi khoa het siet.")
        return 2
    if ma:
        return 2
    print("OK: dung ngan sach, va moi ma so hien co deu tu cong chinh thuc.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
