/**
 * bao-cao.mjs · Bao cao khoang trong cong nghe chien luoc, sinh tu dong tu du lieu da qua cong
 * (01/10/2026, tinh nang dac sac so 7).
 *
 * Doi tuong doc: co quan quan ly, quy dau tu, ban lanh dao. Moi con so va moi cau nhan dinh sinh
 * tu hub-thi-truong.json, hub-mo-dau.json, hub-xu-huong.json; khong co chu nao go tay ngoai cau
 * khung. Cong check-bao-cao.mjs tinh lai va dem doc lap.
 *
 * Ky bao cao: quy chua ngay moc du lieu ("Quý IV/2026" cho 01/10/2026).
 *
 * CAU THAT (02/10/2026): neu co hub-cau-that.json (lo nhu cau dat hang da duyet), bao cao them muc
 * "nhu cau dat hang that": dem theo loai, so co goi y don vi trong so nguon, va DANH SACH nhu cau
 * chua co ben cung nao. Goi y don vi khong phai cap ghep, bao cao noi ro "chưa ký".
 */
const LA_MA = ['I', 'II', 'III', 'IV'];

export function kyBaoCao(mocNgay) {
  const [y, m] = String(mocNgay).split('-').map(Number);
  return `Quý ${LA_MA[Math.floor((m - 1) / 3)]}/${y}`;
}

const ngay = (s) => { const m = String(s).match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? `${m[3]}/${m[2]}/${m[1]}` : String(s); };
const tiLe = (a, b) => (b ? Math.round((a / b) * 100) : 0);

export function dungBaoCao({ thiTruong, moDau, xuHuong, cauThat = null }) {
  const sp = thiTruong.phu.flatMap((g) => g.o.map((o) => ({
    ma: o.maSp, ten: o.ten, nhom: Number(g.so), nhomTen: g.nhan, trangThai: o.trangThai, soCung: o.soCung,
  }))).sort((a, b) => a.ma.localeCompare(b.ma));
  const dem = (t) => sp.filter((x) => x.trangThai === t).length;
  const trong = sp.filter((x) => x.trangThai === 'trong');
  const mong = sp.filter((x) => x.trangThai !== 'trong' && x.soCung === 1);
  // Nhom yeu: ti le nhu cau CHUA co cap da ky cao nhat, roi it don vi cung nhat.
  const nhom = thiTruong.phu.map((g) => ({
    so: Number(g.so), ten: g.nhan, soNc: g.soNc, daKy: g.daKy, coCung: g.coCung, trong: g.trong, soDv: g.soDv,
    chuaKy: g.soNc - g.daKy,
  })).sort((a, b) => (b.chuaKy / b.soNc) - (a.chuaKy / a.soNc) || a.soDv - b.soDv || a.so - b.so);
  const d = xuHuong.diem;
  const dau = d[0]; const cuoi = d[d.length - 1];
  const tong = sp.length;
  const tomTat = [
    `${dem('da_ky')}/${tong} sản phẩm công nghệ chiến lược (${tiLe(dem('da_ky'), tong)}%) đã có ít nhất một cặp cung cầu được người gác cổng ký, dựa trên câu nguồn ở cả hai phía.`,
    `${dem('co_cung')} sản phẩm có đơn vị cung có câu nguồn nhưng chưa có cặp nào được ký.`,
    trong.length
      ? `${trong.length} sản phẩm chưa có đơn vị cung nào trong sổ nguồn: ${trong.map((x) => `P${x.ma} ${x.ten}`).join('; ')}.`
      : 'Mọi sản phẩm trong danh mục đều đã có ít nhất một đơn vị cung có câu nguồn.',
    `${mong.length} sản phẩm chỉ dựa vào đúng một đơn vị cung, tức một điểm hỏng là mất năng lực.`,
    dau && cuoi && d.length > 1
      ? `Từ ${ngay(dau.ngay)} đến ${ngay(cuoi.ngay)}, sổ nguồn tăng từ ${dau.donVi} lên ${cuoi.donVi} đơn vị và từ ${dau.matchDaKy} lên ${cuoi.matchDaKy} cặp đã ký.`
      : 'Chưa đủ lịch sử để nói xu hướng.',
  ];
  let ct = null;
  if (cauThat && cauThat.nhuCau?.length) {
    const ten = { nhiem_vu_khcn: 'Nhiệm vụ KH&CN đặt hàng', bai_toan_lon: 'Bài toán lớn', chuong_trinh: 'Chương trình, đề án', du_an_goi_thau: 'Dự án, gói thầu' };
    const chua = cauThat.nhuCau.filter((n) => !n.goiY.length);
    ct = {
      soNhuCau: cauThat.nhuCau.length,
      soBenDatHang: new Set(cauThat.nhuCau.map((n) => n.benDatHang)).size,
      coGoiY: cauThat.nhuCau.length - chua.length,
      theoLoai: Object.keys(ten).map((k) => ({ loai: k, ten: ten[k], so: cauThat.nhuCau.filter((n) => n.loai === k).length })),
      chuaCoBenCung: chua.map((n) => ({ ma: n.ma, ten: n.ten, benDatHang: n.benDatHang, loaiTen: ten[n.loai] ?? n.loai, maSp: n.maSp })),
    };
    tomTat.push(`${ct.soNhuCau} nhu cầu đặt hàng công nghệ có nguồn từ ${ct.soBenDatHang} bên đặt hàng; ${ct.coGoiY} nhu cầu đã có đơn vị trong sổ nguồn có câu nguồn liên quan (gợi ý, chưa ký), ${chua.length} nhu cầu chưa có bên cung nào.`);
  }
  return {
    ky: kyBaoCao(moDau.mocNgay), mocNgay: moDau.mocNgay,
    so: { tong, daKy: dem('da_ky'), coCung: dem('co_cung'), trong: trong.length, mong: mong.length, donVi: moDau.so.donVi, cauNguon: moDau.so.cauNguon, matchDaKy: moDau.so.matchDaKy },
    tomTat, sanPham: sp, nhom, mong: mong.map((x) => x.ma),
    chatLuong: moDau.chatLuong, viecTiep: moDau.viecTiep, cauThat: ct,
  };
}
