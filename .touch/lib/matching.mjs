/**
 * matching.mjs · Du lieu Matching Workbench v2 (M4). Ham thuan, tat dinh; dung chung cho script
 * sinh, trang web va cong check-matching.mjs.
 *
 * HAI VIEC:
 *   1. PHAN RA DIEM: diem cua engine rule v2 = wGiao * (so tu giao / so tu con lai cua cau)
 *      + wTier * trung binh trong so tier hai phia + wDiaDiem * (trung dia diem). Trang hien tung
 *      so hang de nguoi xem TU DUNG LAI duoc con so. Tinh lai phai ra DUNG so engine; cong kiem.
 *   2. SO DO HAI COT: cau (trai) va cung (phai), noi bang 11 match da ky va cap bi tu choi. Thu tu
 *      sap median (Eades & Wormald 1994) de it cat nhau, dem giao canh de giu ngan sach.
 * Dia diem: registry chua co truong location o phia cau, nen thanh phan nay bang 0 cho moi cap va
 * trang noi thang dieu do, khong an di.
 */

const soSanh = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const lam3 = (v) => Math.round(v * 1000) / 1000;

export function phanRaDiem(m, ct) {
  const tiLeGiao = m.tokenCau.length ? m.tokenGiao.length / m.tokenCau.length : 0;
  const tierCau = m.demandEvidence[0]?.tier ?? null;
  const tierCung = m.supplyEvidence[0]?.tier ?? null;
  const diemTier = tierCau && tierCung ? (ct.tierW[tierCau] + ct.tierW[tierCung]) / 2 : 0;
  const diaDiem = 0;
  const phan = { giao: ct.wGiao * tiLeGiao, tier: ct.wTier * diemTier, diaDiem: ct.wDiaDiem * diaDiem };
  const tong = phan.giao + phan.tier + phan.diaDiem;
  return {
    tiLeGiao: lam3(tiLeGiao), soGiao: m.tokenGiao.length, soTokenCau: m.tokenCau.length,
    quaNguong: tiLeGiao >= ct.nguongGiao,
    tierCau, tierCung, diemTier: lam3(diemTier), diaDiem,
    phan: { giao: lam3(phan.giao), tier: lam3(phan.tier), diaDiem: lam3(phan.diaDiem) },
    tong: lam3(tong), lamTron: Math.round(tong * 100) / 100,
  };
}

export function demGiaoHaiCot(canh, yTrai, yPhai) {
  let n = 0;
  for (let i = 0; i < canh.length; i++) for (let j = i + 1; j < canh.length; j++) {
    const a = canh[i]; const b = canh[j];
    if (a.cau === b.cau || a.cung === b.cung) continue;
    if ((yTrai.get(a.cau) - yTrai.get(b.cau)) * (yPhai.get(a.cung) - yPhai.get(b.cung)) < 0) n++;
  }
  return n;
}

