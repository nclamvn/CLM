#!/usr/bin/env node
/**
 * check-xu-huong.mjs · Duong xu huong tren trang Tong quan phai dung bang lich su git, tai dung
 * commit ghi trong lib/hub-xu-huong.json.
 *
 * CONG KIEM:
 *   XU_HUONG_LECH  tinh lai bang lib/xu-huong.mjs tu git tai sinhTu, khac file da sinh.
 *   SHA_LA         sinhTu khong phai to tien cua HEAD (file sinh tu mot nhanh khac hoac sha bia).
 *   DIEM_CUOI_LECH diem cuoi khac so lieu hien hanh cua lib/cncl-registry.json, cncl-match.json ma
 *                  hai file nay chua doi ke tu sinhTu (tuc file xu huong da cu ma khong ai sinh lai).
 * KHONG CHAY DUOC khi khong co git hoac checkout nong.
 *
 * Chay: node scripts/check-xu-huong.mjs [--file <hub-xu-huong.json>]     Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { dungXuHuong, DUONG_DU_LIEU } from '../lib/xu-huong.mjs';
import { docLichSu } from './gen-xu-huong.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
const F = arg('--file') || join(HERE, '..', 'lib', 'hub-xu-huong.json');
if (!existsSync(F)) thoat3('thieu lib/hub-xu-huong.json (chay scripts/gen-xu-huong.mjs)');
const git = (goc, ...a) => execFileSync('git', ['-C', goc, ...a], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
let goc;
try {
  goc = git(HERE, 'rev-parse', '--show-toplevel').trim();
  if (git(goc, 'rev-parse', '--is-shallow-repository').trim() === 'true') thoat3('checkout nong, khong du lich su');
} catch (e) { thoat3(`khong doc duoc git: ${e.message.split('\n')[0]}`); }
const xh = JSON.parse(readFileSync(F, 'utf8'));
const vi = [];
let toTien = true;
try { execFileSync('git', ['-C', goc, 'merge-base', '--is-ancestor', xh.sinhTu, 'HEAD']); } catch { toTien = false; vi.push(`SHA_LA: sinhTu ${xh.sinhTu} khong phai to tien cua HEAD`); }
if (toTien) {
  const lai = dungXuHuong(docLichSu(goc, xh.sinhTu), xh.sinhTu);
  if (JSON.stringify(lai) !== JSON.stringify(xh)) vi.push(`XU_HUONG_LECH: file khac ban tinh lai tu git tai ${xh.sinhTu}`);
  // Du lieu da doi sau sinhTu ma chua commit lai xu huong thi khong phai loi o day: diem moi se co
  // o lan sinh ke tiep. Nhung neu du lieu KHONG doi ma diem cuoi van khac so hien hanh thi la bia.
  const doiSau = git(goc, 'log', '--format=%h', `${xh.sinhTu}..HEAD`, '--', ...DUONG_DU_LIEU).trim();
  const dangSua = git(goc, 'status', '--porcelain', '--', ...DUONG_DU_LIEU).trim();
  if (!doiSau && !dangSua && xh.diem.length) {
    const reg = JSON.parse(readFileSync(join(goc, DUONG_DU_LIEU[0]), 'utf8'));
    const mat = JSON.parse(readFileSync(join(goc, DUONG_DU_LIEU[1]), 'utf8'));
    const cuoi = xh.diem[xh.diem.length - 1];
    if (cuoi.donVi !== reg.units.length || cuoi.matchDaKy !== mat.signedMatches.length) vi.push(`DIEM_CUOI_LECH: diem cuoi ${cuoi.donVi} don vi / ${cuoi.matchDaKy} match, hien hanh ${reg.units.length} / ${mat.signedMatches.length}`);
  }
}
console.log(`xu huong: ${xh.diem.length} ngay · sinh tu ${xh.sinhTu}`);
if (vi.length) { console.log(`\nFAIL: ${vi.length} vi pham`); vi.forEach((v) => console.log('  ' + v)); process.exit(2); }
console.log('\nOK: duong xu huong dung bang lich su git tai commit ghi lai.');
