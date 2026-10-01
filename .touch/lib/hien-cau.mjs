/**
 * hien-cau.mjs · Ban DOC cua mot cau nguon: go dau dinh dang markdown con sot tu luc chup.
 *
 * VI SAO (01/10/2026): ban chup luu trang nguon duoi dang markdown, nen mot so cau nguon mang
 * theo "**MiSmart**", "# Tieu de", "[FPT](https://...)", "![anh.jpg]()". Hien nguyen nhu vay
 * tren man hinh nhin nhu loi, va nguoi doc tuong chung toi chen ky tu vao cau nguon.
 *
 * NGUYEN TAC: chi go DAU DINH DANG, khong go chu cua nguon. Cau nguon goc (span) van giu
 * nguyen trong registry; ma kiem toan, tim cau trong ban chup va moi cong deu dung ban goc.
 * Cong check-hien-cau.mjs do doc lap rang ban doc khong mat chu nao ngoai dia chi lien ket va
 * ten anh.
 */
export function hienCau(span) {
  if (typeof span !== 'string') return span;
  return span
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')                 // anh: ![ten](dia-chi)
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')                // lien ket: [chu](dia-chi) -> chu
    .replace(/\*\*|__/g, '')                                // dam
    .replace(/(^|\n)\s*#{1,6}\s+/g, '$1')                   // tieu de dau dong
    .replace(/(^|\n)\s*[-*+]\s+/g, '$1')                    // gach dau dong
    .replace(/\s+/g, ' ')
    .trim();
}
