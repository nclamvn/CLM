/**
 * do-thi-ban-do.mjs · Bo cuc "BAN DO LANH THO NHOM" cho do thi cung cau. Tat dinh, tinh luc build.
 *
 * VI SAO (29/09/2026, sau khi do thuc te tren du lieu that):
 *   Vong cao loc 09_nghien_cuu_ui/domains/truc_quan_do_thi (187 claim) cho ba nguyen tac:
 *   1. Giao canh la tieu chi tham my anh huong manh nhat toi hieu do thi (Purchase 1997).
 *   2. Moi net ve phai mang du lieu (Tufte, ty le data-ink).
 *   3. Tap/nhom ma hoa bang VUNG bao quanh nut thay vi canh toi nut nhom. Collins, Penn &
 *      Carpendale 2009 (Bubble Sets): khi thanh vien nhom da tu gan nhau theo bo cuc noi ("both
 *      spatial rights") thi vung bao la du; duong vien lom chi can khi nhom bi rai. Do tren du lieu
 *      nay: 51/54 canh nam trong mot nhom, nen day dung la truong hop do. Bo cuc tat dinh de anh
 *      chup so moc duoc.
 *   Da thu bo cuc HAI TRUC (lib/do-thi-ba-tang.mjs, Abdelaal 2022): voi du lieu nay, 54 canh
 *   cung-cau nam trong 10 nhom, ep len hai truc 1 chieu cho 64 giao canh du da sap median
 *   (Eades & Wormald 1994), trong khi bo cuc 2 chieu theo nhom cho 0. Tieu chi 1 quyet dinh: bo
 *   hai truc lam man chinh, giu thu tu median cua no cho MA TRAN (seriation hang/cot).
 *
 * THUAT TOAN
 *   a. Nhom chinh cua moi nut: nhu cau -> nhom trong anh xa DA DUYET; don vi -> nhom chiem da so
 *      trong cac nhu cau no noi toi (hoa thi nhom so nho nhat trong claim nhom cua no); khong co
 *      gi -> vung "Chua co claim nhom" (honest-null, khong doan).
 *   b. Thu tu lanh tho tren vong elip: thu het hoan vi (nhom 1 co dinh o dinh) va chon thu tu co
 *      tong "do dai cau noi" nho nhat; hoa thi chon thu tu gan thu tu QD 21/2026 nhat.
 *   c. Ban kinh lanh tho ~ can bac hai so thanh vien (dien tich ti le so nut).
 *   d. Trong lanh tho: khoi dau theo xoan hoa huong duong (Vogel), roi luc tat dinh: day giua moi
 *      cap nut, keo theo canh cung-cau, lo xo ve tam lanh tho, tuong mem giu nut trong vung. Don
 *      vi co claim o nhom thu hai bi keo nhe ve lanh tho do, nen nam o bo gan no.
 *   Khong Math.random. So sanh chuoi bang ma diem (khong localeCompare: khac may khac ket qua).
 */

export const RONG = 1200;
export const CAO = 820;
export const LOAI_CHEO = ['cung_san_pham', 'match_da_ky', 'tu_choi'];
const CHUA_CO = 'chua_co';

const soSanh = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const lam = (v) => Math.round(v * 10) / 10;

/** Dem cap doan thang cat nhau (khong tinh cap chung dau mut). */
export function demGiao(canh, pos) {
  const o = (a, b, c) => Math.sign((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]));
  let n = 0;
  for (let i = 0; i < canh.length; i++) {
    for (let j = i + 1; j < canh.length; j++) {
      const a = canh[i]; const b = canh[j];
      if (a.source === b.source || a.source === b.target || a.target === b.source || a.target === b.target) continue;
      const p = pos.get(a.source); const q = pos.get(a.target); const r = pos.get(b.source); const s = pos.get(b.target);
      if (o(p, q, r) * o(p, q, s) < 0 && o(r, s, p) * o(r, s, q) < 0) n++;
    }
  }
  return n;
}

