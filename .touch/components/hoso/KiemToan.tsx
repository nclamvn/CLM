'use client';

/**
 * KiemToan · Khoi "Ho so kiem toan duoc" tren trang ho so don vi (01/10/2026, tinh nang dac sac so 3).
 *
 * Hien ma kiem toan (SHA-256 cua cau nguon + ban chup, tinh luc build boi lib/kiem-toan.mjs) va
 * nut tai tep ho so JSON. Nguoi nhan tep tinh lai ma bang scripts/kiem-ho-so.mjs: khop la ho so
 * chua bi sua mot chu nao ke tu khi sinh.
 * 25/10/2026: them nut "Kiem lai ngay tren trinh duyet". Kho ma la kho rieng, nen "nguoi nhan chay
 * scripts/kiem-ho-so.mjs" khong dung voi nguoi ngoai. Nut nay tai lai tung ban chup ma trang dang
 * phuc vu, bam SHA-256 bang Web Crypto cua chinh trinh duyet, dung lai dang chuan bang CHINH ham
 * dangChuan cua lib/kiem-toan.mjs, va so voi ma in tren trang. Khong gui gi ra ngoai.
 */
import { useState } from 'react';
import type { CnclEvidence } from '@/lib/cncl-registry';
import { dangChuan } from '@/lib/kiem-toan.mjs';

const bam = async (t: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)))).map((b) => b.toString(16).padStart(2, '0')).join('');
type KetQuaKiem = { dang: true } | { dang: false; khop: boolean; ma: string; chupKhop: number; tong: number; lech: string[] };

export type HoSoKiemToan = {
  donVi: string; phienBan: string; ma: string; maNgan: string; soCau: number;
  banChup: { href: string; sha256: string | null }[];
};

export function KiemToan({ kt, bangChung }: { kt: HoSoKiemToan; bangChung: CnclEvidence[] }) {
  const [kq, setKq] = useState<KetQuaKiem | null>(null);
  const kiemLai = async () => {
    setKq({ dang: true });
    const lech: string[] = [];
    const chup = await Promise.all(kt.banChup.map(async (b) => {
      try {
        const r = await fetch(b.href);
        if (!r.ok) { lech.push(`không tải được ${b.href}`); return { href: b.href, sha256: null }; }
        const h = await bam(await r.text());
        if (h !== b.sha256) lech.push(`bản chụp ${b.href} khác dấu vết đã in`);
        return { href: b.href, sha256: h };
      } catch { lech.push(`không tải được ${b.href}`); return { href: b.href, sha256: null }; }
    }));
    const ma = await bam(dangChuan(kt.donVi, bangChung, chup, kt.phienBan));
    if (ma !== kt.ma) lech.push('mã tính lại khác mã in trên trang');
    setKq({ dang: false, khop: lech.length === 0, ma, chupKhop: chup.filter((c, i) => c.sha256 === kt.banChup[i].sha256).length, tong: chup.length, lech });
  };
  const tai = () => {
    const tep = {
      phienBan: kt.phienBan, donVi: kt.donVi, ma: kt.ma,
      cauNguon: bangChung.map((e) => ({ field: e.field, value: String(e.value), span: e.span, href: e.href, tier: e.tier, source: e.source })),
      banChup: kt.banChup,
      huongDan: 'Tính lại mã: node scripts/kiem-ho-so.mjs <tệp này> trong kho mã CàoLọcMatch. Khớp nghĩa là hồ sơ chưa bị sửa.',
    };
    const url = URL.createObjectURL(new Blob([JSON.stringify(tep, null, 1)], { type: 'application/json' }));
    const a = document.createElement('a'); a.href = url; a.download = `ho-so-kiem-toan-${kt.maNgan}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <section className="dash-panel hs-sec kt" aria-labelledby="kt-h">
      <h2 className="hs-h" id="kt-h">Hồ sơ kiểm toán được <span>ai nhận hồ sơ cũng tính lại được mã này</span></h2>
      <div className="kt-dong">
        <div>
          <div className="kt-nhan">Mã kiểm toán</div>
          <div className="kt-ma">{kt.maNgan}</div>
          <div className="kt-day" title="SHA-256 đầy đủ">{kt.ma}</div>
        </div>
        <p className="kt-giai">
          Mã là dấu băm SHA-256 của {kt.soCau} câu nguồn nguyên văn và {kt.banChup.length} bản chụp mà các câu đó dựa vào.
          Sửa một chữ trong câu nguồn hay trong bản chụp thì mã đổi. Bấm “Kiểm lại ngay trên trình duyệt” để trình duyệt tự tải lại bản chụp và tính lại mã; người có kho mã còn đối chiếu được tệp tải về bằng công cụ dòng lệnh.
        </p>
        <div className="kt-nut">
          <button type="button" className="reg-pill" onClick={kiemLai} disabled={kq?.dang === true}>Kiểm lại ngay trên trình duyệt</button>
          <button type="button" className="reg-pill" onClick={tai}>Tải hồ sơ kiểm toán (JSON)</button>
        </div>
      </div>
      {kq && (
        <p className="kt-kq" role="status" aria-live="polite">
          {kq.dang ? 'Đang tải lại bản chụp và tính lại mã…'
            : kq.khop ? `Khớp. Trình duyệt của anh chị vừa tải lại ${kq.tong} bản chụp, tính lại dấu băm từng bản (${kq.chupKhop}/${kq.tong} trùng) và tính lại mã: ${kq.ma.slice(0, 4)}-${kq.ma.slice(4, 8)}-${kq.ma.slice(8, 12)}, trùng mã in trên trang. Không có dữ liệu nào gửi ra ngoài.`
              : `Lệch: ${kq.lech.join('; ')}. Hồ sơ trên trang không còn khớp câu nguồn hoặc bản chụp đang phục vụ.`}
        </p>)}
    </section>
  );
}
