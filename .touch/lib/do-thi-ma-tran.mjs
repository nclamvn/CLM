/**
 * do-thi-ma-tran.mjs · Thu tu hang/cot cho MA TRAN cung cau (don vi x nhu cau). Tat dinh.
 *
 * VI SAO CO MA TRAN (29/09/2026): Ghoniem, Fekete & Castagliola (2004) do tren nguoi dung: voi do
 * thi tu khoang 20 nut tro len, ma tran ke cho tra cuu ("A co noi B khong", "ai noi nhieu nhat")
 * nhanh va dung hon node-link. Hub co 74 nut don vi + nhu cau: ban do de thay CAU TRUC, ma tran
 * de TRA CUU. Hai che do cung du lieu, cung khoi nhom.
 *
 * SAP XEP (seriation): hang va cot chia khoi theo lanh tho nhom cua ban do (cung thu tu), trong
 * khoi sap bang median heuristic (Eades & Wormald 1994) quet luan phien hang/cot, giu thu tu co
 * so giao nho nhat. Voi ma tran, dieu nay keo o co gia tri ve gan duong cheo cua moi khoi.
 * Ghi chu: day chinh la thu tu cua ban "hai truc" da thu va bo lam man chinh (64 giao canh so
 * voi 0 cua ban do); o ma tran khong co giao canh nen thu tu nay chi con loi ich, khong con hai.
 */

const soSanh = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const trungVi = (xs) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b); const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

/** So cap canh dao thu tu giua hang va cot (proxy do "gon" cua ma tran). */
export function demDao(canh, hang, cot) {
  const h = new Map(hang.map((id, i) => [id, i])); const c = new Map(cot.map((id, i) => [id, i]));
  let n = 0;
  for (let i = 0; i < canh.length; i++) {
    for (let j = i + 1; j < canh.length; j++) {
      const a = canh[i]; const b = canh[j];
      if (a.source === b.source || a.target === b.target) continue;
      if ((h.get(a.source) - h.get(b.source)) * (c.get(a.target) - c.get(b.target)) < 0) n++;
    }
  }
  return n;
}

/**
 * @param nodes nut da co truong lanhTho (tu dungBanDo)
 * @param edges canh cheo (cung_san_pham, match_da_ky, tu_choi)
 * @param thuTuLanhTho thu tu lanh tho cua ban do; 'chua_co' luon cuoi
 */
export function dungMaTran(nodes, edges, thuTuLanhTho) {
  const khoiSo = new Map([...thuTuLanhTho, 'chua_co'].map((g, i) => [g, i]));
  const khoa = (n) => khoiSo.get(n.lanhTho) ?? khoiSo.size;
  const dv = nodes.filter((n) => n.kind === 'don_vi');
  const nc = nodes.filter((n) => n.kind === 'nhu_cau');
  const ke = new Map([...dv, ...nc].map((n) => [n.id, []]));
  for (const e of edges) { ke.get(e.source)?.push(e.target); ke.get(e.target)?.push(e.source); }
  const sap = (thu, doiDien) => {
    const pos = new Map(doiDien.map((n, i) => [n.id, i])); const cu = new Map(thu.map((n, i) => [n.id, i]));
    return [...thu].sort((a, b) => {
      const ka = khoa(a); const kb = khoa(b);
      if (ka !== kb) return ka - kb;
      const ma = trungVi(ke.get(a.id).map((x) => pos.get(x)).filter((v) => v !== undefined));
      const mb = trungVi(ke.get(b.id).map((x) => pos.get(x)).filter((v) => v !== undefined));
      return (ma ?? cu.get(a.id)) - (mb ?? cu.get(b.id)) || cu.get(a.id) - cu.get(b.id) || soSanh(a.id, b.id);
    });
  };
  let hang = [...dv].sort((a, b) => khoa(a) - khoa(b) || soSanh(a.id, b.id));
  let cot = [...nc].sort((a, b) => khoa(a) - khoa(b) || soSanh(a.id, b.id));
  const dao = (h, c) => demDao(edges, h.map((n) => n.id), c.map((n) => n.id));
  const banDau = dao(hang, cot);
  let tot = { h: hang, c: cot, d: banDau };
  for (let v = 0; v < 24; v++) {
    cot = sap(cot, hang); hang = sap(hang, cot);
    const d = dao(hang, cot);
    if (d < tot.d) tot = { h: hang, c: cot, d };
  }
  const khoi = (thu) => {
    const out = []; let truoc = null;
    thu.forEach((n, i) => { if (n.lanhTho !== truoc) { out.push({ lanhTho: n.lanhTho, tu: i, den: i }); truoc = n.lanhTho; } else out[out.length - 1].den = i; });
    return out;
  };
  return {
    hang: tot.h.map((n) => n.id), cot: tot.c.map((n) => n.id),
    khoiHang: khoi(tot.h), khoiCot: khoi(tot.c),
    chiSo: { daoBanDau: banDau, daoSauSap: tot.d },
  };
}
