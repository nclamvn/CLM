#!/usr/bin/env node
/**
 * check-bao-cao.mjs · Bao cao khoang trong chi duoc noi so sinh tu du lieu, va so do phai khop
 * mot phep dem DOC LAP tu registry, match va do thi.
 *
 * VI SAO CO (01/10/2026): bao cao la thu se roi khoi san pham (in, gui PDF cho co quan, quy dau
 * tu). Mot con so sai trong bao cao di xa hon mot con so sai tren man hinh.
 *
 * CONG KIEM:
 *   BAO_CAO_LECH  lib/hub-bao-cao.json khac ban tinh lai bang lib/bao-cao.mjs.
 *   SO_LECH       tong, da ky, trong, mot nguon khac phep dem doc lap:
 *                   tong   = so nhu cau trong registry;
 *                   da ky  = so nhu cau co it nhat mot match da ky (cncl-match);
 *                   trong  = so nhu cau khong co canh cung nao (hub-graph);
 *                   mong   = so nhu cau co dung mot don vi cung khac nhau (hub-graph).
 *   KY_SAI        ky bao cao khong dung quy cua ngay moc du lieu.
 *
 * Chay: node scripts/check-bao-cao.mjs [--lib <dir>] [--mo-dun <bao-cao.mjs>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const LIB = resolve(arg('--lib') || join(HERE, '..', 'lib'));
const MO_DUN = resolve(arg('--mo-dun') || join(HERE, '..', 'lib', 'bao-cao.mjs'));
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
const dj = (f) => { const p = join(LIB, f); if (!existsSync(p)) thoat3(`thieu ${p}`); return JSON.parse(readFileSync(p, 'utf8')); };

const bc = dj('hub-bao-cao.json'); const reg = dj('cncl-registry.json'); const mat = dj('cncl-match.json');
const graph = dj('hub-graph.json'); const thiTruong = dj('hub-thi-truong.json'); const moDau = dj('hub-mo-dau.json');
const xuHuong = existsSync(join(LIB, 'hub-xu-huong.json')) ? dj('hub-xu-huong.json') : { diem: [] };
const { dungBaoCao } = await import(pathToFileURL(MO_DUN).href);

const vi = [];
if (JSON.stringify(dungBaoCao({ thiTruong, moDau, xuHuong })) !== JSON.stringify(bc)) vi.push('BAO_CAO_LECH: hub-bao-cao.json khac ban tinh lai');

const nc = graph.nodes.filter((n) => n.kind === 'nhu_cau');
const cungCua = new Map(nc.map((n) => [n.id, new Set()]));
for (const e of graph.edges) if ((e.kind === 'cung_san_pham' || e.kind === 'match_da_ky') && cungCua.has(e.target)) cungCua.get(e.target).add(e.source);
const that = {
  tong: reg.needs.length,
  daKy: new Set(mat.signedMatches.map((m) => m.demandId).filter((d) => reg.needs.some((n) => n.entityId === d))).size,
  trong: [...cungCua.values()].filter((s) => s.size === 0).length,
  mong: [...cungCua.values()].filter((s) => s.size === 1).length,
};
for (const [k, v] of Object.entries(that)) if (bc.so?.[k] !== v) vi.push(`SO_LECH: ${k} bao cao ghi ${bc.so?.[k]}, dem doc lap ${v}`);
const [y, m] = String(moDau.mocNgay).split('-').map(Number);
const kyDung = `Quý ${['I', 'II', 'III', 'IV'][Math.floor((m - 1) / 3)]}/${y}`;
if (bc.ky !== kyDung) vi.push(`KY_SAI: bao cao ghi ${bc.ky}, moc ${moDau.mocNgay} la ${kyDung}`);

console.log(`bao cao ${bc.ky}: ${bc.so?.tong} san pham · ${bc.so?.daKy} da ky · ${bc.so?.trong} trong · ${bc.so?.mong} mot nguon`);
if (vi.length) { console.log(`\nFAIL: ${vi.length} vi pham`); vi.forEach((v) => console.log('  ' + v)); process.exit(2); }
console.log('\nOK: bao cao khop ban tinh lai va phep dem doc lap tu registry, match, do thi.');
