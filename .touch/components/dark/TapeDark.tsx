import { cnclMeta } from '@/lib/cncl-registry';
import { matchMeta } from '@/lib/cncl-match';
import type { DataTruthState } from '@/lib/truth-state';

/* Tape landing (TIP-PORTAL-V1 muc 7.4). Muc real lay tu cnclMeta (cung nguon Hub).
   KHONG dung "LIVE" vi khong co stream production that. Moi muc kem truth state.
   Sua 29/09/2026: bo muc go tay "Match thật · chưa chạy" (sai tu khi co 11 match da ky). */
interface TapeItem { v: string; k: string; truth: DataTruthState; truthText: string; }

const items: TapeItem[] = [
  { v: String(cnclMeta.units), k: 'đơn vị', truth: 'REAL', truthText: 'REAL' },
  { v: String(cnclMeta.claims), k: 'claim', truth: 'REAL', truthText: 'REAL' },
  { v: String(cnclMeta.sources), k: 'nguồn', truth: 'REAL', truthText: 'REAL' },
  { v: String(cnclMeta.needs), k: 'nhu cầu quốc gia', truth: 'REAL', truthText: 'REAL' },
  { v: String(matchMeta.daKy), k: 'match đã ký', truth: 'REAL', truthText: 'REAL' },
];

export function TapeDark() {
  return (
    <div className="lp-tape" role="marquee" aria-label="Chi so tom tat">
      <span className="lp-tape__label">Match stream</span>
      <div className="lp-tape__track">
        {[0, 1, 2, 3].map((c) => (
          <div className="lp-tape__run" key={c} aria-hidden={c > 0 ? 'true' : undefined}>
            {items.map((t) => (
              <span className="lp-tape__item" key={`${c}-${t.v}-${t.k}`}>
                <b>{t.v}</b>
                {t.k ? <span className="lp-tape__k"> {t.k}</span> : null}
                <span className="lp-tape__truth" data-truth={t.truth}>{t.truthText}</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
