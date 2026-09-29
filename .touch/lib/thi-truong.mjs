/**
 * thi-truong.mjs · Du lieu man M1 "Toan canh thi truong". Ham thuan, tat dinh; dung chung cho
 * script sinh, trang web va cong check-thi-truong.mjs.
 *
 * SANKEY BA TANG (don vi -> nhom cong nghe -> nhu cau). Can cu registry truc_quan_do_thi:
 *   - Sankey ve can bang dong (Schmidt 2008, tier B): mot don vi dong phai la mot dai luong BAO
 *     TOAN. O day don vi dong = MOT CAP CUNG-CAU DUOC CHAP NHAN (canh cung san pham co cau nguon,
 *     hoac match da ky). Cap co ca hai thi tinh MOT lan, mau theo quan he manh nhat (da ky).
 *     Cap bi tu choi KHONG mang dong: tu choi nghia la nguoi gac cong ket luan khong phai ben cung.
 *   - Do day ti le thuan so cap. Nut nhom: vao = ra (cong kiem).
 *   - Thu tu nut: toi thieu "dien tich giao cat" = tong tich trong so cac cap dong cat nhau
 *     (Zarate et al. 2018). Nhom giu thu tu lanh tho cua ban do (rang buoc nhom cua cung bai), nhu
 *     cau xep thanh khoi theo nhom nen tang phai khong the cat nhau; tang trai sap trong so trung
 *     binh roi doi cho ke nhau khi giam han dien tich giao.
 *   - Nhu cau khong co ben cung van co mat, ve rong ruot voi chieu cao toi thieu: do la khoang
 *     trong, khong duoc bien mat khoi hinh.
 * So sanh chuoi bang ma diem, khong Math.random.
 */

const soSanh = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
const lam = (v) => Math.round(v * 10) / 10;

export const KICH = { rong: 1200, xDv: 250, xNhom: 500, xNc: 872, beRong: 12, beRongNhom: 196, k: 12, kheDv: 4, kheNhom: 16, kheNc: 5, trongCao: 11, tren: 16 };

/** Cac cap cung-cau duoc chap nhan, tu hub-graph. */
export function capChapNhan(graph) {
  const cap = new Map();
  for (const e of graph.edges) {
    if (e.kind !== 'cung_san_pham' && e.kind !== 'match_da_ky') continue;
    const k = `${e.source}|${e.target}`;
    if (!cap.has(k)) cap.set(k, { dv: e.source, nc: e.target, daKy: false, matchId: null });
    if (e.kind === 'match_da_ky') { cap.get(k).daKy = true; cap.get(k).matchId = e.matchId; }
  }
  return [...cap.values()].sort((a, b) => soSanh(a.dv, b.dv) || soSanh(a.nc, b.nc));
}

/** Dien tich giao cat giua hai tang (Zarate 2018): tong w1*w2 cua moi cap canh dao thu tu. */
export function dienTichGiao(links, viTriTrai, viTriPhai) {
  let s = 0;
  for (let i = 0; i < links.length; i++) {
    for (let j = i + 1; j < links.length; j++) {
      const a = links[i]; const b = links[j];
      if (a.s === b.s || a.t === b.t) continue;
      if ((viTriTrai.get(a.s) - viTriTrai.get(b.s)) * (viTriPhai.get(a.t) - viTriPhai.get(b.t)) < 0) s += a.w * b.w;
    }
  }
  return s;
}

/**
 * Thu tu lanh tho cua ban do la mot VONG (nhom 9 nam canh nhom 1 tren elip). Sankey can mot thu
 * tu THANG, nen thu moi phep XOAY va LAT GUONG vong do (ca hai giu nguyen quan he ke nhau nhu tren
 * ban do), chon cai co dien tich giao nho nhat; hoa thi giu cai thu truoc (chieu thuan, xoay nho).
 */
