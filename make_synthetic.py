#!/usr/bin/env python3
"""make_synthetic.py · Sinh du lieu TONG HOP cho Phase A (khong phai du lieu that).

Muc dich: co du lieu de chay pipeline + chung minh 10 rang can truoc khi dataset
that ve (TIP 05 Phase A muc 4). Thiet ke co chu dich:
  - 5 nguon (snapshot) khac nhau
  - trung lap thuc the qua alias (Sao Viet Studio = Studio Sao Việt)
  - 1 cap gia tri mau thuan (capacity Ke toan Binh Minh) de test disputed
  - ban ghi rac / khong lien quan trong snapshot (pipeline khong duoc nhat vao)
  - honest-null (nhieu field khong co claim)
  - tier A/B/C tron lan; gia dich vu de o tier C (claim, khong phoi nhu that)

Moi evidence_span duoc script KIEM verbatim nam trong snapshot truoc khi ghi,
de khong vap SPAN_NOT_FOUND vi loi tay.
"""
import json
from pathlib import Path

DOM = Path(__file__).parent / "domains" / "dich_vu_solo_entrepreneur"
SNAP = DOM / "snapshots"

SNAPSHOTS = {
    # Nguon 1 · danh ba freelancer (tier B)
    "danhba_freelancer.html": """<html><body>
<h1>Danh ba freelancer va agency nho</h1>
<p>Studio Sao Việt chuyen thiet ke thuong hieu cho quan ca phe va tiem banh, nhan toi da 4 du an moi thang, hoat dong tai TP HCM. Lien he qua fanpage Sao Viet.</p>
<p>Kế toán Bình Minh cung cap dich vu ke toan tron goi cho ho kinh doanh, nhan toi da 2 khach moi moi thang, lam viec online toan quoc.</p>
<p>IT Việt Code xay website va app dat lich cho chu shop, dong tai Hà Nội, bao gia theo du an.</p>
<p>Minh Anh Design nhan thiet ke logo va bo nhan dien, khu vuc Đà Nẵng.</p>
<p>Quan com trua van phong Co Sau: mon moi moi ngay, giao tan noi.</p>
</body></html>""",
    # Nguon 2 · nhom facebook khoi nghiep (tier B, co alias + demand)
    "nhom_fb_khoinghiep.html": """<html><body>
<h1>Tong hop bai dang nhom khoi nghiep solo</h1>
<p>Chị Lan Bánh Ngọt (TP HCM) dang tim ben thiet ke thuong hieu cho tiem banh sap mo, ngan sach vua phai.</p>
<p>Anh Tuấn Cà Phê hoi: can nguoi lam ke toan cho ho kinh doanh quan ca phe, ai lam roi gioi thieu giup.</p>
<p>Sao Viet Studio vua lam bo nhan dien rat ung y cho mot tiem banh o quan 3, moi nguoi tham khao.</p>
<p>Cô Hạnh Yoga can lam website dat lich cho lop yoga tai nha, uu tien ben da lam app dat lich.</p>
<p>Ban xe may cu chinh chu, giay to day du, ai quan tam inbox.</p>
</body></html>""",
    # Nguon 3 · cong thong tin dang ky nghe (tier A · chung nhan)
    "congthongtin_dknghe.html": """<html><body>
<h1>Cong thong tin tra cuu hanh nghe</h1>
<p>Kế toán Bình Minh: co chung chi hanh nghe dich vu ke toan so KT-2214, con hieu luc.</p>
<p>Luật sư Trần Văn Hòa: the luat su so LS-8830, linh vuc tu van phap ly hop dong cho ca nhan kinh doanh, van phong tai TP HCM.</p>
</body></html>""",
    # Nguon 4 · blog marketing (tier C · tu gioi thieu + bao gia)
    "baiviet_blog_marketing.html": """<html><body>
<h1>Blog Mắt Bão Marketing</h1>
<p>Mắt Bão Marketing tu gioi thieu: chay quang cao Facebook va Google cho shop nho, goi co ban gia 5 trieu dong mot thang, cam ket ra don sau 2 tuan.</p>
<p>Kế toán Bình Minh (doi tac cua blog) hien nhan 5 khach moi thang, theo loi gioi thieu tren blog.</p>
</body></html>""",
    # Nguon 5 · chia se nhom zalo (tier B + C, demand)
    "zalo_group_share.html": """<html><body>
<h1>Trich chia se nhom zalo chu shop</h1>
<p>Shop Mẹ Xíu ban do so sinh dang can ben chay quang cao Facebook, ngan sach 6 trieu mot thang.</p>
<p>Anh Phúc Nội Thất can luat su tu van phap ly hop dong voi xuong gia cong, viec gap trong thang.</p>
<p>Minh Anh Media nhan quay dung video san pham, co uu dai cho nhom.</p>
<p>Thanh ly tu lanh cu con dung tot, ai can lien he.</p>
</body></html>""",
}

