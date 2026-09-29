'use client';

/**
 * HubCungCau · Hinh chu dao cua trang dau, ve lai 29/09/2026 theo huong "ban ve ky thuat" don sac.
 *
 * Vi sao ve lai: ban truoc (vong hub, hat bay, radar, vong vach xoay, glow, bay mau) bi danh gia la
 * "AI slop": trang tri khong mang du lieu, bui soi khong doc duoc, va truot chuan HIVE Editorial cua
 * anh Lam (don sac, khong gradient, khong glow, trang thai khong dua vao mau).
 *
 * Bo cuc (tat dinh, doc trai sang phai):
 *   cot trai   44 don vi cung, moi don vi mot vach ngang ngan
 *   truc giua  10 nhom cong nghe QD 21/2026, danh so serif
 *   cot phai   30 nhu cau quoc gia, hinh thoi (dac = co ben cung, rong = chua co), kem ma P
 * Duong nen la hairline rat nhat. CHI MOT thu chuyen dong: tung match da ky duoc ve thanh mot net
 * trang manh trong 1,5 giay, dung lai, roi o lai mo khi sang match ke tiep; het vong la thay ca 11
 * match da ky. Cau nguon nguyen van hai phia hien ben duoi, thang cot voi phia cua no.
 * Cap bi tu choi: net dut, van hien.
 * Mau: chi thang xam. Khong gradient, khong glow, khong hat.
 * prefers-reduced-motion: ve ca 11 match mot luc, soi match dau, khong chuyen dong.
 */
import { useEffect, useRef, useState } from 'react';
import type { MatTien } from '@/lib/mat-tien';

type P = { x: number; y: number };
const VE = 1500;
const CHU_KY = 5600;
const ngayVN = (d: string) => `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}`;
const so2 = (n: number) => String(n).padStart(2, '0');
const em = (t: number) => 1 - (1 - t) ** 3;
// Chi de HIEN THI: bo cu phap lien ket markdown ma ban chup giu lai ([FPT](https://...) -> FPT).
// Chu cua nguon khong doi; ban nguyen van day du van mo duoc trong engine.
const boLienKet = (s: string) => s.replace(/\[([^\]]+)\]\s*\((https?:[^)]+)\)/g, '$1').replace(/\((https?:\/\/[^)\s]+)\)/g, '').replace(/\s{2,}/g, ' ').trim();
const docBien = (ten: string, du: string) => {
  if (typeof window === 'undefined') return du;
  return getComputedStyle(document.documentElement).getPropertyValue(ten).trim() || du;
};

