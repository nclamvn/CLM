'use client';

/**
 * HoiDap · Man "Hoi dap co nguon" (01/10/2026, tinh nang dac sac so 2).
 *
 * Cau tra loi la CAU NGUON NGUYEN VAN chon bang truy hoi tat dinh (lib/hoi-dap.mjs), khong phai
 * chu may viet. Khong co cau nguon thi tu choi, noi thang so nguon chua co. Tu khoa khop duoc to
 * dam ngay trong cau nguon de nguoi doc thay vi sao cau do duoc chon.
 * Lien ket chia se: ?q=<cau hoi> mo thang cau tra loi.
 */
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import chiMuc from '@/lib/hub-hoi-dap.json';
import { hoiDap, DONG_NGHIA } from '@/lib/hoi-dap.mjs';
import { khoaTim } from '@/lib/tim-kiem.mjs';
import { tenTruong } from '@/components/proof/ProofLayer';
import { tenNgan } from '@/lib/ten-ngan.mjs';
import { hienCau } from '@/lib/hien-cau.mjs';

type Trich = { span: string; href: string; tier: string; source: string; field: string; khop: string[] };
type DonVi = { dv: string; slug: string; trich: Trich[]; kyCho: { match: string; nhuCau: string }[] };
type KetQua = { cau: string; khaiNiem: string[]; nhuCau: { ma: string; ten: string }[]; donVi: DonVi[]; tuChoi: string | null };

const VI_DU = ['Ai làm được UAV?', 'Đơn vị nào làm chip bán dẫn?', 'Vắc xin dịch tả lợn châu Phi', 'Robot hình người', 'Điện toán đám mây', 'Cảm biến sinh học'];
// Ban do khai niem -> moi cach viet, de to dam ca tu dong nghia ("drone" khi hoi "UAV").
const THAY = new Map<string, string[]>((DONG_NGHIA as string[][]).map((c) => [c[0], c]));

/** To dam cac doan cua cau nguon khop khai niem (so khop tren ban bo dau, giu nguyen chu goc). */
function ToDam({ span, khop, thay }: { span: string; khop: string[]; thay: Map<string, string[]> }) {
  const tu = [...span.matchAll(/\S+/g)].map((m) => ({ goc: m[0], tu: m.index ?? 0, k: khoaTim(m[0]).replace(/[^a-z0-9]/g, '') }));
  const danh = new Array(tu.length).fill(false);
  for (const kn of khop) {
    for (const cum of thay.get(kn) ?? [kn]) {
      const c = cum.split(' ');
      for (let i = 0; i + c.length <= tu.length; i++) {
        if (c.every((x, j) => (j === 0 ? tu[i + j].k.startsWith(x) : tu[i + j].k === x))) for (let j = 0; j < c.length; j++) danh[i + j] = true;
      }
    }
  }
  const ra: React.ReactNode[] = [];
  let tro = 0;
  tu.forEach((w, i) => {
    if (w.tu > tro) ra.push(span.slice(tro, w.tu));
    ra.push(danh[i] ? <mark key={i} className="hd-mark">{w.goc}</mark> : w.goc);
    tro = w.tu + w.goc.length;
  });
  if (tro < span.length) ra.push(span.slice(tro));
  return <>{ra}</>;
}

