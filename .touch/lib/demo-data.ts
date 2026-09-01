import type { ChainRow, MatchCardData, Tier } from './content';

/**
 * Du lieu DEMO cho Hub prototype. KHONG phai doanh nghiep that: moi ten cong ty
 * la hu cau minh hoa, gan co DEMO va nhan DEMO DATA hien tren giao dien.
 * Provenance moi match tu mach lac (nguon cau, nguon cung, claim) thay vi dung
 * chung mot bo nguon, de man demo nhat quan truoc mat khach enterprise.
 */
export const DEMO = true;

export type Badge = 'VOUCHED' | 'READY';

export type HubMatch = {
  code: string;
  tag: string;
  domainId: string;
  score: number;
  demand: { name: string; desc: string };
  supply: { name: string; desc: string };
  short: string;
  cap: string;
  badge: Badge;
  chain: ChainRow[];
  vouch: string;
  gate: string;
};

const GATE = 'Cổng đã cắn: 1 match giá dự kiến vô căn cứ bị chặn trong lô này (bite test pass)';

export const hubMatches: HubMatch[] = [
  {
    code: 'MATCH-0042',
    tag: 'MATCH-0042 · độ khớp cao',
    domainId: 'supporting-industry / q3-2026',
    score: 0.91,
    demand: { name: 'Cơ khí Chính Xác Đông Á', desc: 'cần gia công CNC 5 trục, thép không gỉ, 2.000 chi tiết/tháng' },
    supply: { name: 'Nhà máy Precision Trường Sơn', desc: 'CNC 5 trục, ISO 9001, công suất dư 3.500 chi tiết/tháng' },
    short: 'Đông Á ⇄ Precision Trường Sơn',
    cap: 'CNC 5 trục · thép không gỉ',
    badge: 'VOUCHED',
    chain: [
      { k: 'Vì sao khớp', v: 'Nhu cầu CNC 5 trục ↔ năng lực CNC 5 trục (overlay NL∩YC)' },
      { k: 'Nguồn cầu', v: 'snapshot hồ sơ năng lực', tier: { label: 'TIER B', level: 'B' }, tail: ' kiểm 06/2026' },
      { k: 'Nguồn cung', v: 'giấy chứng nhận ISO 9001', tier: { label: 'TIER A', level: 'A' } },
      { k: 'Chưa kiểm', v: 'giá dự kiến để ở mức claim, chưa phơi như sự thật cứng', claim: true },
      { k: 'Ngày kiểm', v: '14/07/2026 · người ký duyệt: chuyên gia gác cổng' },
    ],
    vouch: 'Giới thiệu ấm khả dụng qua người bảo chứng · sẵn sàng kết nối',
    gate: GATE,
  },
  {
    code: 'MATCH-0039',
    tag: 'MATCH-0039 · độ khớp cao',
    domainId: 'supporting-industry / q3-2026',
    score: 0.87,
    demand: { name: 'Nhựa Kỹ Thuật Minh Long', desc: 'cần ép nhựa kỹ thuật POM, 50.000 sản phẩm/tháng' },
    supply: { name: 'Khuôn mẫu Á Châu', desc: 'khuôn ép chính xác, dung sai 5µm, xưởng ép sẵn có' },
    short: 'Nhựa KT Minh Long ⇄ Khuôn mẫu Á Châu',
    cap: 'ép nhựa kỹ thuật · khuôn chính xác',
    badge: 'READY',
    chain: [
      { k: 'Vì sao khớp', v: 'Nhu cầu ép POM ↔ năng lực khuôn và ép (overlay NL∩YC)' },
      { k: 'Nguồn cầu', v: 'snapshot đơn hàng ép nhựa', tier: { label: 'TIER B', level: 'B' }, tail: ' kiểm 05/2026' },
      { k: 'Nguồn cung', v: 'hồ sơ năng lực khuôn và ép', tier: { label: 'TIER B', level: 'B' }, tail: ' kiểm 06/2026' },
      { k: 'Chưa kiểm', v: 'đơn giá khuôn để ở mức claim, chưa phơi như sự thật cứng', claim: true },
      { k: 'Ngày kiểm', v: '12/07/2026 · người ký duyệt: chuyên gia gác cổng' },
    ],
    vouch: 'Chưa gán người bảo chứng · đủ điều kiện xuất',
    gate: GATE,
  },
  {
    code: 'MATCH-0035',
    tag: 'MATCH-0035 · độ khớp khá',
    domainId: 'supporting-industry / q3-2026',
    score: 0.83,
    demand: { name: 'Điện tử Tân Bình', desc: 'cần bo mạch PCB 4 lớp, 5.000 pcs, RoHS' },
    supply: { name: 'PCB Hưng Gia', desc: 'bo mạch 4-6 lớp, dây chuyền SMT' },
    short: 'Điện tử Tân Bình ⇄ PCB Hưng Gia',
    cap: 'bo mạch 4 lớp · 5.000 pcs',
    badge: 'READY',
    chain: [
      { k: 'Vì sao khớp', v: 'Nhu cầu PCB 4 lớp ↔ năng lực 4-6 lớp (overlay NL∩YC)' },
      { k: 'Nguồn cầu', v: 'snapshot yêu cầu kỹ thuật', tier: { label: 'TIER B', level: 'B' }, tail: ' kiểm 06/2026' },
      { k: 'Nguồn cung', v: 'chứng nhận RoHS và dây chuyền SMT', tier: { label: 'TIER A', level: 'A' } },
      { k: 'Chưa kiểm', v: 'sản lượng đỉnh để ở mức claim, chưa phơi như sự thật cứng', claim: true },
      { k: 'Ngày kiểm', v: '11/07/2026 · người ký duyệt: chuyên gia gác cổng' },
    ],
    vouch: 'Chưa gán người bảo chứng · đủ điều kiện xuất',
    gate: GATE,
  },
  {
    code: 'MATCH-0031',
    tag: 'MATCH-0031 · độ khớp khá',
    domainId: 'supporting-industry / q3-2026',
    score: 0.79,
    demand: { name: 'Đúc Áp Lực Sông Bé', desc: 'cần phôi đúc hợp kim nhôm ADC12, 8 tấn/tháng' },
    supply: { name: 'Nhôm Đại Phát', desc: 'cung hợp kim nhôm ADC12, chứng nhận thành phần' },
    short: 'Đúc áp lực Sông Bé ⇄ Nhôm Đại Phát',
    cap: 'hợp kim nhôm · phôi đúc',
    badge: 'READY',
    chain: [
      { k: 'Vì sao khớp', v: 'Nhu cầu ADC12 ↔ năng lực cung ADC12 (overlay NL∩YC)' },
      { k: 'Nguồn cầu', v: 'snapshot nhu cầu phôi đúc', tier: { label: 'TIER B', level: 'B' }, tail: ' kiểm 06/2026' },
      { k: 'Nguồn cung', v: 'chứng nhận thành phần hợp kim', tier: { label: 'TIER A', level: 'A' } },
      { k: 'Chưa kiểm', v: 'cam kết giao đúng hạn để ở mức claim, chưa phơi như sự thật cứng', claim: true },
      { k: 'Ngày kiểm', v: '10/07/2026 · người ký duyệt: chuyên gia gác cổng' },
    ],
    vouch: 'Chưa gán người bảo chứng · đủ điều kiện xuất',
    gate: GATE,
  },
];

