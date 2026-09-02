#!/usr/bin/env python3
"""check_bi_mat.py · Khong duoc de bi mat lot vao file duoc git theo doi.

VI SAO CO (02/09/2026, truoc lan day dau tien len GitHub): day mot kho len la hanh dong MOT
CHIEU voi lich su. Xoa file di roi commit lai KHONG go duoc bi mat ra khoi lich su, va bat cu
ai clone truoc do van co no. Mot token lo ra la phai thu hoi token, khong phai sua file.

Chuyen nay khong phai gia dinh. Trong chinh du an nay da co mot lan mot PAT song bi dan thang
vao cua so chat. No khong bi ghi vao file nao, nhung khoang cach tu "dan vao chat" toi "dan
vao file" chi la mot thao tac.

CHI QUET FILE GIT THEO DOI, khong quet ca thu muc. Ly do: chi file duoc theo doi moi bi day
len. File nam trong .gitignore (node_modules, .fidelity_fresh, .env cuc bo) khong len GitHub,
nen bat chung la bao gia va bao gia thi cong se bi tat.

BAY DA BIET, VA CACH TRANH: cong nao di tim mot chuoi thi chinh no chua chuoi do va tu bao
minh. Trong hai ngay cuoi thang 8, check_fail_closed.py da vap dung the tren mot dong chu
thich cua toi. Nen o day KHONG mau nao duoc viet nguyen van: moi mau ghep tu manh luc chay,
va file nay KHONG duoc mien tru khoi phep quet. Tu mien tru la mot cai lo.

Chay: python3 check_bi_mat.py
Exit 0 sach · 2 tim thay bi mat · 3 KHONG CHAY DUOC.
"""
import re
import subprocess
import sys
from pathlib import Path

# Moi mau ghep tu manh, de chinh file nay khong khop voi chinh no. Doc cham thi van ro.
_G = "gh"
_PAT = "github" + "_" + "pat" + "_"
MAU = [
    ("token GitHub ca nhan", re.compile(_PAT + r"[A-Za-z0-9_]{22,}")),
    ("token GitHub co dien", re.compile(_G + r"[pousr]_[A-Za-z0-9]{36,}")),
    ("khoa API kieu sk", re.compile(r"\bsk" + "-" + r"[A-Za-z0-9]{32,}")),
    ("khoa truy cap AWS", re.compile(r"\bAKIA" + r"[0-9A-Z]{16}\b")),
    ("khoa rieng PEM", re.compile("-{5}" + "BEGIN" + r"[A-Z ]{0,20}PRIVATE KEY" + "-{5}")),
    ("token Slack", re.compile("xox" + r"[baprs]-[A-Za-z0-9-]{20,}")),
    ("chuoi ket noi co mat khau", re.compile(r"://[^\s:@/]{2,}:[^\s:@/]{8,}@[A-Za-z0-9.-]+")),
]

# Ten file khong duoc theo doi, du noi dung co gi.
TEN_CAM = [
    re.compile(r"(^|/)\.env(\.|$)"),
    re.compile(r"\.(pem|key|p12|pfx|keystore|jks)$"),
    re.compile(r"(^|/)id_(rsa|dsa|ecdsa|ed25519)$"),
]

NHI_PHAN = {".png", ".jpg", ".jpeg", ".gif", ".pdf", ".zip", ".ico", ".woff", ".woff2",
            ".ttf", ".otf", ".mp4", ".webp"}


def main():
    goc = Path.cwd()
    for g in [Path.cwd(), *Path(__file__).resolve().parents]:
        if (g / ".git").exists():
            goc = g
            break
    else:
        print("KHONG CHAY DUOC: khong tim thay kho git nao chua thu muc nay.")
        return 3

    r = subprocess.run(["git", "ls-files", "-z"], capture_output=True, text=True, cwd=str(goc))
    if r.returncode != 0:
        print(f"KHONG CHAY DUOC: git ls-files that bai trong {goc}.")
        print(r.stderr.strip()[:300])
        return 3
    ds = [x for x in r.stdout.split("\0") if x]
    if not ds:
        print("KHONG CHAY DUOC: git khong theo doi file nao. Day khong phai PASS.")
        return 3

    thay, ten_xau = [], []
    da_soi, bo_nhi_phan, khong_doc_duoc = 0, 0, 0
    for ten in ds:
        for m in TEN_CAM:
            if m.search(ten):
                ten_xau.append(ten)
                break
        p = goc / ten
        if p.suffix.lower() in NHI_PHAN or not p.is_file():
            bo_nhi_phan += 1
            continue
        try:
            van = p.read_text(encoding="utf-8", errors="strict")
        except (UnicodeDecodeError, OSError):
            # NUOT CO Y: file khong doc duoc dang van ban thi khong soi noi dung duoc. Dem lai
            # va IN RA con so, khong im lang. Bi mat dang van ban nam trong file nhi phan la
            # truong hop cong nay khong phu, va cho khong phu phai duoc noi ra.
            khong_doc_duoc += 1
            continue
        da_soi += 1
        for nhan, mau in MAU:
            for so, dong in enumerate(van.splitlines(), 1):
                if mau.search(dong):
                    thay.append((ten, so, nhan))

    # BA CON SO PHAI CONG DUNG BANG TONG. Ban dau dong nay in "da soi = tong - khong doc
    # duoc", tuc dem ca file anh bo qua theo duoi vao muc DA SOI. Mot phep kiem nhin mot lat
    # cat roi duoc doc nhu the no nhin toan canh: dung ho loi ma ca chuoi cong nay di sua.
    assert da_soi + bo_nhi_phan + khong_doc_duoc == len(ds), "ba con so khong cong ra tong"
    print(f"file git theo doi: {len(ds)} · da soi noi dung: {da_soi} "
          f"· bo qua vi nhi phan: {bo_nhi_phan} · khong doc duoc: {khong_doc_duoc}")

    if not thay and not ten_xau:
        print("\nOK: khong thay bi mat nao trong file duoc theo doi.")
        return 0

    if ten_xau:
        print(f"\nFILE KHONG DUOC THEO DOI, DU NOI DUNG LA GI ({len(ten_xau)}):")
        for t in ten_xau:
            print(f"  {t}")
    if thay:
        print(f"\nBI MAT TRONG NOI DUNG ({len(thay)}):")
        for ten, so, nhan in thay:
            print(f"  {ten}:{so}  {nhan}")
    print("\nFAIL: day len la MOT CHIEU voi lich su.")
    print("Xoa file roi commit lai KHONG go duoc no ra khoi lich su. Neu thu nay da tung ra")
    print("khoi may thi viec dau tien la THU HOI no, khong phai sua file.")
    return 2


if __name__ == "__main__":
    sys.exit(main())
