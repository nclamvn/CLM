#!/usr/bin/env python3
"""check_dieu_phoi.py · So su kien dieu phoi chi ghi viec NGUOI da lam, khong sua duoc ve sau, va
moi su kien dung thu tu cua vong doi mot cap.

VI SAO CO (07/10/2026): hub dung o chu ky; tu nay moi cap trong mui nhon duoc theo tu luc duyet ung
vien toi luc co ket qua. So su kien la noi duy nhat ghi viec nguoi lam (duyet, gioi thieu, phan
hoi, ket qua). May KHONG ghi vao so nay: hang viec la thu tinh lai duoc tu so, khong phai su kien.

CONG KIEM (domains/dieu_phoi/su_kien.jsonl, mui_nhon.yaml, cncl_match/nguoi_ky.yaml):
  CHUOI_GAY        truong "truoc" cua mot dong khac SHA-256 cua dong lien truoc (dong dau: "GOC"),
                   hoac stt khong lien tuc: co nguoi sua hay xoa mot dong cu.
  LOAI_LA          loai su kien, y phan hoi, ket qua hay ben ngoai danh sach cho phep.
  THIEU_TRUONG     thieu truong bat buoc cua loai su kien, hoac noi_dung con la cho trong "..." cua
                   lenh mau tren man Dieu phoi.
  NGOAI_MUI        nhu cau khong nam trong mui nhon.
  THAM_CHIEU_TREO  nhu cau khong co trong domain cau_dat_hang, hoac don vi khong co trong so nguon.
  NGUOI_LA         nguoi ghi khong co trong nguoi_ky.yaml; hoac duyet ma khong phai nguoi gac cong.
  XUNG_DOT         nguoi duyet hay gioi thieu cho mot don vi nam trong danh sach lien_quan cua ho.
  SAI_THU_TU       gioi thieu khi chua duyet; phan hoi hay ket qua khi chua gioi thieu; duyet lai
                   cap da duyet; su kien sau khi nhu cau da dong; thoi diem lui ve truoc.
  KHONG_TRUNG_LAP  mui nhon co nhu cau ma ung vien may goi y la don vi lien quan cua nguoi gioi
                   thieu hay nguoi gac cong (mui nhon phai la noi hub dung ngoai cuoc).
  EM_DASH          em-dash trong noi dung.

So rong la hop le (chua ai ghi gi): exit 0 kem dong ghi ro.

Chay: python3 check_dieu_phoi.py [--dom <dieu_phoi>] [--nguoi-ky <yaml>] [--cncl <CNCLData>] [--goi-y <hub-cau-that.json>]
Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
"""
import hashlib
import json
import sys
from pathlib import Path

import yaml

HERE = Path(__file__).resolve().parent
LOAI = {
    "duyet_ung_vien": ["nhu_cau", "don_vi", "noi_dung"],
    "tu_choi_ung_vien": ["nhu_cau", "don_vi", "noi_dung"],
    "gioi_thieu": ["nhu_cau", "don_vi", "noi_dung"],
    "phan_hoi": ["nhu_cau", "don_vi", "ben", "y", "noi_dung"],
    "ket_qua": ["nhu_cau", "don_vi", "ket_qua", "noi_dung"],
    "dong_nhu_cau": ["nhu_cau", "noi_dung"],
}
Y = {"quan_tam", "tu_choi", "chua_ro"}
BEN = {"cung", "cau"}
KET_QUA = {"gap", "thi_diem", "hop_dong", "dung"}
EM = chr(0x2014)


def bam(dong):
    return hashlib.sha256(dong.encode("utf-8")).hexdigest()


def arg(k, mac_dinh):
    return Path(sys.argv[sys.argv.index(k) + 1]).resolve() if k in sys.argv else mac_dinh


