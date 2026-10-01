#!/usr/bin/env python3
"""bang_lo_dinh_danh.py · Sinh bang duyet va phieu tra cong cho mot lo dinh danh phap nhan.

Doc  <dot>/lo.json (do kiem_lo_dinh_danh.py ghi, chi khi cong sach), <dot>/doi_chieu_ket_qua.jsonl
     (doi chieu doc lap tai lai trang goc), va danh sach don vi tu .touch/lib/cncl-registry.json.
Ghi  <dot>/BANG_DUYET.md   cho anh Lam duyet tung dong ma tu khai va ten phap nhan.
     <dot>/PHIEU_TRA_CONG.xlsx  cho nguoi cua RtR tra xac nhan tren cong dang ky doanh nghiep
     quoc gia. Cot nhap to vang; cot "Doi chieu" la cong thuc, tu bao KHOP / LECH.

Tat dinh: cung dau vao, cung dau ra. Khong ghi registry.
Chay: python3 bang_lo_dinh_danh.py <dot>
"""
import json
import sys
import unicodedata
from pathlib import Path

from openpyxl import Workbook
from openpyxl.comments import Comment
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

HERE = Path(__file__).resolve().parent
REG_WEB = HERE.parents[1] / ".touch" / "lib" / "cncl-registry.json"
CONG = "https://dangkykinhdoanh.gov.vn/vn/Pages/Trangchu.aspx"


