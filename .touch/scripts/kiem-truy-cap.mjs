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
 * TU 01/10/2026 quet them TRAN KHUNG (scripts/do-tran.mjs) o 1440px va 390px: chu bi cat o mep
 * man hinh. Truoc khi do, phep do tu kiem tren cac mau dung san (MAU_TU_KIEM), ket qua ghi vao
 * bao cao de check-truy-cap.mjs doi: thuoc do khong can thi ket qua do khong dung duoc.
 *
 * Chay: node scripts/kiem-truy-cap.mjs http://localhost:<cong>
 * Bien moi truong tuy chon: CHROMIUM (duong dan trinh duyet).
 */
import { writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { vanTayGiaoDien, TRANG_KIEM } from './van-tay-giao-dien.mjs';
import { doTran, MAU_TU_KIEM } from './do-tran.mjs';

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
let tong = 0; let tongTran = 0;
const tuKiem = { tong: MAU_TU_KIEM.length, can: 0, chi: [] };
try {
  // Tu kiem thuoc do tran truoc: moi mau phai cho dung so mong doi.
  for (const m of MAU_TU_KIEM) {
    const ctx = await br.newContext({ viewport: { width: 390, height: 800 } });
    const pg = await ctx.newPage();
    await pg.setContent(m.html);
    const d = await pg.evaluate(doTran);
    const ok = m.mong === '0' ? d.so === 0 : d.so > 0;
    if (ok) tuKiem.can++;
    tuKiem.chi.push({ ten: m.ten, mong: m.mong, do: d.so, ok });
    console.log(`TU KIEM TRAN ${ok ? 'CAN' : 'KHONG CAN'} · ${m.ten} (mong ${m.mong}, do ${d.so})`);
    await ctx.close();
  }
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
    const tran = { 1440: await pg.evaluate(doTran) };
    await ctx.close();
    const ctxH = await br.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    const pgH = await ctxH.newPage();
    await pgH.goto(goc + u, { waitUntil: 'networkidle' });
    await pgH.waitForTimeout(500);
    tran[390] = await pgH.evaluate(doTran);
    await ctxH.close();
    ketQua[u] = { http: r?.status() ?? null, vi_pham: vp, tran };
    tong += vp.reduce((s, v) => s + v.so, 0);
    tongTran += tran[1440].so + tran[390].so;
    const tt = tran[1440].so + tran[390].so ? ` · TRAN 1440:${tran[1440].so} 390:${tran[390].so}` : '';
    console.log(`${String(r?.status()).padEnd(4)} ${u.padEnd(46)} ${vp.length ? vp.map((v) => `${v.id}:${v.so}`).join(' ') : 'sach'}${tt}`);
  }
} finally {
  await br.close();
}
mkdirSync(join(TOUCH, 'reports'), { recursive: true });
writeFileSync(join(TOUCH, 'reports', 'truy_cap.json'), JSON.stringify({
  van_tay: vanTayGiaoDien(TOUCH), luc: new Date().toISOString(), cong_cu: 'axe-core', tu_kiem_tran: tuKiem, trang: ketQua,
}, null, 1) + '\n');
console.log(`\nTRUY CAP: ${TRANG_KIEM.length} trang · ${tong} vi pham · ${tongTran} doan chu tran khung · tu kiem tran ${tuKiem.can}/${tuKiem.tong} · ghi reports/truy_cap.json`);
process.exit(tong || tongTran || tuKiem.can !== tuKiem.tong ? 2 : 0);
