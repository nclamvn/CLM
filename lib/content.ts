/**
 * Nguon copy duy nhat cho toan site (VN chinh, nhan ky thuat EN mono).
 * Moi chuoi hien thi lay tu day de soat em-dash va thuat ngu o mot noi.
 * Thuat ngu co dinh (STANDARDS muc 4): match chung-minh-duoc, provenance, cau,
 * cung, bao chung, tier A/B/C, claim.
 */

export type Tier = 'A' | 'B' | 'C';

export type TierRef = { label: string; level: Tier };

/** Mot dong trong chuoi provenance: text + (tuy chon) tier badge + duoi cau. */
export type ChainRow = {
  k: string;
  v: string;
  tier?: TierRef;
  tail?: string;
  claim?: boolean;
};

export type MatchSide = { role: string; name: string; desc: string };

export type MatchCardData = {
  tag: string;
  /** Do khop 0..1, hien 2 chu so va thanh bar theo phan tram. */
  score: number;
  demand: MatchSide;
  supply: MatchSide;
  chainHeading: string;
  chain: ChainRow[];
  vouch: string;
  gate: string;
};

export const brand = {
  wordmark: 'touch',
  positioning: 'Provenance-backed B2B matching',
} as const;

/** Tagline chuan (co "match"). Focal in nghieng do tren cum chung-minh-duoc. */
export const tagline = {
  lead: 'Chạm đúng đối tác, bằng những match ',
  focal: 'chứng-minh-được',
  tail: '.',
} as const;

export const ui = {
  livePill: 'Live · supply-demand graph',
  viewLanding: 'Landing',
  viewHub: 'Hub',
} as const;

/** Match mau (don vi gia tri). Ten doanh nghiep la hu cau minh hoa. */
export const demoMatch: MatchCardData = {
  tag: 'Đề xuất ghép · độ khớp cao',
  score: 0.91,
  demand: {
    role: 'Cầu / Demand',
    name: 'Cơ khí Chính Xác Đông Á',
    desc: 'cần gia công CNC 5 trục, thép không gỉ, 2.000 chi tiết/tháng',
  },
  supply: {
    role: 'Cung / Supply',
    name: 'Nhà máy Precision Trường Sơn',
    desc: 'CNC 5 trục, ISO 9001, công suất dư 3.500 chi tiết/tháng',
  },
  chainHeading: 'Provenance chain',
  chain: [
    { k: 'Vì sao khớp', v: 'Nhu cầu CNC 5 trục ↔ năng lực CNC 5 trục (overlay NL∩YC)' },
    { k: 'Nguồn cầu', v: 'snapshot hồ sơ năng lực', tier: { label: 'TIER B', level: 'B' }, tail: ' kiểm 06/2026' },
    { k: 'Nguồn cung', v: 'giấy chứng nhận ISO', tier: { label: 'TIER A', level: 'A' } },
    { k: 'Chưa kiểm', v: 'giá dự kiến để ở mức claim, chưa phơi như thật', claim: true },
  ],
  vouch: 'Giới thiệu ấm khả dụng qua người bảo chứng của .touch',
  gate: 'Match thiếu chuỗi dẫn chứng → không xuất (cổng fail-loud + bite test)',
};
