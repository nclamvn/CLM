/**
 * Qua cau dot-map ban TOI (port tu demo control-room, do dam #C40F0F).
 * Ky luat vong doi nhu globe-core ban light: co alive flag, huy rAF,
 * go listener, ResizeObserver disconnect. reducedMotion: ve mot khung tinh,
 * khong xoay, khong parallax, khong match dong.
 * Bo dem window.__dkActive de kiem chung mount/unmount can bang.
 */

type DkWindow = Window & { __dkActive?: number };

export type GlobeDarkHandle = { destroy: () => void };

const LAND: [number, number, number, number][] = [
  [-100, 45, 30, 20], [-116, 54, 16, 13], [-88, 30, 16, 12], [-142, 63, 15, 9],
  [-104, 23, 10, 9], [-43, 72, 15, 11], [-60, -12, 16, 15], [-67, -38, 8, 15],
  [-49, -6, 12, 9], [13, 50, 20, 12], [27, 58, 15, 10], [3, 45, 9, 7],
  [18, 7, 20, 18], [24, -18, 15, 17], [12, 26, 17, 11], [44, 7, 8, 9],
  [92, 48, 42, 22], [58, 55, 24, 16], [104, 32, 26, 17], [78, 22, 14, 13],
  [133, 60, 26, 13], [105, 14, 12, 10], [134, -24, 15, 10], [146, -37, 4, 4],
];

function land(lon: number, lat: number): boolean {
  if (lat < -68) return true;
  for (const e of LAND) {
    const dx = (lon - e[0]) / e[2];
    const dy = (lat - e[1]) / e[3];
    if (dx * dx + dy * dy <= 1) return true;
  }
  return false;
}

