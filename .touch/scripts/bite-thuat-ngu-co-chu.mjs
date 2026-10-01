#!/usr/bin/env node
/**
 * bite-thuat-ngu-co-chu.mjs · Rang cua check-thuat-ngu.mjs va check-co-chu.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep app/ (tru app/dev), components/ (tru components/globe), styles/, lib/thuat-ngu.mjs,
 * lib/project-status.ts, lib/content.ts vao thu muc tam (mkdtempSync), tiem loi vao BAN SAO.
 *
 * RANG
 * ====
 * RANG 1  · CANH SACH -> ca hai cong exit 0.
 * RANG 2  · thanh tren them lai nut "Provenance ON" -> TU_CAM.
 * RANG 3  · nhan chu Viet co "engine" ("điểm engine") -> TU_CAM.
 * RANG 4  · thuoc tinh title="Evidence Registry" -> TU_CAM.
 * RANG 5  · them lai muc dieu huong "sắp có" href rong -> MUC_CHET.
 * RANG 6  · KHONG BAO OAN: ten lop CSS "reg-tier pf-proof" va duong dan '/evidence/x.txt' -> exit 0.
 * RANG 7  · CSS font-size: 11px -> CHU_NHO.
 * RANG 8  · style={{ fontSize: 10 }} trong tsx -> CHU_NHO.
 * RANG 9  · canvas ctx.font = `500 10px` -> CHU_NHO.
 * RANG 10 · layout nap lai Be Vietnam Pro -> PHONG_THUA.
 *
 * Chay: node scripts/bite-thuat-ngu-co-chu.mjs     Exit 0 moi rang can · 2 co rang khong can.
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync, cpSync, mkdirSync, copyFileSync, appendFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const TN = join(HERE, 'check-thuat-ngu.mjs'); const CC = join(HERE, 'check-co-chu.mjs');
const kq = []; const tam = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(64)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const canh = (sua) => {
  const t = mkdtempSync(join(tmpdir(), 'bite_tn_cc_')); tam.push(t);
  cpSync(join(TOUCH, 'app'), join(t, 'app'), { recursive: true, filter: (s) => !s.startsWith(join(TOUCH, 'app', 'dev')) });
  cpSync(join(TOUCH, 'components'), join(t, 'components'), { recursive: true, filter: (s) => !s.startsWith(join(TOUCH, 'components', 'globe')) });
  cpSync(join(TOUCH, 'styles'), join(t, 'styles'), { recursive: true });
  mkdirSync(join(t, 'lib'), { recursive: true });
  for (const f of ['thuat-ngu.mjs', 'project-status.ts', 'content.ts']) copyFileSync(join(TOUCH, 'lib', f), join(t, 'lib', f));
  if (sua) sua(t);
  return t;
};
const doi = (t, rel, f) => { const p = join(t, rel); const cu = readFileSync(p, 'utf8'); const moi = f(cu); if (moi === cu) throw new Error(`KHONG TIEM DUOC vao ${rel}`); writeFileSync(p, moi); };
const chay = (cong, t) => { const r = spawnSync(process.execPath, [cong, '--touch', t], { encoding: 'utf8' }); return { rc: r.status, out: r.stdout + r.stderr }; };
const rang = (nhan, cong, sua, ma, ky) => {
  let r; try { r = chay(cong, canh(sua)); } catch (e) { inRa(nhan, false, e.message); return; }
  inRa(nhan, r.rc === ma && (ky ? r.out.includes(ky) : true), `exit ${r.rc}`);
};
const themTsx = (noiDung) => (t) => { mkdirSync(join(t, 'components', 'x'), { recursive: true }); writeFileSync(join(t, 'components', 'x', 'X.tsx'), noiDung); };

try {
  const s1 = chay(TN, canh(null)); const s2 = chay(CC, canh(null));
  inRa('RANG 1  · canh sach -> ca hai cong exit 0', s1.rc === 0 && s2.rc === 0, `exit ${s1.rc}/${s2.rc}`);
  rang('RANG 2  · nut "Provenance ON" -> TU_CAM', TN, themTsx('export const X = () => <button type="button">Provenance ON</button>;\n'), 2, 'TU_CAM');
  rang('RANG 3  · nhan "điểm engine" -> TU_CAM', TN, themTsx("export const X = () => <span>{'điểm engine'}</span>;\n"), 2, 'TU_CAM');
  rang('RANG 4  · title="Evidence Registry" -> TU_CAM', TN, themTsx('export const X = () => <i title="Evidence Registry" />;\n'), 2, 'TU_CAM');
  rang('RANG 5  · muc dieu huong "sắp có" -> MUC_CHET', TN, (t) => doi(t, 'lib/project-status.ts', (s) => s.replace("  { label: 'Kho mã'", "  { label: 'Cài đặt', href: '' },\n  { label: 'Kho mã'")), 2, 'MUC_CHET');
  rang('RANG 6  · ten lop va duong dan co tu cam -> exit 0', TN, themTsx("export const X = () => <a className=\"reg-tier pf-proof\" href={'/evidence/x.txt'}>Mở bản chụp</a>;\n"), 0);
  rang('RANG 7  · CSS font-size 11px -> CHU_NHO', CC, (t) => appendFileSync(join(t, 'styles', 'dashboard.css'), '\n.x { font-size: 11px; }\n'), 2, 'CHU_NHO');
  rang('RANG 8  · fontSize: 10 trong tsx -> CHU_NHO', CC, themTsx('export const X = () => <i style={{ fontSize: 10 }} />;\n'), 2, 'CHU_NHO');
  rang('RANG 9  · canvas 500 10px -> CHU_NHO', CC, themTsx('export function v(ctx: CanvasRenderingContext2D) { ctx.font = `500 10px Inter`; }\n'), 2, 'CHU_NHO');
  rang('RANG 10 · layout nap lai Be Vietnam Pro -> PHONG_THUA', CC, (t) => doi(t, 'app/layout.tsx', (s) => s.replace("import type { Metadata } from 'next';", "import type { Metadata } from 'next';\nimport { beVietnamPro } from './fonts';")), 2, 'PHONG_THUA');
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE THUAT NGU CO CHU: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
