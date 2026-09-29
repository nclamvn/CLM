'use client';

/**
 * DoThiCungCau · Man "Do thi cung cau". Dung lai 29/09/2026 sau khi Lam che ban canvas luc day la
 * "roi, don gian, khong khoa hoc". Can cu: 09_nghien_cuu_ui/domains/truc_quan_do_thi (187 claim)
 * va 13_THIET_KE_DO_THI.md.
 *
 * HAI CHE DO, CUNG DU LIEU (lib/hub-graph.json, bo cuc tinh luc build, tat dinh):
 *   BAN DO  · moi nhom cong nghe la mot LANH THO; thanh vien nam trong vung thay vi noi bang 75
 *             duong "thuoc nhom" (Tufte). Du lieu nay roi vao ca "simultaneous spatial rights" cua
 *             Collins et al. 2009: nhom va canh trung nhau nen vung tron bao nhom la du, khong can
 *             duong vien lom kieu Bubble Sets. Chi ve 54 canh cung-cau: 0 giao canh,
 *             0 canh xuyen nut (do lai boi check-do-thi.mjs, ngan sach mot chieu).
 *   MA TRAN · don vi x nhu cau, chia khoi theo lanh tho, sap median (Eades & Wormald 1994). Cho tra
 *             cuu tren ~20 nut ma tran nhanh va dung hon node-link (Ghoniem et al. 2004).
 * Mau: it sac, an toan mu mau (Okabe & Ito): cung xanh troi, cau cam, match DA KY do son. Hinh
 * dang ma hoa lap lai (tron/thoi) de khong phu thuoc mau.
 * Chuyen dong: vao man mot lan theo tang (vung, nut, canh, match) chung 1,3 s (Heer & Robertson
 * 2007); KHONG co hat chay lien tuc. prefers-reduced-motion: ve tinh ngay.
 * Nhu cau khong co ben cung nao ve RONG ruot: khoang trong thi truong, noi thang tren man.
 */
import { useMemo, useRef, useState } from 'react';
import graph from '@/lib/hub-graph.json';
import { useProof, type Muc } from '@/components/proof/ProofLayer';

type Nut = {
  id: string; kind: 'don_vi' | 'nhu_cau' | 'nhom'; label: string; x: number; y: number;
  soClaim?: number; favorsRtr?: boolean; maSp?: string; lanhTho: string; lanhThoPhu?: string[];
  nhan?: { ten: string; ben: string };
};
type Canh = { id: string; kind: string; source: string; target: string; signoff?: { by: string; date: string }; matchId?: string; lyDo?: string; by?: string; date?: string };
type LanhTho = { id: string; so: string | null; nhan: string; cx: number; cy: number; r: number; goc: number; nhanTren: boolean; soDv: number; soNc: number };
type Khoi = { lanhTho: string; tu: number; den: number };
type ChiSo = { nhanChongNhau: number; soCanhVe: number; giaoCanh: number; canhXuyenNut: number; canhNoiHaiLanhTho: number; netTietKiem: number };
type Meta = { nut: Record<string, number>; canh: Record<string, number> };
const G = graph as unknown as {
  meta: Meta; nodes: Nut[]; edges: Canh[];
  boCuc: { rong: number; cao: number; lanhTho: LanhTho[]; chiSo: ChiSo };
  maTran: { hang: string[]; cot: string[]; khoiHang: Khoi[]; khoiCot: Khoi[] };
};

const CHEO = ['match_da_ky', 'cung_san_pham', 'tu_choi'] as const;
type LoaiCanh = typeof CHEO[number];
const NHAN_CANH: Record<LoaiCanh, string> = { match_da_ky: 'Match đã ký', cung_san_pham: 'Cùng sản phẩm', tu_choi: 'Cặp bị từ chối' };

const mucCua = (n: Nut): Muc => (n.kind === 'don_vi' ? { loai: 'don_vi', ten: n.id.slice(3) }
  : n.kind === 'nhu_cau' ? { loai: 'nhu_cau', entityId: n.id.slice(3) } : { loai: 'nhom', so: n.id.slice(3) });

