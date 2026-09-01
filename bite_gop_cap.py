#!/usr/bin/env python3
"""bite_gop_cap.py · Bon rang cua buoc GOP MATCH CUNG CAP va luat chu ky theo tap con.

VI SAO CAN (18/08/2026): truoc hom nay, cao them mot nguon cho mot cap DA KY se sinh ra mot
dong match thu hai cho dung cap do. Cung mot ket luan hien hai lan, va so match phinh theo
SO NGUON chu khong theo SO CAP that. Nay engine gop lai mot dong nhieu chuoi bang chung.

Gop xong thi khoa noi dung cua dong doi, nen phai doi luon cach tra so chu ky. Luat moi:

    Chu ky con gia tri khi TAP BANG CHUNG DA KY van con nguyen trong dong, dung tung chu.
    Fact moi them vao KHONG duoc chu ky do bao ve, chung bi danh dau `chua_duyet`.

Luat nay de bi lam long mot cach vo tinh. Chi can lo tay cho "co mat mot fact da ky" thay vi
"con nguyen tung chu" la chu ky se song sot qua ca viec bang chung bi viet lai. Ba rang duoi
day canh dung ranh gioi do.

RANG 1 · GOP THAT: hai chuoi bang chung cho cung mot cap phai ra MOT dong, khong bo chuoi nao.
RANG 2 · THEM THI CON: them mot fact moi vao cap da ky thi chu ky VAN con, va fact moi phai
         bi danh dau chua_duyet. Neu khong danh dau, no se duoc trinh nhu da qua mat nguoi.
RANG 3 · SUA THI RUNG: sua mot chu trong fact DA KY thi chu ky phai rung ra.
RANG 4 · GOP DU CHU KY (them 24/08/2026): mot cap co NHIEU dong trong so thi phai gop het
         cac dong do lai roi moi tinh `chua_duyet`. Va chieu nguoc lai phai giu: cap chi co
         mot dong so ma con fact ngoai tap da ky thi VAN phai bao.

Rang 2 va rang 3 phai cung dung mot luc. Chi rang 2 thi la khoa long; chi rang 3 thi moi lan
cao them nguon la phai ky lai het, va ky lai hang loat thi chu ky mat y nghia.

Rang 4 sinh ra tu mot loi that: engine bao MATCH-0011 co bang chung "chua ai duyet", trong
khi Lam da ky dung cai fact do tu 16/08/2026 o mot dong so khac. May bao thua chu khong bao
thieu, tuc sai theo huong an toan, nhung mot cai nhan bao dong sai thuong xuyen thi nguoi ta
se bam qua no, va den luc no dung thi khong ai con nhin.

Chay: python3 bite_gop_cap.py
Exit 0 neu ca bon rang can. Exit 1 neu co rang khong can. Exit 3 neu khong dung duoc canh.
CANH
====
NUA TU DUNG, NUA MUON. Ghi ro vi day la bo rang da gay hai lan.

RANG 2 va RANG 4b TU DUNG canh: rang tiem mot fact moi vao mot cap da ky ngay tren ban sao.
Truoc 25/08/2026 chung doi "phai co san mot dong mang nhan chua_duyet" trong du lieu that, va
canh do bien mat vai phut sau khi Lam ky MATCH-0005.

RANG 1 va RANG 4a van MUON: hai cap CAP_MOI va CAP_GOP go cung theo ten thuc the that. Cap do
bien mat thi rang bao N/A va exit 3, tuc KHONG CHAY DUOC chu khong xanh. Chap nhan duoc vi no
that bai LON TIENG, nhung van la mot cho bam vao du lieu.
"""
import json, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).parent
sys.path.insert(0, str(ROOT))
from ban_tam import ban_tam

BT = None
CAP_MOI = ("CNCL-P23 · nhu cầu quốc gia", "FPT Semiconductor")


def _chay(lenh):
    r = subprocess.run([sys.executable, str(BT.match / "match_engine.py")] + lenh,
                       cwd=str(BT.match), capture_output=True, text=True, env=BT.moi_truong)
    return r.returncode, r.stdout + r.stderr


def _rows():
    p = BT.match / "out" / "matches.jsonl"
    return [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]


