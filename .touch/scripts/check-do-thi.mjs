#!/usr/bin/env node
/**
 * check-do-thi.mjs · Toa do do thi cung cau phai TAT DINH va khop voi du lieu.
 *
 * VI SAO CO (29/09/2026, pha P2a): man "Do thi cung cau" ve thang toa do da tinh luc build
 * trong lib/hub-graph.json. Neu ai sua tay mot toa do, hay ham bo tri dung Math.random, trang se
 * ra hinh khac o moi may, va anh moc so sanh se lech ma khong ro vi sao. Cong nay tinh lai toa
 * do bang CHINH ham giao dien dung (lib/do-thi-layout.mjs) va doi chieu tung nut.
 *
 * KIEM:
 *   1. Moi nut co x, y huu han trong [0, 1].
 *   2. Tinh lai hai lan phai ra y nhu nhau (tat dinh), va y nhu toa do dang luu.
 *   3. So nut theo loai khop meta.nut (khong nut nao bi rot khoi hinh).
 *
 * Chay: node scripts/check-do-thi.mjs [--lib <dir>] [--mo-dun <do-thi-layout.mjs>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const LIB = arg('--lib') || join(HERE, '..', 'lib');
const MO_DUN = resolve(arg('--mo-dun') || join(HERE, '..', 'lib', 'do-thi-layout.mjs'));
const p = join(LIB, 'hub-graph.json');
if (!existsSync(p)) { console.log(`KHONG CHAY DUOC: thieu ${p}`); process.exit(3); }
if (!existsSync(MO_DUN)) { console.log(`KHONG CHAY DUOC: thieu ${MO_DUN}`); process.exit(3); }
const { boTri } = await import(pathToFileURL(MO_DUN).href);
const g = JSON.parse(readFileSync(p, 'utf8'));
if (!g.nodes?.length) { console.log('KHONG CHAY DUOC: do thi khong co nut nao.'); process.exit(3); }

const vi = [];
for (const n of g.nodes) {
  if (!Number.isFinite(n.x) || !Number.isFinite(n.y) || n.x < 0 || n.x > 1 || n.y < 0 || n.y > 1) {
    vi.push(`TOA_DO_HONG: ${n.id} (${n.x}, ${n.y})`);
  }
}
const sach = g.nodes.map(({ x, y, ...con }) => con); // bo toa do cu truoc khi tinh lai
const a = boTri(sach, g.edges);
const b = boTri(sach, g.edges);
if (JSON.stringify(a) !== JSON.stringify(b)) vi.push('KHONG_TAT_DINH: tinh hai lan ra hai hinh khac nhau');
const moi = new Map(a.map((q) => [q.id, q]));
let lech = 0;
for (const n of g.nodes) {
  const q = moi.get(n.id);
  if (!q || q.x !== n.x || q.y !== n.y) { lech++; if (lech <= 5) vi.push(`TOA_DO_LECH: ${n.id} luu (${n.x}, ${n.y}) tinh lai (${q?.x}, ${q?.y})`); }
}
if (lech > 5) vi.push(`... va ${lech - 5} nut lech khac`);
for (const [k, so] of Object.entries(g.meta?.nut ?? {})) {
  const that = g.nodes.filter((n) => n.kind === k).length;
  if (that !== so) vi.push(`THIEU_NUT: ${k} meta ${so} ve duoc ${that}`);
}

console.log(`nut: ${g.nodes.length} · canh: ${g.edges.length} · toa do lech: ${lech}`);
if (vi.length) {
  console.log(`\nFAIL: ${vi.length} vi pham`);
  vi.forEach((v) => console.log('  ' + v));
  process.exit(2);
}
console.log('\nOK: toa do do thi tat dinh, khop voi ham bo tri, du nut.');
