import { DataTruthBadge } from '@/components/portal/DataTruthBadge';

/* PipelineDark (TIP-PORTAL-V1 muc 7.6 + fail-loud muc 5.2).
   7 cong DOM (keyboard-accessible), khong canvas, khong tuyen bo engine dang chay.
   Cong 7 bi chan: ly do doc duoc bang CHU, khong chi dua vao mau. */
interface Gate {
  n: number;
  name: string;
  state: 'pass' | 'blocked';
  reason?: string;
  outcome?: string;
}

const GATES: Gate[] = [
  { n: 1, name: 'Thu thập', state: 'pass' },
  { n: 2, name: 'Chuẩn hóa', state: 'pass' },
  { n: 3, name: 'Xác thực', state: 'pass' },
  { n: 4, name: 'Phân hạng', state: 'pass' },
  { n: 5, name: 'Đối chiếu', state: 'pass' },
  { n: 6, name: 'Dựng provenance', state: 'pass' },
  { n: 7, name: 'Gate kết quả', state: 'blocked', reason: 'Chưa có dữ liệu CẦU thật', outcome: 'Không phát hành match' },
];

export function PipelineDark() {
  return (
    <div className="lp-pipe lp-inset">
      <div className="lp-mod-head">
        <div>
          <span className="lp-mod-title">Pipeline chứng minh</span>
          <p className="lp-mod-sub">Mô phỏng quy trình, không phải phiên engine đang chạy</p>
        </div>
        <DataTruthBadge state="SYNTHETIC" />
      </div>
      <ol className="lp-pipe__gates">
        {GATES.map((g) => (
          <li
            key={g.n}
            className={`lp-gate is-${g.state}`}
            tabIndex={0}
            aria-label={
              g.state === 'blocked'
                ? `Cổng ${g.n} ${g.name}: bị chặn. Lý do ${g.reason}. ${g.outcome}.`
                : `Cổng ${g.n} ${g.name}: mô phỏng đạt.`
            }
          >
            <span className="lp-gate__node" aria-hidden="true">
              {g.n}
            </span>
            <span className="lp-gate__name">{g.name}</span>
            <span className="lp-gate__status">{g.state === 'blocked' ? 'Bị chặn' : 'Mô phỏng đạt'}</span>
          </li>
        ))}
      </ol>
      <div className="lp-pipe__block" role="status">
        <span className="lp-pipe__block-tag">Gate kết quả · BỊ CHẶN</span>
        <span className="lp-pipe__block-reason">Lý do: Chưa có dữ liệu CẦU thật</span>
        <span className="lp-pipe__block-out">Kết luận: Không phát hành match</span>
      </div>
    </div>
  );
}
