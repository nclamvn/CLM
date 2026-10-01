#!/usr/bin/env node
/**
 * kiem-truy-cap.mjs · Quet chuan truy cap (axe-core, WCAG 2.2 A/AA + best-practice) tren MOI trang
 * dang chay, ghi reports/truy_cap.json kem van tay ma nguon giao dien. Can trinh duyet that, nen
 * chay tren may co Chromium (scripts/chup_man.sh goi buoc nay); chuoi cong chi DOC bao cao qua
 * check-truy-cap.mjs.
 *
 * VI SAO CO (01/10/2026, nghiem thu enterprise): 7/11 trang thieu tieu de cap 1, Registry co 60
 * dieu khien long nhau va 60 vung bam duoi 24px, danh sach Ho so co 60 thuoc tinh ARIA sai. Ben mua
 * la co quan nha nuoc hay doi tac quoc te thuong kiem WCAG.
 *
 * Chay: node scripts/kiem-truy-cap.mjs http://localhost:<cong>
 * Bien moi truong tuy chon: CHROMIUM (duong dan trinh duyet).
 */
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { vanTayGiaoDien, TRANG_KIEM } from './van-tay-giao-dien.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const goc = process.argv[2];
if (!goc) { console.log('KHONG CHAY DUOC: thieu dia chi may chu, vd http://localhost:3000'); process.exit(3); }
const require = createRequire(import.meta.url);
let chromium; let axeNguon;
try {
  ({ chromium } = await import('playwright'));
  axeNguon = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
} catch (e) { console.log(`KHONG CHAY DUOC: thieu playwright hoac axe-core (${e.message})`); process.exit(3); }

const br = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
const ketQua = {};
let tong = 0;
try {
  for (const u of TRANG_KIEM) {
    const ctx = await br.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
    const pg = await ctx.newPage();
    const r = await pg.goto(goc + u, { waitUntil: 'networkidle' });
    await pg.waitForTimeout(500);
    await pg.addScriptTag({ content: axeNguon });
    const vp = await pg.evaluate(async () => {
      // eslint-disable-next-line no-undef
      const kq = await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice'] });
      return kq.violations.map((v) => ({ id: v.id, muc: v.impact, so: v.nodes.length, vi_du: v.nodes.slice(0, 3).map((n) => n.target.join(' ')) }));
    });
    ketQua[u] = { http: r?.status() ?? null, vi_pham: vp };
    tong += vp.reduce((s, v) => s + v.so, 0);
    console.log(`${String(r?.status()).padEnd(4)} ${u.padEnd(46)} ${vp.length ? vp.map((v) => `${v.id}:${v.so}`).join(' ') : 'sach'}`);
    await ctx.close();
  }
} finally {
  await br.close();
}
mkdirSync(join(TOUCH, 'reports'), { recursive: true });
writeFileSync(join(TOUCH, 'reports', 'truy_cap.json'), JSON.stringify({
  van_tay: vanTayGiaoDien(TOUCH), luc: new Date().toISOString(), cong_cu: 'axe-core', trang: ketQua,
}, null, 1) + '\n');
console.log(`\nTRUY CAP: ${TRANG_KIEM.length} trang · ${tong} vi pham · ghi reports/truy_cap.json`);
process.exit(tong ? 2 : 0);
