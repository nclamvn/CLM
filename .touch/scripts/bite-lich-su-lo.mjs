#!/usr/bin/env node
/**
 * bite-lich-su-lo.mjs · Rang cua check-lich-su-lo.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: dung trong thu muc tam (mkdtempSync) mot lam_giau gia hai lo (mot lo da duyet va
 * nap, mot lo cho duyet), sinh hub-lo.json bang chinh module, va mot trang doc file do. Khong cham
 * thu muc lo that.
 *
 * RANG
 * ====
 * RANG 1 · canh sach -> exit 0.
 * RANG 2 · bang ghi lo cho duyet thanh da nap -> LO_LECH.
 * RANG 3 · bang sua loi duyet cho gon -> LO_LECH.
 * RANG 4 · lo co da_nap.json ma khong co duyet.json -> NAP_KHONG_DUYET.
 * RANG 5 · duyet.json thieu loi duyet -> DUYET_THIEU_LOI.
 * RANG 6 · trang khong doc hub-lo.json -> TRANG_KHONG_DOC.
 *
 * Chay: node scripts/bite-lich-su-lo.mjs     Exit 0 moi rang can · 2 co rang khong can.
 */
import { mkdtempSync, writeFileSync, rmSync, mkdirSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CONG = join(HERE, 'check-lich-su-lo.mjs');
const { dungLichSuLo } = await import(pathToFileURL(join(HERE, '..', 'lib', 'lich-su-lo.mjs')).href);
const kq = []; const tam = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(58)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const viet = (p, o) => writeFileSync(p, typeof o === 'string' ? o : JSON.stringify(o));
const thu = (nhan, truocSinh, sauSinh, ma) => {
  const t = mkdtempSync(join(tmpdir(), 'bite_lich_su_lo_')); tam.push(t);
  const lg = join(t, 'lam_giau'); mkdirSync(join(lg, 'dot_01'), { recursive: true }); mkdirSync(join(lg, 'dot_02'));
  viet(join(lg, 'dot_01', 'lo.json'), { dong: [1, 2, 3], honest_null: [1] });
  viet(join(lg, 'dot_01', 'duyet.json'), { nguoi_duyet: 'Lam Nguyen', ngay: '2026-09-30', loi_duyet: 'duyệt hết, trừ dòng 2', loai: [1] });
  viet(join(lg, 'dot_01', 'da_nap.json'), { ngay_nap: '2026-09-30', so_claim: 2 });
  viet(join(lg, 'dot_01', 'doi_chieu_ket_qua.jsonl'), '{"url":"a"}\n{"url":"b"}\n');
  viet(join(lg, 'dot_02', 'lo.json'), { dong: [1], honest_null: 4 });
  if (truocSinh) truocSinh(lg);
  mkdirSync(join(t, 'lib'));
  const h = dungLichSuLo(lg);
  if (sauSinh) sauSinh(h);
  viet(join(t, 'lib', 'hub-lo.json'), h);
  const trang = { s: "import L from '@/lib/hub-lo.json';\nexport default function P() { return L.lo.length; }\n" };
  if (ma === 'TRANG_KHONG_DOC') trang.s = 'export default function P() { return 4; }\n';
  viet(join(t, 'page.tsx'), trang.s);
  viet(join(t, 'trang-pp.tsx'), 'export default function PP() { return <LichSuLo />; }\n');
  const r = spawnSync(process.execPath, [CONG, '--lib', join(t, 'lib'), '--lam-giau', lg, '--trang', join(t, 'page.tsx'), '--page', join(t, 'trang-pp.tsx')], { encoding: 'utf8' });
  const out = r.stdout + r.stderr;
  inRa(nhan, ma ? r.status === 2 && out.includes(ma) : r.status === 0, `exit ${r.status}`);
};
try {
  thu('RANG 1 · canh sach -> exit 0', null, null, null);
  thu('RANG 2 · lo cho duyet ghi thanh da nap -> LO_LECH', null, (h) => { h.lo[1].trangThai = 'da_nap'; }, 'LO_LECH');
  thu('RANG 3 · sua loi duyet cho gon -> LO_LECH', null, (h) => { h.lo[0].duyet.loi = 'duyệt hết'; }, 'LO_LECH');
  thu('RANG 4 · nap ma khong co duyet.json -> NAP_KHONG_DUYET', (lg) => unlinkSync(join(lg, 'dot_01', 'duyet.json')), null, 'NAP_KHONG_DUYET');
  thu('RANG 5 · duyet thieu loi duyet -> DUYET_THIEU_LOI', (lg) => viet(join(lg, 'dot_01', 'duyet.json'), { nguoi_duyet: 'Lam Nguyen', ngay: '2026-09-30' }), null, 'DUYET_THIEU_LOI');
  thu('RANG 6 · trang khong doc hub-lo.json -> TRANG_KHONG_DOC', null, null, 'TRANG_KHONG_DOC');
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE LICH SU LO: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
