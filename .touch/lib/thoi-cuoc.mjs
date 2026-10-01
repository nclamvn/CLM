/**
 * thoi-cuoc.mjs · Du lieu man M5 "Dong thoi cuoc". Ham thuan, tat dinh; dung chung cho script sinh,
 * trang web va cong check-thoi-cuoc.mjs.
 *
 * BON LAN, MOI SU KIEN CO NGUON:
 *   chinh_sach · van ban cua Chinh phu (Dataset_CongNgheChienLuoc/su_kien_chinh_sach.jsonl). Ngay
 *                lay tu CAU NGUON, khong tu hau to ten ban chup: ca 8 ban chup chieu cau mang hau to
 *                ngay CHUP (18/07/2026), khong phai ngay dang. Cong kiem ngay nam nguyen van trong span.
 *   don_vi     · moi ban chup nguon cua chieu cung la mot su kien "nguon dang bai ve don vi", ngay la
 *                ngay dang (hau to da duoc cong ngay_dang cua CNCLData giu dung).
 *   quyet_dinh · chu ky va tu choi cua nguoi gac cong (so ky).
 *   de_xuat    · tin moi tu vong tu chay, CHUA duyet, khong bao gio tron vao su that da ky.
 * Kho Portal/kernel CHUA noi vao day: phai qua cau noi mot chieu vao hang cho (10_KHO_PORTAL_KERNEL.md).
 */
// Cung danh sach voi lib/ho-so.mjs TRUONG_DINH_DANH; chep lai de module nay dung mot minh (rang
// cua cong thoi_cuoc chep rieng file nay vao thu muc tam).
const TRUONG_DINH_DANH = ['ten_phap_nhan', 'ma_so_tu_khai', 'ma_so_thue'];

const soSanh = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
export const LAN = ['chinh_sach', 'don_vi', 'quyet_dinh', 'de_xuat'];
const hrefCua = (snap) => `/evidence/${String(snap).replace(/\.(html|md)$/, '.txt')}`;
const ngayTuHref = (h) => { const m = String(h).match(/_(\d{4})(\d{2})(\d{2})\.[a-z]+$/); return m ? `${m[1]}-${m[2]}-${m[3]}` : null; };
const THU_TU_TRUONG = ['nang_luc_mo_ta', 'bang_chung_nang_luc', 'nang_luc_mo_ta_2'];

