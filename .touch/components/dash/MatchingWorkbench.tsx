'use client';

/**
 * Matching Workbench v2 (M4). Dung lai 29/09/2026 tu ban 18/08/2026.
 *
 * GIU NGUYEN RANH GIOI CUA BAN CU (18/08/2026): man nay KHONG co nut duyet/tu choi. Duong ky duy
 * nhat la lenh cua engine:
 *     python3 match_engine.py sign out/matches.jsonl "<ten>" <ngay> [--only ID]
 * No ghi vao so co khoa noi dung VA khoa bang chung. Man nay chi DOC va HIEN chu ky do. Cong
 * check-matching.mjs quet file nay de chan moi nut ky, moi duong ghi (fetch/POST).
 *
 * MOI O V2:
 *   - So do hai cot cau | cung, 11 match da ky va cap bi tu choi, sap median (it cat nhau).
 *   - VET BANG CHUNG nam chang: cau nguon ben cau, neo nhom (lop 1), giao chu (lop 3), cau nguon ben
 *     cung, chu ky. Tu giao duoc to o CA HAI cau nguon, nen nhin la thay vi sao may ghep.
 *   - PHAN RA DIEM: moi so hang cua cong thuc engine (doc tu match_engine.py) hien ra; tong phai
 *     ra dung diem engine, cong kiem ca 11 cap.
 * Ly do tu choi la CHU CUA NGUOI GAC CONG: hien nguyen van, khong sua ca dau.
 */
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { signedMatches, rejectedPairs, matchMeta, type SignedMatch, type MatchEvidence } from '@/lib/cncl-match';
import hub from '@/lib/hub-matching.json';
import graph from '@/lib/hub-graph.json';
import { slugDonVi } from '@/lib/ho-so.mjs';
import { useProof } from '@/components/proof/ProofLayer';
import { tenNguoi } from '@/lib/dinh-dang';
import { tenNgan } from '@/lib/ten-ngan.mjs';

type PhanRa = {
  tiLeGiao: number; soGiao: number; soTokenCau: number; quaNguong: boolean;
  tierCau: string; tierCung: string; diemTier: number; diaDiem: number;
  phan: { giao: number; tier: number; diaDiem: number }; tong: number; lamTron: number;
};
type Canh = { cau: string; cung: string; loai: 'da_ky' | 'tu_choi'; id: string };
type CongThuc = { wGiao: number; wTier: number; wDiaDiem: number; tierW: Record<string, number>; nguongGiao: number };
const H = hub as unknown as { congThuc: CongThuc; phanRa: Record<string, PhanRa>; haiCot: { cau: string[]; cung: string[]; canh: Canh[]; giao: number; giaoBanDau: number } };
const G = graph as unknown as { nodes: { id: string; label: string; maSp?: string; nhom?: string }[] };
const maSpCua = new Map(G.nodes.filter((n) => n.id.startsWith('nc:')).map((n) => [n.id.slice(3), n.maSp ?? '']));
const tenNc = new Map(G.nodes.filter((n) => n.id.startsWith('nc:')).map((n) => [n.id.slice(3), n.label]));
const nhomNc = new Map(G.nodes.filter((n) => n.id.startsWith('nc:')).map((n) => [n.id.slice(3), n.nhom ?? '0']));
// Mau du lieu: chi ma hoa nhom cong nghe cua nhu cau, qua token var(--nhom-N). Trang thai giu net.
const mau = (so: string | number | null | undefined) => ({ '--mau': `var(--nhom-${so ?? 0})` }) as React.CSSProperties;

const nhanVai = (r: string) => (r === 'chuyen gia gac cong' ? 'chuyên gia gác cổng' : r);
const ngayVN = (d: string) => `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}`;
const so = (v: number, k = 3) => v.toFixed(k).replace('.', ',');
const soHai = (n: number) => String(n).padStart(2, '0');
const ngan = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

/** To tu giao trong cau nguon. Tach theo tu Unicode, so khop chu thuong NFC voi tap tu. */
function CauTo({ text, giao, cau }: { text: string; giao: Set<string>; cau?: Set<string> }) {
  const phan: React.ReactNode[] = [];
  let cuoi = 0;
  for (const m of text.matchAll(/[\p{L}\p{N}]+/gu)) {
    const w = m[0].normalize('NFC').toLowerCase();
    const i = m.index ?? 0;
    if (giao.has(w) || cau?.has(w)) {
      phan.push(text.slice(cuoi, i));
      phan.push(<mark key={i} className={giao.has(w) ? 'mw2-giao' : 'mw2-le'}>{m[0]}</mark>);
      cuoi = i + m[0].length;
    }
  }
  phan.push(text.slice(cuoi));
  return <>{phan}</>;
}

