#!/usr/bin/env python3
"""bite_cau_noi_kernel.py · Rang cua cau_noi_kernel.py.

CANH
====
TU DUNG LAY CANH: dung mot kernel GIA trong thu muc tam (tempfile.mkdtemp) va mot thu muc luot tam.
Khong doc, khong sua kernel that. Moi ban ghi gia mang mot loi rieng; mot ban ghi sach duy nhat
phai lot qua. Cac ban ghi noi bo mang chuoi BI_MAT_* de do ro ri.

RANG
====
RANG 1 · BAN GHI SACH (mst.gov.vn, tier A, capability, URL bai day du) -> duoc chon doc.
RANG 2 · MANG deal_link -> loai KHOA_NOI_BO, khong chon.
RANG 3 · TIER INT -> loai TIER_KHONG_CONG_KHAI.
RANG 4 · favors rtr -> loai NGHIENG_RTR.
RANG 5 · NAM TRONG THU MUC pricing/ -> loai DUONG_NOI_BO.
RANG 6 · kind opportunity (pursuit) -> loai KIND_NGOAI_DANH_SACH.
RANG 7 · source "rtr internal" -> loai KHONG_URL.
RANG 8 · URL cong khai nhung ten mien chua duyet -> chi DEM trong bi_chan_theo_nguon, khong chon.
RANG 9 · KHONG RO RI: moi chuoi BI_MAT_* (trong internal_notes, published_statement, evidence_span,
         entity) khong duoc xuat hien trong file ra; file ra chi co dung bo khoa cho phep.
RANG 10 · URL DA XEM -> loai DA_XEM, khong doc lai.
RANG 11 · THIEU KERNEL -> exit 3, khong phai "0 ung vien".

Chay: python3 bite_cau_noi_kernel.py
"""
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
CAU = HERE / "cau_noi_kernel.py"
URL_SACH = "https://mst.gov.vn/doanh-nghiep-viet-lam-chu-cong-nghe-chip-197260915101010101.htm"
URL_DA_XEM = "https://mst.gov.vn/bai-da-doc-truoc-do-197260910101010101.htm"
KHOA_RA = {"ngay_chay", "kernel", "so_ban_ghi_doc", "chon_doc", "bi_chan_theo_nguon", "bi_loai"}


def ghi(p, recs):
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text("".join(json.dumps(r, ensure_ascii=False) + "\n" for r in recs), encoding="utf-8")


