#!/usr/bin/env bash
#
# day-len-github.sh · Day kho CLM len mot repo GitHub RIENG TU, co cong chan truoc.
#
# VI SAO CO COng CHAN: day len la MOT CHIEU voi lich su. Mot bi mat lot vao thi phai thu hoi
# bi mat chu khong sua duoc bang mot commit. Va kho nay chua BAN CHUP NGUYEN VAN cua nhieu bai
# bao, thu chi hop ly khi kho o che do rieng tu.
#
# Dung:
#   bash day-len-github.sh git@github.com:<ten-tai-khoan>/CLM.git
#   bash day-len-github.sh https://github.com/<ten-tai-khoan>/CLM.git
#
# Script KHONG tao repo tren GitHub. Tao repo la viec cua nguoi, tren github.com/new:
#   ten CLM · che do Private · KHONG tich README, .gitignore hay license
# Tich bat ky o nao trong ba o do se tao mot commit dau khac, va lan day dau se bi tu choi.
#
set -uo pipefail

URL="${1:-}"
KHO=$(cd "$(dirname "$0")/.." && pwd)
NHANH="main"

thoat() { echo; echo "DUNG LAI: $*"; exit 1; }

[ -n "$URL" ] || thoat "chua dua dia chi repo.
       Vi du: bash day-len-github.sh git@github.com:<tai-khoan>/CLM.git"

cd "$KHO" || thoat "khong vao duoc $KHO"

echo "== 1. Kiem kho ==============================================================="
echo "  kho        : $KHO"
b=$(git rev-parse --abbrev-ref HEAD)
echo "  nhanh      : $b"
[ "$b" = "$NHANH" ] || thoat "dang o nhanh '$b', script nay chi day nhanh '$NHANH'."
n=$(git status --porcelain | wc -l | tr -d ' ')
echo "  ban nhap   : $n file"
[ "$n" = "0" ] || thoat "con $n file chua commit. Commit hoac stash truoc da."
echo "  commit     : $(git rev-list --count HEAD)"
echo "  HEAD       : $(git rev-parse --short HEAD)"
echo "  kich thuoc : $(git count-objects -vH | awk '/size-pack/{print $2, $3}')"

echo
echo "== 2. Cong chan bi mat ======================================================="
# Chay cong that, khong chep lai luat vao day. Mot ban sao luat la mot ban sao se lac.
if ! python3 "$KHO/CaoLocMatch/check_bi_mat.py"; then
  thoat "cong bi mat khong xanh. KHONG day len khi chua xu ly xong."
fi

echo
echo "== 3. Thu se roi khoi may nay ================================================"
printf '  %s\n' "$(git ls-files | wc -l | tr -d ' ') file duoc theo doi, gom:"
git ls-files | awk -F/ '{print $1}' | sort | uniq -c | sort -rn | head -8 | sed 's/^/    /'
echo
echo "  Trong so do co BAN CHUP NGUYEN VAN cua cac bai bao va trang web nguon."
echo "  Chung la bang chung cua registry nen phai giu nguyen van, nhung nguyen van tuc la"
echo "  toan bo bai viet cua nguoi khac. Dieu do chap nhan duoc trong mot kho RIENG TU."
echo
printf "  Repo vua tao tren GitHub co dung la Private khong? Go 'rieng-tu' de tiep: "
read -r tra_loi
[ "$tra_loi" = "rieng-tu" ] || thoat "chua xac nhan repo o che do rieng tu."

echo
echo "== 4. Noi remote ============================================================="
cu=$(git remote get-url origin 2>/dev/null)
if [ -n "$cu" ]; then
  if [ "$cu" = "$URL" ]; then
    echo "  origin da tro dung dia chi nay roi."
  else
    thoat "origin dang tro toi '$cu', khac dia chi ban dua.
       Doi y thi tu go: git remote set-url origin '$URL'"
  fi
else
  git remote add origin "$URL" && echo "  da them origin -> $URL"
fi

echo "  Kiem repo co that va co vao duoc khong..."
# LAY MA THOAT TRUOC ROI MOI XET. Viet `if ! cmd; then ma=$?` la sai: trong nhanh then, $?
# la ma cua phep phu dinh (luon 0), khong phai ma cua cmd. Bay quen thuoc cua bash.
git ls-remote --exit-code -h "$URL" >/dev/null 2>&1; ma=$?
if [ "$ma" -ne 0 ]; then
  if [ "$ma" -eq 2 ]; then
    echo "  repo co that nhung con trong (chua nhanh nao). Dung nhu mong doi."
  else
    thoat "khong vao duoc '$URL'.
       Hai kha nang: repo chua duoc tao, hoac may nay chua co quyen day len.
       Voi dia chi git@... thi thu:  ssh -T git@github.com
       Voi dia chi https://... thi may se hoi thong tin dang nhap luc day."
  fi
fi

echo
echo "== 5. Day ===================================================================="
git push -u origin "$NHANH" || thoat "day that bai. Xem thong bao cua git ben tren."

echo
echo "== 6. Doi chieu, khong tin loi bao 'da day' =================================="
# Loi bao thanh cong cua git la mot loi khai. Doi chieu SHA tren may voi SHA tren remote moi
# la bang chung. Hai so khac nhau thi lan day chua tron ven du git khong ke gi.
tren_may=$(git rev-parse HEAD)
tren_remote=$(git ls-remote origin "refs/heads/$NHANH" | awk '{print $1}')
echo "  tren may    : ${tren_may:0:12}"
echo "  tren remote : ${tren_remote:0:12}"
[ "$tren_may" = "$tren_remote" ] || thoat "hai SHA khac nhau. Lan day chua tron ven."

echo
echo "=============================================================================="
echo "DA DAY XONG VA DOI CHIEU KHOP: $URL"
echo
echo "Buoc ke: mo tab Actions tren GitHub. Chuoi cong se tu chay va phai ra"
echo "  38 xanh · 0 do · 3 hoan"
echo "Ba o hoan phai duoc in ra kem ly do o cuoi log. Khong thay muc do la co gi sai."
echo
echo "DIEM DUNG: van KHONG xoa bon kho cu truoc 01/10/2026."
