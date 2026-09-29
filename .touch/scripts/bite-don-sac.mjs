#!/usr/bin/env node
/**
 * bite-don-sac.mjs · Rang cua check-don-sac.mjs.
 *
 * CANH
 * ====
 * TU DUNG LAY CANH: chep styles/, app/ (tru app/dev), components/ (tru components/globe) va
 * lib/tokens.ts vao thu muc tam (mkdtempSync), tiem loi vao BAN SAO. Khong sua file that.
 *
 * RANG
 * ====
 * RANG 1  · CANH SACH -> exit 0.
 * RANG 2  · dashboard.css ghi lai accent xanh #2F6BFF -> MAU_BAO_HOA.
 * RANG 3  · component .tsx dung rgba(213, 94, 0, 0.5) (do son cu) -> MAU_BAO_HOA.
 * RANG 4  · touch-portal.css them nen radial-gradient -> GRADIENT.
 * RANG 5  · chu phat sang text-shadow: 0 0 12px -> GLOW.
 * RANG 6  · box-shadow quang sang 0 0 24px -> GLOW.
 * RANG 7  · KHONG BAO OAN: cham thuong hieu #FF3830 -> van exit 0.
 * RANG 8  · KHONG BAO OAN: hoa van repeating-linear-gradient cho trang thai "tu choi" -> exit 0.
 * RANG 9  · KHONG BAO OAN: ma mau trong chu thich, box-shadow do cao 0 12px 40px den -> exit 0.
 * RANG 10 · token SOT v2 quay ve navy #020617 -> MAU_BAO_HOA.
 *
 * Chay: node scripts/bite-don-sac.mjs
 */
import { mkdtempSync, readFileSync, writeFileSync, rmSync, cpSync, mkdirSync, copyFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');
const CONG = join(HERE, 'check-don-sac.mjs');
const kq = [];
const inRa = (nhan, ok, chi) => { console.log(`${nhan.padEnd(64)} : ${ok ? `CAN OK (${chi})` : `KHONG CAN !! ${chi}`}`); kq.push(ok); };
const tam = [];
const canh = (sua) => {
  const t = mkdtempSync(join(tmpdir(), 'bite_don_sac_')); tam.push(t);
  cpSync(join(TOUCH, 'styles'), join(t, 'styles'), { recursive: true });
  cpSync(join(TOUCH, 'app'), join(t, 'app'), { recursive: true, filter: (s) => !s.startsWith(join(TOUCH, 'app', 'dev')) });
  cpSync(join(TOUCH, 'components'), join(t, 'components'), { recursive: true, filter: (s) => !s.startsWith(join(TOUCH, 'components', 'globe')) });
  if (existsSync(join(TOUCH, 'lib', 'tokens.ts'))) { mkdirSync(join(t, 'lib'), { recursive: true }); copyFileSync(join(TOUCH, 'lib', 'tokens.ts'), join(t, 'lib', 'tokens.ts')); }
  if (sua) sua(t);
  return t;
};
const noi = (t, rel, them) => { const p = join(t, rel); writeFileSync(p, readFileSync(p, 'utf8') + them); };
const doi = (t, rel, f) => { const p = join(t, rel); const cu = readFileSync(p, 'utf8'); const moi = f(cu); if (moi === cu) throw new Error(`KHONG TIEM DUOC vao ${rel}`); writeFileSync(p, moi); };
const chay = (t) => { const r = spawnSync(process.execPath, [CONG, '--touch', t], { encoding: 'utf8' }); return { rc: r.status, out: r.stdout + r.stderr }; };
const rang = (nhan, sua, ma, ky) => {
  let r; try { r = chay(canh(sua)); } catch (e) { inRa(nhan, false, e.message); return; }
  inRa(nhan, r.rc === ma && (ky ? r.out.includes(ky) : true), `exit ${r.rc}`);
};

try {
  rang('RANG 1  · canh sach -> exit 0', null, 0);
  rang('RANG 2  · accent xanh #2F6BFF -> MAU_BAO_HOA', (t) => noi(t, 'styles/dashboard.css', '\n.x { color: #2F6BFF; }\n'), 2, 'MAU_BAO_HOA');
  rang('RANG 3  · tsx dung rgba do son cu -> MAU_BAO_HOA', (t) => { mkdirSync(join(t, 'components', 'x'), { recursive: true }); writeFileSync(join(t, 'components', 'x', 'X.tsx'), "export const X = () => <i style={{ background: 'rgba(213, 94, 0, 0.5)' }} />;\n"); }, 2, 'MAU_BAO_HOA');
  rang('RANG 4  · nen radial-gradient -> GRADIENT', (t) => noi(t, 'styles/touch-portal.css', '\n.y { background: radial-gradient(600px 400px at 50% 0%, rgba(255, 255, 255, 0.1), transparent); }\n'), 2, 'GRADIENT');
  rang('RANG 5  · text-shadow phat sang -> GLOW', (t) => noi(t, 'styles/dashboard.css', '\n.z { text-shadow: 0 0 12px rgba(255, 255, 255, 0.4); }\n'), 2, 'GLOW');
  rang('RANG 6  · box-shadow quang sang -> GLOW', (t) => noi(t, 'styles/dashboard.css', '\n.w { box-shadow: 0 0 24px rgba(255, 255, 255, 0.2); }\n'), 2, 'GLOW');
  rang('RANG 7  · cham thuong hieu #FF3830 -> exit 0', (t) => noi(t, 'styles/dashboard.css', '\n.brand { background: #FF3830; }\n'), 0);
  rang('RANG 8  · hoa van repeating-linear-gradient -> exit 0', (t) => noi(t, 'styles/dashboard.css', '\n.tc { background: repeating-linear-gradient(90deg, #A3A3A0 0 3px, transparent 3px 6px); }\n'), 0);
  rang('RANG 9  · chu thich co ma mau + bong do cao den -> exit 0', (t) => noi(t, 'styles/dashboard.css', '\n/* he cu dung #2F6BFF va #D55E00 */\n.card { box-shadow: 0 12px 40px rgba(0, 0, 0, 0.28); }\n'), 0);
  rang('RANG 10 · token nen quay ve navy #020617 -> MAU_BAO_HOA', (t) => doi(t, 'styles/touch-theme.css', (s) => s.replace(/--color-bg-canvas: #[0-9A-Fa-f]{6};/, '--color-bg-canvas: #020617;')), 2, 'MAU_BAO_HOA');
} finally {
  for (const t of tam) rmSync(t, { recursive: true, force: true });
}
const can = kq.filter(Boolean).length;
console.log(`\nBITE DON SAC: ${can}/${kq.length} rang can`);
process.exit(can === kq.length ? 0 : 2);
