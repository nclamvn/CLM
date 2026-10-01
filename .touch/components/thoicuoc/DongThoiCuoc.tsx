'use client';

/**
 * DongThoiCuoc · Man M5 "Dong thoi cuoc". Dung 29/09/2026.
 *
 * Mot truc thoi gian, bon lan: chinh sach, tin ve don vi, quyet dinh cua nguoi gac cong, de xuat
 * cua vong tu chay (chua duyet). Tren cung la mat do su kien theo thang. Moc chinh sach ke mot vach
 * mo xuyen ca bon lan: doc tin don vi trong boi canh chinh sach.
 * Doi khoang thoi gian thi cac diem truot sang vi tri moi (chuyen canh co hoat hoa, Heer & Robertson
 * 2007); prefers-reduced-motion thi nhay thang.
 * Du lieu: lib/hub-thoi-cuoc.json (lib/thoi-cuoc.mjs), cong check-thoi-cuoc tinh lai.
 */
import Link from 'next/link';
import { useMemo, useState } from 'react';
import tc from '@/lib/hub-thoi-cuoc.json';
import { useProof } from '@/components/proof/ProofLayer';

type Nguon = { ten: string; href: string; tier: string | null; span: string | null };
type SuKien = {
  id: string; ngay: string; lan: 'chinh_sach' | 'don_vi' | 'quyet_dinh' | 'de_xuat'; tieuDe: string;
  nguon: Nguon[]; tier: string | null; donVi: { ten: string; slug: string | null }[]; nhuCau: string[]; nhom: string[];
  soCau?: number; trangThai: 'may_trich' | 'da_kiem' | 'da_ky' | 'tu_choi' | 'cho_duyet'; href: string | null;
  vanBan?: string; loai?: string; ghiChu?: string | null; nguoi?: string; lyDo?: string; matchId?: string;
};
type TC = { meta: { mocNgay: string; tu: string; den: string; theoLan: Record<string, number>; baiMoiNhat: string }; suKien: SuKien[]; matDo: ({ thang: string } & Record<string, number>)[] };
const D = tc as unknown as TC;
const LAN = [
  { k: 'chinh_sach', nhan: 'Chính sách' }, { k: 'don_vi', nhan: 'Tin về đơn vị' },
  { k: 'quyet_dinh', nhan: 'Quyết định gác cổng' }, { k: 'de_xuat', nhan: 'Đề xuất chờ duyệt' },
] as const;
const TT: Record<SuKien['trangThai'], string> = {
  may_trich: 'máy trích, cổng kiểm câu nguồn', da_kiem: 'đã qua cổng registry', da_ky: 'đã ký', tu_choi: 'bị từ chối', cho_duyet: 'chờ người duyệt',
};
const KHOANG = [
  { k: 'toan_bo', nhan: 'Toàn bộ' }, { k: '3_nam', nhan: '3 năm' }, { k: '15_thang', nhan: 'Từ QĐ 1131' }, { k: '6_thang', nhan: '6 tháng' },
] as const;
type Khoang = typeof KHOANG[number]['k'];
const ngayVN = (d: string) => `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}`;
const thangVN = (t: string) => `${t.slice(5, 7)}/${t.slice(0, 4)}`;
const ms = (d: string) => Date.parse(`${d}T00:00:00Z`);
const tru = (d: string, thang: number) => { const x = new Date(ms(d)); x.setUTCMonth(x.getUTCMonth() - thang); return x.toISOString().slice(0, 10); };

