#!/usr/bin/env node
/**
 * check-do-thi.mjs · Bo cuc do thi cung cau phai TAT DINH, khop du lieu, va KHONG XAU DI.
 *
 * VI SAO CO (29/09/2026, pha P2a; nang cap cung ngay khi dung lai man do thi): man "Do thi cung
 * cau" ve thang toa do va thu tu ma tran da tinh luc build trong lib/hub-graph.json. Neu ai sua tay
 * mot toa do, hay ham bo tri dung Math.random, trang se ra hinh khac o moi may. Va vi Lam da che
 * ban dau "roi, khong khoa hoc", chat luong bo cuc gio la CON SO co ngan sach, khong phai cam nhan.
 *
 * KIEM:
 *   1. Moi nut don vi/nhu cau co x, y huu han trong khung boCuc; nut nam trong lanh tho nhom cua no
 *      (don vi hai nhom duoc le 10 don vi ve).
 *   2. Tinh lai hai lan ra y nhu nhau (tat dinh), va y nhu toa do, lanh tho, thu tu ma tran dang luu.
 *   3. So nut theo loai khop meta.nut; ma tran co du moi don vi va nhu cau.
 *   4. NGAN SACH MOT CHIEU (scripts/ngan_sach_do_thi.json): giao canh va canh xuyen nut do lai tu
 *      toa do dang luu, nhan chong nhau do tu ban tinh lai, khong duoc vuot ngan sach; thap hon ngan sach cung FAIL (phai ha so).
 *
 * Chay: node scripts/check-do-thi.mjs [--lib <dir>] [--mo-dun <do-thi-ban-do.mjs>] [--ngan-sach <json>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const LIB = arg('--lib') || join(HERE, '..', 'lib');
const MO_DUN = resolve(arg('--mo-dun') || join(HERE, '..', 'lib', 'do-thi-ban-do.mjs'));
const MA_TRAN = join(HERE, '..', 'lib', 'do-thi-ma-tran.mjs');
const NGAN_SACH = arg('--ngan-sach') || join(HERE, 'ngan_sach_do_thi.json');
const p = join(LIB, 'hub-graph.json');
for (const f of [p, MO_DUN, MA_TRAN, NGAN_SACH]) if (!existsSync(f)) { console.log(`KHONG CHAY DUOC: thieu ${f}`); process.exit(3); }
const { dungBanDo, demGiao, demXuyenNut, banKinhNut, LOAI_CHEO } = await import(pathToFileURL(MO_DUN).href);
const { dungMaTran } = await import(pathToFileURL(MA_TRAN).href);
const g = JSON.parse(readFileSync(p, 'utf8'));
const ns = JSON.parse(readFileSync(NGAN_SACH, 'utf8'));
if (!g.nodes?.length) { console.log('KHONG CHAY DUOC: do thi khong co nut nao.'); process.exit(3); }
if (!g.boCuc || !g.maTran) { console.log('KHONG CHAY DUOC: hub-graph.json thieu boCuc/maTran. Chay gen-hub-data.mjs.'); process.exit(3); }

const vi = [];
const { rong, cao } = g.boCuc;
const lt = new Map(g.boCuc.lanhTho.map((l) => [l.so ?? 'chua_co', l]));
for (const n of g.nodes) {
  if (n.kind === 'nhom') continue;
  if (!Number.isFinite(n.x) || !Number.isFinite(n.y) || n.x < 0 || n.x > rong || n.y < 0 || n.y > cao) { vi.push(`TOA_DO_HONG: ${n.id} (${n.x}, ${n.y})`); continue; }
  const l = lt.get(n.lanhTho);
  if (!l) { vi.push(`NGOAI_LANH_THO: ${n.id} khong co lanh tho ${n.lanhTho}`); continue; }
  const le = (n.lanhThoPhu ?? []).length ? 10.5 : 0.5;
  if (Math.hypot(n.x - l.cx, n.y - l.cy) > l.r + le) vi.push(`NGOAI_LANH_THO: ${n.id} cach tam ${Math.round(Math.hypot(n.x - l.cx, n.y - l.cy))} > r ${l.r}`);
}

// Tinh lai tu du lieu da bo moi truong bo cuc.
const sach = g.nodes.map(({ x, y, lanhTho, lanhThoPhu, nhan, ...con }) => con);
const a = dungBanDo(sach, g.edges);
const b = dungBanDo(sach, g.edges);
if (JSON.stringify(a) !== JSON.stringify(b)) vi.push('KHONG_TAT_DINH: tinh hai lan ra hai hinh khac nhau');
const moi = new Map(a.nodes.map((q) => [q.id, q]));
let lech = 0;
for (const n of g.nodes) {
  const q = moi.get(n.id);
  if (!q || q.x !== n.x || q.y !== n.y || q.lanhTho !== n.lanhTho) { lech++; if (lech <= 5) vi.push(`TOA_DO_LECH: ${n.id} luu (${n.x}, ${n.y}) tinh lai (${q?.x}, ${q?.y})`); }
}
if (lech > 5) vi.push(`... va ${lech - 5} nut lech khac`);
if (JSON.stringify(a.lanhTho) !== JSON.stringify(g.boCuc.lanhTho) || JSON.stringify(a.nodes.map((q) => q.nhan ?? null)) !== JSON.stringify(g.nodes.map((q) => q.nhan ?? null))) vi.push('LANH_THO_LECH: vung nhom dang luu khac vung tinh lai');
const cheo = g.edges.filter((e) => LOAI_CHEO.includes(e.kind));
const mt = dungMaTran(g.nodes, cheo, g.boCuc.thuTuLanhTho);
if (JSON.stringify(mt.hang) !== JSON.stringify(g.maTran.hang) || JSON.stringify(mt.cot) !== JSON.stringify(g.maTran.cot)) vi.push('MA_TRAN_LECH: thu tu hang/cot dang luu khac thu tu tinh lai');

for (const [k, so] of Object.entries(g.meta?.nut ?? {})) {
  const that = g.nodes.filter((n) => n.kind === k).length;
  if (that !== so) vi.push(`THIEU_NUT: ${k} meta ${so} ve duoc ${that}`);
}
const soDv = g.nodes.filter((n) => n.kind === 'don_vi').length; const soNc = g.nodes.filter((n) => n.kind === 'nhu_cau').length;
if (g.maTran.hang.length !== soDv || g.maTran.cot.length !== soNc) vi.push(`THIEU_NUT: ma tran ${g.maTran.hang.length}x${g.maTran.cot.length}, can ${soDv}x${soNc}`);

// Ngan sach: do lai tu toa do DANG LUU (khong tin chiSo tu khai).
const P = new Map(g.nodes.filter((n) => n.kind !== 'nhom').map((n) => [n.id, [n.x, n.y]]));
const R = new Map(g.nodes.map((n) => [n.id, banKinhNut(n)]));
const coDu = cheo.every((e) => P.has(e.source) && P.has(e.target));
const giao = coDu ? demGiao(cheo, P) : NaN; const xuyen = coDu ? demXuyenNut(cheo, P, R) : NaN;
// Nhan chong nhau: do tu ham bo tri tinh lai; nhan dang luu da duoc doi chieu bang nhan tinh lai o tren.
for (const [k, v] of [['giaoCanh', giao], ['canhXuyenNut', xuyen], ['nhanChongNhau', a.chiSo.nhanChongNhau]]) {
  if (!Number.isFinite(v)) vi.push(`TOA_DO_HONG: khong do duoc ${k}`);
  else if (v > ns[k]) vi.push(`VUOT_NGAN_SACH: ${k} ${v} > ${ns[k]} (bo cuc xau di)`);
  else if (v < ns[k]) vi.push(`NGAN_SACH_CHUA_HA: ${k} con ${v} nhung ngan sach ${ns[k]}; ha so trong ${NGAN_SACH}`);
  if (g.boCuc.chiSo?.[k] !== v) vi.push(`CHI_SO_BIA: boCuc.chiSo.${k} ghi ${g.boCuc.chiSo?.[k]} nhung do lai ${v}`);
}

console.log(`nut: ${g.nodes.length} · canh cung-cau: ${cheo.length} · giao ${giao} · xuyen nut ${xuyen} · toa do lech: ${lech}`);
if (vi.length) {
  console.log(`\nFAIL: ${vi.length} vi pham`);
  vi.forEach((v) => console.log('  ' + v));
  process.exit(2);
}
console.log('\nOK: bo cuc tat dinh, khop ham bo tri va ma tran, du nut, trong ngan sach giao canh.');