def _tiem_fact_moi():
    """Tu DUNG LAY CANH cho rang 2 va rang 4b, thay vi trong cho du lieu that co san.

    VI SAO (24/08/2026, ngay trong ngay viet rang 4): rang 2 va rang 4b doi 'phai co it nhat
    mot dong mang nhan chua_duyet'. Luc viet, canh do co san vi MATCH-0005 dang mang nhan.
    Lam ky phu MATCH-0005 vai phut sau. Nhan bien mat, va CAI RANG GAY, khong phai vi engine
    sai ma vi canh khong con.

    Do la mot cai bay that: rang bam vao trang thai du lieu THAT thi moi lan nguoi lam dung
    viec cua ho la rang lai do, va suc ep se doi ve phia noi rang cho de. Rang phai tu dung
    lay canh cua no tren ban lam viec tam.

    Tiem mot fact MOI cho mot cap DA KY: clone span cua capability_2 (FPT Semiconductor) va
    lay mot doan nguyen van khac trong chinh cau do, nen no van qua duoc moi cong bang chung.
    """
    p = BT.match / "domains" / "cncl_match" / "claims.jsonl"
    cs = [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]
    goc = next((c for c in cs if c["entity"] == "FPT Semiconductor" and c["field"] == "capability_2"), None)
    if goc is None or any(c["entity"] == "FPT Semiconductor" and c["field"] == "capability_3" for c in cs):
        return False
    moi = dict(goc)
    moi["field"] = "capability_3"
    moi["value"] = "thiết kế chip (FPT Semiconductor)"
    moi["note"] = "FACT DUNG DE THU, chi ton tai tren ban lam viec tam cua bite_gop_cap.py."
    if moi["value"] not in moi["evidence_span"]:
        return False
    cs.append(moi)
    p.write_text("\n".join(json.dumps(x, ensure_ascii=False) for x in cs) + "\n", encoding="utf-8")
    return True


