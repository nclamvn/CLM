/**
 * DieuPhoi · Man "Điều phối" (07/10/2026): mui nhon, phieu vong doi cap, hang viec theo nguoi, so su
 * kien. Du lieu: lib/hub-dieu-phoi.json (lib/dieu-phoi.mjs). Cong: scripts/check-dieu-phoi.mjs.
 * Nguyen tac hien tren man: máy chỉ đề xuất việc; sự kiện chỉ người ghi.
 */
import Link from 'next/link';
import dp from '@/lib/hub-dieu-phoi.json';
import { hienCau } from '@/lib/hien-cau.mjs';
import { ngayVN } from '@/lib/dinh-dang';

type Viec = { loai: string; nhan: string; nhuCau: string; donVi: string | null; nguoi: string; han: string; quaHan: boolean };
type UngVien = { dv: string; slug: string; nguon: string; trangThai: string; suKien: number[] };
type NhuCau = { ma: string; ten: string; benDatHang: string | null; doiTuong: string | null; dong: { luc: string; noiDung: string } | null; ungVien: UngVien[] };
type SuKien = { stt: number; luc: string; loai: string; nhuCau: string; donVi: string | null; nguoi: string; noiDung: string; y: string | null; ben: string | null; ketQua: string | null };
type DuLieu = {
  meta: { ten: string; batDau: string; moTa: string; mocNgay: string; nguoiGacCong: string[]; nguoiGioiThieu: string; loaiTru: { ma: string; ten: string; lyDo: string }[]; soNhuCau: number; soSuKien: number; soViec: number; soQuaHan: number };
  pheu: { buoc: string; nhan: string; so: number }[]; nhuCau: NhuCau[]; viec: Viec[]; suKien: SuKien[];
};
const D = dp as unknown as DuLieu;

const TRANG_THAI: Record<string, string> = {
  cho_xet: 'chờ xét', tu_choi: 'đã loại', da_duyet: 'đã duyệt, chờ giới thiệu', da_gioi_thieu: 'đã giới thiệu, chờ phản hồi',
  quan_tam: 'có bên quan tâm', ben_tu_choi: 'một bên từ chối',
  ket_qua_gap: 'đã gặp', ket_qua_thi_diem: 'thí điểm', ket_qua_hop_dong: 'hợp đồng', ket_qua_dung: 'dừng',
};
const TEN_SU_KIEN: Record<string, string> = {
  duyet_ung_vien: 'Duyệt ứng viên', tu_choi_ung_vien: 'Loại ứng viên', gioi_thieu: 'Giới thiệu', phan_hoi: 'Phản hồi', ket_qua: 'Kết quả', dong_nhu_cau: 'Đóng nhu cầu',
};

