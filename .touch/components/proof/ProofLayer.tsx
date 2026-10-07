'use client';

/**
 * ProofLayer · Lop phu nguon (M6) + bang lenh Cmd+K. Pha P1, 29/09/2026.
 *
 * Mot luat duy nhat: BAM VAO CON SO NAO CUNG RA DUOC CAU NGUON. Lop nay:
 *   - mo tam kinh truot ra ben phai, hien cau nguon nguyen van to sang GIUA doan van quanh
 *     no, doc thang tu ban chup trong public/evidence, khong phai tu mot ban tom tat;
 *   - voi so tong (44 don vi, 221 claim...) thi noi so do dem tu dau va liet ke cai duoc dem;
 *   - voi match thi hien nguoi ky va ngay ky; voi de xuat cua vong tu chay thi gan nhan
 *     "chua duyet", khong bao gio tron vao su that da ky.
 *
 * Du lieu nap LUOI (dynamic import) o lan mo dau tien, de trang khong phai tai ca registry
 * khi nguoi xem chua bam gi. Tim kiem va cat ngu canh dung lib/tim-kiem.mjs, la DUNG doan ma
 * ma cong check-tim-kiem.mjs kiem.
 */
import {
  Fragment, createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import type { CnclEvidence, CnclNeed, CnclUnit, CnclMeta } from '@/lib/cncl-registry';
import type { RejectedPair, SignedMatch } from '@/lib/cncl-match';
import { timKiem } from '@/lib/tim-kiem.mjs';
import { catNguCanhPhanLoai } from '@/lib/ban-chup.mjs';
import { slugDonVi } from '@/lib/ho-so.mjs';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ngayVN, tenNguoi } from '@/lib/dinh-dang';
import { hienGiaTri } from '@/lib/hien-gia-tri.mjs';
import { hienCau } from '@/lib/hien-cau.mjs';
import tenJson from '@/lib/hub-ten.json';
import { MoBanChup } from '@/components/proof/BanChup';
export const TEN_SP = (tenJson as { sanPham: Record<string, string> }).sanPham;

// ── Kieu du lieu ────────────────────────────────────────────────────────────
type SoKhoa = 'units' | 'claims' | 'needs' | 'tierA' | 'snapshots' | 'gate' | 'matches';
export type Muc =
  | { loai: 'don_vi'; ten: string }
  | { loai: 'nhu_cau'; entityId: string }
  | { loai: 'nhom'; so: string }
  | { loai: 'so'; khoa: SoKhoa };

type SearchDoc = { id: string; kind: string; ten: string; moTa: string; nhan: string; khoa: string };
type GraphEdge = { id: string; kind: string; source: string; target: string };
type HubEvent = { ngay: string; kind: string; trangThai: string; donVi: string; nhan: string; nguon?: string | null; maHangCho?: string };
type Du = {
  meta: CnclMeta; units: CnclUnit[]; needs: CnclNeed[];
  matches: SignedMatch[]; tuChoi: RejectedPair[];
  docs: SearchDoc[]; edges: GraphEdge[]; nodes: { id: string; kind: string; label: string; nhom?: string | null }[];
  events: HubEvent[];
  /** khoa `${href}|${span}` cua cau lam bang CHI nam trong ghi chu nguoi chup */
  chiGhiChu: Set<string>;
};

let napCache: Promise<Du> | null = null;
function napDuLieu(): Promise<Du> {
  if (!napCache) {
    napCache = Promise.all([
      import('@/lib/cncl-registry.json'), import('@/lib/cncl-match.json'),
      import('@/lib/hub-search.json'), import('@/lib/hub-graph.json'), import('@/lib/hub-events.json'),
      import('@/lib/hub-ghi-chu.json'),
    ]).then(([r, m, s, g, e, gc]) => {
      const reg = r.default as unknown as { meta: CnclMeta; units: CnclUnit[]; needs: CnclNeed[] };
      const mat = m.default as unknown as { signedMatches: SignedMatch[]; rejectedPairs: RejectedPair[] };
      const gr = g.default as unknown as { nodes: Du['nodes']; edges: GraphEdge[] };
      return {
        meta: reg.meta, units: reg.units, needs: reg.needs,
        matches: mat.signedMatches, tuChoi: mat.rejectedPairs,
        docs: (s.default as unknown as { docs: SearchDoc[] }).docs,
        nodes: gr.nodes, edges: gr.edges,
        events: (e.default as unknown as { events: HubEvent[] }).events,
        chiGhiChu: new Set((gc.default as unknown as { ds: { href: string; span: string }[] }).ds.map((x) => `${x.href}|${x.span}`)),
      };
    });
  }
  return napCache;
}

