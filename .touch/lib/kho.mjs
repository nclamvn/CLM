/**
 * kho.mjs · Du lieu trang Repositories, DOC TU GIT tai mot commit ghi lai. Dung chung cho
 * scripts/gen-kho.mjs (sinh) va scripts/check-kho.mjs (tinh lai tai dung commit do, so tung truong).
 *
 * VI SAO (29/09/2026): trang cu (lib/repos-view.ts) la bang ghi tay ngay 19/07-15/08/2026: nam kho
 * rieng le, HEAD cu, "14 don vi, 64 claim". Tu 01/09/2026 moi thu nam trong MOT kho gop (git subtree,
 * lich su nguyen ven), nen trang dang chi vao nhung kho khong con la nguon.
 *
 * GA-TRUNG: file sinh ra duoc commit SAU khi sinh, nen commit ghi trong file luon la commit TRUOC
 * no. Trang noi ro "sinh tu commit X"; cong kiem X la to tien cua HEAD va tinh lai moi so TAI X.
 * Moi so o day la ket qua cua mot lenh git; mo ta vai tro tung phan la chu cua nguoi viet, khong so.
 */
import { execFileSync } from 'node:child_process';

export const PHAN = [
  { thuMuc: 'CNCLData', ten: 'Chiều cung', vaiTro: 'Registry đơn vị có năng lực công nghệ chiến lược: claim, bản chụp nguồn, cổng và vòng tự chạy.' },
  { thuMuc: 'Dataset_CongNgheChienLuoc', ten: 'Chiều cầu', vaiTro: 'Danh mục 30 sản phẩm chiến lược theo QĐ 21/2026 và các sự kiện chính sách, có câu nguồn nguyên văn.' },
  { thuMuc: 'CaoLocMatch', ten: 'Máy ghép', vaiTro: 'Engine ghép cung với cầu, sổ ký của người gác cổng, và chuỗi cổng chạy toàn hệ.' },
  { thuMuc: '.touch', ten: 'Mặt hiển thị', vaiTro: 'Hub web: mọi con số sinh từ dữ liệu ba phần trên, bấm là ra câu nguồn.' },
];

export const DONG = [
  { tu: 'Chiều cung', den: 'Mặt hiển thị', ghi: 'registry và bản chụp nguồn, sinh lại mỗi lần chạy chuỗi cổng' },
  { tu: 'Chiều cầu', den: 'Máy ghép', ghi: '30 nhu cầu và bảng ánh xạ nhóm đã duyệt' },
  { tu: 'Máy ghép', den: 'Mặt hiển thị', ghi: 'chỉ match đã có chữ ký người mới lên web' },
  { tu: 'Chiều cầu', den: 'bản đọc ở KnowledgeBase', ghi: 'đồng bộ một chiều, cổng chống phân kỳ' },
  { tu: 'kho tin nội bộ RtR (ngoài kho)', den: 'Chiều cung', ghi: 'cầu nối một chiều: chỉ gợi ý URL, qua hàng chờ và người duyệt' },
];

export function dungKho(goc, sha) {
  const git = (...a) => execFileSync('git', ['-C', goc, ...a], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  const dong = (s) => (s ? s.split('\n') : []);
  const full = git('rev-parse', `${sha}^{commit}`);
  const ngay = git('show', '-s', '--format=%ad', '--date=short', full);
  // Commit gop: commit merge co tieu de "Gop <thu muc>" (git subtree add, 01/09/2026).
  const gop = dong(git('log', '--merges', '--format=%H%x09%ad%x09%s', '--date=short', full));
  const phan = PHAN.map((p) => {
    const m = gop.map((l) => l.split('\t')).find(([, , s]) => new RegExp(`^Gop ${p.thuMuc.replace('.', '\\.')}\\b`).test(s));
    const truoc = m ? Number(git('rev-list', '--count', `${m[0]}^2`)) : null;
    const sau = m ? Number(git('rev-list', '--count', `${m[0]}..${full}`, '--', p.thuMuc)) : null;
    const [csha, cngay, ctd] = git('log', '-1', '--format=%h%x09%ad%x09%s', '--date=short', full, '--', p.thuMuc).split('\t');
    return {
      ...p,
      gop: m ? { sha: m[0].slice(0, 7), ngay: m[1] } : null,
      commitTruocGop: truoc, commitSauGop: sau,
      cuoi: { sha: csha, ngay: cngay, tieuDe: ctd },
      soTep: dong(git('ls-tree', '-r', '--name-only', full, '--', p.thuMuc)).length,
    };
  });
  // O cong trong chuoi, dem tu chinh chay_het_cong.sh TAI commit do.
  const chuoi = git('show', `${full}:CaoLocMatch/chay_het_cong.sh`);
  const oTheoKho = {};
  for (const l of chuoi.split('\n')) {
    const m = l.match(/^\s*chay\s+(CNCLData|CaoLocMatch|\.touch)\s+(\S+)/);
    if (m) oTheoKho[m[1]] = (oTheoKho[m[1]] ?? 0) + 1;
  }
  // Chi lay "chu/ten-kho" tu URL remote. URL co the mang token (vd https://<token>@github.com/...):
  // tuyet doi khong dua nguyen URL vao file sinh.
  let tenKho = null;
  try { const m = git('remote', 'get-url', 'origin').match(/github\.com[/:]([^/\s]+)\/([^/\s]+?)(?:\.git)?$/); tenKho = m ? `${m[1]}/${m[2]}` : null; } catch { tenKho = null; }
  return {
    tenKho,
    sinhTu: { sha: full.slice(0, 7), ngay },
    tongCommit: Number(git('rev-list', '--count', full)),
    commitDau: git('log', '--reverse', '--format=%ad', '--date=short', full).split('\n')[0],
    ngayGop: gop.length ? gop.map((l) => l.split('\t')[1]).sort()[0] : null,
    phan, oTheoKho,
    ganDay: dong(git('log', '-10', '--no-merges', '--format=%h%x09%ad%x09%s', '--date=short', full)).map((l) => { const [s, d, t] = l.split('\t'); return { sha: s, ngay: d, tieuDe: t }; }),
    dong: DONG,
  };
}
