import { TouchBrand } from '@/components/brand/TouchBrand';
import { Icon } from './Icon';
import { nav } from '@/lib/project-status';

const ICONS = ['home', 'layers', 'cpu', 'shield', 'gauge', 'alert', 'doc', 'branch', 'gear'] as const;

export function DashSidebar() {
  return (
    <aside className="dash-sidebar">
      <div className="dash-sidebar__brand">
        <TouchBrand mode="full" theme="dark" size="md" href="/dashboard" subtitle="B2B Matching Platform" />
      </div>
      <nav className="dash-nav" aria-label="Dieu huong chinh">
        {nav.map((n, i) => (
          <a
            key={n.label}
            href="#"
            className={`dash-nav__item${n.active ? ' is-active' : ''}`}
            aria-current={n.active ? 'page' : undefined}
          >
            <Icon name={ICONS[i]} className="dash-nav__icon" />
            <span>{n.label}</span>
          </a>
        ))}
      </nav>
      <div className="dash-sidebar__spacer" />
      <div className="dash-project">
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>Dự án</div>
        <div className="dash-project__row">
          <TouchBrand mode="compact" theme="dark" size="xs" />
          <span className="chip chip--poc">POC</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 12 }}>Domain</div>
        <div className="dash-project__row">
          <span style={{ color: 'var(--color-text-link)', fontSize: 13 }}>Solo Entrepreneur</span>
          <span className="chip chip--public">SE</span>
        </div>
      </div>
      <div className="dash-brandfoot">
        <div className="dash-brandfoot__tag">Provenance is our DNA</div>
        <div className="dash-brandfoot__dots" aria-hidden="true" />
      </div>
    </aside>
  );
}
