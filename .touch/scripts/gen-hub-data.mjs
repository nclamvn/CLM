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
import { dungBanDo, LOAI_CHEO } from '../lib/do-thi-ban-do.mjs';
import { dungMaTran } from '../lib/do-thi-ma-tran.mjs';
import { dungHoSo, docCauHinhDomain } from '../lib/ho-so.mjs';
import { dungThiTruong } from '../lib/thi-truong.mjs';
import { dungMatching } from '../lib/matching.mjs';
import { dungThoiCuoc } from '../lib/thoi-cuoc.mjs';
import { dungMoDau } from '../lib/mo-dau.mjs';
import { dungTenSp } from '../lib/hien-gia-tri.mjs';
import { dungChiMuc } from '../lib/hoi-dap.mjs';

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

// Cau hinh domain chieu CUNG (schema, nguong tuoi, cum ten de nham) cho ho so don vi.
const DOMAIN_YAML = env('CLM_KHO_CNCL')
  ? join(env('CLM_KHO_CNCL'), 'domains', 'don_vi_cncl', 'domain.yaml')
  : goc('CNCLData', 'domains', 'don_vi_cncl', 'domain.yaml');
if (!DOMAIN_YAML || !existsSync(DOMAIN_YAML)) { console.error('KHONG THAY CNCLData/domains/don_vi_cncl/domain.yaml (can cho ho so don vi).'); process.exit(2); }
const cauHinh = docCauHinhDomain(readFileSync(DOMAIN_YAML, 'utf8'));
if (cauHinh.loi) { console.error(`domain.yaml: ${cauHinh.loi.join('; ')}`); process.exit(2); }

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

// San pham -> NHOM CONG NGHE. SUA 29/09/2026: ban truoc doc truong `group` cua chieu CAU, nhung
// truong do la NHOM SAN PHAM (1 = da co thi truong, 2 = con lai) chu KHONG phai nhom cong nghe
// 1..10. Ca 30 nhu cau bi gan vao nhom cong nghe 1 va 2, va man do thi ve sai tu 29/09 den luc
// sua. Lo ra khi dung bo cuc hai truc: 35/42 canh "cung san pham" noi hai nhom khac nhau.
// QD 21/2026 KHONG noi san pham voi nhom cong nghe. Anh xa duy nhat hop le la bang
// mapping_sp_nhom.yaml do NGUOI GAC CONG duyet (16/08/2026), va may chi nhan dong da_duyet.
const MAP_SP = env('CLM_KHO_MATCH') ? join(env('CLM_KHO_MATCH'), 'domains', 'cncl_match', 'mapping_sp_nhom.yaml')
  : goc('CaoLocMatch', 'domains', 'cncl_match', 'mapping_sp_nhom.yaml');
