#!/usr/bin/env python3
"""bite_hang_cho.py · Bay rang cua vong tu chay (tim_bai, kiem_de_xuat, check_hang_cho).

CANH
====
TU DUNG LAY CANH: rang tu viet trong thu muc tam (tempfile) mot registry mot claim, mot trang
danh muc va mot ban tai gia dang web_fetch. Khong doc registry that, khong doc hang cho that,
khong can mang. Registry that co bao nhieu claim, hang cho that co bao nhieu dong, rang van
chay y nguyen.

Ma ly do lay tu docstring cua kiem_de_xuat.py qua chinh ten ma (SPAN_KHONG_NGUYEN_VAN...). Cong
doi ten ma thi rang do lon tieng, khong am tham kiem mot luat cu.

RANG
====
RANG 1 · NGAY BAI LAY TU URL, KHONG TU AGENT: bai 12 ngay tuoi bi xep qua_cu; danh muc rong
         -> exit 3, khong phai "khong co bai moi".
RANG 2 · CONG LOAI DUNG MA: span bia, value vuot span, nguon ngoai danh sach, ma_so_thue,
         trung registry, normalized them tu khong khai -> moi ca loai voi DUNG ma cua no.
         Hai ca hop le (verbatim, normalized co khai) -> vao hang cho.
RANG 3 · CHI DE XUAT: sau khi kiem_de_xuat chay, van tay claims.jsonl KHONG DOI.
RANG 4 · KHONG NAP HAI LAN: chay lai cung luot -> exit 3, hang cho khong them dong nao.
         Chay lai tim_bai tren luot da nap -> exit 3, bai_can_doc.json (ho so) khong bi ghi de.
RANG 5 · BAN TAI BI SUA THI DO: doi mot chu trong ban tai sau khi nap -> check exit 2.
RANG 6 · MAY GHI REGISTRY THI DO: chen mot claim tro vao vong_tu_chay/ khong co duyet -> exit 2;
         them dong duyet co ten nguoi -> exit 0. Chieu nguoc lai cung phai qua.
RANG 7 · CHUA CO LUOT NAO LA KHONG CHAY DUOC: nhat_ky rong -> exit 3, khong phai 0.

Chay: python3 bite_hang_cho.py
"""
import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
PY = sys.executable
URL_OK = "https://mst.gov.vn/thu-truong-lam-chu-cong-nghe-loi-thiet-bi-dien-500-kv-197260928141640959.htm"
URL_CU = "https://mst.gov.vn/mot-bai-cu-ve-chip-ban-dan-197260917090000001.htm"
DV = "Tổng công ty Thiết bị điện Đông Anh"
CAU = "Tổng công ty Thiết bị điện Đông Anh đã chế tạo thành công cuộn kháng bù ngang 500 kV đầu tiên."


def chay(*lenh):
    r = subprocess.run([PY, *map(str, lenh)], capture_output=True, text=True)
    return r.returncode, r.stdout + r.stderr


def van_tay(p):
    return hashlib.sha256(Path(p).read_bytes()).hexdigest()


def dung_canh(t):
    cn = t / "CNCLData"
    (cn / "domains" / "don_vi_cncl").mkdir(parents=True)
    (cn / "domains" / "don_vi_cncl" / "claims.jsonl").write_text(json.dumps({
        "entity": DV, "field": "nang_luc_mo_ta", "value": "máy biến áp 500 kV",
        "evidence_span": "sản xuất máy biến áp 500 kV", "extraction": "verbatim", "tier": "B",
        "capture": {"url": "https://x.vn/a", "snapshot": "a.html", "source": "x.vn",
                    "fetched_at": "2026-07-18T00:00:00Z"}}, ensure_ascii=False) + "\n", encoding="utf-8")
    luot = cn / "vong_tu_chay" / "luot" / "2026-09-29"
    (luot / "danh_muc").mkdir(parents=True)
    (luot / "bai").mkdir()
    (luot / "danh_muc" / "kh.md").write_text(
        f"Trang\nhttps://mst.gov.vn/tin-tuc-su-kien/khoa-hoc-va-cong-nghe.htm\n\n"
        f"### [Làm chủ công nghệ lõi thiết bị điện 500 kV]({URL_OK} \"t\")\n\n"
        f"Dự án chế tạo cuộn kháng bù ngang 500 kV.\n\n"
        f"### [Bài cũ về chip bán dẫn]({URL_CU} \"t\")\n\nChip.\n", encoding="utf-8")
    (luot / "bai" / "b1.md").write_text(
        f"Tieu de\n{URL_OK}\n\n---\ncanonical: {URL_OK}\n---\n\nMở đầu bài.\n\n{CAU}\n\n"
        f"Ông nói dự án đảm bảo   tiến độ\nvà chất lượng.\n", encoding="utf-8")
    return cn, luot


