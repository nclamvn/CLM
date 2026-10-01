/**
 * xu-huong.mjs · Chuoi so theo thoi gian cho trang Tong quan, rut tu LICH SU GIT cua hai file du lieu
 * da qua cong (lib/cncl-registry.json, lib/cncl-match.json). Ham thuan, tat dinh; dung chung cho
 * scripts/gen-xu-huong.mjs (sinh) va scripts/check-xu-huong.mjs (tinh lai doc lap).
 *
 * VI SAO (01/10/2026, nghiem thu enterprise muc 11): cac chi so tren man la so tinh, nha dau tu
 * mua tang truong. Lich su da nam san trong git (moi lan du lieu doi la mot commit), nen khong
 * can them kho luu tru nao: chi doc lai.
 *
 * Moi diem: so lieu tai commit CUOI CUNG cua mot ngay (gio Viet Nam theo dau thoi gian commit).
 */
export const DUONG_DU_LIEU = ['.touch/lib/cncl-registry.json', '.touch/lib/cncl-match.json'];

/** banGhi: [{ sha, luc (ISO co mui gio), reg (JSON registry hoac null), mat (JSON match hoac null) }] cu -> moi. */
export function dungXuHuong(banGhi, sinhTu) {
  let reg = null; let mat = null;
  const theoNgay = new Map();
  for (const b of banGhi) {
    if (b.reg) reg = b.reg;
    if (b.mat) mat = b.mat;
    if (!reg) continue;
    const ev = (reg.units ?? []).flatMap((u) => u.evidence ?? []);
    theoNgay.set(b.luc.slice(0, 10), {
      ngay: b.luc.slice(0, 10),
      donVi: (reg.units ?? []).length,
      cauNguon: ev.length,
      hangA: ev.filter((e) => e.tier === 'A').length,
      matchDaKy: mat ? (mat.signedMatches ?? []).length : 0,
    });
  }
  return { sinhTu, diem: [...theoNgay.values()] };
}

/** Thay doi tu diem dau toi diem cuoi cua mot chi so. */
export function tangTu(xh, khoa) {
  const d = xh.diem;
  if (d.length < 2) return null;
  return { tu: d[0].ngay, truoc: d[0][khoa], nay: d[d.length - 1][khoa], tang: d[d.length - 1][khoa] - d[0][khoa] };
}
