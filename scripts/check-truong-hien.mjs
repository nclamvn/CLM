/**
 * check-truong-hien.mjs · Cong bat TRUONG CO DU LIEU MA TRANG WEB BO ROI.
 *
 * VI SAO CO (24/08/2026): truong `nang_luc_mo_ta_2` nam trong registry tu 16/08. The tren web
 * chi hien `nang_luc_mo_ta`. Voi FECON, dong duy nhat hien ra la "don vi truc tiep van hanh
 * robot dao ngam (TBM)", dung cai ve ma domain.yaml xep vao KHONG DU DIEU KIEN, con ly do
 * giu FECON thi nam o truong bi bo. Trang doc troi chay va noi sai.
 *
 * CA 25 CONG DEU XANH hom do. Vi ca 25 deu soi TINH TOAN VEN DU LIEU: span co dung ban chup
 * khong, value co vuot span khong, nguon con tuoi khong, chu ky con phu khong. Khong cong nao
 * hoi cau khac han: CAI GI TRONG REGISTRY MA TRANG WEB KHONG NOI RA.
 *
 * CAI BAY PHAI TRANH: mot cong kieu "moi truong deu phai co mat trong lib/*.ts" se XANH ngay
 * hom qua, vi mang `evidence[]` von cho HET moi claim ra web. Truong khong bi mat, no chi
 * khong duoc TOM TAT. Cong do se la mot cai den xanh vo dung. Nen cong nay do o hai muc:
 * co mat trong bang bang chung la mot chuyen, len duoc dong tom tat cua the la chuyen khac.
 *
 * FAIL-CLOSED: truong khong khai bao trong truong_hien_thi.json thi cong DO ngay. Them mot
 * truong phu moi la phai tra loi cau "no hien o dau", khong duoc im lang troi qua.
 *
 * Lop `chua_hien` la mon no da ghi nhan, khoa mot chieu trong ngan_sach_truong_chua_hien.txt.
 *
 * Chay: node scripts/check-truong-hien.mjs
 * Exit 0 sach · 2 co truong chua tra loi hoac ngan sach lech · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { goc } from './goc.mjs';

// BAN LAM VIEC TAM: CLM_KHO_* tro toi ban sao cua kho, giong gen-cncl-data.mjs. Rang cua
// cong nay tiem loi vao ban sao chu khong bao gio cham kho that.
const env = (t) => (process.env[t] || '').trim() || null;
const TOUCH = env('CLM_KHO_TOUCH') || dirname(dirname(fileURLToPath(import.meta.url)));
const KHAI = join(TOUCH, 'scripts', 'truong_hien_thi.json');
const NGAN_SACH = join(TOUCH, 'scripts', 'ngan_sach_truong_chua_hien.txt');

function thoat(ma, ...d) { console.log(...d); process.exit(ma); }

const cncl = env('CLM_KHO_CNCL')
  ? join(env('CLM_KHO_CNCL'), 'domains', 'don_vi_cncl', 'claims.jsonl')
  : goc('CNCLData', 'domains', 'don_vi_cncl', 'claims.jsonl');
if (!cncl) thoat(3, 'KHONG CHAY DUOC: khong thay CNCLData/domains/don_vi_cncl/claims.jsonl');
if (!existsSync(KHAI)) thoat(3, 'KHONG CHAY DUOC: thieu scripts/truong_hien_thi.json');

const claims = readFileSync(cncl, 'utf8').split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l));
const dem = new Map();
for (const c of claims) dem.set(c.field, (dem.get(c.field) ?? 0) + 1);

const khai = JSON.parse(readFileSync(KHAI, 'utf8'));
const lopCua = (f) => (f.startsWith('_') ? null : khai[f] ?? null);

// Du lieu sinh ra. Doc bang regex JSON trong file .ts vi day la file SINH RA, cau truc co dinh.
const libP = join(TOUCH, 'lib', 'cncl-registry.ts');
if (!existsSync(libP)) thoat(3, 'KHONG CHAY DUOC: chua sinh lib/cncl-registry.ts');
const lib = readFileSync(libP, 'utf8');
const m = lib.match(/export const cnclUnits(?::\s*CnclUnit\[\])?\s*=\s*(\[[\s\S]*?\n\]);/);
if (!m) thoat(3, 'KHONG CHAY DUOC: khong doc duoc mang cnclUnits trong lib/cncl-registry.ts');
const units = JSON.parse(m[1]);

// Component nao that su DOC khoa do. Chi co du lieu ma khong ai render thi van la bi bo.
const tsx = [];
for (const thuMuc of ['components', 'app']) {
  const d = join(TOUCH, thuMuc);
  const di = (p) => { for (const e of readdirSync(p, { withFileTypes: true })) {
    const q = join(p, e.name);
    if (e.isDirectory()) di(q); else if (e.name.endsWith('.tsx')) tsx.push(readFileSync(q, 'utf8'));
  } };
  if (existsSync(d)) di(d);
}
const coRender = (khoa) => tsx.some((t) => new RegExp(`\\.${khoa}\\b`).test(t));

const chuaKhai = [], khongLenTomTat = [], khongCoTrongBang = [], chuaHien = [], thieuLyDo = [];

for (const [f, n] of [...dem].sort()) {
  const k = lopCua(f);
  if (!k) { chuaKhai.push([f, n]); continue; }
  if (k.lop === 'tom_tat') {
    const ai = claims.filter((c) => c.field === f).map((c) => c.entity);
    const co = units.filter((u) => ai.includes(u.name)).some((u) => {
      const v = u[k.khoa];
      return Array.isArray(v) ? v.length > 0 : Boolean(v);
    });
    if (!co) khongLenTomTat.push([f, k.khoa, 'khoa rong trong du lieu sinh ra']);
    else if (!coRender(k.khoa)) khongLenTomTat.push([f, k.khoa, 'co du lieu nhung KHONG component nao doc']);
  } else if (k.lop === 'bang') {
    const co = units.some((u) => (u.evidence ?? []).some((e) => e.field === f));
    if (!co) khongCoTrongBang.push([f, n]);
  } else if (k.lop === 'chua_hien') {
    chuaHien.push([f, n]);
    if (!k.ly_do) thieuLyDo.push(f);
  } else {
    chuaKhai.push([f, n]);
  }
}

console.log(`truong trong registry: ${dem.size} · da khai bao: ${dem.size - chuaKhai.length} · chua hien: ${chuaHien.length}`);

let ma = 0;
if (chuaKhai.length) {
  console.log(`\nTRUONG CHUA KHAI BAO (${chuaKhai.length}), cong DO vi khong duoc doan gium:`);
  for (const [f, n] of chuaKhai) console.log(`  ${f.padEnd(24)} · ${n} claim`);
  console.log('Them mot dong vao scripts/truong_hien_thi.json: tom_tat, bang, hoac chua_hien kem ly do.');
  ma = 2;
}
if (khongLenTomTat.length) {
  console.log(`\nKHAI LA tom_tat NHUNG KHONG LEN THE (${khongLenTomTat.length}):`);
  for (const [f, khoa, vi] of khongLenTomTat) console.log(`  ${f.padEnd(24)} · khoa ${khoa} · ${vi}`);
  ma = 2;
}
if (khongCoTrongBang.length) {
  console.log(`\nKHAI LA bang NHUNG KHONG CO TRONG BANG BANG CHUNG (${khongCoTrongBang.length}):`);
  for (const [f, n] of khongCoTrongBang) console.log(`  ${f.padEnd(24)} · ${n} claim`);
  ma = 2;
}
if (thieuLyDo.length) {
  console.log(`\nLOP chua_hien MA THIEU LY DO (${thieuLyDo.length}): ${thieuLyDo.join(', ')}`);
  console.log('Mon no khong ghi ly do thi lan sau khong ai biet vi sao no o day.');
  ma = 2;
}

// Khoa mot chieu cho mon no chua_hien: duoc giam, khong duoc tang, va giam thi phai chot lai.
if (existsSync(NGAN_SACH)) {
  const ns = Number(readFileSync(NGAN_SACH, 'utf8').split('\n')[0].trim());
  console.log(`\nngan sach chua_hien: ${ns} · thuc te: ${chuaHien.length}` +
    (chuaHien.length ? ` (${chuaHien.map(([f]) => f).join(', ')})` : ''));
  if (chuaHien.length > ns) {
    console.log('FAIL: TANG so truong co du lieu ma web khong noi ra. Day la mon no moi.');
    ma = 2;
  } else if (chuaHien.length < ns) {
    console.log(`FAIL(TOT): GIAM duoc. Sua ${NGAN_SACH} thanh ${chuaHien.length} de chot muc moi.`);
    console.log('Giam ma khong chot lai thi khoa dung yen va het siet.');
    ma = 2;
  }
} else {
  console.log('\nKHONG CHAY DUOC: thieu ngan_sach_truong_chua_hien.txt');
  process.exit(3);
}

if (ma === 0) console.log('\nOK: moi truong deu da tra loi cau "no hien o dau".');
process.exit(ma);
