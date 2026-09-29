#!/usr/bin/env node
/**
 * bite-mo-dau.mjs · Rang cua check-mo-dau.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep phan .touch can thiet (lib/*.json, lib/project-status.ts, lib/mo-dau.mjs,
 * cac app/.../page.tsx, components/modau) vao thu muc tam (mkdtempSync), tiem loi vao BAN SAO. Khong
 * sua file that.
 *
 * RANG
 * ====
 * RANG 1 · CANH SACH -> exit 0.
 * RANG 2 · THEM LAI export kpis vao project-status (dung loi 19/07) -> SO_CU_QUAY_LAI.
 * RANG 3 · statusMeta ghi "Cap nhat 19/07/2026" -> SO_CU_QUAY_LAI.
 * RANG 4 · MoDau nhap lib/project-status -> NHAP_SO_CU.
 * RANG 5 · component dung workQueue -> HANG_VIEC_NOI_BO.
 * RANG 6 · so don vi ghi 14 -> SO_LECH.
 * RANG 7 · cua vao man tro toi trang khong co -> CUA_LECH.
 * RANG 8 · chuoi cong ghi 4/4 -> SO_LECH.
 * RANG 9 · MODULE BI DOC bot mot khoang trong, file sinh TU module do -> SO_LECH.
 *
 * Chay: node scripts/bite-mo-dau.mjs
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync, copyFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, relative } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const CONG = join(HERE, 'check-mo-dau.mjs');
const JSONS = ['hub-mo-dau.json', 'cncl-registry.json', 'cncl-match.json', 'hub-graph.json', 'hub-thi-truong.json', 'hub-thoi-cuoc.json', 'hub-ho-so.json', 'hub-matching.json'];
const kq = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(58)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const tam = [];
const chep = (tu, den) => { mkdirSync(dirname(den), { recursive: true }); copyFileSync(tu, den); };
const trangs = (d, ds = []) => { for (const t of readdirSync(d)) { const p = join(d, t); if (statSync(p).isDirectory()) trangs(p, ds); else if (t === 'page.tsx') ds.push(p); } return ds; };
const canh = (sua) => {
  const t = mkdtempSync(join(tmpdir(), 'bite_mo_dau_')); tam.push(t);
  for (const f of JSONS) chep(join(TOUCH, 'lib', f), join(t, 'lib', f));
  for (const f of ['project-status.ts', 'mo-dau.mjs']) chep(join(TOUCH, 'lib', f), join(t, 'lib', f));
  for (const p of trangs(join(TOUCH, 'app'))) chep(p, join(t, relative(TOUCH, p)));
  chep(join(TOUCH, 'components', 'modau', 'MoDau.tsx'), join(t, 'components', 'modau', 'MoDau.tsx'));
  if (sua) sua(t);
  return t;
};
const doiFile = (t, rel, f) => { const p = join(t, rel); writeFileSync(p, f(readFileSync(p, 'utf8'))); };
const doiJson = (t, f) => doiFile(t, 'lib/hub-mo-dau.json', (s) => { const x = JSON.parse(s); f(x); return JSON.stringify(x); });
const chay = (t, ...them) => { const r = spawnSync(process.execPath, [CONG, '--touch', t, ...them], { encoding: 'utf8' }); return { rc: r.status, out: r.stdout + r.stderr }; };

try {
  let r = chay(canh());
  inRa('RANG 1 · canh sach -> exit 0', r.rc === 0, `exit ${r.rc}`);
  r = chay(canh((t) => doiFile(t, 'lib/project-status.ts', (s) => `${s}\nexport const kpis = { cung: { value: 14, unit: 'đơn vị' } } as const;\n`)));
  inRa('RANG 2 · them lai export kpis -> SO_CU_QUAY_LAI', r.rc === 2 && r.out.includes('SO_CU_QUAY_LAI'), `exit ${r.rc}`);
  r = chay(canh((t) => doiFile(t, 'lib/project-status.ts', (s) => s.replace(/subtitle: '([^']*)'/, "subtitle: '$1 · Cập nhật 19/07/2026'"))));
  inRa('RANG 3 · statusMeta co ngay -> SO_CU_QUAY_LAI', r.rc === 2 && r.out.includes('SO_CU_QUAY_LAI'), `exit ${r.rc}`);
  r = chay(canh((t) => doiFile(t, 'components/modau/MoDau.tsx', (s) => s.replace("import Link from 'next/link';", "import Link from 'next/link';\nimport { nav } from '@/lib/project-status';"))));
  inRa('RANG 4 · MoDau nhap project-status -> NHAP_SO_CU', r.rc === 2 && r.out.includes('NHAP_SO_CU'), `exit ${r.rc}`);
  r = chay(canh((t) => { mkdirSync(join(t, 'components', 'x'), { recursive: true }); writeFileSync(join(t, 'components', 'x', 'Viec.tsx'), "export const workQueue = [{ title: 'việc nội bộ' }];\n"); }));
  inRa('RANG 5 · component co workQueue -> HANG_VIEC_NOI_BO', r.rc === 2 && r.out.includes('HANG_VIEC_NOI_BO'), `exit ${r.rc}`);
  r = chay(canh((t) => doiJson(t, (x) => { x.so.donVi = 14; })));
  inRa('RANG 6 · so don vi ghi 14 -> SO_LECH', r.rc === 2 && r.out.includes('SO_LECH'), `exit ${r.rc}`);
  r = chay(canh((t) => doiJson(t, (x) => { x.cua[0].href = '/dashboard/khong-co'; })));
  inRa('RANG 7 · cua tro toi trang khong co -> CUA_LECH', r.rc === 2 && r.out.includes('CUA_LECH'), `exit ${r.rc}`);
  // Tiem VO DIEU KIEN. Ban dau chi sua "neu co chuoiCong": trong CI (clone moi, chua co ket qua chay
  // nao) truong nay null, phep tiem thanh khong lam gi va rang bao KHONG CAN (lo ra 29/09/2026 khi
  // chay chuoi trong bwrap). Nay luon ghi mot ket qua 4/4 bia: co meta thi lech, khong co thi la bia.
  r = chay(canh((t) => doiJson(t, (x) => { x.chuoiCong = { xanh: 4, tong: 4, dat: true, luc: '2026-07-19T22:18:33+0700' }; })));
  inRa('RANG 8 · chuoi cong ghi 4/4 -> SO_LECH', r.rc === 2 && r.out.includes('SO_LECH'), `exit ${r.rc}`);

  const t = canh();
  const goc = readFileSync(join(t, 'lib', 'mo-dau.mjs'), 'utf8');
  const moc = 'ncTrong: k.ncTrong,';
  const hong = goc.replace(moc, 'ncTrong: k.ncTrong - 1,');
  if (hong === goc) inRa('RANG 9 · module bot mot khoang trong -> SO_LECH', false, `KHONG TIEM DUOC: khong thay "${moc}"`);
  else {
    writeFileSync(join(t, 'lib', 'mo-dau.mjs'), hong);
    const m = await import(pathToFileURL(join(t, 'lib', 'mo-dau.mjs')).href);
    const d = (f) => JSON.parse(readFileSync(join(t, 'lib', f), 'utf8'));
    writeFileSync(join(t, 'lib', 'hub-mo-dau.json'), JSON.stringify(m.dungMoDau({ reg: d('cncl-registry.json'), mat: d('cncl-match.json'), graph: d('hub-graph.json'), thiTruong: d('hub-thi-truong.json'), thoiCuoc: d('hub-thoi-cuoc.json'), hoSo: d('hub-ho-so.json'), matching: d('hub-matching.json') })));
    r = chay(t, '--mo-dun', join(t, 'lib', 'mo-dau.mjs'));
    inRa('RANG 9 · module bot mot khoang trong -> SO_LECH', r.rc === 2 && r.out.includes('SO_LECH') && !r.out.includes('MO_DAU_LECH'), `exit ${r.rc}`);
  }
} finally {
  for (const t of tam) if (existsSync(t)) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE MO DAU: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
