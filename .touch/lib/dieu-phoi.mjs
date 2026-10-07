/**
 * dieu-phoi.mjs · Lop du lieu man "Điều phối" (07/10/2026, mui nhon cong nghe so do thi Ha Noi).
 *
 * Y TUONG: hub dung o chu ky; man nay theo tung cap trong mui nhon tu luc may goi y ung vien toi luc
 * co ket qua that. Nguon su that la so su kien CaoLocMatch/domains/dieu_phoi/su_kien.jsonl, noi chi
 * NGUOI ghi viec nguoi da lam (lenh dieu_phoi.py, cong check_dieu_phoi.py). Hang viec o day la thu
 * TINH LAI duoc tu so + goi y cua may, khong phai su kien: may de xuat viec, nguoi lam viec.
 *
 * Ham thuan: nhan chuoi va du lieu, tra du lieu. Goi luc build (gen-hub-data) va trong cong.
 */
export const BUOC = [
  ['trong_mui', 'Nhu cầu trong mũi nhọn'],
  ['co_ung_vien', 'Có ứng viên trong sổ nguồn'],
  ['da_duyet', 'Có ứng viên được duyệt'],
  ['da_gioi_thieu', 'Đã giới thiệu'],
  ['quan_tam', 'Có bên phản hồi quan tâm'],
  ['ket_qua', 'Có kết quả (gặp, thí điểm, hợp đồng)'],
];
export const TEN_VIEC = {
  tim_ben_cung: 'Tìm bên cung',
  xet_ung_vien: 'Xét ứng viên',
  gui_gioi_thieu: 'Gửi lời giới thiệu',
  cho_phan_hoi: 'Nhắc và ghi phản hồi',
  ghi_ket_qua: 'Ghi kết quả',
};
const KQ_TOT = new Set(['gap', 'thi_diem', 'hop_dong']);

