#!/usr/bin/env node
/**
 * bite-ghi-chu.mjs · Rang cua check-ghi-chu-ban-chup.mjs va cua luat phan loai dong trong
 * lib/ban-chup.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: rang chep lib/*.json, public/evidence va file ngan sach THAT vao thu muc
 * tam (mkdtempSync), roi tiem loi vao BAN SAO. Khong sua file that nao. Registry doi bao
 * nhieu claim, rang van chay: phep tiem chon claim dau tien khong nam trong ngan sach, va ten
 * file lay tu chinh claim do. Rang 7 dung van ban tu viet, khong doc ban chup nao.
 *
 * RANG
 * ====
 * RANG 1 · CANH SACH -> exit 0.
 * RANG 2 · MOT CLAIM MOI CHI CON NAM TRONG GHI CHU (cau cua nguon bi xoa, chi con o dong
 *          "## Ghi chú: ...") -> exit 2 (MOI_PHAT_SINH).
 * RANG 3 · NGAN SACH GHI MOT VI PHAM KHONG CON TON TAI -> exit 2 (DA_SUA_CHUA_XOA). Khoa mot
 *          chieu phai siet ca chieu sua xong ma quen xoa.
 * RANG 4 · GIAO DIEN KHONG CANH BAO (hub-ghi-chu.json rong) -> exit 2 (GIAO_DIEN_THIEU).
 * RANG 5 · MOT BAN CHUP TOAN GHI CHU -> exit 2 (TOAN_GHI_CHU).
 * RANG 6 · THIEU FILE NGAN SACH -> exit 3.
 * RANG 7 · LUAT PHAN LOAI: khoi dau file va tieu de khong dau la ghi_chu; tieu de co dau o ban
 *          giu nguyen trang la nguon; o ban tap hop la chua_ro; danh sach sau "chưa cào" la ghi_chu.
 *
 * Chay: node scripts/bite-ghi-chu.mjs
 */
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, cpSync, rmSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { goc } from './goc.mjs';
import { phanLoaiDong } from '../lib/ban-chup.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const CONG = join(HERE, 'check-ghi-chu-ban-chup.mjs');
const NS_THAT = goc('CNCLData', 'domains', 'don_vi_cncl', 'ngan_sach_span_trong_ghi_chu.txt');

const kq = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(62)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
if (!NS_THAT) { console.log('KHONG CHAY DUOC: khong thay ngan sach that de chep lam canh.'); process.exit(3); }

const tam = [];
function canh() {
  const t = mkdtempSync(join(tmpdir(), 'bite_ghi_chu_')); tam.push(t);
  mkdirSync(join(t, 'lib'));
  for (const f of ['cncl-registry.json', 'cncl-match.json', 'hub-ghi-chu.json']) cpSync(join(TOUCH, 'lib', f), join(t, 'lib', f));
  cpSync(join(TOUCH, 'public', 'evidence'), join(t, 'public', 'evidence'), { recursive: true });
  cpSync(NS_THAT, join(t, 'ns.txt'));
  return t;
}
const chay = (t) => {
  const r = spawnSync(process.execPath, [CONG, '--lib', join(t, 'lib'), '--public', join(t, 'public'), '--ngan-sach', join(t, 'ns.txt')], { encoding: 'utf8' });
  return { rc: r.status, out: r.stdout + r.stderr };
};