def main(argv):
    dot = Path(argv[1])
    lo = json.loads((dot / "lo.json").read_text(encoding="utf-8"))
    dc = [json.loads(l) for l in (dot / "doi_chieu_ket_qua.jsonl").read_text(encoding="utf-8").splitlines() if l.strip()]
    khop = {(d["url"], d["chuoi"]): d for d in dc}
    reg = json.loads(REG_WEB.read_text(encoding="utf-8"))
    don_vi = [(u["name"], u.get("loaiHinh") or "") for u in reg["units"]]
    ten = {d["entity"]: d for d in lo["dong"] if d["field"] == "ten_phap_nhan"}
    ma = {d["entity"]: d for d in lo["dong"] if d["field"] == "ma_so_tu_khai"}
    null = {}
    for n in lo["honest_null"]:
        null.setdefault(n["entity"], {})[n["truong"]] = n

    def dc_cua(d):
        k = khop.get((d["url"], d["value"]))
        if not k:
            return "CHUA DOI CHIEU"
        meta = "chỉ gặp trong" in (k.get("ghi_chu") or "").lower()
        return k["ket_qua"] + (" (chi o the meta)" if meta and k["ket_qua"] == "KHOP" else "")

    # ── BANG_DUYET.md ─────────────────────────────────────────────────────────
    n_ma, n_ten = len(ma), len(ten)
    n_khop = sum(1 for d in lo["dong"] if dc_cua(d).startswith("KHOP"))
    L = [
        f"# Bảng duyệt lô {dot.name} · định danh pháp nhân",
        "",
        "Sinh bởi `bang_lo_dinh_danh.py` từ `lo.json` (cổng `kiem_lo_dinh_danh.py` đã sạch) và đối chiếu độc lập.",
        "",
        f"- {len(don_vi)} đơn vị trong registry · {n_ten} có tên pháp nhân tự khai · **{n_ma} có mã số tự khai**.",
        f"- Đối chiếu độc lập (tải lại trang gốc): {n_khop}/{len(lo['dong'])} dòng KHỚP.",
        "- Mã tự khai KHÔNG tính là đã định danh. Thanh \"Đơn vị đã định danh pháp nhân\" chỉ tăng khi người tra cổng xác nhận (phiếu `PHIEU_TRA_CONG.xlsx`).",
        "",
        "Anh duyệt bằng cách ghi `duyet.json`: `{\"duyet\": [\"<tên đơn vị>\", ...], \"bo\": {\"<tên đơn vị>\": \"<lý do của anh>\"}}`, hoặc nói \"duyệt hết\".",
        "",
        "## Có mã số tự khai",
        "",
        "| # | Đơn vị (registry) | Tên pháp nhân tự khai | Mã tự khai | Website | Đối chiếu | Người duyệt cần biết |",
        "|---|---|---|---|---|---|---|",
    ]
    i = 0
    for e, _ in don_vi:
        if e not in ma:
            continue
        i += 1
        t = ten.get(e)
        L.append(f"| {i} | {e} | {t['value'] if t else ''} | `{ma[e]['value']}` | {ma[e]['website_chinh_chu']} | {dc_cua(ma[e])} | {ma[e]['ly_do']} |")
    L += ["", "## Chỉ có tên pháp nhân (mã để người tra cổng tìm theo tên)", "",
          "| # | Đơn vị (registry) | Tên pháp nhân tự khai | Website | Đối chiếu | Cờ | Người duyệt cần biết |", "|---|---|---|---|---|---|---|"]
    i = 0
    for e, _ in don_vi:
        if e in ma or e not in ten:
            continue
        i += 1
        t = ten[e]
        L.append(f"| {i} | {e} | {t['value']} | {t['website_chinh_chu']} | {dc_cua(t)} | {', '.join(t['co']) or ''} | {t['ly_do']} |")
    L += ["", "## Chưa có cả tên lẫn mã (honest-null)", "", "| # | Đơn vị | Lý do |", "|---|---|---|"]
    i = 0
    for e, _ in don_vi:
        if e in ten or e in ma:
            continue
        i += 1
        n = null.get(e, {}).get("ten_phap_nhan") or null.get(e, {}).get("ma_so_tu_khai") or {}
        L.append(f"| {i} | {e} | {n.get('ly_do', '')} |")
    qd = dot / "CAN_ANH_QUYET.md"
    if qd.exists():
        L += ["", qd.read_text(encoding="utf-8").strip()]
    (dot / "BANG_DUYET.md").write_text("\n".join(L) + "\n", encoding="utf-8")

    # ── PHIEU_TRA_CONG.xlsx ───────────────────────────────────────────────────
    wb = Workbook()
    hd = wb.active
    hd.title = "Hướng dẫn"
    f = Font(name="Arial", size=11)
    fb = Font(name="Arial", size=11, bold=True)
    vang = PatternFill("solid", start_color="FFFF00")
    dong_hd = [
        ("Phiếu tra cổng · định danh pháp nhân", fb),
        ("", f),
        ("Mục đích: xác nhận mã số doanh nghiệp của từng đơn vị trên Cổng thông tin quốc gia về đăng ký doanh nghiệp. Chỉ mã xác nhận ở đây mới tính là đã định danh.", f),
        (f"Cổng: {CONG} (ô \"Tìm doanh nghiệp\"; cổng có captcha, người tra tự nhập).", f),
        ("", f),
        ("Cách làm cho mỗi dòng ở tab \"Phiếu tra\":", fb),
        ("1. Có mã tự khai (cột D): tìm theo mã. Chưa có: tìm theo tên pháp nhân gợi ý (cột C), thử cả các dạng ghi ở cột G.", f),
        ("2. Mở trang thông tin doanh nghiệp, In hoặc Lưu thành PDF, đặt tên file theo cột N, lưu vào thư mục CNCLData/lam_giau/dot_02/tra_cong/.", f),
        ("3. Chép NGUYÊN VĂN vào các ô VÀNG: mã số (H), tên doanh nghiệp (I), tình trạng (J), người tra (L), ngày tra (M).", f),
        ("4. Cột K tự so mã cổng với mã tự khai: KHỚP, LỆCH, hoặc CHỈ CÓ MÃ CỔNG. Dòng LỆCH ghi lý do vào cột O.", f),
        ("5. Không tìm thấy trên cổng: để trống H, I; ghi \"không tìm thấy\" vào J và nêu đã tìm những gì ở cột O.", f),
        ("", f),
        ("Không lấy mã từ masothue, thuvienphapluat hay trang tổng hợp nào. Viện, trường công thường không có trên cổng đăng ký doanh nghiệp: ghi \"không áp dụng\" vào J.", f),
        ("Chỉ sửa ô VÀNG. Dòng 3 của tab \"Phiếu tra\" là dòng MẪU (in nghiêng), không phải dữ liệu thật.", f),
    ]
    for r, (v, ft) in enumerate(dong_hd, 1):
        c = hd.cell(row=r, column=1, value=v)
        c.font = ft
        c.alignment = Alignment(wrap_text=True, vertical="top")
    hd.column_dimensions["A"].width = 120

    ws = wb.create_sheet("Phiếu tra")
    cot = ["STT", "Đơn vị (registry)", "Tên pháp nhân gợi ý (tự khai)", "Mã tự khai", "Website chính chủ",
           "Loại hình", "Gợi ý cho người tra", "Mã số trên cổng", "Tên doanh nghiệp trên cổng",
           "Tình trạng", "Đối chiếu", "Người tra", "Ngày tra (dd/mm/yyyy)", "Tên file PDF", "Ghi chú người tra"]
    rong = [6, 34, 40, 16, 26, 10, 60, 18, 40, 18, 18, 16, 16, 30, 40]
    vien = Side(style="thin", color="BFBFBF")
    for j, (h, w) in enumerate(zip(cot, rong), 1):
        c = ws.cell(row=1, column=j, value=h)
        c.font = Font(name="Arial", size=11, bold=True)
        c.alignment = Alignment(wrap_text=True, vertical="center")
        c.border = Border(bottom=Side(style="medium"))
        ws.column_dimensions[get_column_letter(j)].width = w
    ws.cell(row=2, column=1, value="Cột H đến J, L đến O là ô nhập (vàng). Cột K là công thức, không sửa.").font = Font(name="Arial", size=10, italic=True)
    mau = ["0", "(dòng mẫu) Công ty Ví dụ", "Công ty Cổ phần Ví dụ", "0101234567", "vidu.vn", "DN",
           "Tìm theo mã tự khai.", "0101234567", "CÔNG TY CỔ PHẦN VÍ DỤ", "Đang hoạt động", None,
           "Nguyễn Văn A", "02/10/2026", "00_cong_ty_vi_du.pdf", ""]
    tt = DataValidation(type="list", formula1='"Đang hoạt động,Tạm ngừng,Đã giải thể,Không tìm thấy,Không áp dụng"', allow_blank=True)
    ws.add_data_validation(tt)
    r = 3
    for k, v in enumerate(mau, 1):
        if v is not None:
            ws.cell(row=r, column=k, value=v).font = Font(name="Arial", size=11, italic=True, color="808080")
    ws.cell(row=r, column=11, value='=IF(H3="","",IF(D3="","CHỈ CÓ MÃ CỔNG",IF(TRIM(H3)=TRIM(D3),"KHỚP","LỆCH")))').font = Font(name="Arial", size=11, italic=True, color="808080")
    for stt, (e, loai) in enumerate(don_vi, 1):
        r = stt + 3
        t, m = ten.get(e), ma.get(e)
        goi_y = []
        if m:
            goi_y.append("Tìm theo mã tự khai.")
        if m and m["ly_do"]:
            goi_y.append(m["ly_do"])
        elif t and t["ly_do"]:
            goi_y.append(t["ly_do"])
        if not t and not m:
            n = null.get(e, {}).get("ten_phap_nhan") or {}
            goi_y.append("Chưa có tên pháp nhân tự khai. " + n.get("ly_do", ""))
        kd = unicodedata.normalize("NFD", (t["value"] if t else e).lower().replace("đ", "d"))
        kd = "".join(ch for ch in kd if unicodedata.category(ch) != "Mn")
        slug = "_".join("".join(ch if ch.isascii() and ch.isalnum() else " " for ch in kd).split())[:40].strip("_")
        gia = [stt, e, t["value"] if t else "", m["value"] if m else "",
               (m or t or {}).get("website_chinh_chu", ""), loai, " ".join(goi_y)]
        for k, v in enumerate(gia, 1):
            c = ws.cell(row=r, column=k, value=v)
            c.font = f
            c.alignment = Alignment(wrap_text=True, vertical="top")
        for k in (8, 9, 10, 12, 13, 15):
            c = ws.cell(row=r, column=k)
            c.fill = vang
            c.font = f
            c.alignment = Alignment(wrap_text=True, vertical="top")
        ws.cell(row=r, column=4).number_format = "@"
        ws.cell(row=r, column=8).number_format = "@"
        ws.cell(row=r, column=11, value=f'=IF(H{r}="","",IF(D{r}="","CHỈ CÓ MÃ CỔNG",IF(TRIM(H{r})=TRIM(D{r}),"KHỚP","LỆCH")))').font = f
        ws.cell(row=r, column=14, value=f"{stt:02d}_{slug}.pdf").font = f
        tt.add(f"J{r}")
        for k in range(1, 16):
            ws.cell(row=r, column=k).border = Border(bottom=vien)
    ws.freeze_panes = "C2"
    ws.cell(row=1, column=8).comment = Comment("Chép nguyên văn từ cổng, giữ cả dạng 10 số-3 số nếu có.", "CaoLocMatch")
    wb.save(dot / "PHIEU_TRA_CONG.xlsx")
    print(f"BANG: {n_ma} ma tu khai · {n_ten} ten phap nhan · {n_khop}/{len(lo['dong'])} khop doi chieu · phieu tra {len(don_vi)} dong")


if __name__ == "__main__":
    main(sys.argv)
