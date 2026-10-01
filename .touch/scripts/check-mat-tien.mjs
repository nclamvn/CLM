#!/usr/bin/env node
/**
 * check-mat-tien.mjs · Mat tien (trang dau "/", khung dashboard) khong duoc noi sai hien trang, va
 * dung MOT he mau. Hub minh hoa da GO 01/10/2026; cong nay chan no quay lai.
 *
 * VI SAO CO
 *   29/09/2026 (lan 1): khi di thu duong demo, trang dau con ghi cung "Match thật · chưa chạy",
 *   "Thiếu dữ liệu CẦU thật", "ENGINE DEMO", "CNCL Registry · 18/07" trong khi da co 11 match ky.
 *   Nut "Xem engine thật" dan vao /hub, noi KPI la du lieu gia lap cua nganh khac.
 *   29/09/2026 (lan 2): trang dau dung lai thanh MOT man hinh voi hinh dong ve tu du lieu that, va
 *   Hub doi tu he graphite/do (#C40F0F, Be Vietnam Pro) sang token SOT v2 cua dashboard. Cong nay
 *   giu ca hai quyet dinh do khong troi lai.
 *
 * CONG KIEM:
 *   TRANG_THAI_GO_TAY     chuoi ghi cung hien trang ("chưa chạy", "Thiếu/Chưa có dữ liệu CẦU",
 *                         "ENGINE DEMO", "CNCL Registry · <ngay>", "UPTIME", "ENGINE ... LIVE") hoac chu
 *                         mau cu cua khung ("Solo Entrepreneur", "Project Lead").
 *   CON_DEMO              (01/10/2026, thay CHU_THAT_TRO_DEMO va HUB_THIEU_NHAN) con duong dan nao toi /hub,
 *                         con thu muc components/hub, hoac app/hub/page.tsx khong chuyen huong ve dashboard.
 *                         Hub minh hoa la du lieu GIA LAP nam trong san pham that; nghiem thu enterprise
 *                         01/10/2026 chot go han.
 *   SO_KHONG_SINH         trang dau khong lay so tu lib/mat-tien (dungMatTien); lib/mat-tien khong doc
 *                         ba file da qua cong; hoac co so go tay: truong so = hang so, hay chu JSX chua
 *                         con so hai chu so tro len (tru so hieu "QĐ 21" / "QĐ 21/2026").
 *   KHONG_MOT_MAN         trang dau khong con la mot man hinh (.mt phai cao 100vh va overflow hidden).
 *   KHONG_DON_SAC         trang dau truot chuan HIVE Editorial (anh Lam chot 29/09/2026 sau khi ban
 *                         vong hub phat sang bi danh gia la "AI slop"): co gradient, glow (shadowBlur,
 *                         text-shadow, box-shadow co mau, 'lighter'), mau du lieu hay mau nhan (--data-*,
 *                         --color-accent-*), hoac tieu de khong dung serif Noto Serif. Bang mau nhom
 *                         cong nghe (lib/mau-du-lieu.mjs, var(--nhom-N)) DUOC phep tu 01/10/2026: no chi ma
 *                         hoa nhom, va check-mau-du-lieu.mjs canh do tram cua no.
 *   MAU_KHONG_THONG_NHAT  app/layout.tsx khong nap styles/touch-unify.css SAU globals.css; hoac Hub khong
 *                         anh xa --dk-bg/--dk-rd ve token SOT v2; hoac mat tien con do cu #C40F0F/#E8221A.
 *
 * Chay: node scripts/check-mat-tien.mjs [--touch <dir .touch>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const TOUCH = resolve(arg('--touch') || join(HERE, '..'));
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };

const P = (...x) => join(TOUCH, ...x);
const LANDING = P('components', 'landing');
const CAN = {
  page: P('app', 'page.tsx'), hub: P('app', 'hub', 'page.tsx'), layout: P('app', 'layout.tsx'), content: P('lib', 'content.ts'),
  matTien: P('lib', 'mat-tien.ts'), css: P('styles', 'landing-hub.css'), unify: P('styles', 'touch-unify.css'),
  sidebar: P('components', 'dash', 'DashSidebar.tsx'), topbar: P('components', 'dash', 'DashTopBar.tsx'),
};
for (const p of [LANDING, ...Object.values(CAN)]) if (!existsSync(p)) thoat3(`thieu ${p}`);
const landing = readdirSync(LANDING).filter((t) => t.endsWith('.tsx')).map((t) => join(LANDING, t));
const doc = (p) => readFileSync(p, 'utf8');
// Bo chu thich: ly do sua duoc phep nhac lai chuoi cu.
const boChuThich = (s) => s.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');
const ten = (p) => p.slice(TOUCH.length + 1);
const vi = [];

// ── 1. Trang thai go tay ────────────────────────────────────────────────────
const CAM = [
  [/chưa chạy/i, 'chưa chạy'], [/(Chưa có|Thiếu) dữ liệu CẦU/i, 'thiếu dữ liệu CẦU'], [/ENGINE DEMO/i, 'ENGINE DEMO'],
  [/CNCL Registry · \d{1,2}\/\d{1,2}/, 'ngày registry gõ tay'], [/UPTIME/i, 'UPTIME'], [/ENGINE[^'"`\n]{0,12}LIVE/i, 'ENGINE LIVE'],
  [/Solo Entrepreneur/, 'domain mẫu cũ Solo Entrepreneur'], [/Project Lead/, 'vai trò mẫu Project Lead'],
];
const quetChu = [CAN.page, CAN.content, CAN.matTien, CAN.sidebar, CAN.topbar, ...landing];
for (const p of quetChu) {
  const s = boChuThich(doc(p));
  s.split('\n').forEach((l, i) => {
    for (const [re, nhan] of CAM) if (re.test(l)) vi.push(`TRANG_THAI_GO_TAY: ${ten(p)} dong ~${i + 1} ghi cung "${nhan}": ${l.trim().slice(0, 90)}`);
  });
}

// ── 2. Khong con du lieu minh hoa ───────────────────────────────────────────
{
  const quetLink = [];
  const di = (d) => { if (!existsSync(d)) return; for (const t of readdirSync(d)) { const p = join(d, t); if (p.startsWith(P('app', 'dev')) || p.startsWith(P('app', 'hub'))) continue; if (statSync(p).isDirectory()) di(p); else if (/\.(tsx|ts)$/.test(t)) quetLink.push(p); } };
  di(P('app')); di(P('components')); di(P('lib'));
  for (const p of quetLink) {
    const s0 = boChuThich(doc(p));
    if (/['"`]\/hub(['"`?#/]|$)|ROUTE\.hub/.test(s0)) vi.push(`CON_DEMO: ${ten(p)} con duong dan toi /hub (du lieu minh hoa da go)`);
  }
  if (existsSync(P('components', 'hub'))) vi.push('CON_DEMO: con thu muc components/hub');
  if (!/redirect\(\s*['"]\/dashboard['"]\s*\)/.test(doc(CAN.hub))) vi.push('CON_DEMO: app/hub/page.tsx khong chuyen huong ve /dashboard');
}

// ── 3. So phai sinh tu du lieu ──────────────────────────────────────────────
const page = boChuThich(doc(CAN.page));
if (!/import \{ dungMatTien \} from '@\/lib\/mat-tien'/.test(page) || !/dungMatTien\(\)/.test(page)) vi.push('SO_KHONG_SINH: app/page.tsx khong lay so tu dungMatTien (lib/mat-tien)');
const mt = boChuThich(doc(CAN.matTien));
for (const f of ['hub-graph.json', 'cncl-match.json', 'cncl-registry.json']) if (!mt.includes(`'./${f}'`)) vi.push(`SO_KHONG_SINH: lib/mat-tien.ts khong doc ${f}`);
for (const m of mt.matchAll(/\b(donVi|nhuCau|nhom|capCoNguon|daKy|tuChoi|ncTrong|cauNguon|tierA)\s*:\s*(\d+)/g)) vi.push(`SO_KHONG_SINH: lib/mat-tien.ts gan cung ${m[1]}: ${m[2]}`);
for (const p of [CAN.page, ...landing]) {
  const s = boChuThich(doc(p)).replace(/QĐ 21(\/2026)?/g, 'QĐ');
  for (const m of s.matchAll(/>([^<>{}]*)</g)) if (/\b\d{2,}\b/.test(m[1])) vi.push(`SO_KHONG_SINH: ${ten(p)} co so go tay trong JSX: "${m[1].trim().slice(0, 60)}"`);
}

// ── 5. Mot man hinh ─────────────────────────────────────────────────────────
const css = boChuThich(doc(CAN.css));
const khoiMt = (css.match(/(^|\n)\.mt\s*\{([^}]*)\}/) || [])[2] ?? '';
if (!/height:\s*100d?vh/.test(khoiMt) || !/overflow:\s*hidden/.test(khoiMt)) vi.push('KHONG_MOT_MAN: styles/landing-hub.css .mt phai cao 100vh va overflow: hidden');

// ── 6. Mot he mau ───────────────────────────────────────────────────────────
const layout = doc(CAN.layout);
const iG = layout.indexOf("import './globals.css'"); const iU = layout.indexOf("import '@/styles/touch-unify.css'");
if (iU < 0 || iG < 0 || iU < iG) vi.push('MAU_KHONG_THONG_NHAT: app/layout.tsx phai nap styles/touch-unify.css SAU globals.css');
const unify = boChuThich(doc(CAN.unify));
for (const [bien, tok] of [['--dk-bg', '--color-bg-canvas'], ['--dk-rd', '--color-accent-blue'], ['--dk-tx', '--color-text-primary'], ['--sans', '--font-ui']]) {
  if (!new RegExp(`${bien}:\\s*var\\(${tok}\\)`).test(unify)) vi.push(`MAU_KHONG_THONG_NHAT: touch-unify.css khong anh xa ${bien} ve var(${tok})`);
}
for (const tok of ['--data-cung', '--data-cau', '--data-match']) if (!new RegExp(`${tok}:\\s*#`).test(unify)) vi.push(`MAU_KHONG_THONG_NHAT: touch-unify.css thieu token du lieu ${tok}`);
for (const p of [CAN.css, CAN.unify, CAN.page, ...landing]) {
  const s = boChuThich(doc(p));
  if (/#C40F0F|#E8221A|#F53B2E|196,\s*15,\s*15/i.test(s)) vi.push(`MAU_KHONG_THONG_NHAT: ${ten(p)} con do cu cua he graphite`);
}

// ── 7. Don sac (HIVE Editorial) ─────────────────────────────────────────────
for (const p of [CAN.css, CAN.page, ...landing]) {
  const s2 = boChuThich(doc(p));
  const loi = [];
  if (/gradient\(/i.test(s2)) loi.push('gradient');
  if (/shadowBlur|text-shadow|'lighter'/.test(s2)) loi.push('glow');
  if (/box-shadow:[^;]*rgba\((?!0,\s*0,\s*0)/.test(s2)) loi.push('box-shadow co mau');
  if (/var\(--data-|var\(--color-accent|--data-(cung|cau|match)/.test(s2)) loi.push('mau du lieu/mau nhan');
  if (loi.length) vi.push(`KHONG_DON_SAC: ${ten(p)} co ${loi.join(', ')}`);
}
{
  // Noto Serif khai bao mot lan cho ca he o touch-unify.css; trang dau tro --p-serif vao no.
  const c2 = boChuThich(doc(CAN.css)); const u2 = boChuThich(doc(CAN.unify));
  if (!/@font-face\s*\{\s*font-family:\s*'Noto Serif'/.test(u2) || !/--p-serif:\s*'Noto Serif'/.test(c2) || !/\.mt-chu__h\s*\{[^}]*font-family:\s*var\(--p-serif\)/.test(c2)) vi.push('KHONG_DON_SAC: tieu de trang dau khong dung serif Noto Serif (--p-serif)');
}

console.log(`mat tien: ${quetChu.length} tep chu · ${landing.length} component trang dau`);
if (vi.length) {
  console.log(`\nFAIL: ${vi.length} vi pham`);
  vi.slice(0, 30).forEach((v) => console.log('  ' + v));
  process.exit(2);
}
console.log('\nOK: mat tien khong noi sai hien trang, so sinh tu du lieu, mot man hinh, don sac HIVE, khong con du lieu minh hoa.');
