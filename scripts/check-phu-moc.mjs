/**
 * check-phu-moc.mjs · Cong do VUNG PHU cua anh moc. Khong can trinh duyet.
 *
 * VI SAO CO (24/08/2026): anh moc bao "TRUNG MOC tuyet doi" ngay sau khi tag loai hinh duoc
 * them len 9 the, vi ca 9 deu nam duoi khung nhin. Phep so anh chi canh giu phan no nhin
 * thay, va truoc hom nay khong ai biet phan do la bao nhieu.
 *
 * Cong nay bien con so do thanh mot con so CO THAT va KHOA MOT CHIEU:
 *   - Duoc tang. Them mot khung hinh la phu them.
 *   - Khong duoc giam. Nap them don vi ma khong mo rong khung hinh la vung phu tut, va cong keu.
 *
 * BA TRANG THAI, khong phai hai. Neu registry da doi ma chua ai chup lai thi con so trong
 * reports/phu_moc.json la con so CU. Cong KHONG duoc bao XANH trong tinh huong do: no bao
 * KHONG CHAY DUOC. Vang tin khong phai tin tot.
 *
 * Chay: node scripts/check-phu-moc.mjs
 * Exit 0 sach · 2 vung phu tut hoac ngan sach lech · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const env = (t) => (process.env[t] || '').trim() || null;
const TOUCH = env('CLM_KHO_TOUCH') || dirname(dirname(fileURLToPath(import.meta.url)));
const PHU = join(TOUCH, 'reports', 'phu_moc.json');
const NGAN = join(TOUCH, 'scripts', 'ngan_sach_phu_moc.txt');

const thoat = (ma, ...d) => { console.log(...d); process.exit(ma); };

if (!existsSync(PHU)) thoat(3, 'KHONG CHAY DUOC: chua co reports/phu_moc.json. Chay scripts/chup_man.sh mot lan.');
if (!existsSync(NGAN)) thoat(3, 'KHONG CHAY DUOC: thieu scripts/ngan_sach_phu_moc.txt');

const lib = readFileSync(join(TOUCH, 'lib', 'cncl-registry.ts'), 'utf8');
const m = lib.match(/export const cnclUnits(?::\s*CnclUnit\[\])?\s*=\s*(\[[\s\S]*?\n\]);/);
if (!m) thoat(3, 'KHONG CHAY DUOC: khong doc duoc cnclUnits trong lib/cncl-registry.ts');
const ten = JSON.parse(m[1]).map((u) => u.name);
const vanTay = createHash('sha256').update(ten.slice().sort().join('|')).digest('hex').slice(0, 16);

const p = JSON.parse(readFileSync(PHU, 'utf8'));

// Cai bay chinh cua cong nay: doc mot file cu roi bao xanh. Van tay chan dung cho do.
if (p.van_tay_registry !== vanTay) {
  console.log(`KHONG CHAY DUOC: registry da doi ke tu lan chup cuoi (${p.ngay}).`);
  console.log(`  van tay luc chup : ${p.van_tay_registry} · ${p.tong_don_vi} don vi`);
  console.log(`  van tay hien tai : ${vanTay} · ${ten.length} don vi`);
  console.log('So don vi co anh moc canh giu la con so CU, khong dung de ket luan duoc.');
  console.log('Chay: bash scripts/chup_man.sh   (roi NHIN anh truoc khi chot moc)');
  process.exit(3);
}

const ns = Number(readFileSync(NGAN, 'utf8').split('\n')[0].trim());
const co = p.phu.length;
console.log(`vung phu: ${co}/${p.tong_don_vi} don vi co anh moc canh giu · ngan sach: ${ns}`);
if (p.thieu.length) console.log(`  chua co anh moc: ${p.thieu.length} don vi`);

if (co < ns) {
  console.log(`\nFAIL: TUT vung phu. Truoc day ${ns} don vi co anh moc canh giu, nay con ${co}.`);
  console.log('Thuong la vi nap them don vi ma khong mo rong khung hinh trong moc_anh.json.');
  process.exit(2);
}
if (co > ns) {
  console.log(`\nFAIL(TOT): MO RONG duoc. Sua ${NGAN} thanh ${co} de chot muc moi.`);
  console.log('Mo rong ma khong chot lai thi khoa dung yen va het siet.');
  process.exit(2);
}
console.log('\nOK: vung phu dung ngan sach.');
