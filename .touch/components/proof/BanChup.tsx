'use client';

/**
 * BanChup · Cua so xem ban chup ngay tren trang (07/10/2026, anh Lam yeu cau).
 *
 * VI SAO: "Mo ban chup" truoc day mo mot tab moi voi tep .txt tho: nguoi xem roi khoi san pham,
 * gap chu "# SNAPSHOT · ... captured ..." va ghi chu khong dau cua nguoi chup lan voi van ban nguon,
 * cau lam bang thi phai tu tim. Nay mo mot cua so tren trang:
 *   - dau cua so: nguon, hang, ngay dang, ngay chup, trang goc (doc bang docDauBanChup, khong doan);
 *   - ghi chu cua nguoi chup tach rieng, gap lai;
 *   - than: van ban nguon NGUYEN VAN tung dong (chi bo dau # cua tieu de), dong cua nguoi chup co nhan;
 *   - cau lam bang to sang va cuon toi ngay khi mo.
 * Ban chup KHONG bi sua: van doc dung tep /evidence ma cong kiem doi chung. Bam kem Cmd/Ctrl, hay
 * khi khong co trinh cung cap, lien ket van mo tep tho o tab moi nhu cu.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { docDauBanChup, phanLoaiDong } from '@/lib/ban-chup.mjs';
import { ngayVN } from '@/lib/dinh-dang';

type Mo = { href: string; span: string | null };
const Ctx = createContext<((m: Mo) => void) | null>(null);

/** Lien ket "Mo ban chup": bam thuong thi mo cua so tren trang; Cmd/Ctrl/Shift hay chuot giua thi mo tep tho. */
export function MoBanChup({ href, span, children, className, title }: { href: string; span?: string | null; children?: React.ReactNode; className?: string; title?: string }) {
  const mo = useContext(Ctx);
  return (
    <a
      className={className ?? 'pf-link'}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-haspopup="dialog"
      title={title}
      onClick={(e) => {
        if (!mo || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        mo({ href, span: span ?? null });
      }}
    >
      {children ?? 'Mở bản chụp'}
    </a>
  );
}

type Dong = { text: string; loai: 'nguon' | 'ghi_chu' | 'chua_ro'; tieuDe: boolean; tu: number; den: number };

function NoiDung({ tho, span }: { tho: string; span: string | null }) {
  const dau = useMemo(() => docDauBanChup(tho), [tho]);
  const dong = useMemo<Dong[]>(() => {
    const pl = phanLoaiDong(tho);
    return pl.slice(dau.soDongDau).map((d: { tu: number; den: number; loai: Dong['loai'] }) => {
      const raw = tho.slice(d.tu, d.den);
      return { text: raw, loai: d.loai, tieuDe: raw.trim().startsWith('#'), tu: d.tu, den: d.den };
    });
  }, [tho, dau.soDongDau]);
  // Tim cau lam bang trong THAN ban chup (sau khoi dau): cau ngan nhu "FPT" co the trung chu trong
  // ghi chu dau file, ma khoi dau khong hien trong than cua so.
  const viTri = useMemo(() => {
    if (!span) return null;
    const batDau = dong.length ? dong[0].tu : tho.length;
    const i = tho.indexOf(span, batDau);
    return i < 0 ? null : [i, i + span.length] as const;
  }, [tho, span, dong]);
  const markRef = useRef<HTMLElement | null>(null);
  useEffect(() => { markRef.current?.scrollIntoView({ block: 'center' }); }, [viTri]);

  const toDong = (d: Dong, k: number) => {
    const hien = d.tieuDe ? d.text.replace(/^\s*#+\s*/, '') : d.text;
    const lech = d.text.length - hien.length;
    let noi: React.ReactNode = hien;
    if (viTri && viTri[0] < d.den && viTri[1] > d.tu) {
      const a = Math.max(0, viTri[0] - d.tu - lech); const b = Math.min(hien.length, viTri[1] - d.tu - lech);
      noi = <>{hien.slice(0, a)}<mark className="bc-mark" ref={(el) => { if (el && !markRef.current) markRef.current = el; }}>{hien.slice(a, b)}</mark>{hien.slice(b)}</>;
    }
    if (d.loai !== 'nguon') {
      return (
        <p key={k} className={`bcm-dong bcm-dong--${d.loai}`}>
          <span className="bcm-nhan">{d.loai === 'ghi_chu' ? 'ghi chú người chụp' : 'tiêu đề chưa phân định'}</span>{noi}
        </p>);
    }
    return d.tieuDe ? <h4 key={k} className="bcm-td">{noi}</h4> : <p key={k} className="bcm-dong">{noi}</p>;
  };

  return (
    <>
      <dl className="bcm-meta">
        {dau.hang && <div><dt>Hạng nguồn</dt><dd><span className={`pf-tier pf-tier--${dau.hang}`}>hạng {dau.hang}</span></dd></div>}
        <div><dt>Ngày đăng</dt><dd>{dau.ngayDang ? ngayVN(dau.ngayDang) : 'nguồn không ghi'}</dd></div>
        <div><dt>Ngày chụp</dt><dd>{dau.ngayChup ? ngayVN(dau.ngayChup) : 'không đọc được'}</dd></div>
        {dau.url && <div className="bcm-meta__url"><dt>Trang gốc</dt><dd><a className="pf-link" href={dau.url} target="_blank" rel="noopener noreferrer">{dau.url.replace(/^https?:\/\//, '')}</a></dd></div>}
      </dl>
      {span && !viTri && <p className="pf-ctx pf-ctx--loi">Câu làm bằng không có nguyên văn trong bản chụp này. Đây là lỗi dữ liệu; cổng kiểm lẽ ra đã chặn.</p>}
      {dau.ghiChu && (
        <details className="bcm-gc">
          <summary>Ghi chú của người chụp (không phải chữ của nguồn)</summary>
          <p>{dau.ghiChu}</p>
        </details>)}
      <div className="bcm-than" aria-label="Văn bản nguyên văn của nguồn">
        {dong.filter((d) => d.text.trim()).map(toDong)}
      </div>
    </>
  );
}

function CuaSo({ mo, dong }: { mo: Mo; dong: () => void }) {
  const [tt, setTt] = useState<{ ok: true; tho: string } | { ok: false; loi: string } | null>(null);
  const nutDong = useRef<HTMLButtonElement>(null);
  const khung = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let huy = false;
    setTt(null);
    fetch(mo.href)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((t) => { if (!huy) setTt({ ok: true, tho: t }); })
      .catch((e) => { if (!huy) setTt({ ok: false, loi: String(e.message ?? e) }); });
    return () => { huy = true; };
  }, [mo.href]);
  useEffect(() => {
    nutDong.current?.focus();
    const cu = document.body.style.overflow; document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); dong(); return; }
      if (e.key === 'Tab' && khung.current) {
        const els = Array.from(khung.current.querySelectorAll<HTMLElement>('a[href],button,summary,[tabindex="0"]'));
        if (!els.length) return;
        const dau = els[0]; const cuoi = els[els.length - 1];
        if (e.shiftKey && document.activeElement === dau) { e.preventDefault(); cuoi.focus(); }
        else if (!e.shiftKey && document.activeElement === cuoi) { e.preventDefault(); dau.focus(); }
      }
    };
    document.addEventListener('keydown', onKey, true);
    return () => { document.removeEventListener('keydown', onKey, true); document.body.style.overflow = cu; };
  }, [dong]);
  const dau = tt && tt.ok ? docDauBanChup(tt.tho) : null;
  return (
    <div className="bcm-nen" onMouseDown={(e) => { if (e.target === e.currentTarget) dong(); }}>
      <div className="bcm" role="dialog" aria-modal="true" aria-labelledby="bcm-h" ref={khung}>
        <header className="bcm-dau">
          <div>
            <div className="md-eyebrow">Bản chụp nguyên văn</div>
            <h2 id="bcm-h" className="bcm-h">{dau?.tenMien ?? mo.href.replace('/evidence/', '')}</h2>
            {dau?.nhan && <p className="bcm-phu">{dau.nhan}</p>}
          </div>
          <div className="bcm-nut">
            <a className="pf-link" href={mo.href} target="_blank" rel="noopener noreferrer">Bản thô</a>
            <button type="button" ref={nutDong} className="bcm-dong-nut" onClick={dong} aria-label="Đóng bản chụp">Đóng</button>
          </div>
        </header>
        <div className="bcm-noi">
          {tt === null && <p className="pf-ctx pf-ctx--cho">Đang đọc bản chụp…</p>}
          {tt && !tt.ok && <p className="pf-ctx pf-ctx--loi">Không mở được bản chụp {mo.href} ({tt.loi}). Đây là lỗi, không phải thiếu nguồn.</p>}
          {tt && tt.ok && <NoiDung tho={tt.tho} span={mo.span} />}
        </div>
        <footer className="bcm-chan">Văn bản chép nguyên văn từ trang nguồn lúc chụp; chỉ bỏ dấu # của tiêu đề. Dòng có nhãn là chữ của người chụp, không phải của nguồn.</footer>
      </div>
    </div>
  );
}

export function BanChupProvider({ children }: { children: React.ReactNode }) {
  const [mo, setMo] = useState<Mo | null>(null);
  const truoc = useRef<HTMLElement | null>(null);
  const moCuaSo = useCallback((m: Mo) => { truoc.current = document.activeElement as HTMLElement | null; setMo(m); }, []);
  const dong = useCallback(() => { setMo(null); truoc.current?.focus(); }, []);
  return (
    <Ctx.Provider value={moCuaSo}>
      {children}
      {mo && <CuaSo mo={mo} dong={dong} />}
    </Ctx.Provider>
  );
}
