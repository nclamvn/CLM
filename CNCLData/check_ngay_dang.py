#!/usr/bin/env python3
"""check_ngay_dang.py · Hau to ngay cua ban chup phai la NGAY NGUON DANG, khong phai ngay minh chup.

VI SAO CO (29/09/2026): check_do_tuoi.py doc tuoi nguon tu hau to _YYYYMMDD cua ten ban chup.
Ngay 29/09/2026 lo ra SAU ban chup dat hau to 20260718, tuc NGAY DUNG DATASET, trong khi bai
dang tu 22/12/2024, 04/09/2023, 27/07/2023, 24/11/2025, 22/12/2025, 10/07/2026. Tong 43 claim,
gan mot phan nam registry, co tuoi nguon bi tinh tre hon that, co claim tre gia gan BA NAM.
Khong cong nao bat, vi cong tuoi tin cai ten file, va ten file la chu cua nguoi chup.

LUAT, cho moi ban chup ma claims.jsonl tro toi:
  1. Doc ngay chup C tu dong dau "captured YYYY-MM-DD". Khong co -> KHONG CHAY DUOC.
  2. Doc ngay D tu hau to _YYYYMMDD. Khong co -> KHONG CHAY DUOC (check_do_tuoi cung se dung).
  3. D > C  -> NGAY_TUONG_LAI: nguon khong the dang sau khi minh chup.
  4. D == C va than ban chup (dong khong bat dau bang '#') KHONG chua ngay D o dang nao
     -> NGAY_CHUP_LAM_NGAY_DANG. Trung ngay chup thi phai co cau cua NGUON noi dung ngay do.
  5. Ngan sach ngan_sach_ngay_dang.txt liet ke DUNG tap ban chup dang vi pham luat 4 (co ly
     do). Them la no; sua xong ma khong xoa cung la no.
  6. TRANG TINH (them 01/10/2026, lo dinh danh 02): trang chinh chu khong co ngay dang (chan
     trang, gioi thieu, lien he) ghi dong dau "# TRANG TINH:" va dat hau to = ngay quan sat.
     Duoc mien luat 4 CHI KHI moi claim tro toi no la truong dinh danh (TRUONG_DINH_DANH):
     ten, ma so khong co tuoi theo bai bao. Mot claim nang luc tro toi trang tinh ->
     TRANG_TINH_SAI_TRUONG (nang luc can ngay dang de do do tuoi). Danh dau trang tinh ma hau to
     khac ngay chup -> TRANG_TINH_NGAY_LECH.

IN RA muc bang chung cua ngay dang cho moi ban chup: 'than' (ngay nam trong van ban nguon),
'url' (ma ngay trong URL), 'chi_nguoi_chup' (chi dong ghi chu cua nguoi chup noi ngay do).
Muc cuoi khong lam cong do, nhung la so can giam dan.

Chay: python3 check_ngay_dang.py domains/don_vi_cncl
Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
"""
import json
import re
import sys

TRUONG_DINH_DANH = {"ten_phap_nhan", "ma_so_tu_khai", "ma_so_thue"}
from datetime import date
from pathlib import Path


def mau_ngay(d):
    y, m, dd = f"{d.year}", f"{d.month:02d}", f"{d.day:02d}"
    mi, di = str(d.month), str(d.day)
    return [f"{dd}/{m}/{y}", f"{di}/{mi}/{y}", f"{dd}/{mi}/{y}", f"{di}/{m}/{y}",
            f"{dd}-{m}-{y}", f"{di}-{mi}-{y}", f"{y}-{m}-{dd}", f"{dd}.{m}.{y}",
            f"ngày {di} tháng {mi} năm {y}", f"{mi}/{di}/{y}"]


