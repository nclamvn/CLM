/**
 * hoi-dap.mjs · Hoi dap co trich dan tren so nguon (01/10/2026, tinh nang dac sac so 2).
 *
 * KHONG SINH CHU. Cau tra loi la cac CAU NGUON NGUYEN VAN cua so nguon, chon bang truy hoi tat
 * dinh, kem ban chup. Khong co cau nguon nao noi ve dieu duoc hoi thi TU CHOI tra loi va noi
 * thang la so nguon chua co. Ly do khong dung mo hinh ngon ngu o day: mot cau "nghe dung" ma
 * khong truy duoc ve nguon la dung cai san pham nay ton tai de chan.
 *
 * Mot file cho ca giao dien va cong kiem (check-hoi-dap.mjs): cong chay DUNG ham nguoi dung chay.
 *
 * CACH HIEU CAU HOI
 *   1. Bo dau, ha chu (khoaTim). Bo TU CHUC NANG (ai, nao, lam, duoc, cong nghe...).
 *   2. Gom cum DONG NGHIA thanh mot KHAI NIEM (UAV = bay khong nguoi lai = drone). "AI" viet
 *      HOA trong cau hoi la tri tue nhan tao; "ai" thuong la tu hoi, bo.
 *   2b. Phan con lai gom thanh TU GHEP theo kho cum tu cua chinh so nguon (tieng Viet ghep tu hai,
 *      ba am tiet: "luu tru", "tieng viet", "hinh nguoi"). Cat tung am tiet thi "luu" se khop
 *      "luu hanh" cua bai vac xin (lo ra o lan thu dau 01/10/2026). Am tiet le con lai ma la tu
 *      chuc nang thi bo; am tiet le xuat hien trong > 40% cau nguon thi bo (khong phan biet).
 *   3. Ma nhu cau (P22, p 22) va ten nhu cau trung >= 60% tu khoa thi coi la hoi ve NHU CAU:
 *      kem them cac don vi da co cap ghep DA KY cho nhu cau do.
 * CACH CHON CAU NGUON
 *   Chi xet truong NANG LUC (nang_luc_mo_ta, nang_luc_mo_ta_2, bang_chung_nang_luc). Mot cau
 *   dat khi phu du TRONG SO khai niem (ten cong nghe trong tu dien nang 2, tu khac nang 1): tong
 *   <= 2 thi phai khop het, lon hon thi >= 50%. Moi khai niem khop o DAU TU ("anh" khong khop
 *   "thanh").
 */
import { khoaTim } from './tim-kiem.mjs';

export const TRUONG_NANG_LUC = ['nang_luc_mo_ta', 'nang_luc_mo_ta_2', 'bang_chung_nang_luc'];

const TU_CHUC_NANG = new Set(('ai nao nhung cac co the lam duoc o cua va la gi nhu tai viet nam don vi cong ty '
  + 'hien nay nguoi cho ve voi trong mot bao nhieu san xuat cung cap nghien cuu phat trien cong nghe he thong '
  + 'dang da se nang luc chu so huu tu tim kiem danh sach liet ke biet muon hoi may doanh nghiep vien truong '
  + 'giai phap san pham thiet ke che tao ung dung trien khai').split(' '));

/** Cum dong nghia, viet o dang khoaTim. Phan tu dau la ten hien thi cua khai niem. */
export const DONG_NGHIA = [
  ['uav', 'bay khong nguoi lai', 'drone', 'may bay khong nguoi lai', 'thiet bi bay'],
  ['chip', 'ban dan', 'vi mach', 'soc'],
  ['tri tue nhan tao', 'ai'],
  ['5g', 'mang di dong'],
  ['ve tinh', 'satellite'],
  ['robot', 'nguoi may'],
  ['vac xin', 'vaccine', 'vacxin', 'vaccin'],
  ['te bao goc'],
  ['pin', 'ac quy', 'luu tru nang luong'],
  ['hydrogen', 'hydro'],
  ['an ninh mang', 'bao mat', 'cyber'],
  ['luong tu', 'quantum'],
  ['duong sat', 'toa xe', 'dau may', 'toa tau'],
  ['dien toan dam may', 'cloud'],
  ['ban sao so', 'digital twin'],
  ['chuoi khoi', 'blockchain'],
  ['cam bien', 'sensor'],
  ['dieu hanh san xuat', 'mes'],
];

