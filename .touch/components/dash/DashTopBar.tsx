import { statusMeta } from '@/lib/project-status';
import { SearchTrigger } from '@/components/proof/ProofLayer';

/**
 * Thanh tren. Tieu de la H1 cua trang (moi trang mot H1, chuan truy cap).
 * 01/10/2026 (nghiem thu enterprise): go menu "Dashboard ▾", nut "Provenance ON" va chuong thong
 * bao vi ca ba khong lam gi. Nguoi dung hien ten day du co dau va vai tro that trong he.
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
        <div className="dash-user" aria-label="Người đang xem: Nguyễn Cảnh Lâm, người gác cổng">
          <span className="dash-avatar" aria-hidden="true">L</span>
          <span className="dash-user__chu">
            <span className="dash-user__ten">Nguyễn Cảnh Lâm</span>
            <span className="dash-user__vai">Người gác cổng</span>
          </span>
        </div>
      </div>
    </header>
  );
}