export function HubCungCau({ data }: { data: MatTien }) {
  const khung = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);
  const [soi, setSoi] = useState(0);
  const [tip, setTip] = useState<{ x: number; y: number; ten: string; phu: string; trai: boolean } | null>(null);

  useEffect(() => {
    const el = khung.current; const c = cv.current;
    if (!el || !c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const giam = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const MUC = docBien('--p-ink', '#EDEDEA');
    const MUC2 = docBien('--p-2', '#A3A3A0');
    const MUC3 = docBien('--p-3', '#6E6E6B');
    const NEN = docBien('--p-bg', '#070707');
    const SERIF = '"Noto Serif", "Iowan Old Style", Georgia, serif';
    const SANS = 'Inter, system-ui, sans-serif';
    const { nut, luong, tuChoi, match } = data;

    let W = 0; let H = 0; let dpr = 1;
    const pos: P[] = nut.map(() => ({ x: 0, y: 0 }));
    let xCung = 0; let xNhom = 0; let xCau = 0; let tren = 0; let duoi = 0;

    const boTri = () => {
      const b = el.getBoundingClientRect();
      W = Math.max(320, b.width); H = Math.max(240, b.height); dpr = Math.min(2, window.devicePixelRatio || 1);
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); c.style.width = `${W}px`; c.style.height = `${H}px`;
      xCung = W * 0.3; xNhom = W * 0.53; xCau = W * 0.76; tren = 40; duoi = H - 14;
      const dat = (loai: string, x: number) => {
        const ds = nut.map((n, i) => ({ n, i })).filter((v) => v.n.loai === loai);
        ds.forEach((v, k) => { pos[v.i] = { x, y: tren + ((duoi - tren) * (k + 0.5)) / ds.length }; });
      };
      dat('cung', xCung); dat('nhom', xNhom); dat('cau', xCau);
    };

    // Duong cong ngang (bezier bac ba, diem dieu khien o giua), kieu so do day noi trong ban ve.
    const cong = (a: P, b: P) => { const m = (a.x + b.x) / 2; return [a, { x: m, y: a.y }, { x: m, y: b.y }, b]; };
    const diem = (q: P[], t: number): P => {
      const u = 1 - t;
      return { x: u * u * u * q[0].x + 3 * u * u * t * q[1].x + 3 * u * t * t * q[2].x + t * t * t * q[3].x,
        y: u * u * u * q[0].y + 3 * u * u * t * q[1].y + 3 * u * t * t * q[2].y + t * t * t * q[3].y };
    };
    const veCong = (a: P, b: P) => { const q = cong(a, b); ctx.moveTo(q[0].x, q[0].y); ctx.bezierCurveTo(q[1].x, q[1].y, q[2].x, q[2].y, q[3].x, q[3].y); };
    // Ve mot doan duong cung -> nhom -> cau toi ti le t (0..1), de "net ve dan".
    const veDuong = (l: { cung: number; nhom: number; cau: number }, t: number) => {
      const A = pos[l.cung]; const N = pos[l.nhom]; const B = pos[l.cau];
      const q1 = cong({ x: A.x + 2, y: A.y }, { x: N.x - 16, y: N.y }); const q2 = cong({ x: N.x + 16, y: N.y }, { x: B.x - 7, y: B.y });
      const buoc = 36;
      ctx.beginPath(); ctx.moveTo(q1[0].x, q1[0].y);
      const t1 = Math.min(1, t * 2); for (let k = 1; k <= buoc * t1; k++) { const p = diem(q1, k / buoc); ctx.lineTo(p.x, p.y); }
      ctx.stroke();
      // Net ngat qua so nhom (khong gach ngang con so), roi ve tiep nua sau.
      if (t > 0.5) { ctx.beginPath(); const p0 = diem(q2, 0); ctx.moveTo(p0.x, p0.y); const t2 = (t - 0.5) * 2; for (let k = 1; k <= buoc * t2; k++) { const p = diem(q2, k / buoc); ctx.lineTo(p.x, p.y); } ctx.stroke(); }
    };
    const hinhThoi = (p: P, s: number) => { ctx.beginPath(); ctx.moveTo(p.x, p.y - s); ctx.lineTo(p.x + s, p.y); ctx.lineTo(p.x, p.y + s); ctx.lineTo(p.x - s, p.y); ctx.closePath(); };
    const vua = (s: string, toiDa: number) => { if (ctx.measureText(s).width <= toiDa) return s; let t = s; while (t.length > 3 && ctx.measureText(`${t}…`).width > toiDa) t = t.slice(0, -1); return `${t}…`; };

    let hover = -1; let raf = 0; let t0 = 0; let chiSo = -1;

    const ve = (now: number) => {
      if (!t0) t0 = now;
      const tt = now - t0;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      const n = match.length;
      const i = n ? (giam ? 0 : Math.floor(tt / CHU_KY) % n) : -1;
      const vong = giam ? 1 : Math.floor(tt / (CHU_KY * Math.max(1, n)));
      const pha = giam ? 1 : em(Math.min(1, (tt % CHU_KY) / VE));
      if (i !== chiSo) { chiSo = i; setSoi(i); }
      const m = i >= 0 ? match[i] : null;
      const dangSang = new Set(m ? [m.cung, m.nhom, m.cau] : []);
      if (hover >= 0) dangSang.add(hover);

      // tieu de cot
      ctx.font = `500 11px ${SANS}`; ctx.fillStyle = MUC3; ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'right'; ctx.fillText(`Cung · ${nut.filter((v) => v.loai === 'cung').length} đơn vị`, xCung + 2, 14);
      ctx.textAlign = 'center'; ctx.fillText('Nhóm công nghệ', xNhom, 14);
      ctx.textAlign = 'left'; ctx.fillText(`Cầu · ${nut.filter((v) => v.loai === 'cau').length} sản phẩm QĐ 21`, xCau - 4, 14);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.10)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, 24.5); ctx.lineTo(W, 24.5); ctx.stroke();

      // duong nen: hairline rat nhat cho moi cap co nguon
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'; ctx.lineWidth = 1;
      ctx.beginPath();
      const daVe = new Set<string>();
      for (const l of luong) {
        const k1 = `${l.cung}>${l.nhom}`; const k2 = `${l.nhom}>${l.cau}`;
        if (!daVe.has(k1)) { daVe.add(k1); veCong({ x: pos[l.cung].x + 2, y: pos[l.cung].y }, { x: pos[l.nhom].x - 16, y: pos[l.nhom].y }); }
        if (!daVe.has(k2)) { daVe.add(k2); veCong({ x: pos[l.nhom].x + 16, y: pos[l.nhom].y }, { x: pos[l.cau].x - 7, y: pos[l.cau].y }); }
      }
      ctx.stroke();

      // cap bi tu choi: net dut
      ctx.setLineDash([3, 4]); ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
      for (const [a, b] of tuChoi) { ctx.beginPath(); veCong({ x: pos[a].x + 2, y: pos[a].y }, { x: pos[b].x - 7, y: pos[b].y }); ctx.stroke(); }
      ctx.setLineDash([]);

      // match da ky truoc do trong vong nay (hoac ca 11 neu da het mot vong / giam chuyen dong)
      ctx.strokeStyle = 'rgba(237, 237, 234, 0.26)'; ctx.lineWidth = 1;
      match.forEach((mm, k) => { if (k !== i && (vong > 0 || k < i)) veDuong(mm, 1); });

      // match dang ve
      if (m) { ctx.strokeStyle = MUC; ctx.lineWidth = 1.5; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; veDuong(m, pha); }

      // nut
      nut.forEach((v, k) => {
        const p = pos[k]; const sang = dangSang.has(k);
        if (v.loai === 'cung') {
          ctx.strokeStyle = sang ? MUC : 'rgba(237, 237, 234, 0.42)'; ctx.lineWidth = sang ? 1.6 : 1;
          ctx.beginPath(); ctx.moveTo(p.x - 12, p.y); ctx.lineTo(p.x + 2, p.y); ctx.stroke();
        } else if (v.loai === 'cau') {
          if (v.trong) { ctx.strokeStyle = sang ? MUC : 'rgba(237, 237, 234, 0.5)'; ctx.lineWidth = 1; hinhThoi(p, 3.6); ctx.stroke(); }
          else { ctx.fillStyle = sang ? MUC : 'rgba(237, 237, 234, 0.62)'; hinhThoi(p, 3.6); ctx.fill(); }
          ctx.font = `500 10px ${SANS}`; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillStyle = sang ? MUC : MUC3;
          ctx.fillText(v.ma ?? '', p.x + 9, p.y + 0.5);
        } else {
          ctx.font = `400 15px ${SERIF}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = sang ? MUC : MUC2;
          ctx.fillText(so2(v.nhom), p.x, p.y + 1);
        }
      });

      // nhan cua match dang ve, xuat hien khi net ve xong
      if (m && pha > 0.98) {
        ctx.textBaseline = 'middle';
        const nhan = (s: string, x: number, y: number, canh: CanvasTextAlign, toiDa: number, mau: string, font: string) => {
          ctx.font = font; ctx.textAlign = canh; const chu = vua(s, toiDa);
          ctx.strokeStyle = NEN; ctx.lineWidth = 5; ctx.lineJoin = 'round'; ctx.strokeText(chu, x, y); ctx.fillStyle = mau; ctx.fillText(chu, x, y);
        };
        nhan(m.cungTen, pos[m.cung].x - 20, pos[m.cung].y, 'right', pos[m.cung].x - 28, MUC, `500 12.5px ${SANS}`);
        nhan(m.cauTen, pos[m.cau].x + 36, pos[m.cau].y, 'left', W - pos[m.cau].x - 44, MUC, `500 12.5px ${SANS}`);
        nhan(nut[m.nhom].ten, pos[m.nhom].x, pos[m.nhom].y + 19, 'center', (xCau - xNhom) * 1.2, MUC2, `italic 400 12px ${SERIF}`);
      }
      if (!giam) raf = requestAnimationFrame(ve);
    };

    const tro = (ev: PointerEvent) => {
      const b = c.getBoundingClientRect(); const x = ev.clientX - b.left; const y = ev.clientY - b.top;
      let best = -1; let d = 100;
      pos.forEach((p, k) => { const dd = (p.x - x) ** 2 + (p.y - y) ** 2; if (dd < d) { d = dd; best = k; } });
      hover = best;
      if (best < 0) { setTip(null); if (giam) ve(performance.now()); return; }
      const v = nut[best];
      const so = luong.filter((l) => l.cung === best || l.cau === best || l.nhom === best).length;
      const phu = v.loai === 'nhom' ? `Nhóm ${so2(v.nhom)} · ${so} cặp cung cầu đi qua`
        : v.loai === 'cung' ? `Đơn vị cung · nhóm ${so2(v.nhom)} · ${so} cặp có nguồn`
          : `${v.ma} · ${v.trong ? 'chưa có bên cung' : `${so} bên cung có nguồn`}`;
      setTip({ x: pos[best].x, y: pos[best].y, ten: v.ten, phu, trai: pos[best].x > W * 0.6 });
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
    <figure className="mt-hinh">
      <div ref={khung} className="mt-hinh__ve">
        <canvas ref={cv} role="img"
          aria-label={`Sơ đồ cung cầu: ${data.so.donVi} đơn vị cung, ${data.so.nhom} nhóm công nghệ, ${data.so.nhuCau} nhu cầu quốc gia; ${data.so.capCoNguon} cặp có nguồn, ${data.so.daKy} match đã ký, ${data.so.ncTrong} nhu cầu chưa có bên cung.`} />
        {tip && (
          <div className={tip.trai ? 'mt-tip mt-tip--trai' : 'mt-tip'} style={{ left: tip.x, top: tip.y }} aria-hidden="true">
            <b>{tip.ten}</b><span>{tip.phu}</span>
          </div>)}
      </div>
      {m && (
        <figcaption key={m.id} className="mt-bang" aria-live="polite">
          <div className="mt-bang__ben">
            <span className="mt-bang__nhan">Bên cung · {m.cungTen}</span>
            <q>{boLienKet(m.cungSpan)}</q>
            <span className="mt-bang__nguon">{m.cungNguon} · hạng {m.tierCung}</span>
          </div>
          <div className="mt-bang__giua">
            <span className="mt-bang__ma">{m.id}</span>
            <span>ký {ngayVN(m.ngay)}</span>
            <span>điểm {m.diem.toFixed(2).replace('.', ',')}</span>
            <span className="mt-bang__dem">{so2(soi + 1)} / {so2(data.match.length)}</span>
          </div>
          <div className="mt-bang__ben">
            <span className="mt-bang__nhan">Bên cầu · {m.cauMa}</span>
            <q>{boLienKet(m.cauSpan)}</q>
            <span className="mt-bang__nguon">{m.cauNguon} · hạng {m.tierCau} · QĐ 21/2026</span>
          </div>
        </figcaption>)}
    </figure>
  );
}
