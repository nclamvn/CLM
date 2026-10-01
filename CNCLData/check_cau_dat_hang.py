#!/usr/bin/env python3
"""check_cau_dat_hang.py · Cong cua domain cau_dat_hang (cau that): moi nhu cau trong registry phai
truy duoc ve MOT lan duyet cua nguoi, va dung khuon cua mot nhu cau dat hang.

VI SAO CO (01/10/2026): lo 03 la lo dau tien nap vao domain nay. refinery.py va check_luat3.py lo
phan span nguyen van va chuan hoa; cong nay lo phan RIENG cua cau that: nhu cau di toi nguoi dung
nhu mot co hoi kinh doanh, nen khong duoc co nhu cau nao vao registry ma khong co nguoi duyet,
khong duoc them tay mot claim sau khi nap, va bien dat hang phai du.

CONG KIEM:
  KHONG_DUYET          nhu cau khong nam trong da_nap.json cua lo nao, hoac lo do khong co
                       duyet.json cua nguoi that (nguoi_duyet rong hoac la MO PHONG).
  NHAN_NAP_SAI         note cua claim khong mang nhan "LAM GIAU <dot> · CAU THAT · duyet".
  NAP_KHONG_KHOP       so claim cua mot lo trong registry khac so_claim ghi trong da_nap.json
                       (them tay hay xoa tay sau khi nap).
  THIEU_TRUONG_CHINH   nhu cau thieu ten_nhu_cau, ben_dat_hang hoac loai_dat_hang.
  O_TRUNG              mot (nhu cau, truong) co hon mot claim.
  GIA_TRI_SAI          loai_dat_hang ngoai bon gia tri; san_pham_lien_quan ngoai 1..30.
  HANG_CAO_HON_LUAT    hang A ma ten mien khong phai cong nha nuoc (*.gov.vn, baochinhphu.vn, *.chinhphu.vn).
  BAN_CHUP_THIEU       claim tro toi ban chup khong co trong domains/cau_dat_hang/snapshots.
  EM_DASH              em-dash trong value, span hoac note.
Domain chua co claims.jsonl la hop le (chua nap lo nao): exit 0 kem dong ghi ro.

Chay: python3 check_cau_dat_hang.py [--domain <dir>] [--lam-giau <dir>]
Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
"""
import json
import sys
from collections import Counter, defaultdict
from pathlib import Path
from urllib.parse import urlparse

HERE = Path(__file__).resolve().parent
a = sys.argv[1:]
DOM = Path(a[a.index("--domain") + 1]).resolve() if "--domain" in a else HERE / "domains" / "cau_dat_hang"
LG = Path(a[a.index("--lam-giau") + 1]).resolve() if "--lam-giau" in a else HERE / "lam_giau"
CHINH = {"ten_nhu_cau", "ben_dat_hang", "loai_dat_hang"}
LOAI = {"nhiem_vu_khcn", "bai_toan_lon", "chuong_trinh", "du_an_goi_thau"}
EM = chr(0x2014)


def thoat3(m):
    print(f"KHONG CHAY DUOC: {m}")
    sys.exit(3)


def hang_luat(url):
    h = urlparse(url).netloc.lower().removeprefix("www.")
    return "A" if h.endswith(".gov.vn") or h in ("baochinhphu.vn", "chinhphu.vn") or h.endswith(".chinhphu.vn") else "B"


if not (DOM / "domain.yaml").exists():
    thoat3(f"khong thay {DOM}/domain.yaml")
pc = DOM / "claims.jsonl"
if not pc.exists():
    print("cau dat hang: chua nap lo nao (chua co claims.jsonl)\n\nOK: domain rong, khong co gi de kiem.")
    sys.exit(0)
try:
    cs = [json.loads(l) for l in pc.read_text(encoding="utf-8").splitlines() if l.strip()]
except json.JSONDecodeError as e:
    thoat3(f"claims.jsonl hong: {e}")

