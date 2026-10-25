#!/usr/bin/env node
/**
 * bite-chuoi-cong.mjs · Rang cua check-chuoi-cong.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: tao thu muc tam (mkdtempSync) chua mot file ket qua gia lap ba o, mot
 * lib/hub-chuoi-cong.json khop voi no va mot trang Phuong phap doc file do. File that khong bi
 * cham. Canh khong phu thuoc so o that cua chuoi.
 *
 * RANG
 * ====
 * RANG 1 · canh sach -> exit 0.
 * RANG 2 · trang bot mot o -> O_LECH.
 * RANG 3 · trang doi mot o DO thanh XANH -> O_LECH.
 * RANG 4 · trang ghi lan chay khac file ket qua -> CHUOI_LECH.
 * RANG 5 · trang Phuong phap go tay, khong doc file -> TRANG_KHONG_DOC.
 * RANG 6 · khong co file ket qua ma trang van ghi mot lan chay -> CHUOI_LECH.
 *
 * Chay: node scripts/bite-chuoi-cong.mjs     Exit 0 moi rang can · 2 co rang khong can.
 */
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CONG = join(HERE, 'check-chuoi-cong.mjs');
const kq = []; const tam = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(58)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const O = [{ kho: 'CNCLData', ten: 'check_luat3', tt: 'XANH' }, { kho: 'CNCLData', ten: 'bites', tt: 'XANH' }, { kho: '.touch', ten: 'rang_mo_dau', tt: 'DO' }];
const KQ = { luc: '2026-10-25T10:00:00+0700', che_do: 'day_du', tong: 3, xanh: 2, do: 1, khong_chay: 0, hoan: 0, ds_hoan: '', o: O };
const hubTu = (k) => ({ luc: k.luc, cheDo: k.che_do, tong: k.tong, xanh: k.xanh, o: k.o.map((x) => ({ ...x, rang: x.ten.startsWith('rang_') || x.ten === 'bites' })) });
const TRANG_SACH = "import CC from '@/lib/hub-chuoi-cong.json';\nexport default function P() { return CC.tong; }\n";
const thu = (nhan, sua, ma) => {
  const t = mkdtempSync(join(tmpdir(), 'bite_chuoi_cong_')); tam.push(t);
  mkdirSync(join(t, 'lib'));
  const c = { kq: structuredClone(KQ), hub: hubTu(KQ), trang: TRANG_SACH, coKq: true };
  if (sua) sua(c);
  if (c.coKq) writeFileSync(join(t, 'kq.json'), JSON.stringify(c.kq));
  writeFileSync(join(t, 'lib', 'hub-chuoi-cong.json'), JSON.stringify(c.hub));
  writeFileSync(join(t, 'page.tsx'), c.trang);
  writeFileSync(join(t, 'trang-pp.tsx'), 'export default function PP() { return <BangKiemDinh />; }\n');
  const r = spawnSync(process.execPath, [CONG, '--lib', join(t, 'lib'), '--ket-qua', join(t, 'kq.json'), '--trang', join(t, 'page.tsx'), '--page', join(t, 'trang-pp.tsx')], { encoding: 'utf8' });
  const out = r.stdout + r.stderr;
  inRa(nhan, ma ? r.status === 2 && out.includes(ma) : r.status === 0, `exit ${r.status}`);
};
try {
  thu('RANG 1 · canh sach -> exit 0', null, null);
  thu('RANG 2 · trang bot mot o -> O_LECH', (c) => { c.hub.o.pop(); }, 'O_LECH');
  thu('RANG 3 · trang doi o DO thanh XANH -> O_LECH', (c) => { c.hub.o[2].tt = 'XANH'; }, 'O_LECH');
  thu('RANG 4 · trang ghi lan chay khac -> CHUOI_LECH', (c) => { c.hub.luc = '2026-10-07T11:09:07+0700'; }, 'CHUOI_LECH');
  thu('RANG 5 · trang go tay khong doc file -> TRANG_KHONG_DOC', (c) => { c.trang = 'export default function P() { return 126; }\n'; }, 'TRANG_KHONG_DOC');
  thu('RANG 6 · khong co file ket qua ma trang ghi lan chay -> CHUOI_LECH', (c) => { c.coKq = false; }, 'CHUOI_LECH');
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE CHUOI CONG: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
