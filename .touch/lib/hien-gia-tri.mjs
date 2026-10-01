/**
 * hien-gia-tri.mjs · Doi gia tri MA trong so nguon thanh chu nguoi doc (01/10/2026, nghiem thu
 * enterprise muc 10). So nguon giu ma de may doc ("28", "9", "vien"); lop hien thi doi thanh
 * "P28 · Ve tinh ...", "Nhom 9 · Hang khong va vu tru", "Vien nghien cuu". Khong doi du lieu.
 *
 * Ten san pham khong go tay: lay tu lib/hub-ten.json do gen-hub-data.mjs sinh tu danh muc nhu cau
 * trong registry; cong check-ho-so.mjs (TEN_LECH) doi chieu lai.
 */
export const TEN_NHOM = {
  1: 'Công nghệ số', 2: 'Mạng di động thế hệ sau', 3: 'Robot và tự động hoá',
  4: 'Sinh học và y sinh', 5: 'Năng lượng và vật liệu', 6: 'Chip bán dẫn',
  7: 'An ninh mạng và lượng tử', 8: 'Biển, đại dương, lòng đất',
  9: 'Hàng không và vũ trụ', 10: 'Đường sắt tốc độ cao',
};
export const LOAI_HINH = { DN: 'Doanh nghiệp', vien: 'Viện nghiên cứu', truong: 'Trường đại học' };
export const maSp = (v) => String(v).replace(/^P/i, '').padStart(2, '0');

/** tenSp: { "01": "Mo hinh ngon ngu lon ...", ... } tu lib/hub-ten.json. */
export function hienGiaTri(truong, giaTri, tenSp) {
  if (truong === 'loai_hinh') return LOAI_HINH[giaTri] ?? giaTri;
  if (truong === 'nhom_cncl' || truong.startsWith('nhom_cncl_phu')) {
    const t = TEN_NHOM[Number(giaTri)];
    return t ? `Nhóm ${Number(giaTri)} · ${t}` : giaTri;
  }
  if (truong === 'san_pham_lien_quan') {
    const m = maSp(giaTri); const t = tenSp?.[m];
    return t ? `P${m} · ${t}` : giaTri;
  }
  return giaTri;
}

/** Dung boi gen-hub-data va check-ho-so: ma san pham -> ten, tu danh muc nhu cau cua registry. */
export function dungTenSp(needs) {
  return Object.fromEntries(needs.map((n) => [maSp(n.id.replace(/^CNCL-P/, '')), n.value]).sort((a, b) => a[0].localeCompare(b[0])));
}
