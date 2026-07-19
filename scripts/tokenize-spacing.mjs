#!/usr/bin/env node
/* Codemod mot lan: thay 6/10/14/18px -> var(--space-*) CHI trong thuoc tinh spacing
   (margin/padding/gap/row-gap/column-gap/inset). Giu nguyen width/height/font/radius/track.
   Gia tri khong doi -> pixel-identical. Chay: node scripts/tokenize-spacing.mjs styles/dashboard.css */
import { readFileSync, writeFileSync } from 'node:fs';

const MAP = { '6px': 'var(--space-1_5)', '10px': 'var(--space-2_5)', '14px': 'var(--space-3_5)', '18px': 'var(--space-4_5)' };
const SPACING = /\b((?:margin|padding|gap|row-gap|column-gap|inset)(?:-(?:top|right|bottom|left|inline|block))?)(\s*:\s*)([^;{}]+)/g;

const file = process.argv[2];
if (!file) { console.error('usage: tokenize-spacing.mjs <file>'); process.exit(1); }
const src = readFileSync(file, 'utf8');
let count = 0;
const out = src.replace(SPACING, (m, prop, sep, val) => {
  const newVal = val.split(/(\s+)/).map((tok) => {
    if (MAP[tok]) { count++; return MAP[tok]; }
    return tok;
  }).join('');
  return prop + sep + newVal;
});
writeFileSync(file, out);
console.log(`${file}: thay ${count} gia tri spacing -> token`);
