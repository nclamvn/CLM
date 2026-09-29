#!/usr/bin/env python3
"""dong_bo_cau.py · Mot nguon duy nhat cho chieu CAU, kem cong chong phan ky.

VI SAO CO (01/09/2026): chieu CAU (Dataset_CongNgheChienLuoc) truoc nay nam o
KnowledgeBase, ngoai ca ba kho. Nay no da duoc gop vao kho nay. Nhung RtR Copilot con tham
chieu ban o KnowledgeBase (TIP-024_PILOT_CORPUS_PROVENANCE.md va enterprise_corpus/
inventory.py), nen ban do phai o lai.

Hai ban cung ton tai la mot cai bay: sua mot ben, ben kia lang le cu. Lam da chon huong xu
ly: KHO NAY LA NGUON, ban o KnowledgeBase la BAN DOC, va phai co cong bao do khi hai ben lech.

BA LUAT

  1. Dong bo MOT CHIEU. Kho -> ban doc. Khong bao gio nguoc lai.
  2. `--day` TU CHOI CHAY neu ban doc da bi sua ke tu lan day gan nhat. Ghi de len sua doi cua
     nguoi khac ma khong hoi la mot kieu mat du lieu im lang.
  3. Vang ban doc la KHONG CHAY DUOC, khong phai sach. Trong CI khong co KnowledgeBase, nen o
     nay se treo o do, va treo phai nhin thay chu khong duoc lang.

CACH BIET "AI DA SUA": file dau `.dong_bo_ban_doc` trong kho ghi lai van tay cua ban doc ngay
sau lan day gan nhat.

  van tay ban doc == van tay da ghi   ->  ban doc chua ai dong toi, day duoc
  van tay ban doc != van tay da ghi   ->  co nguoi sua ban doc, TU CHOI day, de nguoi quyet

Chay:
  python3 dong_bo_cau.py            kiem, khong ghi gi
  python3 dong_bo_cau.py --day      day kho sang ban doc (co the bi tu choi)
  python3 dong_bo_cau.py --day --du-biet-ban-doc-da-sua   ep day, ghi ly do vao file dau

Bien moi truong CLM_BAN_DOC tro toi mot ban doc khac; dung cho cac bo rang.

Exit 0 khop · 2 hai ben lech · 3 KHONG CHAY DUOC.
"""
import hashlib
import os
import shutil
import sys
from datetime import date
from pathlib import Path

TEN = "Dataset_CongNgheChienLuoc"
FILE_DAU = ".dong_bo_ban_doc"
BO_QUA = {".git", "__pycache__", ".DS_Store", FILE_DAU}


def trong_kho():
    for g in Path(__file__).resolve().parents:
        if (g / TEN).is_dir():
            return g / TEN
    return None


def ban_doc(nguon):
    v = os.environ.get("CLM_BAN_DOC")
    if v:
        return Path(v)
    for g in [*Path(__file__).resolve().parents, Path("/Users/os"),
              *sorted(Path("/sessions").glob("*/mnt"))]:
        for duoi in (("RtR", "KnowledgeBase", TEN), ("KnowledgeBase", TEN)):
            p = g.joinpath(*duoi)
            if p.is_dir() and p.resolve() != nguon.resolve():
                return p
    return None


def cac_file(goc):
    ra = []
    for p in sorted(goc.rglob("*")):
        if any(p in (goc / b for b in BO_QUA) or b in p.parts for b in BO_QUA):
            continue
        if p.is_file():
            ra.append(p.relative_to(goc))
    return ra


def van_tay_tung_file(goc):
    d = {}
    for r in cac_file(goc):
        d[str(r)] = hashlib.sha256((goc / r).read_bytes()).hexdigest()
    return d


def van_tay(goc):
    d = van_tay_tung_file(goc)
    h = hashlib.sha256()
    for k in sorted(d):
        h.update(k.encode()); h.update(d[k].encode())
    return h.hexdigest()


def lech(a, b):
    """Tra ve (chi co ben A, chi co ben B, khac noi dung)."""
    da, db = van_tay_tung_file(a), van_tay_tung_file(b)
    chi_a = sorted(set(da) - set(db))
    chi_b = sorted(set(db) - set(da))
    khac = sorted(k for k in set(da) & set(db) if da[k] != db[k])
    return chi_a, chi_b, khac


def doc_dau(nguon):
    f = nguon.parent / TEN / FILE_DAU
    if not f.exists():
        return None
    # Lay dau CUOI CUNG. File chi them dong moi ben duoi, nen dong cuoi moi la lan day gan
    # nhat. Truoc 29/09/2026 ham nay tra dong DAU TIEN: tu lan day thu hai tro di, moi lan day
    # deu bi tu choi oan vi so van tay hien tai voi van tay cua lan day dau. Ro ra khi day ban
    # sua 7 claim cau; RANG 6 cua bite_dong_bo_cau.py giu cho no khong quay lai.
    cuoi = None
    for dong in f.read_text(encoding="utf-8").splitlines():
        if dong.startswith("van_tay_ban_doc:"):
            cuoi = dong.split(":", 1)[1].strip()
    return cuoi