/** Dem canh di XUYEN qua mot nut khong phai dau mut cua no (che nut, gay doc sai). */
export function demXuyenNut(canh, pos, banKinh) {
  let n = 0;
  for (const e of canh) {
    const [x1, y1] = pos.get(e.source); const [x2, y2] = pos.get(e.target);
    const dx = x2 - x1; const dy = y2 - y1; const L2 = dx * dx + dy * dy || 1;
    for (const [id, [px, py]] of pos) {
      if (id === e.source || id === e.target) continue;
      const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / L2));
      if (Math.hypot(x1 + t * dx - px, y1 + t * dy - py) < (banKinh.get(id) ?? 5)) n++;
    }
  }
  return n;
}

/** Duyet moi hoan vi TAI CHO (thuat toan Heap), goi tham(mang) cho tung hoan vi. Khong sinh
 *  362 880 mang nhu ban de quy cu: cong chay lai bo cuc nhieu lan nen phan nay phai re. */
function duyetHoanVi(xs, tham) {
  const a = [...xs]; const c = new Array(a.length).fill(0);
  tham(a);
  let i = 0;
  while (i < a.length) {
    if (c[i] < i) {
      const j = i % 2 === 0 ? 0 : c[i];
      [a[j], a[i]] = [a[i], a[j]];
      tham(a); c[i]++; i = 0;
    } else { c[i] = 0; i++; }
  }
}

/** Ten ngan cho nhan truc tiep: uu tien ten viet tat trong ngoac, bo tien to phap nhan. */
export function tenNgan(s, max = 24) {
  const ngoac = s.match(/\(([^)]{2,14})\)\s*$/);
  if (ngoac) return ngoac[1];
  const t = s.replace(/^(Công ty cổ phần|Công ty TNHH|Công ty|Tổng công ty|Tập đoàn|Viện)\s+/i, '');
  return t.length > max ? `${t.slice(0, max - 1)}…` : t;
}

export function banKinhNut(n) {
  if (n.kind === 'nhu_cau') return 6;
  return 4.5 + Math.min(4.5, Math.sqrt(n.soClaim ?? 0) * 1.2);
}

/**
 * Thu mot LUOI THAM SO CO DINH (khoang cach them quanh nut mang nhan, ban kinh them cho moi nhan
 * ten trong lanh tho) va giu cau hinh tot nhat theo thu tu tu dien: giao canh, canh xuyen nut,
 * nhan chong nhau; hoa thi tham so nho hon. Tat dinh: luoi va thu tu thu khong doi.
 */
const BO_NHO_THU_TU = new Map();
export const XA_NHAN = 12; // px lui them cho vi tri nhan hau to '+'; phai khop viTriNhan o DoThiCungCau.tsx
export const LUOI_THAM_SO = [0, 8, 16, 24].flatMap((themCho) => [0, 9].map((themR) => ({ themCho, themR })));
export function dungBanDo(nodes, edges) {
  let tot = null;
  for (const ts of LUOI_THAM_SO) {
    const kq = dungBanDoMot(nodes, edges, ts);
    const c = kq.chiSo;
    const diem = [c.giaoCanh, c.canhXuyenNut, c.nhanChongNhau];
    const hon = (x, y) => { for (let i = 0; i < x.length; i++) if (x[i] !== y[i]) return x[i] < y[i]; return false; };
    if (!tot || hon(diem, tot.diem)) tot = { kq, diem };
    if (diem.every((v) => v === 0)) break; // khong the tot hon; cac cau hinh sau co tham so lon hon
  }
  return tot.kq;
}

