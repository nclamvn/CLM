/**
 * ban-chup.mjs · Tach GHI CHU CUA NGUOI CHUP khoi VAN BAN CUA NGUON trong mot ban chup.
 *
 * VI SAO CO (29/09/2026): lop phu nguon to sang cau nguon giua doan van quanh no, doc thang tu
 * ban chup. Luot kiem that dau tien cho thay ngay canh cau nguyen van cua baochinhphu.vn la
 * dong "# Bai dang 16/12/2024. Tier A. Trich cau nguyen van, khong sua chu." va cac tieu de
 * khong dau kieu "## May bien ap da duoc thu nghiem dat tieu chuan IEC". Do la chu CUA NGUOI
 * CHUP, khong phai cua bao. Hien chung lan vao nhu mot khoi la dung sai o khoanh khac duy nhat
 * nha dau tu duoc moi kiem chung "day la nguyen van cua nguon".
 *
 * KHONG SUA BAN CHUP. Ban chup la bang chung da dong bang; them dau vao no se lam lech van tay
 * va cac cong doi chung. Thay vao do, phan loai TUNG DONG bang luat tat dinh duoi day, va noi
 * thang cho nao chua phan dinh duoc.
 *
 * BA LOAI DONG:
 *   nguon    van ban cua trang nguon.
 *   ghi_chu  chu cua nguoi chup: khoi tieu de dau file, tieu de khong dau, va muc "chua cao /
 *            lo ra" cung cac dong liet ke ngay sau no.
 *   chua_ro  tieu de CO dau trong mot ban TAP HOP (ban ma tieu de chinh la chu khong dau cua
 *            nguoi chup). Co the la nhan nguoi chup dat, co the la tieu de cua bai. May khong
 *            doan; giao dien noi thang la chua phan dinh.
 *
 * LUAT, THEO THU TU:
 *   1. Khoi dau file: cac dong lien tiep bat dau bang "#" tu dong 1 -> ghi_chu.
 *   2. Dong "#" khong co chu cai tieng Viet co dau -> ghi_chu. Bao tieng Viet viet tieu de co dau;
 *      tieu de khong dau la chu nguoi chup go.
 *   3. Dong "#" chua "chưa cào", "lộ ra", "Ghi chú", "Ghi chu" -> ghi_chu, va MOI dong khong phai
 *      tieu de ngay sau no, toi tieu de ke tiep, cung la ghi_chu (danh sach link chua cao).
 *   4. Dong "#" co dau con lai: neu tieu de dau tien sau khoi dau file la KHONG dau (ban tap hop
 *      do nguoi chup dung) -> chua_ro; neu tieu de dau tien CO dau (ban giu nguyen cau truc
 *      trang) -> nguon.
 *   5. Moi dong con lai -> nguon.
 */

const CO_DAU = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;
const MUC_NGUOI_CHUP = /(chưa cào|lộ ra|ghi chú|ghi chu)/i;

/**
 * Phan loai tung dong. Tra ve mang {tu, den, loai} theo vi tri ky tu trong van ban tho
 * (den KHONG gom ky tu xuong dong).
 * @param {string} tho
 * @returns {{tu:number, den:number, loai:'nguon'|'ghi_chu'|'chua_ro'}[]}
 */
export function phanLoaiDong(tho) {
  const dong = String(tho).split('\n');
  const ra = [];
  let viTri = 0;
  let trongKhoiDau = true;
  let trongMucNguoiChup = false;
  let kieuBan = null; // 'tap_hop' | 'nguyen_trang' | null
  for (const d of dong) {
    const s = d.trim();
    const laTieuDe = s.startsWith('#');
    let loai;
    if (trongKhoiDau && laTieuDe) loai = 'ghi_chu';
    else {
      if (trongKhoiDau) trongKhoiDau = false;
      if (laTieuDe) {
        trongMucNguoiChup = false;
        if (kieuBan === null) kieuBan = CO_DAU.test(s) ? 'nguyen_trang' : 'tap_hop';
        if (!CO_DAU.test(s)) loai = 'ghi_chu';
        else if (MUC_NGUOI_CHUP.test(s)) { loai = 'ghi_chu'; trongMucNguoiChup = true; }
        else loai = kieuBan === 'tap_hop' ? 'chua_ro' : 'nguon';
      } else {
        loai = trongMucNguoiChup && s ? 'ghi_chu' : 'nguon';
      }
    }
    ra.push({ tu: viTri, den: viTri + d.length, loai });
    viTri += d.length + 1;
  }
  return ra;
}

