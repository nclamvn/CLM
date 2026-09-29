'use client';

/**
 * HubCungCau · Hinh dong chu dao cua trang dau: mot "hub" cung cau ve tu du lieu that.
 *
 * Bo cuc (tat dinh, tinh lai khi doi kich thuoc):
 *   - 10 nhom cong nghe QD 21/2026 xep tren vong trong quanh loi.
 *   - 44 don vi cung tren nua vong trai, 30 nhu cau quoc gia tren nua vong phai; ca hai xep theo
 *     nhom nen moi cum nam gan nhau.
 *   - Canh mo: don vi -> nhom (thuoc_nhom co cau nguon), nhu cau -> nhom (QD 21).
 *   - Hat chay theo 47 cap cung cau co nguon: tu don vi, qua nhom, toi nhu cau; mau doi tu xanh
 *     (cung) sang cam (cau). Cap da ky thi hat mau do son (match).
 *   - Moi 3,6 giay soi mot trong 11 match da ky: duong sang, hai dau no vong, the bang chung ben
 *     duoi doi theo (the la DOM de chu sac net va doc duoc).
 *   - 11 nhu cau chua co cung: hinh thoi rong, nhip cham.
 * Mau doc tu token CSS (--data-*), khong go hex trong component.
 * prefers-reduced-motion: ve MOT khung tinh, soi match dau tien, khong hat, khong xoay.
 * Don dep: huy rAF, ResizeObserver va listener khi thao component.
 */
import { useEffect, useRef, useState } from 'react';
import type { MatTien } from '@/lib/mat-tien';

type P = { x: number; y: number };
type Hat = { luong: number; t: number; v: number };
const CHU_KY = 3600;

const docMau = (ten: string, du: string) => {
  if (typeof window === 'undefined') return du;
  const v = getComputedStyle(document.documentElement).getPropertyValue(ten).trim();
  return v || du;
};
const rgb = (hex: string) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const rgba = (hex: string, a: number) => { const [r, g, b] = rgb(hex); return `rgba(${r}, ${g}, ${b}, ${a})`; };
const tron = (a: string, b: string, t: number) => {
  const A = rgb(a); const B = rgb(b);
  return `rgb(${Math.round(A[0] + (B[0] - A[0]) * t)}, ${Math.round(A[1] + (B[1] - A[1]) * t)}, ${Math.round(A[2] + (B[2] - A[2]) * t)})`;
};
const ngayVN = (d: string) => `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}`;
const so2 = (n: number) => String(n).padStart(2, '0');

