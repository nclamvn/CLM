/**
 * bite-truong-hien.mjs · Bon rang cua cong check-truong-hien.mjs.
 *
 * VI SAO CAN: cong nay de tro thanh mot cai den xanh vo dung hon moi cong khac trong he, vi
 * cai no do KHONG phai la tinh toan ven du lieu ma la "cai gi duoc dua len mat trang". Rat de
 * viet mot phien ban chi kiem "truong co xuat hien dau do trong lib/*.ts", va ban do se XANH
 * ngay ca hom nang_luc_mo_ta_2 bi bo, vi mang evidence[] von cho het moi claim ra web.
 *
 * RANG 1 · KHONG KHAI THI DO: them mot truong moi vao registry ma khong khai bao -> exit 2.
 *          Day la chieu quan trong nhat: truong phu moi phai bi chan, khong duoc troi qua.
 * RANG 2 · CO DU LIEU MA KHONG AI RENDER THI DO: bo dong doc `u.capability2` khoi component
 *          -> exit 2, du du lieu van con nguyen trong lib/cncl-registry.ts. Chinh la ca that
 *          da xay ra voi nang_luc_mo_ta_2.
 * RANG 3 · SACH THI XANH: khong tiem gi -> exit 0.
 * RANG 4 · KHOA MOT CHIEU CAN CA HAI CHIEU: ha ngan sach xuong 1 (gia vo da tra bot no) ma
 *          thuc te van 2 -> exit 2 vi TANG so voi ngan sach.
 *
 * Chay: node scripts/bite-truong-hien.mjs
 * Exit 0 neu ca bon rang can · 1 neu co rang khong can · 3 neu khong dung duoc canh.
 */
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { goc } from './goc.mjs';

const TOUCH = dirname(dirname(fileURLToPath(import.meta.url)));
const CNCL = goc('CNCLData');
if (!CNCL) { console.log('KHONG CHAY DUOC: khong thay kho CNCLData'); process.exit(3); }

const tam = mkdtempSync(join(tmpdir(), 'bite-truong-'));
const kTouch = join(tam, 'touch');
const kCncl = join(tam, 'CNCLData');
const BO = ['node_modules', '.next', '.git', 'reports', 'public'];
cpSync(TOUCH, kTouch, { recursive: true, filter: (s) => !BO.some((b) => s.includes(`/${b}`)) });
cpSync(join(CNCL, 'domains'), join(kCncl, 'domains'), { recursive: true });

const chay = () => {
  const r = spawnSync(process.execPath, [join(kTouch, 'scripts', 'check-truong-hien.mjs')], {
    encoding: 'utf8', env: { ...process.env, CLM_KHO_TOUCH: kTouch, CLM_KHO_CNCL: kCncl },
  });
  return { ma: r.status, ra: (r.stdout || '') + (r.stderr || '') };
};

const pClaims = join(kCncl, 'domains', 'don_vi_cncl', 'claims.jsonl');
const pComp = join(kTouch, 'components', 'dash', 'RegistryBrowser.tsx');
const pNgan = join(kTouch, 'scripts', 'ngan_sach_truong_chua_hien.txt');
if (!existsSync(pComp)) { console.log('KHONG CHAY DUOC: thieu RegistryBrowser.tsx trong ban sao'); process.exit(3); }

const in_ = (nhan, ok, chi) => console.log(`${nhan.padEnd(44)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`);

// ── NEN: ban sao chua tiem gi phai xanh, neu khong thi canh hong ────────────
const nen = chay();
if (nen.ma !== 0) { console.log(`KHONG CHAY DUOC: ban sao chua tiem gi ma da exit ${nen.ma}\n${nen.ra}`); rmSync(tam, { recursive: true, force: true }); process.exit(3); }

// ── RANG 1 · truong moi khong khai bao ─────────────────────────────────────
const goc_claims = readFileSync(pClaims, 'utf8');
const mau = JSON.parse(goc_claims.split('\n').find((l) => l.includes('"nang_luc_mo_ta"')));
writeFileSync(pClaims, goc_claims + JSON.stringify({ ...mau, field: 'nang_luc_mo_ta_3' }) + '\n');
let r = chay();
const ok1 = r.ma === 2 && r.ra.includes('CHUA KHAI BAO') && r.ra.includes('nang_luc_mo_ta_3');
in_('RANG 1 · truong moi khong khai bao thi DO', ok1, ok1 ? 'exit 2, goi dich danh truong moi' : `exit ${r.ma}`);
writeFileSync(pClaims, goc_claims);

// ── RANG 2 · co du lieu ma khong component nao doc ─────────────────────────
const goc_comp = readFileSync(pComp, 'utf8');
writeFileSync(pComp, goc_comp.split('u.capability2').join('u.KHONG_AI_DOC'));
r = chay();
const ok2 = r.ma === 2 && r.ra.includes('KHONG component nao doc') && r.ra.includes('capability2');
in_('RANG 2 · co du lieu ma khong ai render thi DO', ok2, ok2 ? 'exit 2, du lib van con nguyen du lieu' : `exit ${r.ma}`);
writeFileSync(pComp, goc_comp);

// ── RANG 3 · sach thi xanh ─────────────────────────────────────────────────
r = chay();
const ok3 = r.ma === 0 && r.ra.includes('OK: moi truong');
in_('RANG 3 · tra lai nguyen trang thi XANH', ok3, ok3 ? 'exit 0' : `exit ${r.ma}\n${r.ra.slice(-400)}`);

// ── RANG 4 · khoa mot chieu, chieu TANG ────────────────────────────────────
const goc_ngan = readFileSync(pNgan, 'utf8');
writeFileSync(pNgan, goc_ngan.replace(/^2/, '1'));
r = chay();
const ok4 = r.ma === 2 && r.ra.includes('TANG so truong');
in_('RANG 4 · vuot ngan sach chua_hien thi DO', ok4, ok4 ? 'exit 2' : `exit ${r.ma}`);
writeFileSync(pNgan, goc_ngan);

rmSync(tam, { recursive: true, force: true });
const tatCa = ok1 && ok2 && ok3 && ok4;
console.log('-'.repeat(62));
console.log('BITE TRUONG HIEN:', tatCa ? 'RANG CAN' : 'CO RANG KHONG CAN');
process.exit(tatCa ? 0 : 1);