/** Toa do nhan theo mo hinh 8 vi tri; phai khop hop nhan trong lib/do-thi-ban-do.mjs. */
function viTriNhan(ben: string, r: number) {
  const [ngang, doc] = ben.split('-');
  if (ngang === 'tren') return { x: 0, y: -(r + 6), textAnchor: 'middle' as const };
  if (ngang === 'duoi') return { x: 0, y: r + 13, textAnchor: 'middle' as const };
  const dy = doc === 'tren' ? -(r + 4) : doc === 'duoi' ? r + 4 : 0;
  return ngang === 'trai' ? { x: -(r + 5), y: 3.5 + dy, textAnchor: 'end' as const } : { x: r + 5, y: 3.5 + dy, textAnchor: 'start' as const };
}

export function banKinh(n: Nut) {
  if (n.kind === 'nhu_cau') return 6;
  return 4.5 + Math.min(4.5, Math.sqrt(n.soClaim ?? 0) * 1.2);
}

/** Ten ngan cho nhan truc tiep: uu tien ten viet tat trong ngoac, bo tien to phap nhan. */
function tenNgan(s: string, max = 24) {
  const ngoac = s.match(/\(([^)]{2,14})\)\s*$/);
  if (ngoac) return ngoac[1];
  const t = s.replace(/^(Công ty cổ phần|Công ty TNHH|Công ty|Tổng công ty|Tập đoàn|Viện)\s+/i, '');
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}
const soHai = (s: string | null) => (s ? s.padStart(2, '0') : '··');

