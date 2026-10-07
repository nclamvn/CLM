'use client';

/**
 * CauThat · Man "Cau that" (01/10/2026, lo 03 da duyet): nhu cau dat hang cong nghe CO NGUOI DAT
 * HANG, moi truong la mot cau nguon nguyen van, kem goi y don vi trong so nguon co cau nguon nang
 * luc lien quan. Goi y la cua may hoi dap, chưa ký, không phải cặp ghép: ghep that van can nguoi ky.
 * Du lieu: lib/hub-cau-that.json (lib/cau-that.mjs). Cong: scripts/check-cau-that.mjs.
 */
import Link from 'next/link';
import { useMemo, useState } from 'react';
import ct from '@/lib/hub-cau-that.json';
import { hienCau } from '@/lib/hien-cau.mjs';
import { ngayVN } from '@/lib/dinh-dang';

type Nguon = { field: string; value: string; span: string; tier: string; source: string; href: string; extraction: string };
type GoiY = { dv: string; slug: string; kyCho: string[]; khop: string[]; trich: { span: string; href: string; tier: string; source: string } | null };
type NhuCau = {
  ma: string; ten: string; benDatHang: string; loai: string; loaiTen: string; maSp: string | null; tenSp: string | null;
  doiTuong: string | null; thoiHan: string | null; kinhPhi: string | null; trangThai: string | null; ngayBai: string | null;
  bacCao: string; nguon: Nguon[]; khaiNiem: string[]; goiY: GoiY[];
};
type DuLieu = { meta: { soNhuCau: number; soBenDatHang: number; coGoiY: number; ganSanPham: number; theoLoai: Record<string, number> }; nhuCau: NhuCau[] };
const D = ct as unknown as DuLieu;

const TEN_LOAI: Record<string, string> = {
  nhiem_vu_khcn: 'Nhiệm vụ KH&CN đặt hàng', bai_toan_lon: 'Bài toán lớn', chuong_trinh: 'Chương trình, đề án', du_an_goi_thau: 'Dự án, gói thầu',
};
const TEN_TRUONG: Record<string, string> = {
  ten_nhu_cau: 'Tên nhu cầu', ben_dat_hang: 'Bên đặt hàng', loai_dat_hang: 'Loại đặt hàng', san_pham_lien_quan: 'Sản phẩm chiến lược',
  doi_tuong: 'Đối tượng đặt hàng', thoi_han: 'Thời hạn', kinh_phi: 'Kinh phí', trang_thai: 'Trạng thái',
};

function The({ n }: { n: NhuCau }) {
  return (
    <li className="ct-the" id={n.ma}>
      <div className="ct-the__dau">
        <span className="ct-ma">{n.ma}</span>
        <span className="hs-chip">{n.loaiTen}</span>
        {n.maSp && <span className="hs-chip" title={n.tenSp ?? undefined}>P{n.maSp}</span>}
        <span className={`pf-tier pf-tier--${n.bacCao}`}>hạng {n.bacCao}</span>
      </div>
      <h3 className="ct-ten">{hienCau(n.ten)}</h3>
      <dl className="ct-dl">
        <div><dt>Bên đặt hàng</dt><dd>{hienCau(n.benDatHang)}</dd></div>
        {n.doiTuong && <div><dt>Đối tượng</dt><dd>{hienCau(n.doiTuong)}</dd></div>}
        {n.thoiHan && <div><dt>Thời hạn</dt><dd>{hienCau(n.thoiHan)}</dd></div>}
        {n.kinhPhi && <div><dt>Kinh phí</dt><dd>{hienCau(n.kinhPhi)}</dd></div>}
        {n.trangThai && <div><dt>Trạng thái</dt><dd>{hienCau(n.trangThai)}</dd></div>}
        {n.ngayBai && <div><dt>Nguồn đăng</dt><dd>{ngayVN(n.ngayBai)}</dd></div>}
      </dl>
      <details className="ct-nguon">
        <summary>{n.nguon.length} câu nguồn nguyên văn</summary>
        <ul>
          {n.nguon.map((x, i) => (
            <li key={i}>
              <span className="ct-nguon__truong">{TEN_TRUONG[x.field] ?? x.field}</span>
              <blockquote>{hienCau(x.span)}</blockquote>
              <span className="ct-nguon__chan">
                <span className={`pf-tier pf-tier--${x.tier}`}>hạng {x.tier}</span> {x.source} ·{' '}
                <a className="pf-link" href={x.href} target="_blank" rel="noopener noreferrer">Mở bản chụp</a>
              </span>
            </li>))}
        </ul>
      </details>
      <div className="ct-goiy">
        <h4 className="ct-goiy__h">Đơn vị trong sổ nguồn có thể đáp ứng <span>gợi ý của máy, chưa ký, không phải cặp ghép</span></h4>
        {n.goiY.length === 0
          ? <p className="ct-trong">Chưa đơn vị nào trong sổ nguồn có câu nguồn năng lực đủ gần. Đây là khoảng trống để tìm thêm bên cung.</p>
          : (
            <ul className="ct-goiy__ds">
              {n.goiY.map((g) => (
                <li key={g.dv}>
                  <Link className="hd-dv__ten" href={`/dashboard/don-vi/${g.slug}`}>{g.dv}</Link>
                  {g.kyCho.length > 0 && <span className="ct-ky"> · đã có cặp được ký cho P{n.maSp} ({g.kyCho.join(', ')})</span>}
                  {g.trich && (
                    <details className="ct-trich">
                      <summary>Câu nguồn năng lực · hạng {g.trich.tier} · {g.trich.source}</summary>
                      <figure className="hd-trich">
                        <blockquote>{hienCau(g.trich.span)}</blockquote>
                        <figcaption>
                          <span className={`pf-tier pf-tier--${g.trich.tier}`}>hạng {g.trich.tier}</span>
                          <span>{g.trich.source}</span>
                          <a className="pf-link" href={g.trich.href} target="_blank" rel="noopener noreferrer">Mở bản chụp</a>
                        </figcaption>
                      </figure>
                    </details>)}
                </li>))}
            </ul>)}
      </div>
    </li>
  );
}

