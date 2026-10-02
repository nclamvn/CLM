import type { Metadata } from 'next';
import Link from 'next/link';
import { DashTopBar } from '@/components/dash/DashTopBar';
import { NutIn } from '@/components/baocao/NutIn';
import bc from '@/lib/hub-bao-cao.json';
import { ngayVN } from '@/lib/dinh-dang';

export const metadata: Metadata = {
  title: 'Báo cáo khoảng trống · .touch',
  description: 'Báo cáo khoảng trống công nghệ chiến lược Việt Nam, sinh tự động từ sổ nguồn đã qua kiểm định.',
};

type SP = { ma: string; ten: string; nhom: number; nhomTen: string; trangThai: string; soCung: number };
type Nhom = { so: number; ten: string; soNc: number; daKy: number; coCung: number; trong: number; soDv: number; chuaKy: number };
type BC = {
  ky: string; mocNgay: string; so: Record<string, number>; tomTat: string[]; sanPham: SP[]; nhom: Nhom[]; mong: string[];
  chatLuong: { k: string; nhan: string; tu: number; mau: number }[]; viecTiep: { so: number; viec: string; cach: string; href: string }[];
  cauThat: null | {
    soNhuCau: number; soBenDatHang: number; coGoiY: number; theoLoai: { loai: string; ten: string; so: number }[];
    chuaCoBenCung: { ma: string; ten: string; benDatHang: string; loaiTen: string; maSp: string | null }[];
  };
};
const D = bc as unknown as BC;
const TT: Record<string, string> = { da_ky: 'Đã có cặp được ký', co_cung: 'Có bên cung, chưa ký', trong: 'Chưa có bên cung' };
const mau = (n: number) => ({ '--mau': `var(--nhom-${n})` }) as React.CSSProperties;

/**
 * Trang Bao cao khoang trong (01/10/2026, tinh nang dac sac so 7). Dang van ban de in hoac luu PDF
 * gui co quan, quy dau tu. Moi con so va cau nhan dinh doc tu lib/hub-bao-cao.json (lib/bao-cao.mjs),
 * cong check-bao-cao.mjs tinh lai va dem doc lap.
 */
