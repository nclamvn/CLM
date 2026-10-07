#!/usr/bin/env node
/**
 * check-dieu-phoi.mjs · Man Dieu phoi chi duoc noi dieu so su kien va goi y cua may chung minh duoc.
 *
 * VI SAO CO (07/10/2026): man nay la noi nguoi van hanh nhin vao de biet hom nay phai lam gi. Mot
 * viec bi rot (cap da duyet ma khong ai nhac gui gioi thieu) la mot co hoi chet im lang; mot phieu
 * thoi phong (ghi "da gioi thieu" khi so chua co) la noi doi voi nha dau tu. Ca hai phai do.
 *
 * CONG KIEM:
 *   DIEU_PHOI_LECH  lib/hub-dieu-phoi.json khac ban tinh lai bang lib/dieu-phoi.mjs.
 *   SO_LECH         so nhu cau khac so ma trong dong nhu_cau cua mui_nhon.yaml (dem doc lap bang
 *                   tach chuoi); so su kien khac so dong cua su_kien.jsonl; buoc dau phieu khac so
 *                   nhu cau.
 *   PHEU_NGUOC      mot buoc sau cua phieu lon hon buoc truoc.
 *   VIEC_NGOAI_MUI  hang viec co nhu cau ngoai mui nhon.
 *   VIEC_ROT        mot ung vien dang do (cho xet, da duyet, da gioi thieu, quan tam) cua nhu cau chua
 *                   dong ma khong co dung mot viec trong hang; hoac nhu cau khong co ung vien nao ma
 *                   thieu viec "tim ben cung".
 *   PHEU_THOI       buoc "da gioi thieu" lon hon so nhu cau co su kien gioi_thieu dem truc tiep tren so.
 *   NHAN_THIEU      giao dien khong noi ro may chi de xuat viec, chi nguoi ghi su kien.
 *   LENH_SAI        (07/10/2026) lenh ghi kem viec khong dung loai su kien cua viec, sai nhu cau, sai
 *                   don vi, hoac nguoi ghi khong phai nguoi co quyen (gac cong cho viec xet, nguoi
 *                   gioi thieu cho viec sau); viec "tim ben cung" khong duoc co lenh ghi. Bang tra
 *                   loai viec -> loai su kien khai rieng o day, khong muon cua module.
 *
 * Chay: node scripts/check-dieu-phoi.mjs [--lib <dir>] [--dp <domains/dieu_phoi>] [--mo-dun <dieu-phoi.mjs>] [--giao-dien <tsx>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { goc } from './goc.mjs';
import { slugDonVi } from '../lib/ho-so.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const LIB = resolve(arg('--lib') || join(TOUCH, 'lib'));
const DP = arg('--dp') ? resolve(arg('--dp')) : goc('CaoLocMatch', 'domains', 'dieu_phoi');
const MO_DUN = resolve(arg('--mo-dun') || join(TOUCH, 'lib', 'dieu-phoi.mjs'));
const GD = resolve(arg('--giao-dien') || join(TOUCH, 'components', 'dieuphoi', 'DieuPhoi.tsx'));
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
if (!DP || !existsSync(join(DP, 'mui_nhon.yaml'))) thoat3('thieu domains/dieu_phoi/mui_nhon.yaml');
for (const f of ['hub-dieu-phoi.json', 'hub-cau-that.json', 'cncl-registry.json']) if (!existsSync(join(LIB, f))) thoat3(`thieu ${f}`);
const dj = (f) => JSON.parse(readFileSync(join(LIB, f), 'utf8'));
const dp = dj('hub-dieu-phoi.json'); const ct = dj('hub-cau-that.json'); const reg = dj('cncl-registry.json');
const yamlTho = readFileSync(join(DP, 'mui_nhon.yaml'), 'utf8');
const dongSk = existsSync(join(DP, 'su_kien.jsonl')) ? readFileSync(join(DP, 'su_kien.jsonl'), 'utf8').split('\n').filter((l) => l.trim()) : [];
const suKien = dongSk.map((l) => JSON.parse(l));
const { docMuiNhon, dungDieuPhoi } = await import(pathToFileURL(MO_DUN).href + '?t=' + Date.now());

const vi = [];
let lai = null;
try { lai = dungDieuPhoi(docMuiNhon(yamlTho), suKien, ct, reg.meta.generatedAt, slugDonVi); } catch (e) { thoat3(`khong dung lai duoc: ${e.message}`); }
if (JSON.stringify(lai) !== JSON.stringify(dp)) vi.push('DIEU_PHOI_LECH: hub-dieu-phoi.json khac ban tinh lai tu mui_nhon.yaml + su_kien.jsonl + goi y cau that');

// Dem doc lap.
const dongNc = yamlTho.split('\n').find((l) => l.startsWith('nhu_cau:')) ?? '';
const mui = (dongNc.split('[')[1] ?? '').split(']')[0].split(',').map((x) => x.trim()).filter(Boolean);
if (dp.meta.soNhuCau !== mui.length) vi.push(`SO_LECH: so nhu cau ghi ${dp.meta.soNhuCau}, mui_nhon.yaml co ${mui.length}`);
if (dp.meta.soSuKien !== dongSk.length) vi.push(`SO_LECH: so su kien ghi ${dp.meta.soSuKien}, so co ${dongSk.length} dong`);
if (dp.pheu[0]?.so !== mui.length) vi.push(`SO_LECH: buoc dau phieu ${dp.pheu[0]?.so}, so nhu cau ${mui.length}`);
for (let i = 1; i < dp.pheu.length; i++) if (dp.pheu[i].so > dp.pheu[i - 1].so) vi.push(`PHEU_NGUOC: "${dp.pheu[i].nhan}" ${dp.pheu[i].so} lon hon buoc truoc ${dp.pheu[i - 1].so}`);
const gtTrucTiep = new Set(suKien.filter((e) => e.loai === 'gioi_thieu').map((e) => e.nhu_cau)).size;
const buocGt = dp.pheu.find((p) => p.buoc === 'da_gioi_thieu')?.so ?? 0;
if (buocGt > gtTrucTiep) vi.push(`PHEU_THOI: phieu ghi ${buocGt} nhu cau da gioi thieu, so chi co ${gtTrucTiep}`);

const muiSet = new Set(mui);
for (const v of dp.viec) if (!muiSet.has(v.nhuCau)) vi.push(`VIEC_NGOAI_MUI: ${v.nhan} cho ${v.nhuCau}`);
const DANG_DO = new Set(['cho_xet', 'da_duyet', 'da_gioi_thieu', 'quan_tam']);
for (const n of dp.nhuCau) {
  if (n.dong) continue;
  if (!n.ungVien.length && !dp.viec.some((v) => v.nhuCau === n.ma && v.loai === 'tim_ben_cung')) vi.push(`VIEC_ROT: ${n.ma} khong co ung vien ma thieu viec tim ben cung`);
  for (const u of n.ungVien) {
    if (!DANG_DO.has(u.trangThai)) continue;
    const k = dp.viec.filter((v) => v.nhuCau === n.ma && v.donVi === u.dv).length;
    if (k !== 1) vi.push(`VIEC_ROT: ${n.ma} · ${u.dv} dang ${u.trangThai} ma co ${k} viec`);
  }
}

const SU_KIEN_CUA = { xet_ung_vien: 'duyet_ung_vien', gui_gioi_thieu: 'gioi_thieu', cho_phan_hoi: 'phan_hoi', ghi_ket_qua: 'ket_qua' };
const gacCong = (yamlTho.match(/^nguoi_gac_cong:\s*\[([^\]]*)\]/m)?.[1] ?? '').split(',').map((x) => x.trim()).filter(Boolean);
const gioiThieu = (yamlTho.match(/^nguoi_gioi_thieu:\s*(.+?)\s*$/m)?.[1] ?? '').trim();
for (const v of dp.viec) {
  const tag = `${v.nhan} ${v.nhuCau}${v.donVi ? ' · ' + v.donVi : ''}`;
  if (v.loai === 'tim_ben_cung') { if (v.lenh) vi.push(`LENH_SAI: ${tag} khong duoc co lenh ghi`); continue; }
  const l = String(v.lenh ?? '');
  const nguoi = v.loai === 'xet_ung_vien' ? gacCong[0] : gioiThieu;
  const dung = l.startsWith(`python3 dieu_phoi.py ${SU_KIEN_CUA[v.loai]} `) && l.includes(` --nhu-cau ${v.nhuCau} `)
    && l.includes(` --don-vi "${v.donVi}" `) && l.includes(` --nguoi "${nguoi}" `) && l.endsWith(' --ghi');
  if (!dung) vi.push(`LENH_SAI: ${tag} lenh "${l.slice(0, 90)}"`);
}

if (!existsSync(GD)) vi.push(`NHAN_THIEU: khong thay giao dien ${GD}`);
else {
  const s = readFileSync(GD, 'utf8');
  for (const tu of ['máy chỉ đề xuất việc', 'chỉ người ghi']) if (!s.includes(tu)) vi.push(`NHAN_THIEU: giao dien khong co chu "${tu}"`);
}

console.log(`dieu phoi: ${dp.meta.ten} · ${dp.meta.soNhuCau} nhu cau · ${dp.meta.soSuKien} su kien · ${dp.meta.soViec} viec (${dp.meta.soQuaHan} qua han) · phieu ${dp.pheu.map((p) => p.so).join('/')}`);
if (vi.length) { console.log(`\nFAIL: ${vi.length} vi pham`); vi.slice(0, 30).forEach((v) => console.log('  ' + v)); process.exit(2); }
console.log('\nOK: phieu va hang viec khop so su kien, dem doc lap, khong viec nao rot, khong buoc nao thoi phong.');
