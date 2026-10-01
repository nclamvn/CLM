#!/usr/bin/env node
/**
 * bite-xu-huong.mjs · Rang cua check-xu-huong.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep lib/hub-xu-huong.json vao thu muc tam (mkdtempSync), tiem loi vao BAN SAO;
 * git cua kho that chi duoc DOC.
 *
 * RANG
 * ====
 * RANG 1 · CANH SACH -> exit 0.
 * RANG 2 · thoi phong so don vi ngay dau (44 -> 50) -> XU_HUONG_LECH.
 * RANG 3 · sinhTu la sha bia -> SHA_LA.
 * RANG 4 · bo bot mot ngay giua chuoi -> XU_HUONG_LECH.
 *
 * Chay: node scripts/bite-xu-huong.mjs     Exit 0 moi rang can · 2 co rang khong can.
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CONG = join(HERE, 'check-xu-huong.mjs');
const GOC = join(HERE, '..', 'lib', 'hub-xu-huong.json');
const kq = []; const tam = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(58)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const rang = (nhan, sua, ma, ky) => {
  const t = mkdtempSync(join(tmpdir(), 'bite_xu_huong_')); tam.push(t);
  const x = JSON.parse(readFileSync(GOC, 'utf8'));
  if (sua) sua(x);
  const f = join(t, 'xh.json'); writeFileSync(f, JSON.stringify(x, null, 1) + '\n');
  const r = spawnSync(process.execPath, [CONG, '--file', f], { encoding: 'utf8' });
  inRa(nhan, r.status === ma && (ky ? (r.stdout + r.stderr).includes(ky) : true), `exit ${r.status}`);
};
try {
  rang('RANG 1 · canh sach -> exit 0', null, 0);
  rang('RANG 2 · thoi phong ngay dau -> XU_HUONG_LECH', (x) => { x.diem[0].donVi += 6; }, 2, 'XU_HUONG_LECH');
  rang('RANG 3 · sinhTu bia -> SHA_LA', (x) => { x.sinhTu = 'deadbee'; }, 2, 'SHA_LA');
  rang('RANG 4 · bo mot ngay giua -> XU_HUONG_LECH', (x) => { x.diem.splice(1, 1); }, 2, 'XU_HUONG_LECH');
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE XU HUONG: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