// ── Context ─────────────────────────────────────────────────────────────────
type Ctx = { moMuc: (m: Muc) => void; moTimKiem: () => void };
const ProofCtx = createContext<Ctx | null>(null);
export function useProof(): Ctx {
  const c = useContext(ProofCtx);
  if (!c) throw new Error('useProof phai nam trong ProofLayer');
  return c;
}

const TEN_TRUONG: Record<string, string> = {
  ten_don_vi: 'Tên đơn vị', nang_luc_mo_ta: 'Năng lực', nang_luc_mo_ta_2: 'Năng lực bổ sung',
  bang_chung_nang_luc: 'Bằng chứng năng lực', nhom_cncl: 'Nhóm công nghệ', san_pham_lien_quan: 'Sản phẩm liên quan',
  loai_hinh: 'Loại hình', location: 'Địa điểm',
  ten_phap_nhan: 'Tên pháp nhân (tự khai)', ma_so_tu_khai: 'Mã số tự khai',
};
export const tenTruong = (f: string) => TEN_TRUONG[f] ?? (f.startsWith('nhom_cncl_phu') ? 'Nhóm phụ' : f);
const TEN_LOAI: Record<string, string> = { don_vi: 'Đơn vị', nhu_cau: 'Nhu cầu', nhom: 'Nhóm' };

// ── Focus trap dung chung cho hai hop thoai ─────────────────────────────────
function useHopThoai(mo: boolean, dong: () => void, ref: React.RefObject<HTMLElement | null>) {
  const truoc = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!mo) return;
    truoc.current = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); dong(); return; }
      if (e.key !== 'Tab' || !ref.current) return;
      const els = Array.from(ref.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]),input,[tabindex="0"]'));
      if (!els.length) return;
      const dau = els[0]; const cuoi = els[els.length - 1];
      if (e.shiftKey && document.activeElement === dau) { e.preventDefault(); cuoi.focus(); }
      else if (!e.shiftKey && document.activeElement === cuoi) { e.preventDefault(); dau.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      truoc.current?.focus?.();
    };
  }, [mo, dong, ref]);
}

// ── Cau nguon trong ban chup ────────────────────────────────────────────────
function CauTrongBanChup({ span, href }: { span: string; href: string }) {
  const [tt, setTt] = useState<'cho' | 'xong' | 'loi'>('cho');
  const [nc, setNc] = useState<ReturnType<typeof catNguCanhPhanLoai> | null>(null);
  useEffect(() => {
    let huy = false;
    fetch(href)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((t) => { if (!huy) { setNc(catNguCanhPhanLoai(t, span)); setTt('xong'); } })
      .catch(() => { if (!huy) setTt('loi'); });
    return () => { huy = true; };
  }, [href, span]);
  if (tt === 'cho') return <p className="pf-ctx pf-ctx--cho">Đang đọc bản chụp…</p>;
  if (tt === 'loi') return <p className="pf-ctx pf-ctx--loi">Không mở được bản chụp {href}. Đây là lỗi, không phải thiếu nguồn.</p>;
  if (!nc || nc.cach === null) {
    return <p className="pf-ctx pf-ctx--loi">Câu làm bằng KHÔNG có nguyên văn trong bản chụp. Cổng lop_phu_nguon lẽ ra đã chặn; hãy chạy lại kiểm định tự động.</p>;
  }
  // Ba loai chu hien KHAC NHAU: van ban nguon (binh thuong), ghi chu cua nguoi chup (nghieng,
  // co nhan), tieu de chua phan dinh (co nhan). Cau lam bang to sang. Xem lib/ban-chup.mjs.
  return (
    <>
      {nc.spanChamGhiChu && (
        <p className="pf-ctx pf-ctx--loi">
          Câu làm bằng này chỉ nằm trong nhãn do người chụp đặt, không nằm trong văn bản của nguồn.
          Câu nguồn đang được ghi nợ và chờ chụp lại nguồn.
        </p>)}
      <p className="pf-ctx">
        {nc.doan.map((d, k) => d.loai === 'span'
          ? <mark key={k} className={`pf-ctx__span${nc.spanChamGhiChu ? ' pf-ctx__span--xau' : ''}`}>{d.text}</mark>
          : d.loai === 'nguon'
            ? <span key={k} className="pf-ctx__mo">{d.text}</span>
            : (
              <span key={k} className={`pf-ctx__note pf-ctx__note--${d.loai}`}>
                <span className="pf-ctx__tag">{d.loai === 'ghi_chu' ? 'ghi chú người chụp' : 'tiêu đề chưa phân định'}</span>
                {d.text}
              </span>))}
      </p>
      <p className="pf-ctx__legend">
        Chữ thường là văn bản của nguồn. Phần có nhãn là chữ của người chụp hoặc chưa phân định được, không phải của nguồn.
      </p>
    </>
  );
}

