#!/usr/bin/env node
/**
 * bite-kho.mjs · Rang cua check-kho.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep lib/hub-kho.json, lib/kho.mjs va trang app/dashboard/repos/page.tsx vao thu
 * muc tam (mkdtempSync), tiem loi vao BAN SAO. Kho git that chi DOC.
 *
 * RANG
 * ====
 * RANG 1 · CANH SACH -> exit 0.
 * RANG 2 · SUA TONG COMMIT -> SO_LECH.
 * RANG 3 · COMMIT SINH KHONG CO TRONG KHO -> COMMIT_NGOAI_LICH_SU.
 * RANG 4 · tenKho MANG URL CO TOKEN -> LO_THONG_TIN.
 * RANG 5 · lib/repos-view.ts QUAY LAI -> GHI_TAY_QUAY_LAI.
 * RANG 6 · TRANG NHAP lib/repos-view -> GHI_TAY_QUAY_LAI.
 * RANG 7 · MODULE BI DOC dem them mot tep, file sinh TU module do -> SO_LECH.
 *
 * Chay: node scripts/bite-kho.mjs
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync, execFileSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const CONG = join(HERE, 'check-kho.mjs');
const GOC = execFileSync('git', ['-C', HERE, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const kq = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(58)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const tam = [];
const chep = (tu, den) => { mkdirSync(dirname(den), { recursive: true }); copyFileSync(tu, den); };
const canh = (sua) => {
  const t = mkdtempSync(join(tmpdir(), 'bite_kho_')); tam.push(t);
  chep(join(TOUCH, 'lib', 'hub-kho.json'), join(t, 'lib', 'hub-kho.json'));
  chep(join(TOUCH, 'lib', 'kho.mjs'), join(t, 'lib', 'kho.mjs'));
  chep(join(TOUCH, 'app', 'dashboard', 'repos', 'page.tsx'), join(t, 'app', 'dashboard', 'repos', 'page.tsx'));
  if (sua) sua(t);
  return t;
};
const doiJson = (t, f) => { const p = join(t, 'lib', 'hub-kho.json'); const x = JSON.parse(readFileSync(p, 'utf8')); f(x); writeFileSync(p, JSON.stringify(x)); };
const chay = (t, ...them) => { const r = spawnSync(process.execPath, [CONG, '--touch', t, '--goc', GOC, ...them], { encoding: 'utf8' }); return { rc: r.status, out: r.stdout + r.stderr }; };

try {
  let r = chay(canh());
  inRa('RANG 1 · canh sach -> exit 0', r.rc === 0, `exit ${r.rc}`);
  r = chay(canh((t) => doiJson(t, (x) => { x.tongCommit += 5; })));
  inRa('RANG 2 · sua tong commit -> SO_LECH', r.rc === 2 && r.out.includes('SO_LECH'), `exit ${r.rc}`);
  r = chay(canh((t) => doiJson(t, (x) => { x.sinhTu.sha = 'deadbee'; })));
  inRa('RANG 3 · commit khong co trong kho -> COMMIT_NGOAI_LICH_SU', r.rc === 2 && r.out.includes('COMMIT_NGOAI_LICH_SU'), `exit ${r.rc}`);
  r = chay(canh((t) => doiJson(t, (x) => { x.tenKho = 'https://ghp_GIA000@github.com/nclamvn/CLM.git'; })));
  inRa('RANG 4 · tenKho mang URL co token -> LO_THONG_TIN', r.rc === 2 && r.out.includes('LO_THONG_TIN'), `exit ${r.rc}`);
  r = chay(canh((t) => writeFileSync(join(t, 'lib', 'repos-view.ts'), "export const reposView = [{ name: 'touch-hub', head: '77f850d' }];\n")));
  inRa('RANG 5 · repos-view.ts quay lai -> GHI_TAY_QUAY_LAI', r.rc === 2 && r.out.includes('GHI_TAY_QUAY_LAI'), `exit ${r.rc}`);
  r = chay(canh((t) => { const p = join(t, 'app', 'dashboard', 'repos', 'page.tsx'); writeFileSync(p, readFileSync(p, 'utf8').replace("import kho from '@/lib/hub-kho.json';", "import kho from '@/lib/hub-kho.json';\nimport { reposView } from '@/lib/repos-view';")); }));
  inRa('RANG 6 · trang nhap repos-view -> GHI_TAY_QUAY_LAI', r.rc === 2 && r.out.includes('GHI_TAY_QUAY_LAI'), `exit ${r.rc}`);

  const t = canh();
  const goc = readFileSync(join(t, 'lib', 'kho.mjs'), 'utf8');
  const moc = "soTep: dong(git('ls-tree', '-r', '--name-only', full, '--', p.thuMuc)).length,";
  const hong = goc.replace(moc, "soTep: dong(git('ls-tree', '-r', '--name-only', full, '--', p.thuMuc)).length + 1,");
  if (hong === goc) inRa('RANG 7 · module dem them mot tep -> SO_LECH', false, `KHONG TIEM DUOC: khong thay "${moc}"`);
  else {
    writeFileSync(join(t, 'lib', 'kho.mjs'), hong);
    const m = await import(pathToFileURL(join(t, 'lib', 'kho.mjs')).href);
    const cu = JSON.parse(readFileSync(join(t, 'lib', 'hub-kho.json'), 'utf8'));
    writeFileSync(join(t, 'lib', 'hub-kho.json'), JSON.stringify(m.dungKho(GOC, cu.sinhTu.sha)));
    r = chay(t, '--mo-dun', join(t, 'lib', 'kho.mjs'));
    inRa('RANG 7 · module dem them mot tep -> SO_LECH', r.rc === 2 && r.out.includes('SO_LECH') && !r.out.includes('KHO_LECH'), `exit ${r.rc}`);
  }
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE KHO: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
