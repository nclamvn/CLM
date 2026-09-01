/**
 * chup_va_do.mjs · Chup moi khung hinh trong moc_anh.json VA do vung phu that su.
 *
 * VI SAO CO (24/08/2026): them mot tag len 9 the, chup lai, phep so anh bao "TRUNG MOC tuyet
 * doi". Khong sai: anh moc chi chup khung nhin dau tien, danh sach xep theo bang chu cai, ca
 * 9 don vi do nam duoi day. Phep so khong nhin toi do va im lang dung luc can keu.
 *
 * Nen script nay khong chi chup. Sau moi lan chup no HOI TRINH DUYET: nhung the don vi nao
 * that su nam trong khung hinh vua chup. Do bang bounding box, khong doan.
 *
 * Ket qua ghi ra reports/phu_moc.json de mot cong KHONG CAN TRINH DUYET (check-phu-moc.mjs)
 * doc lai trong chuoi cong thuong ngay. File do co kem dau van tay cua registry, nen neu
 * registry doi ma khong ai chup lai thi cong bao KHONG CHAY DUOC, khong bao XANH.
 *
 * Chay: node scripts/chup_va_do.mjs <base-url> [--chot]
 *   --chot : chot luon anh vua chup lam moc moi (dung sau khi da NHIN bang mat).
 */
import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const TOUCH = dirname(dirname(fileURLToPath(import.meta.url)));
const base = (process.argv[2] || 'http://localhost:3000').replace(/\/$/, '');
const chot = process.argv.includes('--chot');

const cfg = JSON.parse(readFileSync(join(TOUCH, 'scripts', 'moc_anh.json'), 'utf8'));
const RP = join(TOUCH, 'reports');
mkdirSync(join(RP, 'moc'), { recursive: true });

// Tap don vi that su co trong registry, lay tu file SINH RA chu khong go tay.
// DOC BAN JSON SONG SINH, KHONG BOC MANG RA KHOI FILE .ts BANG REGEX (sua 25/08/2026).
// Boc bang regex la doan ranh gioi cua mot cau truc bang mat chu: no van rut duoc mot manh
// hop le tu mot file da hong, va cong se XANH HON CA PARSER. Ban JSON do gen-cncl-data.mjs
// sinh ra canh ban .ts, va cong check-lib-song-sinh.mjs canh hai ban luon khop.
const libP = join(TOUCH, 'lib', 'cncl-registry.json');
if (!existsSync(libP)) { console.error('KHONG CHAY DUOC: chua sinh lib/cncl-registry.json'); process.exit(3); }
const tenDonVi = JSON.parse(readFileSync(libP, 'utf8')).units.map((u) => u.name);
const vanTay = createHash('sha256').update(tenDonVi.slice().sort().join('|')).digest('hex').slice(0, 16);

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1536, height: 1024 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();

const phu = new Set();
const theoKhung = {};

for (const k of cfg.khung) {
  await page.goto(base + k.duong, { waitUntil: 'networkidle', timeout: 45000 });
  await page.addStyleTag({
    content: 'nextjs-portal,[data-nextjs-toast],#__next-build-watcher,[class*="claude-agent"],[class*="glow-border"],[data-automation-overlay]{display:none!important}',
  });
  if (k.loc) {
    const o = page.locator('input[type="search"], input').first();
    await o.fill(k.loc);
    await page.waitForTimeout(500);
  }
  try { await page.evaluate(() => document.fonts.ready); } catch { /* font khong san sang, khong phai loi */ }
  await page.waitForTimeout(700);
  const ra = join(RP, `${k.ten}.png`);
  const toanTrang = k.toan_trang === true;
  await page.screenshot({ path: ra, fullPage: toanTrang });

  // The nao THAT SU nam trong anh. Voi anh cat theo khung nhin thi chi tinh phan giao voi
  // viewport: the nam duoi man hinh khong co trong anh nen khong duoc anh moc canh giu.
  // Voi anh toan trang thi ca chieu dai tai lieu deu vao anh, nen moi the deu duoc canh.
  const thay = await page.evaluate((ca) => {
    const ds = [];
    for (const el of document.querySelectorAll('.reg-unit')) {
      const r = el.getBoundingClientRect();
      const trong = ca || (r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth);
      const ten = el.querySelector('.reg-unit__name')?.textContent?.trim();
      if (trong && ten) ds.push(ten);
    }
    return ds;
  }, toanTrang);
  theoKhung[k.ten] = thay;
  for (const t of thay) phu.add(t);
  console.log(`  ${k.ten.padEnd(16)} · ${String(thay.length).padStart(2)} the trong khung · ${ra}`);
}

await browser.close();

const thieu = tenDonVi.filter((t) => !phu.has(t));
const ket = {
  ngay: new Date().toISOString().slice(0, 10),
  van_tay_registry: vanTay,
  tong_don_vi: tenDonVi.length,
  phu: [...phu].sort(),
  thieu,
  theo_khung: theoKhung,
};
writeFileSync(join(RP, 'phu_moc.json'), JSON.stringify(ket, null, 2) + '\n');
console.log(`\nVUNG PHU: ${phu.size}/${tenDonVi.length} don vi co it nhat mot anh moc canh giu`);
if (thieu.length) console.log(`  chua co anh moc nao: ${thieu.length} don vi`);

if (chot) {
  const { execFileSync } = await import('node:child_process');
  for (const k of cfg.khung) {
    execFileSync(process.execPath, [join(TOUCH, 'scripts', 'so_anh.mjs'), '--chot',
      join(RP, `${k.ten}.png`), join(RP, 'moc', `${k.ten}.png`)], { stdio: 'inherit' });
  }
}