function TrucThoiGian({ ds, tu, den, chon, datChon }: { ds: SuKien[]; tu: string; den: string; chon: string | null; datChon: (id: string | null) => void }) {
  const W = 1200; const TRAI = 150; const PHAI = 30; const TREN = 76; const LAN_H = 58;
  const H = TREN + LAN.length * LAN_H + 30;
  const t0 = ms(tu); const t1 = ms(den);
  const x = (d: string) => TRAI + ((ms(d) - t0) / Math.max(1, t1 - t0)) * (W - TRAI - PHAI);
  const trongKhoang = ds.filter((e) => e.ngay >= tu && e.ngay <= den);
  const matDo = D.matDo.filter((m) => `${m.thang}-31` >= tu && `${m.thang}-01` <= den);
  const maxMd = Math.max(1, ...matDo.map((m) => LAN.reduce((s, l) => s + (m[l.k] ?? 0), 0)));
  const soNam = (t1 - t0) / (365.25 * 86400000);
  const moc: string[] = [];
  const d0 = new Date(t0);
  if (soNam > 2.5) { for (let y = d0.getUTCFullYear() + 1; Date.UTC(y, 0, 1) <= t1; y++) moc.push(`${y}-01-01`); }
  else { const c = new Date(Date.UTC(d0.getUTCFullYear(), d0.getUTCMonth() + 1, 1)); const buoc = soNam > 1 ? 3 : 1; while (c.getTime() <= t1) { if (c.getUTCMonth() % buoc === 0) moc.push(c.toISOString().slice(0, 10)); c.setUTCMonth(c.getUTCMonth() + 1); } }
  const yLan = (l: string) => TREN + LAN.findIndex((q) => q.k === l) * LAN_H + LAN_H / 2;
  const bw = Math.max(1.5, ((W - TRAI - PHAI) / Math.max(1, (t1 - t0) / (30.44 * 86400000))) * 0.72);
  // Xep chong diem cung lan, gan nhau: dich len xuong de khong de len nhau.
  const lech = new Map<string, number>();
  for (const l of LAN) {
    const cua = trongKhoang.filter((e) => e.lan === l.k);
    cua.forEach((e, i) => { let k = 0; for (let j = i - 1; j >= 0 && Math.abs(x(cua[j].ngay) - x(e.ngay)) < 11; j--) k++; lech.set(e.id, ((k % 3) - (k % 3 === 2 ? 3 : 0)) * 12); });
  }
  // Lan chinh sach: diem giu tren truc (vach doc phai dung ngay), chi NHAN xep tang khi gan nhau.
  const tangNhan = new Map<string, number>();
  const cs = trongKhoang.filter((e) => e.lan === 'chinh_sach');
  // Dat nhan theo BE RONG, khong theo khoang cach diem (sua 29/09/2026). Luat cu dem so diem gan
  // trong 46px, nen nhan "QĐ 21/2026 hiệu lực" (~93px) cach QĐ 769 hai thang van cung tang va de len
  // nhau. Nay: w uoc tu so ky tu (co 10px dam); o moi tang thu ba cach neo (giua, ben phai, ben trai
  // diem), chon cach dau tien khong cham nhan nao da dat va khong ra ngoai khung. Het cach moi len
  // tang tren. Tang thap duoc uu tien vi tang cao cham vao dai mat do.
  const nhanCS = (e: SuKien) => `${e.vanBan?.replace('/QĐ-TTg', '') ?? ''}${e.loai === 'hieu_luc' ? ' hiệu lực' : ''}`;
  const neoNhan = new Map<string, 'middle' | 'start' | 'end'>();
  const daDat: [number, number][][] = [];
  [...cs].sort((a, b) => x(a.ngay) - x(b.ngay)).forEach((e) => {
    const w = nhanCS(e).length * 6.4 + 8; const cx = x(e.ngay);
    const cach: ['middle' | 'start' | 'end', number, number][] = [['middle', cx - w / 2, cx + w / 2], ['start', cx - 4, cx + w - 4], ['end', cx - w + 4, cx + 4]];
    // Thu tu tang: sat tren diem (0), ngay duoi diem (-1, khoang trong giua hai lan), roi len dan.
    for (let t = 0; ; t++) {
      const k = t === 0 ? 0 : t === 1 ? -1 : t - 1;
      const o = daDat[k + 1] = daDat[k + 1] ?? [];
      const hop = cach.find(([, a, b]) => a >= TRAI - 40 && b <= W - 4 && o.every(([p, q]) => b <= p || a >= q));
      if (hop) { o.push([hop[1], hop[2]]); tangNhan.set(e.id, k); neoNhan.set(e.id, hop[0]); break; }
    }
    lech.set(e.id, 0);
  });
  return (
    <svg className="tc-svg" viewBox={`0 0 ${W} ${H}`} role="group" aria-label={`Dòng thời gian ${trongKhoang.length} sự kiện từ ${ngayVN(tu)} đến ${ngayVN(den)}. Danh sách đầy đủ ở dưới.`}
      onClick={(e) => { if ((e.target as Element).tagName === 'svg') datChon(null); }}>
      <text x={TRAI - 12} y={40} textAnchor="end" className="tc-lan">Mật độ / tháng</text>
      {matDo.map((m) => {
        const tong = LAN.reduce((s, l) => s + (m[l.k] ?? 0), 0); if (!tong) return null;
        const xx = x(`${m.thang}-15`); let day = 60;
        return (
          <g key={m.thang} className="tc-md">
            {LAN.map((l) => { const v = m[l.k] ?? 0; if (!v) return null; const h = (v / maxMd) * 44; day -= h; return <rect key={l.k} x={xx - bw / 2} y={day} width={bw} height={h} className={`tc-md__${l.k}`} />; })}
            <title>{`${thangVN(m.thang)}: ${tong} sự kiện`}</title>
          </g>);
      })}
      {moc.map((d) => (
        <g key={d}><line x1={x(d)} x2={x(d)} y1={TREN - 8} y2={H - 22} className="tc-luoi" />
          <text x={x(d) + 3} y={H - 8} className="tc-truc">{soNam > 2.5 ? d.slice(0, 4) : thangVN(d.slice(0, 7))}</text></g>))}
      {LAN.map((l) => (
        <g key={l.k}>
          <text x={TRAI - 12} y={yLan(l.k) + 4} textAnchor="end" className="tc-lan">{l.nhan}</text>
          <line x1={TRAI} x2={W - PHAI} y1={yLan(l.k)} y2={yLan(l.k)} className="tc-truc-lan" />
        </g>))}
      {trongKhoang.filter((e) => e.lan === 'chinh_sach').map((e) => (
        <line key={`v-${e.id}`} x1={x(e.ngay)} x2={x(e.ngay)} y1={yLan('chinh_sach')} y2={H - 22} className="tc-vach" style={{ transform: 'none' }} />))}
      <line x1={x(D.meta.mocNgay)} x2={x(D.meta.mocNgay)} y1={TREN - 8} y2={H - 22} className="tc-moc" />
      {trongKhoang.map((e) => {
        const on = e.id === chon;
        const cy = yLan(e.lan) + (lech.get(e.id) ?? 0);
        const r = e.lan === 'don_vi' ? 4 + Math.min(4, Math.sqrt(e.soCau ?? 1)) : 6;
        return (
          <g key={e.id} className={`tc-d tc-d--${e.lan} tc-d--${e.trangThai}${on ? ' is-chon' : ''}${chon && !on ? ' is-mo' : ''}`}
            style={{ transform: `translate(${x(e.ngay)}px, ${cy}px)` }}
            onClick={() => datChon(on ? null : e.id)} role="button" tabIndex={0} aria-label={`${ngayVN(e.ngay)}: ${e.tieuDe}`}
            onKeyDown={(k) => { if (k.key === 'Enter') datChon(on ? null : e.id); }}>
            {e.lan === 'chinh_sach' ? <rect x={-6} y={-6} width={12} height={12} rx={2} />
              : e.lan === 'quyet_dinh' ? <rect x={-5} y={-5} width={10} height={10} transform="rotate(45)" />
                : <circle r={r} />}
            <title>{`${ngayVN(e.ngay)} · ${e.tieuDe}`}</title>
            {e.lan === 'chinh_sach' && <text x={neoNhan.get(e.id) === 'start' ? -4 : neoNhan.get(e.id) === 'end' ? 4 : 0} y={(tangNhan.get(e.id) ?? 0) < 0 ? 20 : -12 - (tangNhan.get(e.id) ?? 0) * 12} textAnchor={neoNhan.get(e.id) ?? 'middle'} className="tc-d__vb">{nhanCS(e)}</text>}
          </g>);
      })}
    </svg>
  );
}

