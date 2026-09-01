/* GlobeDark (TIP-PORTAL-V1 muc 7.3 + Globe Reset). Premium data globe deterministic (SVG).
   6 lop: base sphere volume, dense clustered dot-mass ("luc dia du lieu"), grid mo, luminous
   body + rim, red activity clusters (core + bloom), red paths co depth truoc/sau.
   Khong canvas, khong random sau reload. Reduced-motion: tinh. */
const CX = 200;
const CY = 200;
const R = 164;
const D2R = Math.PI / 180;

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface P { x: number; y: number; z: number }
const project = (lat: number, lon: number): P => {
  const cl = Math.cos(lat * D2R);
  const sl = Math.sin(lat * D2R);
  const so = Math.sin(lon * D2R);
  const co = Math.cos(lon * D2R);
  return { x: CX + R * cl * so, y: CY - R * sl, z: cl * co };
};

// cac cum ("luc dia du lieu") - phan bo khong deu, ban cau phai day hon
const clusters = [
  { lat: 12, lon: 44, s: 34 },
  { lat: -22, lon: 66, s: 26 },
  { lat: 34, lon: -24, s: 24 },
  { lat: -6, lon: 10, s: 30 },
];
const rng = mulberry32(11);
interface Dot { x: number; y: number; r: number; o: number; front: boolean }
const dots: Dot[] = [];
for (let i = 0; i < 1500; i++) {
  const lat = -88 + rng() * 176;
  const lon = -100 + rng() * 200;
  let dens = 0.05;
  for (const c of clusters) {
    const d = Math.hypot(lat - c.lat, lon - c.lon);
    dens += 0.85 * Math.exp(-(d * d) / (2 * c.s * c.s));
  }
  if (rng() < dens) {
    const p = project(lat, lon);
    const front = p.z > 0;
    const dv = Math.min(1, dens); // mat do -> continent bung sang
    dots.push({
      x: p.x,
      y: p.y,
      r: front ? 0.7 + p.z * 0.7 + dv * 0.7 : 0.7,
      o: front ? Math.min(0.95, 0.28 + p.z * 0.32 + dv * 0.42) : 0.08,
      front,
    });
  }
}
const frontDots = dots.filter((d) => d.front);
const backDots = dots.filter((d) => !d.front);

// grid mo: it kinh tuyen + vi tuyen, chi goi cau
const meridianRx = [R, R * 0.72, R * 0.4];
const parallels = [-108, -54, 0, 54, 108].map((off) => {
  const rx = Math.sqrt(Math.max(0, R * R - off * off));
  return { cy: CY + off, rx, ry: rx * 0.19 };
});

// red activity clusters (proven / evidence / engine) + hub
const redClusters = [project(22, 54), project(-6, 74), project(-32, 38), project(30, 16)];
const hub = project(6, 30);

// premium red paths: hub -> cluster, cong muot; front/back theo z trung binh
const paths = redClusters.map((n) => {
  const mx = (hub.x + n.x) / 2 + (n.y - hub.y) * 0.12;
  const my = (hub.y + n.y) / 2 - Math.abs(n.x - hub.x) * 0.16;
  return { d: `M${hub.x.toFixed(1)} ${hub.y.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${n.x.toFixed(1)} ${n.y.toFixed(1)}`, end: n, front: n.z > -0.1 };
});

// rim light: cung sang o canh phai-tren (lit side)
const rimA = { x: CX + R * Math.cos(-72 * D2R), y: CY + R * Math.sin(-72 * D2R) };
const rimB = { x: CX + R * Math.cos(46 * D2R), y: CY + R * Math.sin(46 * D2R) };