export type RegistryRow = { name: string; cap: string; tier: Tier; tierLabel: string };

/*
 * Tier o day la tier NGUON cua fact nang luc, nhat quan voi chuoi provenance
 * cua match tuong ung (PCB Hưng Gia: chung nhan RoHS tier A trong MATCH-0035).
 * Dong tier C giu vi du CLAIM: thuc the moi, ho so tu khai chua kiem.
 */
export const registry: RegistryRow[] = [
  { name: 'Precision Trường Sơn', cap: 'CNC 5 trục, ISO 9001', tier: 'A', tierLabel: 'A' },
  { name: 'Khuôn mẫu Á Châu', cap: 'Khuôn ép, dung sai 5µm', tier: 'B', tierLabel: 'B' },
  { name: 'PCB Hưng Gia', cap: 'Bo mạch 4-6 lớp, SMT', tier: 'A', tierLabel: 'A' },
  { name: 'Cao su Kỹ thuật Việt Hưng', cap: 'Gioăng, phớt cao su kỹ thuật', tier: 'C', tierLabel: 'CLAIM' },
];

export type Kpi = { k: string; v: string; t: string; warn: boolean };

export const kpis: Kpi[] = [
  { k: 'Facts verified_primary', v: '1.284', t: '↑ 96% có provenance', warn: false },
  { k: 'Match chứng-minh-được', v: '47', t: '↑ 12 tuần này', warn: false },
  { k: 'Giới thiệu đã bảo chứng', v: '12', t: '3 đang đi hết vòng', warn: false },
  { k: 'Match bị cổng chặn', v: '8', t: 'thiếu dẫn chứng · không xuất', warn: true },
];

/** Dung MatchCardData day du cho MatchDetail tu mot HubMatch. */
export function toMatchCardData(m: HubMatch): MatchCardData {
  return {
    tag: m.tag,
    id: m.domainId,
    score: m.score,
    demand: { role: 'Cầu / Demand', name: m.demand.name, desc: m.demand.desc },
    supply: { role: 'Cung / Supply', name: m.supply.name, desc: m.supply.desc },
    chainHeading: 'Provenance chain · truy vết được',
    chain: m.chain,
    vouch: m.vouch,
    gate: m.gate,
  };
}
