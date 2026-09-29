#!/usr/bin/env python3
"""cau_noi_kernel.py · Cau noi MOT CHIEU tu kho Portal/kernel sang vong tu chay.

VI SAO CO (29/09/2026): kho kernel cua RtR co quy trinh lay tin hang ngay va nhieu URL cong khai,
nhung file cua no TRON tin cong khai voi muc tieu doanh thu, pursuit, quyet dinh gia, phan tich
doi thu (khao sat 10_KHO_PORTAL_KERNEL.md). Keo thang vao hub cho nha dau tu la ro ri.

NGUYEN TAC CUA CAU NOI:
  1. Kernel chi goi y URL, KHONG BAO GIO cung cap su that. Cau noi khong chep evidence_span,
     published_statement, entity hay bat ky chu nao cua kernel. Su that chi vao hub khi agent
     tai lai bai tu URL do (B3), cat span nguyen van, va kiem_de_xuat.py cung nguoi duyet cho qua.
  2. DANH SACH CHO PHEP, khong phai danh sach cam: chi doc cac khoa trong KHOA_DOC. Khoa khac
     khong duoc doc gia tri; chi duoc hoi "co mat khong" de loai ca ban ghi (KHOA_NOI_BO).
  3. Chi nhan ban ghi: tier cong khai (A/B), khong nghieng RtR, loai capability/need/signal,
     khong nam trong thu muc noi bo, co URL day du, va URL thuoc nguon da duyet trong vtc_chung.
     URL cong khai thuoc nguon CHUA duyet thi chi DEM theo ten mien, de nguoi quyet co mo them
     nguon hay khong. Them nguon la sua vtc_chung.py va qua review, khong phai viec cua cau noi.
  4. Thieu kernel la KHONG CHAY DUOC (exit 3), khong phai "0 ung vien".

Chay:  python3 cau_noi_kernel.py <thu_muc_luot> [--kernel <duong_dan>]
Ghi:   <thu_muc_luot>/ung_vien_kernel.json
Exit 0 xong · 3 KHONG CHAY DUOC.
"""
import hashlib
import json
import os
import re
import sys
from datetime import date
from pathlib import Path
from urllib.parse import urlparse

sys.path.insert(0, str(Path(__file__).resolve().parent))
from vtc_chung import NGUON, duong, goc_mac_dinh  # noqa: E402

KHOA_DOC = ("id", "source", "source_tier", "kind", "favors")
KHOA_NOI_BO = ("decision_link", "deal_link", "internal_notes", "rtr_fit_score", "rtr_addressable", "pricing", "margin")
THU_MUC_NOI_BO = ("competitive", "pricing", "relationships", "risk", "hypotheses", "market_sizing", "internal", "_dist")
TIER_CONG_KHAI = ("A", "B")
KIND_DUOC_PHEP = ("capability", "need", "signal")
KHOA_RA = {"ngay_chay", "kernel", "so_ban_ghi_doc", "chon_doc", "bi_chan_theo_nguon", "bi_loai"}


def tim_kernel(tham_so):
    # Duong dan CHI DINH ma khong ton tai thi dung lai, KHONG roi ve kernel khac tim thay tren may:
    # go sai duong dan se doc nham kho ma khong ai biet (rang 11 bat duoc 29/09/2026).
    for chi_dinh in (tham_so, os.environ.get("CLM_KERNEL")):
        if chi_dinh:
            return Path(chi_dinh) if Path(chi_dinh).is_dir() else None
    ung = []
    ung += sorted(str(p) for p in Path("/sessions").glob("*/mnt/kernel")) if Path("/sessions").exists() else []
    ung.append(str(Path.home() / "RtR" / "kernel"))
    for u in ung:
        if u and Path(u).is_dir():
            return Path(u)
    return None


