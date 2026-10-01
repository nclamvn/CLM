/**
 * project-status.ts · Chi con dieu huong (nav) va nhan mac dinh cua thanh tren (statusMeta).
 * Khong chua so. Xem ghi chu XOA ben duoi.
 */
export const statusMeta = {
  title: 'Tổng quan',
  subtitle: 'Cung cầu công nghệ chiến lược, mọi con số có nguồn',
} as const;

// XOA 29/09/2026: kpis, projectComponents, supply, demand, deadline, workQueue, repos, evidence.
// Day la anh chup tay ngay 19/07/2026 (14 don vi, 64 claim, "Gates 4/4", "DEADLINE 20/07 (NGAY
// MAI)") kem HANG VIEC NOI BO co ten nguoi, hien tren trang mac dinh cua dashboard. So tren web
// phai sinh tu du lieu (lib/hub-*.json); cong check-mo-dau.mjs chan viec them lai kho so go tay
// vao file nay: file chi duoc xuat nav va statusMeta.

/**
 * Dieu huong chinh. 01/10/2026 (nghiem thu enterprise): GO bon muc "sap co" (Tien do & Gates, Rui
 * ro & Hanh dong, Tai lieu & SOP, Cai dat). Muc nao hien tren man thi phai mo duoc; cong
 * check-thuat-ngu.mjs chan href rong quay lai. Ten muc theo bang thuat ngu lib/thuat-ngu.mjs.
 */
export const nav = [
  { label: 'Tổng quan', href: '/dashboard' },
  { label: 'Hỏi đáp có nguồn', href: '/dashboard/hoi-dap' },
  { label: 'Cầu thật', href: '/dashboard/cau-that' },
  { label: 'Toàn cảnh thị trường', href: '/dashboard/thi-truong' },
  { label: 'Dòng thời cuộc', href: '/dashboard/thoi-cuoc' },
  { label: 'Đồ thị cung cầu', href: '/dashboard/do-thi' },
  { label: 'Hồ sơ đơn vị', href: '/dashboard/don-vi' },
  { label: 'Ghép cung cầu', href: '/dashboard/matching' },
  { label: 'Sổ nguồn', href: '/dashboard/registry' },
  { label: 'Báo cáo khoảng trống', href: '/dashboard/bao-cao' },
  { label: 'Phương pháp', href: '/dashboard/phuong-phap' },
  { label: 'Kho mã', href: '/dashboard/repos' },
];
