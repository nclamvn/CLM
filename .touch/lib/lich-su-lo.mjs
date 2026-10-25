/**
 * lich-su-lo.mjs · Lich su cac lo lam giau (CNCLData/lam_giau/dot_*), dung cho trang Phuong phap.
 *
 * VI SAO (25/10/2026): bang chung manh nhat rang may khong tu nap du lieu la chinh lich su duyet:
 * moi lo co bao nhieu de xuat, bao nhieu o may CO Y de trong vi khong co nguon, bao nhieu trang
 * duoc nguoi kiem khac tai lai doi chung, ai duyet, ngay nao, va loi duyet NGUYEN VAN. Truoc day
 * lich su nay chi nam trong thu muc, khong co man nao. Ham thuan tren noi dung file, khong sua gi;
 * loi duyet chep nguyen van tu duyet.json, khong tom tat.
 */
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const LOAI_TEN = { cung: 'Bên cung (năng lực đơn vị)', dinh_danh: 'Định danh pháp nhân', cau_that: 'Cầu thật (nhu cầu đặt hàng)' };

export function dungLichSuLo(lamGiau) {
  if (!lamGiau || !existsSync(lamGiau)) return { lo: [] };
  const ds = readdirSync(lamGiau).filter((d) => /^dot_\d+$/.test(d)).sort();
  const lo = ds.map((d) => {
    const P = (f) => join(lamGiau, d, f);
    const j = (f) => (existsSync(P(f)) ? JSON.parse(readFileSync(P(f), 'utf8')) : null);
    const demDong = (re) => readdirSync(join(lamGiau, d)).filter((f) => re.test(f))
      .reduce((s, f) => s + readFileSync(join(lamGiau, d, f), 'utf8').split('\n').filter((l) => l.trim()).length, 0);
    const L = j('lo.json'); const D = j('duyet.json'); const N = j('da_nap.json');
    const loai = L?.loai ?? 'cung';
    const deXuat = Array.isArray(L?.dong) ? L.dong.length : Number(L?.so_dong ?? 0);
    return {
      dot: d, loai, loaiTen: LOAI_TEN[loai] ?? loai, deXuat,
      honestNull: Array.isArray(L?.honest_null) ? L.honest_null.length : Number(L?.honest_null ?? 0),
      doiChieu: demDong(/^doi_chieu_ket_qua.*\.jsonl$/),
      duyet: D ? { nguoi: D.nguoi_duyet, ngay: D.ngay, loi: D.loi_duyet ?? null, soLoai: Array.isArray(D.loai) ? D.loai.length : 0 } : null,
      nap: N ? { ngay: N.ngay_nap, soDong: Number(N.so_claim ?? 0) } : null,
      trangThai: N ? 'da_nap' : D ? 'da_duyet' : 'cho_duyet',
    };
  });
  return { lo };
}