/**
 * Mot the bang chung. `them`: cac truong khac rut tu CUNG mot cau nguon (cung span, cung ban chup),
 * gop vao mot the thay vi lap lai cau nguyen van (01/10/2026, nghiem thu muc 10).
 */
export function BangChung({ e, chiGhiChu = false, phu, them }: { e: Pick<CnclEvidence, 'field' | 'value' | 'span' | 'tier' | 'source' | 'href' | 'extraction'>; chiGhiChu?: boolean; phu?: React.ReactNode; them?: { field: string; value: string }[] }) {
  const [mo, setMo] = useState(false);
  return (
    <li className="pf-ev">
      <div className="pf-ev__head">
        <span className="pf-ev__field">{[e.field, ...(them ?? []).map((t) => t.field)].map(tenTruong).join(' · ')}</span>
        <span className={`pf-tier pf-tier--${e.tier}`}>hạng {e.tier}</span>
        <span className="pf-ev__src">{e.source}</span>
        {phu}
      </div>
      {chiGhiChu && (
        <div className="pf-ev__warn" role="note">
          Nợ nguồn: câu làm bằng chỉ nằm trong nhãn của người chụp, chưa có câu của nguồn gọi đúng tên này.
        </div>)}
      {them?.length
        ? <dl className="pf-ev__nhieu">{[{ field: e.field, value: e.value }, ...them].map((t) => (
          <div key={t.field}><dt>{tenTruong(t.field)}</dt><dd>{hienGiaTri(t.field, t.value, TEN_SP)}</dd></div>))}</dl>
        : <div className="pf-ev__value">{hienGiaTri(e.field, e.value, TEN_SP)}</div>}
      <blockquote className="pf-ev__span">{hienCau(e.span)}</blockquote>
      <div className="pf-ev__act">
        <button type="button" className="pf-link" aria-expanded={mo} onClick={() => setMo((v) => !v)}>
          {mo ? 'Ẩn đoạn quanh câu' : 'Xem câu này nằm ở đâu trong bản chụp'}
        </button>
        <MoBanChup href={e.href} span={e.span} />
        <span className="pf-ev__ex">{e.extraction === 'verbatim' ? 'trích nguyên văn' : 'giá trị chuẩn hoá từ câu trên'}</span>
      </div>
      {mo && <CauTrongBanChup span={e.span} href={e.href} />}
    </li>
  );
}

