'use client';

/**
 * MoDau · Man M0 "Mo dau", trang /dashboard. Dung 29/09/2026, thay trang Tong quan anh chup tay
 * 19/07/2026 (so chet va hang viec noi bo co ten nguoi).
 *
 * Ba nhip, xem trong 30 giay:
 *   1. So chinh dem len MOT lan (server da ve san so that, JS chi dem lai), bam la ra nguon.
 *   2. Ban do lanh tho thu nho hien theo tang: vung, nut, canh, match da ky; khoang trong nhap MOT
 *      lan roi dung (khong chuyen dong lien tuc).
 *   3. Sau cua vao man, moi cua mot su that sinh tu du lieu; va bang tu khai diem yeu.
 * prefers-reduced-motion: khong dem, khong hien dan.
 */
import Link from 'next/link';
import { useEffect, useState } from 'react';
import md from '@/lib/hub-mo-dau.json';
import graph from '@/lib/hub-graph.json';
import { ProofNumber } from '@/components/proof/ProofLayer';

type MD = {
  so: Record<string, number>; chuoiCong: { xanh: number; tong: number; dat: boolean; luc: string } | null;
  diemYeu: Record<string, number>; cua: { href: string; ten: string; su: string }[];
  ban_do: { canhNoiHaiNhom: number; soNhom: number }; mocNgay: string;
};
type Nut = { id: string; kind: string; x: number; y: number };
type Canh = { kind: string; source: string; target: string };
type LT = { id: string; so: string | null; cx: number; cy: number; r: number };
const D = md as unknown as MD;
const G = graph as unknown as { nodes: Nut[]; edges: Canh[]; boCuc: { rong: number; cao: number; lanhTho: LT[] } };

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

function SoLon({ gia, nhan, phu, khoa, tre, nhan2 }: { gia: number; nhan: string; phu: string; khoa: 'units' | 'claims' | 'matches' | 'needs'; tre: number; nhan2?: string }) {
  const v = useDem(gia, tre);
  return (
    <ProofNumber khoa={khoa} className="md-so">
      <span className="md-so__v">{v}{nhan2 && <small>{nhan2}</small>}</span>
      <span className="md-so__k">{nhan}</span>
      <span className="md-so__phu">{phu}</span>
    </ProofNumber>
  );
}

function BanDoNho() {
  const { rong, cao, lanhTho } = G.boCuc;
  const byId = new Map(G.nodes.map((n) => [n.id, n]));
  const cheo = G.edges.filter((e) => e.kind === 'cung_san_pham' || e.kind === 'match_da_ky');
  const coCung = new Set(cheo.map((e) => e.target));
  return (
    <svg className="md-map" viewBox={`0 0 ${rong} ${cao}`} role="img" aria-label={`Bản đồ ${D.ban_do.soNhom} nhóm công nghệ, ${D.so.donVi} đơn vị, ${D.so.nhuCau} nhu cầu; ${D.so.ncTrong} nhu cầu chưa có bên cung.`}>
      <g className="md-t md-t--1">{lanhTho.map((l) => <circle key={l.id} cx={l.cx} cy={l.cy} r={l.r} className="md-lt" />)}</g>
      <g className="md-t md-t--3">{cheo.filter((e) => e.kind === 'cung_san_pham').map((e, i) => {
        const a = byId.get(e.source); const b = byId.get(e.target); if (!a || !b) return null;
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="md-c" />;
      })}</g>
      <g className="md-t md-t--4">{cheo.filter((e) => e.kind === 'match_da_ky').map((e, i) => {
        const a = byId.get(e.source); const b = byId.get(e.target); if (!a || !b) return null;
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} className="md-m" />;
      })}</g>
      <g className="md-t md-t--2">{G.nodes.filter((n) => n.kind === 'don_vi' || n.kind === 'nhu_cau').map((n) => (
        n.kind === 'don_vi'
          ? <circle key={n.id} cx={n.x} cy={n.y} r={6} className="md-dv" />
          : <rect key={n.id} x={n.x - 5} y={n.y - 5} width={10} height={10} transform={`rotate(45 ${n.x} ${n.y})`} className={coCung.has(n.id) ? 'md-nc' : 'md-nc md-nc--trong'} />
      ))}</g>
    </svg>
  );
}

