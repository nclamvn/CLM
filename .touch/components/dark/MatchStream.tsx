import { DataTruthBadge } from '@/components/portal/DataTruthBadge';
import { signedMatches } from '@/lib/cncl-match';

/* MatchStream card (TIP-PORTAL-V1 muc 7.3). Card tinh, tat dinh, neo goc trai-duoi globe.
   Sua 29/09/2026: truoc la bon dong bia (MATCH-0053..0056, diem 0.86 den 0.92) gan nhan DEMO,
   trong khi da co 11 match that co chu ky. Nay doc bon match DA KY moi nhat tu lib/cncl-match
   (sinh tu out/matches.jsonl + so ky), diem la diem engine that. */
const rows = [...signedMatches]
  .sort((a, b) => (a.id < b.id ? 1 : a.id > b.id ? -1 : 0))
  .slice(0, 4)
  .map((m) => ({
    id: m.id,
    cau: m.demandId.split(' ')[0].replace(/^CNCL-/, ''),
    cung: m.supplyId,
    score: m.score.toFixed(2),
  }));

export function MatchStream() {
  return (
    <div className="lp-stream">
      <div className="lp-stream__head">
        <span className="lp-stream__title">Match đã ký</span>
        <DataTruthBadge state="REAL" />
      </div>
      <ul className="lp-stream__list">
        {rows.map((r) => (
          <li key={r.id} className="lp-stream__row">
            <span className="lp-stream__id">{r.id}</span>
            <span className="lp-stream__flow" title={`${r.cau} ⇄ ${r.cung}`}>{r.cau} ⇄ {r.cung}</span>
            <span className="lp-stream__score">{r.score}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
