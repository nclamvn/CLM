/**
 * TouchBrand - component logo `.touch` DUY NHAT cho toan he thong.
 * Cam dung thu cong logo o tung trang. Dot luon la brand red token, khong glow, khong gradient chu.
 * mode: full (dot + word + subtitle) | compact (dot + word) | mark (chi dot).
 * theme: dark (word trang) | light (word den). size: sm | md | lg.
 * Token-only (khong raw color/spacing/font trong component). aria-label=".touch"; subtitle decorative.
 */
export type TouchBrandMode = 'full' | 'compact' | 'mark';
export type TouchBrandTheme = 'dark' | 'light';
export type TouchBrandSize = 'xs' | 'sm' | 'md' | 'lg';

export function TouchBrand({
  mode = 'full',
  theme = 'dark',
  size = 'md',
  href,
  subtitle,
}: {
  mode?: TouchBrandMode;
  theme?: TouchBrandTheme;
  size?: TouchBrandSize;
  href?: string;
  subtitle?: string;
}) {
  const cls = `touch-brand touch-brand--${mode} touch-brand--${theme} touch-brand--${size}`;
  const body = (
    <>
      <span className="touch-brand__row">
        <span className="touch-brand__dot" aria-hidden="true" />
        {mode !== 'mark' ? <span className="touch-brand__word">touch</span> : null}
      </span>
      {mode === 'full' && subtitle ? (
        <span className="touch-brand__sub" aria-hidden="true">{subtitle}</span>
      ) : null}
    </>
  );
  if (href) {
    return (
      <a className={cls} href={href} aria-label=".touch">
        {body}
      </a>
    );
  }
  return (
    <span className={cls} role="img" aria-label=".touch">
      {body}
    </span>
  );
}
