/**
 * cau-that.mjs · Lop du lieu man "Cau that" (01/10/2026, lo 03 da duyet).
 *
 * Y TUONG: chieu cau truoc nay chi la 30 san pham trong danh muc QD 21/2026. Cau that la nhu cau
 * dat hang cong nghe CO NGUOI DAT HANG: nhiem vu KH&CN Bo KH&CN dat hang, bai toan lon cua dia
 * phuong va bo nganh, nhiem vu chuong trinh, du an goi thau. Moi truong cua mot nhu cau la mot
 * cau nguon nguyen van (domains/cau_dat_hang, cong check_cau_dat_hang.py).
 *
 * GOI Y DON VI: voi moi nhu cau, may hoi dap (lib/hoi-dap.mjs) tim trong so nguon nhung don vi co
 * cau nguon nang luc lien quan. Day CHI la goi y co dan chung, KHONG phai cap ghep: ghep that van
 * can nguoi ky qua match_engine. Chi giu don vi co ly do manh (cung luat bang duyet lo 03):
 * da co cap duoc ky cho dung san pham, hoac cau nguon khop >= 2 khai niem, hoac khop ten mot cong
 * nghe trong tu dien dong nghia. Khop mot tu chung chung ("he thong") thi bo.
 *
 * Ham thuan: nhan du lieu, tra du lieu. Goi luc build (gen-hub-data) va trong cong check-cau-that.
 */
export const TEN_LOAI = {
  nhiem_vu_khcn: 'Nhiệm vụ KH&CN đặt hàng',
  bai_toan_lon: 'Bài toán lớn',
  chuong_trinh: 'Chương trình, đề án',
  du_an_goi_thau: 'Dự án, gói thầu',
};
export const THU_TU_LOAI = ['nhiem_vu_khcn', 'bai_toan_lon', 'chuong_trinh', 'du_an_goi_thau'];
export const SO_GOI_Y = 3;

/**
 * @param {{claims: any[]}} dh          lib/cncl-cau-dat-hang.json
 * @param {object} cm                   lib/hub-hoi-dap.json (chi muc)
 * @param {Record<string,string>} tenSp lib/hub-ten.json sanPham (ma "01".."30" -> ten ngan)
 * @param {(cau:string, cm:object, n:number)=>any} hoiDap
 * @param {string[][]} dongNghia        DONG_NGHIA cua hoi-dap.mjs
 */
export function dungCauThat(dh, cm, tenSp, hoiDap, dongNghia) {
  const tenCN = new Set(dongNghia.map((c) => c[0]));
  const theoMa = new Map();
  for (const c of dh.claims) {
    if (!theoMa.has(c.ma)) theoMa.set(c.ma, []);
    theoMa.get(c.ma).push(c);
  }
  const lay = (cs, f) => cs.find((c) => c.field === f) ?? null;
  const manh = (d) => d.kyCho.length || d.trich.some((t) => t.khop.length >= 2 || t.khop.some((k) => tenCN.has(k)));
  const nhuCau = [...theoMa.entries()].map(([ma, cs]) => {
    const g = (f) => lay(cs, f)?.value ?? null;
    const sp = g('san_pham_lien_quan');
    const maSp = sp ? String(sp).padStart(2, '0') : null;
    const cau = (g('doi_tuong') || g('ten_nhu_cau')) + (maSp ? ` P${maSp}` : '');
    const kq = hoiDap(cau, cm, 8);
    const goiY = kq.donVi.filter(manh).slice(0, SO_GOI_Y).map((d) => {
      const t = d.trich[0];
      return {
        dv: d.dv, slug: d.slug,
        kyCho: d.kyCho.map((k) => k.match),
        khop: t ? t.khop : [],
        trich: t ? { span: t.span, href: t.href, tier: t.tier, source: t.source } : null,
      };
    });
    const loai = g('loai_dat_hang');
    return {
      ma, ten: g('ten_nhu_cau'), benDatHang: g('ben_dat_hang'), loai, loaiTen: TEN_LOAI[loai] ?? loai,
      maSp, tenSp: maSp ? tenSp[maSp] ?? null : null,
      doiTuong: g('doi_tuong'), thoiHan: g('thoi_han'), kinhPhi: g('kinh_phi'), trangThai: g('trang_thai'),
      ngayBai: cs.map((c) => c.ngayBai).filter(Boolean).sort().pop() ?? null,
      bacCao: cs.some((c) => c.tier === 'A') ? 'A' : cs.some((c) => c.tier === 'B') ? 'B' : 'C',
      nguon: cs.map((c) => ({ field: c.field, value: c.value, span: c.span, tier: c.tier, source: c.source, href: c.href, extraction: c.extraction })),
      khaiNiem: kq.khaiNiem,
      goiY,
    };
  }).sort((a, b) => THU_TU_LOAI.indexOf(a.loai) - THU_TU_LOAI.indexOf(b.loai) || a.ma.localeCompare(b.ma, 'en', { numeric: true }));
  const theoLoai = Object.fromEntries(THU_TU_LOAI.map((l) => [l, nhuCau.filter((n) => n.loai === l).length]));
  return {
    meta: {
      soNhuCau: nhuCau.length,
      soBenDatHang: new Set(nhuCau.map((n) => n.benDatHang)).size,
      coGoiY: nhuCau.filter((n) => n.goiY.length).length,
      ganSanPham: nhuCau.filter((n) => n.maSp).length,
      theoLoai,
    },
    nhuCau,
  };
}
