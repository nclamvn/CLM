#!/usr/bin/env python3
"""tim_bai.py · Buoc 2 cua vong tu chay: tu trang danh muc da tai, chon bai dang doc.

Tat dinh, khong mang, khong LLM. Doc cac file <luot>/danh_muc/*.md ma agent da luu NGUYEN VAN
tu web_fetch, rut link bai theo mau URL cua nguon, lay NGAY TU URL (khong tu chu tren trang,
khong tu agent), bo bai da xem, cham diem lien quan, ghi <luot>/bai_can_doc.json.

VI SAO CHAM DIEM O DAY CHU KHONG DE AGENT CHON: de xuat cua agent la thu can kiem; neu agent
cung tu chon bai thi khong do duoc no bo sot gi. Diem o day minh bach, lap lai duoc, va danh
sach DAY DU (ke ca diem 0) nam trong file de nguoi xem lai.

Chay: python3 tim_bai.py <thu_muc_luot> [--goc <dir>] [--ngay YYYY-MM-DD] [--so-ngay 10] [--toi-da 6]
      [--diem-toi-thieu 2]
Exit 0 co danh sach (co the rong neu khong co bai moi) · 3 KHONG CHAY DUOC.
"""
import argparse
import json
import re
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from vtc_chung import NGUON, duong, doc_jsonl, goc_mac_dinh, ngay_tu_url  # noqa: E402

# Tu khoa theo 10 nhom CNCL cua QD 21/2026. Trong so 1. Ten don vi da nap trong so 3.
TU_KHOA = [
    "trí tuệ nhân tạo", "bán dẫn", "chip", "vi mạch", "UAV", "máy bay không người lái", "drone",
    "robot", "tự động hóa", "vệ tinh", "hàng không", "vũ trụ", "5G", "6G", "an ninh mạng",
    "mật mã", "blockchain", "lượng tử", "dữ liệu lớn", "điện toán đám mây", "pin",
    "lưu trữ năng lượng", "hydro", "năng lượng nguyên tử", "điện hạt nhân", "đất hiếm",
    "vật liệu", "vắc xin", "vaccine", "sinh phẩm", "công nghệ gen", "thiết bị điện",
    "siêu cao áp", "kV", "đường sắt", "công nghệ chiến lược", "công nghệ lõi", "chế tạo",
    "thương mại hóa", "làm chủ công nghệ",
]
TEN_NGAN = ["Viettel", "FPT", "VNPT", "VinAI", "VinBigData", "VinES", "VinMotion", "MISA",
            "Phenikaa", "Đông Anh", "EEMC", "PTSC", "Dabaco", "Masan", "NAVETCO", "IVAC", "AVAC",
            "HTI", "RtR", "Real-time Robotics", "CT Group", "MiSmart", "Zalo", "FECON", "NCS",
            "Viện Hàn lâm", "Xe lửa Dĩ An", "Y Sinh Ngọc Bảo", "Trần Hồng Quân", "XBStation"]

LINK = re.compile(r"^#{1,4}\s*\[([^\]]+)\]\((https://[^)\s]+)")


def co_tu(txt, tu):
    # AI, 5G, kV...: phan biet hoa thuong va doi bien tu. Con lai: khong phan biet hoa thuong.
    # "pin" viet thuong thi khong phan biet hoa thuong nhung van doi bien tu (khong khop "Spin").
    if tu.isascii() and len(tu) <= 4:
        co = 0 if not tu.islower() else re.I
        return re.search(rf"(?<![0-9A-Za-z]){re.escape(tu)}(?![0-9A-Za-z])", txt, co) is not None
    return tu.lower() in txt.lower()


