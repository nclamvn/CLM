/* TIP-PORTAL-V1 shared: trang thai provenance (ON + verified %). Style token-only. */
export function ProvenanceStatus({ pct = 100, on = true }: { pct?: number; on?: boolean }) {
  return (
    <span className="provenance-status" role="status">
      <span className="provenance-status__dot" aria-hidden="true" />
      Provenance {on ? 'ON' : 'OFF'}
      <span className="provenance-status__pct">Verified {pct}%</span>
    </span>
  );
}
