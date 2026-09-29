/**
 * tim-kiem.mjs · Tim kiem va cat ngu canh ban chup. Dung chung cho GIAO DIEN va CONG KIEM.
 *
 * VI SAO VIET THUAN JS (.mjs) CHU KHONG DUNG THU VIEN (29/09/2026): nghien cuu o
 * KnowledgeBase/CaoLocMatch_ChuongTrinh/09_NANG_CAP_UI_UX.md de xuat Orama + cmdk. Chua dung,
 * vi hai ly do: (1) cai goi tu sandbox Linux vao node_modules cua may Mac co the lam hong goi
 * nhi phan cua Next; (2) hub hien co 84 tai lieu, tim tuyen tinh chay trong mot phan nghin
 * giay. Khi du lieu len hang nghin ban ghi thi thay ham timKiem() bang Orama, giu nguyen
 * boDau() va hop dong ket qua, va cong check-tim-kiem.mjs se kiem lai y nhu cu.
 *
 * Mot file cho ca hai phia: giao dien import no, cong kiem cung import no. Nho vay cong kiem
 * dung DUNG doan ma nguoi dung chay, khong phai mot ban sao co the lech.
 */

/** Bo dau tieng Viet. NFD khong tach duoc "đ" (U+0111) nen phai thay tay. */
export function boDau(s) {
  return String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .normalize('NFC');
}

/** Khoa tim kiem: bo dau, ha chu, gop khoang trang. */
export function khoaTim(s) {
  return boDau(s).toLowerCase().replace(/\s+/g, ' ').trim();
}

const THU_TU = { don_vi: 0, nhu_cau: 1, nhom: 2 };

/**
 * Tim trong docs (moi doc co ten, khoa). Moi tu cua cau hoi phai co mat (AND).
 * @param {{id:string,kind:string,ten:string,khoa:string}[]} docs
 * @param {string} q
 * @param {number} [toiDa]
 * @returns {{doc:any, diem:number}[]}
 */
export function timKiem(docs, q, toiDa = 20) {
  const kq = khoaTim(q);
  if (!kq) return [];
  const tu = kq.split(' ').filter(Boolean);
  const qThuong = String(q).toLowerCase().trim();
  // Moi tu phai khop o DAU mot tu trong khoa, khong chi la chuoi con. Luot kiem that dau tien
  // (29/09/2026) go "dong anh" ra ca Health Care Center, vi "anh" nam giua "thanh", "kinh
  // doanh". Khop dau tu van giu duoc go do dang: "ban da" ra "bán dẫn".
  const re = tu.map((t) => new RegExp(`(^| )${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
  const ra = [];
  for (const d of docs) {
    if (!re.every((r) => r.test(d.khoa))) continue;
    const tenK = khoaTim(d.ten);
    let diem = 0;
    for (const t of tu) {
      if (new RegExp(`(^| )${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(tenK)) diem += 3;
      else if (tenK.includes(t)) diem += 2;
      else diem += 1;
    }
    if (tenK === kq) diem += 10;
    else if (tenK.startsWith(kq)) diem += 5;
    else if (tenK.includes(kq)) diem += 3;
    // Go CO dau va khop dung dau thi xep tren ban khop nho bo dau.
    if (qThuong && String(d.ten).toLowerCase().includes(qThuong)) diem += 2;
    ra.push({ doc: d, diem });
  }
  ra.sort((a, b) => b.diem - a.diem
    || (THU_TU[a.doc.kind] ?? 9) - (THU_TU[b.doc.kind] ?? 9)
    || String(a.doc.ten).localeCompare(String(b.doc.ten), 'vi'));
  return ra.slice(0, toiDa);
}

/** Bo the HTML va giai ma vai thuc the thuong gap, CHI dung cho phan ngu canh hien thi. */
function lamSach(s) {
  return s.replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ');
}

/**
 * Cat ngu canh quanh span trong ban chup THO. Span phai nam NGUYEN VAN trong ban chup; khong
 * co thi tra cach=null de giao dien bao loi, KHONG tim gan dung. Tim gan dung la cach lop phu
 * nguon co the to sang mot cau khac voi cau lam bang.
 * @param {string} tho
 * @param {string} span
 * @param {number} [r]
 * @returns {{truoc:string, span:string, sau:string, cach:'nguyen_van'|null, viTri:number}}
 */
export function catNguCanh(tho, span, r = 280) {
  const i = String(tho).indexOf(span);
  if (!span || i < 0) return { truoc: '', span, sau: '', cach: null, viTri: -1 };
  const truocTho = tho.slice(Math.max(0, i - r), i);
  const sauTho = tho.slice(i + span.length, i + span.length + r);
  return {
    truoc: (i - r > 0 ? '… ' : '') + lamSach(truocTho).trimStart(),
    span,
    sau: lamSach(sauTho).trimEnd() + (i + span.length + r < tho.length ? ' …' : ''),
    cach: 'nguyen_van',
    viTri: i,
  };
}
