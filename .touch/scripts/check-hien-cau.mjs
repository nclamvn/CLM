#!/usr/bin/env node
/**
 * check-hien-cau.mjs · Cau nguon hien tren man hinh phai sach dau markdown NHUNG khong mat chu
 * nao cua nguon; va moi cho hien cau nguon cho nguoi doc phai di qua hienCau.
 *
 * VI SAO CO (01/10/2026): anh chup Hoi dap hien "**MiSmart** , voi triet ly ..." nguyen dau sao.
 * Sua bang lib/hien-cau.mjs (chi go dau dinh dang). Cong nay giu hai loi hua cung luc: sach dau,
 * va khong duoc "lam dep" bang cach cat chu cua nguon.
 *
 * CONG KIEM:
 *   CON_DAU   ban doc con "**", "__", "](", "![", "#" dau cau, hay dau nghieng *chu* (02/10/2026:
 *             ten nhu cau mst-03 hien "*Stemona tuberosa*" tren man Cau that).
 *             Tap kiem gom ca span lan VALUE cua nhu cau dat hang (man Cau that hien value).
 *   MAT_CHU   chu va so cua ban doc khac chu va so cua cau goc sau khi bo DIA CHI lien ket va TEN
 *             anh (phep bo nay cong tu lam, khong muon cua module).
 *   CAU_THO   mot component hien thang X.span cho nguoi doc (>{X.span}<, text={X.span},
 *             title co ${X.span}, <ToDam span={X.span}) ma khong qua hienCau.
 *
 * Chay: node scripts/check-hien-cau.mjs [--lib <dir>] [--mo-dun <hien-cau.mjs>] [--quet <dir,dir>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve, relative } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const LIB = resolve(arg('--lib') || join(TOUCH, 'lib'));
const MO_DUN = resolve(arg('--mo-dun') || join(LIB, 'hien-cau.mjs'));
const QUET = (arg('--quet') || [join(TOUCH, 'components'), join(TOUCH, 'app')].join(',')).split(',').map((d) => resolve(d));
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
for (const p of [join(LIB, 'cncl-registry.json'), MO_DUN]) if (!existsSync(p)) thoat3(`thieu ${p}`);
const { hienCau } = await import(pathToFileURL(MO_DUN).href + '?t=' + Date.now());
const reg = JSON.parse(readFileSync(join(LIB, 'cncl-registry.json'), 'utf8'));
const tc = existsSync(join(LIB, 'hub-thoi-cuoc.json')) ? JSON.parse(readFileSync(join(LIB, 'hub-thoi-cuoc.json'), 'utf8')) : null;

const cau = new Set();
for (const u of reg.units) for (const e of u.evidence) if (e.span) cau.add(e.span);
for (const n of reg.needs) if (n.span) cau.add(n.span);
const dh = existsSync(join(LIB, 'cncl-cau-dat-hang.json')) ? JSON.parse(readFileSync(join(LIB, 'cncl-cau-dat-hang.json'), 'utf8')) : { claims: [] };
for (const c of dh.claims) { if (c.span) cau.add(c.span); if (c.value) cau.add(String(c.value)); }
if (tc) JSON.stringify(tc, (k, v) => { if (k === 'span' && typeof v === 'string') cau.add(v); return v; });

const chu = (s) => (s.normalize('NFC').match(/[\p{L}\p{N}]/gu) || []).join('');
const boLienKet = (s) => s.replace(/\]\([^)]*\)/g, ']').replace(/!\[[^\]]*\]/g, '');
const vi = []; let sua = 0;
for (const s of cau) {
  const d = hienCau(s);
  if (d !== s) sua++;
  if (/\*\*|__|\]\(|!\[/.test(d) || /^#/.test(d) || /(^|[\s(])\*[^*\s][^*]*?\*(?=[\s).,;:]|$)/.test(d)) vi.push(`CON_DAU: "${d.slice(0, 80)}"`);
  if (chu(d) !== chu(boLienKet(s))) vi.push(`MAT_CHU: "${s.slice(0, 60)}" -> "${d.slice(0, 60)}"`);
}

const THO = [/>\{[\w?.]+\.span\}</, /<h3 className="ct-ten">\{n\.ten\}/, /text=\{[\w?.]+\.span\}/, /\$\{[\w?.]+\.span\}`\}/, /<ToDam span=\{[\w?.]+\.span\}/];
const duyet = (d) => readdirSync(d).flatMap((f) => { const p = join(d, f); return statSync(p).isDirectory() ? duyet(p) : /\.tsx$/.test(f) ? [p] : []; });
let soTep = 0;
for (const d of QUET) {
  if (!existsSync(d)) thoat3(`thieu thu muc quet ${d}`);
  for (const p of duyet(d)) {
    soTep++;
    readFileSync(p, 'utf8').split('\n').forEach((dong, i) => { if (THO.some((r) => r.test(dong))) vi.push(`CAU_THO: ${relative(TOUCH, p)}:${i + 1}`); });
  }
}

console.log(`hien cau: ${cau.size} cau nguon · ${sua} cau co dau markdown duoc go · quet ${soTep} tep giao dien`);
if (vi.length) { console.log(`\nFAIL: ${vi.length} vi pham`); vi.slice(0, 30).forEach((v) => console.log('  ' + v)); process.exit(2); }
console.log('\nOK: ban doc sach dau markdown, khong mat chu nguon, moi cho hien cau deu qua hienCau.');