export function HubCungCau({ data }: { data: MatTien }) {
  const khung = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [soi, setSoi] = useState(0);
  const tien = useRef<HTMLElement>(null);
  const [tip, setTip] = useState<{ x: number; y: number; ten: string; phu: string } | null>(null);
  const [tinh, setTinh] = useState(false);

  useEffect(() => {
    const el = khung.current; const c = cv.current;
    if (!el || !c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const giam = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTinh(giam);
    const MAU = {
      cung: docMau('--data-cung', '#56B4E9'), cau: docMau('--data-cau', '#E69F00'), match: docMau('--data-match', '#D55E00'),
      xanh: docMau('--color-accent-blue', '#2F6BFF'), cyan: docMau('--color-accent-cyan', '#18D4F5'),
      chu: docMau('--color-text-primary', '#F8FAFC'), chu2: docMau('--color-text-secondary', '#94A3B8'), nen: docMau('--color-bg-canvas', '#020617'),
    };
    const { nut, canhNhom, luong, tuChoi, match } = data;

    let W = 0; let H = 0; let dpr = 1; let cx = 0; let cy = 0; let R = 0; let r = 0;
    const pos: P[] = nut.map(() => ({ x: 0, y: 0 }));
    const nen = document.createElement('canvas');

    const boTri = () => {
      const b = el.getBoundingClientRect();
      W = Math.max(320, b.width); H = Math.max(320, b.height); dpr = Math.min(2, window.devicePixelRatio || 1);
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); c.style.width = `${W}px`; c.style.height = `${H}px`;
      const rong = W >= 1000;
      cx = rong ? W * (W >= 1700 ? 0.62 : 0.635) : W * 0.5; cy = rong ? H * 0.5 : H * 0.56;
      R = Math.min(H * (W >= 1700 ? 0.39 : 0.37), rong ? W * 0.27 : W * 0.42); r = R * 0.42;
      const cung = nut.map((n, i) => ({ n, i })).filter((x) => x.n.loai === 'cung');
      const cau = nut.map((n, i) => ({ n, i })).filter((x) => x.n.loai === 'cau');
      const nhom = nut.map((n, i) => ({ n, i })).filter((x) => x.n.loai === 'nhom');
      // Nua trai tu tren xuong (goc 1.34pi -> 0.66pi), nua phai tu tren xuong (-0.34pi -> 0.34pi).
      cung.forEach((x, k) => { const a = Math.PI * (1.34 - (0.68 * k) / Math.max(1, cung.length - 1)); pos[x.i] = { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) }; });
      cau.forEach((x, k) => { const a = Math.PI * (-0.34 + (0.68 * k) / Math.max(1, cau.length - 1)); pos[x.i] = { x: cx + R * Math.cos(a), y: cy + R * Math.sin(a) }; });
      // Nhom: 1..5 nua phai (tren xuong), 6..10 nua trai (duoi len): nhom nho gan dau vong, cum cau gan nhom cua no.
      nhom.forEach((x, k) => { const a = -Math.PI / 2 + ((k + 0.5) * 2 * Math.PI) / nhom.length; pos[x.i] = { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }; });
      veNen();
    };

    // Diem dieu khien: keo ve loi de cac canh bo lai quanh hub.
    const dk = (a: P, b: P, keo = 0.55): P => ({ x: (a.x + b.x) / 2 + (cx - (a.x + b.x) / 2) * keo, y: (a.y + b.y) / 2 + (cy - (a.y + b.y) / 2) * keo });
    const q = (a: P, k: P, b: P, t: number): P => ({ x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * k.x + t * t * b.x, y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * k.y + t * t * b.y });
    const duong = (l: { cung: number; cau: number; nhom: number }, t: number): P => {
      const A = pos[l.cung]; const N = pos[l.nhom]; const B = pos[l.cau];
      return t < 0.5 ? q(A, dk(A, N, 0.35), N, t * 2) : q(N, dk(N, B, 0.35), B, (t - 0.5) * 2);
    };

    const hinhThoi = (g: CanvasRenderingContext2D, p: P, s: number) => { g.beginPath(); g.moveTo(p.x, p.y - s); g.lineTo(p.x + s, p.y); g.lineTo(p.x, p.y + s); g.lineTo(p.x - s, p.y); g.closePath(); };

    function veNen() {
      nen.width = c!.width; nen.height = c!.height;
      const g = nen.getContext('2d')!; g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
      // quang sang quanh hub
      const qs = g.createRadialGradient(cx, cy, r * 0.2, cx, cy, R * 1.5);
      qs.addColorStop(0, rgba(MAU.xanh, 0.16)); qs.addColorStop(0.55, rgba(MAU.xanh, 0.04)); qs.addColorStop(1, rgba(MAU.xanh, 0));
      g.fillStyle = qs; g.fillRect(0, 0, W, H);
      // cac vong
      g.lineWidth = 1;
      for (const [rr, a, dash] of [[R, 0.16, [2, 6]], [R * 1.1, 0.07, []], [r, 0.22, []], [r * 0.46, 0.18, [1, 4]]] as [number, number, number[]][]) {
        g.setLineDash(dash); g.strokeStyle = rgba(MAU.chu2, a); g.beginPath(); g.arc(cx, cy, rr, 0, Math.PI * 2); g.stroke();
      }
      g.setLineDash([]);
      // canh nhom (mo)
      for (const [a, b] of canhNhom) {
        const A = pos[a]; const B = pos[b]; const k = dk(A, B, 0.3);
        g.strokeStyle = rgba(nut[a].loai === 'cung' ? MAU.cung : MAU.cau, 0.11); g.lineWidth = 0.8;
        g.beginPath(); g.moveTo(A.x, A.y); g.quadraticCurveTo(k.x, k.y, B.x, B.y); g.stroke();
      }
      // cap bi tu choi: net dut xam, van hien
      g.setLineDash([3, 4]);
      for (const [a, b] of tuChoi) { g.strokeStyle = rgba(MAU.chu2, 0.35); g.beginPath(); g.moveTo(pos[a].x, pos[a].y); const k = dk(pos[a], pos[b], 0.7); g.quadraticCurveTo(k.x, k.y, pos[b].x, pos[b].y); g.stroke(); }
      g.setLineDash([]);
      // nut
      nut.forEach((n, i) => {
        const p = pos[i];
        if (n.loai === 'cung') {
          g.fillStyle = rgba(MAU.cung, 0.18); g.beginPath(); g.arc(p.x, p.y, 6.5, 0, Math.PI * 2); g.fill();
          g.fillStyle = MAU.cung; g.beginPath(); g.arc(p.x, p.y, 3.2, 0, Math.PI * 2); g.fill();
        } else if (n.loai === 'cau') {
          if (n.trong) { g.strokeStyle = MAU.cau; g.lineWidth = 1.3; hinhThoi(g, p, 4.6); g.stroke(); }
          else { g.fillStyle = rgba(MAU.cau, 0.2); hinhThoi(g, p, 7.5); g.fill(); g.fillStyle = MAU.cau; hinhThoi(g, p, 4.4); g.fill(); }
        } else {
          g.fillStyle = MAU.nen; g.strokeStyle = rgba(MAU.cyan, 0.7); g.lineWidth = 1.2;
          g.beginPath(); for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + (k * Math.PI) / 3; const x = p.x + 11 * Math.cos(a); const y = p.y + 11 * Math.sin(a); if (k) g.lineTo(x, y); else g.moveTo(x, y); } g.closePath(); g.fill(); g.stroke();
          g.fillStyle = MAU.chu; g.font = '600 9.5px Inter, system-ui, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(so2(n.nhom), p.x, p.y + 0.5);
        }
      });
      // nhan hai nua vong
      g.font = '600 10px ui-monospace, SFMono-Regular, Menlo, monospace'; g.textBaseline = 'alphabetic';
      g.fillStyle = rgba(MAU.cung, 0.95); g.textAlign = 'right';
      g.fillText(`CUNG · ${nut.filter((n) => n.loai === 'cung').length} ĐƠN VỊ`, cx - R * 0.5, cy - R * 1.02);
      g.fillStyle = rgba(MAU.cau, 0.95); g.textAlign = 'left';
      g.fillText(`CẦU · ${nut.filter((n) => n.loai === 'cau').length} SẢN PHẨM QĐ 21`, cx + R * 0.5, cy - R * 1.02);
      g.fillStyle = rgba(MAU.chu2, 0.9); g.textAlign = 'center';
      g.fillText(`${nut.filter((n) => n.loai === 'nhom').length} NHÓM`, cx, cy - 3); g.fillText('CÔNG NGHỆ', cx, cy + 10);
    }

    // hat: moi luong co mot so hat lech pha co dinh (tat dinh)
    const hat: Hat[] = [];
    luong.forEach((l, i) => { const k = l.daKy ? 3 : 2; for (let j = 0; j < k; j++) hat.push({ luong: i, t: ((i * 0.618) + j * 0.5) % 1, v: 0.00011 + ((i * 37) % 11) * 0.000009 }); });

    let raf = 0; let t0 = 0; let chiSoSoi = -1; let hover = -1;

    const ve = (now: number) => {
      if (!t0) t0 = now;
      const tt = now - t0;
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, c.width, c.height);
      // Khoi dong: lop tinh no ra tu loi trong 1,4 giay dau (0,94 -> 1), sau do dung yen.
      const vao = giam ? 1 : Math.min(1, tt / 1400); const em = 1 - (1 - vao) ** 3;
      ctx.globalAlpha = em;
      if (em < 1) { const k = 0.94 + 0.06 * em; ctx.setTransform(k, 0, 0, k, cx * dpr * (1 - k), cy * dpr * (1 - k)); }
      ctx.drawImage(nen, 0, 0);
      ctx.globalAlpha = 1;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const quay = giam ? 0 : tt * 0.00005;
      // vong vach xoay cham (HUD)
      ctx.strokeStyle = rgba(MAU.cyan, 0.28); ctx.lineWidth = 1;
      for (let k = 0; k < 144; k++) {
        const a = quay + (k * Math.PI * 2) / 144; const dai = k % 12 === 0 ? 9 : k % 4 === 0 ? 5 : 2.5;
        const r1 = R * 1.18; ctx.beginPath(); ctx.moveTo(cx + r1 * Math.cos(a), cy + r1 * Math.sin(a)); ctx.lineTo(cx + (r1 + dai) * Math.cos(a), cy + (r1 + dai) * Math.sin(a)); ctx.stroke();
      }
      // tia quet quanh loi
      if (!giam) {
        const a = tt * 0.0006;
        const g2 = ctx.createConicGradient ? ctx.createConicGradient(a, cx, cy) : null;
        if (g2) { g2.addColorStop(0, rgba(MAU.cyan, 0.13)); g2.addColorStop(0.08, rgba(MAU.cyan, 0)); g2.addColorStop(1, rgba(MAU.cyan, 0)); ctx.fillStyle = g2; ctx.beginPath(); ctx.arc(cx, cy, r * 0.98, 0, Math.PI * 2); ctx.fill(); }
      }
      // loi dap nhip
      const nhipLoi = giam ? 0.5 : (Math.sin(tt * 0.0025) + 1) / 2;
      ctx.strokeStyle = rgba(MAU.cyan, 0.25 + 0.3 * nhipLoi); ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(cx, cy, r * 0.46 + nhipLoi * 3, 0, Math.PI * 2); ctx.stroke();

      // nhu cau chua co cung: nhip cham
      if (!giam) nut.forEach((n, i) => { if (n.loai === 'cau' && n.trong) { const s = ((tt * 0.0006 + i * 0.13) % 1); ctx.strokeStyle = rgba(MAU.cau, 0.5 * (1 - s)); ctx.lineWidth = 1; hinhThoi(ctx, pos[i], 5 + s * 9); ctx.stroke(); } });

      // hat
      // Hat cong sang (lighter): cho nhieu hat trung nhau thi sang len nhu dong chay that.
      if (!giam && vao >= 1) ctx.globalCompositeOperation = 'lighter';
      if (!giam && vao >= 1) for (const h of hat) {
        h.t = (h.t + h.v * 16) % 1;
        const l = luong[h.luong]; const p = duong(l, h.t);
        const mau = l.daKy ? MAU.match : tron(MAU.cung, MAU.cau, Math.min(1, Math.max(0, (h.t - 0.35) / 0.3)));
        const s = l.daKy ? 2.1 : 1.5;
        const p2 = duong(l, Math.max(0, h.t - 0.06));
        ctx.strokeStyle = mau; ctx.globalAlpha = 0.3; ctx.lineWidth = s; ctx.beginPath(); ctx.moveTo(p2.x, p2.y); ctx.lineTo(p.x, p.y); ctx.stroke();
        ctx.globalAlpha = 0.95; ctx.fillStyle = mau; ctx.beginPath(); ctx.arc(p.x, p.y, s, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';

      // soi match
      const n = match.length;
      const i = n ? (giam ? 0 : Math.floor(tt / CHU_KY) % n) : -1;
      if (i !== chiSoSoi) { chiSoSoi = i; setSoi(i); }
      // Thanh tien do cap nhat thang vao DOM, khong qua state: tranh render React moi khung hinh.
      if (!giam && tien.current) tien.current.style.transform = `scaleX(${(tt % CHU_KY) / CHU_KY})`;
      if (i >= 0) {
        const m = match[i]; const l = { cung: m.cung, cau: m.cau, nhom: m.nhom };
        const pha = giam ? 1 : Math.min(1, ((tt % CHU_KY) / CHU_KY) * 1.8);
        ctx.shadowColor = MAU.match; ctx.shadowBlur = 14; ctx.strokeStyle = MAU.match; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
        ctx.beginPath(); const buoc = 40;
        for (let k = 0; k <= buoc * pha; k++) { const p = duong(l, k / buoc); if (k) ctx.lineTo(p.x, p.y); else ctx.moveTo(p.x, p.y); }
        ctx.stroke(); ctx.shadowBlur = 0;
        const dau = duong(l, Math.min(1, pha)); ctx.fillStyle = MAU.chu; ctx.beginPath(); ctx.arc(dau.x, dau.y, 2.6, 0, Math.PI * 2); ctx.fill();
        for (const [j, mau] of [[m.cung, MAU.cung], [m.cau, MAU.cau], [m.nhom, MAU.cyan]] as [number, string][]) {
          const s = giam ? 0.5 : ((tt % 1400) / 1400);
          ctx.strokeStyle = rgba(mau, 0.9 * (1 - s)); ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(pos[j].x, pos[j].y, 8 + s * 14, 0, Math.PI * 2); ctx.stroke();
        }
        // nhan hai dau, co vien toi de doc duoc tren canh
        ctx.font = '600 12px Inter, system-ui, sans-serif'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
        // Nhan ben cung dat PHIA TRONG vong (ben phai diem) de khong de len cot chu ben trai;
        // nhan ben cau dat phia ngoai, cat bot cho vua mep man hinh.
        const vua = (s: string, toiDa: number) => { if (ctx.measureText(s).width <= toiDa) return s; let t = s; while (t.length > 4 && ctx.measureText(`${t}…`).width > toiDa) t = t.slice(0, -1); return `${t}…`; };
        const nhan = (p: P, s: string, mau: string, toiDa: number) => {
          ctx.textAlign = 'left'; const x = p.x + 16; const chu = vua(s, toiDa);
          ctx.strokeStyle = MAU.nen; ctx.lineWidth = 4; ctx.strokeText(chu, x, p.y); ctx.fillStyle = mau; ctx.fillText(chu, x, p.y);
        };
        nhan(pos[m.cung], m.cungTen, MAU.chu, R * 0.62);
        nhan(pos[m.cau], `${m.cauMa} ${m.cauTen}`, MAU.chu, Math.max(60, W - pos[m.cau].x - 28));
        const g = pos[m.nhom]; ctx.font = '600 11px Inter, system-ui, sans-serif';
        const tenNhom = nut[m.nhom].ten; const ben = g.x >= cx ? 'phai' : 'trai';
        ctx.textAlign = ben === 'trai' ? 'right' : 'left'; const x = g.x + (ben === 'trai' ? -15 : 15);
        ctx.strokeStyle = MAU.nen; ctx.lineWidth = 4; ctx.strokeText(tenNhom, x, g.y); ctx.fillStyle = rgba(MAU.cyan, 1); ctx.fillText(tenNhom, x, g.y);
      }
      // nut dang tro
      if (hover >= 0) { const p = pos[hover]; ctx.strokeStyle = MAU.chu; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(p.x, p.y, 9, 0, Math.PI * 2); ctx.stroke(); }
      if (!giam) raf = requestAnimationFrame(ve);
    };

    const tro = (ev: PointerEvent) => {
      const b = c.getBoundingClientRect(); const x = ev.clientX - b.left; const y = ev.clientY - b.top;
      let best = -1; let d = 196;
      pos.forEach((p, i) => { const dd = (p.x - x) ** 2 + (p.y - y) ** 2; if (dd < d) { d = dd; best = i; } });
      hover = best;
      if (best < 0) { setTip(null); c.style.cursor = 'default'; if (giam) ve(performance.now()); return; }
      const nn = nut[best];
      const soLuong = luong.filter((l) => l.cung === best || l.cau === best || l.nhom === best).length;
      const phu = nn.loai === 'nhom' ? `Nhóm ${so2(nn.nhom)} · ${soLuong} cặp cung cầu đi qua`
        : nn.loai === 'cung' ? `Đơn vị cung · nhóm ${so2(nn.nhom)} · ${soLuong} cặp có nguồn`
          : `${nn.ma} · nhu cầu QĐ 21/2026 · ${nn.trong ? 'chưa có bên cung' : `${soLuong} bên cung có nguồn`}`;
      setTip({ x: pos[best].x, y: pos[best].y, ten: nn.ten, phu });
      if (giam) ve(performance.now());
    };
    const roi = () => { hover = -1; setTip(null); if (giam) ve(performance.now()); };

    const ro = new ResizeObserver(() => { boTri(); if (giam) ve(performance.now()); });
    ro.observe(el);
    boTri();
    c.addEventListener('pointermove', tro); c.addEventListener('pointerleave', roi);
    if (giam) ve(performance.now()); else raf = requestAnimationFrame(ve);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); c.removeEventListener('pointermove', tro); c.removeEventListener('pointerleave', roi); };
  }, [data]);

  const m = soi >= 0 ? data.match[soi] : null;
  return (
    <div ref={khung} className="mt-hub">
      <canvas ref={cv} className="mt-hub__cv" role="img"
        aria-label={`Hub cung cầu: ${data.so.donVi} đơn vị cung, ${data.so.nhom} nhóm công nghệ, ${data.so.nhuCau} nhu cầu quốc gia; ${data.so.capCoNguon} cặp cung cầu có nguồn, ${data.so.daKy} match đã ký, ${data.so.ncTrong} nhu cầu chưa có bên cung.`} />
      {tip && (
        <div className="mt-tip" style={{ left: tip.x, top: tip.y }} aria-hidden="true">
          <b>{tip.ten}</b><span>{tip.phu}</span>
        </div>)}
      {m && (
        <aside className="mt-the" aria-live="polite">
          <div className="mt-the__dau">
            <span className="mt-the__nhan"><i aria-hidden="true" />Match đã ký · {so2(soi + 1)}/{so2(data.match.length)}</span>
            <span className="mt-the__diem">điểm {m.diem.toFixed(2).replace('.', ',')}</span>
          </div>
          <div className="mt-the__dong mt-the__dong--cau"><span className="mt-the__ma">{m.cauMa}</span><span>{m.cauTen}</span><em>cầu · hạng {m.tierCau}</em></div>
          <div className="mt-the__dong mt-the__dong--cung"><span className="mt-the__ma" aria-hidden="true">⇄</span><span>{m.cungTen}</span><em>cung · hạng {m.tierCung}</em></div>
          <div className="mt-the__chan">{m.id} · ký {ngayVN(m.ngay)} bởi người gác cổng · bấm vào engine để xem câu nguồn</div>
          {!tinh && <div className="mt-the__tien" aria-hidden="true"><i ref={tien} /></div>}
        </aside>)}
    </div>
  );
}
