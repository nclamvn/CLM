'use client';

import { useEffect, useMemo, useState } from 'react';
import { cnclUnits, cnclNeeds, type CnclUnit, type CnclEvidence } from '@/lib/cncl-registry';
import { ProofUnitButton, tenTruong, TEN_SP } from '@/components/proof/ProofLayer';
import { hienGiaTri } from '@/lib/hien-gia-tri.mjs';

/**
 * Tra cuu registry bang trinh duyet. Loc TUC THOI phia client tren 42 don vi / 200 evidence.
 *
 * VI SAO LOC O DAY CHU KHONG PHIA SERVER: 200 evidence la tap nho, tai het mot lan re hon
 * mot vong may chu cho moi lan go phim. Doi lai la trang can JS. Chap nhan vi day la man
 * trong dashboard, khong phai trang cong khai can index.
 *
 * BA DIEU KHONG DUOC LAM O LOP NAY:
 *   1. Khong sua chu cua span. Chu in ra phai dung chu trong ban chup, ke ca dau nhay.
 *   2. Khong suy ra gia tri thay cho o trong. O trong la honest-null, phai hien la trong.
 *   3. Khong am tham tra ve 0 ket qua. Khong khop thi noi ro da loc gi.
 */

type Nhom = 'tat-ca' | string;
type Tier = 'tat-ca' | 'A' | 'B' | 'C';

const TEN_NHOM: Record<string, string> = {
  '1': 'Công nghệ số', '2': 'Mạng di động thế hệ sau', '3': 'Robot và tự động hoá',
  '4': 'Sinh học và y sinh', '5': 'Năng lượng và vật liệu', '6': 'Chip bán dẫn',
  '7': 'An ninh mạng và lượng tử', '8': 'Biển, đại dương, lòng đất',
  '9': 'Hàng không và vũ trụ', '10': 'Đường sắt tốc độ cao',
};

function TierChip({ tier }: { tier: 'A' | 'B' | 'C' }) {
  const cls = tier === 'A' ? 'chip--pass' : tier === 'B' ? 'chip--public' : 'chip--private';
  const title = tier === 'A' ? 'Nguồn nhà nước' : tier === 'B' ? 'Báo lớn' : 'Nguồn tự khai, chưa đối chiếu độc lập';
  return <span className={`chip ${cls} reg-tier`} title={title}>{`Hạng ${tier}`}</span>;
}

function EvidenceRow({ e }: { e: CnclEvidence }) {
  return (
    <tr>
      <td className="reg-td-field">{tenTruong(e.field)}</td>
      <td>
        {hienGiaTri(e.field, e.value, TEN_SP)}
        {e.extraction !== 'verbatim' ? (
          <span className="chip chip--private reg-tier reg-ex" title={e.note || 'Giá trị chuẩn hoá từ span, không phải trích nguyên văn'}>
            chuẩn hoá
          </span>
        ) : null}
      </td>
      <td><TierChip tier={e.tier} /></td>
      <td>
        <a className="reg-src" href={e.href} target="_blank" rel="noopener noreferrer" title={`Câu làm bằng: ${e.span}`}>
          {e.source}
        </a>
      </td>
    </tr>
  );
}

