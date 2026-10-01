#!/usr/bin/env node
/**
 * check-don-sac.mjs · Toan bo giao dien .touch la DON SAC (chuan HIVE Editorial, "dark plate").
 *
 * VI SAO CO (29/09/2026): anh Lam chot trang dau den trang, roi yeu cau MOI trang khac (dashboard,
 * Hub, ho so, matching...) cung tone do. He cu co 285 cho ghi mau bao hoa rai trong 10 file (navy,
 * xanh, cyan, tim, vang cam, do). Doi mot lan thi de; giu cho no khong mau lai tung cho mot khi
 * them man moi thi can cong.
 *
 * CONG KIEM (bo chu thich truoc khi quet):
 *   MAU_BAO_HOA   mot ma mau hex/rgb co do bao hoa HSL > 0,12 va chenh kenh > 18 (tuc la co sac do
 *                 nhin thay). Ngoai le: cham thuong hieu #FF3830 / rgba(255, 56, 48, a); va DUY NHAT tep
 *                 styles/mau-du-lieu.css (bang mau du lieu theo nhom cong nghe, them 01/10/2026 khi anh
 *                 Lam cho mau tram tro lai tren do hoa thong tin). Tep do do check-mau-du-lieu.mjs canh:
 *                 khop lib/mau-du-lieu.mjs, tram, du tuong phan, phan biet duoc khi mu mau. Moi noi
 *                 khac muon co mau phai goi var(--nhom-N), khong ghi ma mau.
 *   GRADIENT      radial/linear/conic-gradient lam nen. Duoc phep: repeating-* (hoa van net dut cho
 *                 trang thai "tu choi", chuan HIVE: trang thai bang hoa van) va mask/-webkit-mask.
 *   GLOW          text-shadow khac none; box-shadow lop khong lech ma co do nhoe (quang sang).
 *
 * PHAM VI: styles/*.css, app/ (tru app/dev), components/ (tru components/globe: cong cu thu nghiem
 * chi dung o /dev), lib/tokens.ts. Du lieu sinh (lib/*.json, lib/cncl-*.ts) khong quet.
 *
 * Chay: node scripts/check-don-sac.mjs [--touch <dir .touch>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const TOUCH = resolve(arg('--touch') || join(HERE, '..'));
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };

const BO_QUA = [join(TOUCH, 'app', 'dev'), join(TOUCH, 'components', 'globe')];
const tep = [];
const quet = (d, duoi) => {
  if (!existsSync(d)) return;
  for (const t of readdirSync(d)) {
    const p = join(d, t);
    if (BO_QUA.some((b) => p.startsWith(b)) || t === 'node_modules' || t.startsWith('.')) continue;
    if (statSync(p).isDirectory()) quet(p, duoi); else if (duoi.test(t)) tep.push(p);
  }
};
quet(join(TOUCH, 'styles'), /\.css$/);
quet(join(TOUCH, 'app'), /\.(css|tsx|ts)$/);
quet(join(TOUCH, 'components'), /\.(tsx|ts|css)$/);
if (existsSync(join(TOUCH, 'lib', 'tokens.ts'))) tep.push(join(TOUCH, 'lib', 'tokens.ts'));
if (!tep.length) thoat3(`khong thay tep giao dien nao duoi ${TOUCH}`);

const boChuThich = (s) => s.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
  .split('\n').map((l) => (/^\s*\/\//.test(l) ? '' : l)).join('\n');
const baoHoa = (r, g, b) => {
  const mx = Math.max(r, g, b) / 255; const mn = Math.min(r, g, b) / 255; const l = (mx + mn) / 2;
  if (l <= 0.04 || l >= 0.97 || mx === mn) return false;
  const s = l > 0.5 ? (mx - mn) / (2 - mx - mn) : (mx - mn) / (mx + mn);
  return s > 0.12 && Math.max(r, g, b) - Math.min(r, g, b) > 18;
};
const BANG_MAU = join(TOUCH, 'styles', 'mau-du-lieu.css'); // mien MAU_BAO_HOA, KHONG mien gradient/glow
const laThuongHieu = (l) => /#FF3830\b/i.test(l) || /rgba?\(\s*255\s*,\s*56\s*,\s*48/.test(l);
const ten = (p) => p.slice(TOUCH.length + 1);

const vi = [];
let soDong = 0;
for (const p of tep) {
  const dong = boChuThich(readFileSync(p, 'utf8')).split('\n');
  dong.forEach((l, i) => {
    soDong++;
    const cho = `${ten(p)}:${i + 1}`;
    if (!laThuongHieu(l) && p !== BANG_MAU) {
      for (const m of l.matchAll(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)) {
        const h = m[1].length === 3 ? m[1].split('').map((c) => c + c).join('') : m[1];
        const [r, g, b] = [0, 2, 4].map((k) => parseInt(h.slice(k, k + 2), 16));
        if (baoHoa(r, g, b)) vi.push(`MAU_BAO_HOA: ${cho} ${m[0]}`);
      }
      for (const m of l.matchAll(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/g)) {
        if (baoHoa(+m[1], +m[2], +m[3])) vi.push(`MAU_BAO_HOA: ${cho} ${m[0]})`);
      }
    }
    if (/(?<!repeating-)(radial|linear|conic)-gradient\(/.test(l) && !/mask(-image)?\s*:/.test(l)) vi.push(`GRADIENT: ${cho} ${l.trim().slice(0, 80)}`);
    if (/text-shadow\s*:(?!\s*none\b)/.test(l)) vi.push(`GLOW: ${cho} text-shadow`);
    const bs = l.match(/box-shadow\s*:\s*([^;]+)/);
    if (bs && bs[1].split(/,(?![^(]*\))/).some((x) => /^\s*(inset\s+)?0(px)?\s+0(px)?\s+[1-9]/.test(x))) vi.push(`GLOW: ${cho} box-shadow quang sang`);
  });
}

console.log(`don sac: ${tep.length} tep giao dien · ${soDong} dong`);
if (vi.length) {
  console.log(`\nFAIL: ${vi.length} vi pham`);
  vi.slice(0, 40).forEach((v) => console.log('  ' + v));
  process.exit(2);
}
console.log('\nOK: khung giao dien don sac; mau chi o cham thuong hieu va bang mau du lieu (styles/mau-du-lieu.css). Khong gradient, khong glow.');
