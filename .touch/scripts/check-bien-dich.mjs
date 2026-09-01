/**
 * check-bien-dich.mjs · Cong kiem TypeScript BIEN DICH DUOC. TIP-01.
 *
 * VI SAO CO (25/08/2026): `lib/cncl-registry.ts` va `lib/cncl-match.ts` do may sinh. Cong
 * check-lib-song-sinh chung minh phan THAN JSON trong hai file do khop voi ban .json, nhung
 * PHAN VO TypeScript thi chua ai kiem. Mot file .ts hong cu phap ma JSON van khop se qua duoc
 * ca 32 o, va chuyen do chi lo ra vao lan chup anh ke tiep, tuc co the vai ngay sau khi hong.
 *
 * BA TRANG THAI, khong phai hai:
 *   0  bien dich sach
 *   2  co loi kieu hoac loi cu phap
 *   3  KHONG CHAY DUOC: thieu node_modules hoac thieu tsc
 *
 * Trang thai 3 la phan quan trong. Mot cong khong chay duoc ma tra 0 se bao "sach" tren mot
 * moi truong chua cai gi ca, va do dung la kieu noi doi ma ca chuoi cong nay duoc dung de
 * tranh: vang tin khong phai tin tot.
 *
 * Chay: node scripts/check-bien-dich.mjs
 */
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const env = (t) => (process.env[t] || '').trim() || null;
const TOUCH = env('CLM_KHO_TOUCH') || dirname(dirname(fileURLToPath(import.meta.url)));

const tsc = join(TOUCH, 'node_modules', '.bin', 'tsc');
if (!existsSync(join(TOUCH, 'node_modules'))) {
  console.log('KHONG CHAY DUOC: chua co node_modules. Chay npm install truoc.');
  process.exit(3);
}
if (!existsSync(tsc)) {
  console.log('KHONG CHAY DUOC: khong thay node_modules/.bin/tsc.');
  process.exit(3);
}
if (!existsSync(join(TOUCH, 'tsconfig.json'))) {
  console.log('KHONG CHAY DUOC: khong thay tsconfig.json.');
  process.exit(3);
}

const t0 = Date.now();
const r = spawnSync(tsc, ['--noEmit', '--pretty', 'false'], { cwd: TOUCH, encoding: 'utf8' });
const giay = ((Date.now() - t0) / 1000).toFixed(1);

if (r.error) {
  console.log(`KHONG CHAY DUOC: khong chay duoc tsc: ${r.error.message}`);
  process.exit(3);
}

const ra = ((r.stdout || '') + (r.stderr || '')).trim();
// tsc in loi dang "duong/dan.ts(12,5): error TS1005: ...". Dem theo mau do de bao so cu the
// thay vi bao "co loi", va de phan biet loi that voi cac dong nhieu cua npm.
const dong = ra.split('\n').filter((l) => /\(\d+,\d+\): error TS\d+/.test(l));

if (r.status !== 0 || dong.length) {
  console.log(`FAIL: ${dong.length || '?'} loi TypeScript · ${giay}s`);
  for (const l of dong.slice(0, 20)) console.log('  ' + l);
  if (dong.length > 20) console.log(`  ... con ${dong.length - 20} loi nua`);
  if (!dong.length && ra) console.log(ra.slice(-800));
  process.exit(2);
}

console.log(`OK: TypeScript bien dich sach · ${giay}s`);
