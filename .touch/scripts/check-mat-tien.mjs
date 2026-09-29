#!/usr/bin/env node
/**
 * check-mat-tien.mjs · Mat tien (landing "/" va Hub minh hoa "/hub") khong duoc noi sai hien trang.
 *
 * VI SAO CO (29/09/2026): khi di thu duong demo cho nha dau tu, trang dau tien ("/") con ghi cung
 * "Match thật · chưa chạy", "Match chứng minh được · Chưa chạy · Thiếu dữ liệu CẦU thật", "Gate kết
 * quả bị chặn: Chưa có dữ liệu CẦU thật", "ENGINE DEMO" va "CNCL Registry · 18/07". Luc do da co 11
 * match that co chu ky va 30 nhu cau quoc gia. Nut "Xem engine thật" va "Xem Hub thật" dan vao /hub,
 * noi KPI (1.284 facts, 47 match) la du lieu gia lap cua nganh Cong nghiep ho tro. Cong check-so-sinh
 * khong thay vi no chi bat chuoi kieu "14 o xanh"; cac trang dashboard thi da co cong rieng.
 *
 * CONG KIEM BON THU (tren components/dark/*.tsx, app/page.tsx, app/hub/page.tsx, lib/content.ts):
 *   TRANG_THAI_GO_TAY   chuoi ghi cung hien trang: "chưa chạy", "Chưa có/Thiếu dữ liệu CẦU",
 *                       "ENGINE DEMO", "CNCL Registry · <ngay go tay>", "UPTIME", "LIVE" gan voi engine;
 *                       khung dashboard con "Solo Entrepreneur" / "Project Lead" cua ban mau cu.
 *   CHU_THAT_TRO_DEMO   mot the <a> tro vao ROUTE.hub (du lieu minh hoa) ma chu cua no co "thật",
 *                       ke ca chu lay tu lib/content.ts (vd {dk.nav.cta}).
 *   SO_KHONG_SINH       NavDark, MatchStream, TapeDark, MetricsBand phai nhap lib/cncl-match (so match
 *                       sinh tu so ky); MatchStream khong duoc co ma MATCH-xxxx go tay.
 *   HUB_THIEU_NHAN      /hub phai co bang "Hub minh họa" (hub-demo-banner) tro ve dashboard.
 *
 * Chay: node scripts/check-mat-tien.mjs [--touch <dir .touch>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const TOUCH = resolve(arg('--touch') || join(HERE, '..'));
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };

const DARK = join(TOUCH, 'components', 'dark');
const CAN = [join(TOUCH, 'app', 'page.tsx'), join(TOUCH, 'app', 'hub', 'page.tsx'), join(TOUCH, 'lib', 'content.ts'),
  // Khung chung cua moi trang dashboard: the ten nguoi dung va o "Domain" o chan thanh ben.
  join(TOUCH, 'components', 'dash', 'DashSidebar.tsx'), join(TOUCH, 'components', 'dash', 'DashTopBar.tsx')];
for (const p of [DARK, ...CAN]) if (!existsSync(p)) thoat3(`thieu ${p}`);
const tep = [...readdirSync(DARK).filter((t) => t.endsWith('.tsx')).map((t) => join(DARK, t)), ...CAN];
const doc = (p) => readFileSync(p, 'utf8');
// Bo dong chu thich: ly do sua duoc phep nhac lai chuoi cu.
const boChuThich = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '').split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');
const ten = (p) => p.slice(TOUCH.length + 1);

const vi = [];
// ── 1. Trang thai go tay ────────────────────────────────────────────────────
const CAM = [
  [/chưa chạy/i, 'chưa chạy'],
  [/(Chưa có|Thiếu) dữ liệu CẦU/i, 'thiếu dữ liệu CẦU'],
  [/ENGINE DEMO/i, 'ENGINE DEMO'],
  [/CNCL Registry · \d{1,2}\/\d{1,2}/, 'ngày registry gõ tay'],
  [/UPTIME/i, 'UPTIME'],
  [/ENGINE[^'"`\n]{0,12}LIVE/i, 'ENGINE LIVE'],
  [/Solo Entrepreneur/, 'domain mẫu cũ Solo Entrepreneur'],
  [/Project Lead/, 'vai trò mẫu Project Lead'],
];
for (const p of tep) {
  const s = boChuThich(doc(p));
  for (const [re, nhan] of CAM) {
    s.split('\n').forEach((l, i) => {
      // lib/content.ts co khoi copy cua landing cu (sang) khong con dung; chi xet khoi dk va hub.
      if (re.test(l)) vi.push(`TRANG_THAI_GO_TAY: ${ten(p)} dong ~${i + 1} ghi cung "${nhan}": ${l.trim().slice(0, 90)}`);
    });
  }
}

// ── 2. Chu "thật" tro vao du lieu minh hoa ──────────────────────────────────
const content = doc(join(TOUCH, 'lib', 'content.ts'));
const giaTri = (khoa) => [...content.matchAll(new RegExp(`\\b${khoa}:\\s*'([^']*)'`, 'g'))].map((m) => m[1]);
for (const p of tep.filter((x) => x.endsWith('.tsx'))) {
  const s = boChuThich(doc(p));
  for (const m of s.matchAll(/<a\b[^>]*href=\{ROUTE\.hub[A-Za-z]*\}[^>]*>([\s\S]*?)<\/a>/g)) {
    const trong = m[1];
    const chu = [trong.replace(/\{[^}]*\}/g, ' ')];
    for (const e of trong.matchAll(/\{[A-Za-z_.]*\.([A-Za-z_]+)\}/g)) chu.push(...giaTri(e[1]));
    if (chu.some((c) => /thật/i.test(c))) vi.push(`CHU_THAT_TRO_DEMO: ${ten(p)}: nut "${chu.join(' ').replace(/\s+/g, ' ').trim().slice(0, 60)}" tro vao /hub (du lieu minh hoa)`);
  }
}

// ── 3. So match phai sinh tu so ky ──────────────────────────────────────────
for (const t of ['NavDark.tsx', 'MatchStream.tsx', 'TapeDark.tsx', 'MetricsBand.tsx']) {
  const p = join(DARK, t);
  if (!existsSync(p)) { vi.push(`SO_KHONG_SINH: thieu components/dark/${t}`); continue; }
  const s = doc(p);
  if (!/from '@\/lib\/cncl-match'/.test(s)) vi.push(`SO_KHONG_SINH: components/dark/${t} khong nhap lib/cncl-match`);
}
const ms = boChuThich(doc(join(DARK, 'MatchStream.tsx')));
if (/['"`]MATCH-\d{3,}/.test(ms)) vi.push('SO_KHONG_SINH: MatchStream.tsx co ma MATCH-xxxx go tay');

// ── 4. Hub minh hoa phai tu noi minh la minh hoa ────────────────────────────
const hubPage = doc(join(TOUCH, 'app', 'hub', 'page.tsx'));
if (!/className="hub-demo-banner"/.test(hubPage) || !/Hub minh họa/.test(hubPage) || !/href=\{ROUTE\.dashboard\}/.test(hubPage)) {
  vi.push('HUB_THIEU_NHAN: app/hub/page.tsx thieu bang "Hub minh họa" tro ve dashboard');
}

console.log(`mat tien: ${tep.length} tep`);
if (vi.length) {
  console.log(`\nFAIL: ${vi.length} vi pham`);
  vi.slice(0, 30).forEach((v) => console.log('  ' + v));
  process.exit(2);
}
console.log('\nOK: mat tien khong noi sai hien trang, nut "thật" khong dan vao du lieu minh hoa.');
