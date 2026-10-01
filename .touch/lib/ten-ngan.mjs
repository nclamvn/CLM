/**
 * ten-ngan.mjs · Ten ngan chuan cho don vi co ten dai (01/10/2026, nghiem thu enterprise muc 14).
 * Truoc day bieu do cat ten giua chung ("Công ty cổ phần Công nghệ an ninh m…"). Nay moi don vi co
 * MOT ten ngan co dinh, dung chung cho Sankey va so do ghep; ten day du luon o tooltip va the nguon.
 *
 * Thu tu: (1) bang tay cho ten khong rut theo luat duoc, (2) chu viet tat trong ngoac o cuoi ten,
 * (3) bo tien to phap ly ("Công ty cổ phần", "Công ty TNHH", "Tổng công ty"...). Khong doan ten.
 * Cong check-ho-so.mjs: TEN_NGAN_TRUNG (hai don vi cung ten ngan), TEN_NGAN_THUA (bang tay co
 * ten khong con trong registry), TEN_NGAN_DAI (van dai qua NGUONG).
 */
export const NGUONG = 35;
export const BANG_TAY = {
  'Viện Hàn lâm Khoa học và Công nghệ Việt Nam': 'Viện Hàn lâm KH&CN Việt Nam',
  'Trường Đại học Khoa học Tự nhiên, Đại học Quốc gia Hà Nội': 'ĐH KHTN, ĐHQG Hà Nội',
  'Viện Tế bào gốc, Trường Đại học Khoa học Tự nhiên, ĐHQG TP.HCM': 'Viện Tế bào gốc, ĐHQG TP.HCM',
  'Nhà máy Kiểm thử và Đóng gói tiên tiến chip bán dẫn FPT': 'Nhà máy đóng gói chip FPT',
  'Phòng Thí nghiệm trọng điểm công nghệ lọc, hóa dầu': 'PTN trọng điểm lọc, hoá dầu',
  'Viện Cơ điện Nông nghiệp và Công nghệ Sau thu hoạch': 'Viện Cơ điện NN và CNSTH',
  'Viện nghiên cứu Tế bào gốc và Công nghệ Gen Vinmec': 'Viện Tế bào gốc và Gen Vinmec',
  'Công ty TNHH Công nghệ Sinh học xanh Nhật Lan': 'Sinh học xanh Nhật Lan',
  'Bệnh viện Trung ương Quân đội 108': 'Bệnh viện TWQĐ 108',
  'Liên danh tư vấn TEDI - TRICC - TEDI SOUTH': 'Liên danh TEDI - TRICC',
  'Công ty cổ phần thuốc thú y Trung ương NAVETCO': 'NAVETCO',
  'Công ty Cổ phần Giải pháp Năng lượng VinES': 'VinES',
};
const TIEN_TO = /^(Tổng công ty cổ phần|Tổng công ty|Công ty cổ phần|Công ty CP|Công ty TNHH|Công ty)\s+/i;

export function tenNgan(ten) {
  if (BANG_TAY[ten]) return BANG_TAY[ten];
  const vt = ten.match(/\(([A-Za-zĐđ0-9&-]{2,12})\)\s*$/);
  if (vt) return vt[1];
  const bo = ten.replace(TIEN_TO, '');
  return bo.length >= 2 ? bo : ten;
}
