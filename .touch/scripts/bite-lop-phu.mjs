#!/usr/bin/env node
/**
 * bite-lop-phu.mjs · Rang cua hai cong pha P1: check-tim-kiem.mjs va check-lop-phu-nguon.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: rang chep lib/*.json va public/evidence THAT vao thu muc tam (mkdtempSync)
 * roi tiem loi vao BAN SAO. Voi cong tim kiem, rang viet ra mot ban HONG cua module tim kiem
 * (quen thay chu "đ") trong thu muc tam va tro cong vao do. Khong sua file that nao. Registry
 * doi bao nhieu don vi, rang van chay: moi phep tiem chon muc dau tien tim thay trong ban sao.
 *
 * RANG
 * ====
 * RANG 1 · CANH SACH -> ca hai cong exit 0.
 * RANG 2 · MODULE BO DAU QUEN CHU "đ" -> check-tim-kiem exit 2. Day la loi de mac nhat:
 *          NFD tach duoc moi dau tieng Viet tru chu "đ".
 * RANG 2b· CHI MUC CUNG SINH BANG MODULE HONG (hai ben sai giong nhau) -> van exit 2.
 * RANG 3 · MODULE TIM BUA (tra moi tai lieu cho moi cau hoi) -> exit 2 (TRA_BUA).
 * RANG 4 · CHI MUC RONG -> check-tim-kiem exit 3, khong phai 0.
 * RANG 5 · BAN CHUP PHUC VU BI SUA MOT CHU TRONG CAU NGUON -> check-lop-phu-nguon exit 2.
 * RANG 6 · BAN CHUP PHUC VU BI MAT -> exit 2 (MAT_BAN_CHUP).
 *
 * Chay: node scripts/bite-lop-phu.mjs
 */
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, cpSync, rmSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const TIM = join(HERE, 'check-tim-kiem.mjs');
const PHU = join(HERE, 'check-lop-phu-nguon.mjs');
const MO_DUN_THAT = readFileSync(join(TOUCH, 'lib', 'tim-kiem.mjs'), 'utf8');

const kq = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(60)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const tam = [];
function canh() {
  const t = mkdtempSync(join(tmpdir(), 'bite_lop_phu_')); tam.push(t);
  mkdirSync(join(t, 'lib'));
  for (const f of ['cncl-registry.json', 'cncl-match.json', 'hub-search.json']) cpSync(join(TOUCH, 'lib', f), join(t, 'lib', f));
  cpSync(join(TOUCH, 'public', 'evidence'), join(t, 'public', 'evidence'), { recursive: true });
  return t;
}
const chay = (cong, ...a) => { const r = spawnSync(process.execPath, [cong, ...a], { encoding: 'utf8' }); return { rc: r.status, out: r.stdout + r.stderr }; };

