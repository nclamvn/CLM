#!/usr/bin/env python3
"""bite_dieu_phoi.py · Rang cua check_dieu_phoi.py.

CANH
====
TU DUNG LAY CANH: chep domains/dieu_phoi (mui_nhon.yaml) va domains/cncl_match/nguoi_ky.yaml vao thu
muc tam (tempfile.mkdtemp), roi tu viet mot so su kien HOP LE trong ban sao: mot cap trong mui nhon
di du vong doi duyet, gioi thieu, phan hoi, ket qua (bam noi chuoi dung). So that dang rong nen rang
khong muon so that. Don vi va nhu cau doc tu CNCLData that (chi doc). Moi phep tiem la mot loi co
that cua so su kien, nen du lieu doi thi rang van can.

RANG
====
RANG 1  · canh sach (vong doi day du, chuoi dung) -> exit 0.
RANG 2  · sua noi dung dong 1 sau khi ghi -> CHUOI_GAY.
RANG 3  · xoa dong 2 -> CHUOI_GAY.
RANG 4  · gioi thieu khi chua duyet (chuoi van dung) -> SAI_THU_TU.
RANG 5  · su kien cho nhu cau ngoai mui nhon (btl-07) -> NGOAI_MUI.
RANG 6  · nguoi ghi khong co trong nguoi_ky.yaml -> NGUOI_LA.
RANG 7  · duyet ung vien la don vi lien quan cua chinh nguoi duyet (RtR) -> XUNG_DOT.
RANG 8  · mui nhon them nhu cau co ung vien la RtR (ctd-25) -> KHONG_TRUNG_LAP.
RANG 9  · ket qua ngoai danh sach ("thanh_cong") -> LOAI_LA.
RANG 10 · don vi khong co trong so nguon -> THAM_CHIEU_TREO.

Chay: python3 bite_dieu_phoi.py     Exit 0 moi rang can · 2 co rang khong can · 3 KHONG CHAY DUOC.
"""
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import yaml

import check_dieu_phoi as C

HERE = Path(__file__).resolve().parent
CONG = HERE / "check_dieu_phoi.py"
DOM = HERE / "domains" / "dieu_phoi"
NK = HERE / "domains" / "cncl_match" / "nguoi_ky.yaml"
CNCL = HERE.parent / "CNCLData"
GY = HERE.parent / ".touch" / "lib" / "hub-cau-that.json"
if not (DOM / "mui_nhon.yaml").exists() or not NK.exists():
    print("KHONG CHAY DUOC: thieu mui_nhon.yaml hoac nguoi_ky.yaml de dung canh")
    sys.exit(3)
CFG = yaml.safe_load((DOM / "mui_nhon.yaml").read_text(encoding="utf-8"))
NGUOI = CFG["nguoi_gac_cong"][0]
MA = CFG["nhu_cau"][0]
DV_THAT = [json.loads(l)["entity"] for l in (CNCL / "domains" / "don_vi_cncl" / "claims.jsonl").read_text(encoding="utf-8").splitlines() if l.strip()]
RTR = next((d for d in DV_THAT if "RtR" in d), None)
DV = next(d for d in DV_THAT if d != RTR)
kq, tam = [], []


def chuoi(ds):
    """Gan stt va truong truoc cho danh sach su kien, tra cac dong JSON da noi chuoi dung."""
    ra, truoc = [], "GOC"
    for i, e in enumerate(ds, 1):
        e = {**e, "stt": i, "truoc": truoc}
        d = json.dumps(e, ensure_ascii=False)
        ra.append(d)
        truoc = C.bam(d)
    return ra


def vong(ma=MA, dv=DV, nguoi=NGUOI):
    b = {"nhu_cau": ma, "don_vi": dv, "nguoi": nguoi}
    return [
        {**b, "luc": "2026-10-07T09:00:00+07:00", "loai": "duyet_ung_vien", "noi_dung": "Cau nguon khop doi tuong."},
        {**b, "luc": "2026-10-08T09:00:00+07:00", "loai": "gioi_thieu", "noi_dung": "Gui email gioi thieu hai ben."},
        {**b, "luc": "2026-10-10T09:00:00+07:00", "loai": "phan_hoi", "ben": "cung", "y": "quan_tam", "noi_dung": "Ben cung hen gap."},
        {**b, "luc": "2026-10-20T09:00:00+07:00", "loai": "ket_qua", "ket_qua": "gap", "noi_dung": "Hai ben da gap."},
    ]


