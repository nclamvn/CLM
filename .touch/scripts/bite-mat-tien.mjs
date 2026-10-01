#!/usr/bin/env node
/**
 * bite-mat-tien.mjs · Rang cua check-mat-tien.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep app/page.tsx, app/hub/page.tsx, app/layout.tsx, lib/content.ts,
 * lib/mat-tien.ts, components/landing/*.tsx, components/dash/DashSidebar.tsx + DashTopBar.tsx,
 * styles/landing-hub.css, styles/touch-unify.css vao thu muc tam (mkdtempSync), tiem loi vao BAN SAO.
 * Khong sua file that.
 *
 * RANG
 * ====
 * RANG 1  · CANH SACH -> exit 0.
 * RANG 2  · trang dau ghi lai "Match thật · chưa chạy" -> TRANG_THAI_GO_TAY.
 * RANG 3  · trang dau them lai link toi /hub (du lieu minh hoa da go) -> CON_DEMO.
 * RANG 4  · o HUD ghi cung <dd>44</dd> -> SO_KHONG_SINH.
 * RANG 5  · lib/mat-tien gan cung daKy: 11 -> SO_KHONG_SINH.
 * RANG 6  · trang dau bo dungMatTien -> SO_KHONG_SINH.
 * RANG 7  · app/hub/page.tsx khong con chuyen huong ve dashboard -> CON_DEMO.
 * RANG 8  · trang dau thanh trang cuon (.mt bo overflow hidden) -> KHONG_MOT_MAN.
 * RANG 9  · layout bo nap touch-unify.css -> MAU_KHONG_THONG_NHAT.
 * RANG 10 · Hub quay ve do cu (--dk-rd: #C40F0F) -> MAU_KHONG_THONG_NHAT.
 * RANG 11 · thanh ben ghi lai "Solo Entrepreneur" -> TRANG_THAI_GO_TAY.
 * RANG 12 · KHONG BAO OAN: chu thich nhac lai "chưa chạy" -> van exit 0.
 * RANG 13 · trang dau them nen gradient -> KHONG_DON_SAC.
 * RANG 14 · hinh dong quay lai mau du lieu var(--data-cung) + shadowBlur -> KHONG_DON_SAC.
 * RANG 15 · tieu de doi sang font sans -> KHONG_DON_SAC.
 *
 * Chay: node scripts/bite-mat-tien.mjs
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const CONG = join(HERE, 'check-mat-tien.mjs');
const TEP = ['app/page.tsx', 'app/hub/page.tsx', 'app/layout.tsx', 'lib/content.ts', 'lib/mat-tien.ts',
  'components/dash/DashSidebar.tsx', 'components/dash/DashTopBar.tsx', 'styles/landing-hub.css', 'styles/touch-unify.css'];
const kq = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(64)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const tam = [];
const chep = (tu, den) => { mkdirSync(dirname(den), { recursive: true }); copyFileSync(tu, den); };
const canh = (sua) => {
  const t = mkdtempSync(join(tmpdir(), 'bite_mat_tien_')); tam.push(t);
  for (const f of TEP) chep(join(TOUCH, f), join(t, f));
  for (const f of readdirSync(join(TOUCH, 'components', 'landing'))) chep(join(TOUCH, 'components', 'landing', f), join(t, 'components', 'landing', f));
  if (sua) sua(t);
  return t;
};
const doi = (t, rel, f) => {
  const p = join(t, rel); const cu = readFileSync(p, 'utf8'); const moi = f(cu);
  if (moi === cu) throw new Error(`KHONG TIEM DUOC vao ${rel}: moc khong con`);
  writeFileSync(p, moi);
};
const chay = (t) => { const r = spawnSync(process.execPath, [CONG, '--touch', t], { encoding: 'utf8' }); return { rc: r.status, out: r.stdout + r.stderr }; };
const rang = (nhan, sua, ma, ky) => {
  let r;
  try { r = chay(canh(sua)); } catch (e) { inRa(nhan, false, e.message); return; }
  inRa(nhan, r.rc === ma && (ky ? r.out.includes(ky) : true), `exit ${r.rc}`);
};

try {
  rang('RANG 1  · canh sach -> exit 0', null, 0);
  rang('RANG 2  · trang dau ghi "chưa chạy" -> TRANG_THAI_GO_TAY', (t) => doi(t, 'app/page.tsx',
    (s) => s.replace('<h1 className="mt-chu__h">', '<p>Match thật · chưa chạy</p>\n        <h1 className="mt-chu__h">')), 2, 'TRANG_THAI_GO_TAY');
  rang('RANG 3  · link toi /hub quay lai -> CON_DEMO', (t) => doi(t, 'app/page.tsx',
    (s) => s.replace('<Link href={ROUTE.phuongPhap} className="mt-top__phu">Phương pháp</Link>', '<Link href="/hub" className="mt-top__phu">Hub minh họa</Link>')), 2, 'CON_DEMO');
  rang('RANG 4  · HUD ghi cung <dd>44</dd> -> SO_KHONG_SINH', (t) => doi(t, 'app/page.tsx',
    (s) => s.replace('<dt>{c.k}</dt><dd>{c.v}</dd>', '<dt>{c.k}</dt><dd>44</dd>')), 2, 'SO_KHONG_SINH');
  rang('RANG 5  · mat-tien gan cung daKy: 11 -> SO_KHONG_SINH', (t) => doi(t, 'lib/mat-tien.ts',
    (s) => s.replace('daKy: match.length', 'daKy: 11')), 2, 'SO_KHONG_SINH');
  rang('RANG 6  · trang dau bo dungMatTien -> SO_KHONG_SINH', (t) => doi(t, 'app/page.tsx',
    (s) => s.replace("import { dungMatTien } from '@/lib/mat-tien';", "import { dungMatTien } from '@/lib/so-tay';")), 2, 'SO_KHONG_SINH');
  rang('RANG 7  · /hub het chuyen huong -> CON_DEMO', (t) => doi(t, 'app/hub/page.tsx',
    (s) => s.replace("redirect('/dashboard');", 'return null;')), 2, 'CON_DEMO');
  rang('RANG 8  · .mt bo overflow hidden -> KHONG_MOT_MAN', (t) => doi(t, 'styles/landing-hub.css',
    (s) => s.replace(/(\.mt \{[^}]*?)overflow: hidden;/, '$1overflow: visible;')), 2, 'KHONG_MOT_MAN');
  rang('RANG 9  · layout bo nap touch-unify -> MAU_KHONG_THONG_NHAT', (t) => doi(t, 'app/layout.tsx',
    (s) => s.replace("import '@/styles/touch-unify.css';\n", '')), 2, 'MAU_KHONG_THONG_NHAT');
  rang('RANG 10 · Hub quay ve do cu #C40F0F -> MAU_KHONG_THONG_NHAT', (t) => doi(t, 'styles/touch-unify.css',
    (s) => s.replace('--dk-rd: var(--color-accent-blue);', '--dk-rd: #C40F0F;')), 2, 'MAU_KHONG_THONG_NHAT');
  rang('RANG 11 · thanh ben ghi "Solo Entrepreneur" -> TRANG_THAI_GO_TAY', (t) => doi(t, 'components/dash/DashSidebar.tsx',
    (s) => s.replace('>Công nghệ chiến lược Việt Nam<', '>Solo Entrepreneur<')), 2, 'TRANG_THAI_GO_TAY');
  rang('RANG 12 · chu thich nhac "chưa chạy" -> van exit 0', (t) => doi(t, 'app/page.tsx',
    (s) => `// Truoc day trang dau ghi "Match thật · chưa chạy".\n/* va "Thiếu dữ liệu CẦU thật" */\n${s}`), 0);
  rang('RANG 13 · nen gradient -> KHONG_DON_SAC', (t) => doi(t, 'styles/landing-hub.css',
    (s) => s.replace('background: var(--p-bg); color: var(--p-ink);', 'background: radial-gradient(800px 500px at 60% 40%, #0b1a3a, var(--p-bg)); color: var(--p-ink);')), 2, 'KHONG_DON_SAC');
  rang('RANG 14 · hinh dong dung mau du lieu + glow -> KHONG_DON_SAC', (t) => doi(t, 'components/landing/HubCungCau.tsx',
    (s) => s.replace("const MUC = docBien('--p-ink', '#EDEDEA');", "const MUC = docBien('--data-cung', '#56B4E9'); ctx.shadowBlur = 14;")), 2, 'KHONG_DON_SAC');
  rang('RANG 15 · tieu de doi sang font sans -> KHONG_DON_SAC', (t) => doi(t, 'styles/landing-hub.css',
    (s) => s.replace(/(\.mt-chu__h \{[^}]*?)font-family: var\(--p-serif\);/, '$1font-family: var(--p-sans);')), 2, 'KHONG_DON_SAC');
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE MAT TIEN: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
