/**
 * thuat-ngu.mjs · Bang thuat ngu cua giao dien .touch (mot ngon ngu, mot cach goi cho moi khai niem).
 *
 * VI SAO CO (01/10/2026, nghiem thu giao dien enterprise): moi trang lan 8 den 29 tu tieng Anh va tu
 * noi bo (B2B Matching Platform, Evidence Registry, Matching Workbench, Provenance ON, tier A, GATE
 * PASS, engine, claim). Nguoi mua la co quan va doanh nghiep Viet; nha dau tu doc nhanh. Moi khai
 * niem mot ten tieng Viet co dinh; chi tiet ky thuat (ten luat ghep, ma phien ban) vao chu thich
 * hoac trang Phuong phap. Cong check-thuat-ngu.mjs doc bang CAM o duoi.
 *
 * DUOC GIU (ten rieng hoac quy uoc chung): ".touch" (thuong hieu), "match" (cap cung cau da duoc
 * nguoi gac cong ky, da dinh nghia o trang Phuong phap), ma dinh danh (MATCH-0001, P01, QĐ 21/2026),
 * ten viet tat co trong nguon (AI, UAV, BESS, SMR, CSV, PDF).
 */
export const THAY = {
  'Dashboard': 'Bảng điều khiển',
  'Engine & Matching': 'Ghép cung cầu',
  'Matching Workbench': 'Bàn ghép cung cầu',
  'Evidence Registry': 'Sổ nguồn',
  'evidence': 'câu nguồn',
  'claim': 'câu nguồn',
  'tier A/B/C': 'hạng A/B/C',
  'snapshot': 'bản chụp',
  'engine': 'máy ghép',
  'token': 'từ khoá',
  'GATE PASS / GATE ĐỎ': 'Kiểm định đạt / Kiểm định chưa đạt',
  'Chuỗi cổng': 'Kiểm định tự động',
  'Provenance': 'nguồn gốc',
  'Hub': 'bản đồ cung cầu',
  'Lớp phủ nguồn': 'Xem nguồn',
};

/** Tu cam tren chu hien thi (phan biet hoa thuong, so nguyen tu). */
export const CAM = [
  'Dashboard', 'Provenance', 'Engine', 'engine', 'Workbench', 'Registry', 'Evidence', 'evidence',
  'Gate', 'Gates', 'GATE', 'POC', 'B2B', 'Domain', 'Platform', 'tier', 'Tier', 'Matching', 'PASS',
  'LIVE', 'Live', 'Hub', 'claim', 'Claim', 'snapshot', 'Snapshot', 'verbatim', 'normalized', 'Proof',
  'Overlay', 'Supply', 'Demand', 'Vouch', 'token', 'Token', 'rule', 'Rule', 'Chuỗi cổng', 'chuỗi cổng',
];
