#!/usr/bin/env python3
"""dieu_phoi.py · Lenh GHI mot viec nguoi da lam vao so su kien dieu phoi (07/10/2026).

Chi nguoi chay lenh nay, sau khi da lam viec that (duyet ung vien, gui loi gioi thieu, nhan phan
hoi, co ket qua). May khong tu ghi. Lenh kiem toan bo so SAU KHI THEM dong moi bang dung luat cua
check_dieu_phoi.py; vi pham thi tu choi, so khong doi.

Mac dinh CHAY THU (in dong se ghi). Them --ghi moi ghi.

Vi du:
  python3 dieu_phoi.py duyet_ung_vien --nhu-cau btl-01 --don-vi VinBigData --nguoi "Lam Nguyen" \\
      --noi-dung "Cau nguon VinBigData ve giao thong thong minh khop doi tuong bai toan." --ghi
  python3 dieu_phoi.py gioi_thieu --nhu-cau btl-01 --don-vi VinBigData --nguoi "Lam Nguyen" \\
      --noi-dung "Email gioi thieu toi dau moi So KH&CN Ha Noi va VinBigData." --ghi
  python3 dieu_phoi.py phan_hoi --nhu-cau btl-01 --don-vi VinBigData --ben cung --y quan_tam ...
  python3 dieu_phoi.py ket_qua --nhu-cau btl-01 --don-vi VinBigData --ket-qua gap ...
  python3 dieu_phoi.py dong_nhu_cau --nhu-cau btl-01 --nguoi "Lam Nguyen" --noi-dung "Ha Noi da chon don vi." --ghi

Loai: duyet_ung_vien, tu_choi_ung_vien, gioi_thieu, phan_hoi (--ben cung|cau, --y quan_tam|tu_choi|chua_ro),
      ket_qua (--ket-qua gap|thi_diem|hop_dong|dung), dong_nhu_cau.
Exit 0 xong · 2 tu choi · 3 KHONG CHAY DUOC.
"""
import json
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path

import check_dieu_phoi as C

HERE = Path(__file__).resolve().parent


def lay(a, k):
    return a[a.index(k) + 1] if k in a else None


def main():
    a = sys.argv[1:]
    if not a or a[0] not in C.LOAI:
        print(f"KHONG CHAY DUOC: loai su kien phai la mot trong {', '.join(C.LOAI)}")
        return 3
    loai = a[0]
    dom = Path(lay(a, "--dom")).resolve() if lay(a, "--dom") else HERE / "domains" / "dieu_phoi"
    nk = Path(lay(a, "--nguoi-ky")).resolve() if lay(a, "--nguoi-ky") else HERE / "domains" / "cncl_match" / "nguoi_ky.yaml"
    cncl = Path(lay(a, "--cncl")).resolve() if lay(a, "--cncl") else HERE.parent / "CNCLData"
    gy = HERE.parent / ".touch" / "lib" / "hub-cau-that.json"
    tho, sk, cfg, nguoi, don_vi, nhu_cau, goi_y = C.nap(dom, nk, cncl, gy)
    luc = lay(a, "--luc") or datetime.now(timezone(timedelta(hours=7))).isoformat(timespec="seconds")
    e = {"stt": len(sk) + 1, "luc": luc, "loai": loai, "nhu_cau": lay(a, "--nhu-cau"), "nguoi": lay(a, "--nguoi"),
         "noi_dung": lay(a, "--noi-dung")}
    if loai != "dong_nhu_cau":
        e["don_vi"] = lay(a, "--don-vi")
    if loai == "phan_hoi":
        e["ben"], e["y"] = lay(a, "--ben"), lay(a, "--y")
    if loai == "ket_qua":
        e["ket_qua"] = lay(a, "--ket-qua")
    e["truoc"] = C.bam(tho[-1]) if tho else "GOC"
    dong = json.dumps(e, ensure_ascii=False)
    vi = C.kiem(tho + [dong], sk + [e], cfg, nguoi, don_vi, nhu_cau, goi_y)
    if vi:
        print("TU CHOI: so se vi pham neu ghi dong nay")
        for x in vi:
            print("  " + x)
        return 2
    print(("GHI: " if "--ghi" in a else "CHAY THU (them --ghi de ghi): ") + dong)
    if "--ghi" in a:
        with (dom / "su_kien.jsonl").open("a", encoding="utf-8") as g:
            g.write(dong + "\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
