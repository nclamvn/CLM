#!/usr/bin/env python3
"""check_ap_luat_deu.py · Cong bat AP LUAT KHONG DEU giua don vi BI LOAI va don vi DA NAP.

VI SAO CO (25/08/2026): trong hai ngay, hai lan registry loai mot don vi bang mot chuan CHAT
HON chuan da dung de nap mot don vi khac trong cung mang.

  16/08  MobiFone bi loai vi VAN HANH tren thiet bi mua ngoai.
         24/08  FECON van o trong registry du cung la VAN HANH may do hang nuoc ngoai lam.
  24/08  Dabaco bi loai vi "nguon khong noi tu phat trien".
         25/08  Nhung AVAC va NAVETCO vao registry nho DUNG MOT CAU noi ho "nghien cuu, san
         xuat", va khong don vi nao trong ba don vi tu tao chung giong.

CA HAI LAN DEU LO RA VI NGUOI DI KIEM LAI, KHONG PHAI VI CONG BAT. Trong 29 o khong o nao
doi chieu duoc mot don vi bi loai voi mot don vi da nap. Do la lo hong duy nhat trong ngay
hom nay da tu chung minh la co that hai lan.

CONG NAY KHONG PHAN XU QUYET DINH. May khong biet hai ca co "cung dang" hay khong. No chi
bat BUOC PHEP SO SANH PHAI DUOC VIET RA, giong het cach cong khang_dinh_toi_thuong khong doi
claim phai dung ma doi pham vi phai duoc viet ra.

LUAT: moi lan trong scope_note co chu "KHONG NAP" thi phai co mot dong

    SO VOI DA NAP: <ten don vi da nap> · <truong> · <don vi bi loai thieu gi ma don vi kia co>

va cong kiem ba dieu, deu kiem duoc bang may:
  1. Co IT NHAT MOT dong do khong (xem ghi chu trong ma ve vi sao khong doi moi lan mot dong).
  2. Ten don vi neu trong dong CO THAT trong claims.jsonl, tuc la mot don vi DA NAP.
  3. Truong neu trong dong CO THAT tren dung don vi do.

Diem 2 va 3 la phan co rang: khong the viet bua mot cai ten cho qua cong.

Chay: python3 check_ap_luat_deu.py domains/don_vi_cncl
Exit 0 sach. Exit 2 co ca loai chua doi chieu. Exit 3 KHONG CHAY DUOC.
"""
import json, re, sys, unicodedata
from pathlib import Path

NHAN = "SO VOI DA NAP:"
LOAI = "KHONG NAP"


def bo_dau(s):
    """Bo dau tieng Viet de doi chieu ten viet co dau voi ghi chu viet khong dau.

    PHAI XU RIENG CHU D GACH NGANG. NFD tach duoc dau thanh va dau mu thanh ky tu to hop, nhung
    "d" (U+0111) la MOT KY TU RIENG chu khong phai "d" cong dau, nen no khong bi tach ra.
    Ban dau thieu cho nay va cong bao "Tap doan Dabaco Viet Nam khong phai don vi da nap",
    trong khi don vi do vua duoc nap 20 phut truoc. Mot cong bao sai kieu do se bi tat ngay.
    """
    s = s.replace("\u0111", "d").replace("\u0110", "D")
    s = unicodedata.normalize("NFD", s)
    return "".join(c for c in s if unicodedata.category(c) != "Mn").lower()