export function MoDau() {
  const s = D.so; const cc = D.chuoiCong; const y = D.diemYeu;
  const ngay = `${D.mocNgay.slice(8, 10)}/${D.mocNgay.slice(5, 7)}/${D.mocNgay.slice(0, 4)}`;
  return (
    <div className="md">
      <section className="md-hero" aria-labelledby="md-h">
        <div className="md-hero__chu">
          <div className="md-eyebrow">CàoLọcMatch · cung cầu công nghệ chiến lược Việt Nam theo QĐ 21/2026</div>
          <h1 id="md-h" className="md-h">Mỗi con số ở đây bấm được,<br />và bấm là ra câu nguồn.</h1>
          <p className="md-lead">
            Máy cào, lọc và đề xuất ghép cung với cầu. Người gác cổng ký. Câu nguồn nguyên văn nằm sau mọi con số,
            và một lớp kiểm định tự động chặn bất cứ con số nào không truy được về nguồn.
          </p>
          {cc && (
            <ProofNumber khoa="gate" className="md-chuoi">
              <span className={`md-chuoi__cham${cc.dat ? '' : ' is-do'}`} aria-hidden="true" />
              Kiểm định tự động {cc.xanh}/{cc.tong} đạt · lần chạy {cc.luc.slice(8, 10)}/{cc.luc.slice(5, 7)} {cc.luc.slice(11, 16)}
            </ProofNumber>)}
        </div>
        <div className="md-so-luoi">
          <SoLon gia={s.donVi} nhan="đơn vị cung" phu={`${s.banChup} bài nguồn chiều cung`} khoa="units" tre={0} />
          <SoLon gia={s.cauNguon} nhan="câu nguồn nguyên văn" phu={`${s.tierA} câu hạng A`} khoa="claims" tre={120} />
          <SoLon gia={s.matchDaKy} nhan="match đã ký bởi người" phu={`${s.tuChoi} cặp bị từ chối, vẫn hiện`} khoa="matches" tre={240} />
          <SoLon gia={s.ncTrong} nhan="nhu cầu quốc gia chưa có bên cung" phu={`trên ${s.nhuCau} sản phẩm chiến lược`} khoa="needs" tre={360} nhan2={`/${s.nhuCau}`} />
        </div>
      </section>

      <section className="md-giua">
        <div className="dash-panel md-map-khung" aria-labelledby="md-map-h">
          <div className="md-map-dau">
            <h2 className="hs-h" id="md-map-h">{D.ban_do.soNhom} nhóm công nghệ, {s.capCungCau} cặp cung cầu <span>chỉ {D.ban_do.canhNoiHaiNhom} cạnh nối hai nhóm</span></h2>
            <Link href="/dashboard/do-thi" className="md-link">Mở đồ thị đầy đủ →</Link>
          </div>
          <BanDoNho />
          <div className="tt-cg">
            <span><i className="md-mk md-mk--dv" />đơn vị cung</span><span><i className="md-mk md-mk--nc" />nhu cầu có bên cung</span>
            <span><i className="md-mk md-mk--trong" />nhu cầu chưa có bên cung</span><span><i className="tt-mk2 tt-dong--da_ky" />match đã ký</span>
          </div>
        </div>
        <aside className="dash-panel md-yeu" aria-labelledby="md-yeu-h">
          <h2 className="hs-h" id="md-yeu-h">Tự khai điểm yếu <span>trước khi ai hỏi</span></h2>
          <ul>
            <li><b>{y.chuaDinhDanh}/{s.donVi}</b> đơn vị chưa định danh pháp nhân: chưa có mã số doanh nghiệp tra từ cổng chính thức.</li>
            <li><b>{y.quaHanChuaLyDo}</b> câu mô tả năng lực đã quá ngưỡng 180 ngày mà chưa có lý do giữ; <b>{y.giuNguonCu}</b> câu nguồn cũ có lý do ghi rõ.</li>
            <li><b>{y.deXuatChoDuyet}</b> tin mới từ vòng tự chạy đang chờ người duyệt, chưa tính là sự thật.</li>
            <li>Kho tin nội bộ của RtR không nối thẳng vào đây; chỉ qua cầu nối một chiều, lọc theo danh sách cho phép.</li>
          </ul>
          <p className="hs-note">Nhà đầu tư tin một bảng tự khai điểm yếu hơn một bảng toàn xanh.</p>
        </aside>
      </section>

      <nav className="md-cua" aria-label="Các màn">
        {D.cua.map((c, i) => (
          <Link key={c.href} href={c.href} className="md-cua__o" style={{ animationDelay: `${900 + i * 80}ms` }}>
            <span className="md-cua__ten">{c.ten}</span>
            <span className="md-cua__su">{c.su}</span>
            <span className="md-cua__mui" aria-hidden="true">→</span>
          </Link>))}
      </nav>
      <p className="hs-foot">Mọi con số trên trang sinh từ dữ liệu ngày {ngay}; cổng check-mo-dau tính lại và đối chiếu với từng màn.</p>
    </div>
  );
}