// ── Noi dung tam kinh theo tung loai muc ────────────────────────────────────
function NoiDung({ muc, du, moMuc, dong }: { muc: Muc; du: Du; moMuc: (m: Muc) => void; dong?: () => void }) {
  if (muc.loai === 'don_vi') {
    const u = du.units.find((x) => x.name === muc.ten);
    if (!u) return <p className="pf-empty">Không tìm thấy đơn vị “{muc.ten}” trong registry.</p>;
    const ky = du.matches.filter((m) => m.supplyId === u.name);
    const tc = du.tuChoi.filter((r) => r.supplyId === u.name);
    const dx = du.events.filter((e) => e.kind === 'de_xuat_vong_tu_chay' && e.donVi === u.name);
    const nhu = (id: string) => du.needs.find((n) => n.entityId === id);
    return (
      <>
        {/* Dong ngay khi bam: neu dang o chinh trang ho so do thi duong dan khong doi, effect doi trang khong chay. */}
        <Link className="pf-hoso" href={`/dashboard/don-vi/${slugDonVi(u.name)}`} onClick={dong}>Mở hồ sơ đầy đủ của đơn vị →</Link>
        <div className="pf-chips">
          {u.loaiHinhLabel && <span className="pf-chip">{u.loaiHinhLabel}</span>}
          {u.nhoms.map((n, i) => (
            <button key={n} type="button" className="pf-chip pf-chip--btn" onClick={() => moMuc({ loai: 'nhom', so: n })}>{u.nhomLabels[i]}</button>
          ))}
          <span className={`pf-tier pf-tier--${u.bestTier}`}>nguồn tốt nhất: hạng {u.bestTier}</span>
          {u.favorsRtr && <span className="pf-chip pf-chip--coi" title="Đơn vị liên quan RtR, bên dựng hub. Đọc bằng chứng với con mắt nghi ngờ hơn.">liên quan RtR</span>}
        </div>
        <h3 className="pf-h">Bằng chứng · {u.evidence.length} câu nguồn</h3>
        <ul className="pf-evs">{u.evidence.map((e, i) => <BangChung key={i} e={e} chiGhiChu={du.chiGhiChu.has(`${e.href}|${e.span}`)} />)}</ul>
        <h3 className="pf-h">Match đã ký · {ky.length}</h3>
        {ky.length === 0 ? <p className="pf-empty">Chưa có match nào được người ký.</p> : (
          <ul className="pf-list">{ky.map((m) => (
            <li key={m.id}>
              <button type="button" className="pf-row" onClick={() => moMuc({ loai: 'nhu_cau', entityId: m.demandId })}>
                <span className="pf-row__k">{m.id}</span>
                <span className="pf-row__v">{nhu(m.demandId)?.value ?? m.demandId}</span>
                <span className="pf-row__s">ký bởi {tenNguoi(m.signoff.by)} · {ngayVN(m.signoff.date)}</span>
              </button>
            </li>))}
          </ul>)}
        {tc.length > 0 && (<>
          <h3 className="pf-h">Cặp bị từ chối · {tc.length}</h3>
          <ul className="pf-list">{tc.map((r, i) => (
            <li key={i} className="pf-reject"><b>{nhu(r.demandId)?.value ?? r.demandId}</b><span>{tenNguoi(r.by)} · {ngayVN(r.date)}</span><q>{r.lyDo}</q></li>))}
          </ul></>)}
        {dx.length > 0 && (<>
          <h3 className="pf-h">Tin mới từ vòng tự chạy · chưa duyệt</h3>
          <ul className="pf-list">{dx.map((e) => (
            <li key={e.maHangCho} className="pf-pending">
              <span className="pf-chip pf-chip--pending">chờ người duyệt</span>
              <span>{e.nhan}</span>
              {e.nguon && <a className="pf-link" href={e.nguon} target="_blank" rel="noopener noreferrer">nguồn · {e.ngay}</a>}
            </li>))}
          </ul></>)}
      </>
    );
  }
  if (muc.loai === 'nhu_cau') {
    const n = du.needs.find((x) => x.entityId === muc.entityId);
    if (!n) return <p className="pf-empty">Không tìm thấy nhu cầu này.</p>;
    const cung = du.edges.filter((e) => e.kind === 'cung_san_pham' && e.target === `nc:${n.entityId}`).map((e) => e.source.slice(3));
    const ky = du.matches.filter((m) => m.demandId === n.entityId);
    return (
      <>
        <div className="pf-chips"><span className="pf-chip">{n.id}</span>{n.chinhThuc && <span className="pf-chip">nhu cầu chính thức</span>}</div>
        <h3 className="pf-h">Câu nguồn</h3>
        <ul className="pf-evs"><BangChung e={{ field: 'nhu_cau', value: n.value, span: n.span, tier: n.tier, source: n.source, href: n.href, extraction: n.span === n.value ? 'verbatim' : 'normalized' }} /></ul>
        <h3 className="pf-h">Đơn vị có câu nguồn cùng sản phẩm · {cung.length}</h3>
        <ul className="pf-list">{cung.map((t) => (
          <li key={t}><button type="button" className="pf-row" onClick={() => moMuc({ loai: 'don_vi', ten: t })}><span className="pf-row__v">{t}</span></button></li>))}
        </ul>
        <h3 className="pf-h">Match đã ký · {ky.length}</h3>
        <ul className="pf-list">{ky.map((m) => (
          <li key={m.id}><button type="button" className="pf-row" onClick={() => moMuc({ loai: 'don_vi', ten: m.supplyId })}>
            <span className="pf-row__k">{m.id}</span><span className="pf-row__v">{m.supplyId}</span>
            <span className="pf-row__s">ký bởi {tenNguoi(m.signoff.by)} · {ngayVN(m.signoff.date)}</span></button></li>))}
        </ul>
      </>
    );
  }
  if (muc.loai === 'nhom') {
    const us = du.units.filter((u) => u.nhoms.includes(muc.so));
    const ns = du.nodes.filter((x) => x.kind === 'nhu_cau' && x.nhom === muc.so);
    return (
      <>
        <h3 className="pf-h">Đơn vị cung · {us.length}</h3>
        <ul className="pf-list">{us.map((u) => (
          <li key={u.name}><button type="button" className="pf-row" onClick={() => moMuc({ loai: 'don_vi', ten: u.name })}>
            <span className="pf-row__v">{u.name}</span><span className="pf-row__s">{u.evidence.length} câu nguồn</span></button></li>))}
        </ul>
        <h3 className="pf-h">Nhu cầu · {ns.length}</h3>
        <ul className="pf-list">{ns.map((x) => (
          <li key={x.id}><button type="button" className="pf-row" onClick={() => moMuc({ loai: 'nhu_cau', entityId: x.id.slice(3) })}>
            <span className="pf-row__v">{x.label}</span></button></li>))}
        </ul>
      </>
    );
  }
  // So tong: noi dem tu dau, liet ke cai duoc dem.
  const m = du.meta;
  const nguon = 'CNCLData/domains/don_vi_cncl/claims.jsonl';
  const giaiThich: Record<SoKhoa, string> = {
    units: `Số tên đơn vị khác nhau trong ${nguon}, đếm lúc sinh dữ liệu ngày ${m.generatedAt}. Không ai gõ tay con số này; cổng so_sinh đếm lại mỗi lần chạy.`,
    claims: `Số câu nguồn trong ${nguon}. Mỗi câu nguồn là một câu nguyên văn nằm trong một bản chụp nguồn; cổng check_spans chặn câu nguồn nào không tìm thấy câu của nó.`,
    needs: 'Số sản phẩm công nghệ chiến lược trong danh mục của QĐ 21/2026/QĐ-TTg, lấy từ chiều CẦU (Dataset_CongNgheChienLuoc).',
    tierA: 'Số câu nguồn hạng A theo bảng phân hạng nguồn của lĩnh vực. Hạng là độ tin của NGUỒN, không phải độ đúng của câu.',
    snapshots: 'Số bản chụp nguồn được dùng làm bằng. Bấm từng câu nguồn để mở đúng bản chụp của nó.',
    gate: m.chuoiCong ? `Kết quả lần chạy trọn gần nhất của kiểm định tự động, đọc từ file kết quả chứ không gõ tay.` : 'Môi trường này chưa có kết quả kiểm định tự động nào, nên không được ghi là đạt.',
    matches: 'Match chỉ lên web khi có chữ ký người gác cổng trong sổ ký. Máy không tạo chữ ký.',
  };
  const theoTier = ['A', 'B', 'C'].map((t) => [t, du.units.flatMap((u) => u.evidence).filter((e) => e.tier === t).length] as const);
  return (
    <>
      <p className="pf-explain">{giaiThich[muc.khoa]}</p>
      {muc.khoa === 'gate' && m.chuoiCong && (
        <dl className="pf-dl">
          <dt>Lúc chạy</dt><dd>{m.chuoiCong.luc}</dd>
          <dt>Xanh</dt><dd>{m.chuoiCong.xanh}/{m.chuoiCong.tong}</dd>
          <dt>Đỏ</dt><dd>{m.chuoiCong.do}</dd>
          <dt>Không chạy được</dt><dd>{m.chuoiCong.khongChay}</dd>
          <dt>Hoãn</dt><dd>{m.chuoiCong.hoan}</dd>
        </dl>)}
      {(muc.khoa === 'claims' || muc.khoa === 'tierA') && (
        <dl className="pf-dl">{theoTier.map(([t, n]) => <Fragment key={t}><dt>hạng {t}</dt><dd>{n}</dd></Fragment>)}</dl>)}
      {(muc.khoa === 'units' || muc.khoa === 'claims' || muc.khoa === 'tierA') && (<>
        <h3 className="pf-h">Các đơn vị được đếm · {du.units.length}</h3>
        <ul className="pf-list">{du.units.map((u) => (
          <li key={u.name}><button type="button" className="pf-row" onClick={() => moMuc({ loai: 'don_vi', ten: u.name })}>
            <span className="pf-row__v">{u.name}</span><span className="pf-row__s">{u.evidence.length} câu · hạng {u.bestTier}</span></button></li>))}
        </ul></>)}
      {muc.khoa === 'needs' && (
        <ul className="pf-list">{du.needs.map((n) => (
          <li key={n.id}><button type="button" className="pf-row" onClick={() => moMuc({ loai: 'nhu_cau', entityId: n.entityId })}>
            <span className="pf-row__k">{n.id}</span><span className="pf-row__v">{n.value}</span></button></li>))}
        </ul>)}
      {muc.khoa === 'matches' && (
        <ul className="pf-list">{du.matches.map((x) => (
          <li key={x.id}><button type="button" className="pf-row" onClick={() => moMuc({ loai: 'don_vi', ten: x.supplyId })}>
            <span className="pf-row__k">{x.id}</span><span className="pf-row__v">{x.supplyId}</span>
            <span className="pf-row__s">{tenNguoi(x.signoff.by)} · {ngayVN(x.signoff.date)}</span></button></li>))}
        </ul>)}
      {muc.khoa === 'snapshots' && (
        <ul className="pf-list">{[...new Set(du.units.flatMap((u) => u.evidence.map((e) => e.href)))].sort().map((h) => (
          <li key={h}><MoBanChup className="pf-row pf-row--a" href={h}><span className="pf-row__v">{h.replace('/evidence/', '')}</span></MoBanChup></li>))}
        </ul>)}
    </>
  );
}

