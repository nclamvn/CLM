#!/usr/bin/env node
/**
 * check-kho.mjs · Trang Kho ma chi duoc noi dieu git noi, tai dung commit ghi trong file.
 *
 * VI SAO CO (29/09/2026): trang cu la bang ghi tay (lib/repos-view.ts): nam kho rieng le voi HEAD
 * thang 7-8, trong khi tu 01/09 moi thu da gop vao mot kho. Dong thoi URL remote cua kho tung chua
 * token trong qua khu: file sinh cho web khong duoc mang URL day du.
 *
 * HAI LOP:
 *   A. KHO_LECH: tinh lai lib/kho.mjs TAI commit sinhTu, so voi lib/hub-kho.json.
 *   B. Doc lap (lenh git truc tiep, khong qua module):
 *      COMMIT_NGOAI_LICH_SU  sinhTu khong phai to tien (hoac chinh) HEAD
 *      SO_LECH               tong commit, so tep tung thu muc, tong o cong khac git
 *      LO_THONG_TIN          file sinh chua "@" hoac "://" (URL, co the kem token)
 *      GHI_TAY_QUAY_LAI      lib/repos-view.ts ton tai lai, hoac trang nhap thu khac ngoai hub-kho.json va cncl-registry.json
 *
 * Chay: node scripts/check-kho.mjs [--touch <dir .touch>] [--goc <repo git>] [--mo-dun <kho.mjs>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC (khong co git, checkout nong).
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync } from 'node:child_process';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const TOUCH = resolve(arg('--touch') || join(HERE, '..'));
const MO_DUN = resolve(arg('--mo-dun') || join(HERE, '..', 'lib', 'kho.mjs'));
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
let GOC = arg('--goc');
const git = (...a) => execFileSync('git', ['-C', GOC, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
try {
  GOC = GOC || execFileSync('git', ['-C', HERE, 'rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
  if (git('rev-parse', '--is-shallow-repository') === 'true') thoat3('checkout nong (shallow): khong du lich su. CI can fetch-depth: 0.');
} catch (e) { if (e.status === 3) throw e; thoat3(`khong doc duoc git: ${String(e.message).split('\n')[0]}`); }
const pFile = join(TOUCH, 'lib', 'hub-kho.json');
if (!existsSync(pFile)) thoat3(`thieu ${pFile}. Chay scripts/gen-kho.mjs`);
const raw = readFileSync(pFile, 'utf8');
const K = JSON.parse(raw);
const { dungKho } = await import(pathToFileURL(MO_DUN).href);

const vi = [];
let sha = null;
try { sha = git('rev-parse', `${K.sinhTu?.sha}^{commit}`); } catch { vi.push(`COMMIT_NGOAI_LICH_SU: ${K.sinhTu?.sha} khong co trong kho`); }
if (sha) {
  try { git('merge-base', '--is-ancestor', sha, 'HEAD'); } catch { vi.push(`COMMIT_NGOAI_LICH_SU: ${K.sinhTu.sha} khong phai to tien cua HEAD`); }
  // A
  if (JSON.stringify(dungKho(GOC, sha)) !== JSON.stringify(K)) vi.push(`KHO_LECH: file sinh khac ban tinh lai tai ${K.sinhTu.sha}`);
  // B. Doc lap
  const tong = Number(git('rev-list', '--count', sha));
  if (K.tongCommit !== tong) vi.push(`SO_LECH: tong commit ghi ${K.tongCommit}, git ${tong}`);
  for (const p of K.phan ?? []) {
    const n = git('ls-tree', '-r', '--name-only', sha, '--', p.thuMuc).split('\n').filter(Boolean).length;
    if (p.soTep !== n) vi.push(`SO_LECH: ${p.thuMuc} ghi ${p.soTep} tep, git ${n}`);
  }
  const chuoi = git('show', `${sha}:CaoLocMatch/chay_het_cong.sh`).split('\n').filter((l) => /^\s*chay\s+(CNCLData|CaoLocMatch|\.touch)\s+\S+/.test(l)).length;
  const oGhi = Object.values(K.oTheoKho ?? {}).reduce((s, v) => s + v, 0);
  if (oGhi !== chuoi) vi.push(`SO_LECH: o cong ghi ${oGhi}, chay_het_cong.sh tai ${K.sinhTu.sha} co ${chuoi}`);
}
if (/@|:\/\//.test(raw)) vi.push('LO_THONG_TIN: hub-kho.json chua "@" hoac "://" (URL co the kem token)');
if (existsSync(join(TOUCH, 'lib', 'repos-view.ts'))) vi.push('GHI_TAY_QUAY_LAI: lib/repos-view.ts ton tai lai');
const trang = join(TOUCH, 'app', 'dashboard', 'repos', 'page.tsx');
if (!existsSync(trang)) thoat3(`thieu ${trang}`);
const nhap = [...readFileSync(trang, 'utf8').matchAll(/from\s+'(@\/lib\/[^']+)'/g)].map((m) => m[1]);
const thua = nhap.filter((x) => !['@/lib/hub-kho.json', '@/lib/cncl-registry.json'].includes(x));
if (thua.length) vi.push(`GHI_TAY_QUAY_LAI: trang Kho ma nhap ${thua.join(', ')}`);

console.log(`kho ${K.tenKho} · sinh tu ${K.sinhTu?.sha} · ${K.tongCommit} commit · ${K.phan?.length} phan`);
if (vi.length) {
  console.log(`\nFAIL: ${vi.length} vi pham`);
  vi.slice(0, 30).forEach((v) => console.log('  ' + v));
  process.exit(2);
}
console.log('\nOK: trang Kho ma khop git tai commit ghi lai, khong lo URL, khong co bang ghi tay.');
