'use client';

/**
 * DanhSachDonVi · Bang 44 don vi, cua vao M3. Sap mac dinh theo NHOM roi TEN, khong theo mot
 * "diem" nao: bang nay khong xep hang ai hon ai. Nguoi xem tu bam cot de sap.
 */
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { khoaTim } from '@/lib/tim-kiem.mjs';
import type { HoSo } from './HoSoDonVi';

type Cot = 'nhom' | 'ten' | 'cau' | 'moiNhat' | 'match' | 'trong';
const soSanh = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);
const ngayVN = (d: string | null) => (d ? `${d.slice(8, 10)}/${d.slice(5, 7)}/${d.slice(0, 4)}` : 'chưa rõ');

export function DanhSachDonVi({ ds, nhoms }: { ds: HoSo[]; nhoms: { so: string; nhan: string }[] }) {
  const [q, setQ] = useState('');
  const [nhom, setNhom] = useState<string | null>(null);
  const [cot, setCot] = useState<Cot>('nhom');
  const [giam, setGiam] = useState(false);
  const loc = useMemo(() => {
    const k = khoaTim(q);
    const theo = (h: HoSo): [number | string, string] => {
      switch (cot) {
        case 'ten': return [h.ten, h.ten];
        case 'cau': return [h.dem.cauNguon, h.ten];
        case 'moiNhat': return [h.doTuoi.moiNhat ?? '', h.ten];
        case 'match': return [h.dem.matchDaKy, h.ten];
        case 'trong': return [h.oTrong.length, h.ten];
        default: return [Number(h.lanhTho ?? 99), h.ten];
      }
    };
    return ds
      .filter((h) => (!nhom || h.nhoms.some((n) => n.so === nhom)) && (!k || k.split(' ').every((w) => khoaTim(`${h.ten} ${h.nhoms.map((n) => n.nhan).join(' ')}`).split(' ').some((t) => t.startsWith(w)))))
      .sort((a, b) => {
        const [x, xt] = theo(a); const [y, yt] = theo(b);
        const c = typeof x === 'number' && typeof y === 'number' ? x - y : soSanh(String(x), String(y));
        return (giam ? -c : c) || soSanh(xt, yt);
      });
  }, [ds, q, nhom, cot, giam]);
  const tieuDe = (c: Cot, nhan: string) => (
    <th scope="col" aria-sort={cot === c ? (giam ? 'descending' : 'ascending') : 'none'}>
      <button type="button" onClick={() => { if (cot === c) setGiam((v) => !v); else { setCot(c); setGiam(c === 'cau' || c === 'match' || c === 'moiNhat'); } }}>
        {nhan}{cot === c ? (giam ? ' ↓' : ' ↑') : ''}
      </button>
    </th>);
  return (
    <section className="dash-panel hs-ds" aria-label="Danh sách đơn vị">
      <div className="hs-ds__ctrl">
        <input className="hs-ds__q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Lọc theo tên hoặc nhóm, gõ không dấu cũng được" aria-label="Lọc đơn vị" />
        <div className="hs-ds__nhom" role="group" aria-label="Lọc theo nhóm">
          <button type="button" aria-pressed={nhom === null} onClick={() => setNhom(null)}>Tất cả</button>
          {nhoms.map((n) => (
            <button key={n.so} type="button" aria-pressed={nhom === n.so} onClick={() => setNhom(nhom === n.so ? null : n.so)} title={n.nhan} style={{ '--mau': `var(--nhom-${n.so})` } as React.CSSProperties}><i className="mau-cham" aria-hidden="true" />{n.so.padStart(2, '0')}</button>))}
        </div>
        <span className="hs-ds__dem">{loc.length}/{ds.length} đơn vị</span>
      </div>
      <div className="hs-ds__wrap">
        <table className="hs-tbl">
          <thead><tr>
            {tieuDe('ten', 'Đơn vị')}{tieuDe('nhom', 'Nhóm')}{tieuDe('cau', 'Câu nguồn')}
            <th scope="col">Độ tươi</th>{tieuDe('moiNhat', 'Bài mới nhất')}{tieuDe('match', 'Match đã ký')}{tieuDe('trong', 'Ô trống')}
          </tr></thead>
          <tbody>
            {loc.map((h) => {
              const tong = h.dem.cauNguon || 1; const t = h.doTuoi;
              return (
                <tr key={h.slug}>
                  <th scope="row"><Link href={`/dashboard/don-vi/${h.slug}`}>{h.ten}</Link>{h.favorsRtr && <span className="hs-chip hs-chip--coi hs-chip--nho">RtR</span>}</th>
                  <td className="hs-tbl__nhom">{h.nhoms.map((n) => n.so.padStart(2, '0')).join(' · ') || '··'}</td>
                  <td className="hs-tbl__so">
                    <span>{h.dem.cauNguon}</span>
                    <span className="hs-tier3" aria-label={`tier A ${h.dem.theoTier.A}, B ${h.dem.theoTier.B}, C ${h.dem.theoTier.C}`}>
                      <i className="hs-tier3--A" style={{ flexGrow: h.dem.theoTier.A / tong }} /><i className="hs-tier3--B" style={{ flexGrow: h.dem.theoTier.B / tong }} /><i className="hs-tier3--C" style={{ flexGrow: h.dem.theoTier.C / tong }} />
                    </span>
                  </td>
                  <td>
                    <div className="hs-tuoi" role="img" aria-label={`${t.tuoi} tươi, ${t.ben} không hết hạn, ${t.giuNguonCu} nguồn cũ có lý do, ${t.quaHan} quá hạn chưa lý do`}>
                      {[['tuoi', t.tuoi], ['ben', t.ben], ['giu_nguon_cu', t.giuNguonCu], ['qua_han', t.quaHan]].filter(([, v]) => Number(v) > 0).map(([k, v]) => (
                        <span key={k} className={`hs-tuoi__p hs-tt--${k}`} style={{ flexGrow: Number(v) }} />))}
                    </div>
                  </td>
                  <td className="hs-tbl__ngay">{ngayVN(t.moiNhat)}</td>
                  <td className="hs-tbl__so">{h.dem.matchDaKy > 0 ? <span className="hs-tbl__match"><i aria-hidden="true" />{h.dem.matchDaKy}</span> : <span className="hs-tbl__0">0</span>}</td>
                  <td className="hs-tbl__so">{h.oTrong.length}</td>
                </tr>);
            })}
          </tbody>
        </table>
      </div>
      <div className="hs-ds__cg">
        <span><i className="hs-mk2 hs-tt--tuoi" />tươi (trong ngưỡng)</span>
        <span><i className="hs-mk2 hs-tt--ben" />không hết hạn (tên, nhóm, sản phẩm)</span>
        <span><i className="hs-mk2 hs-tt--giu_nguon_cu" />nguồn cũ, có lý do giữ</span>
        <span><i className="hs-mk2 hs-tt--qua_han" />quá hạn, chưa có lý do</span>
      </div>
    </section>
  );
}
