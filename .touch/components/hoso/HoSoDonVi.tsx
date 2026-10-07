'use client';

/**
 * HoSoDonVi · Man M3 "Ho so don vi". Dung 29/09/2026 theo 09_NANG_CAP_UI_UX.md.
 *
 * Moi thu tren trang DEU tu lib/hub-ho-so.json (lib/ho-so.mjs sinh luc build, cong check-ho-so
 * tinh lai) va lib/cncl-registry.json (cau nguon). Trang KHONG tinh diem tong hop, KHONG suy
 * hang nguon, KHONG bia dinh danh. O nao chua co nguon thi noi thang la chua co.
 *
 * Mau: cung bang Okabe-Ito voi man do thi (cung xanh troi, cau cam, match vermilion). Do tuoi
 * dung them xam cho truong ben (khong het han). Moi mau deu co chu di kem, khong doc bang mau.
 */
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { BangChung, useProof } from '@/components/proof/ProofLayer';
import type { CnclEvidence } from '@/lib/cncl-registry';
import { tenNguoi } from '@/lib/dinh-dang';
import { xepDongThoiGian } from '@/lib/dong-thoi-gian.mjs';
import { MoBanChup } from '@/components/proof/BanChup';

export type HoSo = {
  slug: string; ten: string; loaiHinh: string | null;
  nhoms: { so: string; nhan: string }[]; lanhTho: string | null; bestTier: string; favorsRtr: boolean;
  dinhDanh: { trangThai: 'chua_dinh_danh' | 'da_dinh_danh'; maSo: string | null; href: string | null };
  tuKhai: { tenPhapNhan: string | null; maSo: string | null; href: string; nguon: string } | null;
  dem: { cauNguon: number; theoTier: { A: number; B: number; C: number }; tenMienNguon: number; banChup: number; matchDaKy: number };
  doTuoi: { tuoi: number; ben: number; giuNguonCu: number; quaHan: number; khongDocDuoc: number; cuNhat: string | null; moiNhat: string | null };
  bangChung: { i: number; field: string; tier: string; source: string; href: string; ngayDang: string | null; tuoiNgay: number | null; loaiTruong: string; trangThai: string }[];
  nhuCau: { id: string; maSp: string | null; ten: string; quanHe: string[]; matchId?: string; ky?: { by: string; date: string }; tuChoi?: { by: string; date: string; lyDo: string } }[];
  dongThoiGian: { ngay: string; loai: 'nguon_dang' | 'match_da_ky' | 'tu_choi' | 'de_xuat'; nguon?: string; href?: string; soCau?: number; matchId?: string; maSp?: string | null; by?: string; maHangCho?: string; nhan?: string; nguonUrl?: string | null }[];
  tuongTu: { ten: string; slug: string; lyDo: string; chung: string[] }[];
  cungNhom: { ten: string; slug: string; lyDo: string; chung: string[] }[];
  deNham: { ten: string; slug: string }[];
  oTrong: { truong: string; nhan: string }[];
};
export type HoSoMeta = { mocNgay: string; nguongNgay: number; soDonVi: number };

const THU_TU_TRUONG = ['nang_luc_mo_ta', 'nang_luc_mo_ta_2', 'bang_chung_nang_luc', 'san_pham_lien_quan', 'nhom_cncl', 'loai_hinh', 'location', 'ten_don_vi'];
const hangTruong = (f: string) => { const k = THU_TU_TRUONG.indexOf(f); return k < 0 ? (f.startsWith('nhom_cncl_phu') ? 4.5 : 99) : k; };
const TT_NHAN: Record<string, string> = {
  tuoi: 'tươi', ben: 'không hết hạn', giu_nguon_cu: 'nguồn cũ, có lý do giữ', qua_han: 'quá hạn, chưa có lý do', khong_doc_duoc_ngay: 'không đọc được ngày',
};
const ngayVN = (d: string | null | undefined) => (d ? `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}` : 'chưa rõ');
const soHai = (s: string | null) => (s ? s.padStart(2, '0') : '··');

