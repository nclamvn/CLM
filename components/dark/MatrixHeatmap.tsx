import { matrixCaps, matrixReqs, matrixCells, matrixColor } from '@/lib/dark-data';
import { dk } from '@/lib/content';

/** Heatmap Nang luc x Yeu cau, deterministic (SSR = client). */
export function MatrixHeatmap() {
  const d = dk.data;
  return (
    <div className="dk-panel dk-mx">
      <div className="dk-mx-h">
        <span className="ttl">{d.mxTitle}</span>
        <span className="dk-tag">{d.mxTag}</span>
      </div>
      <div className="dk-mx-grid" style={{ gridTemplateColumns: `64px repeat(${matrixReqs.length}, 1fr)` }}>
        <div className="dk-mx-corner" />
        {matrixReqs.map((r) => (
          <div className="dk-mx-collab" key={r}>
            {r}
          </div>
        ))}
        {matrixCaps.map((cap, i) => (
          <MatrixRow key={cap} cap={cap} i={i} />
        ))}
      </div>
      <div className="dk-mx-key">
        {d.mxKeyLow} <span className="dk-mx-ramp" aria-hidden="true" /> {d.mxKeyHigh}
        <span style={{ marginLeft: 14 }}>{d.mxKeyFit}</span>
      </div>
    </div>
  );
}

function MatrixRow({ cap, i }: { cap: string; i: number }) {
  return (
    <>
      <div className="dk-mx-rowlab">{cap}</div>
      {matrixCells[i].map((c, j) => (
        <div
          key={j}
          className={`dk-mx-cell ${c.fit ? 'fit' : ''}`.trim()}
          style={{ background: matrixColor(c.v) }}
          title={`${cap} × ${matrixReqs[j]} · ${c.v.toFixed(2)}`}
        />
      ))}
    </>
  );
}
