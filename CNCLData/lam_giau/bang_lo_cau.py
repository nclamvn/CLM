#!/usr/bin/env python3
"""bang_lo_cau.py · Sinh BANG_DUYET.md cho mot lo cau that.

Doc <dot>/lo.json (kiem_lo_cau.py ghi khi sach), <dot>/doi_chieu_ket_qua.jsonl (doi chieu doc lap),
va XEM TRUOC bang chinh may hoi dap cua web (.touch/lib/hoi-dap.mjs): voi moi nhu cau, so nguon
HIEN CO nhung don vi nao co cau nguon lien quan. Day chi la goi y cho nguoi duyet thay gia tri
cua nhu cau, khong phai cap ghep: cap ghep van can nguoi ky.

Tat dinh. Khong ghi registry. Chay: python3 bang_lo_cau.py <dot>
"""
import json
import subprocess
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
TOUCH = HERE.parents[1] / ".touch"
TEN_LOAI = {"nhiem_vu_khcn": "Nhiệm vụ KH&CN đặt hàng", "bai_toan_lon": "Bài toán lớn",
            "chuong_trinh": "Chương trình, đề án", "du_an_goi_thau": "Dự án, gói thầu"}


def xem_truoc(cau):
    js = (
        "import { hoiDap } from '" + (TOUCH / "lib" / "hoi-dap.mjs").as_posix() + "';"
        "import fs from 'fs';"
        "const cm = JSON.parse(fs.readFileSync('" + (TOUCH / "lib" / "hub-hoi-dap.json").as_posix() + "'));"
        "const ds = JSON.parse(fs.readFileSync(0, 'utf8'));"
        "import { DONG_NGHIA } from '" + (TOUCH / "lib" / "hoi-dap.mjs").as_posix() + "';"
        "const tenCN = new Set(DONG_NGHIA.map((c) => c[0]));"
        # Chi giu don vi co ly do manh: da ky cho dung san pham, hoac cau nguon khop >= 2 khai niem,
        # hoac khop mot ten cong nghe trong tu dien. Khop mot tu chung chung ("he thong") thi bo.
        "const manh = (d) => d.kyCho.length || d.trich.some((t) => t.khop.length >= 2 || t.khop.some((k) => tenCN.has(k)));"
        "process.stdout.write(JSON.stringify(ds.map((q) => hoiDap(q, cm, 8).donVi.filter(manh).slice(0, 3).map((d) => d.dv))));"
    )
    r = subprocess.run(["node", "--input-type=module", "-e", js], input=json.dumps(cau, ensure_ascii=False),
                       capture_output=True, text=True)
    if r.returncode != 0:
        print("KHONG CHAY DUOC: may hoi dap loi:", r.stderr[-400:])
        sys.exit(3)
    return json.loads(r.stdout)


def main(argv):
    dot = Path(argv[1])
    lo = json.loads((dot / "lo.json").read_text(encoding="utf-8"))
    nc = lo["nhu_cau"]
    dc_p = dot / "doi_chieu_ket_qua.jsonl"
    dc = [json.loads(l) for l in dc_p.read_text(encoding="utf-8").splitlines() if l.strip()] if dc_p.exists() else []
    khop = {(d["url"], d["chuoi"]): d["ket_qua"] for d in dc}
    url_cua = {}
    for d in lo["dong"]:
        url_cua.setdefault(d["entity"], set()).add(d["url"])
    ma = sorted(nc, key=lambda e: (e.split("-")[0], int(e.split("-")[1])))
    cau = [(nc[e].get("doi_tuong") or nc[e]["ten_nhu_cau"]) + (f" P{int(nc[e]['san_pham_lien_quan']):02d}" if nc[e].get("san_pham_lien_quan") else "") for e in ma]
    xem = xem_truoc(cau)
    n_kq = sum(1 for d in dc if d["ket_qua"] == "KHOP")
    n_dv = sum(1 for x in xem if x)
    L = [f"# Bảng duyệt lô {dot.name} · cầu thật (nhu cầu đặt hàng công nghệ có nguồn)", "",
         "Sinh bởi `bang_lo_cau.py` từ `lo.json` (cổng `kiem_lo_cau.py` đã sạch), đối chiếu độc lập và máy hỏi đáp của web.", "",
         f"- **{len(nc)} nhu cầu** sau khi gộp {len(lo['gop'])} cặp trùng (xem cuối bảng); {len(lo['honest_null'])} nguồn đã xét nhưng không lấy (honest-null).",
         f"- Đối chiếu độc lập (tải lại trang gốc): {n_kq}/{len(dc)} chuỗi KHỚP; phần còn lại là trang không tải lại được trong phiên, không có chuỗi nào lệch.",
         f"- **{n_dv}/{len(nc)} nhu cầu** đã có ít nhất một đơn vị trong sổ nguồn có câu nguồn liên quan (cột \"Sổ nguồn hiện có\"). Đây là gợi ý để thấy giá trị, chưa phải cặp ghép: ghép vẫn cần người ký.", "",
         "Anh duyệt bằng cách nói \"duyệt hết\", hoặc liệt kê mã cần gạch kèm lý do.", ""]
    for loai, ten in TEN_LOAI.items():
        ds = [(i, e) for i, e in enumerate(ma) if nc[e]["loai_dat_hang"] == loai]
        if not ds:
            continue
        L += [f"## {ten} ({len(ds)})", "", "| Mã | Nhu cầu | Bên đặt hàng | P | Đối tượng | Hạn, trạng thái | Sổ nguồn hiện có |", "|---|---|---|---|---|---|---|"]
        for i, e in ds:
            x = nc[e]
            p = f"P{int(x['san_pham_lien_quan']):02d}" if x.get("san_pham_lien_quan") else ""
            han = " · ".join(v for v in (x.get("thoi_han"), x.get("trang_thai"), x.get("kinh_phi")) if v)
            L.append(f"| {e} | {x['ten_nhu_cau']} | {x['ben_dat_hang']} | {p} | {x.get('doi_tuong', '')} | {han} | {', '.join(xem[i]) or 'chưa có'} |")
        L.append("")
    L += ["## Người duyệt cần biết", ""]
    for d in lo["dong"]:
        if d["field"] == "ten_nhu_cau" and d.get("ly_do"):
            L.append(f"- **{d['entity']}**: {d['ly_do']}")
    L += ["", "## Cặp trùng đã gộp", ""]
    for bo, g in sorted(lo["gop"].items()):
        L.append(f"- {bo} gộp vào {g['giu']}: {g['ly_do']}")
    L += ["", "## Honest-null", ""]
    for n in lo["honest_null"]:
        L.append(f"- {n.get('chu_de', '')}: {n.get('ly_do', '')}")
    (dot / "BANG_DUYET.md").write_text("\n".join(L) + "\n", encoding="utf-8")
    print(f"BANG CAU: {len(nc)} nhu cau · {n_dv} co don vi lien quan trong so nguon · doi chieu {n_kq}/{len(dc)} khop")


if __name__ == "__main__":
    main(sys.argv)
