/* TIP-PORTAL-V1 muc 2.2: badge trang thai trung thuc du lieu (REAL/DEMO/SYNTHETIC/SCAFFOLD).
   Style token-only qua .data-truth-badge trong touch-portal.css. */
import type { DataTruthState } from '@/lib/truth-state';
import { TRUTH_LABEL, TRUTH_HINT } from '@/lib/truth-state';

export function DataTruthBadge({ state, label }: { state: DataTruthState; label?: string }) {
  return (
    <span className="data-truth-badge" data-truth={state} title={TRUTH_HINT[state]}>
      {label ?? TRUTH_LABEL[state]}
    </span>
  );
}