const thoat = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const khopDauTu = (khoa, cum) => new RegExp(`(^| )${thoat(cum)}`).test(khoa);

/** Phan tich cau hoi thanh khai niem. Tra { khaiNiem: [{nhan, thay: [cum...]}], maNc: [..] }. */
export function hieuCauHoi(cau, cumTu = null, tanSuat = null) {
  const goc = String(cau ?? '');
  let k = ` ${khoaTim(goc).replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim()} `;
  const maNc = [...goc.matchAll(/\bp\s?0?(\d{1,2})\b/gi)].map((m) => m[1].padStart(2, '0'));
  k = k.replace(/ p ?0?\d{1,2} /g, ' ');
  const khaiNiem = [];
  for (const cum of DONG_NGHIA) {
    const ten = cum[0];
    // "ai" thuong la tu hoi; chi la tri tue nhan tao khi cau goc viet HOA "AI".
    const thay = ten === 'tri tue nhan tao' && !/\bAI\b/.test(goc) ? cum.filter((x) => x !== 'ai') : cum;
    const trung = thay.filter((x) => k.includes(` ${x} `));
    if (!trung.length) continue;
    khaiNiem.push({ nhan: ten, thay: cum, nang: 2 });
    for (const x of trung) k = k.replace(` ${x} `, ' ');
  }
  const tu = k.split(' ').filter(Boolean);
  const coCum = cumTu ? (c) => cumTu.has(c) : () => false;
  for (let i = 0; i < tu.length;) {
    const ba = tu.slice(i, i + 3).join(' '); const hai = tu.slice(i, i + 2).join(' ');
    let cum = null; let buoc = 1;
    // Uu tien tu ghep HAI am tiet (dang pho bien nhat cua tieng Viet). Chi lay ba am tiet khi
    // tach doi se de lai mot am tiet le khong ghep duoc voi am tiet ke tiep ("nha may | thong
    // minh" chu khong "nha may thong | minh").
    const leSau = !(i + 4 <= tu.length && coCum(tu.slice(i + 2, i + 4).join(' ')));
    const hopLe = (n) => i + n <= tu.length && !tu.slice(i, i + n).every((x) => TU_CHUC_NANG.has(x));
    if (hopLe(2) && coCum(hai) && !(hopLe(3) && coCum(ba) && leSau && i + 3 === tu.length)) { cum = hai; buoc = 2; }
    else if (hopLe(3) && coCum(ba)) { cum = ba; buoc = 3; }
    else if (!TU_CHUC_NANG.has(tu[i]) && tu[i].length >= 2) cum = tu[i];
    i += buoc;
    if (!cum || khaiNiem.some((x) => x.nhan === cum)) continue;
    khaiNiem.push({ nhan: cum, thay: [cum], le: buoc === 1, nang: 1 });
  }
  // Am tiet le qua pho bien thi khong phan biet duoc gi; bo, tru khi no la khai niem duy nhat.
  const loc = tanSuat ? khaiNiem.filter((x) => !(x.le && (tanSuat.get(x.nhan) ?? 0) > 0.4)) : khaiNiem;
  return { khaiNiem: loc.length ? loc : khaiNiem, maNc };
}

/** Dung chi muc tu registry + match (goi luc build va trong cong kiem). */
export function dungChiMuc(reg, mat) {
  const slug = (ten) => khoaTim(ten).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const taiLieu = [];
  for (const u of reg.units) {
    u.evidence.forEach((e, i) => {
      if (!TRUONG_NANG_LUC.includes(e.field)) return;
      taiLieu.push({ dv: u.name, slug: slug(u.name), i, field: e.field, span: e.span, href: e.href, tier: e.tier, source: e.source, khoa: khoaTim(e.span) });
    });
  }
  const nhuCau = reg.needs.map((n) => ({ ma: n.id.replace('CNCL-P', ''), ten: n.value, entityId: n.entityId, khoa: khoaTim(n.value) }));
  const daKy = mat.signedMatches.map((m) => ({ id: m.id, cau: m.demandId, cung: m.supplyId }));
  // Kho cum tu hai, ba am tiet lay tu chinh so nguon, va tan suat am tiet theo cau nguon.
  const cum = new Set(); const dem = new Map();
  for (const k of [...taiLieu.map((d) => d.khoa), ...nhuCau.map((x) => x.khoa)]) {
    const t = k.replace(/[^a-z0-9 ]+/g, ' ').split(' ').filter(Boolean);
    for (let i = 0; i < t.length; i++) {
      if (i + 1 < t.length) cum.add(`${t[i]} ${t[i + 1]}`);
      if (i + 2 < t.length) cum.add(`${t[i]} ${t[i + 1]} ${t[i + 2]}`);
    }
  }
  for (const d of taiLieu) for (const t of new Set(d.khoa.replace(/[^a-z0-9 ]+/g, ' ').split(' ').filter(Boolean))) dem.set(t, (dem.get(t) ?? 0) + 1);
  const tanSuat = Object.fromEntries([...dem].filter(([, v]) => v / taiLieu.length > 0.4).map(([t, v]) => [t, +(v / taiLieu.length).toFixed(3)]));
  return { taiLieu, nhuCau, daKy, cumTu: [...cum].sort(), tanSuat };
}