def rut_bai(txt):
    """Tieu de o dong heading co link, tom tat la dong khong rong dau tien sau do."""
    dong = txt.splitlines()
    ra = {}
    for i, d in enumerate(dong):
        m = LINK.match(d.strip())
        if not m:
            continue
        tieu_de, url = m.group(1), m.group(2)
        tom = ""
        for d2 in dong[i + 1:i + 6]:
            d2 = d2.strip()
            if d2 and not d2.startswith(("[", "#", "!")):
                tom = d2
                break
        if url not in ra or (tom and not ra[url]["tom_tat"]):
            ra[url] = {"url": url, "tieu_de": tieu_de, "tom_tat": tom}
    return ra


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("luot")
    ap.add_argument("--goc", default=str(goc_mac_dinh()))
    # Mac dinh: ten thu muc luot (vd 2026-09-29), de ngay tinh tuoi bai trung ngay cua luot,
    # khong phu thuoc mui gio cua may chay.
    ap.add_argument("--ngay", default=None)
    ap.add_argument("--so-ngay", type=int, default=10)
    ap.add_argument("--toi-da", type=int, default=6)
    # 2 = it nhat mot ten don vi, hoac hai tu khoa. Mot tu khoa don le ("vat lieu") keo ve
    # qua nhieu bai khong lien quan trong luot dau 29/09/2026.
    ap.add_argument("--diem-toi-thieu", type=int, default=2)
    a = ap.parse_args()

    luot = Path(a.luot)
    if a.ngay is None:
        try:
            a.ngay = date.fromisoformat(luot.name).isoformat()
        except ValueError:
            a.ngay = date.today().isoformat()
    dm = sorted((luot / "danh_muc").glob("*.md"))
    if not dm:
        print(f"KHONG CHAY DUOC: khong co trang danh muc nao trong {luot / 'danh_muc'}.")
        print("Vang danh muc khong phai 'khong co bai moi'. Co the fetch that bai.")
        return 3

    D = duong(a.goc)
    # Luot da nap thi khong ghi de bai_can_doc.json. Ngay 29/09/2026 chay lai tim_bai tren luot
    # dau tien sau khi nap, va ho so chon bai cua luot bi ghi de thanh "da_xem" het.
    if any(n.get("luot") == luot.resolve().name for n in doc_jsonl(D["nhat_ky"])):
        print(f"KHONG CHAY DUOC: luot {luot.name} DA NAP. bai_can_doc.json cua no la ho so, khong ghi de.")
        return 3
    ngay_chay = date.fromisoformat(a.ngay)
    da_xem = {d["url"] for d in doc_jsonl(D["da_xem"])}
    ten_dv = sorted({c["entity"] for c in doc_jsonl(D["claims"])})
    if not ten_dv:
        print(f"KHONG CHAY DUOC: khong doc duoc don vi nao tu {D['claims']}.")
        return 3

    bai = {}
    for f in dm:
        bai.update(rut_bai(f.read_text(encoding="utf-8")))

    tat_ca = []
    for url, b in bai.items():
        nguon, ngay = ngay_tu_url(url)
        if nguon is None or ngay is None:
            continue
        tuoi = (ngay_chay - ngay).days
        txt = b["tieu_de"] + " " + b["tom_tat"]
        trung_dv = [t for t in ten_dv + TEN_NGAN if co_tu(txt, t)]
        trung_tk = [t for t in TU_KHOA if co_tu(txt, t)]
        diem = 3 * len(set(trung_dv)) + len(trung_tk)
        trang_thai = ("da_xem" if url in da_xem else
                      "qua_cu" if tuoi > a.so_ngay else
                      "tuong_lai" if tuoi < 0 else
                      "duoi_nguong" if diem < a.diem_toi_thieu else "ung_vien")
        tat_ca.append({**b, "nguon": nguon, "ngay_bai": ngay.isoformat(), "tuoi_ngay": tuoi,
                       "diem": diem, "trung_don_vi": sorted(set(trung_dv)),
                       "trung_tu_khoa": trung_tk, "trang_thai": trang_thai})

    if not tat_ca:
        print("KHONG CHAY DUOC: danh muc co noi dung nhung khong rut duoc link bai nao khop mau URL.")
        print("Hoac trang da doi cau truc, hoac ban luu khong phai ban web_fetch. Khong duoc doc la 'khong co bai'.")
        return 3

    ung = sorted([b for b in tat_ca if b["trang_thai"] == "ung_vien"],
                 key=lambda b: (-b["diem"], b["tuoi_ngay"]))
    chon = ung[:a.toi_da]
    for b in chon:
        b["trang_thai"] = "chon_doc"

    ra = {"ngay_chay": a.ngay, "so_danh_muc": len(dm), "so_bai_rut": len(tat_ca),
          "so_ung_vien": len(ung), "chon_doc": [b["url"] for b in chon],
          "tat_ca": sorted(tat_ca, key=lambda b: (-b["diem"], b["url"]))}
    (luot / "bai_can_doc.json").write_text(json.dumps(ra, ensure_ascii=False, indent=1), encoding="utf-8")

    dem = {}
    for b in tat_ca:
        dem[b["trang_thai"]] = dem.get(b["trang_thai"], 0) + 1
    print(f"TIM BAI: {len(dm)} danh muc · {len(tat_ca)} bai · " +
          " · ".join(f"{k} {v}" for k, v in sorted(dem.items())))
    for b in chon:
        print(f"  [{b['diem']:2}] {b['ngay_bai']} {b['tieu_de'][:80]}")
        print(f"       {b['url']}")
    if not chon:
        print("  Khong co bai moi du diem. Day la ket qua hop le, khong phai loi.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
