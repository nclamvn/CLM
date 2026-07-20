import { interp } from '@/lib/dark-data';
import { DataTruthBadge } from '@/components/portal/DataTruthBadge';

/* InterpChart (TIP-PORTAL-V1 muc 7.7). Trang thai SYNTHETIC: chuoi seeded deterministic,
   KHONG phai du bao thi truong. Phan biet ro 12 diem quan sat / 6 diem noi suy + dai bat dinh.
   Tooltip ghi trang thai diem; co summary + bang fallback cho screen reader/keyboard. */
export function InterpChart() {
  const W = 560;
  const H = 240;
  const pad = 24;
  const { N, real, pts } = interp;
  const X = (i: number) => pad + ((W - 2 * pad) * i) / (N - 1);
  const Y = (v: number) => H - pad - (H - 2 * pad) * v;
  const spread = (i: number) => (0.06 * (i - real + 1)) / (N - real) + 0.02;

  let band = `M ${X(real - 1).toFixed(1)},${Y(pts[real - 1] + spread(real - 1)).toFixed(1)}`;
  for (let i = real; i < N; i++) band += ` L ${X(i).toFixed(1)},${Y(pts[i] + spread(i)).toFixed(1)}`;
  for (let i = N - 1; i >= real - 1; i--) band += ` L ${X(i).toFixed(1)},${Y(pts[i] - spread(i)).toFixed(1)}`;
  band += ' Z';

  let obs = `M ${X(0).toFixed(1)},${Y(pts[0]).toFixed(1)}`;
  for (let i = 1; i < real; i++) obs += ` L ${X(i).toFixed(1)},${Y(pts[i]).toFixed(1)}`;
  let itp = `M ${X(real - 1).toFixed(1)},${Y(pts[real - 1]).toFixed(1)}`;
  for (let i = real; i < N; i++) itp += ` L ${X(i).toFixed(1)},${Y(pts[i]).toFixed(1)}`;

  const stateOf = (i: number) => (i < real ? 'Điểm quan sát mô phỏng' : 'Điểm nội suy mô phỏng');

  return (
    <div className="lp-interp surface-executive surface-purple">
      <div className="lp-mod-head">
        <div>
          <span className="lp-mod-title">Nội suy nhu cầu · 18 kỳ</span>
          <p className="lp-mod-sub">
            Chuỗi seeded deterministic dùng để minh họa nội suy và dải bất định. Không phải dự báo thị trường hoặc dữ liệu CẦU thật.
          </p>
        </div>
        <DataTruthBadge state="SYNTHETIC" />
      </div>

      <p className="sr-only">
        Chuỗi gồm 18 kỳ. Mười hai kỳ đầu là điểm quan sát mô phỏng. Sáu kỳ cuối là nội suy với dải bất định tăng dần.
      </p>

      <svg className="lp-interp__svg" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
        <g className="lp-interp__grid">
          {[0, 1, 2, 3, 4].map((g) => (
            <line key={g} x1={pad} y1={pad + ((H - 2 * pad) * g) / 4} x2={W - pad} y2={pad + ((H - 2 * pad) * g) / 4} />
          ))}
        </g>
        <path className="lp-interp__band" d={band} />
        <path className="lp-interp__obs" d={obs} />
        <path className="lp-interp__interp" d={itp} />
        <line className="lp-interp__divider" x1={X(real - 1)} y1={pad} x2={X(real - 1)} y2={H - pad} />
        <text className="lp-interp__axlbl" x={X(real - 1) - 6} y={pad + 10} textAnchor="end">
          Quan sát
        </text>
        <text className="lp-interp__axlbl" x={X(real - 1) + 6} y={pad + 10} textAnchor="start">
          Nội suy
        </text>
        {pts.map((v, i) => (
          <circle key={i} className={`lp-interp__dot${i < real ? '' : ' is-interp'}`} cx={X(i)} cy={Y(v)} r={i < real ? 2.4 : 2}>
            <title>{`Kỳ ${i + 1}: ${stateOf(i)} (${v.toFixed(2)})`}</title>
          </circle>
        ))}
      </svg>

      <div className="lp-interp__legend">
        <span className="lp-lgi is-obs">12 điểm quan sát mô phỏng</span>
        <span className="lp-lgi is-interp">6 điểm nội suy</span>
        <span className="lp-lgi is-band">Dải bất định</span>
      </div>

      <table className="sr-only">
        <caption>Bảng dữ liệu nội suy mô phỏng, 18 kỳ</caption>
        <thead>
          <tr>
            <th scope="col">Kỳ</th>
            <th scope="col">Giá trị</th>
            <th scope="col">Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {pts.map((v, i) => (
            <tr key={i}>
              <td>{i + 1}</td>
              <td>{v.toFixed(2)}</td>
              <td>{stateOf(i)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