# (entity, field, value, span, extraction, tier, snapshot)
CLAIMS = [
    # ---- Studio Sao Viet (cung · design · 2 nguon, alias o nguon 2) ----
    ("Studio Sao Việt", "entity_type", "cung", "Studio Sao Việt chuyen thiet ke thuong hieu", "normalized", "B", "danhba_freelancer.html"),
    ("Studio Sao Việt", "entity_name", "Studio Sao Việt", "Studio Sao Việt", "verbatim", "B", "danhba_freelancer.html"),
    ("Studio Sao Việt", "capability", "thiet ke thuong hieu", "chuyen thiet ke thuong hieu cho quan ca phe va tiem banh", "normalized", "B", "danhba_freelancer.html"),
    ("Studio Sao Việt", "capacity", "4 du an/thang", "nhan toi da 4 du an moi thang", "normalized", "B", "danhba_freelancer.html"),
    ("Studio Sao Việt", "location", "TP HCM", "hoat dong tai TP HCM", "normalized", "B", "danhba_freelancer.html"),
    ("Sao Viet Studio", "capability", "thiet ke thuong hieu", "Sao Viet Studio vua lam bo nhan dien rat ung y cho mot tiem banh", "inferred", "B", "nhom_fb_khoinghiep.html"),
    # ---- Ke toan Binh Minh (cung · disputed capacity giua nguon 1 va 4, cert tier A) ----
    ("Kế toán Bình Minh", "entity_type", "cung", "Kế toán Bình Minh cung cap dich vu ke toan tron goi", "normalized", "B", "danhba_freelancer.html"),
    ("Kế toán Bình Minh", "entity_name", "Kế toán Bình Minh", "Kế toán Bình Minh", "verbatim", "B", "danhba_freelancer.html"),
    ("Kế toán Bình Minh", "capability", "ke toan cho ho kinh doanh", "cung cap dich vu ke toan tron goi cho ho kinh doanh", "normalized", "B", "danhba_freelancer.html"),
    ("Kế toán Bình Minh", "capacity", "2 khach moi/thang", "nhan toi da 2 khach moi moi thang", "normalized", "B", "danhba_freelancer.html"),
    ("Kế toán Bình Minh", "capacity", "5 khach moi/thang", "hien nhan 5 khach moi thang", "normalized", "C", "baiviet_blog_marketing.html"),
    ("Kế toán Bình Minh", "certification", "chung chi hanh nghe ke toan KT-2214", "co chung chi hanh nghe dich vu ke toan so KT-2214, con hieu luc", "normalized", "A", "congthongtin_dknghe.html"),
    # ---- Luat su Tran Van Hoa (cung · tier A cert) ----
    ("Luật sư Trần Văn Hòa", "entity_type", "cung", "Luật sư Trần Văn Hòa: the luat su so LS-8830", "normalized", "A", "congthongtin_dknghe.html"),
    ("Luật sư Trần Văn Hòa", "entity_name", "Luật sư Trần Văn Hòa", "Luật sư Trần Văn Hòa", "verbatim", "A", "congthongtin_dknghe.html"),
    ("Luật sư Trần Văn Hòa", "capability", "tu van phap ly hop dong", "linh vuc tu van phap ly hop dong cho ca nhan kinh doanh", "normalized", "A", "congthongtin_dknghe.html"),
    ("Luật sư Trần Văn Hòa", "certification", "the luat su LS-8830", "the luat su so LS-8830", "normalized", "A", "congthongtin_dknghe.html"),
    ("Luật sư Trần Văn Hòa", "location", "TP HCM", "van phong tai TP HCM", "normalized", "A", "congthongtin_dknghe.html"),
    # ---- Mat Bao Marketing (cung · TOAN tier C tu gioi thieu · gia la claim) ----
    ("Mắt Bão Marketing", "entity_type", "cung", "Mắt Bão Marketing tu gioi thieu", "normalized", "C", "baiviet_blog_marketing.html"),
    ("Mắt Bão Marketing", "entity_name", "Mắt Bão Marketing", "Mắt Bão Marketing", "verbatim", "C", "baiviet_blog_marketing.html"),
    ("Mắt Bão Marketing", "capability", "quang cao Facebook va Google", "chay quang cao Facebook va Google cho shop nho", "normalized", "C", "baiviet_blog_marketing.html"),
    ("Mắt Bão Marketing", "capacity", "goi co ban 5 trieu/thang", "goi co ban gia 5 trieu dong mot thang", "normalized", "C", "baiviet_blog_marketing.html"),
    # ---- IT Viet Code (cung) ----
    ("IT Việt Code", "entity_type", "cung", "IT Việt Code xay website va app dat lich", "normalized", "B", "danhba_freelancer.html"),
    ("IT Việt Code", "entity_name", "IT Việt Code", "IT Việt Code", "verbatim", "B", "danhba_freelancer.html"),
    ("IT Việt Code", "capability", "website va app dat lich", "xay website va app dat lich cho chu shop", "normalized", "B", "danhba_freelancer.html"),
    ("IT Việt Code", "location", "Hà Nội", "dong tai Hà Nội", "normalized", "B", "danhba_freelancer.html"),
    # ---- Minh Anh Design / Minh Anh Media (cum mo ho, CAM tu gop) ----
    ("Minh Anh Design", "entity_type", "cung", "Minh Anh Design nhan thiet ke logo", "normalized", "B", "danhba_freelancer.html"),
    ("Minh Anh Design", "capability", "thiet ke logo va bo nhan dien", "nhan thiet ke logo va bo nhan dien", "normalized", "B", "danhba_freelancer.html"),
    ("Minh Anh Design", "location", "Đà Nẵng", "khu vuc Đà Nẵng", "normalized", "B", "danhba_freelancer.html"),
    ("Minh Anh Media", "entity_type", "cung", "Minh Anh Media nhan quay dung video", "normalized", "B", "zalo_group_share.html"),
    ("Minh Anh Media", "capability", "quay dung video san pham", "nhan quay dung video san pham", "normalized", "B", "zalo_group_share.html"),
    # ---- Cau (demand) ----
    ("Chị Lan Bánh Ngọt", "entity_type", "cau", "Chị Lan Bánh Ngọt (TP HCM) dang tim ben thiet ke thuong hieu", "normalized", "B", "nhom_fb_khoinghiep.html"),
    ("Chị Lan Bánh Ngọt", "need", "thiet ke thuong hieu", "dang tim ben thiet ke thuong hieu cho tiem banh sap mo", "normalized", "B", "nhom_fb_khoinghiep.html"),
    ("Chị Lan Bánh Ngọt", "location", "TP HCM", "Chị Lan Bánh Ngọt (TP HCM)", "normalized", "B", "nhom_fb_khoinghiep.html"),
    ("Anh Tuấn Cà Phê", "entity_type", "cau", "Anh Tuấn Cà Phê hoi: can nguoi lam ke toan", "normalized", "B", "nhom_fb_khoinghiep.html"),
    ("Anh Tuấn Cà Phê", "need", "ke toan cho ho kinh doanh", "can nguoi lam ke toan cho ho kinh doanh quan ca phe", "normalized", "B", "nhom_fb_khoinghiep.html"),
    ("Cô Hạnh Yoga", "entity_type", "cau", "Cô Hạnh Yoga can lam website dat lich", "normalized", "B", "nhom_fb_khoinghiep.html"),
    ("Cô Hạnh Yoga", "need", "website dat lich", "can lam website dat lich cho lop yoga tai nha", "normalized", "B", "nhom_fb_khoinghiep.html"),
    ("Shop Mẹ Xíu", "entity_type", "cau", "Shop Mẹ Xíu ban do so sinh dang can ben chay quang cao Facebook", "normalized", "B", "zalo_group_share.html"),
    ("Shop Mẹ Xíu", "need", "quang cao Facebook", "dang can ben chay quang cao Facebook, ngan sach 6 trieu mot thang", "normalized", "B", "zalo_group_share.html"),
    ("Anh Phúc Nội Thất", "entity_type", "cau", "Anh Phúc Nội Thất can luat su tu van phap ly hop dong", "normalized", "B", "zalo_group_share.html"),
    ("Anh Phúc Nội Thất", "need", "tu van phap ly hop dong", "can luat su tu van phap ly hop dong voi xuong gia cong", "normalized", "B", "zalo_group_share.html"),
]

