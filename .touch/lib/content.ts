/**
 * content.ts · Chu dung chung o khung site (lop ngoai bang dieu khien).
 *
 * 01/10/2026 (nghiem thu giao dien enterprise): go toan bo copy cua landing cu va Hub minh hoa
 * (tagline "Provenance-backed B2B matching", "Mở Hub", demo match gia lap). Chu tren man doc theo
 * bang thuat ngu o lib/thuat-ngu.mjs; cong check-thuat-ngu.mjs chan tu tieng Anh quay lai.
 */
export const ui = {
  skipToContent: 'Bỏ qua tới nội dung chính',
} as const;

/** Trang 404. */
export const notFound = {
  code: '404',
  titlePre: 'Trang này ',
  titleEm: 'không tồn tại',
  titleTail: '.',
  p: 'Đường dẫn không có trong hệ thống. Giống một con số không truy được nguồn, chúng tôi thà nói "không có" còn hơn trả về một trang sai.',
  home: 'Về trang đầu',
  dashboard: 'Mở bảng điều khiển',
} as const;
