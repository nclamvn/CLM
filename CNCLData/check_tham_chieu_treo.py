#!/usr/bin/env python3
"""check_tham_chieu_treo.py · Cong bat THAM CHIEU TREO trong cau lam bang.

VI SAO CO (24/08/2026): claim cua Cong ty An ninh mang Viettel co span la
    "100% cac san pham nay deu duoc nghien cuu, phat trien hoan toan boi doi ngu nhan su
     cua cong ty."
Danh sach ma cum "cac san pham nay" tro toi nam o CAU TRUOC, va cau do KHONG duoc chup.
Doc span len thi khong biet 100% phu len nhung gi. Claim dung tren mot chu "nay" khong co
cho neo.

Loi nay QUA DUOC HET moi cong dang co. Span van nam nguyen van trong ban chup, value van la
chuoi con cua span, tier van dung, ngay van doc duoc. Chi co nghia la rong.

CACH DO, khong doan nghia:
  Tim cum <danh tu> + <tu chi dinh> trong span, vi du "san pham nay", "cong nghe do",
  "du an neu tren". Roi doi hoi DANH TU DO phai xuat hien TRUOC do, hoac som hon trong
  chinh span, hoac som hon trong ban chup. Khong thay o dau ca thi tham chieu treo.

  Day la PHEP DO XAP XI, khong phai hieu nghia. No bat duoc dung mot thu: cai ma cau tro
  toi khong he ton tai trong pham vi da chup. Do dung la loai loi vua vap.

GIOI HAN PHAI NOI RA:
  Danh tu xuat hien truoc do KHONG bao dam no la tien nguu dung. "san pham" co the xuat hien
  o mot doan khac han. Cong nay thu hep cua chu khong khoa duoc cua, giong cong tai tro.

MIEN TRU: note co dong "THAM CHIEU DA NEO:" kem ly do.

Chay: python3 check_tham_chieu_treo.py domains/don_vi_cncl
Exit 0 sach. Exit 2 co treo. Exit 3 KHONG CHAY DUOC.
"""
import json, re, sys, unicodedata
from pathlib import Path

# Chi lay tu chi dinh THAT SU hoi chieu. Co y BO "tren" tran vi no hau het la gioi tu
# ("tren the gioi", "tren nen tang", "tren luoi dien"), bat vao se toan bao gia.
CHI_DINH = r"(?:này|đó|ấy|nêu trên|kể trên|nói trên)"
# Cum CO DINH: <tu> + chi dinh nhung khong phai hoi chieu mot danh tu. Danh sach nay lon
# len tu lan chay dau (24/08/2026): cong bao 16 ca, phan lon la "ben canh do", "do do",
# "thoi gian nay", "van de nay". Mot cong bao gia nhieu hon bao that thi nguoi ta se tat no.
LIEN_TU = {
    "do", "vì", "bởi", "vậy", "thế", "sau", "trước", "cạnh", "ngoài", "nhờ", "từ", "với",
    "theo", "qua", "tại", "ở", "trong", "cùng", "lúc", "khi", "hồi", "đây", "nay", "giờ",
}
MIEN_TRU = "THAM CHIEU DA NEO:"


def thuong(s):
    return unicodedata.normalize("NFC", s or "").lower()


def tim_treo(span, snap):
    """Tra ve danh sach (cum, danh_tu) bi treo trong mot span."""
    ra = []
    s = unicodedata.normalize("NFC", span)
    vt = snap.find(s)
    truoc_snap = thuong(snap[:vt]) if vt > 0 else ""
    # Tieng Viet ghep nhieu am tiet, nen lay toi BA am tiet dung truoc tu chi dinh roi thu
    # ca ba dang. Lan chay dau chi lay mot am tiet nen cat nham: "van de nay" thanh "de nay",
    # "thoi gian nay" thanh "gian nay", roi bao treo oan vi "de" va "gian" khong xuat hien
    # truoc do. Neu BAT KY dang nao xuat hien truoc thi coi la da neo.
    for m in re.finditer(r"((?:[0-9A-Za-zÀ-ỹ]+\s+){0,2}[0-9A-Za-zÀ-ỹ]+)\s+(" + CHI_DINH + r")\b", s):
        am = m.group(1).split()
        chi = m.group(2)
        if thuong(am[-1]) in LIEN_TU:
            continue
        ung_vien = [thuong(" ".join(am[-k:])) for k in range(1, len(am) + 1)]
        truoc_span = thuong(s[:m.start()])
        if any(u in truoc_span or u in truoc_snap for u in ung_vien):
            continue
        ra.append((f"{' '.join(am[-2:])} {chi}", am[-1]))
    return ra


