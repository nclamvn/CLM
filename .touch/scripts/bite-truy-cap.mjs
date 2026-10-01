#!/usr/bin/env node
/**
 * bite-truy-cap.mjs · Rang cua check-truy-cap.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep app/, components/, styles/ va reports/truy_cap.json vao thu muc tam
 * (mkdtempSync), tiem loi vao BAN SAO. Khong sua file that.
 *
 * RANG
 * ====
 * RANG 1 · CANH SACH -> exit 0 (can bao cao that, moi, sach).
 * RANG 2 · sua mot dong CSS sau lan quet -> exit 3 KHONG CHAY DUOC (ket qua cu khong dung duoc), khong duoc 0.
 * RANG 3 · bao cao co mot vi pham nested-interactive -> VI_PHAM_TRUY_CAP.
 * RANG 4 · bao cao thieu trang /dashboard/registry -> THIEU_TRANG.
 * RANG 5 · xoa bao cao -> exit 3.
 * RANG 6 · bao cao co chu bi cat o 390px tren Bao cao -> TRAN_KHUNG.
 * RANG 7 · bao cao thieu phep do tran o 1440px cho mot trang -> THIEU_DO_TRAN.
 * RANG 8 · thuoc do tran khong qua tu kiem (mot mau khong can) -> THUOC_DO_HONG.
 *
 * Chay: node scripts/bite-truy-cap.mjs     Exit 0 moi rang can · 2 co rang khong can · 3 khong dung duoc canh.
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync, cpSync, mkdirSync, copyFileSync, existsSync, appendFileSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const CONG = join(HERE, 'check-truy-cap.mjs');
const BC = join(TOUCH, 'reports', 'truy_cap.json');
if (!existsSync(BC)) { console.log('KHONG CHAY DUOC: chua co reports/truy_cap.json de dung canh'); process.exit(3); }
const kq = []; const tam = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(62)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const canh = (sua) => {
  const t = mkdtempSync(join(tmpdir(), 'bite_truy_cap_')); tam.push(t);
  for (const d of ['app', 'components', 'styles']) cpSync(join(TOUCH, d), join(t, d), { recursive: true });
  mkdirSync(join(t, 'reports'), { recursive: true }); copyFileSync(BC, join(t, 'reports', 'truy_cap.json'));
  if (sua) sua(t);
  return t;
};
const doiBC = (f) => (t) => { const p = join(t, 'reports', 'truy_cap.json'); const x = JSON.parse(readFileSync(p, 'utf8')); f(x); writeFileSync(p, JSON.stringify(x)); };
const chay = (t) => { const r = spawnSync(process.execPath, [CONG, '--touch', t], { encoding: 'utf8' }); return { rc: r.status, out: r.stdout + r.stderr }; };
const rang = (nhan, sua, ma, ky) => { const r = chay(canh(sua)); inRa(nhan, r.rc === ma && (ky ? r.out.includes(ky) : true), `exit ${r.rc}`); };

let khongDung = false;
try {
  const s = chay(canh(null));
  if (s.rc === 3) { khongDung = true; console.log(`KHONG CHAY DUOC: canh sach khong dung duoc (bao cao cu hoac thieu).\n${s.out.trim().split('\n').pop()}`); }
  else {
    inRa('RANG 1 · canh sach -> exit 0', s.rc === 0, `exit ${s.rc}`);
    rang('RANG 2 · sua CSS sau lan quet -> exit 3', (t) => appendFileSync(join(t, 'styles', 'dashboard.css'), '\n.x { color: inherit; }\n'), 3, 'KHONG CHAY DUOC');
    rang('RANG 3 · bao cao co vi pham -> VI_PHAM_TRUY_CAP', doiBC((x) => { x.trang['/dashboard'].vi_pham = [{ id: 'nested-interactive', muc: 'serious', so: 1, vi_du: ['summary'] }]; }), 2, 'VI_PHAM_TRUY_CAP');
    rang('RANG 4 · thieu trang registry -> THIEU_TRANG', doiBC((x) => { delete x.trang['/dashboard/registry']; }), 2, 'THIEU_TRANG');
    rang('RANG 5 · xoa bao cao -> exit 3', (t) => unlinkSync(join(t, 'reports', 'truy_cap.json')), 3, 'KHONG CHAY DUOC');
    rang('RANG 6 · chu bi cat o 390px -> TRAN_KHUNG', doiBC((x) => { x.trang['/dashboard/bao-cao'].tran = { 1440: { so: 0, mau: [] }, 390: { so: 3, mau: [{ chu: 'Pham vi: 30 san pham', phai: 520 }] } }; }), 2, 'TRAN_KHUNG');
    rang('RANG 7 · thieu do tran 1440px -> THIEU_DO_TRAN', doiBC((x) => { delete x.trang['/dashboard'].tran?.[1440]; if (!x.trang['/dashboard'].tran) x.trang['/dashboard'].tran = { 390: { so: 0, mau: [] } }; }), 2, 'THIEU_DO_TRAN');
    rang('RANG 8 · thuoc do khong qua tu kiem -> THUOC_DO_HONG', doiBC((x) => { x.tu_kiem_tran = { tong: 5, can: 4, chi: [{ ten: 'loi Bao cao', ok: false }] }; }), 2, 'THUOC_DO_HONG');
  }
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
if (khongDung) process.exit(3);
const can = kq.filter(Boolean).length;
console.log(`\nBITE TRUY CAP: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