function TheSuKien({ e }: { e: SuKien }) {
  const { moMuc } = useProof();
  return (
    <article className={`tc-the tc-the--${e.lan}`} id={`sk-${e.id}`}>
      <div className="tc-the__dau">
        <time dateTime={e.ngay}>{ngayVN(e.ngay)}</time>
        <span className={`tc-tag tc-tag--${e.lan}`}>{LAN.find((l) => l.k === e.lan)?.nhan}</span>
        <span className={`tc-tt tc-tt--${e.trangThai}`}>{TT[e.trangThai]}</span>
        {e.tier && <span className={`pf-tier pf-tier--${e.tier[0]}`}>hạng {e.tier}</span>}
      </div>
      <h3 className="tc-the__ten">{e.tieuDe}</h3>
      {e.nguon.filter((n) => n.span).map((n, i) => (
        <blockquote key={i} className="tc-the__span">{n.span}<cite> · <a className="pf-link" href={n.href} target="_blank" rel="noopener noreferrer">{n.ten}</a></cite></blockquote>))}
      {e.lyDo && <blockquote className="tc-the__span">{e.lyDo}<cite> · {e.nguoi}, nguyên lời</cite></blockquote>}
      {e.ghiChu && <p className="tc-the__gc">Ghi chú: nguồn chính phủ không ghi ngày ký; ngày này chỉ có nguyên văn ở hai nguồn hạng B độc lập.</p>}
      <div className="tc-the__lk">
        {e.donVi.map((d) => d.slug
          ? <Link key={d.ten} href={`/dashboard/don-vi/${d.slug}`} className="tc-lk">{d.ten}</Link>
          : <span key={d.ten} className="tc-lk">{d.ten}</span>)}
        {e.nhuCau.map((p) => <span key={p} className="tc-p">{p}</span>)}
        {e.nguon.filter((n) => !n.span).map((n, i) => <a key={i} className="pf-link" href={n.href} target="_blank" rel="noopener noreferrer">nguồn · {n.ten}</a>)}
        {e.matchId && <button type="button" className="pf-link tc-nut" onClick={() => moMuc({ loai: 'so', khoa: 'matches' })}>{e.matchId} · {e.nguoi}</button>}
      </div>
    </article>
  );
}