export function DieuPhoi() {
  const m = D.meta;
  const theoNguoi = [...new Set(D.viec.map((v) => v.nguoi))].map((ng) => ({ ng, ds: D.viec.filter((v) => v.nguoi === ng) }));
  const tenNc = new Map(D.nhuCau.map((n) => [n.ma, hienCau(n.ten)]));
  const toiDa = Math.max(1, D.pheu[0]?.so ?? 1);
  return (
    <div className="dp">
      <section className="dash-panel dp-khoi" aria-labelledby="dp-h">
        <div className="md-eyebrow">Mũi nhọn từ {ngayVN(m.batDau)}</div>
        <h2 className="bc-h" id="dp-h">{m.ten}</h2>
        <p className="bc-phu">{m.moTa}</p>
        <dl className="ct-dl dp-dl">
          <div><dt>Người gác cổng</dt><dd>{m.nguoiGacCong.join(', ')}</dd></div>
          <div><dt>Người giới thiệu</dt><dd>{m.nguoiGioiThieu}</dd></div>
          <div><dt>Hàng việc</dt><dd>{m.soViec} việc{m.soQuaHan ? `, ${m.soQuaHan} quá hạn` : ''} · tính tới {ngayVN(m.mocNgay)}</dd></div>
        </dl>
        <h3 className="bc-h3">Đứng ngoài mũi nhọn</h3>
        <ul className="bc-tt">{m.loaiTru.map((x) => <li key={x.ma}><b>{x.ma}</b> {hienCau(x.ten)}: {x.lyDo}</li>)}</ul>
        <p className="hs-note">Nguyên tắc: máy chỉ đề xuất việc; sự kiện (duyệt, giới thiệu, phản hồi, kết quả) chỉ người ghi, sau khi đã làm thật. Sổ sự kiện nối chuỗi băm nên không sửa được dòng cũ.</p>
      </section>

      <section className="dash-panel dp-khoi" aria-labelledby="dp-pheu">
        <h2 className="hs-h" id="dp-pheu">Vòng đời trong mũi nhọn <span>mỗi bước đếm số nhu cầu đã tới bước đó</span></h2>
        <ol className="dp-pheu">
          {D.pheu.map((p) => (
            <li key={p.buoc}>
              <span className="dp-pheu__nhan">{p.nhan}</span>
              <span className="dp-pheu__thanh" aria-hidden="true"><i style={{ width: `${(p.so / toiDa) * 100}%` }} /></span>
              <b className="dp-pheu__so">{p.so}</b>
            </li>))}
        </ol>
      </section>

      <section className="dash-panel dp-khoi" aria-labelledby="dp-viec">
        <h2 className="hs-h" id="dp-viec">Hàng việc <span>máy tính từ sổ sự kiện và gợi ý ứng viên; người làm rồi ghi sự kiện</span></h2>
        {theoNguoi.map(({ ng, ds }) => (
          <div key={ng} className="dp-nguoi">
            <h3 className="bc-h3">{ng} · {ds.length} việc</h3>
            <div className="md-bn-cuon" tabIndex={0} role="region" aria-label={`Hàng việc của ${ng}, cuộn ngang trên màn hẹp`}>
              <table className="md-bn dp-bang">
                <thead><tr><th scope="col">Hạn</th><th scope="col">Việc</th><th scope="col">Nhu cầu</th><th scope="col">Đơn vị</th></tr></thead>
                <tbody>
                  {ds.map((v, i) => (
                    <tr key={i} className={v.quaHan ? 'dp-qua-han' : ''}>
                      <td>{ngayVN(v.han)}{v.quaHan ? ' · quá hạn' : ''}</td>
                      <th scope="row">{v.nhan}</th>
                      <td><b>{v.nhuCau}</b> {tenNc.get(v.nhuCau)}</td>
                      <td>{v.donVi ?? 'chưa có'}</td>
                    </tr>))}
                </tbody>
              </table>
            </div>
          </div>))}
      </section>

      <section className="dash-panel dp-khoi" aria-labelledby="dp-nc">
        <h2 className="hs-h" id="dp-nc">Nhu cầu trong mũi nhọn <span>{m.soNhuCau} bài toán, ứng viên và trạng thái từng cặp</span></h2>
        <ul className="ct-ds">
          {D.nhuCau.map((n) => (
            <li key={n.ma} className="ct-the">
              <div className="ct-the__dau"><span className="ct-ma">{n.ma}</span>{n.dong && <span className="hs-chip">đã đóng</span>}</div>
              <h3 className="ct-ten">{hienCau(n.ten)}</h3>
              {n.doiTuong && <p className="dp-dt">{hienCau(n.doiTuong)}</p>}
              {n.ungVien.length === 0
                ? <p className="ct-trong">Chưa có ứng viên trong sổ nguồn. Việc tiếp theo là tìm bên cung bằng một lô mới.</p>
                : (
                  <ul className="dp-uv">
                    {n.ungVien.map((u) => (
                      <li key={u.dv}>
                        <Link className="hd-dv__ten" href={`/dashboard/don-vi/${u.slug}`}>{u.dv}</Link>
                        <span className={`dp-tt dp-tt--${u.trangThai}`}>{TRANG_THAI[u.trangThai] ?? u.trangThai}</span>
                        <span className="dp-nguon">{u.nguon === 'may' ? 'máy gợi ý' : 'người thêm'}</span>
                      </li>))}
                  </ul>)}
            </li>))}
        </ul>
      </section>

      <section className="dash-panel dp-khoi" aria-labelledby="dp-sk">
        <h2 className="hs-h" id="dp-sk">Sổ sự kiện <span>{m.soSuKien} sự kiện, chỉ người ghi</span></h2>
        {D.suKien.length === 0
          ? <p className="ct-trong">Chưa có sự kiện nào. Khi đã làm một việc thật (duyệt ứng viên, gửi giới thiệu, nhận phản hồi, có kết quả), người phụ trách ghi bằng lệnh <code>python3 dieu_phoi.py</code> trong thư mục CaoLocMatch; lệnh kiểm luật trước khi ghi.</p>
          : (
            <ol className="dp-sk">
              {[...D.suKien].reverse().map((e) => (
                <li key={e.stt}>
                  <span className="ct-ma">#{e.stt} · {ngayVN(e.luc.slice(0, 10))}</span>
                  <b> {TEN_SU_KIEN[e.loai] ?? e.loai}</b> · {e.nhuCau}{e.donVi ? ` · ${e.donVi}` : ''} · {e.nguoi}
                  <p>{e.noiDung}</p>
                </li>))}
            </ol>)}
      </section>
    </div>
  );
}