export function dungThiTruong({ graph, hoSo }) {
  const vong = graph.boCuc.thuTuLanhTho;
  let tot = null;
  // Ca chieu nguoc (lat guong) cung giu nguyen quan he ke nhau cua vong.
  for (const nguoc of [false, true]) {
    const v = nguoc ? [...vong].reverse() : vong;
    for (let r = 0; r < v.length; r++) {
      const thu = [...v.slice(r), ...v.slice(0, r)];
      const kq = dungMot({ graph, hoSo }, thu, false);
      const d = kq.sankey.chiSo.dienTichGiao;
      if (!tot || d < tot.d) tot = { kq, d, r, nguoc, thu };
    }
  }
  // Chen tot nhat (dat) chi chay tren thu tu thang cuoc.
  tot.kq = dungMot({ graph, hoSo }, tot.thu, true);
  tot.kq.sankey.chiSo.xoayVong = tot.r;
  tot.kq.sankey.chiSo.latGuong = tot.nguoc;
  return tot.kq;
}

function dungMot({ graph, hoSo }, thuTu, chen) {
  const K = KICH;
  const byId = new Map(graph.nodes.map((n) => [n.id, n]));
  const hangNhom = new Map(thuTu.map((g, i) => [g, i]));
  const cap = capChapNhan(graph);
  const nhomCuaNc = (id) => String(byId.get(id)?.nhom ?? '');

  // ── Tang va trong so ────────────────────────────────────────────────────
  const nhom = thuTu.map((g) => ({ id: `nh:${g}`, so: g, nhan: byId.get(`nh:${g}`)?.label.replace(/^Nhóm \d+ · /, '') ?? `Nhóm ${g}` }));
  const nc = graph.nodes.filter((n) => n.kind === 'nhu_cau');
  const dvCoCap = [...new Set(cap.map((c) => c.dv))];
  const w = (pred) => cap.filter(pred).length;
  // Link tach theo loai de dong vermilion (da ky) chay lien mach qua nut nhom.
  const gop = (ds) => {
    const m = new Map();
    for (const [s, t, loai] of ds) { const k = `${s}|${t}|${loai}`; m.set(k, { s, t, loai, w: (m.get(k)?.w ?? 0) + 1 }); }
    return [...m.values()];
  };
  const linkTrai = gop(cap.map((c) => [c.dv, `nh:${nhomCuaNc(c.nc)}`, c.daKy ? 'da_ky' : 'cung_sp']));
  const linkPhai = gop(cap.map((c) => [`nh:${nhomCuaNc(c.nc)}`, c.nc, c.daKy ? 'da_ky' : 'cung_sp']));

  // ── Thu tu ──────────────────────────────────────────────────────────────
  const viNhom = new Map(nhom.map((n, i) => [n.id, i]));
  // Nhu cau: khoi theo nhom (thu tu lanh tho), trong khoi co cung truoc (nhieu cap truoc), khoang trong sau.
  const wNc = (id) => w((c) => c.nc === id);
  const ncSap = [...nc].sort((a, b) => (hangNhom.get(String(a.nhom)) ?? 99) - (hangNhom.get(String(b.nhom)) ?? 99)
    || (wNc(b.id) > 0) - (wNc(a.id) > 0) || wNc(b.id) - wNc(a.id) || soSanh(a.maSp ?? '', b.maSp ?? ''));
  // Don vi: trong so trung binh vi tri nhom dich, roi doi cho ke nhau neu giam han dien tich giao.
  const tamDv = (id) => {
    const ls = linkTrai.filter((l) => l.s === id);
    const tong = ls.reduce((s, l) => s + l.w, 0);
    return ls.reduce((s, l) => s + viNhom.get(l.t) * l.w, 0) / tong;
  };
  let dvSap = [...dvCoCap].sort((a, b) => tamDv(a) - tamDv(b) || soSanh(a, b));
  const lk2 = linkTrai.map((l) => ({ s: l.s, t: l.t, w: l.w }));
  const giao = (ds) => dienTichGiao(lk2, new Map(ds.map((id, i) => [id, i])), viNhom);
  const giaoBanDau = giao(dvSap);
  let hien = giaoBanDau;
  // Chen tot nhat: thu dua tung don vi toi MOI vi tri, nhan vi tri giam han dien tich giao (hoa
  // thi giu nguyen). Doi cho ke nhau hay ket o cuc tieu dia phuong; chen thi thoat duoc.
  // Doi cho ke nhau (re), roi chen tot nhat neu duoc yeu cau (dat).
  for (let luot = 0; luot < 8 && hien > 0; luot++) {
    let doi = false;
    for (let i = 0; i + 1 < dvSap.length; i++) {
      const thu = [...dvSap]; [thu[i], thu[i + 1]] = [thu[i + 1], thu[i]];
      const g = giao(thu);
      if (g < hien) { dvSap = thu; hien = g; doi = true; }
    }
    if (!doi) break;
  }
  for (let luot = 0; chen && luot < 8 && hien > 0; luot++) {
    let doi = false;
    for (const id of [...dvSap]) {
      const bo = dvSap.filter((x) => x !== id);
      let tot = { g: hien, ds: dvSap };
      for (let vt = 0; vt <= bo.length; vt++) {
        const thu = [...bo.slice(0, vt), id, ...bo.slice(vt)];
        const g = giao(thu);
        if (g < tot.g) tot = { g, ds: thu };
      }
      if (tot.g < hien) { dvSap = tot.ds; hien = tot.g; doi = true; }
    }
    if (!doi) break;
  }

  // ── Toa do ──────────────────────────────────────────────────────────────
  const giaTri = new Map();
  for (const id of dvSap) giaTri.set(id, w((c) => c.dv === id));
  for (const n of nhom) giaTri.set(n.id, w((c) => `nh:${nhomCuaNc(c.nc)}` === n.id));
  for (const n of nc) giaTri.set(n.id, wNc(n.id));
  // Nut nhom cao toi thieu 26 de chua nhan; dong van ti le va duoc can giua trong nut.
  const cao = (id) => Math.max(id.startsWith('nh:') ? 26 : K.trongCao, giaTri.get(id) * K.k);
  const lechTrong = (id) => (cao(id) - giaTri.get(id) * K.k) / 2;
  const xepCot = (ds, khe) => { const y = new Map(); let yy = K.tren; for (const id of ds) { y.set(id, yy); yy += cao(id) + khe; } return { y, day: yy - khe }; };
  const cDv = xepCot(dvSap, K.kheDv);
  const cNhom = xepCot(nhom.map((n) => n.id), K.kheNhom);
  const cNc = xepCot(ncSap.map((n) => n.id), K.kheNc);
  const dayMax = Math.max(cDv.day, cNhom.day, cNc.day);
  // Can giua moi cot theo chieu doc.
  const canGiua = (c) => { const d = (dayMax - c.day) / 2; for (const [k, v] of c.y) c.y.set(k, v + d); };
  canGiua(cDv); canGiua(cNhom); canGiua(cNc);
  const yNut = new Map([...cDv.y, ...cNhom.y, ...cNc.y]);
  const xNut = (id) => (id.startsWith('dv:') ? K.xDv : id.startsWith('nh:') ? K.xNhom : K.xNc);
  const beRongCua = (id) => (id.startsWith('nh:') ? K.beRongNhom : K.beRong);

  // Xep link trong nut: ra theo y dich, vao theo y nguon; da ky truoc cung sp khi trung.
  const hangLoai = { da_ky: 0, cung_sp: 1 };
  const tatCa = [...linkTrai, ...linkPhai];
  const raCon = new Map(); const vaoCon = new Map();
  const sapRa = [...tatCa].sort((a, b) => soSanh(a.s, b.s) || yNut.get(a.t) - yNut.get(b.t) || hangLoai[a.loai] - hangLoai[b.loai]);
  const sapVao = [...tatCa].sort((a, b) => soSanh(a.t, b.t) || yNut.get(a.s) - yNut.get(b.s) || hangLoai[a.loai] - hangLoai[b.loai]);
  for (const l of sapRa) { const o = raCon.get(l.s) ?? lechTrong(l.s); l.y0 = yNut.get(l.s) + o; raCon.set(l.s, o + l.w * K.k); }
  for (const l of sapVao) { const o = vaoCon.get(l.t) ?? lechTrong(l.t); l.y1 = yNut.get(l.t) + o; vaoCon.set(l.t, o + l.w * K.k); }
  const bang = (l) => {
    const x0 = xNut(l.s) + beRongCua(l.s); const x1 = xNut(l.t); const xm = (x0 + x1) / 2; const h = l.w * K.k;
    return `M${lam(x0)},${lam(l.y0)} C${lam(xm)},${lam(l.y0)} ${lam(xm)},${lam(l.y1)} ${lam(x1)},${lam(l.y1)} L${lam(x1)},${lam(l.y1 + h)} C${lam(xm)},${lam(l.y1 + h)} ${lam(xm)},${lam(l.y0 + h)} ${lam(x0)},${lam(l.y0 + h)} Z`;
  };

  const nutRa = [
    ...dvSap.map((id) => ({ id, tang: 'don_vi', nhan: id.slice(3), slug: hoSo.units.find((u) => u.ten === id.slice(3))?.slug ?? null })),
    ...nhom.map((n) => ({ id: n.id, tang: 'nhom', nhan: n.nhan, so: n.so })),
    ...ncSap.map((n) => ({ id: n.id, tang: 'nhu_cau', nhan: n.label, maSp: n.maSp, nhom: String(n.nhom ?? '') })),
  ].map((n) => ({ ...n, x: xNut(n.id), w: beRongCua(n.id), y: lam(yNut.get(n.id)), h: lam(cao(n.id)), giaTri: giaTri.get(n.id), trong: giaTri.get(n.id) === 0 }));

  const sankey = {
    rong: K.rong, cao: lam(dayMax + K.tren), beRong: K.beRong,
    nodes: nutRa,
    links: tatCa.map((l) => ({ s: l.s, t: l.t, loai: l.loai, w: l.w, d: bang(l) })),
    chiSo: {
      soCap: cap.length, capDaKy: cap.filter((c) => c.daKy).length,
      dienTichGiaoBanDau: giaoBanDau, dienTichGiao: hien,
      dienTichGiaoPhai: dienTichGiao(linkPhai.map((l) => ({ s: l.s, t: l.t, w: l.w })), viNhom, new Map(ncSap.map((n, i) => [n.id, i]))),
    },
  };

  // ── Ban do phu nhu cau theo nhom ────────────────────────────────────────
  const phu = nhom.map((g) => {
    const ds = ncSap.filter((n) => String(n.nhom) === g.so).map((n) => {
      const cs = cap.filter((c) => c.nc === n.id);
      return { id: n.id.slice(3), maSp: n.maSp, ten: n.label, soCung: cs.length, trangThai: cs.some((c) => c.daKy) ? 'da_ky' : cs.length ? 'co_cung' : 'trong' };
    });
    return {
      so: g.so, nhan: g.nhan,
      soDv: hoSo.units.filter((u) => u.nhoms.some((x) => x.so === g.so)).length,
      soNc: ds.length, coCung: ds.filter((x) => x.trangThai !== 'trong').length,
      daKy: ds.filter((x) => x.trangThai === 'da_ky').length, trong: ds.filter((x) => x.trangThai === 'trong').length,
      o: ds,
    };
  });

  // ── Do tuoi nguon theo nam dang ─────────────────────────────────────────
  const TT = ['tuoi', 'ben', 'giu_nguon_cu', 'qua_han', 'khong_doc_duoc_ngay'];
  const theoNam = new Map();
  for (const u of hoSo.units) {
    for (const b of u.bangChung) {
      const nam = b.ngayDang ? b.ngayDang.slice(0, 4) : 'khong_ro';
      if (!theoNam.has(nam)) theoNam.set(nam, Object.fromEntries(TT.map((t) => [t, 0])));
      theoNam.get(nam)[b.trangThai]++;
    }
  }
  const nams = [...theoNam.keys()].filter((n) => n !== 'khong_ro').sort();
  const tuoi = {
    nam: nams.map((n) => ({ nam: n, ...theoNam.get(n) })),
    khongRo: theoNam.get('khong_ro') ?? null,
    tong: Object.fromEntries(TT.map((t) => [t, hoSo.units.reduce((s, u) => s + u.bangChung.filter((b) => b.trangThai === t).length, 0)])),
    mocNgay: hoSo.meta.mocNgay, nguongNgay: hoSo.meta.nguongNgay,
  };

  return {
    kpi: {
      soCap: cap.length, capDaKy: cap.filter((c) => c.daKy).length,
      soNc: nc.length, ncCoCung: nc.filter((n) => wNc(n.id) > 0).length, ncTrong: nc.filter((n) => wNc(n.id) === 0).length,
      dvCoCap: dvCoCap.length, soDv: hoSo.units.length,
    },
    sankey, phu, tuoi,
  };
}
