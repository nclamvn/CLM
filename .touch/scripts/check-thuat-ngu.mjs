#!/usr/bin/env node
/**
 * check-thuat-ngu.mjs · Chu HIEN THI tren giao dien la tieng Viet theo bang thuat ngu; khong con
 * muc dieu huong "sap co".
 *
 * VI SAO CO (01/10/2026): nghiem thu giao dien cho chao hang enterprise va goi von do duoc 8 den 29
 * tu tieng Anh moi trang, va 4 muc thanh ben mo "sap co". Sua mot lan thi de; giu cho chung khong
 * quay lai moi khi them man moi thi can cong.
 *
 * CONG KIEM (bo chu thich truoc khi quet):
 *   TU_CAM        mot tu trong CAM (lib/thuat-ngu.mjs) nam trong chu hien thi: chu JSX giua the,
 *                 hoac chuoi "nhin thay duoc" (co dau tieng Viet, hoac co khoang trang va chu hoa, hoac
 *                 la gia tri cua label/title/aria-label/placeholder/alt/subtitle). Ten lop (className),
 *                 duong dan import va ma dinh danh khong tinh.
 *   MUC_CHET      lib/project-status.ts co muc dieu huong href rong.
 *
 * PHAM VI: app/ (tru app/dev), components/ (tru components/globe), lib/project-status.ts, lib/content.ts,
 *         lib/*.mjs (bo sinh chu hien thi; tru thuat-ngu.mjs, mau-du-lieu.mjs).
 * Du lieu sinh (lib/*.json) khong quet: ten nhu cau, ten don vi la chu cua nguon.
 *
 * Chay: node scripts/check-thuat-ngu.mjs [--touch <dir .touch>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const TOUCH = resolve(arg('--touch') || join(HERE, '..'));
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
const BANG = join(TOUCH, 'lib', 'thuat-ngu.mjs');
if (!existsSync(BANG)) thoat3(`thieu ${BANG}`);
let CAM;
try { ({ CAM } = await import(pathToFileURL(BANG).href)); } catch (e) { thoat3(`khong nap duoc bang thuat ngu: ${e.message}`); }
if (!Array.isArray(CAM) || !CAM.length) thoat3('bang thuat ngu khong co danh sach CAM');

const BO_QUA = [join(TOUCH, 'app', 'dev'), join(TOUCH, 'components', 'globe')];
const tep = [];
const quet = (d) => {
  if (!existsSync(d)) return;
  for (const t of readdirSync(d)) {
    const p = join(d, t);
    if (BO_QUA.some((b) => p.startsWith(b)) || t === 'node_modules' || t.startsWith('.')) continue;
    if (statSync(p).isDirectory()) quet(p); else if (/\.(tsx|ts)$/.test(t)) tep.push(p);
  }
};
quet(join(TOUCH, 'app')); quet(join(TOUCH, 'components'));
for (const f of ['project-status.ts', 'content.ts']) if (existsSync(join(TOUCH, 'lib', f))) tep.push(join(TOUCH, 'lib', f));
// Bo sinh du lieu hien thi (01/10/2026): chu "Matching Workbench", "tier A" tung lot len trang qua lib/mo-dau.mjs.
for (const f of readdirSync(join(TOUCH, 'lib'))) if (/\.mjs$/.test(f) && !['thuat-ngu.mjs', 'mau-du-lieu.mjs'].includes(f)) tep.push(join(TOUCH, 'lib', f));
if (!tep.length) thoat3('khong thay tep giao dien');

const boChuThich = (s) => s.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '')
  .split('\n').map((l) => l.replace(/(^|[^:'"`])\/\/.*$/, '$1')).join('\n');
const coDau = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀ-ỹĐ]/;
const NHAN = /\b(label|title|subtitle|placeholder|alt|aria-label|nhan|ten|phu|ly|desc|sub)\s*[:=]\s*\{?\s*$/;
const reTu = (t) => new RegExp(`(^|[^A-Za-zÀ-ỹ0-9_-])${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![A-Za-z0-9_-])`);
const CAM_RE = CAM.map((t) => [t, reTu(t)]);
const ten = (p) => p.slice(TOUCH.length + 1);

const vi = [];
for (const p of tep) {
  let s = boChuThich(readFileSync(p, 'utf8'));
  s = s.replace(/className=(\{`[^`]*`\}|"[^"]*"|\{'[^']*'\}|\{[^}]*\})/g, 'className=""');
  s = s.replace(/^\s*(import|export \* from)[^\n]*$/gm, '');
  const doan = [];
  // Chu JSX giua the. Bo doan la ma TS lot vao (generic useState<...>, so sanh a > b).
  for (const m of s.matchAll(/>((?:[^<>{}]|\{[^{}]*\})+)</g)) {
    const chu = m[1].replace(/\{[^{}]*\}/g, ' ');
    if (!/;|=>|&&|\|\||===|\bconst\b|\breturn\b/.test(m[1]) || /^\s*\{/.test(m[1])) doan.push(chu);
  }
  for (const m of s.matchAll(/(['"`])((?:\\.|(?!\1)[^\\\n])*)\1/g)) {
    const chu = m[2].replace(/\$\{[^}]*\}/g, ' ');
    const truoc = s.slice(Math.max(0, m.index - 24), m.index);
    if (/^[a-z0-9_./:#?=&%@+-]*$/i.test(chu) && !NHAN.test(truoc)) continue; // dinh danh, duong dan, ma
    if (coDau.test(chu) || (/\s/.test(chu) && /[A-Z]/.test(chu)) || NHAN.test(truoc)) doan.push(chu);
  }
  for (const d of doan) for (const [t, re] of CAM_RE) if (re.test(d)) vi.push(`TU_CAM: ${ten(p)} "${t}" trong "${d.trim().replace(/\s+/g, ' ').slice(0, 70)}"`);
}
const nav = readFileSync(join(TOUCH, 'lib', 'project-status.ts'), 'utf8');
for (const m of nav.matchAll(/\{\s*label:\s*'([^']*)',\s*href:\s*''\s*\}/g)) vi.push(`MUC_CHET: muc dieu huong "${m[1]}" khong co trang`);

const dem = new Map();
for (const v of vi) { const k = v.split(' "')[1]; dem.set(k, (dem.get(k) ?? 0) + 1); }
console.log(`thuat ngu: ${tep.length} tep · ${vi.length} vi pham${dem.size ? ' · ' + [...dem].map(([k, n]) => `${k.replace(/"$/, '')} ${n}`).join(', ') : ''}`);
if (vi.length) {
  console.log(`\nFAIL: ${vi.length} vi pham`);
  vi.slice(0, 60).forEach((v) => console.log('  ' + v));
  process.exit(2);
}
console.log('\nOK: chu hien thi la tieng Viet theo bang thuat ngu, khong con muc dieu huong chet.');
