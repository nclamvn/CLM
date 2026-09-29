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

NHANH=0; IM=0; HOAN=""

# ── DANH SACH O DUOC PHEP HOAN, GO CUNG TRONG CHINH SCRIPT NAY ──────────────
#
# VI SAO CO (02/09/2026, khi dung CI cho kho gop): ba o duoi day KHONG CHAY DUOC trong mot moi
# truong CI sach, va khong phai vi chung hong. Chung can mot thu nam NGOAI git:
#
#   doi_chung_nguon   can .fidelity_fresh, la ban tai ve lai cua nguon that. Khong script nao
#                     sinh ra no; no den tu mot vong lam tuoi thu cong co mang.
#   dong_bo_cau       can BAN DOC o KnowledgeBase. CI khong co KnowledgeBase.
#   rang_chinh_bang   dung ban tam, ma ban tam can .fidelity_fresh nhu tren.
#
# Neu de nguyen thi CI luc nao cung do va khong ai doc no nua, tuc mot cong khong ai doc thi
# bang khong co cong. Nhung noi long kieu "cho phep bo qua o nao cung duoc" thi lai la mot
# CHE DO SUY BIEN: thieu dieu kien la he tu ha tieu chuan, va do la duong ro.
#
# BON RANG BUOC de cho noi long nay khong thanh duong ro:
#   1. Chi hoan duoc o NAM TRONG danh sach nay. Ten khac -> exit 3, khong chay gi ca.
#   2. Danh sach nay GO CUNG TRONG SCRIPT, khong nhan tu dong lenh, khong nhan tu bien moi
#      truong. Muon them mot o thi phai sua file nay va di qua review.
#   3. Hoan chi doi KHONG CHAY DUOC thanh HOAN. O DO van la DO va van lam ca luot that bai.
#   4. Moi lan chay deu IN RA muc HOAN kem ly do, ke ca khi mo thu deu xanh.
HOAN_DUOC_PHEP="doi_chung_nguon dong_bo_cau rang_chinh_bang"
ly_do_hoan() {
  case "$1" in
    doi_chung_nguon) echo "can .fidelity_fresh, ban tai lai cua nguon that, khong nam trong git" ;;
    dong_bo_cau)     echo "can ban doc o KnowledgeBase, moi truong nay khong co" ;;
    rang_chinh_bang) echo "dung ban tam, ma ban tam can .fidelity_fresh" ;;
    *)               echo "KHONG CO LY DO GHI SAN" ;;
  esac
}

for a in "$@"; do
  case "$a" in
    --nhanh) NHANH=1 ;;
    --im)    IM=1 ;;
    --hoan=*) HOAN="$HOAN ${a#--hoan=}" ;;
    -h|--help) sed -n '2,20p' "$0"; exit 0 ;;
    *) echo "Khong hieu tham so: $a"; exit 3 ;;
  esac
done

