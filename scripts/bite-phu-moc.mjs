/**
 * bite-phu-moc.mjs · Bon rang cua cong check-phu-moc.mjs.
 *
 * RANG 1 la rang quan trong nhat va cung la ly do cong nay ton tai. Con so vung phu nam trong
 * mot file do MOT LAN CHAY CO TRINH DUYET sinh ra. Trong chuoi cong thuong ngay khong ai mo
 * trinh duyet ca. Nen neu registry doi ma khong ai chup lai, cong se doc mot con so CU.
 *
 * Mot cong doc so cu roi bao XANH thi te hon khong co cong: no chung nhan cho mot thu khong
 * con dung. Cho nen o day KHONG CHAY DUOC phai la mot trang thai that, khac han XANH.
 *
 * RANG 1 · REGISTRY DOI MA CHUA CHUP LAI -> exit 3, KHONG duoc xanh.
 * RANG 2 · VUNG PHU TUT -> exit 2.
 * RANG 3 · MO RONG DUOC MA KHONG CHOT -> exit 2, vi khoa mot chieu phai siet ca hai chieu.
 * RANG 4 · SACH THI XANH -> exit 0.
 *
 * Chay: node scripts/bite-phu-moc.mjs
 */
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync, existsSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const TOUCH = dirname(dirname(fileURLToPath(import.meta.url)));
const tam = mkdtempSync(join(tmpdir(), 'bite-phu-'));
const k = join(tam, 'touch');
mkdirSync(join(k, 'lib'), { recursive: true });
mkdirSync(join(k, 'reports'), { recursive: true });
cpSync(join(TOUCH, 'scripts'), join(k, 'scripts'), { recursive: true });
// Cong doc ban JSON song sinh tu 25/08/2026, nen canh phai co dung file do.
// Rang thu tu trong ngay bam vao mot artefact cu thay vi vao HANH VI can do.
cpSync(join(TOUCH, 'lib', 'cncl-registry.json'), join(k, 'lib', 'cncl-registry.json'));
const pPhu = join(TOUCH, 'reports', 'phu_moc.json');
if (!existsSync(pPhu)) { console.log('KHONG CHAY DUOC: chua co reports/phu_moc.json'); rmSync(tam, { recursive: true, force: true }); process.exit(3); }
cpSync(pPhu, join(k, 'reports', 'phu_moc.json'));

const chay = () => {
  const r = spawnSync(process.execPath, [join(k, 'scripts', 'check-phu-moc.mjs')],
    { encoding: 'utf8', env: { ...process.env, CLM_KHO_TOUCH: k } });
  return { ma: r.status, ra: (r.stdout || '') + (r.stderr || '') };
};
const in_ = (nhan, ok, chi) => console.log(`${nhan.padEnd(46)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`);

const pPhuTam = join(k, 'reports', 'phu_moc.json');
const pNgan = join(k, 'scripts', 'ngan_sach_phu_moc.txt');
const gocPhu = readFileSync(pPhuTam, 'utf8');
const gocNgan = readFileSync(pNgan, 'utf8');
const phu = JSON.parse(gocPhu);
const muc = Number(gocNgan.split('\n')[0].trim());

const nen = chay();
if (nen.ma !== 0) { console.log(`KHONG CHAY DUOC: ban sao chua tiem gi ma da exit ${nen.ma}\n${nen.ra}`); rmSync(tam, { recursive: true, force: true }); process.exit(3); }

// ── RANG 1 · registry doi ma chua chup lai ─────────────────────────────────
writeFileSync(pPhuTam, JSON.stringify({ ...phu, van_tay_registry: 'deadbeefdeadbeef' }, null, 2));
let r = chay();
const ok1 = r.ma === 3 && r.ra.includes('KHONG CHAY DUOC') && r.ra.includes('registry da doi');
in_('RANG 1 · registry doi ma chua chup lai -> KHONG CHAY', ok1, ok1 ? 'exit 3, khong phai xanh' : `exit ${r.ma}`);
writeFileSync(pPhuTam, gocPhu);

// ── RANG 2 · vung phu TUT ──────────────────────────────────────────────────
writeFileSync(pNgan, gocNgan.replace(String(muc), String(muc + 1)));
r = chay();
const ok2 = r.ma === 2 && r.ra.includes('TUT vung phu');
in_('RANG 2 · vung phu tut thi DO', ok2, ok2 ? 'exit 2' : `exit ${r.ma}`);

// ── RANG 3 · mo rong ma khong chot lai ─────────────────────────────────────
writeFileSync(pNgan, gocNgan.replace(String(muc), String(muc - 1)));
r = chay();
const ok3 = r.ma === 2 && r.ra.includes('MO RONG');
in_('RANG 3 · mo rong ma khong chot thi DO', ok3, ok3 ? 'exit 2' : `exit ${r.ma}`);
writeFileSync(pNgan, gocNgan);

// ── RANG 4 · sach thi xanh ─────────────────────────────────────────────────
r = chay();
const ok4 = r.ma === 0 && r.ra.includes('OK: vung phu');
in_('RANG 4 · tra lai nguyen trang thi XANH', ok4, ok4 ? 'exit 0' : `exit ${r.ma}`);

rmSync(tam, { recursive: true, force: true });
const tatCa = ok1 && ok2 && ok3 && ok4;
console.log('-'.repeat(66));
console.log('BITE PHU MOC:', tatCa ? 'RANG CAN' : 'CO RANG KHONG CAN');
process.exit(tatCa ? 0 : 1);
