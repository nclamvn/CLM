/**
 * Trang thai du an CaoLocMatch - snapshot tu X-Ray 19/07 (reports/XRAY_TIEN_DO_2026-07-19.md).
 * So THAT, chua auto-sync. Chuoi hien thi dung tieng Viet co dau (Inter subset da phu du glyph).
 * Dash-clean: 0 em/en-dash (dung middot U+00B7 lam separator).
 */
export type Check = { label: string; ok: boolean };
export type ProjectComponent = {
  n: number; name: string; status: 'PASS' | 'RISK'; version: string; date: string; checks: Check[];
};

export const statusMeta = {
  generatedAt: '19/07/2026',
  title: 'Dashboard tổng quan',
  subtitle: 'X-Ray tiến độ toàn dự án · Cập nhật 19/07/2026',
} as const;

export const kpis = {
  cung: { value: 14, unit: 'đơn vị', sub: '7 nguồn · 64 claim' },
  cau: { value: 124, unit: 'claim tier A', sub: '10 nhóm · 30 SP · 9 snapshot' },
  engine: { value: 10, unit: 'răng cắn', sub: 'Synthetic data · Xong 17/07' },
  site: { value: 'LIVE', unit: '', sub: 'Registry render thật' },
} as const;

export const projectComponents: ProjectComponent[] = [
  {
    n: 1, name: 'Site touch-hub', status: 'PASS', version: '77f850d', date: '15/08/2026',
    checks: [
      { label: 'Hub Mức 3 render 14 đơn vị', ok: true },
      { label: 'Evidence bấm là kiểm được', ok: true },
      { label: 'check:emdash 0 dash', ok: true },
    ],
  },
  {
    n: 2, name: 'Supply don_vi_cncl', status: 'PASS', version: '303ea12', date: '19/07/2026',
    checks: [
      { label: 'Refinery exit 0', ok: true },
      { label: 'Bites mọi răng CẮN exit 0', ok: true },
      { label: '64 claim · 14 đơn vị · 7 nguồn', ok: true },
      { label: 'Coverage 17.5%', ok: true },
    ],
  },
  {
    n: 3, name: 'Demand khung CNCL', status: 'PASS', version: '38438ca (local)', date: '19/07/2026',
    checks: [
      { label: 'Span-gate PASS 124/124', ok: true },
      { label: '9 snapshot', ok: true },
      { label: 'Tầng A (gov)', ok: true },
    ],
  },
  {
    n: 4, name: 'Engine PoC', status: 'PASS', version: '8235b58', date: '19/07/2026',
    checks: [
      { label: 'Refinery (synthetic) exit 0', ok: true },
      { label: 'Phase A xong 17/07', ok: true },
      { label: '10 răng cắn', ok: true },
    ],
  },
];

export const supply = {
  claims: 64, tierA: 12, tierAPct: 18.8, tierB: 52, tierBPct: 81.2, corroborated: 2,
  byNhom: [
    { key: 'Hàng không VT', value: 7 },
    { key: 'Công nghệ số', value: 7 },
    { key: 'Favors RtR', value: 6 },
    { key: 'Corroborated', value: 2 },
  ],
  ambiguity: ['Viettel (3)', 'Vin (2)'],
} as const;

export const demand = {
  claims: 124,
  rows: [
    { value: 10, label: 'Nhóm công nghệ' },
    { value: 30, label: 'Sản phẩm chiến lược' },
    { value: 6, label: 'SP tiên phong (UAV)' },
    { value: 9, label: 'Snapshot' },
  ],
  tags: [
    { k: 'QĐ 21/2026', v: 'Khung CNCL' },
    { k: 'QĐ 2815', v: 'Chương trình' },
    { k: 'QĐ 769', v: 'Tổ công tác CP' },
    { k: '2030', v: 'Mục tiêu' },
  ],
} as const;

export const deadline = {
  title: 'DEADLINE 20/07 (NGÀY MAI)',
  risk: 'RỦI RO #1',
  dday: 'D-1',
  headline: 'Nghẽn ở INPUT NGƯỜI, không phải máy',
  detail: 'Phỏng vấn pain CHƯA HẸN (tính đến 18/07). Baseline thủ công Tuyết phải nộp TRƯỚC khi mở khóa output engine (pre-reg 02).',
} as const;

export const workQueue = [
  { p: 1, kind: 'NGƯỜI, gấp', title: 'Lâm gửi thư hẹn Tuyết, phỏng vấn pain trước 20/07.', owner: 'Lâm', tone: 'red' as const, lever: true },
  { p: 2, kind: 'MÁY, chờ', title: 'Sau phỏng vấn + baseline: pain thành claim theo 01, mở Phase B.', owner: 'AI', tone: 'amber' as const, lever: false },
  { p: 3, kind: 'MÁY, tùy chọn', title: 'Version dataset khung CẦU (repo cncl-framework private).', owner: 'AI', tone: 'blue' as const, lever: false },
  { p: 4, kind: 'MÁY, tùy chọn', title: 'CNCL Pha 2: 8 nhóm còn lại của don_vi_cncl.', owner: 'AI', tone: 'blue' as const, lever: false },
  { p: 5, kind: 'MÁY, xa', title: 'Match chứng-minh-được CUNG và CẦU (khi cả hai chiều đủ dày).', owner: 'AI', tone: 'blue' as const, lever: false },
];

export const repos = [
  { name: 'touch-hub', owner: 'nclamvn/touch-hub', vis: 'Public', head: '77f850d', date: '15/08/2026' },
  { name: 'cncl-data', owner: 'nclamvn/cncl-data', vis: 'Private', head: '303ea12', date: '19/07/2026' },
  { name: 'CaoLocMatch', owner: 'nclamvn/CaoLocMatch', vis: 'Public', head: '8235b58', date: '19/07/2026' },
];

export const evidence = {
  verifiablePct: 100,
  checklist: ['Nguồn gốc', 'Bằng chứng', 'Băm & kiểm', 'Minh bạch', 'Tái lập'],
  gates: { pass: 4, total: 4, lastRun: '19/07/2026 22:18:33' },
} as const;

/** href rỗng = màn chưa dựng, sidebar hiển thị trạng thái "sắp có" trung thực, không dead-link. */
export const nav = [
  { label: 'Tổng quan', href: '/dashboard' },
  { label: 'Toàn cảnh thị trường', href: '/dashboard/thi-truong' },
  { label: 'Dòng thời cuộc', href: '/dashboard/thoi-cuoc' },
  { label: 'Đồ thị cung cầu', href: '/dashboard/do-thi' },
  { label: 'Hồ sơ đơn vị', href: '/dashboard/don-vi' },
  { label: 'Engine & Matching', href: '/dashboard/matching' },
  { label: 'Evidence Registry', href: '/dashboard/registry' },
  { label: 'Tiến độ & Gates', href: '' },
  { label: 'Rủi ro & Hành động', href: '' },
  { label: 'Tài liệu & SOP', href: '' },
  { label: 'Repositories', href: '/dashboard/repos' },
  { label: 'Cài đặt', href: '' },
];
