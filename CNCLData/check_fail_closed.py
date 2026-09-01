#!/usr/bin/env python3
"""check_fail_closed.py · Cong bat CHO NUOT LOI IM LANG trong chinh cac cong. TIP-02.

VI SAO CO (25/08/2026): vong quet hom nay tim ra mot ho loi that: cong doc file cau truc bang
regex thi co the XANH HON CA PARSER. Sua xong 5 cho. Nhung do moi la MOT ho.

Ho thu hai nguy ngang, cung tinh chat: mot cong bat duoc ngoai le roi DI TIEP NHU KHONG CO GI.
Ca that trong chinh kho nay: check-emdash.mjs co `catch { return; }` quanh readdirSync, nghia
la mot thu muc khong doc duoc se duoc tinh la SACH. Cong dem em-dash tren mot phan no chua
nhin, roi bao 0.

Ba trang thai cua ca he: dat, hong, KHONG CHAY DUOC. Nuot loi la xoa mat trang thai thu ba,
va no luon xoa theo huong co loi cho ban bao cao.

LUAT: trong file cong, moi chuong bat loi ma than chi co `pass` / `return` / `continue` /
rong deu phai co nhan

    NUOT CO Y: <ly do>

trong chu thich sat chuong do. Ly do nam canh ma thi doi ma la thay ly do; ly do nam file khac
thi hai thu troi ra xa nhau.

KHONG BAT chuong nao co exit, process.exit, thoat(, raise hay throw: do la fail-closed.

Chay: python3 check_fail_closed.py
Exit 0 sach · 2 co cho nuot chua khai · 3 KHONG CHAY DUOC.
"""
import re
import sys
from pathlib import Path

NHAN = "NUOT CO Y:"
# GOC UNG VIEN, xep theo do uu tien:
#   1. To tien cua chinh file nay. Trong bo cuc GOP (mot repo chua ca ba kho lam thu
#      muc con) thi to tien do CHINH LA goc, va khong can biet duong dan tuyet doi.
#   2. Hai goc cu, cho bo cuc BA KHO tach roi tren may that va trong sandbox.
# Giu ca hai de ma chay duoc o CA HAI bo cuc trong ky chuyen tiep, khong phai sua
# hai lan va khong co ngay nao he nam giua hai trang thai.
GOC = [*Path(__file__).resolve().parents,
       Path("/Users/os"), *sorted(Path("/sessions").glob("*/mnt"))]
KHO = ["CNCLData", "CaoLocMatch", ".touch"]
MAU_TEN = ("check_", "check-", "bite_", "bite-", "gen-")
# Ba helper duoi day khong mang tien to cong nhung DUOC CAC CONG DUNG CHUNG, nen mot cho nuot
# loi trong do lan ra moi cong goi no. Dua vao pham vi co y.
THEM_TEN = ("goc.mjs", "so_anh.mjs", "ban_tam.py")
DUOI = (".py", ".mjs")
THOAT = ("exit(", "process.exit", "thoat(", "raise", "throw")

BA_NHAY = ('"' * 3, "'" * 3)


def lam_sach(van, kieu):
    """Xoa chu thich va noi dung chuoi, thay bang dau cach de so dong khong lech.

    VI SAO CAN (them ngay lan chay thu hai, 25/08/2026): ban dau ham soi quet thang van ban.
    No bao gia ngay lap tuc, va bao gia tren chinh chu thich cua toi. Dong

        // Ban cu `catch { return; }` bo qua thu muc khong doc duoc

    la mot cau NHAC DEN mot chuong catch, khong phai mot chuong catch.

    LAN THU NAM trong hai ngay cung mot dang: cum "so 1" o cong toi thuong, cat sai tu ghep o
    cong tham chieu treo, dem chu "KHONG NAP" o cong ap luat deu, chu d gach ngang, va nay.
    Bat theo mat chu tren van ban tu do thi luon co ca NHAC DEN bi tinh la ca THAT. Cach duy
    nhat het han la boc bo phan khong phai ma truoc khi soi.
    """
    ra = list(van)
    i, n = 0, len(van)
    chuoi = None
    ct = None
    while i < n:
        c = van[i]
        hai = van[i:i + 2]
        ba = van[i:i + 3]
        if ct == "dong":
            if c == "\n":
                ct = None
            else:
                ra[i] = " "
        elif ct == "khoi_js":
            if hai == "*/":
                ra[i] = ra[i + 1] = " "
                i += 2
                ct = None
                continue
            if c != "\n":
                ra[i] = " "
        elif ct in BA_NHAY:
            if ba == ct:
                ra[i] = ra[i + 1] = ra[i + 2] = " "
                i += 3
                ct = None
                continue
            if c != "\n":
                ra[i] = " "
        elif chuoi:
            if c == "\\":
                ra[i] = " "
                if i + 1 < n:
                    ra[i + 1] = " "
                i += 2
                continue
            if c == chuoi:
                chuoi = None
            elif c != "\n":
                ra[i] = " "
        else:
            if kieu == "py" and ba in BA_NHAY:
                ct = ba
                ra[i] = ra[i + 1] = ra[i + 2] = " "
                i += 3
                continue
            if kieu == "py" and c == "#":
                ct = "dong"
                ra[i] = " "
            elif kieu == "js" and hai == "//":
                ct = "dong"
                ra[i] = " "
            elif kieu == "js" and hai == "/*":
                ct = "khoi_js"
                ra[i] = ra[i + 1] = " "
                i += 2
                continue
            elif c in ("'", '"', "`"):
                chuoi = c
        i += 1
    return "".join(ra)


