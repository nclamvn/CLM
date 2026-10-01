'use client';

/**
 * KiemToan · Khoi "Ho so kiem toan duoc" tren trang ho so don vi (01/10/2026, tinh nang dac sac so 3).
 *
 * Hien ma kiem toan (SHA-256 cua cau nguon + ban chup, tinh luc build boi lib/kiem-toan.mjs) va
 * nut tai tep ho so JSON. Nguoi nhan tep tinh lai ma bang scripts/kiem-ho-so.mjs: khop la ho so
 * chua bi sua mot chu nao ke tu khi sinh.
 */
import type { CnclEvidence } from '@/lib/cncl-registry';

export type HoSoKiemToan = {
  donVi: string; phienBan: string; ma: string; maNgan: string; soCau: number;
  banChup: { href: string; sha256: string | null }[];
};

export function KiemToan({ kt, bangChung }: { kt: HoSoKiemToan; bangChung: CnclEvidence[] }) {
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
          Sửa một chữ trong câu nguồn hay trong bản chụp thì mã đổi. Người nhận chạy <code>node scripts/kiem-ho-so.mjs</code> trên tệp tải về để đối chiếu.
        </p>
        <button type="button" className="reg-pill" onClick={tai}>Tải hồ sơ kiểm toán (JSON)</button>
      </div>
    </section>
  );
}
