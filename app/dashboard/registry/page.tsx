import type { Metadata } from 'next';
import { DashTopBar } from '@/components/dash/DashTopBar';
import { cnclMeta, cnclUnits, type CnclUnit } from '@/lib/cncl-registry';

export const metadata: Metadata = {
  title: 'Evidence Registry - .touch',
  robots: { index: false, follow: false },
};

/**
 * Evidence Registry (Page Family #2, handbook): source lineage, claim inspection,
 * verification trail. DU LIEU THAT tu don_vi_cncl (14 don vi, 64 evidence),
 * moi o bam la mo snapshot verbatim trong /evidence. Match van DEMO (chua co chieu cau).
 * Server component thuan: disclosure bang <details> native, khong JS.
 */

function TierChip({ tier }: { tier: 'A' | 'B' | 'C' }) {
  const cls = tier === 'A' ? 'chip--pass' : tier === 'B' ? 'chip--public' : 'chip--private';
  return <span className={`chip ${cls} reg-tier`}>{`Tier ${tier}`}</span>;
}

function UnitCard({ u }: { u: CnclUnit }) {
  return (
    <details className="reg-unit">
      <summary className="reg-unit__head">
        <span className="reg-unit__name">{u.name}</span>
        <span className="reg-unit__meta">
          <TierChip tier={u.bestTier} />
          {u.corroborated ? <span className="chip chip--pass reg-tier" title="2 nguồn độc lập cùng giá trị">Corroborated</span> : null}
          {u.favorsRtr ? <span className="chip chip--risk reg-tier" title="Khai báo xung đột lợi ích: người vận hành thuộc RtR">favors=rtr</span> : null}
          <span className="reg-unit__count">{u.evidence.length} evidence</span>
        </span>
        <span className="reg-unit__cap">{u.capability}</span>
      </summary>
      <div className="reg-unit__body">
        <table className="reg-table">
          <thead>
            <tr><th scope="col">Field</th><th scope="col">Giá trị</th><th scope="col">Tier</th><th scope="col">Nguồn (mở snapshot)</th></tr>
          </thead>
          <tbody>
            {u.evidence.map((e, i) => (
              <tr key={i}>
                <td className="reg-td-field">{e.field}</td>
                <td>{e.value}</td>
                <td><TierChip tier={e.tier} /></td>
                <td>
                  <a className="reg-src" href={e.href} target="_blank" rel="noopener noreferrer" title={`Span: ${e.span.slice(0, 120)}`}>
                    {e.source}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

export default function RegistryPage() {
  const groups = [
    { key: '9', label: 'Nhóm 9 · Hàng không vũ trụ', units: cnclUnits.filter((u) => u.nhom === '9') },
    { key: '1', label: 'Nhóm 1 · Công nghệ số', units: cnclUnits.filter((u) => u.nhom === '1') },
  ];
  return (
    <>
      <DashTopBar title="Evidence Registry" subtitle={`Chiều CUNG thật · khung ${cnclMeta.frame} · chụp ${cnclMeta.generatedAt}`} />
      <div className="dash-content">
        <section className="dash-panel reg-head" aria-label="Tong quan registry">
          <div className="reg-stats">
            <div className="reg-stat"><span className="reg-stat__v">{cnclMeta.units}</span><span className="reg-stat__k">đơn vị</span></div>
            <div className="reg-stat"><span className="reg-stat__v">{cnclMeta.claims}</span><span className="reg-stat__k">evidence</span></div>
            <div className="reg-stat"><span className="reg-stat__v">{cnclMeta.sources}</span><span className="reg-stat__k">nguồn</span></div>
            <div className="reg-stat"><span className="reg-stat__v">{cnclMeta.corroboratedCells}</span><span className="reg-stat__k">corroborated</span></div>
            <span className="chip chip--pass">DỮ LIỆU THẬT</span>
            <span className="chip chip--public reg-gate" title={cnclMeta.gate}>GATE PASS</span>
          </div>
          <p className="reg-note">
            Mỗi ô truy về snapshot verbatim: bấm tên nguồn để mở bản chụp. {cnclMeta.note}
          </p>
        </section>
        {groups.map((g) => (
          <section key={g.key} className="reg-group" aria-label={g.label}>
            <h2 className="reg-group__title">{g.label} <span className="reg-group__n">{g.units.length} đơn vị</span></h2>
            {g.units.map((u) => (
              <UnitCard key={u.name} u={u} />
            ))}
          </section>
        ))}
        <p className="reg-foot">
          Honest-null: các ô trống (loại hình, địa bàn...) là chưa có bằng chứng verbatim, không đoán.
          Match chứng-minh-được chưa chạy vì thiếu chiều CẦU thật; phần match trên site vẫn là DEMO có nhãn.
        </p>
      </div>
    </>
  );
}
