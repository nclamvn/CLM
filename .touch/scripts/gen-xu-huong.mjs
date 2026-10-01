#!/usr/bin/env node
/**
 * gen-xu-huong.mjs · Sinh lib/hub-xu-huong.json tu lich su git cua lib/cncl-registry.json va
 * lib/cncl-match.json, tinh toi COMMIT CUOI CUNG DA DOI HAI FILE NAY (khong phai HEAD: neu lay HEAD
 * thi moi commit lai lam file doi, commit tiep lai doi, vong khong dung). Ghi lai sha de cong
 * check-xu-huong.mjs tinh lai dung cho do. Chay lai khi du lieu khong doi thi file y nguyen.
 * Khong co git hoac checkout nong thi KHONG CHAY DUOC, khong sinh file rong.
 *
 * Chay: node scripts/gen-xu-huong.mjs [--toi <sha>] [--ra <file>]     Exit 0 xong · 3 KHONG CHAY DUOC.
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { dungXuHuong, DUONG_DU_LIEU } from '../lib/xu-huong.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
const git = (goc, ...a) => execFileSync('git', ['-C', goc, ...a], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });

export function docLichSu(goc, toi) {
  const dong = git(goc, 'log', '--reverse', '--format=%H %cI', toi, '--', ...DUONG_DU_LIEU).trim().split('\n').filter(Boolean);
  return dong.map((l) => {
    const [sha, luc] = l.split(' ');
    const show = (p) => { try { return JSON.parse(git(goc, 'show', `${sha}:${p}`)); } catch { return null; } };
    return { sha, luc, reg: show(DUONG_DU_LIEU[0]), mat: show(DUONG_DU_LIEU[1]) };
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  let goc;
  try {
    goc = git(HERE, 'rev-parse', '--show-toplevel').trim();
    if (git(goc, 'rev-parse', '--is-shallow-repository').trim() === 'true') thoat3('checkout nong, khong du lich su (CI can fetch-depth 0)');
  } catch (e) { thoat3(`khong doc duoc git: ${e.message.split('\n')[0]}`); }
  const toi = arg('--toi') || git(goc, 'log', '-1', '--format=%H', 'HEAD', '--', ...DUONG_DU_LIEU).trim();
  if (!toi) thoat3('chua co commit nao cham du lieu');
  const xh = dungXuHuong(docLichSu(goc, toi), toi.slice(0, 7));
  const ra = arg('--ra') || join(HERE, '..', 'lib', 'hub-xu-huong.json');
  writeFileSync(ra, JSON.stringify(xh, null, 1) + '\n');
  const a = xh.diem[0]; const b = xh.diem[xh.diem.length - 1];
  console.log(`XU HUONG: ${xh.diem.length} ngay · ${a?.ngay} -> ${b?.ngay} · don vi ${a?.donVi} -> ${b?.donVi} · match ${a?.matchDaKy} -> ${b?.matchDaKy} · sinh tu ${xh.sinhTu}`);
}