export function dungMatching(mat) {
  const ct = mat.matchMeta.congThuc;
  const canh = [
    ...mat.signedMatches.map((m) => ({ cau: m.demandId, cung: m.supplyId, loai: 'da_ky', id: m.id })),
    ...mat.rejectedPairs.map((r) => ({ cau: r.demandId, cung: r.supplyId, loai: 'tu_choi', id: `tu_choi:${r.supplyId}>${r.demandId}` })),
  ];
  const trungVi = (xs) => { const t = [...xs].sort((a, b) => a - b); const k = t.length >> 1; return t.length % 2 ? t[k] : (t[k - 1] + t[k]) / 2; };
  let cau = [...new Set(canh.map((c) => c.cau))].sort(soSanh);
  let cung = [...new Set(canh.map((c) => c.cung))].sort(soSanh);
  const giao = (A, B) => demGiaoHaiCot(canh, new Map(A.map((x, i) => [x, i])), new Map(B.map((x, i) => [x, i])));
  const banDau = giao(cau, cung);
  let tot = { cau, cung, g: banDau };
  for (let v = 0; v < 16; v++) {
    const pc = new Map(cung.map((x, i) => [x, i]));
    cau = [...cau].sort((a, b) => trungVi(canh.filter((c) => c.cau === a).map((c) => pc.get(c.cung))) - trungVi(canh.filter((c) => c.cau === b).map((c) => pc.get(c.cung))) || soSanh(a, b));
    const pa = new Map(cau.map((x, i) => [x, i]));
    cung = [...cung].sort((a, b) => trungVi(canh.filter((c) => c.cung === a).map((c) => pa.get(c.cau))) - trungVi(canh.filter((c) => c.cung === b).map((c) => pa.get(c.cau))) || soSanh(a, b));
    const g = giao(cau, cung);
    if (g < tot.g) tot = { cau, cung, g };
  }
  // Chen tot nhat (them 30/09/2026, khi so match ky tu 11 len 24 va median ket o 4 giao): lan luot
  // nhac tung nut mot ben, thu dat vao MOI vi tri, nhan vi tri giam han so giao. Luan phien hai ben
  // toi khi khong con cai thien. Chi nhan khi giam han nen khong bao gio xau hon median; thu tu co
  // dinh nen tat dinh.
  const chen = (ds, laCau) => {
    let tot2 = laCau ? giao(ds, tot.cung) : giao(tot.cau, ds); let doi = false;
    for (const x of [...ds]) {
      const bo = ds.filter((y) => y !== x);
      for (let k = 0; k <= bo.length; k++) {
        const thu = [...bo.slice(0, k), x, ...bo.slice(k)];
        const g = laCau ? giao(thu, tot.cung) : giao(tot.cau, thu);
        if (g < tot2) { tot2 = g; ds = thu; doi = true; }
      }
    }
    return { ds, g: tot2, doi };
  };
  for (let luot = 0; luot < 8 && tot.g > 0; luot++) {
    const a = chen(tot.cau, true); tot = { ...tot, cau: a.ds, g: a.g };
    const b = chen(tot.cung, false); tot = { ...tot, cung: b.ds, g: b.g };
    if (!a.doi && !b.doi) break;
  }
  // Theo thanh phan lien thong (them 30/09/2026): hai thanh phan khong co canh chung thi xep thanh
  // hai KHOI tren duoi la khong bao gio cat nhau, nen so giao toi thieu cua ca so do bang TONG toi
  // thieu cua tung khoi. Khoi nho (hoan vi hai ben <= 40320) thi thu het de lay dung toi thieu; khoi
  // lon giu thu tu heuristic o tren. Hoa thi giu hoan vi dau tien theo thu tu chu cai, nen tat dinh.
  // Median + chen o tren ket o 4 giao khi so match ky len 24; toi thieu that la 1 (khoi K2,2 cua
  // P13, P15 voi Nhat Lan va Vien Co dien).
  const hoanVi = (xs) => { if (xs.length <= 1) return [xs]; const out = []; xs.forEach((x, i) => { for (const r of hoanVi([...xs.slice(0, i), ...xs.slice(i + 1)])) out.push([x, ...r]); }); return out; };
  const giaiThua = (n) => (n <= 1 ? 1 : n * giaiThua(n - 1));
  const khoi = []; const daXet = new Set();
  for (const c0 of [...new Set(canh.map((c) => c.cau))].sort(soSanh)) {
    if (daXet.has('c' + c0)) continue;
    const kc = new Set(); const ku = new Set(); const hang = [['c', c0]];
    while (hang.length) {
      const [loai, x] = hang.pop();
      if (daXet.has(loai + x)) continue; daXet.add(loai + x);
      if (loai === 'c') { kc.add(x); for (const c of canh) if (c.cau === x) hang.push(['u', c.cung]); }
      else { ku.add(x); for (const c of canh) if (c.cung === x) hang.push(['c', c.cau]); }
    }
    khoi.push({ cau: [...kc].sort(soSanh), cung: [...ku].sort(soSanh) });
  }
  let khoiCau = []; let khoiCung = [];
  for (const k of khoi) {
    const ck = canh.filter((c) => k.cau.includes(c.cau));
    const gk = (A, B) => demGiaoHaiCot(ck, new Map(A.map((x, i) => [x, i])), new Map(B.map((x, i) => [x, i])));
    let best = { cau: tot.cau.filter((x) => k.cau.includes(x)), cung: tot.cung.filter((x) => k.cung.includes(x)) };
    best.g = gk(best.cau, best.cung);
    if (best.g > 0 && giaiThua(k.cau.length) * giaiThua(k.cung.length) <= 40320) {
      for (const A of hoanVi(k.cau)) for (const B of hoanVi(k.cung)) { const g = gk(A, B); if (g < best.g) best = { cau: A, cung: B, g }; }
    }
    khoiCau = khoiCau.concat(best.cau); khoiCung = khoiCung.concat(best.cung);
  }
  const gKhoi = giao(khoiCau, khoiCung);
  if (gKhoi < tot.g) tot = { cau: khoiCau, cung: khoiCung, g: gKhoi };
  return {
    congThuc: ct,
    phanRa: Object.fromEntries(mat.signedMatches.map((m) => [m.id, phanRaDiem(m, ct)])),
    haiCot: { cau: tot.cau, cung: tot.cung, canh, giaoBanDau: banDau, giao: tot.g },
  };
}
