#!/usr/bin/env node
/**
 * check-ghi-chu-ban-chup.mjs · Cau lam bang phai nam trong VAN BAN CUA NGUON, khong phai trong
 * ghi chu cua nguoi chup.
 *
 * VI SAO CO (29/09/2026): check_spans.py chi hoi "chuoi nay co trong file ban chup khong". Ban
 * chup lai chua ca chu cua nguoi chup: dong tieu de dau file, tieu de khong dau, va nhan
 * "## Ten don vi" dung de gom doan trich. Khi tach hai phan nay cho lop phu nguon, lo ra 5
 * claim ma cau lam bang CHI nam trong nhan cua nguoi chup, tuc bang chung la chu cua minh. Mot
 * trong 5 la claim ten cua chinh RtR.
 *
 * CONG KIEM:
 *   1. Tap cau lam bang chi nam trong ghi chu (dem bang lib/ban-chup.mjs, DUNG ham giao dien
 *      dung) phai TRUNG KHOP danh sach trong ngan_sach_span_trong_ghi_chu.txt. Them la no; sua
 *      xong ma khong xoa dong cung la no (khoa mot chieu, siet ca hai chieu).
 *   2. lib/hub-ghi-chu.json (giao dien doc de canh bao) phai trung tap do.
 *   3. Moi file ban chup phai co it nhat mot dong 'nguon'. File toan ghi chu thi khong phai ban
 *      chup.
 *
 * Chay: node scripts/check-ghi-chu-ban-chup.mjs [--lib <dir>] [--public <dir>] [--ngan-sach <file>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { goc } from './goc.mjs';
import { moiCauNguon, spanChiTrongGhiChu, phanLoaiDong } from '../lib/ban-chup.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const LIB = arg('--lib') || join(HERE, '..', 'lib');
const PUB = arg('--public') || join(HERE, '..', 'public');
const NS = arg('--ngan-sach')
  || (process.env.CLM_KHO_CNCL ? join(process.env.CLM_KHO_CNCL, 'domains', 'don_vi_cncl', 'ngan_sach_span_trong_ghi_chu.txt')
    : goc('CNCLData', 'domains', 'don_vi_cncl', 'ngan_sach_span_trong_ghi_chu.txt'));

const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
const docJson = (f) => { const p = join(LIB, f); if (!existsSync(p)) thoat3(`thieu ${p}`); return JSON.parse(readFileSync(p, 'utf8')); };
if (!NS || !existsSync(NS)) thoat3('thieu ngan_sach_span_trong_ghi_chu.txt. Khoa mot chieu khong co moc thi khong con la khoa.');

const reg = docJson('cncl-registry.json');
const mat = docJson('cncl-match.json');
const hub = docJson('hub-ghi-chu.json');
const ds = moiCauNguon(reg, mat);
if (!ds.length) thoat3('khong co cau nguon nao.');

const doc = (href) => { const p = join(PUB, href); return existsSync(p) ? readFileSync(p, 'utf8') : null; };
const khoa = (x) => `${x.ai} · ${x.href.replace('/evidence/', '').replace(/\.txt$/, '')}`;
const chuanNs = (s) => s.replace(/\.(txt|html|md)$/, '');

// Claim cua match cung lap lai cau cua don vi; ngan sach tinh theo claim registry (entity · field).
const thay = spanChiTrongGhiChu(ds, doc).filter((x) => !x.ai.startsWith('MATCH-'));
const tapThay = new Set(thay.map(khoa));
const tapNs = new Set(readFileSync(NS, 'utf8').split('\n').map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#')).map(chuanNs));

const vi = [];
for (const k of tapThay) if (!tapNs.has(k)) vi.push(`MOI_PHAT_SINH: ${k} · cau lam bang chi nam trong ghi chu nguoi chup`);
for (const k of tapNs) if (!tapThay.has(k)) vi.push(`DA_SUA_CHUA_XOA: ${k} · khong con vi pham, xoa dong nay khoi ngan sach de khoa siet lai`);

const tapHub = new Set((hub.ds ?? []).map(khoa));
for (const k of tapThay) if (!tapHub.has(k)) vi.push(`GIAO_DIEN_THIEU: ${k} · lib/hub-ghi-chu.json khong canh bao`);
for (const k of tapHub) if (!tapThay.has(k)) vi.push(`GIAO_DIEN_THUA: ${k}`);

let soFile = 0; const dem = { nguon: 0, ghi_chu: 0, chua_ro: 0 };
const ev = join(PUB, 'evidence');
if (existsSync(ev)) {
  for (const f of readdirSync(ev)) {
    soFile++;
    const txt = readFileSync(join(ev, f), 'utf8');
    // Chi dem dong CO CHU. Dong trong duoc luat xep 'nguon' theo mac dinh; dem ca no thi mot
    // file toan ghi chu co dong trong o cuoi van qua (rang 5 cua bite-ghi-chu.mjs bat duoc).
    const lop = phanLoaiDong(txt).filter((l) => txt.slice(l.tu, l.den).trim());
    lop.forEach((l) => { dem[l.loai]++; });
    if (!lop.some((l) => l.loai === 'nguon')) vi.push(`TOAN_GHI_CHU: ${f} khong co dong nao la van ban nguon`);
  }
}
if (!soFile) thoat3(`khong thay ban chup nao trong ${ev}`);

console.log(`cau nguon: ${ds.length} · ban chup: ${soFile} · dong nguon ${dem.nguon}, ghi chu ${dem.ghi_chu}, chua phan dinh ${dem.chua_ro}`);
console.log(`chi nam trong ghi chu: ${tapThay.size} · ngan sach: ${tapNs.size}`);
if (vi.length) {
  console.log(`\nFAIL: ${vi.length} vi pham`);
  vi.forEach((v) => console.log('  ' + v));
  process.exit(2);
}
console.log(`\nOK: tap cau lam bang nam trong ghi chu dung bang ngan sach (${tapNs.size}), giao dien canh bao du.`);
