#!/usr/bin/env python3
"""bang_lo.py · Sinh BANG DUYET cua mot lo lam giau tu du lieu, khong go tay.

Doc trong <thu_muc_dot>: lo.json (kiem_lo.py), mo_phong.json (mo_phong_lo.py, nen chay voi
--duyet duyet_de_xuat.json), duyet_de_xuat.json, du_phong.jsonl, honest_null_*.jsonl,
khuyen_nghi.json, doi_chieu_ket_qua*.jsonl (neu co: ket qua doi chung doc lap).
Ghi <thu_muc_dot>/BANG_DUYET.md. Moi chu nguon trong bang la chep tu lo.json.

Chay: python3 bang_lo.py <thu_muc_dot>     Exit 0 xong · 3 KHONG CHAY DUOC.
"""
import glob
import json
import sys
from pathlib import Path


def thoat3(m):
    print(f"KHONG CHAY DUOC: {m}")
    sys.exit(3)


def doc(p, mac=None):
    p = Path(p)
    if not p.exists():
        if mac is not None:
            return mac
        thoat3(f"thieu {p}")
    return json.loads(p.read_text(encoding="utf-8"))


def jl(pat):
    out = []
    for f in sorted(glob.glob(str(pat))):
        out += [json.loads(l) for l in Path(f).read_text(encoding="utf-8").splitlines() if l.strip()]
    return out


def ngay(s):
    return "không rõ ngày" if not s else f"{s[8:10]}/{s[5:7]}/{s[:4]}"


