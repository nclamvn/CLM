#!/usr/bin/env node
/**
 * gen-cncl-data.mjs · Sinh du lieu web tu registry THAT, khong go tay.
 *
 * Doc:
 *   CNCLData/domains/don_vi_cncl/claims.jsonl        chieu CUNG (42 don vi)
 *   KnowledgeBase/Dataset_CongNgheChienLuoc/claims.jsonl  chieu CAU (30 san pham)
 *   CaoLocMatch/out/matches.jsonl                    match da chay qua cong
 *   CaoLocMatch/domains/cncl_match/signoff_ledger.jsonl   so chu ky nguoi gac cong
 *
 * Ghi:
 *   lib/cncl-registry.ts   don vi + bang chung tung o
 *   lib/cncl-match.ts      match kem chu ky that
 *   public/evidence/*.txt  ban chup nguyen van
 *
 * BA LUAT:
 *   1. Ban chup goc thieu thi FAIL. Khong lay ban cu trong public/evidence de chay tiep.
 *      Cung ky luat voi dong_bo_snapshot() ben build_cncl_match.py: thieu dieu kien ma
 *      van chay tiep thi cho suy bien do chinh la duong ro.
 *   2. Chi lay match CO CHU KY THAT trong so. Match chua ky khong duoc len web, vi trang
 *      web la cho trinh ra ngoai.
 *   3. Moi so tren web deu tinh tu file, khong hard-code. Ban PDF trang thai da tung ghi
 *      "1 vi pham" trong khi so that la 26 dung vi go tay.
 *
 * Chay: node scripts/gen-cncl-data.mjs
 * Exit 0 neu ghi xong. Exit 2 neu thieu dieu kien.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, copyFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { goc, tim } from './goc.mjs';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');

// Goc duong dan dung chung mot nguon su that, xem scripts/goc.mjs.

// BAN LAM VIEC TAM: CLM_KHO_* tro toi ban sao cua kho, dung cho cac bo rang. Khong dat
// thi chay tren kho that. Xem chay_het_cong.sh de biet vi sao can.
const env = (k) => process.env[k] || null;

const SUP = env('CLM_KHO_CNCL') ? join(env('CLM_KHO_CNCL'), 'domains', 'don_vi_cncl')
  : tim('registry CUNG', 'CNCLData', 'domains', 'don_vi_cncl');
// Chieu CAU: TIM TRONG KHO TRUOC (them 01/09/2026, khi gop kho thu tu). goc() da di nguoc
// to tien cua chinh file nay, nen trong bo cuc gop no thay ngay Dataset_CongNgheChienLuoc
// nam canh CNCLData. Hai duong dan ngoai giu lam duong lui cho ky chuyen tiep.
const DEM = env('CLM_KHO_DEM') || goc('Dataset_CongNgheChienLuoc')
  || (existsSync('/Users/os/RtR/KnowledgeBase/Dataset_CongNgheChienLuoc')
    ? '/Users/os/RtR/KnowledgeBase/Dataset_CongNgheChienLuoc'
    : tim('dataset CAU', 'KnowledgeBase', 'Dataset_CongNgheChienLuoc'));
const CLM = env('CLM_KHO_MATCH') || tim('kho match', 'CaoLocMatch');

const doc = (p) => readFileSync(p, 'utf8').split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l));

const TEN_NHOM = {
  1: 'Công nghệ số', 2: 'Mạng di động thế hệ sau', 3: 'Robot và tự động hoá',
  4: 'Sinh học và y sinh', 5: 'Năng lượng và vật liệu', 6: 'Chip bán dẫn',
  7: 'An ninh mạng và lượng tử', 8: 'Biển, đại dương, lòng đất',
  9: 'Hàng không và vũ trụ', 10: 'Đường sắt tốc độ cao',
};

// Nhan cho truong loai_hinh. Ma trong registry la 'DN' / 'vien' / 'truong' theo schema cua
// domain.yaml, va gia tri do la NORMALIZED chu khong phai chu cua nguon: nguon viet "Tổng
// công ty Công nghiệp Công nghệ cao Viettel", nguoi nhap suy ra 'DN'. Nen tren the phai hien
// mot NHAN PHAN LOAI de doc, khong duoc bay ra nhu mot cau trich.
//
// Ma la khong biet thi TRA LAI CHINH MA, khong tra chuoi rong. Ma moi la phai nhin thay ngay
// tren the chu khong bien mat im lang; do la khac biet giua honest-null va bo sot.
const TEN_LOAI = { DN: 'Doanh nghiệp', vien: 'Viện', truong: 'Trường' };

// ── Ban chup ────────────────────────────────────────────────────────────────
const EV = join(TOUCH, 'public', 'evidence');
mkdirSync(EV, { recursive: true });

function chepBanChup(canDung) {
  const them = [], doi = [], thieu = [];
  for (const ten of [...canDung].sort()) {
    const nguon = [join(SUP, 'snapshots', ten), join(DEM, 'snapshots', ten)].find((p) => existsSync(p));
    if (!nguon) { thieu.push(ten); continue; }
    const dich = join(EV, ten.replace(/\.(html|md)$/, '.txt'));
    if (!existsSync(dich)) { copyFileSync(nguon, dich); them.push(ten); }
    else if (readFileSync(nguon, 'utf8') !== readFileSync(dich, 'utf8')) { copyFileSync(nguon, dich); doi.push(ten); }
  }
  console.log(`EVIDENCE: ${canDung.size} can · them ${them.length} · cap nhat ${doi.length} · thieu ${thieu.length}`);
  for (const t of doi) console.log(`  [CAP NHAT] ${t}  (ban chup goc da doi chu)`);
  for (const t of thieu) console.log(`  [THIEU]    ${t}  KHONG co o ca hai mien goc`);
  if (thieu.length) {
    console.error(`FAIL: ${thieu.length} ban chup khong co ban goc. Khong xai ban cu de chay tiep.`);
    process.exit(2);
  }
}

const href = (snap) => `/evidence/${snap.replace(/\.(html|md)$/, '.txt')}`;

// ── Chieu CUNG ──────────────────────────────────────────────────────────────
const sup = doc(join(SUP, 'claims.jsonl'));
const canDung = new Set(sup.map((c) => c.capture.snapshot));

const theoDonVi = new Map();
for (const c of sup) {
  if (!theoDonVi.has(c.entity)) theoDonVi.set(c.entity, []);
  theoDonVi.get(c.entity).push(c);
}

const capTot = (cs) => (cs.some((c) => c.tier === 'A') ? 'A' : cs.some((c) => c.tier === 'B') ? 'B' : 'C');
const dau = (cs, f) => cs.find((c) => c.field === f)?.value ?? '';

const units = [...theoDonVi.entries()].sort((a, b) => a[0].localeCompare(b[0], 'vi')).map(([ten, cs]) => {
  const nhomCs = cs.filter((c) => c.field === 'nhom_cncl' || c.field.startsWith('nhom_cncl_phu_'));
  const nhoms = [...new Set(nhomCs.map((c) => String(c.value)))].sort((a, b) => Number(a) - Number(b));
  const sps = [...new Set(cs.filter((c) => c.field === 'san_pham_lien_quan' || c.field.startsWith('san_pham_phu_'))
    .map((c) => String(c.value)))].sort();
  const nguon = [...new Map(cs.map((c) => [c.capture.source, { source: c.capture.source, href: href(c.capture.snapshot) }])).values()];
  return {
    name: ten,
    loaiHinh: dau(cs, 'loai_hinh'),
    // Nhan doc duoc cua loai_hinh. Cung khuon voi nhomLabels: ma o mot khoa, chu o khoa
    // khac, de the hien chu ma cong `truong_hien` van kiem duoc dung khoa goc.
    loaiHinhLabel: TEN_LOAI[dau(cs, 'loai_hinh')] ?? dau(cs, 'loai_hinh'),
    nhoms,
    nhomLabels: nhoms.map((n) => `Nhóm ${n} · ${TEN_NHOM[Number(n)] ?? ''}`.trim()),
    sanPham: sps,
    capability: dau(cs, 'nang_luc_mo_ta'),
    // MO TA NANG LUC THU HAI (them 24/08/2026). Truoc do the card chi hien
    // `nang_luc_mo_ta`, tuc mot don vi co hai mang nang luc thi web chi ke MOT.
    //
    // Lo ra o ca FECON: cau duoc chon lam dong tom tat la "don vi truc tiep van hanh robot
    // dao ngam (TBM)...", dung cai ve mà domain.yaml xep vao KHONG DU DIEU KIEN. Lam giu
    // FECON lai chinh vi phan TU NGHIEN CUU, va phan do nam o `nang_luc_mo_ta_2`. Neu web
    // chi hien dong dau thi trang web noi nguoc voi ly do giu don vi do.
    //
    // Khong doi thu tu, khong chon cau nao "dep hon": hien CA HAI, dung thu tu truong.
    capability2: dau(cs, 'nang_luc_mo_ta_2'),
    bestTier: capTot(cs),
    favorsRtr: cs.some((c) => c.favors === 'rtr'),
    sources: nguon,
    // Chuoi tra cuu: gop het chu de o loc tren trinh duyet khoi phai duyet tung truong.
    tim: [ten, dau(cs, 'loai_hinh'), TEN_LOAI[dau(cs, 'loai_hinh')] ?? '',
      dau(cs, 'nang_luc_mo_ta'), dau(cs, 'nang_luc_mo_ta_2'),
      ...nhoms.map((n) => `nhóm ${n} ${TEN_NHOM[Number(n)] ?? ''}`), ...sps.map((s) => `sp ${s}`)]
      .filter(Boolean).join(' ').toLowerCase(),
    evidence: cs.map((c) => ({
      field: c.field, value: String(c.value), span: c.evidence_span,
      source: c.capture.source, tier: c.tier, extraction: c.extraction,
      href: href(c.capture.snapshot), note: c.note ?? '',
    })),
  };
});

// ── Chieu CAU: chi lay ten_san_pham cua danh muc hien hanh ──────────────────
const dem = doc(join(DEM, 'claims.jsonl'));
for (const c of dem) if (c.snapshot) canDung.add(c.snapshot);
// Su kien chinh sach (man Dong thoi cuoc, 29/09/2026): ban chup cua chung cung phai len /evidence.
const SU_KIEN = join(DEM, 'su_kien_chinh_sach.jsonl');
if (existsSync(SU_KIEN)) for (const e of doc(SU_KIEN)) for (const b of e.bang_chung) canDung.add(b.snapshot);
// Moi san pham co HAI ban wording: ban -A la wording chinh thuc baochinhphu, ban con lai
// la bao thuat lai. Lay dung luat uu tien cua build_cncl_match.py chu KHONG tu che, neu
// khong thi ten san pham tren web se lech voi ten ma engine dung de match.
const theoSanPham = new Map();
for (const c of dem) {
  if (c.field !== 'ten_san_pham') continue;
  const base = c.id.replace('-A', '');
  if (!theoSanPham.has(base) || c.id.endsWith('-A')) theoSanPham.set(base, c);
}
const needs = [...theoSanPham.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([base, c]) => ({
  id: base,
  entityId: `${base} · nhu cầu quốc gia`,
  value: String(c.value), span: c.evidence_span,
  tier: c.tier, source: c.source_url ? new URL(c.source_url).hostname : '', href: href(c.snapshot),
  chinhThuc: c.id.endsWith('-A'),
  tim: `${base} ${c.value}`.toLowerCase(),
}));

// ── Match: CHI lay dong CO CHU KY THAT trong so ─────────────────────────────
const matches = doc(join(CLM, 'out', 'matches.jsonl'));
const soKy = doc(join(CLM, 'domains', 'cncl_match', 'signoff_ledger.jsonl'));
const dxClaims = doc(join(CLM, 'domains', 'cncl_match', 'claims.jsonl'));

const factCua = new Map();
for (const c of dxClaims) {
  const k = `${c.entity}|${c.field}`;
  factCua.set(k, c);
}
const timFact = (ent, ids) => dxClaims.filter((c) => c.entity === ent &&
  ids.some((i) => factId(c.entity, c.field, c.value) === i));

// fact_id = sha1(entity|field|value).slice(0,10), giong match_engine.py
import { createHash } from 'node:crypto';
function factId(entity, field, value) {
  return 'FACT-' + createHash('sha1').update(`${entity}|${field}|${value}`, 'utf8').digest('hex').slice(0, 10);
}

const kyTheoMatch = new Map(soKy.map((r) => [r.match_id, r]));
const daKy = matches.filter((m) => (m.gate?.signoff?.by) && m.gate.signoff.by !== 'pending-human-review'
  && m.gate.signoff.decision === 'ky');

// ── Cong thuc diem cua engine, DOC tu match_engine.py (khong go lai) ─────────
// VI SAO (29/09/2026, Workbench v2): nha dau tu phai tu dung lai duoc con so 0.70 bang tay. Vay
// trang web can token cua ben cau, trong so cong thuc va canh chuoi gia tri da dung. Go lai hang
// so o day thi mot ngay engine doi trong so ma web van hien cong thuc cu. Nen doc thang tu nguon,
// thieu cho nao thi dung lai.
const ENGINE_SRC = readFileSync(join(CLM, 'match_engine.py'), 'utf8');
const mCT = ENGINE_SRC.match(/score = round\((\d+(?:\.\d+)?) \* ov \+ (\d+(?:\.\d+)?) \* tier_score \+ (\d+(?:\.\d+)?) \* loc, 2\)/);
const mTW = ENGINE_SRC.match(/^TIER_W = (\{[^}]+\})/m);
const mOM = ENGINE_SRC.match(/^OVERLAP_MIN_V2 = (\d+(?:\.\d+)?)/m);
if (!mCT || !mTW || !mOM) { console.error('KHONG DOC DUOC cong thuc diem trong match_engine.py (score/TIER_W/OVERLAP_MIN_V2).'); process.exit(2); }
const congThuc = { wGiao: Number(mCT[1]), wTier: Number(mCT[2]), wDiaDiem: Number(mCT[3]), tierW: JSON.parse(mTW[1]), nguongGiao: Number(mOM[1]) };
const MAP_TXT = readFileSync(join(CLM, 'domains', 'cncl_match', 'mapping_sp_nhom.yaml'), 'utf8');
const canhChuoi = [...MAP_TXT.matchAll(/^\s+-\s*\{tu:\s*(\d+),\s*den:\s*(\d+),\s*ly_do:\s*"([^"]*)",\s*trang_thai:\s*(\w+)\}/gm)]
  .map((x) => ({ tu: Number(x[1]), den: Number(x[2]), lyDo: x[3], trangThai: x[4] }));

const webMatches = daKy.map((m) => {
  const cau = timFact(m.demand.entity_id, m.demand.need_fact_ids);
  const cung = timFact(m.supply.entity_id, m.supply.capability_fact_ids);
  const so = kyTheoMatch.get(m.id);
  const anh = (c) => ({
    field: c.field, value: String(c.value), span: c.evidence_span, tier: c.tier,
    extraction: c.extraction, source: c.capture.source, href: href(c.capture.snapshot),
  });
  return {
    id: m.id,
    score: m.rationale.score,
    rule: m.rationale.rule,
    engine: m.rationale.computed_by,
    demandId: m.demand.entity_id,
    supplyId: m.supply.entity_id,
    nhomCau: m.rationale.neo_nhom?.nhom_cau ?? null,
    nhomCung: m.rationale.neo_nhom?.nhom_cung ?? [],
    quaChuoiGiaTri: Boolean(m.rationale.neo_nhom?.qua_canh_chuoi_gia_tri),
    tokenGiao: m.rationale.token_con_lai?.giao ?? [],
    // Token con lai cua ben CAU sau khi bo tu dung: mau so cua ti le giao.
    tokenCau: m.rationale.token_con_lai?.need ?? [],
    // Canh engine da dung khi nhom cung khong trung nhom cau: canh DAU TIEN trong mapping co tu
    // thuoc nhom cung va den = nhom cau (dung thu tu engine duyet).
    canhChuoi: m.rationale.neo_nhom?.qua_canh_chuoi_gia_tri
      ? (canhChuoi.find((e) => (m.rationale.neo_nhom.nhom_cung ?? []).includes(e.tu) && e.den === m.rationale.neo_nhom.nhom_cau) ?? null)
      : null,
    signoff: { by: m.gate.signoff.by, role: m.gate.signoff.role, date: m.gate.signoff.date },
    // Fact them vao SAU khi nguoi ky. Chu ky cu khong phu chung, nen web phai noi ro.
    chuaDuyet: m.gate.signoff.chua_duyet ?? [],
    soChuoi: (m.rationale.chuoi_bang_chung ?? []).length,
    khoaBangChung: so?.khoa?.bang_chung ?? null,
    demandEvidence: cau.map(anh),
    supplyEvidence: cung.map(anh),
    unverified: m.unverified ?? [],
  };
});

const tuChoi = soKy.filter((r) => r.decision === 'tu_choi').map((r) => ({
  demandId: r.khoa.demand_entity, supplyId: r.khoa.supply_entity,
  by: r.by, date: r.date, lyDo: r.ly_do ?? '',
}));

chepBanChup(canDung);

// ── Ghi ─────────────────────────────────────────────────────────────────────

// Ket qua chuoi cong do chay_het_cong.sh ghi o CaoLocMatch/out/ket_qua_chuoi.json (git bo qua).
// Khong co file thi NOI THANG la chua co, khong bia "xanh". Luu y: trang web sinh GIUA chuoi,
// nen so o day la cua lan chay TRON GAN NHAT truoc do, va vi the phai kem thoi diem.
function docChuoiCong() {
  const p = join(CLM, 'out', 'ket_qua_chuoi.json');
  if (!existsSync(p)) {
    return { gate: 'chuỗi cổng: chưa có kết quả trong môi trường này', chuoiCong: null };
  }
  const k = JSON.parse(readFileSync(p, 'utf8'));
  const dat = k.do === 0 && k.khong_chay === 0;
  const luc = String(k.luc).slice(0, 16).replace('T', ' ');
  const hoan = k.hoan > 0 ? ` · hoãn ${k.hoan}` : '';
  const nhanh = k.che_do === 'nhanh' ? ' · chế độ nhanh' : '';
  return {
    gate: `chuỗi cổng ${luc}: ${k.xanh}/${k.tong} xanh${hoan}${nhanh}${dat ? '' : ` · ĐỎ ${k.do} · không chạy ${k.khong_chay}`}`,
    chuoiCong: {
      luc: k.luc, cheDo: k.che_do, tong: k.tong, xanh: k.xanh, do: k.do,
      khongChay: k.khong_chay, hoan: k.hoan, dat,
    },
  };
}
const NOW = new Date().toISOString().slice(0, 10);
const dem_tier = (t) => sup.filter((c) => c.tier === t).length;

const meta = {
  units: units.length,
  claims: sup.length,
  needs: needs.length,
  sources: new Set(sup.map((c) => c.capture.source)).size,
  snapshots: canDung.size,
  tierA: dem_tier('A'),
  tierB: dem_tier('B'),
  nhomPhu: [...new Set(sup.filter((c) => c.field === 'nhom_cncl').map((c) => String(c.value)))].length,
  generatedAt: NOW,
  frame: 'QĐ 21/2026/QĐ-TTg',
  // Doc tu KET QUA THAT cua lan chay chuoi cong gan nhat, khong go tay. Ngay 29/09/2026 dong
  // nay con la chu 'chay_het_cong.sh · 14 o xanh' trong khi chuoi da 49 o, va chu do hien o
  // tooltip GATE PASS cua trang Registry. Xem docChuoiCong() ben duoi.
  ...docChuoiCong(),
};

const banner = (nguon) => `// AUTO-GENERATED boi scripts/gen-cncl-data.mjs · ${NOW} · KHONG sua tay.
// Nguon: ${nguon}
// Sua o day se bi ghi de lan chay ke. Muon doi noi dung thi sua registry goc roi sinh lai.
`;

writeFileSync(join(TOUCH, 'lib', 'cncl-registry.ts'), banner('CNCLData/domains/don_vi_cncl + Dataset_CongNgheChienLuoc') + `
export type CnclTier = 'A' | 'B' | 'C';
export type CnclEvidence = {
  field: string; value: string; span: string; source: string;
  tier: CnclTier; extraction: string; href: string; note: string;
};
export type CnclSource = { source: string; href: string };
export type CnclUnit = {
  name: string; loaiHinh: string; loaiHinhLabel: string; nhoms: string[]; nhomLabels: string[]; sanPham: string[];
  capability: string; capability2: string; bestTier: CnclTier; favorsRtr: boolean;
  sources: CnclSource[]; tim: string; evidence: CnclEvidence[];
};
export type CnclNeed = {
  id: string; entityId: string; value: string; span: string;
  tier: CnclTier; source: string; href: string; chinhThuc: boolean; tim: string;
};

export type CnclChuoiCong = {
  luc: string; cheDo: string; tong: number; xanh: number; do: number;
  khongChay: number; hoan: number; dat: boolean;
};
export type CnclMeta = {
  units: number; claims: number; needs: number; sources: number; snapshots: number;
  tierA: number; tierB: number; nhomPhu: number; generatedAt: string; frame: string;
  gate: string; chuoiCong: CnclChuoiCong | null;
};

export const cnclMeta: CnclMeta = ${JSON.stringify(meta, null, 2)};

export const cnclUnits: CnclUnit[] = ${JSON.stringify(units, null, 2)};

export const cnclNeeds: CnclNeed[] = ${JSON.stringify(needs, null, 2)};
`, 'utf8');

const matchMetaObj = {
  daKy: webMatches.length,
  tuChoi: tuChoi.length,
  tongChay: matches.length,
  rule: [...new Set(webMatches.map((m) => m.rule))].join(', '),
  nguoiKy: [...new Set(webMatches.map((m) => m.signoff.by))].join(', '),
  generatedAt: NOW,
  congThuc,
};

writeFileSync(join(TOUCH, 'lib', 'cncl-match.ts'), banner('CaoLocMatch/out/matches.jsonl + signoff_ledger.jsonl') + `
import type { CnclTier } from './cncl-registry';

export type MatchEvidence = {
  field: string; value: string; span: string; tier: CnclTier;
  extraction: string; source: string; href: string;
};
export type SignedMatch = {
  id: string; score: number; rule: string; engine: string;
  demandId: string; supplyId: string;
  nhomCau: number | null; nhomCung: number[]; quaChuoiGiaTri: boolean; tokenGiao: string[];
  tokenCau: string[];
  canhChuoi: { tu: number; den: number; lyDo: string; trangThai: string } | null;
  signoff: { by: string; role: string; date: string };
  khoaBangChung: string | null;
  chuaDuyet: string[];
  soChuoi: number;
  demandEvidence: MatchEvidence[]; supplyEvidence: MatchEvidence[];
  unverified: string[];
};
export type RejectedPair = {
  demandId: string; supplyId: string; by: string; date: string; lyDo: string;
};

export const matchMeta = ${JSON.stringify(matchMetaObj, null, 2)} as const;

export const signedMatches: SignedMatch[] = ${JSON.stringify(webMatches, null, 2)};

export const rejectedPairs: RejectedPair[] = ${JSON.stringify(tuChoi, null, 2)};
`, 'utf8');

// ── BAN JSON SONG SINH ──────────────────────────────────────────────────────
// VI SAO (25/08/2026): bon script khac dang boc mang cnclUnits ra khoi file .ts BANG REGEX,
// tuc doan ranh gioi cua mot cau truc bang mat chu. Cung dang loi vua bat duoc o
// check_ap_luat_deu.py va check_do_tuoi.py: doc file cau truc bang regex thi co the XANH HON
// CA PARSER, vi regex van rut duoc mot manh hop le tu mot file da hong.
//
// Go nguyen nhan chu khong va quanh: sinh luon mot ban JSON thuan canh ban .ts. Ai can du
// lieu thi JSON.parse, khong ai phai doan ranh gioi nua. Ban .ts van giu vi Next can kieu
// TypeScript, nhung no thoi la nguon DOC cua cac cong.
//
// Hai ban phai LUON KHOP. Cong check-lib-song-sinh.mjs canh dieu do.
writeFileSync(join(TOUCH, 'lib', 'cncl-registry.json'),
  JSON.stringify({ meta, units, needs }, null, 2) + '\n', 'utf8');
writeFileSync(join(TOUCH, 'lib', 'cncl-match.json'),
  JSON.stringify({ matchMeta: matchMetaObj, signedMatches: webMatches, rejectedPairs: tuChoi }, null, 2) + '\n', 'utf8');

// ── PHIEU GHEP (them 30/09/2026) ────────────────────────────────────────────
// CaoLocMatch/pheu_matching.py dem engine da loc bao nhieu cap va vi sao, doi chieu voi chinh
// make_matches_v2 (lech la no fail). O day chi CHEP sang web, khong tinh lai, khong lam tron.
// Thieu file la FAIL: man Matching khong duoc hien mot phieu cu hay bia.
{
  const pPheu = join(CLM, 'out', 'pheu.json');
  if (!existsSync(pPheu)) {
    console.error(`FAIL: thieu ${pPheu}. Chay python3 pheu_matching.py trong CaoLocMatch sau match_engine.py run.`);
    process.exit(2);
  }
  const pheu = JSON.parse(readFileSync(pPheu, 'utf8'));
  writeFileSync(join(TOUCH, 'lib', 'hub-pheu.json'), JSON.stringify({ ...pheu, generatedAt: NOW }, null, 2) + '\n', 'utf8');
}

console.log(`REGISTRY: ${meta.units} don vi · ${meta.claims} claim · ${meta.needs} nhu cau · tier A ${meta.tierA}`);
console.log(`MATCH   : ${webMatches.length} da ky / ${matches.length} chay ra · ${tuChoi.length} bi tu choi`);
if (webMatches.length !== matches.length) {
  console.log(`  luu y: ${matches.length - webMatches.length} match chua ky KHONG duoc dua len web.`);
}