def tim_kho():
    ra = []
    for k in KHO:
        for g in GOC:
            p = g / k
            if p.is_dir():
                ra.append(p)
                break
    return ra


def la_file_cong(p):
    if p.suffix not in DUOI or "node_modules" in str(p):
        return False
    return any(p.name.startswith(m) for m in MAU_TEN) or p.name in THEM_TEN


def soi_python(dong):
    """[(so_dong, than)] cho moi `except` co than chi gom pass/return/continue hoac rong."""
    ra = []
    for i, l in enumerate(dong):
        if not re.match(r"\s*except\b.*:\s*$", l):
            continue
        thut = len(l) - len(l.lstrip())
        than = []
        for j in range(i + 1, len(dong)):
            d = dong[j]
            if not d.strip():
                continue
            if len(d) - len(d.lstrip()) <= thut:
                break
            than.append(d)
        ma = "\n".join(than)
        if any(t in ma for t in THOAT):
            continue
        thuc = [x.strip() for x in than if x.strip()]
        if not thuc or all(re.fullmatch(r"(pass|continue|return(\s+None)?)", t) for t in thuc):
            ra.append((i + 1, ma))
    return ra


def _than_ngoac(van, i):
    """Than cua khoi ngoac nhon bat dau tai van[i] == '{'. DEM NGOAC CAN, khong regex.

    Ban dau cho nay dung `\\{([^{}]*)\\}`. No khong khop duoc khoi co ngoac long nhau, va
    template literal `${...}` la ngoac long. Cung cai bay ma TIP-02 di sua, chi khac la cau
    truc o day la MA NGUON chu khong phai YAML.
    """
    sau, j = 1, i + 1
    while j < len(van) and sau:
        if van[j] == "{":
            sau += 1
        elif van[j] == "}":
            sau -= 1
        j += 1
    return van[i + 1:j - 1]


def soi_js(dong):
    """[(so_dong, than)] cho moi `catch` co than rong hoac chi return/continue/break."""
    ra = []
    van = "\n".join(dong)
    for m in re.finditer(r"catch\s*(?:\([^)]*\))?\s*\{", van):
        than = _than_ngoac(van, m.end() - 1)
        if any(t in than for t in THOAT):
            continue
        thuc = [x.strip() for x in than.split("\n") if x.strip()]
        if thuc and not all(re.fullmatch(r"return\s*;?|continue\s*;?|break\s*;?", t) for t in thuc):
            continue
        ra.append((van[:m.start()].count("\n") + 1, than))
    return ra


def main():
    khos = tim_kho()
    # PHAI CO DU CA BA KHO, khong duoc quet mot phan roi bao sach.
    #
    # VI SAO (phat hien 25/08/2026 khi dung CI cho TIP-04): ba kho la ba repo RIENG TU. Trong
    # mot moi truong chi checkout duoc mot repo, ham nay se tim thay 1 kho, quet mot phan so
    # file, va bao XANH. Do dung la ho loi ma ca TIP-02 di sua: mot phep kiem nhin vao mot lat
    # cat roi duoc doc nhu the no nhin toan canh.
    #
    # Thieu kho la KHONG CHAY DUOC, khong phai sach.
    if len(khos) < len(KHO):
        co = {p.name for p in khos}
        thieu_kho = [k for k in KHO if k not in co]
        print(f"KHONG CHAY DUOC: chi thay {len(khos)}/{len(KHO)} kho. Thieu: {', '.join(thieu_kho)}.")
        print("Quet mot phan roi bao sach chinh la kieu noi doi ma cong nay duoc dung de chan.")
        return 3
    tong_file = 0
    thieu, da_khai = [], []
    for kho in khos:
        for p in sorted(kho.rglob("*")):
            if not p.is_file() or not la_file_cong(p):
                continue
            tong_file += 1
            goc_van = p.read_text(encoding="utf-8", errors="replace")
            dong_goc = goc_van.split("\n")
            dong = lam_sach(goc_van, "py" if p.suffix == ".py" else "js").split("\n")
            for so, _ in (soi_python(dong) if p.suffix == ".py" else soi_js(dong)):
                # Nhan nam trong CHU THICH, ma lam_sach da xoa chu thich. Nen tim nhan tren
                # VAN GOC, trong cua so quanh cho nuot.
                cua_so = "\n".join(dong_goc[max(0, so - 4):so + 10])
                muc = (p, so, dong_goc[so - 1].strip()[:70] if so <= len(dong_goc) else "")
                (da_khai if NHAN in cua_so else thieu).append(muc)

    print(f"file cong da soi: {tong_file} · cho nuot loi: {len(thieu) + len(da_khai)} "
          f"· da khai NUOT CO Y: {len(da_khai)} · chua khai: {len(thieu)}")
    if da_khai:
        print("\nDa khai, nuot co y va co ly do canh ma:")
        for p, so, _ in da_khai:
            print(f"  {p.name}:{so}")
    if thieu:
        print(f"\nCHO NUOT LOI CHUA KHAI ({len(thieu)}):")
        for p, so, l in thieu:
            print(f"  {p.name}:{so}  {l}")
        print(f'\nFAIL: moi chuong bat loi ma than chi co pass/return/rong phai co nhan')
        print(f'  {NHAN} <ly do>')
        print("Nuot loi xoa mat trang thai KHONG CHAY DUOC, va no luon xoa theo huong co loi")
        print("cho ban bao cao.")
        return 2
    print("\nOK: khong con cho nao nuot loi ma chua khai.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