function tieuDe(muc: Muc, du: Du | null): { eyebrow: string; title: string } {
  if (muc.loai === 'don_vi') return { eyebrow: 'Hồ sơ đơn vị · lớp phủ nguồn', title: muc.ten };
  if (muc.loai === 'nhu_cau') return { eyebrow: 'Nhu cầu · lớp phủ nguồn', title: du?.needs.find((n) => n.entityId === muc.entityId)?.value ?? muc.entityId };
  if (muc.loai === 'nhom') return { eyebrow: 'Nhóm công nghệ chiến lược', title: du?.nodes.find((n) => n.id === `nh:${muc.so}`)?.label ?? `Nhóm ${muc.so}` };
  const ten: Record<SoKhoa, string> = { units: 'đơn vị', claims: 'câu nguồn', needs: 'nhu cầu', tierA: 'câu nguồn hạng A', snapshots: 'bản chụp', gate: 'kiểm định tự động', matches: 'match đã ký' };
  const m = du?.meta;
  const so: Record<SoKhoa, number | string | undefined> = {
    units: m?.units, claims: m?.claims, needs: m?.needs, tierA: m?.tierA, snapshots: m?.snapshots,
    gate: m?.chuoiCong ? `${m.chuoiCong.xanh}/${m.chuoiCong.tong}` : undefined, matches: du?.matches.length,
  };
  return { eyebrow: 'Con số này đến từ đâu', title: so[muc.khoa] !== undefined ? `${so[muc.khoa]} ${ten[muc.khoa]}` : ten[muc.khoa] };
}

