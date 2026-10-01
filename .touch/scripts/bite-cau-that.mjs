#!/usr/bin/env node
/**
 * bite-cau-that.mjs · Rang cua check-cau-that.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep lib/hub-cau-that.json, cncl-cau-dat-hang.json, cncl-registry.json,
 * cncl-match.json, hub-hoi-dap.json, hub-ten.json va lib/cau-that.mjs, cung components/cauthat/CauThat.tsx,
 * vao thu muc tam (mkdtempSync), tiem loi vao BAN SAO. Ban chup doc tu public/ that (chi doc).
 * Phep tiem chon theo hanh vi (goi y dau tien co trich, nhu cau dau tien...) nen du lieu doi thi
 * rang van can.
 *
 * RANG
 * ====
 * RANG 1 · canh sach -> exit 0.
 * RANG 2 · sua mot chu trong cau trich cua goi y -> GOI_Y_KHONG_NGUON (tra doc lap evidence registry).
 * RANG 3 · goi y tu nhan da ky MATCH-9999 -> KY_GIA.
 * RANG 4 · thoi phong so nhu cau trong meta -> SO_LECH (va CAU_THAT_LECH).
 * RANG 5 · bo mot cau nguon khoi mot nhu cau -> NGUON_LECH.
 * RANG 6 · giao dien bo chu "chưa ký" -> NHAN_THIEU.
 *
 * Chay: node scripts/bite-cau-that.mjs     Exit 0 moi rang can · 2 co rang khong can.
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const CONG = join(HERE, 'check-cau-that.mjs');
const FILES = ['hub-cau-that.json', 'cncl-cau-dat-hang.json', 'cncl-registry.json', 'cncl-match.json', 'hub-hoi-dap.json', 'hub-ten.json', 'cau-that.mjs'];
const kq = []; const tam = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(60)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const canh = () => {
  const t = mkdtempSync(join(tmpdir(), 'bite_cau_that_')); tam.push(t);
  mkdirSync(join(t, 'lib'));
  for (const f of FILES) copyFileSync(join(TOUCH, 'lib', f), join(t, 'lib', f));
  copyFileSync(join(TOUCH, 'components', 'cauthat', 'CauThat.tsx'), join(t, 'CauThat.tsx'));
  return t;
};
const chay = (t) => {
  const r = spawnSync(process.execPath, [CONG, '--lib', join(t, 'lib'), '--public', join(TOUCH, 'public'), '--mo-dun', join(t, 'lib', 'cau-that.mjs'), '--giao-dien', join(t, 'CauThat.tsx')], { encoding: 'utf8' });
  return { rc: r.status, out: r.stdout + r.stderr };
};
const doi = (t, f, g) => { const p = join(t, 'lib', f); const x = JSON.parse(readFileSync(p, 'utf8')); g(x); writeFileSync(p, JSON.stringify(x)); };
const thu = (nhan, ma, buoc) => {
  const t = canh();
  try { buoc(t); } catch (e) { inRa(nhan, false, `KHONG TIEM DUOC ${e.message}`); return; }
  const r = chay(t); inRa(nhan, r.rc === 2 && r.out.includes(ma), `exit ${r.rc}`);
};

try {
  const r = chay(canh());
  inRa('RANG 1 · canh sach -> exit 0', r.rc === 0, `exit ${r.rc}`);
  thu('RANG 2 · sua cau trich goi y -> GOI_Y_KHONG_NGUON', 'GOI_Y_KHONG_NGUON', (t) => {
    let cu = null;
    doi(t, 'hub-cau-that.json', (x) => { const g = x.nhuCau.flatMap((n) => n.goiY).find((q) => q.trich); cu = g.trich.span; g.trich.span += ' (them)'; });
    if (!cu) throw new Error('khong co goi y nao co trich');
  });
  thu('RANG 3 · goi y tu nhan da ky -> KY_GIA', 'KY_GIA', (t) => doi(t, 'hub-cau-that.json', (x) => { x.nhuCau.find((n) => n.goiY.length).goiY[0].kyCho.push('MATCH-9999'); }));
  thu('RANG 4 · thoi phong so nhu cau -> SO_LECH', 'SO_LECH', (t) => doi(t, 'hub-cau-that.json', (x) => { x.meta.soNhuCau += 5; }));
  thu('RANG 5 · bo mot cau nguon -> NGUON_LECH', 'NGUON_LECH', (t) => doi(t, 'hub-cau-that.json', (x) => { x.nhuCau.find((n) => n.nguon.length > 1).nguon.pop(); }));
  thu('RANG 6 · giao dien bo chu "chưa ký" -> NHAN_THIEU', 'NHAN_THIEU', (t) => {
    const p = join(t, 'CauThat.tsx'); const s = readFileSync(p, 'utf8');
    if (!s.includes('chưa ký')) throw new Error('khong co chu de go');
    writeFileSync(p, s.split('chưa ký').join('đã xét'));
  });
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE CAU THAT: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
