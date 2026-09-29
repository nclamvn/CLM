/**
 * viet.mjs · Cua vao de script build va tu kiem dung CHUNG ham bo dau voi giao dien.
 *
 * Ham that nam o lib/tim-kiem.mjs (giao dien import no). File nay chi re-export, de khong co
 * hai ban cua cung mot ham co the lech nhau. Truoc 29/09/2026 buoi chieu, ham nay duoc viet
 * rieng o day; gop lai khi dung lop phu nguon va Cmd+K.
 *
 * Luu y chu d: NFD KHONG tach duoc "đ" (U+0111). Quen buoc thay tay thi "Đông Anh" khong bao
 * gio khop "dong anh".
 */
export { boDau, khoaTim } from '../lib/tim-kiem.mjs';
import { khoaTim } from '../lib/tim-kiem.mjs';

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
