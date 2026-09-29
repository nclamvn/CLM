#!/usr/bin/env node
/**
 * gen-kho.mjs · Sinh lib/hub-kho.json (trang Repositories) tu git cua kho gop, tai HEAD luc chay.
 * File nay duoc commit sau khi sinh, nen no ghi commit TRUOC no; trang noi ro dieu do.
 * Khong co git hoac khong co lich su (checkout nong) thi dung, KHONG sinh file rong.
 * Chay: node scripts/gen-kho.mjs
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { dungKho } from '../lib/kho.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
let goc;
try {
  goc = execFileSync('git', ['-C', HERE, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
  const nong = execFileSync('git', ['-C', goc, 'rev-parse', '--is-shallow-repository'], { encoding: 'utf8' }).trim();
  if (nong === 'true') { console.error('KHONG CHAY DUOC: checkout nong (shallow), khong du lich su de dem. Dung fetch-depth: 0.'); process.exit(3); }
} catch (e) {
  console.error(`KHONG CHAY DUOC: khong doc duoc git: ${e.message.split('\n')[0]}`);
  process.exit(3);
}
const kq = dungKho(goc, 'HEAD');
writeFileSync(join(HERE, '..', 'lib', 'hub-kho.json'), JSON.stringify(kq, null, 2) + '\n', 'utf8');
console.log(`KHO: sinh tu ${kq.sinhTu.sha} (${kq.sinhTu.ngay}) · ${kq.tongCommit} commit · ${kq.phan.map((p) => `${p.thuMuc} ${p.soTep} tep`).join(' · ')}`);
