#!/usr/bin/env node
/**
 * chup_xem.mjs · Chup anh XEM (khong phai anh moc) cac trang vua sua, de nguoi va Claude nhin
 * tan mat. Ghi reports/xem/<ten>_<rong>.png. Khong so voi moc, khong la cong.
 *
 * VI SAO CO (01/10/2026): sandbox cua Claude tai trinh duyet qua cham (187 MB), nen buoc soi
 * giao dien bang mat chay tren may that, cung luot voi chup_man.sh.
 *
 * Chay: node scripts/chup_xem.mjs <goc_url>
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, '..', 'reports', 'xem');
const goc = process.argv[2];
if (!goc) { console.log('KHONG CHAY DUOC: thieu <goc_url>'); process.exit(3); }
const TRANG = [
  ['hoi_dap_uav', '/dashboard/hoi-dap?q=' + encodeURIComponent('Ai làm được UAV?')],
  ['hoi_dap_tu_choi', '/dashboard/hoi-dap?q=' + encodeURIComponent('máy bay chở khách')],
  ['tong_quan', '/dashboard'],
];
mkdirSync(OUT, { recursive: true });
const br = await chromium.launch();
for (const [ten, duong] of TRANG) {
  for (const rong of [1440, 390]) {
    const pg = await br.newPage({ viewport: { width: rong, height: 900 }, reducedMotion: 'reduce' });
    await pg.goto(goc + duong, { waitUntil: 'networkidle' });
    await pg.waitForTimeout(400);
    await pg.screenshot({ path: join(OUT, `${ten}_${rong}.png`), fullPage: true });
    await pg.close();
  }
}
await br.close();
console.log(`CHUP XEM: ${TRANG.length * 2} anh trong reports/xem/`);