// ── Tam kinh ────────────────────────────────────────────────────────────────
function TamKinh({ ls, du, dong, moMuc, quayLai }: { ls: Muc[]; du: Du | null; dong: () => void; moMuc: (m: Muc) => void; quayLai: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const muc = ls[ls.length - 1];
  const mo = Boolean(muc);
  useHopThoai(mo, dong, ref);
  useEffect(() => { if (mo) ref.current?.querySelector<HTMLElement>('.pf-close')?.focus(); }, [mo, muc]);
  if (!muc) return null;
  const { eyebrow, title } = tieuDe(muc, du);
  return (
    <>
      <div className="pf-scrim" onClick={dong} aria-hidden="true" />
      <div className="pf-panel" role="dialog" aria-modal="true" aria-labelledby="pf-title" ref={ref}>
        <header className="pf-panel__head">
          <div>
            <div className="pf-eyebrow">{eyebrow}</div>
            <h2 className="pf-title" id="pf-title">{title}</h2>
          </div>
          <div className="pf-panel__btns">
            {ls.length > 1 && <button type="button" className="pf-btn" onClick={quayLai}>Quay lại</button>}
            <button type="button" className="pf-btn pf-close" onClick={dong} aria-label="Đóng lớp phủ nguồn">Đóng · Esc</button>
          </div>
        </header>
        <div className="pf-panel__body">
          {du ? <NoiDung muc={muc} du={du} moMuc={moMuc} dong={dong} /> : <p className="pf-ctx pf-ctx--cho">Đang nạp dữ liệu registry…</p>}
        </div>
        <footer className="pf-panel__foot">
          Tự kiểm được: mỗi câu trên đây phải nằm nguyên văn trong bản chụp của nó. Chạy <code>check_spans.py</code> hoặc
          chuỗi <code>chay_het_cong.sh</code> để dựng lại mà không cần tin ai.
        </footer>
      </div>
    </>
  );
}

// ── Bang lenh Cmd+K ─────────────────────────────────────────────────────────
function BangLenh({ mo, dong, du, chon }: { mo: boolean; dong: () => void; du: Du | null; chon: (d: SearchDoc) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const inRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);
  useHopThoai(mo, dong, ref);
  // Xoa o nhap khi DONG chu khong phai khi MO: xoa luc mo thi mot effect chay SAU lan ve dau
  // se nuot chu nguoi dung vua go (luot kiem that 29/09/2026 mat chu "Đ" dau tien).
  useEffect(() => { if (!mo) { setQ(''); setI(0); } }, [mo]);
  const kq = useMemo(() => (du ? timKiem(du.docs, q, 24) : []), [du, q]);
  useEffect(() => { setI(0); }, [q]);
  if (!mo) return null;
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setI((v) => Math.min(v + 1, kq.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setI((v) => Math.max(v - 1, 0)); }
    else if (e.key === 'Enter' && kq[i]) { e.preventDefault(); chon(kq[i].doc as SearchDoc); }
  };
  const nhom = ['don_vi', 'nhu_cau', 'nhom'].map((k) => [k, kq.map((r, idx) => ({ ...r, idx })).filter((r) => r.doc.kind === k)] as const);
  return (
    <>
      <div className="pf-scrim pf-scrim--k" onClick={dong} aria-hidden="true" />
      <div className="pf-cmdk" role="dialog" aria-modal="true" aria-label="Tìm trong hub" ref={ref}>
        <input
          // autoFocus chu khong chi setTimeout: luot kiem that 29/09/2026 go nhanh "Đông Anh" ngay
          // khi mo va mat chu dau vi o nhap chua kip nhan focus.
          autoFocus
          ref={inRef} className="pf-cmdk__in" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKey}
          placeholder="Tìm đơn vị, nhu cầu, nhóm công nghệ… gõ không dấu cũng được"
          role="combobox" aria-expanded={kq.length > 0} aria-controls="pf-cmdk-list"
          aria-activedescendant={kq[i] ? `pf-opt-${i}` : undefined} aria-autocomplete="list"
        />
        <div className="pf-cmdk__list" id="pf-cmdk-list" role="listbox" aria-label="Kết quả">
          {!du && <p className="pf-ctx pf-ctx--cho">Đang nạp chỉ mục…</p>}
          {du && !q.trim() && (
            <p className="pf-cmdk__hint">
              {du.docs.length} tài liệu trong chỉ mục: {du.units.length} đơn vị, {du.needs.length} nhu cầu, nhóm công nghệ. Thử “dong anh”, “ban dan”, “uav”.
            </p>)}
          {du && q.trim() && kq.length === 0 && <p className="pf-cmdk__hint">Không có kết quả cho “{q}”. Ô trống ở đây là thật, không phải lỗi.</p>}
          {nhom.map(([k, ds]) => ds.length > 0 && (
            <div key={k} role="group" aria-label={TEN_LOAI[k]}>
              <div className="pf-cmdk__grp">{TEN_LOAI[k]} · {ds.length}</div>
              {ds.map((r) => (
                <div
                  key={r.doc.id} id={`pf-opt-${r.idx}`} role="option" aria-selected={r.idx === i}
                  className={`pf-cmdk__opt${r.idx === i ? ' is-on' : ''}`}
                  onMouseEnter={() => setI(r.idx)} onClick={() => chon(r.doc as SearchDoc)}
                >
                  <span className="pf-cmdk__ten">{r.doc.ten}</span>
                  <span className="pf-cmdk__nhan">{(r.doc as SearchDoc).nhan}</span>
                </div>))}
            </div>))}
        </div>
        <div className="pf-cmdk__foot"><kbd>↑</kbd><kbd>↓</kbd> chọn · <kbd>Enter</kbd> mở lớp phủ nguồn · <kbd>Esc</kbd> đóng</div>
      </div>
    </>
  );
}

