/**
 * Wave bridge giua CUNG va CAU: dong chay nhieu lop (5 duong cong khac nhau, khong hoi tu 1 tam,
 * hai dau lech nhau), gradient xanh -> cyan -> tim, hai dau fade. Pulse cham chi khi
 * prefers-reduced-motion: no-preference. Truyen dat "hai chieu sap noi", khong phai con mat.
 */
/* Quat cung doi xung doc: nhieu cap arc long nhau toa ra tu truc giua (CUNG <-> CAU sap noi).
   Gradient ngang blue(trai) -> cyan(giua) -> purple(phai), hai canh fade. */
const CX = 40;
const arcs = [
  { r: 12, h: 52, w: 1.5, o: 1 },
  { r: 21, h: 47, w: 1.15, o: 0.72 },
  { r: 30, h: 40, w: 0.9, o: 0.52 },
  { r: 39, h: 31, w: 0.75, o: 0.36 },
];

export function WaveBridge() {
  return (
    <svg className="supply-demand-bridge" viewBox="0 0 80 150" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="wb-grad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" style={{ stopColor: 'var(--color-accent-blue)' }} stopOpacity="0" />
          <stop offset="0.28" style={{ stopColor: 'var(--color-accent-blue)' }} />
          <stop offset="0.5" style={{ stopColor: 'var(--color-accent-cyan)' }} />
          <stop offset="0.72" style={{ stopColor: 'var(--color-accent-purple)' }} />
          <stop offset="1" style={{ stopColor: 'var(--color-accent-purple)' }} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1={CX} y1="26" x2={CX} y2="124" stroke="url(#wb-grad)" strokeWidth="0.75" opacity="0.4" />
      <g stroke="url(#wb-grad)" fill="none" strokeLinecap="round">
        {arcs.map((a, i) => (
          <g key={i} strokeWidth={a.w} opacity={a.o}>
            <path d={`M${CX} ${75 - a.h} Q${CX + a.r} 75 ${CX} ${75 + a.h}`} />
            <path d={`M${CX} ${75 - a.h} Q${CX - a.r} 75 ${CX} ${75 + a.h}`} />
          </g>
        ))}
      </g>
    </svg>
  );
}