def ghi_dau(nguon, vt, ghi_chu):
    f = nguon / FILE_DAU
    cu = f.read_text(encoding="utf-8") if f.exists() else (
        "# Van tay cua BAN DOC ngay sau lan day gan nhat. Dung de biet co ai sua ban doc\n"
        "# ngoai luong hay khong. Khong xoa dong cu, chi them dong moi ben duoi.\n"
        "# Xem CaoLocMatch/dong_bo_cau.py.\n")
    f.write_text(cu + f"\n{date.today().strftime('%d/%m/%Y')} {ghi_chu}\nvan_tay_ban_doc: {vt}\n",
                 encoding="utf-8")


def main():
    args = sys.argv[1:]
    day = "--day" in args
    ep = "--du-biet-ban-doc-da-sua" in args
    la = [a for a in args if a not in ("--day", "--du-biet-ban-doc-da-sua")]
    if la:
        print(f"Khong hieu tham so: {' '.join(la)}")
        return 3

    nguon = trong_kho()
    if nguon is None:
        print(f"KHONG CHAY DUOC: khong thay {TEN} trong kho nay.")
        return 3
    bd = ban_doc(nguon)
    if bd is None or not bd.is_dir():
        print(f"KHONG CHAY DUOC: khong thay BAN DOC cua {TEN}.")
        print("Moi truong khong co KnowledgeBase (vi du CI) thi khong doi chieu duoc.")
        print("Vang tin khong phai tin tot: o nay treo o do chu khong duoc tinh la xanh.")
        return 3

    vt_nguon, vt_bd = van_tay(nguon), van_tay(bd)
    print(f"nguon   : {nguon}")
    print(f"ban doc : {bd}")

    if not day:
        if vt_nguon == vt_bd:
            print(f"\nOK: hai ban trung nhau ({len(cac_file(nguon))} file).")
            return 0
        chi_a, chi_b, khac = lech(nguon, bd)
        print(f"\nHAI BAN LECH · chi co trong kho: {len(chi_a)} · chi co o ban doc: {len(chi_b)}"
              f" · khac noi dung: {len(khac)}")
        for ten, ds in (("chi co trong kho", chi_a), ("chi co o ban doc", chi_b),
                        ("khac noi dung", khac)):
            for f in ds[:10]:
                print(f"  {ten:20} {f}")
            if len(ds) > 10:
                print(f"  {ten:20} ... va {len(ds) - 10} file nua")
        print("\nFAIL: kho la NGUON, ban doc phai theo kho.")
        print("  Ban doc chua ai sua      ->  python3 dong_bo_cau.py --day")
        print("  Ban doc co sua that      ->  doi chieu bang tay truoc, dung day de len")
        return 2

    # ── --day ──────────────────────────────────────────────────────────────
    dau = doc_dau(nguon)
    if dau is not None and dau != vt_bd and not ep:
        print(f"\nTU CHOI DAY: ban doc da doi ke tu lan day gan nhat.")
        print(f"  van tay da ghi : {dau[:16]}")
        print(f"  van tay hien co: {vt_bd[:16]}")
        _, chi_b, khac = lech(nguon, bd)
        for f in (chi_b + khac)[:10]:
            print(f"  co the bi ghi de: {f}")
        print("\nDay de len la mot kieu mat du lieu im lang. Doi chieu bang tay truoc.")
        print("Da doi chieu roi thi chay lai voi --du-biet-ban-doc-da-sua.")
        return 2

    # CHI XOA FILE THUA, khong xoa sach roi chep lai. Xoa sach lam moi file deu doi dau thoi
    # gian va, o thu muc bi chan unlink, lam ca lan day that bai giua chung. Chep de len thi
    # ket qua giong het ma it dong cham hon.
    _, chi_b, _ = lech(nguon, bd)
    for r in chi_b:
        (bd / r).unlink()
    for r in cac_file(nguon):
        (bd / r).parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(nguon / r, bd / r)
    vt_moi = van_tay(bd)
    ghi_dau(nguon, vt_moi, "day tu kho sang ban doc" + (" (ep, ban doc da bi sua)" if ep else ""))
    print(f"\nDA DAY: {len(cac_file(nguon))} file · van tay ban doc {vt_moi[:16]}")
    print(f"Da ghi vao {TEN}/{FILE_DAU}. Nho commit file dau nay.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
