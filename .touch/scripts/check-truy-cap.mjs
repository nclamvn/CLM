#!/usr/bin/env node
/**
 * check-truy-cap.mjs · Bao cao truy cap (reports/truy_cap.json, do kiem-truy-cap.mjs ghi bang trinh
 * duyet that) phai MOI va SACH.
 *
 * CONG KIEM:
 *   VI_PHAM_TRUY_CAP  bao cao con vi pham axe tren mot trang nao do, hoac trang tra ve khong phai 200.
 *   THIEU_TRANG       bao cao thieu mot trang trong danh sach TRANG_KIEM.
 * KHONG CHAY DUOC (exit 3) khi chua co bao cao, hoac van tay giao dien hien tai khac van tay luc quet:
 * giao dien da doi ke tu lan quet, ket qua cu khong dung de ket luan. Cach xu: bash scripts/chup_man.sh
 * (buoc kiem truy cap chay kem) hoac node scripts/kiem-truy-cap.mjs <dia chi may chu dang chay>.
 *
 * Chay: node scripts/check-truy-cap.mjs [--touch <dir .touch>]     Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { vanTayGiaoDien, TRANG_KIEM } from './van-tay-giao-dien.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const TOUCH = resolve(arg('--touch') || join(HERE, '..'));
const P = join(TOUCH, 'reports', 'truy_cap.json');
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
if (!existsSync(P)) thoat3('chua co reports/truy_cap.json. Chay: bash scripts/chup_man.sh');
let bc;
try { bc = JSON.parse(readFileSync(P, 'utf8')); } catch (e) { thoat3(`truy_cap.json hong: ${e.message}`); }
const vt = vanTayGiaoDien(TOUCH);
if (bc.van_tay !== vt) thoat3(`giao dien da doi ke tu lan quet (${String(bc.luc).slice(0, 10)}): van tay luc quet ${bc.van_tay}, hien tai ${vt}. Chay: bash scripts/chup_man.sh`);
const vi = [];
for (const u of TRANG_KIEM) {
  const t = bc.trang?.[u];
  if (!t) { vi.push(`THIEU_TRANG: ${u}`); continue; }
  if (t.http !== 200) vi.push(`VI_PHAM_TRUY_CAP: ${u} tra ve ${t.http}`);
  for (const v of t.vi_pham ?? []) vi.push(`VI_PHAM_TRUY_CAP: ${u} ${v.id} x${v.so} (${(v.vi_du ?? [])[0] ?? ''})`);
}
console.log(`truy cap: ${TRANG_KIEM.length} trang · quet ${String(bc.luc).slice(0, 16)} · van tay ${vt} · ${vi.length} vi pham`);
if (vi.length) {
  console.log(`\nFAIL: ${vi.length} vi pham`);
  vi.slice(0, 30).forEach((v) => console.log('  ' + v));
  process.exit(2);
}
console.log('\nOK: moi trang sach chuan truy cap theo lan quet moi nhat, giao dien chua doi tu do.');
