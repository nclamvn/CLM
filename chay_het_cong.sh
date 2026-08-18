#!/usr/bin/env bash
# chay_het_cong.sh · Chay TOAN BO chuoi cong cua CaoLocMatch trong mot lenh.
#
# VI SAO CO (18/08/2026): chuoi cong nay co 11 buoc nam o hai kho khac nhau. Muon biet he
# con xanh hay khong phai go 11 lenh va tu nho thu tu. Chinh vi ruom ma hai vong lien tiep
# bo sot buoc chep ban chup, va mot vong khac in ra ban PDF ghi "1 vi pham" trong khi so
# that la 26. Mot cong chi dang tin khi no re toi muc khong ai muon bo qua.
#
# BA LUAT CUA BAN THAN CAI SCRIPT NAY:
#   1. Cong KHONG CHAY DUOC thi KHONG duoc tinh la xanh. Vang tin khac han tin tot.
#   2. Exit khac 0 neu co bat ky o nao khong xanh, ke ca o "khong chay duoc".
#   3. In het bang roi moi thoat. Dung o cong do dau tien se giau tinh trang cac cong sau.
#
# Dung:
#   ./chay_het_cong.sh          chay het, in bang
#   ./chay_het_cong.sh --nhanh  bo qua ba bo rang (nhanh hon, nhung YEU hon)
#   ./chay_het_cong.sh --im     chi in bang, khong in chi tiet cong do
#
# Exit 0 neu tat ca xanh. Exit 1 neu co o khong xanh. Exit 3 neu khong tim thay kho.

set -u

NHANH=0; IM=0
for a in "$@"; do
  case "$a" in
    --nhanh) NHANH=1 ;;
    --im)    IM=1 ;;
    -h|--help) sed -n '2,20p' "$0"; exit 0 ;;
    *) echo "Khong hieu tham so: $a"; exit 3 ;;
  esac
done

