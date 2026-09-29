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
  return {
    congThuc: ct,
    phanRa: Object.fromEntries(mat.signedMatches.map((m) => [m.id, phanRaDiem(m, ct)])),
    haiCot: { cau: tot.cau, cung: tot.cung, canh, giaoBanDau: banDau, giao: tot.g },
  };
}
