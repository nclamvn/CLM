#!/usr/bin/env node
/**
 * check-chuoi-cong.mjs · Bang "kiem dinh chan gi" tren trang Phuong phap phai la ket qua THAT cua
 * tung o trong lan chay chuoi gan nhat, khong phai danh sach go tay.
 *
 * VI SAO CO (25/10/2026): soi san pham duoi goc nha dau tu, trang Phuong phap chi ghi "chuoi 126
 * buoc" va nam vi du go tay. Nguoi xem khong thay duoc cong nao, rang nao, o nao xanh; con so 126
 * thi khong ai tach duoc thanh cong va phep thu cai loi. chay_het_cong.sh nay ghi tung o vao
 * out/ket_qua_chuoi.json (mang "o"), gen-cncl-data.mjs chep sang lib/hub-chuoi-cong.json.
 *
 * CONG KIEM:
 *   CHUOI_LECH      lib/hub-chuoi-cong.json khac file ket qua (thoi diem, che do, tong, xanh), hoac
 *                   khong co file ket qua ma trang van ghi mot lan chay.
 *   O_LECH          mang o khac file ket qua; so o khac tong; so o XANH khac so xanh; mot o ghi la
 *                   rang ma ten khong phai rang (hoac nguoc lai).
 *   TRANG_KHONG_DOC trang Phuong phap khong doc lib/hub-chuoi-cong.json.
 *
 * Chay: node scripts/check-chuoi-cong.mjs [--lib <dir>] [--ket-qua <file>] [--trang <page.tsx>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { goc } from './goc.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const LIB = arg('--lib') || join(TOUCH, 'lib');
const KET_QUA = arg('--ket-qua')
  || (process.env.CLM_KHO_MATCH ? join(process.env.CLM_KHO_MATCH, 'out', 'ket_qua_chuoi.json')
    : join(goc('CaoLocMatch') ?? join(TOUCH, '..', 'CaoLocMatch'), 'out', 'ket_qua_chuoi.json'));
const TRANG = arg('--trang') || join(TOUCH, 'components', 'phuongphap', 'KienTruc.tsx');
const PAGE = arg('--page') || join(TOUCH, 'app', 'dashboard', 'phuong-phap', 'page.tsx');
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
const HUB = join(LIB, 'hub-chuoi-cong.json');
if (!existsSync(HUB)) thoat3(`thieu ${HUB}. Chay gen-cncl-data.mjs.`);
if (!existsSync(TRANG)) thoat3(`thieu ${TRANG}`);
if (!existsSync(PAGE)) thoat3(`thieu ${PAGE}`);
const h = JSON.parse(readFileSync(HUB, 'utf8'));
const vi = [];

if (!existsSync(KET_QUA)) {
  if (h.luc !== null || h.o !== null) vi.push('CHUOI_LECH: khong co file ket qua ma trang van ghi mot lan chay');
} else {
  const k = JSON.parse(readFileSync(KET_QUA, 'utf8'));
  for (const [a, b] of [['luc', 'luc'], ['cheDo', 'che_do'], ['tong', 'tong'], ['xanh', 'xanh']]) if (h[a] !== k[b]) vi.push(`CHUOI_LECH: ${a} trang ghi ${h[a]}, file ket qua ${k[b]}`);
  if (Array.isArray(k.o)) {
    if (!Array.isArray(h.o)) vi.push('O_LECH: file ket qua co chi tiet tung o ma trang khong co');
    else {
      if (h.o.length !== k.o.length) vi.push(`O_LECH: trang ${h.o.length} o, file ket qua ${k.o.length} o`);
      k.o.forEach((x, i) => { const y = h.o[i]; if (!y || y.kho !== x.kho || y.ten !== x.ten || y.tt !== x.tt) vi.push(`O_LECH: o ${i + 1} trang ghi ${JSON.stringify(y)}, file ${JSON.stringify(x)}`); });
      if (h.o.length !== h.tong) vi.push(`O_LECH: ${h.o.length} o nhung tong ghi ${h.tong}`);
      const xanh = h.o.filter((x) => x.tt === 'XANH').length;
      if (xanh !== h.xanh) vi.push(`O_LECH: ${xanh} o XANH nhung xanh ghi ${h.xanh}`);
      for (const x of h.o) if (x.rang !== (x.ten.startsWith('rang_') || x.ten === 'bites')) vi.push(`O_LECH: o ${x.ten} ghi rang=${x.rang}`);
    }
  } else if (h.o !== null) vi.push('O_LECH: file ket qua chua co chi tiet tung o ma trang van ghi chi tiet');
}
const trang = readFileSync(TRANG, 'utf8');
if (!/from '@\/lib\/hub-chuoi-cong\.json'/.test(trang)) vi.push('TRANG_KHONG_DOC: khoi Phuong phap khong doc lib/hub-chuoi-cong.json');

if (!/<BangKiemDinh\b/.test(readFileSync(PAGE, 'utf8'))) vi.push('TRANG_KHONG_DOC: trang Phuong phap khong hien <BangKiemDinh />');
console.log(`chuoi cong: ${h.o ? h.o.length : 0} o chi tiet · lan ${h.luc ?? 'chua co'}`);
if (vi.length) { console.log(`\nFAIL: ${vi.length} vi pham`); vi.slice(0, 20).forEach((v) => console.log('  ' + v)); process.exit(2); }
console.log('\nOK: bang kiem dinh tren trang Phuong phap la ket qua that tung o cua lan chay gan nhat.');
