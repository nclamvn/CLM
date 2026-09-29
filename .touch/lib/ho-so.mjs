/**
 * ho-so.mjs · Du lieu HO SO DON VI (man M3). Ham thuan, tat dinh; dung chung cho script sinh du
 * lieu, trang web va cong check-ho-so.mjs (cong chay DUNG doan ma nay, khong phai ban sao).
 *
 * VI SAO (29/09/2026): ke hoach 09_NANG_CAP_UI_UX.md, M3 co 12 khoi. Luat khi lam dep khong duoc
 * vuot (muc 5 cua ke hoach):
 *   - KHONG diem tong hop kieu Mosaic. Chi dem, va moi so dem bam ra duoc cau nguon.
 *   - O TRONG TRUNG THUC: truong schema nao chua co claim thi noi "chua co nguon", khong giau.
 *   - Dinh danh phap nhan CHI tu cong chinh thuc. Registry hien khong co ma so nao, nen ca 44
 *     don vi hien "chua dinh danh". Do la su that, khong phai loi giao dien.
 *   - Do tuoi doc NGAY NGUON DANG (hau to _YYYYMMDD cua ban chup), KHONG phai ngay minh chup;
 *     cung luat voi CNCLData/check_do_tuoi.py (truong ben khong het han, mien tru "GIU NGUON CU:").
 *   - Hang nguon (doc lap / tu khai / ben lien quan) CHUA co trong du lieu: KHONG suy ra. Chi hien
 *     tier va ten mien nguon.
 *
 * So sanh chuoi bang ma diem (khong localeCompare) de hai may ra cung thu tu.
 */
import { boDau } from './tim-kiem.mjs';

const soSanh = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

// Cung bang voi CNCLData/check_do_tuoi.py. Doi o day thi phai doi ca ben do.
export const TRUONG_BEN = ['ten_don_vi', 'loai_hinh', 'nhom_cncl', 'san_pham_lien_quan'];
const BEN_TIEN_TO = ['nhom_cncl_phu_', 'san_pham_phu_'];
export const MIEN_TRU = 'GIU NGUON CU:';
export const loaiTruong = (f) => (TRUONG_BEN.includes(f) || BEN_TIEN_TO.some((t) => f.startsWith(t)) ? 'ben' : 'mau_hong');

/** Nhan cho o trong. Chi cac truong schema co nghia o cap don vi (bo `source`, `ten_don_vi`). */
export const NHAN_TRUONG_TRONG = {
  ma_so_thue: 'Mã số doanh nghiệp (chỉ nhận từ cổng thông tin chính thức)',
  loai_hinh: 'Loại hình (doanh nghiệp, viện, trường)',
  san_pham_lien_quan: 'Sản phẩm chiến lược liên quan theo QĐ 21/2026',
  nang_luc_mo_ta: 'Mô tả năng lực',
  bang_chung_nang_luc: 'Bằng chứng năng lực (dự án, sản phẩm, chứng nhận)',
  location: 'Địa điểm',
};

