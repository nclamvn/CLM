#!/usr/bin/env node
/**
 * check-thi-truong.mjs · Man M1 "Toan canh thi truong" phai BAO TOAN dong va dem dung.
 *
 * VI SAO CO (29/09/2026): Sankey chi dung khi do day la mot dai luong bao toan (Schmidt 2008). Mot
 * Sankey dep ma vao khac ra, hay tinh ca cap bi tu choi vao dong, thi dang noi doi bang hinh.
 * Cung ngay, luot dung man nay lo ra man do thi dem sai khoang trong (10 thay vi 11) vi tinh cap
 * bi tu choi la "co ben cung". Cong nay dem khoang trong DOC LAP de loi do khong quay lai.
 *
 * HAI LOP:
 *   A. TT_LECH: tinh lai bang lib/thi-truong.mjs, so voi lib/hub-thi-truong.json.
 *   B. Doc lap, khong dung module:
 *      BAO_TOAN     nut nhom vao != ra; nut don vi/nhu cau != tong dong cua no
 *      DEM_CAP      tong dong != so cap cung-cau chap nhan dem tu hub-graph; cap da ky != so match
 *                   da ky trong cncl-match.json
 *      KHOANG_TRONG nhu cau khong co cap chap nhan phai co mat, gia tri 0, danh dau trong; KPI va
 *                   ban do phu phai cung mot so
 *      PHU_LECH     trang thai tung o trong ban do phu khac dem doc lap
 *      TUOI_LECH    tong cau trong bieu do do tuoi != tong claim registry, hoac so qua han khac ho so
 *      VUOT_NGAN_SACH / NGAN_SACH_CHUA_HA  dien tich giao cat Sankey do lai tu toa do dang luu so
 *                   voi scripts/ngan_sach_do_thi.json (khoa mot chieu)
 *
 * Chay: node scripts/check-thi-truong.mjs [--lib <dir>] [--mo-dun <thi-truong.mjs>] [--ngan-sach <json>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const LIB = arg('--lib') || join(HERE, '..', 'lib');
const MO_DUN = resolve(arg('--mo-dun') || join(HERE, '..', 'lib', 'thi-truong.mjs'));
const NGAN_SACH = arg('--ngan-sach') || join(HERE, 'ngan_sach_do_thi.json');
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
const doc = (ten) => { const p = join(LIB, ten); if (!existsSync(p)) thoat3(`thieu ${p}`); return JSON.parse(readFileSync(p, 'utf8')); };
for (const f of [MO_DUN, NGAN_SACH]) if (!existsSync(f)) thoat3(`thieu ${f}`);
const { dungThiTruong } = await import(pathToFileURL(MO_DUN).href);
const T = doc('hub-thi-truong.json');
const graph = doc('hub-graph.json');
const hoSo = doc('hub-ho-so.json');
const reg = doc('cncl-registry.json');
const mat = doc('cncl-match.json');
const ns = JSON.parse(readFileSync(NGAN_SACH, 'utf8'));
if (!T.sankey?.nodes?.length) thoat3('hub-thi-truong.json khong co Sankey. Rong khong phai sach.');
if (typeof ns.sankeyDienTichGiao !== 'number') thoat3('ngan_sach_do_thi.json thieu sankeyDienTichGiao');

const vi = [];
// ── A ───────────────────────────────────────────────────────────────────────
if (JSON.stringify(dungThiTruong({ graph, hoSo })) !== JSON.stringify(T)) vi.push('TT_LECH: file sinh khac ban tinh lai');

// ── B. Doc lap ──────────────────────────────────────────────────────────────
const { nodes, links } = T.sankey;
const tong = (pred) => links.filter(pred).reduce((s, l) => s + l.w, 0);
for (const n of nodes) {
  const vao = tong((l) => l.t === n.id); const ra = tong((l) => l.s === n.id);
  if (n.tang === 'nhom' && (vao !== ra || vao !== n.giaTri)) vi.push(`BAO_TOAN: nhom ${n.so} vao ${vao}, ra ${ra}, ghi ${n.giaTri}`);
  if (n.tang === 'don_vi' && ra !== n.giaTri) vi.push(`BAO_TOAN: ${n.nhan} ra ${ra}, ghi ${n.giaTri}`);
  if (n.tang === 'nhu_cau' && vao !== n.giaTri) vi.push(`BAO_TOAN: P${n.maSp} vao ${vao}, ghi ${n.giaTri}`);
  if ((n.giaTri === 0) !== Boolean(n.trong)) vi.push(`KHOANG_TRONG: ${n.id} gia tri ${n.giaTri} nhung trong=${n.trong}`);
}
const tongTrai = tong((l) => l.s.startsWith('dv:')); const tongPhai = tong((l) => l.t.startsWith('nc:'));
if (tongTrai !== tongPhai) vi.push(`BAO_TOAN: tang trai ${tongTrai} != tang phai ${tongPhai}`);

// Cap chap nhan dem lai tu hub-graph, khong qua module.
const cap = new Map();
for (const e of graph.edges) {
  if (e.kind !== 'cung_san_pham' && e.kind !== 'match_da_ky') continue;
  const k = `${e.source}|${e.target}`;
  cap.set(k, (cap.get(k) ?? false) || e.kind === 'match_da_ky');
}
const tuChoi = new Set(mat.rejectedPairs.map((r) => `dv:${r.supplyId}|nc:${r.demandId}`));
for (const k of tuChoi) if (cap.has(k)) vi.push(`DEM_CAP: cap bi tu choi ${k} van co canh chap nhan trong do thi`);
if (tongTrai !== cap.size) vi.push(`DEM_CAP: tong dong ${tongTrai} != ${cap.size} cap chap nhan`);
const daKy = tong((l) => l.s.startsWith('dv:') && l.loai === 'da_ky');
if (daKy !== [...cap.values()].filter(Boolean).length || daKy !== mat.signedMatches.length) vi.push(`DEM_CAP: dong da ky ${daKy}, cap da ky ${[...cap.values()].filter(Boolean).length}, match da ky ${mat.signedMatches.length}`);

const ncCoCap = new Set([...cap.keys()].map((k) => k.split('|')[1]));
const ncTatCa = graph.nodes.filter((n) => n.kind === 'nhu_cau').map((n) => n.id);
const trongThat = ncTatCa.filter((id) => !ncCoCap.has(id));
const ncTrongSankey = nodes.filter((n) => n.tang === 'nhu_cau' && n.trong).map((n) => n.id);
if (nodes.filter((n) => n.tang === 'nhu_cau').length !== ncTatCa.length) vi.push(`KHOANG_TRONG: Sankey co ${nodes.filter((n) => n.tang === 'nhu_cau').length} nhu cau, danh muc co ${ncTatCa.length}`);
if (JSON.stringify([...ncTrongSankey].sort()) !== JSON.stringify([...trongThat].sort())) vi.push(`KHOANG_TRONG: Sankey ${ncTrongSankey.length} o trong, dem doc lap ${trongThat.length}`);
const trongPhu = T.phu.reduce((s, h) => s + h.trong, 0);
if (T.kpi.ncTrong !== trongThat.length || trongPhu !== trongThat.length) vi.push(`KHOANG_TRONG: KPI ${T.kpi.ncTrong}, ban do phu ${trongPhu}, dem doc lap ${trongThat.length}`);

for (const h of T.phu) for (const o of h.o) {
  const id = `nc:${o.id}`;
  const cs = [...cap].filter(([k]) => k.endsWith(`|${id}`));
  const that = cs.some(([, v]) => v) ? 'da_ky' : cs.length ? 'co_cung' : 'trong';
  if (o.trangThai !== that || o.soCung !== cs.length) vi.push(`PHU_LECH: P${o.maSp} ghi ${o.trangThai}/${o.soCung}, dem ${that}/${cs.length}`);
}

const soClaim = reg.units.reduce((s, u) => s + u.evidence.length, 0);
const tongTuoi = Object.values(T.tuoi.tong).reduce((s, v) => s + v, 0);
const tongNam = T.tuoi.nam.reduce((s, n) => s + n.tuoi + n.ben + n.giu_nguon_cu + n.qua_han + n.khong_doc_duoc_ngay, 0) + (T.tuoi.khongRo ? Object.values(T.tuoi.khongRo).reduce((a, b) => a + b, 0) : 0);
if (tongTuoi !== soClaim || tongNam !== soClaim) vi.push(`TUOI_LECH: bieu do ${tongNam}, tong ${tongTuoi}, registry ${soClaim} claim`);
const quaHanHoSo = hoSo.units.reduce((s, u) => s + u.doTuoi.quaHan, 0);
if (T.tuoi.tong.qua_han !== quaHanHoSo) vi.push(`TUOI_LECH: qua han ${T.tuoi.tong.qua_han}, ho so ${quaHanHoSo}`);

// Dien tich giao do lai tu TOA DO DANG LUU (khong tin chiSo).
const y = new Map(nodes.map((n) => [n.id, n.y]));
const trai = links.filter((l) => l.s.startsWith('dv:'));
let dt = 0;
for (let i = 0; i < trai.length; i++) for (let j = i + 1; j < trai.length; j++) {
  const a = trai[i]; const b = trai[j];
  if (a.s === b.s || a.t === b.t) continue;
  if ((y.get(a.s) - y.get(b.s)) * (y.get(a.t) - y.get(b.t)) < 0) dt += a.w * b.w;
}
if (dt > ns.sankeyDienTichGiao) vi.push(`VUOT_NGAN_SACH: dien tich giao Sankey ${dt} > ${ns.sankeyDienTichGiao}`);
else if (dt < ns.sankeyDienTichGiao) vi.push(`NGAN_SACH_CHUA_HA: dien tich giao ${dt} nhung ngan sach ${ns.sankeyDienTichGiao}; ha so`);
if (T.sankey.chiSo.dienTichGiao !== dt) vi.push(`TT_LECH: chiSo ghi dien tich giao ${T.sankey.chiSo.dienTichGiao}, do lai ${dt}`);

console.log(`cap: ${cap.size} (${daKy} da ky) · khoang trong: ${trongThat.length}/${ncTatCa.length} · dien tich giao: ${dt} · claim do tuoi: ${tongTuoi}`);
if (vi.length) {
  console.log(`\nFAIL: ${vi.length} vi pham`);
  vi.slice(0, 30).forEach((v) => console.log('  ' + v));
  process.exit(2);
}
console.log('\nOK: Sankey bao toan dong, dem cap va khoang trong doc lap khop, do tuoi du claim, trong ngan sach giao cat.');
