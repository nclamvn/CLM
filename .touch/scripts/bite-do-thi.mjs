#!/usr/bin/env node
/**
 * bite-do-thi.mjs · Rang cua check-do-thi.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep lib/hub-graph.json THAT vao thu muc tam (mkdtempSync) roi tiem loi vao
 * BAN SAO; ban hong cua ham bo tri va ngan sach cung viet trong thu muc tam. Khong sua file that.
 * Moi phep tiem chon nut tu du lieu (nut don vi dau tien, canh cung-cau dau tien), khong go ten.
 *
 * RANG
 * ====
 * RANG 1 · CANH SACH -> exit 0.
 * RANG 2 · SUA TAY MOT TOA DO -> exit 2 (TOA_DO_LECH).
 * RANG 3 · TOA DO NaN -> exit 2 (TOA_DO_HONG).
 * RANG 4 · HAM BO TRI DUNG Math.random -> exit 2 (KHONG_TAT_DINH).
 * RANG 5 · ROT MOT NUT KHOI DO THI -> exit 2 (THIEU_NUT).
 * RANG 6 · DAT HAI DAU MUT CUA HAI CANH CHO CHEO NHAU (tao giao canh) -> exit 2 (VUOT_NGAN_SACH).
 * RANG 7 · NGAN SACH CAO HON THUC TE (da sua ma khong ha so) -> exit 2 (NGAN_SACH_CHUA_HA).
 * RANG 8 · DOI THU TU MA TRAN -> exit 2 (MA_TRAN_LECH).
 * RANG 9 · KEO NUT RA NGOAI LANH THO -> exit 2 (NGOAI_LANH_THO).
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
const MO_DUN = readFileSync(join(HERE, '..', 'lib', 'do-thi-ban-do.mjs'), 'utf8');
const NS = JSON.parse(readFileSync(join(HERE, 'ngan_sach_do_thi.json'), 'utf8'));
const CHEO = ['cung_san_pham', 'match_da_ky', 'tu_choi'];
const kq = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(58)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const tam = [];
const canh = (sua, suaNs) => {
  const t = mkdtempSync(join(tmpdir(), 'bite_do_thi_')); tam.push(t);
  mkdirSync(join(t, 'lib'));
  const g = JSON.parse(GOC); if (sua) sua(g);
  writeFileSync(join(t, 'lib', 'hub-graph.json'), JSON.stringify(g));
  const ns = { ...NS }; if (suaNs) suaNs(ns);
  writeFileSync(join(t, 'ns.json'), JSON.stringify(ns));
  return t;
};
const chay = (t, ...them) => { const r = spawnSync(process.execPath, [CONG, '--lib', join(t, 'lib'), '--ngan-sach', join(t, 'ns.json'), ...them], { encoding: 'utf8' }); return { rc: r.status, out: r.stdout + r.stderr }; };
const dv0 = (g) => g.nodes.find((n) => n.kind === 'don_vi');

try {
  let r = chay(canh());
  inRa('RANG 1 · canh sach -> exit 0', r.rc === 0, `exit ${r.rc}`);
  r = chay(canh((g) => { dv0(g).x = Math.round((dv0(g).x + 0.7) * 10) / 10; }));
  inRa('RANG 2 · sua tay mot toa do -> exit 2', r.rc === 2 && r.out.includes('TOA_DO_LECH'), `exit ${r.rc}`);
  r = chay(canh((g) => { dv0(g).y = null; }));
  inRa('RANG 3 · toa do hong -> exit 2', r.rc === 2 && r.out.includes('TOA_DO_HONG'), `exit ${r.rc}`);
  const t = canh();
  const moc = 'const VONG = 420;';
  const hong = MO_DUN.replace(moc, `${moc} for (const q of pos.values()) { q.x += Math.random() * 20; }`);
  if (hong === MO_DUN) inRa('RANG 4 · bo tri dung Math.random -> exit 2', false, `KHONG TIEM DUOC: khong thay "${moc}"`);
  else {
    writeFileSync(join(t, 'hong.mjs'), hong);
    r = chay(t, '--mo-dun', join(t, 'hong.mjs'));
    inRa('RANG 4 · bo tri dung Math.random -> exit 2', r.rc === 2 && r.out.includes('KHONG_TAT_DINH'), `exit ${r.rc}`);
  }
  r = chay(canh((g) => { g.nodes.pop(); }));
  inRa('RANG 5 · rot mot nut -> exit 2', r.rc === 2 && r.out.includes('THIEU_NUT'), `exit ${r.rc}`);
  // RANG 6: lay hai canh cung-cau khong chung dau mut, dat 4 dau mut thanh chu X o goc khung.
  r = chay(canh((g) => {
    const cs = g.edges.filter((e) => CHEO.includes(e.kind));
    const e1 = cs[0]; const e2 = cs.find((e) => ![e1.source, e1.target].includes(e.source) && ![e1.source, e1.target].includes(e.target));
    const n = (id) => g.nodes.find((x) => x.id === id);
    n(e1.source).x = 10; n(e1.source).y = 10; n(e1.target).x = 60; n(e1.target).y = 60;
    n(e2.source).x = 60; n(e2.source).y = 10; n(e2.target).x = 10; n(e2.target).y = 60;
  }));
  inRa('RANG 6 · tao giao canh -> exit 2 (vuot ngan sach)', r.rc === 2 && r.out.includes('VUOT_NGAN_SACH'), `exit ${r.rc}`);
  r = chay(canh(null, (ns) => { ns.giaoCanh += 3; }));
  inRa('RANG 7 · ngan sach cao hon thuc te -> exit 2', r.rc === 2 && r.out.includes('NGAN_SACH_CHUA_HA'), `exit ${r.rc}`);
  r = chay(canh((g) => { g.maTran.hang.reverse(); }));
  inRa('RANG 8 · doi thu tu ma tran -> exit 2', r.rc === 2 && r.out.includes('MA_TRAN_LECH'), `exit ${r.rc}`);
  r = chay(canh((g) => { const n = dv0(g); const l = g.boCuc.lanhTho.find((x) => (x.so ?? 'chua_co') === n.lanhTho); n.x = Math.round((l.cx + l.r + 30) * 10) / 10; n.y = l.cy; }));
  inRa('RANG 9 · keo nut ra ngoai lanh tho -> exit 2', r.rc === 2 && r.out.includes('NGOAI_LANH_THO'), `exit ${r.rc}`);
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE DO THI: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
