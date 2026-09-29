#!/usr/bin/env node
/**
 * bite-do-thi.mjs · Nam rang cua check-do-thi.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep lib/hub-graph.json THAT vao thu muc tam (mkdtempSync) roi tiem loi vao
 * BAN SAO; ban hong cua ham bo tri cung viet trong thu muc tam. Khong sua file that. Do thi co
 * bao nhieu nut, rang van chay: moi phep tiem chon nut dau tien trong ban sao.
 *
 * RANG
 * ====
 * RANG 1 · CANH SACH -> exit 0.
 * RANG 2 · SUA TAY MOT TOA DO -> exit 2 (TOA_DO_LECH).
 * RANG 3 · TOA DO NaN -> exit 2 (TOA_DO_HONG).
 * RANG 4 · HAM BO TRI DUNG Math.random -> exit 2 (KHONG_TAT_DINH).
 * RANG 5 · ROT MOT NUT KHOI DO THI -> exit 2 (THIEU_NUT).
 *
 * Chay: node scripts/bite-do-thi.mjs
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CONG = join(HERE, 'check-do-thi.mjs');
const GOC = readFileSync(join(HERE, '..', 'lib', 'hub-graph.json'), 'utf8');
const MO_DUN = readFileSync(join(HERE, '..', 'lib', 'do-thi-layout.mjs'), 'utf8');
const kq = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(52)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const tam = [];
const canh = (sua) => {
  const t = mkdtempSync(join(tmpdir(), 'bite_do_thi_')); tam.push(t);
  mkdirSync(join(t, 'lib'));
  const g = JSON.parse(GOC); if (sua) sua(g);
  writeFileSync(join(t, 'lib', 'hub-graph.json'), JSON.stringify(g));
  return t;
};
const chay = (t, ...them) => { const r = spawnSync(process.execPath, [CONG, '--lib', join(t, 'lib'), ...them], { encoding: 'utf8' }); return { rc: r.status, out: r.stdout + r.stderr }; };

try {
  let r = chay(canh());
  inRa('RANG 1 · canh sach -> exit 0', r.rc === 0, `exit ${r.rc}`);
  r = chay(canh((g) => { g.nodes[0].x = Math.min(1, g.nodes[0].x + 0.1); }));
  inRa('RANG 2 · sua tay mot toa do -> exit 2', r.rc === 2 && r.out.includes('TOA_DO_LECH'), `exit ${r.rc}`);
  r = chay(canh((g) => { g.nodes[0].y = null; }));
  inRa('RANG 3 · toa do hong -> exit 2', r.rc === 2 && r.out.includes('TOA_DO_HONG'), `exit ${r.rc}`);
  const t = canh();
  const hong = MO_DUN.replace('const rnd = hatGiong(tuy.seed ?? 20260929);', 'const rnd = Math.random;');
  if (hong === MO_DUN) inRa('RANG 4 · bo tri dung Math.random -> exit 2', false, 'KHONG TIEM DUOC: khong thay dong hat giong');
  else {
    writeFileSync(join(t, 'hong.mjs'), hong);
    r = chay(t, '--mo-dun', join(t, 'hong.mjs'));
    inRa('RANG 4 · bo tri dung Math.random -> exit 2', r.rc === 2 && r.out.includes('KHONG_TAT_DINH'), `exit ${r.rc}`);
  }
  r = chay(canh((g) => { g.nodes.pop(); }));
  inRa('RANG 5 · rot mot nut -> exit 2', r.rc === 2 && r.out.includes('THIEU_NUT'), `exit ${r.rc}`);
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE DO THI: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
