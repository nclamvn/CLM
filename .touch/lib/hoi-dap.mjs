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