// ── Thanh do tuoi ───────────────────────────────────────────────────────────
function ThanhTuoi({ t, lon = false }: { t: HoSo['doTuoi']; lon?: boolean }) {
  const phan = [
    { k: 'tuoi', v: t.tuoi }, { k: 'ben', v: t.ben }, { k: 'giu_nguon_cu', v: t.giuNguonCu }, { k: 'qua_han', v: t.quaHan }, { k: 'khong_doc_duoc_ngay', v: t.khongDocDuoc },
  ].filter((p) => p.v > 0);
  const tong = phan.reduce((s, p) => s + p.v, 0) || 1;
  return (
    <div className={`hs-tuoi${lon ? ' hs-tuoi--lon' : ''}`} role="img"
      aria-label={phan.map((p) => `${p.v} câu ${TT_NHAN[p.k]}`).join(', ')}>
      {phan.map((p) => <span key={p.k} className={`hs-tuoi__p hs-tt--${p.k}`} style={{ flexGrow: p.v / tong }} title={`${p.v} câu ${TT_NHAN[p.k]}`} />)}
    </div>
  );
}

// ── Do thi mot buoc ─────────────────────────────────────────────────────────
function DoThiMotBuoc({ hs }: { hs: HoSo }) {
  // Ba cot: don vi | nhu cau | don vi cung cung. Thu tu cot phai theo trung vi vi tri nhu cau
  // chung (median, nhu ma tran) de it cat nhau. Chieu cao theo so dong, khong de khoang trong.
  const [tro, setTro] = useState<string | null>(null);
  const { moMuc } = useProof();
  const nc = hs.nhuCau;
  if (!nc.length) return <p className="hs-empty">Đơn vị này chưa nối tới nhu cầu nào qua cạnh có nguồn hay chữ ký.</p>;
  const W = 460; const BUOC = 30; const TREN = 22;
  const X0 = 26; const X1 = 170; const X2 = 290;
  const vtNc = new Map(nc.map((n, k) => [`P${n.maSp}`, k]));
  const trungVi = (xs: number[]) => { const t = [...xs].sort((a, b) => a - b); const m = t.length >> 1; return t.length % 2 ? t[m] : (t[m - 1] + t[m]) / 2; };
  const ngoai = hs.tuongTu.map((t) => ({ ...t, k: trungVi(t.chung.map((c) => vtNc.get(c) ?? 0)) }))
    .sort((a, b) => a.k - b.k || (a.ten < b.ten ? -1 : a.ten > b.ten ? 1 : 0));
  const soDong = Math.max(nc.length, ngoai.length, 1);
  const H = TREN * 2 + (soDong - 1) * BUOC;
  const yNc = (k: number) => TREN + (k + (soDong - nc.length) / 2) * BUOC;
  const yO = (k: number) => TREN + (k + (soDong - ngoai.length) / 2) * BUOC;
  const yTam = H / 2;
  const cong = (xa: number, ya: number, xb: number, yb: number) => { const m = (xa + xb) / 2; return `M${xa},${ya} C${m},${ya} ${m},${yb} ${xb},${yb}`; };
  return (
    <svg className="hs-mini" viewBox={`0 0 ${W} ${H}`} role="group"
      aria-label={`${hs.ten} nối tới ${nc.length} nhu cầu; ${ngoai.length} đơn vị khác cùng cung các nhu cầu đó.`}>
      {ngoai.map((o, j) => o.chung.map((c) => {
        const k = vtNc.get(c); if (k === undefined) return null;
        return <path key={`${o.slug}-${c}`} d={cong(X1, yNc(k), X2, yO(j))} className={`hs-mini__l hs-mini__l--ngoai${tro && tro !== o.slug ? ' is-mo' : ''}${tro === o.slug ? ' is-sang' : ''}`} />;
      }))}
      {nc.map((n, k) => {
        const loai = n.quanHe.includes('match_da_ky') ? 'match' : n.quanHe.includes('tu_choi') ? 'tu_choi' : 'sp';
        return <path key={n.id} d={cong(X0, yTam, X1, yNc(k))} className={`hs-mini__l hs-mini__l--${loai}`} />;
      })}
      <circle cx={X0} cy={yTam} r={10} className="hs-mini__tam" />
      {nc.map((n, k) => (
        <g key={n.id} className="hs-mini__nc" role="button" tabIndex={0} aria-label={`Nhu cầu P${n.maSp}: ${n.ten}`}
          onClick={() => moMuc({ loai: 'nhu_cau', entityId: n.id })} onKeyDown={(e) => { if (e.key === 'Enter') moMuc({ loai: 'nhu_cau', entityId: n.id }); }}>
          <rect x={X1 - 6} y={yNc(k) - 6} width={12} height={12} rx={1.5} transform={`rotate(45 ${X1} ${yNc(k)})`} />
          <text x={X1} y={yNc(k) - 11} textAnchor="middle">P{n.maSp}</text>
        </g>))}
      {ngoai.map((o, j) => (
        <Link key={o.slug} href={`/dashboard/don-vi/${o.slug}`} className="hs-mini__o"
          onMouseEnter={() => setTro(o.slug)} onMouseLeave={() => setTro(null)} onFocus={() => setTro(o.slug)} onBlur={() => setTro(null)}>
          <circle cx={X2} cy={yO(j)} r={5} />
          <text x={X2 + 10} y={yO(j) + 3.5}>{o.ten.length > 22 ? `${o.ten.slice(0, 21)}…` : o.ten}</text>
        </Link>))}
      {ngoai.length === 0 && <text x={X2} y={yTam + 3.5} className="hs-mini__rong">không có đơn vị cùng cung</text>}
    </svg>
  );
}