function UnitCard({ u, mo }: { u: CnclUnit; mo: boolean }) {
  return (
    <details className="reg-unit" open={mo}>
      <summary className="reg-unit__head">
        <span className="reg-unit__name">{u.name}</span>
        <span className="reg-unit__meta">
          <TierChip tier={u.bestTier} />
          {u.favorsRtr ? (
            <span className="chip chip--risk reg-tier" title="Khai báo xung đột lợi ích: người vận hành hệ này là COO của RtR">
              Liên quan người vận hành
            </span>
          ) : null}
          <span className="reg-unit__count">{u.evidence.length} câu nguồn</span>
        </span>
        <span className="reg-unit__cap">{u.capability || 'Chưa có mô tả năng lực có bằng chứng nguyên văn.'}</span>
        {/* Mang nang luc thu hai. Mot don vi co hai mang thi ke ca hai, vi ke mot mang co
            the noi nguoc han y nghia: FECON co ca "van hanh TBM" lan "tu nghien cuu vo ham",
            va chi hien ve dau thi trang web mo ta dung cai ly do de LOAI no. */}
        {u.capability2 ? <span className="reg-unit__cap reg-unit__cap--2">{u.capability2}</span> : null}
        {/* Dinh danh tu khai (01/10/2026): nhan rieng, khong phai dinh danh tu cong chinh thuc. */}
        {u.tenPhapNhan || u.maTuKhai ? (
          <span className="reg-unit__phap" title="Tên và mã số do chính đơn vị công bố trên website chính chủ; chưa đối chiếu cổng đăng ký doanh nghiệp quốc gia">
            Tự khai: {u.tenPhapNhan || u.name}{u.maTuKhai ? ` · mã ${u.maTuKhai}` : ''}
          </span>
        ) : null}
        <span className="reg-unit__tags">
          {/* Loai hinh don vi. Gia tri goc la ma normalized ('DN' / 'vien'), nen hien nhan
              doc duoc va gan title noi ro day la PHAN LOAI chu khong phai chu cua nguon.
              Doc ca `u.loaiHinh` (ma goc) lan `u.loaiHinhLabel` (nhan) la co y: cong
              truong_hien kiem xem khoa GOC co ai doc khong, khong phai khoa dan xuat. */}
          {u.loaiHinh ? (
            <span className="reg-tag reg-tag--loai" title="Phân loại đơn vị, giá trị chuẩn hoá từ nguồn chứ không trích nguyên văn">
              {u.loaiHinhLabel}
            </span>
          ) : null}
          {u.nhoms.map((n) => (
            <span key={n} className="reg-tag" style={{ '--mau': `var(--nhom-${n})` } as React.CSSProperties}><i className="mau-cham" aria-hidden="true" />{`Nhóm ${n} · ${TEN_NHOM[n] ?? ''}`}</span>
          ))}
          {u.sanPham.map((s) => (
            <span key={s} className="reg-tag reg-tag--sp" title="Sản phẩm chiến lược theo QĐ 21/2026">{`P${String(s).padStart(2, '0')}`}</span>
          ))}
        </span>
      </summary>
      <div className="reg-unit__body">
        {/* Nut mo lop nguon dat NGOAI summary (01/10/2026): nut long trong summary la dieu khien long
            nhau, vi pham chuan truy cap (axe nested-interactive) va de bam nham. */}
        <div className="reg-unit__hanh"><ProofUnitButton ten={u.name} className="reg-unit__proof">Xem nguồn của đơn vị này</ProofUnitButton></div>
        <table className="reg-table">
          <thead>
            <tr>
              <th scope="col">Trường</th><th scope="col">Giá trị</th>
              <th scope="col">Cấp nguồn</th><th scope="col">Nguồn (mở bản chụp)</th>
            </tr>
          </thead>
          <tbody>{u.evidence.map((e, i) => <EvidenceRow key={i} e={e} />)}</tbody>
        </table>
      </div>
    </details>
  );
}

