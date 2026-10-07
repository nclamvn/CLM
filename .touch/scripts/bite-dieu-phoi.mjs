#!/usr/bin/env node
/**
 * bite-dieu-phoi.mjs · Rang cua check-dieu-phoi.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep lib/hub-dieu-phoi.json, hub-cau-that.json, cncl-registry.json, lib/dieu-phoi.mjs,
 * thu muc CaoLocMatch/domains/dieu_phoi va components/dieuphoi/DieuPhoi.tsx vao thu muc tam (mkdtempSync),
 * tiem loi vao BAN SAO. File that khong bi cham. Phep tiem chon theo hanh vi (viec dau tien, buoc
 * phieu theo ten) nen du lieu doi thi rang van can.
 *
 * RANG
 * ====
 * RANG 1 · canh sach -> exit 0.
 * RANG 2 · phieu ghi 3 nhu cau da gioi thieu khi so chua co -> PHEU_THOI.
 * RANG 3 · xoa mot viec "xet ung vien" khoi hang -> VIEC_ROT.
 * RANG 4 · MODULE bo viec "tim ben cung" va file sinh tu module do (file khop module) -> VIEC_ROT
 *          (chi phep dem doc lap bat duoc).
 * RANG 5 · mot viec tro toi nhu cau ngoai mui nhon -> VIEC_NGOAI_MUI.
 * RANG 6 · mui_nhon.yaml them nhu cau ma file khong doi -> SO_LECH.
 * RANG 7 · giao dien bo chu "chỉ người ghi" -> NHAN_THIEU.
 * RANG 8 · buoc sau cua phieu lon hon buoc truoc -> PHEU_NGUOC.
 *
 * Chay: node scripts/bite-dieu-phoi.mjs     Exit 0 moi rang can · 2 co rang khong can · 3 KHONG CHAY DUOC.
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { goc } from './goc.mjs';
import { slugDonVi } from '../lib/ho-so.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const CONG = join(HERE, 'check-dieu-phoi.mjs');
const DP = goc('CaoLocMatch', 'domains', 'dieu_phoi');
if (!DP || !existsSync(join(DP, 'mui_nhon.yaml'))) { console.log('KHONG CHAY DUOC: thieu domains/dieu_phoi de dung canh'); process.exit(3); }
const FILES = ['hub-dieu-phoi.json', 'hub-cau-that.json', 'cncl-registry.json', 'dieu-phoi.mjs'];
const kq = []; const tam = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(62)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const canh = () => {
  const t = mkdtempSync(join(tmpdir(), 'bite_dieu_phoi_web_')); tam.push(t);
  mkdirSync(join(t, 'lib')); mkdirSync(join(t, 'dp'));
  for (const f of FILES) copyFileSync(join(TOUCH, 'lib', f), join(t, 'lib', f));
  for (const f of ['mui_nhon.yaml', 'su_kien.jsonl']) if (existsSync(join(DP, f))) copyFileSync(join(DP, f), join(t, 'dp', f));
  copyFileSync(join(TOUCH, 'components', 'dieuphoi', 'DieuPhoi.tsx'), join(t, 'DieuPhoi.tsx'));
  return t;
};
const chay = (t) => {
  const r = spawnSync(process.execPath, [CONG, '--lib', join(t, 'lib'), '--dp', join(t, 'dp'), '--mo-dun', join(t, 'lib', 'dieu-phoi.mjs'), '--giao-dien', join(t, 'DieuPhoi.tsx')], { encoding: 'utf8' });
  return { rc: r.status, out: r.stdout + r.stderr };
};
const doi = (t, g) => { const p = join(t, 'lib', 'hub-dieu-phoi.json'); const x = JSON.parse(readFileSync(p, 'utf8')); g(x); writeFileSync(p, JSON.stringify(x)); };
const thu = async (nhan, ma, buoc) => {
  const t = canh();
  try { await buoc(t); } catch (e) { inRa(nhan, false, `KHONG TIEM DUOC ${e.message}`); return; }
  const r = chay(t); inRa(nhan, r.rc === 2 && r.out.includes(ma), `exit ${r.rc}`);
};

try {
  const r = chay(canh());
  inRa('RANG 1 · canh sach -> exit 0', r.rc === 0, `exit ${r.rc}`);
  await thu('RANG 2 · thoi phong buoc da gioi thieu -> PHEU_THOI', 'PHEU_THOI', (t) => doi(t, (x) => { x.pheu.find((p) => p.buoc === 'da_gioi_thieu').so = 3; }));
  await thu('RANG 3 · xoa viec xet ung vien -> VIEC_ROT', 'VIEC_ROT', (t) => doi(t, (x) => {
    const i = x.viec.findIndex((v) => v.loai === 'xet_ung_vien'); if (i < 0) throw new Error('khong co viec xet'); x.viec.splice(i, 1);
  }));
  await thu('RANG 4 · module bo viec tim ben cung -> VIEC_ROT', 'VIEC_ROT', async (t) => {
    const p = join(t, 'lib', 'dieu-phoi.mjs'); const s = readFileSync(p, 'utf8');
    const moc = "if (!dong && !ungVien.length) them('tim_ben_cung'";
    if (!s.includes(moc)) throw new Error('khong thay moc');
    writeFileSync(p, s.replace(moc, "if (false) them('tim_ben_cung'"));
    const m = await import(pathToFileURL(p).href + '?t=' + Date.now());
    const reg = JSON.parse(readFileSync(join(t, 'lib', 'cncl-registry.json'), 'utf8'));
    const ct = JSON.parse(readFileSync(join(t, 'lib', 'hub-cau-that.json'), 'utf8'));
    const sk = existsSync(join(t, 'dp', 'su_kien.jsonl')) ? readFileSync(join(t, 'dp', 'su_kien.jsonl'), 'utf8').split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l)) : [];
    const ra = m.dungDieuPhoi(m.docMuiNhon(readFileSync(join(t, 'dp', 'mui_nhon.yaml'), 'utf8')), sk, ct, reg.meta.generatedAt, slugDonVi);
    if (!ra.nhuCau.some((n) => !n.dong && !n.ungVien.length)) throw new Error('mui nhon khong co nhu cau thieu ung vien');
    writeFileSync(join(t, 'lib', 'hub-dieu-phoi.json'), JSON.stringify(ra, null, 1) + '\n');
  });
  await thu('RANG 5 · viec ngoai mui nhon -> VIEC_NGOAI_MUI', 'VIEC_NGOAI_MUI', (t) => doi(t, (x) => { x.viec[0].nhuCau = 'btl-07'; }));
  await thu('RANG 6 · mui nhon them nhu cau, file khong doi -> SO_LECH', 'SO_LECH', (t) => {
    const p = join(t, 'dp', 'mui_nhon.yaml'); const s = readFileSync(p, 'utf8');
    if (!/^nhu_cau: \[/m.test(s)) throw new Error('khong thay dong nhu_cau');
    writeFileSync(p, s.replace(/^nhu_cau: \[/m, 'nhu_cau: [btl-11, '));
  });
  await thu('RANG 7 · giao dien bo chu "chỉ người ghi" -> NHAN_THIEU', 'NHAN_THIEU', (t) => {
    const p = join(t, 'DieuPhoi.tsx'); const s = readFileSync(p, 'utf8');
    if (!s.includes('chỉ người ghi')) throw new Error('khong co chu de go');
    writeFileSync(p, s.split('chỉ người ghi').join('được ghi'));
  });
  await thu('RANG 8 · buoc sau lon hon buoc truoc -> PHEU_NGUOC', 'PHEU_NGUOC', (t) => doi(t, (x) => { x.pheu[2].so = x.pheu[1].so + 1; }));
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE DIEU PHOI WEB: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
