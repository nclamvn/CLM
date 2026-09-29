#!/usr/bin/env node
/**
 * bite-mat-tien.mjs · Rang cua check-mat-tien.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep components/dark/*.tsx, app/page.tsx, app/hub/page.tsx, lib/content.ts vao
 * thu muc tam (mkdtempSync), tiem loi vao BAN SAO. Khong sua file that.
 *
 * RANG
 * ====
 * RANG 1 · CANH SACH -> exit 0.
 * RANG 2 · TapeDark ghi lai "Match thật · chưa chạy" -> TRANG_THAI_GO_TAY.
 * RANG 3 · MetricsBand ghi lai nguon "CNCL Registry · 18/07" -> TRANG_THAI_GO_TAY.
 * RANG 4 · nut chinh cua Hero ("Xem engine thật", chu lay tu content.ts) tro lai /hub -> CHU_THAT_TRO_DEMO.
 * RANG 5 · CTADark co nut chu go san "Xem Hub thật" tro vao /hub -> CHU_THAT_TRO_DEMO.
 * RANG 6 · MatchStream quay ve bon dong MATCH-0056.. go tay, khong nhap cncl-match -> SO_KHONG_SINH.
 * RANG 7 · /hub mat bang "Hub minh họa" -> HUB_THIEU_NHAN.
 * RANG 8 · KHONG BAO OAN: chu thich nhac lai chuoi "chưa chạy" -> van exit 0.
 * RANG 9 · thanh ben ghi lai domain "Solo Entrepreneur" -> TRANG_THAI_GO_TAY.
 *
 * Chay: node scripts/bite-mat-tien.mjs
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync, copyFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const CONG = join(HERE, 'check-mat-tien.mjs');
const kq = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(62)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const tam = [];
const chep = (tu, den) => { mkdirSync(dirname(den), { recursive: true }); copyFileSync(tu, den); };
const canh = (sua) => {
  const t = mkdtempSync(join(tmpdir(), 'bite_mat_tien_')); tam.push(t);
  for (const f of readdirSync(join(TOUCH, 'components', 'dark'))) chep(join(TOUCH, 'components', 'dark', f), join(t, 'components', 'dark', f));
  for (const f of ['app/page.tsx', 'app/hub/page.tsx', 'lib/content.ts', 'components/dash/DashSidebar.tsx', 'components/dash/DashTopBar.tsx']) chep(join(TOUCH, f), join(t, f));
  if (sua) sua(t);
  return t;
};
const doi = (t, rel, f) => {
  const p = join(t, rel); const cu = readFileSync(p, 'utf8'); const moi = f(cu);
  if (moi === cu) throw new Error(`KHONG TIEM DUOC vao ${rel}: moc khong con`);
  writeFileSync(p, moi);
};
const chay = (t) => { const r = spawnSync(process.execPath, [CONG, '--touch', t], { encoding: 'utf8' }); return { rc: r.status, out: r.stdout + r.stderr }; };
const rang = (nhan, sua, ma, ky) => {
  let r;
  try { r = chay(canh(sua)); } catch (e) { inRa(nhan, false, e.message); return; }
  inRa(nhan, r.rc === ma && (ky ? r.out.includes(ky) : true), `exit ${r.rc}`);
};

try {
  rang('RANG 1 · canh sach -> exit 0', null, 0);
  rang('RANG 2 · Tape ghi lai "chưa chạy" -> TRANG_THAI_GO_TAY', (t) => doi(t, 'components/dark/TapeDark.tsx',
    (s) => s.replace("const items: TapeItem[] = [", "const items: TapeItem[] = [\n  { v: 'Match thật', k: '', truth: 'SCAFFOLD', truthText: 'chưa chạy' },")), 2, 'TRANG_THAI_GO_TAY');
  rang('RANG 3 · nguon registry ghi cung 18/07 -> TRANG_THAI_GO_TAY', (t) => doi(t, 'components/dark/MetricsBand.tsx',
    (s) => s.replace(/const SRC = `[^`]*`;/, "const SRC = 'CNCL Registry · 18/07';")), 2, 'TRANG_THAI_GO_TAY');
  rang('RANG 4 · nut "Xem engine thật" tro lai /hub -> CHU_THAT_TRO_DEMO', (t) => doi(t, 'components/dark/HeroDark.tsx',
    (s) => s.replace('<a className="lp-btn lp-btn--primary" href={ROUTE.dashboard}>', '<a className="lp-btn lp-btn--primary" href={ROUTE.hub}>')), 2, 'CHU_THAT_TRO_DEMO');
  rang('RANG 5 · nut go san "Xem Hub thật" -> CHU_THAT_TRO_DEMO', (t) => doi(t, 'components/dark/CTADark.tsx',
    (s) => s.replace('Xem Hub minh họa', 'Xem Hub thật')), 2, 'CHU_THAT_TRO_DEMO');
  rang('RANG 6 · MatchStream go tay, khong nhap cncl-match -> SO_KHONG_SINH', (t) => writeFileSync(join(t, 'components/dark/MatchStream.tsx'),
    "const rows = [{ id: 'MATCH-0056', score: '0.89' }];\nexport function MatchStream() { return null; }\n"), 2, 'SO_KHONG_SINH');
  rang('RANG 7 · /hub mat bang "Hub minh họa" -> HUB_THIEU_NHAN', (t) => doi(t, 'app/hub/page.tsx',
    (s) => s.replace('className="hub-demo-banner"', 'className="hub-x"')), 2, 'HUB_THIEU_NHAN');
  rang('RANG 8 · chu thich nhac "chưa chạy" -> van exit 0', (t) => doi(t, 'components/dark/TapeDark.tsx',
    (s) => `// Truoc day o nay ghi "Match thật · chưa chạy".\n/* va "Thiếu dữ liệu CẦU thật" */\n${s}`), 0);
  rang('RANG 9 · thanh ben ghi lai "Solo Entrepreneur" -> TRANG_THAI_GO_TAY', (t) => doi(t, 'components/dash/DashSidebar.tsx',
    (s) => s.replace('>Công nghệ chiến lược<', '>Solo Entrepreneur<')), 2, 'TRANG_THAI_GO_TAY');
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE MAT TIEN: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