/** Tra loi. Tra { cau, khaiNiem, nhuCau: [...], donVi: [{dv, slug, diem, trich: [...], kyCho: [...]}], tuChoi: string|null }. */
export function hoiDap(cau, cm, toiDa = 8) {
  if (!cm._cum) { Object.defineProperty(cm, '_cum', { value: new Set(cm.cumTu) }); Object.defineProperty(cm, '_ts', { value: new Map(Object.entries(cm.tanSuat)) }); }
  const { khaiNiem, maNc } = hieuCauHoi(cau, cm._cum, cm._ts);
  const n = khaiNiem.length;
  const ra = { cau: String(cau ?? '').trim(), khaiNiem: khaiNiem.map((x) => x.nhan), nhuCau: [], donVi: [], tuChoi: null };
  if (!n && !maNc.length) {
    ra.tuChoi = 'Câu hỏi chưa có từ khoá về công nghệ hay sản phẩm. Thử hỏi kiểu: "Ai làm được UAV?"';
    return ra;
  }
  // Nhu cau duoc hoi: theo ma, hoac ten phu >= 60% khai niem (va it nhat 1).
  const ncKhop = cm.nhuCau.filter((nc) => maNc.includes(nc.ma)
    || (n && khaiNiem.filter((x) => x.thay.some((c) => khopDauTu(nc.khoa, c))).length >= Math.max(1, Math.ceil(n * 0.6))));
  ra.nhuCau = ncKhop.map((nc) => ({ ma: nc.ma, ten: nc.ten }));

  // Nguong theo TRONG SO: khai niem trong tu dien dong nghia (ten cong nghe) nang 2, tu khac
  // nang 1. Tong <= 2 thi phai khop het; lon hon thi khop >= 50% tong trong so. Lan thu dau
  // dung nguong theo SO khai niem lam rot AVAC khoi cau "vac xin dich ta lon chau Phi".
  const tong = khaiNiem.reduce((a, x) => a + x.nang, 0);
  const can = tong <= 2 ? tong : tong * 0.5;
  const theoDv = new Map();
  if (n) {
    for (const d of cm.taiLieu) {
      const trung = khaiNiem.filter((x) => x.thay.some((c) => khopDauTu(d.khoa, c)));
      const nang = trung.reduce((a, x) => a + x.nang, 0);
      if (!trung.length || nang < can) continue;
      const diem = nang * 10 + (d.field === 'bang_chung_nang_luc' ? 2 : 1) + (d.tier === 'A' ? 3 : d.tier === 'B' ? 2 : 0);
      const tro = theoDv.get(d.dv) ?? { dv: d.dv, slug: d.slug, diem: 0, trich: [], kyCho: [] };
      tro.trich.push({ span: d.span, href: d.href, tier: d.tier, source: d.source, field: d.field, i: d.i, diem, khop: trung.map((x) => x.nhan) });
      tro.diem = Math.max(tro.diem, diem) + 0.1;
      theoDv.set(d.dv, tro);
    }
  }
  // Don vi da co cap ghep DA KY cho nhu cau duoc hoi: kem du khong co cau phu tu khoa.
  for (const nc of ncKhop) {
    for (const k of cm.daKy.filter((x) => x.cau === nc.entityId)) {
      const tro = theoDv.get(k.cung) ?? { dv: k.cung, slug: khoaTim(k.cung).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''), diem: 0, trich: [], kyCho: [] };
      tro.kyCho.push({ match: k.id, nhuCau: `P${nc.ma}` });
      tro.diem += 5;
      theoDv.set(k.cung, tro);
    }
  }
  ra.donVi = [...theoDv.values()]
    .map((x) => ({ ...x, trich: x.trich.sort((a, b) => b.diem - a.diem || a.i - b.i).slice(0, 2) }))
    .sort((a, b) => b.diem - a.diem || a.dv.localeCompare(b.dv, 'vi'))
    .slice(0, toiDa);
  if (!ra.donVi.length) {
    ra.tuChoi = `Sổ nguồn chưa có câu nguồn nào nói về ${khaiNiem.map((x) => `"${x.nhan}"`).join(', ') || 'nhu cầu này'}. Không có nguồn thì không trả lời.`;
  }
  return ra;
}