export function createGlobeDark(
  canvas: HTMLCanvasElement,
  opts: { reducedMotion: boolean },
): GlobeDarkHandle {
  const ctx = canvas.getContext('2d');
  const w = window as DkWindow;
  w.__dkActive = (w.__dkActive || 0) + 1;
  if (!ctx) {
    return { destroy: () => { w.__dkActive = Math.max(0, (w.__dkActive || 1) - 1); } };
  }

  let alive = true;
  let raf = 0;
  let W = 0;
  let H = 0;

  function resize() {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const r = canvas.getBoundingClientRect();
    W = r.width;
    H = r.height;
    canvas.width = Math.max(1, W * dpr);
    canvas.height = Math.max(1, H * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  const nodes: [number, number, number][] = [];
  const dem: number[] = [];
  const sup: number[] = [];
  let ni = 0;
  for (let lat = -88; lat <= 88; lat += 3.3) {
    const cl = Math.cos((lat * Math.PI) / 180);
    const cols = Math.max(1, Math.round(120 * cl));
    for (let c = 0; c < cols; c++) {
      const lon = -180 + (360 * (c + 0.5)) / cols;
      if (!land(lon, lat)) continue;
      const la = (lat * Math.PI) / 180;
      const lo = (lon * Math.PI) / 180;
      nodes.push([cl * Math.sin(lo), Math.sin(la), cl * Math.cos(lo)]);
      (ni++ % 2 ? sup : dem).push(nodes.length - 1);
    }
  }
  const N = nodes.length;

  const dp = (u: number[], v: number[]) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
  function rot(p: number[], cy: number, sy: number, cx: number, sx: number): [number, number, number] {
    const x = p[0] * cy + p[2] * sy;
    const z = -p[0] * sy + p[2] * cy;
    const yy = p[1];
    return [x, yy * cx - z * sx, yy * sx + z * cx];
  }

  const rings: [number, number, number][][] = [];
  for (const t of [0, 1.05]) {
    const a: [number, number, number][] = [];
    for (let i = 0; i <= 90; i++) {
      const g = (i / 90) * 6.2832;
      a.push([Math.cos(g), Math.sin(g) * Math.sin(t), Math.sin(g) * Math.cos(t)]);
    }
    rings.push(a);
  }

  type M = { a: number; b: number; born: number; dur: number };
  const matches: M[] = [];
  let ls = -9999;
  function spawn(now: number) {
    const a = dem[(Math.random() * dem.length) | 0];
    let b = sup[0];
    let gd = 0;
    do {
      b = sup[(Math.random() * sup.length) | 0];
      gd++;
    } while (dp(nodes[a], nodes[b]) > 0.25 && gd < 40);
    matches.push({ a, b, born: now, dur: 4600 });
  }

  let tmx = 0;
  let tmy = 0;
  let mx = 0;
  let my = 0;
  const onMove = (e: MouseEvent) => {
    tmx = (e.clientX / window.innerWidth - 0.5) * 2;
    tmy = (e.clientY / window.innerHeight - 0.5) * 2;
  };

  const L = (() => {
    const v = [-0.5, 0.6, 0.62];
    const m = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / m, v[1] / m, v[2] / m];
  })();

  function glow(x: number, y: number, pre: string, a: number, r: number) {
    const g = ctx!.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, pre + a.toFixed(3) + ')');
    g.addColorStop(1, pre + '0)');
    ctx!.fillStyle = g;
    ctx!.beginPath();
    ctx!.arc(x, y, r, 0, 6.2832);
    ctx!.fill();
  }

  let rotY = 0;
  let last = performance.now();
  const start = last;

  function drawBase(cy: number, sy: number, cx: number, sx: number, R: number, cX: number, cYc: number) {
    const cg = ctx!.createRadialGradient(cX, cYc, 0, cX, cYc, R * 1.2);
    cg.addColorStop(0, 'rgba(196,15,15,0.05)');
    cg.addColorStop(0.6, 'rgba(120,130,200,0.03)');
    cg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx!.fillStyle = cg;
    ctx!.beginPath();
    ctx!.arc(cX, cYc, R * 1.2, 0, 6.2832);
    ctx!.fill();
    const q: [number, number, number][] = new Array(N);
    const lit: number[] = new Array(N);
    for (let i = 0; i < N; i++) {
      const r = rot(nodes[i], cy, sy, cx, sx);
      q[i] = r;
      lit[i] = Math.max(0, Math.min(1, (r[0] * L[0] + r[1] * L[1] + r[2] * L[2]) * 0.5 + 0.5));
    }
    ctx!.lineWidth = 1;
    for (const ring of rings) {
      ctx!.beginPath();
      for (let j = 0; j < ring.length; j++) {
        const r = rot(ring[j], cy, sy, cx, sx);
        const X = cX + r[0] * R;
        const Y = cYc + r[1] * R;
        if (j === 0) ctx!.moveTo(X, Y);
        else ctx!.lineTo(X, Y);
      }
      ctx!.strokeStyle = 'rgba(255,255,255,0.05)';
      ctx!.stroke();
    }
    for (let i = 0; i < N; i++) {
      if (q[i][2] >= 0) continue;
      const d = (q[i][2] + 1) / 2;
      const lm = 0.5 + 0.5 * lit[i];
      ctx!.beginPath();
      ctx!.arc(cX + q[i][0] * R, cYc + q[i][1] * R, 0.5 + d * 0.9, 0, 6.2832);
      ctx!.fillStyle = 'rgba(200,205,220,' + ((0.06 + d * 0.1) * lm).toFixed(3) + ')';
      ctx!.fill();
    }
    return q;
  }

  function drawFront(q: [number, number, number][], R: number, cX: number, cYc: number) {
    for (let i = 0; i < N; i++) {
      if (q[i][2] < 0) continue;
      const d = (q[i][2] + 1) / 2;
      ctx!.beginPath();
      ctx!.arc(cX + q[i][0] * R, cYc + q[i][1] * R, 0.7 + d * 1.6, 0, 6.2832);
      ctx!.fillStyle = 'rgba(226,230,240,' + (0.16 + d * 0.5).toFixed(3) + ')';
      ctx!.fill();
    }
  }

  function drawStatic() {
    resize();
    ctx!.clearRect(0, 0, W, H);
    const ry = 0.6;
    const tl = 0.4;
    const cy = Math.cos(ry);
    const sy = Math.sin(ry);
    const cx = Math.cos(tl);
    const sx = Math.sin(tl);
    const cX = W / 2;
    const cYc = H / 2;
    const R = Math.min(W, H) * 0.42;
    const q = drawBase(cy, sy, cx, sx, R, cX, cYc);
    drawFront(q, R, cX, cYc);
  }

  function frame(now: number) {
    if (!alive) return;
    const dt = Math.min(50, now - last);
    last = now;
    const intro = Math.min(1, (now - start) / 1200);
    const ie = 1 - Math.pow(1 - intro, 3);
    mx += (tmx - mx) * 0.04;
    my += (tmy - my) * 0.04;
    rotY += dt * 0.00015;
    const ry = rotY + mx * 0.42;
    const tl = 0.4 + my * 0.2;
    const cy = Math.cos(ry);
    const sy = Math.sin(ry);
    const cx = Math.cos(tl);
    const sx = Math.sin(tl);
    const cX = W / 2;
    const cYc = H / 2;
    const R = Math.min(W, H) * 0.42 * (0.62 + 0.38 * ie);
    ctx!.clearRect(0, 0, W, H);
    const q = drawBase(cy, sy, cx, sx, R, cX, cYc);

    if (now - ls > 1500 && matches.length < 4 && intro > 0.55) {
      spawn(now);
      ls = now;
    }
    const K = 30;
    for (let k = matches.length - 1; k >= 0; k--) {
      const m = matches[k];
      const age = (now - m.born) / m.dur;
      if (age >= 1) {
        matches.splice(k, 1);
        continue;
      }
      const A = nodes[m.a];
      const B = nodes[m.b];
      const draw = Math.min(1, age / 0.32);
      const fade = age > 0.78 ? 1 - (age - 0.78) / 0.22 : 1;
      const red = Math.max(0, Math.min(1, (age - 0.24) / 0.12));
      const path: [number, number][] = [];
      for (let j = 0; j <= K; j++) {
        const tt = j / K;
        const pull = 0.7 + 0.3 * Math.abs(0.5 - tt) * 2;
        const r = rot(
          [(A[0] + (B[0] - A[0]) * tt) * pull, (A[1] + (B[1] - A[1]) * tt) * pull, (A[2] + (B[2] - A[2]) * tt) * pull],
          cy, sy, cx, sx,
        );
        path.push([cX + r[0] * R, cYc + r[1] * R]);
      }
      const nd = Math.max(1, Math.floor(K * draw));
      ctx!.save();
      ctx!.shadowBlur = 8 * Math.max(0.3, red);
      ctx!.shadowColor = 'rgba(196,15,15,' + (0.6 * fade).toFixed(3) + ')';
      ctx!.beginPath();
      ctx!.moveTo(path[0][0], path[0][1]);
      for (let j = 1; j <= nd; j++) ctx!.lineTo(path[j][0], path[j][1]);
      const col = red > 0.5 ? '196,15,15' : '150,160,190';
      ctx!.strokeStyle = 'rgba(' + col + ',' + ((0.5 + 0.4 * red) * fade).toFixed(3) + ')';
      ctx!.lineWidth = 1.2 + red * 0.9;
      ctx!.stroke();
      ctx!.restore();
      if (draw >= 1) {
        for (const pp of [path[0], path[K]]) {
          glow(pp[0], pp[1], 'rgba(196,15,15,', 0.5 * fade * red, 12);
          ctx!.save();
          ctx!.shadowBlur = 8 * red;
          ctx!.shadowColor = 'rgba(196,15,15,' + (0.7 * fade).toFixed(3) + ')';
          ctx!.beginPath();
          ctx!.arc(pp[0], pp[1], 2.4 + red * 1.8, 0, 6.2832);
          ctx!.fillStyle = 'rgba(232,34,26,' + (0.95 * fade).toFixed(3) + ')';
          ctx!.fill();
          ctx!.restore();
        }
        const pt = ((now - m.born) / 620) % 1;
        const pp = path[Math.floor(pt * K)];
        ctx!.save();
        ctx!.shadowBlur = 9;
        ctx!.shadowColor = 'rgba(196,15,15,.85)';
        ctx!.beginPath();
        ctx!.arc(pp[0], pp[1], 2.2, 0, 6.2832);
        ctx!.fillStyle = 'rgba(232,34,26,' + (0.92 * fade).toFixed(3) + ')';
        ctx!.fill();
        ctx!.restore();
      } else {
        glow(path[0][0], path[0][1], 'rgba(150,160,190,', 0.4 * fade, 7);
      }
    }
    drawFront(q, R, cX, cYc);
    raf = requestAnimationFrame(frame);
  }

  const ro = new ResizeObserver(() => {
    if (!alive) return;
    resize();
    if (opts.reducedMotion) drawStatic();
  });
  ro.observe(canvas);
  resize();

  if (opts.reducedMotion) {
    drawStatic();
  } else {
    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(frame);
  }

  return {
    destroy() {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('mousemove', onMove);
      w.__dkActive = Math.max(0, (w.__dkActive || 1) - 1);
    },
  };
}
