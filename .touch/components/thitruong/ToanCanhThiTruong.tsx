'use client';

/**
 * ToanCanhThiTruong · Man M1 "Toan canh thi truong". Dung 29/09/2026.
 *
 * Ba khoi, cung nguon lib/hub-thi-truong.json (lib/thi-truong.mjs sinh luc build, cong
 * check-thi-truong tinh lai va kiem bao toan dong):
 *   1. SANKEY don vi -> nhom -> nhu cau. Don vi dong = MOT cap cung-cau duoc chap nhan (co cau
 *      nguon hoac chu ky). Nhu cau chua co ben cung van hien, rong ruot.
 *   2. BAN DO PHU: moi nhom mot hang, moi nhu cau mot o; da ky / co cung / trong.
 *   3. DO TUOI NGUON theo nam bai dang, xep chong theo trang thai (khong phai ngay chup).
 * Khong co diem, khong co ti le phan tram do may uoc: chi dem.
 */
import Link from 'next/link';
import { useMemo, useState } from 'react';
import tt from '@/lib/hub-thi-truong.json';
import { ProofNumber, useProof } from '@/components/proof/ProofLayer';

type Nut = { id: string; tang: 'don_vi' | 'nhom' | 'nhu_cau'; nhan: string; slug?: string | null; so?: string; maSp?: string; nhom?: string; x: number; w: number; y: number; h: number; giaTri: number; trong: boolean };
type Dong = { s: string; t: string; loai: 'da_ky' | 'cung_sp'; w: number; d: string };
type O = { id: string; maSp: string; ten: string; soCung: number; trangThai: 'da_ky' | 'co_cung' | 'trong' };
type Hang = { so: string; nhan: string; soDv: number; soNc: number; coCung: number; daKy: number; trong: number; o: O[] };
type Nam = { nam: string; tuoi: number; ben: number; giu_nguon_cu: number; qua_han: number; khong_doc_duoc_ngay: number };
type TT = {
  kpi: { soCap: number; capDaKy: number; soNc: number; ncCoCung: number; ncTrong: number; dvCoCap: number; soDv: number };
  sankey: { rong: number; cao: number; nodes: Nut[]; links: Dong[]; chiSo: { dienTichGiao: number; dienTichGiaoPhai: number } };
  phu: Hang[];
  tuoi: { nam: Nam[]; tong: Record<string, number>; mocNgay: string; nguongNgay: number };
};
const D = tt as unknown as TT;
const soHai = (s: string) => s.padStart(2, '0');
const ngan = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const TRANG_THAI = [
  { k: 'tuoi', nhan: 'tươi (trong ngưỡng)' }, { k: 'ben', nhan: 'không hết hạn' },
  { k: 'giu_nguon_cu', nhan: 'nguồn cũ, có lý do giữ' }, { k: 'qua_han', nhan: 'quá hạn, chưa có lý do' },
] as const;

