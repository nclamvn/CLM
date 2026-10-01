#!/usr/bin/env node
/**
 * kiem-ho-so.mjs · Cong cu DOI CHIEU cho nguoi nhan ho so kiem toan (01/10/2026).
 *
 * Doc tep JSON tai tu trang ho so don vi, tinh lai SHA-256 cua dang chuan (lib/kiem-toan.mjs) va so
 * voi ma ghi trong tep. Neu co --ban-chup <thu muc chua cac tep /evidence> thi tinh lai ca dau vet
 * tung ban chup.
 *
 * Chay: node scripts/kiem-ho-so.mjs <ho-so.json> [--ban-chup <thu muc public>]
 * Exit 0 KHOP · 2 LECH · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { dangChuan, PHIEN_BAN } from '../lib/kiem-toan.mjs';

const f = process.argv[2];
if (!f || !existsSync(f)) { console.log('KHONG CHAY DUOC: dung node scripts/kiem-ho-so.mjs <ho-so.json> [--ban-chup <thu muc public>]'); process.exit(3); }
const i = process.argv.indexOf('--ban-chup'); const pub = i > 0 ? process.argv[i + 1] : null;
const hs = JSON.parse(readFileSync(f, 'utf8'));
if (hs.phienBan !== PHIEN_BAN) { console.log(`KHONG CHAY DUOC: phien ban ${hs.phienBan}, cong cu nay doc ${PHIEN_BAN}`); process.exit(3); }
const sha = (t) => createHash('sha256').update(t, 'utf8').digest('hex');
const lech = [];
const tinh = sha(dangChuan(hs.donVi, hs.cauNguon, hs.banChup));
if (tinh !== hs.ma) lech.push(`MA_LECH: tinh lai ${tinh}, tep ghi ${hs.ma}`);
const thieu = [...new Set(hs.cauNguon.map((c) => c.href))].filter((h) => !hs.banChup.some((b) => b.href === h));
if (thieu.length) lech.push(`BAN_CHUP_THIEU: ${thieu.join(', ')}`);
if (pub) for (const b of hs.banChup) {
  const p = join(pub, b.href);
  if (!existsSync(p)) lech.push(`BAN_CHUP_KHONG_CO: ${b.href}`);
  else if (sha(readFileSync(p, 'utf8')) !== b.sha256) lech.push(`BAN_CHUP_LECH: ${b.href}`);
}
console.log(`ho so ${hs.donVi}: ${hs.cauNguon.length} cau nguon · ${hs.banChup.length} ban chup · ma ${hs.ma.slice(0, 12)}`);
if (lech.length) { console.log('\nLECH:'); lech.forEach((x) => console.log('  ' + x)); process.exit(2); }
console.log(`\nKHOP: ho so chua bi sua${pub ? ', ban chup trung dau vet' : ''}.`);
