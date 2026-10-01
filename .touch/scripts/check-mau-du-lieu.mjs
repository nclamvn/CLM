#!/usr/bin/env node
/**
 * check-mau-du-lieu.mjs · Bang mau du lieu phai TRAM, DU TUONG PHAN va PHAN BIET DUOC ca voi nguoi
 * mu mau. Tinh lai tu ma mau moi lan chay, khong tin chu thich.
 *
 * VI SAO CO (01/10/2026): anh Lam cho phep mau tro lai, chi tren do hoa du lieu, voi dieu kien mau
 * tram va tin cay. "Tram" va "phan biet duoc" la hai yeu cau keo nguoc nhau: cang tram thi cang kho
 * tach. Cong nay giu ca hai bang con so, de lan sau ai sua mot mau cho "dep hon" ma lam hong mot
 * trong hai thi chuoi bao do ngay.
 *
 * CONG KIEM:
 *   THIEU_NHOM     lib/mau-du-lieu.mjs khong co dung 10 nhom 1..10.
 *   MAU_LECH       styles/mau-du-lieu.css khac lib/mau-du-lieu.mjs o bat ky --nhom-N nao.
 *   CHUA_NAP       app/layout.tsx khong nap styles/mau-du-lieu.css.
 *   TUONG_PHAN     tuong phan voi nen #0E0E0E, #141414, #1B1B1B duoi 3:1 (WCAG 2.2 muc 1.4.11).
 *   QUA_TUOI       do bao hoa OKLCH C > 0,092 (anh Lam: tram, khong tuoi).
 *   QUA_SANG       do sang OKLCH L > 0,805 (khong choi tren nen den).
 *   GAN_XAM        C < 0,048: nhin nhu chu xam cua giao dien, mat nghia ma hoa.
 *   KHO_PHAN_BIET  hai mau co khoang cach OKLab < 0,05 o mot trong bon kieu nhin (binh thuong, protan,
 *                  deutan, tritan theo Machado, Oliveira & Fernandes 2009, muc 1,0).
 *
 * Chay: node scripts/check-mau-du-lieu.mjs [--lib <mjs>] [--css <css>] [--layout <tsx>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const LIB = resolve(arg('--lib') || join(HERE, '..', 'lib', 'mau-du-lieu.mjs'));
const CSS = resolve(arg('--css') || join(HERE, '..', 'styles', 'mau-du-lieu.css'));
const LAYOUT = resolve(arg('--layout') || join(HERE, '..', 'app', 'layout.tsx'));
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
for (const f of [LIB, CSS, LAYOUT]) if (!existsSync(f)) thoat3(`thieu ${f}`);

let MAU;
try { ({ MAU_NHOM: MAU } = await import(pathToFileURL(LIB).href + `?t=${Date.now()}`)); } catch (e) { thoat3(`khong nap duoc ${LIB}: ${e.message}`); }
if (!MAU || typeof MAU !== 'object') thoat3('lib khong xuat MAU_NHOM');

const NGUONG = { tuongPhan: 3, cMax: 0.092, cMin: 0.048, lMax: 0.805, dMin: 0.05 };
const NEN = ['#0E0E0E', '#141414', '#1B1B1B'];
const s2l = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lin = (h) => rgb(h).map(s2l);
const lum = (h) => { const [r, g, b] = lin(h); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const tp = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const oklab = ([r, g, b]) => {
  let l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  let m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  let s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  [l, m, s] = [l, m, s].map(Math.cbrt);
  return [0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s];
};
// Machado, Oliveira & Fernandes (2009), ma tran muc nghiem trong 1,0, ap tren RGB tuyen tinh.
const MACHADO = {
  protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
  tritan: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]],
};
const nhin = (h, kieu) => {
  const v = lin(h);
  if (kieu === 'binh_thuong') return oklab(v);
  const M = MACHADO[kieu];
  return oklab(M.map((row) => Math.min(1, Math.max(0, row[0] * v[0] + row[1] * v[1] + row[2] * v[2]))));
};

const vi = [];
const khoa = Object.keys(MAU).map(Number).sort((a, b) => a - b);
if (khoa.join() !== '1,2,3,4,5,6,7,8,9,10') vi.push(`THIEU_NHOM: co ${khoa.join(',')}, can 1..10`);
for (const [k, h] of Object.entries(MAU)) if (!/^#[0-9A-Fa-f]{6}$/.test(h)) thoat3(`nhom ${k} co ma mau la "${h}"`);

const css = readFileSync(CSS, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
for (const [k, h] of Object.entries(MAU)) {
  const m = css.match(new RegExp(`--nhom-${k}\\s*:\\s*(#[0-9A-Fa-f]{6})\\s*;`));
  if (!m) vi.push(`MAU_LECH: css thieu --nhom-${k}`);
  else if (m[1].toUpperCase() !== h.toUpperCase()) vi.push(`MAU_LECH: --nhom-${k} css ${m[1]} khac lib ${h}`);
}
if (!/import\s+['"]@\/styles\/mau-du-lieu\.css['"]/.test(readFileSync(LAYOUT, 'utf8'))) vi.push('CHUA_NAP: app/layout.tsx khong nap styles/mau-du-lieu.css');

const dong = [];
for (const [k, h] of Object.entries(MAU)) {
  const [L, a, b] = oklab(lin(h)); const C = Math.hypot(a, b);
  const t = Math.min(...NEN.map((n) => tp(h, n)));
  if (t < NGUONG.tuongPhan) vi.push(`TUONG_PHAN: nhom ${k} ${h} chi ${t.toFixed(2)}:1 tren nen toi`);
  if (C > NGUONG.cMax) vi.push(`QUA_TUOI: nhom ${k} ${h} C=${C.toFixed(3)} > ${NGUONG.cMax}`);
  if (C < NGUONG.cMin) vi.push(`GAN_XAM: nhom ${k} ${h} C=${C.toFixed(3)} < ${NGUONG.cMin}`);
  if (L > NGUONG.lMax) vi.push(`QUA_SANG: nhom ${k} ${h} L=${L.toFixed(3)} > ${NGUONG.lMax}`);
  dong.push({ k, h, L, C, t });
}
let minKieu = {};
for (const kieu of ['binh_thuong', 'protan', 'deutan', 'tritan']) {
  let tot = { d: Infinity };
  const ks = Object.keys(MAU);
  for (let i = 0; i < ks.length; i++) for (let j = i + 1; j < ks.length; j++) {
    const p = nhin(MAU[ks[i]], kieu); const q = nhin(MAU[ks[j]], kieu);
    const d = Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]);
    if (d < tot.d) tot = { d, a: ks[i], b: ks[j] };
    if (d < NGUONG.dMin) vi.push(`KHO_PHAN_BIET: nhom ${ks[i]} va ${ks[j]} cach ${d.toFixed(3)} (${kieu})`);
  }
  minKieu[kieu] = tot;
}
console.log(`mau du lieu: ${dong.length} nhom · tuong phan nho nhat ${Math.min(...dong.map((x) => x.t)).toFixed(2)}:1 · C ${Math.min(...dong.map((x) => x.C)).toFixed(3)}..${Math.max(...dong.map((x) => x.C)).toFixed(3)} · L toi da ${Math.max(...dong.map((x) => x.L)).toFixed(3)}`);
console.log('khoang cach OKLab nho nhat: ' + Object.entries(minKieu).map(([k, v]) => `${k} ${v.d.toFixed(3)} (${v.a}-${v.b})`).join(' · '));
if (vi.length) {
  console.log(`\nFAIL: ${vi.length} vi pham`);
  vi.slice(0, 30).forEach((x) => console.log('  ' + x));
  process.exit(2);
}
console.log('\nOK: bang mau du lieu tram, du tuong phan, phan biet duoc o ca bon kieu nhin, css khop lib.');