export function dungThoiCuoc({ reg, mat, ev, hoSo, graph, suKienChinhSach }) {
  const moc = reg.meta.generatedAt;
  const slug = new Map(hoSo.units.map((u) => [u.ten, u.slug]));
  const maSp = new Map(graph.nodes.filter((n) => n.kind === 'nhu_cau').map((n) => [n.id.slice(3), n.maSp]));
  const ds = [];

  for (const e of suKienChinhSach) {
    const b0 = e.bang_chung[0];
    ds.push({
      id: e.id, ngay: e.ngay, lan: 'chinh_sach', tieuDe: `${e.van_ban}: ${e.tieu_de}`, vanBan: e.van_ban, loai: e.loai,
      nguon: e.bang_chung.map((b) => ({ ten: b.source, href: hrefCua(b.snapshot), tier: b.tier, span: b.evidence_span })),
      tier: [...new Set(e.bang_chung.map((b) => b.tier))].sort().join('/'), donVi: [], nhuCau: [], nhom: [],
      trangThai: 'may_trich', ghiChu: e.ghi_chu ?? null, href: hrefCua(b0.snapshot),
    });
  }

  // Chieu cung: gop theo ban chup.
  const theoBan = new Map();
  for (const u of reg.units) {
    for (const e of u.evidence) {
      // Ban chup chi chua truong dinh danh (trang chinh chu, trang tra cuu) khong phai TIN:
      // hau to cua no la ngay quan sat, khong phai ngay xay ra su viec.
      if (TRUONG_DINH_DANH.includes(e.field)) continue;
      if (!theoBan.has(e.href)) theoBan.set(e.href, { href: e.href, nguon: e.source, tier: e.tier, don: new Map() });
      const b = theoBan.get(e.href);
      if (!b.don.has(u.name)) b.don.set(u.name, []);
      b.don.get(u.name).push(e);
      if (e.tier < b.tier) b.tier = e.tier; // A < B < C: giu tier tot nhat
    }
  }
  for (const b of [...theoBan.values()].sort((x, y) => soSanh(x.href, y.href))) {
    const ten = [...b.don.keys()].sort(soSanh);
    const evs = [...b.don.values()].flat();
    const nl = THU_TU_TRUONG.map((f) => evs.find((e) => e.field === f)).find(Boolean);
    const sp = [...new Set(evs.filter((e) => e.field === 'san_pham_lien_quan' || e.field.startsWith('san_pham_phu')).map((e) => String(e.value)))].sort();
    const nhom = [...new Set(evs.filter((e) => e.field === 'nhom_cncl' || e.field.startsWith('nhom_cncl_phu')).map((e) => String(e.value)))].sort((x, y) => Number(x) - Number(y));
    ds.push({
      id: `SK-DV-${b.href.replace(/^\/evidence\//, '').replace(/\.txt$/, '')}`, ngay: ngayTuHref(b.href), lan: 'don_vi',
      tieuDe: ten.length === 1 ? `${ten[0]}${nl ? `: ${nl.value}` : ''}` : `${ten.length} đơn vị: ${ten.join(', ')}`,
      nguon: [{ ten: b.nguon, href: b.href, tier: b.tier, span: nl?.span ?? null }], tier: b.tier,
      donVi: ten.map((t) => ({ ten: t, slug: slug.get(t) ?? null })),
      // Gia tri san pham co the ghi '1' hoac '01': chuan hoa ROI moi bo trung.
      nhuCau: [...new Set(sp.map((s) => `P${String(Number(s)).padStart(2, '0')}`))].sort(), nhom, soCau: evs.length,
      trangThai: 'da_kiem', href: b.href,
    });
  }

  for (const m of mat.signedMatches) {
    ds.push({
      id: `SK-KY-${m.id}`, ngay: m.signoff.date, lan: 'quyet_dinh', tieuDe: `${m.id} được ký: ${m.supplyId} ⇄ P${maSp.get(m.demandId) ?? '?'}`,
      nguon: [], tier: null, donVi: [{ ten: m.supplyId, slug: slug.get(m.supplyId) ?? null }], nhuCau: [`P${maSp.get(m.demandId) ?? '?'}`],
      nhom: [String(m.nhomCau ?? '')].filter(Boolean), trangThai: 'da_ky', nguoi: m.signoff.by, matchId: m.id, href: null,
    });
  }
  for (const r of mat.rejectedPairs) {
    ds.push({
      id: `SK-TC-${r.supplyId}>${r.demandId}`, ngay: r.date, lan: 'quyet_dinh', tieuDe: `Từ chối: ${r.supplyId} ⇄ P${maSp.get(r.demandId) ?? '?'}`,
      nguon: [], tier: null, donVi: [{ ten: r.supplyId, slug: slug.get(r.supplyId) ?? null }], nhuCau: [`P${maSp.get(r.demandId) ?? '?'}`],
      nhom: [], trangThai: 'tu_choi', nguoi: r.by, lyDo: r.lyDo, href: null,
    });
  }
  for (const e of ev.events.filter((x) => x.kind === 'de_xuat_vong_tu_chay')) {
    ds.push({
      id: `SK-DX-${e.maHangCho}`, ngay: e.ngay, lan: 'de_xuat', tieuDe: `${e.donVi}: ${e.nhan}`,
      nguon: e.nguon ? [{ ten: new URL(e.nguon).hostname, href: e.nguon, tier: null, span: null }] : [], tier: null,
      donVi: [{ ten: e.donVi, slug: slug.get(e.donVi) ?? null }], nhuCau: [], nhom: [],
      trangThai: 'cho_duyet', href: e.nguon ?? null,
    });
  }

  ds.sort((a, b) => soSanh(a.ngay ?? '', b.ngay ?? '') || LAN.indexOf(a.lan) - LAN.indexOf(b.lan) || soSanh(a.id, b.id));

  // Mat do theo thang, tu thang cua su kien som nhat toi thang moc.
  const thang = (d) => d.slice(0, 7);
  const dau = thang(ds[0]?.ngay ?? moc);
  const matDo = [];
  let [y, m] = dau.split('-').map(Number);
  const [y1, m1] = thang(moc).split('-').map(Number);
  while (y < y1 || (y === y1 && m <= m1)) {
    const k = `${y}-${String(m).padStart(2, '0')}`;
    matDo.push({ thang: k, ...Object.fromEntries(LAN.map((l) => [l, ds.filter((e) => e.lan === l && thang(e.ngay) === k).length])) });
    m++; if (m > 12) { m = 1; y++; }
  }

  return {
    meta: {
      mocNgay: moc, tu: ds[0]?.ngay ?? null, den: ds[ds.length - 1]?.ngay ?? null,
      theoLan: Object.fromEntries(LAN.map((l) => [l, ds.filter((e) => e.lan === l).length])),
      baiMoiNhat: ds.filter((e) => e.lan === 'don_vi').map((e) => e.ngay).sort().pop() ?? null,
    },
    suKien: ds, matDo,
  };
}
