#!/usr/bin/env node
/**
 * bite_tracuu.mjs · Ba rang cua bo sinh file tra cuu.
 *
 * VI SAO CAN (18/08/2026): file tra cuu la thu DUY NHAT trong chuoi nay den thang tay nguoi
 * dung. No chay offline, khong co duong nao di lay lai thu con thieu. Neu no cu sinh ra khi
 * thieu bang chung thi nguoi mo bam vao ten nguon va nhan mot cau xin loi, tuc mot o trong
 * nhin y het nhu da co bang chung. Do la kieu hong te nhat: khong bao loi, chi lam sai.
 *
 * RANG 1 · THIEU BAN CHUP THI DUNG: xoa mot ban chup ma du lieu co tro toi, bo sinh phai
 *          exit 2 va KHONG ghi de file cu.
 * RANG 2 · MAT DAU VAO THI DUNG: giau lib/cncl-match.ts di, phai exit 2 chu khong sinh ra
 *          mot file tra cuu khong co phan match.
 * RANG 3 · KHONG BAO DO OAN: tra nguyen trang thi phai exit 0 va sinh lai duoc.
 *
 * Rang 1 quan trong nhat. Rang 2 va 3 giu cho rang 1 co nghia.
 *
 * Chay: node scripts/bite_tracuu.mjs
 * Exit 0 neu ca ba rang can. Exit 1 neu co rang khong can. Exit 3 neu khong dung duoc canh.
 */
import { readFileSync, writeFileSync, existsSync, unlinkSync, renameSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const GEN = join(HERE, 'gen-tracuu-html.mjs');
const EV = join(TOUCH, 'public', 'evidence');
const LIB = join(TOUCH, 'lib', 'cncl-match.ts');
const MOI = 'vjst_viettel_llm_20260718.txt';

function chay() {
  const r = spawnSync(process.execPath, [GEN], { cwd: TOUCH, encoding: 'utf8' });
  return { rc: r.status, out: (r.stdout || '') + (r.stderr || '') };
}

function raPath() {
  const r = chay();
  const m = r.out.match(/TRA CUU: (.+)/);
  return m ? m[1].trim() : null;
}

const RA = raPath();
if (!RA || !existsSync(RA)) {
  console.error('KHONG CHAY DUOC: chua sinh duoc file tra cuu lan dau.');
  process.exit(3);
}
const banChup = join(EV, MOI);
if (!existsSync(banChup)) {
  console.error(`KHONG CHAY DUOC: thieu ${MOI} de dung canh.`);
  process.exit(3);
}

let ok1 = false, ok2 = false, ok3 = false;
const giuEv = readFileSync(banChup);
const giuLib = readFileSync(LIB);
const truocKichCo = statSync(RA).size;
const truocNoiDung = readFileSync(RA);

try {
  // ── RANG 1 · thieu ban chup thi dung ──────────────────────────────────────
  unlinkSync(banChup);
  let r = chay();
  const khongGhiDe = Buffer.compare(readFileSync(RA), truocNoiDung) === 0;
  ok1 = r.rc === 2 && r.out.includes('[THIEU]') && khongGhiDe;
  console.log(`${'RANG 1 · thieu ban chup thi dung'.padEnd(38)} : ` +
    (ok1 ? 'CAN OK (exit 2, khong ghi de file cu)'
         : `KHONG CAN !! exit${r.rc} ghi_de=${!khongGhiDe}\n${r.out.slice(0, 500)}`));
  writeFileSync(banChup, giuEv);

  // ── RANG 2 · mat dau vao thi dung ─────────────────────────────────────────
  renameSync(LIB, LIB + '.bite');
  r = chay();
  ok2 = r.rc === 2;
  console.log(`${'RANG 2 · mat dau vao thi dung'.padEnd(38)} : ` +
    (ok2 ? 'CAN OK (exit 2, khong sinh ban thieu match)' : `KHONG CAN !! exit${r.rc}`));
  renameSync(LIB + '.bite', LIB);

  // ── RANG 3 · khong bao do oan ─────────────────────────────────────────────
  r = chay();
  ok3 = r.rc === 0 && r.out.includes('ban chup nhung san') && statSync(RA).size >= truocKichCo * 0.9;
  console.log(`${'RANG 3 · khong bao DO oan'.padEnd(38)} : ` +
    (ok3 ? 'CAN OK (exit 0, sinh lai du kich co)' : `KHONG CAN !! exit${r.rc}\n${r.out.slice(-400)}`));
} finally {
  if (!existsSync(banChup)) writeFileSync(banChup, giuEv);
  if (existsSync(LIB + '.bite')) { if (existsSync(LIB)) unlinkSync(LIB); renameSync(LIB + '.bite', LIB); }
  if (!existsSync(LIB)) writeFileSync(LIB, giuLib);
  const cuoi = chay();
  if (cuoi.rc !== 0) {
    console.error(`!! PHUC HOI HONG: chay lai sau khi tra ve van exit${cuoi.rc}\n${cuoi.out.slice(-500)}`);
    process.exit(1);
  }
}

const tatCa = ok1 && ok2 && ok3;
console.log('-'.repeat(62));
console.log('BITE TRA CUU:', tatCa ? 'RANG CAN' : 'CO RANG KHONG CAN');
process.exit(tatCa ? 0 : 1);
