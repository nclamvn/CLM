#!/usr/bin/env bash
# chup_man.sh · Dung server, chup hai man dashboard, tat server. Chay tren MAY THAT.
#
# VI SAO CO (24/08/2026): moi truong bash cua Claude la mot may Linux rieng, mang cua no
# khong toi duoc may nay, va no thieu thu vien he thong nen Playwright khong chay duoc o do.
# Ket qua: khau soi bo cuc bang mat la khau duy nhat trong ca chuoi khong tu dong hoa duoc.
#
# Script nay thu gon khau do con MOT lenh dan. Khong phai go tung buoc, khong phai nho port,
# khong phai nho tat server. Anh Lam dan mot dong, may tu lam phan con lai va in ra duong dan
# hai file anh.
#
# Chay: bash scripts/chup_man.sh
# Anh ra: reports/man-registry.png va reports/man-matching.png

set -u
cd "$(dirname "$0")/.." || exit 3

echo "1/4 · sinh lai du lieu tu registry"
node scripts/gen-cncl-data.mjs || { echo "DUNG: sinh du lieu that bai"; exit 2; }

echo "2/4 · build"
npm run build >/tmp/chup-build.log 2>&1 || { echo "DUNG: build that bai, xem /tmp/chup-build.log"; tail -20 /tmp/chup-build.log; exit 2; }

# Cong con trong. Xin he dieu hanh mot cong bat ky roi tra lai ngay, tranh dung cung 3000
# hay 3100 von hay ban tren may nay.
P=$(node -e 'const s=require("net").createServer();s.listen(0,"127.0.0.1",()=>{console.log(s.address().port);s.close()})')
echo "3/4 · chay server o cong $P"
npx next start -p "$P" >/tmp/chup-server.log 2>&1 &
SV=$!
# Doi that su san sang, khong doi bang sleep mu.
for i in $(seq 1 40); do
  curl -s -o /dev/null "http://localhost:$P/dashboard/registry" && break
  sleep 0.5
done
if ! curl -s -o /dev/null "http://localhost:$P/dashboard/registry"; then
  echo "DUNG: server khong len sau 20 giay, xem /tmp/chup-server.log"; kill $SV 2>/dev/null; exit 2
fi

echo "4/4 · chup"
mkdir -p reports
RC=0
node scripts/shot.mjs "http://localhost:$P/dashboard/registry" reports/man-registry.png || RC=2
node scripts/shot.mjs "http://localhost:$P/dashboard/matching" reports/man-matching.png || RC=2
kill $SV 2>/dev/null
wait $SV 2>/dev/null

if [ "$RC" -ne 0 ]; then
  echo "CHUP THAT BAI. Neu bao thieu trinh duyet thi chay: npx playwright install chromium"
  exit 2
fi
echo
echo "XONG. Hai anh o:"
echo "  $(pwd)/reports/man-registry.png"
echo "  $(pwd)/reports/man-matching.png"
echo
echo "Link neu muon tu xem lai (chay lai server): npx next start -p $P"
