#!/usr/bin/env node
/**
 * check-matching.mjs · Matching Workbench v2 (M4): diem tu dung lai duoc, luat ghep hien dung,
 * ly do tu choi nguyen loi, va man hinh KHONG co duong ky.
 *
 * VI SAO CO (29/09/2026): Workbench v2 cho nha dau tu tu dung lai con so 0.70 bang tay. Nen con so
 * do, cong thuc do va canh chuoi gia tri do phai DUNG voi engine that, khong phai voi mot ban chep.
 *
 * HAI LOP:
 *   A. MATCHING_LECH: tinh lai lib/matching.mjs, so voi lib/hub-matching.json.
 *   B. Doc lap:
 *      CONG_THUC_LECH  he so trong cncl-match.json khac he so doc thang tu match_engine.py
 *      DIEM_LECH       diem tinh doc lap tu token + tier + he so engine khac diem engine
 *      TOKEN_HONG      tu giao khong nam trong tu cua cau, hoac ti le giao duoi nguong
 *      NEO_NHOM_HONG   nhom khong trung ma khong co canh chuoi gia tri, hoac canh chua duyet ma
 *                      khong tu khai trong unverified
 *      CANH_BIA        canh chuoi gia tri tren web khong co trong mapping_sp_nhom.yaml
 *      LY_DO_SUA       ly do tu choi tren web khac nguyen van so ky
 *      DUONG_KY        man Workbench co nut duyet/ky hoac duong ghi (fetch, POST)
 *      VUOT_NGAN_SACH / NGAN_SACH_CHUA_HA  giao cat so do hai cot (khoa mot chieu)
 *
 * Chay: node scripts/check-matching.mjs [--lib <dir>] [--kho <CaoLocMatch>] [--man <tsx>] [--ngan-sach <json>] [--mo-dun <matching.mjs>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { goc } from './goc.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const LIB = arg('--lib') || join(HERE, '..', 'lib');
const KHO = arg('--kho') || process.env.CLM_KHO_MATCH || goc('CaoLocMatch');
const MAN = arg('--man') || join(HERE, '..', 'components', 'dash', 'MatchingWorkbench.tsx');
const NGAN_SACH = arg('--ngan-sach') || join(HERE, 'ngan_sach_do_thi.json');
const MO_DUN = resolve(arg('--mo-dun') || join(HERE, '..', 'lib', 'matching.mjs'));
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
const doc = (p) => { if (!existsSync(p)) thoat3(`thieu ${p}`); return readFileSync(p, 'utf8'); };
if (!KHO) thoat3('khong thay kho CaoLocMatch');
const mat = JSON.parse(doc(join(LIB, 'cncl-match.json')));
const hub = JSON.parse(doc(join(LIB, 'hub-matching.json')));
const engine = doc(join(KHO, 'match_engine.py'));
const mapping = doc(join(KHO, 'domains', 'cncl_match', 'mapping_sp_nhom.yaml'));
const soKy = doc(join(KHO, 'domains', 'cncl_match', 'signoff_ledger.jsonl')).split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l));
const man = doc(MAN);
const ns = JSON.parse(doc(NGAN_SACH));
if (typeof ns.workbenchGiao !== 'number') thoat3('ngan_sach_do_thi.json thieu workbenchGiao');
if (!mat.signedMatches?.length) thoat3('khong co match da ky nao. Rong khong phai sach.');
const { dungMatching } = await import(pathToFileURL(MO_DUN).href);

const vi = [];
// ── A ───────────────────────────────────────────────────────────────────────
if (JSON.stringify(dungMatching(mat)) !== JSON.stringify(hub)) vi.push('MATCHING_LECH: hub-matching.json khac ban tinh lai');

// ── B. He so doc thang tu engine ────────────────────────────────────────────
const mCT = engine.match(/score = round\((\d+(?:\.\d+)?) \* ov \+ (\d+(?:\.\d+)?) \* tier_score \+ (\d+(?:\.\d+)?) \* loc, 2\)/);
const mTW = engine.match(/^TIER_W = (\{[^}]+\})/m);
const mOM = engine.match(/^OVERLAP_MIN_V2 = (\d+(?:\.\d+)?)/m);
if (!mCT || !mTW || !mOM) thoat3('khong doc duoc cong thuc diem trong match_engine.py');
const ct = { wGiao: Number(mCT[1]), wTier: Number(mCT[2]), wDiaDiem: Number(mCT[3]), tierW: JSON.parse(mTW[1]), nguongGiao: Number(mOM[1]) };
if (JSON.stringify(ct) !== JSON.stringify(mat.matchMeta.congThuc)) vi.push(`CONG_THUC_LECH: web ${JSON.stringify(mat.matchMeta.congThuc)} != engine ${JSON.stringify(ct)}`);

const canhMap = [...mapping.matchAll(/^\s+-\s*\{tu:\s*(\d+),\s*den:\s*(\d+),\s*ly_do:\s*"([^"]*)",\s*trang_thai:\s*(\w+)\}/gm)]
  .map((x) => ({ tu: Number(x[1]), den: Number(x[2]), lyDo: x[3], trangThai: x[4] }));

for (const m of mat.signedMatches) {
  const cau = new Set(m.tokenCau);
  if (!m.tokenCau.length || m.tokenGiao.some((t) => !cau.has(t))) vi.push(`TOKEN_HONG: ${m.id} tu giao khong nam trong tu cua cau`);
  const ov = m.tokenCau.length ? m.tokenGiao.length / m.tokenCau.length : 0;
  if (ov < ct.nguongGiao) vi.push(`TOKEN_HONG: ${m.id} ti le giao ${ov.toFixed(3)} duoi nguong ${ct.nguongGiao}`);
  const t1 = m.demandEvidence[0]?.tier; const t2 = m.supplyEvidence[0]?.tier;
  const diem = Math.round((ct.wGiao * ov + ct.wTier * ((ct.tierW[t1] + ct.tierW[t2]) / 2)) * 100) / 100;
  if (diem !== m.score) vi.push(`DIEM_LECH: ${m.id} tinh doc lap ${diem}, engine ${m.score}`);
  if (hub.phanRa[m.id]?.lamTron !== m.score) vi.push(`DIEM_LECH: ${m.id} phan ra tren web ${hub.phanRa[m.id]?.lamTron}, engine ${m.score}`);
  const trung = m.nhomCung.includes(m.nhomCau);
  if (!trung) {
    if (!m.canhChuoi) vi.push(`NEO_NHOM_HONG: ${m.id} nhom ${m.nhomCau} khong thuoc ${m.nhomCung.join(',')} ma khong co canh chuoi gia tri`);
    else {
      if (!m.nhomCung.includes(m.canhChuoi.tu) || m.canhChuoi.den !== m.nhomCau) vi.push(`NEO_NHOM_HONG: ${m.id} canh ${m.canhChuoi.tu}->${m.canhChuoi.den} khong noi nhom cung toi nhom cau`);
      if (!canhMap.some((e) => JSON.stringify(e) === JSON.stringify(m.canhChuoi))) vi.push(`CANH_BIA: ${m.id} canh ${m.canhChuoi.tu}->${m.canhChuoi.den} khong co nguyen van trong mapping_sp_nhom.yaml`);
      if (m.canhChuoi.trangThai !== 'da_duyet' && !JSON.stringify(m.unverified).includes('chuoi gia tri')) vi.push(`NEO_NHOM_HONG: ${m.id} canh chua duyet ma khong tu khai trong unverified`);
    }
  } else if (m.canhChuoi) vi.push(`NEO_NHOM_HONG: ${m.id} trung nhom truc tiep ma van gan canh chuoi gia tri`);
}

// Ly do tu choi: phai trung NGUYEN VAN so ky.
const tuChoiSo = soKy.filter((r) => r.decision === 'tu_choi');
if (tuChoiSo.length !== mat.rejectedPairs.length) vi.push(`LY_DO_SUA: so ky co ${tuChoiSo.length} cap tu choi, web co ${mat.rejectedPairs.length}`);
for (const r of mat.rejectedPairs) {
  const g = tuChoiSo.find((x) => x.khoa?.supply_entity === r.supplyId && x.khoa?.demand_entity === r.demandId);
  if (!g) vi.push(`LY_DO_SUA: khong thay cap ${r.supplyId} > ${r.demandId} trong so ky`);
  else if ((g.ly_do ?? '') !== r.lyDo) vi.push(`LY_DO_SUA: ly do cap ${r.supplyId} tren web khac nguyen van so ky`);
}

// Man hinh chi doc: quet dong khong phai chu thich.
const dongMa = man.split('\n').filter((l) => !/^\s*(\/\/|\*|\/\*)/.test(l));
dongMa.forEach((l, i) => {
  if (/\bfetch\s*\(|method:\s*['"]POST|XMLHttpRequest|sendBeacon/.test(l)) vi.push(`DUONG_KY: dong ${i + 1} co duong ghi: ${l.trim().slice(0, 70)}`);
  if (/>\s*(Duyệt|Phê duyệt|Approve|Reject|Ký match|Ký ngay|Từ chối cặp)\b/i.test(l)) vi.push(`DUONG_KY: dong ${i + 1} co nut quyet dinh: ${l.trim().slice(0, 70)}`);
});

// Giao cat so do hai cot do lai tu thu tu dang luu.
const { cau, cung, canh } = hub.haiCot;
const yc = new Map(cau.map((x, i) => [x, i])); const yu = new Map(cung.map((x, i) => [x, i]));
let giao = 0;
for (let i = 0; i < canh.length; i++) for (let j = i + 1; j < canh.length; j++) {
  const a = canh[i]; const b = canh[j];
  if (a.cau === b.cau || a.cung === b.cung) continue;
  if ((yc.get(a.cau) - yc.get(b.cau)) * (yu.get(a.cung) - yu.get(b.cung)) < 0) giao++;
}
if (canh.length !== mat.signedMatches.length + mat.rejectedPairs.length) vi.push(`MATCHING_LECH: so do co ${canh.length} canh, can ${mat.signedMatches.length + mat.rejectedPairs.length}`);
if (giao > ns.workbenchGiao) vi.push(`VUOT_NGAN_SACH: so do hai cot ${giao} giao > ${ns.workbenchGiao}`);
else if (giao < ns.workbenchGiao) vi.push(`NGAN_SACH_CHUA_HA: so do hai cot con ${giao} giao, ngan sach ${ns.workbenchGiao}`);

console.log(`match: ${mat.signedMatches.length} · tu choi: ${mat.rejectedPairs.length} · he so ${ct.wGiao}/${ct.wTier}/${ct.wDiaDiem} · giao hai cot ${giao}`);
if (vi.length) {
  console.log(`\nFAIL: ${vi.length} vi pham`);
  vi.slice(0, 30).forEach((v) => console.log('  ' + v));
  process.exit(2);
}
console.log('\nOK: diem tu dung lai khop engine, neo nhom va canh dung mapping, ly do tu choi nguyen van, man chi doc.');