def de_xuat(luot):
    goc = {"entity": DV, "field": "nang_luc_mo_ta", "extraction": "verbatim", "url": URL_OK,
           "ly_do": "bai noi ro don vi che tao"}
    ca = [
        {**goc, "value": "cuộn kháng bù ngang 500 kV", "evidence_span": CAU},                         # 1 nhan
        {**goc, "value": "cuộn kháng", "evidence_span": "Đông Anh đã chế tạo 100 cuộn kháng mỗi năm"},  # 2 SPAN
        {**goc, "value": "máy cắt 500 kV", "evidence_span": CAU},                                      # 3 VALUE
        {**goc, "url": "https://masothue.com/x", "value": "cuộn kháng", "evidence_span": CAU},          # 4 NGUON
        {**goc, "field": "ma_so_thue", "value": "0100100008", "evidence_span": CAU},                   # 5 TRUONG
        {**goc, "value": "máy biến áp 500 kV", "evidence_span": CAU},                                  # 6 TRUNG_REG
        {**goc, "extraction": "normalized", "value": "Đông Anh xuất khẩu cuộn kháng",
         "evidence_span": CAU},                                                                        # 7 VALUE
        {**goc, "field": "bang_chung_nang_luc", "extraction": "normalized",
         "value": "dự án đảm bảo tiến độ và chất lượng",
         "evidence_span": "Ông nói dự án đảm bảo tiến độ và chất lượng.",
         "note": "CHUAN HOA CO CHU DICH: khong them tu, chi gop khoang trang"},                        # 8 nhan
    ]
    (luot / "de_xuat.jsonl").write_text("\n".join(json.dumps(c, ensure_ascii=False) for c in ca) + "\n",
                                       encoding="utf-8")


def in_(nhan, ok, chi):
    print(f"{nhan:62} : " + (f"CAN OK ({chi})" if ok else f"KHONG CAN !! {chi}"))
    return ok


