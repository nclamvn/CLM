import { redirect } from 'next/navigation';

/**
 * /hub · Da GO trang "Hub minh hoa" (01/10/2026, nghiem thu giao dien enterprise).
 *
 * Trang nay tung trinh bay du lieu GIA LAP cua mot nganh khac (ten doanh nghiep hu cau, KPI gia)
 * ngay trong san pham that, pha dung loi hua "moi con so deu co nguon". Y tuong mo rong sang
 * nganh moi duoc ke bang slide, khong bang du lieu gia. Duong dan cu van dan ve bang dieu khien
 * de khong vo link da gui di.
 */
export default function HubDaGo() {
  redirect('/dashboard');
}