/**
 * Cat ngu canh quanh span thanh cac DOAN co gan loai, de giao dien to khac nhau.
 * Span phai nam NGUYEN VAN trong ban chup; khong co thi cach=null (loi, khong tim gan dung).
 * Doan loai 'span' la cau lam bang. Neu span cham vao dong khong phai 'nguon' thi
 * spanChamGhiChu=true: day la loi du lieu, cong ghi_chu_ban_chup chan truoc khi len web.
 * @param {string} tho
 * @param {string} span
 * @param {number} [r]
 */
export function catNguCanhPhanLoai(tho, span, r = 280) {
  const t = String(tho);
  const lop = phanLoaiDong(t);
  const cham = (a, b) => lop.some((l) => l.loai !== 'nguon' && l.tu < b && l.den > a);
  // Chon lan xuat hien DAU TIEN NAM TRONG VAN BAN NGUON. Ten don vi thuong xuat hien truoc o
  // nhan "## Ten" cua nguoi chup roi moi toi than bai; to sang nhan do la to sang chu cua minh.
  let i = -1; let dauTien = -1;
  for (let k = span ? t.indexOf(span) : -1; k >= 0; k = t.indexOf(span, k + 1)) {
    if (dauTien < 0) dauTien = k;
    if (!cham(k, k + span.length)) { i = k; break; }
  }
  if (dauTien < 0) return { cach: null, doan: [], spanChamGhiChu: false };
  const spanChamGhiChu = i < 0;
  if (i < 0) i = dauTien;
  const j = i + span.length;
  const dau = Math.max(0, i - r);
  const cuoi = Math.min(t.length, j + r);
  const doan = [];
  const day = (tu, den, loai) => {
    if (den <= tu) return;
    const text = t.slice(tu, den).replace(/\s+/g, ' ');
    if (!text.trim()) return;
    const cuoiCung = doan[doan.length - 1];
    if (cuoiCung && cuoiCung.loai === loai) cuoiCung.text += text;
    else doan.push({ text, loai });
  };
  // Phan truoc va sau span: cat theo tung dong de moi doan mang dung loai cua dong do.
  const cat = (tu, den) => {
    for (const l of lop) {
      const a = Math.max(tu, l.tu); const b = Math.min(den, l.den + 1);
      if (a < b) day(a, b, l.loai);
    }
  };
  cat(dau, i);
  doan.push({ text: span, loai: 'span' });
  cat(j, cuoi);
  if (dau > 0 && doan[0]) doan[0].text = '… ' + doan[0].text.trimStart();
  const cuoiDoan = doan[doan.length - 1];
  if (cuoi < t.length && cuoiDoan) cuoiDoan.text = cuoiDoan.text.trimEnd() + ' …';
  return { cach: 'nguyen_van', doan, spanChamGhiChu };
}

/**
 * Liet ke cac cau lam bang CHI nam trong ghi chu cua nguoi chup (khong co lan nao trong van
 * ban nguon). Dung chung cho gen-hub-data.mjs (de giao dien canh bao) va cong kiem.
 * @param {{ai:string, span:string, href:string}[]} ds
 * @param {(href:string)=>string|null} docBanChup
 */
export function spanChiTrongGhiChu(ds, docBanChup) {
  const ra = [];
  for (const x of ds) {
    const t = docBanChup(x.href);
    if (t === null) continue;
    const r = catNguCanhPhanLoai(t, x.span);
    if (r.cach && r.spanChamGhiChu) ra.push({ ai: x.ai, href: x.href, span: x.span });
  }
  return ra;
}

/** Danh sach moi cau nguon ma lop phu co the hien, tu hai file lib. */
export function moiCauNguon(reg, mat) {
  return [
    ...reg.units.flatMap((u) => u.evidence.map((e) => ({ ai: `${u.name} · ${e.field}`, span: e.span, href: e.href }))),
    ...reg.needs.map((n) => ({ ai: n.id, span: n.span, href: n.href })),
    ...mat.signedMatches.flatMap((m) => [...m.demandEvidence, ...m.supplyEvidence]
      .map((e) => ({ ai: `${m.id} · ${e.field}`, span: e.span, href: e.href }))),
  ];
}
