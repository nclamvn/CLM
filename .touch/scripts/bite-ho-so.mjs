#!/usr/bin/env node
/**
 * bite-ho-so.mjs · Rang cua check-ho-so.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep 5 file lib THAT (hub-ho-so, cncl-registry, cncl-match, hub-graph,
 * hub-events) vao thu muc tam (mkdtempSync) roi tiem loi vao BAN SAO. Domain dung ban THAT
 * (chi doc), tru rang 11 chep domain.yaml + ngan sach vao thu muc tam. Moi phep tiem chon don
 * vi tu du lieu (vd don vi dau tien co qua han), khong go ten.
 *
 * RANG
 * ====
 * RANG 1  · CANH SACH -> exit 0.
 * RANG 2  · THEM "diem": 87 vao mot ho so -> DIEM_TONG_HOP.
 * RANG 3  · GHI DA DINH DANH voi ma so bia -> DINH_DANH_BIA.
 * RANG 4  · XOA MOT O TRONG -> O_TRONG_GIAU.
 * RANG 5  · HA quaHan VE 0 cho don vi dang co no -> TUOI_LECH.
 * RANG 6  · HAI HO SO TRUNG SLUG -> SLUG_TRUNG.
 * RANG 7  · ROT MOT HO SO -> DEM_LECH.
 * RANG 8  · XOA NGUOI KY cua mot match -> MATCH_KHONG_CHU_KY.
 * RANG 9  · SUA SO CAU NGUON -> DEM_LECH (va HO_SO_LECH).
 * RANG 10 · MODULE BI DOC: coi moi cau qua han la "giu nguon cu", ho so sinh TU module do (lop A
 *           khop nhau) -> lop B doc lap phai bat TUOI_LECH.
 * RANG 11 · NGAN SACH CONG PYTHON THAP HON so qua han -> TUOI_LECH_CONG_PY.
 *
 * Chay: node scripts/bite-ho-so.mjs
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { goc } from './goc.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const LIB = join(HERE, '..', 'lib');
const CONG = join(HERE, 'check-ho-so.mjs');
const FILES = ['hub-ho-so.json', 'cncl-registry.json', 'cncl-match.json', 'hub-graph.json', 'hub-events.json'];
const DOMAIN = process.env.CLM_KHO_CNCL ? join(process.env.CLM_KHO_CNCL, 'domains', 'don_vi_cncl') : goc('CNCLData', 'domains', 'don_vi_cncl');
const kq = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(58)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const tam = [];
const canh = (sua) => {
  const t = mkdtempSync(join(tmpdir(), 'bite_ho_so_')); tam.push(t);
  mkdirSync(join(t, 'lib'));
  for (const f of FILES) copyFileSync(join(LIB, f), join(t, 'lib', f));
  if (sua) {
    const p = join(t, 'lib', 'hub-ho-so.json');
    const h = JSON.parse(readFileSync(p, 'utf8')); sua(h);
    writeFileSync(p, JSON.stringify(h));
  }
  return t;
};
const chay = (t, ...them) => { const r = spawnSync(process.execPath, [CONG, '--lib', join(t, 'lib'), '--domain', DOMAIN, ...them], { encoding: 'utf8' }); return { rc: r.status, out: r.stdout + r.stderr }; };
const coNo = (h) => h.units.find((u) => u.doTuoi.quaHan > 0);
const coTrong = (h) => h.units.find((u) => u.oTrong.length > 0);
const coMatch = (h) => h.units.find((u) => u.nhuCau.some((n) => n.matchId));

try {
  let r = chay(canh());
  inRa('RANG 1 · canh sach -> exit 0', r.rc === 0, `exit ${r.rc}`);
  r = chay(canh((h) => { h.units[0].diem = 87; }));
  inRa('RANG 2 · them diem tong hop -> DIEM_TONG_HOP', r.rc === 2 && r.out.includes('DIEM_TONG_HOP'), `exit ${r.rc}`);
  r = chay(canh((h) => { h.units[0].dinhDanh = { trangThai: 'da_dinh_danh', maSo: '0100000000', href: null }; }));
  inRa('RANG 3 · dinh danh bia -> DINH_DANH_BIA', r.rc === 2 && r.out.includes('DINH_DANH_BIA'), `exit ${r.rc}`);
  r = chay(canh((h) => { coTrong(h).oTrong.shift(); }));
  inRa('RANG 4 · giau mot o trong -> O_TRONG_GIAU', r.rc === 2 && r.out.includes('O_TRONG_GIAU'), `exit ${r.rc}`);
  r = chay(canh((h) => { coNo(h).doTuoi.quaHan = 0; }));
  inRa('RANG 5 · xoa no do tuoi -> TUOI_LECH', r.rc === 2 && r.out.includes('TUOI_LECH'), `exit ${r.rc}`);
  r = chay(canh((h) => { h.units[1].slug = h.units[0].slug; }));
  inRa('RANG 6 · trung slug -> SLUG_TRUNG', r.rc === 2 && r.out.includes('SLUG_TRUNG'), `exit ${r.rc}`);
  r = chay(canh((h) => { h.units.pop(); }));
  inRa('RANG 7 · rot mot ho so -> DEM_LECH', r.rc === 2 && r.out.includes('DEM_LECH'), `exit ${r.rc}`);
  r = chay(canh((h) => { const n = coMatch(h).nhuCau.find((x) => x.matchId); delete n.ky; }));
  inRa('RANG 8 · xoa nguoi ky -> MATCH_KHONG_CHU_KY', r.rc === 2 && r.out.includes('MATCH_KHONG_CHU_KY'), `exit ${r.rc}`);
  r = chay(canh((h) => { h.units[0].dem.cauNguon += 3; }));
  inRa('RANG 9 · sua so cau nguon -> DEM_LECH', r.rc === 2 && r.out.includes('DEM_LECH'), `exit ${r.rc}`);

  // RANG 10: module doc + ho so sinh tu chinh module doc.
  const t = canh();
  const goc10 = readFileSync(join(LIB, 'ho-so.mjs'), 'utf8');
  const moc = ": (e.note ?? '').includes(MIEN_TRU) ? 'giu_nguon_cu' : 'qua_han';";
  const doc = goc10.replace(moc, ": 'giu_nguon_cu';");
  if (doc === goc10) inRa('RANG 10 · module coi qua han la giu nguon cu -> TUOI_LECH', false, `KHONG TIEM DUOC: khong thay "${moc}"`);
  else {
    writeFileSync(join(t, 'lib', 'ho-so.mjs'), doc);
    copyFileSync(join(LIB, 'tim-kiem.mjs'), join(t, 'lib', 'tim-kiem.mjs'));
    const m = await import(pathToFileURL(join(t, 'lib', 'ho-so.mjs')).href);
    const d = (f) => JSON.parse(readFileSync(join(t, 'lib', f), 'utf8'));
    const cauHinh = m.docCauHinhDomain(readFileSync(join(DOMAIN, 'domain.yaml'), 'utf8'));
    const hs = m.dungHoSo({ reg: d('cncl-registry.json'), mat: d('cncl-match.json'), graph: d('hub-graph.json'), ev: d('hub-events.json'), ...cauHinh });
    hs.meta.cumDeNham = cauHinh.cumDeNham;
    writeFileSync(join(t, 'lib', 'hub-ho-so.json'), JSON.stringify(hs));
    r = chay(t, '--mo-dun', join(t, 'lib', 'ho-so.mjs'));
    inRa('RANG 10 · module coi qua han la giu nguon cu -> TUOI_LECH', r.rc === 2 && r.out.includes('TUOI_LECH') && !r.out.includes('HO_SO_LECH'), `exit ${r.rc}`);
  }

  // RANG 11: ngan sach Python thap hon so ho so dem.
  const t11 = canh();
  const d11 = join(t11, 'domain'); mkdirSync(d11);
  copyFileSync(join(DOMAIN, 'domain.yaml'), join(d11, 'domain.yaml'));
  const tong = JSON.parse(readFileSync(join(LIB, 'hub-ho-so.json'), 'utf8')).units.reduce((s, u) => s + u.doTuoi.quaHan, 0);
  writeFileSync(join(d11, 'ngan_sach_do_tuoi.txt'), `${Math.max(0, tong - 5)}\n# ban tam cua rang 11\n`);
  const r11 = spawnSync(process.execPath, [CONG, '--lib', join(t11, 'lib'), '--domain', d11], { encoding: 'utf8' });
  inRa('RANG 11 · ngan sach Python thap hon -> TUOI_LECH_CONG_PY', r11.status === 2 && (r11.stdout + r11.stderr).includes('TUOI_LECH_CONG_PY'), `exit ${r11.status}`);
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE HO SO: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
