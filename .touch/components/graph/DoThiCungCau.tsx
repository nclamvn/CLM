'use client';

/**
 * DoThiCungCau · Man "Do thi cung cau" (M2 trong 09_NANG_CAP_UI_UX.md). Pha P2a, 29/09/2026.
 *
 * Nhung gi tren man nay DEU tu lib/hub-graph.json, sinh luc build tu registry that:
 *   - 10 nhom cong nghe chien luoc tren mot vong (xuong song), 44 don vi, 30 nhu cau.
 *   - Canh "thuoc nhom" va "cung san pham": moi canh co cau nguon (lop phu mo duoc).
 *   - Canh match DA KY sang do, co hat chay tu cung sang cau. Match chua ky KHONG co o day.
 *   - Cap bi tu choi: net dut, van hien, vi bac cung la quyet dinh co trach nhiem.
 * Toa do tinh LUC BUILD (lib/do-thi-layout.mjs), tat dinh: trang chi ve.
 *
 * Tuong tac: re chuot sang vung hang xom, nut khac mo di; bam nut mo lop phu nguon; loc
 * theo loai canh; danh sach nut ben duoi cho ban phim va trinh doc man hinh (canvas khong
 * doc duoc). Giam chuyen dong: tat hat chay, ve tinh.
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import graph from '@/lib/hub-graph.json';
import { useProof, type Muc } from '@/components/proof/ProofLayer';

type Nut = { id: string; kind: string; label: string; x: number; y: number; soClaim?: number; favorsRtr?: boolean; maSp?: string };
type Canh = { id: string; kind: string; source: string; target: string; signoff?: { by: string; date: string }; matchId?: string };
type Meta = { nut: Record<string, number>; canh: Record<string, number> };
const G = graph as unknown as { meta: Meta; nodes: Nut[]; edges: Canh[] };

const LOAI_CANH = [
  { k: 'match_da_ky', nhan: 'Match đã ký' },
  { k: 'cung_san_pham', nhan: 'Cùng sản phẩm' },
  { k: 'thuoc_nhom', nhan: 'Thuộc nhóm' },
  { k: 'tu_choi', nhan: 'Cặp bị từ chối' },
] as const;
type LoaiCanh = typeof LOAI_CANH[number]['k'];

const mucCua = (n: Nut): Muc => (n.kind === 'don_vi' ? { loai: 'don_vi', ten: n.id.slice(3) }
  : n.kind === 'nhu_cau' ? { loai: 'nhu_cau', entityId: n.id.slice(3) } : { loai: 'nhom', so: n.id.slice(3) });

function banKinh(n: Nut) {
  if (n.kind === 'nhom') return 11;
  if (n.kind === 'nhu_cau') return 5;
  return 4 + Math.min(4, (n.soClaim ?? 0) * 0.5);
}

export function DoThiCungCau() {
  const { moMuc } = useProof();
  const hopRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [kichCo, setKichCo] = useState({ w: 900, h: 620 });
  const [tro, setTro] = useState<string | null>(null);
  const [bat, setBat] = useState<Record<LoaiCanh, boolean>>({ match_da_ky: true, cung_san_pham: true, thuoc_nhom: true, tu_choi: true });
  const giamChuyenDong = useRef(false);

  const nutTheoId = useMemo(() => new Map(G.nodes.map((n) => [n.id, n])), []);
  const hangXom = useMemo(() => {
    const m = new Map<string, Set<string>>();
    for (const e of G.edges) {
      if (!m.has(e.source)) m.set(e.source, new Set());
      if (!m.has(e.target)) m.set(e.target, new Set());
      m.get(e.source)!.add(e.target); m.get(e.target)!.add(e.source);
    }
    return m;
  }, []);

  // Kich co theo khung chua, giu ti le.
  useEffect(() => {
    const el = hopRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = Math.max(320, el.clientWidth);
      setKichCo({ w, h: Math.round(Math.min(720, Math.max(420, w * 0.62))) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const PAD = 34;
  const toaDo = useCallback((n: Nut) => ({
    x: PAD + n.x * (kichCo.w - PAD * 2),
    y: PAD + n.y * (kichCo.h - PAD * 2),
  }), [kichCo]);

  // Ve. Mau doc tu token CSS luc chay, khong go ma mau trong ma.
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    cv.width = kichCo.w * dpr; cv.height = kichCo.h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const css = getComputedStyle(cv);
    const v = (k: string) => css.getPropertyValue(k).trim();
    const MAU = {
      don_vi: v('--color-accent-blue'), nhu_cau: v('--color-accent-purple'), nhom: v('--color-accent-amber'),
      match: v('--color-accent-red'), canh: v('--color-text-muted'), chu: v('--color-text-primary'),
      chuPhu: v('--color-text-secondary'), rtr: v('--color-accent-red'), cyan: v('--color-accent-cyan'),
    };
    giamChuyenDong.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ke = tro ? hangXom.get(tro) ?? new Set<string>() : null;
    const sang = (id: string) => !ke || id === tro || ke.has(id);
    const canh = G.edges.filter((e) => bat[e.kind as LoaiCanh]);

    let raf = 0; let t0 = performance.now();
    const ve = (now: number) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, kichCo.w, kichCo.h);
      // Canh
      for (const e of canh) {
        const a = nutTheoId.get(e.source); const b = nutTheoId.get(e.target);
        if (!a || !b) continue;
        const pa = toaDo(a); const pb = toaDo(b);
        const noiBat = !ke || (sang(e.source) && sang(e.target) && (e.source === tro || e.target === tro));
        ctx.save();
        if (e.kind === 'match_da_ky') {
          ctx.strokeStyle = MAU.match; ctx.lineWidth = 1.8; ctx.globalAlpha = noiBat ? 0.95 : 0.12;
        } else if (e.kind === 'tu_choi') {
          ctx.strokeStyle = MAU.chuPhu; ctx.setLineDash([4, 4]); ctx.lineWidth = 1.2; ctx.globalAlpha = noiBat ? 0.8 : 0.1;
        } else if (e.kind === 'cung_san_pham') {
          ctx.strokeStyle = MAU.cyan; ctx.lineWidth = 0.9; ctx.globalAlpha = noiBat ? (ke ? 0.8 : 0.28) : 0.05;
        } else {
          ctx.strokeStyle = MAU.canh; ctx.lineWidth = 0.7; ctx.globalAlpha = noiBat ? (ke ? 0.7 : 0.18) : 0.04;
        }
        ctx.beginPath(); ctx.moveTo(pa.x, pa.y); ctx.lineTo(pb.x, pb.y); ctx.stroke();
        ctx.restore();
        // Hat chay tren match da ky: tu cung (don vi) sang cau (nhu cau).
        if (e.kind === 'match_da_ky' && !giamChuyenDong.current && noiBat) {
          for (let i = 0; i < 2; i++) {
            const f = (t * 0.35 + i * 0.5 + (e.id.length % 7) * 0.13) % 1;
            ctx.save(); ctx.fillStyle = MAU.match; ctx.globalAlpha = 0.9;
            ctx.beginPath(); ctx.arc(pa.x + (pb.x - pa.x) * f, pa.y + (pb.y - pa.y) * f, 2.2, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
          }
        }
      }
      // Nut
      for (const n of G.nodes) {
        const p = toaDo(n); const r = banKinh(n);
        ctx.save();
        ctx.globalAlpha = sang(n.id) ? 1 : 0.15;
        const mau = n.kind === 'don_vi' ? MAU.don_vi : n.kind === 'nhu_cau' ? MAU.nhu_cau : MAU.nhom;
        if (n.kind === 'nhom') {
          ctx.strokeStyle = mau; ctx.lineWidth = 2; ctx.fillStyle = mau; ctx.globalAlpha *= 0.9;
          ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.stroke();
          ctx.globalAlpha *= 0.25; ctx.fill();
        } else if (n.kind === 'nhu_cau') {
          ctx.fillStyle = mau;
          ctx.beginPath(); ctx.moveTo(p.x, p.y - r - 1); ctx.lineTo(p.x + r + 1, p.y); ctx.lineTo(p.x, p.y + r + 1); ctx.lineTo(p.x - r - 1, p.y); ctx.closePath(); ctx.fill();
        } else {
          ctx.fillStyle = mau;
          ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, Math.PI * 2); ctx.fill();
          if (n.favorsRtr) { ctx.strokeStyle = MAU.rtr; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(p.x, p.y, r + 3, 0, Math.PI * 2); ctx.stroke(); }
        }
        ctx.restore();
      }
      // Nhan: nhom luon hien; nut dang tro va hang xom hien ten.
      ctx.save();
      ctx.font = `600 11px ${v('--font-ui') || 'system-ui, sans-serif'}`;
      ctx.textBaseline = 'middle';
      for (const n of G.nodes) {
        const hienTen = n.kind === 'nhom' ? sang(n.id) : (ke !== null && sang(n.id));
        if (!hienTen) continue;
        const p = toaDo(n);
        const chu = n.kind === 'nhom' ? n.label.replace(/^Nhóm \d+ · /, '') : n.kind === 'nhu_cau' ? `P${n.maSp} · ${n.label}` : n.label;
        const ngan = chu.length > 38 ? chu.slice(0, 37) + '…' : chu;
        ctx.fillStyle = n.id === tro ? MAU.chu : MAU.chuPhu;
        const trai = p.x > kichCo.w * 0.72;
        ctx.textAlign = trai ? 'right' : 'left';
        ctx.fillText(ngan, p.x + (trai ? -1 : 1) * (banKinh(n) + 5), p.y);
      }
      ctx.restore();
      if (!giamChuyenDong.current && !document.hidden) raf = requestAnimationFrame(ve);
    };
    raf = requestAnimationFrame(ve);
    const onVis = () => { if (!document.hidden && !giamChuyenDong.current) { t0 = performance.now(); raf = requestAnimationFrame(ve); } };
    document.addEventListener('visibilitychange', onVis);
    return () => { cancelAnimationFrame(raf); document.removeEventListener('visibilitychange', onVis); };
  }, [kichCo, tro, bat, toaDo, nutTheoId, hangXom]);

  const nutTai = useCallback((cx: number, cy: number) => {
    let tot: Nut | null = null; let d0 = Infinity;
    for (const n of G.nodes) {
      const p = toaDo(n);
      const d = Math.hypot(p.x - cx, p.y - cy);
      if (d < banKinh(n) + 7 && d < d0) { d0 = d; tot = n; }
    }
    return tot;
  }, [toaDo]);

  const viTri = (e: React.MouseEvent) => {
    const r = (e.target as HTMLCanvasElement).getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const dem = G.meta;
  const nutTro = tro ? nutTheoId.get(tro) : null;
  return (
    <section className="dash-panel dt-wrap" aria-label="Do thi cung cau">
      <div className="dt-head">
        <div className="dt-stats">
          <span><b>{dem.nut.don_vi}</b> đơn vị</span>
          <span><b>{dem.nut.nhu_cau}</b> nhu cầu</span>
          <span><b>{dem.nut.nhom}</b> nhóm công nghệ</span>
          <span><b>{dem.canh.match_da_ky}</b> match đã ký</span>
        </div>
        <div className="dt-filters" role="group" aria-label="Loc loai canh">
          {LOAI_CANH.map((l) => (
            <button key={l.k} type="button" className={`dt-chip dt-chip--${l.k}`} aria-pressed={bat[l.k]}
              onClick={() => setBat((b) => ({ ...b, [l.k]: !b[l.k] }))}>
              <span className="dt-chip__mk" aria-hidden="true" />{l.nhan} · {dem.canh[l.k] ?? 0}
            </button>))}
        </div>
      </div>
      <div className="dt-canvas" ref={hopRef}>
        <canvas
          ref={canvasRef}
          style={{ width: kichCo.w, height: kichCo.h }}
          role="img"
          aria-label={`Do thi ${dem.nut.don_vi} don vi, ${dem.nut.nhu_cau} nhu cau, ${dem.canh.match_da_ky} match da ky. Danh sach nut o ben duoi.`}
          onMouseMove={(e) => { const p = viTri(e); const n = nutTai(p.x, p.y); setTro(n ? n.id : null); }}
          onMouseLeave={() => setTro(null)}
          onClick={(e) => { const p = viTri(e); const n = nutTai(p.x, p.y); if (n) moMuc(mucCua(n)); }}
          className={nutTro ? 'is-tro' : ''}
        />
        {nutTro && (
          <div className="dt-tip" aria-hidden="true">
            <div className="dt-tip__loai">{nutTro.kind === 'don_vi' ? 'Đơn vị' : nutTro.kind === 'nhu_cau' ? `Nhu cầu P${nutTro.maSp}` : 'Nhóm'}</div>
            <div className="dt-tip__ten">{nutTro.label}</div>
            <div className="dt-tip__phu">{(hangXom.get(nutTro.id)?.size ?? 0)} liên kết · bấm để mở lớp phủ nguồn</div>
          </div>)}
      </div>
      <div className="dt-legend">
        <span><i className="dt-mk dt-mk--dv" />Đơn vị (lớn hơn = nhiều câu nguồn hơn)</span>
        <span><i className="dt-mk dt-mk--nc" />Nhu cầu theo QĐ 21/2026</span>
        <span><i className="dt-mk dt-mk--nh" />Nhóm công nghệ chiến lược</span>
        <span><i className="dt-mk dt-mk--rtr" />Liên quan RtR, bên dựng hub</span>
      </div>
      <p className="dt-note">
        Mọi cạnh trên đồ thị đều có câu nguồn hoặc chữ ký: bấm một nút để xem. Match chưa ký không được vẽ.
        Bố trí tính lúc dựng dữ liệu, cùng dữ liệu thì cùng hình.
      </p>
      <details className="dt-list">
        <summary>Danh sách {G.nodes.length} nút (dùng bàn phím hoặc trình đọc màn hình)</summary>
        {(['nhom', 'don_vi', 'nhu_cau'] as const).map((k) => (
          <div key={k} className="dt-list__grp">
            <div className="dt-list__h">{k === 'nhom' ? 'Nhóm' : k === 'don_vi' ? 'Đơn vị' : 'Nhu cầu'}</div>
            <ul>{G.nodes.filter((n) => n.kind === k).map((n) => (
              <li key={n.id}><button type="button" className="pf-link" onClick={() => moMuc(mucCua(n))}>
                {n.kind === 'nhu_cau' ? `P${n.maSp} · ` : ''}{n.label}</button> <span className="dt-list__n">{hangXom.get(n.id)?.size ?? 0} liên kết</span></li>))}
            </ul>
          </div>))}
      </details>
    </section>
  );
}