# Lan duyet: lo nao da nap, nap nhu cau nao, ai duyet.
duyet_cua = {}      # nhu cau -> ten lo
so_claim_lo = {}    # ten lo -> so_claim trong da_nap
for d in sorted(LG.glob("dot_*")):
    dn = d / "da_nap.json"
    if not (d / "LOAI_CAU").exists() or not dn.exists():
        continue
    nap = json.loads(dn.read_text(encoding="utf-8"))
    dy = json.loads((d / "duyet.json").read_text(encoding="utf-8")) if (d / "duyet.json").exists() else {}
    nguoi = str(dy.get("nguoi_duyet", ""))
    if not nguoi or "MO PHONG" in nguoi:
        continue
    so_claim_lo[d.name] = nap.get("so_claim")
    for e in nap.get("nhu_cau", []):
        duyet_cua[e] = d.name

vi = []
theo = defaultdict(list)
dem_lo = Counter()
for i, c in enumerate(cs, 1):
    e, f, v = c.get("entity"), c.get("field"), str(c.get("value"))
    theo[e].append(c)
    note = str(c.get("note", ""))
    lo = duyet_cua.get(e)
    if not lo:
        vi.append(f"KHONG_DUYET: dong {i} · {e} khong thuoc lo nao da duyet va nap")
    elif f"LAM GIAU {lo} · CAU THAT · duyet" not in note:
        vi.append(f"NHAN_NAP_SAI: dong {i} · {e}/{f} note khong mang nhan nap cua {lo}")
    else:
        dem_lo[lo] += 1
    if f == "loai_dat_hang" and v not in LOAI:
        vi.append(f"GIA_TRI_SAI: dong {i} · {e} loai_dat_hang '{v}'")
    if f == "san_pham_lien_quan" and not (v.isdigit() and 1 <= int(v) <= 30):
        vi.append(f"GIA_TRI_SAI: dong {i} · {e} san_pham_lien_quan '{v}'")
    cap = c.get("capture") or {}
    if c.get("tier") == "A" and hang_luat(cap.get("url", "")) != "A":
        vi.append(f"HANG_CAO_HON_LUAT: dong {i} · {e}/{f} {urlparse(cap.get('url', '')).netloc} ghi A")
    if not cap.get("snapshot") or not (DOM / "snapshots" / cap["snapshot"]).exists():
        vi.append(f"BAN_CHUP_THIEU: dong {i} · {e}/{f} {cap.get('snapshot')}")
    if any(EM in str(c.get(k, "")) for k in ("value", "evidence_span", "note")):
        vi.append(f"EM_DASH: dong {i} · {e}/{f}")
for e, ds in sorted(theo.items()):
    co = Counter(c["field"] for c in ds)
    thieu = sorted(CHINH - set(co))
    if thieu:
        vi.append(f"THIEU_TRUONG_CHINH: {e} thieu {', '.join(thieu)}")
    for f, n in sorted(co.items()):
        if n > 1:
            vi.append(f"O_TRUNG: {e}/{f} co {n} claim")
for lo, n in sorted(so_claim_lo.items()):
    if dem_lo[lo] != n:
        vi.append(f"NAP_KHONG_KHOP: lo {lo} ghi da nap {n} claim, registry co {dem_lo[lo]} claim mang nhan lo nay")

loai = Counter(str(c["value"]) for c in cs if c.get("field") == "loai_dat_hang")
print(f"cau dat hang: {len(theo)} nhu cau · {len(cs)} claim · {len(so_claim_lo)} lo da duyet · "
      + " · ".join(f"{k} {v}" for k, v in sorted(loai.items())))
if vi:
    print(f"\nFAIL: {len(vi)} vi pham")
    for x in vi[:30]:
        print("  " + x)
    sys.exit(2)
print("\nOK: moi nhu cau truy duoc ve mot lan duyet cua nguoi, du bien dat hang, khong claim them tay.")