/** Doc mui_nhon.yaml theo dung khuon da khai (khong keo thu vien YAML). Thieu khoa thi nem loi. */
export function docMuiNhon(text) {
  const t = String(text);
  const chuoi = (k) => { const m = t.match(new RegExp(`^${k}:\\s*"([^"]*)"\\s*$`, 'm')); return m ? m[1] : null; };
  const tran = (k) => { const m = t.match(new RegExp(`^${k}:\\s*(\\S[^\\n#]*?)\\s*(#.*)?$`, 'm')); return m ? m[1].replace(/^"|"$/g, '') : null; };
  const ds = (k) => { const m = t.match(new RegExp(`^${k}:\\s*\\[([^\\]]*)\\]`, 'm')); return m ? m[1].split(',').map((x) => x.trim()).filter(Boolean) : null; };
  const khoi = (k) => {
    const dong = t.split('\n'); const i = dong.findIndex((l) => new RegExp(`^${k}:\\s*$`).test(l));
    if (i < 0) return null;
    const ra = {};
    for (let j = i + 1; j < dong.length; j++) {
      const l = dong[j];
      if (/^\s*#/.test(l) || !l.trim()) continue;
      const m = l.match(/^\s+([a-z0-9_-]+):\s*(.+?)\s*$/);
      if (!m) break;
      ra[m[1]] = /^".*"$/.test(m[2]) ? m[2].slice(1, -1) : /^\d+$/.test(m[2]) ? Number(m[2]) : m[2];
    }
    return ra;
  };
  const cfg = {
    ten: chuoi('ten'), batDau: chuoi('bat_dau'), moTa: chuoi('mo_ta'), nhuCau: ds('nhu_cau'),
    loaiTru: khoi('loai_tru') ?? {}, nguoiGacCong: ds('nguoi_gac_cong'), nguoiGioiThieu: tran('nguoi_gioi_thieu'),
    hanNgay: khoi('han_ngay'),
  };
  const thieu = Object.entries(cfg).filter(([, v]) => v === null || (Array.isArray(v) && !v.length)).map(([k]) => k);
  if (thieu.length) throw new Error(`mui_nhon.yaml thieu ${thieu.join(', ')}`);
  for (const k of Object.keys(TEN_VIEC)) if (typeof cfg.hanNgay[k] !== 'number') throw new Error(`mui_nhon.yaml han_ngay thieu ${k}`);
  return cfg;
}

const congNgay = (luc, n) => {
  const d = new Date(String(luc).slice(0, 10) + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
};

/**
 * @param {object} cfg       ket qua docMuiNhon
 * @param {object[]} suKien  cac dong su_kien.jsonl (da kiem boi check_dieu_phoi.py)
 * @param {object} cauThat   lib/hub-cau-that.json
 * @param {string} mocNgay   ngay moc du lieu (YYYY-MM-DD): viec nao co han truoc moc la qua han
 * @param {(ten:string)=>string} slug
 */
export function dungDieuPhoi(cfg, suKien, cauThat, mocNgay, slug) {
  const ncCua = new Map(cauThat.nhuCau.map((n) => [n.ma, n]));
  const viec = [];
  const them = (loai, nhuCau, donVi, nguoi, han) => viec.push({ loai, nhan: TEN_VIEC[loai], nhuCau, donVi, nguoi, han, quaHan: han < mocNgay });
  const gac = cfg.nguoiGacCong.join(', ');
  const dem = Object.fromEntries(BUOC.map(([k]) => [k, 0]));
  const nhuCau = cfg.nhuCau.map((ma) => {
    const n = ncCua.get(ma);
    const sk = suKien.filter((e) => e.nhu_cau === ma);
    const dong = sk.find((e) => e.loai === 'dong_nhu_cau') ?? null;
    const tenUv = [...new Set([...(n?.goiY ?? []).map((g) => g.dv), ...sk.filter((e) => e.don_vi).map((e) => e.don_vi)])];
    const ungVien = tenUv.map((dv) => {
      const e = sk.filter((x) => x.don_vi === dv);
      const co = (l) => e.find((x) => x.loai === l) ?? null;
      const duyet = co('duyet_ung_vien'); const tuChoi = co('tu_choi_ung_vien'); const gt = co('gioi_thieu');
      const ph = e.filter((x) => x.loai === 'phan_hoi'); const kq = co('ket_qua');
      const tuChoiPh = ph.find((x) => x.y === 'tu_choi');
      let trangThai = 'cho_xet';
      if (tuChoi) trangThai = 'tu_choi';
      else if (kq) trangThai = `ket_qua_${kq.ket_qua}`;
      else if (tuChoiPh) trangThai = 'ben_tu_choi';
      else if (ph.some((x) => x.y === 'quan_tam')) trangThai = 'quan_tam';
      else if (gt) trangThai = 'da_gioi_thieu';
      else if (duyet) trangThai = 'da_duyet';
      if (!dong) {
        if (trangThai === 'cho_xet') them('xet_ung_vien', ma, dv, gac, congNgay(cfg.batDau, cfg.hanNgay.xet_ung_vien));
        else if (trangThai === 'da_duyet') them('gui_gioi_thieu', ma, dv, cfg.nguoiGioiThieu, congNgay(duyet.luc, cfg.hanNgay.gui_gioi_thieu));
        else if (trangThai === 'da_gioi_thieu') them('cho_phan_hoi', ma, dv, cfg.nguoiGioiThieu, congNgay(gt.luc, cfg.hanNgay.cho_phan_hoi));
        else if (trangThai === 'quan_tam') them('ghi_ket_qua', ma, dv, cfg.nguoiGioiThieu, congNgay(ph[ph.length - 1].luc, cfg.hanNgay.ghi_ket_qua));
      }
      return { dv, slug: slug(dv), nguon: (n?.goiY ?? []).some((g) => g.dv === dv) ? 'may' : 'nguoi', trangThai, suKien: e.map((x) => x.stt) };
    });
    if (!dong && !ungVien.length) them('tim_ben_cung', ma, null, 'Người làm giàu dữ liệu (lô mới)', congNgay(cfg.batDau, cfg.hanNgay.tim_ben_cung));
    const tt = new Set(ungVien.map((u) => u.trangThai));
    const dat = {
      trong_mui: true,
      co_ung_vien: ungVien.length > 0,
      da_duyet: ungVien.some((u) => !['cho_xet', 'tu_choi'].includes(u.trangThai)),
      da_gioi_thieu: ungVien.some((u) => ['da_gioi_thieu', 'quan_tam', 'ben_tu_choi'].includes(u.trangThai) || u.trangThai.startsWith('ket_qua_')),
      quan_tam: ungVien.some((u) => u.trangThai === 'quan_tam' || u.trangThai.startsWith('ket_qua_')),
      ket_qua: [...tt].some((x) => KQ_TOT.has(x.replace('ket_qua_', ''))),
    };
    for (const [k, v] of Object.entries(dat)) if (v) dem[k]++;
    return { ma, ten: n?.ten ?? ma, benDatHang: n?.benDatHang ?? null, doiTuong: n?.doiTuong ?? null, dong: dong ? { luc: dong.luc, noiDung: dong.noi_dung } : null, ungVien };
  });
  viec.sort((a, b) => a.han.localeCompare(b.han) || a.nhuCau.localeCompare(b.nhuCau, 'en', { numeric: true }) || String(a.donVi).localeCompare(String(b.donVi)));
  return {
    meta: {
      ten: cfg.ten, batDau: cfg.batDau, moTa: cfg.moTa, mocNgay,
      nguoiGacCong: cfg.nguoiGacCong, nguoiGioiThieu: cfg.nguoiGioiThieu,
      loaiTru: Object.entries(cfg.loaiTru).map(([ma, lyDo]) => ({ ma, ten: ncCua.get(ma)?.ten ?? ma, lyDo })),
      soNhuCau: cfg.nhuCau.length, soSuKien: suKien.length, soViec: viec.length, soQuaHan: viec.filter((v) => v.quaHan).length,
    },
    pheu: BUOC.map(([k, nhan]) => ({ buoc: k, nhan, so: dem[k] })),
    nhuCau, viec,
    suKien: suKien.map((e) => ({ stt: e.stt, luc: e.luc, loai: e.loai, nhuCau: e.nhu_cau, donVi: e.don_vi ?? null, nguoi: e.nguoi, noiDung: e.noi_dung, y: e.y ?? null, ben: e.ben ?? null, ketQua: e.ket_qua ?? null })),
  };
}
