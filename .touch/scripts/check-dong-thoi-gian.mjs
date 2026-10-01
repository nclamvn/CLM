#!/usr/bin/env node
/**
 * check-dong-thoi-gian.mjs · Dong thoi gian tren moi ho so don vi khong duoc co nhan de len nhau,
 * de len cham, tran khung, va khong duoc an nhan hang loat de "qua cong".
 *
 * VI SAO CO (01/10/2026): anh chup ho so FPT cho thay nhan "24/11/2025 ..." va "10/07/2026 ..." de
 * len nhau thanh mot dong chu khong doc duoc. Loi nay khong cong nao bat vi bo tri song trong JSX.
 * Nay bo tri o lib/dong-thoi-gian.mjs; cong nay do lai hinh hoc DOC LAP: tu dung hop bao cua tung
 * nhan bang uoc luong rong cua rieng no (RONG), khong dung hop ma module tu tinh.
 *
 * CONG KIEM:
 *   NHAN_CHONG     hai nhan dang hien co hop bao cat nhau.
 *   NHAN_DE_CHAM   mot nhan de len mot cham (ban kinh 6).
 *   NHAN_TRAN      nhan ra ngoai khung ve (0..W, 0..H).
 *   NHAN_AN_NHIEU  qua 10% so cham bi an nhan (chong viec an het nhan de qua cong).
 *   THIEU_DIEM     so cham khac so cap (ngay, loai) khac nhau dem doc lap tu du lieu ho so.
 *
 * Chay: node scripts/check-dong-thoi-gian.mjs [--ho-so <hub-ho-so.json>] [--mo-dun <dong-thoi-gian.mjs>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const HO_SO = resolve(arg('--ho-so') || join(HERE, '..', 'lib', 'hub-ho-so.json'));
const MO_DUN = resolve(arg('--mo-dun') || join(HERE, '..', 'lib', 'dong-thoi-gian.mjs'));
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
if (!existsSync(HO_SO)) thoat3(`thieu ${HO_SO}`);
if (!existsSync(MO_DUN)) thoat3(`thieu ${MO_DUN}`);
const D = JSON.parse(readFileSync(HO_SO, 'utf8'));
const { xepDongThoiGian } = await import(pathToFileURL(MO_DUN).href + '?t=' + Date.now());

const RONG = 6.4;           // uoc luong rieng cua cong: rong trung binh mot ky tu Inter 12px
const CAO = 12;
const ngayVN = (s) => s.split('-').reverse().join('/');
const giao = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;
const hopNhan = (p) => {
  const r = p.nhan.length * RONG;
  const x0 = p.neo === 'end' ? p.x - r : p.neo === 'start' ? p.x : p.x - r / 2;
  return { x0, x1: x0 + r, y0: p.yChu - CAO + 3, y1: p.yChu + 2 };
};

const vi = []; let tongCham = 0; let tongAn = 0;
for (const u of D.units) {
  const bt = xepDongThoiGian(u.dongThoiGian, D.meta.mocNgay, ngayVN);
  const doc = new Set(u.dongThoiGian.map((d) => `${d.ngay}|${d.loai}`)).size;
  const soCham = bt ? bt.diem.length : 0;
  if (soCham !== doc) vi.push(`THIEU_DIEM: ${u.ten} ve ${soCham} cham, du lieu co ${doc} cap (ngay, loai)`);
  if (!bt) continue;
  tongCham += bt.diem.length; tongAn += bt.diem.filter((p) => p.hang < 0).length;
  const hien = bt.diem.filter((p) => p.hang >= 0).map((p) => ({ p, h: hopNhan(p) }));
  const cham = bt.diem.map((p) => ({ x0: p.x - 6, x1: p.x + 6, y0: p.y - 6, y1: p.y + 6 }));
  for (let i = 0; i < hien.length; i++) {
    const { p, h } = hien[i];
    if (h.x0 < 0 || h.x1 > bt.W || h.y0 < 0 || h.y1 > bt.H) vi.push(`NHAN_TRAN: ${u.ten} · "${p.nhan}"`);
    for (let j = i + 1; j < hien.length; j++) if (giao(h, hien[j].h)) vi.push(`NHAN_CHONG: ${u.ten} · "${p.nhan}" de "${hien[j].p.nhan}"`);
    if (cham.some((c) => giao(c, h))) vi.push(`NHAN_DE_CHAM: ${u.ten} · "${p.nhan}"`);
  }
}
if (tongCham && tongAn / tongCham > 0.1) vi.push(`NHAN_AN_NHIEU: ${tongAn}/${tongCham} cham bi an nhan (tran 10%)`);

console.log(`dong thoi gian: ${D.units.length} ho so · ${tongCham} cham · ${tongAn} an nhan`);
if (vi.length) { console.log(`\nFAIL: ${vi.length} vi pham`); vi.slice(0, 30).forEach((v) => console.log('  ' + v)); process.exit(2); }
console.log('\nOK: moi nhan dong thoi gian dung rieng, khong de cham, khong tran khung.');
