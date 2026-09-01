import { matrixCaps, matrixReqs, matrixCells } from '@/lib/dark-data';
import { DataTruthBadge } from '@/components/portal/DataTruthBadge';

/* MatrixHeatmap (TIP-PORTAL-V1 muc 7.6). Grid 6x8 deterministic (seeded, SSR = client).
   SYNTHETIC: ma tran minh hoa, KHONG phai quan he that giua don vi va nhu cau chinh sach.
   Truc dung ten nang luc chung, khong ten doanh nghiep that. */
function level(v: number): 'l1' | 'l2' | 'l3' | 'l4' {
  return v < 0.25 ? 'l1' : v < 0.5 ? 'l2' : v < 0.75 ? 'l3' : 'l4';
}

export function MatrixHeatmap() {
  return (
    <div className="lp-matrix lp-inset">
      <div className="lp-mod-head">
        <div>
          <span className="lp-mod-title">Ma trận năng lực × yêu cầu</span>
          <p className="lp-mod-sub">Ma trận minh họa, seeded deterministic</p>
        </div>
        <DataTruthBadge state="SYNTHETIC" />
      </div>
      <div className="lp-matrix__grid" role="grid" aria-label="Ma tran minh hoa 6 nang luc x 8 yeu cau">
        {matrixCells.map((row, i) => (
          <div className="lp-matrix__row" role="row" key={matrixCaps[i]}>
            <span className="lp-matrix__cap" role="rowheader">
              {matrixCaps[i]}
            </span>
            {row.map((cell, j) => (
              <button
                type="button"
                role="gridcell"
                key={matrixReqs[j]}
                className={`lp-cell is-${level(cell.v)}`}
                title={`Điểm minh họa ${cell.v.toFixed(2)}`}
                aria-label={`${matrixCaps[i]} với ${matrixReqs[j]}: Điểm minh họa ${cell.v.toFixed(2)}`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="lp-matrix__foot">
        <div className="lp-matrix__legend" aria-hidden="true">
          <span className="lp-lg is-low">Thấp</span>
          <span className="lp-lg is-mid">Trung bình</span>
          <span className="lp-lg is-high">Cao</span>
        </div>
      </div>
    </div>
  );
}
