import { DataTruthBadge } from '@/components/portal/DataTruthBadge';
import { ROUTE } from '@/lib/portal-routes';

/* ProvenanceGraph (TIP-PORTAL-V1 muc 7.7). Trang thai DEMO: chuoi provenance MAU,
   khong phai match that. Khong ten doanh nghiep that. Node nguon la SVG <a> (keyboard
   + click), dan ve /hub?view=provenance (trang that / scaffold, khong dead control). */

const MATCH = { x: 220, y: 46 };
const CUNG = { x: 128, y: 150 };
const CAU = { x: 312, y: 150 };
const leaves = [
  { x: 62, y: 254, label: 'Claim năng lực', tier: 'A', parent: CUNG, link: false, aria: '' },
  { x: 184, y: 254, label: 'Nguồn A', tier: 'A', parent: CUNG, link: true, aria: 'Nguồn A, Tier A, bằng chứng minh họa' },
  { x: 268, y: 254, label: 'Yêu cầu minh họa', tier: '', parent: CAU, link: false, aria: '' },
  { x: 386, y: 254, label: 'Nguồn B', tier: 'B', parent: CAU, link: true, aria: 'Nguồn B, Tier B, bằng chứng minh họa' },
];

function Leaf({ n }: { n: (typeof leaves)[number] }) {
  const body = (
    <>
      <circle className="lp-prov__node" cx={n.x} cy={n.y} r="5" />
      <text className="lp-prov__lbl" x={n.x} y={n.y + 18} textAnchor="middle">
        {n.label}
      </text>
      {n.tier ? (
        <text className={`lp-prov__tier is-${n.tier.toLowerCase()}`} x={n.x} y={n.y + 31} textAnchor="middle">
          Tier {n.tier}
        </text>
      ) : null}
    </>
  );
  if (n.link) {
    return (
      <a href={ROUTE.hubProvenance} className="lp-prov__link-node" aria-label={n.aria}>
        {body}
      </a>
    );
  }
  return <g>{body}</g>;
}

export function ProvenanceGraph() {
  return (
    <div className="lp-prov surface-executive surface-cyan">
      <div className="lp-mod-head">
        <div>
          <span className="lp-mod-title">Chuỗi provenance mẫu</span>
          <p className="lp-mod-sub">
            Minh họa cách một match dẫn về claim CUNG, claim CẦU và nguồn bằng chứng. Không phải kết quả matching thật.
          </p>
        </div>
        <DataTruthBadge state="DEMO" />
      </div>
      <p className="sr-only">
        Chuỗi provenance mẫu: MATCH MẪU dẫn về hai nhánh. Nhánh CUNG gồm Claim năng lực và Nguồn A tier A. Nhánh CẦU gồm
        Yêu cầu minh họa và Nguồn B tier B. Đây là ví dụ minh họa, không phải match thật.
      </p>
      <svg className="lp-prov__svg" viewBox="0 0 440 300" role="img" aria-labelledby="prov-t prov-d">
        <title id="prov-t">Chuỗi provenance mẫu</title>
        <desc id="prov-d">MATCH MẪU dẫn về nhánh CUNG và CẦU, mỗi nhánh có claim và nguồn bằng chứng minh họa.</desc>
        <defs>
          <marker id="lp-prov-arrow" markerWidth="4" markerHeight="4" refX="3.4" refY="2" orient="auto">
            <path d="M0 0 L4 2 L0 4 Z" className="lp-prov__arrow" />
          </marker>
        </defs>
        <g className="lp-prov__links">
          <line x1={MATCH.x} y1={MATCH.y} x2={CUNG.x} y2={CUNG.y} markerEnd="url(#lp-prov-arrow)" />
          <line x1={MATCH.x} y1={MATCH.y} x2={CAU.x} y2={CAU.y} markerEnd="url(#lp-prov-arrow)" />
          {leaves.map((n) => (
            <line key={n.label} x1={n.parent.x} y1={n.parent.y} x2={n.x} y2={n.y} markerEnd="url(#lp-prov-arrow)" />
          ))}
        </g>
        <g className="lp-prov__match">
          <circle className="lp-prov__node lp-prov__node--match" cx={MATCH.x} cy={MATCH.y} r="8" />
          <text className="lp-prov__lbl lp-prov__lbl--match" x={MATCH.x} y={MATCH.y - 14} textAnchor="middle">
            MATCH MẪU
          </text>
        </g>
        {[CUNG, CAU].map((b, i) => (
          <g key={i}>
            <circle className="lp-prov__node lp-prov__node--branch" cx={b.x} cy={b.y} r="6" />
            <text className="lp-prov__lbl lp-prov__lbl--branch" x={b.x} y={b.y - 12} textAnchor="middle">
              {i === 0 ? 'CUNG' : 'CẦU'}
            </text>
          </g>
        ))}
        {leaves.map((n) => (
          <Leaf key={n.label} n={n} />
        ))}
      </svg>
    </div>
  );
}
