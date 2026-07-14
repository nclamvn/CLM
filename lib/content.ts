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

/** Toan bo copy trang Landing. Tieng Viet chinh, nhan EN mono. */
export const landing = {
  nav: {
    links: [
      { href: '#how', label: 'Cách hoạt động' },
      { href: '#value', label: 'Đơn vị giá trị' },
      { href: '#why', label: 'Vì sao tin được' },
      { href: '#vertical', label: 'Ngành dọc' },
    ],
    hub: 'Mở Hub',
    cta: 'Yêu cầu demo',
  },
  hero: {
    // Tieu de tach 2 dong, giu cum focal in nghieng do tren "chung-minh-duoc".
    line1: 'Chạm đúng đối tác,',
    line2: 'bằng những match ',
    focal: tagline.focal,
    tail: tagline.tail,
    sub: 'Cung gặp cầu là chưa đủ. .touch truy mọi dữ kiện về nguồn, và đặt một người bảo chứng sau mỗi giới thiệu, để giao dịch đi hết vòng.',
    ctaPrimary: 'Yêu cầu demo',
    ctaGhost: 'Xem Hub hoạt động',
    assure: [
      'Mỗi match truy được về nguồn',
      'Có người bảo chứng đứng sau',
      'Không match rác',
    ],
    legend: [
      { color: '#8A8A92', label: 'Cầu', diamond: false },
      { color: '#111113', label: 'Cung', diamond: false },
      { color: '#E4341E', label: 'Khớp', diamond: true },
    ],
  },
  strip: [
    { k: 'Provenance', v: '100%', d: 'fact có chuỗi nguồn gốc' },
    { k: 'Fail-loud', v: '0', d: 'match thiếu dẫn chứng lọt ra' },
    { k: 'Trust layer', v: '1:1', d: 'giới thiệu có người bảo chứng' },
    { k: 'Audit', v: 'by design', d: 'truy vết mọi lúc' },
  ],
  how: {
    tag: 'The pipeline',
    h2pre: 'Một dây chuyền, ',
    h2em: 'hai tầng',
    h2tail: '.',
    lead: 'Tầng dữ liệu biến thông tin phân tán thành registry sạch, kiểm được. Tầng niềm tin đưa giao dịch đi hết vòng. Mỗi khâu có cổng kiểm dừng-ồn-ào nếu dữ liệu không đạt.',
    steps: [
      { layer: 'L1', n: '01', ic: '◇', h: 'Cào đa nguồn', p: 'Thu thập cung và cầu, lưu bản chụp và thời điểm cho mọi bản ghi.' },
      { layer: 'L1', n: '02', ic: '◈', h: 'Tinh lọc + Provenance', p: 'Trích fact kèm dẫn chứng nguyên văn, gắn tier nguồn, tách giá trị đã kiểm khỏi tuyên bố.' },
      { layer: 'L2', n: '03', ic: '▤', h: 'Registry sống', p: 'Nguồn sự thật duy nhất, mỗi fact một định danh, có ngày kiểm và cơ chế làm mới.' },
      { layer: 'L3', n: '04', ic: '⇄', h: 'Match có dẫn chứng', p: 'Ghép cung cầu trên registry, mỗi match xuất kèm chuỗi provenance truy được về nguồn.' },
      { layer: 'Trust', n: '05', ic: '◆', h: 'Bảo chứng', p: 'Người uy tín đứng sau match, track record hệ thống hoá dần vào registry.' },
    ],
  },
  value: {
    tag: 'The atomic unit',
    h2: 'Không phải một danh sách. Một match bạn dám tin.',
    p: 'Đơn vị giá trị của .touch không phải "danh bạ công ty", mà là một cặp ghép kèm lý do khớp, nguồn gốc từng dữ kiện, mức độ đã kiểm, và ai bảo chứng.',
    list: [
      'Bỏ chuỗi dẫn chứng đi, nó tụt về một sàn B2B thường và chết ở tầng niềm tin.',
      'Dữ kiện chưa kiểm được đánh dấu claim, không phơi như sự thật cứng.',
      'Match thiếu chuỗi dẫn chứng bị cổng chặn, không bao giờ ra tới bạn.',
    ],
    cta: 'Mở Hub xem đầy đủ',
  },
  why: {
    tag: 'Why it holds',
    h2pre: 'Tin cậy không phải khẩu hiệu. Nó là ',
    h2em: 'cơ chế',
    h2tail: '.',
    diffs: [
      { ic: '◈', h: 'Chứng-minh-được', p: 'Mọi match truy ngược về từng fact và từng nguồn trong vài bước. Bạn không phải tin ai, bạn tra được.', tg: 'Provenance · evidence span · tier A/B' },
      { ic: '◆', h: 'Tầng niềm tin', p: 'Người uy tín đứng sau mỗi giới thiệu để giao dịch đi hết vòng. Track record tích lũy thành tài sản của hệ thống.', tg: 'Human vouching · track record' },
      { ic: '⏻', h: 'Không rác', p: 'Cổng kiểm dừng-ồn-ào chặn dữ liệu không đạt ngay tại khâu. Thà nói "không có" còn hơn trả match kém.', tg: 'Fail-loud · human-in-the-loop' },
    ],
  },
  vertical: {
    h2pre: 'Bắt đầu từ một ',
    h2em: 'ngành dọc',
    h2tail: ', không phải cả thế giới.',
    p: '.touch dựng registry sống cho từng ngành, nơi cung và cầu đủ dày và có người bảo chứng thật. Một ngành chứng minh xong mở đường cho ngành kế tiếp, dùng chung một engine.',
    pills: [
      { num: '01', label: 'Công nghiệp hỗ trợ và cơ khí chính xác' },
      { num: '02', label: 'Nông sản và chuỗi cung ứng xuất khẩu' },
      { num: '03', label: 'Ngành kế tiếp theo dữ liệu và quan hệ' },
    ],
  },
  cta: {
    h2pre: 'Sẵn sàng thấy match ',
    h2em: 'chứng-minh-được',
    h2tail: ' đầu tiên?',
    p: 'Đặt một buổi demo trên chính dữ liệu ngành của bạn. Không match rác, không cam kết quá lời.',
    ctaPrimary: 'Yêu cầu demo',
    ctaGhost: 'Mở Hub hoạt động',
    email: 'mailto:hello@touch.example',
  },
  footer: {
    blurb: 'Kết nối cung và cầu bằng những match chứng-minh-được, với một người bảo chứng đứng sau.',
    cols: [
      { h: 'Sản phẩm', links: [{ href: '#how', label: 'Cách hoạt động' }, { href: '#value', label: 'Đơn vị giá trị' }, { href: '/hub', label: 'Hub' }] },
      { h: 'Tin cậy', links: [{ href: '#why', label: 'Provenance' }, { href: '#why', label: 'Bảo chứng' }, { href: '#why', label: 'Fail-loud' }] },
      { h: 'Công ty', links: [{ href: '#', label: 'Về .touch' }, { href: '#cta', label: 'Liên hệ' }] },
    ],
  },
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