function Sankey() {
  const { moMuc } = useProof();
  const [tro, setTro] = useState<string | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);
  const { rong, cao, nodes, links } = D.sankey;
  const byId = useMemo(() => new Map(nodes.map((n) => [n.id, n])), [nodes]);
  // Soi mot nut: sang cac dong cham vao no, cac nut con lai mo di (showcase).
  const sang = useMemo(() => {
    if (!tro) return null;
    const n = byId.get(tro);
    const ds = new Set<string>();
    if (!n) return ds;
    links.forEach((l, i) => { if (l.s === tro || l.t === tro) ds.add(String(i)); });
    return ds;
  }, [tro, byId, links]);
  const nutSang = useMemo(() => {
    if (!sang) return null;
    const s = new Set<string>([tro as string]);
    links.forEach((l, i) => { if (sang.has(String(i))) { s.add(l.s); s.add(l.t); } });
    // Soi nhom thi giu sang ca nhu cau TRONG cua nhom do: khoang trong la dieu can thay nhat.
    const n = byId.get(tro as string);
    if (n?.tang === 'nhom') nodes.forEach((x) => { if (x.tang === 'nhu_cau' && x.nhom === n.so) s.add(x.id); });
    return s;
  }, [sang, links, tro, byId, nodes]);
  const nTro = tro ? byId.get(tro) : null;
  const bam = (n: Nut) => {
    if (n.tang === 'nhu_cau') moMuc({ loai: 'nhu_cau', entityId: n.id.slice(3) });
    else if (n.tang === 'nhom') moMuc({ loai: 'nhom', so: n.so as string });
    else moMuc({ loai: 'don_vi', ten: n.nhan });
  };
  return (
    <div className="tt-sk" onMouseLeave={() => { setTro(null); setTip(null); }}>
      <svg className="tt-sk__svg" viewBox={`0 0 ${rong} ${cao}`} role="img"
        aria-label={`Sankey ${D.kpi.dvCoCap} đơn vị, ${D.phu.length} nhóm, ${D.kpi.soNc} nhu cầu; ${D.kpi.soCap} cặp cung cầu có nguồn, ${D.kpi.capDaKy} đã ký; ${D.kpi.ncTrong} nhu cầu chưa có bên cung.`}>
        <text x={250 + 6} y={10} textAnchor="end" className="tt-sk__cot">ĐƠN VỊ CUNG</text>
        <text x={500 + 98} y={10} textAnchor="middle" className="tt-sk__cot">NHÓM CÔNG NGHỆ</text>
        <text x={870} y={10} className="tt-sk__cot">NHU CẦU QĐ 21/2026</text>
        <g className="tt-sk__dong">
          {links.map((l, i) => (
            <path key={i} d={l.d} className={`tt-dong tt-dong--${l.loai}${sang ? (sang.has(String(i)) ? ' is-sang' : ' is-mo') : ''}`} />))}
        </g>
        {nodes.map((n) => {
          const mo = nutSang ? !nutSang.has(n.id) : false;
          const cls = `tt-nut tt-nut--${n.tang}${n.trong ? ' is-trong' : ''}${mo ? ' is-mo' : ''}`;
          const vao = (ev: React.MouseEvent) => {
            setTro(n.id);
            const r = ((ev.currentTarget as SVGGElement).ownerSVGElement as SVGSVGElement).parentElement!.getBoundingClientRect();
            setTip({ x: ev.clientX - r.left, y: ev.clientY - r.top });
          };
          return (
            <g key={n.id} className={cls} onMouseEnter={vao} onMouseMove={vao} onClick={() => bam(n)}
              role="button" tabIndex={0} aria-label={`${n.nhan}: ${n.giaTri} cặp`} onKeyDown={(e) => { if (e.key === 'Enter') bam(n); }}
              onFocus={() => setTro(n.id)} onBlur={() => setTro(null)}>
              <rect x={n.x} y={n.y} width={n.w} height={n.h} rx={n.tang === 'nhom' ? 4 : 1.5} className="tt-nut__r" />
              {n.tang === 'don_vi' && <text x={n.x - 6} y={n.y + n.h / 2 + 3.5} textAnchor="end" className="tt-nut__t">{ngan(n.nhan, 34)}</text>}
              {n.tang === 'nhom' && (
                <text x={n.x + 10} y={n.y + n.h / 2 + 4} className="tt-nut__g">
                  <tspan className="tt-nut__gso">{soHai(n.so as string)}</tspan><tspan dx={6}>{ngan(n.nhan, 22)}</tspan>
                </text>)}
              {n.tang === 'nhom' && <text x={n.x + n.w - 8} y={n.y + n.h / 2 + 4} textAnchor="end" className="tt-nut__gv">{n.giaTri}</text>}
              {n.tang === 'nhu_cau' && (
                <text x={n.x + 18} y={n.y + n.h / 2 + 3.5} className="tt-nut__t">
                  <tspan className="tt-nut__ma">P{n.maSp}</tspan><tspan dx={6}>{ngan(n.nhan, n.trong ? 30 : 42)}</tspan>
                  {n.trong && <tspan dx={6} className="tt-nut__trong">chưa có cung</tspan>}
                </text>)}
            </g>);
        })}
      </svg>
      {tip && nTro && (
        <div className="dt2-tip" style={{ left: tip.x, top: tip.y }} aria-hidden="true">
          <div className="dt2-tip__loai">{nTro.tang === 'don_vi' ? 'Đơn vị cung' : nTro.tang === 'nhom' ? `Nhóm ${soHai(nTro.so as string)}` : `Nhu cầu P${nTro.maSp}`}</div>
          <div className="dt2-tip__ten">{nTro.nhan}</div>
          <div className="dt2-tip__phu">
            {nTro.trong ? 'Khoảng trống: chưa có cặp cung cầu nào được chấp nhận'
              // Nut nhom co dong vao VA ra cung mot luong: chi dem mot phia, khong thi gap doi.
              : `${nTro.giaTri} cặp cung cầu có nguồn hoặc chữ ký · ${links.filter((l) => (nTro.tang === 'don_vi' ? l.s === nTro.id : l.t === nTro.id) && l.loai === 'da_ky').reduce((s, l) => s + l.w, 0)} đã ký`}
            {' · bấm để mở lớp phủ nguồn'}
          </div>
        </div>)}
    </div>
  );
}

