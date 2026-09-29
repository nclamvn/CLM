#!/usr/bin/env node
/**
 * bite-matching.mjs · Rang cua check-matching.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep cncl-match.json, hub-matching.json, man MatchingWorkbench.tsx va ngan sach
 * vao thu muc tam (mkdtempSync), tiem loi vao BAN SAO. Kho CaoLocMatch that chi DOC (engine,
 * mapping, so ky). Moi phep tiem chon phan tu tu du lieu (match dau tien, match co canh chuoi...).
 *
 * RANG
 * ====
 * RANG 1  · CANH SACH -> exit 0.
 * RANG 2  · HE SO TREN WEB KHAC ENGINE -> CONG_THUC_LECH.
 * RANG 3  · SUA DIEM MOT MATCH -> DIEM_LECH.
 * RANG 4  · THEM TU GIAO KHONG CO TRONG CAU -> TOKEN_HONG.
 * RANG 5  · XOA CANH CHUOI GIA TRI cua match khac nhom -> NEO_NHOM_HONG.
 * RANG 6  · SUA LY DO CUA CANH CHUOI -> CANH_BIA.
 * RANG 7  · "SUA CHO DEP" LY DO TU CHOI (them dau) -> LY_DO_SUA. Chu cua nguoi gac cong khong sua.
 * RANG 8  · MAN CO NUT "Duyệt" VA fetch POST -> DUONG_KY.
 * RANG 9  · DAO THU TU SO DO HAI COT -> VUOT_NGAN_SACH.
 * RANG 10 · NGAN SACH CAO HON THUC TE -> NGAN_SACH_CHUA_HA.
 *
 * Chay: node scripts/bite-matching.mjs
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const LIB = join(HERE, '..', 'lib');
const MAN = join(HERE, '..', 'components', 'dash', 'MatchingWorkbench.tsx');
const CONG = join(HERE, 'check-matching.mjs');
const kq = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(58)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const tam = [];
const canh = ({ mat, hub, man, ns } = {}) => {
  const t = mkdtempSync(join(tmpdir(), 'bite_matching_')); tam.push(t);
  mkdirSync(join(t, 'lib'));
  const sua = (ten, f) => { const x = JSON.parse(readFileSync(join(LIB, ten), 'utf8')); if (f) f(x); writeFileSync(join(t, 'lib', ten), JSON.stringify(x)); };
  sua('cncl-match.json', mat); sua('hub-matching.json', hub);
  writeFileSync(join(t, 'man.tsx'), man ? man(readFileSync(MAN, 'utf8')) : readFileSync(MAN, 'utf8'));
  const n = JSON.parse(readFileSync(join(HERE, 'ngan_sach_do_thi.json'), 'utf8')); if (ns) ns(n);
  writeFileSync(join(t, 'ns.json'), JSON.stringify(n));
  return t;
};
const chay = (t) => { const r = spawnSync(process.execPath, [CONG, '--lib', join(t, 'lib'), '--man', join(t, 'man.tsx'), '--ngan-sach', join(t, 'ns.json')], { encoding: 'utf8' }); return { rc: r.status, out: r.stdout + r.stderr }; };
const khacNhom = (x) => x.signedMatches.find((m) => m.canhChuoi);

try {
  let r = chay(canh());
  inRa('RANG 1 · canh sach -> exit 0', r.rc === 0, `exit ${r.rc}`);
  r = chay(canh({ mat: (x) => { x.matchMeta.congThuc.wGiao = 0.6; } }));
  inRa('RANG 2 · he so web khac engine -> CONG_THUC_LECH', r.rc === 2 && r.out.includes('CONG_THUC_LECH'), `exit ${r.rc}`);
  r = chay(canh({ mat: (x) => { x.signedMatches[0].score = Math.round((x.signedMatches[0].score + 0.05) * 100) / 100; } }));
  inRa('RANG 3 · sua diem mot match -> DIEM_LECH', r.rc === 2 && r.out.includes('DIEM_LECH'), `exit ${r.rc}`);
  r = chay(canh({ mat: (x) => { x.signedMatches[0].tokenGiao.push('tuchebia'); } }));
  inRa('RANG 4 · tu giao khong co trong cau -> TOKEN_HONG', r.rc === 2 && r.out.includes('TOKEN_HONG'), `exit ${r.rc}`);
  r = chay(canh({ mat: (x) => { khacNhom(x).canhChuoi = null; } }));
  inRa('RANG 5 · xoa canh chuoi gia tri -> NEO_NHOM_HONG', r.rc === 2 && r.out.includes('NEO_NHOM_HONG'), `exit ${r.rc}`);
  r = chay(canh({ mat: (x) => { khacNhom(x).canhChuoi.lyDo += ' (da xac minh)'; } }));
  inRa('RANG 6 · sua ly do canh chuoi -> CANH_BIA', r.rc === 2 && r.out.includes('CANH_BIA'), `exit ${r.rc}`);
  r = chay(canh({ mat: (x) => { x.rejectedPairs[0].lyDo = x.rejectedPairs[0].lyDo.replace(/^Ca rac/, 'Cá rác'); } }));
  inRa('RANG 7 · sua cho dep ly do tu choi -> LY_DO_SUA', r.rc === 2 && r.out.includes('LY_DO_SUA'), `exit ${r.rc}`);
  r = chay(canh({ man: (s) => s.replace('export function MatchingWorkbench() {', "function Ky() { return <button type=\"button\" onClick={() => fetch('/api/ky', { method: 'POST' })}>Duyệt</button>; }\nexport function MatchingWorkbench() {") }));
  inRa('RANG 8 · man co nut Duyet va fetch POST -> DUONG_KY', r.rc === 2 && r.out.includes('DUONG_KY'), `exit ${r.rc}`);
  r = chay(canh({ hub: (x) => { x.haiCot.cau.reverse(); } }));
  inRa('RANG 9 · dao thu tu so do hai cot -> VUOT_NGAN_SACH', r.rc === 2 && r.out.includes('VUOT_NGAN_SACH'), `exit ${r.rc}`);
  r = chay(canh({ ns: (n) => { n.workbenchGiao += 3; } }));
  inRa('RANG 10 · ngan sach cao hon thuc te -> NGAN_SACH_CHUA_HA', r.rc === 2 && r.out.includes('NGAN_SACH_CHUA_HA'), `exit ${r.rc}`);
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE MATCHING: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
