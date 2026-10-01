#!/usr/bin/env node
/**
 * check-hoi-dap.mjs · Man Hoi dap co nguon chi duoc tra loi bang CAU NGUON THAT, va phai biet
 * tu choi.
 *
 * VI SAO CO (01/10/2026): mot man "hoi gi cung tra loi" la duong ngan nhat de san pham noi sai
 * ma van trong dang tin. Cong nay giu ba loi hua cua man do: (1) moi dong tra loi la cau nguon
 * nguyen van cua dung don vi do trong so nguon; (2) dong do that su noi ve dieu duoc hoi; (3) hoi
 * ngoai pham vi thi tu choi, khong tra bua.
 *
 * CONG KIEM:
 *   CHI_MUC_LECH    lib/hub-hoi-dap.json khac ban tinh lai tu registry + match.
 *   TRICH_BIA       mot dong trich khong trung NGUYEN VAN cau nguon nang luc cua don vi do.
 *   TRICH_LAC_DE    mot dong trich khong chua khai niem nao cua cau hoi (khop dau tu, bo dau).
 *   TU_CHOI_SAI     co don vi ma van ghi tu choi, hoac khong don vi nao ma khong tu choi.
 *   KHONG_TU_CHOI   cau trong bo chuan danh dau phai tu choi ma may van tra loi.
 *   CAU_CHUAN_HONG  cau trong bo chuan thieu don vi bat buoc.
 *   DON_VI_LA       don vi trong cau tra loi khong co trong registry.
 *
 * Chay: node scripts/check-hoi-dap.mjs [--lib <dir>] [--mo-dun <hoi-dap.mjs>] [--chuan <json>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { khoaTim } from '../lib/tim-kiem.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const LIB = resolve(arg('--lib') || join(HERE, '..', 'lib'));
const MO_DUN = resolve(arg('--mo-dun') || join(HERE, '..', 'lib', 'hoi-dap.mjs'));
const CHUAN = resolve(arg('--chuan') || join(HERE, 'hoi_dap_chuan.json'));
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
const dj = (p) => { if (!existsSync(p)) thoat3(`thieu ${p}`); return JSON.parse(readFileSync(p, 'utf8')); };

const reg = dj(join(LIB, 'cncl-registry.json'));
const mat = dj(join(LIB, 'cncl-match.json'));
const cm = dj(join(LIB, 'hub-hoi-dap.json'));
const chuan = dj(CHUAN).cau;
if (!Array.isArray(chuan) || !chuan.length) thoat3('bo cau hoi chuan rong. Rong khong phai sach.');
const { hoiDap, dungChiMuc, TRUONG_NANG_LUC, DONG_NGHIA } = await import(pathToFileURL(MO_DUN).href);

const vi = [];
if (JSON.stringify(dungChiMuc(reg, mat)) !== JSON.stringify(cm)) vi.push('CHI_MUC_LECH: hub-hoi-dap.json khac ban tinh lai tu registry + match');

const byTen = new Map(reg.units.map((u) => [u.name, u]));
// Bang dong nghia doc LAI tu chinh module de biet "uav" con viet la "drone"; cong khong tu bia them.
const cachViet = (kn) => (DONG_NGHIA.find((c) => c[0] === kn) ?? [kn]);
const khop = (span, kn) => {
  const k = ` ${khoaTim(span).replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ')} `;
  return cachViet(kn).some((c) => k.includes(` ${c}`));
};

let soCau = 0; let soTrich = 0;
for (const c of chuan) {
  const r = hoiDap(c.cau, cm);
  soCau++;
  if (r.donVi.length && r.tuChoi) vi.push(`TU_CHOI_SAI: "${c.cau}" co ${r.donVi.length} don vi ma van ghi tu choi`);
  if (!r.donVi.length && !r.tuChoi) vi.push(`TU_CHOI_SAI: "${c.cau}" khong co don vi nao ma khong tu choi`);
  if (c.phai_tu_choi && r.donVi.length) vi.push(`KHONG_TU_CHOI: "${c.cau}" phai tu choi ma tra ${r.donVi.length} don vi (${r.donVi.slice(0, 3).map((d) => d.dv).join(', ')})`);
  for (const ten of c.phai_co ?? []) if (!r.donVi.some((d) => d.dv === ten)) vi.push(`CAU_CHUAN_HONG: "${c.cau}" thieu ${ten}`);
  for (const d of r.donVi) {
    const u = byTen.get(d.dv);
    if (!u) { vi.push(`DON_VI_LA: "${c.cau}" tra ${d.dv}`); continue; }
    for (const t of d.trich) {
      soTrich++;
      const that = u.evidence.find((e) => e.span === t.span && TRUONG_NANG_LUC.includes(e.field));
      if (!that) vi.push(`TRICH_BIA: "${c.cau}" · ${d.dv}: "${String(t.span).slice(0, 60)}" khong la cau nguon nang luc cua don vi`);
      else if (that.href !== t.href) vi.push(`TRICH_BIA: "${c.cau}" · ${d.dv}: ban chup ${t.href} khac ${that.href}`);
      if (!r.khaiNiem.some((kn) => khop(t.span, kn))) vi.push(`TRICH_LAC_DE: "${c.cau}" · ${d.dv}: cau trich khong chua khai niem nao (${r.khaiNiem.join(', ')})`);
    }
  }
}

console.log(`hoi dap: ${soCau} cau chuan · ${soTrich} dong trich da soi · chi muc ${cm.taiLieu.length} cau nguon`);
if (vi.length) {
  console.log(`\nFAIL: ${vi.length} vi pham`);
  vi.slice(0, 40).forEach((v) => console.log('  ' + v));
  process.exit(2);
}
console.log('\nOK: moi dong tra loi la cau nguon nguyen van dung don vi, dung de; cau ngoai pham vi deu bi tu choi.');
