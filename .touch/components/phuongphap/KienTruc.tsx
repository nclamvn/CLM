/**
 * KienTruc · Ba khoi cho trang Phuong phap (25/10/2026, soi duoi goc nha dau tu):
 *   DongDuLieu   dong du lieu tu nguon cong khai toi chu ky, moi tang mot con so DOC tu file da sinh;
 *   BangKiemDinh ket qua tung o cua lan kiem dinh gan nhat, nhom theo phan cua he, tach cong va phep
 *                thu cai loi (lib/hub-chuoi-cong.json, cong check-chuoi-cong.mjs);
 *   LichSuLo     moi lo lam giau: de xuat, o co y de trong, doi chung, nguoi duyet, loi duyet nguyen van
 *                (lib/hub-lo.json, cong check-lich-su-lo.mjs).
 * Khong so nao go tay. Don sac; chu khong nho hon 12px.
 */
import CC from '@/lib/hub-chuoi-cong.json';
import LO from '@/lib/hub-lo.json';
import pheu from '@/lib/hub-pheu.json';
import cauThat from '@/lib/hub-cau-that.json';
import { cnclMeta } from '@/lib/cncl-registry';
import { ngayVN, tenNguoi } from '@/lib/dinh-dang';

type O = { kho: string; ten: string; tt: string; rang: boolean };
type Lo = { dot: string; loai: string; loaiTen: string; deXuat: number; honestNull: number; doiChieu: number;
  duyet: { nguoi: string; ngay: string; loi: string | null; soLoai: number } | null; nap: { ngay: string; soDong: number } | null; trangThai: string };

const PHAN: [string, string, string][] = [
  ['CNCLData', 'Sổ nguồn bên cung', 'câu nguồn nguyên văn, hạng nguồn, ngày đăng, độ tươi, tài trợ, tham chiếu treo'],
  ['Dataset_CongNgheChienLuoc', 'Danh mục nhu cầu quốc gia', 'câu nguồn của các sản phẩm chiến lược theo QĐ 21 và mốc thời gian'],
  ['CaoLocMatch', 'Máy ghép, chữ ký, điều phối', 'điểm tính lại được, chữ ký khoá vào câu nguồn, xung đột lợi ích, sổ sự kiện'],
  ['.touch', 'Giao diện và số trên web', 'mọi số đếm lại được, câu hiện ra không mất chữ, đơn sắc, cỡ chữ, truy cập'],
];
const n = (k: string) => (pheu as { tang: { k: string; n: number }[] }).tang.find((t) => t.k === k)?.n ?? 0;

export function DongDuLieu() {
  const lo = (LO as { lo: Lo[] }).lo;
  const daNap = lo.filter((l) => l.trangThai === 'da_nap');
  const o = (CC as { o: O[] | null }).o;
  const tang = [
    { ten: 'Nguồn công khai', so: cnclMeta.snapshots, nhan: 'bản chụp trang nguồn', phu: 'cổng nhà nước, báo chính thống, trang của đơn vị; không dùng trang tổng hợp' },
    { ten: 'Lô làm giàu', so: daNap.length, nhan: `lô đã duyệt và nạp, ${lo.length - daNap.length} lô chờ duyệt`, phu: `máy đề xuất, người duyệt cả lô; ${lo.reduce((s, l) => s + l.honestNull, 0)} ô máy cố ý để trống vì không có nguồn` },
    { ten: 'Sổ nguồn', so: cnclMeta.claims, nhan: 'câu nguồn bên cung', phu: `cùng ${cnclMeta.needs} nhu cầu quốc gia và ${(cauThat as { nhuCau: unknown[] }).nhuCau.length} nhu cầu đặt hàng thật` },
    { ten: 'Máy ghép', so: n('kha_di'), nhan: 'cặp khả dĩ được xét', phu: `${n('qua_neo_nhom')} cặp qua neo lĩnh vực, ${n('qua_giao_tu')} cặp qua ngưỡng câu nguồn` },
    { ten: 'Người gác cổng', so: n('da_ky'), nhan: 'cặp đã ký', phu: `${n('tu_choi')} cặp bị từ chối, lý do giữ nguyên lời người viết; máy không tạo được chữ ký` },
    { ten: 'Kiểm định tự động', so: (CC as { tong: number }).tong, nhan: 'ô chạy lại mỗi lần đổi', phu: o ? `${o.filter((x) => !x.rang).length} cổng và ${o.filter((x) => x.rang).length} phép thử cài lỗi` : 'chi tiết từng ô có từ lần chạy kế tiếp' },
  ];
  return (
    <ol className="pp-dong" aria-label="Dòng dữ liệu từ nguồn công khai tới chữ ký">
      {tang.map((t, i) => (
        <li key={t.ten} className="pp-dong__tang">
          <span className="pp-dong__so">{String(i + 1).padStart(2, '0')}</span>
          <span className="pp-dong__ten">{t.ten}</span>
          <span className="pp-dong__v">{t.so}</span>
          <span className="pp-dong__nhan">{t.nhan}</span>
          <span className="pp-dong__phu">{t.phu}</span>
        </li>))}
    </ol>
  );
}

