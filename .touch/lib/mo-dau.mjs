/**
 * mo-dau.mjs · Du lieu man M0 "Mo dau" (trang /dashboard). Ham thuan, tat dinh; dung chung cho script
 * sinh, trang web va cong check-mo-dau.mjs.
 *
 * VI SAO (29/09/2026): trang Tong quan cu la anh chup tay ngay 19/07/2026 (14 don vi, 64 claim,
 * "Gates 4/4", "DEADLINE 20/07 (NGAY MAI)") kem HANG VIEC NOI BO co ten nguoi. No la man mac dinh
 * cua dashboard, tuc la thu nha dau tu thay DAU TIEN. Man nay thay the no: moi so doc tu cac file
 * da sinh va da qua cong cua tung man, khong so nao go tay.
 * Ba khoi: so chinh (bam ra nguon), bang tu khai diem yeu, sau cua vao man, moi cua mot su that.
 */

export function dungMoDau({ reg, mat, graph, thiTruong, thoiCuoc, hoSo, matching }) {
  const claims = reg.units.flatMap((u) => u.evidence);
  const cc = reg.meta.chuoiCong ?? null;
  const k = thiTruong.kpi;
  const cs = graph.boCuc.chiSo;
  return {
    so: {
      donVi: reg.units.length,
      cauNguon: claims.length,
      tierA: claims.filter((e) => e.tier === 'A').length,
      banChup: new Set(claims.map((e) => e.href)).size,
      matchDaKy: mat.signedMatches.length,
      tuChoi: mat.rejectedPairs.length,
      nhuCau: reg.needs.length,
      ncCoCung: k.ncCoCung,
      ncTrong: k.ncTrong,
      capCungCau: k.soCap,
    },
    chuoiCong: cc ? { xanh: cc.xanh, tong: cc.tong, dat: cc.dat, luc: cc.luc } : null,
    diemYeu: {
      chuaDinhDanh: hoSo.units.filter((u) => u.dinhDanh.trangThai === 'chua_dinh_danh').length,
      quaHanChuaLyDo: hoSo.units.reduce((s, u) => s + u.doTuoi.quaHan, 0),
      giuNguonCu: hoSo.units.reduce((s, u) => s + u.doTuoi.giuNguonCu, 0),
      deXuatChoDuyet: thoiCuoc.meta.theoLan.de_xuat,
    },
    cua: [
      { href: '/dashboard/thi-truong', ten: 'Toàn cảnh thị trường', su: `${k.ncTrong}/${k.soNc} nhu cầu quốc gia chưa có bên cung` },
      { href: '/dashboard/thoi-cuoc', ten: 'Dòng thời cuộc', su: `${thoiCuoc.suKien.length} sự kiện có nguồn, từ ${thoiCuoc.meta.tu.slice(0, 4)} đến nay` },
      { href: '/dashboard/do-thi', ten: 'Đồ thị cung cầu', su: `${cs.giaoCanh} giao cắt trên ${cs.soCanhVe} cạnh cung cầu` },
      { href: '/dashboard/don-vi', ten: 'Hồ sơ đơn vị', su: `${hoSo.units.length} hồ sơ, không điểm tổng hợp` },
      { href: '/dashboard/matching', ten: 'Matching Workbench', su: `${mat.signedMatches.filter((m) => matching.phanRa[m.id]?.lamTron === m.score).length}/${mat.signedMatches.length} điểm tự dựng lại khớp engine` },
      { href: '/dashboard/registry', ten: 'Evidence Registry', su: `${claims.length} câu nguồn, ${claims.filter((e) => e.tier === 'A').length} tier A` },
    ],
    ban_do: { canhNoiHaiNhom: cs.canhNoiHaiLanhTho, soNhom: graph.boCuc.lanhTho.filter((l) => l.so !== null).length },
    mocNgay: reg.meta.generatedAt,
  };
}
