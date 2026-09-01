import { TouchBrand } from '@/components/brand/TouchBrand';

/**
 * Preview token/font Pha 0 (dev). KHONG phai Dashboard that (Pha 1 chua dung).
 * Muc dich: mat-kiem he token deep-navy + Inter render du dau tieng Viet + brand lockup.
 */
export const metadata = { title: 'Token preview - .touch v2', robots: { index: false } };

const VN = 'Đơn vị chiến lược, chứng minh được, bằng chứng verbatim. ằẳẵặ ầấẩẫậ ộợựữ ỳỹ đĐ 1.284 ₫';

const swatches: [string, string][] = [
  ['bg.canvas', '--color-bg-canvas'],
  ['bg.surface.1', '--color-bg-surface-1'],
  ['bg.surface.2', '--color-bg-surface-2'],
  ['bg.surface.3', '--color-bg-surface-3'],
  ['accent.blue', '--color-accent-blue'],
  ['accent.cyan', '--color-accent-cyan'],
  ['accent.purple', '--color-accent-purple'],
  ['accent.amber', '--color-accent-amber'],
  ['accent.green', '--color-accent-green'],
  ['accent.red', '--color-accent-red'],
  ['brand.dot', '--color-brand-dot'],
  ['teal.dark', '--color-accent-teal-dark'],
];

const typeRows: [string, string][] = [
  ['t-heading-01', 'Executive page title'],
  ['t-heading-02', 'Dashboard tong quan'],
  ['t-title-01', 'Section / panel title'],
  ['t-body-01', VN],
  ['t-body-02', VN],
  ['t-label-upper', 'Section eyebrow'],
  ['t-mono-01', 'commit ea45bad / 303ea12'],
  ['t-metric-xl', '124'],
];

const shell = {
  minHeight: '100vh',
  background: 'var(--color-bg-canvas)',
  color: 'var(--color-text-primary)',
  fontFamily: 'var(--font-sans)',
  padding: '40px 48px',
} as const;
const card = {
  background: 'var(--color-bg-surface-1)',
  border: '1px solid var(--color-border-subtle)',
  borderRadius: 'var(--radius-lg)',
  padding: 'var(--space-5)',
  boxShadow: 'var(--shadow-panel)',
} as const;

export default function TokenPreviewPage() {
  return (
    <div style={shell}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 }}>
        <TouchBrand mode="full" theme="dark" size="lg" href="/dev/tokens" subtitle="B2B Matching Platform" />
        <span className="t-label-upper" style={{ color: 'var(--color-text-muted)' }}>
          Design tokens preview - Pha 0 (khong phai Dashboard)
        </span>
      </div>

      <section style={{ ...card, marginBottom: 24 }}>
        <div className="t-label-upper" style={{ color: 'var(--color-text-secondary)', marginBottom: 16 }}>Brand lockup - theme dark</div>
        <div style={{ display: 'flex', gap: 48, alignItems: 'flex-end' }}>
          <TouchBrand mode="full" theme="dark" size="md" href="/dev/tokens" subtitle="B2B Matching Platform" />
          <TouchBrand mode="compact" theme="dark" size="lg" href="/dev/tokens" />
          <TouchBrand mode="mark" theme="dark" size="lg" href="/dev/tokens" />
        </div>
        <div className="t-label-upper" style={{ color: 'var(--color-text-secondary)', margin: '24px 0 16px' }}>Brand lockup - theme light</div>
        <div style={{ display: 'flex', gap: 48, alignItems: 'flex-end', background: 'var(--color-text-primary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-5)' }}>
          <TouchBrand mode="full" theme="light" size="md" href="/dev/tokens" subtitle="B2B Matching Platform" />
          <TouchBrand mode="compact" theme="light" size="lg" href="/dev/tokens" />
          <TouchBrand mode="mark" theme="light" size="lg" href="/dev/tokens" />
        </div>
        <div className="t-label-upper" style={{ color: 'var(--color-text-secondary)', margin: '24px 0 16px' }}>Sizes - xs / sm / md / lg</div>
        <div style={{ display: 'flex', gap: 40, alignItems: 'flex-end' }}>
          <TouchBrand mode="compact" theme="dark" size="xs" />
          <TouchBrand mode="compact" theme="dark" size="sm" />
          <TouchBrand mode="compact" theme="dark" size="md" />
          <TouchBrand mode="compact" theme="dark" size="lg" />
        </div>
      </section>

      <section style={{ ...card, marginBottom: 24 }}>
        <div className="t-label-upper" style={{ color: 'var(--color-text-secondary)', marginBottom: 16 }}>Color tokens</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12 }}>
          {swatches.map(([name, v]) => (
            <div key={v}>
              <div style={{ height: 56, borderRadius: 'var(--radius-md)', background: `var(${v})`, border: '1px solid var(--color-border-subtle)' }} />
              <div className="t-mono-01" style={{ color: 'var(--color-text-secondary)', marginTop: 6 }}>{name}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ ...card, marginBottom: 24 }}>
        <div className="t-label-upper" style={{ color: 'var(--color-text-secondary)', marginBottom: 16 }}>Typography - Inter, mau tieng Viet du dau</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {typeRows.map(([cls, text], i) => (
            <div key={i} style={{ borderBottom: '1px solid var(--color-border-muted)', paddingBottom: 12 }}>
              <span className="t-mono-01" style={{ color: 'var(--color-text-muted)', marginRight: 16 }}>{cls}</span>
              <span className={cls} style={{ color: 'var(--color-text-primary)' }}>{text}</span>
            </div>
          ))}
        </div>
      </section>

      <section style={card}>
        <div className="t-label-upper" style={{ color: 'var(--color-text-secondary)', marginBottom: 16 }}>Radius scale</div>
        <div style={{ display: 'flex', gap: 16 }}>
          {['--radius-sm', '--radius-md', '--radius-lg', '--radius-xl'].map((r) => (
            <div key={r} style={{ width: 72, height: 56, background: 'var(--color-accent-blue)', borderRadius: `var(${r})`, opacity: 0.85 }} />
          ))}
        </div>
      </section>
    </div>
  );
}