def main():
    doc = (HERE / "kiem_de_xuat.py").read_text(encoding="utf-8")
    for ma in ("SPAN_KHONG_NGUYEN_VAN", "VALUE_VUOT_SPAN", "NGUON_NGOAI_DANH_SACH",
               "TRUONG_KHONG_DUOC_PHEP", "TRUNG_REGISTRY"):
        if ma not in doc:
            print(f"KHONG CHAY DUOC: kiem_de_xuat.py khong con ma {ma}. Rang khong doan ten moi.")
            return 3

    t = Path(tempfile.mkdtemp(prefix="bite_hang_cho_"))
    kq = []
    try:
        cn, luot = dung_canh(t)
        claims = cn / "domains" / "don_vi_cncl" / "claims.jsonl"
        hang_cho = cn / "vong_tu_chay" / "hang_cho.jsonl"
        loai_p = cn / "vong_tu_chay" / "loai.jsonl"
        tim, kiem, check = HERE / "tim_bai.py", HERE / "kiem_de_xuat.py", HERE / "check_hang_cho.py"

        # RANG 7 truoc tien: chua co luot
        rc, _ = chay(check, "--goc", t)
        kq.append(in_("RANG 7 · chua co luot nao -> exit 3", rc == 3, f"exit {rc}"))

        # RANG 1
        rc, out = chay(tim, luot, "--goc", t, "--ngay", "2026-09-29")
        bcd = json.loads((luot / "bai_can_doc.json").read_text(encoding="utf-8")) if rc == 0 else {}
        tt = {b["url"]: b["trang_thai"] for b in bcd.get("tat_ca", [])}
        kq.append(in_("RANG 1a · bai moi du diem duoc chon doc", tt.get(URL_OK) == "chon_doc", str(tt.get(URL_OK))))
        kq.append(in_("RANG 1b · bai 12 ngay tuoi bi xep qua_cu", tt.get(URL_CU) == "qua_cu", str(tt.get(URL_CU))))
        rong = t / "rong"
        (rong / "danh_muc").mkdir(parents=True)
        rc, _ = chay(tim, rong, "--goc", t)
        kq.append(in_("RANG 1c · danh muc rong -> exit 3", rc == 3, f"exit {rc}"))

        # RANG 2 + 3
        de_xuat(luot)
        vt_truoc = van_tay(claims)
        rc, out = chay(kiem, luot, "--goc", t)
        if rc != 0:
            print(out)
        loai = {l["stt"]: l["ly_do"] for l in (json.loads(x) for x in loai_p.read_text(encoding="utf-8").splitlines())} if loai_p.exists() else {}
        nhan = [json.loads(x) for x in hang_cho.read_text(encoding="utf-8").splitlines()] if hang_cho.exists() else []
        mong = {2: "SPAN_KHONG_NGUYEN_VAN", 3: "VALUE_VUOT_SPAN", 4: "NGUON_NGOAI_DANH_SACH",
                5: "TRUONG_KHONG_DUOC_PHEP", 6: "TRUNG_REGISTRY", 7: "VALUE_VUOT_SPAN"}
        for stt, ma in mong.items():
            kq.append(in_(f"RANG 2 · de xuat {stt} bi loai voi {ma}", ma in loai.get(stt, []), str(loai.get(stt))))
        kq.append(in_("RANG 2 · dung hai de xuat hop le vao hang cho", len(nhan) == 2 and 1 not in loai and 8 not in loai,
                      f"{len(nhan)} dong"))
        kq.append(in_("RANG 2 · tier do cong gan, khong tu agent", all(h["tier"] == "A" for h in nhan), "A"))
        kq.append(in_("RANG 3 · claims.jsonl khong doi sau khi kiem", van_tay(claims) == vt_truoc, "van tay"))

        # RANG 4
        n_truoc = hang_cho.read_text(encoding="utf-8")
        rc, _ = chay(kiem, luot, "--goc", t)
        kq.append(in_("RANG 4 · nap lai cung luot -> exit 3, hang cho y nguyen",
                      rc == 3 and hang_cho.read_text(encoding="utf-8") == n_truoc, f"exit {rc}"))
        bcd_p = luot / "bai_can_doc.json"
        bcd_truoc = bcd_p.read_text(encoding="utf-8")
        rc, _ = chay(tim, luot, "--goc", t)
        kq.append(in_("RANG 4b · chon bai lai tren luot da nap -> exit 3, ho so y nguyen",
                      rc == 3 and bcd_p.read_text(encoding="utf-8") == bcd_truoc, f"exit {rc}"))

        # RANG 5
        rc0, out0 = chay(check, "--goc", t)
        kq.append(in_("RANG 5a · canh sach -> check exit 0", rc0 == 0, f"exit {rc0}"))
        if rc0 != 0:
            print(out0)
        b1 = luot / "bai" / "b1.md"
        goc_txt = b1.read_text(encoding="utf-8")
        b1.write_text(goc_txt.replace("đầu tiên", "thứ hai"), encoding="utf-8")
        assert goc_txt.count("đầu tiên") == 1
        rc, out = chay(check, "--goc", t)
        kq.append(in_("RANG 5b · sua ban tai sau khi nap -> exit 2", rc == 2 and "VAN_TAY_LECH" in out, f"exit {rc}"))
        b1.write_text(goc_txt, encoding="utf-8")

        # RANG 6
        h = nhan[0]
        c = {k: h[k] for k in ("entity", "field", "value", "evidence_span", "extraction", "tier")}
        c["capture"] = {"url": h["capture"]["url"], "snapshot": h["capture"]["snapshot"], "source": "mst.gov.vn",
                        "fetched_at": "2026-09-29T00:00:00Z"}
        c["hang_cho_id"] = h["id"]
        with claims.open("a", encoding="utf-8") as f:
            f.write(json.dumps(c, ensure_ascii=False) + "\n")
        rc, out = chay(check, "--goc", t)
        kq.append(in_("RANG 6a · claim tu vong khong co duyet -> exit 2", rc == 2 and "CHI_DE_XUAT" in out, f"exit {rc}"))
        (cn / "vong_tu_chay" / "duyet.jsonl").write_text(json.dumps(
            {"id": h["id"], "ket_luan": "nhan", "nguoi": "Lam", "ngay": "2026-09-29"}) + "\n", encoding="utf-8")
        rc, out = chay(check, "--goc", t)
        kq.append(in_("RANG 6b · co dong duyet cua nguoi -> exit 0", rc == 0, f"exit {rc}"))
        if rc != 0:
            print(out)
    finally:
        shutil.rmtree(t, ignore_errors=True)

    tong, can = len(kq), sum(kq)
    print(f"\nBITE HANG CHO: {can}/{tong} rang can")
    return 0 if can == tong else 2


if __name__ == "__main__":
    sys.exit(main())
