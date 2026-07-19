/**
 * Wave bridge giua CUNG va CAU: dong chay nhieu lop (5 duong cong khac nhau, khong hoi tu 1 tam,
 * hai dau lech nhau), gradient xanh -> cyan -> tim, hai dau fade. Pulse cham chi khi
 * prefers-reduced-motion: no-preference. Truyen dat "hai chieu sap noi", khong phai con mat.
 */
export function WaveBridge() {
  return (
    <svg className="supply-demand-bridge" viewBox="0 0 148 108" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="wb-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: 'var(--color-accent-blue)' }} stopOpacity="0" />
          <stop offset="0.24" style={{ stopColor: 'var(--color-accent-blue)' }} />
          <stop offset="0.5" style={{ stopColor: 'var(--color-accent-cyan)' }} />
          <stop offset="0.76" style={{ stopColor: 'var(--color-accent-purple)' }} />
          <stop offset="1" style={{ stopColor: 'var(--color-accent-purple)' }} stopOpacity="0" />
        </linearGradient>
      </defs>
      <g stroke="url(#wb-grad)" fill="none" strokeLinecap="round">
        <path d="M2 40 C 44 12, 104 26, 146 34" strokeWidth="1.5" />
        <path d="M2 54 C 42 38, 100 46, 146 52" strokeWidth="1.1" opacity="0.74" />
        <path d="M4 66 C 48 62, 96 72, 144 66" strokeWidth="1" opacity="0.66" />
        <path d="M2 80 C 44 86, 104 90, 146 82" strokeWidth="0.75" opacity="0.5" />
        <path d="M6 30 C 50 20, 92 16, 142 24" strokeWidth="0.75" opacity="0.4" />
      </g>
    </svg>
  );
}
