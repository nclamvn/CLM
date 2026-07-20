import type { ReactElement } from 'react';

/* PillarsDark (VF-L-018): 3 tru thuong hieu, custom SVG icon (khong Lucide phong to),
   accent blue/purple/red, moi tru 1 promise + 1 proof. */
type Accent = 'blue' | 'purple' | 'red';

function ShieldIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M20 5 8 9v9c0 7 5 11.5 12 14 7-2.5 12-7 12-14V9z" />
      <path d="M14 20l4.5 4.5L27 16" />
    </svg>
  );
}
function HandshakeIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 14l7-3 9 4 5-2 6 3v9l-6 2-6-4" />
      <path d="M20 15l-4 3a2.3 2.3 0 0 0 3 3.4l1-.8 3.5 3a2 2 0 0 0 3-2.6" />
      <path d="M4 23l4 1" />
    </svg>
  );
}
function GateIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="9" y="18" width="22" height="15" rx="2" />
      <path d="M14 18v-3a6 6 0 0 1 12 0v3" />
      <path d="M20 24v3" />
    </svg>
  );
}
const ICON: Record<string, () => ReactElement> = { shield: ShieldIcon, handshake: HandshakeIcon, gate: GateIcon };

const PILLARS: { icon: string; accent: Accent; title: string; promise: string; proof: string }[] = [
  { icon: 'shield', accent: 'blue', title: 'Chứng minh được', promise: 'Mọi match truy ngược về từng fact và từng nguồn trong vài bước.', proof: 'provenance · evidence span · tier A/B' },
  { icon: 'handshake', accent: 'purple', title: 'Tăng niềm tin', promise: 'Một người bảo chứng đứng sau mỗi giới thiệu, chịu trách nhiệm thật.', proof: 'vouch · trust layer · track record' },
  { icon: 'gate', accent: 'red', title: 'Fail-loud', promise: 'Match thiếu bằng chứng bị cổng chặn và hiện rõ, không lọt âm thầm.', proof: 'gate · 0 rác lọt · blocked hiện rõ' },
];

export function PillarsDark() {
  return (
    <div className="lp-pillars">
      {PILLARS.map((p) => {
        const Icon = ICON[p.icon];
        return (
          <div key={p.title} className={`lp-pillar surface-executive surface-${p.accent}`} data-accent={p.accent}>
            <span className="lp-pillar__ic">
              <Icon />
            </span>
            <h3 className="lp-pillar__h">{p.title}</h3>
            <p className="lp-pillar__promise">{p.promise}</p>
            <p className="lp-pillar__proof">{p.proof}</p>
          </div>
        );
      })}
    </div>
  );
}
