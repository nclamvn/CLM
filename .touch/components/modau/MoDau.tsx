'use client';

/**
 * MoDau · Man M0 "Tong quan", trang /dashboard. Dung 29/09/2026, thay trang Tong quan anh chup tay
 * 19/07/2026 (so chet va hang viec noi bo co ten nguoi).
 *
 * 01/10/2026 (nghiem thu enterprise muc 7, 11): doi thanh ban tong quan cho nguoi ra quyet dinh.
 *   1. Bon so chinh, moi so mot duong xu huong theo ngay rut tu LICH SU GIT (lib/hub-xu-huong.json,
 *      cong xu_huong tinh lai tu git) va muc tang tu ngay dau. Bam so la ra nguon.
 *   2. Bang do phu theo 10 nhom cong nghe (thay ban do thu nho khong nhan): cham mau nhom, thanh
 *      ti le da ky / co cung / trong.
 *   3. Viec can lam tiep, sinh tu diem yeu tu khai; so bang 0 thi viec tu bien mat.
 *   4. Nam thanh chat luong du lieu, moi thanh mot ti so dem duoc.
 *   5. Sau cua vao man.
 * prefers-reduced-motion: khong dem, khong hien dan.
 */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import md from '@/lib/hub-mo-dau.json';
import xh from '@/lib/hub-xu-huong.json';
import { ProofNumber } from '@/components/proof/ProofLayer';
import { ngayVN } from '@/lib/dinh-dang';

type Nhom = { so: number; nhan: string; soDv: number; soNc: number; coCung: number; daKy: number; trong: number };
type MD = {
  so: Record<string, number>; chuoiCong: { xanh: number; tong: number; dat: boolean; luc: string; nhanh?: boolean } | null;
  diemYeu: Record<string, number>; cua: { href: string; ten: string; su: string }[];
  nhom: Nhom[]; chatLuong: { k: string; nhan: string; tu: number; mau: number }[];
  viecTiep: { so: number; viec: string; cach: string; href: string }[];
  mocNgay: string;
};
type Diem = { ngay: string; donVi: number; cauNguon: number; hangA: number; matchDaKy: number };
type KhoaXH = 'donVi' | 'cauNguon' | 'hangA' | 'matchDaKy';
const D = md as unknown as MD;
// Diem cuoi la so HIEN HANH cua trang (da qua cong mo_dau), them vao neu lich su git chua co
// commit cua hom nay: file xu huong chi doi khi co commit cham du lieu.
const XH = (() => {
  const x = xh as unknown as { sinhTu: string; diem: Diem[] };
  const nay: Diem = { ngay: D.mocNgay.slice(0, 10), donVi: D.so.donVi, cauNguon: D.so.cauNguon, hangA: D.so.tierA, matchDaKy: D.so.matchDaKy };
  const diem = x.diem.filter((p) => p.ngay < nay.ngay);
  return { sinhTu: x.sinhTu, diem: [...diem, nay] };
})();
const mauNhom = (so: number) => ({ '--mau': `var(--nhom-${so})` }) as React.CSSProperties;

function useDem(dich: number, tre = 0) {
  const [v, setV] = useState(dich);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0; const t0 = performance.now() + tre; const T = 1100;
    const buoc = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - t0) / T));
      setV(Math.round(dich * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(buoc);
    };
    setV(0); raf = requestAnimationFrame(buoc);
    return () => cancelAnimationFrame(raf);
  }, [dich, tre]);
  return v;
}

/** Duong xu huong nho, truc x theo ngay that (khong deu buoc), truc y tu min toi max cua chinh no. */
function DuongXH({ khoa }: { khoa: KhoaXH }) {
  const d = XH.diem;
  if (d.length < 2) return null;
  const W = 120; const H = 30;
  const t0 = Date.parse(d[0].ngay); const t1 = Date.parse(d[d.length - 1].ngay);
  const vs = d.map((p) => p[khoa]); const lo = Math.min(...vs); const hi = Math.max(...vs);
  const pts = d.map((p) => [2 + ((Date.parse(p.ngay) - t0) / (t1 - t0 || 1)) * (W - 4), H - 3 - ((p[khoa] - lo) / (hi - lo || 1)) * (H - 6)]);
  // Bac thang: so lieu chi doi khi co commit, giua hai ngay no dung yen (noi thang se ve ra muc tang khong co).
  const bac = pts.flatMap((p, i) => (i === 0 ? [p] : [[p[0], pts[i - 1][1]], p]));
  const cuoi = pts[pts.length - 1];
  return (
    <svg className="md-xh" viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      <polyline points={bac.map((p) => p.join(',')).join(' ')} />
      <circle cx={cuoi[0]} cy={cuoi[1]} r={2.5} />
    </svg>
  );
}

