#!/usr/bin/env node
/**
 * check-kiem-toan.mjs · Ma kiem toan tren moi ho so phai dung voi cau nguon va ban chup hien hanh.
 *
 * VI SAO CO (01/10/2026): ma kiem toan la loi hua "ho so nay chua bi sua". Neu file ma da sinh lech
 * voi du lieu (sinh truoc khi sua cau nguon, hay ban chup bi thay), trang web se trao cho khach
 * hang mot ma sai, va cong cu doi chieu cua ho se bao LECH oan.
 *
 * CONG KIEM:
 *   KIEM_TOAN_LECH   lib/hub-kiem-toan.json khac ban tinh lai tu registry + public/evidence.
 *   BAN_CHUP_THIEU   mot cau nguon dua vao ban chup khong co tren /evidence (dau vet null).
 *   DOI_CHIEU_HONG   dung tep ho so y nhu nut tai tren web roi chay cong cu doi chieu: phai KHOP.
 *
 * Chay: node scripts/check-kiem-toan.mjs [--lib <dir>] [--public <dir>]
 * Exit 0 sach · 2 vi pham · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dungHoSoKiemToan } from '../lib/kiem-toan.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const arg = (k) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : null; };
const LIB = resolve(arg('--lib') || join(HERE, '..', 'lib'));
const PUB = resolve(arg('--public') || join(HERE, '..', 'public'));
const thoat3 = (m) => { console.log(`KHONG CHAY DUOC: ${m}`); process.exit(3); };
const dj = (f) => { const p = join(LIB, f); if (!existsSync(p)) thoat3(`thieu ${p}`); return JSON.parse(readFileSync(p, 'utf8')); };
const reg = dj('cncl-registry.json'); const kt = dj('hub-kiem-toan.json');
const sha = (t) => createHash('sha256').update(t, 'utf8').digest('hex');
const doc = (href) => { const p = join(PUB, href); return existsSync(p) ? readFileSync(p, 'utf8') : null; };

const vi = [];
const lai = Object.fromEntries(reg.units.map((u) => [u.name, dungHoSoKiemToan(u, doc, sha)]));
if (JSON.stringify(lai) !== JSON.stringify(kt)) {
  const lech = reg.units.filter((u) => JSON.stringify(lai[u.name]) !== JSON.stringify(kt[u.name])).map((u) => u.name);
  vi.push(`KIEM_TOAN_LECH: ${lech.length} ho so khac ban tinh lai (${lech.slice(0, 3).join(', ')})`);
}
for (const [ten, x] of Object.entries(lai)) for (const b of x.banChup) if (!b.sha256) vi.push(`BAN_CHUP_THIEU: ${ten} · ${b.href}`);

// Doi chieu dau cuoi: dung tep ho so y nhu nut tai tren web cho 3 don vi, chay cong cu doi chieu.
const tam = mkdtempSync(join(tmpdir(), 'kiem_toan_'));
try {
  for (const u of reg.units.slice(0, 3)) {
    const x = kt[u.name]; if (!x) continue;
    const tep = { phienBan: x.phienBan, donVi: x.donVi, ma: x.ma, banChup: x.banChup,
      cauNguon: u.evidence.map((e) => ({ field: e.field, value: String(e.value), span: e.span, href: e.href, tier: e.tier, source: e.source })) };
    const f = join(tam, 'hs.json'); writeFileSync(f, JSON.stringify(tep));
    const r = spawnSync(process.execPath, [join(HERE, 'kiem-ho-so.mjs'), f, '--ban-chup', PUB], { encoding: 'utf8' });
    if (r.status !== 0) vi.push(`DOI_CHIEU_HONG: ${u.name} cong cu doi chieu tra ${r.status}: ${(r.stdout || '').split('\n').filter(Boolean).pop()}`);
  }
} finally { rmSync(tam, { recursive: true, force: true }); }

console.log(`kiem toan: ${Object.keys(kt).length} ho so · ${Object.values(kt).reduce((s, x) => s + x.banChup.length, 0)} dau vet ban chup`);
if (vi.length) { console.log(`\nFAIL: ${vi.length} vi pham`); vi.slice(0, 30).forEach((v) => console.log('  ' + v)); process.exit(2); }
console.log('\nOK: moi ma kiem toan khop cau nguon va ban chup hien hanh; cong cu doi chieu bao KHOP.');
