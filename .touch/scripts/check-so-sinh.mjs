#!/usr/bin/env node
/**
 * check-so-sinh.mjs · Moi so tren trang web phai SINH tu du lieu, khong go tay.
 *
 * VI SAO CO (29/09/2026): trang Registry hien nhan "GATE PASS" voi tooltip
 * "chay_het_cong.sh · 14 o xanh", trong khi chuoi cong da 49 o. Chu do go cung trong
 * gen-cncl-data.mjs tu thang 8. Luat 3 cua chinh script do ("moi so tren web deu tinh tu
 * file") da duoc VIET RA nhung khong co cong nao GIU no. Cung ngay, kho Portal cua RtR lo
 * cung mot the loai loi: "+119 tuan nay" trong khi tang that la +41, "Signals 111" trong khi
 * co 121. Mot san pham ban su chung-minh-duoc ma so tren mat tien la so go tay thi mat tin
 * dung o cho nha dau tu nhin dau tien.
 *
 * CONG KIEM BA THU:
 *   1. KHONG CO SO CONG GO TAY trong ma nguon giao dien: chuoi ky tu kieu "14 o xanh" trong
 *      app/, components/, scripts/, lib/*.ts. Dong chu thich duoc bo qua.
 *   2. DEM LAI: meta cua lib/cncl-registry.json, lib/hub-graph.json, lib/hub-events.json,
 *      lib/hub-search.json phai bang so dem lai tu chinh mang du lieu trong file. Moi canh do
 *      thi phai tro toi nut co that, va canh "thuoc_nhom" / "cung_san_pham" phai co span.
 *   3. KET QUA CHUOI CONG KHONG DUOC BIA: meta.chuoiCong phai khop file
 *      CaoLocMatch/out/ket_qua_chuoi.json neu cung thoi diem; khong co file thi meta phai
 *      noi la chua co (chuoiCong null). Meta khong duoc moi hon file.
 *
 * Chay: node scripts/check-so-sinh.mjs [--lib <dir>] [--quet <dir,dir>] [--ket-qua <file>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { goc } from './goc.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };

const LIB = arg('--lib') || join(TOUCH, 'lib');
const QUET = (arg('--quet') || ['app', 'components', 'scripts', 'lib'].map((d) => join(TOUCH, d)).join(',')).split(',');
const KET_QUA = arg('--ket-qua')
  || (process.env.CLM_KHO_MATCH ? join(process.env.CLM_KHO_MATCH, 'out', 'ket_qua_chuoi.json')
    : join(goc('CaoLocMatch') ?? join(TOUCH, '..', 'CaoLocMatch'), 'out', 'ket_qua_chuoi.json'));

const vi = [];
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
const docJson = (ten) => {
  const p = join(LIB, ten);
  if (!existsSync(p)) thoat3(`thieu ${p}. Chay gen-cncl-data.mjs roi gen-hub-data.mjs.`);
  try { return JSON.parse(readFileSync(p, 'utf8')); } catch (e) { thoat3(`${ten} khong parse duoc: ${e.message}`); }
};

// ── 1. So cong go tay ───────────────────────────────────────────────────────
const MAU = /['"`][^'"`\n]*\b\d+\s*(o|ô)\s*xanh[^'"`\n]*['"`]/i;
let soFile = 0;
const quet = (d) => {
  if (!existsSync(d)) return;
  for (const ten of readdirSync(d)) {
    const p = join(d, ten);
    if (ten === 'node_modules' || ten.startsWith('.')) continue;
    if (statSync(p).isDirectory()) { quet(p); continue; }
    if (!/\.(ts|tsx|mjs|js)$/.test(ten)) continue;
    soFile++;
    readFileSync(p, 'utf8').split('\n').forEach((dong, i) => {
      const t = dong.trim();
      if (t.startsWith('//') || t.startsWith('*') || t.startsWith('/*')) return;
      if (MAU.test(dong)) vi.push(`SO_GO_TAY: ${p}:${i + 1} · ${t.slice(0, 90)}`);
    });
  }
};
QUET.forEach(quet);
if (soFile === 0) thoat3(`khong quet duoc file nao trong ${QUET.join(', ')}. Quet rong khong phai sach.`);

// ── 2. Dem lai ──────────────────────────────────────────────────────────────
const reg = docJson('cncl-registry.json');
const graph = docJson('hub-graph.json');
const ev = docJson('hub-events.json');
const tim = docJson('hub-search.json');

const ss = (nhan, meta, that) => { if (meta !== that) vi.push(`LECH_SO: ${nhan} meta ${meta} != dem lai ${that}`); };
const evid = reg.units.flatMap((u) => u.evidence);
ss('registry.units', reg.meta.units, reg.units.length);
ss('registry.needs', reg.meta.needs, reg.needs.length);
ss('registry.claims', reg.meta.claims, evid.length);
ss('registry.tierA', reg.meta.tierA, evid.filter((e) => e.tier === 'A').length);
ss('registry.tierB', reg.meta.tierB, evid.filter((e) => e.tier === 'B').length);

const dem = (a, k, v) => a.filter((x) => x[k] === v).length;
for (const k of Object.keys(graph.meta.nut)) ss(`graph.nut.${k}`, graph.meta.nut[k], dem(graph.nodes, 'kind', k));
for (const k of Object.keys(graph.meta.canh)) ss(`graph.canh.${k}`, graph.meta.canh[k], dem(graph.edges, 'kind', k));
ss('graph.nut.don_vi vs registry', graph.meta.nut.don_vi, reg.units.length);
const coNut = new Set(graph.nodes.map((n) => n.id));
for (const e of graph.edges) {
  if (!coNut.has(e.source) || !coNut.has(e.target)) vi.push(`CANH_TREO: ${e.id}`);
  if ((e.kind === 'thuoc_nhom' || e.kind === 'cung_san_pham') && !(e.bangChung && e.bangChung.span)) {
    vi.push(`CANH_KHONG_NGUON: ${e.id}`);
  }
  if (e.kind === 'match_da_ky' && !(e.signoff && e.signoff.by)) vi.push(`MATCH_KHONG_CHU_KY: ${e.id}`);
}
ss('events.soSuKien', ev.meta.soSuKien, ev.events.length);
for (const k of Object.keys(ev.meta.theoLoai)) ss(`events.${k}`, ev.meta.theoLoai[k], dem(ev.events, 'kind', k));
for (const e of ev.events) {
  if (e.kind === 'de_xuat_vong_tu_chay' && e.trangThai === 'da_ky') vi.push(`DE_XUAT_THANH_DA_KY: ${e.maHangCho}`);
}
ss('search.soTaiLieu', tim.meta.soTaiLieu, tim.docs.length);

// ── 3. Ket qua chuoi cong ───────────────────────────────────────────────────
const cc = reg.meta.chuoiCong;
if (!existsSync(KET_QUA)) {
  if (cc !== null && cc !== undefined) vi.push(`CHUOI_BIA: meta co ket qua chuoi cong nhung khong co file ${KET_QUA}`);
} else if (cc) {
  const k = JSON.parse(readFileSync(KET_QUA, 'utf8'));
  if (String(cc.luc) > String(k.luc)) vi.push(`CHUOI_BIA: meta ghi lan chay ${cc.luc} MOI HON file ${k.luc}`);
  if (cc.luc === k.luc) {
    const cap = [['tong', 'tong'], ['xanh', 'xanh'], ['do', 'do'], ['khongChay', 'khong_chay'], ['hoan', 'hoan']];
    for (const [a, b] of cap) if (cc[a] !== k[b]) vi.push(`CHUOI_LECH: ${a} meta ${cc[a]} != file ${k[b]}`);
    if (cc.dat !== (k.do === 0 && k.khong_chay === 0)) vi.push(`CHUOI_LECH: dat=${cc.dat} nhung file do ${k.do}, khong chay ${k.khong_chay}`);
  }
}
if (cc === null && !/chưa có kết quả/.test(reg.meta.gate)) vi.push(`CHUOI_BIA: chuoiCong null nhung gate ghi "${reg.meta.gate}"`);

console.log(`quet ${soFile} file giao dien · dem lai ${graph.nodes.length} nut, ${graph.edges.length} canh, ${ev.events.length} su kien`);
if (vi.length) {
  console.log(`\nFAIL: ${vi.length} vi pham`);
  vi.slice(0, 30).forEach((v) => console.log('  ' + v));
  process.exit(2);
}
console.log('\nOK: moi so kiem duoc deu sinh tu du lieu, khong so cong nao go tay.');