function BanDoPhu() {
  const { moMuc } = useProof();
  const trongNhieu = D.phu.filter((h) => h.trong > 0).sort((a, b) => b.trong - a.trong || Number(a.so) - Number(b.so));
  return (
    <>
      <p className="tt-cau">
        {D.kpi.ncTrong} trên {D.kpi.soNc} nhu cầu quốc gia chưa có bên cung nào trong registry
        {trongNhieu.length > 0 && <>: {trongNhieu.map((h, i) => <span key={h.so}>{i > 0 ? ', ' : ''}nhóm {soHai(h.so)} ({h.trong})</span>)}</>}.
      </p>
      <table className="tt-phu">
        <thead><tr><th scope="col">Nhóm công nghệ</th><th scope="col" className="tt-phu__so">Đơn vị cung</th><th scope="col">Nhu cầu theo QĐ 21/2026</th><th scope="col" className="tt-phu__so">Có cung</th><th scope="col" className="tt-phu__so">Trống</th></tr></thead>
        <tbody>
          {D.phu.map((h) => (
            <tr key={h.so}>
              <th scope="row"><button type="button" className="tt-phu__nhom" onClick={() => moMuc({ loai: 'nhom', so: h.so })}><b>{soHai(h.so)}</b> {h.nhan}</button></th>
              <td className="tt-phu__so">{h.soDv}</td>
              <td>
                <div className="tt-phu__o">
                  {h.o.map((o) => (
                    <button key={o.id} type="button" className={`tt-o tt-o--${o.trangThai}`} onClick={() => moMuc({ loai: 'nhu_cau', entityId: o.id })}
                      title={`P${o.maSp} · ${o.ten} · ${o.trangThai === 'trong' ? 'chưa có bên cung' : `${o.soCung} đơn vị cung${o.trangThai === 'da_ky' ? ', có match đã ký' : ''}`}`}>
                      P{o.maSp}{o.soCung > 0 && <sub>{o.soCung}</sub>}
                    </button>))}
                </div>
              </td>
              <td className="tt-phu__so">{h.coCung}/{h.soNc}</td>
              <td className={`tt-phu__so${h.trong ? ' tt-phu__so--trong' : ''}`}>{h.trong}</td>
            </tr>))}
        </tbody>
      </table>
      <div className="tt-cg">
        <span><i className="tt-mk tt-o--da_ky" />có match đã ký</span>
        <span><i className="tt-mk tt-o--co_cung" />có bên cung, chưa ký</span>
        <span><i className="tt-mk tt-o--trong" />chưa có bên cung</span>
        <span>số nhỏ = số đơn vị cung</span>
      </div>
    </>
  );
}

function DoTuoi() {
  const ds = D.tuoi.nam;
  const nam0 = Number(ds[0]?.nam ?? 2020); const nam1 = Number(ds[ds.length - 1]?.nam ?? 2026);
  const du = Array.from({ length: nam1 - nam0 + 1 }, (_, k) => ds.find((x) => Number(x.nam) === nam0 + k) ?? { nam: String(nam0 + k), tuoi: 0, ben: 0, giu_nguon_cu: 0, qua_han: 0, khong_doc_duoc_ngay: 0 });
  const tongNam = (x: Nam) => x.tuoi + x.ben + x.giu_nguon_cu + x.qua_han + x.khong_doc_duoc_ngay;
  const max = Math.max(1, ...du.map(tongNam));
  const W = 1000; const H = 230; const TR = 36; const DUOI = 26; const bw = (W - TR) / du.length;
  const y = (v: number) => (v / max) * (H - DUOI - 16);
  return (
    <svg className="tt-tuoi" viewBox={`0 0 ${W} ${H}`} role="img"
      aria-label={`Số câu nguồn theo năm nguồn đăng, ${nam0} đến ${nam1}, xếp chồng theo trạng thái độ tươi.`}>
      {[0, 0.5, 1].map((f) => (
        <g key={f}><line x1={TR} x2={W} y1={H - DUOI - y(max * f)} y2={H - DUOI - y(max * f)} className="tt-tuoi__luoi" />
          <text x={TR - 6} y={H - DUOI - y(max * f) + 3.5} textAnchor="end" className="tt-tuoi__truc">{Math.round(max * f)}</text></g>))}
      {du.map((x, k) => {
        let day = H - DUOI; const x0 = TR + k * bw + bw * 0.18; const bwr = bw * 0.64;
        return (
          <g key={x.nam}>
            {TRANG_THAI.map((t) => {
              const v = x[t.k]; if (!v) return null;
              const h = y(v); day -= h;
              return <rect key={t.k} x={x0} y={day} width={bwr} height={Math.max(0, h - 1)} className={`tt-tuoi__c hs-tt--${t.k}`}><title>{`${x.nam}: ${v} câu ${t.nhan}`}</title></rect>;
            })}
            {tongNam(x) > 0 && <text x={x0 + bwr / 2} y={day - 5} textAnchor="middle" className="tt-tuoi__so">{tongNam(x)}</text>}
            <text x={x0 + bwr / 2} y={H - 8} textAnchor="middle" className="tt-tuoi__truc">{x.nam}</text>
          </g>);
      })}
    </svg>
  );
}

