#!/usr/bin/env python3
"""bite_ap_luat_deu.py · Bon rang cua cong check_ap_luat_deu.py.

Cong nay de tro thanh mot cai den xanh hon moi cong khac trong he, vi cai no doi la MOT DONG
VAN BAN. Rat de viet mot phien ban chi kiem "co chu SO VOI DA NAP hay khong", va ban do se
xanh voi mot dong bia dat hoan toan. RANG 2 va RANG 3 la de chan dung cho do.

RANG 1 · KHONG CO DOI CHIEU THI DO: go het dong SO VOI DA NAP -> exit 2.
RANG 2 · BIA TEN THI DO: doi chieu voi mot don vi khong co trong registry -> exit 2.
RANG 3 · BIA TRUONG THI DO: ten that nhung truong don vi do khong co -> exit 2.
RANG 4 · SACH THI XANH.

Chay: python3 bite_ap_luat_deu.py
CANH
====
MUON DU LIEU THAT, co chu, va day la diem yeu da biet.

Rang chep domain.yaml va claims.jsonl that vao thu muc tam roi tiem vao BAN SAO. Kho that
khong bi cham. Nhung canh chi ton tai khi domain.yaml CON IT NHAT MOT ca KHONG NAP: het ca
loai thi cong tra 0 tu nhien, RANG 1 khong con gi de go, va ca bo rang mat y nghia trong im
lang. Chua tu dung duoc vi cong doc ca cau truc scope_note that.
"""
import re, shutil, subprocess, sys, tempfile
from pathlib import Path

HERE = Path(__file__).parent
CONG = HERE / "check_ap_luat_deu.py"


def chay(d):
    r = subprocess.run([sys.executable, str(CONG), str(d)], capture_output=True, text=True)
    return r.returncode, r.stdout + r.stderr


def in_(nhan, ok, chi):
    print(f"{nhan:44} : " + (f"CAN OK ({chi})" if ok else f"KHONG CAN !! {chi}"))


def main():
    tam = Path(tempfile.mkdtemp(prefix="bite-ap-luat-"))
    d = tam / "don_vi_cncl"
    shutil.copytree(HERE / "domains" / "don_vi_cncl", d,
                    ignore=shutil.ignore_patterns("snapshots"))
    dy = d / "domain.yaml"
    goc = dy.read_text(encoding="utf-8")

    nen_ma, nen_ra = chay(d)
    if nen_ma != 0:
        print(f"KHONG CHAY DUOC: ban sao chua tiem gi ma da exit {nen_ma}\n{nen_ra}")
        shutil.rmtree(tam, ignore_errors=True)
        return 3

    # RANG 1 · go het dong doi chieu
    dy.write_text(re.sub(r"SO VOI DA NAP:[^·]+·[^·]+·", "", goc), encoding="utf-8")
    ma, ra = chay(d)
    ok1 = ma == 2 and "CHUA DOI CHIEU" in ra
    in_("RANG 1 · khong co doi chieu thi DO", ok1, "exit 2" if ok1 else f"exit {ma}")

    # LAY DONG DOI CHIEU DAU TIEN TU CHINH DU LIEU, khong go cung ten don vi (sua 01/09/2026).
    #
    # Ban cu viet thang chu "FECON". Ngay nao dong doi chieu cua FECON doi chu, hai phep
    # replace duoi day thanh khong-lam-gi, cong chay tren du lieu NGUYEN VEN va tra 0, rang
    # bao KHONG CAN. Tuc rang gay vi CANH doi chu khong phai vi cong hong: dung ho loi ma
    # TIP-03 duoc viet ra de chan. Nay doc ten va truong tu dong dau tien co that trong file.
    m_dau = re.search(r"SO VOI DA NAP:\s*([^·\n]+?)\s*·\s*([^·\n]+?)\s*·", goc)
    if not m_dau:
        print("KHONG CHAY DUOC: khong tim thay dong 'SO VOI DA NAP:' nao trong domain.yaml.")
        shutil.rmtree(tam, ignore_errors=True)
        return 3
    ten_dv, truong_dv = m_dau.group(1), m_dau.group(2)
    dau_ten = f"SO VOI DA NAP: {ten_dv} ·"
    dau_truong = f"SO VOI DA NAP: {ten_dv} · {truong_dv} ·"

    def thay(cu_, moi_):
        """Thay dung mot lan, va DOI no that su xay ra. Khong xay ra thi la KHONG CHAY DUOC."""
        if cu_ not in goc:
            return None
        return goc.replace(cu_, moi_, 1)

    # RANG 2 · bia ten don vi
    van = thay(dau_ten, f"SO VOI DA NAP: Cong ty Ma Khong Co That ·")
    if van is None:
        print(f"KHONG CHAY DUOC: khong tiem duoc, khong thay {dau_ten!r}.")
        shutil.rmtree(tam, ignore_errors=True)
        return 3
    dy.write_text(van, encoding="utf-8")
    ma, ra = chay(d)
    ok2 = ma == 2 and "khong phai don vi da nap" in ra
    in_("RANG 2 · bia ten don vi thi DO", ok2, "exit 2" if ok2 else f"exit {ma}")

    # RANG 3 · ten that nhung truong khong co tren don vi do
    van = thay(dau_truong, f"SO VOI DA NAP: {ten_dv} · truong_bia_dat ·")
    if van is None:
        print(f"KHONG CHAY DUOC: khong tiem duoc, khong thay {dau_truong!r}.")
        shutil.rmtree(tam, ignore_errors=True)
        return 3
    dy.write_text(van, encoding="utf-8")
    ma, ra = chay(d)
    ok3 = ma == 2 and "khong co truong" in ra
    in_("RANG 3 · bia truong thi DO", ok3, "exit 2" if ok3 else f"exit {ma}")

    # RANG 4 · tra lai nguyen trang
    dy.write_text(goc, encoding="utf-8")
    ma, ra = chay(d)
    ok4 = ma == 0 and "OK: moi ca loai" in ra
    in_("RANG 4 · tra lai nguyen trang thi XANH", ok4, "exit 0" if ok4 else f"exit {ma}")

    shutil.rmtree(tam, ignore_errors=True)
    tat_ca = ok1 and ok2 and ok3 and ok4
    print("-" * 62)
    print("BITE AP LUAT DEU:", "RANG CAN" if tat_ca else "CO RANG KHONG CAN")
    return 0 if tat_ca else 1


if __name__ == "__main__":
    sys.exit(main())
