/**
 * "Me cung tim nhau": hai tin hieu (cau xam lanh, cung do) di Manhattan
 * qua luoi, toa nhanh tham do, gap nhau tai mot node roi loe thanh match.
 * Vong doi: alive flag, cancel rAF, ResizeObserver disconnect.
 * reducedMotion: ve mot khung tinh hai duong da gap nhau.
 */

type DkWindow = Window & { __dkActive?: number };

export type MeetHandle = { destroy: () => void };

type Pt = [number, number];
type Branch = { from: Pt; pts: Pt[]; at: number; who: number };
type Round = {
  pa: Pt[]; pb: Pt[]; mx: number; my: number; br: Branch[];
  t0: number; travel: number; hold: number; fade: number; code: string;
};

export function createMeet(canvas: HTMLCanvasElement, opts: { reducedMotion: boolean }): MeetHandle {
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

  const GAP = 44;
  let cols = 6;
  let rows = 6;
  let ox = 0;
  let oy = 0;
  let round: Round | null = null;
  let mCode = 42;

  const P = (g: Pt): Pt => [ox + g[0] * GAP, oy + g[1] * GAP];

  function genPath(sx: number, sy: number, mx: number, my: number): Pt[] {
    const path: Pt[] = [[sx, sy]];
    let x = sx;
    let y = sy;
    let guard = 0;
    while ((x !== mx || y !== my) && guard++ < 240) {
      const dx = Math.sign(mx - x);
      const dy = Math.sign(my - y);
      const fwd: Pt[] = [];
      if (dx) fwd.push([dx, 0]);
      if (dy) fwd.push([0, dy]);
      let mv = fwd[(Math.random() * fwd.length) | 0];
      if (Math.random() < 0.22) {
        const side: Pt = dx ? [0, Math.random() < 0.5 ? 1 : -1] : [Math.random() < 0.5 ? 1 : -1, 0];
        const nx = x + side[0];
        const ny = y + side[1];
        if (nx >= 0 && ny >= 0 && nx < cols && ny < rows) mv = side;
      }
      x += mv[0];
      y += mv[1];
      path.push([x, y]);
    }
    return path;
  }

  function newRound(now: number) {
    cols = Math.max(6, Math.round((W - 30) / GAP));
    rows = Math.max(6, Math.round((H - 40) / GAP));
    ox = (W - (cols - 1) * GAP) / 2;
    oy = (H - (rows - 1) * GAP) / 2;
    const mx = (cols >> 1) + (((Math.random() * 3) | 0) - 1);
    const my = (rows >> 1) + (((Math.random() * 3) | 0) - 1);
    const pa = genPath(0, (Math.random() * (rows >> 1)) | 0, mx, my);
    const pb = genPath(cols - 1, rows - 1 - ((Math.random() * (rows >> 1)) | 0), mx, my);
    const br: Branch[] = [];
    [pa, pb].forEach((p, pi) => {
      for (let i = 3; i < p.length - 2; i += 2) {
        if (Math.random() < 0.3) {
          const dir = ([[1, 0], [-1, 0], [0, 1], [0, -1]] as Pt[])[(Math.random() * 4) | 0];
          const a = p[i];
          const b1: Pt = [a[0] + dir[0], a[1] + dir[1]];
          const b2: Pt = [b1[0] + dir[0], b1[1] + dir[1]];
          if (b2[0] >= 0 && b2[1] >= 0 && b2[0] < cols && b2[1] < rows) {
            br.push({ from: a, pts: [b1, b2], at: i / (p.length - 1), who: pi });
          }
        }
      }
    });
    round = { pa, pb, mx, my, br, t0: now, travel: 4200, hold: 1700, fade: 600, code: 'MATCH-00' + mCode++ };
  }

  function drawPath(p: Pt[], frac: number, rgb: string, glowHead: boolean): Pt | null {
    if (frac <= 0) return null;
    const n = (p.length - 1) * Math.min(1, frac);
    const full = Math.floor(n);
    const part = n - full;
    function trace() {
      ctx!.beginPath();
      const s = P(p[0]);
      ctx!.moveTo(s[0], s[1]);
      for (let i = 1; i <= full; i++) {
        const q = P(p[i]);
        ctx!.lineTo(q[0], q[1]);
      }
      if (full < p.length - 1 && part > 0) {
        const a = P(p[full]);
        const b = P(p[full + 1]);
        ctx!.lineTo(a[0] + (b[0] - a[0]) * part, a[1] + (b[1] - a[1]) * part);
      }
    }
    ctx!.save();
    ctx!.lineCap = 'round';
    ctx!.lineJoin = 'round';
    ctx!.strokeStyle = 'rgba(' + rgb + ',.10)';
    ctx!.lineWidth = 6;
    trace();
    ctx!.stroke();
    ctx!.strokeStyle = 'rgba(' + rgb + ',.85)';
    ctx!.lineWidth = 1.7;
    if (glowHead) {
      ctx!.shadowBlur = 10;
      ctx!.shadowColor = 'rgba(' + rgb + ',.8)';
    }
    trace();
    ctx!.stroke();
    ctx!.restore();
    let hx: number;
    let hy: number;
    if (full >= p.length - 1) {
      const e = P(p[p.length - 1]);
      hx = e[0];
      hy = e[1];
    } else {
      const a = P(p[full]);
      const b = P(p[full + 1]);
      hx = a[0] + (b[0] - a[0]) * part;
      hy = a[1] + (b[1] - a[1]) * part;
    }
    return [hx, hy];
  }

  function frame(now: number) {
    if (!alive) return;
    if (!round) newRound(now);
    const r = round!;
    if (now - r.t0 > r.travel + r.hold + r.fade) newRound(now);
    const rr = round!;
    const tt = now - rr.t0;
    const prog = Math.min(1, tt / rr.travel);
    const ease = 1 - Math.pow(1 - prog, 2.2);
    const fadeK = tt > rr.travel + rr.hold ? (tt - rr.travel - rr.hold) / rr.fade : 0;
    ctx!.clearRect(0, 0, W, H);
    ctx!.globalAlpha = 1 - fadeK * fadeK;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = ox + i * GAP;
        const y = oy + j * GAP;
        ctx!.fillStyle = 'rgba(255,255,255,.07)';
        ctx!.fillRect(x - 0.7, y - 0.7, 1.4, 1.4);
        if ((i + j) % 4 === 0) {
          ctx!.strokeStyle = 'rgba(255,255,255,.05)';
          ctx!.lineWidth = 1;
          ctx!.beginPath();
          ctx!.moveTo(x - 3.4, y); ctx!.lineTo(x + 3.4, y);
          ctx!.moveTo(x, y - 3.4); ctx!.lineTo(x, y + 3.4);
          ctx!.stroke();
        }
      }
    }
    for (const b of rr.br) {
      const local = (ease - b.at) * 3;
      if (local <= 0) continue;
      const a = Math.max(0, Math.min(0.3, local * 0.5) - Math.max(0, local - 0.9) * 0.35);
      if (a <= 0) continue;
      const rgb = b.who ? '196,15,15' : '154,166,200';
      ctx!.strokeStyle = 'rgba(' + rgb + ',' + a.toFixed(3) + ')';
      ctx!.lineWidth = 1.2;
      ctx!.beginPath();
      const s = P(b.from);
      ctx!.moveTo(s[0], s[1]);
      for (const q of b.pts) {
        const v = P(q);
        ctx!.lineTo(v[0], v[1]);
      }
      ctx!.stroke();
    }
    const ha = drawPath(rr.pa, ease, '154,166,200', prog < 1);
    const hb = drawPath(rr.pb, ease, '196,15,15', prog < 1);
    for (const [p0, rgb] of [[rr.pa[0], '154,166,200'], [rr.pb[0], '196,15,15']] as [Pt, string][]) {
      const v = P(p0);
      ctx!.beginPath();
      ctx!.arc(v[0], v[1], 3, 0, 6.2832);
      ctx!.strokeStyle = 'rgba(' + rgb + ',.7)';
      ctx!.lineWidth = 1.2;
      ctx!.stroke();
    }
    if (prog < 1) {
      for (const [h, rgb] of [[ha, '154,166,200'], [hb, '196,15,15']] as [Pt | null, string][]) {
        if (!h) continue;
        ctx!.save();
        ctx!.shadowBlur = 12;
        ctx!.shadowColor = 'rgba(' + rgb + ',.9)';
        ctx!.beginPath();
        ctx!.arc(h[0], h[1], 3, 0, 6.2832);
        ctx!.fillStyle = 'rgba(' + rgb + ',1)';
        ctx!.fill();
        ctx!.restore();
      }
    }
    if (prog >= 1) {
      const mt = tt - rr.travel;
      const m = P([rr.mx, rr.my]);
      for (let k = 0; k < 3; k++) {
        const rad = 6 + ((mt * 0.05 + k * 14) % 42);
        ctx!.beginPath();
        ctx!.arc(m[0], m[1], rad, 0, 6.2832);
        ctx!.strokeStyle = 'rgba(196,15,15,' + Math.max(0, 0.5 - rad / 90).toFixed(3) + ')';
        ctx!.lineWidth = 1.4;
        ctx!.stroke();
      }
      ctx!.save();
      ctx!.shadowBlur = 18;
      ctx!.shadowColor = 'rgba(196,15,15,.95)';
      ctx!.translate(m[0], m[1]);
      ctx!.rotate(0.7854);
      ctx!.fillStyle = '#E8221A';
      ctx!.fillRect(-4.6, -4.6, 9.2, 9.2);
      ctx!.restore();
      ctx!.font = '10px IBM Plex Mono, ui-monospace, monospace';
      ctx!.textAlign = 'center';
      ctx!.fillStyle = 'rgba(232,34,26,' + Math.min(1, mt / 300).toFixed(2) + ')';
      ctx!.fillText(rr.code + ' · 0.9' + (mCode % 2 ? '1' : '3'), m[0], m[1] - 18);
      ctx!.fillStyle = 'rgba(154,154,166,' + Math.min(0.8, mt / 400).toFixed(2) + ')';
      ctx!.fillText('đúng bên · đúng điểm', m[0], m[1] + 26);
    }
    ctx!.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  }

  function drawStaticFrame() {
    if (!round) newRound(performance.now());
    round!.t0 = performance.now() - round!.travel - 1;
    const keep = alive;
    alive = true;
    const prevRaf = raf;
    // frame() se dang ky rAF; huy ngay sau khi ve xong mot khung
    frame(performance.now());
    cancelAnimationFrame(raf);
    raf = prevRaf;
    alive = keep;
  }

  const ro = new ResizeObserver(() => {
    if (!alive) return;
    resize();
    newRound(performance.now());
    if (opts.reducedMotion) drawStaticFrame();
  });
  ro.observe(canvas);
  resize();
  newRound(performance.now());

  if (opts.reducedMotion) {
    drawStaticFrame();
  } else {
    raf = requestAnimationFrame(frame);
  }

  return {
    destroy() {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      w.__dkActive = Math.max(0, (w.__dkActive || 1) - 1);
    },
  };
}
