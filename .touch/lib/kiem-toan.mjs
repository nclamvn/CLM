/**
 * kiem-toan.mjs · Ma kiem toan cho ho so nang luc cua moi don vi (01/10/2026, tinh nang dac sac so 3).
 *
 * Y TUONG: mot ho so gui cho khach hang hay nha dau tu phai KIEM LAI DUOC ma khong can tin ben gui.
 * Ma kiem toan la SHA-256 cua dang chuan (canonical) cua moi cau nguon cua don vi va dau vet
 * SHA-256 cua tung ban chup ma cau nguon dua vao. Sua mot chu trong cau nguon, hay sua ban chup,
 * thi ma doi. Ai co tep ho so cung tinh lai duoc bang scripts/kiem-ho-so.mjs.
 *
 * Ham thuan: nhan chuoi, tra chuoi. Bam (sha256) duoc truyen vao de dung chung cho Node (build,
 * cong kiem, cong cu doi chieu) ma khong keo module crypto vao giao dien.
 */
export const PHIEN_BAN = 'clm-kiem-toan/1';

/** Dang chuan cua ho so: cau nguon sap theo (truong, ban chup, cau), ban chup sap theo href. */
export function dangChuan(donVi, cauNguon, banChup) {
  const cau = cauNguon.map((e) => [e.field, String(e.value), e.span, e.href, e.tier, e.source])
    .sort((a, b) => (a[0] + '\u0000' + a[3] + '\u0000' + a[2]).localeCompare(b[0] + '\u0000' + b[3] + '\u0000' + b[2]));
  const chup = [...banChup].sort((a, b) => a.href.localeCompare(b.href)).map((b) => [b.href, b.sha256]);
  return JSON.stringify({ phienBan: PHIEN_BAN, donVi, cauNguon: cau, banChup: chup });
}

/**
 * Dung ho so kiem toan cho mot don vi.
 * @param {{name:string, evidence:any[]}} u
 * @param {(href:string)=>string|null} docBanChup  noi dung ban chup ma web phuc vu (null neu thieu)
 * @param {(s:string)=>string} sha256  ham bam tra hex
 */
export function dungHoSoKiemToan(u, docBanChup, sha256) {
  const hrefs = [...new Set(u.evidence.map((e) => e.href))];
  const banChup = hrefs.map((href) => {
    const t = docBanChup(href);
    return { href, sha256: t === null ? null : sha256(t) };
  });
  const chuan = dangChuan(u.name, u.evidence, banChup);
  const ma = sha256(chuan);
  return { donVi: u.name, phienBan: PHIEN_BAN, ma, maNgan: `${ma.slice(0, 4)}-${ma.slice(4, 8)}-${ma.slice(8, 12)}`, soCau: u.evidence.length, banChup };
}
