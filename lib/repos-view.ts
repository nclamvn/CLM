/**
 * Repository View data (Page Family #4). DU LIEU THAT: HEAD lay tu dia tai thoi diem ghi,
 * cap nhat thu cong khi co commit moi (khong doc git luc runtime, site tu dung).
 * feeds: canh lineage "repo nay cap du lieu cho dau".
 */

export type RepoInfo = {
  name: string;
  owner: string; // 'local' neu chua push
  vis: 'Public' | 'Private' | 'Local';
  head: string;
  date: string;
  role: string;
  gate: string;
  feeds: string[];
};

export const reposView: RepoInfo[] = [
  {
    name: 'touch-hub',
    owner: 'nclamvn/touch-hub',
    vis: 'Public',
    head: '77f850d',
    date: '15/08/2026',
    role: 'Website .touch: landing, dashboard, registry, matching workbench',
    gate: 'check:emdash 0 · lint:tokens 0 err · tsc 0 (build+Lighthouse chạy máy local)',
    feeds: [],
  },
  {
    name: 'cncl-data',
    owner: 'nclamvn/cncl-data',
    vis: 'Private',
    head: '303ea12',
    date: '19/07/2026',
    role: 'Chiều CUNG: domain don_vi_cncl, 14 đơn vị, 64 claim, snapshots',
    feeds: ['touch-hub (lib/cncl-registry.ts + public/evidence, export tĩnh)'],
    gate: 'refinery exit 0 · bites mọi răng CẮN',
  },
  {
    name: 'CaoLocMatch',
    owner: 'nclamvn/CaoLocMatch',
    vis: 'Public',
    head: '8235b58',
    date: '19/07/2026',
    role: 'Engine PoC: refinery + match engine + 11 răng + playbook commands',
    feeds: ['Phase B (chờ dataset thật + baseline người)'],
    gate: '10 răng cắn + SIGNOFF_PENDING · digest tái lập',
  },
  {
    name: 'cncl-framework',
    owner: 'local',
    vis: 'Local',
    head: '38438ca',
    date: '19/07/2026',
    role: 'Chiều CẦU: khung chính sách CNCL 124 claim tier A, 9 snapshot, check_spans 2 răng',
    feeds: ['Matching tương lai (khi nối CUNG-CẦU)'],
    gate: 'span-gate PASS 124/124 · dup-ID gate',
  },
  {
    name: 'poc-docs',
    owner: 'local',
    vis: 'Local',
    head: '15ecb4b',
    date: '19/07/2026',
    role: 'Văn bản PoC đã ký: pre-registration, spec dataset, schema match, playbook khung, field kit',
    feeds: ['CaoLocMatch (điều kiện Phase B)'],
    gate: 'dash-clean · chữ ký đủ',
  },
];

export const lineage = [
  { from: 'cncl-data (CUNG thật)', to: 'touch-hub · Evidence Registry', note: 'export tĩnh + evidence bấm kiểm' },
  { from: 'cncl-framework (CẦU thật)', to: 'match chứng-minh-được', note: 'chờ bước nối, chưa chạy' },
  { from: 'poc-docs (pre-registration)', to: 'CaoLocMatch · Phase B', note: 'khoá 3 điều kiện người' },
  { from: 'CaoLocMatch (engine)', to: 'touch-hub · Matching Workbench', note: 'hiện DEMO, nối thật sau Phase B' },
] as const;
