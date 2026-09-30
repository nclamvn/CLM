#!/usr/bin/env node
/**
 * bite-pheu.mjs · Rang cua check-pheu.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep lib/hub-pheu.json, lib/cncl-match.json, components/dash/PheuGhep.tsx va
 * CaoLocMatch/out/pheu.json vao thu muc tam (mkdtempSync), tiem loi vao BAN SAO. Khong sua file that.
 *
 * RANG
 * ====
 * RANG 1 · CANH SACH -> exit 0.
 * RANG 2 · web ghi 12 match ky (lam dep so) -> TANG_SAI (va PHEU_LECH).
 * RANG 3 · web doi so cap kha di, out/pheu.json giu nguyen -> PHEU_LECH.
 * RANG 4 · vi du "suyt dat" ti le 0,6 (tren nguong thi phai la ung vien) -> VI_DU_SAI.
 * RANG 5 · vi du "may da chan" co nhom trung nhau -> VI_DU_SAI.
 * RANG 6 · component ghi cung "1.290" trong JSX -> SO_GO_TAY.
 * RANG 7 · component nhap them lib/cncl-registry.json de tu dem -> SO_GO_TAY.
 *
 * Chay: node scripts/bite-pheu.mjs
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { goc } from './goc.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const CONG = join(HERE, 'check-pheu.mjs');
const KHO = process.env.CLM_KHO_MATCH || goc('CaoLocMatch');
const kq = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(62)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const tam = [];
const chep = (tu, den) => { mkdirSync(dirname(den), { recursive: true }); copyFileSync(tu, den); };
const canh = (sua) => {
  const t = mkdtempSync(join(tmpdir(), 'bite_pheu_')); tam.push(t);
  chep(join(TOUCH, 'lib', 'hub-pheu.json'), join(t, 'lib', 'hub-pheu.json'));
  chep(join(TOUCH, 'lib', 'cncl-match.json'), join(t, 'lib', 'cncl-match.json'));
  chep(join(TOUCH, 'components', 'dash', 'PheuGhep.tsx'), join(t, 'man', 'PheuGhep.tsx'));
  chep(join(KHO, 'out', 'pheu.json'), join(t, 'kho', 'out', 'pheu.json'));
  if (sua) sua(t);
  return t;
};
const doiJ = (t, rel, f) => { const p = join(t, rel); const x = JSON.parse(readFileSync(p, 'utf8')); f(x); writeFileSync(p, JSON.stringify(x, null, 2)); };
const doiT = (t, rel, f) => { const p = join(t, rel); const cu = readFileSync(p, 'utf8'); const moi = f(cu); if (moi === cu) throw new Error(`KHONG TIEM DUOC vao ${rel}`); writeFileSync(p, moi); };
const chay = (t) => { const r = spawnSync(process.execPath, [CONG, '--lib', join(t, 'lib'), '--kho', join(t, 'kho'), '--man', join(t, 'man', 'PheuGhep.tsx')], { encoding: 'utf8' }); return { rc: r.status, out: r.stdout + r.stderr }; };
const rang = (nhan, sua, ma, ky) => {
  let r; try { r = chay(canh(sua)); } catch (e) { inRa(nhan, false, e.message); return; }
  inRa(nhan, r.rc === ma && (ky ? r.out.includes(ky) : true), `exit ${r.rc}`);
};

try {
  rang('RANG 1 · canh sach -> exit 0', null, 0);
  const cungTang = (k, v) => (x) => { x.tang.find((y) => y.k === k).n = v; };
  rang('RANG 2 · web ghi 12 match ky -> TANG_SAI', (t) => { doiJ(t, 'lib/hub-pheu.json', cungTang('da_ky', 12)); doiJ(t, 'kho/out/pheu.json', cungTang('da_ky', 12)); }, 2, 'TANG_SAI');
  rang('RANG 3 · web doi so cap kha di -> PHEU_LECH', (t) => doiJ(t, 'lib/hub-pheu.json', (x) => { x.tang[0].n += 10; }), 2, 'PHEU_LECH');
  const both = (f) => (t) => { doiJ(t, 'lib/hub-pheu.json', f); doiJ(t, 'kho/out/pheu.json', f); };
  rang('RANG 4 · vi du suyt dat ti le 0,6 -> VI_DU_SAI', both((x) => { x.suyt_dat.vi_du[0].ty_le = 0.6; }), 2, 'VI_DU_SAI');
  rang('RANG 5 · vi du may da chan trung nhom -> VI_DU_SAI', both((x) => { const v = x.loai_lop1.vi_du[0]; v.nhom_cung = [v.nhom_cau]; }), 2, 'VI_DU_SAI');
  rang('RANG 6 · component ghi cung 1.290 -> SO_GO_TAY', (t) => doiT(t, 'man/PheuGhep.tsx', (s) => s.replace('<h2 className="pg-h" id="pg-h">Phễu ghép</h2>', '<h2 className="pg-h" id="pg-h">Phễu ghép</h2><b>1.290</b>')), 2, 'SO_GO_TAY');
  rang('RANG 7 · component tu dem tu cncl-registry -> SO_GO_TAY', (t) => doiT(t, 'man/PheuGhep.tsx', (s) => s.replace("import pheu from '@/lib/hub-pheu.json';", "import pheu from '@/lib/hub-pheu.json';\nimport reg from '@/lib/cncl-registry.json';")), 2, 'SO_GO_TAY');
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE PHEU WEB: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
