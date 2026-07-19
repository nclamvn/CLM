#!/usr/bin/env node
/*
  Token guard vong dau. Hard-fail gia tri raw ngoai file token; spacing literals chi warning.
  KHONG ap rule len SVG geometry, width/height, transform, grid track, breakpoint.
  Bao file:dong:cot + rule. Exit 1 khi co hard violation. Chay: node scripts/check-tokens.mjs [--target dir]
*/
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, relative } from 'node:path';
import cfg from './token-guard.config.mjs';

const ROOT = process.cwd();
const targetArg = process.argv.indexOf('--target');
const override = targetArg > -1 ? process.argv[targetArg + 1] : null;

// ---- hard rules (mau, font, shadow, radius, timing) ----
const HARD = [
  { id: 'raw-hex-color', re: /#[0-9a-fA-F]{3,8}\b/g },
  { id: 'raw-functional-color', re: /\b(?:rgb|rgba|hsl|hsla)\s*\(/g },
  { id: 'raw-font-family', re: /font-?[Ff]amily\s*:\s*(?!['"]?var\()['"A-Za-z]/g },
  { id: 'raw-box-shadow', re: /box-?[Ss]hadow\s*:[ \t]*(?!['"]?var\(|none|inherit|unset)\S/g },
  { id: 'raw-text-shadow', re: /text-?[Ss]hadow\s*:[ \t]*(?!['"]?var\(|none|inherit|unset)\S/g },
  { id: 'raw-border-radius', re: /border-?[Rr]adius\s*:[ \t]*(?!['"]?var\(|inherit|unset|0\b)\S/g },
  { id: 'raw-transition-timing', re: /transition[^;:{]*:\s*[^;]*(?:\d+ms|\d+s\b|cubic-bezier)/g },
];
// spacing warning
const SPACING = /\b(?:margin|padding|gap|row-gap|column-gap|inset)(?:-(?:top|right|bottom|left|inline|block))?\s*:\s*([^;{}]+)/g;

function stripComments(src, ext) {
  let out = src.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '));
  if (ext !== '.css') out = out.replace(/(?<!:)\/\/.*$/gm, (m) => ' '.repeat(m.length));
  return out;
}

function collectFiles() {
  const files = [];
  const dirs = override ? [override] : cfg.scanDirs;
  const walk = (d) => {
    const abs = join(ROOT, d);
    if (!existsSync(abs)) return;
    for (const name of readdirSync(abs)) {
      const p = join(abs, name);
      const st = statSync(p);
      if (st.isDirectory()) walk(join(d, name));
      else if (cfg.scanExt.includes(extname(name)) && !cfg.excludeExt.includes(extname(name))) files.push(p);
    }
  };
  dirs.forEach(walk);
  if (!override) cfg.scanFiles.forEach((f) => existsSync(join(ROOT, f)) && files.push(join(ROOT, f)));
  return files.filter((f) => !cfg.allowedFiles.some((a) => f.endsWith(a)));
}

const errors = [];
const warnings = [];

for (const file of collectFiles()) {
  const ext = extname(file);
  const rel = relative(ROOT, file);
  const lines = stripComments(readFileSync(file, 'utf8'), ext).split('\n');
  lines.forEach((line, i) => {
    for (const rule of HARD) {
      rule.re.lastIndex = 0;
      let m;
      while ((m = rule.re.exec(line))) {
        errors.push({ rel, line: i + 1, col: m.index + 1, rule: rule.id, value: m[0].trim().slice(0, 40) });
        if (rule.re.lastIndex === m.index) rule.re.lastIndex++;
      }
    }
    SPACING.lastIndex = 0;
    let s;
    while ((s = SPACING.exec(line))) {
      for (const tok of s[1].split(/\s+/)) {
        if (/^-?\d+(?:\.\d+)?px$/.test(tok) && !cfg.allowedSpacing.includes(tok.replace('-', ''))) {
          warnings.push({ rel, line: i + 1, rule: 'spacing-off-scale', value: tok });
        }
      }
    }
  });
}

console.log('');
if (errors.length) {
  console.log('TOKEN GUARD FAIL\n');
  for (const e of errors.slice(0, 60)) {
    console.log(`${e.rel}:${e.line}:${e.col}\n  rule: ${e.rule}\n  value: ${e.value}`);
  }
  if (errors.length > 60) console.log(`... +${errors.length - 60} hard violations nua`);
} else {
  console.log('TOKEN GUARD PASS (0 hard violation)');
}
if (process.argv.includes('--warnings')) {
  console.log('\n--- spacing warnings (off-scale, chi warning) ---');
  const byLoc = {};
  warnings.forEach((w) => {
    const k = `${w.rel}:${w.line}`;
    (byLoc[k] = byLoc[k] || []).push(w.value);
  });
  for (const [loc, vals] of Object.entries(byLoc)) console.log(`${loc}  ${vals.join(', ')}`);
}
const byRule = {};
errors.forEach((e) => (byRule[e.rule] = (byRule[e.rule] || 0) + 1));
console.log(`\n${errors.length} errors, ${warnings.length} warnings`);
if (errors.length) console.log('theo rule:', JSON.stringify(byRule));
process.exit(errors.length ? 1 : 0);
