#!/usr/bin/env node
/**
 * check-lich-su-lo.mjs · Bang lich su duyet lo tren trang Phuong phap phai dung voi thu muc lo.
 *
 * VI SAO CO (25/10/2026): bang nay la bang chung "may khong tu nap du lieu" truoc nha dau tu. Bang
 * do ma sai (ghi da nap mot lo chua duyet, sua loi duyet cho gon) thi no noi dieu nguoc lai.
 *
 * CONG KIEM:
 *   LO_LECH          lib/hub-lo.json khac ban tinh lai tu CNCLData/lam_giau/dot_*.
 *   NAP_KHONG_DUYET  mot lo co da_nap.json ma khong co duyet.json.
 *   DUYET_THIEU_LOI  duyet.json thieu ten nguoi duyet, ngay, hoac loi duyet nguyen van.
 *   NAP_VUOT         so dong nap lon hon so dong de xuat.
 *   TRANG_KHONG_DOC  trang Phuong phap khong doc lib/hub-lo.json.
 *
 * Chay: node scripts/check-lich-su-lo.mjs [--lib <dir>] [--lam-giau <dir>] [--trang <page.tsx>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { goc } from './goc.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const LIB = arg('--lib') || join(TOUCH, 'lib');
const CNCL = process.env.CLM_KHO_CNCL || goc('CNCLData');
const LG = arg('--lam-giau') || (CNCL ? join(CNCL, 'lam_giau') : null);
const TRANG = arg('--trang') || join(TOUCH, 'components', 'phuongphap', 'KienTruc.tsx');
const PAGE = arg('--page') || join(TOUCH, 'app', 'dashboard', 'phuong-phap', 'page.tsx');
const MO_DUN = arg('--mo-dun') || join(TOUCH, 'lib', 'lich-su-lo.mjs');
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
if (!LG || !existsSync(LG)) thoat3(`khong thay thu muc lam_giau (${LG})`);
if (!existsSync(TRANG) || !existsSync(PAGE)) thoat3(`thieu ${TRANG} hoac ${PAGE}`);
const HUB = join(LIB, 'hub-lo.json');
if (!existsSync(HUB)) thoat3(`thieu ${HUB}. Chay gen-cncl-data.mjs.`);
const { dungLichSuLo } = await import(pathToFileURL(MO_DUN).href);
const h = JSON.parse(readFileSync(HUB, 'utf8'));
const vi = [];
const lai = dungLichSuLo(LG);
if (JSON.stringify(lai) !== JSON.stringify(h)) vi.push('LO_LECH: hub-lo.json khac ban tinh lai tu thu muc lo');
if (!lai.lo.length) thoat3('khong co lo nao. Rong khong phai sach.');
for (const l of lai.lo) {
  const coNap = existsSync(join(LG, l.dot, 'da_nap.json'));
  const coDuyet = existsSync(join(LG, l.dot, 'duyet.json'));
  if (coNap && !coDuyet) vi.push(`NAP_KHONG_DUYET: ${l.dot} co da_nap.json ma khong co duyet.json`);
  if (l.duyet && (!l.duyet.nguoi || !l.duyet.ngay || !l.duyet.loi)) vi.push(`DUYET_THIEU_LOI: ${l.dot} duyet thieu ${!l.duyet.nguoi ? 'nguoi' : !l.duyet.ngay ? 'ngay' : 'loi duyet'}`);
  if (l.nap && l.nap.soDong > l.deXuat) vi.push(`NAP_VUOT: ${l.dot} nap ${l.nap.soDong} dong tren ${l.deXuat} de xuat`);
}
if (!/from '@\/lib\/hub-lo\.json'/.test(readFileSync(TRANG, 'utf8'))) vi.push('TRANG_KHONG_DOC: khoi Phuong phap khong doc lib/hub-lo.json');
if (!/<LichSuLo\b/.test(readFileSync(PAGE, 'utf8'))) vi.push('TRANG_KHONG_DOC: trang Phuong phap khong hien <LichSuLo />');
console.log(`lich su lo: ${lai.lo.length} lo · ${lai.lo.filter((l) => l.trangThai === 'da_nap').length} da nap`);
if (vi.length) { console.log(`\nFAIL: ${vi.length} vi pham`); vi.forEach((v) => console.log('  ' + v)); process.exit(2); }
console.log('\nOK: lich su lo dung thu muc lo, lo nao nap cung co nguoi duyet va loi duyet nguyen van.');