// ── Lop tong ────────────────────────────────────────────────────────────────
export function ProofLayer({ children }: { children: React.ReactNode }) {
  const [ls, setLs] = useState<Muc[]>([]);
  const [kMo, setKMo] = useState(false);
  const [du, setDu] = useState<Du | null>(null);
  const nap = useCallback(() => { napDuLieu().then(setDu).catch(() => setDu(null)); }, []);

  const moMuc = useCallback((m: Muc) => { nap(); setKMo(false); setLs((v) => [...v, m]); }, [nap]);
  const moTimKiem = useCallback(() => { nap(); setKMo(true); }, [nap]);
  const dongTam = useCallback(() => setLs([]), []);
  const quayLai = useCallback(() => setLs((v) => v.slice(0, -1)), []);
  const dongK = useCallback(() => setKMo(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); nap(); setKMo((v) => !v); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [nap]);

  const chon = useCallback((d: SearchDoc) => {
    const m: Muc = d.kind === 'don_vi' ? { loai: 'don_vi', ten: d.id.slice(3) }
      : d.kind === 'nhu_cau' ? { loai: 'nhu_cau', entityId: d.id.slice(3) }
        : { loai: 'nhom', so: d.id.slice(3) };
    setKMo(false); setLs([m]);
  }, []);

  // Doi trang (vd bam "Mo ho so day du") thi dong lop phu, khong de tam kinh treo tren trang moi.
  const duongDan = usePathname();
  useEffect(() => { setLs([]); setKMo(false); }, [duongDan]);

  const ctx = useMemo(() => ({ moMuc, moTimKiem }), [moMuc, moTimKiem]);
  return (
    <ProofCtx.Provider value={ctx}>
      {children}
      <BangLenh mo={kMo} dong={dongK} du={du} chon={chon} />
      <TamKinh ls={ls} du={du} dong={dongTam} moMuc={moMuc} quayLai={quayLai} />
    </ProofCtx.Provider>
  );
}

/** Mot con so bam duoc. Bam la mo tam kinh noi so do den tu dau. */
export function ProofNumber({ khoa, children, className }: { khoa: SoKhoa; children: React.ReactNode; className?: string }) {
  const { moMuc } = useProof();
  return (
    <button type="button" className={`pf-num ${className ?? ''}`} onClick={() => moMuc({ loai: 'so', khoa })}
      title="Bấm để xem con số này đến từ đâu">
      {children}
    </button>
  );
}

/** Nut tim kiem tren thanh tren cung. */
export function SearchTrigger() {
  const { moTimKiem } = useProof();
  return (
    <button type="button" className="dash-iconbtn pf-trigger" aria-label="Tìm trong hub (Cmd K)" onClick={moTimKiem}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" /><path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
      <kbd className="pf-trigger__k">⌘K</kbd>
    </button>
  );
}

/** Mo lop phu cho mot don vi, dung trong bang registry. */
export function ProofUnitButton({ ten, children, className }: { ten: string; children: React.ReactNode; className?: string }) {
  const { moMuc } = useProof();
  return <button type="button" className={`pf-unitbtn ${className ?? ''}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); moMuc({ loai: 'don_vi', ten }); }}>{children}</button>;
}
