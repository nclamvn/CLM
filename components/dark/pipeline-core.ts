/**
 * Pipeline 7 cong scanner: hat chay theo lan co vet duoi, cong can flash do
 * va hat roi khoi bang, bo dem IN/DAT/CAN cap nhat DOM truc tiep.
 * Vong doi: alive flag, cancel rAF, ResizeObserver disconnect.
 * reducedMotion: ve mot khung tinh, khong chay vong lap.
 */
import { pipelineGates, pipelineBite, pipelinePassBase, pipelineCounters } from '@/lib/dark-data';

type DkWindow = Window & { __dkActive?: number };

export type PipelineHandle = { destroy: () => void };

type CounterEls = { inEl: HTMLElement | null; okEl: HTMLElement | null; blkEl: HTMLElement | null };

type Part = {
  x: number; gi: number; lane: number; ph: number; sp: number; rj: number;
  st: number; dead: number; vx: number; vy: number; rx: number; ry: number;
  trail: [number, number][];
};

export function createPipeline(
  canvas: HTMLCanvasElement,
  els: CounterEls,
  opts: { reducedMotion: boolean },
): PipelineHandle {
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

  const gates = pipelineGates;
  const NG = gates.length;
  const PROV = 2;
  const bite = pipelineBite;
  const passCnt = pipelinePassBase.slice();
  const fmt = (n: number) => n.toLocaleString('vi-VN');
  let inC = pipelineCounters.in;
  let okC = pipelineCounters.ok;
  let blkC = pipelineCounters.blocked;

  const parts: Part[] = [];
  const flashes: { g: number; age: number }[] = [];
  const bursts: { x: number; y: number; age: number }[] = [];

  function geom() {
    const x0 = 64;
    const x1 = W - 64;
    const seg = (x1 - x0) / (NG - 1);
    const bandY = H * 0.46;
    const bandH = Math.min(120, H * 0.42);
    return { x0, x1, seg, bandY, bandH, top: bandY - bandH / 2, bot: bandY + bandH / 2 };
  }

  function spawn(seed: boolean) {
    let rj = -1;
    for (let i = 0; i < NG; i++) {
      if (Math.random() < bite[i]) { rj = i; break; }
    }
    const x = seed ? Math.random() * (NG - 1) : -0.12;
    parts.push({
      x, gi: Math.max(0, Math.ceil(x)), lane: Math.random() * 2 - 1, ph: Math.random() * 6.28,
      sp: 0.3 + Math.random() * 0.3, rj, st: 0, dead: 0, vx: 0, vy: 0, rx: 0, ry: 0, trail: [],
    });
    if (!seed) { inC++; if (els.inEl) els.inEl.textContent = fmt(inC); }
  }
  for (let i = 0; i < 26; i++) spawn(true);

  function rr(x: number, y: number, wd: number, h: number, r: number) {
    ctx!.beginPath();
    ctx!.moveTo(x + r, y);
    ctx!.arcTo(x + wd, y, x + wd, y + h, r);
    ctx!.arcTo(x + wd, y + h, x, y + h, r);
    ctx!.arcTo(x, y + h, x, y, r);
    ctx!.arcTo(x, y, x + wd, y, r);
    ctx!.closePath();
  }
  function diamond(x: number, y: number, s: number) {
    ctx!.beginPath();
    ctx!.moveTo(x, y - s);
    ctx!.lineTo(x + s, y);
    ctx!.lineTo(x, y + s);
    ctx!.lineTo(x - s, y);
    ctx!.closePath();
  }

  type Geom = ReturnType<typeof geom>;

  function drawScene(now: number, animate: boolean): Geom {
    const g = geom();
    ctx!.clearRect(0, 0, W, H);
    const bg = ctx!.createLinearGradient(0, g.top, 0, g.bot);
    bg.addColorStop(0, 'rgba(255,255,255,0)');
    bg.addColorStop(0.5, 'rgba(255,255,255,0.022)');
    bg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx!.fillStyle = bg;
    ctx!.fillRect(g.x0 - 30, g.top, g.x1 - g.x0 + 60, g.bandH);
    ctx!.setLineDash([3, 5]);
    ctx!.lineWidth = 1;
    ctx!.strokeStyle = 'rgba(255,255,255,.07)';
    ctx!.beginPath(); ctx!.moveTo(g.x0 - 30, g.top); ctx!.lineTo(g.x1 + 30, g.top); ctx!.stroke();
    ctx!.beginPath(); ctx!.moveTo(g.x0 - 30, g.bot); ctx!.lineTo(g.x1 + 30, g.bot); ctx!.stroke();
    ctx!.strokeStyle = 'rgba(255,255,255,.035)';
    for (const l of [-0.6, 0, 0.6]) {
      const y = g.bandY + (l * g.bandH) / 2;
      ctx!.beginPath(); ctx!.moveTo(g.x0 - 30, y); ctx!.lineTo(g.x1 + 30, y); ctx!.stroke();
    }
    ctx!.setLineDash([]);
    if (animate) {
      const sx = g.x0 + ((now / 6800) % 1) * (g.x1 - g.x0);
      const sw = ctx!.createLinearGradient(sx - 90, 0, sx + 90, 0);
      sw.addColorStop(0, 'rgba(255,255,255,0)');
      sw.addColorStop(0.5, 'rgba(255,255,255,0.028)');
      sw.addColorStop(1, 'rgba(255,255,255,0)');
      ctx!.fillStyle = sw;
      ctx!.fillRect(sx - 90, g.top, 180, g.bandH);
    }
    ctx!.font = '10px IBM Plex Mono, ui-monospace, monospace';
    ctx!.textAlign = 'center';
    for (let i = 0; i < NG; i++) {
      const gx = g.x0 + g.seg * i;
      const fl = flashes.find((f) => f.g === i);
      const hot = fl ? Math.max(0, 1 - fl.age / 650) : 0;
      const cg = ctx!.createLinearGradient(0, g.top - 14, 0, g.bot + 14);
      const base = hot > 0 ? '196,15,15' : '255,255,255';
      cg.addColorStop(0, 'rgba(' + base + ',0)');
      cg.addColorStop(0.5, 'rgba(' + base + ',' + (0.1 + hot * 0.35) + ')');
      cg.addColorStop(1, 'rgba(' + base + ',0)');
      ctx!.strokeStyle = cg;
      ctx!.lineWidth = 1;
      ctx!.beginPath(); ctx!.moveTo(gx, g.top - 14); ctx!.lineTo(gx, g.bot + 14); ctx!.stroke();
      rr(gx - 10, g.top - 8, 20, g.bandH + 16, 10);
      ctx!.strokeStyle = hot > 0 ? 'rgba(196,15,15,' + (0.18 + hot * 0.5) + ')' : 'rgba(255,255,255,.09)';
      ctx!.lineWidth = 1;
      ctx!.stroke();
      if (hot > 0) { ctx!.save(); ctx!.shadowBlur = 14 * hot; ctx!.shadowColor = 'rgba(196,15,15,.9)'; }
      diamond(gx, g.bandY, 6);
      ctx!.fillStyle = '#0D0D10';
      ctx!.fill();
      ctx!.strokeStyle = hot > 0 ? 'rgba(232,34,26,' + (0.5 + hot * 0.5) + ')' : 'rgba(255,255,255,.4)';
      ctx!.lineWidth = 1.4;
      ctx!.stroke();
      if (hot > 0) ctx!.restore();
      if (fl) {
        ctx!.beginPath();
        ctx!.arc(gx, g.bandY, 7 + fl.age * 0.045, 0, 6.2832);
        ctx!.strokeStyle = 'rgba(196,15,15,' + Math.max(0, 0.65 - fl.age / 650) + ')';
        ctx!.lineWidth = 1.6;
        ctx!.stroke();
      }
      ctx!.fillStyle = hot > 0 ? '#E8221A' : '#9A9AA6';
      ctx!.fillText(gates[i], gx, g.top - 26);
      ctx!.fillStyle = '#4a4a54';
      ctx!.fillText('0' + (i + 1), gx, g.bot + 28);
      ctx!.fillStyle = 'rgba(255,255,255,.28)';
      ctx!.font = '9px IBM Plex Mono, ui-monospace, monospace';
      ctx!.fillText(fmt(passCnt[i]), gx, g.bot + 44);
      ctx!.font = '10px IBM Plex Mono, ui-monospace, monospace';
    }
    return g;
  }

  function partPos(p: Part, g: Geom): [number, number] {
    const wob = Math.sin(p.x * 2.1 + p.ph) * 4;
    return [g.x0 + g.seg * p.x, g.bandY + p.lane * (g.bandH / 2 - 10) + wob];
  }

  let last = performance.now();
  let acc = 0;
  function loop(now: number) {
    if (!alive) return;
    const dt = Math.min(50, now - last);
    last = now;
    acc += dt;
    if (acc > 230 && parts.length < 64) { acc = 0; spawn(false); }
    for (let i = flashes.length - 1; i >= 0; i--) { flashes[i].age += dt; if (flashes[i].age > 650) flashes.splice(i, 1); }
    for (let i = bursts.length - 1; i >= 0; i--) { bursts[i].age += dt; if (bursts[i].age > 520) bursts.splice(i, 1); }
    const g = drawScene(now, true);
    for (const b of bursts) {
      ctx!.beginPath();
      ctx!.arc(b.x, b.y, 3 + b.age * 0.03, 0, 6.2832);
      ctx!.strokeStyle = 'rgba(63,178,127,' + Math.max(0, 0.6 - b.age / 520) + ')';
      ctx!.lineWidth = 1.4;
      ctx!.stroke();
    }
    for (let k = parts.length - 1; k >= 0; k--) {
      const p = parts[k];
      if (p.st === 1) {
        p.dead += dt;
        p.vy += dt * 0.0016;
        p.rx += p.vx * dt;
        p.ry += p.vy * dt;
        const a = Math.max(0, 0.95 - p.dead / 800);
        ctx!.save();
        ctx!.shadowBlur = 8;
        ctx!.shadowColor = 'rgba(196,15,15,' + a + ')';
        ctx!.beginPath();
        ctx!.arc(p.rx, p.ry, 2.6, 0, 6.2832);
        ctx!.fillStyle = 'rgba(196,15,15,' + a + ')';
        ctx!.fill();
        ctx!.restore();
        if (p.dead > 800) parts.splice(k, 1);
        continue;
      }
      p.x += p.sp * dt * 0.004;
      while (p.gi < NG && p.x >= p.gi) {
        const pos = partPos(p, g);
        if (p.rj === p.gi) {
          p.st = 1;
          p.rx = g.x0 + g.seg * p.gi;
          p.ry = pos[1];
          p.vx = 0.02 + Math.random() * 0.02;
          p.vy = 0.02;
          flashes.push({ g: p.gi, age: 0 });
          blkC++;
          if (els.blkEl) els.blkEl.textContent = fmt(blkC);
          break;
        }
        passCnt[p.gi]++;
        p.gi++;
      }
      if (p.st === 1) continue;
      if (p.x > NG - 1 + 0.12) {
        const pos = partPos(p, g);
        bursts.push({ x: pos[0], y: pos[1], age: 0 });
        okC++;
        if (els.okEl) els.okEl.textContent = fmt(okC);
        parts.splice(k, 1);
        continue;
      }
      const [px, py] = partPos(p, g);
      p.trail.push([px, py]);
      if (p.trail.length > 7) p.trail.shift();
      const green = p.gi > PROV;
      const rgb = green ? '63,178,127' : '170,172,186';
      for (let t = 1; t < p.trail.length; t++) {
        const a = (t / p.trail.length) * 0.22;
        ctx!.strokeStyle = 'rgba(' + rgb + ',' + a.toFixed(3) + ')';
        ctx!.lineWidth = 1.2;
        ctx!.beginPath();
        ctx!.moveTo(p.trail[t - 1][0], p.trail[t - 1][1]);
        ctx!.lineTo(p.trail[t][0], p.trail[t][1]);
        ctx!.stroke();
      }
      ctx!.save();
      if (green) { ctx!.shadowBlur = 6; ctx!.shadowColor = 'rgba(63,178,127,.7)'; }
      ctx!.beginPath();
      ctx!.arc(px, py, green ? 2.4 : 2.1, 0, 6.2832);
      ctx!.fillStyle = 'rgba(' + rgb + ',.95)';
      ctx!.fill();
      ctx!.restore();
    }
    raf = requestAnimationFrame(loop);
  }

  function drawStaticFrame() {
    const g = drawScene(performance.now(), false);
    for (const p of parts) {
      const [px, py] = partPos(p, g);
      const green = p.gi > PROV;
      ctx!.beginPath();
      ctx!.arc(px, py, 2.2, 0, 6.2832);
      ctx!.fillStyle = green ? 'rgba(63,178,127,.9)' : 'rgba(170,172,186,.9)';
      ctx!.fill();
    }
  }

  const ro = new ResizeObserver(() => {
    if (!alive) return;
    resize();
    if (opts.reducedMotion) drawStaticFrame();
  });
  ro.observe(canvas);
  resize();

  if (opts.reducedMotion) {
    drawStaticFrame();
  } else {
    raf = requestAnimationFrame(loop);
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