def nap(dom, nguoi_ky, cncl, goi_y):
    """Doc moi dau vao. Tra (dong_tho, su_kien, cfg, nguoi, don_vi, nhu_cau_dh, goi_y_cua) hoac nem SystemExit(3)."""
    for p in (dom / "mui_nhon.yaml", nguoi_ky):
        if not p.exists():
            print(f"KHONG CHAY DUOC: thieu {p}")
            raise SystemExit(3)
    cfg = yaml.safe_load((dom / "mui_nhon.yaml").read_text(encoding="utf-8")) or {}
    nguoi = (yaml.safe_load(nguoi_ky.read_text(encoding="utf-8")) or {}).get("nguoi_ky") or {}
    pk = dom / "su_kien.jsonl"
    tho = [l for l in pk.read_text(encoding="utf-8").split("\n") if l.strip()] if pk.exists() else []
    try:
        sk = [json.loads(l) for l in tho]
    except json.JSONDecodeError as e:
        print(f"KHONG CHAY DUOC: su_kien.jsonl hong: {e}")
        raise SystemExit(3)
    dv = cncl / "domains" / "don_vi_cncl" / "claims.jsonl"
    dh = cncl / "domains" / "cau_dat_hang" / "claims.jsonl"
    if not dv.exists() or not dh.exists():
        print(f"KHONG CHAY DUOC: thieu {dv if not dv.exists() else dh}")
        raise SystemExit(3)
    don_vi = {json.loads(l)["entity"] for l in dv.read_text(encoding="utf-8").splitlines() if l.strip()}
    nhu_cau = {json.loads(l)["entity"] for l in dh.read_text(encoding="utf-8").splitlines() if l.strip()}
    goi_y_cua = {}
    if goi_y and goi_y.exists():
        for n in json.loads(goi_y.read_text(encoding="utf-8")).get("nhuCau", []):
            goi_y_cua[n["ma"]] = [g["dv"] for g in n.get("goiY", [])]
    return tho, sk, cfg, nguoi, don_vi, nhu_cau, goi_y_cua


