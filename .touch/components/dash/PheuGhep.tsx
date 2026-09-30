/**
 * PheuGhep · Man Matching: engine da lam gi truoc khi 12 cap toi tay nguoi gac cong.
 *
 * Them 30/09/2026 de lam day man Matching. Man cu chi co 11 match da ky, nguoi xem khong thay
 * phan viec lon nhat cua engine: loai. Ba phan, doc tu lib/hub-pheu.json (sinh boi
 * CaoLocMatch/pheu_matching.py, script da doi chieu tung cap voi chinh make_matches_v2):
 *   - PheuGhep       phieu bon tang, tu moi cap nhu cau x don vi toi chu ky
 *   - MayDaChan      cap trung chu nhung khac linh vuc, lop neo nhom da chan
 *   - SuytDat        cap cung linh vuc, giao tu duoi nguong: KHONG phai match, la cho can them bang chung
 * Khong so nao go tay; cong check-pheu.mjs doi chieu voi out/pheu.json va voi cncl-match.json.
 */
import Link from 'next/link';
import pheu from '@/lib/hub-pheu.json';
import { slugDonVi } from '@/lib/ho-so.mjs';

type ViDuChan = { cau: string; ten_cau: string; cung: string; ty_le: number; giao: string[]; nhom_cau: number; nhom_cung: number[] };
type ViDuSuyt = { cau: string; ten_cau: string; cung: string; ty_le: number; giao: string[]; thieu: string[]; nhom_cau: number };
type Pheu = {
  quy_tac: string; nguong_giao: number; so_nhu_cau: number; so_don_vi_co_nang_luc: number;
  tang: { k: string; n: number }[]; neo_qua_chuoi_gia_tri: number;
  loai_lop1: { so: number; vi_du: ViDuChan[] }; suyt_dat: { so: number; vi_du: ViDuSuyt[] };
};
const P = pheu as unknown as Pheu;
const n = (k: string) => P.tang.find((t) => t.k === k)?.n ?? 0;
const so = (v: number) => v.toLocaleString('vi-VN');
const phay = (v: number) => v.toFixed(2).replace('.', ',');
const so2 = (v: number) => String(v).padStart(2, '0');
// Thanh do dai theo log: 1.290 va 12 cung doc duoc tren mot thuoc.
const rong = (v: number) => `${Math.max(2, (Math.log10(Math.max(1, v)) / Math.log10(Math.max(2, n('kha_di')))) * 100)}%`;

export function PheuGhep() {
  const kd = n('kha_di'); const nn = n('qua_neo_nhom'); const uv = n('qua_giao_tu'); const ky = n('da_ky'); const tc = n('tu_choi'); const ck = n('cho_ky');
  const buoc = [
    { v: kd, nhan: 'cặp khả dĩ', phu: `${P.so_nhu_cau} nhu cầu × ${P.so_don_vi_co_nang_luc} đơn vị có năng lực` },
    { v: nn, nhan: 'cùng lĩnh vực', phu: `${P.neo_qua_chuoi_gia_tri} cặp trong đó nối qua chuỗi giá trị đã duyệt` },
    { v: uv, nhan: 'ứng viên trình người', phu: `giao ít nhất ${so(P.nguong_giao * 100)}% từ khoá của nhu cầu` },
    { v: ky, nhan: 'match đã ký', phu: ck > 0 ? `${tc} cặp bị từ chối, ${ck} cặp đang chờ người gác cổng` : `${tc} cặp bị từ chối, giữ lại cùng lý do` },
  ];
  const loai = [
    { v: kd - nn, ly: 'khác lĩnh vực: lớp neo nhóm loại' },
    { v: nn - uv, ly: 'giao chưa tới ngưỡng: câu nguồn chưa đủ' },
    { v: uv - ky, ly: ck > 0 ? 'bị từ chối hoặc đang chờ người gác cổng' : 'người gác cổng từ chối' },
  ];
  return (
    <section className="dash-panel pg" aria-labelledby="pg-h">
      <header className="pg-dau">
        <h2 className="pg-h" id="pg-h">Phễu ghép</h2>
        <p className="pg-phu">Từ {so(kd)} cặp khả dĩ tới {ky} match có chữ ký. Máy loại phần lớn, người quyết phần cuối.</p>
      </header>
      <ol className="pg-tang">
        {buoc.map((b, i) => (
          <li key={b.nhan} className={i === buoc.length - 1 ? 'pg-b is-cuoi' : 'pg-b'}>
            <span className="pg-b__so">{so(b.v)}</span>
            <span className="pg-b__nhan">{b.nhan}</span>
            <span className="pg-b__thanh" aria-hidden="true"><i style={{ width: rong(b.v) }} /></span>
            <span className="pg-b__phu">{b.phu}</span>
            {i < loai.length && (
              <span className="pg-b__loai"><b>−{so(loai[i].v)}</b> {loai[i].ly}</span>)}
          </li>))}
      </ol>
      <p className="pg-chan">
        Quy tắc <code>{P.quy_tac}</code>. Mỗi con số đếm lại từ dữ kiện của engine và đối chiếu từng cặp với chính engine; lệch một cặp là chuỗi cổng báo đỏ.
      </p>
    </section>
  );
}

