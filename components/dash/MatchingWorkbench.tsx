'use client';

import { useState } from 'react';
import { signedMatches, rejectedPairs, matchMeta, type SignedMatch, type MatchEvidence } from '@/lib/cncl-match';

/**
 * Matching Workbench. DU LIEU THAT tu 18/08/2026: 12 match da qua toan bo chuoi cong va
 * mang chu ky that cua nguoi gac cong, sinh boi scripts/gen-cncl-data.mjs.
 *
 * VI SAO BO NUT APPROVE/REJECT (quyet dinh 18/08/2026):
 * Ban DEMO cu co hai nut ghi UI-state kem ghi chu. Khi match con la minh hoa thi vo hai.
 * Nay match la that va da co chu ky that trong so, hai nut do tro thanh mot DUONG KY THU HAI:
 * yeu hon duong that (khong qua cong, khong vao so, khong khoa bang chung) nhung nhin giong
 * het. Nguoi dung se tuong minh vua duyet mot match.
 *
 * Duong ky duy nhat la lenh cua engine:
 *     python3 match_engine.py sign out/matches.jsonl "<ten>" <ngay> [--only ID]
 * No ghi vao so co khoa noi dung VA khoa bang chung, nen sua mot chu trong cau lam bang la
 * chu ky rung ra. Man nay chi DOC va HIEN chu ky do. Xem reports/KHOA_BANG_CHUNG_verify.md.
 *
 * Man nay khong duoc phep tao chu ky. Do la ranh gioi, khong phai thieu tinh nang.
 */

function thang(score: number): { label: string; tone: string } {
  if (score >= 0.75) return { label: 'Khớp mạnh', tone: 'green' };
  if (score >= 0.60) return { label: 'Khớp khá', tone: 'blue' };
  if (score >= 0.50) return { label: 'Khớp vừa', tone: 'amber' };
  return { label: 'Khớp yếu', tone: 'red' };
}

const tenCau = (id: string) => id.replace(' · nhu cầu quốc gia', '').replace('san_pham_', 'SP ');

