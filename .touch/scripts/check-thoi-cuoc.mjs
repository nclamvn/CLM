#!/usr/bin/env node
/**
 * check-thoi-cuoc.mjs · Man M5 "Dong thoi cuoc": moi moc thoi gian phai dung ngay NGUON viet.
 *
 * VI SAO CO (29/09/2026): tam ban chup chieu cau mang hau to ngay CHUP 18/07/2026. Mot dong thoi
 * gian doc ngay tu ten file se dat ca QD 21/2026 vao 18/07/2026, sai hai thang ruoi ma nhin rat
 * that. Cung ngay lo ra claim CNCL-META-01 ghi ngay ky 30/04/2026 ma span cua no khong chua ngay.
 * Cong nay bat ca hai the loai: ngay phai NAM NGUYEN VAN trong cau nguon.
 *
 * HAI LOP:
 *   A. THOI_CUOC_LECH: tinh lai lib/thoi-cuoc.mjs, so voi lib/hub-thoi-cuoc.json.
 *   B. Doc lap:
 *      SPAN_BIA          cau nguon cua su kien chinh sach khong co nguyen van trong ban chup (bo dong
 *                        tieu de "# " cua nguoi chup), hoac ban chup khong co tren /evidence
 *      NGAY_KHONG_TRONG_SPAN  ngay su kien khong xuat hien (d/m/yyyy, dd/mm/yyyy) trong it nhat mot span
 *      NGAY_CHUP_LAM_NGAY_DANG ngay su kien chinh sach trung ngay chup ma span khong chua ngay do
 *      DON_VI_LECH       so su kien tin don vi != so ban chup nguon chieu cung; ngay != hau to ban chup
 *      QUYET_DINH_LECH   so ky/tu choi hoac ngay khac so ky tren web
 *      DE_XUAT_THANH_SU_THAT  de xuat vong tu chay mang trang thai khac cho_duyet
 *      TUONG_LAI         su kien sau moc do
 *      MAT_DO_LECH       tong mat do theo thang != so su kien
 *
 * Chay: node scripts/check-thoi-cuoc.mjs [--lib <dir>] [--dem <Dataset_CongNgheChienLuoc>] [--public <dir>] [--mo-dun <thoi-cuoc.mjs>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { goc } from './goc.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const LIB = arg('--lib') || join(HERE, '..', 'lib');
const DEM = arg('--dem') || process.env.CLM_KHO_DEM || goc('Dataset_CongNgheChienLuoc');
const PUB = arg('--public') || join(HERE, '..', 'public');
const MO_DUN = resolve(arg('--mo-dun') || join(HERE, '..', 'lib', 'thoi-cuoc.mjs'));
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
const doc = (p) => { if (!existsSync(p)) thoat3(`thieu ${p}`); return readFileSync(p, 'utf8'); };
const dj = (ten) => JSON.parse(doc(join(LIB, ten)));
if (!DEM) thoat3('khong thay Dataset_CongNgheChienLuoc');
const T = dj('hub-thoi-cuoc.json'); const reg = dj('cncl-registry.json'); const mat = dj('cncl-match.json');
const ev = dj('hub-events.json'); const hoSo = dj('hub-ho-so.json'); const graph = dj('hub-graph.json');
const suKien = doc(join(DEM, 'su_kien_chinh_sach.jsonl')).split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l));
if (!T.suKien?.length) thoat3('hub-thoi-cuoc.json khong co su kien. Rong khong phai sach.');
const { dungThoiCuoc } = await import(pathToFileURL(MO_DUN).href);

const vi = [];
if (JSON.stringify(dungThoiCuoc({ reg, mat, ev, hoSo, graph, suKienChinhSach: suKien })) !== JSON.stringify(T)) vi.push('THOI_CUOC_LECH: file sinh khac ban tinh lai');

// ── Chinh sach: span nguyen van + ngay trong span ──────────────────────────
const bienThe = (iso) => {
  const [y, m, d] = iso.split('-').map(Number);
  return [`${d}/${m}/${y}`, `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`, `${d}/${String(m).padStart(2, '0')}/${y}`, `${String(d).padStart(2, '0')}/${m}/${y}`];
};
const cs = T.suKien.filter((e) => e.lan === 'chinh_sach');
if (cs.length !== suKien.length) vi.push(`SPAN_BIA: web co ${cs.length} su kien chinh sach, file nguon co ${suKien.length}`);
for (const e of suKien) {
  const w = cs.find((x) => x.id === e.id);
  if (!w || w.ngay !== e.ngay) vi.push(`SPAN_BIA: ${e.id} tren web ${w?.ngay ?? 'thieu'} khac file nguon ${e.ngay}`);
  let coNgay = false;
  for (const b of e.bang_chung) {
    const p = join(DEM, 'snapshots', b.snapshot);
    const than = existsSync(p) ? readFileSync(p, 'utf8').split('\n').filter((l) => !l.startsWith('# ')).join('\n') : null;
    if (than === null) { vi.push(`SPAN_BIA: ${e.id} thieu ban chup ${b.snapshot}`); continue; }
    if (!than.includes(b.evidence_span)) vi.push(`SPAN_BIA: ${e.id} cau nguon khong co nguyen van trong than ban chup ${b.snapshot}`);
    if (!existsSync(join(PUB, 'evidence', b.snapshot.replace(/\.(html|md)$/, '.txt')))) vi.push(`SPAN_BIA: ${e.id} ban chup ${b.snapshot} chua len /evidence`);
    if (bienThe(e.ngay).some((v) => b.evidence_span.includes(v))) coNgay = true;
    const chup = (b.snapshot.match(/_(\d{4})(\d{2})(\d{2})\./) || []).slice(1).join('-');
    if (chup && e.ngay === chup && !bienThe(chup).some((v) => b.evidence_span.includes(v))) vi.push(`NGAY_CHUP_LAM_NGAY_DANG: ${e.id} lay ngay chup ${chup} lam ngay su kien`);
  }
  if (!coNgay) vi.push(`NGAY_KHONG_TRONG_SPAN: ${e.id} ngay ${e.ngay} khong co nguyen van trong cau nguon nao`);
}

// ── Tin don vi ──────────────────────────────────────────────────────────────
// Truong dinh danh (ten phap nhan, ma so) khong phai tin: ban chup cua chung mang ngay quan sat.
// Liet ke lai o day, khong nhap tu lib/ho-so.mjs, de cong dem doc lap voi ham sinh.
const DINH_DANH = new Set(['ten_phap_nhan', 'ma_so_tu_khai', 'ma_so_thue']);
const hrefs = new Set(reg.units.flatMap((u) => u.evidence.filter((x) => !DINH_DANH.has(x.field)).map((x) => x.href)));
const dv = T.suKien.filter((e) => e.lan === 'don_vi');
if (dv.length !== hrefs.size) vi.push(`DON_VI_LECH: ${dv.length} su kien tin don vi, registry co ${hrefs.size} ban chup`);
for (const e of dv) {
  const m = String(e.href).match(/_(\d{4})(\d{2})(\d{2})\.txt$/);
  if (!m || e.ngay !== `${m[1]}-${m[2]}-${m[3]}`) vi.push(`DON_VI_LECH: ${e.id} ngay ${e.ngay} khac hau to ban chup`);
  const that = reg.units.filter((u) => u.evidence.some((x) => x.href === e.href)).map((u) => u.name).sort();
  if (JSON.stringify(that) !== JSON.stringify(e.donVi.map((d) => d.ten).sort())) vi.push(`DON_VI_LECH: ${e.id} danh sach don vi khac registry`);
}

// ── Quyet dinh, de xuat ─────────────────────────────────────────────────────
const qd = T.suKien.filter((e) => e.lan === 'quyet_dinh');
if (qd.length !== mat.signedMatches.length + mat.rejectedPairs.length) vi.push(`QUYET_DINH_LECH: ${qd.length} su kien, so ky co ${mat.signedMatches.length} ky + ${mat.rejectedPairs.length} tu choi`);
for (const m of mat.signedMatches) {
  const e = qd.find((x) => x.matchId === m.id);
  if (!e || e.ngay !== m.signoff.date || e.trangThai !== 'da_ky') vi.push(`QUYET_DINH_LECH: ${m.id} ${e ? e.ngay : 'thieu'} khac so ky ${m.signoff.date}`);
}
const dx = T.suKien.filter((e) => e.lan === 'de_xuat');
if (dx.length !== ev.events.filter((x) => x.kind === 'de_xuat_vong_tu_chay').length) vi.push('DE_XUAT_THANH_SU_THAT: so de xuat khac hang cho');
for (const e of dx) if (e.trangThai !== 'cho_duyet') vi.push(`DE_XUAT_THANH_SU_THAT: ${e.id} mang trang thai ${e.trangThai}`);
for (const e of T.suKien) if (e.trangThai === 'cho_duyet' && e.lan !== 'de_xuat') vi.push(`DE_XUAT_THANH_SU_THAT: ${e.id} cho duyet nam ngoai lan de xuat`);

for (const e of T.suKien) if (e.ngay > reg.meta.generatedAt) vi.push(`TUONG_LAI: ${e.id} ngay ${e.ngay} sau moc ${reg.meta.generatedAt}`);
const tongMd = T.matDo.reduce((s, m) => s + m.chinh_sach + m.don_vi + m.quyet_dinh + m.de_xuat, 0);
if (tongMd !== T.suKien.length) vi.push(`MAT_DO_LECH: mat do cong ${tongMd}, co ${T.suKien.length} su kien`);

console.log(`su kien: ${T.suKien.length} (chinh sach ${cs.length}, don vi ${dv.length}, quyet dinh ${qd.length}, de xuat ${dx.length}) · ${T.meta.tu} -> ${T.meta.den}`);
if (vi.length) {
  console.log(`\nFAIL: ${vi.length} vi pham`);
  vi.slice(0, 30).forEach((v) => console.log('  ' + v));
  process.exit(2);
}
console.log('\nOK: moi moc thoi gian dung ngay nguon viet, cau nguon nguyen van, de xuat chua bao gio thanh su that.');
