#!/usr/bin/env python3
"""check_hang_cho.py · Cong cua VONG TU CHAY: hang cho con nguyen ven, va may CHUA ghi registry.

VI SAO CO (29/09/2026): tu hom nay mot agent chay theo lich, doc nguon va de xuat claim ma
khong co nguoi ngoi canh. Hai thu phai dung duoc ca khi khong ai nhin:

  1. CHI DE XUAT. Khong claim nao trong claims.jsonl duoc tro toi ban tai cua vong tu chay
     ma khong co dong duyet cua NGUOI trong duyet.jsonl. May ghi thang vao registry la dung
     cai ma nguyen tac "agent de xuat, cong quyet" dung ra de chan.
  2. HANG CHO KHONG TRAO. Moi dong trong hang cho phai con khop voi ban tai no tro toi: file
     con, van tay sha256 khong doi, span con nguyen van. Sua ban tai sau khi nap, hay sua span
     trong hang cho cho de duyet, deu lam van tay hoac span lech va cong nay do.

Kem theo, cong kiem so hoc cua nhat ky: moi luot so_de_xuat == so_nhan + so_loai, va so dong
that trong hang_cho / loai cua luot do bang dung so da ghi.

KHONG CO LUOT NAO THI KHONG CHAY DUOC, khong phai xanh. Vang tin khong phai tin tot.

Cong IN RA, khong cam: so luot, luot gan nhat cach day bao nhieu ngay, hang cho dang doi,
va do chinh xac tren mau nguoi da duyet. Luot dung chay khong lam cong do (CI khong thay
duoc file chua commit), nhung con so ngay in ra moi lan de khong ai doc nham la vong con song.

Chay: python3 check_hang_cho.py [--goc <dir>]
Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
"""
import argparse
import sys
from collections import Counter
from datetime import date, datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from vtc_chung import chuan, doc_jsonl, duong, goc_mac_dinh, sha  # noqa: E402

TRANG_THAI = {"cho_nguoi", "da_nhan", "da_bac"}
KET_LUAN = {"nhan", "bac"}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--goc", default=str(goc_mac_dinh()))
    a = ap.parse_args()
    D = duong(a.goc)

    if not D["claims"].exists():
        print(f"KHONG CHAY DUOC: thieu {D['claims']}.")
        return 3
    nk = doc_jsonl(D["nhat_ky"])
    if not nk:
        print("KHONG CHAY DUOC: nhat_ky.jsonl rong. Vong tu chay chua co luot nao, khong co gi de kiem.")
        return 3

    claims = doc_jsonl(D["claims"])
    hc = doc_jsonl(D["hang_cho"])
    loai = doc_jsonl(D["loai"])
    duyet = doc_jsonl(D["duyet"])
    vi_pham = []

    # 1. CHI DE XUAT
    da_duyet_nhan = {d.get("id") for d in duyet if d.get("ket_luan") == "nhan" and d.get("nguoi")}
    for i, c in enumerate(claims, 1):
        snap = (c.get("capture") or {}).get("snapshot") or ""
        tu_vong = snap.startswith("vong_tu_chay/") or "hang_cho_id" in c
        if tu_vong and c.get("hang_cho_id") not in da_duyet_nhan:
            vi_pham.append(f"CHI_DE_XUAT: claim dong {i} ({c.get('entity')} · {c.get('field')}) den tu "
                           f"vong tu chay ma khong co dong duyet 'nhan' co ten nguoi")

    # 2. HANG CHO KHONG TRAO
    dem_id = Counter(h.get("id") for h in hc)
    for k, n in dem_id.items():
        if n > 1:
            vi_pham.append(f"TRUNG_ID: {k} xuat hien {n} lan trong hang cho")
    for h in hc:
        hid = h.get("id")
        if h.get("trang_thai") not in TRANG_THAI:
            vi_pham.append(f"TRANG_THAI_LA: {hid} · {h.get('trang_thai')}")
        cap = h.get("capture") or {}
        p = D["goc"] / "CNCLData" / (cap.get("snapshot") or "")
        if not cap.get("snapshot") or not p.is_file():
            vi_pham.append(f"MAT_BAN_TAI: {hid} · {cap.get('snapshot')}")
            continue
        if sha(p) != cap.get("sha256"):
            vi_pham.append(f"VAN_TAY_LECH: {hid} · ban tai da bi sua sau khi nap")
        if chuan(h.get("evidence_span")) not in chuan(p.read_text(encoding="utf-8")):
            vi_pham.append(f"SPAN_LECH: {hid} · span khong con nguyen van trong ban tai")
    for l in loai:
        if not l.get("ly_do"):
            vi_pham.append(f"LOAI_KHONG_LY_DO: luot {l.get('luot')} stt {l.get('stt')}")

    # 3. SO HOC NHAT KY
    for n in nk:
        L = n.get("luot")
        that_nhan = sum(1 for h in hc if h.get("luot") == L)
        that_loai = sum(1 for x in loai if x.get("luot") == L)
        if n.get("so_de_xuat") != n.get("so_nhan", 0) + n.get("so_loai", 0):
            vi_pham.append(f"NHAT_KY_LECH: {L} de xuat {n.get('so_de_xuat')} != nhan+loai")
        if that_nhan != n.get("so_nhan") or that_loai != n.get("so_loai"):
            vi_pham.append(f"NHAT_KY_LECH: {L} ghi nhan {n.get('so_nhan')}/loai {n.get('so_loai')} "
                           f"nhung file co {that_nhan}/{that_loai}")
    for d in duyet:
        if d.get("ket_luan") not in KET_LUAN or not d.get("nguoi") or d.get("id") not in dem_id:
            vi_pham.append(f"DUYET_HONG: {d}")

    # IN RA
    gan = max(nk, key=lambda n: n.get("luc", ""))
    try:
        cach = (date.today() - datetime.fromisoformat(gan["luc"]).date()).days
    except (KeyError, ValueError):
        cach = None
    da_duyet = {d.get("id") for d in duyet}
    cho = sum(1 for h in hc if h.get("trang_thai") == "cho_nguoi" and h.get("id") not in da_duyet)
    tong_dx = sum(n.get("so_de_xuat", 0) for n in nk)
    print(f"luot: {len(nk)} · gan nhat {gan.get('luot')} (cach day {cach} ngay) · "
          f"de xuat {tong_dx} · vao hang cho {len(hc)} · loai {len(loai)} · dang doi nguoi {cho}")
    if duyet:
        dung = sum(1 for d in duyet if d.get("ket_luan") == "nhan")
        print(f"nguoi da duyet {len(duyet)} · nhan {dung} · bac {len(duyet) - dung} · "
              f"do chinh xac tren mau {dung / len(duyet):.0%}")
    else:
        print("nguoi da duyet 0 · do chinh xac CHUA DO DUOC")
    if cach is not None and cach > 2:
        print(f"CHU Y: luot gan nhat cach day {cach} ngay. Vong co the da dung.")

    if vi_pham:
        print(f"\nFAIL: {len(vi_pham)} vi pham")
        for v in vi_pham[:30]:
            print("  " + v)
        return 2
    print("OK: hang cho nguyen ven, registry khong co claim nao may tu ghi.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
