/**
 * van-tay-giao-dien.mjs · Van tay ma nguon giao dien (app/, components/, styles/), dung chung cho
 * kiem-truy-cap.mjs (ghi) va check-truy-cap.mjs (doi chieu). Doi mot ky tu giao dien la doi van tay,
 * va bao cao truy cap cu khong con dung de ket luan.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';

export const TRANG_KIEM = [
  '/', '/dashboard', '/dashboard/thi-truong', '/dashboard/thoi-cuoc', '/dashboard/do-thi', '/dashboard/don-vi',
  '/dashboard/don-vi/trung-tam-vu-tru-viet-nam', '/dashboard/matching', '/dashboard/registry', '/dashboard/repos',
  '/dashboard/phuong-phap', '/dashboard/bao-cao', '/dashboard/hoi-dap', '/dashboard/hoi-dap?q=Ai%20l%C3%A0m%20%C4%91%C6%B0%E1%BB%A3c%20UAV%3F',
];

export function vanTayGiaoDien(touch) {
  const tep = [];
  const di = (d) => {
    if (!existsSync(d)) return;
    for (const t of readdirSync(d).sort()) {
      const p = join(d, t);
      if (t === 'node_modules' || t.startsWith('.')) continue;
      if (statSync(p).isDirectory()) di(p); else if (/\.(tsx|ts|css|mjs)$/.test(t)) tep.push(p);
    }
  };
  for (const d of ['app', 'components', 'styles']) di(join(touch, d));
  const h = createHash('sha256');
  for (const p of tep) { h.update(relative(touch, p)); h.update('\0'); h.update(readFileSync(p)); h.update('\0'); }
  return h.digest('hex').slice(0, 16);
}
