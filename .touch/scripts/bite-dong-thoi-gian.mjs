#!/usr/bin/env node
/**
 * bite-dong-thoi-gian.mjs · Rang cua check-dong-thoi-gian.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep lib/hub-ho-so.json va lib/dong-thoi-gian.mjs vao thu muc tam
 * (mkdtempSync), tiem loi vao BAN SAO cua module bo tri (va mot lan vao ban sao du lieu).
 * File that khong bi cham. Moi phep tiem la mot loi bo tri co that (bo xet va cham, uoc luong
 * rong qua hep, an het nhan, bo neo phai, nuot cham) nen du lieu doi thi rang van can.
 *
 * RANG
 * ====
 * RANG 1 · canh sach -> exit 0.
 * RANG 2 · bo xet va cham (nhan nao cung hang 0) -> NHAN_CHONG.
 * RANG 3 · uoc luong rong mot ky tu qua hep (2) -> NHAN_CHONG (cong dung uoc luong rieng).
 * RANG 4 · SO_HANG = 0 (an het nhan de qua cong) -> NHAN_AN_NHIEU.
 * RANG 5 · bo neo phai + them mot cham dung ngay moc do -> NHAN_TRAN.
 * RANG 6 · module nuot mot cham -> THIEU_DIEM.
 *
 * Chay: node scripts/bite-dong-thoi-gian.mjs     Exit 0 moi rang can · 2 co rang khong can.
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const LIB = join(HERE, '..', 'lib');
const CONG = join(HERE, 'check-dong-thoi-gian.mjs');
const kq = []; const tam = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(60)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const canh = () => {
  const t = mkdtempSync(join(tmpdir(), 'bite_dong_thoi_gian_')); tam.push(t);
  mkdirSync(join(t, 'lib'));
  for (const f of ['hub-ho-so.json', 'dong-thoi-gian.mjs']) copyFileSync(join(LIB, f), join(t, 'lib', f));
  return t;
};
const chay = (t) => { const r = spawnSync(process.execPath, [CONG, '--ho-so', join(t, 'lib', 'hub-ho-so.json'), '--mo-dun', join(t, 'lib', 'dong-thoi-gian.mjs')], { encoding: 'utf8' }); return { rc: r.status, out: r.stdout + r.stderr }; };
/** Thay moc trong ban sao module; neu moc khong con thi rang bao KHONG TIEM DUOC thay vi can gia. */
const tiem = (t, cu, moi) => {
  const p = join(t, 'lib', 'dong-thoi-gian.mjs'); const s = readFileSync(p, 'utf8');
  if (!s.includes(cu)) return false; writeFileSync(p, s.replace(cu, moi)); return true;
};
const thu = (nhan, ma, buoc) => {
  const t = canh(); if (!buoc(t)) { inRa(nhan, false, 'KHONG TIEM DUOC'); return; }
  const r = chay(t); inRa(nhan, r.rc === 2 && r.out.includes(ma), `exit ${r.rc}`);
};

try {
  const r = chay(canh());
  inRa('RANG 1 · canh sach -> exit 0', r.rc === 0, `exit ${r.rc}`);
  thu('RANG 2 · bo xet va cham -> NHAN_CHONG', 'NHAN_CHONG', (t) => tiem(t, 'if (chan.some((c) => giao(c, hop)) || daDat.some((c) => giao(c, hop))) continue;', ''));
  thu('RANG 3 · uoc luong rong qua hep -> NHAN_CHONG', 'NHAN_CHONG', (t) => tiem(t, 'export const RONG_KY_TU = 6.6;', 'export const RONG_KY_TU = 2;'));
  thu('RANG 4 · an het nhan -> NHAN_AN_NHIEU', 'NHAN_AN_NHIEU', (t) => tiem(t, 'export const SO_HANG = 3;', 'export const SO_HANG = 0;'));
  thu('RANG 5 · bo neo phai, cham sat moc -> NHAN_TRAN', 'NHAN_TRAN', (t) => {
    if (!tiem(t, "p.x + rong / 2 > W - 2 ? 'end'", "false ? 'end'")) return false;
    const p = join(t, 'lib', 'hub-ho-so.json'); const d = JSON.parse(readFileSync(p, 'utf8'));
    d.units[0].dongThoiGian.push({ ngay: d.meta.mocNgay, loai: 'nguon_dang', nguon: 'mot-nguon-ten-rat-dai.example.vn', soCau: 3 });
    writeFileSync(p, JSON.stringify(d)); return true;
  });
  thu('RANG 6 · module nuot mot cham -> THIEU_DIEM', 'THIEU_DIEM', (t) => tiem(t, 'if (!ds.length) return null;', 'if (ds.length > 1) ds.pop(); if (!ds.length) return null;'));
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE DONG THOI GIAN: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