// ════════════════════════════════════════════════════════════════════════════
// HOI VE CAU (25/10/2026). Truoc day moi cau hoi deu tra bang ben CUNG: "Bo nao dang can UAV?"
// ra 8 nha cung cap, "Ha Noi can gi?" bi tu choi du so nguon co 14 bai toan cua Ha Noi. Nguoi hoi
// ve cau thi phai nhan NHU CAU DAT HANG THAT kem cau nguon nguyen van va ban chup, cung luat:
// khong co nguon thi tu choi.
// ════════════════════════════════════════════════════════════════════════════

const TU_HOI_CAU = new Set(('can dang dat hang nhu cau bai toan gi nao bo tinh dia phuong thanh pho ben mua ai dau bai '
  + 'nhung hien co nhieu dang can tim duoc nao do o').split(' '));
const BO_TIEN_TO = ['uy ban nhan dan ', 'ubnd ', 'thanh pho ', 'tinh ', 'bo ', 'tong cong ty ', 'ban quan ly ', 'ngan hang nha nuoc ', 'vien '];
const khoaGon = (s) => ` ${khoaTim(String(s ?? '')).replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim()} `;

/** Cau hoi co hoi ve NHU CAU (ben can, ben dat hang) khong. "Can Tho" la ten dia danh, khong tinh. */
export function laHoiCau(cau) {
  const k = khoaGon(cau).replace(/ can tho /g, ' ');
  return / (can|dat hang|nhu cau|bai toan|ben dat hang|dau bai) /.test(k);
}

/** Cac cach goi mot ben dat hang: ten day du, bo dan tien to hanh chinh, ma trong ngoac. */
export function tenGoiBen(ten) {
  const ra = new Set();
  const ngoac = [...String(ten).matchAll(/\(([^)]+)\)/g)].map((m) => khoaGon(m[1]).trim());
  let k = khoaGon(String(ten).replace(/\([^)]*\)/g, ' ')).trim();
  ra.add(k);
  for (let doi = true; doi;) {
    doi = false;
    for (const t of BO_TIEN_TO) if (k.startsWith(t) && k.length > t.length + 2) { k = k.slice(t.length); ra.add(k); doi = true; }
  }
  for (const n of ngoac) if (n.length >= 3) ra.add(n);
  return [...ra].sort();
}

/** Chi muc cau that cho hoi dap, dung tu lib/hub-cau-that.json (goi luc build va trong cong kiem). */
export function dungChiMucCau(cauThat) {
  const lay = (n, f) => n.nguon.find((x) => x.field === f) ?? null;
  const trichCua = (x) => (x ? { field: x.field, value: x.value, span: x.span, href: x.href, tier: x.tier, source: x.source } : null);
  return {
    nhuCau: cauThat.nhuCau.map((n) => ({
      ma: n.ma, ten: n.ten, ben: n.benDatHang, loaiTen: n.loaiTen, tenGoi: tenGoiBen(n.benDatHang),
      // Chi khop tren GIA TRI nguyen van cua ten va doi tuong (deu nam trong span), khong tren ten
      // san pham do may anh xa: cau trich hien ra phai chua dung tu duoc hoi.
      khoa: khoaTim(`${n.ten} ${n.doiTuong ?? ''}`),
      trich: [trichCua(lay(n, 'ten_nhu_cau')), trichCua(lay(n, 'doi_tuong'))].filter(Boolean),
      trichBen: trichCua(lay(n, 'ben_dat_hang')),
    })),
  };
}

