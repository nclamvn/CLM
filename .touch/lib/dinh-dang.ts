/**
 * dinh-dang.ts · Dinh dang hien thi dung chung (01/10/2026, nghiem thu enterprise).
 *   ngayVN   'yyyy-mm-dd' hoac ISO -> 'dd/mm/yyyy'. Moi ngay tren man mot kieu viet.
 *   tenNguoi ma nguoi ky trong so (khong dau, de may doc) -> ten day du co dau de nguoi doc.
 *            So chu ky giu nguyen ma goc; chi lop hien thi doi.
 */
export function ngayVN(s: string | null | undefined): string {
  if (!s) return '';
  const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : String(s);
}

const TEN_NGUOI: Record<string, string> = { 'Lam Nguyen': 'Nguyễn Cảnh Lâm' };
export function tenNguoi(ma: string | null | undefined): string {
  if (!ma) return '';
  return TEN_NGUOI[ma] ?? ma;
}
