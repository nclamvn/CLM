#!/usr/bin/env node
/*
  Cong cung: bat ky tu em-dash U+2014 trong source. Ket qua phai bang 0.
  Quet app, components, lib, va cac file cau hinh goc. Bo qua node_modules, .next,
  public/fonts (nhi phan). Dung trong scripts va truoc moi ban giao TIP.
*/
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = process.cwd();
const SCAN_DIRS = ['app', 'components', 'lib', 'scripts'];
const ROOT_FILES = [
  'tailwind.config.ts',
  'next.config.mjs',
  'postcss.config.mjs',
  'package.json',
  'README.md',
];
const TEXT_EXT = new Set(['.ts', '.tsx', '.js', '.mjs', '.css', '.json', '.md', '.svg', '.html']);
// Dinh nghia bang code point U+2014 de chinh file nay khong chua ky tu literal.
const EMDASH = String.fromCharCode(0x2014);

let hits = 0;

function scanFile(path) {
  if (!TEXT_EXT.has(extname(path))) return;
  const text = readFileSync(path, 'utf8');
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    if (line.includes(EMDASH)) {
      hits += 1;
      console.log(`${path}:${i + 1}: ${line.trim()}`);
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
  console.error(`\nFAIL: tim thay ${hits} em-dash (U+2014). Phai bang 0.`);
  process.exit(1);
}
console.log('OK: 0 em-dash.');
