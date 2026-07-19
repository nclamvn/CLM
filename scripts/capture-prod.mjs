#!/usr/bin/env node
/* Pha 1: chup dashboard PRODUCTION o 1536x1024 DPR1, animation OFF, khong Next badge,
   khong automation overlay. Dung Playwright chromium (khong co glow overlay nhu claude-in-chrome).
   Yeu cau: next start dang chay. Chay: node scripts/capture-prod.mjs <url> <out.png> */
import { chromium } from 'playwright';

const url = process.argv[2] || 'http://localhost:3100/dashboard';
const out = process.argv[3] || 'reports/pha1/prod-1536x1024.png';

const KILL_ANIM = `*,*::before,*::after{animation:none!important;-webkit-animation:none!important;
  transition:none!important;animation-duration:0s!important;animation-delay:0s!important;
  transition-duration:0s!important;caret-color:transparent!important;scroll-behavior:auto!important}
  nextjs-portal,#__next-build-watcher,[data-nextjs-toast],[data-nextjs-dialog-overlay]{display:none!important}`;

const browser = await chromium.launch({ args: ['--force-color-profile=srgb', '--disable-lcd-text'] });
const page = await browser.newPage({
  viewport: { width: 1536, height: 1024 },
  deviceScaleFactor: 1,
  reducedMotion: 'reduce',
});
await page.goto(url, { waitUntil: 'networkidle' });
await page.addStyleTag({ content: KILL_ANIM });
await page.evaluate(async () => { if (document.fonts) await document.fonts.ready; });
await page.waitForTimeout(200);
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1536, height: 1024 } });
await browser.close();
console.log(`OK capture ${out} 1536x1024 DPR1 (prod, anim off)`);
