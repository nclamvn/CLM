#!/usr/bin/env node
/**
 * bite-thi-truong.mjs · Rang cua check-thi-truong.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep lib THAT (hub-thi-truong, hub-graph, hub-ho-so, cncl-registry,
 * cncl-match) va ngan sach vao thu muc tam (mkdtempSync), tiem loi vao BAN SAO. Moi phep tiem
 * chon phan tu tu du lieu (link trai dau tien, nhu cau trong dau tien...), khong go ten.
 *
 * RANG
 * ====
 * RANG 1 · CANH SACH -> exit 0.
 * RANG 2 · TANG DO DAY MOT DONG -> BAO_TOAN.
 * RANG 3 · XOA MOT NHU CAU TRONG KHOI SANKEY -> KHOANG_TRONG (khoang trong bien mat khoi hinh).
 * RANG 4 · DOI MOT O TRONG THANH "co cung" -> PHU_LECH.
 * RANG 5 · KPI ghi 10 khoang trong (dung loi da xay ra 29/09) -> KHOANG_TRONG.
 * RANG 6 · DUA DON VI TREN CUNG XUONG DAY -> VUOT_NGAN_SACH (dien tich giao tang).
 * RANG 7 · NGAN SACH CAO HON THUC TE -> NGAN_SACH_CHUA_HA.
 * RANG 8 · MODULE BI DOC: cho cap bi tu choi mang dong, file sinh TU module do -> DEM_CAP.
 * RANG 9 · BOT MOT CAU O BIEU DO DO TUOI -> TUOI_LECH.
 *
 * Chay: node scripts/bite-thi-truong.mjs
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const LIB = join(HERE, '..', 'lib');
const CONG = join(HERE, 'check-thi-truong.mjs');
const FILES = ['hub-thi-truong.json', 'hub-graph.json', 'hub-ho-so.json', 'cncl-registry.json', 'cncl-match.json'];
const kq = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(58)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const tam = [];
const canh = (sua, suaNs) => {
  const t = mkdtempSync(join(tmpdir(), 'bite_thi_truong_')); tam.push(t);
  mkdirSync(join(t, 'lib'));
  for (const f of FILES) copyFileSync(join(LIB, f), join(t, 'lib', f));
  if (sua) { const p = join(t, 'lib', 'hub-thi-truong.json'); const x = JSON.parse(readFileSync(p, 'utf8')); sua(x); writeFileSync(p, JSON.stringify(x)); }
  const ns = JSON.parse(readFileSync(join(HERE, 'ngan_sach_do_thi.json'), 'utf8')); if (suaNs) suaNs(ns);
  writeFileSync(join(t, 'ns.json'), JSON.stringify(ns));
  return t;
};
const chay = (t, ...them) => { const r = spawnSync(process.execPath, [CONG, '--lib', join(t, 'lib'), '--ngan-sach', join(t, 'ns.json'), ...them], { encoding: 'utf8' }); return { rc: r.status, out: r.stdout + r.stderr }; };

try {
  let r = chay(canh());
  inRa('RANG 1 · canh sach -> exit 0', r.rc === 0, `exit ${r.rc}`);
  r = chay(canh((x) => { x.sankey.links.find((l) => l.s.startsWith('dv:')).w += 1; }));
  inRa('RANG 2 · tang do day mot dong -> BAO_TOAN', r.rc === 2 && r.out.includes('BAO_TOAN'), `exit ${r.rc}`);
  r = chay(canh((x) => { const i = x.sankey.nodes.findIndex((n) => n.tang === 'nhu_cau' && n.trong); x.sankey.nodes.splice(i, 1); }));
  inRa('RANG 3 · xoa mot khoang trong khoi Sankey -> KHOANG_TRONG', r.rc === 2 && r.out.includes('KHOANG_TRONG'), `exit ${r.rc}`);
  r = chay(canh((x) => { const o = x.phu.flatMap((h) => h.o).find((q) => q.trangThai === 'trong'); o.trangThai = 'co_cung'; }));
  inRa('RANG 4 · o trong thanh co cung -> PHU_LECH', r.rc === 2 && r.out.includes('PHU_LECH'), `exit ${r.rc}`);
  r = chay(canh((x) => { x.kpi.ncTrong -= 1; }));
  inRa('RANG 5 · KPI dem thieu khoang trong -> KHOANG_TRONG', r.rc === 2 && r.out.includes('KHOANG_TRONG'), `exit ${r.rc}`);
  r = chay(canh((x) => {
    const dv = x.sankey.nodes.filter((n) => n.tang === 'don_vi').sort((a, b) => a.y - b.y);
    dv[0].y = dv[dv.length - 1].y + 50;
  }));
  inRa('RANG 6 · dua don vi tren cung xuong day -> VUOT_NGAN_SACH', r.rc === 2 && r.out.includes('VUOT_NGAN_SACH'), `exit ${r.rc}`);
  r = chay(canh(null, (ns) => { ns.sankeyDienTichGiao += 5; }));
  inRa('RANG 7 · ngan sach cao hon thuc te -> NGAN_SACH_CHUA_HA', r.rc === 2 && r.out.includes('NGAN_SACH_CHUA_HA'), `exit ${r.rc}`);

  const t = canh();
  const goc = readFileSync(join(LIB, 'thi-truong.mjs'), 'utf8');
  const moc = "if (e.kind !== 'cung_san_pham' && e.kind !== 'match_da_ky') continue;";
  const doc = goc.replace(moc, "if (e.kind !== 'cung_san_pham' && e.kind !== 'match_da_ky' && e.kind !== 'tu_choi') continue;");
  if (doc === goc) inRa('RANG 8 · module cho cap bi tu choi mang dong -> DEM_CAP', false, `KHONG TIEM DUOC: khong thay "${moc}"`);
  else {
    writeFileSync(join(t, 'lib', 'thi-truong.mjs'), doc);
    const m = await import(pathToFileURL(join(t, 'lib', 'thi-truong.mjs')).href);
    const d = (f) => JSON.parse(readFileSync(join(t, 'lib', f), 'utf8'));
    writeFileSync(join(t, 'lib', 'hub-thi-truong.json'), JSON.stringify(m.dungThiTruong({ graph: d('hub-graph.json'), hoSo: d('hub-ho-so.json') })));
    r = chay(t, '--mo-dun', join(t, 'lib', 'thi-truong.mjs'));
    inRa('RANG 8 · module cho cap bi tu choi mang dong -> DEM_CAP', r.rc === 2 && r.out.includes('DEM_CAP') && !r.out.includes('TT_LECH: file sinh'), `exit ${r.rc}`);
  }
  r = chay(canh((x) => { const n = x.tuoi.nam.find((q) => q.ben > 0); n.ben -= 1; }));
  inRa('RANG 9 · bot mot cau o bieu do do tuoi -> TUOI_LECH', r.rc === 2 && r.out.includes('TUOI_LECH'), `exit ${r.rc}`);
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE THI TRUONG: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