def canh(dong):
    t = Path(tempfile.mkdtemp(prefix="bite_dieu_phoi_"))
    tam.append(t)
    shutil.copytree(DOM, t / "dom")
    shutil.copy2(NK, t / "nguoi_ky.yaml")
    (t / "dom" / "su_kien.jsonl").write_text("".join(d + "\n" for d in dong), encoding="utf-8")
    return t


def rang(nhan, dong, ma, ky=None, sua_cfg=None):
    t = canh(dong)
    if sua_cfg:
        p = t / "dom" / "mui_nhon.yaml"
        c = yaml.safe_load(p.read_text(encoding="utf-8"))
        sua_cfg(c)
        p.write_text(yaml.safe_dump(c, allow_unicode=True), encoding="utf-8")
    r = subprocess.run([sys.executable, str(CONG), "--dom", str(t / "dom"), "--nguoi-ky", str(t / "nguoi_ky.yaml"),
                        "--cncl", str(CNCL), "--goi-y", str(GY)], capture_output=True, text=True)
    ok = r.returncode == ma and (ky is None or ky in r.stdout)
    print(f"{nhan:<62} : {'CAN OK' if ok else 'KHONG CAN !!'} (exit {r.returncode})")
    if not ok:
        print("    " + r.stdout.strip().replace("\n", "\n    ")[:600])
    kq.append(ok)


try:
    sach = chuoi(vong())
    rang("RANG 1  · canh sach, vong doi day du -> exit 0", sach, 0)
    hong = list(sach); e = json.loads(hong[0]); e["noi_dung"] = "Da sua sau khi ghi."; hong[0] = json.dumps(e, ensure_ascii=False)
    rang("RANG 2  · sua dong 1 sau khi ghi -> CHUOI_GAY", hong, 2, "CHUOI_GAY")
    rang("RANG 3  · xoa dong 2 -> CHUOI_GAY", sach[:1] + sach[2:], 2, "CHUOI_GAY")
    rang("RANG 4  · gioi thieu khi chua duyet -> SAI_THU_TU", chuoi(vong()[1:2]), 2, "SAI_THU_TU")
    rang("RANG 5  · nhu cau ngoai mui nhon -> NGOAI_MUI", chuoi(vong(ma="btl-07")[:1]), 2, "NGOAI_MUI")
    rang("RANG 6  · nguoi ghi la -> NGUOI_LA", chuoi(vong(nguoi="Nguoi La")[:1]), 2, "NGUOI_LA")
    if RTR:
        rang("RANG 7  · duyet don vi lien quan cua chinh minh -> XUNG_DOT", chuoi(vong(dv=RTR)[:1]), 2, "XUNG_DOT")
    else:
        print(f"{'RANG 7  · duyet don vi lien quan cua chinh minh -> XUNG_DOT':<62} : KHONG CAN !! KHONG TIEM DUOC (so nguon khong co RtR)")
        kq.append(False)
    rang("RANG 8  · mui nhon co ung vien RtR -> KHONG_TRUNG_LAP", [], 2, "KHONG_TRUNG_LAP",
         sua_cfg=lambda c: c["nhu_cau"].append("ctd-25"))
    lk = vong(); lk[3]["ket_qua"] = "thanh_cong"
    rang("RANG 9  · ket qua ngoai danh sach -> LOAI_LA", chuoi(lk), 2, "LOAI_LA")
    rang("RANG 10 · don vi khong co trong so nguon -> THAM_CHIEU_TREO", chuoi(vong(dv="Cong ty Khong Ton Tai")[:1]), 2, "THAM_CHIEU_TREO")
finally:
    for t in tam:
        shutil.rmtree(t, ignore_errors=True)
can = sum(kq)
print(f"\nBITE DIEU PHOI: {can}/{len(kq)} rang can")
sys.exit(0 if can == len(kq) else 2)
