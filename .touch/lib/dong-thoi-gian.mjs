/**
 * dong-thoi-gian.mjs · Bo tri dong thoi gian tren ho so don vi (ham thuan, khong DOM).
 *
 * VI SAO TACH RA (01/10/2026): ban chup ho so FPT cho thay nhan "24/11/2025 ..." va "10/07/2026 ..."
 * de len nhau. Cach cu chi xet khoang cach giua hai cham (< 90 don vi) chu khong xet BE RONG NHAN,
 * nen hai nhan dai cach nhau 104 don vi van chong. Bo tri moi xep tung nhan vao hang thap nhat con
 * trong theo hop bao uoc luong; het hang thi an nhan (cham van con, re chuot van doc duoc).
 * Cong check-dong-thoi-gian.mjs do lai hinh hoc DOC LAP voi uoc luong rong cua rieng no.
 */
export const W = 1000;
export const TRAI = 150;
export const PHAI = 24;
export const LAN = ['nguon_dang', 'ky', 'de_xuat'];
export const NHAN_LAN = { nguon_dang: 'Nguồn đăng bài', ky: 'Ký và từ chối', de_xuat: 'Đề xuất chờ duyệt' };
export const DINH = 66;          // y cua lan dau tien
export const KHOANG_LAN = 58;    // khoang giua hai lan
export const BUOC_HANG = 13;     // khoang giua hai hang nhan (chu 12px)
export const SO_HANG = 3;        // so hang nhan toi da phia tren moi lan
export const RONG_KY_TU = 6.6;   // uoc luong rong mot ky tu o 12px (Inter), thien ve rong
const CO_CHU = 12;

const lanCua = (l) => (l === 'nguon_dang' ? 0 : l === 'de_xuat' ? 2 : 1);
const nhomLan = (l) => (l === 'nguon_dang' ? 'n' : l === 'de_xuat' ? 'd' : 'k');
const tg = (d) => Date.parse(`${d}T00:00:00Z`);
const giao = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.y0 < b.y1 && b.y0 < a.y1;

export function nhanDiem(d) {
  if (d.loai === 'nguon_dang') return d.soGop > 1 ? `${d.soGop} bài · ${d.soCau} câu` : `${d.nguon} · ${d.soCau} câu`;
  if (d.loai === 'match_da_ky') return d.soGop > 1 ? `${d.soGop} match đã ký` : `${d.matchId} · P${d.maSp}`;
  if (d.loai === 'tu_choi') return `từ chối P${d.maSp}`;
  return `${d.soGop} đề xuất chờ duyệt`;
}

/**
 * @param {Array} dongThoiGian  hs.dongThoiGian
 * @param {string} moc          ngay moc do (YYYY-MM-DD)
 * @param {(d:string)=>string} ngayVN
 */
export function xepDongThoiGian(dongThoiGian, moc, ngayVN) {
  // Gop cac moc cung ngay cung lan cung loai thanh mot cham co dem.
  const ds = [];
  for (const d of dongThoiGian) {
    const cu = ds.find((q) => q.ngay === d.ngay && nhomLan(q.loai) === nhomLan(d.loai) && q.loai === d.loai);
    if (cu) { cu.soGop++; if (d.soCau) cu.soCau = (cu.soCau ?? 0) + d.soCau; continue; }
    ds.push({ ...d, soGop: 1 });
  }
  if (!ds.length) return null;
  const t0 = Math.min(...ds.map((d) => tg(d.ngay))); const t1 = Math.max(tg(moc), ...ds.map((d) => tg(d.ngay)));
  const y0 = new Date(t0).getUTCFullYear(); const y1 = new Date(t1).getUTCFullYear();
  const a = Date.UTC(y0, 0, 1); const b = Date.UTC(y1 + 1, 0, 1);
  const xT = (ms) => TRAI + ((ms - a) / (b - a)) * (W - TRAI - PHAI);
  const H = DINH + (LAN.length - 1) * KHOANG_LAN + 34;
  const buoc = y1 - y0 > 6 ? 2 : 1;
  const nam = [];
  for (let y = y0; y <= y1 + 1; y++) if ((y - y0) % buoc === 0) nam.push({ nam: y, x: xT(Date.UTC(y, 0, 1)) });
  const yLan = (k) => DINH + k * KHOANG_LAN;
  const xMoc = xT(tg(moc));

  // Vat can co dinh: nhan nam o tren cung, nhan "moc do" o day, cham cua moi diem.
  const chan = [
    { x0: TRAI, x1: W, y0: 0, y1: 14 },
    { x0: xMoc - 4 - 16 * RONG_KY_TU, x1: xMoc, y0: H - 2 - CO_CHU, y1: H },
  ];
  const diem = ds.map((d) => ({ ...d, nhanDx: d.nhan ?? null, x: xT(tg(d.ngay)), y: yLan(lanCua(d.loai)), nhan: `${ngayVN(d.ngay)} · ${nhanDiem(d)}` }));
  for (const p of diem) chan.push({ x0: p.x - 7, x1: p.x + 7, y0: p.y - 7, y1: p.y + 7 });

  // Xep nhan: uu tien diem moi hon (thuong day hon) truoc de nhan cua chung co hang thap.
  const thuTu = diem.map((_, i) => i).sort((i, j) => tg(diem[j].ngay) - tg(diem[i].ngay));
  const daDat = [];
  for (const i of thuTu) {
    const p = diem[i]; const rong = p.nhan.length * RONG_KY_TU;
    const neo = p.x + rong / 2 > W - 2 ? 'end' : p.x - rong / 2 < TRAI - 4 ? 'start' : 'middle';
    const x0 = neo === 'end' ? p.x - rong : neo === 'start' ? p.x : p.x - rong / 2;
    p.neo = neo; p.hang = -1;
    for (let h = 0; h < SO_HANG; h++) {
      const yChu = p.y - 11 - h * BUOC_HANG;
      const hop = { x0: x0 - 2, x1: x0 + rong + 2, y0: yChu - CO_CHU + 2, y1: yChu + 3 };
      if (hop.y0 < 14) break;
      if (chan.some((c) => giao(c, hop)) || daDat.some((c) => giao(c, hop))) continue;
      p.hang = h; p.yChu = yChu; daDat.push(hop); break;
    }
  }
  return { W, H, TRAI, PHAI, nam, xMoc, lan: LAN.map((l, k) => ({ l, nhan: NHAN_LAN[l], y: yLan(k) })), diem, soAn: diem.filter((p) => p.hang < 0).length };
}
