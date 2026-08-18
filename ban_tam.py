#!/usr/bin/env python3
"""ban_tam.py · Dung mot BAN LAM VIEC TAM: ban sao cua ba kho, de bo rang tiem loi vao do.

VI SAO (18/08/2026): moi bo rang deu phai tiem mot loi that vao du lieu roi xem cong co no
khong. Truoc hom nay chung tiem thang vao kho that va tra lai sau. Tra lai dung, da kiem tung
byte. Nhung tu khi chuoi cong sinh luon file tra cuu ma nguoi dung mo, cua so vai giay do co
mot file THAT mang du lieu HONG nam tren dia.

Chua ai vap. Nhung "chua vap" khong phai mot bao dam, no chi la mot mau nho. Va cai gia de
bo han kha nang do la mot lan chep ba megabyte, khoang mot giay ruoi.

CACH DUNG (trong bo rang):

    from ban_tam import ban_tam
    with ban_tam() as bt:
        # bt.moi_truong la dict env de truyen cho subprocess
        # bt.cncl / bt.match / bt.touch / bt.ra_tracuu la duong dan trong ban sao
        ...

KHONG chep .git, node_modules, .next: rang khong dung toi, ma chep thi cham gap hai muoi lan.

LUAT: ham nay KHONG BAO GIO ghi vao kho that. Neu mot ngay nao do phai them duong ghi nguoc,
phai co ly do viet ra day, vi day dung la cho de mat canh giac.
"""
import os, shutil, tempfile
from contextlib import contextmanager
from pathlib import Path

BO_QUA = shutil.ignore_patterns(".git", "node_modules", ".next", "__pycache__", "*.pyc")
# Cua .touch chi chep phan cac cong dung toi. Ca kho la 71 MB, phan can la 1,2 MB.
TOUCH_CAN = ["scripts", "lib", "app", "components", "styles", "docs", "package.json"]


def _goc(*duoi):
    for g in [Path("/Users/os"), *sorted(Path("/sessions").glob("*/mnt"))]:
        p = g.joinpath(*duoi)
        if p.exists():
            return p
    return None


class BanTam:
    def __init__(self, goc_tam, cncl, dem, match, touch, ra_tracuu):
        self.goc = goc_tam
        self.cncl, self.dem, self.match, self.touch = cncl, dem, match, touch
        self.ra_tracuu = ra_tracuu

    @property
    def moi_truong(self):
        """env cho subprocess. Ke thua env hien tai roi tro moi kho ve ban sao."""
        e = dict(os.environ)
        e.update({
            "CLM_KHO_CNCL": str(self.cncl),
            "CLM_KHO_DEM": str(self.dem),
            "CLM_KHO_MATCH": str(self.match),
            "CLM_KHO_TOUCH": str(self.touch),
            "CLM_RA_TRACUU": str(self.ra_tracuu),
        })
        return e


@contextmanager
def ban_tam(can_touch=True):
    cncl_that = _goc("CNCLData")
    match_that = _goc("CaoLocMatch")
    dem_that = _goc("RtR", "KnowledgeBase", "Dataset_CongNgheChienLuoc") \
        or _goc("KnowledgeBase", "Dataset_CongNgheChienLuoc")
    touch_that = _goc(".touch")
    thieu = [t for t, p in [("CNCLData", cncl_that), ("CaoLocMatch", match_that),
                            ("Dataset_CongNgheChienLuoc", dem_that)] if p is None]
    if thieu:
        raise SystemExit(f"KHONG DUNG DUOC BAN TAM: thieu kho {', '.join(thieu)}")

    g = Path(tempfile.mkdtemp(prefix="clm-ban-tam-"))
    try:
        shutil.copytree(cncl_that, g / "CNCLData", ignore=BO_QUA)
        shutil.copytree(match_that, g / "CaoLocMatch", ignore=BO_QUA)
        shutil.copytree(dem_that, g / "Dataset_CongNgheChienLuoc", ignore=BO_QUA)
        touch_tam = g / "touch"
        if can_touch and touch_that:
            touch_tam.mkdir()
            for ten in TOUCH_CAN:
                nguon = touch_that / ten
                if not nguon.exists():
                    continue
                if nguon.is_dir():
                    shutil.copytree(nguon, touch_tam / ten, ignore=BO_QUA)
                else:
                    shutil.copy2(nguon, touch_tam / ten)
            ev = touch_that / "public" / "evidence"
            if ev.exists():
                (touch_tam / "public").mkdir(exist_ok=True)
                shutil.copytree(ev, touch_tam / "public" / "evidence")
        yield BanTam(g, g / "CNCLData", g / "Dataset_CongNgheChienLuoc",
                     g / "CaoLocMatch", touch_tam, g / "CaoLocMatch_TraCuu.html")
    finally:
        shutil.rmtree(g, ignore_errors=True)


if __name__ == "__main__":
    with ban_tam() as bt:
        n = sum(1 for _ in bt.goc.rglob("*") if _.is_file())
        print(f"BAN TAM: {bt.goc}")
        print(f"  {n} file · cncl={bt.cncl.name} match={bt.match.name} touch={bt.touch.name}")
        print(f"  ra_tracuu={bt.ra_tracuu}")
        print("  (tu xoa khi thoat)")
