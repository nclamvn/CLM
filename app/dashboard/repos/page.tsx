import type { Metadata } from 'next';
import { DashTopBar } from '@/components/dash/DashTopBar';
import { reposView, lineage } from '@/lib/repos-view';

export const metadata: Metadata = {
  title: 'Repositories - .touch',
  robots: { index: false, follow: false },
};

/**
 * Repository View (Page Family #4): versioned assets & commits, lineage & dependencies.
 * DU LIEU THAT, HEAD ghi tai thoi diem cap nhat (site tu dung, khong doc git runtime).
 */
export default function ReposPage() {
  return (
    <>
      <DashTopBar title="Repositories" subtitle="Versioned assets · commits · lineage. 3 GitHub + 2 local, HEAD ghi tại thời điểm cập nhật" />
      <div className="dash-content">
        <section className="rv-grid" aria-label="Danh sach repo">
          {reposView.map((r) => (
            <article key={r.name} className="rv-card">
              <header className="rv-card__head">
                <span className="rv-card__name">{r.name}</span>
                <span className={`chip ${r.vis === 'Public' ? 'chip--public' : r.vis === 'Private' ? 'chip--private' : 'chip--poc'}`}>{r.vis}</span>
              </header>
              <div className="rv-card__owner">{r.owner}</div>
              <p className="rv-card__role">{r.role}</p>
              <div className="rv-card__meta">
                <span className="t-mono-01">HEAD {r.head}</span>
                <span className="rv-card__date">{r.date}</span>
              </div>
              <div className="rv-card__gate" title={r.gate}>{r.gate}</div>
              {r.feeds.length > 0 ? (
                <div className="rv-card__feeds">
                  {r.feeds.map((f) => (
                    <div key={f} className="rv-feed">{`-> ${f}`}</div>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
        </section>
        <section className="dash-panel rv-lineage" aria-label="Lineage va phu thuoc">
          <h2 className="rv-lineage__title">Lineage &amp; dependencies</h2>
          <ul className="rv-lineage__list">
            {lineage.map((e, i) => (
              <li key={i} className="rv-edge">
                <span className="rv-edge__from">{e.from}</span>
                <span className="rv-edge__arrow" aria-hidden="true">{'->'}</span>
                <span className="rv-edge__to">{e.to}</span>
                <span className="rv-edge__note">{e.note}</span>
              </li>
            ))}
          </ul>
          <p className="reg-foot">
            HEAD hiển thị là bản ghi tại thời điểm cập nhật trang, không tự đồng bộ runtime.
            Hai repo Local chưa push GitHub (backup version nội bộ).
          </p>
        </section>
      </div>
    </>
  );
}