def main():
    global BT
    with ban_tam(can_touch=False) as bt:
        BT = bt
        if not _tiem_fact_moi():
            print("KHONG CHAY DUOC: khong dung duoc canh fact moi cho cap da ky")
            return 3
        rc, out = _chay(["run", "domains/cncl_match"])
        if rc != 0:
            print(f"KHONG CHAY DUOC: run exit{rc}\n{out[-500:]}")
            return 3

        # ── RANG 1 · gop that ────────────────────────────────────────────────
        ok1 = "GOP CUNG CAP:" in out
        rows = _rows()
        cap = [m for m in rows if (m["demand"]["entity_id"], m["supply"]["entity_id"]) == CAP_MOI]
        nhieu_chuoi = [m for m in rows if len(m["rationale"].get("chuoi_bang_chung") or []) > 1]
        ok1 = ok1 and len(cap) == 1 and len(nhieu_chuoi) >= 1
        print(f"{'RANG 1 · gop that, khong bo chuoi':38s} : " +
              (f"CAN OK ({len(nhieu_chuoi)} dong nhieu chuoi, cap moi chi 1 dong)" if ok1
               else f"KHONG CAN !! cap={len(cap)} nhieu_chuoi={len(nhieu_chuoi)}"))

        # ── RANG 2 · them bang chung thi chu ky con, nhung phai danh dau ─────
        rc, out = _chay(["restore-signoff", "domains/cncl_match", "out/matches.jsonl"])
        rows = _rows()
        co_dau = [m for m in rows if (m["gate"]["signoff"] or {}).get("chua_duyet")]
        van_ky = [m for m in co_dau if (m["gate"]["signoff"] or {}).get("by") not in (None, "pending-human-review")]
        ok2 = rc == 0 and len(co_dau) >= 1 and len(van_ky) == len(co_dau) and "CHUA AI DUYET" in out
        print(f"{'RANG 2 · them thi chu ky con + danh dau':38s} : " +
              (f"CAN OK ({len(co_dau)} dong co chua_duyet ma van giu chu ky)" if ok2
               else f"KHONG CAN !! exit{rc} co_dau={len(co_dau)} van_ky={len(van_ky)}"))

        # ── RANG 4 · gop NHIEU DONG SO cua cung mot cap, ca hai chieu ───────
        # VI SAO (24/08/2026): gop_cung_cap gop nhieu match thanh mot dong, nhung trong SO
        # chung van la nhieu dong ky rieng. restore-signoff cu `break` o dong so dau tien
        # khop duoc, roi goi phan con lai la `chua_duyet`. Ket qua: mot chu ky THAT cua nguoi
        # gac cong bi giau, man hinh bao "chua ai duyet" dung cai ma nguoi do da ky. Bat duoc
        # tai MATCH-0011 (CNCL-P20 <-> Vien Han lam): hai dong ky, deu cua Lam 16/08/2026.
        #
        # KHOA CA HAI CHIEU trong cung mot rang, dung luat "test ca hai chieu":
        #   4a PHAI LAM DUOC : cap co hai dong so hop le thi gop lai, khong con chua_duyet,
        #                      va phai ghi ra da gop tu nhung dong nao.
        #   4b CAM LAM DUOC  : cap chi co mot dong so ma dong hien tai co fact ngoai tap da ky
        #                      thi VAN phai bao chua_duyet. Neu bo mat chieu nay, ban va vua
        #                      roi tro thanh mot lenh dai xa: gop het, khong con ai bi bao.
        CAP_GOP = ("CNCL-P20 · nhu cầu quốc gia", "Viện Hàn lâm Khoa học và Công nghệ Việt Nam")
        so = [json.loads(l) for l in
              (BT.match / "domains" / "cncl_match" / "signoff_ledger.jsonl")
              .read_text(encoding="utf-8").splitlines() if l.strip()]
        dong_cap = [r for r in so if (r["khoa"]["demand_entity"], r["khoa"]["supply_entity"]) == CAP_GOP]
        m_gop = next((m for m in rows
                      if (m["demand"]["entity_id"], m["supply"]["entity_id"]) == CAP_GOP), None)
        if len(dong_cap) < 2 or m_gop is None:
            print(f"{'RANG 4 · gop nhieu dong so':38s} :  N/A (canh khong con cap 2 dong so)")
            return 3
        so_gop = m_gop["gate"]["signoff"] or {}
        ok4a = (not so_gop.get("chua_duyet")) and len(so_gop.get("gop_tu") or []) == len(dong_cap)
        ok4b = len(co_dau) >= 1 and all(
            len([r for r in so if (r["khoa"]["demand_entity"], r["khoa"]["supply_entity"])
                 == (m["demand"]["entity_id"], m["supply"]["entity_id"])]) >= 1
            for m in co_dau)
        ok4 = ok4a and ok4b
        print(f"{'RANG 4 · gop nhieu dong so, hai chieu':38s} : " +
              (f"CAN OK (gop {len(dong_cap)} dong, {len(co_dau)} dong that su chua ky van bi bao)"
               if ok4 else f"KHONG CAN !! 4a={ok4a} 4b={ok4b} gop_tu={so_gop.get('gop_tu')} "
                           f"chua_duyet={so_gop.get('chua_duyet')}"))

        # ── RANG 3 · sua chu cua fact DA KY thi chu ky rung ──────────────────
        p = BT.match / "domains" / "cncl_match" / "claims.jsonl"
        cs = [json.loads(l) for l in p.read_text(encoding="utf-8").splitlines() if l.strip()]
        n = 0
        for c in cs:
            if c["entity"] == "Tập đoàn Viettel" and c["field"] == "capability_2" and "28-32 nm" in c["evidence_span"]:
                c["evidence_span"] = c["evidence_span"].replace("28-32 nm", "28 nm")
                n += 1
        if n == 0:
            print(f"{'RANG 3 · sua thi rung':38s} :  N/A (khong thay moc de sua)")
            return 3
        p.write_text("\n".join(json.dumps(x, ensure_ascii=False) for x in cs) + "\n", encoding="utf-8")
        rc, out = _chay(["restore-signoff", "domains/cncl_match", "out/matches.jsonl"])
        ok3 = rc == 2 and "BANG CHUNG DOI CHU" in out
        print(f"{'RANG 3 · sua fact da ky thi chu ky rung':38s} : " +
              (f"CAN OK (exit 2, chu ky bi go)" if ok3 else f"KHONG CAN !! exit{rc}\n{out[-400:]}"))

    tat_ca = ok1 and ok2 and ok3 and ok4
    print("-" * 62)
    print("BITE GOP CAP:", "RANG CAN" if tat_ca else "CO RANG KHONG CAN")
    return 0 if tat_ca else 1


if __name__ == "__main__":
    sys.exit(main())
