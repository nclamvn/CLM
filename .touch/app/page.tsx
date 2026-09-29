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
 * Trang dau, MOT man hinh, ve lai 29/09/2026 theo chuan HIVE Editorial cua anh Lam (don sac,
 * serif bien tap cho tieu de va so, Inter cho giao dien; khong gradient, khong glow).
 * Ban truoc bi danh gia la "AI slop": qua nhieu trang tri khong mang du lieu va bay mau tren mot man.
 * Moi con so rut tu lib/mat-tien.ts (hub-graph + cncl-match + cncl-registry), khong go tay.
 */
export default function LandingPage() {
  const d = dungMatTien();
  const s = d.so;
  const cc = s.chuoiCong;
  const chiSo: { k: string; v: number }[] = [
    { k: 'đơn vị cung có câu nguồn', v: s.donVi },
    { k: 'nhu cầu theo QĐ 21/2026', v: s.nhuCau },
    { k: 'match đã có người ký', v: s.daKy },
  ];
  return (
    <div className="mt">
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
            <i aria-hidden="true" />
            {cc ? `Chuỗi cổng ${cc.xanh}/${cc.tong} đạt · ${ngayGio(cc.luc)}` : 'Chuỗi cổng chưa có kết quả'}
          </span>
          <Link href={ROUTE.dashboard} className="mt-nut">Vào engine thật <span aria-hidden="true">→</span></Link>
        </div>
      </header>

      <main id="main" className="mt-than">
        <section className="mt-chu">
          <p className="mt-chu__nhan">Hub cung cầu công nghệ chiến lược · QĐ 21/2026</p>
          {/* Tieu de chi mot cau, cau phu khong gan con so (anh Lam chot 29/09/2026). */}
          <h1 className="mt-chu__h">Cung gặp cầu.</h1>
          <p className="mt-chu__p">
            {/* Dau cach khong ngat giu cac cum "chiến lược", "Việt Nam", "câu nguồn" tren mot dong. */}
            Bản đồ sống của thị trường công nghệ chiến lược Việt Nam. Mỗi kết nối đều có người ký
            và truy được về tận câu nguồn.
          </p>
          <div className="mt-chu__nut">
            <Link href={ROUTE.dashboard} className="mt-nut">Vào engine thật <span aria-hidden="true">→</span></Link>
            <Link href={`${ROUTE.dashboard}/matching`} className="mt-lien">Xem các match đã ký</Link>
          </div>
          <dl className="mt-so">
            {chiSo.map((c) => (
              <div key={c.k}><dt>{c.k}</dt><dd>{c.v}</dd></div>))}
          </dl>
        </section>

        <HubCungCau data={d} />
      </main>

      <footer className="mt-chan">
        <span>Sơ đồ vẽ từ registry, không phải hình minh họa. Mỗi vạch, số và hình thoi là một thực thể có thật; nét liền là match đã ký, nét đứt là cặp bị từ chối, hình thoi rỗng là nhu cầu chưa có bên cung.</span>
      </footer>
    </div>
  );
}
