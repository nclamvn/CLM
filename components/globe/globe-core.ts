/**
 * Dia cau dot-map (canvas 2D, khong thu vien). Port nguyen thuat toan tu
 * design/reference_landing_hub.html khoi "Matching Sphere" (SOT):
 * landmask ellipse + Nam Cuc, luoi lat 3.1 do, cols ~ cos(lat)*128, xoay truc Y,
 * parallax chuot, chieu sang huong, vien ria, bong tiep dat, vong doi match
 * (xam khi noi, do khi dat, node lon do, xung, dau ◆), toi da 4 cap.
 *
 * Tach hoan toan khoi React: khong dung state, ve thang tren canvas.
 * createGlobe tra ve controller co destroy() huy rAF va go listener khi unmount.
 */

type Vec3 = [number, number, number];

export type GlobeController = { destroy: () => void };
export type GlobeOptions = { reducedMotion?: boolean };

type GlobeWindow = Window & { __globeActive?: number };

export function createGlobe(canvas: HTMLCanvasElement, options: GlobeOptions = {}): GlobeController {
  const reduced = options.reducedMotion === true;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { destroy() {} };
  }

  let W = 0;
  let H = 0;
  let DPR = 1;
  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    const r = canvas.getBoundingClientRect();
    W = r.width;
    H = r.height;
    canvas.width = Math.max(1, W * DPR);
    canvas.height = Math.max(1, H * DPR);
    ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  // ChAm chi nam tren luc dia, dai duong la khoang trong.
  const nodes: { p: Vec3 }[] = [];
  const demIdx: number[] = [];
  const supIdx: number[] = [];
  // [lonTam, latTam, banKinh lon, banKinh lat] (do) xap xi cac luc dia
  const LAND: number[][] = [
    [-100, 45, 30, 20], [-116, 54, 16, 13], [-88, 30, 16, 12], [-142, 63, 15, 9], [-104, 23, 10, 9], // Bac My
    [-43, 72, 15, 11], // Greenland
    [-60, -12, 16, 15], [-67, -38, 8, 15], [-49, -6, 12, 9], // Nam My
    [13, 50, 20, 12], [27, 58, 15, 10], [3, 45, 9, 7], // Au
    [18, 7, 20, 18], [24, -18, 15, 17], [12, 26, 17, 11], [44, 7, 8, 9], // Phi
    [92, 48, 42, 22], [58, 55, 24, 16], [104, 32, 26, 17], [78, 22, 14, 13], [133, 60, 26, 13], [105, 14, 12, 10], // A
    [134, -24, 15, 10], [146, -37, 4, 4], // Uc
  ];
  function isLand(lon: number, lat: number): boolean {
    if (lat < -68) return true; // Nam Cuc
    for (let e = 0; e < LAND.length; e++) {
      const dx = (lon - LAND[e][0]) / LAND[e][2];
      const dy = (lat - LAND[e][1]) / LAND[e][3];
      if (dx * dx + dy * dy <= 1) return true;
    }
    return false;
  }
  let ni = 0;
  for (let lat = -88; lat <= 88; lat += 3.1) {
    const clat = Math.cos((lat * Math.PI) / 180);
    const cols = Math.max(1, Math.round(128 * clat));
    for (let c = 0; c < cols; c++) {
      const lon = -180 + (360 * (c + 0.5)) / cols;
      if (!isLand(lon, lat)) continue;
      const la = (lat * Math.PI) / 180;
      const lo = (lon * Math.PI) / 180;
      nodes.push({ p: [clat * Math.sin(lo), Math.sin(la), clat * Math.cos(lo)] });
      (ni++ % 2 ? supIdx : demIdx).push(nodes.length - 1);
    }
  }
  const N = nodes.length;
  function dotp(u: Vec3, v: Vec3): number {
    return u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
  }

  // Faint guide rings
  function ringPts(planeTilt: number, n: number): Vec3[] {
    const arr: Vec3[] = [];
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * 6.28318;
      arr.push([Math.cos(a), Math.sin(a) * Math.sin(planeTilt), Math.sin(a) * Math.cos(planeTilt)]);
    }
    return arr;
  }
  const rings = [ringPts(0, 96), ringPts(1.05, 96)];

  // Rotation helper (Y then X tilt)
  function rot3(p: Vec3, cy: number, sy: number, cx: number, sx: number): Vec3 {
    const x = p[0] * cy + p[2] * sy;
    const z = -p[0] * sy + p[2] * cy;
    const yy = p[1];
    return [x, yy * cx - z * sx, yy * sx + z * cx];
  }
  function pick(arr: number[]): number {
    return arr[(Math.random() * arr.length) | 0];
  }

  // Matches pool
  const matches: { a: number; b: number; born: number; dur: number }[] = [];
  let lastSpawn = -9999;
  function spawn(now: number) {
    const a = pick(demIdx);
    let b = pick(supIdx);
    let guard = 0;
    do {
      b = pick(supIdx);
      guard++;
    } while (dotp(nodes[a].p, nodes[b].p) > 0.25 && guard < 40);
    matches.push({ a, b, born: now, dur: 4800 });
  }

  // Interaction (parallax chuot)
  let tmx = 0;
  let tmy = 0;
  let mmx = 0;
  let mmy = 0;
  function onMouseMove(e: MouseEvent) {
    tmx = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
    tmy = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
  }

  function glow(x: number, y: number, pre: string, a: number, r: number) {
    const g = ctx!.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, pre + a.toFixed(3) + ')');
    g.addColorStop(1, pre + '0)');
    ctx!.fillStyle = g;
    ctx!.beginPath();
    ctx!.arc(x, y, r, 0, 6.2832);
    ctx!.fill();
  }

  // 3D shading + match colours
  const L: Vec3 = (() => {
    const v: Vec3 = [-0.5, 0.62, 0.6];
    const m = Math.hypot(v[0], v[1], v[2]);
    return [v[0] / m, v[1] / m, v[2] / m];
  })();
  const RED: Vec3 = [228, 52, 30];
  const GREY: Vec3 = [150, 150, 158];
  const INK: Vec3 = [20, 20, 22];
  function rgba(c: Vec3, a: number): string {
    return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + a.toFixed(3) + ')';
  }
  function mix(a: Vec3, b: Vec3, t: number): Vec3 {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  }
  function achievedNode(x: number, y: number, red: number, fade: number) {
    glow(x, y, 'rgba(228,52,30,', 0.5 * fade * red, 13);
    ctx!.save();
    ctx!.shadowBlur = 8 * red;
    ctx!.shadowColor = 'rgba(228,52,30,' + (0.7 * fade).toFixed(3) + ')';
    ctx!.beginPath();
    ctx!.arc(x, y, 2.4 + red * 1.9, 0, 6.2832);
    ctx!.fillStyle = rgba(mix(INK, RED, red), 0.95 * fade);
    ctx!.fill();
    ctx!.restore();
    if (red > 0.3) {
      ctx!.strokeStyle = 'rgba(228,52,30,' + (0.5 * fade * red).toFixed(3) + ')';
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      ctx!.arc(x, y, 5.2 + red * 2, 0, 6.2832);
      ctx!.stroke();
    }
  }

  let rotY = 0;
  let last = performance.now();
  const startT = last;

  function render(now: number, ie: number) {
    const c = ctx!;
    const ry = rotY + mmx * 0.42;
    const tilt = 0.4 + mmy * 0.2;
    const cy = Math.cos(ry);
    const sy = Math.sin(ry);
    const cx = Math.cos(tilt);
    const sx = Math.sin(tilt);
    const cX = W / 2;
    const cYc = H / 2;
    const R = Math.min(W, H) * 0.42 * (0.62 + 0.38 * ie);
    c.clearRect(0, 0, W, H);

    // Contact shadow, noi nhe tren mat phang
    c.save();
    c.translate(cX, cYc + R * 1.04);
    c.scale(1, 0.11);
    const sh = c.createRadialGradient(0, 0, 0, 0, 0, R * 0.9);
    sh.addColorStop(0, 'rgba(20,20,22,0.10)');
    sh.addColorStop(1, 'rgba(20,20,22,0)');
    c.fillStyle = sh;
    c.beginPath();
    c.arc(0, 0, R * 0.9, 0, 6.2832);
    c.fill();
    c.restore();

    // Vien dia cau, chi toi nhe o ria
    const body = c.createRadialGradient(cX, cYc, R * 0.72, cX, cYc, R);
    body.addColorStop(0, 'rgba(20,20,22,0)');
    body.addColorStop(0.86, 'rgba(20,20,22,0.010)');
    body.addColorStop(1, 'rgba(20,20,22,0.05)');
    c.fillStyle = body;
    c.beginPath();
    c.arc(cX, cYc, R, 0, 6.2832);
    c.fill();

    // Project nodes + per-node directional light
    const q: Vec3[] = new Array(N);
    const lit: number[] = new Array(N);
    for (let i = 0; i < N; i++) {
      const r = rot3(nodes[i].p, cy, sy, cx, sx);
      q[i] = r;
      lit[i] = Math.max(0, Math.min(1, (r[0] * L[0] + r[1] * L[1] + r[2] * L[2]) * 0.5 + 0.5));
    }

    // Guide rings (faint)
    c.lineWidth = 1;
    for (const ring of rings) {
      c.beginPath();
      for (let j = 0; j < ring.length; j++) {
        const r = rot3(ring[j], cy, sy, cx, sx);
        const X = cX + r[0] * R;
        const Y = cYc + r[1] * R;
        if (j === 0) c.moveTo(X, Y);
        else c.lineTo(X, Y);
      }
      c.strokeStyle = 'rgba(20,20,22,0.045)';
      c.stroke();
    }

    // Back hemisphere nodes (dim, shaded)
    for (let i = 0; i < N; i++) {
      if (q[i][2] >= 0) continue;
      const d = (q[i][2] + 1) / 2;
      const lm = 0.55 + 0.45 * lit[i];
      c.beginPath();
      c.arc(cX + q[i][0] * R, cYc + q[i][1] * R, 0.5 + d * 0.9, 0, 6.2832);
      c.fillStyle = 'rgba(20,20,22,' + ((0.04 + d * 0.08) * lm).toFixed(3) + ')';
      c.fill();
    }

    // Matches, grey while forming, RED when achieved (do = dat)
    const K = 30;
    for (let k = matches.length - 1; k >= 0; k--) {
      const m = matches[k];
      const age = (now - m.born) / m.dur;
      if (age >= 1) {
        matches.splice(k, 1);
        continue;
      }
      const A = nodes[m.a].p;
      const B = nodes[m.b].p;
      const draw = Math.min(1, age / 0.32);
      const fade = age > 0.78 ? 1 - (age - 0.78) / 0.22 : 1;
      const red = Math.max(0, Math.min(1, (age - 0.24) / 0.12));
      const col = mix(GREY, RED, red);
      const path: [number, number][] = [];
      for (let j = 0; j <= K; j++) {
        const tt = j / K;
        const pull = 0.7 + 0.3 * Math.abs(0.5 - tt) * 2;
        const r = rot3(
          [
            (A[0] + (B[0] - A[0]) * tt) * pull,
            (A[1] + (B[1] - A[1]) * tt) * pull,
            (A[2] + (B[2] - A[2]) * tt) * pull,
          ],
          cy,
          sy,
          cx,
          sx,
        );
        path.push([cX + r[0] * R, cYc + r[1] * R]);
      }
      const nDraw = Math.max(1, Math.floor(K * draw));
      c.save();
      if (red > 0.05) {
        c.shadowBlur = 7 * red;
        c.shadowColor = rgba(RED, 0.55 * fade);
      }
      c.beginPath();
      c.moveTo(path[0][0], path[0][1]);
      for (let j = 1; j <= nDraw; j++) c.lineTo(path[j][0], path[j][1]);
      c.strokeStyle = rgba(col, (0.5 + 0.4 * red) * fade);
      c.lineWidth = 1.2 + red * 0.9;
      c.stroke();
      c.restore();

      if (draw >= 1) {
        achievedNode(path[0][0], path[0][1], red, fade);
        achievedNode(path[K][0], path[K][1], red, fade);
        const pt = ((now - m.born) / 640) % 1;
        const pp = path[Math.floor(pt * K)];
        c.save();
        c.shadowBlur = 9;
        c.shadowColor = rgba(RED, 0.85);
        c.beginPath();
        c.arc(pp[0], pp[1], 2.2, 0, 6.2832);
        c.fillStyle = rgba(RED, 0.92 * fade);
        c.fill();
        c.restore();
        const bloom = Math.min(1, (age - 0.32) / 0.2);
        if (bloom > 0) {
          const mid = path[K >> 1];
          const s = 2 + bloom * 4;
          c.save();
          c.translate(mid[0], mid[1]);
          c.globalAlpha = fade * bloom;
          c.shadowBlur = 11;
          c.shadowColor = rgba(RED, 0.7);
          c.strokeStyle = rgba(RED, 0.9);
          c.lineWidth = 1.3;
          c.beginPath();
          c.arc(0, 0, s + 3, 0, 6.2832);
          c.stroke();
          c.fillStyle = rgba(RED, 0.95);
          c.beginPath();
          c.moveTo(0, -s);
          c.lineTo(s, 0);
          c.lineTo(0, s);
          c.lineTo(-s, 0);
          c.closePath();
          c.fill();
          c.restore();
        }
      } else {
        glow(path[0][0], path[0][1], 'rgba(140,140,148,', 0.4 * fade, 7);
      }
    }

    // Front hemisphere nodes (bright, shaded)
    for (let i = 0; i < N; i++) {
      if (q[i][2] < 0) continue;
      const d = (q[i][2] + 1) / 2;
      const lm = 0.55 + 0.45 * lit[i];
      c.beginPath();
      c.arc(cX + q[i][0] * R, cYc + q[i][1] * R, 0.7 + d * 1.6 + lit[i] * 0.3, 0, 6.2832);
      c.fillStyle = 'rgba(20,20,22,' + ((0.12 + d * 0.4) * lm).toFixed(3) + ')';
      c.fill();
    }
  }

  let rafId = 0;
  let alive = true;

  function loop(now: number) {
    if (!alive) return;
    const dt = Math.min(50, now - last);
    last = now;
    const intro = Math.min(1, (now - startT) / 1200);
    const ie = 1 - Math.pow(1 - intro, 3);
    mmx += (tmx - mmx) * 0.04;
    mmy += (tmy - mmy) * 0.04;
    rotY += dt * 0.00015;
    if (now - lastSpawn > 1500 && matches.length < 4 && intro > 0.55) {
      spawn(now);
      lastSpawn = now;
    }
    render(now, ie);
    rafId = requestAnimationFrame(loop);
  }

  function drawStatic() {
    // Reduced-motion: mot khung tinh, khong xoay, khong parallax, khong match.
    rotY = 0.6;
    mmx = 0;
    mmy = 0;
    render(performance.now(), 1);
  }

  resize();
  const ro = new ResizeObserver(() => {
    resize();
    if (reduced) drawStatic();
  });
  ro.observe(canvas);

  if (reduced) {
    drawStatic();
  } else {
    window.addEventListener('mousemove', onMouseMove);
    rafId = requestAnimationFrame(loop);
  }

  const w = window as GlobeWindow;
  w.__globeActive = (w.__globeActive || 0) + 1;

  function destroy() {
    alive = false;
    if (rafId) cancelAnimationFrame(rafId);
    ro.disconnect();
    window.removeEventListener('mousemove', onMouseMove);
    w.__globeActive = Math.max(0, (w.__globeActive || 1) - 1);
  }

  return { destroy };
}
