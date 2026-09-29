import { ROUTE } from '@/lib/portal-routes';

/* CTADark (VF-L-019): compact, Inter headline, 2 CTA, graphic supply-demand convergence.
   Khong fake runtime, khong hero thu hai. */
function ConvergeGraphic() {
  return (
    <svg className="lp-cta__gfx" viewBox="0 0 220 120" fill="none" aria-hidden="true">
      <g className="lp-cta__gfx-line">
        <path d="M14 30 C 70 40, 90 58, 110 60" />
        <path d="M14 60 C 70 60, 90 60, 110 60" />
        <path d="M14 90 C 70 80, 90 62, 110 60" />
        <path d="M206 30 C 150 40, 130 58, 110 60" />
        <path d="M206 60 C 150 60, 130 60, 110 60" />
        <path d="M206 90 C 150 80, 130 62, 110 60" />
      </g>
      <g className="lp-cta__gfx-supply">
        <circle cx="14" cy="30" r="3" /><circle cx="14" cy="60" r="3" /><circle cx="14" cy="90" r="3" />
      </g>
      <g className="lp-cta__gfx-demand">
        <circle cx="206" cy="30" r="3" /><circle cx="206" cy="60" r="3" /><circle cx="206" cy="90" r="3" />
      </g>
      <circle className="lp-cta__gfx-bloom" cx="110" cy="60" r="16" />
      <circle className="lp-cta__gfx-match" cx="110" cy="60" r="4" />
    </svg>
  );
}

export function CTADark() {
  return (
    <section className="lp-sec" id="cta">
      <div className="portal-container">
        <div className="lp-cta surface-executive surface-blue">
          <div className="lp-cta__copy">
            <span className="lp-cta__eyebrow">Ra quyết định</span>
            <h2 className="lp-cta__h">Sẵn sàng xem engine trên dữ liệu có nguồn?</h2>
            <p className="lp-cta__sub">Xem engine chạy trên dữ liệu thật, hoặc xem Hub minh họa cho một ngành khác.</p>
            <div className="lp-cta__row">
              <a className="lp-btn lp-btn--primary" href={ROUTE.dashboard}>
                Xem engine thật <span className="lp-btn__ar" aria-hidden="true">→</span>
              </a>
              <a className="lp-btn lp-btn--ghost" href={ROUTE.hub}>
                Xem Hub minh họa
              </a>
            </div>
          </div>
          <div className="lp-cta__stage">
            <ConvergeGraphic />
            <div className="lp-cta__legend">
              <span className="lp-cta__lg is-supply">Cung</span>
              <span className="lp-cta__lg is-match">Match</span>
              <span className="lp-cta__lg is-demand">Cầu</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
