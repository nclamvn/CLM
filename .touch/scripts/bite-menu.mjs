#!/usr/bin/env node
/**
 * bite-menu.mjs · Rang cua check-menu.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep lib/project-status.ts, components/dash/DashSidebar.tsx va CAC page.tsx cua
 * app/dashboard vao thu muc tam (mkdtempSync), tiem loi vao ban sao. File that khong bi cham.
 *
 * RANG
 * ====
 * RANG 1 · canh sach -> exit 0.
 * RANG 2 · muc menu tro toi trang khong co -> MENU_CHET.
 * RANG 3 · them trang dashboard moi ma khong them muc -> MENU_THIEU.
 * RANG 4 · muc mang nhom khong khai -> MENU_NHOM.
 * RANG 5 · thanh ben quay lai gan bieu tuong theo vi tri -> BIEU_TUONG.
 * RANG 6 · hai muc cung duong dan -> MENU_TRUNG.
 *
 * Chay: node scripts/bite-menu.mjs     Exit 0 moi rang can · 2 co rang khong can.
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync, copyFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const CONG = join(HERE, 'check-menu.mjs');
const kq = []; const tam = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(56)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const chep = (tu, den) => { mkdirSync(dirname(den), { recursive: true }); copyFileSync(tu, den); };
const canh = () => {
  const t = mkdtempSync(join(tmpdir(), 'bite_menu_')); tam.push(t);
  chep(join(TOUCH, 'lib', 'project-status.ts'), join(t, 'lib', 'project-status.ts'));
  chep(join(TOUCH, 'components', 'dash', 'DashSidebar.tsx'), join(t, 'components', 'dash', 'DashSidebar.tsx'));
  const DB = join(TOUCH, 'app', 'dashboard');
  chep(join(DB, 'page.tsx'), join(t, 'app', 'dashboard', 'page.tsx'));
  for (const d of readdirSync(DB)) if (statSync(join(DB, d)).isDirectory() && existsSync(join(DB, d, 'page.tsx'))) chep(join(DB, d, 'page.tsx'), join(t, 'app', 'dashboard', d, 'page.tsx'));
  return t;
};
const doi = (t, rel, f) => { const p = join(t, rel); const s = readFileSync(p, 'utf8'); const m = f(s); if (m === s) throw new Error('KHONG TIEM DUOC'); writeFileSync(p, m); };
const thu = (nhan, sua, ma) => {
  try {
    const t = canh(); if (sua) sua(t);
    const r = spawnSync(process.execPath, [CONG, '--touch', t], { encoding: 'utf8' });
    const out = r.stdout + r.stderr;
    inRa(nhan, ma ? r.status === 2 && out.includes(ma) : r.status === 0, `exit ${r.status}`);
  } catch (e) { inRa(nhan, false, e.message); }
};
try {
  thu('RANG 1 · canh sach -> exit 0', null, null);
  thu('RANG 2 · muc tro toi trang khong co -> MENU_CHET', (t) => doi(t, 'lib/project-status.ts', (s) => s.replace("href: '/dashboard/repos'", "href: '/dashboard/kho-cu'")), 'MENU_CHET');
  thu('RANG 3 · trang moi khong co muc -> MENU_THIEU', (t) => { mkdirSync(join(t, 'app', 'dashboard', 'trang-moi')); writeFileSync(join(t, 'app', 'dashboard', 'trang-moi', 'page.tsx'), 'export default function P() { return null; }\n'); }, 'MENU_THIEU');
  thu('RANG 4 · nhom khong khai -> MENU_NHOM', (t) => doi(t, 'lib/project-status.ts', (s) => s.replace("nhom: 'bao_cao', icon: 'doc'", "nhom: 'linh_tinh', icon: 'doc'")), 'MENU_NHOM');
  thu('RANG 5 · bieu tuong theo vi tri -> BIEU_TUONG', (t) => doi(t, 'components/dash/DashSidebar.tsx', (s) => s.replace('name={n.icon}', 'name={ICONS[i]}')), 'BIEU_TUONG');
  thu('RANG 6 · hai muc cung duong dan -> MENU_TRUNG', (t) => doi(t, 'lib/project-status.ts', (s) => s.replace("href: '/dashboard/do-thi'", "href: '/dashboard/thi-truong'")), 'MENU_TRUNG');
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE MENU: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
