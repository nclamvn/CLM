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
// 25/10/2026 (G7): menu nhom theo viec. Moi muc mang nhom va bieu tuong RIENG (truoc day bieu tuong
// gan theo vi tri, doi thu tu la lech). Kho ma la trang ky thuat, ra khoi menu chinh xuong nhom "phu".
// Cong check-menu.mjs: moi trang dashboard thuoc dung mot muc, moi muc co trang, nhom hop le.
export const NHOM_MENU = [
  { k: 'chinh', ten: '' },
  { k: 'van_hanh', ten: 'Vận hành' },
  { k: 'thi_truong', ten: 'Thị trường' },
  { k: 'bang_chung', ten: 'Bằng chứng' },
  { k: 'bao_cao', ten: 'Báo cáo' },
  { k: 'phu', ten: 'Kỹ thuật' },
] as const;

export const nav = [
  { label: 'Tổng quan', href: '/dashboard', nhom: 'chinh', icon: 'home' },
  { label: 'Cầu thật', href: '/dashboard/cau-that', nhom: 'van_hanh', icon: 'target' },
  { label: 'Điều phối', href: '/dashboard/dieu-phoi', nhom: 'van_hanh', icon: 'check' },
  { label: 'Ghép cung cầu', href: '/dashboard/matching', nhom: 'van_hanh', icon: 'cpu' },
  { label: 'Toàn cảnh thị trường', href: '/dashboard/thi-truong', nhom: 'thi_truong', icon: 'gauge' },
  { label: 'Dòng thời cuộc', href: '/dashboard/thoi-cuoc', nhom: 'thi_truong', icon: 'bell' },
  { label: 'Đồ thị cung cầu', href: '/dashboard/do-thi', nhom: 'thi_truong', icon: 'layers' },
  { label: 'Hỏi đáp có nguồn', href: '/dashboard/hoi-dap', nhom: 'bang_chung', icon: 'search' },
  { label: 'Sổ nguồn', href: '/dashboard/registry', nhom: 'bang_chung', icon: 'shield' },
  { label: 'Hồ sơ đơn vị', href: '/dashboard/don-vi', nhom: 'bang_chung', icon: 'people' },
  { label: 'Báo cáo khoảng trống', href: '/dashboard/bao-cao', nhom: 'bao_cao', icon: 'alert' },
  { label: 'Phương pháp', href: '/dashboard/phuong-phap', nhom: 'bao_cao', icon: 'doc' },
  { label: 'Kho mã', href: '/dashboard/repos', nhom: 'phu', icon: 'branch' },
] as const;