function Nguon({ e }: { e: MatchEvidence }) {
  return (
    <div className="mw2-nguon">
      <span className={`pf-tier pf-tier--${e.tier}`}>hạng {e.tier}</span>
      <a className="pf-link" href={e.href} target="_blank" rel="noopener noreferrer">{e.source}</a>
      <span>{e.extraction === 'verbatim' ? 'trích nguyên văn' : 'giá trị chuẩn hoá từ câu nguồn'}</span>
    </div>
  );
}

function SoDoHaiCot({ chon, datChon }: { chon: string; datChon: (id: string) => void }) {
  const { cau, cung, canh } = H.haiCot;
  const W = 460; const BUOC = 30; const TREN = 26;
  const Hh = TREN * 2 + (Math.max(cau.length, cung.length) - 1) * BUOC;
  const yC = (i: number) => TREN + (i + (Math.max(cau.length, cung.length) - cau.length) / 2) * BUOC;
  const yU = (i: number) => TREN + (i + (Math.max(cau.length, cung.length) - cung.length) / 2) * BUOC;
  const XT = 118; const XP = 300;
  return (
    <svg className="mw2-hc" viewBox={`0 0 ${W} ${Hh}`} role="group" aria-label={`Sơ đồ hai cột: ${cau.length} nhu cầu, ${cung.length} đơn vị, ${canh.length} cặp đã quyết.`}>
      <text x={XT} y={11} textAnchor="end" className="mw2-hc__cot">NHU CẦU</text>
      <text x={XP} y={11} className="mw2-hc__cot">ĐƠN VỊ CUNG</text>
      {canh.map((c) => {
        const y0 = yC(cau.indexOf(c.cau)); const y1 = yU(cung.indexOf(c.cung)); const xm = (XT + XP) / 2;
        const on = c.id === chon;
        return (
          <path key={c.id} d={`M${XT + 6},${y0} C${xm},${y0} ${xm},${y1} ${XP - 6},${y1}`} style={mau(nhomNc.get(c.cau))}
            className={`mw2-hc__c mw2-hc__c--${c.loai}${on ? ' is-chon' : ''}`}
            onClick={() => datChon(c.id)} role="button" tabIndex={0} aria-label={`${c.id}: ${c.cung} với P${maSpCua.get(c.cau)}`}
            onKeyDown={(e) => { if (e.key === 'Enter') datChon(c.id); }} />);
      })}
      {cau.map((id, i) => {
        const on = canh.find((c) => c.id === chon)?.cau === id;
        return (
          <g key={id} className={`mw2-hc__n${on ? ' is-chon' : ''}`} style={mau(nhomNc.get(id))}>
            <rect x={XT - 1} y={yC(i) - 5} width={10} height={10} rx={1.5} transform={`rotate(45 ${XT + 4} ${yC(i)})`} className="mw2-hc__cau" />
            <text x={XT - 10} y={yC(i) + 3.5} textAnchor="end"><tspan className="mw2-hc__ma">P{maSpCua.get(id)}</tspan> {ngan(tenNc.get(id) ?? '', 14)}</text>
          </g>);
      })}
      {cung.map((id, i) => {
        const on = canh.find((c) => c.id === chon)?.cung === id;
        return (
          <g key={id} className={`mw2-hc__n${on ? ' is-chon' : ''}`}>
            <circle cx={XP} cy={yU(i)} r={5} className="mw2-hc__cung" />
            <text x={XP + 10} y={yU(i) + 3.5}>{ngan(tenNgan(id), 26)}<title>{id}</title></text>
          </g>);
      })}
    </svg>
  );
}