def main():
    kq = []

    def in_ra(nhan, ok, chi):
        print(f"{nhan:<62} : {'CAN OK' if ok else 'KHONG CAN !!'} ({chi})")
        kq.append(ok)

    tam = Path(tempfile.mkdtemp(prefix="bite_cau_noi_"))
    try:
        k = tam / "kernel"
        goc = {"source_tier": "A", "kind": "capability", "favors": "neutral"}
        ghi(k / "industry-map" / "domains" / "x" / "records.jsonl", [
            {**goc, "id": "SACH", "source": URL_SACH, "entity": "BI_MAT_ENTITY_SACH", "evidence_span": "BI_MAT_SPAN_SACH", "published_statement": "BI_MAT_PS"},
            {**goc, "id": "DEAL", "source": "https://mst.gov.vn/bai-co-deal-197260915202020202.htm", "deal_link": "DEAL-BI_MAT_DEAL"},
            {**goc, "id": "INT", "source": "https://mst.gov.vn/bai-noi-bo-197260915303030303.htm", "source_tier": "INT", "internal_notes": ""},
            {**goc, "id": "RTR", "source": "https://mst.gov.vn/bai-rtr-197260915404040404.htm", "favors": "rtr"},
            {**goc, "id": "OPP", "source": "https://mst.gov.vn/bai-pursuit-197260915505050505.htm", "kind": "opportunity"},
            {**goc, "id": "NOIBO", "source": "rtr internal", "internal_notes": "BI_MAT_GHI_CHU_NOI_BO gia chao 1,2 ty"},
            {**goc, "id": "NGOAI", "source": "https://moit.gov.vn/tin-tuc/bai-cong-khai.html"},
            {**goc, "id": "DAXEM", "source": URL_DA_XEM},
        ])
        ghi(k / "signals-pipeline" / "pricing" / "records.jsonl", [
            {**goc, "id": "GIA", "source": "https://mst.gov.vn/bai-gia-197260915606060606.htm", "evidence_span": "BI_MAT_GIA"},
        ])
        luot = tam / "luot"
        luot.mkdir()
        (luot / "bai_can_doc.json").write_text(json.dumps({"chon_doc": [URL_DA_XEM]}), encoding="utf-8")
        r = subprocess.run([sys.executable, str(CAU), str(luot), "--kernel", str(k)], capture_output=True, text=True)
        ra_txt = (luot / "ung_vien_kernel.json").read_text(encoding="utf-8") if (luot / "ung_vien_kernel.json").exists() else ""
        ra = json.loads(ra_txt) if ra_txt else {}
        chon = [c["url"] for c in ra.get("chon_doc", [])]
        loai = ra.get("bi_loai", {})

        in_ra("RANG 1 · ban ghi sach -> duoc chon", r.returncode == 0 and chon == [URL_SACH], f"exit {r.returncode}, chon {len(chon)}")
        in_ra("RANG 2 · deal_link -> KHOA_NOI_BO", loai.get("KHOA_NOI_BO", 0) >= 2 and "bai-co-deal" not in ra_txt, f"{loai.get('KHOA_NOI_BO')}")
        in_ra("RANG 3 · tier INT -> TIER_KHONG_CONG_KHAI", loai.get("TIER_KHONG_CONG_KHAI") == 1, f"{loai.get('TIER_KHONG_CONG_KHAI')}")
        in_ra("RANG 4 · favors rtr -> NGHIENG_RTR", loai.get("NGHIENG_RTR") == 1, f"{loai.get('NGHIENG_RTR')}")
        in_ra("RANG 5 · thu muc pricing -> DUONG_NOI_BO", loai.get("DUONG_NOI_BO") == 1 and "bai-gia" not in ra_txt, f"{loai.get('DUONG_NOI_BO')}")
        in_ra("RANG 6 · kind opportunity -> KIND_NGOAI_DANH_SACH", loai.get("KIND_NGOAI_DANH_SACH") == 1, f"{loai.get('KIND_NGOAI_DANH_SACH')}")
        # "rtr internal" co internal_notes nen bi loai o KHOA_NOI_BO truoc; dem chung o rang 2. Rang 7
        # thu rieng mot ban ghi khong URL va khong khoa noi bo.
        ghi(k / "industry-map" / "domains" / "y" / "records.jsonl", [{**goc, "id": "KHONGURL", "source": "rtr brochure"}])
        r7 = subprocess.run([sys.executable, str(CAU), str(luot), "--kernel", str(k)], capture_output=True, text=True)
        ra7 = json.loads((luot / "ung_vien_kernel.json").read_text(encoding="utf-8"))
        in_ra("RANG 7 · source khong phai URL -> KHONG_URL", r7.returncode == 0 and ra7["bi_loai"].get("KHONG_URL") == 1, f"{ra7['bi_loai'].get('KHONG_URL')}")
        in_ra("RANG 8 · ten mien chua duyet -> chi dem", ra.get("bi_chan_theo_nguon", {}).get("moit.gov.vn") == 1 and not any("moit" in u for u in chon), f"{ra.get('bi_chan_theo_nguon')}")
        ro = [s for s in ("BI_MAT", "DEAL-", "gia chao") if s in ra_txt]
        in_ra("RANG 9 · khong ro ri chu noi bo, chi khoa cho phep", not ro and set(ra) == KHOA_RA and str(k) not in ra_txt, f"ro ri {ro}")
        in_ra("RANG 10 · URL da xem -> DA_XEM", loai.get("DA_XEM") == 1 and URL_DA_XEM not in chon, f"{loai.get('DA_XEM')}")
        r11 = subprocess.run([sys.executable, str(CAU), str(luot), "--kernel", str(tam / "khong_co")],
                             capture_output=True, text=True, env={"PATH": "/usr/bin:/bin", "HOME": str(tam)})
        in_ra("RANG 11 · thieu kernel -> exit 3", r11.returncode == 3, f"exit {r11.returncode}")
    finally:
        shutil.rmtree(tam, ignore_errors=True)
    can = sum(kq)
    print(f"\nBITE CAU NOI KERNEL: {can}/{len(kq)} rang can")
    return 0 if can == len(kq) else 2


if __name__ == "__main__":
    sys.exit(main())