export function MayDaLoai() {
  const c = P.loai_lop1; const s = P.suyt_dat;
  return (
    <div className="pg-hai">
      <section className="dash-panel pg" aria-labelledby="pg-chan-h">
        <header className="pg-dau">
          <h2 className="pg-h" id="pg-chan-h">Máy đã chặn <span>{c.so} cặp</span></h2>
          <p className="pg-phu">Trùng chữ nhưng khác lĩnh vực. Chấm điểm theo chữ thì các cặp này lọt; lớp neo nhóm chặn trước khi tính điểm.</p>
        </header>
        <ul className="pg-ds">
          {c.vi_du.map((v) => (
            <li key={`${v.cau}-${v.cung}`} className="pg-dong">
              <span className="pg-dong__ma">{v.cau}</span>
              <span className="pg-dong__than">
                <span className="pg-dong__cap"><Link href={`/dashboard/don-vi/${slugDonVi(v.cung)}`}>{v.cung}</Link><em title={v.ten_cau}>{v.ten_cau}</em></span>
                <span className="pg-tu">{v.giao.map((t) => <i key={t} className="pg-tu--giao">{t}</i>)}</span>
              </span>
              <span className="pg-dong__ly">
                {v.nhom_cung.length ? <>nhóm {so2(v.nhom_cau)} ≠ {v.nhom_cung.map(so2).join(', ')}</> : <>đơn vị chưa có nhóm có nguồn</>}
              </span>
            </li>))}
        </ul>
        {c.so > c.vi_du.length && <p className="pg-them">và {c.so - c.vi_du.length} cặp khác cùng lý do.</p>}
      </section>

      <section className="dash-panel pg" aria-labelledby="pg-suyt-h">
        <header className="pg-dau">
          <h2 className="pg-h" id="pg-suyt-h">Suýt đạt <span>{s.so} cặp</span></h2>
          <p className="pg-phu">Cùng lĩnh vực nhưng câu nguồn mới nói được một phần. Không phải match: một câu nguồn nói đúng phần còn thiếu sẽ đưa cặp lên bàn người gác cổng.</p>
        </header>
        <ul className="pg-ds">
          {s.vi_du.map((v) => (
            <li key={`${v.cau}-${v.cung}`} className="pg-dong">
              <span className="pg-dong__ma">{v.cau}</span>
              <span className="pg-dong__than">
                <span className="pg-dong__cap"><Link href={`/dashboard/don-vi/${slugDonVi(v.cung)}`}>{v.cung}</Link><em title={v.ten_cau}>{v.ten_cau}</em></span>
                <span className="pg-tu">
                  {v.giao.map((t) => <i key={t} className="pg-tu--giao">{t}</i>)}
                  {v.thieu.slice(0, 5).map((t) => <i key={t} className="pg-tu--thieu">{t}</i>)}
                  {v.thieu.length > 5 && <i className="pg-tu--them">+{v.thieu.length - 5}</i>}
                </span>
              </span>
              <span className="pg-dong__do" aria-label={`giao ${phay(v.ty_le)}, ngưỡng ${phay(P.nguong_giao)}`}>
                <span className="pg-do"><i style={{ width: `${v.ty_le * 100}%` }} /><b style={{ left: `${P.nguong_giao * 100}%` }} /></span>
                <span className="pg-do__so">{phay(v.ty_le)}</span>
              </span>
            </li>))}
        </ul>
        {s.so > s.vi_du.length && <p className="pg-them">và {s.so - s.vi_du.length} cặp khác, xếp theo độ giao giảm dần.</p>}
        <p className="pg-chu"><i className="pg-tu--giao">từ</i> có trong câu nguồn · <i className="pg-tu--thieu">từ</i> nhu cầu cần mà câu nguồn chưa nói · vạch dọc là ngưỡng {phay(P.nguong_giao)}</p>
      </section>
    </div>
  );
}