export function BangKiemDinh() {
  const c = CC as { luc: string | null; cheDo: string | null; tong: number; xanh: number; o: O[] | null };
  if (!c.luc) return <p>Môi trường này chưa có kết quả kiểm định nào. Không có kết quả thì không ghi “đạt”.</p>;
  if (!c.o) return <p>Lần kiểm định gần nhất ({ngayVN(c.luc)}, {c.xanh}/{c.tong} ô đạt) chạy trước khi chuỗi ghi chi tiết từng ô; bảng chi tiết có từ lần chạy kế tiếp.</p>;
  const o = c.o;
  return (
    <>
      <div className="md-bn-cuon" tabIndex={0} role="region" aria-label="Bảng kiểm định theo phần của hệ, cuộn ngang trên màn hẹp">
        <table className="md-bn pp-kd">
          <caption className="sr-only">Kết quả từng phần của lần kiểm định {ngayVN(c.luc)}</caption>
          <thead><tr><th scope="col">Phần của hệ</th><th scope="col" className="so">Cổng</th><th scope="col" className="so">Phép thử cài lỗi</th><th scope="col" className="so">Đạt</th><th scope="col">Chặn những gì</th></tr></thead>
          <tbody>
            {PHAN.map(([kho, ten, chan]) => {
              const ds = o.filter((x) => x.kho === kho);
              if (!ds.length) return null;
              return (
                <tr key={kho}>
                  <th scope="row">{ten}</th>
                  <td className="so">{ds.filter((x) => !x.rang).length}</td>
                  <td className="so">{ds.filter((x) => x.rang).length}</td>
                  <td className="so">{ds.filter((x) => x.tt === 'XANH').length}/{ds.length}</td>
                  <td>{chan}</td>
                </tr>);
            })}
          </tbody>
        </table>
      </div>
      <details className="pp-chi-tiet">
        <summary>Xem đủ {o.length} ô của lần chạy {ngayVN(c.luc)} {c.luc.slice(11, 16)}</summary>
        <ul className="pp-o">
          {o.map((x, i) => (
            <li key={`${x.kho}-${x.ten}-${i}`}><code>{x.ten}</code><span className={x.tt === 'XANH' ? 'pp-o__dat' : 'pp-o__do'}>{x.tt === 'XANH' ? 'đạt' : x.tt === 'DO' ? 'đỏ' : x.tt === 'HOAN' ? 'hoãn' : 'không chạy'}</span>{x.rang && <span className="pp-o__rang">phép thử</span>}</li>))}
        </ul>
      </details>
    </>
  );
}

export function LichSuLo() {
  const lo = (LO as { lo: Lo[] }).lo;
  return (
    <div className="md-bn-cuon" tabIndex={0} role="region" aria-label="Lịch sử duyệt lô, cuộn ngang trên màn hẹp">
      <table className="md-bn pp-kd">
        <caption className="sr-only">Lịch sử các lô làm giàu dữ liệu</caption>
        <thead><tr><th scope="col">Lô</th><th scope="col">Loại</th><th scope="col" className="so">Máy đề xuất</th><th scope="col" className="so">Ô để trống có chủ đích</th><th scope="col" className="so">Trang đối chứng lại</th><th scope="col">Người duyệt và lời duyệt nguyên văn</th><th scope="col">Đã nạp</th></tr></thead>
        <tbody>
          {lo.map((l) => (
            <tr key={l.dot}>
              <th scope="row">{l.dot.replace('dot_', 'Lô ')}</th>
              <td>{l.loaiTen}</td>
              <td className="so">{l.deXuat} dòng</td>
              <td className="so">{l.honestNull}</td>
              <td className="so">{l.doiChieu || 'chưa'}</td>
              <td>{l.duyet ? <>{tenNguoi(l.duyet.nguoi)}, {ngayVN(l.duyet.ngay)}: “{l.duyet.loi}”</> : 'chờ người duyệt'}</td>
              <td>{l.nap ? `${l.nap.soDong} dòng, ${ngayVN(l.nap.ngay)}` : 'chưa'}</td>
            </tr>))}
        </tbody>
      </table>
    </div>
  );
}
