#!/usr/bin/env node
/**
 * bite-bao-cao.mjs · Rang cua check-bao-cao.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep cac file lib/*.json can doc va lib/bao-cao.mjs vao thu muc tam
 * (mkdtempSync), tiem loi vao BAN SAO. File that khong bi cham. Phep tiem dua tren hanh vi (thoi
 * phong so da ky, module dem sai, sai ky) nen du lieu that doi thi rang van can.
 *
 * RANG
 * ====
 * RANG 1 · canh sach -> exit 0.
 * RANG 2 · thoi phong so da ky trong file bao cao -> BAO_CAO_LECH.
 * RANG 3 · MODULE dem trong sai (bo mot nhu cau trong) VA file sinh tu module do -> SO_LECH
 *          (chi lop dem doc lap bat duoc, vi file va module khop nhau).
 * RANG 4 · ky bao cao ghi "Quý I/2026" -> KY_SAI.
 *
 * Chay: node scripts/bite-bao-cao.mjs     Exit 0 moi rang can · 2 co rang khong can.
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const LIB = join(HERE, '..', 'lib');
const CONG = join(HERE, 'check-bao-cao.mjs');
const FILES = ['hub-bao-cao.json', 'cncl-registry.json', 'cncl-match.json', 'hub-graph.json', 'hub-thi-truong.json', 'hub-mo-dau.json', 'hub-xu-huong.json', 'bao-cao.mjs'];
const kq = []; const tam = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(60)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const canh = () => {
  const t = mkdtempSync(join(tmpdir(), 'bite_bao_cao_')); tam.push(t);
  mkdirSync(join(t, 'lib'));
  for (const f of FILES) if (existsSync(join(LIB, f))) copyFileSync(join(LIB, f), join(t, 'lib', f));
  return t;
};
const chay = (t) => { const r = spawnSync(process.execPath, [CONG, '--lib', join(t, 'lib'), '--mo-dun', join(t, 'lib', 'bao-cao.mjs')], { encoding: 'utf8' }); return { rc: r.status, out: r.stdout + r.stderr }; };
const doiJson = (t, f) => { const p = join(t, 'lib', 'hub-bao-cao.json'); const x = JSON.parse(readFileSync(p, 'utf8')); f(x); writeFileSync(p, JSON.stringify(x)); };

try {
  let t = canh(); let r = chay(t);
  inRa('RANG 1 · canh sach -> exit 0', r.rc === 0, `exit ${r.rc}`);
  t = canh(); doiJson(t, (x) => { x.so.daKy += 3; }); r = chay(t);
  inRa('RANG 2 · thoi phong so da ky -> BAO_CAO_LECH', r.rc === 2 && r.out.includes('BAO_CAO_LECH'), `exit ${r.rc}`);
  t = canh();
  const p = join(t, 'lib', 'bao-cao.mjs'); const goc = readFileSync(p, 'utf8');
  const moc = "const trong = sp.filter((x) => x.trangThai === 'trong');";
  if (!goc.includes(moc)) inRa('RANG 3 · module dem trong sai -> SO_LECH', false, 'KHONG TIEM DUOC');
  else {
    writeFileSync(p, goc.replace(moc, "const trong = sp.filter((x) => x.trangThai === 'trong').slice(1);"));
    const m = await import(pathToFileURL(p).href + '?t=' + Date.now());
    const d = (f) => JSON.parse(readFileSync(join(t, 'lib', f), 'utf8'));
    writeFileSync(join(t, 'lib', 'hub-bao-cao.json'), JSON.stringify(m.dungBaoCao({ thiTruong: d('hub-thi-truong.json'), moDau: d('hub-mo-dau.json'), xuHuong: d('hub-xu-huong.json') }), null, 1) + '\n');
    r = chay(t);
    inRa('RANG 3 · module dem trong sai -> SO_LECH', r.rc === 2 && r.out.includes('SO_LECH') && !r.out.includes('BAO_CAO_LECH'), `exit ${r.rc}`);
  }
  t = canh(); doiJson(t, (x) => { x.ky = 'Quý I/2026'; }); r = chay(t);
  inRa('RANG 4 · sai ky bao cao -> KY_SAI', r.rc === 2 && r.out.includes('KY_SAI'), `exit ${r.rc}`);
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE BAO CAO: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
