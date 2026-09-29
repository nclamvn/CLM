#!/usr/bin/env node
/**
 * bite-so-sinh.mjs · Bay rang cua check-so-sinh.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: rang chep bon file lib/*.json THAT vao mot thu muc tam (mkdtempSync), roi
 * tiem loi vao BAN SAO. Khong sua lib that. Thu muc quet ma nguon cung la thu muc tam, chi
 * co mot file do rang viet. File ket qua chuoi cong cung do rang tu viet.
 * Registry doi bao nhieu don vi, bao nhieu canh, rang van chay: moi phep tiem lay so tu
 * chinh file vua chep chu khong go so.
 *
 * RANG
 * ====
 * RANG 1 · CANH SACH THI XANH: ban sao nguyen ven, file ket qua khop -> exit 0.
 * RANG 2 · CHUOI SO CONG GO TAY TRONG MA NGUON -> exit 2. Day dung la dong da nam trong
 *          gen-cncl-data.mjs tu thang 8 den 29/09/2026.
 * RANG 3 · META LECH MOT DON VI -> exit 2 (LECH_SO).
 * RANG 4 · CANH "thuoc_nhom" MAT BANG CHUNG -> exit 2 (CANH_KHONG_NGUON).
 * RANG 5 · META BAO DAT TRONG KHI FILE CUNG LUC CO O DO -> exit 2 (CHUOI_LECH).
 * RANG 6 · META CO KET QUA NHUNG KHONG CO FILE NAO -> exit 2 (CHUOI_BIA).
 * RANG 7 · DE XUAT VONG TU CHAY BI DOI THANH "da_ky" -> exit 2.
 * RANG 8 · THIEU hub-graph.json -> exit 3, khong phai 0.
 *
 * Chay: node scripts/bite-so-sinh.mjs
 */
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, copyFileSync, rmSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const LIB_THAT = join(HERE, '..', 'lib');
const CONG = join(HERE, 'check-so-sinh.mjs');
const FILES = ['cncl-registry.json', 'hub-graph.json', 'hub-events.json', 'hub-search.json'];

const kq = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(58)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };

function canh() {
  const t = mkdtempSync(join(tmpdir(), 'bite_so_sinh_'));
  const lib = join(t, 'lib'); const src = join(t, 'src');
  mkdirSync(lib); mkdirSync(src);
  for (const f of FILES) copyFileSync(join(LIB_THAT, f), join(lib, f));
  writeFileSync(join(src, 'sach.ts'), "export const x = 'khong co so cong nao';\n");
  // File ket qua khop voi meta: ep meta.chuoiCong ve mot gia tri biet truoc.
  const reg = JSON.parse(readFileSync(join(lib, 'cncl-registry.json'), 'utf8'));
  const luc = '2026-09-29T10:00:00+0700';
  reg.meta.chuoiCong = { luc, cheDo: 'day_du', tong: 5, xanh: 5, do: 0, khongChay: 0, hoan: 0, dat: true };
  reg.meta.gate = 'chuỗi cổng 2026-09-29 10:00: 5/5 xanh';
  writeFileSync(join(lib, 'cncl-registry.json'), JSON.stringify(reg));
  const kqp = join(t, 'ket_qua_chuoi.json');
  writeFileSync(kqp, JSON.stringify({ luc, che_do: 'day_du', tong: 5, xanh: 5, do: 0, khong_chay: 0, hoan: 0, ds_hoan: '' }));
  return { t, lib, src, kqp };
}
const chay = (c) => {
  const r = spawnSync(process.execPath, [CONG, '--lib', c.lib, '--quet', c.src, '--ket-qua', c.kqp], { encoding: 'utf8' });
  return { rc: r.status, out: r.stdout + r.stderr };
};
const sua = (c, f, fn) => { const p = join(c.lib, f); const d = JSON.parse(readFileSync(p, 'utf8')); fn(d); writeFileSync(p, JSON.stringify(d)); };

const cacCanh = [];
const moi = () => { const c = canh(); cacCanh.push(c.t); return c; };
try {
  let c = moi(); let r = chay(c);
  inRa('RANG 1 · canh sach -> exit 0', r.rc === 0, `exit ${r.rc}`);
  if (r.rc !== 0) console.log(r.out);

  // Chuoi tiem duoc GHEP tu manh, de chinh file rang nay khong bi cong quet bat nham. Cong
  // quet ca thu muc scripts/, va rang khong duoc xin mien tru cho rieng minh.
  const tiem = ['chay_het_cong.sh · 14', 'o xanh'].join(' ');
  c = moi(); writeFileSync(join(c.src, 'gen.mjs'), `const meta = { gate: '${tiem}' };\n`);
  r = chay(c); inRa('RANG 2 · so cong go tay trong ma nguon -> exit 2', r.rc === 2 && r.out.includes('SO_GO_TAY'), `exit ${r.rc}`);

  c = moi(); sua(c, 'cncl-registry.json', (d) => { d.meta.units += 1; });
  r = chay(c); inRa('RANG 3 · meta lech mot don vi -> exit 2', r.rc === 2 && r.out.includes('LECH_SO'), `exit ${r.rc}`);

  c = moi(); sua(c, 'hub-graph.json', (d) => { const e = d.edges.find((x) => x.kind === 'thuoc_nhom'); delete e.bangChung; });
  r = chay(c); inRa('RANG 4 · canh thuoc_nhom mat bang chung -> exit 2', r.rc === 2 && r.out.includes('CANH_KHONG_NGUON'), `exit ${r.rc}`);

  c = moi(); writeFileSync(c.kqp, JSON.stringify({ luc: '2026-09-29T10:00:00+0700', che_do: 'day_du', tong: 5, xanh: 4, do: 1, khong_chay: 0, hoan: 0 }));
  r = chay(c); inRa('RANG 5 · meta bao dat, file cung luc co o do -> exit 2', r.rc === 2 && r.out.includes('CHUOI_LECH'), `exit ${r.rc}`);

  c = moi(); unlinkSync(c.kqp);
  r = chay(c); inRa('RANG 6 · meta co ket qua, khong co file -> exit 2', r.rc === 2 && r.out.includes('CHUOI_BIA'), `exit ${r.rc}`);

  c = moi();
  let coDeXuat = false;
  sua(c, 'hub-events.json', (d) => { const e = d.events.find((x) => x.kind === 'de_xuat_vong_tu_chay'); if (e) { e.trangThai = 'da_ky'; coDeXuat = true; } });
  if (!coDeXuat) {
    // Du lieu that chua co de xuat nao: tu chen mot cai de rang van do duoc hanh vi.
    sua(c, 'hub-events.json', (d) => { d.events.push({ kind: 'de_xuat_vong_tu_chay', trangThai: 'da_ky', maHangCho: 'HC-gia' }); d.meta.soSuKien += 1; d.meta.theoLoai.de_xuat_vong_tu_chay += 1; });
  }
  r = chay(c); inRa('RANG 7 · de xuat bi doi thanh da_ky -> exit 2', r.rc === 2 && r.out.includes('DE_XUAT_THANH_DA_KY'), `exit ${r.rc}`);

  c = moi(); unlinkSync(join(c.lib, 'hub-graph.json'));
  r = chay(c); inRa('RANG 8 · thieu hub-graph.json -> exit 3', r.rc === 3, `exit ${r.rc}`);
} finally {
  for (const t of cacCanh) rmSync(t, { recursive: true, force: true });
}

const can = kq.filter(Boolean).length;
console.log(`\nBITE SO SINH: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