if (!MAP_SP || !existsSync(MAP_SP)) { console.error('KHONG THAY mapping_sp_nhom.yaml (anh xa san pham -> nhom da duyet).'); process.exit(2); }
const nhomCuaSp = new Map();
const tranhChap = [];
const nguoiDuyet = (readFileSync(MAP_SP, 'utf8').match(/nguoi duyet: ([^(\n]+)/) || [])[1]?.trim() ?? null;
const ngayDuyet = (readFileSync(MAP_SP, 'utf8').match(/DA DUYET (\d{2}\/\d{2}\/\d{4})/) || [])[1] ?? null;
for (const l of readFileSync(MAP_SP, 'utf8').split('\n')) {
  const m = l.match(/^\s+CNCL-P(\d+):\s*\{nhom:\s*(\d+),\s*ly_do:\s*"([^"]*)",\s*trang_thai:\s*(\w+)\}/);
  if (!m) continue;
  const [, sp, nh, lyDo, tt] = m;
  if (tt !== 'da_duyet') continue; // chua duyet thi de trong, khong doan
  if (nhomCuaSp.has(sp) && nhomCuaSp.get(sp).group !== nh) { tranhChap.push(`san pham ${sp}`); continue; }
  nhomCuaSp.set(sp, { group: nh, lyDo, tranhChap: false });
}

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
    // Khong co cau nguon: QD 21 khong noi san pham voi nhom. Can cu la QUYET DINH ANH XA da duyet.
    canCu: { loai: 'anh_xa_da_duyet', lyDo: g.lyDo, nguoiDuyet, ngayDuyet, tep: 'CaoLocMatch/domains/cncl_match/mapping_sp_nhom.yaml' } });
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
// Bo cuc tinh LUC BUILD, tat dinh: ban do lanh tho nhom (lib/do-thi-ban-do.mjs) va thu tu ma
// tran (lib/do-thi-ma-tran.mjs). Trang web chi ve, khong tinh. Cong check-do-thi.mjs tinh lai,
// doi chieu tung nut va giu ngan sach giao canh.
const banDo = dungBanDo(nodes, edges);
const toaDo = new Map(banDo.nodes.map((p) => [p.id, p]));
for (const n of nodes) { const p = toaDo.get(n.id); n.x = p.x; n.y = p.y; n.lanhTho = p.lanhTho; if (p.lanhThoPhu) n.lanhThoPhu = p.lanhThoPhu; if (p.nhan) n.nhan = p.nhan; }
const maTran = dungMaTran(nodes, edges.filter((e) => LOAI_CHEO.includes(e.kind)), banDo.thuTuLanhTho);
const boCuc = { rong: banDo.rong, cao: banDo.cao, thamSo: banDo.thamSo, thuTuLanhTho: banDo.thuTuLanhTho, lanhTho: banDo.lanhTho, chiSo: banDo.chiSo };
writeFileSync(join(LIB, 'hub-graph.json'), JSON.stringify({ meta: graphMeta, boCuc, maTran, nodes, edges }, null, 2) + '\n', 'utf8');

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

// ── Ho so don vi (M3) ─────────────────────────────────────────────────────
// Sinh tu CHINH cac file vua ghi (graph, events) de ho so va do thi khong bao gio lech nhau.
const hoSo = dungHoSo({ reg, mat, graph: { nodes, edges }, ev: { events }, ...cauHinh });
hoSo.meta.cumDeNham = cauHinh.cumDeNham;
writeFileSync(join(LIB, 'hub-ho-so.json'), JSON.stringify(hoSo, null, 2) + '\n', 'utf8');
// Ten san pham cho lop hien thi (ma "28" -> "P28 · ..."), sinh tu danh muc nhu cau, khong go tay.
writeFileSync(join(LIB, 'hub-ten.json'), JSON.stringify({ sanPham: dungTenSp(reg.needs) }, null, 2) + '\n', 'utf8');

// ── Toan canh thi truong (M1) ─────────────────────────────────────────────
// Doc tu chinh graph + ho so vua sinh, de ba man (do thi, ho so, thi truong) khong bao gio lech.
const thiTruong = dungThiTruong({ graph: { nodes, edges, boCuc }, hoSo });
writeFileSync(join(LIB, 'hub-thi-truong.json'), JSON.stringify(thiTruong, null, 2) + '\n', 'utf8');

// ── Matching Workbench v2 (M4): phan ra diem + so do hai cot ─────────────
const matching = dungMatching(mat);
const lechDiem = mat.signedMatches.filter((m) => matching.phanRa[m.id].lamTron !== m.score).map((m) => m.id);
if (lechDiem.length) { console.error(`FAIL: diem tinh lai tu cong thuc khac diem engine: ${lechDiem.join(', ')}`); process.exit(2); }
writeFileSync(join(LIB, 'hub-matching.json'), JSON.stringify(matching, null, 2) + '\n', 'utf8');

// ── Dong thoi cuoc (M5) ───────────────────────────────────────────────────
const SK_CS = join(DEM, 'su_kien_chinh_sach.jsonl');
if (!existsSync(SK_CS)) { console.error(`KHONG THAY ${SK_CS} (su kien chinh sach cho Dong thoi cuoc).`); process.exit(2); }
const thoiCuoc = dungThoiCuoc({ reg, mat, ev: { events }, hoSo, graph: { nodes, edges }, suKienChinhSach: docJsonl(SK_CS) });
writeFileSync(join(LIB, 'hub-thoi-cuoc.json'), JSON.stringify(thoiCuoc, null, 2) + '\n', 'utf8');