def main(domain_dir):
    d = Path(domain_dir)
    cp, dy = d / "claims.jsonl", d / "domain.yaml"
    if not cp.exists() or not dy.exists():
        print("KHONG CHAY DUOC: thieu claims.jsonl hoac domain.yaml.")
        return 3
    claims = [json.loads(l) for l in cp.read_text(encoding="utf-8").splitlines() if l.strip()]
    # Ban do don vi DA NAP -> tap truong cua no. Khoa la ten da bo dau de doi chieu duoc voi
    # ghi chu viet khong dau.
    da_nap = {}
    for c in claims:
        da_nap.setdefault(bo_dau(c["entity"]), set()).add(c["field"])

    # DOC BANG PARSER YAML THAT, KHONG BANG REGEX (sua 25/08/2026).
    #
    # Ban dau cho nay dung regex vi "cai can la van ban cua tung muc, khong phai cau truc".
    # Hau qua lo ra trong vong 20 phut: ghi chu toi them vao co mot cap nhay kep long trong
    # mot chuoi da nhay kep, tuc YAML HONG. Regex van doc duoc, cong van bao XANH, va cong
    # refinery.py phia sau moi la cai no ra vi no dung parser that.
    #
    # Mot cong doc file cau truc bang regex co the XANH HON CA PARSER. Do la mot dang hai
    # nguon su that, va no lam cong noi doi theo huong nguy nhat: bao an toan tren mot file
    # ma he thong that khong doc noi.
    try:
        import yaml
        doc = yaml.safe_load(dy.read_text(encoding="utf-8")) or {}
    except Exception as e:
        print(f"KHONG CHAY DUOC: domain.yaml khong parse duoc: {type(e).__name__}: {e}")
        return 3
    sn = doc.get("scope_note") or {}
    muc = [(k, str(v)) for k, v in sn.items() if k.startswith("ap_dung_")]
    if not muc:
        print("KHONG CHAY DUOC: khong doc duoc muc ap_dung_* nao trong domain.yaml.")
        return 3

    thieu, sai_ten, sai_truong, dat = [], [], [], []
    for ten, noi_dung in muc:
        so_lan_loai = noi_dung.count(LOAI)
        if not so_lan_loai:
            continue
        dong = re.findall(re.escape(NHAN) + r"\s*([^·]+)·\s*([a-z0-9_]+)\s*·", noi_dung)
        # DOI IT NHAT MOT DONG DOI CHIEU, KHONG DOI MOI LAN NHAC MOT DONG.
        #
        # Ban dau cho nay doi len(dong) >= so lan xuat hien chu "KHONG NAP". No bao gia ngay
        # trong lan chay thu hai: ghi chu moi cua chinh toi co cau "Ket luan KHONG NAP o muc
        # nay da bi sua lai", tuc mot cau NHAC DEN mot quyet dinh loai chu khong phai mot
        # quyet dinh loai. Cong dem chu, khong dem hanh vi.
        #
        # LAN THU BA trong hai ngay mot cong moi bao gia ngay lan chay dau, sau "so 1" o cong
        # khang dinh toi thuong va sau viec cat sai tu ghep o cong tham chieu treo. Cung mot
        # dang: bat theo mat chu tren van ban tu do thi luon co ca nhac den bi tinh la ca that.
        # Mot cong bao gia se bi tat, nen tha bat thieu con hon bat bua.
        #
        # Cai that su phai chan la mot ca loai MA KHONG CO DOI CHIEU NAO. Do la dung hai ca da
        # xay ra: MobiFone va Dabaco deu khong co dong doi chieu nao ca.
        if not dong:
            thieu.append((ten, so_lan_loai, 0))
            continue
        if len(dong) < so_lan_loai:
            print(f"  luu y: {ten} co {so_lan_loai} lan nhac 'KHONG NAP' ma {len(dong)} dong "
                  f"doi chieu. Khong FAIL, vi dem chu khong phai dem hanh vi.")
        for ten_dv, truong in dong:
            k = bo_dau(ten_dv.strip())
            khop = [kk for kk in da_nap if k and (k in kk or kk in k)]
            if not khop:
                sai_ten.append((ten, ten_dv.strip()))
            elif truong not in set().union(*[da_nap[kk] for kk in khop]):
                sai_truong.append((ten, ten_dv.strip(), truong))
            else:
                dat.append((ten, ten_dv.strip(), truong))

    co_loai = sum(1 for _, n in muc if LOAI in n)
    print(f"muc scope_note: {len(muc)} · muc co ca LOAI: {co_loai} · doi chieu dat: {len(dat)}")

    ma = 0
    if thieu:
        print(f"\nCA LOAI MA CHUA DOI CHIEU VOI DON VI DA NAP ({len(thieu)}):")
        for ten, can, co in thieu:
            print(f"  {ten:34} · {can} lan KHONG NAP · moi co {co} dong doi chieu")
        ma = 2
    if sai_ten:
        print(f"\nDOI CHIEU VOI DON VI KHONG CO TRONG REGISTRY ({len(sai_ten)}):")
        for ten, dv in sai_ten:
            print(f"  {ten:34} · '{dv}' khong phai don vi da nap")
        ma = 2
    if sai_truong:
        print(f"\nDOI CHIEU TREN TRUONG DON VI KIA KHONG CO ({len(sai_truong)}):")
        for ten, dv, tr in sai_truong:
            print(f"  {ten:34} · {dv} khong co truong '{tr}'")
        ma = 2

    if ma:
        print(f'\nFAIL: moi lan loai mot don vi phai viet ra mot dong')
        print(f'  {NHAN} <ten don vi da nap> · <truong> · <bi loai thieu gi ma don vi kia co>')
        print("Cong khong phan xu quyet dinh. No bat buoc PHEP SO SANH phai duoc viet ra, vi")
        print("hai lan ap luat khong deu trong dung hai ngay deu lo ra do nguoi di kiem lai,")
        print("khong phai do cong bat.")
        return 2
    print("\nOK: moi ca loai deu da doi chieu voi mot don vi da nap co that.")
    return 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("usage: check_ap_luat_deu.py <domain_dir>")
    sys.exit(main(sys.argv[1]))
