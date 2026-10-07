#!/usr/bin/env node
/**
 * bite-hien-cau.mjs · Rang cua check-hien-cau.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep lib/cncl-registry.json, lib/hub-thoi-cuoc.json, lib/hien-cau.mjs va mot
 * component gia vao thu muc tam (mkdtempSync), tiem loi vao BAN SAO. File that khong bi cham.
 * Phep tiem la loi co that (cat chu cua nguon, bo luat go dam, hien thang span) nen du lieu doi
 * thi rang van can.
 *
 * RANG
 * ====
 * RANG 1 · canh sach -> exit 0.
 * RANG 2 · module "lam dep" bang cach cat tu cuoi cau -> MAT_CHU.
 * RANG 3 · module bo luat go dau dam -> CON_DAU.
 * RANG 4 · component hien thang {e.span} trong blockquote -> CAU_THO.
 * RANG 5 · module nuot noi dung lien ket ([FPT](url) -> rong) -> MAT_CHU.
 * RANG 6 · (02/10/2026) module bo luat go dau nghieng (*Stemona tuberosa*) -> CON_DAU.
 * RANG 7 · (07/10/2026) component mo ban chup o tab moi thay vi cua so tren trang -> BAN_CHUP_TAB_MOI.
 *
 * Chay: node scripts/bite-hien-cau.mjs     Exit 0 moi rang can · 2 co rang khong can.
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const LIB = join(HERE, '..', 'lib');
const CONG = join(HERE, 'check-hien-cau.mjs');
const kq = []; const tam = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(60)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const canh = () => {
  const t = mkdtempSync(join(tmpdir(), 'bite_hien_cau_')); tam.push(t);
  mkdirSync(join(t, 'lib')); mkdirSync(join(t, 'ui'));
  for (const f of ['cncl-registry.json', 'hub-thoi-cuoc.json', 'cncl-cau-dat-hang.json', 'hien-cau.mjs']) if (existsSync(join(LIB, f))) copyFileSync(join(LIB, f), join(t, 'lib', f));
  writeFileSync(join(t, 'ui', 'Sach.tsx'), 'export const A = ({ e }) => <blockquote>{hienCau(e.span)}</blockquote>;\n');
  return t;
};
const chay = (t) => { const r = spawnSync(process.execPath, [CONG, '--lib', join(t, 'lib'), '--quet', join(t, 'ui')], { encoding: 'utf8' }); return { rc: r.status, out: r.stdout + r.stderr }; };
const tiem = (t, cu, moi) => {
  const p = join(t, 'lib', 'hien-cau.mjs'); const s = readFileSync(p, 'utf8');
  if (!s.includes(cu)) return false; writeFileSync(p, s.replace(cu, moi)); return true;
};
const thu = (nhan, ma, buoc) => {
  const t = canh(); if (!buoc(t)) { inRa(nhan, false, 'KHONG TIEM DUOC'); return; }
  const r = chay(t); inRa(nhan, r.rc === 2 && r.out.includes(ma), `exit ${r.rc}`);
};

try {
  const r = chay(canh());
  inRa('RANG 1 · canh sach -> exit 0', r.rc === 0, `exit ${r.rc}`);
  thu('RANG 2 · cat tu cuoi cau -> MAT_CHU', 'MAT_CHU', (t) => tiem(t, '    .trim();', "    .trim().replace(/\\s*\\S+$/, '');"));
  thu('RANG 3 · bo luat go dam -> CON_DAU', 'CON_DAU', (t) => tiem(t, ".replace(/\\*\\*|__/g, '')", ''));
  thu('RANG 4 · component hien thang span -> CAU_THO', 'CAU_THO', (t) => { writeFileSync(join(t, 'ui', 'Tho.tsx'), 'export const B = ({ e }) => <blockquote>{e.span}</blockquote>;\n'); return true; });
  thu('RANG 5 · nuot chu cua lien ket -> MAT_CHU', 'MAT_CHU', (t) => tiem(t, ".replace(/\\[([^\\]]+)\\]\\([^)]*\\)/g, '$1')", ".replace(/\\[([^\\]]+)\\]\\([^)]*\\)/g, '')"));
  thu('RANG 6 · bo luat go dau nghieng -> CON_DAU', 'CON_DAU', (t) => { const p = join(t, 'lib', 'hien-cau.mjs'); const g = readFileSync(p, 'utf8').split('\n'); const k = g.findIndex((l) => l.includes('// nghieng')); if (k < 0) return false; g.splice(k, 1); writeFileSync(p, g.join('\n')); return true; });
  thu('RANG 7 · ban chup mo tab moi -> BAN_CHUP_TAB_MOI', 'BAN_CHUP_TAB_MOI', (t) => { writeFileSync(join(t, 'ui', 'Tab.tsx'), 'export const C = ({ e }) => <a className="pf-link" href={e.href} target="_blank" rel="noopener noreferrer">Mở bản chụp</a>;\n'); return true; });
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE HIEN CAU: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
