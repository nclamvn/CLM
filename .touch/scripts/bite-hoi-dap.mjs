#!/usr/bin/env node
/**
 * bite-hoi-dap.mjs · Rang cua check-hoi-dap.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep lib/cncl-registry.json, cncl-match.json, hub-hoi-dap.json, lib/hoi-dap.mjs,
 * lib/tim-kiem.mjs va scripts/hoi_dap_chuan.json vao thu muc tam (mkdtempSync), tiem loi vao BAN
 * SAO (module, chi muc, bo cau chuan). File that khong bi cham. Du lieu that doi thi rang van
 * can, vi moi phep tiem dua tren hanh vi (bia cau, khong tu choi, lac de) chu khong tren mot
 * don vi cu the.
 *
 * RANG
 * ====
 * RANG 1 · canh sach -> exit 0.
 * RANG 2 · module sua cau trich (them chu "va da xuat khau") -> TRICH_BIA.
 * RANG 3 · module khong bao gio tu choi (khong khop thi tra don vi dau tien) -> KHONG_TU_CHOI.
 * RANG 4 · bo cau chuan doi them mot don vi khong lien quan -> CAU_CHUAN_HONG.
 * RANG 5 · chi muc da sinh bi sua mot cau nguon -> CHI_MUC_LECH.
 * RANG 6 · module bo dieu kien khop (moi cau nang luc deu dat) -> TRICH_LAC_DE.
 * (25/10/2026, chieu cau)
 * RANG 7  · module coi moi cau hoi la hoi ve ben cung (laHoiCau luon false) -> HIEU_NHAM.
 * RANG 8  · module sua cau trich cua nhu cau -> TRICH_BIA.
 * RANG 9  · module bo loc ben dat hang ("Ha Noi can gi?" ra nhu cau cua ca nuoc) -> TRICH_LAC_DE.
 * RANG 10 · chi muc cau that bi sua mot cau nguon -> CHI_MUC_CAU_LECH.
 * RANG 11 · module khong tu choi cau hoi cau mo ho ("may cat co") -> KHONG_TU_CHOI.
 *
 * Chay: node scripts/bite-hoi-dap.mjs     Exit 0 moi rang can · 2 co rang khong can.
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const CONG = join(HERE, 'check-hoi-dap.mjs');
const kq = []; const tam = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(62)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };

function canh(sua) {
  const t = mkdtempSync(join(tmpdir(), 'bite_hoi_dap_')); tam.push(t);
  mkdirSync(join(t, 'lib'));
  for (const f of ['cncl-registry.json', 'cncl-match.json', 'hub-hoi-dap.json', 'hoi-dap.mjs', 'tim-kiem.mjs', 'hub-cau-that.json', 'hub-hoi-dap-cau.json']) copyFileSync(join(TOUCH, 'lib', f), join(t, 'lib', f));
  copyFileSync(join(HERE, 'hoi_dap_chuan.json'), join(t, 'chuan.json'));
  if (sua) sua(t);
  const r = spawnSync(process.execPath, [CONG, '--lib', join(t, 'lib'), '--mo-dun', join(t, 'lib', 'hoi-dap.mjs'), '--chuan', join(t, 'chuan.json')], { encoding: 'utf8' });
  return { rc: r.status, out: r.stdout + r.stderr };
}
const doiFile = (p, f) => writeFileSync(p, f(readFileSync(p, 'utf8')));
const doiModule = (t, tu, den) => doiFile(join(t, 'lib', 'hoi-dap.mjs'), (s) => {
  if (!s.includes(tu)) throw new Error(`KHONG TIEM DUOC: khong thay "${tu.slice(0, 50)}"`);
  return s.replace(tu, den);
});
const thu = (nhan, sua, ky) => {
  try {
    const r = canh(sua);
    inRa(nhan, ky ? r.rc === 2 && r.out.includes(ky) : r.rc === 0, `exit ${r.rc}`);
  } catch (e) { inRa(nhan, false, e.message); }
};

try {
  thu('RANG 1 · canh sach -> exit 0', null, null);
  thu('RANG 2 · module sua cau trich -> TRICH_BIA',
    (t) => doiModule(t, 'tro.trich.push({ span: d.span,', "tro.trich.push({ span: d.span + ' va da xuat khau',"), 'TRICH_BIA');
  thu('RANG 3 · module khong bao gio tu choi -> KHONG_TU_CHOI',
    (t) => doiModule(t, '  if (!ra.donVi.length) {', "  if (!ra.donVi.length && cm.taiLieu.length) { const d = cm.taiLieu[0]; ra.donVi = [{ dv: d.dv, slug: d.slug, diem: 1, trich: [], kyCho: [] }]; }\n  if (!ra.donVi.length) {"), 'KHONG_TU_CHOI');
  thu('RANG 4 · bo cau chuan doi don vi khong lien quan -> CAU_CHUAN_HONG',
    (t) => doiFile(join(t, 'chuan.json'), (s) => { const x = JSON.parse(s); x.cau[0].phai_co.push('Viện Di truyền Nông nghiệp Việt Nam'); return JSON.stringify(x); }), 'CAU_CHUAN_HONG');
  thu('RANG 5 · chi muc bi sua mot cau nguon -> CHI_MUC_LECH',
    (t) => doiFile(join(t, 'lib', 'hub-hoi-dap.json'), (s) => { const x = JSON.parse(s); x.taiLieu[0].span += ' (sua)'; return JSON.stringify(x); }), 'CHI_MUC_LECH');
  thu('RANG 6 · module bo dieu kien khop -> TRICH_LAC_DE',
    (t) => doiModule(t, 'if (!trung.length || nang < can) continue;', 'if (false) continue;'), 'TRICH_LAC_DE');
  thu('RANG 7 · moi cau hoi deu hieu la hoi ben cung -> HIEU_NHAM',
    (t) => doiModule(t, "return / (can|dat hang|nhu cau|bai toan|ben dat hang|dau bai) /.test(k);", 'return false && k;'), 'HIEU_NHAM');
  thu('RANG 8 · module sua cau trich cua nhu cau -> TRICH_BIA',
    (t) => doiModule(t, 'diem, khop: trung.map((x) => x.nhan), trich, trichBen', "diem, khop: trung.map((x) => x.nhan), trich: trich.map((x) => ({ ...x, span: x.span + ' va da ky hop dong' })), trichBen"), 'TRICH_BIA');
  thu('RANG 9 · bo loc ben dat hang -> TRICH_LAC_DE',
    (t) => doiModule(t, 'const tap = benHoi.length ? cc.nhuCau.filter((n) => benHoi.includes(n.ben)) : cc.nhuCau;', 'const tap = cc.nhuCau;'), 'TRICH_LAC_DE');
  thu('RANG 10 · chi muc cau that bi sua -> CHI_MUC_CAU_LECH',
    (t) => doiFile(join(t, 'lib', 'hub-hoi-dap-cau.json'), (s) => { const x = JSON.parse(s); x.nhuCau[0].trich[0].span += ' (sua)'; return JSON.stringify(x); }), 'CHI_MUC_CAU_LECH');
  thu('RANG 11 · khong tu choi cau hoi cau mo ho -> KHONG_TU_CHOI',
    (t) => doiModule(t, 'if (!benHoi.length && kn.length === 1 && kn[0].le) {', 'if (false) {'), 'KHONG_TU_CHOI');
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE HOI DAP: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
