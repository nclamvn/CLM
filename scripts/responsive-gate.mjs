// Responsive gate: chup 5 viewport, kiem horizontal overflow. Chay: node scripts/responsive-gate.mjs
import { chromium } from 'playwright';

const viewports = [
  { name: 'desktop-xl', width: 1536, height: 1024 },
  { name: 'laptop', width: 1366, height: 768 },
  { name: 'tablet-landscape', width: 1024, height: 768 },
  { name: 'tablet-portrait', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

const browser = await chromium.launch();
let fail = 0;
for (const v of viewports) {
  const ctx = await browser.newContext({ viewport: { width: v.width, height: v.height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle', timeout: 45000 });
  await page.addStyleTag({ content: 'nextjs-portal,[data-nextjs-toast],#__next-build-watcher{display:none!important}' });
  try { await page.evaluate(() => document.fonts.ready); } catch {}
  await page.waitForTimeout(500);
  const overflow = await page.evaluate(() =>
    document.documentElement.scrollWidth > document.documentElement.clientWidth);
  await page.screenshot({ path: `reports/dash-${v.name}.png` });
  if (overflow) fail++;
  console.log(`${v.name.padEnd(18)} ${v.width}x${v.height}  hOverflow=${overflow ? 'FAIL' : 'ok'}`);
  await ctx.close();
}
await browser.close();
console.log(fail ? `GATE FAIL: ${fail} viewport co scroll ngang` : 'GATE PASS: 0 horizontal overflow');
