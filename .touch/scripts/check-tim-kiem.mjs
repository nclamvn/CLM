#!/usr/bin/env node
/**
 * check-tim-kiem.mjs · Moi tai lieu trong chi muc phai TIM RA DUOC bang chinh ten cua no,
 * ca khi go CO DAU lan KHONG DAU.
 *
 * VI SAO CO (29/09/2026, pha P1): bang lenh Cmd+K la loi vao chinh cua hub trong kich ban
 * demo. Loi tim kiem tieng Viet rat de lot vi no chi hong o vai chu: NFD khong tach duoc "đ",
 * va bang bo dau cua nhieu thu vien khong phu o, u, a co dau. Go "dong anh" ma khong ra
 * "Đông Anh" la hong ngay truoc mat nha dau tu.
 *
 * Cong KHONG go cung ten don vi nao. No lay TUNG tai lieu trong lib/hub-search.json, dung ten
 * cua chinh tai lieu do lam cau hoi (ban co dau va ban bo dau), va doi tai lieu do nam trong
 * 3 ket qua dau. Registry them hay bot don vi, cong van dung.
 *
 * Cong import DUNG module giao dien dung (lib/tim-kiem.mjs), khong dung ban sao.
 *
 * Chay: node scripts/check-tim-kiem.mjs [--lib <dir>] [--mo-dun <duong dan tim-kiem.mjs>]
 * Exit 0 sach · 2 co tai lieu khong tim ra · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const LIB = arg('--lib') || join(HERE, '..', 'lib');
const MO_DUN = resolve(arg('--mo-dun') || join(HERE, '..', 'lib', 'tim-kiem.mjs'));

const p = join(LIB, 'hub-search.json');
if (!existsSync(p)) { console.log(`KHONG CHAY DUOC: thieu ${p}. Chay gen-hub-data.mjs.`); process.exit(3); }
if (!existsSync(MO_DUN)) { console.log(`KHONG CHAY DUOC: thieu module ${MO_DUN}.`); process.exit(3); }
const { timKiem, khoaTim } = await import(pathToFileURL(MO_DUN).href);
const { docs } = JSON.parse(readFileSync(p, 'utf8'));
if (!Array.isArray(docs) || docs.length === 0) {
  console.log('KHONG CHAY DUOC: chi muc rong. Khong co gi de tim thi khong duoc bao la tim tot.');
  process.exit(3);
}

// NGUOI DOI CHIEU DOC LAP: cau hoi "khong dau" KHONG duoc sinh bang chinh module dang bi
// kiem. Ngay 29/09/2026 rang 2b cua bite-lop-phu.mjs lo ra: neu ca chi muc lan module cung
// quen chu "đ" thi hai ben sai giong nhau, va phep thu "tim bang ten bo dau cua chinh no" van
// xanh. Nguoi dung go ban phim ASCII, nen cau hoi phai la ASCII that, sinh bang mot bang tra
// viet tay, khac han cach lam cua module (NFD + bo dau ket hop).
const BANG = {
  a: 'àáảãạăằắẳẵặâầấẩẫậ', e: 'èéẻẽẹêềếểễệ', i: 'ìíỉĩị', o: 'òóỏõọôồốổỗộơờớởỡợ',
  u: 'ùúủũụưừứửữự', y: 'ỳýỷỹỵ', d: 'đ',
};
const RA_ASCII = new Map(Object.entries(BANG).flatMap(([k, v]) => [...v].map((c) => [c, k])));
const asciiDocLap = (s) => [...String(s).normalize('NFC').toLowerCase()].map((c) => RA_ASCII.get(c) ?? c).join('').replace(/\s+/g, ' ').trim();

const sai = [];
let coD = 0;
for (const d of docs) {
  // Khoa trong chi muc phai la khoa cua CHINH module nay, neu khong thi tim bang mot luat va
  // dung chi muc bang mot luat khac.
  if (/[đĐ]/.test(d.ten)) coD++;
  const khoaMoi = khoaTim(`${d.ten} ${d.moTa} ${d.nhan}`);
  if (khoaMoi !== d.khoa) { sai.push(`KHOA_LECH: ${d.id} · chi muc sinh bang luat bo dau khac voi module dang dung`); continue; }
  for (const [nhan, q] of [['co dau', d.ten], ['khong dau', asciiDocLap(d.ten)]]) {
    const top = timKiem(docs, q, 3).map((r) => r.doc.id);
    if (!top.includes(d.id)) sai.push(`KHONG_TIM_RA (${nhan}): "${String(q).slice(0, 60)}" -> ${d.id}`);
  }
}
if (coD === 0) {
  console.log('KHONG CHAY DUOC: khong tai lieu nao co chu "đ", nen khong kiem duoc ca kho nhat.');
  process.exit(3);
}
for (const q of ['', '   ', 'zzqxv khong ton tai']) {
  const n = timKiem(docs, q).length;
  if (n !== 0) sai.push(`TRA_BUA: cau hoi "${q}" tra ${n} ket qua, phai la 0`);
}

console.log(`tai lieu: ${docs.length} · co chu đ: ${coD} · phep thu: ${docs.length * 2 + 3}`);
if (sai.length) {
  console.log(`\nFAIL: ${sai.length} loi tim kiem`);
  sai.slice(0, 20).forEach((s) => console.log('  ' + s));
  process.exit(2);
}
console.log('\nOK: moi tai lieu tim ra bang ten co dau va khong dau, cau hoi rong va vo nghia tra 0.');
