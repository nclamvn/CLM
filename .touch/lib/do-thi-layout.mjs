/**
 * do-thi-layout.mjs · Bo tri do thi cung cau TAT DINH (cung du lieu -> cung toa do).
 *
 * VI SAO TU VIET, KHONG DUNG sigma.js / d3-force (29/09/2026): nghien cuu 09_NANG_CAP_UI_UX.md
 * chon sigma.js cho do thi hang nghin nut. Hub hien co 84 nut, 129 canh; mot vong luc day
 * 84 x 84 chay 400 lan mat vai chuc mili giay. Them thu vien luc nay can cai goi tu sandbox
 * Linux vao node_modules cua may Mac, rui ro lam hong goi nhi phan cua Next. Khi len hang
 * nghin nut thi thay ham boTri() bang graphology + ForceAtlas2, giu nguyen hop dong dau ra.
 *
 * TAT DINH la yeu cau, khong phai tien loi: anh chup de so moc, va trang render phia server
 * roi phia client phai ra cung mot hinh. Khong dung Math.random; hat giong co dinh.
 *
 * Bo cuc: 10 nhom cong nghe dinh tren mot vong tron (xuong song cua do thi). Don vi va nhu
 * cau bi keo ve nhom cua minh bang canh "thuoc_nhom", day nhau ra bang luc day, va keo nhe
 * ve nhau neu co canh "cung_san_pham" hay match.
 */

function hatGiong(a) {
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const LUC_CANH = { thuoc_nhom: 1.0, cung_san_pham: 0.45, match_da_ky: 0.35, tu_choi: 0.15 };

/**
 * @param {{id:string,kind:string,nhoms?:string[],nhom?:string|null}[]} nodes
 * @param {{source:string,target:string,kind:string}[]} edges
 * @param {{vong?:number, seed?:number}} [tuy]
 * @returns {{id:string,x:number,y:number}[]} toa do trong khung [0,1] x [0,1], theo thu tu nodes
 */
export function boTri(nodes, edges, tuy = {}) {
  const vong = tuy.vong ?? 400;
  const rnd = hatGiong(tuy.seed ?? 20260929);
  const R = 300;
  const nhom = nodes.filter((n) => n.kind === 'nhom').sort((a, b) => Number(a.id.slice(3)) - Number(b.id.slice(3)));
  const pos = new Map();
  nhom.forEach((n, i) => {
    const g = (i / nhom.length) * Math.PI * 2 - Math.PI / 2;
    pos.set(n.id, { x: Math.cos(g) * R, y: Math.sin(g) * R, dinh: true });
  });
  for (const n of nodes) {
    if (pos.has(n.id)) continue;
    const g = n.kind === 'don_vi' ? (n.nhoms ?? [])[0] : n.nhom;
    const neo = g ? pos.get(`nh:${g}`) : null;
    const bx = neo ? neo.x * 0.7 : 0; const by = neo ? neo.y * 0.7 : 0;
    pos.set(n.id, { x: bx + (rnd() - 0.5) * 80, y: by + (rnd() - 0.5) * 80, dinh: false });
  }
  const ids = nodes.map((n) => n.id);
  const canh = edges.filter((e) => pos.has(e.source) && pos.has(e.target));
  const k = 46;
  for (let v = 0; v < vong; v++) {
    const t = 18 * (1 - v / vong) + 0.5;
    const d = new Map(ids.map((id) => [id, { x: 0, y: 0 }]));
    for (let i = 0; i < ids.length; i++) {
      const a = pos.get(ids[i]);
      for (let j = i + 1; j < ids.length; j++) {
        const b = pos.get(ids[j]);
        let dx = a.x - b.x; let dy = a.y - b.y;
        let dist = Math.hypot(dx, dy);
        if (dist < 0.01) { dx = 0.01; dy = 0; dist = 0.01; }
        const f = (k * k) / dist;
        const fx = (dx / dist) * f; const fy = (dy / dist) * f;
        const da = d.get(ids[i]); const db = d.get(ids[j]);
        da.x += fx; da.y += fy; db.x -= fx; db.y -= fy;
      }
    }
    for (const e of canh) {
      const a = pos.get(e.source); const b = pos.get(e.target);
      const dx = a.x - b.x; const dy = a.y - b.y;
      const dist = Math.max(Math.hypot(dx, dy), 0.01);
      const f = ((dist * dist) / k) * (LUC_CANH[e.kind] ?? 0.3);
      const fx = (dx / dist) * f; const fy = (dy / dist) * f;
      d.get(e.source).x -= fx; d.get(e.source).y -= fy;
      d.get(e.target).x += fx; d.get(e.target).y += fy;
    }
    for (const id of ids) {
      const p = pos.get(id);
      if (p.dinh) continue;
      const dd = d.get(id);
      dd.x -= p.x * 0.02; dd.y -= p.y * 0.02;
      const len = Math.max(Math.hypot(dd.x, dd.y), 0.01);
      p.x += (dd.x / len) * Math.min(len, t);
      p.y += (dd.y / len) * Math.min(len, t);
    }
  }
  // Nut KHONG CO CANH nao (vd don vi chua co claim nhom, honest-null) dat o TAM vong, khong de luc
  // day hat no ra mep. Luot ve that dau tien (29/09/2026): Masan High-Tech Materials chua co claim
  // nhom nao, bi day ra goc duoi, va vi khung chuan hoa theo min/max nen ca do thi bi ep thanh
  // mot dai mong o tren.
  const bac = new Map(ids.map((id) => [id, 0]));
  for (const e of canh) { bac.set(e.source, bac.get(e.source) + 1); bac.set(e.target, bac.get(e.target) + 1); }
  for (const id of ids) if (bac.get(id) === 0) { const p = pos.get(id); p.x = 0; p.y = 0; }
  // Khung CO DINH theo vong nhom (khong theo min/max), roi kep vao [0.02, 0.98]: mot nut lac khong
  // the lam meo ca hinh.
  const F = R * 1.6;
  const chuan = (v) => Math.round(Math.min(0.98, Math.max(0.02, (v + F) / (2 * F))) * 1e4) / 1e4;
  // Lam tron 4 chu so: hai may khac nhau co the lech o chu so thu 15, van phai ra cung hinh.
  return ids.map((id) => { const p = pos.get(id); return { id, x: chuan(p.x), y: chuan(p.y) }; });
}
