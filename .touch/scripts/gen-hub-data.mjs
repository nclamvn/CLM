#!/usr/bin/env node
/**
 * gen-hub-data.mjs · Lop xuat du lieu DUNG CHUNG cho cac man moi cua hub (P0, 29/09/2026).
 *
 * Doc (chi doc, khong sua):
 *   lib/cncl-registry.json      don vi CUNG + nhu cau CAU (do gen-cncl-data.mjs sinh)
 *   lib/cncl-match.json         match da ky + cap bi tu choi
 *   Dataset_CongNgheChienLuoc/claims.jsonl   san pham -> nhom (truong group, co nguon)
 *   CNCLData/vong_tu_chay/hang_cho.jsonl     de xuat cua vong tu chay, CHUA DUYET
 *
 * Ghi:
 *   lib/hub-graph.json   nut (don vi, nhu cau, nhom) + canh, MOI canh mang bang chung
 *   lib/hub-search.json  tai lieu tim kiem, moi truong co ban co dau va ban khong dau
 *   lib/hub-events.json  su kien co ngay that: ky match, tu choi, de xuat dang cho duyet
 *
 * BON LUAT:
 *   1. Khong canh nao khong co nguon. Canh "thuoc nhom" va "cung san pham" tro ve dung claim
 *      lam ra no (span + href). Canh match tro ve khoa bang chung + nguoi ky.
 *   2. Moi so trong meta dem tu mang vua sinh, khong go tay. Cong check-so-sinh.mjs dem lai.
 *   3. De xuat cua vong tu chay mang nhan "cho_duyet" va KHONG BAO GIO tro thanh canh do thi.
 *      Chung la tin, chua phai su that cua registry.
 *   4. Mot san pham ma nguon cau ghi hai nhom khac nhau thi KHONG chon ho: bo trong va ghi
 *      vao meta.tranhChap.
 *
 * Chay: node scripts/gen-hub-data.mjs · Exit 0 ghi xong · 2 thieu dau vao.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { goc } from './goc.mjs';
import { khoaTim } from './viet.mjs';
import { moiCauNguon, spanChiTrongGhiChu } from '../lib/ban-chup.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const LIB = join(HERE, '..', 'lib');
const env = (k) => process.env[k] || null;

const docJson = (p, nhan) => {
  if (!existsSync(p)) { console.error(`KHONG THAY ${nhan}: ${p}. Chay gen-cncl-data.mjs truoc.`); process.exit(2); }
  return JSON.parse(readFileSync(p, 'utf8'));
};
const docJsonl = (p) => readFileSync(p, 'utf8').split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l));

const reg = docJson(join(LIB, 'cncl-registry.json'), 'registry web');
const mat = docJson(join(LIB, 'cncl-match.json'), 'match web');

const DEM = env('CLM_KHO_DEM') || goc('Dataset_CongNgheChienLuoc');
if (!DEM) { console.error('KHONG THAY Dataset_CongNgheChienLuoc (chieu CAU).'); process.exit(2); }
const demClaims = docJsonl(join(DEM, 'claims.jsonl'));

const HANG_CHO = env('CLM_KHO_CNCL')
  ? join(env('CLM_KHO_CNCL'), 'vong_tu_chay', 'hang_cho.jsonl')
  : goc('CNCLData', 'vong_tu_chay', 'hang_cho.jsonl');
const hangCho = HANG_CHO && existsSync(HANG_CHO) ? docJsonl(HANG_CHO) : null;

// ── Nut ─────────────────────────────────────────────────────────────────────
const nodes = [];
const edges = [];
const nhomDaDung = new Map(); // so nhom -> nhan

for (const u of reg.units) {
  nodes.push({
    id: `dv:${u.name}`, kind: 'don_vi', label: u.name, nhoms: u.nhoms, sanPham: u.sanPham,
    favorsRtr: u.favorsRtr, bestTier: u.bestTier, soClaim: u.evidence.length,
    capability: u.capability,
  });
  u.nhoms.forEach((n, i) => nhomDaDung.set(n, u.nhomLabels[i]));
}

// San pham -> nhom, tu chieu CAU, giu nguon. Hai nhom khac nhau cho mot san pham = tranh chap.
const nhomCuaSp = new Map();
const tranhChap = [];
for (const c of demClaims.filter((x) => x.field === 'ten_san_pham' && x.group != null)) {
  const sp = String(c.id).replace(/^CNCL-P/, '');
  const cu = nhomCuaSp.get(sp);
  if (cu && cu.group !== c.group) { cu.tranhChap = true; continue; }
  if (!cu) nhomCuaSp.set(sp, { group: c.group, span: c.evidence_span, snapshot: c.snapshot, tranhChap: false });
}
for (const [sp, v] of nhomCuaSp) if (v.tranhChap) tranhChap.push(`san pham ${sp}`);

for (const n of reg.needs) {
  const sp = n.id.replace(/^CNCL-P/, '');
  const g = nhomCuaSp.get(sp);
  nodes.push({
    id: `nc:${n.entityId}`, kind: 'nhu_cau', label: n.value, maSp: sp,
    nhom: g && !g.tranhChap ? String(g.group) : null, bestTier: n.tier, chinhThuc: n.chinhThuc,
    href: n.href,
  });
}

const soNhom = new Set([...nhomDaDung.keys()]);
for (const nd of nodes) if (nd.kind === 'nhu_cau' && nd.nhom) soNhom.add(nd.nhom);
for (const n of [...soNhom].sort((a, b) => Number(a) - Number(b))) {
  nodes.push({ id: `nh:${n}`, kind: 'nhom', label: nhomDaDung.get(n) ?? `Nhóm ${n}` });
}

// ── Canh ────────────────────────────────────────────────────────────────────
const bangChung = (u, field, value) => {
  const e = u.evidence.find((x) => x.field === field && String(x.value) === String(value));
  return e ? { span: e.span, href: e.href, tier: e.tier, source: e.source } : null;
};

let thieuNguon = 0;
const spNgoaiDanhMuc = [];
for (const u of reg.units) {
  for (const n of u.nhoms) {
    const bc = bangChung(u, 'nhom_cncl', n) ?? u.evidence.find((x) => x.field.startsWith('nhom_cncl') && String(x.value) === n);
    if (!bc) { thieuNguon++; continue; }
    edges.push({ id: `e:${u.name}>nh:${n}`, kind: 'thuoc_nhom', source: `dv:${u.name}`, target: `nh:${n}`,
      bangChung: { span: bc.span, href: bc.href, tier: bc.tier, source: bc.source } });
  }
  for (const sp of u.sanPham) {
    // Ma san pham trong registry CUNG co cho ghi "1", co cho ghi "01" (5 claim ghi "1", phat
    // hien 29/09/2026). Dem 0 vao truoc DE TRA, khong sua value trong registry.
    const need = reg.needs.find((x) => x.id === `CNCL-P${String(sp).padStart(2, '0')}`);
    if (!need) { spNgoaiDanhMuc.push(`${u.name}:${sp}`); continue; }
    const bc = bangChung(u, 'san_pham_lien_quan', sp) ?? u.evidence.find((x) => x.field.startsWith('san_pham') && String(x.value).replace(/^P/, '') === sp);
    if (!bc) { thieuNguon++; continue; }
    edges.push({ id: `e:${u.name}>sp:${sp}`, kind: 'cung_san_pham', source: `dv:${u.name}`, target: `nc:${need.entityId}`,
      bangChung: { span: bc.span, href: bc.href, tier: bc.tier, source: bc.source } });
  }
}
for (const n of nodes.filter((x) => x.kind === 'nhu_cau' && x.nhom)) {
  const g = nhomCuaSp.get(n.maSp);
  edges.push({ id: `e:${n.id}>nh:${n.nhom}`, kind: 'thuoc_nhom', source: n.id, target: `nh:${n.nhom}`,
    bangChung: { span: g.span, href: `/evidence/${String(g.snapshot).replace(/\.(html|md)$/, '.txt')}`, tier: 'A', source: 'chieu CAU' } });
}
for (const m of mat.signedMatches) {
  edges.push({ id: `e:${m.id}`, kind: 'match_da_ky', source: `dv:${m.supplyId}`, target: `nc:${m.demandId}`,
    matchId: m.id, score: m.score, signoff: m.signoff, khoaBangChung: m.khoaBangChung });
}
for (const r of mat.rejectedPairs) {
  edges.push({ id: `e:tuchoi:${r.supplyId}>${r.demandId}`, kind: 'tu_choi', source: `dv:${r.supplyId}`,
    target: `nc:${r.demandId}`, by: r.by, date: r.date, lyDo: r.lyDo });
}

// Canh tro toi nut khong ton tai la loi sinh, khong phai du lieu: dung lai.
const coNut = new Set(nodes.map((n) => n.id));
const treo = edges.filter((e) => !coNut.has(e.source) || !coNut.has(e.target));
if (treo.length) {
  console.error(`FAIL: ${treo.length} canh tro toi nut khong ton tai, vd ${treo[0].id}`);
  process.exit(2);
}

const NOW = reg.meta.generatedAt;
const dem = (arr, k, v) => arr.filter((x) => x[k] === v).length;
const graphMeta = {
  generatedAt: NOW,
  nut: { don_vi: dem(nodes, 'kind', 'don_vi'), nhu_cau: dem(nodes, 'kind', 'nhu_cau'), nhom: dem(nodes, 'kind', 'nhom') },
  canh: Object.fromEntries(['thuoc_nhom', 'cung_san_pham', 'match_da_ky', 'tu_choi'].map((k) => [k, dem(edges, 'kind', k)])),
  canhThieuNguonBiBo: thieuNguon,
  sanPhamNgoaiDanhMucCau: spNgoaiDanhMuc,
  nhuCauChuaCoNhom: nodes.filter((n) => n.kind === 'nhu_cau' && !n.nhom).length,
  tranhChap,
};
writeFileSync(join(LIB, 'hub-graph.json'), JSON.stringify({ meta: graphMeta, nodes, edges }, null, 2) + '\n', 'utf8');

// ── Tim kiem ────────────────────────────────────────────────────────────────
const docs = [
  ...reg.units.map((u) => ({ id: `dv:${u.name}`, kind: 'don_vi', ten: u.name, moTa: [u.capability, u.capability2].filter(Boolean).join(' · '), nhan: u.nhomLabels.join(', ') })),
  ...reg.needs.map((n) => ({ id: `nc:${n.entityId}`, kind: 'nhu_cau', ten: n.value, moTa: n.id, nhan: n.chinhThuc ? 'nhu cầu chính thức' : 'nhu cầu' })),
  ...nodes.filter((n) => n.kind === 'nhom').map((n) => ({ id: n.id, kind: 'nhom', ten: n.label, moTa: '', nhan: 'nhóm công nghệ chiến lược' })),
].map((d) => ({ ...d, khoa: khoaTim(`${d.ten} ${d.moTa} ${d.nhan}`) }));
writeFileSync(join(LIB, 'hub-search.json'), JSON.stringify({ meta: { generatedAt: NOW, soTaiLieu: docs.length }, docs }, null, 2) + '\n', 'utf8');

// ── Su kien ─────────────────────────────────────────────────────────────────
const events = [
  ...mat.signedMatches.map((m) => ({ ngay: m.signoff.date, kind: 'match_da_ky', trangThai: 'da_ky',
    donVi: m.supplyId, nhuCau: m.demandId, nhan: `${m.id}: ${m.supplyId} ⇄ ${m.demandId.split(' · ')[0]}`, by: m.signoff.by })),
  ...mat.rejectedPairs.map((r) => ({ ngay: r.date, kind: 'tu_choi', trangThai: 'da_ky',
    donVi: r.supplyId, nhuCau: r.demandId, nhan: `Từ chối: ${r.supplyId} ⇄ ${r.demandId.split(' · ')[0]}`, by: r.by, lyDo: r.lyDo })),
  ...(hangCho ?? []).map((h) => ({ ngay: h.ngay_bai, kind: 'de_xuat_vong_tu_chay',
    trangThai: h.trang_thai === 'cho_nguoi' ? 'cho_duyet' : h.trang_thai, donVi: h.entity, nhuCau: null,
    nhan: `${h.field}: ${h.value}`, nguon: h.capture?.url ?? null, maHangCho: h.id })),
].sort((a, b) => String(b.ngay).localeCompare(String(a.ngay)));
const evMeta = {
  generatedAt: NOW, soSuKien: events.length,
  theoLoai: Object.fromEntries(['match_da_ky', 'tu_choi', 'de_xuat_vong_tu_chay'].map((k) => [k, dem(events, 'kind', k)])),
  hangCho: hangCho === null ? 'khong thay file hang_cho.jsonl trong moi truong nay' : `${hangCho.length} dong`,
};
writeFileSync(join(LIB, 'hub-events.json'), JSON.stringify({ meta: evMeta, events }, null, 2) + '\n', 'utf8');

// ── Cau lam bang chi nam trong ghi chu nguoi chup ───────────────────────────
// Giao dien doc file nay de CANH BAO ngay tren the bang chung, khong doi nguoi bam moi biet.
// Cong check-ghi-chu-ban-chup.mjs dem lai doc lap va doi chieu voi ngan sach.
const PUB = join(HERE, '..', 'public');
const docBanChup = (href) => { const p = join(PUB, href); return existsSync(p) ? readFileSync(p, 'utf8') : null; };
const ghiChu = spanChiTrongGhiChu(moiCauNguon(reg, mat), docBanChup).filter((x) => !x.ai.startsWith('MATCH-'));
writeFileSync(join(LIB, 'hub-ghi-chu.json'), JSON.stringify({ meta: { generatedAt: NOW, so: ghiChu.length }, ds: ghiChu }, null, 2) + '\n', 'utf8');

console.log(`HUB: ${nodes.length} nut · ${edges.length} canh · ${docs.length} tai lieu tim · ${events.length} su kien`);
console.log(`  canh: ${Object.entries(graphMeta.canh).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
if (spNgoaiDanhMuc.length) console.log(`  CHU Y: ${spNgoaiDanhMuc.length} ma san pham khong khop nhu cau nao: ${spNgoaiDanhMuc.join(', ')}`);
if (thieuNguon) console.log(`  CHU Y: ${thieuNguon} canh bi BO vi khong tim thay claim lam nguon`);
if (graphMeta.nhuCauChuaCoNhom) console.log(`  CHU Y: ${graphMeta.nhuCauChuaCoNhom} nhu cau chua gan duoc nhom tu nguon`);
if (ghiChu.length) console.log(`  CHU Y: ${ghiChu.length} cau lam bang CHI nam trong ghi chu nguoi chup (xem ngan_sach_span_trong_ghi_chu.txt)`);
if (tranhChap.length) console.log(`  TRANH CHAP (khong chon ho): ${tranhChap.join(', ')}`);
