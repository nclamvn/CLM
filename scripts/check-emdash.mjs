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
// Dau bi cam, dinh nghia bang code point de chinh file nay khong chua literal.
// Ca em-dash (U+2014) lan en-dash (U+2013): nguoi doc thuong khong phan biet,
// deu la dau vet AI voi khach nhay cam (quyet dinh Con nguoi, 2026-07-14).
const BANNED = [
  { name: 'em-dash U+2014', ch: String.fromCharCode(0x2014) },
  { name: 'en-dash U+2013', ch: String.fromCharCode(0x2013) },
];

let hits = 0;

function scanFile(path) {
  if (!TEXT_EXT.has(extname(path))) return;
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
  console.error(`\nFAIL: tim thay ${hits} dau bi cam (em-dash U+2014 hoac en-dash U+2013). Phai bang 0.`);
  process.exit(1);
}
console.log('OK: 0 em-dash, 0 en-dash.');