export function ToanCanhThiTruong() {
  const k = D.kpi; const c = D.sankey.chiSo; const t = D.tuoi.tong;
  return (
    <div className="tt">
      <section className="hs-kpi tt-kpi" aria-label="Chỉ số thị trường">
        <div className="hs-kpi__o tt-kpi__o"><span className="hs-kpi__v">{k.soCap}</span><span className="hs-kpi__k">cặp cung cầu có nguồn</span><span className="hs-kpi__phu">mỗi cặp một câu nguồn hoặc một chữ ký</span></div>
        <ProofNumber khoa="matches" className="hs-kpi__o"><span className="hs-kpi__v hs-kpi__v--match"><i aria-hidden="true" />{k.capDaKy}</span><span className="hs-kpi__k">match đã ký</span><span className="hs-kpi__phu">bấm để xem người ký</span></ProofNumber>
        <ProofNumber khoa="needs" className="hs-kpi__o"><span className="hs-kpi__v">{k.ncCoCung}<small>/{k.soNc}</small></span><span className="hs-kpi__k">nhu cầu có bên cung</span><span className="hs-kpi__phu">bấm để xem danh mục QĐ 21/2026</span></ProofNumber>
        <a className="hs-kpi__o" href="#phu"><span className="hs-kpi__v tt-kpi__trong">{k.ncTrong}</span><span className="hs-kpi__k">nhu cầu chưa có bên cung</span><span className="hs-kpi__phu">khoảng trống thị trường</span></a>
        <Link className="hs-kpi__o" href="/dashboard/don-vi"><span className="hs-kpi__v">{k.dvCoCap}<small>/{k.soDv}</small></span><span className="hs-kpi__k">đơn vị đã nối tới nhu cầu</span><span className="hs-kpi__phu">mở bảng hồ sơ đơn vị</span></Link>
      </section>

      <section className="dash-panel hs-sec" aria-labelledby="tt-sk">
        <h2 className="hs-h" id="tt-sk">Dòng cung cầu <span>độ dày = số cặp cung cầu được chấp nhận, không phải ước lượng</span></h2>
        <Sankey />
        <div className="tt-cg">
          <span><i className="tt-mk2 tt-dong--da_ky" />có match đã ký</span>
          <span><i className="tt-mk2 tt-dong--cung_sp" />cùng sản phẩm, có câu nguồn</span>
          <span><i className="tt-mk tt-o--trong" />nhu cầu chưa có bên cung</span>
        </div>
        <p className="hs-note">
          Cặp bị người gác cổng từ chối không mang dòng. Thứ tự nhóm giữ theo vòng lãnh thổ của đồ thị;
          thứ tự đơn vị tối thiểu hoá diện tích giao cắt (tổng tích độ dày hai dòng cắt nhau): còn {c.dienTichGiao} ở tầng trái, {c.dienTichGiaoPhai} ở tầng phải.
          Phần còn lại ở tầng trái đến từ Tập đoàn Viettel nối ba nhóm, không xếp nào tránh được.
        </p>
      </section>

      <section className="dash-panel hs-sec" id="phu" aria-labelledby="tt-phu">
        <h2 className="hs-h" id="tt-phu">Bản đồ phủ nhu cầu <span>mỗi ô một nhu cầu quốc gia; bấm để xem nguồn</span></h2>
        <BanDoPhu />
      </section>

      <section className="dash-panel hs-sec" aria-labelledby="tt-tuoi">
        <h2 className="hs-h" id="tt-tuoi">Độ tươi nguồn <span>theo năm nguồn đăng bài, ngưỡng {D.tuoi.nguongNgay} ngày, mốc {D.tuoi.mocNgay}</span></h2>
        <DoTuoi />
        <div className="tt-cg">{TRANG_THAI.map((s) => <span key={s.k}><i className={`hs-mk2 hs-tt--${s.k}`} />{s.nhan} · {t[s.k]}</span>)}</div>
        <p className="hs-note">
          Bảng tự khai điểm yếu: {t.qua_han} câu mô tả năng lực đã quá ngưỡng mà chưa có lý do giữ, đang được ghi nợ và giảm dần.
          Tên, nhóm, sản phẩm là thông tin không hết hạn nên không tính vào độ tươi.
        </p>
      </section>
    </div>
  );
}