// ── Dong thoi gian ──────────────────────────────────────────────────────────
// Bo tri o lib/dong-thoi-gian.mjs (ham thuan); cong check-dong-thoi-gian.mjs do lai hinh hoc.
function DongThoiGian({ hs, moc }: { hs: HoSo; moc: string }) {
  const bt = xepDongThoiGian(hs.dongThoiGian, moc, ngayVN);
  if (!bt) return <p className="hs-empty">Chưa có mốc thời gian nào đọc được.</p>;
  const { W, H, TRAI, PHAI, nam, xMoc, lan, diem, soAn } = bt;
  return (
    <>
      <svg className="hs-tl" viewBox={`0 0 ${W} ${H}`} role="group" aria-label={`Dòng thời gian ${diem.length} mốc, từ ${ngayVN(diem[0].ngay)} đến ${ngayVN(diem[diem.length - 1].ngay)}.`}>
        {nam.map((n) => (
          <g key={n.nam}><line x1={n.x} x2={n.x} y1={14} y2={H - 8} className="hs-tl__luoi" />{n.x < W - 40 && <text x={n.x + 3} y={12} className="hs-tl__nam">{n.nam}</text>}</g>))}
        <line x1={xMoc} x2={xMoc} y1={14} y2={H - 8} className="hs-tl__moc" />
        <text x={xMoc - 4} y={H - 2} textAnchor="end" className="hs-tl__moc-nhan">mốc đo {ngayVN(moc)}</text>
        {lan.map((l) => (
          <g key={l.l}>
            <text x={0} y={l.y + 4} className="hs-tl__lan">{l.nhan}</text>
            <line x1={TRAI} x2={W - PHAI} y1={l.y} y2={l.y} className="hs-tl__truc" />
          </g>))}
        {diem.map((d, k) => (
          <g key={k} className={`hs-tl__d hs-tl__d--${d.loai}`}>
            {d.loai === 'nguon_dang' && d.href
              ? <a href={d.href} target="_blank" rel="noopener noreferrer" aria-label={`Mở bài nguồn ${d.nhan}`}><circle cx={d.x} cy={d.y} r={6} /></a>
              : d.loai === 'de_xuat' && d.nguonUrl
                ? <a href={d.nguonUrl} target="_blank" rel="noopener noreferrer" aria-label={`Mở nguồn đề xuất ${d.nhan}`}><circle cx={d.x} cy={d.y} r={6} /></a>
                : <circle cx={d.x} cy={d.y} r={6} />}
            <title>{d.loai === 'de_xuat' && d.soGop === 1 && d.nhanDx ? `${ngayVN(d.ngay)} · ${d.nhanDx}` : d.nhan}</title>
            {d.hang >= 0 && <text x={d.x} y={d.yChu} textAnchor={d.neo}>{d.nhan}</text>}
          </g>))}
      </svg>
      {soAn > 0 && <p className="hs-note">{soAn} mốc đứng sát nhau nên ẩn nhãn; rê chuột vào chấm để đọc.</p>}
    </>
  );
}

