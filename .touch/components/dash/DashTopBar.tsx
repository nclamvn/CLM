import { Icon } from './Icon';
import { PortalSwitcher } from '@/components/portal/PortalSwitcher';
import { statusMeta } from '@/lib/project-status';

export function DashTopBar({ title, subtitle }: { title?: string; subtitle?: string } = {}) {
  return (
    <header className="dash-topbar">
      <div>
        <div className="dash-topbar__title">{title ?? statusMeta.title}</div>
        <div className="dash-topbar__sub">{subtitle ?? statusMeta.subtitle}</div>
      </div>
      <div className="dash-topbar__controls">
        <PortalSwitcher active="dashboard" />
        <button type="button" className="dash-prov">
          <span className="dash-prov__dot" aria-hidden="true" />
          Provenance ON
        </button>
        <span className="dash-vdiv" aria-hidden="true" />
        <button type="button" className="dash-iconbtn" aria-label="Tim kiem">
          <Icon name="search" />
        </button>
        <button type="button" className="dash-iconbtn" aria-label="Thong bao">
          <Icon name="bell" />
        </button>
        <div className="dash-user">
          <span className="dash-avatar">LN</span>
          <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Lam</span>
            <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Project Lead</span>
          </span>
          <Icon name="chevron" size={16} />
        </div>
      </div>
    </header>
  );
}