def main(domain_dir):
    d = Path(domain_dir)
    cp, sp = d / "claims.jsonl", d / "snapshots"
    if not cp.exists() or not sp.exists():
        print("KHONG CHAY DUOC: thieu claims.jsonl hoac thu muc snapshots.")
        return 3

    cache = {}
    claims = [json.loads(l) for l in cp.read_text(encoding="utf-8").splitlines() if l.strip()]
    treo, mien = [], 0
    for i, c in enumerate(claims, 1):
        ten = (c.get("capture") or {}).get("snapshot")
        f = sp / (ten or "")
        if not ten or not f.exists():
            continue
        snap = cache.setdefault(ten, unicodedata.normalize(
            "NFC", f.read_text(encoding="utf-8", errors="replace")))
        hit = tim_treo(c.get("evidence_span", ""), snap)
        if not hit:
            continue
        if MIEN_TRU in (c.get("note") or ""):
            mien += 1
            continue
        treo.append((i, c, hit))

    print(f"claim: {len(claims)} · tham chieu treo: {len(treo)} · co ly do da neo: {mien}")
    if treo:
        print(f"\nTHAM CHIEU TREO ({len(treo)}):")
        for i, c, hit in treo:
            cum = ", ".join(f"{a!r}" for a, _ in hit)
            print(f"  claim#{i} {c['entity'][:34]:34} · {c['field'][:20]:20} · {cum}")
            print(f"      {c['capture']['snapshot']}")

    # KHOA MOT CHIEU, cung co che voi check_do_tuoi.py. Vi sao khong bat do cho toi khi ve 0:
    # 12 ca hien tai deu can chup lai doan chua tien nguu, tuc nhieu vong fetch. Bang do suot
    # nhieu ngay thi nguoi ta hoc cach lo no. Cong nay hoi "co te di khong", va giam cung bat
    # dung de con so trong file khong dung yen.
    ns = d / "ngan_sach_tham_chieu_treo.txt"
    if not ns.exists():
        print(f"\nKHONG CHAY DUOC: thieu {ns.name}. Ghi con so hien tai ({len(treo)}) vao do "
              f"de chot khoa mot chieu. Day KHONG phai PASS.")
        return 3
    m = re.search(r"^\s*(\d+)\s*$", ns.read_text(encoding="utf-8"), re.M)
    if not m:
        print(f"\nKHONG CHAY DUOC: {ns.name} khong co con so nao doc duoc.")
        return 3
    ngan_sach = int(m.group(1))
    print(f"\nngan sach: {ngan_sach} · thuc te: {len(treo)}")
    if len(treo) > ngan_sach:
        print(f"FAIL: TE DI {len(treo) - ngan_sach} ca. Mot span moi vua tro toi thu khong co "
              f"trong pham vi da chup.")
        print("Cach xu: chup them doan chua tien nguu roi neo span vao do, HOAC ghi "
              f'"{MIEN_TRU} <ly do>" vao note neu that su da neo.')
        return 2
    if len(treo) < ngan_sach:
        print(f"FAIL(TOT): GIAM DUOC {ngan_sach - len(treo)} ca. Sua {ns.name} thanh {len(treo)}.")
        return 2
    print(f"OK: dung ngan sach. Con {len(treo)} ca cho neo lai, khong tang them.")
    return 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("usage: check_tham_chieu_treo.py <domain_dir>")
    sys.exit(main(sys.argv[1]))
