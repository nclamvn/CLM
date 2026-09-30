#!/usr/bin/env node
/**
 * bite-phu-thuoc.mjs · Rang cua check-phu-thuoc.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep package.json va package-lock.json vao thu muc tam (mkdtempSync), tiem loi
 * vao BAN SAO cua lockfile. Khong cai goi nao, khong sua file that.
 *
 * RANG
 * ====
 * RANG 1 · CANH SACH -> exit 0. Canh sach ma exit 3 (mat mang) thi ca bo rang KHONG CHAY DUOC,
 *          khong duoc bao rang nao "khong can" vi mot ly do khong lien quan toi cong.
 * RANG 2 · lockfile ghi next 15.5.20 (ban co lo hong nghiem trong 30/09/2026) -> LO_HONG, exit 2.
 * RANG 3 · lockfile ghi js-yaml 4.3.0 (muc high, goi gian tiep) -> LO_HONG, exit 2.
 * RANG 4 · cung canh rang 3 voi --nguong critical -> exit 0 va IN js-yaml o muc GHI NHAN
 *          (duoi nguong thi hien ra, khong bi nuot).
 * RANG 5 · registry khong toi duoc -> exit 3, KHONG duoc exit 0.
 * RANG 6 · thieu package-lock.json -> exit 3.
 *
 * Chay: node scripts/bite-phu-thuoc.mjs     Exit 0 moi rang can · 2 co rang khong can · 3 khong chay duoc.
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync, copyFileSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const CONG = join(HERE, 'check-phu-thuoc.mjs');
const kq = []; const tam = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(62)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const canh = (sua) => {
  const t = mkdtempSync(join(tmpdir(), 'bite_phu_thuoc_')); tam.push(t);
  for (const f of ['package.json', 'package-lock.json']) copyFileSync(join(TOUCH, f), join(t, f));
  if (sua) sua(t);
  return t;
};
const doiBan = (goi, ban) => (t) => {
  const p = join(t, 'package-lock.json'); const l = JSON.parse(readFileSync(p, 'utf8'));
  const k = `node_modules/${goi}`;
  if (!l.packages?.[k]) throw new Error(`KHONG TIEM DUOC: lockfile khong co ${k}`);
  l.packages[k].version = ban; writeFileSync(p, JSON.stringify(l, null, 2));
};
const chay = (t, them = [], env = {}) => {
  const r = spawnSync(process.execPath, [CONG, '--dir', t, ...them], { encoding: 'utf8', env: { ...process.env, ...env } });
  return { rc: r.status, out: r.stdout + r.stderr };
};
const rang = (nhan, sua, ma, ky, them, env) => {
  let r; try { r = chay(canh(sua), them, env); } catch (e) { inRa(nhan, false, e.message); return; }
  inRa(nhan, r.rc === ma && (ky ? r.out.includes(ky) : true), `exit ${r.rc}`);
};

let khongChay = false;
try {
  const s = chay(canh(null));
  if (s.rc === 3) {
    khongChay = true;
    console.log(`KHONG CHAY DUOC: canh sach khong hoi duoc co so du lieu lo hong.\n${s.out.trim().split('\n').slice(-2).join('\n')}`);
  } else {
    inRa('RANG 1 · canh sach -> exit 0', s.rc === 0 && s.out.includes('OK:'), `exit ${s.rc}`);
    rang('RANG 2 · lockfile ghi next 15.5.20 -> LO_HONG', doiBan('next', '15.5.20'), 2, 'LO_HONG: next');
    rang('RANG 3 · lockfile ghi js-yaml 4.3.0 (gian tiep) -> LO_HONG', doiBan('js-yaml', '4.3.0'), 2, 'LO_HONG: js-yaml');
    rang('RANG 4 · nhu rang 3, nguong critical -> 0 va GHI NHAN', doiBan('js-yaml', '4.3.0'), 0, 'GHI NHAN', ['--nguong', 'critical']);
    rang('RANG 5 · registry khong toi duoc -> exit 3, khong phai 0', null, 3, 'KHONG CHAY DUOC', [],
      { npm_config_registry: 'http://127.0.0.1:9/', npm_config_fetch_retries: '0', npm_config_fetch_timeout: '3000', npm_config_offline: 'false' });
    rang('RANG 6 · thieu package-lock.json -> exit 3', (t) => unlinkSync(join(t, 'package-lock.json')), 3, 'KHONG CHAY DUOC');
  }
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
if (khongChay) process.exit(3);
const can = kq.filter(Boolean).length;
console.log(`\nBITE PHU THUOC: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
