import { TierBadge } from '../shared/TierBadge';
import { cnclUnits, cnclMeta } from '@/lib/cncl-registry';

/**
 * Registry cung DU LIEU THAT (CNCLData / QD 21/2026). Moi hang bam nguon o cot
 * Bang chung de mo snapshot verbatim trong public/evidence. Khac han demo:
 * day la chieu CUNG that. Match o Hub van la DEMO vi chua co chieu cau.
 */
const chip = {
  border: '1px solid #2a2f3a',
  borderRadius: 4,
  padding: '2px 8px',
  color: '#c9d2e0',
} as const;

const rtrTag = {
  marginLeft: 8,
  fontSize: 10,
  background: '#3a2a00',
  color: '#ffcf70',
  padding: '1px 6px',
  borderRadius: 4,
  fontWeight: 400,
} as const;

const evLink = { fontSize: 11, color: '#7fd1ff' } as const;

export function CnclRegistry() {
  return (
    <section className="cncl-reg" style={{ marginTop: 22 }}>
      <div className="panel-h">
        <h2>Registry cung · dữ liệu thật</h2>
        <span className="mono" style={{ color: '#6fce8f', fontSize: 11 }}>
          GATE PASS
        </span>
      </div>

      <div
        className="mono"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontSize: 11, margin: '6px 0 8px' }}
      >
        <span style={chip}>{cnclMeta.units} đơn vị</span>
        <span style={chip}>{cnclMeta.claims} claim</span>
        <span style={chip}>{cnclMeta.sources} nguồn</span>
        <span style={chip}>{cnclMeta.corroboratedCells} corroborated</span>
        <span style={chip}>{cnclMeta.gate}</span>
      </div>
      <p className="mono" style={{ fontSize: 10.5, color: 'var(--dk-tx3, #6f7891)', margin: '0 0 12px' }}>
        Nguồn thật · khung {cnclMeta.frame} · chụp {cnclMeta.generatedAt} · mỗi hàng bấm nguồn để mở snapshot verbatim và tự kiểm
      </p>

      <table className="reg-table">
        <thead>
          <tr>
            <th>Đơn vị</th>
            <th>Nhóm / SP</th>
            <th>Năng lực (trích)</th>
            <th>Tier</th>
            <th>Bằng chứng</th>
          </tr>
        </thead>
        <tbody>
          {cnclUnits.map((u) => (
            <tr key={u.name}>
              <td className="ent">
                {u.name}
                {u.favorsRtr ? <span style={rtrTag}>favors=rtr</span> : null}
              </td>
              <td className="mono" style={{ fontSize: 11 }}>
                {u.nhomLabel}
                {u.sanPham ? ` · SP ${u.sanPham}` : ''}
              </td>
              <td style={{ maxWidth: 300 }}>{u.capability || '(chưa có)'}</td>
              <td>
                <TierBadge level={u.bestTier}>{u.bestTier}</TierBadge>
                {u.corroborated ? (
                  <span className="mono" style={{ marginLeft: 6, fontSize: 10, color: '#6fce8f' }}>
                    ✓✓
                  </span>
                ) : null}
              </td>
              <td>
                {u.sources.map((s, i) => (
                  <span key={s.source}>
                    <a href={s.href} target="_blank" rel="noreferrer" style={evLink}>
                      {s.source}
                    </a>
                    {i < u.sources.length - 1 ? <span style={{ color: '#6f7891' }}> · </span> : null}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="hub-note mono">
        <span aria-hidden="true">◈</span> Registry này là dữ liệu THẬT, kiểm được: bấm nguồn ở cột Bằng chứng để
        mở snapshot và soát câu evidence. Các match phía trên vẫn là DEMO minh hoạ (chưa có chiều cầu).
      </div>
    </section>
  );
}
