#!/usr/bin/env node
/**
 * gen-tracuu-html.mjs · Sinh MOT file HTML tu chua de tra cuu registry.
 *
 * VI SAO CAN, ngoai app Next.js (18/08/2026): app kia phai co may chu chay moi xem duoc.
 * Moi trong nay la mot may Linux rieng, mang cua no khong toi duoc may cua anh Lam, ma
 * Terminal thi o quyen chi-bam nen khong go lenh ho duoc. Ket qua la muon xem UI van phai
 * nho nguoi go tay, dung cai viec dang lam cho ca vong nay met.
 *
 * File nay go bo nut that do: mot file .html duy nhat, nhap dup la mo, khong may chu,
 * khong terminal, khong mang. Ban chup nhung nguyen van ben trong nen bang chung mo duoc
 * ca khi khong co internet.
 *
 * Danh doi: no la BAN CHUP tai thoi diem sinh, khong tu cap nhat khi registry doi. Sinh
 * lai bang lenh nay. App Next.js van la ban song.
 *
 * Style: HIVE Editorial (skill lam-nguyen-style). Don sac tuyet doi, dual serif/sans,
 * hairline, khong gradient, khong emoji, khong mau decorative.
 *
 * Chay: node scripts/gen-tracuu-html.mjs [duong/dan/ra.html]
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { goc } from './goc.mjs';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const TOUCH = join(HERE, '..');

// Goc duong dan dung chung mot nguon su that, xem scripts/goc.mjs.

const RA = process.argv[2] || process.env.CLM_RA_TRACUU || (() => {
  const kb = goc('RtR', 'KnowledgeBase', 'CaoLocMatch_PoC') || goc('KnowledgeBase', 'CaoLocMatch_PoC');
  if (!kb) { console.error('KHONG THAY thu muc CaoLocMatch_PoC de ghi ra.'); process.exit(2); }
  return join(kb, 'CaoLocMatch_TraCuu.html');
})();

// ── Doc du lieu da sinh (khong doc lai registry goc: mot nguon su that) ─────
function docTS(ten, bien) {
  // Thieu dau vao phai NO DANG HOANG chu khong sap. Rang 2 cua bite_tracuu.mjs bat duoc
  // chuyen nay ngay lan chay dau: file lib bien mat thi readFileSync nem loi, Node thoat
  // exit 1 kem stack trace, va bang trang thai doc exit 1 nhu mot loi khong ro nguon con.
  // Loi nao cung do ca, nhung "do vi thieu file X" khac han "do vi mot ngoai le nao do".
  const p = join(TOUCH, 'lib', ten);
  if (!existsSync(p)) {
    console.error(`FAIL: khong thay lib/${ten}. Chay gen-cncl-data.mjs truoc.`);
    process.exit(2);
  }
  const t = readFileSync(p, 'utf8');
  const m = t.match(new RegExp(`export const ${bien}[^=]*= ([\\s\\S]*?);\\n`, 'm'));
  if (!m) {
    console.error(`FAIL: khong doc duoc ${bien} trong lib/${ten}. Chay gen-cncl-data.mjs truoc.`);
    process.exit(2);
  }
  try {
    return JSON.parse(m[1].replace(/ as const$/, ''));
  } catch (e) {
    console.error(`FAIL: ${bien} trong lib/${ten} khong phai JSON hop le. ${e.message}`);
    process.exit(2);
  }
}

const meta = docTS('cncl-registry.ts', 'cnclMeta');
const units = docTS('cncl-registry.ts', 'cnclUnits');
const needs = docTS('cncl-registry.ts', 'cnclNeeds');
const mmeta = docTS('cncl-match.ts', 'matchMeta');
const matches = docTS('cncl-match.ts', 'signedMatches');
const rejected = docTS('cncl-match.ts', 'rejectedPairs');

// ── Nhung ban chup nguyen van vao file ─────────────────────────────────────
const EV = join(TOUCH, 'public', 'evidence');
const banChup = {};
for (const f of readdirSync(EV)) {
  if (f.endsWith('.txt')) banChup['/evidence/' + f] = readFileSync(join(EV, f), 'utf8');
}

// CONG: moi lien ket bang chung ma du lieu tro toi PHAI co ban chup nhung kem.
//
// VI SAO FAIL chu khong chi canh bao: file nay chay offline, khong co duong nao di lay ban
// chup thieu. Neu cu sinh ra thi nguoi mo se bam vao nguon va nhan mot cau xin loi, tuc mot
// o trong nhin giong nhu da co bang chung. Thieu dieu kien ma van sinh ra thi cho suy bien
// do chinh la duong ro. Cung ky luat voi dong_bo_snapshot() ben build_cncl_match.py.
const canCo = new Set();
for (const u of units) { for (const e of u.evidence) canCo.add(e.href); for (const s of u.sources) canCo.add(s.href); }
for (const n of needs) canCo.add(n.href);
for (const m of matches) for (const e of [...m.demandEvidence, ...m.supplyEvidence]) canCo.add(e.href);
const thieu = [...canCo].filter((h) => !(h in banChup)).sort();
if (thieu.length) {
  console.error(`FAIL: ${thieu.length} ban chup duoc tro toi nhung khong nhung duoc.`);
  for (const t of thieu) console.error(`  [THIEU] ${t}`);
  console.error('Khong sinh file tra cuu thieu bang chung. Chay gen-cncl-data.mjs truoc.');
  process.exit(2);
}

const DL = JSON.stringify({ meta, units, needs, mmeta, matches, rejected, banChup })
  .replace(/</g, '\\u003c');

const html = `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>CaoLocMatch - Tra cuu registry</title>
<style>
:root{
  color-scheme:light;
  --ink:#111111; --sec:#666666; --sub:#8C8C8C; --bd:#DDDDDA; --hair:#E9E9E6;
  --soft:#F2F2EF; --strong:#E5E5E1; --canvas:#F7F7F5; --card:#FFFFFF; --black:#050505;
  --sans:Inter,-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif;
  --serif:"Noto Serif","Iowan Old Style",Georgia,serif;
}
*{box-sizing:border-box}
body{margin:0;background:var(--canvas);color:var(--ink);font-family:var(--sans);font-size:14px;line-height:20px;-webkit-font-smoothing:antialiased}
a{color:var(--ink)}
.wrap{display:grid;grid-template-columns:192px minmax(0,1fr);min-height:100vh}
.side{background:var(--black);color:#FFFFFF;padding:24px 18px;position:sticky;top:0;height:100vh;overflow:auto}
.side h1{font-family:var(--serif);font-size:19px;line-height:26px;margin:0 0 4px;font-weight:600}
.side .sub{font-size:11px;line-height:16px;color:#8C8C8C;margin-bottom:26px}
.side nav{display:flex;flex-direction:column;gap:2px}
.side button{all:unset;cursor:pointer;font-size:13px;padding:9px 11px;border-radius:8px;color:#C9C9C6;transition:background 140ms cubic-bezier(.2,.8,.2,1)}
.side button:hover{background:#1A1A1A;color:#FFFFFF}
.side button[aria-current="true"]{background:#2A2A2A;color:#FFFFFF}
.side .foot{margin-top:30px;font-size:10.5px;line-height:16px;color:#6E6E6B;border-top:1px solid #262626;padding-top:14px}
main{padding:24px 26px 60px;min-width:0}
header.top{height:88px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--hair);margin-bottom:20px;gap:16px}
header.top h2{font-family:var(--serif);font-size:26px;line-height:32px;margin:0;font-weight:600;letter-spacing:-.01em}
header.top .m{font-size:12px;color:var(--sec);margin-top:3px}
.kpis{display:flex;gap:26px;flex-wrap:wrap}
.kpi .v{font-family:var(--serif);font-size:27px;line-height:32px;font-weight:600}
.kpi .k{font-size:11px;color:var(--sub);letter-spacing:.06em;text-transform:uppercase}
.card{background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:22px;box-shadow:0 2px 8px rgba(0,0,0,.035),0 12px 28px rgba(0,0,0,.025);margin-bottom:16px}
.find{display:flex;flex-direction:column;gap:12px}
.row{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.lab{font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:var(--sub);min-width:82px}
input[type=search]{flex:1 1 300px;min-width:0;font-family:var(--sans);font-size:14px;padding:9px 12px;border:1px solid var(--bd);border-radius:8px;background:var(--card);color:var(--ink)}
input[type=search]:focus{outline:2px solid var(--black);outline-offset:3px}
.pill{all:unset;cursor:pointer;font-size:12px;padding:4px 11px;border:1px solid var(--bd);border-radius:999px;color:var(--sec);transition:all 140ms cubic-bezier(.2,.8,.2,1)}
.pill:hover{border-color:var(--ink);color:var(--ink)}
.pill[aria-pressed="true"]{background:var(--ink);border-color:var(--ink);color:#FFFFFF}
.count{font-size:12px;color:var(--sub)}
details.u{background:var(--card);border:1px solid var(--bd);border-radius:10px;margin-bottom:10px;box-shadow:0 2px 8px rgba(0,0,0,.035)}
details.u[open]{border-color:var(--ink)}
details.u summary{list-style:none;cursor:pointer;padding:16px 20px;display:grid;grid-template-columns:1fr auto;gap:6px 16px}
details.u summary::-webkit-details-marker{display:none}
.nm{font-family:var(--serif);font-size:16px;line-height:22px;font-weight:600}
.cap{grid-column:1/-1;font-size:13px;line-height:19px;color:var(--sec)}
.tags{grid-column:1/-1;display:flex;gap:6px;flex-wrap:wrap}
.tag{font-size:10.5px;line-height:17px;color:var(--sub);border:1px solid var(--hair);border-radius:999px;padding:0 8px}
.tag.k{border-color:var(--ink);color:var(--ink)}
.tier{font-size:10.5px;line-height:17px;padding:0 8px;border-radius:999px;border:1px solid var(--bd);color:var(--sec)}
.tier.a{border-color:var(--ink);color:var(--ink);font-weight:600}
.tier.b{background:var(--soft)}
.meta{display:flex;gap:7px;align-items:center;flex-wrap:wrap;justify-self:end}
.n{font-size:11px;color:var(--sub)}
table{width:100%;border-collapse:collapse}
th{text-align:left;font-size:10.5px;letter-spacing:.07em;text-transform:uppercase;color:var(--sub);font-weight:600;padding:8px 10px;border-bottom:1px solid var(--bd)}
td{font-size:13px;line-height:19px;color:var(--sec);padding:9px 10px;border-bottom:1px solid var(--hair);vertical-align:top}
tr:last-child td{border-bottom:none}
.fld{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11.5px;color:var(--sub);white-space:nowrap}
.body{padding:0 20px 16px}
.src{cursor:pointer;text-decoration:underline;text-underline-offset:2px;color:var(--ink)}
.q{margin:8px 0 0;padding-left:13px;border-left:2px solid var(--ink);font-size:13px;line-height:19px;color:var(--ink)}
.qc{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:5px;padding-left:13px;font-size:11px;color:var(--sub)}
.m3{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:16px;align-items:start}
.mrow{all:unset;cursor:pointer;display:grid;grid-template-columns:46px 1fr auto;gap:12px;align-items:center;padding:13px 16px;border:1px solid var(--bd);border-radius:10px;background:var(--card);margin-bottom:8px;transition:transform 140ms cubic-bezier(.2,.8,.2,1),box-shadow 140ms}
.mrow:hover{transform:translateY(-1px);box-shadow:0 3px 10px rgba(0,0,0,.05)}
.mrow[aria-pressed="true"]{border-color:var(--ink);border-width:2px}
.sc{font-family:var(--serif);font-size:21px;font-weight:600;text-align:center}
.mt{font-size:13.5px;font-weight:600;line-height:19px}
.mw{font-size:11.5px;color:var(--sub);line-height:17px}
.emp{font-size:13px;color:var(--sec)}
.note{font-size:11.5px;line-height:17px;color:var(--sub);max-width:640px;margin-top:10px}
dialog{border:1px solid var(--ink);border-radius:10px;padding:0;max-width:min(860px,92vw);width:100%;background:var(--card)}
dialog::backdrop{background:rgba(5,5,5,.42)}
dialog .dh{display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid var(--hair);gap:16px}
dialog .dh b{font-family:var(--serif);font-size:15px;font-weight:600}
dialog pre{margin:0;padding:20px;max-height:66vh;overflow:auto;white-space:pre-wrap;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;line-height:19px;color:var(--ink)}
dialog mark{background:var(--strong);color:var(--ink)}
.x{all:unset;cursor:pointer;font-size:12px;border:1px solid var(--bd);border-radius:8px;padding:5px 12px}
.x:hover{border-color:var(--ink)}
@media(max-width:960px){.wrap{grid-template-columns:1fr}.side{position:static;height:auto}.m3{grid-template-columns:1fr}}
</style>
</head>
<body>
<div class="wrap">
  <aside class="side">
    <h1>CàoLọcMatch</h1>
    <div class="sub">Registry công nghệ chiến lược<br>khung ${meta.frame}</div>
    <nav>
      <button data-tab="cung" aria-current="true">Bên CUNG</button>
      <button data-tab="cau">Bên CẦU</button>
      <button data-tab="match">Match đã ký</button>
    </nav>
    <div class="foot">
      Bản chụp ngày ${meta.generatedAt}.<br>
      Bằng chứng nhúng sẵn, mở được cả khi không có mạng.<br><br>
      Nguyễn Cảnh Lâm<br>AI Officer, Real-time Robotics
    </div>
  </aside>
  <main>
    <header class="top">
      <div><h2 id="tt">Bên CUNG</h2><div class="m" id="ts"></div></div>
      <div class="kpis" id="kp"></div>
    </header>
    <div id="app"></div>
  </main>
</div>
<dialog id="dlg"><div class="dh"><b id="dt"></b><button class="x" onclick="dlg.close()">Đóng</button></div><pre id="dp"></pre></dialog>
<script>
const D = ${DL};
const el = (h) => { const d = document.createElement('div'); d.innerHTML = h; return d; };
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// To ro phan registry khang dinh trong cau nguon. Xem chu thich cung ten ben
// components/dash/MatchingWorkbench.tsx.
const toDiem = (span, value) => {
  const i = value ? String(span).indexOf(value) : -1;
  // Value phu tron span thi khong to: to ca cau khong phan biet duoc gi.
  if (i < 0 || String(value).trim() === String(span).trim()) return esc(span);
  return esc(String(span).slice(0, i)) + '<mark>' + esc(value) +
    '</mark>' + esc(String(span).slice(i + String(value).length));
};
const tierCls = (t) => t === 'A' ? 'tier a' : t === 'B' ? 'tier b' : 'tier';
const tenCau = (id) => String(id).replace(' · nhu cầu quốc gia', '').replace('san_pham_', 'SP ');
let tab = 'cung', q = '', nhom = 'tat-ca', tier = 'tat-ca', sel = 0;

function moBanChup(href, span) {
  const t = D.banChup[href];
  document.getElementById('dt').textContent = href.replace('/evidence/', '');
  const p = document.getElementById('dp');
  if (!t) { p.textContent = 'Không nhúng được bản chụp này.'; }
  else {
    const i = span ? t.indexOf(span) : -1;
    p.innerHTML = i < 0 ? esc(t)
      : esc(t.slice(0, i)) + '<mark>' + esc(t.slice(i, i + span.length)) + '</mark>' + esc(t.slice(i + span.length));
    if (i >= 0) setTimeout(() => { const m = p.querySelector('mark'); if (m) m.scrollIntoView({ block: 'center' }); }, 30);
  }
  document.getElementById('dlg').showModal();
}
document.addEventListener('click', (e) => {
  const s = e.target.closest('.src');
  if (s) { e.preventDefault(); moBanChup(s.dataset.h, s.dataset.s || ''); }
});

const nhomCo = [...new Set(D.units.flatMap((u) => u.nhoms))].sort((a, b) => a - b);

function locCung() {
  const k = q.trim().toLowerCase();
  return D.units.filter((u) =>
    (nhom === 'tat-ca' || u.nhoms.includes(nhom)) &&
    (tier === 'tat-ca' || u.bestTier === tier) &&
    (!k || u.tim.includes(k)));
}

function evTable(ev) {
  return '<table><thead><tr><th>Trường</th><th>Giá trị</th><th>Cấp nguồn</th><th>Nguồn</th></tr></thead><tbody>' +
    ev.map((e) => '<tr><td class="fld">' + esc(e.field) + '</td><td>' + esc(e.value) +
      (e.extraction !== 'verbatim' ? ' <span class="tag" title="' + esc(e.note || 'Chuẩn hoá từ câu nguồn') + '">' + esc(e.extraction) + '</span>' : '') +
      '</td><td><span class="' + tierCls(e.tier) + '">Tier ' + e.tier + '</span></td>' +
      '<td><span class="src" data-h="' + esc(e.href) + '" data-s="' + esc(e.span) + '">' + esc(e.source) + '</span></td></tr>').join('') +
    '</tbody></table>';
}

function veCung() {
  const ds = locCung();
  const k = q.trim();
  const daLoc = k || nhom !== 'tat-ca' || tier !== 'tat-ca';
  let h = '<section class="card find">' +
    '<div class="row"><span class="lab">Tra cứu</span><input type="search" id="q" placeholder="Gõ tên đơn vị, năng lực, mã sản phẩm..." value="' + esc(k) + '">' +
    (daLoc ? '<button class="pill" id="xoa">Xoá bộ lọc</button>' : '') + '</div>' +
    '<div class="row"><span class="lab">Nhóm</span>' +
    ['tat-ca', ...nhomCo].map((n) => '<button class="pill" data-nhom="' + n + '" aria-pressed="' + (nhom === n) + '">' + (n === 'tat-ca' ? 'Tất cả' : n) + '</button>').join('') + '</div>' +
    '<div class="row"><span class="lab">Cấp nguồn</span>' +
    ['tat-ca', 'A', 'B', 'C'].map((t) => '<button class="pill" data-tier="' + t + '" aria-pressed="' + (tier === t) + '">' + (t === 'tat-ca' ? 'Tất cả' : 'Tier ' + t) + '</button>').join('') + '</div>' +
    '<p class="count">' + ds.length + ' / ' + D.units.length + ' đơn vị · ' + ds.reduce((n, u) => n + u.evidence.length, 0) + ' evidence' + (daLoc ? ' (đang lọc)' : '') + '</p></section>';
  if (!ds.length) {
    h += '<section class="card"><p class="emp">Không đơn vị nào khớp bộ lọc hiện tại' + (k ? ' với từ khoá <b>' + esc(k) + '</b>' : '') + '.</p>' +
      '<p class="note">Không có kết quả là một câu trả lời thật, không phải lỗi. Registry chỉ chứa đơn vị có bằng chứng nguyên văn đạt cấp nguồn, nên nhiều tên quen thuộc có thể chưa vào.</p></section>';
  } else {
    h += ds.map((u) => '<details class="u"' + (ds.length <= 3 ? ' open' : '') + '><summary>' +
      '<span class="nm">' + esc(u.name) + '</span>' +
      '<span class="meta"><span class="' + tierCls(u.bestTier) + '">Tier ' + u.bestTier + '</span>' +
      (u.favorsRtr ? '<span class="tag k" title="Khai báo xung đột lợi ích: người vận hành hệ này là COO của RtR">favors=rtr</span>' : '') +
      '<span class="n">' + u.evidence.length + ' evidence</span></span>' +
      '<span class="cap">' + esc(u.capability || 'Chưa có mô tả năng lực có bằng chứng nguyên văn.') + '</span>' +
      '<span class="tags">' + u.nhoms.map((n) => '<span class="tag">Nhóm ' + n + '</span>').join('') +
      u.sanPham.map((s) => '<span class="tag">SP ' + esc(s) + '</span>').join('') + '</span>' +
      '</summary><div class="body">' + evTable(u.evidence) + '</div></details>').join('');
  }
  return h;
}

function veCau() {
  const k = q.trim().toLowerCase();
  const ds = D.needs.filter((n) => !k || n.tim.includes(k));
  return '<section class="card find"><div class="row"><span class="lab">Tra cứu</span>' +
    '<input type="search" id="q" placeholder="Gõ tên sản phẩm chiến lược..." value="' + esc(q.trim()) + '"></div>' +
    '<p class="count">' + ds.length + ' / ' + D.needs.length + ' sản phẩm chiến lược</p></section>' +
    '<section class="card"><table><thead><tr><th>Mã</th><th>Sản phẩm chiến lược</th><th>Cấp nguồn</th><th>Nguồn</th></tr></thead><tbody>' +
    ds.map((n) => '<tr><td class="fld">' + esc(n.id.replace('san_pham_', 'SP ')) + '</td><td>' + esc(n.value) +
      (n.chinhThuc ? '' : ' <span class="tag" title="Chưa có bản chữ chính thức, đang dùng bản báo thuật lại">wording báo</span>') +
      '</td><td><span class="' + tierCls(n.tier) + '">Tier ' + n.tier + '</span></td>' +
      '<td><span class="src" data-h="' + esc(n.href) + '" data-s="' + esc(n.span) + '">' + esc(n.source) + '</span></td></tr>').join('') +
    '</tbody></table>' + (ds.length ? '' : '<p class="note">Không sản phẩm nào khớp từ khoá.</p>') + '</section>';
}

function khoiBangChung(nhan, ds) {
  return '<div style="margin-top:16px"><div class="lab">' + esc(nhan) + '</div>' +
    (ds.length ? ds.map((e) => '<blockquote class="q">' + toDiem(e.span, e.value) + '</blockquote>' +
      '<div class="qc"><span class="' + tierCls(e.tier) + '">Tier ' + e.tier + '</span>' +
      '<span class="src" data-h="' + esc(e.href) + '" data-s="' + esc(e.span) + '">' + esc(e.source) + '</span>' +
      '<span class="fld">' + esc(e.field) + '</span>' +
      (e.extraction !== 'verbatim' ? '<span class="tag">' + esc(e.extraction) + '</span>' : '') + '</div>').join('')
      : '<p class="note">Không có fact nào. Đây là bất thường và cần soi lại.</p>') + '</div>';
}

function veMatch() {
  const ds = D.matches;
  const c = ds[Math.min(sel, ds.length - 1)];
  const thang = (s) => s >= 0.75 ? 'Khớp mạnh' : s >= 0.6 ? 'Khớp khá' : s >= 0.5 ? 'Khớp vừa' : 'Khớp yếu';
  return '<div class="m3"><section>' +
    ds.map((m, i) => '<button class="mrow" data-i="' + i + '" aria-pressed="' + (c && c.id === m.id) + '">' +
      '<span class="sc">' + Math.round(m.score * 100) + '</span>' +
      '<span><span class="mt">' + esc(tenCau(m.demandId)) + ' ⇄ ' + esc(m.supplyId) + '</span><br>' +
      '<span class="mw">Neo nhóm ' + m.nhomCau + ' ∩ ' + (m.nhomCung.join(', ') || 'không') +
      (m.tokenGiao.length ? ' · giao chữ: ' + esc(m.tokenGiao.join(', ')) : '') + '</span></span>' +
      '<span class="tag k">' + thang(m.score) + ' · ĐÃ KÝ</span></button>').join('') +
    '</section><aside>' +
    (c ? '<section class="card"><div class="row" style="justify-content:space-between"><span class="lab">Chuỗi bằng chứng</span><span class="fld">' + esc(c.id) + '</span></div>' +
      khoiBangChung('Bên CẦU · nhu cầu quốc gia', c.demandEvidence) +
      khoiBangChung('Bên CUNG · ' + c.supplyId, c.supplyEvidence) +
      '<div style="margin-top:16px"><div class="lab">Chữ ký người gác cổng</div>' +
      '<table><tbody>' +
      '<tr><td class="fld">Người ký</td><td>' + esc(c.signoff.by) + '</td></tr>' +
      '<tr><td class="fld">Vai</td><td>' + esc(c.signoff.role) + '</td></tr>' +
      '<tr><td class="fld">Ngày</td><td>' + esc(c.signoff.date) + '</td></tr>' +
      '<tr><td class="fld">Khoá bằng chứng</td><td class="fld" title="Băm của tập câu làm bằng lúc ký. Đổi một chữ là chữ ký rụng.">' + esc(c.khoaBangChung || 'chưa đóng khoá') + '</td></tr>' +
      '<tr><td class="fld">Engine</td><td class="fld">' + esc(c.engine) + '</td></tr>' +
      '</tbody></table></div>' +
      '<p class="note">Chữ ký chỉ sinh ra từ lệnh sign của engine, ghi vào sổ có khoá nội dung và khoá bằng chứng. Trang này chỉ đọc và hiện lại, không tạo được chữ ký.</p></section>' : '') +
    (D.rejected.length ? '<section class="card"><div class="lab">Đã từ chối</div>' +
      D.rejected.map((r) => '<p class="emp" style="margin:8px 0 0"><b>' + esc(tenCau(r.demandId)) + ' ⇄ ' + esc(r.supplyId) + '</b><br>' +
        '<span class="mw">' + esc(r.lyDo) + '</span><br><span class="mw">' + esc(r.by) + ' · ' + esc(r.date) + '</span></p>').join('') +
      '<p class="note">Cặp đã từ chối bị chặn ở tầng engine, dưới mọi quy tắc so khớp. Một quy tắc mới làm nó quay lại thì cổng nổ chứ không im lặng cho qua.</p></section>' : '') +
    '</aside></div>';
}

function ve() {
  const tt = { cung: 'Bên CUNG', cau: 'Bên CẦU', match: 'Match đã ký' }[tab];
  document.getElementById('tt').textContent = tt;
  document.getElementById('ts').textContent = tab === 'match'
    ? D.mmeta.daKy + ' match ký bởi ' + D.mmeta.nguoiKy + ' · quy tắc ' + D.mmeta.rule
    : 'Mỗi ô truy về một câu nguyên văn. Bấm tên nguồn để mở bản chụp và xem đúng câu làm bằng.';
  document.getElementById('kp').innerHTML = (tab === 'match'
    ? [[D.mmeta.daKy, 'đã ký'], [D.mmeta.tuChoi, 'từ chối'], [D.mmeta.tongChay, 'chạy ra']]
    : [[D.meta.units, 'đơn vị'], [D.meta.claims, 'evidence'], [D.meta.needs, 'nhu cầu'], [D.meta.tierA, 'tier A'], [D.meta.snapshots, 'bản chụp']]
  ).map(([v, k]) => '<div class="kpi"><div class="v">' + v + '</div><div class="k">' + k + '</div></div>').join('');
  document.getElementById('app').innerHTML = tab === 'cung' ? veCung() : tab === 'cau' ? veCau() : veMatch();
  const qi = document.getElementById('q');
  if (qi) {
    qi.addEventListener('input', (e) => { q = e.target.value; ve(); });
    if (q) { qi.focus(); qi.setSelectionRange(q.length, q.length); }
  }
  const xoa = document.getElementById('xoa');
  if (xoa) xoa.onclick = () => { q = ''; nhom = 'tat-ca'; tier = 'tat-ca'; ve(); };
  document.querySelectorAll('[data-nhom]').forEach((b) => b.onclick = () => { nhom = b.dataset.nhom; ve(); });
  document.querySelectorAll('[data-tier]').forEach((b) => b.onclick = () => { tier = b.dataset.tier; ve(); });
  document.querySelectorAll('[data-i]').forEach((b) => b.onclick = () => { sel = +b.dataset.i; ve(); });
}

document.querySelectorAll('[data-tab]').forEach((b) => b.onclick = () => {
  tab = b.dataset.tab; q = '';
  document.querySelectorAll('[data-tab]').forEach((x) => x.setAttribute('aria-current', String(x === b)));
  ve();
});
ve();
</script>
</body>
</html>
`;

writeFileSync(RA, html, 'utf8');
const kb = (Buffer.byteLength(html) / 1024).toFixed(0);
console.log(`TRA CUU: ${RA}`);
console.log(`  ${meta.units} don vi · ${meta.claims} evidence · ${meta.needs} nhu cau · ${mmeta.daKy} match da ky`);
console.log(`  ${Object.keys(banChup).length} ban chup nhung san · ${kb} KB · mo bang cach nhap dup, khong can may chu`);
