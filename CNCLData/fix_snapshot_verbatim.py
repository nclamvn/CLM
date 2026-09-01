#!/usr/bin/env python3
"""fix_snapshot_verbatim.py · Tra cau trich trong snapshot ve DUNG CHU CUA NGUON.

VI SAO CAN (16/08/2026): cong check_snapshot_fidelity.py chay du 31 trang bat 26 cau lech.
Phan lon la snapshot Pha 1 (18/07) ghi truoc khi cong ton tai: bi go markup, chinh khoang
trang, sua chinh ta. Noi dung dung nhung CHU khong khop tung ky tu, tuc pham loi nguyen van.

CACH LAM (fail-loud, khong doan bua):
  1. Voi moi dong lech, tim doan trong BAN TUOI chua nhieu tu cua dong do nhat.
  2. Mo rong ve hai phia toi ranh gioi cau.
  3. Chi thay the khi cau nguon phu >= NGUONG ty le tu cua dong cu. Duoi nguong -> BAO TAY.
  4. Sau khi thay, claim nao tro toi dong cu duoc cap nhat span; neu value khong con nam
     tron trong span moi thi doi verbatim sang normalized kem note.

Mac dinh CHI BAO, khong ghi. Them --ghi de thuc su ghi.
Exit 0 neu moi dong xu ly duoc, 2 neu con dong phai xu tay.
"""
import json, re, sys, unicodedata, html
from pathlib import Path

ROOT = Path(__file__).parent
SNAP = ROOT / "domains/don_vi_cncl/snapshots"
FRESH = ROOT / ".fidelity_fresh"
CLAIMS = ROOT / "domains/don_vi_cncl/claims.jsonl"
NGUONG = 0.60
# Chan do dai: cau nguon khong duoc dai qua DAI_TOI_DA lan dong cu. Neu khong, mot cau
# nguon rat dai se "chua" hau het tu cua dong cu mot cach ngau nhien va cho khop gia.
# Bay ca da bi bat nho chan nay (vjst_viettel_llm, nhandan_uav...).
DAI_TOI_DA = 2.2


def n(s):
    return unicodedata.normalize("NFC", html.unescape(s or ""))


def tu(s):
    return [w for w in re.findall(r"[0-9A-Za-zÀ-ỹ]+", n(s).lower()) if len(w) > 1]


def cau_nguon(raw, dong):
    """Tim cau trong ban tuoi ung voi dong snapshot. Tra ve (cau, ty_le_tu_phu)."""
    words = tu(dong)
    if not words:
        return None, 0.0
    # moc: chuoi dai nhat cua dong con tim thay trong ban tuoi
    moc, best = None, 0
    for i in range(len(dong)):
        for j in range(len(dong), i + 12, -1):
            frag = n(dong[i:j])
            if len(frag) > best and frag in raw:
                moc, best = frag, len(frag)
                break
    if moc is None:
        return None, 0.0
    k = raw.find(moc)
    # mo rong ve hai phia toi ranh gioi cau
    dau = max(raw.rfind("\n", 0, k), raw.rfind(". ", 0, k) + 1, raw.rfind("* ", 0, k) + 1)
    dau = 0 if dau < 0 else dau
    cuoi = raw.find(".", k + len(moc))
    cuoi = len(raw) if cuoi < 0 else cuoi + 1
    c = raw[dau:cuoi].strip().lstrip("*").strip()
    phu = sum(1 for w in words if w in tu(c)) / len(words)
    return c, phu


def main(ghi):
    claims = [json.loads(l) for l in CLAIMS.read_text(encoding="utf-8").splitlines() if l.strip()]
    span_dung = {c["evidence_span"] for c in claims}
    doi, taytay = {}, []

    for f in sorted(SNAP.iterdir()):
        fr = FRESH / f.name
        if not fr.exists():
            continue
        raw = n(fr.read_text(encoding="utf-8", errors="replace"))
        for line in f.read_text(encoding="utf-8", errors="replace").splitlines():
            s = line.strip()
            if not s or s.startswith("#") or n(s) in raw:
                continue
            c, phu = cau_nguon(raw, s)
            dung = "DUNG" if s in span_dung else "khong dung"
            dai_ok = c is not None and len(c) <= max(len(s) * DAI_TOI_DA, len(s) + 60)
            if c and phu >= NGUONG and dai_ok and c != s:
                doi[s] = c
                print(f"[SUA {phu:.0%} {dung:11}] {f.name[:30]}")
                print(f"    cu   : {s[:96]}")
                print(f"    nguon: {c[:96]}")
            else:
                ly = "phu thap" if (not c or phu < NGUONG) else "cau nguon qua dai"
                taytay.append((f.name, s, phu, ly))
                print(f"[TAY {phu:.0%} {dung:11}] {f.name[:30]} · {ly} :: {s[:64]}")

    print("-" * 66)
    print(f"tu dong sua duoc: {len(doi)} · phai xu tay: {len(taytay)}")
    if not ghi:
        print("CHE DO CHI BAO. Them --ghi de thuc su ghi.")
        return 2 if taytay else 0

    for f in sorted(SNAP.iterdir()):
        t = f.read_text(encoding="utf-8")
        goc = t
        for cu, moi in doi.items():
            if cu in t:
                t = t.replace(cu, moi)
        if t != goc:
            f.write_text(t, encoding="utf-8")

    k = 0
    for c in claims:
        moi = doi.get(c["evidence_span"])
        if not moi:
            continue
        c["evidence_span"] = moi
        k += 1
        them = ("Span tra ve DUNG CHU CUA NGUON ngay 16/08/2026 sau khi cong doi chung "
                "chay du 31 trang. Ban cu bi go markup hoac chinh dinh dang khi ghi snapshot. "
                "Gia tri claim khong doi.")
        c["note"] = ((c.get("note", "") + " ") if c.get("note") else "") + them
        if c["extraction"] == "verbatim" and n(str(c["value"])) not in n(moi):
            c["extraction"] = "normalized"
            c["note"] += " Doi verbatim sang normalized vi gia tri khong con nam tron trong span moi."
    CLAIMS.write_text("\n".join(json.dumps(r, ensure_ascii=False) for r in claims) + "\n",
                      encoding="utf-8")
    print(f"DA GHI: {len(doi)} dong snapshot, {k} claim.")
    return 2 if taytay else 0


if __name__ == "__main__":
    sys.exit(main("--ghi" in sys.argv))
