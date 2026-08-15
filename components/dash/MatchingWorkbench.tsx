'use client';

import { useState } from 'react';
import { hubMatches, type HubMatch, type Badge } from '@/lib/demo-data';

/**
 * Matching Workbench (Pha 3, handbook muc 4 poster p4): 3 cot
 * A demand/filters 280px · B candidates + confidence ladder · C evidence trail + human decision 320px,
 * sticky action footer. TOAN BO DEMO co nhan: engine chua chay match that (thieu chieu CAU).
 * Approve/Reject CHI ghi UI-state kem ghi chu bat buoc, KHONG tiem vai nguoi gac cong that.
 */

type Decision = { verdict: 'approve' | 'reject'; note: string };

function ladder(score: number): { label: string; tone: string } {
  if (score >= 0.9) return { label: 'High match', tone: 'green' };
  if (score >= 0.85) return { label: 'Strong match', tone: 'blue' };
  if (score >= 0.8) return { label: 'Moderate match', tone: 'amber' };
  return { label: 'Weak match', tone: 'red' };
}

export function MatchingWorkbench() {
  const [filter, setFilter] = useState<'ALL' | Badge>('ALL');
  const [sel, setSel] = useState(0);
  const [note, setNote] = useState('');
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});

  const list = hubMatches.filter((m) => filter === 'ALL' || m.badge === filter);
  const current: HubMatch | undefined = list[Math.min(sel, Math.max(0, list.length - 1))];
  const decided = current ? decisions[current.code] : undefined;

  function decide(verdict: Decision['verdict']) {
    if (!current || note.trim().length === 0) return;
    setDecisions((d) => ({ ...d, [current.code]: { verdict, note: note.trim() } }));
    setNote('');
  }

  return (
    <div className="mw" data-demo="true">
      <aside className="mw-col mw-left" aria-label="Demand va bo loc">
        <div className="mw-panel">
          <div className="mw-eyebrow">Demand summary</div>
          <p className="mw-demand-note">
            Chiều CẦU thật chưa có (chờ dataset PoC). Demand dưới đây là DEMO minh hoạ luồng duyệt.
          </p>
          <div className="mw-eyebrow" style={{ marginTop: 'var(--space-4)' }}>Filters</div>
          <div className="mw-filters" role="group" aria-label="Loc theo trang thai">
            {(['ALL', 'VOUCHED', 'READY'] as const).map((f) => (
              <button
                key={f}
                type="button"
                className={`mw-chip${filter === f ? ' is-on' : ''}`}
                aria-pressed={filter === f}
                onClick={() => { setFilter(f); setSel(0); }}
              >
                {f === 'ALL' ? 'Tất cả' : f}
              </button>
            ))}
          </div>
          <div className="mw-eyebrow" style={{ marginTop: 'var(--space-4)' }}>Đã quyết (UI demo)</div>
          <ul className="mw-decided">
            {Object.entries(decisions).length === 0 ? (
              <li className="mw-decided__empty">Chưa có quyết định nào.</li>
            ) : (
              Object.entries(decisions).map(([code, d]) => (
                <li key={code}>
                  <span className="t-mono-01">{code}</span>{' '}
                  <span className={d.verdict === 'approve' ? 'mw-ok' : 'mw-no'}>
                    {d.verdict === 'approve' ? 'Approve' : 'Reject'}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      </aside>

      <section className="mw-col mw-center" aria-label="Candidate matches">
        <div className="mw-center-head">
          <span className="mw-eyebrow">Candidate matches · confidence · explanation</span>
          <span className="chip chip--private">MATCH: DEMO</span>
        </div>
        <ul className="mw-cands" role="list">
          {list.map((m, i) => {
            const l = ladder(m.score);
            const isSel = current?.code === m.code;
            return (
              <li key={m.code}>
                <button
                  type="button"
                  className={`mw-cand${isSel ? ' is-sel' : ''}`}
                  aria-pressed={isSel}
                  onClick={() => setSel(i)}
                >
                  <span className={`mw-score mw-score--${l.tone}`}>{Math.round(m.score * 100)}</span>
                  <span className="mw-cand__mid">
                    <span className="mw-cand__title">{m.short}</span>
                    <span className="mw-cand__why">Vì sao khớp: {m.chain[0]?.v}</span>
                    <span className="mw-cand__cap">{m.cap}</span>
                  </span>
                  <span className="mw-cand__right">
                    <span className={`mw-ladder mw-ladder--${l.tone}`}>{l.label}</span>
                    <span className="chip chip--public reg-tier">{m.badge}</span>
                    {decisions[m.code] ? (
                      <span className={decisions[m.code].verdict === 'approve' ? 'mw-ok' : 'mw-no'}>
                        {decisions[m.code].verdict === 'approve' ? 'Đã approve' : 'Đã reject'}
                      </span>
                    ) : null}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <aside className="mw-col mw-right" aria-label="Evidence trail va quyet dinh nguoi">
        {current ? (
          <div className="mw-panel">
            <div className="mw-center-head">
              <span className="mw-eyebrow">Evidence trail</span>
              <span className="t-mono-01">{current.code}</span>
            </div>
            <ul className="mw-trail">
              {current.chain.map((row, i) => (
                <li key={i} className={row.claim ? 'is-claim' : ''}>
                  <span className="mw-trail__k">{row.k}</span>
                  <span className="mw-trail__v">
                    {row.v}
                    {row.tier ? <span className="chip chip--public reg-tier" style={{ marginLeft: 6 }}>{row.tier.label}</span> : null}
                    {row.tail ?? ''}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mw-vouch">{current.vouch}</div>
            <div className="mw-eyebrow" style={{ marginTop: 'var(--space-4)' }}>Human review required</div>
            <p className="mw-hint">
              Quyết định dưới đây chỉ ghi UI-state demo. Vòng gác cổng thật dùng lệnh sign của engine
              (validate --require-signoff), không thay được bằng nút này.
            </p>
            <label className="mw-eyebrow" htmlFor="mw-note">Notes (required)</label>
            <textarea
              id="mw-note"
              className="mw-note"
              rows={3}
              placeholder="Căn cứ quyết định..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
            <div className="mw-actions">
              <button type="button" className="mw-btn mw-btn--ok" disabled={note.trim().length === 0} onClick={() => decide('approve')}>
                Approve
              </button>
              <button type="button" className="mw-btn mw-btn--no" disabled={note.trim().length === 0} onClick={() => decide('reject')}>
                Reject
              </button>
            </div>
            {decided ? (
              <p className="mw-done">
                Đã ghi: {decided.verdict === 'approve' ? 'Approve' : 'Reject'} · &quot;{decided.note}&quot; (UI demo)
              </p>
            ) : null}
          </div>
        ) : (
          <div className="mw-panel mw-decided__empty">Không có match trong bộ lọc này.</div>
        )}
      </aside>

      <footer className="mw-footer" aria-label="Provenance-linked output">
        <span className="chip chip--private">DEMO</span>
        <span className="mw-footer__txt">
          Provenance-linked output · match đạt gate mới được xuất · registry cung là DỮ LIỆU THẬT, demand và match là minh hoạ.
        </span>
        <span className="t-mono-01">{Object.keys(decisions).length}/{hubMatches.length} đã duyệt (demo)</span>
      </footer>
    </div>
  );
}