SOURCE_META = {
    "danhba_freelancer.html": ("https://danhba-freelancer.example/vn", "danhba-freelancer.example"),
    "nhom_fb_khoinghiep.html": ("https://facebook.example/groups/khoinghiepsolo", "facebook.example"),
    "congthongtin_dknghe.html": ("https://congthongtin.example/tra-cuu", "congthongtin.example"),
    "baiviet_blog_marketing.html": ("https://matbao-mkt.example/blog", "matbao-mkt.example"),
    "zalo_group_share.html": ("https://zalo.example/g/chushop", "zalo.example"),
}
FETCHED_AT = "2026-07-17T09:00:00Z"


def main():
    SNAP.mkdir(parents=True, exist_ok=True)
    for name, text in SNAPSHOTS.items():
        (SNAP / name).write_text(text, encoding="utf-8")
    rows = []
    for ent, field, value, span, extraction, tier, snap in CLAIMS:
        text = SNAPSHOTS[snap]
        assert span in text, f"SPAN KHONG VERBATIM: {ent} / {field}: {span!r} khong nam trong {snap}"
        url, source = SOURCE_META[snap]
        rows.append({
            "entity": ent, "field": field, "value": value,
            "evidence_span": span, "extraction": extraction, "tier": tier,
            "capture": {"url": url, "fetched_at": FETCHED_AT, "snapshot": snap, "source": source},
        })
    (DOM / "claims.jsonl").write_text(
        "\n".join(json.dumps(r, ensure_ascii=False) for r in rows) + "\n", encoding="utf-8")
    print(f"OK: {len(SNAPSHOTS)} snapshot, {len(rows)} claim, moi span da kiem verbatim")


if __name__ == "__main__":
    main()