function tang(khoa: KhoaXH) {
  const d = XH.diem;
  if (d.length < 2) return null;
  return { tang: d[d.length - 1][khoa] - d[0][khoa], tu: ngayVN(d[0].ngay).slice(0, 5) };
}

function SoLon({ gia, nhan, phu, khoa, tre, nhan2, xuHuong }: { gia: number; nhan: string; phu: string; khoa: 'units' | 'claims' | 'matches' | 'needs'; tre: number; nhan2?: string; xuHuong?: KhoaXH }) {
  const v = useDem(gia, tre);
  const t = xuHuong ? tang(xuHuong) : null;
  return (
    <ProofNumber khoa={khoa} className="md-so">
      <span className="md-so__dong">
        <span className="md-so__v">{v}{nhan2 && <small>{nhan2}</small>}</span>
        {xuHuong && <DuongXH khoa={xuHuong} />}
      </span>
      <span className="md-so__k">{nhan}</span>
      <span className="md-so__phu">{phu}</span>
      {t && <span className="md-so__tang">{t.tang > 0 ? `+${t.tang}` : t.tang === 0 ? 'không đổi' : t.tang} từ {t.tu}</span>}
    </ProofNumber>
  );
}

function BangNhom() {
  const n = D.nhom;
  const tong = n.reduce((a, g) => ({ soDv: a.soDv + g.soDv, soNc: a.soNc + g.soNc, coCung: a.coCung + g.coCung, daKy: a.daKy + g.daKy, trong: a.trong + g.trong }), { soDv: 0, soNc: 0, coCung: 0, daKy: 0, trong: 0 });
  return (
    <div className="md-bn-cuon" tabIndex={0} role="region" aria-label="Bảng độ phủ theo nhóm, cuộn ngang trên màn hẹp">
    <table className="md-bn">
      <caption className="sr-only">Độ phủ cung cầu theo {n.length} nhóm công nghệ chiến lược</caption>
      <thead>
        <tr><th scope="col">Nhóm công nghệ</th><th scope="col">Đơn vị</th><th scope="col">Nhu cầu</th><th scope="col">Đã ký</th><th scope="col">Chưa ký</th><th scope="col">Trống</th><th scope="col"><span className="sr-only">Tỉ lệ</span></th></tr>
      </thead>
      <tbody>
        {n.map((g) => (
          <tr key={g.so} style={mauNhom(g.so)}>
            <th scope="row"><i className="mau-cham" aria-hidden="true" /><b>{String(g.so).padStart(2, '0')}</b> {g.nhan}</th>
            <td>{g.soDv}</td><td>{g.soNc}</td><td>{g.daKy}</td><td>{g.coCung - g.daKy}</td>
            <td className={g.trong ? 'is-trong' : ''}>{g.trong}</td>
            <td className="md-bn__thanh" aria-hidden="true">
              <span className="md-bn__ky" style={{ width: `${(g.daKy / g.soNc) * 100}%` }} />
              <span className="md-bn__cung" style={{ width: `${((g.coCung - g.daKy) / g.soNc) * 100}%` }} />
            </td>
          </tr>))}
      </tbody>
      <tfoot>
        <tr><th scope="row">Tổng</th><td>{tong.soDv}</td><td>{tong.soNc}</td><td>{tong.daKy}</td><td>{tong.coCung - tong.daKy}</td><td className={tong.trong ? 'is-trong' : ''}>{tong.trong}</td><td /></tr>
      </tfoot>
    </table>
    </div>
  );
}