# ── Duong dan chay duoc o CA HAI moi truong ─────────────────────────────────
# Claude Code tren may thay /Users/os/..., bash trong Cowork thay /sessions/<phien>/mnt/...
# Cung mot dia, hai goc. Neo cung mot goc thi moi truong kia gay o cho kho doan.
# BAN LAM VIEC TAM: bien moi truong CLM_KHO_* de tro toi mot BAN SAO cua kho.
# Vi sao: cac bo rang phai tiem loi that vao du lieu roi xem cong co no khong. Truoc
# 18/08/2026 chung tiem thang vao kho that va tra lai sau. Tra dung, nhung trong vai giay
# do file NGUOI DUNG CAM mang du lieu hong. Nay rang dung ban sao, kho that khong bi cham.
tim_kho() {
  case "$1" in
    CNCLData)    [ -n "${CLM_KHO_CNCL:-}" ]  && { echo "$CLM_KHO_CNCL"; return 0; } ;;
    CaoLocMatch) [ -n "${CLM_KHO_MATCH:-}" ] && { echo "$CLM_KHO_MATCH"; return 0; } ;;
    .touch)      [ -n "${CLM_KHO_TOUCH:-}" ] && { echo "$CLM_KHO_TOUCH"; return 0; } ;;
  esac
  for g in /Users/os /sessions/*/mnt; do
    [ -d "$g/$1" ] && { echo "$g/$1"; return 0; }
  done
  return 1
}
CNCL=$(tim_kho CNCLData)    || { echo "KHONG THAY kho CNCLData o ca hai goc."; exit 3; }
CLM=$(tim_kho CaoLocMatch)  || { echo "KHONG THAY kho CaoLocMatch o ca hai goc."; exit 3; }

XANH=0; DO=0; TREO=0
DONG=""; CHI_TIET=""

# chay <kho_nhan> <ten_cong> <thu_muc> <loc_ghi_chu> <lenh...>
# loc_ghi_chu la bieu thuc grep de rut MOT dong tom tat tu output; de rong thi khong rut.
chay() {
  local kho="$1" ten="$2" cwd="$3" loc="$4"; shift 4
  local out rc ghi trang_thai
  out=$(cd "$cwd" && "$@" 2>&1); rc=$?
  if [ -n "$loc" ]; then
    ghi=$(printf '%s\n' "$out" | grep -E "$loc" | tail -1 | cut -c1-46)
  else
    ghi=""
  fi
  case "$rc" in
    0) trang_thai="XANH";        XANH=$((XANH+1)) ;;
    3) trang_thai="KHONG CHAY";  TREO=$((TREO+1)) ;;
    *) trang_thai="DO";          DO=$((DO+1)) ;;
  esac
  DONG="${DONG}$(printf '%-12s %-26s %-11s %s' "$kho" "$ten" "$trang_thai" "$ghi")
"
  if [ "$rc" -ne 0 ] && [ "$IM" -eq 0 ]; then
    CHI_TIET="${CHI_TIET}
--- $kho / $ten (exit $rc) ---
$(printf '%s\n' "$out" | tail -12)
"
  fi
}

# ── Kho nguon: registry da qua cong ─────────────────────────────────────────
chay CNCLData refinery            "$CNCL" 'VALIDATION|GATE'      python3 methodbox/refinery.py domains/don_vi_cncl
chay CNCLData bites               "$CNCL" 'BITE SUITE'           python3 methodbox/bites.py domains/don_vi_cncl
chay CNCLData check_luat3         "$CNCL" 'OK:|VI PHAM'          python3 check_luat3.py domains/don_vi_cncl
chay CNCLData check_dash          "$CNCL" 'OK:|em-dash'          python3 check_dash.py domains/don_vi_cncl
chay CNCLData doi_chung_nguon     "$CNCL" 'cau khop'             python3 check_snapshot_fidelity.py domains/don_vi_cncl --fresh .fidelity_fresh
# Do tuoi nguon. Cong nay se DO cho toi khi 44 claim mau-hong con lai duoc cao lai hoac
# duoc nguoi ghi ly do giu nguon cu. Do la trang thai DUNG: registry that su dang cu o day,
# va mot bang bao xanh trong khi 44 claim dua tren bai 2019-2025 thi la bang noi doi.
chay CNCLData do_tuoi_nguon       "$CNCL" 'mau hong qua han'     python3 check_do_tuoi.py domains/don_vi_cncl

# ── Kho dan xuat: dung domain, chay match, doi chieu so chu ky ──────────────
chay CaoLocMatch build_dan_xuat   "$CLM" 'OK:|FAIL:'             python3 build_cncl_match.py
chay CaoLocMatch refinery         "$CLM" 'VALIDATION|GATE'       python3 methodbox/refinery.py domains/cncl_match
chay CaoLocMatch match_run        "$CLM" 'digest_matches'        python3 match_engine.py run domains/cncl_match
chay CaoLocMatch restore_signoff  "$CLM" 'RESTORE|BANG CHUNG'    python3 match_engine.py restore-signoff domains/cncl_match out/matches.jsonl
chay CaoLocMatch validate_ky      "$CLM" 'VALIDATE|GATE'         python3 match_engine.py validate domains/cncl_match out/matches.jsonl --require-signoff

# ── Web: so tren trang phai la so sinh tu registry, khong go tay ────────────
# Bo sinh la mot cong chu khong phai tien ich: no FAIL khi thieu ban chup goc, va no la
# thu duy nhat duoc phep viet lib/cncl-*.ts. Chay no o day de bang trang thai bat duoc
# chuyen "web lech so voi registry" ngay khi no vua xay ra.
TOUCH=$(tim_kho .touch || true)
if [ -n "${TOUCH:-}" ] && [ -f "$TOUCH/scripts/gen-cncl-data.mjs" ]; then
  chay .touch      sinh_du_lieu_web "$TOUCH" 'REGISTRY:|FAIL:'   node scripts/gen-cncl-data.mjs
  # File tra cuu doc dau ra cua buoc tren, nen phai chay SAU. Dung o day thi moi lan
  # registry doi, ban tra cuu nguoi dung mo duoc dung lai trong cung mot luot, khong bao
  # gio lech voi du lieu that.
  chay .touch      sinh_tra_cuu     "$TOUCH" 'TRA CUU:|FAIL:'    node scripts/gen-tracuu-html.mjs
  chay .touch      cong_em_dash     "$TOUCH" 'OK:|FAIL:'         node scripts/check-emdash.mjs
  if [ "$NHANH" -eq 0 ]; then
    chay .touch    rang_tra_cuu     "$TOUCH" 'BITE TRA CUU'      node scripts/bite_tracuu.mjs
  fi
fi

# ── Ba bo rang: cong nao cung phai tu chung minh no con can ─────────────────
if [ "$NHANH" -eq 0 ]; then
  chay CaoLocMatch rang_match       "$CLM" 'MATCH BITES'         python3 match_bites.py
  chay CaoLocMatch rang_bang_chung  "$CLM" 'BITE KHOA'           python3 bite_bang_chung.py
  chay CaoLocMatch rang_dong_bo     "$CLM" 'BITE DONG BO'        python3 bite_dong_bo_snapshot.py
  # Rang cua CHINH cai bang nay. Khong de quy vo han: no goi lai script voi --nhanh,
  # ma --nhanh bo qua toan bo khoi rang, nen chi sau dung mot tang.
  chay CaoLocMatch rang_chinh_bang  "$CLM" 'BITE CHAY HET'       python3 bite_chay_het_cong.py
fi

# ── Bang ────────────────────────────────────────────────────────────────────
TONG=$((XANH+DO+TREO))
echo
echo "CAOLOCMATCH · CHUOI CONG · $(date '+%d/%m/%Y %H:%M')"
[ "$NHANH" -eq 1 ] && echo "che do --nhanh: DA BO QUA ba bo rang, ket qua nay YEU hon ban day du"
echo
printf '%-12s %-26s %-11s %s\n' "KHO" "CONG" "KET QUA" "GHI CHU"
printf '%s\n' "------------------------------------------------------------------------------"
printf '%s' "$DONG"
printf '%s\n' "------------------------------------------------------------------------------"
printf 'tong %d · xanh %d · do %d · khong chay duoc %d\n' "$TONG" "$XANH" "$DO" "$TREO"
echo

if [ "$DO" -eq 0 ] && [ "$TREO" -eq 0 ]; then
  echo "TAT CA XANH."
  exit 0
fi

[ "$IM" -eq 0 ] && printf '%s\n' "$CHI_TIET"
if [ "$TREO" -gt 0 ]; then
  echo "CO CONG KHONG CHAY DUOC. Vang tin khong phai tin tot, o do KHONG duoc tinh la xanh."
fi
[ "$DO" -gt 0 ] && echo "CO CONG DO. Khong duoc trinh ket qua ra ngoai truoc khi xu ly."
exit 1
