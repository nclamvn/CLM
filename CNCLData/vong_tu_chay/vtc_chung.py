"""vtc_chung.py · Phan dung chung cua VONG TU CHAY (chang 1).

VONG TU CHAY la gi: mot agent theo lich doc nguon, DE XUAT claim, va cac script tat dinh o
thu muc nay quyet dinh de xuat nao duoc vao HANG CHO. Khong buoc nao ghi vao claims.jsonl.
Dua mot de xuat tu hang cho vao registry la viec cua NGUOI.

Nguyen tac 1 cua kien truc: AGENT DE XUAT, CONG QUYET. Agent khong sua cong, khong sua file
nay, khong chon tier. Tier, danh sach nguon, danh sach truong deu go cung o day.
"""
import hashlib
import json
import re
import unicodedata
from datetime import date
from pathlib import Path

# ── Nguon duoc phep. Them nguon = sua file nay va qua review, khong nhan tu dong lenh. ──
# tier lay theo dung bang da dung cho 221 claim hien co: mst.gov.vn va baochinhphu.vn la A.
NGUON = {
    "mst.gov.vn": {
        "tier": "A",
        "danh_muc": [
            "https://mst.gov.vn/tin-tuc-su-kien/khoa-hoc-va-cong-nghe.htm",
            "https://mst.gov.vn/tin-tuc-su-kien/doi-moi-sang-tao.htm",
            "https://mst.gov.vn/tin-tuc-su-kien/tin-tong-hop.htm",
        ],
        # Duoi URL bai: -197YYMMDD<gio...>.htm. Ngay bai doc tu URL, khong tu agent.
        "mau_bai": r"https://mst\.gov\.vn/[a-z0-9-]+-197(\d{6})\d*\.htm",
    },
}

# Truong agent duoc de xuat. ma_so_thue KHONG nam day: mst.gov.vn khong phai cong dang ky
# doanh nghiep, va check_ma_so_thue.py se tu choi ma so tu nguon nay.
TRUONG_VAN = {"ten_don_vi", "nang_luc_mo_ta", "nang_luc_mo_ta_2", "bang_chung_nang_luc", "location"}
TRUONG_PHAN_LOAI = {"nhom_cncl", "san_pham_lien_quan", "loai_hinh"}
TRUONG_DUOC_PHEP = TRUONG_VAN | TRUONG_PHAN_LOAI

NHAN_CHUAN_HOA = "CHUAN HOA CO CHU DICH:"
SPAN_TOI_THIEU, SPAN_TOI_DA = 20, 600

# Tu toi thuong: khong cam, chi GAN CO de nguoi duyet doi pham vi (xem check_khang_dinh_toi_thuong).
TU_TOI_THUONG = ("duy nhất", "đầu tiên", "hàng đầu", "lớn nhất", "số 1", "tiên phong", "dẫn đầu")
DAU_HIEU_RTR = ("rtr", "realtime robotics", "real-time robotics")


def goc_mac_dinh():
    # CNCLData/vong_tu_chay/<file> -> goc chua CNCLData
    return Path(__file__).resolve().parents[2]


def duong(goc):
    goc = Path(goc).resolve()
    vtc = goc / "CNCLData" / "vong_tu_chay"
    return {
        "goc": goc,
        "claims": goc / "CNCLData" / "domains" / "don_vi_cncl" / "claims.jsonl",
        "vtc": vtc,
        "luot": vtc / "luot",
        "hang_cho": vtc / "hang_cho.jsonl",
        "loai": vtc / "loai.jsonl",
        "nhat_ky": vtc / "nhat_ky.jsonl",
        "da_xem": vtc / "da_xem.jsonl",
        "duyet": vtc / "duyet.jsonl",
    }


def chuan(s):
    """Chi gop khoang trang va chuan NFC. KHONG bo dau, KHONG ha chu: span phai nguyen van."""
    return re.sub(r"\s+", " ", unicodedata.normalize("NFC", s or "")).strip()


def cac_tu(s):
    s = unicodedata.normalize("NFC", s or "")
    for k in ("**", "__", "`", "*", "_"):
        s = s.replace(k, "")
    return [t for t in re.split(r"[^0-9A-Za-zÀ-ỹ]+", s.lower()) if t]


def sha(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def doc_jsonl(p):
    p = Path(p)
    if not p.exists():
        return []
    return [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]


def ghi_them(p, dong):
    p = Path(p)
    p.parent.mkdir(parents=True, exist_ok=True)
    with p.open("a", encoding="utf-8") as f:
        for d in dong:
            f.write(json.dumps(d, ensure_ascii=False) + "\n")


def ngay_tu_url(url):
    for ten, cfg in NGUON.items():
        m = re.fullmatch(cfg["mau_bai"], url)
        if m:
            s = m.group(1)
            try:
                return ten, date(2000 + int(s[:2]), int(s[2:4]), int(s[4:6]))
            except ValueError:
                return ten, None
    return None, None


def url_cua_bai(txt):
    """Dong URL trong phan dau ban tai web_fetch: dong thu hai, hoac 'canonical:'."""
    dong = txt.splitlines()
    if len(dong) > 1 and dong[1].startswith("https://"):
        return dong[1].strip()
    m = re.search(r"^canonical:\s*(\S+)", txt, re.M)
    return m.group(1) if m else None


def ma_de_xuat(entity, field, value, span, url):
    # Co value: cung mot span co the de xuat hai value khac nhau, va do la hai de xuat.
    return "HC-" + hashlib.sha256(f"{entity}|{field}|{chuan(value)}|{chuan(span)}|{url}".encode()).hexdigest()[:12]