def main(argv):
    if len(argv) < 2:
        print("Dung: check_ngay_dang.py <domain_dir>")
        return 3
    dom = Path(argv[1])
    cp, snap_dir, ns = dom / "claims.jsonl", dom / "snapshots", dom / "ngan_sach_ngay_dang.txt"
    if not cp.exists():
        print(f"KHONG CHAY DUOC: thieu {cp}")
        return 3
    if not ns.exists():
        print(f"KHONG CHAY DUOC: thieu {ns}. Khoa mot chieu khong co moc thi khong con la khoa.")
        return 3
    claims = [json.loads(l) for l in cp.read_text(encoding="utf-8").splitlines() if l.strip()]
    snaps = sorted({c["capture"]["snapshot"] for c in claims})
    if not snaps:
        print("KHONG CHAY DUOC: khong co ban chup nao.")
        return 3

    vi, khong_doc, muc = [], [], {"than": 0, "url": 0, "chi_nguoi_chup": 0, "khong_thay": 0, "trang_tinh": 0}
    truong_cua = {}
    for c in claims:
        truong_cua.setdefault(c["capture"]["snapshot"], set()).add(c["field"])
    tap_vi = set()
    for s in snaps:
        p = snap_dir / s
        m = re.search(r"_(\d{8})\.", s)
        if not p.exists() or not m:
            khong_doc.append(s)
            continue
        t = p.read_text(encoding="utf-8")
        mc = re.search(r"captured (\d{4}-\d{2}-\d{2})", t)
        if not mc:
            khong_doc.append(s)
            continue
        try:
            d = date(int(m.group(1)[:4]), int(m.group(1)[4:6]), int(m.group(1)[6:]))
            c = date.fromisoformat(mc.group(1))
        except ValueError:
            khong_doc.append(s)
            continue
        dong = t.splitlines()
        than = "\n".join(l for l in dong if not l.lstrip().startswith("#"))
        dau = "\n".join(l for l in dong if l.lstrip().startswith("#"))
        url = (re.search(r"# URL:\s*(\S+)", t) or [None, ""])[1] if re.search(r"# URL:\s*(\S+)", t) else ""
        mau = mau_ngay(d)
        if any(l.lstrip().startswith("# TRANG TINH:") for l in dong):
            sai = sorted(truong_cua.get(s, set()) - TRUONG_DINH_DANH)
            if sai:
                vi.append(f"TRANG_TINH_SAI_TRUONG: {s} · trang tinh khong co ngay dang ma co claim {', '.join(sai)}")
            if d != c:
                vi.append(f"TRANG_TINH_NGAY_LECH: {s} · trang tinh phai dat hau to = ngay chup {c}, dang la {d}")
            muc["trang_tinh"] += 1
            continue
        if any(x in than for x in mau):
            muc["than"] += 1
        elif f"{d.year % 100:02d}{d.month:02d}{d.day:02d}" in url or f"{d.year}{d.month:02d}{d.day:02d}" in url:
            muc["url"] += 1
        elif any(x in dau.replace(mc.group(0), "") for x in mau):
            muc["chi_nguoi_chup"] += 1
        else:
            muc["khong_thay"] += 1
        if d > c:
            vi.append(f"NGAY_TUONG_LAI: {s} · hau to {d} sau ngay chup {c}")
        if d == c and not any(x in than for x in mau):
            tap_vi.add(s)

    if khong_doc:
        print(f"KHONG CHAY DUOC: {len(khong_doc)} ban chup khong doc duoc ngay chup hoac hau to:")
        for s in khong_doc:
            print("  " + s)
        return 3

    tap_ns = {l.split("|")[0].strip() for l in ns.read_text(encoding="utf-8").splitlines()
              if l.strip() and not l.lstrip().startswith("#")}
    for s in sorted(tap_vi - tap_ns):
        n = sum(1 for c in claims if c["capture"]["snapshot"] == s)
        vi.append(f"NGAY_CHUP_LAM_NGAY_DANG: {s} · {n} claim · hau to trung ngay chup, than ban chup khong co cau nao noi ngay do")
    for s in sorted(tap_ns - tap_vi):
        vi.append(f"DA_SUA_CHUA_XOA: {s} · khong con vi pham, xoa dong nay khoi ngan sach de khoa siet lai")

    print(f"ban chup: {len(snaps)} · bang chung ngay dang: nam trong than bai {muc['than']}, trong URL {muc['url']}, "
          f"chi nguoi chup ghi {muc['chi_nguoi_chup']}, khong thay {muc['khong_thay']}, trang tinh dinh danh {muc['trang_tinh']}")
    print(f"hau to trung ngay chup khong co can cu: {len(tap_vi)} · ngan sach: {len(tap_ns)}")
    if vi:
        print(f"\nFAIL: {len(vi)} vi pham")
        for v in vi:
            print("  " + v)
        return 2
    print("\nOK: khong ban chup nao lay ngay chup lam ngay dang ngoai ngan sach, khong ngay dang nao sau ngay chup.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
