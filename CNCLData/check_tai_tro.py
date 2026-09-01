#!/usr/bin/env python3
"""check_tai_tro.py · Cong chan NOI DUNG CO TAI TRO bi dung nhu bao chi doc lap.

VI SAO CO (24/08/2026): di tim nguon lam moi cho CT Semiconductor, gap mot bai tren
nhandan.vn ngay 20/08/2026 dung chu de, du tuoi, dung cap. Suyt nap. Ngay duoi muc chuyen
muc co mot dong nho: "Noi dung co tai tro".

Bai do do doanh nghiep tra tien dang. No khong sai su that, nhung no KHONG PHAI bao chi doc
lap, va toan bo gia tri cua tier A/B nam o cho nguon doc lap voi don vi duoc noi toi. Nap
no vao roi ghi tier B la bien mot thong cao bao chi thanh mot xac nhan cua bao.

Cai bay o day rat kin: bai nam tren dung ten mien tier B, dung tac gia, dung dinh dang. Chi
mot dong chu nho phan biet. Lan sau nguoi cao voi vang se khong nhin thay dong do, nen phai
co may nhin ho.

LUAT: claim nao trich mot ban chup CO DAU HIEU TAI TRO thi phai:
  - tier C, HOAC
  - note co dong "NOI DUNG TAI TRO:" kem ly do van dung duoc.
Khong thi cong no.

GIOI HAN PHAI NOI RA: cong nay chi thay dau hieu NAM TRONG ban chup. Bai tai tro khong ghi
nhan, hoac nguoi ghi snapshot cat mat dong do, thi cong khong biet. No thu hep cua, khong
khoa duoc cua.

Chay: python3 check_tai_tro.py domains/don_vi_cncl
Exit 0 sach. Exit 2 co claim vi pham. Exit 3 KHONG CHAY DUOC.
"""
import json, re, sys
from pathlib import Path

# Dau hieu, viet thuong de so khong phan biet hoa thuong.
DAU_HIEU = [
    "nội dung có tài trợ", "noi dung co tai tro",
    "bài viết được tài trợ", "bai viet duoc tai tro",
    "nội dung tài trợ", "tin tài trợ",
    "sponsored content", "advertorial", "paid post",
]
MIEN_TRU = "NOI DUNG TAI TRO:"


def main(domain_dir):
    d = Path(domain_dir)
    cp, sp = d / "claims.jsonl", d / "snapshots"
    if not cp.exists() or not sp.exists():
        print("KHONG CHAY DUOC: thieu claims.jsonl hoac thu muc snapshots.")
        return 3

    co_tai_tro = {}
    for f in sorted(sp.iterdir()):
        if not f.is_file():
            continue
        t = f.read_text(encoding="utf-8", errors="replace").lower()
        hit = [x for x in DAU_HIEU if x in t]
        if hit:
            co_tai_tro[f.name] = hit

    claims = [json.loads(l) for l in cp.read_text(encoding="utf-8").splitlines() if l.strip()]
    pham = []
    for i, c in enumerate(claims, 1):
        snap = (c.get("capture") or {}).get("snapshot")
        if snap not in co_tai_tro:
            continue
        if c.get("tier") == "C" or MIEN_TRU in (c.get("note") or ""):
            continue
        pham.append((i, c, co_tai_tro[snap]))

    print(f"ban chup: {len(list(sp.iterdir()))} · co dau hieu tai tro: {len(co_tai_tro)}")
    for ten, hit in co_tai_tro.items():
        print(f"  [TAI TRO] {ten}  ({', '.join(hit)})")

    if pham:
        print(f"\nVI PHAM ({len(pham)}): claim trich bai tai tro ma van de tier A hoac B")
        for i, c, hit in pham:
            print(f"  claim#{i} {c['entity'][:36]:36} · {c['field'][:20]:20} · tier {c['tier']} · {c['capture']['snapshot']}")
        print(f'\nFAIL: bai co tai tro khong phai bao chi doc lap. Ha xuong tier C, HOAC ghi'
              f' "{MIEN_TRU} <ly do>" vao note neu van co can cu dung duoc.')
        return 2

    print("\nOK: khong claim nao dung bai tai tro nhu nguon doc lap.")
    return 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("usage: check_tai_tro.py <domain_dir>")
    sys.exit(main(sys.argv[1]))