try {
  let t = canh();
  let a = chay(TIM, '--lib', join(t, 'lib')); let b = chay(PHU, '--lib', join(t, 'lib'), '--public', join(t, 'public'));
  inRa('RANG 1 · canh sach -> hai cong exit 0', a.rc === 0 && b.rc === 0, `tim ${a.rc} · phu ${b.rc}`);

  // RANG 2: xoa DUNG hai dong thay chu "đ" trong ban sao module. Phai xoa duoc dung 2 cho.
  t = canh();
  const hong = MO_DUN_THAT.split('\n').filter((l) => !/\.replace\(\/[đĐ]\/g/.test(l));
  if (MO_DUN_THAT.split('\n').length - hong.length !== 2) {
    inRa('RANG 2 · module quen chu d -> exit 2', false, 'KHONG TIEM DUOC: khong thay dung 2 dong thay chu d');
  } else {
    writeFileSync(join(t, 'tim-kiem-hong.mjs'), hong.join('\n'));
    a = chay(TIM, '--lib', join(t, 'lib'), '--mo-dun', join(t, 'tim-kiem-hong.mjs'));
    inRa('RANG 2 · module quen chu "đ" -> exit 2', a.rc === 2 && a.out.includes('KHOA_LECH'), `exit ${a.rc}`);
    // RANG 2b: chi muc CUNG sinh bang module hong (khoa khop nhau) thi tim van phai hong,
    // vi go "dong anh" khong con ra "Đông Anh". Day la chieu kho hon: hai ben sai giong nhau.
    const { khoaTim: khoaHong } = await import(new URL('file://' + join(t, 'tim-kiem-hong.mjs')).href);
    const s2 = JSON.parse(readFileSync(join(t, 'lib', 'hub-search.json'), 'utf8'));
    s2.docs = s2.docs.map((d) => ({ ...d, khoa: khoaHong(`${d.ten} ${d.moTa} ${d.nhan}`) }));
    writeFileSync(join(t, 'lib', 'hub-search.json'), JSON.stringify(s2));
    a = chay(TIM, '--lib', join(t, 'lib'), '--mo-dun', join(t, 'tim-kiem-hong.mjs'));
    inRa('RANG 2b · chi muc va module cung hong -> exit 2 (KHONG_TIM_RA)', a.rc === 2 && a.out.includes('KHONG_TIM_RA'), `exit ${a.rc}`);
  }

  t = canh();
  const bua = MO_DUN_THAT.replace(/export function timKiem\(docs, q, toiDa = 20\) \{/, 'export function timKiem(docs, q, toiDa = 20) {\n  return docs.map((doc) => ({ doc, diem: 1 }));');
  if (bua === MO_DUN_THAT) inRa('RANG 3 · module tim bua -> exit 2', false, 'KHONG TIEM DUOC: khong thay chu ky timKiem');
  else {
    writeFileSync(join(t, 'tim-bua.mjs'), bua);
    a = chay(TIM, '--lib', join(t, 'lib'), '--mo-dun', join(t, 'tim-bua.mjs'));
    inRa('RANG 3 · module tim bua -> exit 2 (TRA_BUA)', a.rc === 2 && a.out.includes('TRA_BUA'), `exit ${a.rc}`);
  }

  t = canh();
  const s = JSON.parse(readFileSync(join(t, 'lib', 'hub-search.json'), 'utf8')); s.docs = [];
  writeFileSync(join(t, 'lib', 'hub-search.json'), JSON.stringify(s));
  a = chay(TIM, '--lib', join(t, 'lib'));
  inRa('RANG 4 · chi muc rong -> exit 3', a.rc === 3, `exit ${a.rc}`);

  // RANG 5: sua mot chu BEN TRONG cau nguon dau tien, trong ban chup phuc vu cua ban sao.
  t = canh();
  const reg = JSON.parse(readFileSync(join(t, 'lib', 'cncl-registry.json'), 'utf8'));
  const e = reg.units[0].evidence[0];
  const p = join(t, 'public', e.href);
  const goc = readFileSync(p, 'utf8');
  const k = e.span.length > 4 ? Math.floor(e.span.length / 2) : 0;
  const spanSua = e.span.slice(0, k) + (e.span[k] === 'X' ? 'Y' : 'X') + e.span.slice(k + 1);
  const n = goc.split(e.span).length - 1;
  writeFileSync(p, goc.split(e.span).join(spanSua));
  b = chay(PHU, '--lib', join(t, 'lib'), '--public', join(t, 'public'));
  inRa('RANG 5 · ban chup phuc vu sai mot chu -> exit 2', n >= 1 && b.rc === 2 && b.out.includes('KHONG_TO_SANG'), `exit ${b.rc} · da sua ${n} cho`);

  t = canh();
  unlinkSync(join(t, 'public', e.href));
  b = chay(PHU, '--lib', join(t, 'lib'), '--public', join(t, 'public'));
  inRa('RANG 6 · ban chup phuc vu bi mat -> exit 2', b.rc === 2 && b.out.includes('MAT_BAN_CHUP'), `exit ${b.rc}`);
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}

const can = kq.filter(Boolean).length;
console.log(`\nBITE LOP PHU: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