# Rang buoc 1 + 2: ten ngoai danh sach thi DUNG NGAY, truoc khi chay bat ky cong nao.
for h in $HOAN; do
  case " $HOAN_DUOC_PHEP " in
    *" $h "*) : ;;
    *)
      echo "KHONG CHAY DUOC: '$h' khong nam trong danh sach o duoc phep hoan."
      echo "Duoc phep: $HOAN_DUOC_PHEP"
      echo
      echo "Danh sach nay go cung trong chay_het_cong.sh chu khong nhan tu dong lenh, dung de"
      echo "mot moi truong thieu thon khong the tu ha tieu chuan cua ca chuoi cong."
      exit 3 ;;
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
  # Goc ung vien: thu muc cha cua chinh script nay truoc (bo cuc GOP: mot repo chua ca
  # ba kho), roi den hai goc cu (bo cuc ba kho tach roi). Giu ca hai de chay duoc o ca
  # hai bo cuc trong ky chuyen tiep.
  TU_THAN=$(cd "$(dirname "$0")/.." && pwd)
  for g in "$TU_THAN" /Users/os /sessions/*/mnt; do
    [ -d "$g/$1" ] && { echo "$g/$1"; return 0; }
  done
  return 1
}
CNCL=$(tim_kho CNCLData)    || { echo "KHONG THAY kho CNCLData o ca hai goc."; exit 3; }
CLM=$(tim_kho CaoLocMatch)  || { echo "KHONG THAY kho CaoLocMatch o ca hai goc."; exit 3; }

XANH=0; DO=0; TREO=0; DA_HOAN=0
DS_HOAN=""; THUA=""
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
  local duoc_hoan=0
  case " $HOAN " in *" $ten "*) duoc_hoan=1 ;; esac
  case "$rc" in
    0) trang_thai="XANH";        XANH=$((XANH+1))
       # Rang buoc 4b: hoan mot o van chay duoc la thua, va thua thi phai noi ra.
       [ "$duoc_hoan" -eq 1 ] && THUA="$THUA $ten" ;;
    # Rang buoc 3: CHI KHONG CHAY DUOC moi hoan duoc. O DO khong bao gio duoc hoan.
    3) if [ "$duoc_hoan" -eq 1 ]; then
         trang_thai="HOAN";      DA_HOAN=$((DA_HOAN+1)); DS_HOAN="$DS_HOAN $ten"
       else
         trang_thai="KHONG CHAY"; TREO=$((TREO+1))
       fi ;;
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
# Ngay dang cua nguon phai la NGAY NGUON DANG, khong phai ngay minh chup. Them 29/09/2026: cong
# tuoi doc ngay tu hau to ten ban chup, va 7 ban chup dat hau to bang ngay chup, lam 43 claim tre
# gia, co claim tre gia gan ba nam. Cong nay khong doi ngay dung, no chan ngay CHUP gia lam ngay DANG.
chay CNCLData ngay_dang           "$CNCL" 'OK:|FAIL|KHONG CHAY' python3 check_ngay_dang.py domains/don_vi_cncl
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

# Nhan 'normalized' khong duoc lam cua sau. Luat 3 cam value VUOT span nhung kiem bang phep
# chuoi con, va claim normalized duoc mien phep do. Ngay 02/09/2026 mot claim Viettel viet
# 'Bo TT&TT GIAO' trong khi nguon chi noi 'duoc phe duyet la don vi NGHIEN CUU, THU NGHIEM',
# nam duoi hai match da ky, khong cong nao bat duoc trong 17 ngay.
chay CNCLData chuan_hoa           "$CNCL" 'OK:|FAIL|CHUA KHAI'   python3 check_chuan_hoa.py domains/don_vi_cncl

# Dinh danh phap nhan. O nay hien do phu 0/44 va VAN XANH: de trong la hop le, cong chi cam ma
# so den tu nguon khong chinh thuc. Nhung no IN RA khoang trong moi lan chay, vi ngay
# 02/09/2026 viec nhan dien don vi bang ten goi tren bao da sai mot lan voi HTI.
chay CNCLData ma_so_thue          "$CNCL" 'OK:|FAIL|CHUA CO'      python3 check_ma_so_thue.py domains/don_vi_cncl
# TIP-02. Ho loi thu hai cung tinh chat voi 'doc cau truc bang regex': mot cong bat duoc
# ngoai le roi di tiep nhu khong co gi. Ca that: check-emdash.mjs tung bo qua thu muc khong
# doc duoc, tuc dem em-dash tren mot phan no chua nhin roi bao 0.
chay CNCLData fail_closed          "$CNCL" 'OK:|FAIL|CHUA KHAI' python3 check_fail_closed.py
# TIP-03. Bon lan trong hai ngay mot bo rang gay khong phai vi engine sai ma vi CANH cua no
# bien mat. Cong nay khong doc duoc y nghia khoi CANH, no bat buoc khoi do phai ton tai va
# loi khai phai khop voi ma.
chay CNCLData rang_khai_canh       "$CNCL" 'OK:|FAIL|CHUA KHAI|HONG CU PHAP' python3 check_rang_khai_canh.py
# Vong tu chay (29/09/2026). Tu hom nay mot agent theo lich de xuat claim ma khong co nguoi
# ngoi canh. O nay giu hai bat bien khi khong ai nhin: may CHUA ghi registry, va hang cho
# khong bi sua sau khi nap. Chua co luot nao thi KHONG CHAY DUOC, khong phai xanh.
chay CNCLData hang_cho             "$CNCL" 'OK:|FAIL|KHONG CHAY' python3 vong_tu_chay/check_hang_cho.py

# ── Kho dan xuat: dung domain, chay match, doi chieu so chu ky ──────────────
chay CaoLocMatch build_dan_xuat   "$CLM" 'OK:|FAIL:'             python3 build_cncl_match.py
chay CaoLocMatch refinery         "$CLM" 'VALIDATION|GATE'       python3 methodbox/refinery.py domains/cncl_match
chay CaoLocMatch match_run        "$CLM" 'digest_matches'        python3 match_engine.py run domains/cncl_match
chay CaoLocMatch restore_signoff  "$CLM" 'RESTORE|BANG CHUNG'    python3 match_engine.py restore-signoff domains/cncl_match out/matches.jsonl
chay CaoLocMatch validate_ky      "$CLM" 'VALIDATE|GATE'         python3 match_engine.py validate domains/cncl_match out/matches.jsonl --require-signoff

# Chay trong kho nao thi phai DOC du lieu cua kho do. Them 01/09/2026 sau khi gop kho thu tu:
# build_cncl_match.py van doc CNCLData CU du dang chay trong kho gop, va bang nay van bao 36
# xanh vi hai cay luc do giong het nhau. O nay do bang bay chi bao chu khong doc ma nguon.
# Trong bo cuc ba kho tach roi no tra 3 (khong co gi de do), do la dung.
chay CaoLocMatch doc_dung_kho     "$CLM" 'OK:|FAIL:|KHONG CHAY'  python3 check_doc_dung_kho.py

# Chieu CAU co mot BAN DOC o KnowledgeBase cho RtR Copilot. Kho nay la nguon; ban doc phai
# theo kho. O nay bao do khi hai ben lech. Moi truong khong co KnowledgeBase (CI) thi no tra
# 3 chu khong tra 0: vang ban doc la khong doi chieu duoc, khong phai la khop.
chay CaoLocMatch dong_bo_cau      "$CLM" 'OK:|FAIL:|KHONG CHAY'  python3 dong_bo_cau.py

# Bi mat trong file duoc git theo doi. Chay MOI LUOT chu khong chi truoc khi day: mot token
# lot vao commit hom nay ma thang sau moi day len thi van la token da nam trong lich su.
chay CaoLocMatch bi_mat           "$CLM" 'OK:|FAIL:|KHONG CHAY'  python3 check_bi_mat.py

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
  # Lop xuat du lieu dung chung cho cac man moi (29/09/2026): do thi, tim kiem, su kien. Doc
  # dau ra cua buoc tren nen phai chay SAU. Ngay sau no la cong so_sinh: moi so tren web phai
  # dem lai duoc tu du lieu, va khong so cong nao duoc go tay nhu "14 o xanh" tung nam o day.
  chay .touch      sinh_du_lieu_hub "$TOUCH" 'HUB:|FAIL'        node scripts/gen-hub-data.mjs
  chay .touch      bo_dau_viet      "$TOUCH" 'OK:|FAIL'         node scripts/viet.mjs --tu-kiem
  chay .touch      so_sinh          "$TOUCH" 'OK:|FAIL|KHONG CHAY' node scripts/check-so-sinh.mjs
  # Pha P1 (29/09/2026): lop phu nguon va Cmd+K. tim_kiem: moi tai lieu tim ra bang ten co
  # dau va ban ASCII doc lap. lop_phu_nguon: moi cau nguon to sang duoc NGUYEN VAN trong ban
  # chup ma trang web phuc vu (public/evidence), khong chi trong ban goc.
  chay .touch      tim_kiem         "$TOUCH" 'OK:|FAIL|KHONG CHAY' node scripts/check-tim-kiem.mjs
  chay .touch      lop_phu_nguon    "$TOUCH" 'OK:|FAIL|KHONG CHAY' node scripts/check-lop-phu-nguon.mjs
  # Cau lam bang phai nam trong VAN BAN CUA NGUON, khong phai trong nhan nguoi chup dat. Them
  # 29/09/2026: tach ghi chu khoi nguon cho lop phu lo ra 5 claim ma bang chung chi la nhan
  # "## Ten don vi" cua chinh minh. check_spans.py khong thay vi no chi hoi chuoi co trong file.
  chay .touch      ghi_chu_ban_chup "$TOUCH" 'OK:|FAIL|KHONG CHAY' node scripts/check-ghi-chu-ban-chup.mjs
  # Toa do man Do thi cung cau tinh luc build; cong tinh lai bang chinh ham giao dien (29/09/2026).
  chay .touch      do_thi           "$TOUCH" 'OK:|FAIL|KHONG CHAY' node scripts/check-do-thi.mjs
  # Ho so don vi M3 (29/09/2026): khop registry, khong diem tong hop, khong dinh danh bia, o trong
  # noi thang, tong cau qua han khop ngan sach cua check_do_tuoi.py.
  chay .touch      ho_so            "$TOUCH" 'OK:|FAIL|KHONG CHAY' node scripts/check-ho-so.mjs
  # Toan canh thi truong M1 (29/09/2026): Sankey bao toan dong, khoang trong dem doc lap (luot dung
  # man nay lo ra man do thi dem 10 thay vi 11), ngan sach dien tich giao cat.
  chay .touch      thi_truong       "$TOUCH" 'OK:|FAIL|KHONG CHAY' node scripts/check-thi-truong.mjs
  # Matching Workbench v2 M4 (29/09/2026): diem tu dung lai khop engine, canh chuoi dung mapping,
  # ly do tu choi nguyen van so ky, man khong co duong ky.
  chay .touch      matching         "$TOUCH" 'OK:|FAIL|KHONG CHAY' node scripts/check-matching.mjs
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
    chay .touch    rang_so_sinh     "$TOUCH" 'BITE SO SINH'      node scripts/bite-so-sinh.mjs
    chay .touch    rang_lop_phu     "$TOUCH" 'BITE LOP PHU'      node scripts/bite-lop-phu.mjs
    chay .touch    rang_ghi_chu     "$TOUCH" 'BITE GHI CHU'      node scripts/bite-ghi-chu.mjs
    chay .touch    rang_do_thi      "$TOUCH" 'BITE DO THI'       node scripts/bite-do-thi.mjs
    chay .touch    rang_ho_so       "$TOUCH" 'BITE HO SO'        node scripts/bite-ho-so.mjs
    chay .touch    rang_thi_truong  "$TOUCH" 'BITE THI TRUONG'   node scripts/bite-thi-truong.mjs
    chay .touch    rang_matching    "$TOUCH" 'BITE MATCHING'     node scripts/bite-matching.mjs
  fi
fi

# ── Ba bo rang: cong nao cung phai tu chung minh no con can ─────────────────
if [ "$NHANH" -eq 0 ]; then
  chay CNCLData    rang_ap_luat_deu   "$CNCL" 'BITE AP LUAT DEU'   python3 bite_ap_luat_deu.py
  chay CNCLData    rang_fail_closed   "$CNCL" 'BITE FAIL CLOSED'  python3 bite_fail_closed.py
  chay CNCLData    rang_chuan_hoa     "$CNCL" 'BITE CHUAN HOA'   python3 bite_chuan_hoa.py
  chay CNCLData    rang_ma_so_thue    "$CNCL" 'BITE MA SO THUE'  python3 bite_ma_so_thue.py
  chay CNCLData    rang_ngay_dang     "$CNCL" 'BITE NGAY DANG'   python3 bite_ngay_dang.py
  chay CNCLData    rang_hang_cho      "$CNCL" 'BITE HANG CHO'    python3 vong_tu_chay/bite_hang_cho.py
  chay CaoLocMatch rang_match       "$CLM" 'MATCH BITES'         python3 match_bites.py
  chay CaoLocMatch rang_bang_chung  "$CLM" 'BITE KHOA'           python3 bite_bang_chung.py
  chay CaoLocMatch rang_dong_bo     "$CLM" 'BITE DONG BO'        python3 bite_dong_bo_snapshot.py
  chay CaoLocMatch rang_gop_cap     "$CLM" 'BITE GOP CAP'        python3 bite_gop_cap.py
  chay CaoLocMatch rang_doc_dung_kho "$CLM" 'BITE DOC DUNG KHO'  python3 bite_doc_dung_kho.py
  chay CaoLocMatch rang_dong_bo_cau  "$CLM" 'BITE DONG BO CAU'   python3 bite_dong_bo_cau.py
  # Rang cua chinh co --hoan o dau file nay. Dung o gia nen chay trong mot phan giay.
  chay CaoLocMatch rang_hoan        "$CLM" 'BITE HOAN'           python3 bite_hoan.py
  chay CaoLocMatch rang_bi_mat      "$CLM" 'BITE BI MAT'         python3 bite_bi_mat.py
  # Rang cua CHINH cai bang nay. Khong de quy vo han: no goi lai script voi --nhanh,
  # ma --nhanh bo qua toan bo khoi rang, nen chi sau dung mot tang.
  chay CaoLocMatch rang_chinh_bang  "$CLM" 'BITE CHAY HET'       python3 bite_chay_het_cong.py
fi

# ── Bang ────────────────────────────────────────────────────────────────────
TONG=$((XANH+DO+TREO+DA_HOAN))

# Ghi KET QUA cua chinh lan chay nay ra file, de noi khac DOC chu khong GO TAY. Them 29/09/2026
# sau khi tim thay trang web ghi cung "chay_het_cong.sh · 14 o xanh" trong khi chuoi da 49 o.
# File nam trong out/ (git bo qua): moi moi truong chi thay ket qua cua chinh no. CI clone
# sach thi khong co file, va trang web phai noi "chua co ket qua" chu khong duoc bia.
mkdir -p "$CLM/out"
{
  printf '{"luc": "%s", "che_do": "%s", "tong": %d, "xanh": %d, "do": %d, "khong_chay": %d, "hoan": %d, "ds_hoan": "%s"}\n' \
    "$(date '+%Y-%m-%dT%H:%M:%S%z')" "$([ "$NHANH" -eq 1 ] && echo nhanh || echo day_du)" \
    "$TONG" "$XANH" "$DO" "$TREO" "$DA_HOAN" "$(echo $DS_HOAN)"
} > "$CLM/out/ket_qua_chuoi.json.tmp" && mv "$CLM/out/ket_qua_chuoi.json.tmp" "$CLM/out/ket_qua_chuoi.json"
echo
echo "CAOLOCMATCH · CHUOI CONG · $(date '+%d/%m/%Y %H:%M')"
[ "$NHANH" -eq 1 ] && echo "che do --nhanh: DA BO QUA ba bo rang, ket qua nay YEU hon ban day du"
echo
printf '%-12s %-26s %-11s %s\n' "KHO" "CONG" "KET QUA" "GHI CHU"
printf '%s\n' "------------------------------------------------------------------------------"
printf '%s' "$DONG"
printf '%s\n' "------------------------------------------------------------------------------"
printf 'tong %d · xanh %d · do %d · khong chay duoc %d · hoan %d\n' \
  "$TONG" "$XANH" "$DO" "$TREO" "$DA_HOAN"

# Rang buoc 4: muc HOAN in ra MOI LAN, ke ca khi moi thu deu xanh. Mot khoang trong duoc
# thoa thuan van la mot khoang trong; giau no di la bien thoa thuan thanh quen lang.
if [ "$DA_HOAN" -gt 0 ]; then
  echo
  echo "O DUOC HOAN TRONG LUOT NAY ($DA_HOAN), khong duoc doc bang nay nhu la da phu het:"
  for h in $DS_HOAN; do
    printf '  %-20s %s\n' "$h" "$(ly_do_hoan "$h")"
  done
  echo "  Muon dong khoang trong nay thi phai mang duoc thu con thieu vao moi truong,"
  echo "  khong phai bang cach them ten vao danh sach hoan."
fi
if [ -n "$THUA" ]; then
  echo
  echo "HOAN THUA:$THUA"
  echo "  Cac o nay da chay duoc trong moi truong hien tai. Bo --hoan cua chung di."
fi
echo

if [ "$DO" -eq 0 ] && [ "$TREO" -eq 0 ]; then
  if [ "$DA_HOAN" -gt 0 ]; then
    echo "XANH TRU $DA_HOAN O DUOC HOAN. Day KHONG phai 'tat ca xanh'."
  else
    echo "TAT CA XANH."
  fi
  exit 0
fi

[ "$IM" -eq 0 ] && printf '%s\n' "$CHI_TIET"
if [ "$TREO" -gt 0 ]; then
  echo "CO CONG KHONG CHAY DUOC. Vang tin khong phai tin tot, o do KHONG duoc tinh la xanh."
fi
[ "$DO" -gt 0 ] && echo "CO CONG DO. Khong duoc trinh ket qua ra ngoai truoc khi xu ly."
exit 1