function VetBangChung({ m }: { m: SignedMatch }) {
  const pr = H.phanRa[m.id];
  const ct = H.congThuc;
  const giao = new Set(m.tokenGiao.map((t) => t.normalize('NFC').toLowerCase()));
  const conLai = new Set(m.tokenCau.map((t) => t.normalize('NFC').toLowerCase()).filter((t) => !giao.has(t)));
  const nc = m.demandEvidence[0]; const cu = m.supplyEvidence[0];
  const maSp = maSpCua.get(m.demandId) ?? '';
  const pct = (v: number) => `${Math.max(0, (v / 1) * 100)}%`;
  return (
    <div className="mw2-vet">
      <header className="mw2-vet__head">
        <div>
          <div className="mw2-eyebrow">{m.id} · vệt bằng chứng</div>
          <h2 className="mw2-vet__ten">
            <Link href={`/dashboard/don-vi/${slugDonVi(m.supplyId)}`}>{m.supplyId}</Link>
            <span className="mw2-vet__x">⇄</span>
            <span className="mw2-vet__ma">P{maSp}</span> {ngan(tenNc.get(m.demandId) ?? '', 60)}
          </h2>
        </div>
        <div className="mw2-diem" title="Điểm của máy ghép; phân rã ngay bên dưới">
          <span className="mw2-diem__v">{so(m.score, 2)}</span>
          <span className="mw2-diem__k">điểm máy ghép</span>
        </div>
      </header>

      <ol className="mw2-chang">
        <li>
          <div className="mw2-chang__k"><b>1</b> Câu nguồn bên cầu · QĐ 21/2026</div>
          <blockquote className="mw2-cau">{nc ? <CauTo text={nc.span} giao={giao} cau={conLai} /> : 'Không có câu nguồn: bất thường, cần soi lại.'}</blockquote>
          {nc && <Nguon e={nc} />}
        </li>
        <li>
          <div className="mw2-chang__k"><b>2</b> Lớp 1 · neo nhóm công nghệ</div>
          {m.canhChuoi ? (
            <p className="mw2-p">
              Nhu cầu thuộc nhóm <b>{soHai(m.nhomCau ?? 0)}</b>; đơn vị cung có câu nguồn về nhóm <b>{m.nhomCung.map(soHai).join(', ')}</b>, không trùng.
              Nối qua <b>cạnh chuỗi giá trị {soHai(m.canhChuoi.tu)} → {soHai(m.canhChuoi.den)}</b>
              {m.canhChuoi.trangThai === 'da_duyet' ? ' (người đã duyệt)' : ' (CHƯA duyệt, tự khai trong unverified)'}:
              <span className="mw2-lydo"> {m.canhChuoi.lyDo}</span>
            </p>
          ) : (
            <p className="mw2-p">Nhu cầu thuộc nhóm <b>{soHai(m.nhomCau ?? 0)}</b>; đơn vị cung có câu nguồn cùng nhóm <b>{soHai(m.nhomCau ?? 0)}</b>. Qua lớp neo trực tiếp.</p>
          )}
          <p className="mw2-mo">Không qua lớp này thì loại thẳng, không tính điểm: chặn kiểu “khác lĩnh vực nhưng trùng chữ”.</p>
        </li>
        <li>
          <div className="mw2-chang__k"><b>3</b> Lớp 3 · giao chữ sau khi bỏ từ dùng chung</div>
          <div className="mw2-tok">
            {m.tokenCau.map((t) => <span key={t} className={`mw2-tok__t${giao.has(t.normalize('NFC').toLowerCase()) ? ' is-giao' : ''}`}>{t}</span>)}
          </div>
          <p className="mw2-p">
            {pr.soGiao}/{pr.soTokenCau} từ của nhu cầu có trong câu năng lực = <b>{so(pr.tiLeGiao)}</b>
            {pr.quaNguong ? ` ≥ ngưỡng ${so(ct.nguongGiao, 1)}` : ` DƯỚI ngưỡng ${so(ct.nguongGiao, 1)}`}.
          </p>
        </li>
        <li>
          <div className="mw2-chang__k"><b>4</b> Câu nguồn bên cung · {m.supplyId}</div>
          <blockquote className="mw2-cau">{cu ? <CauTo text={cu.span} giao={giao} /> : 'Không có câu nguồn.'}</blockquote>
          {cu && <Nguon e={cu} />}
          {m.supplyEvidence.length > 1 && <p className="mw-hint">+{m.supplyEvidence.length - 1} câu nguồn nữa cho cùng cặp.</p>}
        </li>
        <li>
          <div className="mw2-chang__k"><b>5</b> Chữ ký người gác cổng</div>
          <dl className="mw2-ky">
            <dt>Người ký</dt><dd>{tenNguoi(m.signoff.by)} · {nhanVai(m.signoff.role)}</dd>
            <dt>Ngày</dt><dd>{ngayVN(m.signoff.date)}</dd>
            <dt>Khoá bằng chứng</dt><dd className="t-mono-01" title="Băm tập câu làm bằng lúc ký. Đổi một chữ là chữ ký rụng.">{m.khoaBangChung ?? 'chưa đóng khoá'}</dd>
            <dt>Máy ghép</dt><dd className="t-mono-01">{m.engine}</dd>
          </dl>
        </li>
      </ol>

      <section className="mw2-pr" aria-label="Phân rã điểm">
        <div className="mw2-eyebrow">Phân rã điểm · tự dựng lại được bằng tay</div>
        <div className="mw2-pr__bar" role="img" aria-label={`Giao chữ ${so(pr.phan.giao)}, hạng ${so(pr.phan.tier)}, địa điểm ${so(pr.phan.diaDiem)}`}>
          <span className="mw2-pr__p mw2-pr__p--giao" style={{ width: pct(pr.phan.giao) }} />
          <span className="mw2-pr__p mw2-pr__p--tier" style={{ width: pct(pr.phan.tier) }} />
          <span className="mw2-pr__moc" style={{ left: pct(pr.tong) }} />
        </div>
        <table className="mw2-pr__t">
          <tbody>
            <tr><td><i className="mw2-mk mw2-pr__p--giao" />Giao chữ</td><td>{so(ct.wGiao, 1)} × {so(pr.tiLeGiao)}</td><td>{so(pr.phan.giao)}</td></tr>
            <tr><td><i className="mw2-mk mw2-pr__p--tier" />Độ tin nguồn</td><td>{so(ct.wTier, 1)} × ({pr.tierCau} {so(ct.tierW[pr.tierCau], 2)} + {pr.tierCung} {so(ct.tierW[pr.tierCung], 2)}) / 2</td><td>{so(pr.phan.tier)}</td></tr>
            <tr><td><i className="mw2-mk mw2-mk--rong" />Cùng địa điểm</td><td>{so(ct.wDiaDiem, 1)} × 0 · registry chưa có địa điểm phía cầu</td><td>{so(pr.phan.diaDiem)}</td></tr>
            <tr className="mw2-pr__tong"><td>Tổng</td><td>làm tròn 2 chữ số</td><td>{so(pr.tong)} → <b>{so(pr.lamTron, 2)}</b></td></tr>
          </tbody>
        </table>
        <p className="mw2-mo">Hệ số đọc thẳng từ <span className="t-mono-01">match_engine.py</span>, không gõ lại. Cổng check-matching tính lại cả {signedMatches.length} cặp và so với điểm máy ghép.</p>
      </section>

      {m.chuaDuyet.length > 0 && <p className="mw-hint">{m.chuaDuyet.length} bằng chứng thêm vào SAU khi ký; chữ ký hiện tại không phủ phần đó.</p>}
      {m.soChuoi > 1 && <p className="mw-hint">Cặp này có {m.soChuoi} chuỗi bằng chứng độc lập; vệt trên là chuỗi cho điểm cao nhất.</p>}
      {m.unverified.length > 0 && <p className="mw-hint">Tự khai chưa kiểm: {m.unverified.join(', ')}.</p>}
    </div>
  );
}

