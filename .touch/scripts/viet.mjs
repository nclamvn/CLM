/**
 * viet.mjs · Chuan hoa tieng Viet cho tim kiem: go khong dau van ra ket qua co dau.
 *
 * VI SAO TU LAM (29/09/2026, xem KnowledgeBase/CaoLocMatch_ChuongTrinh/09_NANG_CAP_UI_UX.md):
 * Orama o che do 'vietnamese' co y GIU dau, va bang bo dau chung cua no chi phu ma 192 den
 * 383, khong toi o, u, a co dau tieng Viet (7897, 432, 7841). Meilisearch thi bo HET dau nen
 * "ban" khop ca ban, ban, ban. Cach chac nhat: moi ban ghi luu HAI truong, co dau va khong
 * dau, va cau truy van cung chuan hoa y nhu vay.
 *
 * Luu y chu d: NFD KHONG tach duoc "đ" (U+0111) vi no la mot chu rieng, khong phai d + dau.
 * Phai thay tay. Quen buoc nay thi "Đông Anh" khong bao gio khop "dong anh".
 */
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

// Tu kiem: node scripts/viet.mjs --tu-kiem
if (process.argv[1] && process.argv[1].endsWith('viet.mjs') && process.argv.includes('--tu-kiem')) {
  const ca = [
    ['Tổng công ty Thiết bị điện Đông Anh', 'tong cong ty thiet bi dien dong anh'],
    ['Hà Nội đổi mới sáng tạo ưu tiên', 'ha noi doi moi sang tao uu tien'],
    ['Chip BÁN DẪN  ộ ư ạ', 'chip ban dan o u a'],
  ];
  let sai = 0;
  for (const [vao, mong] of ca) {
    const ra = khoaTim(vao);
    if (ra !== mong) { sai++; console.log(`  SAI: "${vao}" -> "${ra}", mong "${mong}"`); }
  }
  console.log(sai ? `FAIL: ${sai}/${ca.length} ca sai` : `OK: ${ca.length}/${ca.length} ca bo dau dung`);
  process.exit(sai ? 2 : 0);
}
