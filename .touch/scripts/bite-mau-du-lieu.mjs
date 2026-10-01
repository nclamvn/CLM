#!/usr/bin/env node
/**
 * bite-mau-du-lieu.mjs · Rang cua check-mau-du-lieu.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep lib/mau-du-lieu.mjs, styles/mau-du-lieu.css, app/layout.tsx vao thu muc tam
 * (mkdtempSync), tiem loi vao BAN SAO. Khong sua file that.
 *
 * RANG
 * ====
 * RANG 1 · CANH SACH -> exit 0.
 * RANG 2 · css --nhom-4 lech lib mot ky tu -> MAU_LECH.
 * RANG 3 · layout khong nap mau-du-lieu.css -> CHUA_NAP.
 * RANG 4 · nhom 7 doi sang do tuoi #E0303C -> QUA_TUOI.
 * RANG 5 · nhom 2 doi sang xam #9A9A98 -> GAN_XAM.
 * RANG 6 · nhom 1 doi ve indigo goc cua Tol #332288 (lam cho nen trang) -> TUONG_PHAN.
 * RANG 7 · nhom 10 doi sang kem rat sang #F2EDC8 -> QUA_SANG.
 * RANG 8 · nhom 8 doi gan trung nhom 4 -> KHO_PHAN_BIET.
 * RANG 9 · xoa nhom 10 -> THIEU_NHOM.
 * RANG 10 · lib hong cu phap -> exit 3, khong duoc bao xanh.
 *
 * Chay: node scripts/bite-mau-du-lieu.mjs     Exit 0 moi rang can · 2 co rang khong can.
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const CONG = join(HERE, 'check-mau-du-lieu.mjs');
const kq = []; const tam = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(62)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const TEP = { lib: ['lib', 'mau-du-lieu.mjs'], css: ['styles', 'mau-du-lieu.css'], layout: ['app', 'layout.tsx'] };
const canh = (sua) => {
  const t = mkdtempSync(join(tmpdir(), 'bite_mau_')); tam.push(t);
  for (const [, [d, f]] of Object.entries(TEP)) { mkdirSync(join(t, d), { recursive: true }); copyFileSync(join(TOUCH, d, f), join(t, d, f)); }
  if (sua) sua(t);
  return t;
};
const doi = (t, k, f) => {
  const p = join(t, ...TEP[k]); const cu = readFileSync(p, 'utf8'); const moi = f(cu);
  if (moi === cu) throw new Error(`KHONG TIEM DUOC vao ${k}`);
  writeFileSync(p, moi);
};
const doiMau = (so, hex) => (t) => {
  doi(t, 'lib', (s) => s.replace(new RegExp(`(\\n  ${so}: ')#[0-9A-Fa-f]{6}'`), `$1${hex}'`));
  doi(t, 'css', (s) => s.replace(new RegExp(`(--nhom-${so}: )#[0-9A-Fa-f]{6};`), `$1${hex};`));
};
const chay = (t) => {
  const r = spawnSync(process.execPath, [CONG, '--lib', join(t, ...TEP.lib), '--css', join(t, ...TEP.css), '--layout', join(t, ...TEP.layout)], { encoding: 'utf8' });
  return { rc: r.status, out: r.stdout + r.stderr };
};
const rang = (nhan, sua, ma, ky) => {
  let r; try { r = chay(canh(sua)); } catch (e) { inRa(nhan, false, e.message); return; }
  inRa(nhan, r.rc === ma && (ky ? r.out.includes(ky) : true), `exit ${r.rc}`);
};

try {
  rang('RANG 1 · canh sach -> exit 0', null, 0, 'OK:');
  rang('RANG 2 · css lech lib -> MAU_LECH', (t) => doi(t, 'css', (s) => s.replace(/(--nhom-4: #[0-9A-Fa-f]{5})[0-9A-Fa-f]/, (m, a) => a + (m.endsWith('9') ? '8' : '9'))), 2, 'MAU_LECH');
  rang('RANG 3 · layout khong nap css -> CHUA_NAP', (t) => doi(t, 'layout', (s) => s.replace("import '@/styles/mau-du-lieu.css';\n", '')), 2, 'CHUA_NAP');
  rang('RANG 4 · nhom 7 do tuoi -> QUA_TUOI', doiMau(7, '#E0303C'), 2, 'QUA_TUOI');
  rang('RANG 5 · nhom 2 xam -> GAN_XAM', doiMau(2, '#9A9A98'), 2, 'GAN_XAM');
  rang('RANG 6 · nhom 1 indigo goc Tol -> TUONG_PHAN', doiMau(1, '#332288'), 2, 'TUONG_PHAN');
  rang('RANG 7 · nhom 10 kem rat sang -> QUA_SANG', doiMau(10, '#F2EDC8'), 2, 'QUA_SANG');
  rang('RANG 8 · nhom 8 gan trung nhom 4 -> KHO_PHAN_BIET', doiMau(8, '#86BB8A'), 2, 'KHO_PHAN_BIET');
  rang('RANG 9 · xoa nhom 10 -> THIEU_NHOM', (t) => doi(t, 'lib', (s) => s.replace(/\n  10: '#[0-9A-Fa-f]{6}',[^\n]*/, '')), 2, 'THIEU_NHOM');
  rang('RANG 10 · lib hong cu phap -> exit 3', (t) => doi(t, 'lib', (s) => s.replace('export const MAU_NHOM = {', 'export const MAU_NHOM = {{')), 3, 'KHONG CHAY DUOC');
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE MAU DU LIEU: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
