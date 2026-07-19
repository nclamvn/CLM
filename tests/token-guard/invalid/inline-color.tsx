// fixture: PHAI FAIL - raw color trong inline style + attribute
export function Bad() {
  const accent = 'rgba(34, 197, 94, 0.3)';
  return (
    <div style={{ color: '#22c55e', background: accent }}>
      <span data-c="#ffffff" />
    </div>
  );
}
