import type { Metadata } from 'next';
import Link from 'next/link';
import { TouchBrand } from '@/components/brand/TouchBrand';
import { HubCungCau } from '@/components/landing/HubCungCau';
import { dungMatTien } from '@/lib/mat-tien';
import { ROUTE } from '@/lib/portal-routes';
import '@/styles/landing-hub.css';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

const ngayGio = (s: string) => `${s.slice(8, 10)}/${s.slice(5, 7)}/${s.slice(0, 4)} ${s.slice(11, 16)}`;

/**
 * Trang dau, MOT man hinh (dung lai 29/09/2026 theo yeu cau cua anh Lam).
 * Truoc day la 9 khoi cuon dai (qua cau, pipeline mo phong, ma tran minh hoa, nganh gia lap...).
 * Nay chi con mot hinh dong chu dao ve tu du lieu that va mot lop HUD; moi con so rut tu
 * lib/mat-tien.ts (hub-graph + cncl-match + cncl-registry), khong go tay.
 */
export default function LandingPage() {
  const d = dungMatTien();
  const s = d.so;
  const cc = s.chuoiCong;
  const chiSo: { k: string; v: number; phu: string; mau?: string }[] = [
    { k: 'Đơn vị cung', v: s.donVi, phu: 'có năng lực, có câu nguồn', mau: 'cung' },
    { k: 'Nhu cầu quốc gia', v: s.nhuCau, phu: 'sản phẩm theo QĐ 21/2026', mau: 'cau' },
    { k: 'Nhóm công nghệ', v: s.nhom, phu: 'trục giữa của hub' },
    { k: 'Cặp cung cầu', v: s.capCoNguon, phu: 'có nguồn ở cả hai phía' },
    { k: 'Match đã ký', v: s.daKy, phu: `${s.tuChoi} cặp bị từ chối, vẫn hiện`, mau: 'match' },
    { k: 'Câu nguồn', v: s.cauNguon, phu: `${s.tierA} câu hạng A, nguyên văn` },
  ];
  return (
    <div className="mt">
      <div className="mt-luoi" aria-hidden="true" />
      <HubCungCau data={d} />

      <header className="mt-top">
        <TouchBrand mode="full" theme="dark" size="md" href="/" />
        <nav className="mt-top__nav" aria-label="Điều hướng">
          <Link href={ROUTE.dashboard}>Tổng quan</Link>
          <Link href={`${ROUTE.dashboard}/thi-truong`}>Thị trường</Link>
          <Link href={`${ROUTE.dashboard}/do-thi`}>Đồ thị</Link>
          <Link href={`${ROUTE.dashboard}/matching`}>Matching</Link>
          <Link href={ROUTE.hub} className="mt-top__phu">Hub minh họa</Link>
        </nav>
        <div className="mt-top__phai">
          <span className="mt-trang" title="Kết quả lần chạy chuỗi cổng gần nhất, đọc từ file kết quả, không gõ tay">
            <i aria-hidden="true" className={cc && cc.xanh === cc.tong ? 'is-xanh' : 'is-vang'} />
            {cc ? `Chuỗi cổng ${cc.xanh}/${cc.tong} xanh · ${ngayGio(cc.luc)}` : 'Chuỗi cổng chưa có kết quả'}
          </span>
          <Link href={ROUTE.dashboard} className="mt-nut mt-nut--chinh">Vào engine thật <span aria-hidden="true">→</span></Link>
        </div>
      </header>

      <section className="mt-chu">
        <span className="mt-chu__nhan">Hub cung cầu công nghệ chiến lược · QĐ 21/2026</span>
        {/* Sua 29/09/2026 theo anh Lam: tieu de chi mot cau; cau phu khong gan con so vi registry
            con mo rong lien tuc. So hien tai nam o thanh HUD ben duoi, sinh tu du lieu. */}
        <h1 className="mt-chu__h">Cung gặp <span>cầu.</span></h1>
        <p className="mt-chu__p">
          Nối đơn vị có năng lực với nhu cầu công nghệ chiến lược quốc gia. Máy cào, lọc và đề xuất;
          người gác cổng ký; mỗi kết nối truy được về câu nguồn nguyên văn.
        </p>
        <div className="mt-chu__nut">
          <Link href={ROUTE.dashboard} className="mt-nut mt-nut--chinh">Vào engine thật <span aria-hidden="true">→</span></Link>
          <Link href={`${ROUTE.dashboard}/matching`} className="mt-nut">Xem {s.daKy} match đã ký</Link>
        </div>
      </section>

      <footer className="mt-hud">
        <dl className="mt-hud__so">
          {chiSo.map((c) => (
            <div key={c.k} className={c.mau ? `is-${c.mau}` : undefined}>
              <dt>{c.k}</dt><dd>{c.v}</dd><span>{c.phu}</span>
            </div>))}
        </dl>
        <ul className="mt-hud__chu" aria-label="Chú giải">
          <li className="mt-hud__ghi">Vẽ từ dữ liệu thật: mỗi chấm là một đơn vị hoặc nhu cầu trong registry, mỗi dòng hạt là một trong {s.capCoNguon} cặp có nguồn. Rê chuột để xem tên.</li>
          <li><i className="mk mk--cung" aria-hidden="true" />đơn vị cung</li>
          <li><i className="mk mk--cau" aria-hidden="true" />nhu cầu QĐ 21</li>
          <li><i className="mk mk--trong" aria-hidden="true" />chưa có cung ({s.ncTrong})</li>
          <li><i className="mk mk--nhom" aria-hidden="true" />nhóm công nghệ</li>
          <li><i className="mk mk--match" aria-hidden="true" />match đã ký</li>
        </ul>
      </footer>
    </div>
  );
}