export function DoThiCungCau() {
  const { moMuc } = useProof();
  const [cheDo, setCheDo] = useState<'ban_do' | 'ma_tran'>('ban_do');
  const [tro, setTro] = useState<string | null>(null);
  const [o, setO] = useState<{ h: string; c: string } | null>(null);
  const [bat, setBat] = useState<Record<LoaiCanh, boolean>>({ match_da_ky: true, cung_san_pham: true, tu_choi: true });
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);
  const hopRef = useRef<HTMLDivElement>(null);

  const byId = useMemo(() => new Map(G.nodes.map((n) => [n.id, n])), []);
  const cheo = useMemo(() => G.edges.filter((e) => (CHEO as readonly string[]).includes(e.kind)), []);
  const hangXom = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const e of cheo) {
      if (!m.has(e.source)) m.set(e.source, new Set());
      if (!m.has(e.target)) m.set(e.target, new Set());
      m.get(e.source)!.add(e.target); m.get(e.target)!.add(e.source);
    }
    return m;
  }, [cheo]);
  const coMatch = useMemo(() => new Set(cheo.filter((e) => e.kind === 'match_da_ky').flatMap((e) => [e.source, e.target])), [cheo]);
  // Nhu cau CO BEN CUNG = co canh cung san pham hoac match da ky. Cap bi tu choi KHONG tinh: tu
  // choi nghia la nguoi gac cong da ket luan don vi do KHONG cung duoc. (Sua 29/09/2026: ban dau
  // dem theo moi canh, P08 chi co mot cap bi tu choi nen bi tinh la co cung, so khoang trong
  // hien 10 thay vi 11.)
  const coCung = useMemo(() => new Set(cheo.filter((e) => e.kind !== 'tu_choi').map((e) => e.target)), [cheo]);
  const khoangTrong = useMemo(() => G.nodes.filter((n) => n.kind === 'nhu_cau' && !coCung.has(n.id)), [coCung]);
  const ltCua = useMemo(() => new Map(G.boCuc.lanhTho.map((l) => [l.so ?? 'chua_co', l])), []);
  // Mot cap co the vua cung san pham vua match da ky: o ma tran hien quan he manh nhat.
  const oCua = useMemo(() => {
    const hang: Record<string, number> = { match_da_ky: 3, tu_choi: 2, cung_san_pham: 1 };
    const m = new Map<string, Canh>();
    for (const e of cheo) { const k = `${e.source}|${e.target}`; const c = m.get(k); if (!c || hang[e.kind] > hang[c.kind]) m.set(k, e); }
    return m;
  }, [cheo]);

  const ke = tro ? hangXom.get(tro) ?? new Set<string>() : null;
  const sang = (id: string) => !ke || id === tro || ke.has(id);
  const viTri = (ev: React.MouseEvent) => {
    const r = hopRef.current?.getBoundingClientRect();
    if (r) setTip({ x: ev.clientX - r.left, y: ev.clientY - r.top });
  };
  const { rong, cao, lanhTho, chiSo } = G.boCuc;
  const nutTro = tro ? byId.get(tro) : null;
  const canhO = o ? oCua.get(`${o.h}|${o.c}`) : null;

  // ── Ban do ────────────────────────────────────────────────────────────────
  const banDo = (
    <svg className="dt2-svg dt2-map" viewBox={`0 0 ${rong} ${cao}`} role="img"
      aria-label={`Bản đồ ${lanhTho.length} lãnh thổ nhóm công nghệ, ${G.meta.nut.don_vi} đơn vị, ${G.meta.nut.nhu_cau} nhu cầu, ${G.meta.canh.match_da_ky} match đã ký. Danh sách đầy đủ ở dưới.`}
      onMouseLeave={() => { setTro(null); setTip(null); }}>
      <defs>
        <radialGradient id="dt2-lt" cx="50%" cy="42%" r="65%">
          <stop offset="0%" stopColor="var(--dt-vung-sang)" />
          <stop offset="100%" stopColor="var(--dt-vung-toi)" />
        </radialGradient>
        <filter id="dt2-hao" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <g className="dt2-tang dt2-tang--vung">
        {lanhTho.map((l) => {
          const tren = l.nhanTren;
          const la = !ke || [...(ke ?? [])].some((id) => byId.get(id)?.lanhTho === (l.so ?? 'chua_co')) || byId.get(tro ?? '')?.lanhTho === (l.so ?? 'chua_co');
          return (
            <g key={l.id} className={`dt2-lt${la ? '' : ' is-mo'}${l.so ? '' : ' dt2-lt--null'}`}>
              <circle cx={l.cx} cy={l.cy} r={l.r} fill="url(#dt2-lt)" className="dt2-lt__vien" />
              <g transform={`translate(${l.cx} ${tren ? l.cy - l.r - 12 : l.cy + l.r + 20})`} className="dt2-lt__nhan">
                <text textAnchor="middle"><tspan className="dt2-lt__so">{soHai(l.so)}</tspan><tspan dx="6">{l.nhan}</tspan></text>
                <text textAnchor="middle" y={tren ? -14 : 14} className="dt2-lt__dem">{l.soDv} đơn vị · {l.soNc} nhu cầu</text>
              </g>
            </g>
          );
        })}
      </g>
      <g className="dt2-tang dt2-tang--canh">
        {cheo.filter((e) => bat[e.kind as LoaiCanh]).map((e) => {
          const a = byId.get(e.source)!; const b = byId.get(e.target)!;
          const noiBat = !ke || e.source === tro || e.target === tro;
          return (
            <line key={e.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y} pathLength={e.kind === 'tu_choi' ? undefined : 1}
              className={`dt2-canh dt2-canh--${e.kind}${noiBat ? '' : ' is-mo'}`}
              filter={e.kind === 'match_da_ky' && noiBat ? 'url(#dt2-hao)' : undefined} />
          );
        })}
      </g>
      <g className="dt2-tang dt2-tang--nut">
        {G.nodes.filter((n) => n.kind !== 'nhom').map((n) => {
          const r = banKinh(n);
          const trong = n.kind === 'nhu_cau' && !coCung.has(n.id);
          const cls = `dt2-nut dt2-nut--${n.kind}${trong ? ' is-trong' : ''}${sang(n.id) ? '' : ' is-mo'}${n.id === tro ? ' is-tro' : ''}`;
          // Ben nhan tinh luc build (tranh va nhan nhom, nut, nhan khac); khi soi nut thi hien them
          // ten cac hang xom chua co nhan.
          const l = ltCua.get(n.lanhTho);
          const ben = n.nhan?.ben ?? (l && n.x < l.cx - 4 ? 'trai' : 'phai');
          const hienTen = n.kind === 'nhu_cau' || (ke ? sang(n.id) : coMatch.has(n.id));
          const ten = n.nhan?.ten ?? (n.kind === 'nhu_cau' ? `P${n.maSp}` : tenNgan(n.label, 30));
          return (
            <g key={n.id} className={cls} transform={`translate(${n.x} ${n.y})`}
              onMouseEnter={(ev) => { setTro(n.id); viTri(ev); }} onMouseMove={viTri}
              onClick={() => moMuc(mucCua(n))}>
              <circle r={r + 7} className="dt2-nut__vung" />
              {n.kind === 'nhu_cau'
                ? <rect x={-r * 0.78} y={-r * 0.78} width={r * 1.56} height={r * 1.56} transform="rotate(45)" rx={1.2} className="dt2-nut__hinh" />
                : <circle r={r} className="dt2-nut__hinh" />}
              {n.favorsRtr && <circle r={r + 3.5} className="dt2-nut__rtr" />}
              {hienTen && (
                <text {...viTriNhan(ben, r)}
                  className={n.kind === 'nhu_cau' ? 'dt2-nut__ma' : 'dt2-nut__ten'}>{ten}</text>)}
            </g>
          );
        })}
      </g>
    </svg>
  );

  // ── Ma tran ───────────────────────────────────────────────────────────────
  const O = 15; const TRAI = 238; const TREN = 64;
  const { hang, cot, khoiHang, khoiCot } = G.maTran;
  const mtRong = TRAI + cot.length * O + 12; const mtCao = TREN + hang.length * O + 12;
  const maTran = (
    <svg className="dt2-svg dt2-mt" viewBox={`0 0 ${mtRong} ${mtCao}`} role="img"
      aria-label={`Ma trận ${hang.length} đơn vị nhân ${cot.length} nhu cầu, chia khối theo nhóm công nghệ.`}
      onMouseLeave={() => { setO(null); setTip(null); }}>
      {khoiHang.map((kh) => {
        const kc = khoiCot.find((k) => k.lanhTho === kh.lanhTho);
        return (
          <g key={`k${kh.lanhTho}`}>
            <rect x={4} y={TREN + kh.tu * O} width={18} height={(kh.den - kh.tu + 1) * O} className="dt2-mt__dai" />
            <text x={13} y={TREN + ((kh.tu + kh.den + 1) / 2) * O + 3.5} textAnchor="middle" className="dt2-mt__dai-so">{soHai(kh.lanhTho === 'chua_co' ? null : kh.lanhTho)}</text>
            {kc && <rect x={TRAI + kc.tu * O} y={TREN + kh.tu * O} width={(kc.den - kc.tu + 1) * O} height={(kh.den - kh.tu + 1) * O} className="dt2-mt__khoi" />}
          </g>
        );
      })}
      {o && <rect x={TRAI} y={TREN + hang.indexOf(o.h) * O} width={cot.length * O} height={O} className="dt2-mt__tieu" />}
      {o && <rect x={TRAI + cot.indexOf(o.c) * O} y={TREN} width={O} height={hang.length * O} className="dt2-mt__tieu" />}
      {hang.map((h, i) => {
        const n = byId.get(h)!;
        return (
          <text key={h} x={TRAI - 6} y={TREN + i * O + O / 2 + 3.5} textAnchor="end"
            className={`dt2-mt__hang${o?.h === h ? ' is-tro' : ''}`} onClick={() => moMuc(mucCua(n))}>{tenNgan(n.label, 34)}</text>
        );
      })}
      {cot.map((c, j) => {
        const n = byId.get(c)!;
        return (
          <text key={c} transform={`translate(${TRAI + j * O + O / 2 + 3} ${TREN - 6}) rotate(-90)`}
            className={`dt2-mt__cot${o?.c === c ? ' is-tro' : ''}${coCung.has(c) ? '' : ' is-trong'}`} onClick={() => moMuc(mucCua(n))}>P{n.maSp}</text>
        );
      })}
      {hang.map((h, i) => cot.map((c, j) => {
        const e = oCua.get(`${h}|${c}`);
        return (
          <g key={`${h}|${c}`} transform={`translate(${TRAI + j * O} ${TREN + i * O})`}
            onMouseEnter={(ev) => { setO({ h, c }); viTri(ev); }} onMouseMove={viTri}
            onClick={() => e && moMuc(mucCua(byId.get(h)!))} className={e ? 'dt2-mt__o is-co' : 'dt2-mt__o'}>
            <rect width={O} height={O} className="dt2-mt__nen" />
            {e?.kind === 'match_da_ky' && <rect x={2} y={2} width={O - 4} height={O - 4} rx={2} className="dt2-mt__match" />}
            {e?.kind === 'cung_san_pham' && <rect x={4.5} y={4.5} width={O - 9} height={O - 9} rx={1} className="dt2-mt__sp" />}
            {e?.kind === 'tu_choi' && <path d={`M4,4 L${O - 4},${O - 4} M${O - 4},4 L4,${O - 4}`} className="dt2-mt__tc" />}
          </g>
        );
      }))}
    </svg>
  );

  const dem = G.meta;
  return (
    <section className="dash-panel dt2" aria-label="Đồ thị cung cầu">
      <div className="dt2-head">
        <dl className="dt2-kpi">
          <div><dt>Đơn vị cung</dt><dd>{dem.nut.don_vi}</dd></div>
          <div><dt>Nhu cầu quốc gia</dt><dd>{dem.nut.nhu_cau}</dd></div>
          <div><dt>Match đã ký</dt><dd className="dt2-kpi--match"><i aria-hidden="true" />{dem.canh.match_da_ky}</dd></div>
          <div><dt>Nhu cầu chưa có bên cung</dt><dd className="dt2-kpi--trong">{khoangTrong.length}</dd></div>
        </dl>
        <div className="dt2-ctrl">
          <div className="dt2-seg" role="tablist" aria-label="Chế độ xem">
            <button type="button" role="tab" aria-selected={cheDo === 'ban_do'} onClick={() => { setCheDo('ban_do'); setTip(null); }}>Bản đồ</button>
            <button type="button" role="tab" aria-selected={cheDo === 'ma_tran'} onClick={() => { setCheDo('ma_tran'); setTip(null); }}>Ma trận</button>
          </div>
          {cheDo === 'ban_do' && (
            <div className="dt2-filters" role="group" aria-label="Lọc loại cạnh">
              {CHEO.map((k) => (
                <button key={k} type="button" className={`dt2-chip dt2-chip--${k}`} aria-pressed={bat[k]}
                  onClick={() => setBat((b) => ({ ...b, [k]: !b[k] }))}>
                  <span className="dt2-chip__mk" aria-hidden="true" />{NHAN_CANH[k]} <b>{dem.canh[k] ?? 0}</b>
                </button>))}
            </div>)}
        </div>
      </div>

      <div className={`dt2-stage dt2-stage--${cheDo}`} ref={hopRef}>
        <div key={cheDo} className="dt2-view">{cheDo === 'ban_do' ? banDo : maTran}</div>
        {tip && cheDo === 'ban_do' && nutTro && (
          <div className="dt2-tip" style={{ left: tip.x, top: tip.y }} aria-hidden="true">
            <div className="dt2-tip__loai">{nutTro.kind === 'don_vi' ? 'Đơn vị cung' : `Nhu cầu P${nutTro.maSp}`} · nhóm {soHai(nutTro.lanhTho === 'chua_co' ? null : nutTro.lanhTho)}{nutTro.lanhThoPhu?.length ? ` (+${nutTro.lanhThoPhu.join(', ')})` : ''}</div>
            <div className="dt2-tip__ten">{nutTro.label}</div>
            <div className="dt2-tip__phu">
              {nutTro.kind === 'nhu_cau' && !coCung.has(nutTro.id)
                ? (hangXom.get(nutTro.id)?.size ? 'Khoảng trống: chỉ có cặp đã bị người gác cổng từ chối, chưa có bên cung' : 'Khoảng trống: chưa có đơn vị cung nào trong registry')
                : hangXom.get(nutTro.id)?.size
                  ? `${hangXom.get(nutTro.id)!.size} liên kết cung cầu · bấm để mở lớp phủ nguồn`
                  : 'Chưa có liên kết cung cầu'}
            </div>
          </div>)}
        {tip && cheDo === 'ma_tran' && o && (
          <div className="dt2-tip" style={{ left: tip.x, top: tip.y }} aria-hidden="true">
            <div className="dt2-tip__loai">{canhO ? NHAN_CANH[canhO.kind as LoaiCanh] : 'Chưa có quan hệ'}</div>
            <div className="dt2-tip__ten">{byId.get(o.h)?.label}</div>
            <div className="dt2-tip__ten dt2-tip__ten--phu">P{byId.get(o.c)?.maSp} · {byId.get(o.c)?.label}</div>
            {canhO?.signoff && <div className="dt2-tip__phu">{canhO.matchId} · ký bởi {canhO.signoff.by}, {canhO.signoff.date}</div>}
            {canhO?.kind === 'tu_choi' && <div className="dt2-tip__phu">Từ chối bởi {canhO.by}, {canhO.date}: {canhO.lyDo}</div>}
          </div>)}
      </div>

      <div className="dt2-foot">
        <div className="dt2-legend">
          <span><i className="dt2-mk dt2-mk--dv" />Đơn vị cung (lớn hơn = nhiều câu nguồn hơn)</span>
          <span><i className="dt2-mk dt2-mk--nc" />Nhu cầu theo QĐ 21/2026</span>
          <span><i className="dt2-mk dt2-mk--trong" />Nhu cầu chưa có bên cung</span>
          <span><i className="dt2-mk dt2-mk--match" />Match đã ký</span>
          <span><i className="dt2-mk dt2-mk--rtr" />RtR, bên dựng hub</span>
        </div>
        <p className="dt2-method">
          <b>Chất lượng bố cục, đo bằng máy:</b> {chiSo.giaoCanh} giao cắt, {chiSo.canhXuyenNut} cạnh xuyên nút
          và {chiSo.nhanChongNhau} nhãn chồng nhau trên {chiSo.soCanhVe} cạnh cung cầu; quan hệ “thuộc nhóm” ({chiSo.netTietKiem} quan hệ) mã hoá bằng lãnh thổ thay vì đường kẻ.
          Cổng check-do-thi giữ các con số này không được tăng. Mỗi nhu cầu thuộc nhóm theo bảng ánh xạ đã duyệt,
          mỗi cạnh có câu nguồn hoặc chữ ký; match chưa ký không được vẽ.
        </p>
      </div>

      <details className="dt-list">
        <summary>Danh sách {G.nodes.length} nút (dùng bàn phím hoặc trình đọc màn hình)</summary>
        {(['nhom', 'don_vi', 'nhu_cau'] as const).map((k) => (
          <div key={k} className="dt-list__grp">
            <div className="dt-list__h">{k === 'nhom' ? 'Nhóm' : k === 'don_vi' ? 'Đơn vị' : 'Nhu cầu'}</div>
            <ul>{G.nodes.filter((n) => n.kind === k).map((n) => (
              <li key={n.id}><button type="button" className="pf-link" onClick={() => moMuc(mucCua(n))}>
                {n.kind === 'nhu_cau' ? `P${n.maSp} · ` : ''}{n.label}</button> <span className="dt-list__n">{k === 'nhom' ? '' : `${hangXom.get(n.id)?.size ?? 0} liên kết`}</span></li>))}
            </ul>
          </div>))}
      </details>
    </section>
  );
}
