#!/usr/bin/env node
/**
 * check-cau-that.mjs · Man Cau that chi duoc noi dieu so nguon chung minh duoc.
 *
 * VI SAO CO (01/10/2026): man nay dua nhu cau dat hang that (lo 03) toi nha dau tu va doi tac,
 * kem goi y don vi co the dap ung. Hai cach sai nguy hiem nhat: (1) mot goi y khong co cau nguon
 * nang luc that sau no, (2) mot goi y tu nhan la "da ky" ma so ky khong co. Ca hai bien mot goi y
 * cua may thanh mot loi cam ket.
 *
 * CONG KIEM:
 *   CAU_THAT_LECH       lib/hub-cau-that.json khac ban tinh lai bang lib/cau-that.mjs.
 *   SO_LECH             so nhu cau, so theo loai, so ben dat hang khac phep dem DOC LAP tren
 *                       lib/cncl-cau-dat-hang.json.
 *   NGUON_LECH          danh sach cau nguon cua mot nhu cau khac cac claim cua no trong domain.
 *   GOI_Y_KHONG_NGUON   cau trich cua mot goi y khong nam trong evidence cua chinh don vi do trong
 *                       lib/cncl-registry.json (tra doc lap, khong qua chi muc hoi dap).
 *   KY_GIA              goi y ghi da ky ma so ky (lib/cncl-match.json) khong co cap do cho don vi do.
 *   GOI_Y_RONG          goi y khong co ca cau trich lan cap da ky: khong co ly do nao de hien.
 *   BAN_CHUP_THIEU      cau nguon tro toi ban chup khong co tren /evidence.
 *   NHAN_THIEU          giao dien khong noi ro goi y "chưa ký" va "không phải cặp ghép".
 *
 * Chay: node scripts/check-cau-that.mjs [--lib <dir>] [--public <dir>] [--mo-dun <cau-that.mjs>] [--giao-dien <tsx>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { hoiDap, DONG_NGHIA } from '../lib/hoi-dap.mjs';
import { dungTenSp } from '../lib/hien-gia-tri.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const LIB = resolve(arg('--lib') || join(TOUCH, 'lib'));
const PUB = resolve(arg('--public') || join(TOUCH, 'public'));
const MO_DUN = resolve(arg('--mo-dun') || join(TOUCH, 'lib', 'cau-that.mjs'));
const GD = resolve(arg('--giao-dien') || join(TOUCH, 'components', 'cauthat', 'CauThat.tsx'));
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
const dj = (f) => { const p = join(LIB, f); if (!existsSync(p)) thoat3(`thieu ${p}`); return JSON.parse(readFileSync(p, 'utf8')); };
const ct = dj('hub-cau-that.json'); const dh = dj('cncl-cau-dat-hang.json'); const reg = dj('cncl-registry.json');
const mat = dj('cncl-match.json'); const cm = dj('hub-hoi-dap.json');
if (!existsSync(MO_DUN)) thoat3(`thieu ${MO_DUN}`);
const { dungCauThat } = await import(pathToFileURL(MO_DUN).href + '?t=' + Date.now());

const vi = [];
const lai = dungCauThat(dh, cm, dungTenSp(reg.needs), hoiDap, DONG_NGHIA);
if (JSON.stringify(lai) !== JSON.stringify(ct)) vi.push('CAU_THAT_LECH: hub-cau-that.json khac ban tinh lai tu cncl-cau-dat-hang + chi muc hoi dap');

// Dem doc lap tren claim tho.
const ma = new Map();
for (const c of dh.claims) { if (!ma.has(c.ma)) ma.set(c.ma, []); ma.get(c.ma).push(c); }
const giaTri = (cs, f) => cs.find((c) => c.field === f)?.value;
const loaiDem = {};
for (const cs of ma.values()) { const l = giaTri(cs, 'loai_dat_hang'); loaiDem[l] = (loaiDem[l] ?? 0) + 1; }
if (ct.meta.soNhuCau !== ma.size) vi.push(`SO_LECH: so nhu cau ghi ${ct.meta.soNhuCau}, dem doc lap ${ma.size}`);
for (const [l, n] of Object.entries(loaiDem)) if ((ct.meta.theoLoai[l] ?? 0) !== n) vi.push(`SO_LECH: loai ${l} ghi ${ct.meta.theoLoai[l] ?? 0}, dem doc lap ${n}`);
const ben = new Set([...ma.values()].map((cs) => giaTri(cs, 'ben_dat_hang')));
if (ct.meta.soBenDatHang !== ben.size) vi.push(`SO_LECH: so ben dat hang ghi ${ct.meta.soBenDatHang}, dem doc lap ${ben.size}`);

const evCua = new Map(reg.units.map((u) => [u.name, new Set(u.evidence.map((e) => `${e.href}\u0000${e.span}`))]));
const kyCua = new Set(mat.signedMatches.map((m) => `${m.id}\u0000${m.supplyId}`));
for (const n of ct.nhuCau) {
  const goc = ma.get(n.ma) ?? [];
  if (goc.length !== n.nguon.length || !goc.every((c) => n.nguon.some((x) => x.field === c.field && x.span === c.span && x.href === c.href)))
    vi.push(`NGUON_LECH: ${n.ma} hien ${n.nguon.length} cau nguon, domain co ${goc.length}`);
  for (const x of n.nguon) if (!existsSync(join(PUB, x.href))) vi.push(`BAN_CHUP_THIEU: ${n.ma} · ${x.href}`);
  for (const g of n.goiY) {
    if (g.trich && !evCua.get(g.dv)?.has(`${g.trich.href}\u0000${g.trich.span}`)) vi.push(`GOI_Y_KHONG_NGUON: ${n.ma} · ${g.dv} trich cau khong co trong evidence cua don vi`);
    for (const m of g.kyCho) if (!kyCua.has(`${m}\u0000${g.dv}`)) vi.push(`KY_GIA: ${n.ma} · ${g.dv} ghi da ky ${m} ma so ky khong co`);
    if (!g.trich && !g.kyCho.length) vi.push(`GOI_Y_RONG: ${n.ma} · ${g.dv}`);
  }
}

if (!existsSync(GD)) vi.push(`NHAN_THIEU: khong thay giao dien ${GD}`);
else {
  const s = readFileSync(GD, 'utf8');
  for (const tu of ['chưa ký', 'không phải cặp ghép']) if (!s.includes(tu)) vi.push(`NHAN_THIEU: giao dien khong co chu "${tu}"`);
}

console.log(`cau that: ${ct.meta.soNhuCau} nhu cau · ${ct.meta.soBenDatHang} ben dat hang · ${ct.meta.coGoiY} co goi y don vi · ${ct.nhuCau.reduce((s, n) => s + n.goiY.length, 0)} goi y`);
if (vi.length) { console.log(`\nFAIL: ${vi.length} vi pham`); vi.slice(0, 30).forEach((v) => console.log('  ' + v)); process.exit(2); }
console.log('\nOK: moi nhu cau khop domain da duyet, moi goi y co cau nguon that cua chinh don vi, khong goi y nao tu nhan da ky.');