// ── Mo dau (M0): trang /dashboard, chi doc cac file da sinh o tren ────────
const moDau = dungMoDau({ reg, mat, graph: { nodes, edges, boCuc }, thiTruong, thoiCuoc, hoSo, matching });
writeFileSync(join(LIB, 'hub-mo-dau.json'), JSON.stringify(moDau, null, 2) + '\n', 'utf8');

// ── Hoi dap co trich dan (01/10/2026): chi muc cau nguon nang luc + kho cum tu cua so nguon ──
writeFileSync(join(LIB, 'hub-hoi-dap.json'), JSON.stringify(dungChiMuc(reg, mat)) + '\n', 'utf8');

// ── Cau lam bang chi nam trong ghi chu nguoi chup ───────────────────────────
// Giao dien doc file nay de CANH BAO ngay tren the bang chung, khong doi nguoi bam moi biet.
// Cong check-ghi-chu-ban-chup.mjs dem lai doc lap va doi chieu voi ngan sach.
const PUB = join(HERE, '..', 'public');
const docBanChup = (href) => { const p = join(PUB, href); return existsSync(p) ? readFileSync(p, 'utf8') : null; };
const ghiChu = spanChiTrongGhiChu(moiCauNguon(reg, mat), docBanChup).filter((x) => !x.ai.startsWith('MATCH-'));
writeFileSync(join(LIB, 'hub-ghi-chu.json'), JSON.stringify({ meta: { generatedAt: NOW, so: ghiChu.length }, ds: ghiChu }, null, 2) + '\n', 'utf8');

console.log(`HUB: ${nodes.length} nut · ${edges.length} canh · ${docs.length} tai lieu tim · ${events.length} su kien`);
console.log(`  ho so: ${hoSo.units.length} don vi · ${hoSo.units.filter((u) => u.dinhDanh.trangThai === 'chua_dinh_danh').length} chua dinh danh · ${hoSo.units.reduce((s, u) => s + u.doTuoi.quaHan, 0)} cau qua han chua ly do`);
console.log(`  thi truong: ${thiTruong.kpi.soCap} cap cung-cau (${thiTruong.kpi.capDaKy} da ky) · ${thiTruong.kpi.ncTrong}/${thiTruong.kpi.soNc} nhu cau chua co ben cung · dien tich giao Sankey ${thiTruong.sankey.chiSo.dienTichGiao}`);
console.log(`  matching: ${Object.keys(matching.phanRa).length} diem tinh lai khop engine · so do hai cot ${matching.haiCot.giao} giao (ban dau ${matching.haiCot.giaoBanDau})`);
console.log(`  thoi cuoc: ${thoiCuoc.suKien.length} su kien (${Object.entries(thoiCuoc.meta.theoLan).map(([k, v]) => `${k} ${v}`).join(', ')}) · ${thoiCuoc.meta.tu} -> ${thoiCuoc.meta.den}`);
console.log(`  bo cuc: ${boCuc.chiSo.giaoCanh} giao canh, ${boCuc.chiSo.canhXuyenNut} canh xuyen nut tren ${boCuc.chiSo.soCanhVe} canh cung-cau · ma tran dao ${maTran.chiSo.daoBanDau} -> ${maTran.chiSo.daoSauSap}`);
console.log(`  canh: ${Object.entries(graphMeta.canh).map(([k, v]) => `${k} ${v}`).join(' · ')}`);
if (spNgoaiDanhMuc.length) console.log(`  CHU Y: ${spNgoaiDanhMuc.length} ma san pham khong khop nhu cau nao: ${spNgoaiDanhMuc.join(', ')}`);
if (thieuNguon) console.log(`  CHU Y: ${thieuNguon} canh bi BO vi khong tim thay claim lam nguon`);
if (graphMeta.nhuCauChuaCoNhom) console.log(`  CHU Y: ${graphMeta.nhuCauChuaCoNhom} nhu cau chua gan duoc nhom tu nguon`);
if (ghiChu.length) console.log(`  CHU Y: ${ghiChu.length} cau lam bang CHI nam trong ghi chu nguoi chup (xem ngan_sach_span_trong_ghi_chu.txt)`);
if (tranhChap.length) console.log(`  TRANH CHAP (khong chon ho): ${tranhChap.join(', ')}`);
