/* TIP-PORTAL-V1 muc 2: hop dong trung thuc du lieu.
   Moi vung du lieu phai khai bao mot trong bon trang thai machine-readable. */
export type DataTruthState = 'REAL' | 'DEMO' | 'SYNTHETIC' | 'SCAFFOLD';

/** Nhan hien thi (CSS text-transform: uppercase se in hoa). */
export const TRUTH_LABEL: Record<DataTruthState, string> = {
  REAL: 'Dữ liệu thật',
  DEMO: 'Minh họa',
  SYNTHETIC: 'Synthetic',
  SCAFFOLD: 'Chưa nối',
};

/** Giai thich ngan (title / tooltip). */
export const TRUTH_HINT: Record<DataTruthState, string> = {
  REAL: 'Có nguồn, snapshot và evidence link',
  DEMO: 'Dữ liệu biên soạn để minh họa sản phẩm',
  SYNTHETIC: 'Sinh có seed, dùng kiểm thử engine',
  SCAFFOLD: 'UI đã có nhưng chưa nối logic hoặc dữ liệu thật',
};
