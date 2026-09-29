#!/usr/bin/env node
/**
 * check-lop-phu-nguon.mjs · Moi cau nguon ma lop phu hien ra phai TO SANG DUOC trong ban
 * chup ma trang web phuc vu.
 *
 * VI SAO CO (29/09/2026, pha P1): lop phu nguon la khoanh khac chot cua kich ban demo: bam
 * con so, thay cau nguon nguyen van giua doan van quanh no. Lop phu doc ban chup o
 * public/evidence/*.txt, KHONG phai ban goc trong registry. Hai ban do do gen-cncl-data.mjs
 * dong bo. Neu ban phuc vu lech ban goc, check_spans.py van xanh (no doc ban goc) trong khi
 * nha dau tu bam vao thi thay dong chu do "khong co nguyen van trong ban chup".
 *
 * Cong dung DUNG ham catNguCanh() cua giao dien, voi dung quy tac: khop nguyen van, khong
 * gan dung. Ham do tra cach=null la loi.
 *
 * Pham vi: moi evidence cua don vi, moi nhu cau, moi bang chung hai phia cua match da ky.
 *
 * Chay: node scripts/check-lop-phu-nguon.mjs [--lib <dir>] [--public <dir>]
 * Exit 0 sach · 2 co cau khong to sang duoc · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { catNguCanh } from '../lib/tim-kiem.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const LIB = arg('--lib') || join(HERE, '..', 'lib');
const PUB = arg('--public') || join(HERE, '..', 'public');

const doc = (f) => {
  const p = join(LIB, f);
  if (!existsSync(p)) { console.log(`KHONG CHAY DUOC: thieu ${p}`); process.exit(3); }
  return JSON.parse(readFileSync(p, 'utf8'));
};
const reg = doc('cncl-registry.json');
const mat = doc('cncl-match.json');

const ds = [
  ...reg.units.flatMap((u) => u.evidence.map((e) => ({ ai: `${u.name} · ${e.field}`, span: e.span, href: e.href }))),
  ...reg.needs.map((n) => ({ ai: n.id, span: n.span, href: n.href })),
  ...mat.signedMatches.flatMap((m) => [...m.demandEvidence, ...m.supplyEvidence].map((e) => ({ ai: `${m.id} · ${e.field}`, span: e.span, href: e.href }))),
];
if (ds.length === 0) { console.log('KHONG CHAY DUOC: khong co cau nguon nao de kiem.'); process.exit(3); }

const cache = new Map();
const sai = [];
for (const x of ds) {
  const p = join(PUB, x.href);
  if (!cache.has(p)) cache.set(p, existsSync(p) ? readFileSync(p, 'utf8') : null);
  const t = cache.get(p);
  if (t === null) { sai.push(`MAT_BAN_CHUP: ${x.href} (${x.ai})`); continue; }
  if (catNguCanh(t, x.span).cach === null) sai.push(`KHONG_TO_SANG: ${x.ai} · ${x.href}`);
}

console.log(`cau nguon: ${ds.length} · ban chup: ${cache.size}`);
if (sai.length) {
  console.log(`\nFAIL: ${sai.length} cau lop phu se KHONG to sang duoc`);
  sai.slice(0, 20).forEach((s) => console.log('  ' + s));
  process.exit(2);
}
console.log('\nOK: moi cau nguon deu to sang duoc nguyen van trong ban chup trang web phuc vu.');
