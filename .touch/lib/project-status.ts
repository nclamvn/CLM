/**
 * project-status.ts · Chi con dieu huong (nav) va nhan mac dinh cua thanh tren (statusMeta).
 * Khong chua so. Xem ghi chu XOA ben duoi.
 */
export const statusMeta = {
  title: 'Tổng quan',
  subtitle: 'Hub cung cầu công nghệ chiến lược, chứng minh được',
} as const;

// XOA 29/09/2026: kpis, projectComponents, supply, demand, deadline, workQueue, repos, evidence.
// Day la anh chup tay ngay 19/07/2026 (14 don vi, 64 claim, "Gates 4/4", "DEADLINE 20/07 (NGAY
// MAI)") kem HANG VIEC NOI BO co ten nguoi, hien tren trang mac dinh cua dashboard. So tren web
// phai sinh tu du lieu (lib/hub-*.json); cong check-mo-dau.mjs chan viec them lai kho so go tay
// vao file nay: file chi duoc xuat nav va statusMeta.

/** href rỗng = màn chưa dựng, sidebar hiển thị trạng thái "sắp có" trung thực, không dead-link. */
export const nav = [
  { label: 'Tổng quan', href: '/dashboard' },
  { label: 'Toàn cảnh thị trường', href: '/dashboard/thi-truong' },
  { label: 'Dòng thời cuộc', href: '/dashboard/thoi-cuoc' },
  { label: 'Đồ thị cung cầu', href: '/dashboard/do-thi' },
  { label: 'Hồ sơ đơn vị', href: '/dashboard/don-vi' },
  { label: 'Engine & Matching', href: '/dashboard/matching' },
  { label: 'Evidence Registry', href: '/dashboard/registry' },
  { label: 'Tiến độ & Gates', href: '' },
  { label: 'Rủi ro & Hành động', href: '' },
  { label: 'Tài liệu & SOP', href: '' },
  { label: 'Repositories', href: '/dashboard/repos' },
  { label: 'Cài đặt', href: '' },
];
