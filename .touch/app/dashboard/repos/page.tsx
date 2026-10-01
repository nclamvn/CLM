import type { Metadata } from 'next';
import { DashTopBar } from '@/components/dash/DashTopBar';
import kho from '@/lib/hub-kho.json';

export const metadata: Metadata = {
  title: 'Kho mã · .touch',
  robots: { index: false, follow: false },
};

type Phan = {
  thuMuc: string; ten: string; vaiTro: string; gop: { sha: string; ngay: string } | null;
  commitTruocGop: number | null; commitSauGop: number | null; cuoi: { sha: string; ngay: string; tieuDe: string }; soTep: number;
};
type Kho = {
  tenKho: string | null; sinhTu: { sha: string; ngay: string }; tongCommit: number; commitDau: string; ngayGop: string | null;
  phan: Phan[]; oTheoKho: Record<string, number>; ganDay: { sha: string; ngay: string; tieuDe: string }[];
  dong: { tu: string; den: string; ghi: string }[];
};
const K = kho as unknown as Kho;
const ngayVN = (d: string) => `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}`;

/**
 * Trang Kho ma. Dung lai 29/09/2026: trang cu la bang ghi tay (lib/repos-view.ts) tro vao nam kho
 * rieng le truoc ngay gop. Moi so o day la ket qua lenh git tai commit ghi trong lib/hub-kho.json
 * (scripts/gen-kho.mjs); cong check-kho.mjs tinh lai tai dung commit do.
 */
export default function ReposPage() {
  const tongO = Object.values(K.oTheoKho).reduce((s, v) => s + v, 0);
  return (
    <>
      <DashTopBar title="Kho mã" subtitle={`Một kho duy nhất, lịch sử đầy đủ · cập nhật mã ${K.sinhTu.sha}`} />
      <div className="dash-content kh">
        <section className="dash-panel kh-dau" aria-label="Kho">
          <div>
            <div className="md-eyebrow">Kho gộp · git subtree, lịch sử nguyên vẹn</div>
            <h2 className="kh-ten">{K.tenKho ?? "kho gộp"}</h2>
            <p className="kh-mo">
              Bốn phần của hệ nằm chung một kho từ ngày {K.ngayGop ? ngayVN(K.ngayGop) : 'gộp'}. Bốn kho riêng lẻ trước ngày đó không còn là nguồn;
              toàn bộ lịch sử của chúng nằm nguyên trong kho này.
            </p>
          </div>
          <dl className="kh-so">
            <div><dt>lần cập nhật mã</dt><dd>{K.tongCommit}</dd><dd className="kh-so__phu">từ {ngayVN(K.commitDau)}</dd></div>
            <div><dt>phần</dt><dd>{K.phan.length}</dd><dd className="kh-so__phu">chung một lần checkout</dd></div>
            <div><dt>bước kiểm định tự động</dt><dd>{tongO}</dd><dd className="kh-so__phu">đếm trong chay_het_cong.sh tại {K.sinhTu.sha}</dd></div>
          </dl>
        </section>

        <section className="kh-luoi" aria-label="Các phần">
          {K.phan.map((p) => (
            <article key={p.thuMuc} className="dash-panel kh-phan">
              <header className="kh-phan__dau"><span className="kh-phan__ten">{p.ten}</span><code>{p.thuMuc}/</code></header>
              <p className="kh-phan__vt">{p.vaiTro}</p>
              <dl className="kh-phan__so">
                <div><dt>tệp</dt><dd>{p.soTep}</dd></div>
                <div><dt>cập nhật trước gộp</dt><dd>{p.commitTruocGop ?? '·'}</dd></div>
                <div><dt>cập nhật sau gộp</dt><dd>{p.commitSauGop ?? '·'}</dd></div>
                <div><dt>bước kiểm định</dt><dd>{K.oTheoKho[p.thuMuc] ?? 0}</dd></div>
              </dl>
              <div className="kh-phan__cuoi">
                <span className="t-mono-01">{p.cuoi.sha}</span> <span className="kh-ngay">{ngayVN(p.cuoi.ngay)}</span>
                <span className="kh-td">{p.cuoi.tieuDe}</span>
              </div>
              {!K.oTheoKho[p.thuMuc] && <p className="hs-note">Không có ô cổng riêng: được kiểm bởi các ô của Máy ghép (đối chiếu câu nguồn, đồng bộ bản đọc).</p>}
            </article>))}
        </section>

        <div className="kh-hai">
          <section className="dash-panel hs-sec" aria-labelledby="kh-dong">
            <h2 className="hs-h" id="kh-dong">Dòng dữ liệu <span>đi một chiều</span></h2>
            <ul className="kh-dong">
              {K.dong.map((d, i) => (
                <li key={i}><span className="kh-dong__tu">{d.tu}</span><span className="kh-dong__mui" aria-hidden="true">→</span><span className="kh-dong__den">{d.den}</span><span className="kh-dong__ghi">{d.ghi}</span></li>))}
            </ul>
          </section>
          <section className="dash-panel hs-sec" aria-labelledby="kh-gd">
            <h2 className="hs-h" id="kh-gd">Commit gần đây <span>{K.ganDay.length} commit mới nhất tính tới {K.sinhTu.sha}</span></h2>
            <ol className="kh-gd">
              {K.ganDay.map((c) => (
                <li key={c.sha}><span className="t-mono-01">{c.sha}</span><span className="kh-ngay">{ngayVN(c.ngay)}</span><span className="kh-td">{c.tieuDe}</span></li>))}
            </ol>
          </section>
        </div>
        <p className="hs-foot">
          Số trên trang là kết quả lệnh git tại commit {K.sinhTu.sha} ({ngayVN(K.sinhTu.ngay)}). File dữ liệu được commit sau khi sinh nên luôn trễ một commit;
          cổng check-kho tính lại tại đúng commit đó và kiểm nó nằm trong lịch sử hiện tại. “Commit sau gộp” chỉ đếm commit chạm vào thư mục đó.
        </p>
      </div>
    </>
  );
}
