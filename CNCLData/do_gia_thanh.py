#!/usr/bin/env python3
"""do_gia_thanh.py · Do GIA THANH MOT CLAIM. Moc M1 cua chuong trinh nha may tinh loc.

VI SAO CAN (25/08/2026): ca chuong trinh tu dong hoa dua tren mot loi hua "giam gia thanh mot
bac". Chua biet dang ton bao nhieu thi khong chung minh duoc da giam bao nhieu, va cai gi khong
do duoc thi se duoc ke lai bang cam giac.

HAI PHEP DO KHAC NHAU, TUYET DOI KHONG DUOC TRON:

  lich_su · dung lai tu lich su git: bao nhieu claim tang len giua hai commit, cach nhau bao
            lau. RE, co ngay hom nay, va la MOT CAN DUOI CUA CHI PHI. No chi thay khuc GO PHIM,
            khong thay khuc di tim nguon, doc bai, loai bai tai tro, va viet ghi chu. Nhung
            khuc khong thay do lai chinh la khuc ton thoi gian nhat.

  vong    · do that: bam gio khi bat dau mot vong lam, bam lai khi xong. Dat hon nhung dung.

LUAT FAIL-CLOSED: so lich_su KHONG duoc dung lam moc so sanh cho M2. Neu ngan sach chua co so
do that, lenh `moc` tra ve KHONG CHAY DUOC chu khong lang le lay so lich_su. Do la hai dai
luong khac nhau, va tron chung lai thi M2 se "dat" ma khong ai giam duoc gi.

Chay:
    python3 do_gia_thanh.py lich_su
    python3 do_gia_thanh.py bat_dau "cao nhom 6"
    python3 do_gia_thanh.py ket_thuc
    python3 do_gia_thanh.py moc
"""
import json, re, subprocess, sys, datetime
from pathlib import Path

HERE = Path(__file__).parent
CLAIMS = HERE / "domains" / "don_vi_cncl" / "claims.jsonl"
SO = HERE / "so_gia_thanh.jsonl"
NGAN_SACH = HERE / "ngan_sach_gia_thanh.txt"
DANG_CHAY = HERE / ".vong_dang_chay.json"

# Hai commit cach nhau qua xa thi khong con la mot vong lam, do la hai buoi khac nhau.
KHE_TOI_DA_PHUT = 90


def _no_do_tuoi():
    """So claim mau-hong qua han MA CHUA co ly do, doc tu CHINH CONG check_do_tuoi.py.

    Khong chep lai logic cua cong vao day. Chep lai la tao ra hai nguon su that, va den luc
    chung lech nhau thi khong ai biet cai nao dung.
    """
    r = subprocess.run([sys.executable, str(HERE / "check_do_tuoi.py"), str(HERE / "domains" / "don_vi_cncl")],
                       capture_output=True, text=True)
    m = re.search(r"mau hong qua han:\s*(\d+)\s*chua co ly do", r.stdout)
    return int(m.group(1)) if m else None


def _git(*a):
    return subprocess.run(["git", "-C", str(HERE), *a], capture_output=True, text=True).stdout


def _dem(rev):
    ra = subprocess.run(["git", "-C", str(HERE), "show", f"{rev}:domains/don_vi_cncl/claims.jsonl"],
                        capture_output=True, text=True)
    if ra.returncode != 0:
        return None
    return sum(1 for l in ra.stdout.splitlines() if l.strip())


def lich_su():
    """Gom cac commit lien tiep thanh 'buoi', roi do claim tang len tren thoi gian troi."""
    ds = []
    for h in _git("log", "--format=%H %at", "--reverse", "--", "domains/don_vi_cncl/claims.jsonl").split("\n"):
        if not h.strip():
            continue
        sha, ts = h.split()
        n = _dem(sha)
        if n is not None:
            ds.append((int(ts), n, sha[:8]))
    if len(ds) < 2:
        print("KHONG CHAY DUOC: chua du lich su de do.")
        return 3

    buoi, cur = [], [ds[0]]
    for t in ds[1:]:
        if (t[0] - cur[-1][0]) / 60 > KHE_TOI_DA_PHUT:
            buoi.append(cur)
            cur = [t]
        else:
            cur.append(t)
    buoi.append(cur)

    print(f"CAN DUOI cua chi phi, dung tu lich su git. Khe gop buoi: {KHE_TOI_DA_PHUT} phut.\n")
    print(f"{'buoi bat dau':18} {'phut':>6} {'claim +':>8} {'phut/claim':>11}")
    print("-" * 48)
    tong_phut = tong_claim = 0
    for b in buoi:
        phut = (b[-1][0] - b[0][0]) / 60
        them = b[-1][1] - b[0][1]
        ngay = datetime.datetime.fromtimestamp(b[0][0]).strftime("%d/%m/%Y %H:%M")
        if them <= 0:
            print(f"{ngay:18} {phut:6.0f} {them:8d} {'.':>11}  (buoi khong them claim)")
            continue
        print(f"{ngay:18} {phut:6.0f} {them:8d} {phut/them:11.2f}")
        tong_phut += phut
        tong_claim += them
    print("-" * 48)
    if tong_claim:
        print(f"{'TONG':18} {tong_phut:6.0f} {tong_claim:8d} {tong_phut/tong_claim:11.2f}")
    print()
    print("DOC DUNG CON SO NAY: no chi dem thoi gian GIUA CAC COMMIT, tuc khuc go phim va sua")
    print("file. No KHONG dem khuc di tim nguon, doc bai, loai bai tai tro, viet ghi chu va")
    print("chay cong. Chi phi that CAO HON con so nay, khong biet cao bao nhieu lan.")
    print("Vi vay no khong duoc dung lam moc cho M2. Xem `moc`.")
    return 0


