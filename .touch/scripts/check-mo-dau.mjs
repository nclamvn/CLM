#!/usr/bin/env node
/**
 * check-mo-dau.mjs · Trang mo dau M0 (/dashboard) chi duoc noi so SINH tu du lieu, va kho so go tay
 * khong duoc quay lai.
 *
 * VI SAO CO (29/09/2026): trang Tong quan cu doc lib/project-status.ts, mot anh chup tay ngay
 * 19/07/2026: "14 don vi", "64 claim", "Gates 4/4", "DEADLINE 20/07 (NGAY MAI)", va HANG VIEC NOI
 * BO co ten nguoi. Cong so_sinh khong bat vi no chi tim mau "N o xanh". Trang do la man MAC DINH
 * cua dashboard: dieu nha dau tu thay dau tien la so sai hai thang tuoi.
 *
 * HAI LOP:
 *   A. MO_DAU_LECH: tinh lai lib/mo-dau.mjs tu cac file hub da sinh, so voi lib/hub-mo-dau.json.
 *   B. Doc lap:
 *      SO_LECH         so chinh khac dem truc tiep (registry, match, do thi, ket qua chuoi cong)
 *      CUA_LECH        cua vao man tro toi duong khong co trang, hoac khong co tren thanh ben
 *      SO_CU_QUAY_LAI  lib/project-status.ts xuat thu gi ngoai nav va statusMeta, hoac statusMeta co so
 *      NHAP_SO_CU      trang mo dau hoac component cua no nhap lib/project-status
 *      HANG_VIEC_NOI_BO ma nguon giao dien con ten kho viec noi bo (workQueue, deadline, projectComponents)
 *      NHOM_LECH       bang phu theo nhom khong cong lai dung tong nhu cau / nhu cau trong
 *      CHAT_LUONG_LECH thanh chat luong lech dem truc tiep (registry, match, do thi), hoac tu > mau
 *      VIEC_LECH       viec tiep tro toi trang khong co, viec so 0 van hien, hoac diem yeu > 0 ma mat viec
 *
 * Chay: node scripts/check-mo-dau.mjs [--touch <dir .touch>] [--mo-dun <mo-dau.mjs>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const TOUCH = resolve(arg('--touch') || join(HERE, '..'));
const MO_DUN = resolve(arg('--mo-dun') || join(HERE, '..', 'lib', 'mo-dau.mjs'));
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
const doc = (p) => { if (!existsSync(p)) thoat3(`thieu ${p}`); return readFileSync(p, 'utf8'); };
const dj = (ten) => JSON.parse(doc(join(TOUCH, 'lib', ten)));
const MD = dj('hub-mo-dau.json'); const reg = dj('cncl-registry.json'); const mat = dj('cncl-match.json');
const graph = dj('hub-graph.json'); const thiTruong = dj('hub-thi-truong.json'); const thoiCuoc = dj('hub-thoi-cuoc.json');
const hoSo = dj('hub-ho-so.json'); const matching = dj('hub-matching.json');
const { dungMoDau } = await import(pathToFileURL(MO_DUN).href);

const vi = [];
if (JSON.stringify(dungMoDau({ reg, mat, graph, thiTruong, thoiCuoc, hoSo, matching })) !== JSON.stringify(MD)) vi.push('MO_DAU_LECH: hub-mo-dau.json khac ban tinh lai');

// ── So chinh, dem doc lap ───────────────────────────────────────────────────
const claims = reg.units.flatMap((u) => u.evidence);
const coCung = new Set(graph.edges.filter((e) => e.kind === 'cung_san_pham' || e.kind === 'match_da_ky').map((e) => e.target));
const ncTrong = graph.nodes.filter((n) => n.kind === 'nhu_cau' && !coCung.has(n.id)).length;
const that = { donVi: reg.units.length, cauNguon: claims.length, tierA: claims.filter((e) => e.tier === 'A').length, matchDaKy: mat.signedMatches.length, tuChoi: mat.rejectedPairs.length, nhuCau: reg.needs.length, ncTrong };
for (const [k, v] of Object.entries(that)) if (MD.so?.[k] !== v) vi.push(`SO_LECH: ${k} trang ghi ${MD.so?.[k]}, dem truc tiep ${v}`);
const cc = reg.meta.chuoiCong;
if (cc && (!MD.chuoiCong || MD.chuoiCong.xanh !== cc.xanh || MD.chuoiCong.tong !== cc.tong || MD.chuoiCong.dat !== cc.dat)) vi.push(`SO_LECH: chuoi cong trang ghi ${JSON.stringify(MD.chuoiCong)}, meta ${cc.xanh}/${cc.tong}`);
if (!cc && MD.chuoiCong) vi.push('SO_LECH: trang ghi ket qua chuoi cong ma meta khong co');

// ── Nhom, thanh chat luong, viec tiep (01/10/2026) ─────────────────────────
const nh = MD.nhom ?? [];
if (nh.length !== 10) vi.push(`NHOM_LECH: ${nh.length} nhom, phai 10`);
if (nh.reduce((s, g) => s + g.soNc, 0) !== reg.needs.length) vi.push(`NHOM_LECH: tong nhu cau theo nhom ${nh.reduce((s, g) => s + g.soNc, 0)}, registry ${reg.needs.length}`);
if (nh.reduce((s, g) => s + g.trong, 0) !== ncTrong) vi.push(`NHOM_LECH: tong nhu cau trong theo nhom ${nh.reduce((s, g) => s + g.trong, 0)}, do thi ${ncTrong}`);
const daKyNc = new Set(mat.signedMatches.map((m) => m.demandId)).size;
const thatCL = { coCung: [reg.needs.length - ncTrong, reg.needs.length], daKy: [daKyNc, reg.needs.length], hangA: [that.tierA, claims.length] };
for (const c of MD.chatLuong ?? []) {
  if (!(c.tu >= 0 && c.tu <= c.mau)) vi.push(`CHAT_LUONG_LECH: ${c.k} ${c.tu}/${c.mau}`);
  const t = thatCL[c.k];
  if (t && (c.tu !== t[0] || c.mau !== t[1])) vi.push(`CHAT_LUONG_LECH: ${c.k} trang ghi ${c.tu}/${c.mau}, dem truc tiep ${t[0]}/${t[1]}`);
  if (c.k === 'conHan' && c.mau !== claims.length) vi.push(`CHAT_LUONG_LECH: conHan mau ${c.mau}, registry ${claims.length} cau nguon`);
  if (c.k === 'dinhDanh' && c.mau !== reg.units.length) vi.push(`CHAT_LUONG_LECH: dinhDanh mau ${c.mau}, registry ${reg.units.length} don vi`);
}
if ((MD.chatLuong ?? []).length !== 5) vi.push(`CHAT_LUONG_LECH: ${(MD.chatLuong ?? []).length} thanh, phai 5`);
for (const v of MD.viecTiep ?? []) {
  if (!(v.so > 0)) vi.push(`VIEC_LECH: viec "${v.viec}" so ${v.so} van hien`);
  if (!existsSync(join(TOUCH, 'app', ...v.href.replace(/^\//, '').split('/'), 'page.tsx'))) vi.push(`VIEC_LECH: ${v.href} khong co trang`);
}
const coViec = (href) => (MD.viecTiep ?? []).some((v) => v.href === href);
if (MD.diemYeu?.chuaDinhDanh > 0 && !coViec('/dashboard/don-vi')) vi.push('VIEC_LECH: con don vi chua dinh danh ma mat viec dinh danh');
if (ncTrong > 0 && !coViec('/dashboard/thi-truong')) vi.push('VIEC_LECH: con nhu cau trong ma mat viec tim ben cung');

// ── Cua vao man ─────────────────────────────────────────────────────────────
const ps = doc(join(TOUCH, 'lib', 'project-status.ts'));
const navHref = [...ps.matchAll(/href:\s*'([^']*)'/g)].map((m) => m[1]).filter(Boolean);
for (const c of MD.cua ?? []) {
  const trang = join(TOUCH, 'app', ...c.href.replace(/^\//, '').split('/'), 'page.tsx');
  if (!existsSync(trang)) vi.push(`CUA_LECH: ${c.href} khong co trang`);
  if (!navHref.includes(c.href)) vi.push(`CUA_LECH: ${c.href} khong co tren thanh ben`);
}

// ── Kho so go tay khong duoc quay lai ───────────────────────────────────────
const xuat = [...ps.matchAll(/^export\s+(?:const|function|let|var|type|interface)\s+(\w+)/gm)].map((m) => m[1]);
const thua = xuat.filter((x) => !['nav', 'statusMeta'].includes(x));
if (thua.length) vi.push(`SO_CU_QUAY_LAI: lib/project-status.ts xuat ${thua.join(', ')} (chi duoc nav, statusMeta)`);
const sm = (ps.match(/export const statusMeta = \{([\s\S]*?)\}/) || [])[1] ?? '';
if (/\d/.test(sm)) vi.push('SO_CU_QUAY_LAI: statusMeta chua chu so (ngay hoac so go tay)');
for (const f of [join(TOUCH, 'app', 'dashboard', 'page.tsx'), join(TOUCH, 'components', 'modau', 'MoDau.tsx')]) {
  if (/project-status/.test(doc(f))) vi.push(`NHAP_SO_CU: ${f.replace(TOUCH, '.touch')} nhap lib/project-status`);
}
const quet = (d, ds = []) => {
  if (!existsSync(d)) return ds;
  for (const t of readdirSync(d)) {
    const p = join(d, t);
    if (t === 'node_modules' || t.startsWith('.')) continue;
    if (statSync(p).isDirectory()) quet(p, ds); else if (/\.(tsx?|mjs)$/.test(t)) ds.push(p);
  }
  return ds;
};
for (const f of [...quet(join(TOUCH, 'app')), ...quet(join(TOUCH, 'components')), join(TOUCH, 'lib', 'project-status.ts')]) {
  readFileSync(f, 'utf8').split('\n').forEach((l, i) => {
    if (/^\s*(\/\/|\*|\/\*)/.test(l)) return;
    if (/\b(workQueue|projectComponents|deadline)\b/.test(l)) vi.push(`HANG_VIEC_NOI_BO: ${f.replace(TOUCH, '.touch')}:${i + 1}`);
  });
}

console.log(`so: ${MD.so?.donVi} don vi · ${MD.so?.cauNguon} cau nguon · ${MD.so?.matchDaKy} match · ${MD.so?.ncTrong}/${MD.so?.nhuCau} trong · cua ${MD.cua?.length}`);
if (vi.length) {
  console.log(`\nFAIL: ${vi.length} vi pham`);
  vi.slice(0, 30).forEach((v) => console.log('  ' + v));
  process.exit(2);
}
console.log('\nOK: trang mo dau chi noi so sinh tu du lieu; kho so go tay va hang viec noi bo khong quay lai.');
