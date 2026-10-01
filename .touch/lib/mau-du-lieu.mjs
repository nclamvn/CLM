/**
 * mau-du-lieu.mjs · Bang mau DU LIEU duy nhat cua .touch: moi nhom cong nghe QD 21/2026 mot mau.
 *
 * VI SAO CO (01/10/2026): anh Lam giu nen den trang chu dao nhung yeu cau do hoa thong tin co mau
 * de nguoi doc phan biet nhanh, voi mau TRAM, tinh te, can thiet, the hien su tin cay. Mau la kenh
 * tien chu y (preattentive): mat tach nhom theo sac do truoc khi doc nhan, nen giam thoi gian tim.
 *
 * LUAT DUNG (giu cho mau co nghia, khong thanh trang tri):
 *   1. MOT bien duy nhat duoc ma hoa bang mau tren toan san pham: NHOM CONG NGHE (1..10). Nhom 4 o
 *      man nao cung la mot mau. Trang thai (da ky, tu choi, chua co cung) KHONG dung mau: da ky la
 *      net trang dam, tu choi la net dut, chua co cung la khung rong net dut, nhu truoc.
 *   2. Chi DO HOA DU LIEU duoc dung mau. Khung giao dien (nen, chu, nut, thanh ben) van don sac;
 *      cong check-don-sac.mjs van cam moi ma mau bao hoa ngoai bang nay.
 *   3. Ma hoa kep: moi mau luon di kem so nhom hoac ten nhom, khong bao gio de mau dung mot minh.
 *
 * CACH DUNG BANG (co the tinh lai, cong check-mau-du-lieu.mjs tinh lai moi lan chay):
 *   - Sac do goc lay tu bang "muted" cua Paul Tol (SRON), bang dinh tinh an toan cho nguoi mu mau,
 *     thiet ke cho do thi khoa hoc: https://personal.sron.nl/~pault/ . Bang goc co 9 mau va lam cho
 *     nen TRANG; tren nen den #0E0E0E ba mau toi (indigo 1,59:1, wine 2,21:1, green 3,41:1) khong dat
 *     nguong tuong phan do hoa 3:1 cua WCAG 2.2 muc 1.4.11.
 *   - Nen giu SAC DO (hue) cua Tol, dat lai do sang va do bao hoa trong khong gian OKLCH: do sang
 *     L <= 0,80 (khong choi), do bao hoa 0,05 <= C <= 0,09 (tram, khong tuoi). Them mau thu 10 (dat
 *     nung, hue ~71) vi QD 21 co 10 nhom.
 *   - Do sang tung mau duoc toi uu (tim kiem ngau nhien, hat giong co dinh) de khoang cach OKLab nho
 *     nhat giua hai mau bat ky >= 0,05 o ca bon kieu nhin: binh thuong, mu do (protan), mu luc
 *     (deutan), mu lam (tritan), mo phong theo Machado, Oliveira & Fernandes 2009 muc 1,0.
 *   - Gan nhom theo lien tuong khi duoc va de hai nhom KE NHAU tren Sankey (thu tu 3,2,4,5,7,8,10,6,
 *     9,1) khong cung ho mau.
 */
export const MAU_NHOM = {
  1: '#7779B5', // Cong nghe so · cham (indigo)
  2: '#CA8183', // Mang di dong the he sau · hong gach (rose)
  3: '#A4A35F', // Robot va tu dong hoa · o liu (olive)
  4: '#85BA89', // Sinh hoc va y sinh · luc (green)
  5: '#AE834C', // Nang luong va vat lieu · dat nung (them, khong co trong bang Tol)
  6: '#B685B6', // Chip ban dan · tim (purple)
  7: '#A4637D', // An ninh mang va luong tu · man (wine)
  8: '#62B6A8', // Bien, dai duong, long dat · lam ngoc (teal)
  9: '#8BC7E5', // Hang khong va vu tru · lam troi (cyan)
  10: '#C3C37D', // Duong sat toc do cao · cat (sand)
};

/** Mau cua mot nhom (so hoac chuoi '1'..'10'); nhom la/khong co thi tra mau trung tinh. */
export const MAU_TRUNG_TINH = '#9A9A96';
export function mauNhom(so) {
  return MAU_NHOM[Number(so)] ?? MAU_TRUNG_TINH;
}

/** rgba tu hex, cho canvas (CSS thi dung color-mix voi var(--nhom-N)). */
export function mauNhomA(so, a) {
  const h = mauNhom(so);
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
