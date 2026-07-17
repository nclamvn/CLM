/**
 * Du lieu DEMO cho landing toi (control-room). Moi day so sinh bang PRNG
 * co seed co dinh de server va client render giong het nhau (khong dung
 * Math.random trong duong render). Copy chu nam o lib/content.ts (dk).
 */

function mulberry32(seed: number) {
  let t0 = seed;
  return function () {
    let t = (t0 += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ----- metrics band ----- */
export type DarkMetric = {
  label: string;
  to: number;
  unit?: string;
  delta: string;
  deltaKind: 'up' | 'hot' | 'flat';
  series: number[];
  color: string;
  accent: string;
  micro: { k: string; v: string }[];
};

export const darkMetrics: DarkMetric[] = [
  {
    label: 'Facts verified_primary',
    to: 1284920,
    delta: '▲ 4,2% · 7D',
    deltaKind: 'up',
    series: [34, 36, 35, 41, 44, 43, 49, 52, 58, 57, 64, 71],
    color: '#3FB27F',
    accent: 'rgba(63,178,127,.55)',
    micro: [
      { k: '24H', v: '+1.204' },
      { k: '7D', v: '+8.902' },
      { k: 'ĐỈNH', v: '9,4K/NGÀY' },
    ],
  },
  {
    label: 'Match chứng-minh-được',
    to: 47320,
    delta: '▲ 12 · TUẦN NÀY',
    deltaKind: 'hot',
    series: [28, 31, 30, 36, 35, 41, 44, 43, 50, 54, 60, 66],
    color: '#C40F0F',
    accent: 'rgba(196,15,15,.6)',
    micro: [
      { k: 'ĐÃ BẢO CHỨNG', v: '12' },
      { k: 'ĐANG ĐI VÒNG', v: '3' },
    ],
  },
  {
    label: 'Registry ngành đang sống',
    to: 12,
    delta: '+2 · QUÝ NÀY',
    deltaKind: 'flat',
    series: [18, 18, 24, 24, 31, 31, 38, 38, 47, 47, 55, 62],
    color: '#9A9AA6',
    accent: 'rgba(154,154,166,.5)',
    micro: [
      { k: 'FACT/REGISTRY', v: '~107K' },
      { k: 'LÀM MỚI', v: '72H' },
    ],
  },
  {
    label: 'Response rate bên được match',
    to: 68,
    unit: '%',
    delta: '▲ 6PT · QUÝ',
    deltaKind: 'up',
    series: [40, 42, 41, 47, 46, 51, 54, 53, 58, 61, 64, 68],
    color: '#C40F0F',
    accent: 'rgba(196,15,15,.6)',
    micro: [
      { k: 'MEDIAN PHẢN HỒI', v: '36H' },
      { k: 'ĐI HẾT VÒNG', v: '41%' },
    ],
  },
];

/* ----- ma tran nang luc x yeu cau (deterministic) ----- */
export type MatrixCell = { v: number; fit: boolean };

export const matrixCaps = ['CNC', 'Đúc', 'Ép nhựa', 'PCB', 'Nhiệt luyện', 'Hợp kim'];
export const matrixReqs = ['R1', 'R2', 'R3', 'R4', 'R5', 'R6', 'R7', 'R8'];

export const matrixCells: MatrixCell[][] = (() => {
  const rnd = mulberry32(7);
  return matrixCaps.map((_, i) =>
    matrixReqs.map((_, j) => {
      const base = Math.max(0, Math.sin(i * 1.3 + j * 0.7) * 0.5 + 0.5 - rnd() * 0.25);
      const v = Math.min(1, base);
      return { v, fit: v > 0.82 };
    }),
  );
})();

export function matrixColor(v: number): string {
  return `rgb(${Math.round(23 + v * 173)},${Math.round(23 - v * 8)},${Math.round(28 - v * 13)})`;
}

/* ----- provenance graph (toa do tinh, viewBox 440x320) ----- */
export const provGraph = {
  match: { x: 220, y: 60, label: 'MATCH-0042' },
  mids: [
    { x: 120, y: 150, label: 'Cầu: Đông Á' },
    { x: 320, y: 150, label: 'Cung: Trường Sơn' },
  ],
  srcs: [
    { x: 60, y: 250, label: 'snapshot', tier: 'B' },
    { x: 180, y: 250, label: 'hồ sơ NL', tier: 'B' },
    { x: 300, y: 250, label: 'ISO 9001', tier: 'A' },
    { x: 390, y: 250, label: 'gác cổng', tier: 'A' },
  ],
} as const;

/* ----- bieu do noi suy (18 ky, 12 ky da kiem, deterministic) ----- */
export const interp = (() => {
  const rnd = mulberry32(3);
  const N = 18;
  const real = 12;
  const pts: number[] = [];
  let v = 0.5;
  for (let i = 0; i < N; i++) {
    v += Math.sin(i * 0.6) * 0.06 + (rnd() - 0.5) * 0.05;
    v = Math.max(0.15, Math.min(0.9, v));
    pts.push(v);
  }
  return { N, real, pts };
})();

/* ----- vertical registries ----- */
export type DarkVertical = {
  name: string;
  facts: string;
  match: number;
  delta: string;
  tiers: [number, number, number];
  refresh: string;
};

export const darkVerticals: DarkVertical[] = [
  { name: 'Công nghiệp hỗ trợ', facts: '1.284', match: 47, delta: '+12', tiers: [62, 26, 12], refresh: '72H' },
  { name: 'Nông sản xuất khẩu', facts: '930', match: 31, delta: '+8', tiers: [54, 30, 16], refresh: '96H' },
  { name: 'Điện tử · bán dẫn', facts: '715', match: 22, delta: '+5', tiers: [48, 34, 18], refresh: '96H' },
];

/* ----- match stream (ticker) ----- */
export const streamNames = {
  demand: ['Đông Á', 'Minh Long', 'Tân Bình', 'Sông Bé', 'Hải Vân', 'Tây Đô', 'Bắc Hà'],
  supply: ['Trường Sơn', 'Á Châu', 'Hưng Gia', 'Đại Phát', 'Việt Hưng', 'Nam Tiến', 'Phú Mỹ'],
};

/* ----- pipeline ----- */
export const pipelineGates = ['Cào', 'Tinh lọc', 'Provenance', 'Registry', 'Ma trận', 'Matching', 'Hậu kiểm'];
/** Xac suat can moi cong (demo). */
export const pipelineBite = [0.015, 0.075, 0.05, 0.01, 0.02, 0.03, 0.04];
/** So da qua tung cong luc bat dau (demo). */
export const pipelinePassBase = [9184, 8462, 7910, 7822, 7690, 7511, 7204];
export const pipelineCounters = { in: 12480, ok: 11952, blocked: 528 };