def bat_dau(nhan):
    if DANG_CHAY.exists():
        v = json.loads(DANG_CHAY.read_text(encoding="utf-8"))
        print(f"KHONG CHAY DUOC: dang co vong '{v['nhan']}' mo tu {v['bat_dau']}. Chay ket_thuc truoc.")
        return 3
    n = sum(1 for l in CLAIMS.read_text(encoding="utf-8").splitlines() if l.strip())
    DANG_CHAY.write_text(json.dumps({
        "nhan": nhan, "bat_dau": datetime.datetime.now().isoformat(timespec="seconds"),
        "claim_truoc": n, "no_truoc": _no_do_tuoi()}, ensure_ascii=False), encoding="utf-8")
    print(f"MO VONG '{nhan}' luc {datetime.datetime.now():%H:%M} · claim hien co {n}")
    print("Xong thi chay: python3 do_gia_thanh.py ket_thuc")
    return 0


def ket_thuc():
    if not DANG_CHAY.exists():
        print("KHONG CHAY DUOC: khong co vong nao dang mo.")
        return 3
    v = json.loads(DANG_CHAY.read_text(encoding="utf-8"))
    t0 = datetime.datetime.fromisoformat(v["bat_dau"])
    t1 = datetime.datetime.now()
    n = sum(1 for l in CLAIMS.read_text(encoding="utf-8").splitlines() if l.strip())
    them = n - v["claim_truoc"]
    phut = (t1 - t0).total_seconds() / 60
    # CONG VIEC KHONG CHI LA CLAIM MOI (them 25/08/2026, ngay sau vong do thu ba).
    #
    # Vong thu ba la mot vong LAM MOI: no chi them 2 claim nhung go duoc 3 claim khoi danh
    # sach no do tuoi. Do bang "phut tren claim moi" thi vong do ra 1,96, dat gap doi hai vong
    # kia, trong khi thuc te no lam NHIEU HON. Mau so sai thi ty so vo nghia.
    #
    # Chuyen nay khong phai chi tiet ke toan: ca moc M3 song chet o viec lam moi, va mot thuoc
    # do khong nhin thay cong viec lam moi thi khong do duoc M3.
    no_sau = _no_do_tuoi()
    go_no = None
    if v.get("no_truoc") is not None and no_sau is not None:
        go_no = v["no_truoc"] - no_sau
    if them <= 0:
        print(f"VONG '{v['nhan']}': {phut:.0f} phut, KHONG them claim nao. Khong ghi vao so.")
        print("Vong khong ra claim van la chi phi that, nhung ghi no vao mau so se lam chia cho 0.")
        print("Ghi rieng de sau nay biet ty le vong hong:")
        rec = {"nhan": v["nhan"], "bat_dau": v["bat_dau"], "phut": round(phut, 1),
               "claim_them": 0, "go_no": go_no, "phut_moi_claim": None}
    else:
        viec = them + max(go_no or 0, 0)
        rec = {"nhan": v["nhan"], "bat_dau": v["bat_dau"], "phut": round(phut, 1),
               "claim_them": them, "go_no": go_no, "viec": viec,
               "phut_moi_claim": round(phut / them, 2),
               "phut_moi_viec": round(phut / viec, 2) if viec else None}
        print(f"VONG '{v['nhan']}': {phut:.0f} phut · +{them} claim · go {go_no} claim khoi no")
        print(f"  {phut/them:.2f} phut/claim moi · {phut/viec:.2f} phut/viec (claim moi + claim go khoi no)")
    with SO.open("a", encoding="utf-8") as f:
        f.write(json.dumps(rec, ensure_ascii=False) + "\n")
    DANG_CHAY.unlink()
    print(f"Da ghi vao {SO.name}. Chay `moc` de xem ngan sach.")
    return 0


