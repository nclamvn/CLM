import { DataTruthBadge } from '@/components/portal/DataTruthBadge';

/* MatchStream card (TIP-PORTAL-V1 muc 7.3). Card tinh deterministic, anchored goc trai-duoi globe.
   DEMO ro. Khong ten doanh nghiep that (match tong hop). Khong random sau reload. */
const rows = [
  { id: 'MATCH-0056', score: '0.89' },
  { id: 'MATCH-0055', score: '0.92' },
  { id: 'MATCH-0054', score: '0.86' },
  { id: 'MATCH-0053', score: '0.90' },
];

export function MatchStream() {
  return (
    <div className="lp-stream">
      <div className="lp-stream__head">
        <span className="lp-stream__title">Match stream</span>
        <DataTruthBadge state="DEMO" />
      </div>
      <ul className="lp-stream__list">
        {rows.map((r) => (
          <li key={r.id} className="lp-stream__row">
            <span className="lp-stream__id">{r.id}</span>
            <span className="lp-stream__flow" aria-hidden="true">cầu ⇄ cung</span>
            <span className="lp-stream__score">{r.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