function dungBanDoMot(nodes, edges, thamSo) {
  const nhomNut = nodes.filter((n) => n.kind === 'nhom').sort((a, b) => Number(a.id.slice(3)) - Number(b.id.slice(3)));
  const soNhom = nhomNut.map((n) => n.id.slice(3));
  const nhanNhom = new Map(nhomNut.map((n) => [n.id.slice(3), n.label.replace(/^Nhóm \d+ · /, '')]));
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const cheo = edges.filter((e) => LOAI_CHEO.includes(e.kind) && byId.has(e.source) && byId.has(e.target));
  const dv = nodes.filter((n) => n.kind === 'don_vi');
  const nc = nodes.filter((n) => n.kind === 'nhu_cau');

  // a. Nhom chinh.
  const chinh = new Map();
  for (const n of nc) chinh.set(n.id, n.nhom && soNhom.includes(String(n.nhom)) ? String(n.nhom) : CHUA_CO);
  const phu = new Map(); // don vi -> cac nhom khac nhom chinh (tu claim va tu nhu cau ke)
  for (const n of dv) {
    const dem = new Map();
    for (const e of cheo) if (e.source === n.id) { const g = chinh.get(e.target); if (g !== CHUA_CO) dem.set(g, (dem.get(g) ?? 0) + 1); }
    const claim = (n.nhoms ?? []).map(String).filter((g) => soNhom.includes(g)).sort((a, b) => Number(a) - Number(b));
    let g = CHUA_CO;
    if (dem.size) {
      const max = Math.max(...dem.values());
      g = [...dem.keys()].filter((k) => dem.get(k) === max).sort((a, b) => Number(a) - Number(b))[0];
    } else if (claim.length) g = claim[0];
    chinh.set(n.id, g);
    phu.set(n.id, [...new Set([...claim, ...dem.keys()])].filter((x) => x !== g).sort((a, b) => Number(a) - Number(b)));
  }

  // b. Thu tu lanh tho tren vong.
  const vung = [...soNhom];
  const cau = new Map(); // "a|b" -> trong so noi giua hai lanh tho
  const them = (a, b, w) => { if (a === b || a === CHUA_CO || b === CHUA_CO) return; const k = [a, b].sort().join('|'); cau.set(k, (cau.get(k) ?? 0) + w); };
  for (const e of cheo) them(chinh.get(e.source), chinh.get(e.target), 1);
  for (const [id, gs] of phu) for (const g of gs) them(chinh.get(id), g, 0.5);
  // Thu tu chi phu thuoc cau noi, khong phu thuoc tham so luoi: tinh mot lan roi dung lai.
  const khoaThu = `${vung.join(',')}|${[...cau].sort((x, y) => soSanh(x[0], y[0])).map(([k, w]) => `${k}:${w}`).join(',')}`;
  if (!BO_NHO_THU_TU.has(khoaThu)) {
    const giuNguyen = vung[0];
    let tot = null;
    duyetHoanVi(vung.slice(1), (p) => {
      const thu = [giuNguyen, ...p];
      const vt = new Map(thu.map((g, i) => [g, i]));
      let chiPhi = 0;
      for (const [k, w] of cau) { const [a, b] = k.split('|'); const d = Math.abs(vt.get(a) - vt.get(b)); chiPhi += w * Math.min(d, thu.length - d); }
      let lech = 0; thu.forEach((g, i) => { lech += Math.abs(i - soNhom.indexOf(g)); });
      // Hoa ca chi phi lan do lech thi chon thu tu nho nhat theo tu dien (so nhom): ket qua khong
      // phu thuoc thu tu duyet hoan vi.
      const nhoHon = () => { for (let i = 0; i < thu.length; i++) if (thu[i] !== tot.thu[i]) return Number(thu[i]) < Number(tot.thu[i]); return false; };
      if (!tot || chiPhi < tot.chiPhi || (chiPhi === tot.chiPhi && (lech < tot.lech || (lech === tot.lech && nhoHon())))) tot = { thu: [...thu], chiPhi, lech };
    });
    BO_NHO_THU_TU.set(khoaThu, tot ? tot.thu : vung);
  }
  const thuTu = BO_NHO_THU_TU.get(khoaThu);

  // c. Lanh tho: ban kinh theo so thanh vien, dat tren elip.
  const thanhVien = new Map([...thuTu, CHUA_CO].map((g) => [g, []]));
  for (const n of [...dv, ...nc]) thanhVien.get(chinh.get(n.id)).push(n);
  // Don vi co match da ky se mang nhan ten truc tiep: can them cho trong lanh tho.
  const coMatchSom = new Set(cheo.filter((e) => e.kind === 'match_da_ky').map((e) => e.source));
  const soNhanTen = (g) => thanhVien.get(g).filter((n) => coMatchSom.has(n.id)).length;
  const rCuaNhom = (g) => 24 + 19 * Math.sqrt(thanhVien.get(g).length) + thamSo.themR * soNhanTen(g);
  const tam = { x: RONG / 2, y: CAO / 2 + 6 };
  const RX = RONG / 2 - 150; const RY = CAO / 2 - 118;
  const lanhTho = [];
  const tong = thuTu.reduce((s, g) => s + rCuaNhom(g), 0);
  let goc = -Math.PI / 2 - (rCuaNhom(thuTu[0]) / tong) * Math.PI;
  for (const g of thuTu) {
    const r = rCuaNhom(g);
    const phan = (r / tong) * Math.PI * 2;
    const a = goc + phan / 2; goc += phan;
    lanhTho.push({ id: `nh:${g}`, so: g, nhan: nhanNhom.get(g), cx: tam.x + Math.cos(a) * RX, cy: tam.y + Math.sin(a) * RY, r, goc: a });
  }
  if (thanhVien.get(CHUA_CO).length) {
    lanhTho.push({ id: `nh:${CHUA_CO}`, so: null, nhan: 'Chưa có câu nguồn về nhóm', cx: tam.x, cy: tam.y, r: rCuaNhom(CHUA_CO), goc: null });
  }
  // Tach lanh tho chong nhau: day cap tat dinh, giu trong khung (chua le cho nhan).
  const LE_X = 24; const LE_TREN = 44; const LE_DUOI = 40; const KHE_LT = 30; const CHO_NHAN = 40;
  for (let v = 0; v < 200; v++) {
    let dich = 0;
    for (let i = 0; i < lanhTho.length; i++) {
      for (let j = i + 1; j < lanhTho.length; j++) {
        const a = lanhTho[i]; const b = lanhTho[j];
        const dx = b.cx - a.cx; const dy = b.cy - a.cy; const d = Math.hypot(dx, dy) || 0.01;
        // Hai vong xep doc can them cho cho nhan nhom (2 dong) nam giua chung.
        const doc = Math.abs(dy) / d;
        const thieu = a.r + b.r + KHE_LT + CHO_NHAN * doc - d;
        if (thieu > 0) { const k = thieu / 2 / d; a.cx -= dx * k; a.cy -= dy * k; b.cx += dx * k; b.cy += dy * k; dich += thieu; }
      }
    }
    for (const l of lanhTho) {
      l.cx = Math.min(RONG - LE_X - l.r, Math.max(LE_X + l.r, l.cx));
      l.cy = Math.min(CAO - LE_DUOI - l.r, Math.max(LE_TREN + l.r, l.cy));
    }
    if (dich < 0.01) break;
  }
  // Goc nhan: huong ra ngoai tu tam khung, de nhan khong de len lanh tho ben trong.
  for (const l of lanhTho) l.goc = l.so === null ? -Math.PI / 2 : Math.atan2(l.cy - tam.y, l.cx - tam.x);
  // Nhan nhom (2 dong, ~34 x (7 x so ky tu)): chon TREN hay DUOI sao cho khong de len vong tron
  // khac hay nhan da dat. Uu tien theo huong ra ngoai; ca hai deu va thi chon cho va it hon.
  const hopNhan = (l, tren) => {
    const w = Math.max(120, 7.2 * ((l.nhan ?? '').length + 3)); const h = 32;
    const y0 = tren ? l.cy - l.r - 6 - h : l.cy + l.r + 4;
    return { x0: l.cx - w / 2, x1: l.cx + w / 2, y0, y1: y0 + h };
  };
  const vaTron = (b, c) => {
    const nx = Math.max(b.x0, Math.min(c.cx, b.x1)); const ny = Math.max(b.y0, Math.min(c.cy, b.y1));
    return Math.max(0, c.r - Math.hypot(nx - c.cx, ny - c.cy));
  };
  const vaHop = (a, b) => Math.max(0, Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0)) * Math.max(0, Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0));
  const daDat = [];
  for (const l of lanhTho) {
    const uuTien = Math.sin(l.goc) < 0.2;
    const phat = (tren) => {
      const b = hopNhan(l, tren); let p = 0;
      for (const c of lanhTho) if (c !== l) p += vaTron(b, c) * 40;
      for (const d of daDat) p += vaHop(b, d);
      if (b.y0 < 0 || b.y1 > CAO) p += 1e6;
      return p;
    };
    const pT = phat(true); const pD = phat(false);
    l.nhanTren = pT === pD ? uuTien : pT < pD;
    daDat.push(hopNhan(l, l.nhanTren));
  }
  const ltCua = new Map(lanhTho.map((l) => [l.so ?? CHUA_CO, l]));

  // d. Khoi dau Vogel trong lanh tho, roi luc tat dinh.
  const pos = new Map();
  for (const l of lanhTho) {
    const ms = thanhVien.get(l.so ?? CHUA_CO).slice().sort((a, b) => soSanh(a.kind, b.kind) || soSanh(a.id, b.id));
    ms.forEach((n, i) => {
      const rr = (l.r - 14) * Math.sqrt((i + 0.5) / ms.length); const a = i * 2.39996323 + (l.goc ?? 0);
      pos.set(n.id, { x: l.cx + Math.cos(a) * rr, y: l.cy + Math.sin(a) * rr });
    });
  }
  const ids = [...pos.keys()];
  const rNut = new Map(ids.map((id) => [id, banKinhNut(byId.get(id))]));
  const VONG = 420;
  for (let v = 0; v < VONG; v++) {
    const buoc = 6 * (1 - v / VONG) + 0.15;
    const d = new Map(ids.map((id) => [id, { x: 0, y: 0 }]));
    for (let i = 0; i < ids.length; i++) {
      const a = pos.get(ids[i]);
      for (let j = i + 1; j < ids.length; j++) {
        const b = pos.get(ids[j]);
        let dx = a.x - b.x; let dy = a.y - b.y; let dist = Math.hypot(dx, dy);
        if (dist < 0.01) { dx = 0.01 * (i < j ? 1 : -1); dy = 0; dist = 0.01; }
        const muon = rNut.get(ids[i]) + rNut.get(ids[j]) + 16 + (coMatchSom.has(ids[i]) || coMatchSom.has(ids[j]) ? thamSo.themCho : 0);
        if (dist > muon * 3) continue;
        const f = dist < muon ? (muon - dist) * 0.5 + 1.2 : (muon * muon) / (dist * dist) * 0.6;
        d.get(ids[i]).x += (dx / dist) * f; d.get(ids[i]).y += (dy / dist) * f;
        d.get(ids[j]).x -= (dx / dist) * f; d.get(ids[j]).y -= (dy / dist) * f;
      }
    }
    for (const e of cheo) {
      const a = pos.get(e.source); const b = pos.get(e.target);
      const dx = b.x - a.x; const dy = b.y - a.y; const dist = Math.hypot(dx, dy) || 0.01;
      const f = Math.max(0, dist - 34) * 0.05;
      d.get(e.source).x += (dx / dist) * f; d.get(e.source).y += (dy / dist) * f;
      d.get(e.target).x -= (dx / dist) * f; d.get(e.target).y -= (dy / dist) * f;
    }
    for (const id of ids) {
      const p = pos.get(id); const l = ltCua.get(chinh.get(id)); const dd = d.get(id);
      dd.x += (l.cx - p.x) * 0.02; dd.y += (l.cy - p.y) * 0.02;
      for (const g of phu.get(id) ?? []) { const l2 = ltCua.get(g); if (l2) { dd.x += (l2.cx - p.x) * 0.012; dd.y += (l2.cy - p.y) * 0.012; } }
      const len = Math.hypot(dd.x, dd.y) || 1;
      p.x += (dd.x / len) * Math.min(len, buoc); p.y += (dd.y / len) * Math.min(len, buoc);
      // Tuong mem: nut nhom chinh khong ra khoi lanh tho (tru phan le cho don vi hai nhom).
      const room = l.r - rNut.get(id) - 4 + ((phu.get(id) ?? []).length ? 10 : 0);
      const ox = p.x - l.cx; const oy = p.y - l.cy; const od = Math.hypot(ox, oy);
      if (od > room) { p.x = l.cx + (ox / od) * room; p.y = l.cy + (oy / od) * room; }
    }
  }

  // e. Tinh chinh: doi cho hai nut CUNG LOAI trong CUNG lanh tho neu giam han giao canh (va khong
  //    tao canh xuyen nut). Tham lam, thu tu co dinh, dung khi khong con cap nao cai thien.
  const P = new Map(ids.map((id) => [id, [lam(pos.get(id).x), lam(pos.get(id).y)]]));
  const diem = () => demGiao(cheo, P) * 10 + demXuyenNut(cheo, P, rNut);
  let hienTai = diem();
  for (let luot = 0; luot < 6 && hienTai > 0; luot++) {
    let doi = false;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const a = ids[i]; const b = ids[j];
        if (byId.get(a).kind !== byId.get(b).kind || chinh.get(a) !== chinh.get(b)) continue;
        const pa = P.get(a); P.set(a, P.get(b)); P.set(b, pa);
        const moi = diem();
        if (moi < hienTai) { hienTai = moi; doi = true; } else { P.set(b, P.get(a)); P.set(a, pa); }
      }
    }
    if (!doi) break;
  }
  // f. Nhan truc tiep cua nut (ma nhu cau, ten ngan don vi co match da ky). Bai toan dat nhan
  //    diem la NP-kho (Christensen, Marks & Shieber 1995); dung mo hinh 8 vi tri cua bai do va
  //    tham lam theo thu tu co dinh, phat khi va nhan nhom, nut, canh, nhan khac. Bai bao chi ra
  //    tham lam kem hon neu khong sua cuc bo; o day chi so nhanChongNhau do lai va giu = 0 boi
  //    cong, neu tang thi phai nang len sua cuc bo. Tinh o day de man web chi ve.
  const coMatch = new Set(cheo.filter((e) => e.kind === 'match_da_ky').flatMap((e) => [e.source, e.target]));
  const hopNut = [...P].map(([id, [x, y]]) => { const r = rNut.get(id); return { x0: x - r, x1: x + r, y0: y - r, y1: y + r, id }; });
  const nhanNut = new Map();
  const coNhan = ids.filter((id) => byId.get(id).kind === 'nhu_cau' || coMatch.has(id))
    .sort((a, b) => P.get(a)[1] - P.get(b)[1] || P.get(a)[0] - P.get(b)[0] || soSanh(a, b));
  const nhanDaDat = [];
  const hopCua = []; const uuCua = [];
  for (const id of coNhan) {
    const n = byId.get(id); const [x, y] = P.get(id); const x0n = x; const y0n = y; const r = rNut.get(id); const l = ltCua.get(chinh.get(id));
    const ten = n.kind === 'nhu_cau' ? `P${n.maSp}` : tenNgan(n.label, 22);
    const w = (n.kind === 'nhu_cau' ? 6.4 : 6.3) * ten.length + 4;
    // Mo hinh 8 vi tri cua ban do hoc (Christensen, Marks & Shieber 1995): trai, phai, tren, duoi va
    // bon goc cheo. Goc cheo lech doc them mot ban kinh nut.
    // Hau to '+' (them 30/09/2026): cung vi tri nhung lui ra xa them XA_NHAN px, chi dung khi ca tam
    // vi tri sat nut deu va cham (nhom 4 day len sau lo lam giau dot 01).
    const hop = (benDu, x = x0n, y = y0n) => {
      const xa = benDu.endsWith('+') ? XA_NHAN : 0; const ben = benDu.replace('+', '');
      const [ngang, doc] = ben.split('-');
      if (ngang === 'tren' || ngang === 'duoi') {
        const y0 = ngang === 'tren' ? y - r - 16 - xa : y + r + 3 + xa;
        return { x0: x - w / 2, x1: x + w / 2, y0, y1: y0 + 13 };
      }
      const x0 = ngang === 'trai' ? x - r - 5 - w - xa : x + r + 5 + xa;
      const dy = doc === 'tren' ? -(r + 4) : doc === 'duoi' ? r + 4 : 0;
      return { x0, x1: x0 + w, y0: y - 7 + dy, y1: y + 6 + dy };
    };
    const phat = (ben) => {
      const b = hop(ben); let p = 0;
      for (const d of daDat) p += vaHop(b, d) * 4;
      for (const d of hopNut) if (d.id !== id) p += vaHop(b, d) * 8;
      for (const d of nhanDaDat) p += vaHop(b, d) * 8;
      // Nhan de len canh: lay mau 24 diem tren moi canh khong noi toi chinh nut nay.
      for (const e of cheo) {
        if (e.source === id || e.target === id) continue;
        const [x1, y1] = P.get(e.source); const [x2, y2] = P.get(e.target);
        for (let k = 1; k < 24; k++) { const t = k / 24; const px = x1 + (x2 - x1) * t; const py = y1 + (y2 - y1) * t; if (px > b.x0 && px < b.x1 && py > b.y0 && py < b.y1) p += 12; }
      }
      if (b.x0 < 0 || b.x1 > RONG || b.y0 < 0 || b.y1 > CAO) p += 1e6;
      return p;
    };
    // Thu tu uu tien: ben ra ngoai tam lanh tho, ben kia, tren, duoi. Chi doi khi giam han va cham.
    const uu8 = x < l.cx - 4 ? ['trai', 'phai', 'tren', 'duoi', 'trai-tren', 'trai-duoi', 'phai-tren', 'phai-duoi'] : ['phai', 'trai', 'tren', 'duoi', 'phai-tren', 'phai-duoi', 'trai-tren', 'trai-duoi'];
    const uu = [...uu8, ...['tren', 'duoi', 'trai', 'phai'].map((b) => b + '+')];
    let ben = uu[0]; let pMin = phat(ben);
    for (const b of uu.slice(1)) { const q = phat(b); if (q < pMin) { pMin = q; ben = b; } }
    nhanNut.set(id, { ten, ben });
    nhanDaDat.push(hop(ben));
    hopCua.push(hop); uuCua.push(uu);
  }
  // g. Sua cuc bo (them 30/09/2026 khi lo lam giau dot 01 dua registry tu 44 len 60 don vi va tham lam
  //    de lai 2 nhan chong nhau). Dung loi khuyen cua chinh bai Christensen, Marks & Shieber: sau tham
  //    lam, lan luot dat lai tung nhan con va cham vao vi tri it va cham nhat khi cac nhan khac dung
  //    yen. Chi doi khi giam han, nen khong bao gio lam xau di; thu tu co dinh nen tat dinh.
  const vaCua = (i, b) => {
    let v = 0;
    for (const d of daDat) if (vaHop(b, d) > 0) v++;
    for (const d of hopNut) if (d.id !== coNhan[i] && vaHop(b, d) > 0) v++;
    for (let j = 0; j < nhanDaDat.length; j++) if (j !== i && vaHop(b, nhanDaDat[j]) > 0) v++;
    return v;
  };
  for (let luot = 0; luot < 6; luot++) {
    let doi = false;
    for (let i = 0; i < coNhan.length; i++) {
      let tot = vaCua(i, nhanDaDat[i]);
      if (tot === 0) continue;
      for (const ben of uuCua[i]) {
        const b = hopCua[i](ben);
        if (b.x0 < 0 || b.x1 > RONG || b.y0 < 0 || b.y1 > CAO) continue;
        const v = vaCua(i, b);
        if (v < tot) { tot = v; nhanDaDat[i] = b; nhanNut.set(coNhan[i], { ...nhanNut.get(coNhan[i]), ben }); doi = true; }
      }
    }
    if (!doi) break;
  }
  // h. Day nut (them 30/09/2026). Khi o nhom 4 moi nut deu co hang xom sat den muc khong con vi tri
  //    nhan nao trong (ca 12 vi tri deu va), sua nhan khong du: phai xe dich chinh cac NUT. Voi moi
  //    nhan con va cham, thu dich nut cua no hoac nut no de len theo 8 huong x 3 buoc, trong lanh tho.
  //    Chi nhan buoc lam GIAM HAN diem tong theo thu tu uu tien giao canh > canh xuyen nut > nhan
  //    chong nhau, nen giao canh va xuyen nut khong bao gio tang. Thu tu co dinh nen tat dinh.
  const iNhan = new Map(coNhan.map((id, i) => [id, i]));
  const iHop = new Map(hopNut.map((h, k) => [h.id, k]));
  const demVa = () => {
    let v = 0;
    for (let i = 0; i < nhanDaDat.length; i++) {
      for (const d of daDat) if (vaHop(nhanDaDat[i], d) > 0) v++;
      for (const d of hopNut) if (d.id !== coNhan[i] && vaHop(nhanDaDat[i], d) > 0) v++;
      for (let j = i + 1; j < nhanDaDat.length; j++) if (vaHop(nhanDaDat[i], nhanDaDat[j]) > 0) v++;
    }
    return v;
  };
  const diemTong = () => demGiao(cheo, P) * 1e4 + demXuyenNut(cheo, P, rNut) * 1e2 + demVa();
  const datNut = (id, x, y) => {
    P.set(id, [lam(x), lam(y)]);
    const r = rNut.get(id); const k = iHop.get(id);
    hopNut[k] = { x0: x - r, x1: x + r, y0: y - r, y1: y + r, id };
    const i = iNhan.get(id);
    if (i !== undefined) nhanDaDat[i] = hopCua[i](nhanNut.get(id).ben, x, y);
  };
  const trongLanhTho = (id, x, y) => {
    const l = ltCua.get(chinh.get(id)); if (!l) return false;
    const room = l.r - rNut.get(id) - 4 + ((phu.get(id) ?? []).length ? 10 : 0);
    return Math.hypot(x - l.cx, y - l.cy) <= room;
  };
  const HUONG = [[1, 0], [-1, 0], [0, 1], [0, -1], [0.7071, 0.7071], [-0.7071, 0.7071], [0.7071, -0.7071], [-0.7071, -0.7071]];
  let dTong = diemTong();
  for (let luot = 0; luot < 6 && dTong % 100 > 0; luot++) {
    let doi = false;
    for (let i = 0; i < coNhan.length; i++) {
      const b = nhanDaDat[i];
      const dung = [coNhan[i], ...hopNut.filter((d) => d.id !== coNhan[i] && vaHop(b, d) > 0).map((d) => d.id),
        ...coNhan.filter((id, j) => j !== i && vaHop(b, nhanDaDat[j]) > 0)];
      if (dung.length === 1 && !daDat.some((d) => vaHop(b, d) > 0)) continue;
      for (const id of [...new Set(dung)]) {
        const [x0, y0] = P.get(id);
        let totNhat = null;
        for (const buoc of [6, 12, 18]) for (const [dx, dy] of HUONG) {
          const x = x0 + dx * buoc; const y = y0 + dy * buoc;
          if (!trongLanhTho(id, x, y)) continue;
          datNut(id, x, y);
          const d = diemTong();
          if (d < dTong && (!totNhat || d < totNhat.d)) totNhat = { d, x, y };
          datNut(id, x0, y0);
        }
        if (totNhat) { datNut(id, totNhat.x, totNhat.y); dTong = totNhat.d; doi = true; }
      }
    }
    if (!doi) break;
  }
  let nhanVa = 0;
  for (let i = 0; i < nhanDaDat.length; i++) {
    for (const d of daDat) if (vaHop(nhanDaDat[i], d) > 0) nhanVa++;
    for (const d of hopNut) if (d.id !== coNhan[i] && vaHop(nhanDaDat[i], d) > 0) nhanVa++;
    for (let j = i + 1; j < nhanDaDat.length; j++) if (vaHop(nhanDaDat[i], nhanDaDat[j]) > 0) nhanVa++;
  }

  const chiSo = {
    nhanChongNhau: nhanVa,
    soCanhVe: cheo.length,
    giaoCanh: demGiao(cheo, P),
    canhXuyenNut: demXuyenNut(cheo, P, rNut),
    canhNoiHaiLanhTho: cheo.filter((e) => chinh.get(e.source) !== chinh.get(e.target)).length,
    netTietKiem: edges.filter((e) => e.kind === 'thuoc_nhom').length,
  };
  return {
    rong: RONG, cao: CAO, thamSo,
    thuTuLanhTho: thuTu,
    lanhTho: lanhTho.map((l) => ({
      ...l, cx: lam(l.cx), cy: lam(l.cy), r: lam(l.r), goc: l.goc === null ? null : Math.round(l.goc * 1000) / 1000,
      soDv: thanhVien.get(l.so ?? CHUA_CO).filter((n) => n.kind === 'don_vi').length,
      soNc: thanhVien.get(l.so ?? CHUA_CO).filter((n) => n.kind === 'nhu_cau').length,
    })),
    nodes: nodes.map((n) => {
      if (n.kind === 'nhom') { const l = ltCua.get(n.id.slice(3)); return { id: n.id, x: l ? lam(l.cx) : null, y: l ? lam(l.cy) : null, lanhTho: n.id.slice(3) }; }
      const [x, y] = P.get(n.id); return { id: n.id, x, y, lanhTho: chinh.get(n.id), lanhThoPhu: phu.get(n.id) ?? [], ...(nhanNut.has(n.id) ? { nhan: nhanNut.get(n.id) } : {}) };
    }),
    chiSo,
  };
}