export function HoiDap() {
  const [q, setQ] = useState('');
  const [daHoi, setDaHoi] = useState('');
  useEffect(() => {
    const c = new URLSearchParams(window.location.search).get('q');
    if (c) { setQ(c); setDaHoi(c); }
  }, []);
  const kq = useMemo(() => (daHoi ? (hoiDap(daHoi, chiMuc as never) as KetQua) : null), [daHoi]);
  const hoi = (c: string) => {
    const s = c.trim();
    setQ(s); setDaHoi(s);
    const u = new URL(window.location.href);
    if (s) u.searchParams.set('q', s); else u.searchParams.delete('q');
    window.history.replaceState(null, '', u.toString());
  };

  return (
    <div className="hd">
      <section className="dash-panel hd-hoi" aria-labelledby="hd-h">
        <h2 className="hs-h" id="hd-h">Hỏi sổ nguồn <span>trả lời bằng câu nguồn nguyên văn, không có nguồn thì không trả lời</span></h2>
        <form className="hd-form" onSubmit={(e) => { e.preventDefault(); hoi(q); }}>
          <label htmlFor="hd-q" className="sr-only">Câu hỏi</label>
          <input id="hd-q" className="hd-input" type="search" value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Ví dụ: Ai làm được UAV ở Việt Nam?" autoComplete="off" />
          <button type="submit" className="hd-nut">Hỏi</button>
        </form>
        <div className="hd-vidu" role="group" aria-label="Câu hỏi mẫu">
          {VI_DU.map((v) => <button key={v} type="button" className="dt2-chip" onClick={() => hoi(v)}>{v}</button>)}
        </div>
      </section>

      {kq && (
        <section className="dash-panel hd-tl" aria-labelledby="hd-tl-h" aria-live="polite">
          <h2 className="hs-h" id="hd-tl-h">Trả lời <span>cho câu: “{kq.cau}”</span></h2>
          {kq.khaiNiem.length > 0 && (
            <p className="hd-hieu">Máy hiểu câu hỏi gồm: {kq.khaiNiem.map((k) => <span key={k} className="hd-kn">{k}</span>)}</p>)}
          {kq.nhuCau.length > 0 && (
            <p className="hd-hieu">Liên quan nhu cầu quốc gia: {kq.nhuCau.map((n) => <span key={n.ma} className="hd-nc">P{n.ma} · {n.ten}</span>)}</p>)}
          {kq.tuChoi ? (
            <p className="hd-tuchoi">{kq.tuChoi}</p>
          ) : (
            <>
              <p className="hd-tom">Sổ nguồn có <b>{kq.donVi.length}</b> đơn vị liên quan. Mỗi dòng dưới đây là câu chép nguyên văn từ nguồn, bấm để mở bản chụp.</p>
              <ol className="hd-ds">
                {kq.donVi.map((d) => (
                  <li key={d.dv} className="hd-dv">
                    <div className="hd-dv__dau">
                      <Link href={`/dashboard/don-vi/${d.slug}`} className="hd-dv__ten" title={d.dv}>{tenNgan(d.dv)}</Link>
                      {d.kyCho.map((k) => (
                        <Link key={k.match} href={`/dashboard/matching?m=${k.match}`} className="hs-badge hs-badge--match">{k.match} đã ký cho {k.nhuCau}</Link>))}
                    </div>
                    {d.trich.length === 0 && <p className="hd-khong">Có cặp ghép đã ký với nhu cầu này, nhưng câu nguồn năng lực không nhắc đúng từ khoá câu hỏi.</p>}
                    {d.trich.map((t, i) => (
                      <figure key={i} className="hd-trich">
                        <blockquote><ToDam span={hienCau(t.span)} khop={t.khop} thay={THAY} /></blockquote>
                        <figcaption>
                          <span className={`pf-tier pf-tier--${t.tier}`}>hạng {t.tier}</span>
                          <span>{tenTruong(t.field)} · {t.source}</span>
                          <a className="pf-link" href={t.href} target="_blank" rel="noopener noreferrer">Mở bản chụp</a>
                        </figcaption>
                      </figure>))}
                  </li>))}
              </ol>
            </>
          )}
        </section>
      )}

      <p className="hs-foot">
        Cách trả lời: máy tách câu hỏi thành khái niệm (gộp từ đồng nghĩa như UAV và thiết bị bay không người lái), tìm trong {(chiMuc as { taiLieu: unknown[] }).taiLieu.length} câu
        nguồn về năng lực, rồi trả nguyên văn câu khớp. Máy không viết thêm chữ nào và không đoán. Đơn vị đã có cặp ghép được người ký cho nhu cầu được hỏi
        thì hiện kèm. Kiểm định tự động chạy lại một bộ câu hỏi chuẩn mỗi lần dữ liệu đổi.
      </p>
    </div>
  );
}