export function MoDau() {
  const s = D.so; const cc = D.chuoiCong;
  const ngay = ngayVN(D.mocNgay);
  const xhTu = XH.diem.length ? ngayVN(XH.diem[0].ngay) : '';
  return (
    <div className="md">
      <section className="md-hero" aria-labelledby="md-h">
        <div className="md-hero__chu">
          <div className="md-eyebrow">CàoLọcMatch · cung cầu công nghệ chiến lược Việt Nam theo QĐ 21/2026</div>
          <h2 id="md-h" className="md-h">Mỗi con số ở đây bấm được,<br />và bấm là ra câu nguồn.</h2>
          <p className="md-lead">
            Máy cào, lọc và đề xuất ghép cung với cầu. Người gác cổng ký. Câu nguồn nguyên văn nằm sau mọi con số,
            và một lớp kiểm định tự động chặn bất cứ con số nào không truy được về nguồn.
          </p>
          {cc && (
            <ProofNumber khoa="gate" className="md-chuoi">
              <span className={`md-chuoi__cham${cc.dat ? '' : ' is-do'}`} aria-hidden="true" />
              Kiểm định tự động {cc.xanh}/{cc.tong} đạt{cc.nhanh ? ' (lượt nhanh, chưa gồm phép thử cài lỗi)' : ''} · lần chạy {cc.luc.slice(8, 10)}/{cc.luc.slice(5, 7)} {cc.luc.slice(11, 16)}
            </ProofNumber>)}
        </div>
        <div className="md-so-luoi">
          <SoLon gia={s.donVi} nhan="đơn vị cung" phu={`${s.banChup} bài nguồn chiều cung`} khoa="units" tre={0} xuHuong="donVi" />
          <SoLon gia={s.cauNguon} nhan="câu nguồn nguyên văn" phu={`${s.tierA} câu hạng A`} khoa="claims" tre={120} xuHuong="cauNguon" />
          <SoLon gia={s.matchDaKy} nhan="match đã ký bởi người" phu={`${s.tuChoi} cặp bị từ chối, vẫn hiện`} khoa="matches" tre={240} xuHuong="matchDaKy" />
          <SoLon gia={s.ncTrong} nhan="nhu cầu quốc gia chưa có bên cung" phu={`trên ${s.nhuCau} sản phẩm chiến lược`} khoa="needs" tre={360} nhan2={`/${s.nhuCau}`} />
        </div>
      </section>

      <section className="md-giua">
        <div className="dash-panel md-nhom" aria-labelledby="md-nhom-h">
          <div className="md-map-dau">
            <h2 className="hs-h" id="md-nhom-h">Độ phủ theo {D.nhom.length} nhóm công nghệ <span>{s.ncCoCung}/{s.nhuCau} nhu cầu đã có bên cung</span></h2>
            <Link href="/dashboard/thi-truong" className="md-link">Mở toàn cảnh thị trường →</Link>
          </div>
          <div className="tt-cg tt-cg--tren">
            <span><i className="md-mk md-mk--ky" />đã ký</span><span><i className="md-mk md-mk--cung" />có bên cung, chưa ký</span><span><i className="md-mk md-mk--trong" />chưa có bên cung</span>
          </div>
          <BangNhom />
        </div>
        <aside className="dash-panel md-viec" aria-labelledby="md-viec-h">
          <h2 className="hs-h" id="md-viec-h">Việc cần làm tiếp <span>sinh từ điểm yếu tự khai</span></h2>
          <ol>
            {D.viecTiep.map((v) => (
              <li key={v.href}>
                <Link href={v.href}>
                  <b>{v.so}</b>
                  <span className="md-viec__chu"><span className="md-viec__ten">{v.viec}</span><span className="md-viec__cach">{v.cach}</span></span>
                  <span className="md-viec__mui" aria-hidden="true">→</span>
                </Link>
              </li>))}
          </ol>
          <p className="hs-note">Một việc tự biến mất khi con số của nó về 0. Kho tin nội bộ của RtR không nối thẳng vào đây; chỉ qua cầu nối một chiều, lọc theo danh sách cho phép.</p>
        </aside>
      </section>

      <section className="dash-panel md-cl" aria-labelledby="md-cl-h">
        <h2 className="hs-h" id="md-cl-h">Lộ trình chất lượng dữ liệu <span>mỗi thanh là một tỉ số đếm được, không điểm tổng hợp</span></h2>
        <ul>
          {D.chatLuong.map((c) => {
            const pt = Math.round((c.tu / c.mau) * 100);
            return (
              <li key={c.k}>
                <span className="md-cl__nhan">{c.nhan}</span>
                <span className="md-cl__so"><b>{pt}%</b> {c.tu}/{c.mau}</span>
                <span className="md-cl__ray" role="img" aria-label={`${c.tu} trên ${c.mau}`}><span style={{ width: `${pt}%` }} /></span>
              </li>);
          })}
        </ul>
      </section>

      <nav className="md-cua" aria-label="Các màn">
        {D.cua.map((c, i) => (
          <Link key={c.href} href={c.href} className="md-cua__o" style={{ animationDelay: `${300 + i * 80}ms` }}>
            <span className="md-cua__ten">{c.ten}</span>
            <span className="md-cua__su">{c.su}</span>
            <span className="md-cua__mui" aria-hidden="true">→</span>
          </Link>))}
      </nav>
      <p className="hs-foot">Mọi con số trên trang sinh từ dữ liệu ngày {ngay}; cổng kiểm định tính lại và đối chiếu với từng màn. Đường xu hướng đọc lại lịch sử dữ liệu từ {xhTu}, mỗi điểm là bản cuối của một ngày.</p>
    </div>
  );
}