try {
  let t = canh(); let r = chay(t);
  inRa('RANG 1 · canh sach -> exit 0', r.rc === 0, `exit ${r.rc}`);
  if (r.rc !== 0) console.log(r.out);

  // RANG 2: chon claim dau tien co span dai, KHONG nam trong ngan sach.
  t = canh();
  const reg = JSON.parse(readFileSync(join(t, 'lib', 'cncl-registry.json'), 'utf8'));
  const ns = readFileSync(join(t, 'ns.txt'), 'utf8');
  let chon = null;
  for (const u of reg.units) for (const e of u.evidence) {
    if (!chon && e.span.length > 30 && !ns.includes(`${u.name} · ${e.field}`)) chon = { u, e };
  }
  const p = join(t, 'public', chon.e.href);
  const goc0 = readFileSync(p, 'utf8');
  const n = goc0.split(chon.e.span).length - 1;
  writeFileSync(p, goc0.split(chon.e.span).join('[da xoa]') + `\n## Ghi chú: ${chon.e.span}\n`);
  r = chay(t);
  inRa('RANG 2 · claim moi chi con nam trong ghi chu -> exit 2', n >= 1 && r.rc === 2 && r.out.includes('MOI_PHAT_SINH'), `exit ${r.rc} · xoa ${n} cho`);

  t = canh();
  writeFileSync(join(t, 'ns.txt'), readFileSync(join(t, 'ns.txt'), 'utf8') + `${chon.u.name} · ${chon.e.field} · ${chon.e.href.replace('/evidence/', '')}\n`);
  r = chay(t);
  inRa('RANG 3 · ngan sach ghi vi pham khong con -> exit 2', r.rc === 2 && r.out.includes('DA_SUA_CHUA_XOA'), `exit ${r.rc}`);

  t = canh();
  writeFileSync(join(t, 'lib', 'hub-ghi-chu.json'), JSON.stringify({ meta: {}, ds: [] }));
  r = chay(t);
  const coNo = ns.split('\n').some((l) => l.trim() && !l.startsWith('#'));
  inRa('RANG 4 · giao dien khong canh bao -> exit 2', coNo ? (r.rc === 2 && r.out.includes('GIAO_DIEN_THIEU')) : r.rc === 0,
    coNo ? `exit ${r.rc}` : 'ngan sach rong: khong co gi de thieu, ky vong exit 0');

  t = canh();
  const fGhiChu = join(t, 'public', chon.e.href);
  writeFileSync(fGhiChu, '# SNAPSHOT · chi co ghi chu\n# URL: x\n');
  r = chay(t);
  inRa('RANG 5 · ban chup toan ghi chu -> exit 2', r.rc === 2 && r.out.includes('TOAN_GHI_CHU'), `exit ${r.rc}`);

  t = canh(); unlinkSync(join(t, 'ns.txt'));
  r = chay(t);
  inRa('RANG 6 · thieu ngan sach -> exit 3', r.rc === 3, `exit ${r.rc}`);

  const loaiCua = (txt) => { const d = txt.split('\n'); return phanLoaiDong(txt).map((l, i) => [d[i], l.loai]); };
  const a = loaiCua('# SNAPSHOT · x\n# URL: y\n\n# Xuat xuong may bien ap\n\n## (Chinhphu.vn) - Thủ tướng ký\n\nĐây là câu nguồn.');
  const b = loaiCua('# SNAPSHOT · x\n\n# Tieu de khong dau\n\n## Tập đoàn Viettel\n\nCâu nguồn.\n\n## Link liên quan lộ ra (chưa cào):\n- một link\n- hai link\n\n## Tiếp');
  const c = loaiCua('# SNAPSHOT · x\n\n# Tiêu đề có dấu của bài\n\n## Mục có dấu\n\nCâu.');
  const dung = [
    a[0][1] === 'ghi_chu', a[3][1] === 'ghi_chu', a[7][1] === 'nguon',
    b[4][1] === 'chua_ro', b[6][1] === 'nguon', b[8][1] === 'ghi_chu', b[9][1] === 'ghi_chu', b[10][1] === 'ghi_chu', b[12][1] === 'chua_ro',
    c[2][1] === 'nguon', c[4][1] === 'nguon',
  ];
  // a[5] la tieu de CO dau trong ban tap hop (tieu de dau tien khong dau) nen la chua_ro.
  dung.push(a[5][1] === 'chua_ro');
  inRa('RANG 7 · luat phan loai dong dung tren van ban mau', dung.every(Boolean), `${dung.filter(Boolean).length}/${dung.length} dong dung`);
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}

const can = kq.filter(Boolean).length;
console.log(`\nBITE GHI CHU: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
