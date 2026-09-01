#!/usr/bin/env python3
"""check_do_tuoi.py · Cong do DO TUOI cua nguon, phan loai theo LOAI TRUONG.

VI SAO CAN (18/08/2026): domain.yaml khai refresh_days: 180 tu dau, nhung no chi la mot con
so nam trong file cau hinh. Viec ghi nhan qua han la GHI CHU TAY trong tung claim, do nguoi
viet nho ra thi ghi. Khong ai dem duoc, va ban PDF trang thai tung viet "vai don vi dua tren
bai tu 2019 toi 2022" trong khi so that la 46 claim mau-hong tren 31 don vi.

VI SAO PHAN LOAI TRUONG chu khong ap deu:
  Gia deu KHONG dong nghia voi sai. "Da san xuat thanh cong vaccine cum A/H5N1" nam trong bai
  2019 van dung nam 2026: mot thanh tuu da xay ra thi khong het han. Nhung "dang la doanh
  nghiep dan dau ve X" thi co. Ap deu 180 ngay cho moi truong se bao 70% registry qua han, mot
  con so vua to vua vo nghia, va con so vo nghia thi nguoi ta se hoc cach lo no.

  TRUONG BEN     : ten_don_vi, loai_hinh, nhom_cncl*, san_pham* . Day la DINH DANH va ANH XA
                   phan loai. Chung khong het han theo thoi gian. Doi thi doi vi phap nhan doi
                   ten hoac danh muc doi, khong phai vi bai bao cu.
  TRUONG MAU HONG: nang_luc_mo_ta*, bang_chung_nang_luc. Chung khang dinh NANG LUC HIEN CO, tuc
                   thu ma khach hang se hieu la "bay gio". Cang cu cang de bi vuot qua.

MIEN TRU: mot claim mau-hong qua han VAN qua cong neu note co dong
    "GIU NGUON CU:" kem ly do.
  Khong phai de lach. La vi co truong hop chinh dang: nguon cu ghi mot su kien da xay ra va
  khong co nguon moi nao noi khac. Nhung ly do do phai do NGUOI viet ra va nam trong git, chu
  khong duoc suy ra tu su im lang.

Chay: python3 check_do_tuoi.py domains/don_vi_cncl [--ngay YYYY-MM-DD]
Exit 0 neu khong claim mau-hong nao qua han ma thieu ly do.
Exit 2 neu con. Exit 3 neu KHONG CHAY DUOC (thieu refresh_days, khong doc duoc ngay).
"""
import json, re, sys
from datetime import date
from pathlib import Path

BEN = {"ten_don_vi", "loai_hinh", "nhom_cncl", "san_pham_lien_quan"}
BEN_TIEN_TO = ("nhom_cncl_phu_", "san_pham_phu_")
MIEN_TRU = "GIU NGUON CU:"


def loai_truong(f):
    return "ben" if f in BEN or f.startswith(BEN_TIEN_TO) else "mau_hong"


def ngay_nguon(c):
    """Ngay BAI DANG, doc tu hau to yyyymmdd trong ten ban chup.

    Khong dung capture.fetched_at: do la ngay MINH CHUP, khong phai ngay nguon viet. Chup lai
    hom nay mot bai tu 2019 khong lam bai do moi hon. Nham hai thu nay la cach de nhat de mot
    registry tu ru minh rang no dang tuoi.
    """
    m = re.search(r"_(\d{8})\.", c["capture"]["snapshot"])
    if not m:
        return None
    s = m.group(1)
    try:
        return date(int(s[:4]), int(s[4:6]), int(s[6:]))
    except ValueError:
        # NUOT CO Y: tra None chu khong nem loi, NHUNG nguoi goi khong coi None la sach.
        # main() gom moi claim co ngay None vao `khong_doc_duoc` roi tra exit 3 KHONG CHAY
        # DUOC. Nen day la fail-closed o cap ham goi chu khong phai o cap chuong bat loi.
        # Da kiem tay ngay 25/08/2026 khi dung check_fail_closed.py, khong phai gia dinh.
        return None