export function DongThoiCuoc() {
  const [khoang, setKhoang] = useState<Khoang>('3_nam');
  const [bat, setBat] = useState<Record<string, boolean>>({ chinh_sach: true, don_vi: true, quyet_dinh: true, de_xuat: true });
  const [chon, setChon] = useState<string | null>(null);
  const den = D.meta.mocNgay;
  const tu = khoang === 'toan_bo' ? D.meta.tu.slice(0, 7) + '-01' : khoang === '3_nam' ? tru(den, 36) : khoang === '15_thang' ? '2025-06-01' : tru(den, 6);
  const ds = useMemo(() => D.suKien.filter((e) => bat[e.lan]), [bat]);
  const trongKhoang = ds.filter((e) => e.ngay >= tu && e.ngay <= den);
  const theoThang = useMemo(() => {
    const m = new Map<string, SuKien[]>();
    for (const e of [...trongKhoang].reverse()) { const k = e.ngay.slice(0, 7); if (!m.has(k)) m.set(k, []); m.get(k)!.push(e); }
    return [...m];
  }, [trongKhoang]);
  const eChon = chon ? D.suKien.find((e) => e.id === chon) : null;
  const k = D.meta.theoLan;
  return (
    <div className="tc">
      <section className="hs-kpi tc-kpi" aria-label="Chỉ số thời cuộc">
        <div className="hs-kpi__o tt-kpi__o"><span className="hs-kpi__v">{k.chinh_sach}</span><span className="hs-kpi__k">văn bản chính sách</span><span className="hs-kpi__phu">ngày đọc từ câu nguồn</span></div>
        <div className="hs-kpi__o tt-kpi__o"><span className="hs-kpi__v">{k.don_vi}</span><span className="hs-kpi__k">bài nguồn về đơn vị</span><span className="hs-kpi__phu">mới nhất {ngayVN(D.meta.baiMoiNhat)}</span></div>
        <div className="hs-kpi__o tt-kpi__o"><span className="hs-kpi__v hs-kpi__v--match"><i aria-hidden="true" />{k.quyet_dinh}</span><span className="hs-kpi__k">quyết định gác cổng</span><span className="hs-kpi__phu">ký và từ chối</span></div>
        <div className="hs-kpi__o tt-kpi__o"><span className="hs-kpi__v tt-kpi__trong">{k.de_xuat}</span><span className="hs-kpi__k">đề xuất chờ duyệt</span><span className="hs-kpi__phu">chưa là sự thật của registry</span></div>
      </section>

      <section className="dash-panel hs-sec" aria-labelledby="tc-h">
        <div className="tc-dau">
          <h2 className="hs-h" id="tc-h">Dòng thời gian <span>bấm một điểm để xem nguồn</span></h2>
          <div className="tc-ctrl">
            <div className="dt2-seg" role="tablist" aria-label="Khoảng thời gian">
              {KHOANG.map((q) => <button key={q.k} type="button" role="tab" aria-selected={khoang === q.k} onClick={() => { setKhoang(q.k); setChon(null); }}>{q.nhan}</button>)}
            </div>
            <div className="dt2-filters" role="group" aria-label="Lọc làn">
              {LAN.map((l) => (
                <button key={l.k} type="button" className={`dt2-chip tc-chip tc-chip--${l.k}`} aria-pressed={bat[l.k]} onClick={() => setBat((b) => ({ ...b, [l.k]: !b[l.k] }))}>
                  <span className="dt2-chip__mk" aria-hidden="true" />{l.nhan} <b>{D.suKien.filter((e) => e.lan === l.k && e.ngay >= tu && e.ngay <= den).length}</b>
                </button>))}
            </div>
          </div>
        </div>
        <div className="tc-khung"><TrucThoiGian ds={ds} tu={tu} den={den} chon={chon} datChon={setChon} /></div>
        {eChon && <div className="tc-chon"><TheSuKien e={eChon} /></div>}
        <p className="hs-note">
          Ngày của văn bản chính sách đọc từ câu nguồn, không từ tên bản chụp: tám bản chụp chiều cầu mang ngày chụp 18/07/2026.
          Tin về đơn vị theo ngày nguồn đăng bài. Vạch dọc là mốc chính sách, để đọc tin trong bối cảnh.
          Kho tin hằng ngày của Portal chưa nối vào đây: phải qua cầu nối một chiều vào hàng chờ duyệt.
        </p>
      </section>

      <section className="dash-panel hs-sec" aria-labelledby="tc-tin">
        <h2 className="hs-h" id="tc-tin">Dòng tin <span>{trongKhoang.length} sự kiện trong khoảng, mới nhất trước</span></h2>
        {/* 01/10/2026 (nghiem thu muc 8): trang dai 13.000px. Hai thang moi nhat mo san, cac thang
            khac thu gon thanh mot dong co dem va cac loai tin; bam de mo. */}
        {theoThang.map(([t, es], i) => (
          <details key={`${khoang}-${t}`} className="tc-thang" open={i < 2}>
            <summary className="tc-thang__h">Tháng {thangVN(t)} <span>{es.length} sự kiện</span>
              <span className="tc-thang__loai">{LAN.filter((l) => es.some((e) => e.lan === l.k)).map((l) => `${l.nhan} ${es.filter((e) => e.lan === l.k).length}`).join(' · ')}</span>
            </summary>
            <div className="tc-thang__ds">{es.map((e) => <TheSuKien key={e.id} e={e} />)}</div>
          </details>))}
      </section>
    </div>
  );
}
