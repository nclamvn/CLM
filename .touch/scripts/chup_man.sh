#!/usr/bin/env bash
# chup_man.sh · Dung server, chup hai man dashboard, tat server. Chay tren MAY THAT.
#
# VI SAO CO (24/08/2026): thu gon khau chup con MOT lenh dan. Khong phai go tung buoc, khong
# phai nho port, khong phai nho tat server. Dan mot dong, may lam phan con lai va in ra duong
# dan hai file anh.
#
# SUA MOT CAU SAI CUA CHINH FILE NAY (chieu 24/08/2026). Ban dau o day viet: "moi truong bash
# cua Claude thieu thu vien he thong nen Playwright khong chay duoc o do, nen khau soi bo cuc
# bang mat la khau duy nhat khong tu dong hoa duoc". Cau do SAI, va no sai theo kieu nguy
# nhat: mot gia dinh chua thu bao gio, viet vao file duoi dang su that, roi dung lam ly do de
# khong lam.
#
# Thu that thi thieu DUNG MOT thu vien, libXdamage.so.1. Tai goi .deb bang apt-get download,
# giai nen vao thu muc rieng, tro LD_LIBRARY_PATH vao do, la Chromium chay. Toan bo chuoi
# build, dung server, chup hai man, so anh voi moc DEU chay duoc trong moi truong Linux do.
#
# Chi con MOT khau that su can nguoi: NHIN CAI ANH. May chup duoc, may so duoc phan tram diem
# khac, nhung "trang nay co coi duoc khong" thi van la mat nguoi.
#
# CAI GIA PHAI TRA, ghi ra cho khoi tuong bo: moi truong Linux do la EPHEMERAL. Ngay trong
# cung mot buoi lam viec, thu muc ~/.cache/ms-playwright bi don sach mot lan giua chung, va
# lenh chup gay voi "Executable doesn't exist". Nen o do phai dung lai canh moi phien:
#   node node_modules/playwright-core/cli.js install chromium     # dung ban CUA REPO, khong
#                                                                 # phai playwright@latest
#   apt-get download libxdamage1 && dpkg-deb -x ... && export LD_LIBRARY_PATH=...
# Script NAY thi khong can gi ca, vi may that co san Chromium. Do la ly do van giu no.
#
# Chay: bash scripts/chup_man.sh
# Anh ra: mot file .png cho MOI khung hinh khai trong scripts/moc_anh.json,
#         cong reports/phu_moc.json ghi lai don vi nao that su nam trong khung.

set -u
cd "$(dirname "$0")/.." || exit 3

echo "1/5 · sinh lai du lieu tu registry"
node scripts/gen-cncl-data.mjs || { echo "DUNG: sinh du lieu that bai"; exit 2; }

echo "2/5 · build"
npm run build >/tmp/chup-build.log 2>&1 || { echo "DUNG: build that bai, xem /tmp/chup-build.log"; tail -20 /tmp/chup-build.log; exit 2; }

# Cong con trong. Xin he dieu hanh mot cong bat ky roi tra lai ngay, tranh dung cung 3000
# hay 3100 von hay ban tren may nay.
P=$(node -e 'const s=require("net").createServer();s.listen(0,"127.0.0.1",()=>{console.log(s.address().port);s.close()})')
echo "3/5 · chay server o cong $P"
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

echo "4/5 · chup va do vung phu"
mkdir -p reports
RC=0
if [ "${1:-}" = "--chot-moc" ]; then
  node scripts/chup_va_do.mjs "http://localhost:$P" --chot || RC=2
else
  node scripts/chup_va_do.mjs "http://localhost:$P" || RC=2
fi
# 4b · kiem chuan truy cap tren cung may chu (01/10/2026). Ghi reports/truy_cap.json kem van tay giao
# dien; cong check-truy-cap.mjs trong chuoi doc file nay.
echo "4b · kiem chuan truy cap (axe-core) tren moi trang"
node scripts/kiem-truy-cap.mjs "http://localhost:$P" || echo "CO VI PHAM TRUY CAP, xem reports/truy_cap.json"
kill $SV 2>/dev/null
wait $SV 2>/dev/null

if [ "$RC" -ne 0 ]; then
  echo "CHUP THAT BAI. Neu bao thieu trinh duyet thi chay:"
  echo "  node node_modules/playwright-core/cli.js install chromium"
  exit 2
fi

if [ "${1:-}" = "--chot-moc" ]; then
  echo
  echo "Da chot moc moi cho moi khung hinh. Nho chot lai ngan sach vung phu neu no doi:"
  node scripts/check-phu-moc.mjs
  exit 0
fi

# 5/5 · SO VOI ANH MOC. Vi sao co buoc nay: ba lan lien tiep loi bo cuc chi lo khi nhin anh,
# va lan thu ba chinh ban sua de ra loi moi. Mat nguoi van la cong cuoi, nhung buoc nay thu
# hep cho phai nhin tu ca trang xuong dung vung vua doi.
#
# VA MOT CANH BAO da phai tra gia moi biet: "TRUNG MOC tuyet doi" KHONG co nghia la trang
# khong doi. No chi co nghia la phan NAM TRONG KHUNG HINH khong doi. Ngay 24/08/2026 mot tag
# moi len 9 the ma phep so van bao 0% diem khac, vi ca 9 the do nam duoi day danh sach. Do la
# ly do buoc 4 bay gio do luon vung phu, va co check-phu-moc.mjs khoa con so do mot chieu.
echo "5/5 · so voi anh moc"
SO=0
for TEN in $(node -e 'const c=require("./scripts/moc_anh.json");console.log(c.khung.map(k=>k.ten).join(" "))'); do
  node scripts/so_anh.mjs "reports/$TEN.png" "reports/moc/$TEN.png" || SO=$?
done
echo
if [ "$SO" -ne 0 ]; then
  echo "CO MAN DOI SO VOI MOC. Doi la binh thuong khi vua sua UI. Nhin dung vung tren roi:"
  echo "  bash scripts/chup_man.sh --chot-moc    # neu dung y, chot lai moc"
  echo
fi
node scripts/check-phu-moc.mjs
echo
echo "XONG. Anh o $(pwd)/reports/ :"
node -e 'const c=require("./scripts/moc_anh.json");for(const k of c.khung)console.log("  "+k.ten+".png  "+k.vi_sao)'
echo
echo "Link neu muon tu xem lai (chay lai server): npx next start -p $P"