def doc_refresh_days(domain_dir):
    """Doc nguong. domain.yaml cho phep hai dang: so truc tiep, hoac mapping co khoa default.

    Lan chay dau (18/08/2026) cong nay TU CHOI CHAY vi chi biet dang so, trong khi file that
    dung dang mapping. No bao "KHONG CHAY DUOC" chu khong lang le lay 180 lam mac dinh. Do la
    hanh vi dung: mot cong doan gia tri no khong doc duoc thi khong con la cong.
    """
    # DOC BANG PARSER YAML THAT (sua 25/08/2026).
    #
    # Ban cu doc bang hai bieu thuc chinh quy. No CHAY DUOC, va do moi la van de: neu
    # domain.yaml hong cu phap (vi du mot cap nhay kep long trong chuoi da nhay kep, dung loi
    # da xay ra hom nay), regex van rut duoc so 180 va cong nay van bao XANH, trong khi he
    # thong that khong doc noi file do. Mot cong doc file cau truc bang regex co the XANH HON
    # CA PARSER, va no noi doi theo huong nguy nhat: bao an toan tren mot file da hong.
    #
    # Nay hong cu phap thi tra None -> cong bao KHONG CHAY DUOC. Do van la hanh vi cu: mot
    # cong doan gia tri no khong doc duoc thi khong con la cong.
    try:
        import yaml
        cfg = yaml.safe_load((Path(domain_dir) / "domain.yaml").read_text(encoding="utf-8")) or {}
    except Exception as e:
        print(f"  (domain.yaml khong parse duoc: {type(e).__name__}: {e})")
        return None
    v = cfg.get("refresh_days")
    if isinstance(v, int):
        return v
    if isinstance(v, dict) and isinstance(v.get("default"), int):
        return v["default"]
    return None