/** Slug on dinh cho URL: bo dau, chu thuong, chi a-z0-9 va gach noi. */
export function slugDonVi(ten) {
  return boDau(ten).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

/** Ngay dang cua nguon tu hau to ten ban chup; khong doc duoc thi null (cong se bao). */
export function ngayDang(href) {
  const m = String(href).match(/_(\d{4})(\d{2})(\d{2})\.[a-z]+$/);
  if (!m) return null;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  if (d.getUTCFullYear() !== +m[1] || d.getUTCMonth() !== +m[2] - 1 || d.getUTCDate() !== +m[3]) return null;
  return `${m[1]}-${m[2]}-${m[3]}`;
}
const soNgay = (tu, den) => Math.round((Date.parse(`${den}T00:00:00Z`) - Date.parse(`${tu}T00:00:00Z`)) / 86400000);

/**
 * @param {object} p
 * @param {{meta:{generatedAt:string}, units:any[], needs:any[]}} p.reg
 * @param {{signedMatches:any[], rejectedPairs:any[]}} p.mat
 * @param {{nodes:any[], edges:any[]}} p.graph
 * @param {{events:any[]}} p.ev
 * @param {string[][]} p.cumDeNham   ambiguous_clusters cua domain (ten cung tap doan, cam gop)
 * @param {string[]} p.truongSchema  schema.fields cua domain
 * @param {number} p.nguongNgay      refresh_days cua domain
 */
export function dungHoSo({ reg, mat, graph, ev, cumDeNham, truongSchema, nguongNgay }) {
  const moc = reg.meta.generatedAt;
  const needById = new Map(reg.needs.map((n) => [n.entityId, n]));
  const nodeById = new Map(graph.nodes.map((n) => [n.id, n]));
  const slugCua = new Map(reg.units.map((u) => [u.name, slugDonVi(u.name)]));
  const cheo = graph.edges.filter((e) => ['cung_san_pham', 'match_da_ky', 'tu_choi'].includes(e.kind));
  const maSp = (entityId) => nodeById.get(`nc:${entityId}`)?.maSp ?? null;

  // Ai cung cung mot nhu cau (qua bat ky canh cheo nao).
  const cungNhuCau = new Map();
  for (const e of cheo) {
    if (!cungNhuCau.has(e.target)) cungNhuCau.set(e.target, new Set());
    cungNhuCau.get(e.target).add(e.source.slice(3));
  }

  const units = reg.units.map((u) => {
    const slug = slugCua.get(u.name);
    const node = nodeById.get(`dv:${u.name}`);

    // Bang chung + do tuoi tung cau.
    const bangChung = u.evidence.map((e, i) => {
      const nd = ngayDang(e.href);
      const lt = loaiTruong(e.field);
      const tuoi = nd === null ? null : soNgay(nd, moc);
      const trangThai = nd === null ? 'khong_doc_duoc_ngay'
        : lt === 'ben' ? 'ben'
          : tuoi <= nguongNgay ? 'tuoi'
            : (e.note ?? '').includes(MIEN_TRU) ? 'giu_nguon_cu' : 'qua_han';
      return { i, field: e.field, tier: e.tier, source: e.source, href: e.href, ngayDang: nd, tuoiNgay: tuoi, loaiTruong: lt, trangThai };
    });
    const demTT = (t) => bangChung.filter((b) => b.trangThai === t).length;
    const ngays = bangChung.map((b) => b.ngayDang).filter(Boolean).sort();

    // Nhu cau lien quan: gop moi canh cheo tu don vi nay.
    const nhu = new Map();
    for (const e of cheo) {
      if (e.source !== `dv:${u.name}`) continue;
      const id = e.target.slice(3);
      if (!nhu.has(id)) nhu.set(id, { id, maSp: maSp(id), ten: needById.get(id)?.value ?? id, quanHe: [] });
      const x = nhu.get(id);
      x.quanHe.push(e.kind);
      if (e.kind === 'match_da_ky') { x.matchId = e.matchId; x.ky = { by: e.signoff.by, date: e.signoff.date }; }
      if (e.kind === 'tu_choi') { x.tuChoi = { by: e.by, date: e.date, lyDo: e.lyDo }; }
    }
    const nhuCau = [...nhu.values()].map((x) => ({ ...x, quanHe: [...new Set(x.quanHe)].sort() }))
      .sort((a, b) => soSanh(a.maSp ?? '', b.maSp ?? '') || soSanh(a.id, b.id));

    // Dong thoi gian: ngay nguon dang (gop theo ban chup), ky, tu choi, de xuat cho duyet.
    const theoBanChup = new Map();
    for (const b of bangChung) {
      if (!b.ngayDang) continue;
      if (!theoBanChup.has(b.href)) theoBanChup.set(b.href, { ngay: b.ngayDang, loai: 'nguon_dang', nguon: b.source, href: b.href, soCau: 0 });
      theoBanChup.get(b.href).soCau++;
    }
    const dongThoiGian = [
      ...theoBanChup.values(),
      ...mat.signedMatches.filter((m) => m.supplyId === u.name).map((m) => ({ ngay: m.signoff.date, loai: 'match_da_ky', matchId: m.id, nhuCau: m.demandId, maSp: maSp(m.demandId), by: m.signoff.by })),
      ...mat.rejectedPairs.filter((r) => r.supplyId === u.name).map((r) => ({ ngay: r.date, loai: 'tu_choi', nhuCau: r.demandId, maSp: maSp(r.demandId), by: r.by })),
      ...ev.events.filter((e) => e.kind === 'de_xuat_vong_tu_chay' && e.donVi === u.name).map((e) => ({ ngay: e.ngay, loai: 'de_xuat', maHangCho: e.maHangCho, nhan: e.nhan, nguonUrl: e.nguon ?? null })),
    ].sort((a, b) => soSanh(a.ngay, b.ngay) || soSanh(a.loai, b.loai) || soSanh(a.href ?? a.matchId ?? a.maHangCho ?? '', b.href ?? b.matchId ?? b.maHangCho ?? ''));

    // Don vi tuong tu: cung nhu cau truoc (co ly do cu the), roi cung nhom. Khong diem so.
    const chung = new Map();
    for (const x of nhuCau) {
      for (const ten of cungNhuCau.get(`nc:${x.id}`) ?? []) {
        if (ten === u.name) continue;
        if (!chung.has(ten)) chung.set(ten, []);
        chung.get(ten).push(`P${x.maSp}`);
      }
    }
    const tuongTu = [...chung].map(([ten, sp]) => ({ ten, slug: slugCua.get(ten), lyDo: 'cung_nhu_cau', chung: [...new Set(sp)].sort() }))
      .sort((a, b) => b.chung.length - a.chung.length || soSanh(a.ten, b.ten));
    const cungNhom = reg.units.filter((v) => v.name !== u.name && !chung.has(v.name) && v.nhoms.some((g) => u.nhoms.includes(g)))
      .map((v) => ({ ten: v.name, slug: slugCua.get(v.name), lyDo: 'cung_nhom', chung: v.nhoms.filter((g) => u.nhoms.includes(g)).sort() }))
      .sort((a, b) => soSanh(a.ten, b.ten));

    // Ten de nham: cung cum ambiguous_clusters, co trong registry.
    const deNham = cumDeNham.filter((c) => c.includes(u.name)).flat()
      .filter((t) => t !== u.name && slugCua.has(t)).map((t) => ({ ten: t, slug: slugCua.get(t) }))
      .sort((a, b) => soSanh(a.ten, b.ten));

    // O trong trung thuc.
    const coTruong = new Set(u.evidence.map((e) => e.field));
    const oTrong = truongSchema.filter((f) => NHAN_TRUONG_TRONG[f] && !coTruong.has(f)).map((f) => ({ truong: f, nhan: NHAN_TRUONG_TRONG[f] }));
    const mst = u.evidence.find((e) => e.field === 'ma_so_thue');

    return {
      slug, ten: u.name,
      loaiHinh: u.loaiHinhLabel || null,
      nhoms: u.nhoms.map((so, k) => ({ so, nhan: u.nhomLabels[k] })),
      lanhTho: node?.lanhTho ?? null,
      bestTier: u.bestTier, favorsRtr: !!u.favorsRtr,
      dinhDanh: mst ? { trangThai: 'da_dinh_danh', maSo: mst.value, href: mst.href } : { trangThai: 'chua_dinh_danh', maSo: null, href: null },
      dem: {
        cauNguon: u.evidence.length,
        theoTier: { A: u.evidence.filter((e) => e.tier === 'A').length, B: u.evidence.filter((e) => e.tier === 'B').length, C: u.evidence.filter((e) => e.tier === 'C').length },
        tenMienNguon: new Set(u.evidence.map((e) => e.source)).size,
        banChup: new Set(u.evidence.map((e) => e.href)).size,
        matchDaKy: nhuCau.filter((x) => x.quanHe.includes('match_da_ky')).length,
      },
      doTuoi: {
        tuoi: demTT('tuoi'), ben: demTT('ben'), giuNguonCu: demTT('giu_nguon_cu'), quaHan: demTT('qua_han'),
        khongDocDuoc: demTT('khong_doc_duoc_ngay'), cuNhat: ngays[0] ?? null, moiNhat: ngays[ngays.length - 1] ?? null,
      },
      bangChung, nhuCau, dongThoiGian, tuongTu, cungNhom, deNham, oTrong,
    };
  }).sort((a, b) => soSanh(a.slug, b.slug));

  return {
    meta: { mocNgay: moc, nguongNgay, soDonVi: units.length, truongSchema },
    units,
  };
}

/**
 * Doc ba thu tu domain.yaml cua don_vi_cncl: schema.fields, refresh_days.default,
 * ambiguous_clusters. Khong co thu vien YAML trong du an, nen doc dung ba cho, va THIEU cho nao
 * thi tra loi (nguoi goi phai dung lai), khong lang le lay mac dinh.
 */
export function docCauHinhDomain(text) {
  const loi = [];
  const lines = String(text).split('\n');
  const iF = lines.findIndex((l) => /^\s+fields:\s*$/.test(l));
  const truongSchema = [];
  if (iF < 0) loi.push('khong thay schema.fields');
  else {
    for (let k = iF + 1; k < lines.length; k++) {
      const l = lines[k];
      if (/^\s*#/.test(l) || /^\s*$/.test(l)) continue;
      const m = l.match(/^\s+-\s+([a-z_0-9]+)/);
      if (!m) break;
      truongSchema.push(m[1]);
    }
    if (!truongSchema.length) loi.push('schema.fields rong');
  }
  const iR = lines.findIndex((l) => /^refresh_days:\s*$/.test(l));
  const mR = iR >= 0 ? (lines[iR + 1] ?? '').match(/^\s+default:\s*(\d+)\s*$/) : null;
  if (!mR) loi.push('khong thay refresh_days.default');
  const lA = lines.find((l) => /^ambiguous_clusters:/.test(l));
  let cumDeNham = null;
  if (!lA) loi.push('khong thay ambiguous_clusters');
  else {
    try { cumDeNham = JSON.parse(lA.replace(/^ambiguous_clusters:\s*/, '').replace(/\s+#.*$/, '')); }
    catch (e) { loi.push(`ambiguous_clusters khong doc duoc: ${e.message}`); }
  }
  return loi.length ? { loi } : { truongSchema, nguongNgay: Number(mR[1]), cumDeNham };
}