export function CauThat() {
  const [loai, setLoai] = useState<string>('tat_ca');
  const [chiTrong, setChiTrong] = useState(false);
  const ds = useMemo(() => D.nhuCau.filter((n) => (loai === 'tat_ca' || n.loai === loai) && (!chiTrong || n.goiY.length === 0)), [loai, chiTrong]);
  const m = D.meta;
  return (
    <div className="ct">
      <section className="dash-panel ct-dau" aria-labelledby="ct-h">
        <h2 className="hs-h" id="ct-h">Ai đang cần công nghệ gì <span>nhu cầu đặt hàng công khai, có bên đặt hàng rõ ràng, mỗi dòng có câu nguồn</span></h2>
        <div className="ct-so" role="list">
          {Object.entries(TEN_LOAI).map(([k, t]) => (
            <div key={k} className="ct-so__o" role="listitem"><b>{m.theoLoai[k] ?? 0}</b><span>{t}</span></div>))}
          <div className="ct-so__o" role="listitem"><b>{m.coGoiY}/{m.soNhuCau}</b><span>có đơn vị trong sổ nguồn liên quan</span></div>
        </div>
        <p className="hs-note">
          {m.soNhuCau} nhu cầu từ {m.soBenDatHang} bên đặt hàng, {m.ganSanPham} nhu cầu gắn được một sản phẩm chiến lược theo QĐ 21/2026.
          Nhu cầu do người gác cổng duyệt theo lô; đơn vị đi kèm chỉ là gợi ý có dẫn chứng, chưa ký, không phải cặp ghép.
        </p>
        <div className="hd-vidu" role="group" aria-label="Lọc theo loại đặt hàng">
          <button type="button" className="ct-loc" aria-pressed={loai === 'tat_ca'} onClick={() => setLoai('tat_ca')}>Tất cả</button>
          {Object.entries(TEN_LOAI).map(([k, t]) => (
            <button key={k} type="button" className="ct-loc" aria-pressed={loai === k} onClick={() => setLoai(k)}>{t}</button>))}
          <button type="button" className="ct-loc" aria-pressed={chiTrong} onClick={() => setChiTrong((v) => !v)}>Chỉ nhu cầu chưa có bên cung</button>
        </div>
      </section>
      <section className="dash-panel ct-khoi" aria-label="Danh sách nhu cầu">
        <p className="hd-tom" aria-live="polite">Đang hiện {ds.length} nhu cầu.</p>
        <ul className="ct-ds">{ds.map((n) => <The key={n.ma} n={n} />)}</ul>
      </section>
    </div>
  );
}
