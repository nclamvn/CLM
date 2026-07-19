// Playwright screenshot nghiem thu: viewport CSS co dinh 1536x1024, DPR 1, khong resize sau khi chup.
// Chay: node scripts/shot.mjs [url] [out]
import { chromium } from 'playwright';

const url = process.argv[2] || 'http://localhost:3000/dashboard';
const out = process.argv[3] || 'reports/dashboard-1536x1024.png';

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1536, height: 1024 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
// diet Next dev badge + moi automation overlay (khong thuoc app)
await page.addStyleTag({
  content: 'nextjs-portal,[data-nextjs-toast],#__next-build-watcher,[class*="claude-agent"],[class*="glow-border"],[data-automation-overlay]{display:none!important}',
});
try { await page.evaluate(() => document.fonts.ready); } catch {}
await page.waitForTimeout(700);
await page.screenshot({ path: out });
const vp = page.viewportSize();
console.log('OK screenshot', out, vp.width + 'x' + vp.height, 'DPR1');
await browser.close();