def main(argv):
    if len(argv) < 2:
        print("KHONG CHAY DUOC: thieu thu muc luot. Chay: python3 cau_noi_kernel.py <luot> [--kernel <dir>]")
        return 3
    luot = Path(argv[1])
    tham = argv[argv.index("--kernel") + 1] if "--kernel" in argv else None
    kernel = tim_kernel(tham)
    if kernel is None:
        print("KHONG CHAY DUOC: khong thay kho kernel (CLM_KERNEL, /sessions/*/mnt/kernel, ~/RtR/kernel). Day KHONG phai 0 ung vien.")
        return 3
    if not luot.is_dir():
        print(f"KHONG CHAY DUOC: khong co thu muc luot {luot}")
        return 3

    p = duong(goc_mac_dinh())
    da_xem = set()
    if p["da_xem"].exists():
        for l in p["da_xem"].read_text(encoding="utf-8").splitlines():
            if l.strip():
                da_xem.add(json.loads(l)["url"])
    bcd = luot / "bai_can_doc.json"
    if bcd.exists():
        da_xem |= set(json.loads(bcd.read_text(encoding="utf-8")).get("chon_doc", []))

    tep = sorted(kernel.glob("**/records.jsonl"))
    if not tep:
        print(f"KHONG CHAY DUOC: kernel {kernel} khong co records.jsonl nao. Rong khong phai sach.")
        return 3

    bi_loai, bi_chan, chon, so = {}, {}, {}, 0
    loai = lambda k: bi_loai.__setitem__(k, bi_loai.get(k, 0) + 1)  # noqa: E731
    for f in tep:
        rel = f.relative_to(kernel).as_posix()
        noi_bo = any(seg in THU_MUC_NOI_BO for seg in rel.split("/"))
        for dong in f.read_text(encoding="utf-8").splitlines():
            if not dong.strip():
                continue
            try:
                r = json.loads(dong)
            except json.JSONDecodeError:
                loai("DONG_HONG")
                continue
            so += 1
            if noi_bo:
                loai("DUONG_NOI_BO"); continue
            if any(r.get(k) not in (None, "", [], {}, False) for k in KHOA_NOI_BO):
                loai("KHOA_NOI_BO"); continue
            doc = {k: r.get(k) for k in KHOA_DOC}  # tu day chi dung ban doc duoc phep
            if doc["source_tier"] not in TIER_CONG_KHAI:
                loai("TIER_KHONG_CONG_KHAI"); continue
            if doc["favors"] == "rtr":
                loai("NGHIENG_RTR"); continue
            if doc["kind"] not in KIND_DUOC_PHEP:
                loai("KIND_NGOAI_DANH_SACH"); continue
            url = doc["source"] if isinstance(doc["source"], str) else ""
            u = urlparse(url)
            if u.scheme not in ("http", "https") or not u.netloc or " " in url:
                loai("KHONG_URL"); continue
            mien = u.netloc.lower().removeprefix("www.")
            if mien not in NGUON:
                bi_chan[mien] = bi_chan.get(mien, 0) + 1
                continue
            if not re.fullmatch(NGUON[mien]["mau_bai"], url):
                loai("URL_KHONG_PHAI_BAI"); continue
            if url in da_xem:
                loai("DA_XEM"); continue
            ref = hashlib.sha1(f"{rel}:{doc['id']}".encode("utf-8")).hexdigest()[:12]
            chon.setdefault(url, []).append(ref)

    ra = {
        "ngay_chay": date.today().isoformat(),
        "kernel": "co",  # KHONG ghi duong dan may nguoi dung vao file luot
        "so_ban_ghi_doc": so,
        "chon_doc": [{"url": u, "ref": sorted(set(r))} for u, r in sorted(chon.items())],
        "bi_chan_theo_nguon": dict(sorted(bi_chan.items(), key=lambda kv: (-kv[1], kv[0]))),
        "bi_loai": dict(sorted(bi_loai.items())),
    }
    assert set(ra) == KHOA_RA
    (luot / "ung_vien_kernel.json").write_text(json.dumps(ra, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(f"CAU NOI KERNEL: doc {so} ban ghi · chon doc {len(ra['chon_doc'])} URL · chan vi nguon chua duyet {sum(bi_chan.values())} ({len(bi_chan)} ten mien) · loai {sum(bi_loai.values())}")
    for k, v in ra["bi_loai"].items():
        print(f"  loai {k}: {v}")
    for k, v in list(ra["bi_chan_theo_nguon"].items())[:12]:
        print(f"  nguon chua duyet {k}: {v}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
