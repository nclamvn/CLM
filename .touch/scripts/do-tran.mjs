/**
 * do-tran.mjs · Do chu bi CAT o mep man hinh (tran khung), chay trong trinh duyet that.
 *
 * VI SAO CO (01/10/2026): anh 390px cua Bao cao khoang trong cho thay ca trang bi cat ben phai:
 * luoi .bc co cot "auto", bang chu khong xuong dong day cot rong hon man hinh, va .dash-shell
 * (overflow-x: clip) cat mat phan thua. Cong responsive cu chi so scrollWidth cua tai lieu, ma
 * clip thi tai lieu khong cuon, nen loi lot. Phep do nay xet TUNG DOAN CHU.
 *
 * LUAT: mot doan chu co mep phai vuot be rong khung nhin (+1px) la TRAN, tru khi to tien gan nhat
 * co overflow-x khac visible la:
 *   - khung cuon (auto/scroll): nguoi doc cuon duoc, khong mat chu; hoac
 *   - khung cat CUC BO nam gon trong man hinh (dau "..." co chu dich, sr-only).
 * Neu khung cat la khung cap trang (trai sat 0, phai sat mep man hinh: html, body, .dash-shell)
 * thi chu bi mat that, la TRAN.
 */

/** Ham chay trong trang (page.evaluate). Tra { so, mau: [{chu, phai}] }. */
export function doTran() {
  const vw = document.documentElement.clientWidth;
  const ra = [];
  const di = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const rg = document.createRange();
  const anDi = (el) => {
    for (let p = el; p && p.nodeType === 1; p = p.parentElement) {
      const s = getComputedStyle(p);
      if (s.display === 'none' || s.visibility === 'hidden' || Number(s.opacity) === 0) return true;
    }
    return false;
  };
  const khungCat = (el) => {
    for (let p = el; p && p.nodeType === 1; p = p.parentElement) {
      const ox = getComputedStyle(p).overflowX;
      if (ox !== 'visible') return { p, ox };
    }
    return null;
  };
  for (let n = di.nextNode(); n; n = di.nextNode()) {
    if (!n.textContent.trim()) continue;
    const el = n.parentElement; if (!el || anDi(el)) continue;
    rg.selectNodeContents(n);
    let phai = -Infinity;
    for (const r of rg.getClientRects()) if (r.width > 0 && r.height > 0) phai = Math.max(phai, r.right);
    if (!(phai > vw + 1)) continue;
    const k = khungCat(el);
    if (k && (k.ox === 'auto' || k.ox === 'scroll')) continue;
    if (k) {
      const kr = k.p.getBoundingClientRect();
      const capTrang = k.p === document.documentElement || k.p === document.body || (kr.left <= 1 && kr.right >= vw - 1);
      if (!capTrang) continue;
    }
    ra.push({ chu: n.textContent.trim().slice(0, 60), phai: Math.round(phai) });
  }
  return { so: ra.length, mau: ra.slice(0, 5) };
}

/**
 * Mau tu kiem cho chinh phep do (rang cua thuoc do). Moi mau la mot trang nho dung san;
 * `mong` la so doan TRAN phai do duoc: > 0 nghia la phai bat, 0 nghia la khong duoc bat oan.
 */
const VO = (than) => `<!doctype html><html><head><meta name="viewport" content="width=device-width"><style>
body{margin:0;font:14px sans-serif} .vo{overflow-x:clip} td,th{white-space:nowrap;padding:4px}
</style></head><body><div class="vo">${than}</div></body></html>`;
const BANG = '<div style="overflow-x:auto"><table><tr><th>P01 Mo hinh ngon ngu lon tieng Viet tro ly ao va tri tue nhan tao chuyen nganh rat dai</th></tr></table></div>';
export const MAU_TU_KIEM = [
  { ten: 'chu dai khong xuong dong trong khung cat cap trang', mong: '>0', html: VO('<p style="white-space:nowrap">Mot dong chu rat dai khong duoc xuong dong nen se bi cat mat o mep phai man hinh dien thoai hep</p>') },
  { ten: 'loi Bao cao: luoi cot auto + bang nowrap trong khung cuon', mong: '>0', html: VO(`<div style="display:grid"><section><p>Pham vi: 30 san pham cong nghe chien luoc theo quyet dinh, 60 don vi cung co cau nguon.</p>${BANG}</section></div>`) },
  { ten: 'da sua: luoi minmax(0,1fr) + bang nowrap trong khung cuon', mong: '0', html: VO(`<div style="display:grid;grid-template-columns:minmax(0,1fr)"><section><p>Pham vi: 30 san pham cong nghe chien luoc theo quyet dinh, 60 don vi cung co cau nguon.</p>${BANG}</section></div>`) },
  { ten: 'bang nowrap trong khung cuon (cuon duoc, khong mat chu)', mong: '0', html: VO(BANG) },
  { ten: 'dau ba cham co chu dich trong o hep', mong: '0', html: VO('<div style="width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">Ten don vi rat dai bi rut gon co chu dich</div>') },
];
