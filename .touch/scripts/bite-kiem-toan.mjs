#!/usr/bin/env node
/**
 * bite-kiem-toan.mjs · Rang cua check-kiem-toan.mjs va cong cu doi chieu kiem-ho-so.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep lib/cncl-registry.json, hub-kiem-toan.json va CHI cac ban chup /evidence
 * ma registry dung vao thu muc tam (mkdtempSync), tiem loi vao BAN SAO. File that khong bi cham.
 * Phep tiem chon theo hanh vi (sua mot chu cau nguon dau tien, sua ban chup dau tien) nen du lieu
 * that doi thi rang van can.
 *
 * RANG
 * ====
 * RANG 1 · canh sach -> exit 0.
 * RANG 2 · sua mot chu trong ban chup ma web phuc vu -> KIEM_TOAN_LECH.
 * RANG 3 · sua mot chu trong cau nguon cua registry -> KIEM_TOAN_LECH.
 * RANG 4 · xoa mot ban chup -> BAN_CHUP_THIEU.
 * RANG 5 · cong cu doi chieu: tep ho so bi sua mot cau nguon -> exit 2 (MA_LECH).
 *
 * Chay: node scripts/bite-kiem-toan.mjs     Exit 0 moi rang can · 2 co rang khong can.
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync, copyFileSync, existsSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const CONG = join(HERE, 'check-kiem-toan.mjs');
const reg = JSON.parse(readFileSync(join(TOUCH, 'lib', 'cncl-registry.json'), 'utf8'));
const hrefs = [...new Set(reg.units.flatMap((u) => u.evidence.map((e) => e.href)))];
const kq = []; const tam = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(60)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const canh = () => {
  const t = mkdtempSync(join(tmpdir(), 'bite_kiem_toan_')); tam.push(t);
  mkdirSync(join(t, 'lib')); mkdirSync(join(t, 'public', 'evidence'), { recursive: true });
  for (const f of ['cncl-registry.json', 'hub-kiem-toan.json']) copyFileSync(join(TOUCH, 'lib', f), join(t, 'lib', f));
  for (const h of hrefs) if (existsSync(join(TOUCH, 'public', h))) copyFileSync(join(TOUCH, 'public', h), join(t, 'public', h));
  return t;
};
const chay = (t) => { const r = spawnSync(process.execPath, [CONG, '--lib', join(t, 'lib'), '--public', join(t, 'public')], { encoding: 'utf8' }); return { rc: r.status, out: r.stdout + r.stderr }; };

try {
  let t = canh(); let r = chay(t);
  inRa('RANG 1 · canh sach -> exit 0', r.rc === 0, `exit ${r.rc}`);
  t = canh(); { const p = join(t, 'public', hrefs[0]); writeFileSync(p, readFileSync(p, 'utf8') + ' x'); } r = chay(t);
  inRa('RANG 2 · sua ban chup -> KIEM_TOAN_LECH', r.rc === 2 && r.out.includes('KIEM_TOAN_LECH'), `exit ${r.rc}`);
  t = canh(); { const p = join(t, 'lib', 'cncl-registry.json'); const x = JSON.parse(readFileSync(p, 'utf8')); x.units[0].evidence[0].span += ' x'; writeFileSync(p, JSON.stringify(x)); } r = chay(t);
  inRa('RANG 3 · sua cau nguon -> KIEM_TOAN_LECH', r.rc === 2 && r.out.includes('KIEM_TOAN_LECH'), `exit ${r.rc}`);
  t = canh(); unlinkSync(join(t, 'public', hrefs[hrefs.length - 1])); r = chay(t);
  inRa('RANG 4 · xoa ban chup -> BAN_CHUP_THIEU', r.rc === 2 && r.out.includes('BAN_CHUP_THIEU'), `exit ${r.rc}`);
  t = canh();
  const kt = JSON.parse(readFileSync(join(TOUCH, 'lib', 'hub-kiem-toan.json'), 'utf8'));
  const u = reg.units[0]; const x = kt[u.name];
  const tep = { phienBan: x.phienBan, donVi: x.donVi, ma: x.ma, banChup: x.banChup,
    cauNguon: u.evidence.map((e, i) => ({ field: e.field, value: String(e.value), span: i === 0 ? e.span + ' (sua)' : e.span, href: e.href, tier: e.tier, source: e.source })) };
  writeFileSync(join(t, 'hs.json'), JSON.stringify(tep));
  const r5 = spawnSync(process.execPath, [join(HERE, 'kiem-ho-so.mjs'), join(t, 'hs.json')], { encoding: 'utf8' });
  inRa('RANG 5 · doi chieu tep bi sua -> MA_LECH', r5.status === 2 && r5.stdout.includes('MA_LECH'), `exit ${r5.status}`);
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE KIEM TOAN: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