export function MatchingWorkbench() {
  const dau = H.haiCot.canh.find((c) => c.loai === 'da_ky')?.id ?? '';
  const [chon, setChon] = useState(dau);
  const [daChep, setDaChep] = useState(false);
  const { moMuc } = useProof();
  // Lien ket chia se (01/10/2026, nghiem thu muc 16): ?m=MATCH-0012 mo thang cap do; chon cap khac
  // thi duong dan doi theo (replaceState, khong them lich su).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('m');
    if (q && H.haiCot.canh.some((c) => c.id === q)) setChon(q);
  }, []);
  useEffect(() => {
    if (!chon) return;
    const u = new URL(window.location.href); u.searchParams.set('m', chon);
    window.history.replaceState(null, '', u.toString()); setDaChep(false);
  }, [chon]);
  const chepLienKet = () => {
    navigator.clipboard?.writeText(window.location.href).then(() => setDaChep(true), () => setDaChep(false));
  };
  const m = useMemo(() => signedMatches.find((x) => x.id === chon), [chon]);
  const tc = chon.startsWith('tu_choi:') ? rejectedPairs.find((r) => `tu_choi:${r.supplyId}>${r.demandId}` === chon) : null;
  const khopHet = signedMatches.every((x) => H.phanRa[x.id]?.lamTron === x.score);
  return (
    <div className="mw2">
      <section className="hs-kpi mw2-kpi" aria-label="Tổng quan matching">
        <button type="button" className="hs-kpi__o" onClick={() => moMuc({ loai: 'so', khoa: 'matches' })}>
          <span className="hs-kpi__v hs-kpi__v--match"><i aria-hidden="true" />{matchMeta.daKy}</span><span className="hs-kpi__k">match đã ký</span><span className="hs-kpi__phu">bởi {matchMeta.nguoiKy}</span>
        </button>
        <div className="hs-kpi__o tt-kpi__o"><span className="hs-kpi__v">{matchMeta.tuChoi}</span><span className="hs-kpi__k">cặp bị từ chối</span><span className="hs-kpi__phu">chặn ở tầng máy ghép</span></div>
        <div className="hs-kpi__o tt-kpi__o"><span className="hs-kpi__v">{signedMatches.filter((x) => H.phanRa[x.id]?.lamTron === x.score).length}<small>/{signedMatches.length}</small></span><span className="hs-kpi__k">điểm tự dựng lại khớp</span><span className="hs-kpi__phu">{khopHet ? 'từ công thức máy ghép' : 'CÓ CẶP LỆCH'}</span></div>
        <div className="hs-kpi__o tt-kpi__o"><span className="hs-kpi__v mw2-kpi__rule">v2</span><span className="hs-kpi__k">quy tắc ghép</span><span className="hs-kpi__phu t-mono-01">{matchMeta.rule}</span></div>
      </section>

      <div className="mw2-grid">
        <aside className="dash-panel hs-sec mw2-trai" aria-label="Sơ đồ các cặp">
          <h2 className="hs-h">Các cặp đã quyết <span>bấm một đường để xem vệt</span></h2>
          <div className="tt-cg tt-cg--tren"><span><i className="tt-mk2 tt-dong--da_ky" />đã ký</span><span><i className="mw2-mk mw2-mk--tc" />bị từ chối</span></div>
          <SoDoHaiCot chon={chon} datChon={setChon} />
          <ul className="mw2-ds" aria-label="Danh sách cặp">
            {H.haiCot.canh.map((c) => (
              <li key={c.id}>
                <button type="button" className={`mw2-ds__r${c.id === chon ? ' is-chon' : ''}${c.loai === 'tu_choi' ? ' is-tc' : ''}`} aria-pressed={c.id === chon} onClick={() => setChon(c.id)}>
                  <span className="mw2-ds__ma">P{maSpCua.get(c.cau)}</span>
                  <span className="mw2-ds__ten" title={c.cung}>{ngan(tenNgan(c.cung), 30)}</span>
                  <span className="mw2-ds__d">{c.loai === 'da_ky' ? so(signedMatches.find((x) => x.id === c.id)?.score ?? 0, 2) : 'từ chối'}</span>
                </button>
              </li>))}
          </ul>
          <p className="hs-note">Sắp median cho ít cắt nhau: {H.haiCot.giaoBanDau} giao cắt theo thứ tự chữ cái, còn {H.haiCot.giao}.</p>
        </aside>

        <section className="dash-panel hs-sec mw2-phai" aria-live="polite">
          {chon && <button type="button" className="pf-link mw2-chep" onClick={chepLienKet}>{daChep ? 'Đã chép liên kết' : 'Chép liên kết tới cặp này'}</button>}
          {m ? <VetBangChung m={m} /> : tc ? (
            <div className="mw2-vet">
              <div className="mw2-eyebrow">Cặp bị từ chối</div>
              <h2 className="mw2-vet__ten">{tc.supplyId}<span className="mw2-vet__x">⇄</span><span className="mw2-vet__ma">P{maSpCua.get(tc.demandId)}</span> {tenNc.get(tc.demandId)}</h2>
              <figure className="mw2-tc">
                <blockquote>{tc.lyDo}</blockquote>
                <figcaption>{tenNguoi(tc.by)} · {ngayVN(tc.date)} · nguyên lời người gác cổng, không sửa</figcaption>
              </figure>
              <p className="mw2-p">Cặp đã từ chối bị chặn ở tầng máy ghép, dưới mọi quy tắc so khớp. Quy tắc mới làm nó quay lại thì cổng nổ, không im lặng cho qua. Trên màn Toàn cảnh thị trường, cặp này không mang dòng.</p>
            </div>
          ) : <p className="hs-empty">Chọn một cặp ở bên trái.</p>}
        </section>
      </div>

      <footer className="mw-footer" aria-label="Ranh gioi">
        <span className="chip chip--pass">CHỈ ĐỌC</span>
        <span className="mw-footer__txt">
          Màn này không tạo được chữ ký. Chữ ký chỉ sinh từ lệnh <span className="t-mono-01">sign</span> của máy ghép,
          ghi vào sổ có khoá bằng chứng. Match chưa ký không xuất hiện trên web.
        </span>
        <span className="t-mono-01">{matchMeta.daKy}/{matchMeta.tongChay} đã ký · sinh {ngayVN(matchMeta.generatedAt)}</span>
      </footer>
    </div>
  );
}
