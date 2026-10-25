#!/usr/bin/env node
/**
 * check-menu.mjs · Cau truc menu bang dieu khien (25/10/2026, goi G7).
 *
 * VI SAO CO: menu cu la 13 muc phang theo thu tu them vao, bieu tuong gan theo VI TRI (doi thu tu
 * la bieu tuong lech), Kho ma nam ngang hang Tong quan. Nay nhom theo viec. Cong nay giu ba loi hua:
 * khong muc nao chet, moi trang thuoc dung mot muc, va moi muc nam trong mot nhom co ten.
 *
 * CONG KIEM:
 *   MENU_CHET     muc menu tro toi trang khong co.
 *   MENU_THIEU    mot trang cap mot cua bang dieu khien (app/dashboard/<ten>/page.tsx) khong co muc menu.
 *   MENU_TRUNG    hai muc cung mot duong dan.
 *   MENU_NHOM     muc khong co nhom, hoac nhom khong khai trong NHOM_MENU; hoac nhom co ten ma rong.
 *   BIEU_TUONG    muc khong co bieu tuong rieng, hoac thanh ben lai gan bieu tuong theo vi tri (ICONS[i]).
 *
 * Chay: node scripts/check-menu.mjs [--touch <dir .touch>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const TOUCH = resolve(arg('--touch') || join(HERE, '..'));
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
const PS = join(TOUCH, 'lib', 'project-status.ts');
const SB = join(TOUCH, 'components', 'dash', 'DashSidebar.tsx');
for (const p of [PS, SB, join(TOUCH, 'app', 'dashboard')]) if (!existsSync(p)) thoat3(`thieu ${p}`);
const ps = readFileSync(PS, 'utf8');
const muc = [...ps.matchAll(/\{\s*label:\s*'([^']*)',\s*href:\s*'([^']*)'(?:,\s*nhom:\s*'([^']*)')?(?:,\s*icon:\s*'([^']*)')?\s*\}/g)]
  .map((m) => ({ label: m[1], href: m[2], nhom: m[3] ?? null, icon: m[4] ?? null }));
if (!muc.length) thoat3('khong doc duoc muc menu nao trong lib/project-status.ts. Rong khong phai sach.');
const nhom = [...ps.matchAll(/\{\s*k:\s*'([^']*)',\s*ten:\s*'([^']*)'\s*\}/g)].map((m) => ({ k: m[1], ten: m[2] }));
const vi = [];
const dem = new Map();
for (const m of muc) {
  dem.set(m.href, (dem.get(m.href) ?? 0) + 1);
  const trang = join(TOUCH, 'app', ...m.href.replace(/^\//, '').split('/'), 'page.tsx');
  if (!m.href || !existsSync(trang)) vi.push(`MENU_CHET: "${m.label}" -> ${m.href || '(rong)'} khong co trang`);
  if (!m.nhom || !nhom.some((g) => g.k === m.nhom)) vi.push(`MENU_NHOM: "${m.label}" nhom ${m.nhom ?? '(khong co)'} khong khai trong NHOM_MENU`);
  if (!m.icon) vi.push(`BIEU_TUONG: "${m.label}" khong co bieu tuong rieng`);
}
for (const [h, n] of dem) if (n > 1) vi.push(`MENU_TRUNG: ${h} co ${n} muc`);
for (const g of nhom) if (g.k !== 'chinh' && !g.ten) vi.push(`MENU_NHOM: nhom ${g.k} khong co ten`);
for (const g of nhom) if (!muc.some((m) => m.nhom === g.k)) vi.push(`MENU_NHOM: nhom ${g.k} rong`);
const DB = join(TOUCH, 'app', 'dashboard');
for (const t of readdirSync(DB)) {
  if (!statSync(join(DB, t)).isDirectory() || t.startsWith('[') || !existsSync(join(DB, t, 'page.tsx'))) continue;
  if (!muc.some((m) => m.href === `/dashboard/${t}`)) vi.push(`MENU_THIEU: /dashboard/${t} co trang ma khong co muc menu`);
}
const sb = readFileSync(SB, 'utf8');
if (/ICONS\[i\]|\[\s*'home',\s*'search'/.test(sb) || !/name=\{n\.icon\}/.test(sb)) vi.push('BIEU_TUONG: thanh ben gan bieu tuong theo vi tri thay vi theo muc');
console.log(`menu: ${muc.length} muc · ${nhom.length} nhom`);
if (vi.length) { console.log(`\nFAIL: ${vi.length} vi pham`); vi.forEach((v) => console.log('  ' + v)); process.exit(2); }
console.log('\nOK: moi muc menu co trang, moi trang co dung mot muc, moi muc thuoc mot nhom co ten va co bieu tuong rieng.');
