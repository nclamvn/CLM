// Test drawer keyboard a11y tai 390px: open -> focus vao drawer, Escape -> dong + tra focus menu button.
import { chromium } from 'playwright';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
const p = await ctx.newPage();
await p.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle', timeout: 45000 });
await p.click('.dash-menu-btn');
await p.waitForTimeout(350);
const openState = await p.getAttribute('.dash-shell', 'data-drawer');
const focusOpen = await p.evaluate(() => document.activeElement?.className?.toString().slice(0, 30) || document.activeElement?.tagName);
const focusInDrawer = await p.evaluate(() => !!document.activeElement?.closest('.dash-sidebar'));
await p.keyboard.press('Escape');
await p.waitForTimeout(350);
const closedState = await p.getAttribute('.dash-shell', 'data-drawer');
const focusClosed = await p.evaluate(() => document.activeElement?.className?.toString().slice(0, 30) || document.activeElement?.tagName);
console.log('open=', openState, '| focusInDrawer=', focusInDrawer, '(' + focusOpen + ')');
console.log('afterEsc=', closedState, '| focusReturn=', focusClosed);
console.log((openState === 'open' && focusInDrawer && closedState === 'closed' && /menu-btn/.test(focusClosed)) ? 'DRAWER A11Y PASS' : 'DRAWER A11Y CHECK');
await b.close();
