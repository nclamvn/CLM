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
# Bai co tai tro nam tren dung ten mien tier B, dung tac gia, dung dinh dang. Chi mot dong
# chu nho phan biet no voi bao chi doc lap. Ngay 24/08/2026 suyt nap mot bai nhu vay.
chay CNCLData nguon_tai_tro       "$CNCL" 'dau hieu tai tro|VI PHAM' python3 check_tai_tro.py domains/don_vi_cncl
# Tham chieu treo: span tro toi mot thu khong co trong pham vi da chup, kieu 'cac san pham
# nay' ma danh sach lai nam o cau khong duoc chup. Loai loi nay QUA DUOC het cac cong khac:
# span van nguyen van, value van la chuoi con, tier van dung. Chi co nghia la rong.
chay CNCLData tham_chieu_treo     "$CNCL" 'tham chieu treo|ngan sach' python3 check_tham_chieu_treo.py domains/don_vi_cncl
# Doi chieu claim voi chinh luat du dieu kien cua domain. Luat nam trong domain.yaml tu dau
# va da dung de loai MobiFone, nhung khong may nao doi chieu, nen FECON van o lai voi mot
# claim 'van hanh' ma luat xep vao ve khong du dieu kien. Ap luat khong deu la thu khach soi
# ho so se hoi dau tien.
chay CNCLData du_dieu_kien        "$CNCL" 'can tra loi|OK:'     python3 check_du_dieu_kien.py domains/don_vi_cncl
# Khang dinh 'dau tien, duy nhat, lon nhat' la loi moi doi chieu: doi thu chi can chi ra mot
# truong hop som hon la ca ho so mat tin. Cong nay khong doi claim phai dung, no doi PHAM VI
# phai duoc viet ra, vi gan het cac vu choi nhau la do hai ben dung cung mot chu cho hai
# pham vi khac nhau.
chay CNCLData khang_dinh_toi_thuong "$CNCL" 'khang dinh toi thuong|OK:' python3 check_khang_dinh_toi_thuong.py domains/don_vi_cncl
# Cong nay khong phan xu quyet dinh loai hay nap. No bat buoc PHEP SO SANH voi mot don vi
# DA NAP phai duoc viet ra, va ten voi truong trong do phai co that. Sinh ra tu hai ca that
# trong hai ngay: MobiFone so voi FECON, va Dabaco so voi AVAC. Ca hai lan deu lo ra do
# nguoi di kiem lai chu khong do cong bat.
chay CNCLData ap_luat_deu          "$CNCL" 'OK:|FAIL|CHUA DOI CHIEU' python3 check_ap_luat_deu.py domains/don_vi_cncl
# TIP-02. Ho loi thu hai cung tinh chat voi 'doc cau truc bang regex': mot cong bat duoc
# ngoai le roi di tiep nhu khong co gi. Ca that: check-emdash.mjs tung bo qua thu muc khong
# doc duoc, tuc dem em-dash tren mot phan no chua nhin roi bao 0.
chay CNCLData fail_closed          "$CNCL" 'OK:|FAIL|CHUA KHAI' python3 check_fail_closed.py
# TIP-03. Bon lan trong hai ngay mot bo rang gay khong phai vi engine sai ma vi CANH cua no
# bien mat. Cong nay khong doc duoc y nghia khoi CANH, no bat buoc khoi do phai ton tai va
# loi khai phai khop voi ma.
chay CNCLData rang_khai_canh       "$CNCL" 'OK:|FAIL|CHUA KHAI|HONG CU PHAP' python3 check_rang_khai_canh.py

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
  # Tu kiem goc duong dan TRUOC khi sinh. Ngay 24/08/2026 gen-cncl-data.mjs sap tren may
  # anh Lam voi ENOENT scandir '/sessions', vi moi truong nay co /sessions con may that thi
  # khong. Moi moi truong chi co MOT goc, nen nhanh danh cho goc kia khong bao gio chay o
  # day va khong cong nao bat duoc. O nay chay ca hai nhanh bang thu muc gia.
  chay .touch      goc_duong_dan    "$TOUCH" 'TU KIEM GOC'        node scripts/goc.mjs --tu-kiem
  chay .touch      sinh_du_lieu_web "$TOUCH" 'REGISTRY:|FAIL:'   node scripts/gen-cncl-data.mjs
  # File tra cuu doc dau ra cua buoc tren, nen phai chay SAU. Dung o day thi moi lan
  # registry doi, ban tra cuu nguoi dung mo duoc dung lai trong cung mot luot, khong bao
  # gio lech voi du lieu that.
  chay .touch      sinh_tra_cuu     "$TOUCH" 'TRA CUU:|FAIL:'    node scripts/gen-tracuu-html.mjs
  chay .touch      cong_em_dash     "$TOUCH" 'OK:|FAIL:'         node scripts/check-emdash.mjs
  # Cong nay hoi cau ma 25 o con lai KHONG hoi: cai gi trong registry ma trang web bo roi.
  # Moi o khac deu do TINH TOAN VEN DU LIEU. Truong nang_luc_mo_ta_2 nam trong registry tam
  # ngay, du lieu dung tung chu, bang trang thai xanh het, va the tren web van ke thieu mot
  # nua nang luc cua FECON. Phai chay SAU sinh_du_lieu_web vi no doc dau ra cua buoc do.
  chay .touch      truong_hien      "$TOUCH" 'OK:|FAIL|CHUA KHAI' node scripts/check-truong-hien.mjs
  # Hai ban song sinh .json va .ts phai trung tung ky tu. Lech nguy nhat la .json dung ma
  # .ts cu: cong doc .json nen bao XANH, con trang web nguoi dung nhin thi doc .ts.
  chay .touch      lib_song_sinh    "$TOUCH" 'OK:|FAIL|LECH'   node scripts/check-lib-song-sinh.mjs
  # TIP-01. Cong lib_song_sinh chung minh phan THAN JSON khop, nhung phan VO TypeScript
  # thi chua ai kiem. Mot file .ts hong cu phap ma JSON van khop se qua duoc ca 32 o, va
  # chi lo ra vao lan chup anh ke tiep, tuc co the vai ngay sau khi hong.
  chay .touch      bien_dich_ts     "$TOUCH" 'OK:|FAIL|KHONG CHAY' node scripts/check-bien-dich.mjs
  # Do VUNG PHU cua anh moc. O nay khong can trinh duyet: no doc reports/phu_moc.json do
  # scripts/chup_man.sh sinh ra. Neu registry doi ke tu lan chup cuoi thi van tay lech va o
  # nay bao KHONG CHAY DUOC chu khong bao XANH: con so cu khong dung de ket luan duoc.
  chay .touch      phu_moc          "$TOUCH" 'vung phu|FAIL|KHONG CHAY' node scripts/check-phu-moc.mjs
  if [ "$NHANH" -eq 0 ]; then
    chay .touch    rang_tra_cuu     "$TOUCH" 'BITE TRA CUU'      node scripts/bite_tracuu.mjs
    chay .touch    rang_truong_hien "$TOUCH" 'BITE TRUONG HIEN'  node scripts/bite-truong-hien.mjs
    chay .touch    rang_phu_moc     "$TOUCH" 'BITE PHU MOC'      node scripts/bite-phu-moc.mjs
  fi
fi

# ── Ba bo rang: cong nao cung phai tu chung minh no con can ─────────────────
if [ "$NHANH" -eq 0 ]; then
  chay CNCLData    rang_ap_luat_deu   "$CNCL" 'BITE AP LUAT DEU'   python3 bite_ap_luat_deu.py
  chay CNCLData    rang_fail_closed   "$CNCL" 'BITE FAIL CLOSED'  python3 bite_fail_closed.py
  chay CaoLocMatch rang_match       "$CLM" 'MATCH BITES'         python3 match_bites.py
  chay CaoLocMatch rang_bang_chung  "$CLM" 'BITE KHOA'           python3 bite_bang_chung.py
  chay CaoLocMatch rang_dong_bo     "$CLM" 'BITE DONG BO'        python3 bite_dong_bo_snapshot.py
  chay CaoLocMatch rang_gop_cap     "$CLM" 'BITE GOP CAP'        python3 bite_gop_cap.py
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
