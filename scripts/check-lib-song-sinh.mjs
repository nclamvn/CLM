/**
 * check-lib-song-sinh.mjs · Cong canh HAI BAN SONG SINH cua du lieu sinh ra luon khop.
 *
 * VI SAO CO (25/08/2026): tu 25/08 cac cong doc `lib/*.json` thay vi boc mang ra khoi
 * `lib/*.ts` bang regex. Do la buoc go nguyen nhan dung, nhung no de ra mot rui ro moi:
 * hai file cung mo ta mot su that, va chung co the LECH NHAU.
 *
 * Lech kieu nao cung te, va co mot kieu te dac biet: ban .json dung, ban .ts cu. Khi do moi
 * cong deu XANH vi cong doc .json, con trang web nguoi dung nhin thi doc .ts, tuc web hien
 * du lieu cu ma bang trang thai bao sach. Dung dang loi ma ca ngay hom nay di sua: mot phep
 * kiem nhin vao mot lat cat roi duoc doc nhu the no nhin toan canh.
 *
 * LUAT: noi dung JSON nhung trong ban .ts phai TRUNG TUNG KY TU voi ban .json.
 * Ca hai deu do gen-cncl-data.mjs sinh ra trong cung mot lan chay, nen trung tuyet doi la
 * yeu cau hop ly, khong phai kho tinh.
 *
 * Chay: node scripts/check-lib-song-sinh.mjs
 * Exit 0 khop · 2 lech · 3 KHONG CHAY DUOC.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const env = (t) => (process.env[t] || '').trim() || null;
const TOUCH = env('CLM_KHO_TOUCH') || dirname(dirname(fileURLToPath(import.meta.url)));
const LIB = join(TOUCH, 'lib');

const thoat = (ma, ...d) => { console.log(...d); process.exit(ma); };

// [ten file json, ten file ts, [khoa json -> ten bien export trong ts]]
const CAP = [
  ['cncl-registry.json', 'cncl-registry.ts', { meta: 'cnclMeta', units: 'cnclUnits', needs: 'cnclNeeds' }],
  ['cncl-match.json', 'cncl-match.ts', { matchMeta: 'matchMeta', signedMatches: 'signedMatches', rejectedPairs: 'rejectedPairs' }],
];

let lech = 0, khop = 0;
for (const [tenJson, tenTs, banDo] of CAP) {
  const pj = join(LIB, tenJson), pt = join(LIB, tenTs);
  if (!existsSync(pj) || !existsSync(pt)) {
    thoat(3, `KHONG CHAY DUOC: thieu lib/${tenJson} hoac lib/${tenTs}. Chay gen-cncl-data.mjs.`);
  }
  let doc;
  try { doc = JSON.parse(readFileSync(pj, 'utf8')); }
  catch (e) { thoat(3, `KHONG CHAY DUOC: lib/${tenJson} khong parse duoc: ${e.message}`); }
  const ts = readFileSync(pt, 'utf8');
  for (const [khoa, bien] of Object.entries(banDo)) {
    if (!(khoa in doc)) { console.log(`  LECH: lib/${tenJson} thieu khoa '${khoa}'`); lech++; continue; }
    // Ban .ts nhung JSON.stringify(x, null, 2) nguyen xi, nen chuoi do phai co mat tung ky tu.
    const mong = JSON.stringify(doc[khoa], null, 2);
    if (ts.includes(mong)) { khop++; continue; }
    console.log(`  LECH: '${bien}' trong lib/${tenTs} khong trung noi dung khoa '${khoa}' cua lib/${tenJson}`);
    lech++;
  }
}

console.log(`cap song sinh: ${CAP.length} · khoa khop: ${khop} · khoa lech: ${lech}`);
if (lech) {
  console.log('\nFAIL: hai ban song sinh da lech. Chay lai node scripts/gen-cncl-data.mjs.');
  console.log('Lech nguy nhat la .json dung ma .ts cu: cong doc .json nen bao XANH, con trang');
  console.log('web nguoi dung nhin thi doc .ts, tuc web hien du lieu cu ma bang bao sach.');
  process.exit(2);
}
console.log('\nOK: ban .json va ban .ts trung tung ky tu.');