// ── Trang ───────────────────────────────────────────────────────────────────
export function HoSoDonVi({ hs, bangChung, meta }: { hs: HoSo; bangChung: CnclEvidence[]; meta: HoSoMeta }) {
  const { moMuc } = useProof();
  const moDv = () => moMuc({ loai: 'don_vi', ten: hs.ten });
  const ev = useMemo(() => hs.bangChung.slice().sort((a, b) => hangTruong(a.field) - hangTruong(b.field) || a.i - b.i), [hs]);
  // Gop cac truong rut tu cung mot cau nguon (cung span, cung ban chup) vao mot the.
  const nhomEv = useMemo(() => {
    const m = new Map<string, { b: (typeof ev)[number]; them: (typeof ev)[number][] }>();
    for (const b of ev) {
      const e = bangChung[b.i]; const k = `${e.href}\u0000${e.span}`;
      const g = m.get(k); if (g) g.them.push(b); else m.set(k, { b, them: [] });
    }
    return [...m.values()];
  }, [ev, bangChung]);
  const deXuat = hs.dongThoiGian.filter((d) => d.loai === 'de_xuat');
  const nhomChinh = hs.nhoms.find((n) => n.so === hs.lanhTho) ?? hs.nhoms[0];
  return (
    <div className="hs">
      <section className="dash-panel hs-head" aria-label="Đầu hồ sơ">
        <nav className="hs-crumb" aria-label="Đường dẫn"><Link href="/dashboard/don-vi">Hồ sơ đơn vị</Link><span aria-hidden="true">/</span><span>{soHai(nhomChinh?.so ?? null)} {nhomChinh?.nhan.replace(/^Nhóm \d+ · /, '') ?? 'chưa có câu nguồn về nhóm'}</span></nav>
        <div className="hs-ten-dong">
          <h1 className="hs-ten">{hs.ten}</h1>
          <button type="button" className="reg-pill hs-in" onClick={() => window.print()}>In hoặc lưu PDF</button>
        </div>
        <div className="hs-chips">
          {hs.loaiHinh ? <span className="hs-chip">{hs.loaiHinh}</span> : <span className="hs-chip hs-chip--trong">loại hình: chưa có nguồn</span>}
          {hs.nhoms.map((n) => (
            <button key={n.so} type="button" className="hs-chip hs-chip--btn" style={{ '--mau': `var(--nhom-${n.so})` } as React.CSSProperties} onClick={() => moMuc({ loai: 'nhom', so: n.so })}><i className="mau-cham" aria-hidden="true" />{n.nhan}</button>))}
          <span className={`pf-tier pf-tier--${hs.bestTier}`}>nguồn tốt nhất: hạng {hs.bestTier}</span>
          {hs.favorsRtr && <span className="hs-chip hs-chip--coi" title="Đơn vị liên quan RtR, bên dựng hub. Đọc bằng chứng với con mắt nghi ngờ hơn.">liên quan RtR, bên dựng hub</span>}
        </div>
        <p className={`hs-dd hs-dd--${hs.dinhDanh.trangThai}`}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M10 3 4.5 5v4.5c0 3.4 2.4 5.6 5.5 6.8 3.1-1.2 5.5-3.4 5.5-6.8V5z" /></svg>
          {hs.dinhDanh.trangThai === 'da_dinh_danh'
            ? <>Đã định danh pháp nhân: mã số {hs.dinhDanh.maSo}{hs.dinhDanh.href && <> · <MoBanChup href={hs.dinhDanh.href}>bản chụp</MoBanChup></>}</>
            : <><b>Chưa định danh pháp nhân.</b> Sổ nguồn chưa có mã số doanh nghiệp tra từ cổng thông tin chính thức; trang tổng hợp tư nhân không được dùng làm nguồn.</>}
        </p>
        {hs.tuKhai && (
          <p className="hs-tk">
            <span className="hs-tk__nhan">Tự khai, chưa đối chiếu cổng</span>
            {hs.tuKhai.tenPhapNhan && <span>Pháp nhân: <b>{hs.tuKhai.tenPhapNhan}</b></span>}
            {hs.tuKhai.maSo && <span>Mã số: <b className="hs-tk__ma">{hs.tuKhai.maSo}</b></span>}
            <MoBanChup href={hs.tuKhai.href}>bản chụp {hs.tuKhai.nguon}</MoBanChup>
          </p>)}
      </section>

      <section className="hs-kpi" aria-label="Chỉ số bằng chứng">
        <button type="button" className="hs-kpi__o" onClick={moDv} title="Bấm để xem toàn bộ câu nguồn">
          <span className="hs-kpi__v">{hs.dem.cauNguon}</span><span className="hs-kpi__k">câu nguồn</span>
          <span className="hs-kpi__phu">hạng A {hs.dem.theoTier.A} · B {hs.dem.theoTier.B} · C {hs.dem.theoTier.C}</span>
        </button>
        <button type="button" className="hs-kpi__o" onClick={moDv} title="Bấm để xem các nguồn">
          <span className="hs-kpi__v">{hs.dem.tenMienNguon}</span><span className="hs-kpi__k">tên miền nguồn</span>
          <span className="hs-kpi__phu">{hs.dem.banChup} bản chụp</span>
        </button>
        <div className="hs-kpi__o hs-kpi__o--tuoi">
          <span className="hs-kpi__k">Độ tươi nguồn · ngưỡng {meta.nguongNgay} ngày</span>
          <ThanhTuoi t={hs.doTuoi} lon />
          <span className="hs-kpi__phu">bài mới nhất {ngayVN(hs.doTuoi.moiNhat)}{hs.doTuoi.quaHan > 0 ? ` · ${hs.doTuoi.quaHan} câu quá hạn chưa có lý do` : ''}</span>
        </div>
        <button type="button" className="hs-kpi__o" onClick={moDv} title="Bấm để xem match và chữ ký">
          <span className="hs-kpi__v hs-kpi__v--match"><i aria-hidden="true" />{hs.dem.matchDaKy}</span><span className="hs-kpi__k">match đã ký</span>
          <span className="hs-kpi__phu">máy không tạo chữ ký</span>
        </button>
        <a className="hs-kpi__o" href="#o-trong">
          <span className="hs-kpi__v">{hs.oTrong.length}</span><span className="hs-kpi__k">ô chưa có nguồn</span>
          <span className="hs-kpi__phu">nói thẳng, không giấu</span>
        </a>
      </section>

      <div className="hs-grid">
        <section className="dash-panel hs-sec" aria-labelledby="hs-nl">
          <h2 className="hs-h" id="hs-nl">Năng lực và bằng chứng <span>{ev.length} trường từ {nhomEv.length} câu nguyên văn</span></h2>
          <ul className="pf-evs">
            {nhomEv.map(({ b, them }) => {
              const e = bangChung[b.i];
              return <BangChung key={b.i} e={e} them={them.map((x) => ({ field: bangChung[x.i].field, value: bangChung[x.i].value }))} phu={
                <span className={`hs-tt hs-tt--${b.trangThai}`} title={b.ngayDang ? `Nguồn đăng ${ngayVN(b.ngayDang)}, ${b.tuoiNgay} ngày trước mốc đo` : ''}>
                  {b.ngayDang ? `${ngayVN(b.ngayDang)} · ${TT_NHAN[b.trangThai]}` : b.trangThai === 'ben' ? 'định danh, không có ngày đăng' : TT_NHAN[b.trangThai]}
                </span>} />;
            })}
          </ul>
        </section>

        <div className="hs-col">
          <section className="dash-panel hs-sec" aria-labelledby="hs-qh">
            <h2 className="hs-h" id="hs-qh">Quan hệ một bước <span>nhu cầu và đơn vị cùng cung</span></h2>
            <DoThiMotBuoc hs={hs} />
            <div className="hs-mini__cg">
              <span><i className="hs-mk hs-mk--match" />match đã ký</span>
              <span><i className="hs-mk hs-mk--sp" />cùng sản phẩm</span>
              <span><i className="hs-mk hs-mk--tc" />bị từ chối</span>
              <span><i className="hs-mk hs-mk--o" />đơn vị cùng cung</span>
            </div>
          </section>

          <section className="dash-panel hs-sec" aria-labelledby="hs-nc">
            <h2 className="hs-h" id="hs-nc">Nhu cầu phù hợp <span>{hs.nhuCau.length}</span></h2>
            {hs.nhuCau.length === 0 ? <p className="hs-empty">Chưa có nhu cầu nào nối tới đơn vị này.</p> : (
              <ul className="hs-nc">{hs.nhuCau.map((n) => (
                <li key={n.id}>
                  <button type="button" className="hs-nc__row" onClick={() => moMuc({ loai: 'nhu_cau', entityId: n.id })}>
                    <span className="hs-nc__ma">P{n.maSp}</span>
                    <span className="hs-nc__ten">{n.ten}</span>
                    <span className="hs-nc__qh">
                      {n.quanHe.includes('match_da_ky') && <span className="hs-badge hs-badge--match">{n.matchId} · ký {tenNguoi(n.ky?.by)}, {ngayVN(n.ky?.date)}</span>}
                      {n.quanHe.includes('cung_san_pham') && <span className="hs-badge">cùng sản phẩm, có câu nguồn</span>}
                      {n.quanHe.includes('tu_choi') && <span className="hs-badge hs-badge--tc">bị từ chối</span>}
                    </span>
                  </button>
                  {n.tuChoi && <p className="hs-nc__ld">{tenNguoi(n.tuChoi.by)}, {ngayVN(n.tuChoi.date)}: <q>{n.tuChoi.lyDo}</q></p>}
                </li>))}
              </ul>)}
          </section>
        </div>
      </div>

      <section className="dash-panel hs-sec" aria-labelledby="hs-tl">
        <h2 className="hs-h" id="hs-tl">Dòng thời gian <span>ngày nguồn đăng, không phải ngày chụp</span></h2>
        <DongThoiGian hs={hs} moc={meta.mocNgay} />
      </section>

      <div className="hs-grid3">
        <section className="dash-panel hs-sec" aria-labelledby="hs-tt">
          <h2 className="hs-h" id="hs-tt">Đơn vị tương tự <span>có lý do, không có điểm</span></h2>
          {hs.tuongTu.length === 0 && hs.cungNhom.length === 0 && <p className="hs-empty">Chưa có đơn vị nào cùng nhu cầu hay cùng nhóm.</p>}
          {hs.tuongTu.length > 0 && (<>
            <div className="hs-sub">Cùng cung một nhu cầu</div>
            <ul className="hs-links">{hs.tuongTu.map((t) => (
              <li key={t.slug}><Link href={`/dashboard/don-vi/${t.slug}`}>{t.ten}</Link> <span className="hs-links__phu">{t.chung.join(', ')}</span></li>))}
            </ul></>)}
          {hs.cungNhom.length > 0 && (
            <details className="hs-more">
              <summary>Cùng nhóm công nghệ · {hs.cungNhom.length}</summary>
              <ul className="hs-links">{hs.cungNhom.map((t) => (
                <li key={t.slug}><Link href={`/dashboard/don-vi/${t.slug}`}>{t.ten}</Link> <span className="hs-links__phu">nhóm {t.chung.join(', ')}</span></li>))}
              </ul>
            </details>)}
        </section>

        <section className="dash-panel hs-sec" aria-labelledby="hs-dn">
          <h2 className="hs-h" id="hs-dn">Tên dễ nhầm <span>cùng tập đoàn, khác pháp nhân</span></h2>
          {hs.deNham.length === 0 ? <p className="hs-empty">Không có tên nào trong danh sách dễ nhầm của lĩnh vực.</p> : (<>
            <ul className="hs-links">{hs.deNham.map((t) => <li key={t.slug}><Link href={`/dashboard/don-vi/${t.slug}`}>{t.ten}</Link></li>)}</ul>
            <p className="hs-note">Sổ nguồn cấm gộp các tên này. Người gác cổng quyết, máy không tự gộp.</p></>)}
        </section>

        <section className="dash-panel hs-sec" id="o-trong" aria-labelledby="hs-ot">
          <h2 className="hs-h" id="hs-ot">Ô chưa có nguồn <span>{hs.oTrong.length}</span></h2>
          {hs.oTrong.length === 0 ? <p className="hs-empty">Mọi trường trong schema đều đã có câu nguồn.</p> : (
            <ul className="hs-trong">{hs.oTrong.map((o) => <li key={o.truong}><span className="hs-trong__mk" aria-hidden="true" />{o.nhan}</li>)}</ul>)}
          <p className="hs-note">Trống nghĩa là chưa tìm được nguồn đủ chuẩn, không có nghĩa là đơn vị không có.</p>
        </section>
      </div>

      {deXuat.length > 0 && (
        <section className="dash-panel hs-sec" aria-labelledby="hs-dx">
          <h2 className="hs-h" id="hs-dx">Tin mới từ vòng tự chạy <span>chưa duyệt, chưa là sự thật của registry</span></h2>
          <ul className="hs-dx">{deXuat.map((d) => (
            <li key={d.maHangCho}>
              <span className="pf-chip pf-chip--pending">chờ người duyệt</span>
              <span className="hs-dx__nhan">{d.nhan}</span>
              {d.nguonUrl && <a className="pf-link" href={d.nguonUrl} target="_blank" rel="noopener noreferrer">nguồn · {ngayVN(d.ngay)}</a>}
            </li>))}
          </ul>
        </section>)}

      <p className="hs-foot">
        Hồ sơ sinh từ registry lúc dựng dữ liệu ({ngayVN(meta.mocNgay)}); cổng check-ho-so tính lại và đối chiếu từng khối.
        Không có điểm tổng hợp: nhà đầu tư đọc câu nguồn, không đọc một con số do máy chấm.
      </p>
    </div>
  );
}
