import type { Metadata } from 'next';
import { DashTopBar } from '@/components/dash/DashTopBar';
import { RegistryBrowser } from '@/components/dash/RegistryBrowser';
import { cnclMeta } from '@/lib/cncl-registry';

export const metadata: Metadata = {
  title: 'Evidence Registry - .touch',
  robots: { index: false, follow: false },
};

/**
 * Evidence Registry (Page Family #2). DU LIEU THAT ca hai chieu, sinh boi
 * scripts/gen-cncl-data.mjs tu CNCLData va Dataset_CongNgheChienLuoc.
 * Moi o bam la mo ban chup nguyen van trong /evidence.
 * Vo trang la server component; chi khoi tra cuu la client.
 */
export default function RegistryPage() {
  return (
    <>
      <DashTopBar
        title="Evidence Registry"
        subtitle={`Hai chiều CUNG và CẦU · khung ${cnclMeta.frame} · sinh ngày ${cnclMeta.generatedAt}`}
      />
      <div className="dash-content">
        <section className="dash-panel reg-head" aria-label="Tong quan registry">
          <div className="reg-stats">
            <div className="reg-stat"><span className="reg-stat__v">{cnclMeta.units}</span><span className="reg-stat__k">đơn vị</span></div>
            <div className="reg-stat"><span className="reg-stat__v">{cnclMeta.claims}</span><span className="reg-stat__k">evidence</span></div>
            <div className="reg-stat"><span className="reg-stat__v">{cnclMeta.needs}</span><span className="reg-stat__k">nhu cầu</span></div>
            <div className="reg-stat"><span className="reg-stat__v">{cnclMeta.tierA}</span><span className="reg-stat__k">tier A</span></div>
            <div className="reg-stat"><span className="reg-stat__v">{cnclMeta.snapshots}</span><span className="reg-stat__k">bản chụp</span></div>
            <span className="chip chip--pass">DỮ LIỆU THẬT</span>
            <span className="chip chip--public reg-gate" title={cnclMeta.gate}>GATE PASS</span>
          </div>
          <p className="reg-note">
            Mỗi ô truy về một câu nguyên văn trong bản chụp: bấm tên nguồn để mở, rê chuột lên
            để xem đúng câu làm bằng. Bên CUNG là đơn vị có năng lực, bên CẦU là danh mục sản
            phẩm chiến lược theo {cnclMeta.frame}.
          </p>
        </section>

        <RegistryBrowser />

        <p className="reg-foot">
          Honest-null: ô trống là chưa có bằng chứng verbatim, không phải suy ra được mà bỏ sót.
          Nhãn normalized nghĩa là giá trị được chuẩn hoá từ câu nguồn chứ không trích nguyên
          văn, và lý do ghi ngay trong chú thích của ô đó.
        </p>
      </div>
    </>
  );
}
