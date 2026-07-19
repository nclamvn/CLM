#!/usr/bin/env node
/* Pha 1: so sanh capture vs mock da duyet. Tao side-by-side, overlay 50%, diff mask.
   KHONG resize mock hoac capture (yeu cau: ca hai deu 1536x1024). Dung sharp.
   Diff mask chi tham khao (mock co glow/line-art), gate that dua tren geometry review.
   Chay: node scripts/compare-mock.mjs <mock.png> <capture.png> <outdir> */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const [mockPath, capPath, outDir = 'reports/pha1'] = process.argv.slice(2);
if (!mockPath || !capPath) { console.error('usage: compare-mock.mjs <mock> <capture> [outdir]'); process.exit(1); }
mkdirSync(outDir, { recursive: true });

const A = sharp(mockPath), B = sharp(capPath);
const ma = await A.metadata(), mb = await B.metadata();
if (ma.width !== mb.width || ma.height !== mb.height) {
  console.error(`KICH THUOC LECH: mock ${ma.width}x${ma.height} vs capture ${mb.width}x${mb.height} - KHONG resize, dung dung 1536x1024`);
  process.exit(2);
}
const W = ma.width, H = ma.height;

// side-by-side (mock | capture)
await sharp({ create: { width: W * 2 + 8, height: H, channels: 3, background: '#000' } })
  .composite([{ input: mockPath, left: 0, top: 0 }, { input: capPath, left: W + 8, top: 0 }])
  .png().toFile(join(outDir, 'side-by-side.png'));

// overlay 50% (capture mo tren mock)
const capSemi = await sharp(capPath).ensureAlpha(0.5).png().toBuffer();
await sharp(mockPath).composite([{ input: capSemi, blend: 'over' }]).png().toFile(join(outDir, 'overlay-50.png'));

// diff mask + metric
const rawA = await sharp(mockPath).removeAlpha().raw().toBuffer();
const rawB = await sharp(capPath).removeAlpha().raw().toBuffer();
const mask = Buffer.alloc(W * H * 3);
const TH = 32; // nguong chenh RGB coi la khac (bo qua glow nhe)
let diff = 0;
for (let i = 0; i < W * H; i++) {
  const o = i * 3;
  const d = Math.abs(rawA[o] - rawB[o]) + Math.abs(rawA[o + 1] - rawB[o + 1]) + Math.abs(rawA[o + 2] - rawB[o + 2]);
  if (d > TH) { diff++; mask[o] = 255; mask[o + 1] = 0; mask[o + 2] = 80; }
  else { mask[o] = rawA[o] >> 2; mask[o + 1] = rawA[o + 1] >> 2; mask[o + 2] = rawA[o + 2] >> 2; }
}
await sharp(mask, { raw: { width: W, height: H, channels: 3 } }).png().toFile(join(outDir, 'diff-mask.png'));
console.log(`side-by-side.png / overlay-50.png / diff-mask.png -> ${outDir}`);
console.log(`pixel khac (nguong ${TH}): ${diff}/${W * H} = ${(100 * diff / (W * H)).toFixed(2)}% (tham khao, khong phai gate)`);