def main(domain_dir, hom_nay):
    nguong = doc_refresh_days(domain_dir)
    if nguong is None:
        print("KHONG CHAY DUOC: domain.yaml khong khai refresh_days. Day KHONG phai PASS.")
        return 3

    claims = [json.loads(l) for l in
              (Path(domain_dir) / "claims.jsonl").read_text(encoding="utf-8").splitlines() if l.strip()]

    khong_doc_duoc, qua_han, mien_tru = [], [], []
    dem = {"ben": 0, "mau_hong": 0}
    for i, c in enumerate(claims, 1):
        lt = loai_truong(c["field"])
        dem[lt] += 1
        d = ngay_nguon(c)
        if d is None:
            khong_doc_duoc.append((i, c))
            continue
        if lt != "mau_hong":
            continue
        tuoi = (hom_nay - d).days
        if tuoi <= nguong:
            continue
        if MIEN_TRU in (c.get("note") or ""):
            mien_tru.append((tuoi, c))
        else:
            qua_han.append((tuoi, c))

    print(f"nguong refresh_days = {nguong} · moc do = {hom_nay}")
    print(f"claim: {len(claims)} · truong ben {dem['ben']} · truong mau hong {dem['mau_hong']}")
    print(f"mau hong qua han: {len(qua_han)} chua co ly do · {len(mien_tru)} co ly do nguoi viet")

    if khong_doc_duoc:
        print(f"\nKHONG DOC DUOC NGAY NGUON: {len(khong_doc_duoc)} claim")
        for i, c in khong_doc_duoc[:10]:
            print(f"  claim#{i} {c['entity'][:34]} · {c['capture']['snapshot']}")
        print("  Ten ban chup phai co hau to _YYYYMMDD. Khong doc duoc ngay thi khong do duoc tuoi.")
        return 3

    # ── KHOA MOT CHIEU ────────────────────────────────────────────────────────
    # Vi sao khong bat do cho toi khi ve 0: 44 claim con lai la mon no that, phai nhieu vong
    # cao moi tra het. Mot bang bao DO suot ca thang thi nguoi ta hoc cach lo no, va luc do
    # cong mat tac dung ke ca voi loi moi. Nen cong nay khong hoi "da sach chua", no hoi
    # "co te di khong". Chi duoc phep giam.
    #
    # Giam cung BAT PHAI CAP NHAT ngan sach. Neu giam ma van xanh thi con so trong file se
    # dung yen mai o 46 va khoa mot chieu tro thanh khoa long leo.
    ns_file = Path(domain_dir) / "ngan_sach_do_tuoi.txt"
    ngan_sach = None
    if ns_file.exists():
        m = re.search(r"^\s*(\d+)\s*$", ns_file.read_text(encoding="utf-8"), re.M)
        ngan_sach = int(m.group(1)) if m else None

    if qua_han:
        print(f"\nQUA HAN, THIEU LY DO ({len(qua_han)}):")
        for tuoi, c in sorted(qua_han, key=lambda x: -x[0])[:12]:
            print(f"  {tuoi:5} ngay · {c['entity'][:36]:36} · {c['field'][:20]:20} · {c['capture']['snapshot']}")
        if len(qua_han) > 12:
            print(f"  ... con {len(qua_han) - 12} claim nua")

    if ngan_sach is None:
        print(f"\nKHONG CHAY DUOC: thieu {ns_file.name}. Ghi vao do con so hien tai ({len(qua_han)}) "
              f"de chot khoa mot chieu. Day KHONG phai PASS.")
        return 3

    print(f"\nngan sach: {ngan_sach} · thuc te: {len(qua_han)}")
    if len(qua_han) > ngan_sach:
        # Chi dung thu pham. Cong nay tu bat minh mot lan (24/08/2026): no bao "mot claim
        # mau-hong moi vua bi them" trong khi that ra khong ai them gi ca, chi la SAU NGAY
        # troi qua va vai claim vuot moc 180. Hai nguyen nhan doi hoi hai cach xu khac han,
        # nen goi chung mot ten la day nguoi ta di tim nham cho.
        vua_vuot = sorted([(t, c) for t, c in qua_han if t <= nguong + 30], key=lambda x: x[0])
        print(f"FAIL: TE DI {len(qua_han) - ngan_sach} claim so voi ngan sach.")
        if vua_vuot:
            print(f"  {len(vua_vuot)} claim vua vuot moc trong 30 ngay gan day, tuc co the chi la NGAY TROI "
                  f"chu khong phai ai them du lieu xau:")
            for t, c in vua_vuot[:6]:
                print(f"    {t:5} ngay · {c['entity'][:34]:34} · {c['field'][:20]:20} · {c['capture']['snapshot']}")
        print(f'Cach xu: cao nguon moi, HOAC ghi vao note "{MIEN_TRU} <ly do cu the>".')
        print("Neu chi vi ngay troi ma khong tim duoc nguon moi thi duoc phep nang ngan sach, NHUNG\n  phai ghi vao lich su trong file ngan sach: ngay nao, claim nao, vi sao khong mien tru duoc.\n  Nang lang le moi la bien khoa mot chieu thanh cai dong ho dem no.")
        return 2
    if len(qua_han) < ngan_sach:
        print(f"FAIL(TOT): GIAM DUOC {ngan_sach - len(qua_han)} claim. Sua {ns_file.name} thanh "
              f"{len(qua_han)} de chot lai muc moi, roi chay lai.")
        print("Bat dung o day la co y: giam ma khong ghi lai thi ngan sach dung yen va khoa het siet.")
        return 2

    print(f"OK: dung ngan sach. Con {len(qua_han)} claim mau-hong cho lam moi, khong tang them.")
    return 0


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        sys.exit("usage: check_do_tuoi.py <domain_dir> [--ngay YYYY-MM-DD]")
    n = date.today()
    if "--ngay" in sys.argv:
        n = date.fromisoformat(sys.argv[sys.argv.index("--ngay") + 1])
    sys.exit(main(args[0], n))