function EvidenceBlock({ nhan, ds }: { nhan: string; ds: MatchEvidence[] }) {
  return (
    <div className="mw-ev">
      <div className="mw-eyebrow">{nhan}</div>
      {ds.length === 0 ? (
        <p className="mw-hint">Không có fact nào, đây là bất thường và cần soi lại.</p>
      ) : ds.map((e, i) => (
        <figure key={i} className="mw-quote">
          <blockquote className="mw-quote__txt">{e.span}</blockquote>
          <figcaption className="mw-quote__cap">
            <span className={`chip ${e.tier === 'A' ? 'chip--pass' : e.tier === 'B' ? 'chip--public' : 'chip--private'} reg-tier`}>
              {`Tier ${e.tier}`}
            </span>
            <a className="reg-src" href={e.href} target="_blank" rel="noopener noreferrer">{e.source}</a>
            <span className="t-mono-01">{e.field}</span>
            {e.extraction !== 'verbatim' ? (
              <span className="chip chip--private reg-tier" title="Giá trị chuẩn hoá từ câu nguồn, không trích nguyên văn">
                {e.extraction}
              </span>
            ) : null}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function MatchingWorkbench() {
  const [sel, setSel] = useState(0);
  const list = signedMatches;
  const current: SignedMatch | undefined = list[Math.min(sel, Math.max(0, list.length - 1))];

  return (
    <div className="mw">
      <aside className="mw-col mw-left" aria-label="Tong quan va quyet dinh nguoi">
        <div className="mw-panel">
          <div className="mw-eyebrow">Trạng thái</div>
          <ul className="mw-decided">
            <li><span className="mw-ok">{matchMeta.daKy}</span> match đã ký</li>
            <li><span className="mw-no">{matchMeta.tuChoi}</span> cặp bị từ chối</li>
            <li>Người ký: {matchMeta.nguoiKy}</li>
            <li>Quy tắc: <span className="t-mono-01">{matchMeta.rule}</span></li>
          </ul>

          <div className="mw-eyebrow" style={{ marginTop: 'var(--space-4)' }}>Chữ ký tạo ở đâu</div>
          <p className="mw-hint">
            Chữ ký chỉ sinh ra từ lệnh <span className="t-mono-01">sign</span> của engine, ghi vào sổ
            có khoá nội dung và khoá bằng chứng. Sửa một chữ trong câu làm bằng là chữ ký rụng ra.
            Màn này chỉ đọc và hiện lại, không tạo được chữ ký.
          </p>

          {rejectedPairs.length > 0 ? (
            <>
              <div className="mw-eyebrow" style={{ marginTop: 'var(--space-4)' }}>Đã từ chối</div>
              <ul className="mw-decided">
                {rejectedPairs.map((r, i) => (
                  <li key={i}>
                    <span className="mw-no">{tenCau(r.demandId)} ⇄ {r.supplyId}</span>
                    <span className="mw-rej__why">{r.lyDo}</span>
                    <span className="mw-rej__who">{r.by} · {r.date}</span>
                  </li>
                ))}
              </ul>
              <p className="mw-hint">
                Cặp đã từ chối bị chặn ở tầng engine, dưới mọi quy tắc so khớp. Một quy tắc mới làm
                nó quay lại thì cổng nổ chứ không im lặng cho qua.
              </p>
            </>
          ) : null}
        </div>
      </aside>

      <section className="mw-col mw-center" aria-label="Match da ky">
        <div className="mw-center-head">
          <span className="mw-eyebrow">Cầu ⇄ cung · điểm khớp · chữ ký</span>
          <span className="chip chip--pass">DỮ LIỆU THẬT</span>
        </div>
        <ul className="mw-cands" role="list">
          {list.map((m, i) => {
            const l = thang(m.score);
            const isSel = current?.id === m.id;
            return (
              <li key={m.id}>
                <button type="button" className={`mw-cand${isSel ? ' is-sel' : ''}`} aria-pressed={isSel} onClick={() => setSel(i)}>
                  <span className={`mw-score mw-score--${l.tone}`}>{Math.round(m.score * 100)}</span>
                  <span className="mw-cand__mid">
                    <span className="mw-cand__title">{tenCau(m.demandId)} ⇄ {m.supplyId}</span>
                    <span className="mw-cand__why">
                      Neo nhóm {m.nhomCau} ∩ {m.nhomCung.join(', ') || 'không'}
                      {m.tokenGiao.length ? ` · giao chữ: ${m.tokenGiao.join(', ')}` : ''}
                    </span>
                    <span className="mw-cand__cap">{m.supplyEvidence[0]?.value ?? ''}</span>
                  </span>
                  <span className="mw-cand__right">
                    <span className={`mw-ladder mw-ladder--${l.tone}`}>{l.label}</span>
                    <span className="chip chip--pass reg-tier" title={`Ký bởi ${m.signoff.by} ngày ${m.signoff.date}`}>ĐÃ KÝ</span>
                    {m.chuaDuyet.length ? (
                      <span className="chip chip--private reg-tier" title="Bằng chứng thêm vào sau khi ký, chữ ký cũ không phủ phần này">
                        {`+${m.chuaDuyet.length} chưa duyệt`}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <aside className="mw-col mw-right" aria-label="Chuoi bang chung">
        {current ? (
          <div className="mw-panel">
            <div className="mw-center-head">
              <span className="mw-eyebrow">Chuỗi bằng chứng</span>
              <span className="t-mono-01">{current.id}</span>
            </div>

            <EvidenceBlock nhan="Bên CẦU · nhu cầu quốc gia" ds={current.demandEvidence} />
            <EvidenceBlock nhan={`Bên CUNG · ${current.supplyId}`} ds={current.supplyEvidence} />

            <div className="mw-eyebrow" style={{ marginTop: 'var(--space-4)' }}>Chữ ký người gác cổng</div>
            <ul className="mw-trail">
              <li><span className="mw-trail__k">Người ký</span><span className="mw-trail__v">{current.signoff.by}</span></li>
              <li><span className="mw-trail__k">Vai</span><span className="mw-trail__v">{current.signoff.role}</span></li>
              <li><span className="mw-trail__k">Ngày</span><span className="mw-trail__v">{current.signoff.date}</span></li>
              <li>
                <span className="mw-trail__k">Khoá bằng chứng</span>
                <span className="mw-trail__v t-mono-01" title="Băm của tập câu làm bằng lúc ký. Đổi một chữ là chữ ký rụng.">
                  {current.khoaBangChung ?? 'chưa đóng khoá'}
                </span>
              </li>
              <li><span className="mw-trail__k">Engine</span><span className="mw-trail__v t-mono-01">{current.engine}</span></li>
            </ul>

            {current.chuaDuyet.length > 0 ? (
              <p className="mw-hint">
                {current.chuaDuyet.length} bằng chứng được thêm vào SAU khi ký, nên chữ ký hiện tại
                không phủ phần đó. Cặp này vẫn có người ký, nhưng phần mới chưa ai xem. Ký lại dòng
                này nếu muốn chữ ký phủ cả phần mới.
              </p>
            ) : null}
            {current.soChuoi > 1 ? (
              <p className="mw-hint">
                Cặp này có {current.soChuoi} chuỗi bằng chứng độc lập, đã gộp vào một dòng.
              </p>
            ) : null}
            {current.unverified.length > 0 ? (
              <p className="mw-hint">
                Tự khai unverified: {current.unverified.join(', ')}.
              </p>
            ) : null}
          </div>
        ) : (
          <div className="mw-panel mw-decided__empty">Chưa có match nào được ký.</div>
        )}
      </aside>

      <footer className="mw-footer" aria-label="Provenance-linked output">
        <span className="chip chip--pass">ĐÃ KÝ</span>
        <span className="mw-footer__txt">
          Chỉ match đã qua đủ cổng và có chữ ký người mới được đưa lên đây. Match chưa ký không
          xuất hiện trên web, vì web là chỗ trình ra ngoài.
        </span>
        <span className="t-mono-01">{matchMeta.daKy}/{matchMeta.tongChay} đã ký · sinh {matchMeta.generatedAt}</span>
      </footer>
    </div>
  );
}