export function RegistryBrowser() {
  const [q, setQ] = useState('');
  const [nhom, setNhom] = useState<Nhom>('tat-ca');
  const [tier, setTier] = useState<Tier>('tat-ca');
  const [ben, setBen] = useState<'cung' | 'cau'>('cung');

  const nhomCo = useMemo(() => {
    const s = new Set<string>();
    for (const u of cnclUnits) for (const n of u.nhoms) s.add(n);
    return [...s].sort((a, b) => Number(a) - Number(b));
  }, []);

  const tuKhoa = q.trim().toLowerCase();

  const loc = useMemo(() => cnclUnits.filter((u) => {
    if (nhom !== 'tat-ca' && !u.nhoms.includes(nhom)) return false;
    if (tier !== 'tat-ca' && u.bestTier !== tier) return false;
    if (tuKhoa && !u.tim.includes(tuKhoa)) return false;
    return true;
  }), [tuKhoa, nhom, tier]);

  const locCau = useMemo(() => cnclNeeds.filter((n) => !tuKhoa || n.tim.includes(tuKhoa)), [tuKhoa]);

  const soEvidence = loc.reduce((n, u) => n + u.evidence.length, 0);
  const daLoc = tuKhoa !== '' || nhom !== 'tat-ca' || tier !== 'tat-ca';
  // Phan trang (01/10/2026, nghiem thu muc 8): 60 don vi tren mot trang dai 8.000px.
  const MOI_TRANG = 12;
  const [trang, setTrang] = useState(0);
  // ?trang=tat-ca: hien het tren mot trang (de in, va de khung anh moc toan trang van phu du 60 don vi).
  const [tatCa, setTatCa] = useState(false);
  useEffect(() => { if (new URLSearchParams(window.location.search).get('trang') === 'tat-ca') setTatCa(true); }, []);
  useEffect(() => { setTrang(0); }, [tuKhoa, nhom, tier, ben]);
  const soTrang = tatCa ? 1 : Math.max(1, Math.ceil(loc.length / MOI_TRANG));
  const locTrang = tatCa ? loc : loc.slice(trang * MOI_TRANG, (trang + 1) * MOI_TRANG);
  // Xuat CSV (01/10/2026, nghiem thu muc 15): dung cac don vi DANG LOC, moi dong mot cau nguon,
  // kem cau nguyen van va duong dan ban chup. BOM de Excel doc dung tieng Viet.
  const taiCsv = () => {
    const o = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const goc = window.location.origin;
    const dong = [['Đơn vị', 'Trường', 'Giá trị', 'Câu nguyên văn', 'Hạng nguồn', 'Nguồn', 'Bản chụp'].map(o).join(',')];
    for (const u of loc) for (const e of u.evidence) dong.push([u.name, tenTruong(e.field), hienGiaTri(e.field, e.value, TEN_SP), e.span, e.tier, e.source, goc + e.href].map(o).join(','));
    const url = URL.createObjectURL(new Blob(['\ufeff' + dong.join('\r\n')], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = `so-nguon-cung-${loc.length}-don-vi.csv`; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <>
      <section className="dash-panel reg-find" aria-label="Tra cứu sổ nguồn">
        <div className="reg-find__row">
          <label className="reg-find__lab" htmlFor="reg-q">Tra cứu</label>
          <input
            id="reg-q"
            className="reg-find__inp"
            type="search"
            placeholder="Gõ tên đơn vị, năng lực, mã sản phẩm..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoComplete="off"
          />
          {daLoc ? (
            <button type="button" className="reg-find__clear" onClick={() => { setQ(''); setNhom('tat-ca'); setTier('tat-ca'); }}>
              Xoá bộ lọc
            </button>
          ) : null}
        </div>

        <div className="reg-find__row" role="group" aria-label="Lọc theo nhóm công nghệ">
          <span className="reg-find__lab">Nhóm</span>
          <button type="button" className={`reg-pill${nhom === 'tat-ca' ? ' is-on' : ''}`} aria-pressed={nhom === 'tat-ca'} onClick={() => setNhom('tat-ca')}>
            Tất cả
          </button>
          {nhomCo.map((n) => (
            <button key={n} type="button" className={`reg-pill${nhom === n ? ' is-on' : ''}`} aria-pressed={nhom === n} onClick={() => setNhom(n)} title={TEN_NHOM[n]}>
              {n}
            </button>
          ))}
        </div>

        <div className="reg-find__row" role="group" aria-label="Lọc theo hạng nguồn">
          <span className="reg-find__lab">Cấp nguồn</span>
          {(['tat-ca', 'A', 'B', 'C'] as const).map((t) => (
            <button key={t} type="button" className={`reg-pill${tier === t ? ' is-on' : ''}`} aria-pressed={tier === t} onClick={() => setTier(t)}>
              {t === 'tat-ca' ? 'Tất cả' : `Hạng ${t}`}
            </button>
          ))}
          <span className="reg-find__sep" aria-hidden="true" />
          <button type="button" className={`reg-pill${ben === 'cung' ? ' is-on' : ''}`} aria-pressed={ben === 'cung'} onClick={() => setBen('cung')}>
            Bên CUNG
          </button>
          <button type="button" className={`reg-pill${ben === 'cau' ? ' is-on' : ''}`} aria-pressed={ben === 'cau'} onClick={() => setBen('cau')}>
            Bên CẦU
          </button>
        </div>

        <p className="reg-find__count">
          {ben === 'cung'
            ? `${loc.length} / ${cnclUnits.length} đơn vị · ${soEvidence} câu nguồn`
            : `${locCau.length} / ${cnclNeeds.length} sản phẩm chiến lược`}
          {daLoc && ben === 'cung' ? ' (đang lọc)' : null}
          {ben === 'cung' && loc.length > 0 && <button type="button" className="reg-pill reg-csv" onClick={taiCsv}>Tải CSV {soEvidence} câu nguồn</button>}
        </p>
      </section>

      {ben === 'cung' ? (
        loc.length === 0 ? (
          <section className="dash-panel reg-empty">
            <p>
              Không đơn vị nào khớp bộ lọc hiện tại
              {tuKhoa ? <> với từ khoá <strong>{q.trim()}</strong></> : null}
              {nhom !== 'tat-ca' ? <> trong nhóm {nhom}</> : null}
              {tier !== 'tat-ca' ? <> ở cấp nguồn {tier}</> : null}.
            </p>
            <p className="reg-empty__note">
              Không có kết quả là một câu trả lời thật, không phải lỗi. Sổ nguồn chỉ chứa đơn vị
              có câu nguồn nguyên văn đạt hạng nguồn, nên nhiều tên quen thuộc có thể chưa vào.
            </p>
          </section>
        ) : (
          <section aria-label="Kết quả bên cung">
            {locTrang.map((u) => <UnitCard key={u.name} u={u} mo={loc.length <= 3} />)}
            {soTrang > 1 && (
              <nav className="reg-trang" aria-label="Phân trang">
                <button type="button" className="reg-pill" disabled={trang === 0} onClick={() => setTrang(trang - 1)}>← Trước</button>
                {Array.from({ length: soTrang }, (_, i) => (
                  <button key={i} type="button" className={`reg-pill${trang === i ? ' is-on' : ''}`} aria-current={trang === i ? 'page' : undefined} aria-label={`Trang ${i + 1}`} onClick={() => setTrang(i)}>{i + 1}</button>))}
                <button type="button" className="reg-pill" disabled={trang === soTrang - 1} onClick={() => setTrang(trang + 1)}>Sau →</button>
                <button type="button" className="reg-pill" onClick={() => setTatCa(true)}>Hiện tất cả</button>
                <span className="reg-trang__dem">{trang * MOI_TRANG + 1}–{Math.min(loc.length, (trang + 1) * MOI_TRANG)} trên {loc.length} đơn vị</span>
              </nav>)}
          </section>
        )
      ) : (
        <section className="dash-panel" aria-label="Bên cầu">
          <table className="reg-table reg-table--cau">
            <thead>
              <tr>
                <th scope="col">Mã</th><th scope="col">Sản phẩm chiến lược</th>
                <th scope="col">Cấp nguồn</th><th scope="col">Nguồn</th>
              </tr>
            </thead>
            <tbody>
              {locCau.map((n) => (
                <tr key={n.id}>
                  <td className="reg-td-field">{n.id.replace('san_pham_', 'SP ')}</td>
                  <td>
                    {n.value}
                    {n.chinhThuc ? null : (
                      <span className="chip chip--private reg-tier reg-ex" title="Chưa có bản wording chính thức baochinhphu, đang dùng bản báo thuật lại">
                        câu chữ theo báo
                      </span>
                    )}
                  </td>
                  <td><TierChip tier={n.tier} /></td>
                  <td>
                    <a className="reg-src" href={n.href} target="_blank" rel="noopener noreferrer" title={`Câu làm bằng: ${n.span}`}>
                      {n.source}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {locCau.length === 0 ? <p className="reg-empty__note">Không sản phẩm nào khớp từ khoá.</p> : null}
        </section>
      )}
    </>
  );
}