export default function BaoCaoPage() {
  const mong = new Set(D.mong);
  return (
    <>
      <DashTopBar title="Báo cáo khoảng trống" subtitle={`Công nghệ chiến lược Việt Nam · ${D.ky} · số liệu ngày ${ngayVN(D.mocNgay)}`} />
      <div className="dash-content bc">
        <section className="dash-panel bc-dau" aria-labelledby="bc-h">
          <div className="hs-ten-dong">
            <div>
              <div className="md-eyebrow">Báo cáo định kỳ · {D.ky}</div>
              <h2 className="bc-h" id="bc-h">Khoảng trống cung cầu công nghệ chiến lược</h2>
            </div>
            <NutIn />
          </div>
          <p className="bc-phu">
            Phạm vi: {D.so.tong} sản phẩm công nghệ chiến lược theo QĐ 21/2026/QĐ-TTg, {D.so.donVi} đơn vị cung có câu nguồn,
            {' '}{D.so.cauNguon} câu nguồn nguyên văn, {D.so.matchDaKy} cặp cung cầu đã được người ký.
          </p>
          <h3 className="bc-h3">Tóm tắt</h3>
          <ul className="bc-tt">{D.tomTat.map((t) => <li key={t}>{t}</li>)}</ul>
        </section>

        <section className="dash-panel bc-khoi" aria-labelledby="bc-sp">
          <h2 className="hs-h" id="bc-sp">{D.so.tong} sản phẩm chiến lược <span>{D.so.daKy} đã ký · {D.so.coCung} có cung chưa ký · {D.so.trong} trống · {D.so.mong} chỉ một bên cung</span></h2>
          <div className="md-bn-cuon" tabIndex={0} role="region" aria-label="Bảng sản phẩm chiến lược, cuộn ngang trên màn hẹp">
            <table className="md-bn bc-bang">
              <thead><tr><th scope="col">Sản phẩm</th><th scope="col">Nhóm</th><th scope="col">Trạng thái</th><th scope="col">Bên cung</th></tr></thead>
              <tbody>
                {D.sanPham.map((x) => (
                  <tr key={x.ma} className={x.trangThai === 'trong' ? 'bc-trong' : ''}>
                    <th scope="row"><b>P{x.ma}</b> {x.ten}</th>
                    <td style={mau(x.nhom)}><i className="mau-cham" aria-hidden="true" />{String(x.nhom).padStart(2, '0')}</td>
                    <td>{TT[x.trangThai] ?? x.trangThai}</td>
                    <td>{x.soCung}{mong.has(x.ma) ? ' (một nguồn)' : ''}</td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </section>

        {D.cauThat && (
          <section className="dash-panel bc-khoi" aria-labelledby="bc-ct">
            <h2 className="hs-h" id="bc-ct">Nhu cầu đặt hàng thật <span>{D.cauThat.soNhuCau} nhu cầu có nguồn · {D.cauThat.soBenDatHang} bên đặt hàng · {D.cauThat.coGoiY} đã có đơn vị liên quan trong sổ nguồn (gợi ý, chưa ký)</span></h2>
            <ul className="bc-tt">{D.cauThat.theoLoai.map((l) => <li key={l.loai}>{l.ten}: <b>{l.so}</b></li>)}</ul>
            <h3 className="bc-h3">Chưa có bên cung nào trong sổ nguồn ({D.cauThat.chuaCoBenCung.length})</h3>
            <div className="md-bn-cuon" tabIndex={0} role="region" aria-label="Bảng nhu cầu đặt hàng chưa có bên cung, cuộn ngang trên màn hẹp">
              <table className="md-bn bc-bang bc-ct">
                <thead><tr><th scope="col">Nhu cầu</th><th scope="col">Bên đặt hàng</th><th scope="col">Loại</th></tr></thead>
                <tbody>
                  {D.cauThat.chuaCoBenCung.map((n) => (
                    <tr key={n.ma}><th scope="row">{n.ten}</th><td>{n.benDatHang}</td><td>{n.loaiTen}</td></tr>))}
                </tbody>
              </table>
            </div>
            <p className="hs-note">Chi tiết từng nhu cầu, câu nguồn và gợi ý đơn vị ở <Link className="pf-link" href="/dashboard/cau-that">trang Cầu thật</Link>.</p>
          </section>
        )}

        <section className="dash-panel bc-khoi" aria-labelledby="bc-nhom">
          <h2 className="hs-h" id="bc-nhom">Nhóm cần ưu tiên <span>xếp theo tỉ lệ nhu cầu chưa có cặp được ký, rồi ít đơn vị cung nhất</span></h2>
          <div className="md-bn-cuon" tabIndex={0} role="region" aria-label="Bảng nhóm công nghệ, cuộn ngang trên màn hẹp">
            <table className="md-bn">
              <thead><tr><th scope="col">Nhóm công nghệ</th><th scope="col">Nhu cầu</th><th scope="col">Đã ký</th><th scope="col">Chưa ký</th><th scope="col">Trống</th><th scope="col">Đơn vị cung</th></tr></thead>
              <tbody>
                {D.nhom.map((g) => (
                  <tr key={g.so} style={mau(g.so)}>
                    <th scope="row"><i className="mau-cham" aria-hidden="true" /><b>{String(g.so).padStart(2, '0')}</b> {g.ten}</th>
                    <td>{g.soNc}</td><td>{g.daKy}</td><td>{g.chuaKy}</td><td className={g.trong ? 'is-trong' : ''}>{g.trong}</td><td>{g.soDv}</td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="dash-panel bc-khoi" aria-labelledby="bc-cl">
          <h2 className="hs-h" id="bc-cl">Độ tin cậy của số liệu <span>mỗi dòng là một tỉ số đếm được</span></h2>
          <ul className="bc-tt">{D.chatLuong.map((c) => <li key={c.k}>{c.nhan}: <b>{c.tu}/{c.mau}</b> ({c.mau ? Math.round((c.tu / c.mau) * 100) : 0}%)</li>)}</ul>
          <h3 className="bc-h3">Việc cần làm tiếp</h3>
          <ul className="bc-tt">{D.viecTiep.map((v) => <li key={v.href}><b>{v.so}</b> {v.viec}: {v.cach}.</li>)}</ul>
        </section>

        <p className="hs-foot">
          Báo cáo sinh tự động từ sổ nguồn đã qua kiểm định tự động; không có câu nhận định nào gõ tay ngoài khung chữ. Một sản phẩm tính là
          {' '}&quot;đã ký&quot; khi có ít nhất một cặp cung cầu được người gác cổng ký dựa trên câu nguồn ở cả hai phía. Cách làm đầy đủ ở
          {' '}<Link className="pf-link" href="/dashboard/phuong-phap">trang Phương pháp</Link>.
        </p>
      </div>
    </>
  );
}
