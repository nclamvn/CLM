/**
 * mo-dau.mjs · Du lieu man M0 "Mo dau" (trang /dashboard). Ham thuan, tat dinh; dung chung cho script
 * sinh, trang web va cong check-mo-dau.mjs.
 *
 * VI SAO (29/09/2026): trang Tong quan cu la anh chup tay ngay 19/07/2026 (14 don vi, 64 claim,
 * "Gates 4/4", "DEADLINE 20/07 (NGAY MAI)") kem HANG VIEC NOI BO co ten nguoi. No la man mac dinh
 * cua dashboard, tuc la thu nha dau tu thay DAU TIEN. Man nay thay the no: moi so doc tu cac file
 * da sinh va da qua cong cua tung man, khong so nao go tay.
 * Ba khoi: so chinh (bam ra nguon), bang tu khai diem yeu, sau cua vao man, moi cua mot su that.
 *
 * 01/10/2026 (nghiem thu enterprise muc 7): them ba khoi cho nguoi ra quyet dinh:
 *   nhom      do phu cung cau theo 10 nhom cong nghe (thay ban do thu nho khong nhan),
 *   chatLuong bon thanh tien do chat luong du lieu, moi thanh mot ti so dem duoc,
 *   viecTiep  viec can lam tiep, SINH tu diem yeu (so bang 0 thi viec bien mat), moi viec mot cua.
 * Duong xu huong theo ngay khong o day: no doc lich su git (lib/hub-xu-huong.json, cong xu_huong).
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
    chuoiCong: cc ? { xanh: cc.xanh, tong: cc.tong, dat: cc.dat, luc: cc.luc, nhanh: cc.cheDo === 'nhanh' } : null,
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
      { href: '/dashboard/matching', ten: 'Ghép cung cầu', su: `${mat.signedMatches.filter((m) => matching.phanRa[m.id]?.lamTron === m.score).length}/${mat.signedMatches.length} điểm tính lại khớp máy ghép` },
      { href: '/dashboard/registry', ten: 'Sổ nguồn', su: `${claims.length} câu nguồn, ${claims.filter((e) => e.tier === 'A').length} câu hạng A` },
    ],
    nhom: [...thiTruong.phu].sort((a, b) => Number(a.so) - Number(b.so)).map((g) => ({
      so: Number(g.so), nhan: g.nhan, soDv: g.soDv, soNc: g.soNc, coCung: g.coCung, daKy: g.daKy, trong: g.trong,
    })),
    chatLuong: (() => {
      const tong = hoSo.units.reduce((s, u) => s + u.doTuoi.tuoi + u.doTuoi.ben + u.doTuoi.giuNguonCu + u.doTuoi.quaHan + u.doTuoi.khongDocDuoc, 0);
      const quaHan = hoSo.units.reduce((s, u) => s + u.doTuoi.quaHan + u.doTuoi.khongDocDuoc, 0);
      const ncDaKy = thiTruong.phu.reduce((s, g) => s + g.daKy, 0);
      return [
        { k: 'dinhDanh', nhan: 'Đơn vị đã định danh pháp nhân', tu: hoSo.units.filter((u) => u.dinhDanh.trangThai !== 'chua_dinh_danh').length, mau: hoSo.units.length },
        { k: 'coCung', nhan: 'Nhu cầu quốc gia đã có bên cung', tu: k.ncCoCung, mau: k.soNc },
        { k: 'daKy', nhan: 'Nhu cầu có cặp ghép đã ký', tu: ncDaKy, mau: k.soNc },
        { k: 'hangA', nhan: 'Câu nguồn hạng A (văn bản chính thức)', tu: claims.filter((e) => e.tier === 'A').length, mau: claims.length },
        { k: 'conHan', nhan: 'Câu nguồn còn hạn hoặc có lý do giữ', tu: tong - quaHan, mau: tong },
      ];
    })(),
    viecTiep: (() => {
      const chua = hoSo.units.filter((u) => u.dinhDanh.trangThai === 'chua_dinh_danh').length;
      const qh = hoSo.units.reduce((s, u) => s + u.doTuoi.quaHan, 0);
      const ncDaKy = thiTruong.phu.reduce((s, g) => s + g.daKy, 0);
      const trongTen = thiTruong.phu.flatMap((g) => g.o.filter((o) => o.trangThai === 'trong').map((o) => `P${o.maSp}`));
      const ds = [
        { so: chua, viec: 'đơn vị chưa định danh pháp nhân', cach: (() => {
          const tk = hoSo.units.filter((u) => u.dinhDanh.trangThai === 'chua_dinh_danh' && u.tuKhai?.maSo).length;
          return `tra mã số trên cổng đăng ký doanh nghiệp quốc gia${tk ? `; ${tk} đơn vị đã có mã tự khai để đối chiếu` : ''}`;
        })(), href: '/dashboard/don-vi' },
        { so: k.ncTrong, viec: `nhu cầu quốc gia chưa có bên cung${trongTen.length ? ` (${trongTen.join(', ')})` : ''}`, cach: 'mở lô làm giàu mới, nguồn duyệt theo lô', href: '/dashboard/thi-truong' },
        { so: k.ncCoCung - ncDaKy, viec: 'nhu cầu đã có bên cung nhưng chưa có cặp được ký', cach: 'người gác cổng xem bằng chứng từng cặp rồi ký hoặc từ chối', href: '/dashboard/matching' },
        { so: qh, viec: 'câu nguồn quá 180 ngày chưa có lý do giữ', cach: 'chụp lại nguồn hoặc ghi lý do giữ', href: '/dashboard/registry' },
        { so: thoiCuoc.meta.theoLan.de_xuat, viec: 'tin mới từ vòng tự chạy đang chờ duyệt', cach: 'duyệt rồi mới tính là sự thật', href: '/dashboard/thoi-cuoc' },
      ];
      return ds.filter((v) => v.so > 0);
    })(),
    mocNgay: reg.meta.generatedAt,
  };
}
