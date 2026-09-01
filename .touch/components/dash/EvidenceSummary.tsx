import { evidence } from '@/lib/project-status';

/**
 * Ban thay the evidence rail cho viewport < 1200px. KHONG duoc mat provenance:
 * hien gon Provenance / Verified / Gates + link mo Evidence Registry. An o desktop (CSS).
 */
export function EvidenceSummary() {
  return (
    <div className="evidence-summary">
      <span className="evidence-summary__item">
        <span className="evidence-summary__dot" aria-hidden="true" />
        Provenance ON
      </span>
      <span className="evidence-summary__item">Verified {evidence.verifiablePct}%</span>
      <span className="evidence-summary__item">Gates {evidence.gates.pass}/{evidence.gates.total} PASS</span>
      <a className="evidence-summary__link" href="#">
        Mở Evidence Registry
        <Chevron />
      </a>
    </div>
  );
}

function Chevron() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M8 6l4 4-4 4" />
    </svg>
  );
}
