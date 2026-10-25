import { statusMeta } from '@/lib/project-status';
import { SearchTrigger } from '@/components/proof/ProofLayer';
import { matchMeta } from '@/lib/cncl-match';
import { tenNguoi } from '@/lib/dinh-dang';

/**
 * Thanh tren. Tieu de la H1 cua trang (moi trang mot H1, chuan truy cap).
 * 01/10/2026 (nghiem thu enterprise): go menu "Dashboard ▾", nut "Provenance ON" va chuong thong
 * bao vi ca ba khong lam gi. Nguoi dung hien ten day du co dau va vai tro that trong he.
 * 25/10/2026: khoi nay tung ghi "Nguoi dang xem: ..." go cung, goi y co dang nhap trong khi he
 * khong co. Nay ghi dung su that: day la nguoi gac cong cua he, doc tu so chu ky.
 */
export function DashTopBar({ title, subtitle }: { title?: string; subtitle?: string } = {}) {
  return (
    <header className="dash-topbar">
      <div className="dash-topbar__chu">
        <h1 className="dash-topbar__title">{title ?? statusMeta.title}</h1>
        <div className="dash-topbar__sub">{subtitle ?? statusMeta.subtitle}</div>
      </div>
      <div className="dash-topbar__controls">
        <SearchTrigger />
        <div className="dash-user" role="group" aria-label={`Người gác cổng của hệ: ${tenNguoi(matchMeta.nguoiKy)}`}>
          <span className="dash-avatar" aria-hidden="true">{tenNguoi(matchMeta.nguoiKy).split(' ').pop()?.[0]}</span>
          <span className="dash-user__chu">
            <span className="dash-user__ten">{tenNguoi(matchMeta.nguoiKy)}</span>
            <span className="dash-user__vai">Người gác cổng của hệ</span>
          </span>
        </div>
      </div>
    </header>
  );
}
