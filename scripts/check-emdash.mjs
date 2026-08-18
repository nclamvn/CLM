#!/usr/bin/env node
/*
  Cong cung: bat ky tu em-dash U+2014 trong source. Ket qua phai bang 0. En-dash U+2013 duoc phep.
  Quet app, components, lib, va cac file cau hinh goc. Bo qua node_modules, .next,
  public/fonts (nhi phan). Dung trong scripts va truoc moi ban giao TIP.
*/
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = process.cwd();
const SCAN_DIRS = ['app', 'components', 'lib', 'scripts', 'styles', 'docs'];
const ROOT_FILES = [
  'tailwind.config.ts',
  'next.config.mjs',
  'postcss.config.mjs',
  'package.json',
  'README.md',
];
const TEXT_EXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.css', '.json', '.md', '.svg', '.html']);
// Tai lieu handoff/SOT imported tu ben ngoai (khong phai content san pham tu viet).
// Rule em-dash chi ap len content san pham; bo qua reference imported.
const EXCLUDE_SUFFIX = [
  'docs/design/TOUCH_PORTAL_LANDING_HUB_BLUEPRINT.md',
  'docs/design/touch-portal-recipes.css',
  'docs/design/touch-portal-tokens.json',
];
// Dau bi cam, dinh nghia bang code point de chinh file nay khong chua literal.
//
// NOI LUAT 18/08/2026 (Con nguoi quyet, thay quyet dinh 2026-07-14): CHI cam em-dash
// U+2014. En-dash U+2013 DUOC PHEP. Ly do: em-dash la dau vet AI ro rang trong van phong,
// con en-dash la dau cau binh thuong cua tieng Viet in an. Cung luat da ap cho
// CNCLData/check_dash.py tu 16/08.
//
// Ly do thu hai, nang hon: tu 18/08 lib/cncl-registry.ts chua CAU TRICH NGUYEN VAN tu
// nguon that. Bat cong nay cam en-dash trong do se ep phai SUA CHU CUA NGUON de qua cong,
// tuc pham dung cai loi ma ba vong vua roi bo cong sua: viet lai cau roi van goi la
// verbatim. Cong van phong khong duoc phep de len cong nguyen van.
const BANNED = [
  { name: 'em-dash U+2014', ch: String.fromCharCode(0x2014) },
];

let hits = 0;

function scanFile(path) {
  if (!TEXT_EXT.has(extname(path))) return;
  if (EXCLUDE_SUFFIX.some((s) => path.endsWith(s))) return;
  const text = readFileSync(path, 'utf8');
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    for (const { name, ch } of BANNED) {
      if (line.includes(ch)) {
        hits += 1;
        console.log(`${path}:${i + 1}: [${name}] ${line.trim()}`);
      }
    }
  });
}

function walk(dir) {
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return;
  }
  for (const name of entries) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full);
    else scanFile(full);
  }
}

for (const d of SCAN_DIRS) walk(join(ROOT, d));
for (const f of ROOT_FILES) {
  try {
    scanFile(join(ROOT, f));
  } catch {
    /* file may not exist yet */
  }
}

if (hits > 0) {
  console.error(`\nFAIL: tim thay ${hits} em-dash U+2014. Phai bang 0. (en-dash U+2013 duoc phep tu 18/08/2026)`);
  process.exit(1);
}
console.log('OK: 0 em-dash U+2014 (en-dash U+2013 duoc phep).');
