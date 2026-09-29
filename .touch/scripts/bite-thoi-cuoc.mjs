#!/usr/bin/env node
/**
 * bite-thoi-cuoc.mjs · Rang cua check-thoi-cuoc.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep 6 file lib THAT, su_kien_chinh_sach.jsonl va thu muc snapshots cua chieu
 * cau vao thu muc tam (mkdtempSync), tiem loi vao BAN SAO. public/evidence that chi doc. Moi phep
 * tiem chon phan tu tu du lieu, khong go ten.
 *
 * RANG
 * ====
 * RANG 1 · CANH SACH -> exit 0.
 * RANG 2 · LAY NGAY CHUP LAM NGAY BAN HANH (ca file nguon lan web) -> NGAY_CHUP_LAM_NGAY_DANG.
 * RANG 3 · SUA MOT CHU TRONG CAU NGUON -> SPAN_BIA.
 * RANG 4 · WEB DOI NGAY SU KIEN, FILE NGUON GIU NGUYEN -> SPAN_BIA.
 * RANG 5 · ROT MOT TIN DON VI -> DON_VI_LECH.
 * RANG 6 · DE XUAT MANG TRANG THAI DA KY -> DE_XUAT_THANH_SU_THAT.
 * RANG 7 · SU KIEN SAU MOC DO -> TUONG_LAI.
 * RANG 8 · SUA MAT DO -> MAT_DO_LECH.
 * RANG 9 · MODULE BI DOC doc ngay chinh sach tu ten ban chup, file sinh TU module do -> SPAN_BIA.
 *
 * Chay: node scripts/bite-thoi-cuoc.mjs
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync, copyFileSync, cpSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { goc } from './goc.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const LIB = join(HERE, '..', 'lib');
const CONG = join(HERE, 'check-thoi-cuoc.mjs');
const DEM = process.env.CLM_KHO_DEM || goc('Dataset_CongNgheChienLuoc');
const FILES = ['hub-thoi-cuoc.json', 'cncl-registry.json', 'cncl-match.json', 'hub-events.json', 'hub-ho-so.json', 'hub-graph.json'];
const kq = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(58)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const tam = [];
const canh = ({ web, sk } = {}) => {
  const t = mkdtempSync(join(tmpdir(), 'bite_thoi_cuoc_')); tam.push(t);
  mkdirSync(join(t, 'lib')); mkdirSync(join(t, 'dem'));
  for (const f of FILES) copyFileSync(join(LIB, f), join(t, 'lib', f));
  cpSync(join(DEM, 'snapshots'), join(t, 'dem', 'snapshots'), { recursive: true });
  const L = readFileSync(join(DEM, 'su_kien_chinh_sach.jsonl'), 'utf8').split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l));
  if (sk) sk(L);
  writeFileSync(join(t, 'dem', 'su_kien_chinh_sach.jsonl'), L.map((x) => JSON.stringify(x)).join('\n') + '\n');
  if (web) { const p = join(t, 'lib', 'hub-thoi-cuoc.json'); const x = JSON.parse(readFileSync(p, 'utf8')); web(x); writeFileSync(p, JSON.stringify(x)); }
  return t;
};
const chay = (t, ...them) => { const r = spawnSync(process.execPath, [CONG, '--lib', join(t, 'lib'), '--dem', join(t, 'dem'), ...them], { encoding: 'utf8' }); return { rc: r.status, out: r.stdout + r.stderr }; };
const cs0 = (x) => x.suKien.find((e) => e.lan === 'chinh_sach');

try {
  let r = chay(canh());
  inRa('RANG 1 · canh sach -> exit 0', r.rc === 0, `exit ${r.rc}`);
  r = chay(canh({
    sk: (L) => { const ngay = L[0].bang_chung[0].snapshot.match(/_(\d{4})(\d{2})(\d{2})\./).slice(1).join('-'); L[0].ngay = ngay; },
    web: (x) => { const e = cs0(x); e.ngay = e.href.match(/_(\d{4})(\d{2})(\d{2})\.txt$/).slice(1).join('-'); },
  }));
  inRa('RANG 2 · ngay chup lam ngay ban hanh -> NGAY_CHUP_LAM_NGAY_DANG', r.rc === 2 && r.out.includes('NGAY_CHUP_LAM_NGAY_DANG'), `exit ${r.rc}`);
  r = chay(canh({ sk: (L) => { L[0].bang_chung[0].evidence_span = L[0].bang_chung[0].evidence_span.replace('Quyết định', 'Nghị quyết'); } }));
  inRa('RANG 3 · sua mot chu trong cau nguon -> SPAN_BIA', r.rc === 2 && r.out.includes('SPAN_BIA'), `exit ${r.rc}`);
  r = chay(canh({ web: (x) => { cs0(x).ngay = '2025-06-20'; } }));
  inRa('RANG 4 · web doi ngay, file nguon giu nguyen -> SPAN_BIA', r.rc === 2 && r.out.includes('SPAN_BIA'), `exit ${r.rc}`);
  r = chay(canh({ web: (x) => { x.suKien.splice(x.suKien.findIndex((e) => e.lan === 'don_vi'), 1); } }));
  inRa('RANG 5 · rot mot tin don vi -> DON_VI_LECH', r.rc === 2 && r.out.includes('DON_VI_LECH'), `exit ${r.rc}`);
  r = chay(canh({ web: (x) => { x.suKien.find((e) => e.lan === 'de_xuat').trangThai = 'da_ky'; } }));
  inRa('RANG 6 · de xuat thanh da ky -> DE_XUAT_THANH_SU_THAT', r.rc === 2 && r.out.includes('DE_XUAT_THANH_SU_THAT'), `exit ${r.rc}`);
  r = chay(canh({ web: (x) => { x.suKien.find((e) => e.lan === 'don_vi').ngay = '2099-01-01'; } }));
  inRa('RANG 7 · su kien sau moc do -> TUONG_LAI', r.rc === 2 && r.out.includes('TUONG_LAI'), `exit ${r.rc}`);
  r = chay(canh({ web: (x) => { x.matDo[x.matDo.length - 1].don_vi += 2; } }));
  inRa('RANG 8 · sua mat do -> MAT_DO_LECH', r.rc === 2 && r.out.includes('MAT_DO_LECH'), `exit ${r.rc}`);

  const t = canh();
  const goc9 = readFileSync(join(LIB, 'thoi-cuoc.mjs'), 'utf8');
  const moc = "id: e.id, ngay: e.ngay, lan: 'chinh_sach',";
  const doc = goc9.replace(moc, "id: e.id, ngay: b0.snapshot.match(/_(\\d{4})(\\d{2})(\\d{2})\\./).slice(1).join('-'), lan: 'chinh_sach',");
  if (doc === goc9) inRa('RANG 9 · module doc ngay tu ten ban chup -> SPAN_BIA', false, `KHONG TIEM DUOC: khong thay "${moc}"`);
  else {
    writeFileSync(join(t, 'lib', 'thoi-cuoc.mjs'), doc);
    const m = await import(pathToFileURL(join(t, 'lib', 'thoi-cuoc.mjs')).href);
    const d = (f) => JSON.parse(readFileSync(join(t, 'lib', f), 'utf8'));
    const L = readFileSync(join(t, 'dem', 'su_kien_chinh_sach.jsonl'), 'utf8').split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l));
    writeFileSync(join(t, 'lib', 'hub-thoi-cuoc.json'), JSON.stringify(m.dungThoiCuoc({ reg: d('cncl-registry.json'), mat: d('cncl-match.json'), ev: d('hub-events.json'), hoSo: d('hub-ho-so.json'), graph: d('hub-graph.json'), suKienChinhSach: L })));
    r = chay(t, '--mo-dun', join(t, 'lib', 'thoi-cuoc.mjs'));
    inRa('RANG 9 · module doc ngay tu ten ban chup -> SPAN_BIA', r.rc === 2 && r.out.includes('SPAN_BIA') && !r.out.includes('THOI_CUOC_LECH'), `exit ${r.rc}`);
  }
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE THOI CUOC: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