def main():
    if len(sys.argv) < 2:
        thoat3("thieu <thu_muc_dot>")
    D = Path(sys.argv[1]).resolve()
    lo, mp = doc(D / "lo.json"), doc(D / "mo_phong.json")
    de, kn = doc(D / "duyet_de_xuat.json"), doc(D / "khuyen_nghi.json")
    du, null = jl(D / "du_phong.jsonl"), jl(D / "honest_null_*.jsonl")
    dc = {r["url"]: r for r in jl(D / "doi_chieu_ket_qua*.jsonl")}
    gc = de.get("ghi_chu", {})
    if mp.get("duyet") != de.get("nguoi_duyet"):
        thoat3("mo_phong.json khong chay voi duyet_de_xuat.json; chay lai mo_phong_lo.py --duyet")
    dong = lo["dong"]
    theo_dv = {}
    for i, d in enumerate(dong):
        theo_dv.setdefault(d["entity"], []).append((i, d))
    thieu_kn = [e for e in theo_dv if e not in kn["don_vi"]]
    if thieu_kn:
        thoat3(f"khuyen_nghi.json thieu don vi: {thieu_kn}")

    def dc_url(u):
        r = dc.get(u)
        if not r:
            return "chưa đối chứng"
        if r.get("fetch") != "ok":
            return "không tải lại được"
        kq = [s["ket_qua"] for s in r.get("span", [])]
        if not kq:
            return "chưa đối chứng"
        s = "khớp" if all(k == "KHOP" for k in kq) else "LỆCH: " + ", ".join(k for k in kq if k != "KHOP")
        if r.get("ngay_khop") is False:
            s += f"; ngày trên trang {ngay(r.get('ngay_trang'))}"
        return s

    muc_thu_tu = {"Duyệt": 0, "Cân nhắc": 1, "Gạch": 2}
    dv_sx = sorted(theo_dv, key=lambda e: (muc_thu_tu[kn["don_vi"][e]["muc"]], theo_dv[e][0][1]["nhu_cau"], e))
    sau, truoc = mp["ghep_sau"], mp["ghep_truoc"]
    moi_uv = [u for u in sau["ung_vien"] if u["ky"] == "pending-human-review"]
    dem = {m: sum(1 for e in theo_dv if kn["don_vi"][e]["muc"] == m) for m in muc_thu_tu}
    nc_lo = sorted({d["nhu_cau"] for d in dong})
    kiem = sum(1 for r in dc.values() if r.get("fetch") == "ok")

    L = []
    w = L.append
    w(f"# Bảng duyệt lô làm giàu {lo['dot']}")
    w("")
    w("Sinh tự động bởi `CNCLData/lam_giau/bang_lo.py` từ dữ liệu của lô; mọi câu trong ngoặc kép là "
      "nguyên văn nguồn. Chưa có dòng nào vào registry.")
    w("")
    w("## Tóm tắt")
    w("")
    w(f"- **{len(dong)} claim, {len(theo_dv)} đơn vị** ({len(lo['don_vi_moi'])} đơn vị mới, "
      f"{len(lo['don_vi_cu'])} đơn vị đã có), phủ {len(nc_lo)} nhu cầu: {', '.join(nc_lo)}.")
    w(f"- **Khuyến nghị của tôi:** duyệt {dem['Duyệt']}, cân nhắc {dem['Cân nhắc']}, gạch {dem['Gạch']} đơn vị. "
      "Đây là đánh giá, không phải quyết định.")
    w(f"- **Mô phỏng nạp cả lô vào bản sao của kho:** ứng viên ghép {len(truoc['ung_vien'])} → {len(sau['ung_vien'])}; "
      f"nhu cầu có ứng viên {len(mp['nhu_cau_co_ung_vien_truoc'])} → {len(mp['nhu_cau_co_ung_vien_sau'])} "
      f"(mới: {', '.join(x.replace('CNCL-', '') for x in mp['nhu_cau_moi_co_ung_vien'])}). "
      f"Chữ ký đã có: {'giữ nguyên 11/11' if not mp['chu_ky_mat'] else 'MẤT ' + ', '.join(mp['chu_ky_mat'])}.")
    w(f"- **Cổng của registry:** với các ghi chú đề xuất dưới đây, mô phỏng cho {len(mp['cong_do_tung_dong'])} dòng "
      f"làm đỏ cổng và cổng đỏ cả lô: {', '.join(mp['cong_do_ca_lo']) or 'không có'}. "
      f"Có {len(gc)} dòng cần anh duyệt ghi chú (giữ nguồn cũ, đủ điều kiện, khẳng định tối thượng, tham chiếu).")
    w(f"- **Đối chứng độc lập** (người kiểm khác tải lại trang gốc): {kiem}/{len({d['url'] for d in dong})} trang.")
    w("")
    w("## Cách trả lời")
    w("")
    w("Trả lời trong chat, ví dụ: \"duyệt theo khuyến nghị\", hoặc \"duyệt hết, gạch 1Matrix và dòng 17\", "
      "hoặc \"duyệt VKIST, TT Vũ trụ, VNTT; còn lại để vòng sau\". Tôi ghi quyết định của anh vào `duyet.json` "
      "nguyên văn, rồi nạp bằng `nap_lo.py`. Sau khi nạp, "
      f"{len(moi_uv)} cặp ứng viên mới sẽ chờ anh ký hoặc từ chối trong engine; chuỗi cổng đỏ cho tới khi anh quyết.")
    w("")
    w("## Từng đơn vị")
    for n, e in enumerate(dv_sx, 1):
        rs = theo_dv[e]
        k = kn["don_vi"][e]
        f = {d["field"]: (i, d) for i, d in rs}
        d0 = rs[0][1]
        w("")
        w(f"### {n}. {e} · {d0['nhu_cau']} · khuyến nghị: **{k['muc']}**")
        w("")
        loai = f.get("loai_hinh", (None, {}))[1].get("value")
        mien = sorted({(d["url"].split("/")[2].removeprefix("www."), d["tier_de_xuat"], d.get("ngay_bai")) for _, d in rs})
        w(f"- {'Đơn vị mới' if e in lo['don_vi_moi'] else 'Đơn vị đã có'}"
          + (f", loại {loai}" if loai else "") + ". Nguồn: "
          + "; ".join(f"{m} (hạng {t}, {ngay(nb)})" for m, t, nb in mien) + ".")
        co = sorted({c for _, d in rs for c in d.get("_co", [])})
        if co:
            w(f"- Cờ: {', '.join(co)}.")
        for fld, nhan in (("nang_luc_mo_ta", "Năng lực"), ("nang_luc_mo_ta_2", "Năng lực (thêm)"),
                          ("bang_chung_nang_luc", "Bằng chứng")):
            if fld in f:
                i, d = f[fld]
                w(f"- {nhan} [dòng {i}]: \"{d['value']}\"")
        for u in sorted({d["url"] for _, d in rs}):
            w(f"- Nguồn: {u} · đối chứng: {dc_url(u)}")
        w(f"- Máy tìm ghi: {d0['ly_do']}")
        for i, d in rs:
            if str(i) in gc:
                w(f"- Ghi chú đề xuất cho dòng {i} ({d['field']}): {gc[str(i)]}")
        w(f"- Nhận xét của tôi: {k['ly_do']}")
        w(f"- Các dòng của đơn vị này: {', '.join(str(i) for i, _ in rs)}.")
    w("")
    w("## Ứng viên ghép mới sau khi nạp (mô phỏng)")
    w("")
    w("| Cầu | Cung | Điểm | Từ giao | Ghi chú |")
    w("|---|---|---|---|---|")
    for u in sorted(moi_uv, key=lambda x: (x["cau"], -x["diem"])):
        gcu = kn.get("ung_vien", {}).get(f"{u['cung']}|{u['cau']}", "")
        w(f"| {u['cau'].replace('CNCL-', '')} | {u['cung']} | {str(u['diem']).replace('.', ',')} | {', '.join(u['tu_giao'])} | {gcu} |")
    w("")
    w("## Đề xuất không đưa vào lô")
    w("")
    for r in du:
        w(f"- {r['entity']} · {r['field']} · {r['nhu_cau']} · {r['ly_do_du_phong'].split(':')[0]}: \"{r['value'][:140]}\"")
    w("")
    w("Nhóm O_DA_CO_GIA_TRI cần một quyết định về cấu trúc: mỗi trường của registry chỉ giữ một giá trị, "
      "nên muốn thêm mảng năng lực thứ ba cho Viettel, FPT hay VNPT thì phải thêm trường mới vào domain.yaml.")
    w("")
    w(f"## Đã xét mà không đề xuất ({len(null)})")
    w("")
    for r in null:
        w(f"- {r.get('nhu_cau')} · {r.get('entity') or '(cả nhu cầu)'}: {r.get('ly_do')}")
    (D / "BANG_DUYET.md").write_text("\n".join(L) + "\n", encoding="utf-8")
    print(f"BANG DUYET: {len(theo_dv)} don vi · {len(dong)} dong · {len(moi_uv)} ung vien moi · ghi {D / 'BANG_DUYET.md'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