def kiem(tho, sk, cfg, nguoi, don_vi, nhu_cau, goi_y_cua):
    """Luat cua so. Tra danh sach vi pham (chuoi). Dung chung cho cong va cho lenh ghi."""
    vi = []
    mui = set(cfg.get("nhu_cau") or [])
    gac = set(cfg.get("nguoi_gac_cong") or [])
    gt = cfg.get("nguoi_gioi_thieu")
    lq = lambda n: set((nguoi.get(n) or {}).get("lien_quan") or [])  # noqa: E731
    for n in sorted(gac | ({gt} if gt else set())):
        if n not in nguoi:
            vi.append(f"NGUOI_LA: mui_nhon.yaml khai '{n}' ma nguoi_ky.yaml khong co")
    for ma in sorted(mui):
        if ma not in nhu_cau:
            vi.append(f"THAM_CHIEU_TREO: mui nhon co {ma} ma domain cau_dat_hang khong co")
        for d in goi_y_cua.get(ma, []):
            for n in sorted(gac | ({gt} if gt else set())):
                if d in lq(n):
                    vi.append(f"KHONG_TRUNG_LAP: {ma} co ung vien {d} la don vi lien quan cua {n}")
    truoc, luc_truoc = "GOC", ""
    da_duyet, da_gt, da_dong, da_tu_choi = set(), set(), set(), set()
    for i, (dong, e) in enumerate(zip(tho, sk), 1):
        tag = f"dong {i}"
        if e.get("stt") != i:
            vi.append(f"CHUOI_GAY: {tag} stt {e.get('stt')} (phai la {i})")
        if e.get("truoc") != truoc:
            vi.append(f"CHUOI_GAY: {tag} truong truoc khong khop bam dong lien truoc")
        truoc = bam(dong)
        loai = e.get("loai")
        if loai not in LOAI:
            vi.append(f"LOAI_LA: {tag} loai '{loai}'")
            continue
        # "..." la cho trong cua lenh mau tren man Dieu phoi (07/10/2026): quen dien thi coi nhu thieu.
        thieu = [k for k in ["luc", "nguoi", *LOAI[loai]] if str(e.get(k, "")).strip() in ("", "...")]
        if thieu:
            vi.append(f"THIEU_TRUONG: {tag} {loai} thieu {', '.join(thieu)}")
            continue
        if str(e["luc"]) < luc_truoc:
            vi.append(f"SAI_THU_TU: {tag} thoi diem {e['luc']} lui ve truoc {luc_truoc}")
        luc_truoc = max(luc_truoc, str(e["luc"]))
        ma, dv, ng = e["nhu_cau"], e.get("don_vi"), e["nguoi"]
        if ma not in mui:
            vi.append(f"NGOAI_MUI: {tag} nhu cau {ma}")
        if ma not in nhu_cau:
            vi.append(f"THAM_CHIEU_TREO: {tag} nhu cau {ma} khong co trong cau_dat_hang")
        if dv is not None and dv not in don_vi:
            vi.append(f"THAM_CHIEU_TREO: {tag} don vi '{dv}' khong co trong so nguon")
        if ng not in nguoi:
            vi.append(f"NGUOI_LA: {tag} '{ng}' khong co trong nguoi_ky.yaml")
        if loai in ("duyet_ung_vien", "tu_choi_ung_vien", "dong_nhu_cau") and ng not in gac:
            vi.append(f"NGUOI_LA: {tag} {loai} boi '{ng}' khong phai nguoi gac cong cua mui nhon")
        if dv and loai in ("duyet_ung_vien", "gioi_thieu") and dv in lq(ng):
            vi.append(f"XUNG_DOT: {tag} {ng} {loai} cho {dv}, don vi lien quan cua chinh ho")
        if loai == "phan_hoi" and (e["y"] not in Y or e["ben"] not in BEN):
            vi.append(f"LOAI_LA: {tag} phan_hoi y '{e['y']}' ben '{e['ben']}'")
        if loai == "ket_qua" and e["ket_qua"] not in KET_QUA:
            vi.append(f"LOAI_LA: {tag} ket_qua '{e['ket_qua']}'")
        if EM in str(e.get("noi_dung", "")):
            vi.append(f"EM_DASH: {tag}")
        cap = (ma, dv)
        if ma in da_dong:
            vi.append(f"SAI_THU_TU: {tag} {loai} sau khi nhu cau {ma} da dong")
        if loai == "duyet_ung_vien":
            if cap in da_duyet or cap in da_tu_choi:
                vi.append(f"SAI_THU_TU: {tag} cap {ma} · {dv} da duoc xet truoc do")
            da_duyet.add(cap)
        elif loai == "tu_choi_ung_vien":
            if cap in da_duyet or cap in da_tu_choi:
                vi.append(f"SAI_THU_TU: {tag} cap {ma} · {dv} da duoc xet truoc do")
            da_tu_choi.add(cap)
        elif loai == "gioi_thieu":
            if cap not in da_duyet:
                vi.append(f"SAI_THU_TU: {tag} gioi thieu {ma} · {dv} khi chua duyet ung vien")
            da_gt.add(cap)
        elif loai in ("phan_hoi", "ket_qua"):
            if cap not in da_gt:
                vi.append(f"SAI_THU_TU: {tag} {loai} {ma} · {dv} khi chua gioi thieu")
        elif loai == "dong_nhu_cau":
            da_dong.add(ma)
    return vi


def main():
    dom = arg("--dom", HERE / "domains" / "dieu_phoi")
    nk = arg("--nguoi-ky", HERE / "domains" / "cncl_match" / "nguoi_ky.yaml")
    cncl = arg("--cncl", HERE.parent / "CNCLData")
    gy = arg("--goi-y", HERE.parent / ".touch" / "lib" / "hub-cau-that.json")
    tho, sk, cfg, nguoi, don_vi, nhu_cau, goi_y = nap(dom, nk, cncl, gy)
    vi = kiem(tho, sk, cfg, nguoi, don_vi, nhu_cau, goi_y)
    from collections import Counter
    dem = Counter(e.get("loai") for e in sk)
    print(f"dieu phoi: mui nhon '{cfg.get('ten')}' · {len(cfg.get('nhu_cau') or [])} nhu cau · {len(sk)} su kien"
          + (" · " + " · ".join(f"{k} {v}" for k, v in sorted(dem.items())) if dem else " (so rong, chua ai ghi)"))
    if vi:
        print(f"\nFAIL: {len(vi)} vi pham")
        for x in vi[:30]:
            print("  " + x)
        return 2
    print("\nOK: so su kien nguyen chuoi, dung thu tu vong doi, dung nguoi, khong xung dot loi ich, mui nhon trung lap.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
