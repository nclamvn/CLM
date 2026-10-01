import type { Metadata } from 'next';
import Link from 'next/link';
import { DashTopBar } from '@/components/dash/DashTopBar';
import { cnclMeta } from '@/lib/cncl-registry';
import { matchMeta } from '@/lib/cncl-match';
import { ngayVN, tenNguoi } from '@/lib/dinh-dang';

export const metadata: Metadata = {
  title: 'Phương pháp · .touch',
  description: 'Dữ liệu đến từ đâu, máy ghép cung cầu thế nào, ai ký, và kiểm định tự động chặn những gì.',
};

/**
 * Trang Phuong phap (01/10/2026, nghiem thu enterprise muc 2 va 16): moi chi tiet ky thuat bi go
 * khoi cac man (ten luat ghep, he so, cach kiem dinh) duoc giai thich o MOT noi, bang tieng Viet.
 * Moi con so doc tu du lieu (cncl-registry, cncl-match), khong go tay.
 */
export default function PhuongPhapPage() {
  const ct = matchMeta.congThuc;
  const pt = (v: number) => `${Math.round(v * 100)}%`;
  const cc = cnclMeta.chuoiCong;
  return (
    <>
      <DashTopBar title="Phương pháp" subtitle="Dữ liệu đến từ đâu, ghép thế nào, ai ký, kiểm định chặn gì" />
      <div className="dash-content pp">
        <section className="dash-panel pp-khoi" aria-labelledby="pp-1">
          <h2 className="pp-h" id="pp-1"><span>01</span> Dữ liệu đến từ đâu</h2>
          <p>
            Mọi thông tin về năng lực của một đơn vị là một <b>câu nguồn</b>: một câu chép nguyên văn từ trang công khai
            (cổng thông tin nhà nước, báo chính thống, trang của chính đơn vị), kèm <b>bản chụp</b> trang đó và ngày đăng bài.
            Hiện có {cnclMeta.claims} câu nguồn về {cnclMeta.units} đơn vị, từ {cnclMeta.snapshots} bản chụp.
          </p>
          <dl className="pp-hang">
            <div><dt>Hạng A</dt><dd>Cổng thông tin cơ quan nhà nước và Báo Điện tử Chính phủ. Hiện có {cnclMeta.tierA} câu.</dd></div>
            <div><dt>Hạng B</dt><dd>Báo chính thống và tạp chí khoa học có biên tập.</dd></div>
            <div><dt>Hạng C</dt><dd>Trang của chính đơn vị hoặc bài ghi rõ nguồn do đơn vị cung cấp: được dùng, nhưng luôn gắn nhãn tự khai.</dd></div>
          </dl>
          <p className="pp-phu">Không dùng trang tổng hợp, diễn đàn, mạng xã hội hay trang tra cứu doanh nghiệp tư nhân. Nhu cầu quốc gia lấy từ danh mục sản phẩm công nghệ chiến lược theo QĐ 21/2026/QĐ-TTg.</p>
        </section>

        <section className="dash-panel pp-khoi" aria-labelledby="pp-2">
          <h2 className="pp-h" id="pp-2"><span>02</span> Máy ghép cung với cầu thế nào</h2>
          <ol className="pp-buoc">
            <li><b>Cùng lĩnh vực.</b> Đơn vị và nhu cầu phải thuộc cùng nhóm công nghệ, hoặc nối qua một cạnh chuỗi giá trị đã được duyệt (ví dụ chip là đầu vào của thiết bị bay). Cặp khác lĩnh vực bị loại trước khi tính điểm, kể cả khi trùng chữ.</li>
            <li><b>Câu nguồn nói đủ.</b> Câu năng lực của đơn vị phải chứa ít nhất {pt(ct.nguongGiao)} từ khoá của nhu cầu, sau khi bỏ các từ dùng chung của văn bản chính sách.</li>
            <li><b>Điểm có thể tính lại bằng tay.</b> Điểm = {pt(ct.wGiao)} độ giao từ khoá + {pt(ct.wTier)} hạng nguồn + {pt(ct.wDiaDiem)} địa điểm. Không có thành phần ẩn.</li>
          </ol>
          <p className="pp-phu">Phiên bản luật ghép hiện hành: <code>{matchMeta.rule}</code>. Màn Ghép cung cầu cho thấy từng cặp đã đi qua ba bước này ra sao, và những cặp máy đã chặn.</p>
        </section>

        <section className="dash-panel pp-khoi" aria-labelledby="pp-3">
          <h2 className="pp-h" id="pp-3"><span>03</span> Ai quyết định</h2>
          <p>
            Máy chỉ đề xuất. Một cặp chỉ thành <b>match</b> khi người gác cổng ký. Hiện có {matchMeta.daKy} match đã ký và {matchMeta.tuChoi} cặp bị từ chối,
            người gác cổng là {tenNguoi(matchMeta.nguoiKy)}. Lý do từ chối được giữ nguyên lời người viết, không sửa.
          </p>
          <p className="pp-phu">Chữ ký khoá vào đúng câu nguồn tại thời điểm ký. Nếu câu nguồn sau đó đổi, chữ ký tự rơi và cặp phải được ký lại; giao diện không có nút nào tạo được chữ ký.</p>
        </section>

        <section className="dash-panel pp-khoi" aria-labelledby="pp-4">
          <h2 className="pp-h" id="pp-4"><span>04</span> Kiểm định tự động chặn gì</h2>
          <p>
            Mỗi lần dữ liệu hay giao diện thay đổi, và mỗi sáng trên máy chủ, một chuỗi {cc ? cc.tong : ''} bước kiểm định chạy lại từ đầu
            {cc ? <> (lần gần nhất {ngayVN(cc.luc)}: {cc.xanh}/{cc.tong} đạt)</> : null}. Chuỗi chặn, chẳng hạn:
          </p>
          <ul className="pp-ds">
            <li>câu nguồn không còn nguyên văn trong bản chụp, hoặc ngày đăng bị lấy nhầm ngày chụp;</li>
            <li>con số trên web không đếm lại được từ dữ liệu;</li>
            <li>một match thiếu chữ ký hoặc chữ ký không khớp câu nguồn;</li>
            <li>nguồn quá 180 ngày mà chưa ghi lý do giữ;</li>
            <li>chữ tiếng Anh, chữ quá nhỏ, màu tươi hoặc lỗi truy cập lọt vào giao diện.</li>
          </ul>
          <p className="pp-phu">Mỗi bước kiểm định có một bộ thử tự cài lỗi để chứng minh bước đó còn bắt được lỗi.</p>
        </section>

        <section className="dash-panel pp-khoi" aria-labelledby="pp-5">
          <h2 className="pp-h" id="pp-5"><span>05</span> Thuật ngữ</h2>
          <dl className="pp-tn">
            <div><dt>Câu nguồn</dt><dd>Một câu chép nguyên văn từ nguồn công khai, làm bằng cho một thông tin.</dd></div>
            <div><dt>Bản chụp</dt><dd>Bản lưu trang nguồn tại ngày lấy, để đối chiếu khi trang gốc đổi hoặc mất.</dd></div>
            <div><dt>Hạng nguồn</dt><dd>A, B, C theo độ tin cậy của nơi đăng.</dd></div>
            <div><dt>Nhu cầu</dt><dd>Một sản phẩm công nghệ chiến lược trong danh mục QĐ 21/2026, mã P01 đến P30.</dd></div>
            <div><dt>Match</dt><dd>Cặp đơn vị và nhu cầu đã được người gác cổng ký.</dd></div>
            <div><dt>Người gác cổng</dt><dd>Người có thẩm quyền ký hoặc từ chối một cặp máy đề xuất.</dd></div>
          </dl>
        </section>

        <p className="pp-cuoi"><Link href="/dashboard">Về tổng quan</Link> · <Link href="/dashboard/registry">Mở sổ nguồn</Link></p>
      </div>
    </>
  );
}