def moc():
    """Ngan sach khoa mot chieu cho gia thanh. Chi duoc GIAM."""
    if not SO.exists():
        print("KHONG CHAY DUOC: chua co vong do that nao trong so_gia_thanh.jsonl.")
        print()
        print("Day la cho de gian lan nhat cua ca moc M1, nen no fail-closed:")
        print("con so `lich_su` KHONG duoc dung lam moc. Hai dai luong khac nhau, tron lai")
        print("thi M2 se 'dat muc tieu giam mot bac' ma thuc te khong giam gi.")
        print("Chay mot vong that: bat_dau -> lam -> ket_thuc.")
        return 3
    ds = [json.loads(l) for l in SO.read_text(encoding="utf-8").splitlines() if l.strip()]
    co = [r for r in ds if r["phut_moi_claim"] is not None]
    if not co:
        print("KHONG CHAY DUOC: co vong nhung chua vong nao ra claim.")
        return 3

    # TOI THIEU BA VONG truoc khi cho chot moc (them 25/08/2026, ngay sau vong do dau tien).
    #
    # VI SAO: vong dau ra 0,92 phut mot claim, trong khi lich su cua hai vong gan nhat la 21,6
    # va 43,9. Chenh hai bac. Mot con so dep bat thuong tu MOT mau la thu de tin nhat va nguy
    # nhat: neo no lam moc thi M2 phai thang 0,09 phut mot claim moi duoc coi la "giam mot bac",
    # tuc dat ra mot cai dich vo nghia roi that bai voi no.
    #
    # Cung mot luat da dung cho cong: mot cong chua tung bat duoc loi thi chua chung minh duoc
    # no song. Mot moc dua tren mot mau thi chua phai moc, no la mot giai thoai.
    TOI_THIEU = 3
    if len(co) < TOI_THIEU:
        print(f"KHONG CHAY DUOC: moi co {len(co)} vong ra claim, can it nhat {TOI_THIEU}.")
        print()
        for r in co:
            print(f"  {r['bat_dau'][:10]} · {r['nhan'][:38]:38} · {r['phut']:5.1f} phut · "
                  f"{r['claim_them']:2d} claim · {r['phut_moi_claim']:.2f} phut/claim")
        print()
        print("Va ba vong do phai KHAC DO KHO nhau. Ba vong de lien tiep cung chi cho mot")
        print("con so ve phan de, va phan de thi da hai xong.")
        return 3
    # DON VI CUA MOC LA "VIEC", KHONG PHAI "CLAIM MOI".
    # Mot vong lam moi go 3 claim khoi no ma chi them 2 claim moi. Do bang claim moi thi vong
    # do ra 1,96 phut, dat gap doi hai vong nap moi, trong khi tinh theo viec no ra 0,78, tuc
    # ngang bang. Mau so sai thi ty so vo nghia, va o day mau so sai lam mot vong TOT trong
    # nhu mot vong te.
    tong_phut = sum(r["phut"] for r in ds)
    tong_claim = sum(r["claim_them"] for r in ds)
    tong_viec = sum(r.get("viec") or r["claim_them"] for r in ds)
    hien = tong_phut / tong_viec
    hong = len(ds) - len(co)
    print(f"vong da do: {len(ds)} · vong khong ra claim: {hong}")
    print(f"tong: {tong_phut:.0f} phut · {tong_claim} claim moi · {tong_viec} viec")
    print(f"     {tong_phut/tong_claim:.2f} phut moi claim moi · {hien:.2f} PHUT MOI VIEC (don vi cua moc)")
    if not NGAN_SACH.exists():
        print(f"\nCHUA CO MOC. Ghi {hien:.2f} vao {NGAN_SACH.name} de chot muc dau tien.")
        return 2
    ns = float(NGAN_SACH.read_text(encoding="utf-8").split("\n")[0].strip())
    print(f"ngan sach: {ns:.2f} phut/claim")
    if hien > ns:
        print(f"\nFAIL: gia thanh TANG tu {ns:.2f} len {hien:.2f} phut moi claim.")
        return 2
    if hien < ns:
        print(f"\nFAIL(TOT): GIAM duoc. Sua {NGAN_SACH.name} thanh {hien:.2f} de chot muc moi.")
        return 2
    print("\nOK: dung ngan sach.")
    return 0


if __name__ == "__main__":
    lenh = sys.argv[1] if len(sys.argv) > 1 else ""
    if lenh == "lich_su":
        sys.exit(lich_su())
    if lenh == "bat_dau":
        sys.exit(bat_dau(sys.argv[2] if len(sys.argv) > 2 else "khong ten"))
    if lenh == "ket_thuc":
        sys.exit(ket_thuc())
    if lenh == "moc":
        sys.exit(moc())
    sys.exit(__doc__)