/** Tra loi cau hoi ve cau. Tra { cau, loai: 'cau', ben, khaiNiem, nhuCau: [...], conLai, tuChoi }. */
export function hoiCau(cau, cc, cm) {
  if (!cm._cum) { Object.defineProperty(cm, '_cum', { value: new Set(cm.cumTu) }); Object.defineProperty(cm, '_ts', { value: new Map(Object.entries(cm.tanSuat)) }); }
  const goc = String(cau ?? '').trim();
  const k = khoaGon(goc);
  const benHoi = [...new Set(cc.nhuCau.filter((n) => n.tenGoi.some((a) => k.includes(` ${a} `))).map((n) => n.ben))].sort();
  const tuBen = new Set(cc.nhuCau.filter((n) => benHoi.includes(n.ben)).flatMap((n) => n.tenGoi.join(' ').split(' ')));
  const { khaiNiem } = hieuCauHoi(goc, cm._cum, cm._ts);
  // Khai niem trong tu dien dong nghia (nang 2: "ve tinh", "uav") luon giu; "tinh" o day khong phai "tinh thanh".
  const kn = khaiNiem.filter((x) => x.nang === 2 || !x.nhan.split(' ').every((t) => TU_HOI_CAU.has(t) || TU_CHUC_NANG.has(t) || tuBen.has(t)));
  const ra = { cau: goc, loai: 'cau', ben: benHoi, khaiNiem: kn.map((x) => x.nhan), nhuCau: [], conLai: 0, tuChoi: null };
  if (!kn.length && !benHoi.length) {
    ra.tuChoi = 'Câu hỏi về nhu cầu cần có tên công nghệ hoặc tên bên đặt hàng. Thử hỏi kiểu: "Hà Nội cần gì?" hoặc "Ai đang cần UAV?"';
    return ra;
  }
  // Mot am tiet le duy nhat ("cat" con lai tu "may cat co") qua mo ho de tim nhu cau: tu choi
  // thay vi khop "dong cat" cua thiet bi dien.
  if (!benHoi.length && kn.length === 1 && kn[0].le) {
    ra.tuChoi = `Câu hỏi chỉ còn một âm tiết "${kn[0].nhan}" sau khi bỏ từ hỏi, quá chung để tìm nhu cầu. Thử viết tên công nghệ đầy đủ hơn.`;
    return ra;
  }
  const tong = kn.reduce((a, x) => a + x.nang, 0);
  const can = tong <= 2 ? tong : tong * 0.5;
  const tap = benHoi.length ? cc.nhuCau.filter((n) => benHoi.includes(n.ben)) : cc.nhuCau;
  const dat = [];
  for (const n of tap) {
    const trung = kn.filter((x) => x.thay.some((c) => khopDauTu(n.khoa, c)));
    const nang = trung.reduce((a, x) => a + x.nang, 0);
    if (kn.length && (!trung.length || nang < can)) continue;
    const trich = kn.length
      ? n.trich.filter((t) => trung.some((x) => x.thay.some((c) => khopDauTu(khoaTim(t.value), c))))
      : n.trich.filter((t) => t.field === 'ten_nhu_cau');
    if (!trich.length) continue;
    const diem = nang * 10 + (trich[0].tier === 'A' ? 3 : trich[0].tier === 'B' ? 2 : 0);
    dat.push({ ma: n.ma, ten: n.ten, ben: n.ben, loaiTen: n.loaiTen, diem, khop: trung.map((x) => x.nhan), trich, trichBen: n.trichBen });
  }
  dat.sort((a, b) => b.diem - a.diem || a.ma.localeCompare(b.ma));
  const toiDa = kn.length ? 8 : 20;
  ra.nhuCau = dat.slice(0, toiDa);
  ra.conLai = Math.max(0, dat.length - toiDa);
  if (!ra.nhuCau.length) {
    const ve = [...benHoi.map((b) => `của ${b}`), ...kn.map((x) => `"${x.nhan}"`)].join(', ');
    ra.tuChoi = `Sổ nguồn chưa có nhu cầu đặt hàng nào ${ve || 'khớp câu hỏi'}. Không có nguồn thì không trả lời.`;
  }
  return ra;
}
