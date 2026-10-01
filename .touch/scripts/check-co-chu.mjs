#!/usr/bin/env node
/**
 * check-co-chu.mjs · Khong chu nao tren giao dien nho hon 12px; chi con hai ho chu.
 *
 * VI SAO CO (01/10/2026, nghiem thu giao dien enterprise): do tren 11 trang co hang tram doan chu
 * 9 den 11,5px (Registry 761 doan 11px, Thi truong co chu 9px), va site tai NAM ho chu (Inter,
 * Noto Serif, Be Vietnam Pro, IBM Plex Mono, SF Mono), hai ho la di san thiet ke cu. Giao dien
 * doanh nghiep cao cap giu chu than >= 12px va mot he chu.
 *
 * CONG KIEM (bo chu thich):
 *   CHU_NHO    font-size / font: Npx < 12 trong styles/*.css, app/globals.css; fontSize < 12 trong
 *              .tsx (style hoac thuoc tinh SVG); ctx.font co co chu < 12 tren canvas.
 *   PHONG_THUA app/layout.tsx nap next/font (Be Vietnam Pro, Fraunces, IBM Plex Mono) hoac CSS khai
 *              @font-face cho ho chu ngoai Inter va Noto Serif.
 *
 * PHAM VI: styles/, app/ (tru app/dev), components/ (tru components/globe).
 * Chay: node scripts/check-co-chu.mjs [--touch <dir .touch>]     Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const TOUCH = resolve(arg('--touch') || join(HERE, '..'));
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
const MIN = 12;
const BO_QUA = [join(TOUCH, 'app', 'dev'), join(TOUCH, 'components', 'globe')];
const tep = [];
const quet = (d, re) => {
  if (!existsSync(d)) return;
  for (const t of readdirSync(d)) {
    const p = join(d, t);
    if (BO_QUA.some((b) => p.startsWith(b)) || t === 'node_modules' || t.startsWith('.')) continue;
    if (statSync(p).isDirectory()) quet(p, re); else if (re.test(t)) tep.push(p);
  }
};
quet(join(TOUCH, 'styles'), /\.css$/); quet(join(TOUCH, 'app'), /\.(css|tsx)$/); quet(join(TOUCH, 'components'), /\.(css|tsx)$/);
if (!tep.length) thoat3(`khong thay tep giao dien duoi ${TOUCH}`);
const layoutP = join(TOUCH, 'app', 'layout.tsx');
if (!existsSync(layoutP)) thoat3('thieu app/layout.tsx');

const boChuThich = (s) => s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' ')).split('\n').map((l) => (/^\s*\/\//.test(l) ? '' : l));
const ten = (p) => p.slice(TOUCH.length + 1);
const vi = [];
for (const p of tep) {
  boChuThich(readFileSync(p, 'utf8')).forEach((l, i) => {
    const cho = `${ten(p)}:${i + 1}`;
    const bao = (v, kieu) => { if (v < MIN) vi.push(`CHU_NHO: ${cho} ${kieu} ${v}px`); };
    for (const m of l.matchAll(/font-size\s*:\s*([0-9.]+)px/g)) bao(+m[1], 'font-size');
    for (const m of l.matchAll(/\bfont\s*:\s*(?:[a-z0-9-]+\s+)*?([0-9.]+)px/g)) bao(+m[1], 'font');
    if (p.endsWith('.tsx')) {
      for (const m of l.matchAll(/fontSize\s*[=:]\s*[{"']?\s*([0-9.]+)/g)) bao(+m[1], 'fontSize');
      for (const m of l.matchAll(/ctx\.font\s*=\s*`(?:[0-9]{3}\s+)?(?:italic\s+)?(?:[0-9]{3}\s+)?([0-9.]+)px/g)) bao(+m[1], 'ctx.font');
    }
  });
}
const layout = readFileSync(layoutP, 'utf8');
if (/BeVietnamPro|beVietnamPro|Fraunces|fraunces|IBMPlexMono|ibmPlexMono|from '\.\/fonts'/.test(layout)) vi.push('PHONG_THUA: app/layout.tsx con nap phong cu');
for (const p of tep.filter((x) => x.endsWith('.css'))) {
  for (const m of readFileSync(p, 'utf8').matchAll(/@font-face\s*\{[^}]*font-family:\s*['"]?([^'";]+)/g)) {
    if (!/^(Inter|Noto Serif)$/.test(m[1].trim())) vi.push(`PHONG_THUA: ${ten(p)} khai bao ho chu "${m[1].trim()}"`);
  }
}
console.log(`co chu: ${tep.length} tep · nguong ${MIN}px · ${vi.length} vi pham`);
if (vi.length) {
  console.log(`\nFAIL: ${vi.length} vi pham`);
  vi.slice(0, 40).forEach((v) => console.log('  ' + v));
  process.exit(2);
}
console.log(`\nOK: khong chu nao duoi ${MIN}px; chi Inter, Noto Serif va mono he thong.`);