export function GlobeDark() {
  return (
    <svg className="lp-globe" viewBox="0 0 400 400" aria-hidden="true">
      <defs>
        <radialGradient id="lp-globe-body" cx="60%" cy="40%" r="62%">
          <stop offset="0" className="lp-globe__body-a" />
          <stop offset="0.6" className="lp-globe__body-b" />
          <stop offset="1" className="lp-globe__body-c" />
        </radialGradient>
        <radialGradient id="lp-globe-atmo" cx="58%" cy="42%" r="58%">
          <stop offset="0.62" className="lp-globe__atmo-a" />
          <stop offset="0.9" className="lp-globe__atmo-b" />
          <stop offset="1" className="lp-globe__atmo-c" />
        </radialGradient>
        <radialGradient id="lp-globe-lum" cx="62%" cy="38%" r="62%">
          <stop offset="0" className="lp-globe__lum-a" />
          <stop offset="0.68" className="lp-globe__lum-b" />
          <stop offset="1" className="lp-globe__lum-c" />
        </radialGradient>
        {redClusters.map((_, i) => (
          <radialGradient key={i} id={`lp-globe-bloom${i}`} cx="50%" cy="50%" r="50%">
            <stop offset="0" className="lp-globe__bloom-a" />
            <stop offset="1" className="lp-globe__bloom-b" />
          </radialGradient>
        ))}
      </defs>

      {/* Layer atmosphere (halo xanh bao khoi) */}
      <circle cx={CX} cy={CY} r={R + 26} fill="url(#lp-globe-atmo)" />
      {/* Layer 1: base sphere volume + luminous body */}
      <circle cx={CX} cy={CY} r={R} fill="url(#lp-globe-body)" />
      <circle className="lp-globe__lum" cx={CX} cy={CY} r={R} fill="url(#lp-globe-lum)" />

      {/* back depth: dot sau + path sau */}
      <g className="lp-globe__dots-back">
        {backDots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} opacity={d.o} />
        ))}
      </g>
      {paths.filter((p) => !p.front).map((p, i) => (
        <path key={i} className="lp-globe__rpath lp-globe__rpath--back" d={p.d} />
      ))}

      {/* Layer 2+3: dot-mass + grid quay cham (be mat cau xoay, activity anchored) */}
      <g className="lp-globe__spin">
        <g className="lp-globe__grid">
          {meridianRx.map((rx, i) => (
            <ellipse key={i} cx={CX} cy={CY} rx={rx} ry={R} />
          ))}
          <line x1={CX} y1={CY - R} x2={CX} y2={CY + R} />
          {parallels.map((p, i) => (
            <ellipse key={i} cx={CX} cy={p.cy} rx={p.rx} ry={p.ry} />
          ))}
        </g>
        <g className="lp-globe__dots">
          {frontDots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r} opacity={d.o} />
          ))}
        </g>
      </g>

      {/* Layer 4: rim light */}
      <path className="lp-globe__rim" d={`M${rimA.x.toFixed(1)} ${rimA.y.toFixed(1)} A ${R} ${R} 0 0 1 ${rimB.x.toFixed(1)} ${rimB.y.toFixed(1)}`} />

      {/* Layer 5: red activity clusters (bloom + core) */}
      {redClusters.map((n, i) => (
        <circle key={`b${i}`} cx={n.x} cy={n.y} r="22" fill={`url(#lp-globe-bloom${i})`} />
      ))}
      {/* Layer 6: premium red paths (front) + data flow chay + endpoints */}
      {paths.filter((p) => p.front).map((p, i) => (
        <path key={i} className="lp-globe__rpath" d={p.d} />
      ))}
      {paths.filter((p) => p.front).map((p, i) => (
        <circle
          key={`fl${i}`}
          className="lp-globe__flow"
          r="1.8"
          style={{ offsetPath: `path("${p.d}")`, animationDelay: `${i * 0.7}s` }}
        />
      ))}
      {redClusters.map((n, i) => (
        <g key={`c${i}`}>
          <circle className="lp-globe__rring" cx={n.x} cy={n.y} r="6" />
          <circle className="lp-globe__rcore" cx={n.x} cy={n.y} r="2.6" />
        </g>
      ))}
      <circle className="lp-globe__hub" cx={hub.x} cy={hub.y} r="2" />
    </svg>
  );
}
