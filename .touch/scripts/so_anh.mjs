#!/usr/bin/env node
/**
 * so_anh.mjs · So mot anh chup voi ANH MOC, chi ra vung vua doi.
 *
 * VI SAO CAN (24/08/2026): ba lan lien tiep mot loi bo cuc chi lo ra khi render anh roi nhin
 * bang mat, va khong lan nao exit code bao. Te hon, lan thu ba chinh BAN SUA cua toi de ra
 * loi moi: chua tran chu bang cach cho ngat bat ky dau, thanh ra chuoi dinh danh vo giua
 * chu. Mat nguoi la cong duy nhat o day, ma cong do phu thuoc vao viec co ai nho nhin hay
 * khong, va o day con phai nho NGUOI KHAC chay ho.
 *
 * Script nay khong thay mat nguoi. No thu hep cho phai nhin: thay vi soi ca trang, nguoi chi
 * nhin vung ma may bao la vua doi.
 *
 * KHONG DUNG THU VIEN NGOAI: tu giai PNG bang zlib co san. Them mot goi npm cho viec nay la
 * them mot thu co the hong o may kia, dung cai bay da vap hom nay voi /sessions.
 *
 * Dung:
 *   node scripts/so_anh.mjs <anh.png> <moc.png>     so va bao
 *   node scripts/so_anh.mjs --chot <anh.png> <moc.png>   chot anh hien tai lam moc
 *
 * Exit 0 neu giong moc trong nguong. Exit 2 neu khac. Exit 3 neu KHONG SO DUOC.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { inflateSync } from 'node:zlib';

// Nguong: bao nhieu phan tram diem anh duoc phep khac ma van coi la giong. Khong dat 0 vi
// chu render co the lech mot diem giua hai lan chay tren cung may. Nhung dat rat thap, vi
// moi loi bo cuc that deu lam doi hang nghin diem.
const NGUONG_PHAN_TRAM = 0.02;
const NGUONG_KENH = 8; // lech mau duoi muc nay coi nhu nhieu render

function docPNG(duong) {
  const b = readFileSync(duong);
  if (b.readUInt32BE(0) !== 0x89504e47) throw new Error(`${duong} khong phai PNG`);
  let i = 8, w = 0, h = 0, sauBit = 0, loaiMau = 0, xenKe = 0;
  const idat = [];
  while (i < b.length) {
    const len = b.readUInt32BE(i);
    const ten = b.toString('ascii', i + 4, i + 8);
    const du = b.subarray(i + 8, i + 8 + len);
    if (ten === 'IHDR') {
      w = du.readUInt32BE(0); h = du.readUInt32BE(4);
      sauBit = du[8]; loaiMau = du[9]; xenKe = du[12];
    } else if (ten === 'IDAT') idat.push(du);
    else if (ten === 'IEND') break;
    i += 12 + len;
  }
  if (sauBit !== 8 || xenKe !== 0 || (loaiMau !== 6 && loaiMau !== 2)) {
    throw new Error(`${duong}: PNG dang chua doc duoc (sauBit=${sauBit} loaiMau=${loaiMau} xenKe=${xenKe})`);
  }
  const kenh = loaiMau === 6 ? 4 : 3;
  const raw = inflateSync(Buffer.concat(idat));
  const buoc = w * kenh;
  const ra = Buffer.alloc(h * buoc);
  let p = 0;
  for (let y = 0; y < h; y++) {
    const loc = raw[p++];
    const dong = raw.subarray(p, p + buoc); p += buoc;
    const tren = y > 0 ? ra.subarray((y - 1) * buoc, y * buoc) : null;
    const cur = ra.subarray(y * buoc, (y + 1) * buoc);
    for (let x = 0; x < buoc; x++) {
      const a = x >= kenh ? cur[x - kenh] : 0;
      const bb = tren ? tren[x] : 0;
      const c = tren && x >= kenh ? tren[x - kenh] : 0;
      let v = dong[x];
      if (loc === 1) v += a;
      else if (loc === 2) v += bb;
      else if (loc === 3) v += (a + bb) >> 1;
      else if (loc === 4) {
        const pr = a + bb - c, pa = Math.abs(pr - a), pb = Math.abs(pr - bb), pc = Math.abs(pr - c);
        v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? bb : c);
      }
      cur[x] = v & 0xff;
    }
  }
  return { w, h, kenh, px: ra };
}

const args = process.argv.slice(2);
if (args[0] === '--chot') {
  const [, anh, moc] = args;
  if (!existsSync(anh)) { console.error(`KHONG CHOT DUOC: thieu ${anh}`); process.exit(3); }
  mkdirSync(dirname(moc), { recursive: true });
  writeFileSync(moc, readFileSync(anh));
  console.log(`CHOT MOC: ${moc}`);
  process.exit(0);
}

const [anh, moc] = args;
if (!anh || !moc) { console.error('usage: so_anh.mjs <anh.png> <moc.png> | --chot <anh.png> <moc.png>'); process.exit(3); }
if (!existsSync(anh)) { console.error(`KHONG SO DUOC: thieu anh ${anh}`); process.exit(3); }
if (!existsSync(moc)) {
  // Vang moc KHONG duoc coi la dat. Cung luat voi cac cong khac trong chuoi.
  console.error(`KHONG SO DUOC: chua co moc ${moc}. Chot bang: node scripts/so_anh.mjs --chot ${anh} ${moc}`);
  process.exit(3);
}

let a, m;
try { a = docPNG(anh); m = docPNG(moc); }
catch (e) { console.error(`KHONG SO DUOC: ${e.message}`); process.exit(3); }

if (a.w !== m.w || a.h !== m.h) {
  console.error(`KHAC KICH THUOC: ${a.w}x${a.h} so voi moc ${m.w}x${m.h}. Chup lai cung viewport truoc khi so.`);
  process.exit(2);
}

let khac = 0, x0 = a.w, y0 = a.h, x1 = -1, y1 = -1;
const k = Math.min(a.kenh, m.kenh);
for (let y = 0; y < a.h; y++) {
  for (let x = 0; x < a.w; x++) {
    const ia = (y * a.w + x) * a.kenh, im = (y * m.w + x) * m.kenh;
    let lech = 0;
    for (let c = 0; c < k; c++) lech = Math.max(lech, Math.abs(a.px[ia + c] - m.px[im + c]));
    if (lech > NGUONG_KENH) {
      khac++;
      if (x < x0) x0 = x; if (x > x1) x1 = x;
      if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
  }
}

const pt = (100 * khac) / (a.w * a.h);
const ten = anh.split('/').pop();
if (khac === 0) { console.log(`${ten}: TRUNG MOC tuyet doi`); process.exit(0); }
if (pt <= NGUONG_PHAN_TRAM) {
  console.log(`${ten}: trong nguong (${pt.toFixed(3)}% diem khac, nguong ${NGUONG_PHAN_TRAM}%)`);
  process.exit(0);
}
console.log(`${ten}: KHAC MOC · ${pt.toFixed(3)}% diem khac`);
console.log(`  vung doi: x ${x0}..${x1} · y ${y0}..${y1}  (rong ${x1 - x0 + 1}, cao ${y1 - y0 + 1})`);
console.log('  Doi la binh thuong khi vua sua UI hoac du lieu doi. Nhin vung tren, dung nhin ca trang.');
console.log(`  Neu dung y thi chot lai: node scripts/so_anh.mjs --chot ${anh} ${moc}`);
process.exit(2);
