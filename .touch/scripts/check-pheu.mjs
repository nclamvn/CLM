#!/usr/bin/env node
/**
 * check-pheu.mjs · Phieu ghep tren man Matching khop engine va tu nhat quan.
 *
 * VI SAO CO (30/09/2026): man Matching them phieu "1.290 cap -> 187 -> 12 -> 11 ky" va hai danh
 * sach "may da chan", "suyt dat". Nhung con so do la loi khang dinh ve engine truoc nha dau tu, nen
 * phai la so cua engine chu khong phai so dep.
 *
 * CONG KIEM:
 *   PHEU_LECH   lib/hub-pheu.json khac CaoLocMatch/out/pheu.json (ban do pheu_matching.py ghi sau khi
 *               doi chieu tung cap voi make_matches_v2).
 *   TANG_SAI    tang khong giam dan; ky + tu choi khac so ung vien; so ky / tu choi khac cncl-match.json;
 *               so cap kha di khac (so nhu cau x so don vi co nang luc).
 *   VI_DU_SAI   vi du "may da chan" co ti le giao duoi nguong hoac nhom trung nhau (thi khong bi chan);
 *               vi du "suyt dat" co ti le ngoai (0, nguong) hoac tu vua giao vua thieu.
 *   SO_GO_TAY   components/dash/PheuGhep.tsx nhap du lieu khac hub-pheu.json, hoac chu JSX co so go tay.
 *
 * Chay: node scripts/check-pheu.mjs [--lib <dir>] [--kho <CaoLocMatch>] [--man <tsx>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { goc } from './goc.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const LIB = arg('--lib') || join(HERE, '..', 'lib');
const KHO = arg('--kho') || process.env.CLM_KHO_MATCH || goc('CaoLocMatch');
const MAN = arg('--man') || join(HERE, '..', 'components', 'dash', 'PheuGhep.tsx');
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
const docJ = (p) => { if (!existsSync(p)) thoat3(`thieu ${p}`); return JSON.parse(readFileSync(p, 'utf8')); };
if (!KHO) thoat3('khong thay kho CaoLocMatch');

const web = docJ(join(LIB, 'hub-pheu.json'));
const goc2 = docJ(join(KHO, 'out', 'pheu.json'));
const mat = docJ(join(LIB, 'cncl-match.json'));
if (!existsSync(MAN)) thoat3(`thieu ${MAN}`);
const vi = [];

// PHEU_LECH
const { generatedAt: _b, ...webKhongNgay } = web;
if (JSON.stringify(webKhongNgay) !== JSON.stringify(goc2)) vi.push('PHEU_LECH: lib/hub-pheu.json khac CaoLocMatch/out/pheu.json');

// TANG_SAI
const KHOA = ['kha_di', 'qua_neo_nhom', 'qua_giao_tu', 'da_ky', 'tu_choi'];
const t = Object.fromEntries((web.tang ?? []).map((x) => [x.k, x.n]));
if ((web.tang ?? []).map((x) => x.k).join() !== KHOA.join()) vi.push(`TANG_SAI: thu tu tang ${(web.tang ?? []).map((x) => x.k).join(',')}`);
if (!(t.kha_di >= t.qua_neo_nhom && t.qua_neo_nhom >= t.qua_giao_tu)) vi.push(`TANG_SAI: tang khong giam dan ${t.kha_di} > ${t.qua_neo_nhom} > ${t.qua_giao_tu}`);
if (t.da_ky + t.tu_choi !== t.qua_giao_tu) vi.push(`TANG_SAI: ${t.da_ky} ky + ${t.tu_choi} tu choi != ${t.qua_giao_tu} ung vien`);
if (t.da_ky !== mat.signedMatches.length) vi.push(`TANG_SAI: phieu ghi ${t.da_ky} ky, cncl-match co ${mat.signedMatches.length}`);
if (t.tu_choi !== mat.rejectedPairs.length) vi.push(`TANG_SAI: phieu ghi ${t.tu_choi} tu choi, cncl-match co ${mat.rejectedPairs.length}`);
if (t.kha_di !== web.so_nhu_cau * web.so_don_vi_co_nang_luc) vi.push(`TANG_SAI: ${t.kha_di} cap kha di != ${web.so_nhu_cau} x ${web.so_don_vi_co_nang_luc}`);

// VI_DU_SAI
const ng = web.nguong_giao;
for (const v of web.loai_lop1?.vi_du ?? []) {
  if (!(v.ty_le >= ng)) vi.push(`VI_DU_SAI: may da chan ${v.cau} x ${v.cung} ti le ${v.ty_le} duoi nguong ${ng}`);
  if ((v.nhom_cung ?? []).includes(v.nhom_cau)) vi.push(`VI_DU_SAI: may da chan ${v.cau} x ${v.cung} nhung nhom trung nhau (${v.nhom_cau})`);
}
for (const v of web.suyt_dat?.vi_du ?? []) {
  if (!(v.ty_le > 0 && v.ty_le < ng)) vi.push(`VI_DU_SAI: suyt dat ${v.cau} x ${v.cung} ti le ${v.ty_le} ngoai (0, ${ng})`);
  if ((v.giao ?? []).some((x) => (v.thieu ?? []).includes(x))) vi.push(`VI_DU_SAI: suyt dat ${v.cau} x ${v.cung} co tu vua giao vua thieu`);
}
for (const k of ['loai_lop1', 'suyt_dat']) if ((web[k]?.so ?? 0) < (web[k]?.vi_du?.length ?? 0)) vi.push(`VI_DU_SAI: ${k} so ${web[k].so} < ${web[k].vi_du.length} vi du`);

// SO_GO_TAY
const man = readFileSync(MAN, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').split('\n').filter((l) => !/^\s*\/\//.test(l)).join('\n');
const nhap = [...man.matchAll(/from\s+'(@\/lib\/[^']+)'/g)].map((m) => m[1]);
const la = nhap.filter((x) => !['@/lib/hub-pheu.json', '@/lib/ho-so.mjs'].includes(x));
if (la.length) vi.push(`SO_GO_TAY: PheuGhep.tsx nhap ${la.join(', ')}`);
if (!nhap.includes('@/lib/hub-pheu.json')) vi.push('SO_GO_TAY: PheuGhep.tsx khong doc hub-pheu.json');
for (const m of man.matchAll(/>([^<>{}]*)</g)) if (/\d[\d.,]*\d|\b\d{2,}\b/.test(m[1])) vi.push(`SO_GO_TAY: PheuGhep.tsx chu JSX co so "${m[1].trim().slice(0, 50)}"`);

console.log(`pheu: ${t.kha_di} -> ${t.qua_neo_nhom} -> ${t.qua_giao_tu} -> ${t.da_ky} ky / ${t.tu_choi} tu choi · chan ${web.loai_lop1?.so} · suyt dat ${web.suyt_dat?.so}`);
if (vi.length) {
  console.log(`\nFAIL: ${vi.length} vi pham`);
  vi.slice(0, 30).forEach((v) => console.log('  ' + v));
  process.exit(2);
}
console.log('\nOK: phieu ghep khop engine, cac tang nhat quan, vi du dung loai, khong so go tay.');
