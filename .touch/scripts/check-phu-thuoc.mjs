#!/usr/bin/env node
/**
 * check-phu-thuoc.mjs · Khong phu thuoc nao cua web co lo hong muc cao hoac nghiem trong.
 *
 * VI SAO CO (30/09/2026): khi tach node_modules cua CLM khoi kho cu, `npm ci` tren may anh Lam
 * bao 10 lo hong, trong do mot lo NGHIEM TRONG o next 15.5.20 (thu vien truc tiep). Khong o nao
 * trong chuoi hoi cau nay, nen lo hong nam im tu luc no duoc cong bo toi luc co nguoi tinh co cai
 * lai. Chuoi chay moi sang tren GitHub: o nay bien "co lo hong moi" thanh mot o DO trong sang hom
 * sau, thay vi mot dong chu vang troi qua man hinh luc cai.
 *
 * CONG KIEM (doc package-lock.json, khong cai gi, khong chay ma cua goi):
 *   LO_HONG   `npm audit --package-lock-only` bao it nhat mot goi o muc >= nguong (mac dinh high).
 *             Muc thap hon nguong duoc IN RA de thay, nhung khong lam do chuoi.
 *
 * KHONG CHAY DUOC (exit 3) khi khong hoi duoc co so du lieu lo hong (mat mang, registry loi,
 * dau ra khong phai JSON). Khong hoi duoc KHONG phai la sach: tuyet doi khong tra 0 trong truong
 * hop do.
 *
 * Chay: node scripts/check-phu-thuoc.mjs [--dir <thu muc co package-lock.json>] [--nguong high]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const DIR = arg('--dir') || join(HERE, '..');
const MUC = ['info', 'low', 'moderate', 'high', 'critical'];
const NGUONG = arg('--nguong') || 'high';
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
if (!MUC.includes(NGUONG)) thoat3(`nguong la "${NGUONG}", phai la mot trong ${MUC.join(', ')}`);
if (!existsSync(join(DIR, 'package-lock.json'))) thoat3(`thieu ${join(DIR, 'package-lock.json')}`);

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const r = spawnSync(npm, ['audit', '--package-lock-only', '--json'], { cwd: DIR, encoding: 'utf8', timeout: 120000 });
if (r.error) thoat3(`khong goi duoc npm: ${r.error.message}`);
let a;
try { a = JSON.parse(r.stdout); } catch { thoat3(`npm audit khong tra JSON (exit ${r.status}): ${(r.stderr || r.stdout).trim().slice(0, 160)}`); }
if (a.error || !a.metadata?.vulnerabilities || !a.vulnerabilities) {
  thoat3(`npm audit khong hoi duoc co so du lieu lo hong: ${a.error?.summary || a.error?.code || 'thieu metadata'}`);
}

const cap = MUC.indexOf(NGUONG);
const vi = []; const ghiNhan = [];
for (const [ten, v] of Object.entries(a.vulnerabilities)) {
  const tieuDe = (v.via ?? []).filter((x) => typeof x === 'object').map((x) => x.title);
  const dong = `${ten} [${v.severity}]${v.isDirect ? ' TRUC TIEP' : ''} ${v.range}: ${tieuDe[0] ?? 'qua ' + (v.via ?? []).join(', ')}${tieuDe.length > 1 ? ` (+${tieuDe.length - 1})` : ''}`;
  (MUC.indexOf(v.severity) >= cap ? vi : ghiNhan).push(dong);
}
const m = a.metadata.vulnerabilities;
console.log(`phu thuoc: ${a.metadata.dependencies?.total ?? '?'} goi · critical ${m.critical} · high ${m.high} · moderate ${m.moderate} · low ${m.low} · nguong ${NGUONG}`);
if (ghiNhan.length) { console.log('\nGHI NHAN (duoi nguong, khong lam do):'); ghiNhan.forEach((x) => console.log('  ' + x)); }
if (vi.length) {
  console.log(`\nFAIL: ${vi.length} vi pham`);
  vi.slice(0, 30).forEach((x) => console.log('  LO_HONG: ' + x));
  console.log('\nSua: nang ban va cung dong phien ban (npm audit fix, KHONG --force), roi chay lai chuoi.');
  process.exit(2);
}
console.log(`\nOK: khong goi nao co lo hong muc ${NGUONG} tro len.`);
