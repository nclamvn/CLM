#!/usr/bin/env node
/**
 * check-ho-so.mjs · Ho so don vi (M3) phai khop registry, va khong duoc "lam dep" bang cach bia.
 *
 * VI SAO CO (29/09/2026): man ho so la cho nha dau tu dung lau nhat. Ke hoach 09 ghi ro nhung
 * gi KHONG duoc lam khi lam dep: diem tong hop, dinh danh khong co nguon, giau o trong, doc do
 * tuoi theo ngay chup. Cong nay giu dung nhung dieu do bang may.
 *
 * HAI LOP KIEM:
 *   A. TINH LAI bang chinh lib/ho-so.mjs tu cac file dau vao, so voi lib/hub-ho-so.json
 *      (sua tay file sinh -> HO_SO_LECH).
 *   B. KIEM DOC LAP, KHONG dung lib/ho-so.mjs, de mot loi trong chinh module khong tu che duoc:
 *      DEM_LECH       so cau nguon / tier / so don vi khac registry dem truc tiep
 *      SLUG_HONG/TRUNG slug khong hop le hoac trung
 *      DIEM_TONG_HOP  bat ky khoa nao ten diem/score/rank/xepHang trong ho so
 *      DINH_DANH_BIA  ghi da dinh danh ma registry khong co claim ma_so_thue
 *      O_TRONG_GIAU   truong schema chua co claim ma khong liet ke; O_TRONG_BIA: liet ke ma co
 *      TUOI_LECH      so cau qua han chua ly do tinh lai tu href + note khac so ghi
 *      TUOI_LECH_CONG_PY  tong qua han vuot ngan sach cua check_do_tuoi.py (hoac, cung ngay do,
 *                     khac ngan sach): hai cong do cung mot thu phai ra cung mot so
 *      MATCH_THIEU / MATCH_KHONG_CHU_KY  match da ky cua don vi phai co mat, kem nguoi ky
 *      TEN_NGAN_TRUNG / TEN_NGAN_THUA / TEN_NGAN_DAI  ten ngan (lib/ten-ngan.mjs) trung giua hai don vi,
 *                     bang tay con ten khong co trong registry, hoac van dai qua nguong
 *      TEN_LECH       lib/hub-ten.json khac danh muc nhu cau, hoac mot ma san pham / loai hinh / nhom
 *                     trong so nguon khong doi duoc ra chu nguoi doc (man se hien ma tran)
 *
 * Chay: node scripts/check-ho-so.mjs [--lib <dir>] [--mo-dun <ho-so.mjs>] [--domain <dir>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { goc } from './goc.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const LIB = arg('--lib') || join(HERE, '..', 'lib');
const MO_DUN = resolve(arg('--mo-dun') || join(HERE, '..', 'lib', 'ho-so.mjs'));
const DOMAIN = arg('--domain') || (process.env.CLM_KHO_CNCL ? join(process.env.CLM_KHO_CNCL, 'domains', 'don_vi_cncl') : goc('CNCLData', 'domains', 'don_vi_cncl'));
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
const doc = (ten) => { const p = join(LIB, ten); if (!existsSync(p)) thoat3(`thieu ${p}`); return JSON.parse(readFileSync(p, 'utf8')); };
if (!existsSync(MO_DUN)) thoat3(`thieu ${MO_DUN}`);
if (!DOMAIN || !existsSync(join(DOMAIN, 'domain.yaml'))) thoat3('khong thay CNCLData/domains/don_vi_cncl/domain.yaml');

const { dungHoSo, docCauHinhDomain } = await import(pathToFileURL(MO_DUN).href);
const hs = doc('hub-ho-so.json');
const reg = doc('cncl-registry.json');
const mat = doc('cncl-match.json');
const graph = doc('hub-graph.json');
const ev = doc('hub-events.json');
const cauHinh = docCauHinhDomain(readFileSync(join(DOMAIN, 'domain.yaml'), 'utf8'));
if (cauHinh.loi) thoat3(`domain.yaml: ${cauHinh.loi.join('; ')}`);
if (!Array.isArray(hs.units) || !hs.units.length) thoat3('hub-ho-so.json khong co don vi nao. Rong khong phai sach.');

const vi = [];
const byTen = new Map(reg.units.map((u) => [u.name, u]));

// ── A. Tinh lai ─────────────────────────────────────────────────────────────
const moi = dungHoSo({ reg, mat, graph, ev, ...cauHinh });
moi.meta.cumDeNham = cauHinh.cumDeNham;
if (JSON.stringify(moi) !== JSON.stringify(hs)) {
  const lech = hs.units.filter((u) => JSON.stringify(u) !== JSON.stringify(moi.units.find((x) => x.slug === u.slug))).map((u) => u.slug);
  vi.push(`HO_SO_LECH: file sinh khac ban tinh lai${lech.length ? ` (${lech.slice(0, 4).join(', ')}${lech.length > 4 ? '…' : ''})` : ' (meta)'}`);
}

// ── B. Kiem doc lap ─────────────────────────────────────────────────────────
if (hs.units.length !== reg.units.length) vi.push(`DEM_LECH: ${hs.units.length} ho so, registry co ${reg.units.length} don vi`);
const slugs = new Set();
for (const h of hs.units) {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(h.slug ?? '')) vi.push(`SLUG_HONG: "${h.slug}" (${h.ten})`);
  if (slugs.has(h.slug)) vi.push(`SLUG_TRUNG: ${h.slug}`);
  slugs.add(h.slug);
}

const CAM = /^(diem|score|scores|rank|ranking|xepHang|xep_hang|hangTong|tongDiem|rating)$/i;
const quetKhoa = (o, duong) => {
  if (Array.isArray(o)) { o.forEach((x, k) => quetKhoa(x, `${duong}[${k}]`)); return; }
  if (o && typeof o === 'object') for (const [k, v] of Object.entries(o)) { if (CAM.test(k)) vi.push(`DIEM_TONG_HOP: ${duong}.${k}`); quetKhoa(v, `${duong}.${k}`); }
};

// Luat tuoi viet lai o day, DOC LAP voi lib/ho-so.mjs (cung dac ta voi check_do_tuoi.py).
const BEN = new Set(['ten_don_vi', 'loai_hinh', 'nhom_cncl', 'san_pham_lien_quan']);
const laBen = (f) => BEN.has(f) || f.startsWith('nhom_cncl_phu_') || f.startsWith('san_pham_phu_');
const moc = Date.parse(`${reg.meta.generatedAt}T00:00:00Z`);
const quaHanDocLap = (u) => u.evidence.filter((e) => {
  if (laBen(e.field)) return false;
  const m = String(e.href).match(/_(\d{4})(\d{2})(\d{2})\.[a-z]+$/);
  if (!m) return false;
  const tuoi = Math.round((moc - Date.UTC(+m[1], +m[2] - 1, +m[3])) / 86400000);
  return tuoi > cauHinh.nguongNgay && !String(e.note ?? '').includes('GIU NGUON CU:');
}).length;
const NHAN_TRONG = ['ma_so_thue', 'loai_hinh', 'san_pham_lien_quan', 'nang_luc_mo_ta', 'bang_chung_nang_luc', 'location'];

let tongQuaHan = 0;
for (const h of hs.units) {
  quetKhoa(h, h.slug);
  const u = byTen.get(h.ten);
  if (!u) { vi.push(`DEM_LECH: ho so ${h.ten} khong co trong registry`); continue; }
  if (h.dem?.cauNguon !== u.evidence.length) vi.push(`DEM_LECH: ${h.slug} ghi ${h.dem?.cauNguon} cau, registry ${u.evidence.length}`);
  for (const t of ['A', 'B', 'C']) {
    const that = u.evidence.filter((e) => e.tier === t).length;
    if (h.dem?.theoTier?.[t] !== that) vi.push(`DEM_LECH: ${h.slug} tier ${t} ghi ${h.dem?.theoTier?.[t]}, registry ${that}`);
  }
  if ((h.bangChung ?? []).length !== u.evidence.length || h.bangChung.some((b) => !u.evidence[b.i] || u.evidence[b.i].href !== b.href)) vi.push(`DEM_LECH: ${h.slug} danh sach bang chung khong khop registry`);
  const coMst = u.evidence.some((e) => e.field === 'ma_so_thue');
  if (h.dinhDanh?.trangThai === 'da_dinh_danh' && !coMst) vi.push(`DINH_DANH_BIA: ${h.slug} ghi da dinh danh (${h.dinhDanh.maSo}) nhung registry khong co claim ma_so_thue`);
  if (h.dinhDanh?.trangThai !== 'da_dinh_danh' && coMst) vi.push(`DINH_DANH_BIA: ${h.slug} co claim ma_so_thue ma ho so ghi chua dinh danh`);
  const co = new Set(u.evidence.map((e) => e.field));
  const trong = new Set((h.oTrong ?? []).map((o) => o.truong));
  for (const f of NHAN_TRONG) {
    if (!cauHinh.truongSchema.includes(f)) continue;
    if (!co.has(f) && !trong.has(f)) vi.push(`O_TRONG_GIAU: ${h.slug} chua co claim ${f} ma khong ghi la o trong`);
    if (co.has(f) && trong.has(f)) vi.push(`O_TRONG_BIA: ${h.slug} ghi ${f} la o trong nhung registry co claim`);
  }
  const qh = quaHanDocLap(u);
  tongQuaHan += qh;
  if (h.doTuoi?.quaHan !== qh) vi.push(`TUOI_LECH: ${h.slug} ghi ${h.doTuoi?.quaHan} cau qua han chua ly do, tinh doc lap ra ${qh}`);
  for (const m of mat.signedMatches.filter((x) => x.supplyId === u.name)) {
    const x = (h.nhuCau ?? []).find((n) => n.matchId === m.id);
    if (!x) vi.push(`MATCH_THIEU: ${h.slug} thieu ${m.id}`);
    else if (!x.ky?.by || !x.ky?.date) vi.push(`MATCH_KHONG_CHU_KY: ${h.slug} ${m.id}`);
  }
  for (const n of h.nhuCau ?? []) if (n.quanHe?.includes('match_da_ky') && !(n.ky?.by)) vi.push(`MATCH_KHONG_CHU_KY: ${h.slug} ${n.matchId ?? n.id}`);
}

// Doi chieu voi cong Python check_do_tuoi.py: cung do mot thu thi phai ra cung mot so.
const nsFile = join(DOMAIN, 'ngan_sach_do_tuoi.txt');
if (!existsSync(nsFile)) vi.push('TUOI_LECH_CONG_PY: khong thay ngan_sach_do_tuoi.txt de doi chieu');
else {
  const ns = Number((readFileSync(nsFile, 'utf8').match(/^\s*(\d+)/) || [])[1]);
  const homNay = new Date().toISOString().slice(0, 10);
  // Thoi gian chi lam nguon cu di: do o moc cu thi so qua han khong the vuot so do hom nay.
  if (tongQuaHan > ns) vi.push(`TUOI_LECH_CONG_PY: ho so dem ${tongQuaHan} cau qua han, ngan sach cong Python ${ns}`);
  else if (reg.meta.generatedAt === homNay && tongQuaHan !== ns) vi.push(`TUOI_LECH_CONG_PY: cung ngay ${homNay} ma ho so dem ${tongQuaHan}, ngan sach cong Python ${ns}`);
}

// ── Chu nguoi doc cho gia tri ma (01/10/2026) ──
{
  const { dungTenSp, hienGiaTri } = await import(pathToFileURL(join(HERE, '..', 'lib', 'hien-gia-tri.mjs')).href);
  const ten = doc('hub-ten.json');
  if (JSON.stringify(ten.sanPham) !== JSON.stringify(dungTenSp(reg.needs))) vi.push('TEN_LECH: hub-ten.json khac danh muc nhu cau trong registry');
  const ma = new Set();
  for (const u of reg.units) for (const e of u.evidence) {
    if (!['loai_hinh', 'nhom_cncl', 'san_pham_lien_quan'].includes(e.field) && !e.field.startsWith('nhom_cncl_phu')) continue;
    if (hienGiaTri(e.field, e.value, ten.sanPham) === e.value) ma.add(`${e.field}=${e.value}`);
  }
  if (ma.size) vi.push(`TEN_LECH: ${ma.size} gia tri ma khong doi duoc ra chu: ${[...ma].slice(0, 6).join(', ')}`);
}

{
  const { tenNgan, BANG_TAY, NGUONG } = await import(pathToFileURL(join(HERE, '..', 'lib', 'ten-ngan.mjs')).href);
  const theoNgan = new Map();
  for (const u of reg.units) { const t = tenNgan(u.name); theoNgan.set(t, [...(theoNgan.get(t) ?? []), u.name]); if (t.length > NGUONG) vi.push(`TEN_NGAN_DAI: "${t}" (${t.length} ky tu) cho ${u.name}`); }
  for (const [t, ds] of theoNgan) if (ds.length > 1) vi.push(`TEN_NGAN_TRUNG: "${t}" cho ${ds.join(' | ')}`);
  const coTen = new Set(reg.units.map((u) => u.name));
  for (const k of Object.keys(BANG_TAY)) if (!coTen.has(k)) vi.push(`TEN_NGAN_THUA: bang tay co "${k}" khong con trong registry`);
}

console.log(`ho so: ${hs.units.length} · cau qua han chua ly do: ${tongQuaHan} · moc ${reg.meta.generatedAt}`);
if (vi.length) {
  console.log(`\nFAIL: ${vi.length} vi pham`);
  vi.slice(0, 30).forEach((v) => console.log('  ' + v));
  process.exit(2);
}
console.log('\nOK: ho so khop registry, khong diem tong hop, khong dinh danh bia, o trong noi thang, do tuoi khop cong Python.');
